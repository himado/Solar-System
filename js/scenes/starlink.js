// Starlink hoạt động thế nào: tuyến dữ liệu chảo thu → vệ tinh → laser → trạm cổng → cáp quang → máy chủ.
// Dựng trên cảnh quỹ đạo Trái Đất (tỉ lệ thật, 1 đơn vị = 1.000 km), chỉ hiện các vệ tinh Starlink.
import * as THREE from 'three';
import { EarthOrbitScene, EARTH_R } from './earthOrbit.js';
import { keplerPosition, TYPES, R_EARTH_KM } from '../sim/population.js';
import { makeLabel, glowTexture } from '../core/engine.js';
import { SL_GATEWAYS } from '../data/starlink.js';
import { t } from '../i18n.js';

const S = 1 / 1000;
const deg = Math.PI / 180;
const MIN_ELEV = 25 * deg;          // góc ngẩng tối thiểu theo hồ sơ FCC
const ISL_RANGE = 2.6;              // tầm laser dùng khi chọn bước nhảy (2.600 km)
const C = 299.792458;               // km mỗi mili giây
const FIBER_INDEX = 1.47, ROUTE_FACTOR = 1.3;
const GEO_SLANT_KM = 37500;         // quãng đường trung bình mặt đất ↔ vệ tinh địa tĩnh
const STARLINK = TYPES.indexOf('starlink');
const MAX_CHAIN = 40, ARC_N = 64;

export function latLonToLocal(lat, lon, r = 1, out = new THREE.Vector3()) {
  const p = lat * deg, l = lon * deg;
  return out.set(Math.cos(p) * Math.cos(l), Math.sin(p), -Math.cos(p) * Math.sin(l)).multiplyScalar(r);
}

/** Lịch phân bổ toàn cầu: giây 12, 27, 42, 57 của mỗi phút. */
const slotOf = ms => Math.floor((ms / 1000 - 12) / 15);
const countdownOf = ms => 15 - ((((ms / 1000 - 12) % 15) + 15) % 15);

export class StarlinkScene extends EarthOrbitScene {
  constructor(engine, ms, { onUserPick }) {
    super(engine, ms, { onSelect: () => {} });
    this.onUserPick = onUserPick;
    for (const s of this.featured.values()) { s.sprite.visible = false; s.sprite.children[0].visible = false; }
    this.labels = this.labels.filter(l => !l.userData.short);
    this.setShellsVisible(false);
    TYPES.forEach(k => { this.vis[k] = k === 'starlink'; });
    this.applyVisibility();
    this.pickables = [this.earth];

    // Chỉ dùng các vệ tinh đã lên quỹ đạo khai thác (≥ 520 km) để định tuyến
    this.sats = this.objs.filter(o => o[7] === STARLINK && o[0] >= R_EARTH_KM + 520)
      .map(o => ({ a: o[0] * S, e: o[1], i: o[2], raan: o[3], argp: o[4], M0: o[5], n: o[6] }));
    this.satPos = new Float32Array(this.sats.length * 3);
    this.tSec = 0;
    this.clock = 0;
    this.laserOn = true;
    this.step = null;
    this.handoffs = 0;
    this.slot = null;
    this.serving = null;
    this.route = { ok: false, reason: 'init' };

    this.buildMarkers();
    this.buildOverlay();
  }

