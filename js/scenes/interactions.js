// Tương tác Mặt Trời – Trái Đất – Mặt Trăng: ánh sáng, gió Mặt Trời, thủy triều, pha trăng, thực.
// Khung toạ độ xích đạo (y = cực Bắc) như cảnh quỹ đạo; khoảng cách được nén, không theo tỉ lệ.
import * as THREE from 'three';
import { t } from '../i18n.js';
import {
  makeStarfield, makeLabel, makeSun, makeAtmosphere, earthMaterial, disposeTree, gmst, glowTexture,
} from '../core/engine.js';
import { sunDirection, moonEcliptic, eclToScene, sunDeclination, moonPhase, OBLIQUITY } from '../sim/ephemeris.js';

const ER = 3;              // bán kính Trái Đất
const MOON_D = 28;         // khoảng cách Trái Đất–Mặt Trăng (thật: 60 lần bán kính)
const MOON_R = ER * 0.273;
const SUN_D = 150, SUN_R = 9;
const EARTH_UMBRA = MOON_D * 3.6;   // bóng tối Trái Đất dài ~3,6 lần khoảng cách tới Mặt Trăng
const MOON_UMBRA = MOON_D * 0.97;   // bóng tối Mặt Trăng vừa chạm tới Trái Đất
const INCL_MAG = 6;                 // phóng đại độ nghiêng quỹ đạo Mặt Trăng khi xem thực
const Y = new THREE.Vector3(0, 1, 0);

