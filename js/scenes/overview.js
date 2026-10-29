// Toàn cảnh hệ Mặt Trời. Khoảng cách và kích thước được nén để nhìn thấy hết các hành tinh.
import * as THREE from 'three';
import { PLANETS } from '../data/bodies.js';
import { t } from '../i18n.js';
import {
  makeStarfield, makeLabel, makeSun, makeRings, circleLine, disposeTree, daysSinceJ2000, earthMaterial,
} from '../core/engine.js';

const SUN_R = 8;
export const orbitRadius = au => 14 + 22 * Math.log2(1 + au);
export const planetSize = rKm => 0.5 + 1.3 * Math.pow(rKm / 6371, 0.45);

/** Kinh độ hoàng đạo trung bình (rad) của hành tinh tại thời điểm ms (quỹ đạo tròn gần đúng). */
export function meanLongitude(body, ms) {
  const deg = body.L0 + 360 * daysSinceJ2000(ms) / body.orbitDays;
  return THREE.MathUtils.degToRad(deg);
}

export class OverviewScene {
  constructor(engine, { onSelect }) {
    this.engine = engine;
    this.onSelect = onSelect;
    this.root = new THREE.Scene();
    this.pickables = [];
    this.planets = new Map();
    this.labels = [];

    this.root.add(makeStarfield(engine));
    this.root.add(new THREE.AmbientLight(0xffffff, 0.08));
    this.root.add(new THREE.PointLight(0xfff2dd, 3, 0, 0));

    const sun = makeSun(engine, SUN_R);
    sun.mesh.userData.id = 'sun';
    this.root.add(sun.group);
    this.pickables.push(sun.mesh);
    this.sunMesh = sun.mesh;
    this.addLabel(sun.group, 'sun', { name: { vi: 'Mặt Trời', en: 'Sun' } }, SUN_R);

    this.sunDir = new THREE.Vector3();
    for (const body of PLANETS) this.addPlanet(body);
    this.addAsteroidBelt();
  }

  addLabel(parent, id, body, height) {
    const label = makeLabel(t(body.name), { onClick: () => this.onSelect(id) });
    label.position.set(0, height * 1.15, 0);
    label.userData.body = body;
    parent.add(label);
    this.labels.push(label);
  }

  addPlanet(body) {
    const r = planetSize(body.radiusKm);
    const dist = orbitRadius(body.au);
    const pivot = new THREE.Group();       // vị trí trên quỹ đạo
    const tilt = new THREE.Group();        // nghiêng trục
    tilt.rotation.z = THREE.MathUtils.degToRad(body.tilt || 0);
    pivot.add(tilt);

    let mat;
    if (body.id === 'earth') mat = earthMaterial(this.engine, this.sunDir);
    else mat = new THREE.MeshStandardMaterial({ map: this.engine.texture(body.texture), roughness: 1, metalness: 0, color: body.tint || 0xffffff });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24), mat);
    mesh.userData.id = body.id;
    tilt.add(mesh);
    if (body.rings) tilt.add(makeRings(this.engine, r * 1.24, r * 2.27));

    // vùng nhấp lớn hơn cho hành tinh nhỏ
    const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(r * 1.6, 2.2), 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.id = body.id;
    pivot.add(hit);
    this.pickables.push(hit);

    this.addLabel(pivot, body.id, body, r);
    this.root.add(pivot);

    const orbit = circleLine(dist, new THREE.Color(body.color), body.kind === 'dwarf' ? 0.18 : 0.3);
    this.root.add(orbit);
    this.planets.set(body.id, { body, pivot, mesh, dist, r, orbit });
  }

  addAsteroidBelt() {
    const n = 2500, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const au = 2.2 + Math.random() * 1.1;
      const d = orbitRadius(au), a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * d, (Math.random() - 0.5) * 1.2, Math.sin(a) * d], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.belt = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x9a8f80, size: 0.25, transparent: true, opacity: 0.7 }));
    this.root.add(this.belt);
  }

  positionOf(id) {
    if (id === 'sun') return new THREE.Vector3();
    return this.planets.get(id).pivot.position.clone();
  }

  sizeOf(id) {
    return id === 'sun' ? SUN_R : this.planets.get(id).r;
  }

  highlight(id) {
    for (const [pid, p] of this.planets) p.orbit.material.opacity = pid === id ? 0.8 : (p.body.kind === 'dwarf' ? 0.18 : 0.3);
  }

  onPick(id) { this.onSelect(id); }

  refreshLabels() {
    for (const l of this.labels) l.element.textContent = t(l.userData.body.name);
  }

  update(ms, dt, daysStep) {
    for (const p of this.planets.values()) {
      const a = meanLongitude(p.body, ms);
      // trục x hướng điểm xuân phân; chiều dương ngược chiều kim đồng hồ khi nhìn từ phía Bắc
      p.pivot.position.set(Math.cos(a) * p.dist, 0, -Math.sin(a) * p.dist);
      p.mesh.rotation.y += spin(p.body.rotationH, daysStep);
      if (p.body.id === 'earth') this.sunDir.copy(p.pivot.position).negate().normalize();
    }
    this.sunMesh.rotation.y += spin(609, daysStep);
    if (this.belt) this.belt.rotation.y += daysStep * 0.0005;
  }

  dispose() { disposeTree(this.root); }
}

/** Góc tự quay trong một bước; giới hạn để hành tinh không quay loạn khi tua nhanh. */
export function spin(rotationH, daysStep) {
  if (!rotationH) return 0;
  const raw = (Math.PI * 2 * daysStep * 24) / rotationH;
  const cap = 0.03;
  return Math.max(-cap, Math.min(cap, raw));
}
