// Cận cảnh một hành tinh (hoặc Mặt Trời) cùng các vệ tinh tự nhiên của nó.
import * as THREE from 'three';
import { BY_ID, childrenOf } from '../data/bodies.js';
import { t } from '../i18n.js';
import {
  makeStarfield, makeLabel, makeSun, makeRings, makeAtmosphere, circleLine, disposeTree, earthMaterial, daysSinceJ2000,
} from '../core/engine.js';
import { meanLongitude, spin } from './overview.js';
import { buildCutaway } from './cutaway.js';

const P_R = 5; // bán kính hành tinh trong cảnh

export class SystemScene {
  constructor(engine, centerId, ms, { onSelect }) {
    this.engine = engine;
    this.centerId = centerId;
    this.onSelect = onSelect;
    this.root = new THREE.Scene();
    this.pickables = [];
    this.labels = [];
    this.moons = new Map();
    const center = BY_ID[centerId];
    this.center = center;

    this.root.add(makeStarfield(engine));
    this.root.add(new THREE.AmbientLight(0xffffff, 0.06));

    // Hướng Mặt Trời nhìn từ hành tinh: theo vị trí thật trên quỹ đạo
    const lon = center.orbitDays ? meanLongitude(center, ms) : 0;
    this.sunDir = new THREE.Vector3(-Math.cos(lon), 0.15, Math.sin(lon)).normalize();

    if (center.kind === 'star') {
      const sun = makeSun(engine, P_R);
      sun.mesh.userData.id = center.id;
      this.planetMesh = sun.mesh;
      this.sunGlow = sun.group.children[1];
      this.root.add(sun.group);
      this.pickables.push(sun.mesh);
    } else {
      const light = new THREE.DirectionalLight(0xffffff, 2.6);
      light.position.copy(this.sunDir).multiplyScalar(100);
      this.root.add(light);
      this.buildPlanet(center);
    }
    this.addLabel(this.root, center, P_R, true);

    for (const moon of childrenOf(centerId)) this.addMoon(moon);
  }

  buildPlanet(body) {
    const tilt = new THREE.Group();
    tilt.rotation.z = THREE.MathUtils.degToRad(body.tilt || 0);
    this.root.add(tilt);
    this.tiltGroup = tilt;

    let mat;
    if (body.id === 'earth') mat = earthMaterial(this.engine, this.sunDir);
    else mat = new THREE.MeshStandardMaterial({ map: this.engine.texture(body.texture), color: body.tint || 0xffffff, roughness: 1, metalness: 0 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(P_R, 96, 48), mat);
    mesh.userData.id = body.id;
    tilt.add(mesh);
    this.planetMesh = mesh;
    this.pickables.push(mesh);

    if (body.id === 'earth') {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(P_R * 1.008, 96, 48),
        new THREE.MeshStandardMaterial({ alphaMap: this.engine.texture('2k_earth_clouds.jpg', { color: false }), transparent: true, depthWrite: false, roughness: 1 }),
      );
      tilt.add(clouds);
      this.clouds = clouds;
      this.atmo = makeAtmosphere(P_R, 0x4da6ff, this.sunDir);
      this.root.add(this.atmo);
    }
    if (body.id === 'venus' || body.id === 'neptune' || body.id === 'uranus') {
      this.atmo = makeAtmosphere(P_R, body.color, this.sunDir);
      this.root.add(this.atmo);
    }
    if (body.rings) tilt.add(makeRings(this.engine, P_R * 1.24, P_R * 2.27));
  }

  addLabel(parent, body, height, isCenter = false) {
    const label = makeLabel(t(body.name), { className: isCenter ? 'label-main' : '', onClick: () => this.onSelect(body.id) });
    label.position.set(0, height * 1.2, 0);
    label.userData.body = body;
    parent.add(label);
    this.labels.push(label);
  }

