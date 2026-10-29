// Chuỗi giao diện song ngữ và trạng thái ngôn ngữ hiện tại.

const STRINGS = {
  appTitle: { vi: 'Khám phá Hệ Mặt Trời', en: 'Explore the Solar System' },
  navSolar: { vi: 'Hệ Mặt Trời', en: 'Solar System' },
  navEarthOrbit: { vi: 'Quỹ đạo Trái Đất', en: 'Earth orbit' },
  bodies: { vi: 'Thiên thể', en: 'Bodies' },
  back: { vi: 'Toàn cảnh', en: 'Overview' },

  tabOverview: { vi: 'Tổng quan', en: 'Overview' },
  tabStats: { vi: 'Thông số', en: 'Data' },
  tabStructure: { vi: 'Cấu trúc', en: 'Structure' },
  tabMoons: { vi: 'Vệ tinh', en: 'Moons' },

  radius: { vi: 'Bán kính', en: 'Radius' },
  diameter: { vi: 'Đường kính', en: 'Diameter' },
  mass: { vi: 'Khối lượng', en: 'Mass' },
  gravity: { vi: 'Trọng lực bề mặt', en: 'Surface gravity' },
  dayLength: { vi: 'Chu kỳ tự quay', en: 'Rotation period' },
  yearLength: { vi: 'Chu kỳ quỹ đạo', en: 'Orbital period' },
  distSun: { vi: 'Cách Mặt Trời', en: 'Distance from Sun' },
  distParent: { vi: 'Cách hành tinh mẹ', en: 'Distance from planet' },
  temperature: { vi: 'Nhiệt độ', en: 'Temperature' },
  tilt: { vi: 'Độ nghiêng trục', en: 'Axial tilt' },
  moonsCount: { vi: 'Số vệ tinh tự nhiên', en: 'Natural moons' },
  composition: { vi: 'Thành phần', en: 'Composition' },
  retrograde: { vi: 'quay ngược', en: 'retrograde' },
  vsEarth: { vi: 'So với Trái Đất', en: 'Compared with Earth' },
  sizeCompare: { vi: 'So sánh kích thước', en: 'Size comparison' },
  didYouKnow: { vi: 'Bạn có biết?', en: 'Did you know?' },
  structureNote: { vi: 'Mặt cắt minh họa, tỉ lệ các lớp theo bán kính.', en: 'Illustrative cutaway; layer sizes to scale by radius.' },
  noMoons: { vi: 'Không có vệ tinh tự nhiên.', en: 'No natural moons.' },
  mainMoons: { vi: 'Các vệ tinh tiêu biểu', en: 'Major moons' },
  ofTotal: { vi: 'trên tổng số', en: 'out of' },
  openEarthOrbit: { vi: 'Xem vệ tinh nhân tạo & rác vũ trụ →', en: 'See artificial satellites & debris →' },

  // Bảng điều khiển thời gian
  paused: { vi: 'Tạm dừng', en: 'Paused' },
  speed: { vi: 'Tốc độ', en: 'Speed' },
  now: { vi: 'Hiện tại', en: 'Now' },
  realtime: { vi: 'Thời gian thực', en: 'Real time' },
  perSec: { vi: '/giây', en: '/sec' },

  // Quỹ đạo Trái Đất
  eoTitle: { vi: 'Vệ tinh nhân tạo quanh Trái Đất', en: 'Satellites around Earth' },
  eoTabRings: { vi: 'Các vòng quỹ đạo', en: 'Orbit shells' },
  eoTabFeatured: { vi: 'Vệ tinh nổi bật', en: 'Notable satellites' },
  eoTabDebris: { vi: 'Rác vũ trụ', en: 'Space debris' },
  eoLayers: { vi: 'Lớp hiển thị', en: 'Layers' },
  eoAltitude: { vi: 'Độ cao', en: 'Altitude' },
  eoPeriod: { vi: 'Chu kỳ', en: 'Period' },
  eoShare: { vi: 'Tỉ trọng', en: 'Share' },
  eoExamples: { vi: 'Ví dụ', en: 'Examples' },
  eoFollow: { vi: 'Bám theo', en: 'Follow' },
  eoStopFollow: { vi: 'Thôi bám theo', en: 'Stop following' },
  eoShowShells: { vi: 'Vành độ cao', en: 'Altitude rings' },
  eoSources: { vi: 'Nguồn số liệu', en: 'Sources' },
  eoInclination: { vi: 'Góc nghiêng', en: 'Inclination' },
  eoLongitude: { vi: 'Kinh độ', en: 'Longitude' },
  openInteractions: { vi: 'Tương tác Mặt Trời – Trái Đất – Mặt Trăng →', en: 'Sun – Earth – Moon interactions →' },
  cutawayHint: { vi: 'Mô hình 3D bên cạnh đang hiện mặt cắt: một múi 90° được khoét đi để lộ các lớp bên trong. Kéo để xoay quanh.', en: 'The 3D model now shows a cutaway: a 90° wedge is removed to reveal the layers inside. Drag to orbit around it.' },
  satModelHint: { vi: 'Kéo để xoay · cuộn để phóng to', en: 'Drag to rotate · scroll to zoom' },
  satStructure: { vi: 'Cấu trúc (bấm để làm nổi bật)', en: 'Structure (click to highlight)' },
  satSpecs: { vi: 'Thông số kỹ thuật', en: 'Specifications' },
  emSpectrum: { vi: 'Phổ sóng điện từ của Mặt Trời', en: 'The Sun\'s electromagnetic spectrum' },
  upcomingEclipses: { vi: 'Các lần thực sắp tới', en: 'Upcoming eclipses' },
  jumpTo: { vi: 'Xem ▸', en: 'Watch ▸' },
  interactKicker: { vi: 'Tương tác tự nhiên', en: 'Natural interactions' },
  interactTitle: { vi: 'Mặt Trời – Trái Đất – Mặt Trăng', en: 'Sun – Earth – Moon' },
  navInteract: { vi: 'Tương tác', en: 'Interactions' },
  navSolarShort: { vi: 'Hệ MT', en: 'Solar' },
  navEarthOrbitShort: { vi: 'Quỹ đạo', en: 'Orbit' },
  navInteractShort: { vi: 'Tương tác', en: 'Sun–Moon' },
  infoPanel: { vi: 'Thông tin', en: 'Info' },
  hidePanel: { vi: 'Ẩn bảng', en: 'Hide panel' },
  focusMode: { vi: 'Ẩn/hiện các bảng (phím H)', en: 'Hide/show panels (H key)' },
  hintDrag: { vi: 'Kéo để xoay · Cuộn để phóng to · Nhấp vào vật thể để xem', en: 'Drag to rotate · Scroll to zoom · Click an object to inspect' },
  loading: { vi: 'Đang tải…', en: 'Loading…' },
};

