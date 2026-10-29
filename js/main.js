import * as THREE from 'three';
import { Engine } from './core/engine.js';
import { OverviewScene } from './scenes/overview.js';
import { SystemScene } from './scenes/system.js';
import { EarthOrbitScene, EARTH_R } from './scenes/earthOrbit.js';
import { InteractionsScene } from './scenes/interactions.js';
import { StarlinkScene } from './scenes/starlink.js';
import { SL_STATS, SL_STEPS, SL_VIETNAM, SL_USERS, SL_SERVERS, SL_NOTE, SL_SOURCES } from './data/starlink.js';
import { SAT_MODELS } from './data/satModels.js';
import { TOPICS, TOPIC_GROUPS, ECLIPSES, SPECTRUM, INTERACTION_SOURCES, phaseName } from './data/interactions.js';
import { sunEclipticLon } from './sim/ephemeris.js';
import { SatViewer } from './ui/satViewer.js';
import { BODIES, BY_ID, PLANETS, childrenOf } from './data/bodies.js';
import { REGIMES, FEATURED, HEADLINE_STATS, DEBRIS_INFO, SOURCES, STATS_DATE } from './data/orbits.js';
import { TYPES, TYPE_COLORS } from './sim/population.js';
import { t, fmt, getLang, setLang, onLangChange, LAYER_LABELS } from './i18n.js';
import { structureSVG, layersLegend, sizeCompareSVG, altitudeLadderSVG, spectrumSVG, moonPhaseSVG } from './ui/visuals.js';

const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SPEEDS = [
  [1 / 86400, { vi: 'Thời gian thực', en: 'Real time' }],
  [1 / 1440, { vi: '1 phút/giây', en: '1 min/sec' }],
  [1 / 144, { vi: '10 phút/giây', en: '10 min/sec' }],
  [1 / 24, { vi: '1 giờ/giây', en: '1 hour/sec' }],
  [0.25, { vi: '6 giờ/giây', en: '6 hours/sec' }],
  [1, { vi: '1 ngày/giây', en: '1 day/sec' }],
  [7, { vi: '1 tuần/giây', en: '1 week/sec' }],
  [30, { vi: '1 tháng/giây', en: '1 month/sec' }],
  [365, { vi: '1 năm/giây', en: '1 year/sec' }],
];
const DEFAULT_SPEED = { overview: 6, system: 4, earth: 2, interact: 4, starlink: 0 };
const MAX_SPEED = { overview: 8, system: 6, earth: 5, interact: 6, starlink: 2 };

const state = {
  mode: 'solar',          // 'solar' | 'earth' | 'interact'
  view: 'overview',       // 'overview' | 'system' | 'earth' | 'interact'
  topic: 'light',         // chủ đề trong chế độ tương tác
  sl: { user: 'hanoi', custom: null, server: 'sg', laser: true, step: null },  // phần Starlink
  systemId: null,
  selected: null,         // id thiên thể hoặc vệ tinh nhân tạo
  tab: 'overview',
  eoTab: 'rings',
  focusRegime: null,
  following: false,
  showShells: true,
  speedIdx: DEFAULT_SPEED.overview,
  playing: true,
  ms: Date.now(),
};

const engine = new Engine($('#viewport'));
// màn hình dọc (điện thoại) cần lùi camera xa hơn để thấy trọn thiên thể
const viewFactor = () => (engine.camera.aspect < 1 ? 1.8 : 1);
const handlers = { onSelect: id => selectBody(id) };
const earthHandlers = { onSelect: id => selectSatellite(id) };
let satViewer = null;  // tạo khi lần đầu cần xem mô hình vệ tinh

// ───────────────────────── Chuyển cảnh

function fadeSwap(fn) {
  const fade = $('#fade');
  fade.classList.add('on');
  setTimeout(() => { fn(); requestAnimationFrame(() => fade.classList.remove('on')); }, 220);
}

function showOverview(selectId = null) {
  state.mode = 'solar'; state.view = 'overview'; state.systemId = null; state.selected = selectId;
  state.speedIdx = DEFAULT_SPEED.overview;
  const scene = new OverviewScene(engine, handlers);
  engine.setScene(scene);
  scene.update(state.ms, 0, 0);
  engine.controls.minDistance = 5;
  engine.controls.maxDistance = 600;
  engine.controls.target.set(0, 0, 0);
  engine.camera.position.set(0, 170, 150);
  if (selectId) scene.highlight(selectId);
  updateHash();
  renderAll();
}

function showSystem(centerId, focusId = centerId) {
  state.mode = 'solar'; state.view = 'system'; state.systemId = centerId; state.selected = focusId;
  state.speedIdx = DEFAULT_SPEED.system;
  const scene = new SystemScene(engine, centerId, state.ms, handlers);
  engine.setScene(scene);
  scene.update(state.ms, 0, 0);
  engine.controls.minDistance = 0.6;
  engine.controls.maxDistance = Math.max(120, scene.extent * 3);
  engine.controls.target.set(0, 0, 0);
  engine.camera.position.set(6, 5, 22).normalize().multiplyScalar((BY_ID[centerId].rings ? 40 : 28) * viewFactor());
  if (focusId !== centerId) focusInSystem(focusId, 0.01);
  scene.highlight(focusId);
  syncCutaway(0.01);
  updateHash();
  renderAll();
}

/** Bật mặt cắt 3D khi đang ở tab Cấu trúc, và xoay camera về phía múi bị khoét. */
function syncCutaway(duration = 1.2) {
  if (state.view !== 'system') return;
  const scene = engine.scene;
  const id = state.tab === 'structure' ? state.selected : null;
  if ((scene.cutaway?.id ?? null) === id) return;
  scene.setCutaway(id);
  if (!id) return;
  const isCenter = id === scene.centerId;
  const dir = scene.cutawayViewDir(id);
  const dist = (isCenter ? (BY_ID[id].rings ? 34 : 22) : Math.max(scene.sizeOf(id) * 6, 2.5)) * viewFactor();
  engine.flyTo(() => scene.positionOf(id), dist, { duration, follow: !isCenter, direction: dir });
}

