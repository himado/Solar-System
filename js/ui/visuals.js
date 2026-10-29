// Hình minh họa SVG: mặt cắt cấu trúc, so sánh kích thước, thang độ cao quỹ đạo.
import { t, fmt } from '../i18n.js';
import { REGIMES } from '../data/orbits.js';

/** Mặt cắt dạng "miếng bánh bị cắt một phần tư": các lớp lộ ra trong góc khuyết. */
export function structureSVG(body) {
  const R = 120, cx = 130, cy = 130;
  // Lớp mỏng (như vỏ Trái Đất) được nới ra tối thiểu 4% để vẫn nhìn thấy
  const radii = [];
  let prev = 0;
  for (const layer of body.layers) {
    let r = layer.r;
    if (r - prev < 0.04) r = Math.min(1, prev + 0.04);
    radii.push(r);
    prev = r;
  }
  const scale = 1 / radii[radii.length - 1];
  const surface = body.layers[body.layers.length - 1].color;

  let wedge = '';
  for (let k = radii.length - 1; k >= 0; k--) {
    const r = radii[k] * scale * R;
    wedge += `<path d="M${cx},${cy} L${cx + r},${cy} A${r},${r} 0 0,0 ${cx},${cy - r} Z" fill="${body.layers[k].color}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`;
  }
  return `
  <svg class="structure-svg" viewBox="0 0 260 260" role="img" aria-label="${t(body.name)}">
    <defs>
      <radialGradient id="shade" cx="35%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#fff" stop-opacity=".25"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".55"/>
      </radialGradient>
    </defs>
    <path d="M${cx},${cy} L${cx + R},${cy} A${R},${R} 0 1,1 ${cx},${cy - R} Z" fill="${surface}"/>
    <path d="M${cx},${cy} L${cx + R},${cy} A${R},${R} 0 1,1 ${cx},${cy - R} Z" fill="url(#shade)"/>
    ${wedge}
  </svg>`;
}

export function layersLegend(body) {
  return `<ol class="layers">${[...body.layers].reverse().map(l => `
    <li><span class="swatch" style="background:${l.color}"></span>
      <div><strong>${t(l.name)}</strong><span>${t(l.desc)}</span></div></li>`).join('')}</ol>`;
}

/** Hai hình tròn theo đúng tỉ lệ bán kính: thiên thể và Trái Đất. */
export function sizeCompareSVG(body, earth) {
  if (body.id === 'earth') return '';
  const W = 300, H = 140, maxR = 52;
  const big = Math.max(body.radiusKm, earth.radiusKm);
  let rb = (body.radiusKm / big) * maxR, re = (earth.radiusKm / big) * maxR;
  rb = Math.max(rb, 0.8); re = Math.max(re, 0.8);
  const cxB = 20 + rb, cxE = cxB + rb + 30 + re;
  const ratio = body.radiusKm / earth.radiusKm;
  const ratioText = ratio >= 1 ? `× ${fmt(ratio, ratio < 10 ? 2 : 0)}` : `× ${fmt(ratio, ratio < 0.01 ? 4 : 3)}`;
  return `
  <svg class="compare-svg" viewBox="0 0 ${W} ${H}">
    <circle cx="${cxB}" cy="${H / 2 - 10}" r="${rb}" fill="${body.color}"/>
    <circle cx="${Math.min(cxE, W - re - 4)}" cy="${H / 2 - 10}" r="${re}" fill="#4b8bd6"/>
    <text x="${cxB}" y="${H - 4}" text-anchor="middle">${t(body.name)}</text>
    <text x="${Math.min(cxE, W - re - 4)}" y="${H - 4}" text-anchor="middle">${t(earth.name)}</text>
  </svg>
  <p class="muted small">${t({ vi: 'Bán kính so với Trái Đất', en: 'Radius relative to Earth' })}: <strong>${ratioText}</strong></p>`;
}

