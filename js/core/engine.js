// Renderer, camera, điều khiển và các tiện ích 3D dùng chung cho mọi cảnh.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const TEX_PATH = 'assets/textures/';

export class Engine {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.className = 'label-layer';
    container.appendChild(this.labelRenderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.6;

    this.loader = new THREE.TextureLoader();
    this.texCache = new Map();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.scene = null;     // cảnh đang hiển thị (đối tượng có .root, .update, .dispose)
    this.follow = null;    // hàm trả về Vector3 mà camera bám theo
    this.viewShift = 0.2;  // tỉ lệ đẩy khung hình lên trên màn hình dọc (nhường chỗ bảng dưới)
    this.fly = null;       // trạng thái hiệu ứng bay camera

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setupPicking();
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
    this.camera.aspect = w / h;
    // màn hình dọc: bảng thông tin chiếm nửa dưới, nên đẩy tâm khung hình lên trên
    if (w < h && this.viewShift) this.camera.setViewOffset(w, h, 0, h * this.viewShift, w, h);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  texture(name, { color = true } = {}) {
    if (this.texCache.has(name)) return this.texCache.get(name);
    const tex = this.loader.load(TEX_PATH + name);
    if (color) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    this.texCache.set(name, tex);
    return tex;
  }

  setScene(scene) {
    if (this.scene) this.scene.dispose();
    this.scene = scene;
    this.follow = null;
    this.fly = null;
  }

  /** Bay camera tới đối tượng; getTarget() được gọi mỗi khung hình để bám theo vật chuyển động. */
  flyTo(getTarget, distance, { duration = 1.2, follow = true, direction = null } = {}) {
    const startTarget = this.controls.target.clone();
    const startOffset = this.camera.position.clone().sub(startTarget);
    const dir = direction ? direction.clone().normalize() : startOffset.clone().normalize();
    this.fly = { t: 0, duration, getTarget, startTarget, startOffset, endOffset: dir.multiplyScalar(distance) };
    this.follow = follow ? getTarget : null;
  }

  stepCamera(dt) {
    const c = this.controls;
    if (this.fly) {
      const f = this.fly;
      f.t = Math.min(1, f.t + dt / f.duration);
      const e = f.t < 0.5 ? 4 * f.t ** 3 : 1 - (-2 * f.t + 2) ** 3 / 2;
      const target = f.startTarget.clone().lerp(f.getTarget(), e);
      const offset = f.startOffset.clone().lerp(f.endOffset, e);
      c.target.copy(target);
      this.camera.position.copy(target).add(offset);
      if (f.t >= 1) this.fly = null;
    } else if (this.follow) {
      const next = this.follow();
      const delta = next.clone().sub(c.target);
      c.target.add(delta);
      this.camera.position.add(delta);
    }
    c.update();
  }

  setupPicking() {
    const el = this.renderer.domElement;
    let down = null;
    el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
    el.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
      const hit = this.pick(e);
      if (hit && this.scene?.onPick) this.scene.onPick(hit, this.lastHit);
    });
    el.addEventListener('pointermove', e => {
      if (e.buttons) return;
      el.style.cursor = this.pick(e) ? 'pointer' : '';
    });
  }

  pick(e) {
    if (!this.scene?.pickables?.length) return null;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.pickables, false);
    this.lastHit = hits[0] ?? null;
    return hits.length ? hits[0].object.userData.id : null;
  }

  render(dt) {
    this.stepCamera(dt);
    this.renderer.render(this.scene.root, this.camera);
    this.labelRenderer.render(this.scene.root, this.camera);
  }
}

// ───────── Các khối dựng hình dùng chung

export function makeStarfield(engine, radius = 20000) {
  const tex = engine.texture('2k_stars_milky_way.jpg');
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, color: 0x8899aa });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), mat);
  mesh.renderOrder = -10;
  return mesh;
}

export function makeLabel(text, { className = '', onClick } = {}) {
  const div = document.createElement('div');
  div.className = 'label ' + className;
  div.textContent = text;
  if (onClick) {
    div.classList.add('clickable');
    div.addEventListener('pointerdown', e => e.stopPropagation());
    div.addEventListener('click', e => { e.stopPropagation(); onClick(); });
  }
  const obj = new CSS2DObject(div);
  obj.center.set(0.5, 1.4);
  return obj;
}

let glowTex = null;
export function glowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.2, 'rgba(255,255,255,0.6)');
  grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
}

export function makeSun(engine, radius) {
  const group = new THREE.Group();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 32),
    new THREE.MeshBasicMaterial({ map: engine.texture('2k_sun.jpg'), color: 0xffffff }),
  );
  group.add(sun);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), color: 0xffaa44, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.setScalar(radius * 6);
  group.add(glow);
  return { group, mesh: sun };
}