  // ───────── Điểm trên mặt đất (gắn vào Trái Đất nên quay theo)
  marker(color, size) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, sizeAttenuation: false, depthWrite: false, transparent: true }));
    s.scale.setScalar(size);
    return s;
  }

  buildMarkers() {
    this.gateways = SL_GATEWAYS.map(g => {
      const local = latLonToLocal(g.lat, g.lon, 1);
      const m = this.marker(0x7cf29a, g.real ? 0.03 : 0.022);
      m.position.copy(local).multiplyScalar(EARTH_R * 1.003);
      this.earth.add(m);
      if (g.real) {
        const label = makeLabel(t(g.name), { className: 'label-gw' });
        label.userData.body = { name: g.name };
        m.add(label);
        this.labels.push(label);
      }
      return { ...g, local, sprite: m };
    });
    this.userMarker = this.marker(0x4fd1ff, 0.045);
    this.earth.add(this.userMarker);
    this.userLabel = makeLabel(t({ vi: 'Bạn', en: 'You' }), { className: 'label-user' });
    this.userLabel.userData.body = { name: { vi: 'Bạn', en: 'You' } };
    this.userMarker.add(this.userLabel);
    this.serverMarker = this.marker(0xffcf5c, 0.04);
    this.earth.add(this.serverMarker);
    this.serverLabel = makeLabel('', { className: 'label-server' });
    this.serverMarker.add(this.serverLabel);
    this.labels.push(this.userLabel);
  }

  buildOverlay() {
    const line = (color, n, opacity = 1, Seg = THREE.Line) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const l = new Seg(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
      l.frustumCulled = false;
      this.root.add(l);
      return l;
    };
    this.rfLine = line(0x4fd1ff, 4, 1, THREE.LineSegments);       // sóng vô tuyến: chảo↔vệ tinh, vệ tinh↔trạm cổng
    this.laserLine = line(0xff4f7b, MAX_CHAIN);                    // laser giữa các vệ tinh
    this.fiberLine = line(0xffcf5c, ARC_N);                        // cáp quang trên mặt đất
    this.footprint = line(0x4fd1ff, 97, 0.55, THREE.LineLoop);     // vùng phủ của vệ tinh phục vụ
    this.chainSprites = Array.from({ length: MAX_CHAIN }, (_, k) => {
      const s = this.marker(k === 0 ? 0xffffff : 0xff6f93, k === 0 ? 0.05 : 0.03);
      s.visible = false;
      this.root.add(s);
      return s;
    });
    this.packets = Array.from({ length: 10 }, (_, k) => {
      const s = this.marker(k < 5 ? 0x9fe8ff : 0x9dffb5, 0.022);
      this.root.add(s);
      return s;
    });
  }

  // ───────── Thiết lập từ bảng điều khiển
  setUser(lat, lon) {
    this.user = { lat, lon };
    this.userLocal = latLonToLocal(lat, lon, 1);
    this.userMarker.position.copy(this.userLocal).multiplyScalar(EARTH_R * 1.003);
    this.slot = null;
    this.handoffs = 0;
    this.serving = null;
  }

  setServer(server) {
    this.server = server;
    this.serverLocal = latLonToLocal(server.lat, server.lon, 1);
    this.serverMarker.position.copy(this.serverLocal).multiplyScalar(EARTH_R * 1.003);
    this.serverLabel.element.textContent = t(server.name);
    this.serverLabel.userData.body = { name: server.name };
    if (!this.labels.includes(this.serverLabel)) this.labels.push(this.serverLabel);
  }

  setLaser(on) { this.laserOn = on; this.slot = null; }
  setStep(seg) { this.step = seg; }

  onPick(id, hit) {
    if (id !== 'earth' || !hit) return;
    const local = this.earth.worldToLocal(hit.point.clone()).normalize();
    const lat = Math.asin(local.y) / deg, lon = Math.atan2(-local.z, local.x) / deg;
    this.setUser(lat, lon);
    this.onUserPick?.(lat, lon);
  }

  /** Toạ độ thế giới của các điểm trên mặt đất. */
  groundWorld(local, out = new THREE.Vector3()) {
    return out.copy(local).multiplyScalar(EARTH_R).applyMatrix4(this.earth.matrixWorld);
  }

  // ───────── Hình học
  computeAll() {
    const p = new THREE.Vector3();
    this.sats.forEach((el, k) => { keplerPosition(el, this.tSec, p); this.satPos.set([p.x, p.y, p.z], k * 3); });
  }
  sat(k, out = new THREE.Vector3()) { return out.fromArray(this.satPos, k * 3); }

  static elevation(g, s) {
    const v = s.clone().sub(g);
    return Math.asin(v.dot(g) / (v.length() * g.length()));
  }

  visibleFrom(g) {
    const out = [], s = new THREE.Vector3();
    for (let k = 0; k < this.sats.length; k++) {
      this.sat(k, s);
      const e = StarlinkScene.elevation(g, s);
      if (e >= MIN_ELEV) out.push({ k, e });
    }
    return out;
  }

  nearestGateway() {
    let best = 0, bestDot = -2;
    this.gateways.forEach((g, i) => { const d = g.local.dot(this.userLocal); if (d > bestDot) { bestDot = d; best = i; } });
    return best;
  }

  /** Chọn vệ tinh phục vụ và tìm tuyến tới trạm cổng (bent-pipe hoặc qua laser). */
  rebuild() {
    this.computeAll();
    const U = this.groundWorld(this.userLocal);
    const gi = this.nearestGateway();
    const G = this.groundWorld(this.gateways[gi].local);
    const fromUser = this.visibleFrom(U);
    const fromGw = new Set(this.visibleFrom(G).map(v => v.k));
    const prev = this.serving;
    if (!fromUser.length) { this.serving = null; this.route = { ok: false, reason: 'nosat', gi }; return; }

    // Ưu tiên vệ tinh thấy cả chảo lẫn trạm cổng (bent-pipe); nếu không, vệ tinh cao nhất trên đầu
    fromUser.sort((a, b) => b.e - a.e);
    const bent = fromUser.find(v => fromGw.has(v.k));
    this.serving = bent ? bent.k : fromUser[0].k;
    if (prev !== null && prev !== this.serving) this.handoffs++;

    if (bent) { this.route = { ok: true, chain: [this.serving], gi }; return; }
    if (!this.laserOn) { this.route = { ok: false, reason: 'nogateway', gi }; return; }

    // Nhảy laser tham lam: mỗi bước chọn vệ tinh trong tầm gần trạm cổng nhất
    const target = G.clone().normalize().multiplyScalar(EARTH_R + 0.55);
    const chain = [this.serving], used = new Set(chain);
    const cur = new THREE.Vector3(), cand = new THREE.Vector3();
    for (let hop = 0; hop < MAX_CHAIN - 1; hop++) {
      const last = chain[chain.length - 1];
      if (fromGw.has(last)) { this.route = { ok: true, chain, gi }; return; }
      this.sat(last, cur);
      let best = -1, bestD = cur.distanceTo(target);
      for (let k = 0; k < this.sats.length; k++) {
        if (used.has(k)) continue;
        this.sat(k, cand);
        if (cand.distanceTo(cur) > ISL_RANGE) continue;
        const d = cand.distanceTo(target);
        if (d < bestD) { bestD = d; best = k; }
      }
      if (best < 0) break;
      chain.push(best);
      used.add(best);
    }
    this.route = fromGw.has(chain[chain.length - 1]) ? { ok: true, chain, gi } : { ok: false, reason: 'noroute', gi };
  }

  /** Kiểm tra tuyến hiện tại còn dùng được khi vệ tinh và Trái Đất đã di chuyển. */
  routeValid(U, G, pts) {
    if (!this.route.ok) return false;
    if (StarlinkScene.elevation(U, pts[0]) < MIN_ELEV) return false;
    if (StarlinkScene.elevation(G, pts[pts.length - 1]) < MIN_ELEV) return false;
    for (let k = 1; k < pts.length; k++) if (pts[k].distanceTo(pts[k - 1]) > ISL_RANGE * 1.15) return false;
    return true;
  }

  // ───────── Vẽ
  setPositions(lineObj, pts) {
    const a = lineObj.geometry.attributes.position;
    pts.forEach((p, k) => a.setXYZ(k, p.x, p.y, p.z));
    a.needsUpdate = true;
    lineObj.geometry.setDrawRange(0, pts.length);
  }

  arc(aLocal, bLocal, n, r) {
    const pts = [], ang = aLocal.angleTo(bLocal);
    for (let k = 0; k < n; k++) {
      const f = k / (n - 1);
      const p = ang < 1e-6 ? aLocal.clone()
        : aLocal.clone().multiplyScalar(Math.sin((1 - f) * ang)).addScaledVector(bLocal, Math.sin(f * ang)).divideScalar(Math.sin(ang));
      pts.push(p.normalize().multiplyScalar(r).applyMatrix4(this.earth.matrixWorld));
    }
    return pts;
  }

  update(ms, dt = 0) {
    super.update(ms);
    this.earth.updateMatrixWorld(true);
    this.tSec = (ms - this.t0) / 1000;
    this.clock += dt;
    this.ms = ms;
    if (!this.userLocal || !this.serverLocal) return;

    this.occludeGroundLabels();
    const slot = slotOf(ms);
    if (slot !== this.slot) { this.slot = slot; this.rebuild(); }

    const U = this.groundWorld(this.userLocal);
    const gi = this.route.gi ?? this.nearestGateway();
    const G = this.groundWorld(this.gateways[gi].local);
    let pts = this.route.ok ? this.route.chain.map(k => keplerPosition(this.sats[k], this.tSec, new THREE.Vector3())) : [];
    if (this.route.ok && !this.routeValid(U, G, pts)) {
      this.rebuild();
      pts = this.route.ok ? this.route.chain.map(k => keplerPosition(this.sats[k], this.tSec, new THREE.Vector3())) : [];
    }

    const ok = this.route.ok;
    this.rfLine.visible = this.laserLine.visible = this.fiberLine.visible = ok;
    this.packets.forEach(p => { p.visible = ok; });
    this.chainSprites.forEach((s, k) => { s.visible = ok && k < pts.length; if (s.visible) s.position.copy(pts[k]); });

    // vùng phủ của vệ tinh phục vụ (kể cả khi chưa có tuyến tới trạm cổng)
    const servingPos = this.serving !== null ? keplerPosition(this.sats[this.serving], this.tSec, new THREE.Vector3()) : null;
    this.footprint.visible = !!servingPos;
    if (servingPos) this.drawFootprint(servingPos);
    if (!ok) { this.stats = null; return; }

    const last = pts[pts.length - 1];
    this.setPositions(this.rfLine, [U, pts[0], last, G]);
    this.setPositions(this.laserLine, pts);
    this.laserLine.visible = pts.length > 1;
    const fiberPts = this.arc(this.gateways[gi].local, this.serverLocal, ARC_N, EARTH_R * 1.004);
    this.setPositions(this.fiberLine, fiberPts);

    // gói tin chạy dọc toàn tuyến: đi (xanh lam) và về (xanh lá)
    const path = [U, ...pts, G, ...fiberPts];
    const cum = [0];
    for (let k = 1; k < path.length; k++) cum.push(cum[k - 1] + path[k].distanceTo(path[k - 1]));
    const total = cum[cum.length - 1];
    const at = f => {
      const d = f * total;
      let k = 1;
      while (k < cum.length - 1 && cum[k] < d) k++;
      const seg = cum[k] - cum[k - 1] || 1;
      return path[k - 1].clone().lerp(path[k], (d - cum[k - 1]) / seg);
    };
    this.packets.forEach((p, k) => {
      const f = (this.clock * 0.28 + (k % 5) / 5) % 1;
      p.position.copy(at(k < 5 ? f : 1 - f));
    });

    this.applyStep();

    // độ trễ lan truyền
    const km = v => v * 1000;
    const upKm = km(U.distanceTo(pts[0]));
    let laserKm = 0;
    for (let k = 1; k < pts.length; k++) laserKm += km(pts[k].distanceTo(pts[k - 1]));
    const downKm = km(last.distanceTo(G));
    const groundKm = this.gateways[gi].local.angleTo(this.serverLocal) * R_EARTH_KM * ROUTE_FACTOR;
    const directKm = this.userLocal.angleTo(this.serverLocal) * R_EARTH_KM * ROUTE_FACTOR;
    const oneWay = (upKm + laserKm + downKm) / C + (groundKm * FIBER_INDEX) / C;
    this.stats = {
      upKm, laserKm, downKm, groundKm, hops: pts.length - 1,
      rtt: 2 * oneWay,
      rttFiber: (2 * directKm * FIBER_INDEX) / C,
      rttGeo: 2 * ((2 * GEO_SLANT_KM) / C + (groundKm * FIBER_INDEX) / C),
      elev: StarlinkScene.elevation(U, pts[0]) / deg,
    };
  }

  drawFootprint(sPos) {
    const n = sPos.clone().normalize();
    const h = sPos.length();
    const theta = Math.acos((EARTH_R * Math.cos(MIN_ELEV)) / h) - MIN_ELEV;   // góc tâm của vùng phủ
    const u = new THREE.Vector3().crossVectors(n, new THREE.Vector3(0, 1, 0));
    if (u.lengthSq() < 1e-6) u.set(1, 0, 0);
    u.normalize();
    const v = new THREE.Vector3().crossVectors(n, u);
    const pts = [];
    for (let k = 0; k < 97; k++) {
      const a = (k / 97) * Math.PI * 2;
      pts.push(n.clone().multiplyScalar(Math.cos(theta))
        .addScaledVector(u, Math.sin(theta) * Math.cos(a)).addScaledVector(v, Math.sin(theta) * Math.sin(a))
        .multiplyScalar(EARTH_R * 1.004));
    }
    this.setPositions(this.footprint, pts);
  }

  /** Làm nổi bật phần tuyến ứng với bước đang chọn trong bảng giải thích. */
  applyStep() {
    const focus = {
      user: ['rf'], serving: ['rf', 'foot'], handoff: ['foot'], laser: ['laser'], gateway: ['rf', 'gw'], fiber: ['fiber'],
    }[this.step];
    const op = key => (!focus || focus.includes(key) ? 1 : 0.15);
    const pulse = 0.75 + 0.25 * Math.sin(this.clock * 6);
    this.rfLine.material.opacity = op('rf') * (focus?.includes('rf') ? pulse : 1);
    this.laserLine.material.opacity = op('laser') * (focus?.includes('laser') ? pulse : 1);
    this.fiberLine.material.opacity = op('fiber') * (focus?.includes('fiber') ? pulse : 1);
    this.footprint.material.opacity = 0.55 * op('foot');
    this.gateways.forEach(g => { g.sprite.scale.setScalar((g.real ? 0.03 : 0.022) * (focus?.includes('gw') ? 1.6 * pulse : 1)); });
  }

  /** Ẩn nhãn của các điểm mặt đất đang ở mặt khuất của Trái Đất (CSS2D không bị che bởi mô hình 3D). */
  occludeGroundLabels() {
    const cam = this.engine.camera.position;
    const p = new THREE.Vector3();
    const check = (sprite, label) => {
      sprite.getWorldPosition(p);
      label.visible = p.clone().normalize().dot(cam.clone().sub(p).normalize()) > 0.05;
    };
    this.gateways.forEach(g => { if (g.sprite.children[0]) check(g.sprite, g.sprite.children[0]); });
    check(this.userMarker, this.userLabel);
    check(this.serverMarker, this.serverLabel);
  }

  /** Trạng thái hiển thị trong bảng. */
  status() {
    const gi = this.route.gi ?? (this.userLocal ? this.nearestGateway() : 0);
    return {
      ok: this.route.ok, reason: this.route.reason,
      serving: this.serving, countdown: countdownOf(this.ms ?? Date.now()), handoffs: this.handoffs,
      gateway: this.gateways[gi], stats: this.stats, user: this.user,
    };
  }
}
