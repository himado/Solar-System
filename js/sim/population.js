// Sinh quần thể vệ tinh và rác vũ trụ có phân bố gần với thực tế (10/2026).
// Không phải vị trí thật: chỉ đúng về độ cao, góc nghiêng, số lượng tương đối.

export const R_EARTH_KM = 6371;
export const MU = 398600.4418;             // km³/s²
export const EARTH_ROT = 7.2921159e-5;     // rad/s (ngày sao)

// Chỉ số loại, dùng chung với shader và các nút bật/tắt lớp
export const TYPES = ['starlink', 'leo', 'sso', 'meo', 'geo', 'heo', 'debris'];
export const TYPE_COLORS = {
  starlink: '#5ad1ff', leo: '#9ab8ff', sso: '#7cf29a', meo: '#ffcf5c', geo: '#ff7ab6', heo: '#c792ff', debris: '#ff8a5c',
};
const T = Object.fromEntries(TYPES.map((k, i) => [k, i]));

const deg = Math.PI / 180;

// RNG có hạt giống để mỗi lần tải trang cho cùng một hình
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePopulation(gmst0) {
  const rnd = mulberry32(20261029);
  const U = (a, b) => a + (b - a) * rnd();
  const N = (m, s) => m + s * Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
  const objs = [];
  const counts = Object.fromEntries(TYPES.map(k => [k, 0]));

  const push = (type, { a, e = 0, i, raan = U(0, 360), argp = U(0, 360), M0 = U(0, 360), n }) => {
    const aKm = a;
    objs.push([aKm, e, i * deg, raan * deg, argp * deg, M0 * deg, n ?? Math.sqrt(MU / aKm ** 3), T[type]]);
    counts[type]++;
  };
  const circ = (type, altKm, inc, extra = {}) => push(type, { a: R_EARTH_KM + altKm, i: inc, ...extra });
  const ellip = (type, perigee, apogee, inc, extra = {}) => {
    const rp = R_EARTH_KM + perigee, ra = R_EARTH_KM + apogee;
    push(type, { a: (rp + ra) / 2, e: (ra - rp) / (ra + rp), i: inc, ...extra });
  };
  // Chòm vệ tinh: P mặt phẳng, mỗi mặt S vệ tinh cách đều
  const walker = (type, altKm, inc, P, S, jitter = 0) => {
    for (let p = 0; p < P; p++) for (let s = 0; s < S; s++) {
      circ(type, altKm + U(-jitter, jitter), inc, { raan: (360 * p) / P, argp: 0, M0: (360 * s) / S + (p * 360) / (P * S) * 0.5 });
    }
  };

  // ── Starlink (~11.000)
  walker('starlink', 550, 53.0, 72, 22, 2);
  walker('starlink', 540, 53.2, 72, 22, 2);
  walker('starlink', 570, 70.0, 36, 20, 2);
  walker('starlink', 560, 97.6, 10, 52, 3);
  walker('starlink', 530, 43.0, 48, 70, 3);
  walker('starlink', 525, 53.0, 48, 50, 3);
  for (let k = 0; k < 900; k++) circ('starlink', U(300, 520), rnd() < 0.5 ? 53 : 43); // đang nâng/hạ quỹ đạo

  // ── LEO khác
  walker('leo', 1200, 87.9, 18, 36, 5);          // OneWeb
  walker('leo', 780, 86.4, 6, 11, 2);             // Iridium NEXT
  walker('leo', 1414, 52.0, 8, 6, 3);             // Globalstar
  for (let k = 0; k < 400; k++) circ('leo', U(1000, 1160), rnd() < 0.6 ? 89 : U(50, 60)); // Qianfan, Guowang…
  for (let k = 0; k < 1600; k++) {               // cubesat, vệ tinh nghiên cứu, quân sự…
    const inc = rnd() < 0.35 ? N(51.6, 1.5) : U(5, 100);
    circ('leo', U(350, 750), inc);
  }

  // ── Đồng bộ Mặt Trời: quan sát Trái Đất, khí tượng
  for (let k = 0; k < 1400; k++) {
    const alt = U(450, 820);
    circ('sso', alt, 96.5 + (alt - 450) / 370 * 2.2 + N(0, 0.2));
  }

  // ── MEO: các hệ định vị
  walker('meo', 20180, 55, 6, 5);     // GPS (31)
  circ('meo', 20180, 55);
  walker('meo', 19130, 64.8, 3, 8);   // GLONASS
  walker('meo', 23222, 56, 3, 9);     // Galileo
  walker('meo', 21528, 55, 3, 8);     // BeiDou MEO
  walker('meo', 8062, 0.05, 1, 20);   // O3b mPOWER

  // ── GEO (~600): đứng yên so với mặt đất, dày hơn trên châu Mỹ, châu Âu–Phi, châu Á
  const geoN = R_EARTH_KM + 35786;
  for (let k = 0; k < 600; k++) {
    const r = rnd();
    const lon = r < 0.3 ? N(-90, 25) : r < 0.55 ? N(15, 25) : r < 0.9 ? N(115, 25) : U(-180, 180);
    push('geo', { a: geoN, i: U(0, 0.1), raan: 0, argp: 0, M0: gmst0 / deg + lon, n: EARTH_ROT });
  }

  // ── HEO
  for (let k = 0; k < 40; k++) ellip('heo', U(500, 1000), U(39000, 40000), 63.4, { argp: 270 });
  for (let k = 0; k < 20; k++) push('heo', { a: 42164, e: 0.27, i: 63.4, argp: 270 });

  // ── Rác vũ trụ được theo dõi (~29.000)
  for (let k = 0; k < 9000; k++) {               // dải đông nhất 700–1.000 km
    const r = rnd();
    const inc = r < 0.5 ? N(98, 1.5) : r < 0.7 ? U(65, 83) : U(30, 100);
    ellip('debris', ...ecc(N(820, 110), U(0, 60)), inc);
  }
  for (let k = 0; k < 3500; k++) ellip('debris', ...ecc(N(850, 120), U(0, 120)), N(98.6, 0.6)); // Phong Vân-1C (2007)
  for (let k = 0; k < 2000; k++) ellip('debris', ...ecc(N(790, 70), U(0, 60)), rnd() < 0.5 ? 86.4 : 74);  // Iridium–Kosmos (2009)
  for (let k = 0; k < 6000; k++) ellip('debris', ...ecc(U(380, 1500), U(0, 150)), U(0, 102));
  for (let k = 0; k < 2000; k++) ellip('debris', ...ecc(rnd() < 0.5 ? N(1450, 50) : N(1050, 50), U(0, 40)), U(50, 100));
  for (let k = 0; k < 3000; k++) ellip('debris', U(200, 700), U(30000, 36500), rnd() < 0.7 ? U(5, 28) : U(0, 50)); // GTO, tầng tên lửa
  for (let k = 0; k < 2000; k++) circ('debris', U(35600, 36400), U(0, 15));    // GEO trôi dạt & nghĩa địa
  for (let k = 0; k < 1000; k++) circ('debris', U(18000, 24000), U(50, 66));   // MEO
  for (let k = 0; k < 500; k++) ellip('debris', U(400, 1200), U(36000, 40000), N(63.4, 2), { argp: 270 + N(0, 20) });

  return { objs, counts };
}

/** Trả về [cận điểm, viễn điểm] quanh độ cao trung bình với độ lệch nhỏ. */
function ecc(meanAlt, spread) {
  return [Math.max(250, meanAlt - spread), meanAlt + spread];
}

/** Vị trí Kepler (km, khung xích đạo quán tính) → Vector3 cảnh: (x, z, −y). */
export function keplerPosition({ a, e, i, raan, argp, M0, n }, tSec, out) {
  let M = (M0 + n * tSec) % (2 * Math.PI);
  let E = M;
  for (let k = 0; k < 6; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cO = Math.cos(raan), sO = Math.sin(raan), cw = Math.cos(argp), sw = Math.sin(argp), ci = Math.cos(i), si = Math.sin(i);
  const x = (cO * cw - sO * sw * ci) * xp + (-cO * sw - sO * cw * ci) * yp;
  const y = (sO * cw + cO * sw * ci) * xp + (-sO * sw + cO * cw * ci) * yp;
  const z = sw * si * xp + cw * si * yp;
  return out.set(x, z, -y);
}