function showInteractions(topic = state.topic) {
  state.mode = 'interact'; state.view = 'interact'; state.selected = null; state.topic = topic;
  state.speedIdx = DEFAULT_SPEED.interact;
  const scene = new InteractionsScene(engine, state.ms);
  engine.setScene(scene);
  engine.controls.minDistance = 4;
  engine.controls.maxDistance = 500;
  engine.controls.target.set(0, 0, 0);
  engine.camera.position.set(40, 30, 60);
  setTopic(topic, 0.01);
  renderAll();
}

function showStarlink() {
  state.mode = 'starlink'; state.view = 'starlink'; state.selected = null;
  state.speedIdx = DEFAULT_SPEED.starlink;
  state.ms = Date.now();
  const scene = new StarlinkScene(engine, state.ms, {
    onUserPick: (lat, lon) => { state.sl.user = 'custom'; state.sl.custom = { lat, lon }; renderPanel(); },
  });
  engine.setScene(scene);
  engine.controls.minDistance = EARTH_R * 1.08;
  engine.controls.maxDistance = 120;
  engine.controls.target.set(0, 0, 0);
  engine.camera.position.set(0, 10, 30);
  applyStarlinkSettings(true);
  renderAll();
}

function slUser() {
  return state.sl.user === 'custom' ? { name: { vi: 'Điểm bạn chọn', en: 'Your pick' }, ...state.sl.custom } : SL_USERS.find(u => u.id === state.sl.user);
}

/** Đẩy lựa chọn trong bảng vào cảnh; fly = true để camera bay tới vị trí người dùng. */
function applyStarlinkSettings(fly = false) {
  const scene = engine.scene;
  const u = slUser();
  scene.setUser(u.lat, u.lon);
  scene.setServer(SL_SERVERS.find(s => s.id === state.sl.server));
  scene.setLaser(state.sl.laser);
  scene.setStep(state.sl.step);
  scene.update(state.ms, 0);
  if (fly) {
    const dir = scene.groundWorld(scene.userLocal).normalize().add(new THREE.Vector3(0, 0.25, 0));
    engine.flyTo(() => new THREE.Vector3(), 15 * viewFactor(), { duration: 1.4, follow: false, direction: dir });
  }
  lastLive = '';
  updateHash();
}

function setTopic(topic, duration = 1.4) {
  state.topic = topic;
  const scene = engine.scene;
  scene.setTopic(topic);
  const cam = scene.cameraFor(topic);
  const offset = cam.position.clone().sub(cam.target);
  engine.flyTo(() => cam.target, offset.length() * viewFactor(), { duration, follow: false, direction: offset });
  lastLive = '';
  updateHash();
}

function showEarthOrbit(satId = null) {
  state.mode = 'earth'; state.view = 'earth'; state.selected = satId; state.following = false;
  state.speedIdx = DEFAULT_SPEED.earth;
  state.ms = Date.now();
  const scene = new EarthOrbitScene(engine, state.ms, earthHandlers);
  engine.setScene(scene);
  scene.update(state.ms);
  scene.setShellsVisible(state.showShells);
  scene.setFocusTypes(regimeTypes(state.focusRegime));
  engine.controls.minDistance = EARTH_R * 1.08;
  engine.controls.maxDistance = 400;
  engine.controls.target.set(0, 0, 0);
  engine.camera.position.set(30, 32, 85).multiplyScalar(viewFactor());
  if (satId) selectSatellite(satId, { fly: true });
  updateHash();
  renderAll();
}

function focusInSystem(id, duration = 1.2) {
  const scene = engine.scene;
  const size = scene.sizeOf(id);
  const isCenter = id === scene.centerId;
  engine.flyTo(() => scene.positionOf(id), (isCenter ? (BY_ID[id].rings ? 40 : 28) : Math.max(size * 7, 3)) * viewFactor(), { duration, follow: !isCenter });
}

function selectBody(id) {
  const body = BY_ID[id];
  if (!body) return;
  const systemOf = body.kind === 'moon' ? body.parent : id;
  if (state.view === 'system' && state.systemId === systemOf) {
    state.selected = id;
    engine.scene.highlight(id);
    focusInSystem(id);
    syncCutaway();
    updateHash();
    renderAll();
  } else if (state.view === 'overview' && body.kind !== 'moon') {
    // bay tới hành tinh trong toàn cảnh rồi chuyển vào cận cảnh
    state.selected = id;
    engine.scene.highlight(id);
    const scene = engine.scene;
    engine.flyTo(() => scene.positionOf(id), scene.sizeOf(id) * 5, { duration: 0.9 });
    renderAll();
    setTimeout(() => { if (engine.scene === scene) fadeSwap(() => showSystem(systemOf, id)); }, 850);
  } else {
    fadeSwap(() => showSystem(systemOf, id));
  }
}

