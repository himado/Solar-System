// Dữ liệu quỹ đạo quanh Trái Đất: các "vòng" quỹ đạo, vệ tinh nổi bật, rác vũ trụ.
// Số liệu cập nhật tới cuối tháng 10/2026. Nguồn: CelesTrak, Space-Track (qua Orbital Radar,
// KeepTrack), Jonathan McDowell, ESA DISCOS / ESA Space Environment Report 2026.

const L = (vi, en) => ({ vi, en });

export const STATS_DATE = L('Cập nhật: 10/2026', 'As of: Oct 2026');

export const HEADLINE_STATS = [
  { value: '~16.000', valueEn: '~16,000', label: L('vệ tinh đang hoạt động', 'active satellites') },
  { value: '~11.000', valueEn: '~11,000', label: L('trong số đó là Starlink (~⅔)', 'of them are Starlink (~⅔)') },
  { value: '~47.000', valueEn: '~47,000', label: L('vật thể được theo dõi (≥ 5–10 cm)', 'tracked objects (≥ 5–10 cm)') },
  { value: '~1,2 tr', valueEn: '~1.2 M', label: L('mảnh rác 1–10 cm (ước tính)', 'debris pieces 1–10 cm (modelled)') },
];

// Các "vòng" quỹ đạo. altKm: [min, max] độ cao so với mặt đất.
export const REGIMES = [
  {
    id: 'leo', color: '#4fd1ff', altKm: [160, 2000],
    name: L('Quỹ đạo thấp (LEO)', 'Low Earth Orbit (LEO)'),
    period: L('88 – 127 phút / vòng', '88 – 127 min per orbit'),
    share: L('~90% vệ tinh đang hoạt động', '~90% of active satellites'),
    desc: L(
      'Vòng đông đúc nhất. Gần mặt đất nên tín hiệu nhanh, ảnh chụp sắc nét, nhưng mỗi vệ tinh chỉ "nhìn thấy" một vùng nhỏ, nên cần cả chòm hàng nghìn chiếc để phủ sóng toàn cầu. Lực cản khí quyển khiến vệ tinh dưới ~600 km tự rơi về và cháy trong vài năm.',
      'The most crowded shell. Being close to the ground gives fast links and sharp images, but each satellite sees only a small patch, so global coverage needs constellations of thousands. Air drag pulls satellites below ~600 km down within a few years.'),
    examples: L('Starlink, Trạm ISS, Thiên Cung, Hubble, OneWeb', 'Starlink, ISS, Tiangong, Hubble, OneWeb'),
  },
  {
    id: 'sso', color: '#7cf29a', altKm: [500, 900], sub: 'leo',
    name: L('Quỹ đạo đồng bộ Mặt Trời (SSO)', 'Sun-synchronous orbit (SSO)'),
    period: L('~95 – 100 phút, nghiêng ~97–99°', '~95 – 100 min, ~97–99° inclination'),
    share: L('Một nhánh đặc biệt của LEO', 'A special case of LEO'),
    desc: L(
      'Gần như đi qua hai cực. Mặt phẳng quỹ đạo xoay theo Mặt Trời nên vệ tinh luôn bay qua một nơi vào cùng một giờ địa phương, rất phù hợp để chụp ảnh so sánh theo thời gian. Đây là "nhà" của phần lớn vệ tinh quan sát Trái Đất và khí tượng.',
      'Nearly polar. The orbit plane turns with the Sun, so the satellite passes over any spot at the same local time every day, which is ideal for comparing images over time. Home to most Earth-observation and weather satellites.'),
    examples: L('Landsat 9, Sentinel-2, VNREDSat-1', 'Landsat 9, Sentinel-2, VNREDSat-1'),
  },
  {
    id: 'meo', color: '#ffcf5c', altKm: [2000, 35786],
    name: L('Quỹ đạo trung bình (MEO)', 'Medium Earth Orbit (MEO)'),
    period: L('2 – 24 giờ (GPS: ~12 giờ)', '2 – 24 h (GPS: ~12 h)'),
    share: L('~1% vệ tinh, chủ yếu định vị', '~1% of satellites, mostly navigation'),
    desc: L(
      'Vùng rộng nhưng thưa, một phần vì nằm trong vành đai bức xạ Van Allen. Các hệ thống định vị toàn cầu (GNSS) bay ở độ cao ~19.000–23.000 km: mỗi vệ tinh nhìn thấy gần nửa Trái Đất nên chỉ cần ~24–30 vệ tinh cho một hệ thống.',
      'Huge but sparse, partly because it overlaps the Van Allen radiation belts. Global navigation systems (GNSS) fly at ~19,000–23,000 km: each satellite sees almost half the planet, so ~24–30 are enough per system.'),
    examples: L('GPS (Mỹ), GLONASS (Nga), Galileo (EU), BeiDou (TQ), O3b mPOWER', 'GPS (US), GLONASS (Russia), Galileo (EU), BeiDou (China), O3b mPOWER'),
  },
  {
    id: 'geo', color: '#ff7ab6', altKm: [35786, 35786],
    name: L('Quỹ đạo địa tĩnh (GEO)', 'Geostationary orbit (GEO)'),
    period: L('23 giờ 56 phút = đúng 1 vòng tự quay của Trái Đất', '23 h 56 min = exactly one Earth rotation'),
    share: L('~600 vệ tinh đang hoạt động', '~600 active satellites'),
    desc: L(
      'Một chiếc "vòng" mỏng ngay trên xích đạo ở độ cao 35.786 km. Vệ tinh quay cùng tốc độ với Trái Đất nên đứng yên trên bầu trời: chảo thu truyền hình chỉ cần chĩa cố định một hướng. Vị trí trên vòng này rất quý và được phân bổ qua Liên minh Viễn thông Quốc tế (ITU).',
      'A thin ring right above the equator at 35,786 km. Satellites move with Earth\'s spin and so hang still in the sky: a TV dish can stay pointed in one direction. Slots on this ring are precious and allocated through the ITU.'),
    examples: L('VINASAT-1, VINASAT-2, Himawari-9, GOES-19', 'VINASAT-1, VINASAT-2, Himawari-9, GOES-19'),
  },
  {
    id: 'heo', color: '#c792ff', altKm: [500, 40000],
    name: L('Quỹ đạo elip cao (HEO)', 'Highly elliptical orbit (HEO)'),
    period: L('~12 giờ (Molniya), ~24 giờ (Tundra)', '~12 h (Molniya), ~24 h (Tundra)'),
    share: L('Số ít, phục vụ vùng vĩ độ cao', 'A few, serving high latitudes'),
    desc: L(
      'Quỹ đạo dẹt: lướt sát Trái Đất ở một đầu rồi vọt lên ~40.000 km ở đầu kia. Vệ tinh đi chậm ở điểm xa nhất nên "treo" lâu trên bán cầu Bắc, phủ sóng những vùng như Nga, Bắc Cực mà vệ tinh GEO khó với tới. Quỹ đạo chuyển tiếp địa tĩnh (GTO) cũng có dạng này và để lại rất nhiều tầng tên lửa.',
      'A stretched orbit: it skims Earth at one end and swings out to ~40,000 km at the other. Moving slowly near the far point, the satellite "hangs" over the northern hemisphere, covering places like Russia and the Arctic that GEO cannot reach well. Geostationary transfer orbits (GTO) share this shape and leave behind many rocket stages.'),
    examples: L('Molniya, Tundra, Sirius XM (cũ)', 'Molniya, Tundra, Sirius XM (legacy)'),
  },
  {
    id: 'graveyard', color: '#9aa3b2', altKm: [36086, 36286],
    name: L('Quỹ đạo "nghĩa địa"', 'Graveyard orbit'),
    period: L('Trên GEO ~300 km', '~300 km above GEO'),
    share: L('Vệ tinh GEO đã nghỉ hưu', 'Retired GEO satellites'),
    desc: L(
      'Vệ tinh GEO quá cao để kéo về khí quyển, nên khi hết nhiên liệu chúng được đẩy lên cao thêm ~300 km để nhường chỗ cho vệ tinh mới.',
      'GEO satellites are too high to bring down, so at end of life they are boosted ~300 km higher to free their slot.'),
    examples: L('Vệ tinh viễn thông cũ', 'Old communications satellites'),
  },
];

