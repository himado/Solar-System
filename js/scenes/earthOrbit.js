// Trái Đất cùng vệ tinh nhân tạo và rác vũ trụ. Tỉ lệ thật: 1 đơn vị = 1.000 km.
import * as THREE from 'three';
import { FEATURED } from '../data/orbits.js';
import { t } from '../i18n.js';
import {
  makeStarfield, makeLabel, makeAtmosphere, earthMaterial, circleLine, disposeTree, glowTexture, gmst,
} from '../core/engine.js';
import { sunDirection } from '../sim/ephemeris.js';
import { generatePopulation, keplerPosition, TYPES, TYPE_COLORS, R_EARTH_KM, MU, EARTH_ROT } from '../sim/population.js';

const S = 1 / 1000;               // km → đơn vị cảnh
export const EARTH_R = R_EARTH_KM * S;
const deg = Math.PI / 180;

const SHELLS = [
  { km: 2000, color: '#4fd1ff', label: { vi: 'Giới hạn LEO · 2.000 km', en: 'LEO limit · 2,000 km' } },
  { km: 20200, color: '#ffcf5c', label: { vi: 'GPS · 20.200 km', en: 'GPS · 20,200 km' } },
  { km: 35786, color: '#ff7ab6', label: { vi: 'GEO · 35.786 km', en: 'GEO · 35,786 km' } },
];

export class EarthOrbitScene {
  constructor(engine, ms, { onSelect }) {
    this.engine = engine;
    this.onSelect = onSelect;
    this.root = new THREE.Scene();
    this.pickables = [];
    this.labels = [];
    this.t0 = ms;

    this.root.add(makeStarfield(engine));
    this.root.add(new THREE.AmbientLight(0xffffff, 0.15));
    this.sunDir = sunDirection(ms, new THREE.Vector3());
    this.sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.root.add(this.sunLight);

    this.buildEarth();
    this.buildShells();

    const { objs, counts } = generatePopulation(gmst(ms));
    this.counts = counts;
    this.objs = objs;
    this.buildPoints(objs);
    this.buildFeatured(ms);
    this.vis = Object.fromEntries(TYPES.map(k => [k, true]));
    this.focusTypes = null;
    this.applyVisibility();
  }

