// Mô hình 3D giản lược của các vệ tinh nổi bật, dựng từ khối hình học cơ bản.
// Đơn vị: mét, tỉ lệ các bộ phận gần đúng theo thông số công bố.
import * as THREE from 'three';

// ───────── Vật liệu

let panelTex = null;
function solarTexture() {
  if (panelTex) return panelTex;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#0d1d4a'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const grd = g.createLinearGradient(x * 32, y * 32, x * 32 + 32, y * 32 + 32);
    grd.addColorStop(0, '#1d3f8f'); grd.addColorStop(1, '#0f2560');
    g.fillStyle = grd;
    g.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
  }
  panelTex = new THREE.CanvasTexture(c);
  panelTex.wrapS = panelTex.wrapT = THREE.RepeatWrapping;
  panelTex.colorSpace = THREE.SRGBColorSpace;
  return panelTex;
}

const MAT = {
  gold: () => new THREE.MeshStandardMaterial({ color: 0xd4a640, metalness: 0.9, roughness: 0.35 }),
  silver: () => new THREE.MeshStandardMaterial({ color: 0xd8dde4, metalness: 0.85, roughness: 0.3 }),
  white: () => new THREE.MeshStandardMaterial({ color: 0xf2f2ee, metalness: 0.1, roughness: 0.6 }),
  grey: () => new THREE.MeshStandardMaterial({ color: 0x8a9099, metalness: 0.6, roughness: 0.45 }),
  dark: () => new THREE.MeshStandardMaterial({ color: 0x2a2e36, metalness: 0.5, roughness: 0.5 }),
  mirror: () => new THREE.MeshStandardMaterial({ color: 0xe8f0ff, metalness: 1, roughness: 0.05 }),
  glass: () => new THREE.MeshStandardMaterial({ color: 0x6fb7ff, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.6 }),
  solar: (rx = 1, ry = 1) => {
    const map = solarTexture().clone();
    map.repeat.set(rx, ry);
    map.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map, metalness: 0.4, roughness: 0.35, side: THREE.DoubleSide });
  },
};

// ───────── Khung dựng: gom mesh theo "part" để làm nổi bật

class Builder {
  constructor() {
    this.group = new THREE.Group();
    this.parts = {};
  }
  add(part, mesh, parent = this.group) {
    (this.parts[part] ??= []).push(mesh);
    parent.add(mesh);
    return mesh;
  }
  box(part, w, h, d, mat, pos = [0, 0, 0], parent) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(...pos);
    return this.add(part, m, parent);
  }
  /** Hình trụ nằm dọc theo trục cho trước ('x' | 'y' | 'z'). */
  cyl(part, r, len, mat, pos = [0, 0, 0], axis = 'y', parent, r2 = r, open = false) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, len, 40, 1, open), mat);
    if (axis === 'x') m.rotation.z = -Math.PI / 2;
    if (axis === 'z') m.rotation.x = Math.PI / 2;
    m.position.set(...pos);
    return this.add(part, m, parent);
  }
  /** Tấm pin phẳng trong mặt phẳng chứa trục dọc (dir) và trục rộng. */
  panel(part, length, width, pos, dir = 'x', parent) {
    const geo = dir === 'x' ? new THREE.BoxGeometry(length, 0.05, width) : dir === 'z' ? new THREE.BoxGeometry(width, 0.05, length) : new THREE.BoxGeometry(width, length, 0.05);
    const m = new THREE.Mesh(geo, MAT.solar(Math.max(1, length / width) * 1, 1));
    if (dir === 'z') m.material.map.repeat.set(1, Math.max(1, length / width));
    m.position.set(...pos);
    return this.add(part, m, parent);
  }
  /** Chảo parabol, mặt lõm hướng theo trục +y trước khi xoay. */
  dish(part, r, depth, mat, pos, rot = [0, 0, 0], parent) {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const x = (i / 16) * r; pts.push(new THREE.Vector2(x, (depth * x * x) / (r * r))); }
    const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat);
    m.material.side = THREE.DoubleSide;
    m.position.set(...pos);
    m.rotation.set(...rot);
    return this.add(part, m, parent);
  }
}

// ───────── Từng vệ tinh