function selectSatellite(id, { fly = true } = {}) {
  const scene = engine.scene;
  state.selected = id;
  state.eoTab = 'featured';
  scene.select(id);
  if (fly) {
    const f = FEATURED.find(x => x.id === id);
    const alt = f.apogeeKm ?? f.altKm;
    const dist = alt > 10000 ? 22 : 4.5;
    const pos = scene.positionOf(id);
    engine.flyTo(() => scene.positionOf(id), dist, { follow: state.following, direction: pos.clone().normalize().add(new THREE.Vector3(0, 0.35, 0)) });
    if (!state.following) {
      // không bám theo: dừng ở vị trí hiện tại của vệ tinh
      const frozen = pos.clone();
      engine.fly.getTarget = () => frozen;
    }
  }
  updateHash();
  renderAll();
  // đưa thẻ vệ tinh (có mô hình 3D) lên đầu bảng
  document.querySelector('.sat-detail')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function regimeTypes(id) {
  return ({ leo: ['starlink', 'leo', 'sso'], sso: ['sso'], meo: ['meo'], geo: ['geo'], heo: ['heo'], graveyard: ['debris'] })[id] ?? null;
}

// ───────────────────────── Định dạng số liệu

function fmtDuration(hours) {
  const h = Math.abs(hours);
  if (h < 48) {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return getLang() === 'vi' ? `${hh} giờ ${mm} phút` : `${hh} h ${mm} min`;
  }
  const d = h / 24;
  if (d < 1000) return `${fmt(d, d < 10 ? 2 : 1)} ${getLang() === 'vi' ? 'ngày' : 'days'}`;
  return `${fmt(d / 365.25, 1)} ${getLang() === 'vi' ? 'năm' : 'years'}`;
}

function statRows(body) {
  const rows = [];
  rows.push([t('radius'), `${fmt(body.radiusKm, body.radiusKm < 100 ? 1 : 0)} km`]);
  rows.push([t('mass'), getLang() === 'vi' ? body.mass : body.mass.replace(',', '.')]);
  rows.push([t('gravity'), `${fmt(body.gravity, body.gravity < 1 ? 3 : 2)} m/s²`]);
  if (body.rotationH) rows.push([t('dayLength'), fmtDuration(body.rotationH) + (body.rotationH < 0 ? ` (${t('retrograde')})` : '')]);
  else if (body.kind === 'moon') rows.push([t('dayLength'), getLang() === 'vi' ? 'Bằng chu kỳ quỹ đạo (khóa thủy triều)' : 'Same as orbit (tidally locked)']);
  if (body.orbitDays) rows.push([t('yearLength'), fmtDuration(body.orbitDays * 24) + (body.orbitDays < 0 ? ` (${t('retrograde')})` : '')]);
  if (body.au) rows.push([t('distSun'), `${fmt(body.au * 149.6, 1)} ${getLang() === 'vi' ? 'triệu km' : 'million km'} (${fmt(body.au, 2)} AU)`]);
  if (body.distKm) rows.push([t('distParent'), `${fmt(body.distKm)} km`]);
  if (body.tilt !== undefined) rows.push([t('tilt'), `${fmt(body.tilt, 2)}°`]);
  rows.push([t('temperature'), t(body.temp)]);
  if (body.moonsCount !== undefined) rows.push([t('moonsCount'), fmt(body.moonsCount)]);
  if (body.composition) rows.push([t('composition'), t(body.composition)]);
  return rows;
}

const KIND_LABEL = {
  star: { vi: 'Ngôi sao', en: 'Star' },
  planet: { vi: 'Hành tinh', en: 'Planet' },
  dwarf: { vi: 'Hành tinh lùn', en: 'Dwarf planet' },
  moon: { vi: 'Vệ tinh tự nhiên', en: 'Natural moon' },
};

// ───────────────────────── Bảng thông tin thiên thể

function bodyPanel(body) {
  const moons = childrenOf(body.id);
  const tabs = ['overview', 'stats', 'structure'];
  if (body.kind !== 'star' && body.kind !== 'moon') tabs.push('moons');
  if (!tabs.includes(state.tab)) state.tab = 'overview';
  const tabLabel = { overview: 'tabOverview', stats: 'tabStats', structure: 'tabStructure', moons: 'tabMoons' };
  const parent = body.parent && body.parent !== 'sun' ? BY_ID[body.parent] : null;

  let content = '';
  if (state.tab === 'overview') {
    content = `<p class="lead">${t(body.summary)}</p>
      <h4>${t('didYouKnow')}</h4>
      <ul class="facts">${body.facts.map(f => `<li>${t(f)}</li>`).join('')}</ul>
      ${body.hasSatellites ? `<button type="button" class="cta" data-action="earth-orbit">${t('openEarthOrbit')}</button>` : ''}
      ${['sun', 'earth', 'moon'].includes(body.id) ? `<button type="button" class="cta cta-warm" data-action="interact">${t('openInteractions')}</button>` : ''}`;
  } else if (state.tab === 'stats') {
    content = `<dl class="stats">${statRows(body).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      ${body.id !== 'earth' ? `<h4>${t('sizeCompare')}</h4>${sizeCompareSVG(body, BY_ID.earth)}` : ''}`;
  } else if (state.tab === 'structure') {
    const in3D = state.view === 'system';
    content = `${in3D ? `<p class="callout info">${t('cutawayHint')}</p>` : ''}
      <div class="structure">${in3D ? '' : structureSVG(body)}${layersLegend(body)}</div>
      <p class="muted small">${t('structureNote')}</p>`;
  } else if (state.tab === 'moons') {
    content = moons.length
      ? `<p class="muted">${t('mainMoons')}: ${moons.length} ${t('ofTotal')} ${fmt(body.moonsCount)}</p>
         <ul class="moon-list">${moons.map(m => `
           <li><button type="button" data-select="${m.id}"><span class="dot" style="background:${m.color}"></span>
             <span><strong>${t(m.name)}</strong><small>${fmt(m.radiusKm, m.radiusKm < 100 ? 1 : 0)} km · ${fmtDuration(Math.abs(m.orbitDays) * 24)}</small></span></button></li>`).join('')}</ul>`
      : `<p class="muted">${t('noMoons')}</p>`;
  }

  return `
    <header class="panel-head">
      <span class="kind" style="--c:${body.color}">${t(KIND_LABEL[body.kind])}${parent ? ` · <button type="button" class="link" data-select="${parent.id}">${t(parent.name)}</button>` : ''}</span>
      <h1>${t(body.name)}</h1>
    </header>
    <div class="tabs" role="tablist">${tabs.map(k => `<button type="button" role="tab" data-tab="${k}" class="${state.tab === k ? 'active' : ''}">${t(tabLabel[k])}</button>`).join('')}</div>
    <div class="tab-body">${content}</div>`;
}

// ───────────────────────── Bảng quỹ đạo Trái Đất

function earthPanel() {
  const scene = engine.scene;
  const counts = scene.counts;
  const vi = getLang() === 'vi';
  const layerToggles = TYPES.map(k => `
    <label class="layer ${scene.vis[k] ? '' : 'off'}">
      <input type="checkbox" data-layer="${k}" ${scene.vis[k] ? 'checked' : ''}/>
      <span class="dot" style="background:${TYPE_COLORS[k]}"></span>
      <span>${k === 'sso' ? (vi ? 'SSO (quan sát)' : 'SSO (imaging)') : t(LAYER_LABELS[k])}</span>
      <small>${fmt(counts[k])}</small>
    </label>`).join('');

  let content = '';
  if (state.eoTab === 'rings') {
    content = `<div class="ladder">${altitudeLadderSVG()}</div>
      <div class="regimes">${REGIMES.map(r => `
        <article class="regime ${state.focusRegime === r.id ? 'active' : ''}" data-regime="${r.id}" style="--c:${r.color}" tabindex="0">
          <h3>${t(r.name)}</h3>
          <dl>
            <div><dt>${t('eoAltitude')}</dt><dd>${r.altKm[0] === r.altKm[1] ? fmt(r.altKm[0]) : `${fmt(r.altKm[0])} – ${fmt(r.altKm[1])}`} km</dd></div>
            <div><dt>${t('eoPeriod')}</dt><dd>${t(r.period)}</dd></div>
            <div><dt>${t('eoShare')}</dt><dd>${t(r.share)}</dd></div>
          </dl>
          <p>${t(r.desc)}</p>
          <p class="muted small"><strong>${t('eoExamples')}:</strong> ${t(r.examples)}</p>
        </article>`).join('')}</div>`;
  } else if (state.eoTab === 'featured') {
    const sel = FEATURED.find(f => f.id === state.selected);
    content = (sel ? `
      <article class="sat-detail" style="--c:${sel.color}">
        <h3>${t(sel.name)}</h3>
        <p class="muted small">${t(sel.meta)}</p>
        ${SAT_MODELS[sel.id] ? `<div class="sat-model" id="satModelSlot"><span class="sat-hint">${t('satModelHint')}</span></div>` : ''}
        <dl class="stats compact">
          <div><dt>${t('eoAltitude')}</dt><dd>${sel.perigeeKm ? `${fmt(sel.perigeeKm)} – ${fmt(sel.apogeeKm)}` : fmt(sel.altKm)} km</dd></div>
          <div><dt>${t('eoInclination')}</dt><dd>${fmt(sel.incDeg, 1)}°</dd></div>
          ${sel.lonDeg !== undefined ? `<div><dt>${t('eoLongitude')}</dt><dd>${fmt(Math.abs(sel.lonDeg), 1)}°${sel.lonDeg >= 0 ? (vi ? 'Đ' : 'E') : (vi ? 'T' : 'W')}</dd></div>` : ''}
          <div><dt>${t('eoPeriod')}</dt><dd>${satPeriod(sel)}</dd></div>
        </dl>
        <p>${t(sel.desc)}</p>
        <button type="button" class="chip" data-action="follow">${state.following ? t('eoStopFollow') : t('eoFollow')}</button>
        ${satModelSection(sel.id)}
      </article>` : '') + `
      <ul class="sat-list">${FEATURED.map(f => `
        <li><button type="button" data-sat="${f.id}" class="${f.id === state.selected ? 'active' : ''}">
          <span class="dot" style="background:${f.color}"></span>
          <span><strong>${t(f.name)}</strong><small>${REGIMES.find(r => r.id === f.regime).id.toUpperCase()} · ${t(f.meta)}</small></span>
        </button></li>`).join('')}</ul>`;
  } else {
    content = `<p class="lead">${t(DEBRIS_INFO.intro)}</p>
      <div class="stat-grid">${DEBRIS_INFO.sizes.map(s => `<div><strong>${vi ? s.value : s.valueEn}</strong><span>${t(s.label)}</span></div>`).join('')}</div>
      <h4>${vi ? 'Các sự kiện tạo nhiều rác nhất' : 'Biggest debris-making events'}</h4>
      <ol class="timeline">${DEBRIS_INFO.events.map(e => `<li><b>${e.year}</b><span>${t(e.text)}</span></li>`).join('')}</ol>
      <div class="callout">${t(DEBRIS_INFO.kessler)}</div>`;
  }

  return `
    <header class="panel-head">
      <span class="kind" style="--c:#4fd1ff">${t(STATS_DATE)}</span>
      <h1>${t('eoTitle')}</h1>
    </header>
    <div class="stat-grid headline">${HEADLINE_STATS.map(s => `<div><strong>${vi ? s.value : s.valueEn}</strong><span>${t(s.label)}</span></div>`).join('')}</div>
    <h4>${t('eoLayers')}</h4>
    <div class="layers-toggle">${layerToggles}
      <label class="layer"><input type="checkbox" data-shells ${state.showShells ? 'checked' : ''}/><span class="dot ring"></span><span>${t('eoShowShells')}</span></label>
    </div>
    <div class="tabs" role="tablist">
      ${['rings', 'featured', 'debris'].map(k => `<button type="button" role="tab" data-eotab="${k}" class="${state.eoTab === k ? 'active' : ''}">${t({ rings: 'eoTabRings', featured: 'eoTabFeatured', debris: 'eoTabDebris' }[k])}</button>`).join('')}
    </div>
    <div class="tab-body">${content}</div>
    <p class="muted small note">${t(DEBRIS_INFO.note)}</p>
    <details class="sources"><summary>${t('eoSources')}</summary>
      <ul>${SOURCES.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
    </details>`;
}

function satModelSection(id) {
  const m = SAT_MODELS[id];
  if (!m) return '';
  return `
    ${id === 'starlink' ? `<button type="button" class="cta" data-action="starlink">${t({ vi: 'Starlink hoạt động thế nào? Thử ngay →', en: 'How does Starlink work? Try it →' })}</button>` : ''}
    <h4>${t('satStructure')}</h4>
    <ul class="parts">${m.parts.map(p => `
      <li><button type="button" data-part="${p.key}" class="${satViewer?.active === p.key ? 'active' : ''}">
        <strong>${t(p.name)}</strong><span>${t(p.desc)}</span></button></li>`).join('')}</ul>
    <h4>${t('satSpecs')}</h4>
    <dl class="stats compact">${m.specs.map(([k, v]) => `<div><dt>${t(k)}</dt><dd>${t(v)}</dd></div>`).join('')}</dl>
    <p class="muted small">${t('eoSources')}: ${m.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${esc(label)}</a>`).join(' · ')}</p>`;
}

function satPeriod(f) {
  if (f.lonDeg !== undefined) return getLang() === 'vi' ? '23 giờ 56 phút' : '23 h 56 min';
  const rp = 6371 + (f.perigeeKm ?? f.altKm), ra = 6371 + (f.apogeeKm ?? f.altKm);
  const a = (rp + ra) / 2;
  const min = (2 * Math.PI * Math.sqrt(a ** 3 / 398600.4418)) / 60;
  return min < 180 ? `${fmt(min, 0)} ${getLang() === 'vi' ? 'phút' : 'min'}` : fmtDuration(min / 60);
}

// ───────────────────────── Bảng tương tác Mặt Trời – Trái Đất – Mặt Trăng

function interactPanel() {
  const topic = TOPICS[state.topic];
  let extra = '';
  if (state.topic === 'light') extra = `<h4>${t('emSpectrum')}</h4>${spectrumSVG(SPECTRUM)}
    <ul class="spectrum-notes">${SPECTRUM.map(b => `<li><b>${t(b.name)}</b> ${t(b.note)}</li>`).join('')}</ul>`;
  if (state.topic === 'eclipses') extra = `<h4>${t('upcomingEclipses')}</h4>
    <ul class="eclipse-list">${ECLIPSES.map(e => `
      <li><button type="button" data-eclipse="${e.iso}">
        <span class="ecl-icon ${e.type}"></span>
        <span><strong>${new Date(e.iso).toLocaleDateString(getLang() === 'vi' ? 'vi-VN' : 'en-GB')} · ${t(e.name)}</strong><small>${t(e.where)}</small></span>
        <em>${t('jumpTo')}</em></button></li>`).join('')}</ul>`;
  return `
    <header class="panel-head">
      <span class="kind" style="--c:#ffcf5c">${t('interactKicker')}</span>
      <h1>${t('interactTitle')}</h1>
    </header>
    ${TOPIC_GROUPS.map(g => `<div class="topic-group"><span>${t(g.name)}</span><div class="topic-chips">${g.topics.map(k => `
      <button type="button" data-topic="${k}" class="${state.topic === k ? 'active' : ''}"><i>${TOPICS[k].icon}</i>${t(TOPICS[k].name)}</button>`).join('')}</div></div>`).join('')}
    <div class="live" id="liveStatus"></div>
    <p class="lead">${t(topic.lead)}</p>
    <ul class="facts">${topic.facts.map(f => `<li>${t(f)}</li>`).join('')}</ul>
    ${extra}
    <p class="muted small note">${t(topic.viz)}</p>
    <details class="sources"><summary>${t('eoSources')}</summary>
      <ul>${INTERACTION_SOURCES.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
    </details>`;
}

/** Ô trạng thái trực tiếp, cập nhật theo thời gian mô phỏng mà không vẽ lại cả bảng. */
let lastLive = '';
function updateLive() {
  const box = document.getElementById('liveStatus');
  if (!box || state.view !== 'interact') return;
  const st = engine.scene.status();
  const vi = getLang() === 'vi';
  const dayAge = (st.age / (2 * Math.PI)) * 29.53;
  let html = '';
  if (state.topic === 'light') {
    const decl = (st.decl * 180) / Math.PI;
    const lon = (((sunEclipticLon(state.ms) * 180) / Math.PI) % 360 + 360) % 360;
    const season = [t({ vi: 'Xuân', en: 'Spring' }), t({ vi: 'Hạ', en: 'Summer' }), t({ vi: 'Thu', en: 'Autumn' }), t({ vi: 'Đông', en: 'Winter' })][Math.floor(lon / 90)];
    html = `<div><b>${t({ vi: 'Mặt Trời đứng bóng lúc trưa tại', en: 'Sun directly overhead at noon over' })}</b>
      ${fmt(Math.abs(decl), 1)}° ${decl >= 0 ? (vi ? 'vĩ Bắc' : 'N') : (vi ? 'vĩ Nam' : 'S')}</div>
      <div><b>${t({ vi: 'Mùa (Bắc bán cầu, theo thiên văn)', en: 'Season (northern hemisphere, astronomical)' })}</b> ${season}</div>`;
  } else if (state.topic === 'wind') {
    html = `<div>${t({ vi: 'Theo dõi thời tiết vũ trụ thực tế tại NOAA SWPC', en: 'Follow real space weather at NOAA SWPC' })}: <a href="https://www.swpc.noaa.gov/" target="_blank" rel="noopener">swpc.noaa.gov</a></div>`;
  } else if (state.topic === 'tides') {
    const kind = { spring: { vi: 'Triều cường (Mặt Trời và Mặt Trăng gần thẳng hàng)', en: 'Spring tide (Sun and Moon nearly aligned)' }, neap: { vi: 'Triều kém (Mặt Trời và Mặt Trăng gần vuông góc)', en: 'Neap tide (Sun and Moon near right angles)' }, mid: { vi: 'Giữa triều cường và triều kém', en: 'Between spring and neap' } }[st.tide];
    html = `<div><b>${t({ vi: 'Hiện tại', en: 'Right now' })}</b> ${t(kind)}</div>
      <div><b>${t({ vi: 'Pha trăng', en: 'Moon phase' })}</b> ${t(phaseName(st.age))}</div>`;
  } else if (state.topic === 'phases') {
    html = `<div class="phase-row">${moonPhaseSVG(st.age)}<div>
      <strong>${t(phaseName(st.age))}</strong>
      <div>${t({ vi: 'Phần được chiếu sáng', en: 'Illuminated' })}: ${fmt(st.illum * 100, 0)}%</div>
      <div>${t({ vi: 'Tuổi trăng', en: 'Moon age' })}: ${fmt(dayAge, 1)} ${vi ? 'ngày' : 'days'}</div></div></div>`;
  } else {
    const lunar = { total: { vi: 'Nguyệt thực toàn phần', en: 'Total lunar eclipse' }, partial: { vi: 'Nguyệt thực một phần', en: 'Partial lunar eclipse' }, penumbral: { vi: 'Nguyệt thực nửa tối', en: 'Penumbral lunar eclipse' } }[st.lunar];
    const solar = { central: { vi: 'Nhật thực (toàn phần/hình khuyên ở một dải hẹp)', en: 'Solar eclipse (total/annular along a narrow path)' }, partial: { vi: 'Nhật thực một phần', en: 'Partial solar eclipse' } }[st.solar];
    const now = lunar ?? solar;
    html = now ? `<div class="alert"><b>● ${t({ vi: 'Đang diễn ra', en: 'Happening now' })}:</b> ${t(now)}</div>`
      : `<div><b>${t({ vi: 'Lúc này', en: 'Right now' })}</b> ${t({ vi: 'Không có nhật thực hay nguyệt thực', en: 'No eclipse in progress' })} · ${t(phaseName(st.age))}</div>`;
  }
  if (html !== lastLive) { box.innerHTML = html; lastLive = html; }
}

// ───────────────────────── Bảng Starlink

function starlinkPanel() {
  const vi = getLang() === 'vi';
  const sl = state.sl;
  const chip = (attr, id, name, active) => `<button type="button" data-${attr}="${id}" class="${active ? 'active' : ''}">${t(name)}</button>`;
  const custom = sl.user === 'custom' ? `<span class="custom-pos">📍 ${fmt(Math.abs(sl.custom.lat), 2)}°${sl.custom.lat >= 0 ? (vi ? 'B' : 'N') : (vi ? 'N' : 'S')}, ${fmt(Math.abs(sl.custom.lon), 2)}°${sl.custom.lon >= 0 ? (vi ? 'Đ' : 'E') : (vi ? 'T' : 'W')}</span>` : '';
  return `
    <header class="panel-head">
      <span class="kind" style="--c:#5ad1ff">${t({ vi: 'Internet vệ tinh', en: 'Satellite internet' })}</span>
      <h1>${t({ vi: 'Starlink hoạt động thế nào?', en: 'How does Starlink work?' })}</h1>
    </header>
    <div class="stat-grid headline">${SL_STATS.map(s => `<div><strong>${vi ? s.value : s.valueEn}</strong><span>${t(s.label)}</span></div>`).join('')}</div>

    <h4>${t({ vi: 'Thử nghiệm', en: 'Try it' })}</h4>
    <div class="sl-controls">
      <div class="sl-row"><span>${t({ vi: 'Bạn ở', en: 'You are at' })}</span>
        <div class="topic-chips">${SL_USERS.map(u => chip('sluser', u.id, u.name, sl.user === u.id)).join('')}</div>
        <small class="muted">${t({ vi: '…hoặc nhấp bất kỳ đâu trên quả địa cầu', en: '…or click anywhere on the globe' })} ${custom}</small></div>
      <div class="sl-row"><span>${t({ vi: 'Máy chủ', en: 'Server' })}</span>
        <div class="topic-chips">${SL_SERVERS.map(s => chip('slserver', s.id, s.name, sl.server === s.id)).join('')}</div></div>
      <label class="sl-toggle"><input type="checkbox" data-sllaser ${sl.laser ? 'checked' : ''}/>
        <span>${t({ vi: 'Bật liên kết laser giữa vệ tinh', en: 'Inter-satellite lasers on' })}</span></label>
    </div>
    <div class="live sl-live" id="slLive"></div>
    <div class="sl-legend">
      <span><i style="background:#4fd1ff"></i>${t({ vi: 'Sóng vô tuyến', en: 'Radio' })}</span>
      <span><i style="background:#ff4f7b"></i>Laser</span>
      <span><i style="background:#ffcf5c"></i>${t({ vi: 'Cáp quang', en: 'Fibre' })}</span>
      <span><i style="background:#7cf29a"></i>${t({ vi: 'Trạm cổng', en: 'Gateway' })}</span>
    </div>

    <h4>${t({ vi: 'Dữ liệu đi như thế nào (bấm để làm nổi bật)', en: 'How data travels (click to highlight)' })}</h4>
    <ol class="sl-steps">${SL_STEPS.map((s, k) => `
      <li><button type="button" data-slstep="${s.seg}" class="${sl.step === s.seg ? 'active' : ''}">
        <b>${k + 1}</b><span><strong>${t(s.name)}</strong>${t(s.text)}</span></button></li>`).join('')}</ol>

    <h4>${t({ vi: 'Starlink tại Việt Nam', en: 'Starlink in Vietnam' })}</h4>
    <ul class="facts">${SL_VIETNAM.map(f => `<li>${t(f)}</li>`).join('')}</ul>
    <p class="muted small note">${t(SL_NOTE)}</p>
    <details class="sources"><summary>${t('eoSources')}</summary>
      <ul>${SL_SOURCES.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>
    </details>`;
}

function updateStarlinkLive() {
  const box = document.getElementById('slLive');
  if (!box) return;
  const st = engine.scene.status();
  const vi = getLang() === 'vi';
  const ms = v => `${fmt(v, v < 10 ? 1 : 0)} ms`;
  const satName = st.serving !== null ? `STARLINK-${1000 + st.serving}` : '—';
  const countdown = `<div class="sl-count"><span>${t({ vi: 'Phân bổ lại sau', en: 'Re-assignment in' })} <b>${Math.ceil(st.countdown)} s</b></span>
    <div class="bar"><i style="width:${(1 - st.countdown / 15) * 100}%"></i></div>
    <small>${t({ vi: 'Đã chuyển vệ tinh', en: 'Handoffs' })}: ${st.handoffs}</small></div>`;
  let html;
  if (!st.ok) {
    const why = {
      nosat: { vi: 'Không có vệ tinh nào cao hơn 25° trên bầu trời lúc này.', en: 'No satellite is more than 25° above the horizon right now.' },
      nogateway: { vi: `Vệ tinh trên đầu không nhìn thấy trạm cổng nào (gần nhất: ${t(st.gateway.name)}). Không có laser thì không thể kết nối. Hãy bật lại laser!`, en: `The overhead satellite can't see any gateway (nearest: ${t(st.gateway.name)}). Without lasers there's no connection. Turn the lasers back on!` },
      noroute: { vi: 'Chưa tìm được tuyến laser tới trạm cổng ở bước này, sẽ thử lại sau 15 giây.', en: 'No laser route to a gateway this slot; retrying in 15 seconds.' },
    }[st.reason] ?? { vi: 'Đang tìm vệ tinh…', en: 'Searching for satellites…' };
    html = `<div class="alert"><b>✕ ${t({ vi: 'Mất kết nối', en: 'No connection' })}</b> ${t(why)}</div>${countdown}`;
  } else {
    const s = st.stats;
    const max = s.rttGeo;
    const bar = (label, v, cls) => `<div class="lat-row ${cls}"><span>${label}</span><div><i style="width:${Math.max(1.5, (v / max) * 100)}%"></i></div><b>${ms(v)}</b></div>`;
    html = `<div><b>● ${t({ vi: 'Đã kết nối', en: 'Connected' })}</b> ${satName} · ${t({ vi: 'góc ngẩng', en: 'elevation' })} ${fmt(s.elev, 0)}° ·
        ${s.hops ? `${s.hops} ${t({ vi: 'bước nhảy laser', en: 'laser hops' })}` : t({ vi: 'đi thẳng xuống trạm cổng', en: 'straight down to the gateway' })} → ${t(st.gateway.name)}</div>
      ${countdown}
      <div class="sl-path">${t({ vi: 'Quãng đường', en: 'Path' })}: ↑ ${fmt(s.upKm)} km${s.hops ? ` · laser ${fmt(s.laserKm)} km` : ''} · ↓ ${fmt(s.downKm)} km · ${t({ vi: 'cáp', en: 'fibre' })} ${fmt(s.groundKm)} km</div>
      <div class="lat-title">${t({ vi: 'Độ trễ khứ hồi (chỉ tính lan truyền tín hiệu)', en: 'Round-trip latency (propagation only)' })}</div>
      ${bar('Starlink', s.rtt, 'sl')}
      ${bar(t({ vi: 'Cáp quang (giả định)', en: 'Fibre (assumed)' }), s.rttFiber, 'fiber')}
      ${bar(t({ vi: 'Vệ tinh địa tĩnh', en: 'Geostationary' }), s.rttGeo, 'geo')}
      <small class="muted">${t({ vi: 'Đo thực tế, Starlink có độ trễ trung vị ~25–40 ms do thêm thời gian xử lý và xếp hàng.', en: 'Measured Starlink median latency is ~25–40 ms once processing and queuing are added.' })}</small>`;
  }
  if (html !== lastLive) { box.innerHTML = html; lastLive = html; }
}

// ───────────────────────── Thanh bên

function renderSidebar() {
  const list = $('#bodyList');
  const item = (b, depth) => {
    const active = state.mode === 'solar' && state.selected === b.id;
    const inSystem = state.systemId === b.id || (state.mode === 'earth' && b.id === 'earth');
    const kids = childrenOf(b.id);
    const open = kids.length && (inSystem || BY_ID[state.selected]?.parent === b.id);
    return `<li class="depth-${depth}">
      <button type="button" data-select="${b.id}" class="${active ? 'active' : ''} ${inSystem ? 'in-system' : ''}">
        <span class="dot" style="background:${b.color}"></span>${t(b.name)}
        ${b.moonsCount ? `<small>${b.moonsCount}</small>` : ''}
      </button>
      ${open ? `<ul>${kids.map(k => item(k, depth + 1)).join('')}</ul>` : ''}
    </li>`;
  };
  list.innerHTML = item(BY_ID.sun, 0) + PLANETS.map(p => item(p, 0)).join('');
  $('#backBtn').hidden = state.view === 'overview';
}

function renderPanel() {
  const panel = $('#panelContent');
  if (state.mode === 'earth') {
    panel.innerHTML = earthPanel();
    $('#panel').hidden = false;
    const slot = document.getElementById('satModelSlot');
    if (slot) (satViewer ??= new SatViewer()).mount(slot, state.selected);
  } else if (state.mode === 'starlink') {
    panel.innerHTML = starlinkPanel();
    $('#panel').hidden = false;
    lastLive = '';
    updateStarlinkLive();
  } else if (state.mode === 'interact') {
    panel.innerHTML = interactPanel();
    $('#panel').hidden = false;
    lastLive = '';
    updateLive();
  } else if (state.selected) {
    panel.innerHTML = bodyPanel(BY_ID[state.selected]);
    $('#panel').hidden = false;
  } else {
    panel.innerHTML = '';
    $('#panel').hidden = true;
  }
  $('#panelShow').classList.toggle('empty', $('#panel').hidden);
}

function renderChrome() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === getLang()));
  document.title = t('appTitle');
  $('#focusBtn').title = t('focusMode');
  $('#sidebarHide').title = $('#panelHide').title = t('hidePanel');
  renderTime();
}

function renderAll() {
  renderChrome();
  renderSidebar();
  renderPanel();
}

function renderTime() {
  $('#speedLabel').textContent = state.playing ? t(SPEEDS[state.speedIdx][1]) : t('paused');
  $('#playBtn').textContent = state.playing ? '❚❚' : '▶';
  const showTime = state.view !== 'overview';
  const d = new Date(state.ms);
  $('#dateLabel').textContent = d.toLocaleString(getLang() === 'vi' ? 'vi-VN' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric', ...(showTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

function updateHash() {
  const h = state.mode === 'earth' ? `earth-orbit${state.selected ? '/' + state.selected : ''}`
    : state.mode === 'interact' ? `sun-earth-moon/${state.topic}`
    : state.mode === 'starlink' ? 'starlink' : (state.selected ?? '');
  history.replaceState(null, '', h ? '#' + h : location.pathname);
}

// ───────────────────────── Sự kiện giao diện

document.addEventListener('click', e => {
  const el = e.target.closest('button, [data-regime], input');
  if (!el) return;
  if (el.dataset.select) selectBody(el.dataset.select);
  else if (el.dataset.tab) { state.tab = el.dataset.tab; syncCutaway(); renderPanel(); }
  else if (el.dataset.topic) { setTopic(el.dataset.topic); renderPanel(); }
  else if (el.dataset.eclipse) {
    // nhảy tới 3 giờ trước cực đại để kịp xem diễn biến
    state.ms = Date.parse(el.dataset.eclipse) - 3 * 3600000;
    state.speedIdx = 2; state.playing = true;
    renderTime();
  } else if (el.dataset.part) {
    const active = satViewer?.highlight(el.dataset.part);
    document.querySelectorAll('[data-part]').forEach(b => b.classList.toggle('active', b.dataset.part === active));
  }
  else if (el.dataset.eotab) { state.eoTab = el.dataset.eotab; renderPanel(); }
  else if (el.dataset.sat) selectSatellite(el.dataset.sat);
  else if (el.dataset.mode) {
    if (el.dataset.mode === 'earth' && state.mode !== 'earth') fadeSwap(() => showEarthOrbit());
    if (el.dataset.mode === 'solar' && state.mode !== 'solar') fadeSwap(() => showOverview());
    if (el.dataset.mode === 'interact' && state.mode !== 'interact') fadeSwap(() => showInteractions());
    if (el.dataset.mode === 'starlink' && state.mode !== 'starlink') fadeSwap(() => showStarlink());
  } else if (el.dataset.lang) setLang(el.dataset.lang);
  else if (el.dataset.action === 'earth-orbit') fadeSwap(() => showEarthOrbit());
  else if (el.dataset.action === 'interact') fadeSwap(() => showInteractions());
  else if (el.dataset.action === 'starlink') fadeSwap(() => showStarlink());
  else if (el.dataset.sluser) { state.sl.user = el.dataset.sluser; applyStarlinkSettings(true); renderPanel(); }
  else if (el.dataset.slserver) { state.sl.server = el.dataset.slserver; applyStarlinkSettings(); renderPanel(); }
  else if (el.dataset.slstep) {
    state.sl.step = state.sl.step === el.dataset.slstep ? null : el.dataset.slstep;
    engine.scene.setStep(state.sl.step);
    document.querySelectorAll('[data-slstep]').forEach(b => b.classList.toggle('active', b.dataset.slstep === state.sl.step));
  }
  else if (el.dataset.action === 'follow') {
    state.following = !state.following;
    if (state.selected) selectSatellite(state.selected, { fly: true });
  } else if (el.dataset.regime && state.mode === 'earth') {
    state.focusRegime = state.focusRegime === el.dataset.regime ? null : el.dataset.regime;
    engine.scene.setFocusTypes(regimeTypes(state.focusRegime));
    renderPanel();
  }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.layer) { engine.scene.setVisible(el.dataset.layer, el.checked); renderPanel(); }
  if ('sllaser' in el.dataset) { state.sl.laser = el.checked; engine.scene.setLaser(el.checked); lastLive = ''; }
  if ('shells' in el.dataset) { state.showShells = el.checked; engine.scene.setShellsVisible(el.checked); }
});

$('#brand').addEventListener('click', () => fadeSwap(() => showOverview()));
$('#backBtn').addEventListener('click', () => fadeSwap(() => showOverview()));
$('#playBtn').addEventListener('click', () => { state.playing = !state.playing; renderTime(); });
$('#slowerBtn').addEventListener('click', () => { state.speedIdx = Math.max(0, state.speedIdx - 1); state.playing = true; renderTime(); });
$('#fasterBtn').addEventListener('click', () => { state.speedIdx = Math.min(MAX_SPEED[state.view], state.speedIdx + 1); state.playing = true; renderTime(); });
$('#nowBtn').addEventListener('click', () => { state.ms = Date.now(); state.speedIdx = 0; renderTime(); });
$('#panelToggle').addEventListener('click', () => $('#panel').classList.toggle('collapsed'));

// ───────────────────────── Ẩn/hiện thanh bên và bảng thông tin

const hidden = { sidebar: false, panel: false };
try { Object.assign(hidden, JSON.parse(localStorage.getItem('hiddenPanels') || '{}')); } catch { /* bỏ qua */ }

function applyHidden() {
  document.body.classList.toggle('hide-sidebar', hidden.sidebar);
  document.body.classList.toggle('hide-panel', hidden.panel);
  $('#focusBtn').setAttribute('aria-pressed', String(hidden.sidebar && hidden.panel));
  engine.viewShift = hidden.panel ? 0 : 0.2;   // điện thoại: chỉ đẩy khung hình lên khi bảng dưới đang hiện
  engine.resize();
  try { localStorage.setItem('hiddenPanels', JSON.stringify(hidden)); } catch { /* bỏ qua */ }
}

function toggleAll() {
  const hide = !(hidden.sidebar && hidden.panel);
  hidden.sidebar = hidden.panel = hide;
  applyHidden();
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-hide], [data-show]');
  if (!el) return;
  if (el.dataset.hide) hidden[el.dataset.hide] = true;
  if (el.dataset.show) hidden[el.dataset.show] = false;
  applyHidden();
});
$('#focusBtn').addEventListener('click', toggleAll);
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'h' && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA/.test(e.target.tagName)) toggleAll();
});
applyHidden();

onLangChange(() => {
  engine.scene.refreshLabels?.();
  renderAll();
});

// ───────────────────────── Vòng lặp

const clock = new THREE.Clock();
let timeAcc = 0;
function loop() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const daysStep = state.playing ? SPEEDS[state.speedIdx][0] * dt : 0;
  state.ms += daysStep * 86400000;
  engine.scene.update(state.ms, dt, daysStep);
  engine.render(dt);
  satViewer?.render();
  timeAcc += dt;
  if (timeAcc > 0.25) { timeAcc = 0; renderTime(); updateLive(); if (state.view === 'starlink') updateStarlinkLive(); }
  requestAnimationFrame(loop);
}

// ───────────────────────── Khởi động theo địa chỉ (#mars, #earth-orbit/iss…)

function boot() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === 'starlink') {
    showStarlink();
  } else if (h.startsWith('sun-earth-moon')) {
    const topic = h.split('/')[1];
    showInteractions(TOPICS[topic] ? topic : 'light');
  } else if (h.startsWith('earth-orbit')) {
    const sat = h.split('/')[1];
    showEarthOrbit(FEATURED.some(f => f.id === sat) ? sat : null);
  } else if (BY_ID[h]) {
    const b = BY_ID[h];
    showSystem(b.kind === 'moon' ? b.parent : h, h);
  } else {
    showOverview();
  }
  document.documentElement.lang = getLang();
  loop();
}
boot();

// cho phép gỡ lỗi nhanh trong console
window.__app = { state, engine, BODIES };