/** Thang độ cao logarit 150 km → 45.000 km, tô màu các vòng quỹ đạo. */
export function altitudeLadderSVG() {
  const W = 320, H = 300, top = 16, bottom = H - 20, x0 = 92;
  const lo = Math.log10(150), hi = Math.log10(45000);
  const y = km => bottom - ((Math.log10(km) - lo) / (hi - lo)) * (bottom - top);
  const ticks = [200, 500, 1000, 2000, 5000, 10000, 20000, 35786];
  const bands = [
    { id: 'leo', from: 160, to: 2000, col: 0 },
    { id: 'sso', from: 500, to: 900, col: 1 },
    { id: 'meo', from: 2000, to: 35786, col: 0 },
    { id: 'heo', from: 500, to: 40000, col: 2 },
  ];
  const bandW = 34;
  let svg = `<svg class="ladder-svg" viewBox="0 0 ${W} ${H}">`;
  for (const tk of ticks) {
    svg += `<line x1="${x0 - 4}" x2="${x0 + 3 * (bandW + 6)}" y1="${y(tk)}" y2="${y(tk)}" class="grid"/>
            <text x="${x0 - 8}" y="${y(tk) + 4}" text-anchor="end">${fmt(tk)} km</text>`;
  }
  for (const b of bands) {
    const r = REGIMES.find(g => g.id === b.id);
    const x = x0 + b.col * (bandW + 6);
    svg += `<rect data-regime="${b.id}" x="${x}" y="${y(b.to)}" width="${bandW}" height="${y(b.from) - y(b.to)}" rx="5" fill="${r.color}" fill-opacity=".35" stroke="${r.color}"/>
            <text x="${x + bandW / 2}" y="${(y(b.to) + y(b.from)) / 2 + 4}" text-anchor="middle" class="band">${b.id.toUpperCase()}</text>`;
  }
  const geo = REGIMES.find(g => g.id === 'geo');
  svg += `<line x1="${x0}" x2="${x0 + 3 * (bandW + 6) - 6}" y1="${y(35786)}" y2="${y(35786)}" stroke="${geo.color}" stroke-width="4" data-regime="geo"/>
          <text x="${x0 + 3 * (bandW + 6)}" y="${y(35786) + 4}" class="band">GEO</text>
          <text x="${x0 + 3 * (bandW + 6)}" y="${y(408) + 4}" class="note">ISS</text>
          <line x1="${x0}" x2="${x0 + 3 * (bandW + 6) - 6}" y1="${y(408)}" y2="${y(408)}" stroke="#fff" stroke-dasharray="3 3"/>
          <text x="${x0 + 3 * (bandW + 6)}" y="${y(550) - 4}" class="note">Starlink</text>
          <text x="${x0 + 3 * (bandW + 6)}" y="${y(20180) + 4}" class="note">GPS</text>
          <line x1="${x0}" x2="${x0 + 3 * (bandW + 6) - 6}" y1="${y(20180)}" y2="${y(20180)}" stroke="#ffcf5c" stroke-dasharray="3 3"/>`;
  svg += '</svg>';
  return svg;
}

/** Phổ điện từ: dải màu theo bước sóng và cột thể hiện mức xuyên qua khí quyển. */
export function spectrumSVG(bands) {
  const W = 340, top = 8, barH = 70, n = bands.length, bw = W / n;
  let svg = `<svg class="spectrum-svg" viewBox="0 0 ${W} 150">
    <defs><linearGradient id="rainbow" x1="0" x2="1">
      <stop offset="0" stop-color="#8b5cff"/><stop offset=".2" stop-color="#3b82ff"/><stop offset=".4" stop-color="#22c55e"/>
      <stop offset=".6" stop-color="#facc15"/><stop offset=".8" stop-color="#fb923c"/><stop offset="1" stop-color="#ef4444"/>
    </linearGradient></defs>
    <text x="0" y="${top + 8}" class="axis">${t({ vi: '↓ Xuyên qua khí quyển', en: '↓ Reaches the ground' })}</text>`;
  bands.forEach((b, i) => {
    const x = i * bw, h = Math.max(2, b.pass * barH);
    const fill = b.color === 'rainbow' ? 'url(#rainbow)' : b.color;
    svg += `<rect x="${x + 3}" y="${top + 14 + barH - h}" width="${bw - 6}" height="${h}" rx="3" fill="${fill}" opacity="${0.35 + 0.65 * b.pass}"><title>${t(b.note)}</title></rect>
      <rect x="${x + 1}" y="${top + 92}" width="${bw - 2}" height="8" fill="${fill}"/>
      <text x="${x + bw / 2}" y="${top + 116}" text-anchor="middle" class="band-name">${t(b.name)}</text>
      <text x="${x + bw / 2}" y="${top + 130}" text-anchor="middle" class="axis">${b.range}</text>`;
  });
  svg += `<text x="0" y="${top + 145}" class="axis">← ${t({ vi: 'bước sóng ngắn, năng lượng cao', en: 'short wavelength, high energy' })}</text>
    <text x="${W}" y="${top + 145}" text-anchor="end" class="axis">${t({ vi: 'bước sóng dài', en: 'long wavelength' })} →</text></svg>`;
  return svg;
}

/** Hình Mặt Trăng nhìn từ Bắc bán cầu theo tuổi trăng (rad, 0 = trăng non). */
export function moonPhaseSVG(age, size = 84) {
  const r = size / 2 - 2, c = size / 2;
  const waxing = age < Math.PI;
  const k = Math.cos(age);                   // 1: non, −1: tròn
  const rx = Math.abs(k) * r;
  const sweepOuter = waxing ? 1 : 0;          // nửa sáng: bên phải khi trăng đầu tháng
  const sweepInner = (k > 0) === waxing ? 0 : 1;
  const d = `M${c},${c - r} A${r},${r} 0 0,${sweepOuter} ${c},${c + r} A${rx},${r} 0 0,${sweepInner} ${c},${c - r} Z`;
  return `<svg class="phase-svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${c}" cy="${c}" r="${r}" fill="#1c2233" stroke="rgba(255,255,255,.15)"/>
    <path d="${d}" fill="#f1ecdf"/></svg>`;
}