function iss() {
  const b = new Builder();
  b.box('truss', 100, 1.6, 1.6, MAT.grey(), [0, 4, 0]);
  for (const x of [-52, -38, 38, 52]) {
    b.cyl('truss', 0.6, 3, MAT.grey(), [x, 4, 0], 'z');
    for (const s of [1, -1]) b.panel('arrays', 34, 11.5, [x, 4, s * 19], 'z');
  }
  for (const x of [-12, 12]) for (let k = 0; k < 3; k++) b.box('radiators', 3, 0.08, 11, MAT.white(), [x + (k - 1) * 3.4, 4, -8]);
  // mô-đun điều áp xếp dọc trục z (hướng bay)
  b.cyl('usModules', 2.2, 7, MAT.white(), [0, 0, 16], 'z');      // Harmony
  b.cyl('usModules', 2.15, 8.5, MAT.white(), [0, 0, 8.2], 'z');  // Destiny
  b.cyl('usModules', 2.25, 5, MAT.white(), [0, 0, 1.5], 'z');    // Unity
  b.cyl('usModules', 2.2, 6.7, MAT.white(), [-5.5, 0, 1.5], 'x'); // Tranquility
  b.cyl('labs', 2.25, 7, MAT.white(), [5, 0, 17], 'x');          // Columbus
  b.cyl('labs', 2.2, 11.2, MAT.white(), [-7.6, 0, 17], 'x');     // Kibo
  b.box('labs', 5, 0.6, 5, MAT.grey(), [-15.5, 0, 17]);          // bệ ngoài Kibo
  b.cyl('ruModules', 2.05, 12.6, MAT.silver(), [0, 0, -8], 'z'); // Zarya
  b.cyl('ruModules', 2.1, 13, MAT.silver(), [0, 0, -20.8], 'z'); // Zvezda
  for (const s of [1, -1]) b.panel('arrays', 10, 3, [s * 7.2, 0, -24], 'x');
  for (const s of [1, -1]) b.panel('arrays', 10, 3, [s * 7.2, 0, -8], 'x');
  b.cyl('cupola', 1.5, 1.5, MAT.glass(), [-5.5, -2.2, 1.5], 'y', undefined, 1);
  return b;
}

function tiangong() {
  const b = new Builder();
  b.cyl('core', 2.1, 16.6, MAT.white(), [0, 0, -8.3], 'z', undefined, 1.4);
  const node = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), MAT.white());
  b.add('node', node);
  b.cyl('node', 0.6, 1.2, MAT.grey(), [0, 0, 1.8], 'z');
  b.cyl('node', 0.6, 1.2, MAT.grey(), [0, 1.8, 0], 'y');
  b.cyl('wentian', 2.1, 17.9, MAT.white(), [-10.4, 0, 0], 'x');
  b.cyl('mengtian', 2.1, 17.9, MAT.white(), [10.4, 0, 0], 'x');
  for (const s of [1, -1]) for (const z of [1, -1]) b.panel('arrays', 27, 4.5, [s * 17.5, 0, z * 15.5], 'z');
  for (const s of [1, -1]) b.panel('arrays', 9, 2.6, [s * 6, 0, -14], 'x');
  b.cyl('arm', 0.18, 10, MAT.grey(), [0, 2.5, -8], 'z');
  b.cyl('arm', 0.14, 5, MAT.grey(), [-12, 2.4, 0], 'x');
  return b;
}

function hubble() {
  const b = new Builder();
  b.cyl('tube', 2.1, 8.5, MAT.silver(), [2.3, 0, 0], 'x', undefined, 2.1, true);
  b.cyl('instruments', 2.1, 4.6, MAT.silver(), [-4.2, 0, 0], 'x');
  b.cyl('primary', 1.2, 0.3, MAT.mirror(), [-1.6, 0, 0], 'x');
  b.cyl('secondary', 0.16, 0.12, MAT.mirror(), [4.5, 0, 0], 'x');
  for (const a of [0, Math.PI / 2]) {
    const spider = b.box('secondary', 0.04, 4.1, 0.04, MAT.dark(), [4.5, 0, 0]);
    spider.rotation.x = a;
  }
  const door = b.box('door', 0.08, 4.4, 4.4, MAT.silver(), [7.0, 2.1, 0]);
  door.geometry.translate(0, 2.2, 0);
  door.position.set(6.55, 2.1, 0);
  door.rotation.z = 0.9;
  for (const s of [1, -1]) {
    b.cyl('arrays', 0.07, 2.4, MAT.grey(), [-1, 0, s * 3.2], 'z');
    b.panel('arrays', 7.1, 2.6, [-1, 0, s * 5.7], 'x').rotation.x = Math.PI / 2;
  }
  for (const s of [1, -1]) {
    b.cyl('antennas', 0.05, 3, MAT.grey(), [-1.5, s * 3.5, 0], 'y');
    b.dish('antennas', 0.65, 0.25, MAT.white(), [-1.5, s * 5, 0], [s > 0 ? Math.PI : 0, 0, 0]);
  }
  return b;
}