/** Vật liệu Trái Đất: ngày/đêm theo hướng Mặt Trời, đèn thành phố bên phía tối.
 *  Tuỳ chọn bóng Mặt Trăng (nhật thực): nón tối/nửa tối thu hẹp dần theo khoảng cách. */
export function earthMaterial(engine, sunDir, shadow = null) {
  return new THREE.ShaderMaterial({
    uniforms: {
      dayMap: { value: engine.texture('2k_earth_daymap.jpg') },
      nightMap: { value: engine.texture('2k_earth_nightmap.jpg') },
      sunDir: { value: sunDir },
      moonPos: { value: shadow?.moonPos ?? new THREE.Vector3(1e6, 0, 0) },
      moonR: { value: shadow?.moonR ?? 0 },
      umbraLen: { value: shadow?.umbraLen ?? 1 },
      shadowStrength: { value: 0 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main() {
        vUv = uv;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vPosW = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D dayMap; uniform sampler2D nightMap; uniform vec3 sunDir;
      uniform vec3 moonPos; uniform float moonR; uniform float umbraLen; uniform float shadowStrength;
      varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;
      #include <logdepthbuf_pars_fragment>
      void main() {
        #include <logdepthbuf_fragment>
        float d = dot(normalize(vNormalW), normalize(sunDir));
        float k = smoothstep(-0.15, 0.2, d);
        vec3 day = texture2D(dayMap, vUv).rgb * (0.25 + 0.95 * max(d, 0.0));
        if (shadowStrength > 0.0) {
          vec3 s = normalize(sunDir);
          vec3 w = moonPos - vPosW;
          float tt = dot(w, s);
          if (tt > 0.0) {
            float dist = length(w - tt * s);
            float ru = moonR * (1.0 - tt / umbraLen);
            float rp = moonR * (1.0 + tt / umbraLen);
            float dark = 1.0 - smoothstep(max(ru, 0.0), rp, dist);
            float core = 1.0 - smoothstep(0.0, max(ru, 0.02) + 0.03, dist);
            day *= 1.0 - shadowStrength * (0.75 * dark + 0.25 * core);
          }
        }
        vec3 night = texture2D(nightMap, vUv).rgb * 1.4;
        gl_FragColor = vec4(mix(night, day, k), 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

export function makeAtmosphere(radius, color = 0x4da6ff, sunDir = null) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.025, 64, 32),
    new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(color) }, sunDir: { value: sunDir ?? new THREE.Vector3() }, lit: { value: sunDir ? 1 : 0 } },
      vertexShader: /* glsl */`
        varying vec3 vN; varying vec3 vV; varying vec3 vNW;
        #include <common>
        #include <logdepthbuf_pars_vertex>
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vNW = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * mv;
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 glowColor; uniform vec3 sunDir; uniform float lit; varying vec3 vN; varying vec3 vV; varying vec3 vNW;
        #include <logdepthbuf_pars_fragment>
        void main() {
          #include <logdepthbuf_fragment>
          float f = pow(1.0 - abs(dot(vN, vV)), 3.0);
          // phía ban đêm gần như không có quầng sáng
          float day = lit > 0.5 ? smoothstep(-0.35, 0.3, dot(vNW, normalize(sunDir))) : 1.0;
          gl_FragColor = vec4(glowColor, f * 0.9 * (0.08 + 0.92 * day));
        }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide,
    }),
  );
}

/** Vành đai Sao Thổ với UV theo bán kính để khớp texture dạng dải. */
export function makeRings(engine, inner, outer) {
  const geo = new THREE.RingGeometry(inner, outer, 128, 1);
  const pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
  }
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: engine.texture('2k_saturn_ring_alpha.png'), transparent: true, side: THREE.DoubleSide,
    depthWrite: false, roughness: 1, metalness: 0,
  }));
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function circleLine(radius, color, opacity = 0.35, segments = 256) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

export function disposeTree(root) {
  root.traverse(o => {
    o.geometry?.dispose();
    if (o.material) [].concat(o.material).forEach(m => m.dispose());
    if (o.isCSS2DObject) o.element.remove();
  });
}

// ───────── Thời gian thiên văn

export const J2000 = Date.UTC(2000, 0, 1, 12);
export const daysSinceJ2000 = ms => (ms - J2000) / 86400000;
/** Giờ sao trung bình Greenwich (rad). */
export function gmst(ms) {
  const d = daysSinceJ2000(ms);
  const deg = 280.46061837 + 360.98564736629 * d;
  return THREE.MathUtils.degToRad(((deg % 360) + 360) % 360);
}
