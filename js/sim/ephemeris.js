// Vị trí gần đúng của Mặt Trời và Mặt Trăng (công thức độ chính xác thấp của Astronomical Almanac,
// sai số cỡ 0,3°). Khung cảnh: trục y hướng cực Bắc thiên cầu, x hướng điểm xuân phân, như cảnh quỹ đạo.
import { daysSinceJ2000 } from '../core/engine.js';

const deg = Math.PI / 180;
export const OBLIQUITY = 23.439 * deg;

/** Kinh độ hoàng đạo của Mặt Trời (rad). */
export function sunEclipticLon(ms) {
  const d = daysSinceJ2000(ms);
  const g = (357.529 + 0.98560028 * d) * deg;
  const q = 280.459 + 0.98564736 * d;
  return (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * deg;
}

/** Toạ độ hoàng đạo của Mặt Trăng: kinh độ, vĩ độ (rad) và khoảng cách (km). */
export function moonEcliptic(ms) {
  const d = daysSinceJ2000(ms);
  const Lm = 218.316 + 13.176396 * d;
  const M = (134.963 + 13.064993 * d) * deg;
  const F = (93.272 + 13.22935 * d) * deg;
  const D = (297.85 + 12.190749 * d) * deg;
  const lambda = (Lm + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * D - M) + 0.658 * Math.sin(2 * D)) * deg;
  const beta = 5.128 * Math.sin(F) * deg;
  const distKm = 385001 - 20905 * Math.cos(M);
  return { lambda, beta, distKm };
}

/** Hướng đơn vị từ toạ độ hoàng đạo sang khung cảnh (x, z_xích đạo, −y_xích đạo). */
export function eclToScene(lambda, beta, out) {
  const x = Math.cos(beta) * Math.cos(lambda), y = Math.cos(beta) * Math.sin(lambda), z = Math.sin(beta);
  const ye = y * Math.cos(OBLIQUITY) - z * Math.sin(OBLIQUITY);
  const ze = y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY);
  return out.set(x, ze, -ye);
}

/** Hướng Mặt Trời trong khung cảnh. */
export function sunDirection(ms, out) {
  return eclToScene(sunEclipticLon(ms), 0, out);
}

/** Độ xích vĩ Mặt Trời (rad): vĩ độ nơi Mặt Trời đứng bóng lúc trưa. */
export function sunDeclination(ms) {
  return Math.asin(Math.sin(OBLIQUITY) * Math.sin(sunEclipticLon(ms)));
}

/** Tuổi trăng (rad, 0 = trăng non, π = trăng tròn) và phần đĩa được chiếu sáng (0–1). */
export function moonPhase(ms) {
  const age = (((moonEcliptic(ms).lambda - sunEclipticLon(ms)) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return { age, illum: (1 - Math.cos(age)) / 2 };
}