  addMoon(moon) {
    const ratio = moon.radiusKm / this.center.radiusKm;
    const r = Math.max(0.3, P_R * Math.pow(ratio, 0.7));
    const dist = P_R + 9 * Math.log2(moon.distKm / this.center.radiusKm) + r;

    // Mặt Trăng của Trái Đất quay gần mặt phẳng hoàng đạo; các vệ tinh khác theo xích đạo hành tinh.
    const plane = new THREE.Group();
    if (this.center.id !== 'earth') plane.rotation.z = THREE.MathUtils.degToRad(this.center.tilt || 0);
    if (moon.id === 'triton') plane.rotation.x = THREE.MathUtils.degToRad(23);
    if (moon.id === 'iapetus') plane.rotation.x = THREE.MathUtils.degToRad(15);
    this.root.add(plane);

    const orbit = circleLine(dist, new THREE.Color(moon.color), 0.3);
    plane.add(orbit);

    const pivot = new THREE.Group();
    plane.add(pivot);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 48, 24),
      new THREE.MeshStandardMaterial({ map: this.engine.texture(moon.texture), color: moon.tint || 0xffffff, roughness: 1, metalness: 0 }),
    );
    mesh.userData.id = moon.id;
    pivot.add(mesh);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(r * 1.8, 1.2), 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.id = moon.id;
    pivot.add(hit);
    this.pickables.push(hit);
    this.addLabel(pivot, moon, r);

    const phase0 = [...moon.id].reduce((s, c) => s + c.charCodeAt(0), 0) * 0.37;
    this.moons.set(moon.id, { body: moon, pivot, mesh, dist, r, orbit, phase0 });
  }

  positionOf(id) {
    if (id === this.centerId) return new THREE.Vector3();
    const m = this.moons.get(id);
    return m.mesh.getWorldPosition(new THREE.Vector3());
  }

  sizeOf(id) {
    return id === this.centerId ? P_R : this.moons.get(id).r;
  }

  get extent() {
    let max = P_R * (this.center.rings ? 2.4 : 1);
    for (const m of this.moons.values()) max = Math.max(max, m.dist);
    return max;
  }

  highlight(id) {
    for (const [mid, m] of this.moons) m.orbit.material.opacity = mid === id ? 0.85 : 0.3;
  }

  onPick(id) { this.onSelect(id); }

  /** Hướng camera (khung thế giới) để nhìn thẳng vào múi bị khoét của mặt cắt. */
  cutawayViewDir(id) {
    const dir = new THREE.Vector3(1, 0.6, 1).normalize();
    if (id === this.centerId) return dir;
    return dir.applyQuaternion(this.moons.get(id).pivot.parent.quaternion);
  }

  /** Bật mặt cắt 3D cho thiên thể id (hành tinh trung tâm hoặc một vệ tinh); null để tắt. */
  setCutaway(id) {
    if (this.cutaway) {
      const { group, labels, hidden } = this.cutaway;
      group.parent.remove(group);
      disposeTree(group);
      this.labels = this.labels.filter(l => !labels.includes(l));
      hidden.forEach(o => { o.visible = true; });
      this.cutaway = null;
    }
    if (!id) return;
    const isCenter = id === this.centerId;
    const body = BY_ID[id];
    const m = isCenter ? null : this.moons.get(id);
    const radius = isCenter ? P_R : m.r;
    const cut = buildCutaway(this.engine, body, radius);
    const hidden = isCenter
      ? [this.planetMesh, this.clouds, this.atmo, this.sunGlow].filter(Boolean)
      : [m.mesh];
    hidden.forEach(o => { o.visible = false; });
    (isCenter ? this.root : m.pivot).add(cut.group);
    this.labels.push(...cut.labels);
    this.cutaway = { id, group: cut.group, labels: cut.labels, hidden };
  }

  refreshLabels() {
    for (const l of this.labels) l.element.textContent = t(l.userData.body.name);
  }

  update(ms, dt, daysStep) {
    const days = daysSinceJ2000(ms);
    for (const m of this.moons.values()) {
      const a = m.phase0 + (2 * Math.PI * days) / m.body.orbitDays;
      m.pivot.position.set(Math.cos(a) * m.dist, 0, -Math.sin(a) * m.dist);
      m.mesh.rotation.y = a + Math.PI; // khóa thủy triều: luôn quay một mặt về hành tinh
    }
    if (this.center.kind === 'star') this.planetMesh.rotation.y += spin(609, daysStep);
    else this.planetMesh.rotation.y += spin(this.center.rotationH, daysStep);
    if (this.clouds) this.clouds.rotation.y += spin(this.center.rotationH * 0.9, daysStep);
  }

  dispose() { disposeTree(this.root); }
}