  buildEarth() {
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 128, 64), earthMaterial(this.engine, this.sunDir));
    this.earth.userData.id = 'earth';
    this.root.add(this.earth);
    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_R * 1.006, 96, 48),
      new THREE.MeshStandardMaterial({ alphaMap: this.engine.texture('2k_earth_clouds.jpg', { color: false }), transparent: true, depthWrite: false, opacity: 0.85, roughness: 1 }),
    );
    this.root.add(this.clouds);
    this.root.add(makeAtmosphere(EARTH_R, 0x4da6ff, this.sunDir));
  }

  buildShells() {
    this.shellGroup = new THREE.Group();
    for (const s of SHELLS) {
      const r = (R_EARTH_KM + s.km) * S;
      this.shellGroup.add(circleLine(r, new THREE.Color(s.color), 0.35, 360));
      const label = makeLabel(t(s.label), { className: 'label-shell' });
      label.position.set(r * Math.cos(-0.6), 0, r * Math.sin(-0.6));
      label.center.set(0, 0.5);
      label.userData.body = { name: s.label };
      this.shellGroup.add(label);
      this.labels.push(label);
    }
    this.root.add(this.shellGroup);
  }

  buildPoints(objs) {
    const n = objs.length;
    const el1 = new Float32Array(n * 4), el2 = new Float32Array(n * 4);
    objs.forEach((o, k) => {
      el1.set([o[0] * S, o[1], o[2], o[3]], k * 4);
      el2.set([o[4], o[5], o[6], o[7]], k * 4);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute('aEl1', new THREE.BufferAttribute(el1, 4));
    geo.setAttribute('aEl2', new THREE.BufferAttribute(el2, 4));

    this.uniforms = {
      uTime: { value: 0 },
      uVis: { value: new Array(TYPES.length).fill(1) },
      uColors: { value: TYPES.map(k => new THREE.Color(TYPE_COLORS[k])) },
      uScale: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        attribute vec4 aEl1; attribute vec4 aEl2;
        uniform float uTime; uniform float uVis[${TYPES.length}]; uniform vec3 uColors[${TYPES.length}]; uniform float uScale;
        varying vec3 vColor; varying float vAlpha; varying float vFade;
        #include <common>
        #include <logdepthbuf_pars_vertex>
        void main() {
          float a = aEl1.x, e = aEl1.y, inc = aEl1.z, raan = aEl1.w;
          float argp = aEl2.x, n = aEl2.z; int type = int(aEl2.w + 0.5);
          float M = mod(aEl2.y + n * uTime, 6.28318530718);
          float E = M;
          for (int k = 0; k < 5; k++) E -= (E - e * sin(E) - M) / (1.0 - e * cos(E));
          float xp = a * (cos(E) - e), yp = a * sqrt(1.0 - e * e) * sin(E);
          float cO = cos(raan), sO = sin(raan), cw = cos(argp), sw = sin(argp), ci = cos(inc), si = sin(inc);
          vec3 p = vec3(
            (cO * cw - sO * sw * ci) * xp + (-cO * sw - sO * cw * ci) * yp,
            sw * si * xp + cw * si * yp,
            -((sO * cw + cO * sw * ci) * xp + (-sO * sw + cO * cw * ci) * yp));
          vAlpha = uVis[type];
          vColor = uColors[type];
          vFade = type == ${TYPES.indexOf('debris')} ? 0.45 : 0.9;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          // quỹ đạo cao ở xa camera nên cần chấm to hơn để còn nhìn thấy
          bool high = type == ${TYPES.indexOf('meo')} || type == ${TYPES.indexOf('geo')} || type == ${TYPES.indexOf('heo')};
          float base = type == ${TYPES.indexOf('debris')} ? 0.05 : (high ? 0.16 : 0.07);
          gl_PointSize = clamp(base * uScale / -mv.z, high ? 2.4 : 1.2, high ? 9.0 : 7.0);
          if (vAlpha < 0.01) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */`
        varying vec3 vColor; varying float vAlpha; varying float vFade;
        #include <logdepthbuf_pars_fragment>
        void main() {
          #include <logdepthbuf_fragment>
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.15, d) * vFade);
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.root.add(this.points);
  }

  buildFeatured(ms) {
    this.featured = new Map();
    const g0 = gmst(ms);
    for (const f of FEATURED) {
      let el;
      if (f.lonDeg !== undefined) {
        el = { a: R_EARTH_KM + f.altKm, e: 0, i: f.incDeg * deg, raan: 0, argp: 0, M0: g0 + f.lonDeg * deg, n: EARTH_ROT };
      } else {
        const rp = R_EARTH_KM + (f.perigeeKm ?? f.altKm), ra = R_EARTH_KM + (f.apogeeKm ?? f.altKm);
        const a = (rp + ra) / 2;
        el = { a, e: (ra - rp) / (ra + rp), i: f.incDeg * deg, raan: f.raanDeg * deg, argp: (f.argpDeg ?? 0) * deg, M0: f.phaseDeg * deg, n: Math.sqrt(MU / a ** 3) };
      }
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(), color: f.color, sizeAttenuation: false, depthTest: true, transparent: true, depthWrite: false,
      }));
      sprite.scale.setScalar(0.035);
      sprite.userData.id = f.id;
      const label = makeLabel(shortName(f), { className: 'label-sat', onClick: () => this.onSelect(f.id) });
      label.userData.body = { name: f.name };
      label.userData.short = true;
      label.userData.feature = f;
      if (f.labelBelow) label.center.set(0.5, -0.5);
      sprite.add(label);
      this.labels.push(label);
      this.root.add(sprite);
      this.pickables.push(sprite);

      const pts = [], tmp = new THREE.Vector3(), period = (2 * Math.PI) / el.n;
      for (let k = 0; k <= 256; k++) pts.push(keplerPosition({ ...el, a: el.a * S, n: el.n, M0: 0 }, (k / 256) * period, tmp).clone());
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: f.color, transparent: true, opacity: 0.9 }));
      line.visible = false;
      this.root.add(line);
      this.featured.set(f.id, { f, el: { ...el, a: el.a * S }, sprite, line });
    }
  }

  setVisible(type, on) {
    this.vis[type] = on;
    this.applyVisibility();
  }

  setFocusTypes(types) {
    this.focusTypes = types;
    this.applyVisibility();
  }

  applyVisibility() {
    this.uniforms.uVis.value = TYPES.map(k => {
      if (!this.vis[k]) return 0;
      if (this.focusTypes && !this.focusTypes.includes(k)) return 0.12;
      return 1;
    });
  }

  setShellsVisible(on) {
    this.shellGroup.visible = on;
    // CSS2DRenderer không xét trạng thái ẩn của nhóm cha nên phải ẩn từng nhãn
    this.shellGroup.children.forEach(o => { if (o.isCSS2DObject) o.visible = on; });
  }

  select(id) {
    for (const [fid, s] of this.featured) {
      s.line.visible = fid === id;
      s.sprite.scale.setScalar(fid === id ? 0.05 : 0.035);
      s.sprite.children[0].element.classList.toggle('active', fid === id);
    }
  }

  positionOf(id) {
    if (id === 'earth') return new THREE.Vector3();
    return this.featured.get(id).sprite.position.clone();
  }

  onPick(id) { if (id !== 'earth') this.onSelect(id); }

  refreshLabels() {
    for (const l of this.labels) l.element.textContent = l.userData.short ? shortName(l.userData.feature) : t(l.userData.body.name);
  }

  update(ms) {
    const tSec = (ms - this.t0) / 1000;
    this.uniforms.uTime.value = tSec;
    this.uniforms.uScale.value = this.engine.renderer.getPixelRatio() * this.engine.renderer.domElement.clientHeight;
    const g = gmst(ms);
    this.earth.rotation.y = g;
    this.clouds.rotation.y = g * 1.0003;
    sunDirection(ms, this.sunDir);
    this.sunLight.position.copy(this.sunDir).multiplyScalar(100);
    for (const s of this.featured.values()) keplerPosition(s.el, tSec, s.sprite.position);
  }

  dispose() { disposeTree(this.root); }
}

function shortName(f) {
  if (f.short) return f.short;
  const n = t(f.name);
  const m = n.match(/\(([^)]+)\)$/);
  return m && m[1].length <= 10 ? m[1] : n.replace(/\s*\(.*\)$/, '');
}