function starlink() {
  const b = new Builder();
  b.box('bus', 4.1, 0.35, 2.7, MAT.dark(), [0, 0, 0]);
  for (let i = 0; i < 4; i++) b.box('antennas', 0.75, 0.04, 0.75, MAT.grey(), [-1.35 + i * 0.9, -0.2, 0.5]);
  for (let i = 0; i < 3; i++) b.cyl('lasers', 0.13, 0.2, MAT.silver(), [-1.5 + i * 1.5, 0.27, -1.1]);
  b.cyl('thruster', 0.12, 0.35, MAT.grey(), [2.2, 0, 0], 'x', undefined, 0.2);
  for (const s of [1, -1]) {
    b.cyl('arrays', 0.05, 1.2, MAT.grey(), [s * 2.6, 0, 0], 'x');
    b.panel('arrays', 13, 4.05, [s * 9.7, 0, 0], 'x');
  }
  return b;
}

function oneweb() {
  const b = new Builder();
  b.box('bus', 1, 1.3, 1, MAT.silver(), [0, 0, 0]);
  for (const s of [1, -1]) b.dish('antennas', 0.2, 0.06, MAT.white(), [s * 0.25, -0.66, 0], [Math.PI, 0, 0]);
  for (const s of [1, -1]) b.dish('gateway', 0.18, 0.08, MAT.gold(), [s * 0.35, -0.55, 0.45], [Math.PI * 0.75, 0, 0]);
  for (const s of [1, -1]) b.panel('arrays', 2.4, 0.9, [s * 1.8, 0.2, 0], 'x');
  return b;
}

function vnredsat() {
  const b = new Builder();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.75, 6), MAT.gold());
  b.add('bus', body);
  for (let k = 0; k < 3; k++) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (k * 2 * Math.PI) / 3;
    b.group.add(pivot);
    const p = b.panel('arrays', 0.8, 0.55, [0.85, 0.3, 0], 'x', pivot);
    p.rotation.z = 0.35;
  }
  b.cyl('camera', 0.2, 0.55, MAT.dark(), [0, -0.62, 0]);
  b.cyl('antenna', 0.06, 0.18, MAT.white(), [0.25, -0.45, 0.2]);
  return b;
}

function landsat() {
  const b = new Builder();
  b.box('bus', 1.9, 1.9, 3.6, MAT.gold(), [0, 0, 0]);
  b.box('oli', 1.1, 0.9, 1.4, MAT.white(), [0, -1.4, 0.8]);
  b.cyl('oli', 0.3, 0.2, MAT.dark(), [0, -1.9, 0.8]);
  b.box('tirs', 0.8, 0.7, 0.8, MAT.silver(), [0, -1.3, -1]);
  b.cyl('arrays', 0.05, 1.5, MAT.grey(), [1.7, 0, 0], 'x');
  b.panel('arrays', 4.5, 3.3, [4.6, 0, 0], 'x');
  return b;
}

function gnss(variant) {
  const b = new Builder();
  const size = variant === 'galileo' ? [2.5, 1.2, 1.1] : variant === 'glonass' ? [1.6, 1.6, 1.6] : [2.2, 2.0, 1.8];
  b.box('bus', ...size, variant === 'galileo' ? MAT.silver() : MAT.gold(), [0, 0, 0]);
  const span = variant === 'galileo' ? 6 : variant === 'glonass' ? 5.5 : 7;
  for (const s of [1, -1]) {
    b.cyl('arrays', 0.05, 1.2, MAT.grey(), [0, 0, s * (size[2] / 2 + 0.6)], 'z');
    b.panel('arrays', span, 1.9, [0, 0, s * (size[2] / 2 + 1.2 + span / 2)], 'z');
  }
  const face = -size[1] / 2;
  if (variant === 'galileo') {
    b.box('lband', 1.2, 0.08, 1.0, MAT.white(), [-0.3, face - 0.04, 0]);
    b.cyl('sar', 0.12, 0.6, MAT.white(), [0.9, face - 0.3, 0]);
  } else {
    b.cyl('lband', 0.75, 0.08, MAT.white(), [0, face - 0.04, 0]);
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2, r = k % 2 ? 0.55 : 0.3;
      b.cyl('lband', 0.06, 0.45, MAT.white(), [Math.cos(a) * r, face - 0.3, Math.sin(a) * r]);
    }
    if (variant === 'gps') b.cyl('crosslink', 0.1, 0.8, MAT.white(), [0.9, face - 0.4, 0]);
  }
  return b;
}

