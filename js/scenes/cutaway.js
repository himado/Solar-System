// Mô hình mặt cắt 3D: quả cầu bị khoét một múi 90° (vùng x > 0, z > 0) để lộ các lớp bên trong.
import * as THREE from 'three';
import { t } from '../i18n.js';
import { makeLabel } from '../core/engine.js';

/** Bán kính hiển thị của các lớp; lớp quá mỏng được nới ra để vẫn nhìn thấy (giống hình SVG). */
export function displayRadii(layers) {
  const out = [];
  let prev = 0;
  for (const l of layers) {
    let r = l.r;
    if (r - prev < 0.04) r = Math.min(1, prev + 0.04);
    out.push(r);
    prev = r;
  }
  const s = 1 / out[out.length - 1];
  return out.map(r => r * s);
}

export function buildCutaway(engine, body, radius) {
  const group = new THREE.Group();
  const radii = displayRadii(body.layers);
  const isStar = body.kind === 'star';

  // Vỏ ngoài: 3/4 quả cầu, giữ đúng texture bằng cách ánh xạ lại toạ độ u
  const shellGeo = new THREE.SphereGeometry(radius, 96, 48, Math.PI, Math.PI * 1.5);
  const uv = shellGeo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, 0.5 + uv.getX(i) * 0.75);
  const tex = engine.texture(body.id === 'earth' ? '2k_earth_daymap.jpg' : body.texture);
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  const shellMat = isStar
    ? new THREE.MeshBasicMaterial({ map: tex })
    : new THREE.MeshStandardMaterial({ map: tex, color: body.tint || 0xffffff, roughness: 1, metalness: 0 });
  shellMat.side = THREE.DoubleSide;
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.userData.id = body.id;
  group.add(shell);

  // Hai mặt cắt phẳng: mỗi lớp là một nửa vành khuyên
  for (const face of [0, 1]) {
    const faceGroup = new THREE.Group();
    if (face === 1) faceGroup.rotation.y = -Math.PI / 2;
    body.layers.forEach((layer, k) => {
      const inner = (k === 0 ? 0 : radii[k - 1]) * radius;
      const outer = radii[k] * radius;
      const geo = new THREE.RingGeometry(Math.max(inner, 0.0001), outer, 96, 1, -Math.PI / 2, Math.PI);
      const color = new THREE.Color(layer.color);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: isStar ? 0.9 : 0.35, roughness: 0.9, side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.userData.id = body.id;
      faceGroup.add(ring);
    });
    group.add(faceGroup);
  }

  // Đường viền ranh giới giữa các lớp, giúp mắt phân biệt lớp có màu gần nhau
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  for (const r of radii) {
    for (const face of [0, 1]) {
      const pts = [];
      for (let a = 0; a <= 64; a++) {
        const th = -Math.PI / 2 + (a / 64) * Math.PI;
        const x = Math.cos(th) * r * radius * 1.001, y = Math.sin(th) * r * radius * 1.001;
        pts.push(face === 0 ? new THREE.Vector3(x, y, 0.002) : new THREE.Vector3(0.002, y, x));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), edgeMat));
    }
  }

  // Nhãn từng lớp, rải theo các góc khác nhau trên mặt cắt z = 0 để không chồng nhau
  const labels = [];
  const n = body.layers.length;
  body.layers.forEach((layer, k) => {
    const inner = k === 0 ? 0 : radii[k - 1];
    const mid = ((inner + radii[k]) / 2) * radius;
    const ang = THREE.MathUtils.degToRad(n === 1 ? 35 : 10 + (70 * k) / (n - 1));
    const label = makeLabel(t(layer.name), { className: 'label-layer-name' });
    label.center.set(0, 0.5);
    label.position.set(Math.cos(ang) * mid, Math.sin(ang) * mid, 0.01);
    label.userData.body = layer;
    labels.push(label);
    group.add(label);
  });

  return { group, labels, shell };
}