// Vệ tinh nổi bật, với tham số quỹ đạo gần đúng để mô phỏng.
// altKm: độ cao tròn; hoặc perigeeKm/apogeeKm cho quỹ đạo elip. lonDeg: kinh độ cho GEO.
export const FEATURED = [
  {
    id: 'iss', short: 'ISS', regime: 'leo', altKm: 420, incDeg: 51.64, raanDeg: 30, phaseDeg: 0, color: '#ffffff',
    name: L('Trạm Vũ trụ Quốc tế (ISS)', 'International Space Station (ISS)'),
    meta: L('Mỹ, Nga, Châu Âu, Nhật, Canada · từ 1998', 'US, Russia, Europe, Japan, Canada · since 1998'),
    desc: L(
      'Phòng thí nghiệm có người ở lớn nhất từng bay vào không gian: dài ~109 m, nặng ~420 tấn, có người sống liên tục từ năm 2000. Bay một vòng quanh Trái Đất mỗi ~92 phút, nên phi hành gia thấy 16 lần Mặt Trời mọc mỗi ngày. Dự kiến cho rơi có kiểm soát vào khoảng năm 2030.',
      'The largest crewed laboratory ever flown: ~109 m wide, ~420 t, continuously inhabited since 2000. It circles Earth every ~92 min, so its crew sees 16 sunrises a day. Planned controlled de-orbit around 2030.'),
  },
  {
    id: 'tiangong', short: 'Tiangong', regime: 'leo', altKm: 385, incDeg: 41.47, raanDeg: 140, phaseDeg: 120, color: '#ff6b6b',
    name: L('Trạm Thiên Cung (Tiangong)', 'Tiangong space station'),
    meta: L('Trung Quốc · hoàn thiện 2022', 'China · completed 2022'),
    desc: L('Trạm vũ trụ của Trung Quốc gồm 3 mô-đun, thường có 3 phi hành gia. Nặng khoảng 1/4 ISS.', 'China\'s three-module space station, usually crewed by three. About a quarter of the ISS\'s mass.'),
  },
  {
    id: 'hubble', short: 'Hubble', regime: 'leo', altKm: 520, incDeg: 28.47, raanDeg: 250, phaseDeg: 200, color: '#ffd166',
    name: L('Kính thiên văn Hubble', 'Hubble Space Telescope'),
    meta: L('NASA / ESA · từ 1990', 'NASA / ESA · since 1990'),
    desc: L('Kính thiên văn huyền thoại đã chụp hơn 1,5 triệu lần quan sát. Không còn tàu con thoi để nâng quỹ đạo nên Hubble đang hạ độ cao dần. (Kính James Webb thì không quay quanh Trái Đất mà ở điểm Lagrange L2, cách 1,5 triệu km.)', 'The legendary telescope behind more than 1.5 million observations. With no Shuttle left to boost it, its orbit is slowly decaying. (James Webb does not orbit Earth; it sits at the L2 point, 1.5 million km away.)'),
  },
  {
    id: 'starlink', regime: 'leo', altKm: 550, incDeg: 53, raanDeg: 75, phaseDeg: 60, color: '#4fd1ff',
    name: L('Starlink (một vệ tinh mẫu)', 'Starlink (sample satellite)'),
    meta: L('SpaceX · từ 2019 · ~11.000 chiếc', 'SpaceX · since 2019 · ~11,000 units'),
    desc: L('Chòm vệ tinh Internet lớn nhất lịch sử, chiếm khoảng 2/3 số vệ tinh đang hoạt động. Bay thành nhiều "lớp vỏ" ở độ cao ~340–570 km với các góc nghiêng 43°, 53°, 70° và 97,6°. Mỗi vệ tinh có tuổi thọ ~5 năm rồi tự hạ độ cao và cháy trong khí quyển.', 'The largest constellation in history, about two-thirds of all active satellites. It flies in several "shells" at ~340–570 km with 43°, 53°, 70° and 97.6° inclinations. Each lasts ~5 years, then lowers itself to burn up.'),
  },
  {
    id: 'vnredsat', regime: 'sso', altKm: 680, incDeg: 98.1, raanDeg: 200, phaseDeg: 300, color: '#7cf29a',
    name: L('VNREDSat-1', 'VNREDSat-1'),
    meta: L('Việt Nam · phóng 2013', 'Vietnam · launched 2013'),
    desc: L('Vệ tinh quan sát Trái Đất đầu tiên của Việt Nam, phóng ngày 7/5/2013 từ Guiana thuộc Pháp. Chụp ảnh độ phân giải 2,5 m phục vụ quản lý tài nguyên, môi trường và thiên tai.', 'Vietnam\'s first Earth-observation satellite, launched 7 May 2013 from French Guiana. Its 2.5 m imagery supports resource, environment and disaster management.'),
  },
  {
    id: 'landsat9', regime: 'sso', altKm: 705, incDeg: 98.2, raanDeg: 320, phaseDeg: 40, color: '#a0f0b0',
    name: L('Landsat 9', 'Landsat 9'),
    meta: L('NASA / USGS · phóng 2021', 'NASA / USGS · launched 2021'),
    desc: L('Tiếp nối chương trình Landsat chụp ảnh Trái Đất liên tục từ năm 1972, kho dữ liệu dài nhất về sự thay đổi bề mặt hành tinh.', 'Continues the Landsat record begun in 1972, the longest continuous dataset of Earth\'s changing surface.'),
  },
  {
    id: 'oneweb', regime: 'leo', altKm: 1200, incDeg: 87.9, raanDeg: 10, phaseDeg: 150, color: '#8fb8ff',
    name: L('OneWeb', 'OneWeb'),
    meta: L('Eutelsat OneWeb · ~650 chiếc', 'Eutelsat OneWeb · ~650 units'),
    desc: L('Chòm vệ tinh Internet bay cao hơn Starlink (~1.200 km) trên quỹ đạo gần cực.', 'An internet constellation flying higher than Starlink (~1,200 km) in near-polar orbits.'),
  },
  {
    id: 'gps', regime: 'meo', altKm: 20180, incDeg: 55, raanDeg: 60, phaseDeg: 0, color: '#ffcf5c',
    name: L('GPS III', 'GPS III'),
    meta: L('Không quân/Lực lượng Không gian Mỹ · 31 vệ tinh', 'US Space Force · 31 satellites'),
    desc: L('Hệ thống định vị toàn cầu đầu tiên. 6 mặt phẳng quỹ đạo, mỗi vệ tinh bay 2 vòng/ngày. Điện thoại cần tín hiệu từ ít nhất 4 vệ tinh để xác định vị trí.', 'The first global navigation system. Six orbital planes, each satellite circling twice a day. A phone needs at least four satellites to fix its position.'),
  },
  {
    id: 'galileo', regime: 'meo', altKm: 23222, incDeg: 56, raanDeg: 180, phaseDeg: 90, color: '#ffe08a',
    name: L('Galileo', 'Galileo'),
    meta: L('Liên minh Châu Âu · ~28 vệ tinh', 'European Union · ~28 satellites'),
    desc: L('Hệ thống định vị của châu Âu, độ chính xác tới cỡ 1 m cho người dùng phổ thông.', 'Europe\'s navigation system, accurate to around 1 m for ordinary users.'),
  },
  {
    id: 'glonass', regime: 'meo', altKm: 19130, incDeg: 64.8, raanDeg: 300, phaseDeg: 200, color: '#ffb84d',
    name: L('GLONASS', 'GLONASS'),
    meta: L('Nga · ~24 vệ tinh', 'Russia · ~24 satellites'),
    desc: L('Hệ thống định vị của Nga, góc nghiêng lớn hơn GPS nên phủ tốt vùng vĩ độ cao.', 'Russia\'s navigation system; its higher inclination serves high latitudes well.'),
  },
  {
    id: 'vinasat1', regime: 'geo', altKm: 35786, incDeg: 0.05, lonDeg: 132, color: '#ff7ab6',
    name: L('VINASAT-1', 'VINASAT-1'),
    meta: L('Việt Nam (VNPT) · phóng 2008 · 132°Đ', 'Vietnam (VNPT) · launched 2008 · 132°E'),
    desc: L('Vệ tinh viễn thông đầu tiên của Việt Nam, phóng ngày 19/4/2008, đưa Việt Nam thành quốc gia thứ 6 Đông Nam Á có vệ tinh riêng. Phục vụ truyền hình, điện thoại, Internet cho Việt Nam và khu vực. Đã hoạt động vượt tuổi thọ thiết kế 15 năm.', 'Vietnam\'s first communications satellite, launched 19 April 2008, making Vietnam the sixth Southeast Asian nation with its own satellite. It carries TV, phone and internet traffic, and has outlived its 15-year design life.'),
  },
  {
    id: 'vinasat2', labelBelow: true, regime: 'geo', altKm: 35786, incDeg: 0.05, lonDeg: 131.8, color: '#ff9cc8',
    name: L('VINASAT-2', 'VINASAT-2'),
    meta: L('Việt Nam (VNPT) · phóng 2012 · 131,8°Đ', 'Vietnam (VNPT) · launched 2012 · 131.8°E'),
    desc: L('Vệ tinh viễn thông thứ hai, phóng ngày 16/5/2012, đặt gần như cùng vị trí với VINASAT-1 trên vòng địa tĩnh.', 'Vietnam\'s second communications satellite, launched 16 May 2012, parked almost alongside VINASAT-1 on the geostationary ring.'),
  },
  {
    id: 'himawari', regime: 'geo', altKm: 35786, incDeg: 0.05, lonDeg: 140.7, color: '#ffa0d0',
    name: L('Himawari-9', 'Himawari-9'),
    meta: L('Nhật Bản (JMA) · 140,7°Đ', 'Japan (JMA) · 140.7°E'),
    desc: L('Vệ tinh khí tượng chụp ảnh mây toàn bộ khu vực châu Á – Thái Bình Dương mỗi 10 phút. Ảnh mây bão trên các bản tin thời tiết ở Việt Nam thường đến từ Himawari.', 'A weather satellite imaging the whole Asia–Pacific every 10 minutes. Typhoon cloud images on Vietnamese weather reports usually come from Himawari.'),
  },
  {
    id: 'goes', regime: 'geo', altKm: 35786, incDeg: 0.05, lonDeg: -75.2, color: '#ffa0d0',
    name: L('GOES-19', 'GOES-19'),
    meta: L('Mỹ (NOAA) · 75,2°T', 'US (NOAA) · 75.2°W'),
    desc: L('Vệ tinh khí tượng theo dõi châu Mỹ và Đại Tây Dương, kể cả bão nhiệt đới và lửa rừng.', 'A weather satellite watching the Americas and the Atlantic, including hurricanes and wildfires.'),
  },
  {
    id: 'molniya', regime: 'heo', perigeeKm: 600, apogeeKm: 39700, incDeg: 63.4, raanDeg: 90, argpDeg: 270, phaseDeg: 180, color: '#c792ff',
    name: L('Molniya', 'Molniya'),
    meta: L('Liên Xô / Nga · từ 1965', 'USSR / Russia · since 1965'),
    desc: L('Quỹ đạo elip mang tên dòng vệ tinh viễn thông Liên Xô. Góc nghiêng 63,4° là "góc thần kỳ" giữ cho điểm xa nhất luôn ở trên bán cầu Bắc.', 'The elliptical orbit named after a Soviet communications series. The 63.4° "magic" inclination keeps the far point fixed over the northern hemisphere.'),
  },
];