function geoComsat(variant) {
  const b = new Builder();
  b.box('bus', 2.1, 2.6, 2.0, MAT.gold(), [0, 0, 0]);
  for (const s of [1, -1]) {
    b.cyl('arrays', 0.06, 1.6, MAT.grey(), [0, 0.3, s * 1.8], 'z');
    for (let k = 0; k < 3; k++) b.panel('arrays', 2.8, 2.4, [0, 0.3, s * (3.2 + k * 2.85)], 'z');
  }
  // chảo lớn ở hai mặt đông–tây, loa thu phát phía trước
  for (const s of [1, -1]) {
    b.dish('reflectors', 1.15, 0.35, MAT.white(), [s * 1.9, 0.6, 0], [0, 0, s * (Math.PI / 2 - 0.35)]);
    b.cyl('feeds', 0.12, 0.5, MAT.gold(), [s * 0.95, -1.0, 0], 'y', undefined, 0.22);
  }
  if (variant === 'vinasat1') b.dish('reflectors', 0.6, 0.18, MAT.white(), [0, -1.6, 0.4], [Math.PI, 0, 0]);
  b.cyl('bus', 0.35, 0.4, MAT.dark(), [0, 1.5, 0]);
  return b;
}

function weatherGeo(variant) {
  const b = new Builder();
  b.box('bus', 2.4, 2.6, 2.2, MAT.gold(), [0, 0, 0]);
  b.box('imager', 1.2, 0.9, 1.0, MAT.white(), [0, -1.7, 0.2]);
  b.cyl('imager', 0.32, 0.2, MAT.dark(), [0, -2.2, 0.2]);
  if (variant === 'goes') {
    b.box('imager', 0.6, 0.5, 0.6, MAT.silver(), [-0.8, -1.55, -0.6]);
    b.cyl('boom', 0.04, 8.5, MAT.grey(), [-1.2, 0.5, -5.4], 'z');
  }
  b.cyl('arrays', 0.08, 2, MAT.grey(), [0, 0.4, 2.1], 'z');
  const n = variant === 'goes' ? 5 : 4;
  for (let k = 0; k < n; k++) b.panel('arrays', 2.6, 2.4, [0, 0.4, 4.4 + k * 2.65], 'z');
  if (variant === 'goes') b.box('arrays', 0.8, 0.6, 0.8, MAT.white(), [0, 1.2, 3.0]);
  b.dish('antennas', 0.5, 0.15, MAT.white(), [1.4, 0.8, 0], [0, 0, -Math.PI / 2]);
  return b;
}

function molniya() {
  const b = new Builder();
  b.cyl('bus', 0.8, 3.4, MAT.silver(), [0, 0.6, 0]);
  b.cyl('bus', 0.8, 1, MAT.silver(), [0, 2.8, 0], 'y', undefined, 0.3);
  for (let k = 0; k < 6; k++) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (k * Math.PI) / 3;
    pivot.position.y = -1.1;
    b.group.add(pivot);
    const p = b.panel('arrays', 2.8, 1.1, [2.1, -0.4, 0], 'x', pivot);
    p.rotation.z = -0.3;
  }
  for (const s of [1, -1]) {
    b.cyl('reflectors', 0.04, 2, MAT.grey(), [s * 1.3, 1.6, 0], 'x');
    b.dish('reflectors', 0.7, 0.25, MAT.white(), [s * 2.3, 1.6, 0], [0, 0, s * Math.PI / 2]);
  }
  return b;
}

const BUILDERS = {
  iss, tiangong, hubble, starlink, oneweb, vnredsat, landsat9: landsat,
  gps: () => gnss('gps'), galileo: () => gnss('galileo'), glonass: () => gnss('glonass'),
  vinasat1: () => geoComsat('vinasat1'), vinasat2: () => geoComsat('vinasat2'),
  himawari: () => weatherGeo('himawari'), goes: () => weatherGeo('goes'), molniya,
};

/** Dựng mô hình; trả về { group, parts } với parts: key → mảng mesh. */
export function buildSatellite(id) {
  const builder = BUILDERS[id]?.();
  return builder ? { group: builder.group, parts: builder.parts } : null;
}