export const LAYER_LABELS = {
  starlink: { vi: 'Starlink', en: 'Starlink' },
  leo: { vi: 'LEO khác', en: 'Other LEO' },
  meo: { vi: 'MEO (định vị)', en: 'MEO (navigation)' },
  geo: { vi: 'GEO (địa tĩnh)', en: 'GEO (geostationary)' },
  heo: { vi: 'HEO (elip cao)', en: 'HEO (elliptical)' },
  debris: { vi: 'Rác vũ trụ', en: 'Space debris' },
};

let lang = 'vi';
try { lang = localStorage.getItem('lang') || 'vi'; } catch { /* storage có thể bị chặn */ }
const listeners = new Set();

export const getLang = () => lang;
export function setLang(l) {
  lang = l;
  try { localStorage.setItem('lang', l); } catch { /* bỏ qua */ }
  document.documentElement.lang = l;
  listeners.forEach(fn => fn(l));
}
export const onLangChange = fn => listeners.add(fn);

/** Dịch một khóa giao diện, hoặc một object { vi, en } từ dữ liệu. */
export function t(keyOrObj) {
  if (keyOrObj && typeof keyOrObj === 'object') return keyOrObj[lang] ?? keyOrObj.vi;
  const s = STRINGS[keyOrObj];
  return s ? s[lang] : keyOrObj;
}

/** Định dạng số theo ngôn ngữ (vi: 1.234,5 · en: 1,234.5). */
export function fmt(n, digits = 0) {
  return n.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