export class InteractionsScene {
  constructor(engine, ms) {
    this.engine = engine;
    this.root = new THREE.Scene();
    this.pickables = [];
    this.labels = [];
    this.topic = null;
    this.mag = 1;
    this.magTarget = 1;
    this.clock = 0;

    this.sunDir = sunDirection(ms, new THREE.Vector3());
    this.root.add(makeStarfield(engine));
    this.root.add(new THREE.AmbientLight(0xffffff, 0.05));
    this.light = new THREE.DirectionalLight(0xffffff, 2.6);
    this.root.add(this.light);

    // Mặt Trời
    const sun = makeSun(engine, SUN_R);
    this.sun = sun.group;
    this.root.add(this.sun);
    this.addLabel(this.sun, { vi: 'Mặt Trời', en: 'Sun' }, SUN_R);

    // Trái Đất
    this.moonPos = new THREE.Vector3();
    this.earthMat = earthMaterial(engine, this.sunDir, { moonPos: this.moonPos, moonR: MOON_R, umbraLen: MOON_UMBRA });
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(ER, 96, 48), this.earthMat);
    this.root.add(this.earth);
    this.clouds = new THREE.Mesh(
      new THREE.SphereGeometry(ER * 1.008, 64, 32),
      new THREE.MeshStandardMaterial({ alphaMap: engine.texture('2k_earth_clouds.jpg', { color: false }), transparent: true, depthWrite: false, opacity: 0.8, roughness: 1 }),
    );
    this.root.add(this.clouds);
    this.root.add(makeAtmosphere(ER, 0x4da6ff, this.sunDir));
    this.addLabel(this.earth, { vi: 'Trái Đất', en: 'Earth' }, ER);
    const axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -ER * 1.5, 0), new THREE.Vector3(0, ER * 1.5, 0)]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    this.root.add(axis);

    // Mặt Trăng
    this.moonMat = new THREE.MeshStandardMaterial({ map: engine.texture('2k_moon.jpg'), roughness: 1, metalness: 0 });
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(MOON_R, 64, 32), this.moonMat);
    this.root.add(this.moon);
    this.addLabel(this.moon, { vi: 'Mặt Trăng', en: 'Moon' }, MOON_R);

    // Mặt phẳng hoàng đạo (quỹ đạo Trái Đất) và quỹ đạo Mặt Trăng
    this.ecliptic = ring(MOON_D, 0xffcf5c, 0.25);
    this.ecliptic.rotation.x = OBLIQUITY;
    this.root.add(this.ecliptic);
    this.moonOrbit = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xcfd6e6, transparent: true, opacity: 0.45 }));
    this.root.add(this.moonOrbit);
    this.orbitAge = Infinity;

    this.buildLight();
    this.buildWind();
    this.buildTides();
    this.buildPhases();
    this.buildEclipses();
    this.update(ms, 0);
  }

  addLabel(parent, name, h) {
    const label = makeLabel(t(name));
    label.position.set(0, h * 1.3, 0);
    label.userData.body = { name };
    parent.add(label);
    this.labels.push(label);
  }

  // ───────── Ánh sáng: photon bay từ Mặt Trời tới mặt ban ngày
  buildLight() {
    this.lightGroup = new THREE.Group();
    const n = 500;
    this.photons = Array.from({ length: n }, () => {
      const a = Math.random() * Math.PI * 2, rho = Math.sqrt(Math.random()) * ER * 0.98;
      return { a, rho, s: Math.random(), v: 0.25 + Math.random() * 0.15 };
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    this.photonPoints = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffe58a, size: 1.6, map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.photonPoints.frustumCulled = false;
    this.lightGroup.add(this.photonPoints);
    this.root.add(this.lightGroup);
  }

  // ───────── Gió Mặt Trời: khung riêng có +x hướng về Mặt Trời (theo phương ngang)
  buildWind() {
    this.windGroup = new THREE.Group();
    this.windFrame = new THREE.Group();
    this.windGroup.add(this.windFrame);
    const X0 = 9, K = 18;
    this.mp = { X0, K };

    const shell = (x0, k, color, opacity) => {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const r = (i / 40) * 17; pts.push(new THREE.Vector2(r, x0 - (r * r) / k)); }
      const geo = new THREE.LatheGeometry(pts, 64);
      geo.rotateZ(-Math.PI / 2);
      return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
    };
    this.windFrame.add(shell(X0, K, 0xa070ff, 0.09));
    this.windFrame.add(shell(13, 30, 0xff9a5c, 0.025));

    // Đường sức từ trong mặt phẳng trưa–nửa đêm: nén phía ngày, kéo dài phía đêm
    const lineMat = new THREE.LineBasicMaterial({ color: 0xc9a8ff, transparent: true, opacity: 0.55 });
    for (const Lsh of [1.5, 2, 2.7, 3.5]) {
      for (const side of [1, -1]) {
        const pts = [];
        const lam0 = Math.acos(Math.sqrt(1 / Lsh));
        for (let i = 0; i <= 60; i++) {
          const lam = -lam0 + (2 * lam0 * i) / 60;
          const r = Lsh * ER * Math.cos(lam) ** 2;
          let x = r * Math.cos(lam) * side;
          x *= side > 0 ? 1 - 0.06 * Lsh : 1 + 0.35 * (Lsh - 1);
          pts.push(new THREE.Vector3(x, r * Math.sin(lam), 0));
        }
        this.windFrame.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
      }
    }
    for (const sy of [1, -1]) for (const k of [0, 1, 2]) {   // đường sức mở kéo thành "đuôi"
      const pts = [];
      const lat = (70 + k * 6) * Math.PI / 180;
      for (let i = 0; i <= 40; i++) {
        const u = i / 40;
        const x = -ER * Math.cos(lat) - u * 50;
        const y = sy * (ER * Math.sin(lat) + (1.2 + k * 1.1) * Math.sqrt(u) * 3);
        pts.push(new THREE.Vector3(x, y, 0));
      }
      this.windFrame.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }

    // Hạt gió Mặt Trời
    const n = 1400;
    this.windParticles = Array.from({ length: n }, () => this.spawnWind({}, true));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    this.windPoints = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffa25c, size: 0.8, map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.windPoints.frustumCulled = false;
    this.windFrame.add(this.windPoints);

    // Vành đai Van Allen và cực quang (quanh trục từ, gần trùng trục quay)
    const belt = (r, tube, color) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 24, 96), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.09, depthWrite: false }));
      m.rotation.x = Math.PI / 2;
      m.scale.z = 0.7;
      return m;
    };
    this.windGroup.add(belt(ER * 1.6, ER * 0.25, 0xff6b8a), belt(ER * 2.6, ER * 0.5, 0x8a7dff));
    this.auroras = [1, -1].map(s => {
      const lat = 67 * Math.PI / 180;
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(ER * 1.03 * Math.cos(lat), 0.09, 12, 96),
        new THREE.MeshBasicMaterial({ color: 0x5dff9a, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      m.rotation.x = Math.PI / 2;
      m.position.y = s * ER * 1.03 * Math.sin(lat);
      this.windGroup.add(m);
      return m;
    });
    this.root.add(this.windGroup);
  }

  spawnWind(p, initial = false) {
    const a = Math.random() * Math.PI * 2, rho = Math.sqrt(Math.random()) * 16;
    p.x = initial ? -45 + Math.random() * 100 : 55;
    p.y = Math.cos(a) * rho;
    p.z = Math.sin(a) * rho;
    p.v = 10 + Math.random() * 6;
    return p;
  }

  // ───────── Thủy triều: lớp nước phồng (phóng đại) và mũi tên lực
  buildTides() {
    this.tidesGroup = new THREE.Group();
    const geo = new THREE.SphereGeometry(ER * 1.02, 72, 36);
    this.oceanBase = geo.attributes.position.array.slice();
    this.ocean = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
      color: 0x3aa0ff, emissive: 0x0b3d75, transparent: true, opacity: 0.5, shininess: 60, depthWrite: false,
    }));
    this.tidesGroup.add(this.ocean);
    // mặt cắt lớp nước trong mặt phẳng chứa Mặt Trăng: thấy rõ hình elip với hai chỗ phồng
    this.tideOutline = new THREE.LineLoop(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(180 * 3), 3)),
      new THREE.LineBasicMaterial({ color: 0x7fd4ff }),
    );
    this.tideOutline.frustumCulled = false;
    this.tidesGroup.add(this.tideOutline);
    const mk = color => new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1.6, color, 0.5, 0.35);
    this.tideArrows = { m1: mk(0xffffff), m2: mk(0xffffff), s1: mk(0xffcf5c), s2: mk(0xffcf5c) };
    Object.values(this.tideArrows).forEach(a => this.tidesGroup.add(a));
    this.tidesGroup.add(this.earthMoonLine = dashed(0xffffff));
    this.root.add(this.tidesGroup);
  }

  // ───────── Pha: đường nối Trái Đất – Mặt Trăng và hướng Mặt Trời
  buildPhases() {
    this.phasesGroup = new THREE.Group();
    this.phasesGroup.add(this.phaseMoonLine = dashed(0xffffff));
    this.phasesGroup.add(this.phaseSunLine = dashed(0xffcf5c));
    this.root.add(this.phasesGroup);
  }

  // ───────── Thực: nón bóng tối & nửa tối của Trái Đất và Mặt Trăng
  buildEclipses() {
    this.eclipseGroup = new THREE.Group();
    // umbraLen: chiều dài nón bóng tối; nửa tối loe ra với cùng góc mở
    const cone = (r, len, color, opacity, umbraLen = null) => {
      const geo = umbraLen ? new THREE.CylinderGeometry(r * (1 + len / umbraLen), r, len, 48, 1, true)
        : new THREE.ConeGeometry(r, len, 48, 1, true);
      geo.translate(0, len / 2, 0);
      return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
    };
    this.earthUmbra = cone(ER, EARTH_UMBRA, 0x3a0a0a, 0.35);
    this.earthPenumbra = cone(ER, 40, 0x6a4a6a, 0.08, EARTH_UMBRA);
    this.moonUmbra = cone(MOON_R, MOON_UMBRA, 0x000000, 0.45);
    this.moonPenumbra = cone(MOON_R, MOON_D, 0x6a6a8a, 0.07, MOON_UMBRA);
    this.eclipseGroup.add(this.earthUmbra, this.earthPenumbra, this.moonUmbra, this.moonPenumbra);
    this.root.add(this.eclipseGroup);
  }

  setTopic(topic) {
    this.topic = topic;
    this.lightGroup.visible = topic === 'light';
    this.windGroup.visible = topic === 'wind';
    this.tidesGroup.visible = topic === 'tides';
    this.phasesGroup.visible = topic === 'phases';
    this.eclipseGroup.visible = topic === 'eclipses';
    this.magTarget = topic === 'eclipses' ? INCL_MAG : 1;
    this.orbitAge = Infinity;
  }

  /** Vị trí camera gợi ý cho mỗi chủ đề: { target, position }. */
  cameraFor(topic) {
    const h = this.sunDir.clone().setY(0).normalize();
    const side = new THREE.Vector3().crossVectors(h, Y).normalize();
    const v = (...terms) => terms.reduce((acc, [vec, k]) => acc.addScaledVector(vec, k), new THREE.Vector3());
    switch (topic) {
      case 'light': return { target: v([h, 78]), position: v([h, 78], [side, 275], [Y, 70]) };
      case 'wind': return { target: v([h, 4]), position: v([side, 85], [Y, 22], [h, 12]) };
      case 'tides': return { target: new THREE.Vector3(), position: v([Y, 42], [side, 14]) };
      case 'phases': return { target: new THREE.Vector3(), position: v([Y, 78], [side, 14], [h, -12]) };
      default: return { target: v([h, -10]), position: v([h, -10], [side, 78], [Y, 20]) };
    }
  }

  /** Trạng thái thật (không phóng đại) để hiển thị: pha, thực, mùa, triều. */
  status() {
    const ms = this.ms;
    const { age, illum } = moonPhase(ms);
    const me = moonEcliptic(ms);
    const md = eclToScene(me.lambda, me.beta, new THREE.Vector3());
    const ang = (a, b) => Math.acos(Math.min(1, Math.max(-1, a.dot(b))));
    const xLunar = ang(md, this.sunDir.clone().negate()) * me.distKm;   // km từ trục bóng Trái Đất
    const xSolar = ang(md, this.sunDir) * me.distKm;                   // km từ trục Trái Đất–Mặt Trời
    let lunar = null, solar = null;
    if (xLunar < 2863) lunar = 'total'; else if (xLunar < 6337) lunar = 'partial'; else if (xLunar < 9737) lunar = 'penumbral';
    if (xSolar < 6371) solar = 'central'; else if (xSolar < 9871) solar = 'partial';
    const elong = Math.abs(Math.cos(age));
    const tide = elong > 0.8 ? 'spring' : elong < 0.35 ? 'neap' : 'mid';
    return { age, illum, lunar, solar, xLunar, xSolar, decl: sunDeclination(ms), tide };
  }

  refreshLabels() {
    for (const l of this.labels) l.element.textContent = t(l.userData.body.name);
  }

  update(ms, dt) {
    this.ms = ms;
    this.clock += dt;
    sunDirection(ms, this.sunDir);
    this.sun.position.copy(this.sunDir).multiplyScalar(SUN_D);
    this.light.position.copy(this.sunDir).multiplyScalar(100);
    const g = gmst(ms);
    this.earth.rotation.y = g;
    this.clouds.rotation.y = g * 1.0003;

    // Mặt Trăng: vĩ độ hoàng đạo được phóng đại dần khi xem chủ đề thực
    this.mag += (this.magTarget - this.mag) * Math.min(1, dt * 3);
    const me = moonEcliptic(ms);
    eclToScene(me.lambda, me.beta * this.mag, this.moonPos).multiplyScalar(MOON_D * me.distKm / 384400);
    this.moon.position.copy(this.moonPos);
    this.moon.lookAt(0, 0, 0);
    this.moon.rotateY(-Math.PI / 2);

    this.orbitAge += dt;
    if (this.orbitAge > 1 || Math.abs(this.mag - this.magTarget) > 0.01) this.updateMoonOrbit(ms);

    // Thực: tô màu Mặt Trăng khi vào bóng Trái Đất, bóng Mặt Trăng trên Trái Đất
    const st = this.topic === 'eclipses' ? this.status() : null;
    const umbral = st ? 1 - smooth(2863, 6337, st.xLunar) : 0;
    const penumbral = st ? 1 - smooth(6337, 9737, st.xLunar) : 0;
    this.moonMat.color.setRGB(1, 1, 1).lerp(new THREE.Color(0.75, 0.75, 0.75), penumbral * 0.6).lerp(new THREE.Color(0.65, 0.18, 0.08), umbral);
    this.moonMat.emissive.setRGB(0.25 * umbral, 0.05 * umbral, 0);
    this.earthMat.uniforms.shadowStrength.value = st ? 1 - smooth(6371, 9871, st.xSolar) : 0;

    if (this.lightGroup.visible) this.updatePhotons(dt);
    if (this.windGroup.visible) this.updateWind(dt);
    if (this.tidesGroup.visible) this.updateTides();
    if (this.phasesGroup.visible) {
      setLine(this.phaseMoonLine, new THREE.Vector3(), this.moonPos);
      setLine(this.phaseSunLine, new THREE.Vector3(), this.sunDir.clone().multiplyScalar(MOON_D * 1.2));
    }
    if (this.eclipseGroup.visible) {
      const q = new THREE.Quaternion().setFromUnitVectors(Y, this.sunDir.clone().negate());
      for (const m of [this.earthUmbra, this.earthPenumbra, this.moonUmbra, this.moonPenumbra]) m.quaternion.copy(q);
      this.moonUmbra.position.copy(this.moonPos);
      this.moonPenumbra.position.copy(this.moonPos);
    }
  }

  updateMoonOrbit(ms) {
    this.orbitAge = 0;
    const pts = [], tmp = new THREE.Vector3();
    for (let i = 0; i <= 160; i++) {
      const me = moonEcliptic(ms + (i / 160) * 27.32 * 86400000);
      pts.push(eclToScene(me.lambda, me.beta * this.mag, tmp).multiplyScalar(MOON_D * me.distKm / 384400).clone());
    }
    this.moonOrbit.geometry.dispose();
    this.moonOrbit.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  }

  updatePhotons(dt) {
    const s = this.sunDir;
    const u = new THREE.Vector3().crossVectors(s, Y).normalize();
    const v = new THREE.Vector3().crossVectors(u, s);
    const sunPos = s.clone().multiplyScalar(SUN_D - SUN_R);
    const arr = this.photonPoints.geometry.attributes.position.array;
    const p = new THREE.Vector3(), end = new THREE.Vector3();
    this.photons.forEach((ph, i) => {
      ph.s += dt * ph.v;
      if (ph.s > 1) ph.s -= 1;
      const ox = Math.cos(ph.a) * ph.rho, oy = Math.sin(ph.a) * ph.rho;
      end.copy(u).multiplyScalar(ox).addScaledVector(v, oy).addScaledVector(s, Math.sqrt(ER * ER - ph.rho * ph.rho));
      p.copy(sunPos).lerp(end, ph.s);
      arr.set([p.x, p.y, p.z], i * 3);
    });
    this.photonPoints.geometry.attributes.position.needsUpdate = true;
  }

  updateWind(dt) {
    const h = this.sunDir.clone().setY(0).normalize();
    this.windFrame.rotation.y = Math.atan2(-h.z, h.x);
    const { X0, K } = this.mp;
    const arr = this.windPoints.geometry.attributes.position.array;
    this.windParticles.forEach((p, i) => {
      p.x -= p.v * dt;
      const rho = Math.hypot(p.y, p.z);
      const xb = X0 - (rho * rho) / K;
      if (p.x < xb) {                     // chạm ranh giới từ quyển: trượt dọc theo bề mặt
        const rb = Math.sqrt(K * (X0 - p.x));
        const k = rho > 1e-3 ? rb / rho : 1;
        if (rho < 1e-3) p.y = rb; else { p.y *= k; p.z *= k; }
      }
      if (p.x < -45) this.spawnWind(p);
      arr.set([p.x, p.y, p.z], i * 3);
    });
    this.windPoints.geometry.attributes.position.needsUpdate = true;
    const pulse = 0.55 + 0.35 * Math.sin(this.clock * 2.2);
    this.auroras.forEach((a, i) => { a.material.opacity = pulse * (i ? 0.85 : 1); });
  }

  updateTides() {
    const m = this.moonPos.clone().normalize(), s = this.sunDir;
    const pos = this.ocean.geometry.attributes.position, base = this.oceanBase;
    const n = new THREE.Vector3(), A = 0.9;
    const height = v => { const cm = v.dot(m), cs = v.dot(s); return A * ((3 * cm * cm - 1) / 2 + 0.46 * (3 * cs * cs - 1) / 2); };
    const R0 = ER * 1.08;
    for (let i = 0; i < pos.count; i++) {
      n.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).normalize();
      const r = R0 + height(n);
      pos.setXYZ(i, n.x * r, n.y * r, n.z * r);
    }
    pos.needsUpdate = true;
    this.ocean.geometry.computeVertexNormals();
    const e2 = s.clone().addScaledVector(m, -s.dot(m));
    if (e2.lengthSq() < 1e-4) e2.crossVectors(m, Y);
    e2.normalize();
    const out = this.tideOutline.geometry.attributes.position;
    for (let i = 0; i < out.count; i++) {
      const a = (i / out.count) * Math.PI * 2;
      n.copy(m).multiplyScalar(Math.cos(a)).addScaledVector(e2, Math.sin(a));
      const r = R0 + height(n) + 0.02;
      out.setXYZ(i, n.x * r, n.y * r, n.z * r);
    }
    out.needsUpdate = true;
    const place = (arrow, dir, len) => {
      arrow.position.copy(dir).multiplyScalar(R0 + height(dir) + 0.1);
      arrow.setDirection(dir);
      arrow.setLength(len, len * 0.3, len * 0.22);
    };
    place(this.tideArrows.m1, m, 2.2);
    place(this.tideArrows.m2, m.clone().negate(), 2.2);
    place(this.tideArrows.s1, s, 1.1);
    place(this.tideArrows.s2, s.clone().negate(), 1.1);
    setLine(this.earthMoonLine, new THREE.Vector3(), this.moonPos);
  }

  dispose() { disposeTree(this.root); }
}

function smooth(a, b, x) {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

function ring(r, color, opacity) {
  const pts = [];
  for (let i = 0; i <= 180; i++) { const a = (i / 180) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

function dashed(color) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]),
    new THREE.LineDashedMaterial({ color, dashSize: 0.6, gapSize: 0.4, transparent: true, opacity: 0.7 }),
  );
  line.frustumCulled = false;
  return line;
}

function setLine(line, a, b) {
  const p = line.geometry.attributes.position;
  p.setXYZ(0, a.x, a.y, a.z);
  p.setXYZ(1, b.x, b.y, b.z);
  p.needsUpdate = true;
  line.computeLineDistances();
}