export const DEBRIS_INFO = {
  intro: L(
    'Rác vũ trụ là mọi vật thể nhân tạo không còn hoạt động: vệ tinh chết, tầng tên lửa bị bỏ lại, mảnh vỡ do nổ và va chạm, cả ốc vít hay mảnh sơn. Ở LEO chúng bay ~7,5 km/s, nhanh gấp ~10 lần viên đạn, nên một mảnh 1 cm có thể phá hủy cả một vệ tinh.',
    'Space debris is any human-made object that no longer works: dead satellites, spent rocket stages, fragments from explosions and collisions, even bolts and paint flecks. In LEO they move at ~7.5 km/s, about 10 times a bullet, so a 1 cm piece can destroy a satellite.'),
  sizes: [
    { value: '~47.000', valueEn: '~47,000', label: L('vật thể được radar theo dõi (cả vệ tinh hoạt động)', 'objects tracked by radar (incl. active satellites)') },
    { value: '~1,2 triệu', valueEn: '~1.2 million', label: L('mảnh từ 1 đến 10 cm', 'pieces from 1 to 10 cm') },
    { value: '~140 triệu', valueEn: '~140 million', label: L('mảnh từ 1 mm đến 1 cm', 'pieces from 1 mm to 1 cm') },
    { value: '> 13.000 tấn', valueEn: '> 13,000 t', label: L('tổng khối lượng vật thể nhân tạo trên quỹ đạo', 'total mass of human-made objects in orbit') },
  ],
  events: [
    { year: '2007', text: L('Trung Quốc bắn tên lửa phá vệ tinh khí tượng Phong Vân-1C: hơn 3.500 mảnh được theo dõi, nhiều mảnh vẫn còn bay ở ~850 km.', 'China\'s anti-satellite test on Fengyun-1C: over 3,500 tracked fragments, many still flying at ~850 km.') },
    { year: '2009', text: L('Vụ va chạm đầu tiên giữa hai vệ tinh: Iridium 33 (đang hoạt động) đâm Kosmos 2251 (đã chết) ở 790 km, tạo ra hơn 2.000 mảnh.', 'First collision between two satellites: active Iridium 33 hit dead Kosmos 2251 at 790 km, creating over 2,000 fragments.') },
    { year: '2021', text: L('Nga bắn hạ vệ tinh Kosmos 1408: ~1.500 mảnh, buộc phi hành đoàn ISS trú ẩn trong tàu.', 'Russia destroyed Kosmos 1408: ~1,500 fragments; the ISS crew had to shelter in their capsules.') },
    { year: '2024–26', text: L('Nhiều tầng tên lửa và vệ tinh vỡ ra trên quỹ đạo; ESA cảnh báo số mảnh vỡ mới đang tăng nhanh hơn số vật thể rơi về.', 'Several rocket stages and satellites broke up in orbit; ESA warns new fragments are now outpacing re-entries.') },
  ],
  kessler: L(
    'Hội chứng Kessler: khi mật độ rác đủ lớn, mỗi va chạm tạo ra thêm mảnh vỡ gây ra va chạm tiếp theo, một chuỗi phản ứng có thể khiến một số vòng quỹ đạo không còn dùng được trong nhiều thập kỷ. Các vùng 750–1.000 km được xem là nguy hiểm nhất.',
    'Kessler syndrome: once debris is dense enough, each collision makes fragments that cause more collisions, a chain reaction that could make some orbits unusable for decades. The 750–1,000 km band is considered the most at risk.'),
  note: L(
    'Mô phỏng: mỗi chấm ứng với khoảng một vật thể thật (~16.000 vệ tinh, ~30.000 rác được theo dõi), phân bố theo độ cao và góc nghiêng gần đúng, không phải vị trí thực theo thời gian thực. Kích thước chấm được phóng to rất nhiều.',
    'Simulation: each dot stands for roughly one real object (~16,000 satellites, ~30,000 tracked debris), distributed by approximate altitude and inclination, not real-time positions. Dot sizes are hugely exaggerated.'),
};

export const SOURCES = [
  { label: 'CelesTrak', url: 'https://celestrak.org' },
  { label: 'Orbital Radar – Orbital Briefing 28/10/2026', url: 'https://orbitalradar.com/blog/orbital-briefing-2026-10-28' },
  { label: 'KeepTrack – Starlink count', url: 'https://keeptrack.space/starlink-satellite-count' },
  { label: 'ESA DISCOS – Space Environment Statistics', url: 'https://sdup.esoc.esa.int/discosweb/statistics/' },
  { label: 'ESA Space Environment Report', url: 'https://www.sdo.esoc.esa.int/environment_report/Space_Environment_Report_latest.pdf' },
  { label: 'NASA Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/' },
  { label: 'Textures © Solar System Scope (CC BY 4.0)', url: 'https://www.solarsystemscope.com/textures/' },
];
