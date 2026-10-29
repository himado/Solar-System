// Nội dung về các tương tác tự nhiên giữa Mặt Trời – Trái Đất – Mặt Trăng.
// Nguồn: NASA, NOAA SWPC, ESA, Trung tâm Hải văn / Tổng cục KTTV Việt Nam, NASA Eclipse (Espenak).

const L = (vi, en) => ({ vi, en });

export const TOPIC_GROUPS = [
  { name: L('Mặt Trời ↔ Trái Đất', 'Sun ↔ Earth'), topics: ['light', 'wind'] },
  { name: L('Mặt Trăng ↔ Trái Đất', 'Moon ↔ Earth'), topics: ['tides', 'phases', 'eclipses'] },
];

export const TOPICS = {
  light: {
    icon: '☀',
    name: L('Ánh sáng & bốn mùa', 'Light & seasons'),
    lead: L(
      'Mặt Trời phát ra năng lượng dưới dạng sóng điện từ, phần lớn là ánh sáng khả kiến và hồng ngoại. Khí quyển Trái Đất như một bộ lọc: cho ánh sáng khả kiến và sóng vô tuyến đi qua, nhưng chặn phần lớn tia gamma, tia X và tia cực tím nguy hiểm.',
      'The Sun radiates energy as electromagnetic waves, mostly visible light and infrared. Earth\'s atmosphere acts as a filter: visible light and radio waves pass, while most gamma rays, X-rays and harmful ultraviolet are blocked.'),
    facts: [
      L('Ánh sáng đi 150 triệu km từ Mặt Trời tới Trái Đất trong khoảng 8 phút 20 giây.', 'Light crosses the 150 million km to Earth in about 8 min 20 s.'),
      L('Ngoài khí quyển, mỗi mét vuông nhận ~1.361 W (hằng số Mặt Trời), đủ thắp sáng 13 bóng đèn 100 W.', 'Above the atmosphere each square metre receives ~1,361 W (the solar constant), enough for thirteen 100 W bulbs.'),
      L('Trái Đất phản xạ lại ~30% ánh sáng (suất phản chiếu), phần còn lại làm ấm đất, nước và không khí.', 'Earth reflects ~30% of sunlight (its albedo); the rest warms land, water and air.'),
      L('Bốn mùa không do khoảng cách: Trái Đất gần Mặt Trời nhất vào đầu tháng 1, giữa mùa đông Bắc bán cầu. Nguyên nhân là trục nghiêng 23,44° làm góc chiếu và độ dài ngày thay đổi.', 'Seasons are not about distance: Earth is closest to the Sun in early January, mid northern winter. The 23.44° tilt changes the Sun\'s angle and day length.'),
      L('Tầng ôzôn ở độ cao 15–35 km hấp thụ hầu hết tia cực tím UV-C và UV-B.', 'The ozone layer at 15–35 km absorbs almost all UV-C and most UV-B.'),
    ],
    viz: L('Mô phỏng: các hạt vàng là "photon" bay từ Mặt Trời tới Trái Đất (đã làm chậm rất nhiều); đường ranh ngày–đêm và trục quay nghiêng hiện đúng theo ngày giờ.', 'Simulation: yellow dots are "photons" flying from Sun to Earth (hugely slowed down); the day–night line and tilted axis match the current date and time.'),
  },
  wind: {
    icon: '✺',
    name: L('Gió Mặt Trời & cực quang', 'Solar wind & aurora'),
    lead: L(
      'Ngoài ánh sáng, Mặt Trời còn liên tục thổi ra dòng hạt mang điện gọi là gió Mặt Trời. Từ trường Trái Đất tạo thành một "bong bóng" bảo vệ là từ quyển, làm dòng hạt chệch hướng. Một phần hạt bị dẫn về hai cực và va vào khí quyển, tạo ra cực quang.',
      'Besides light, the Sun constantly blows out charged particles: the solar wind. Earth\'s magnetic field forms a protective bubble, the magnetosphere, that deflects them. Some particles are funnelled to the poles and hit the atmosphere, creating auroras.'),
    facts: [
      L('Gió Mặt Trời bay với tốc độ 300–800 km mỗi giây và tới Trái Đất sau 2–4 ngày.', 'The solar wind travels at 300–800 km per second and reaches Earth in 2–4 days.'),
      L('Ở phía ban ngày, ranh giới từ quyển nằm cách Trái Đất ~10 lần bán kính (~64.000 km); phía ban đêm bị kéo dài thành "đuôi" xa hơn cả quỹ đạo Mặt Trăng.', 'On the day side the magnetosphere\'s edge sits ~10 Earth radii away (~64,000 km); on the night side it stretches into a tail beyond the Moon\'s orbit.'),
      L('Cực quang xanh lục do nguyên tử oxy phát sáng ở độ cao ~100–250 km; màu đỏ do oxy ở cao hơn.', 'Green aurora is glowing oxygen at ~100–250 km; red comes from oxygen higher up.'),
      L('Vành đai bức xạ Van Allen là hai vùng "bẫy" hạt năng lượng cao bên trong từ quyển.', 'The Van Allen belts are two zones of trapped high-energy particles inside the magnetosphere.'),
      L('Bão từ có thể gây sai số GPS, nhiễu liên lạc, quá tải lưới điện (Québec mất điện năm 1989), và làm khí quyển phồng lên kéo vệ tinh xuống: tháng 2/2022, SpaceX mất 38 vệ tinh Starlink mới phóng vì một cơn bão từ.', 'Geomagnetic storms can cause GPS errors, radio blackouts, grid overloads (the 1989 Québec blackout) and swell the upper atmosphere: in Feb 2022 SpaceX lost 38 new Starlinks to a storm.'),
      L('Tháng 5/2024 xảy ra bão từ cấp G5, mạnh nhất trong hơn 20 năm; cực quang xuất hiện ở những vĩ độ rất thấp.', 'In May 2024 a G5 storm, the strongest in over 20 years, brought auroras to unusually low latitudes.'),
    ],
    viz: L('Mô phỏng dạng sơ đồ (không theo tỉ lệ): dòng hạt cam là gió Mặt Trời, mặt cong tím là ranh giới từ quyển, đường tím nhạt là đường sức từ, vành xanh ở hai cực là cực quang.', 'Schematic (not to scale): orange particles are the solar wind, the purple surface is the magnetopause, pale lines are magnetic field lines, green rings at the poles are auroras.'),
  },
  tides: {
    icon: '≋',
    name: L('Thủy triều', 'Tides'),
    lead: L(
      'Lực hấp dẫn của Mặt Trăng kéo phía gần mạnh hơn phía xa của Trái Đất. Sự chênh lệch đó (lực thủy triều) làm nước biển phồng lên ở cả phía hướng về Mặt Trăng lẫn phía đối diện. Trái Đất tự quay "chui" qua hai chỗ phồng nên phần lớn bờ biển có hai lần triều lên mỗi ngày.',
      'The Moon pulls harder on Earth\'s near side than its far side. That difference, the tidal force, raises bulges of ocean both towards the Moon and on the opposite side. Earth rotates through both bulges, so most coasts get two high tides a day.'),
    facts: [
      L('Mặt Trời cũng gây thủy triều, nhưng chỉ bằng ~46% của Mặt Trăng vì ở xa hơn rất nhiều.', 'The Sun raises tides too, but only ~46% as strong as the Moon\'s because it is so much farther away.'),
      L('Triều cường xảy ra khi Mặt Trời và Mặt Trăng thẳng hàng (trăng non, trăng tròn); triều kém khi chúng vuông góc (bán nguyệt).', 'Spring tides come when Sun and Moon line up (new and full Moon); neap tides when they are at right angles (quarter Moons).'),
      L('Một chu kỳ triều kéo dài 24 giờ 50 phút, vì Mặt Trăng cũng di chuyển trên quỹ đạo nên mỗi ngày triều lên muộn hơn ~50 phút.', 'A tidal day lasts 24 h 50 min: the Moon moves along its orbit, so high tide comes ~50 minutes later each day.'),
      L('Ở Việt Nam, vịnh Bắc Bộ (Hòn Dáu, Hải Phòng) có chế độ nhật triều điển hình: chỉ một lần triều lên mỗi ngày, biên độ có thể tới 3–4 m. Ven biển Nam Bộ (Vũng Tàu) có bán nhật triều không đều: hai lần mỗi ngày.', 'In Vietnam, the Gulf of Tonkin (Hon Dau, Hai Phong) has a textbook diurnal tide, one high tide a day with ranges up to 3–4 m. The southern coast (Vung Tau) has mixed semi-diurnal tides, twice a day.'),
      L('Ma sát thủy triều làm Trái Đất quay chậm dần (ngày dài thêm ~2 mili giây mỗi thế kỷ) và đẩy Mặt Trăng ra xa ~3,8 cm mỗi năm.', 'Tidal friction slows Earth\'s spin (the day grows ~2 ms per century) and pushes the Moon away by ~3.8 cm per year.'),
      L('Trái Đất và Mặt Trăng cùng quay quanh một tâm khối chung nằm cách tâm Trái Đất ~4.670 km, tức vẫn ở bên trong Trái Đất.', 'Earth and Moon orbit a shared centre of mass ~4,670 km from Earth\'s centre, still inside the Earth.'),
    ],
    viz: L('Mô phỏng: lớp nước xanh trong suốt bao quanh Trái Đất được phóng đại hàng nghìn lần để thấy hai chỗ phồng do Mặt Trăng (mũi tên trắng) và Mặt Trời (mũi tên vàng).', 'Simulation: the translucent blue ocean shell is exaggerated thousands of times to show the bulges raised by the Moon (white arrow) and Sun (yellow arrow).'),
  },
  phases: {
    icon: '◐',
    name: L('Pha Mặt Trăng', 'Moon phases'),
    lead: L(
      'Mặt Trăng không tự phát sáng; nó phản chiếu ánh sáng Mặt Trời. Một nửa Mặt Trăng luôn được chiếu sáng, nhưng khi nó đi quanh Trái Đất, ta nhìn thấy phần sáng đó theo những góc khác nhau, tạo nên các pha từ trăng non tới trăng tròn.',
      'The Moon makes no light of its own; it reflects sunlight. Half of it is always lit, but as it circles Earth we see that lit half from different angles, giving phases from new Moon to full Moon.'),
    facts: [
      L('Một tháng âm lịch (từ trăng non tới trăng non) dài 29,53 ngày, lâu hơn chu kỳ quay quanh Trái Đất 27,32 ngày vì Trái Đất cũng đi quanh Mặt Trời.', 'A lunar month (new Moon to new Moon) is 29.53 days, longer than the 27.32-day orbit because Earth also moves around the Sun.'),
      L('Rằm (ngày 15 âm lịch) thường rơi vào đúng hoặc gần trăng tròn; mùng 1 là trăng non.', 'In the lunar calendar, the 15th (Rằm) falls on or near full Moon and the 1st is new Moon.'),
      L('Nhờ hiện tượng "đu đưa" (libration), từ Trái Đất ta thấy được ~59% bề mặt Mặt Trăng, dù nó luôn quay một mặt về phía ta.', 'Thanks to libration, we see about 59% of the Moon from Earth, even though it keeps one face towards us.'),
      L('Phần tối mờ mờ bên cạnh lưỡi liềm là "ánh Trái Đất": ánh sáng Mặt Trời dội từ Trái Đất lên Mặt Trăng.', 'The faint glow on the dark part of a crescent is earthshine: sunlight bounced off Earth onto the Moon.'),
    ],
    viz: L('Mô phỏng: vị trí và pha Mặt Trăng tính theo ngày giờ thật. Tua nhanh thời gian để xem một tháng âm lịch trôi qua.', 'Simulation: the Moon\'s position and phase follow the real date. Speed up time to watch a lunar month go by.'),
  },
  eclipses: {
    icon: '●',
    name: L('Nhật thực & nguyệt thực', 'Eclipses'),
    lead: L(
      'Nhật thực xảy ra khi Mặt Trăng đi vào giữa Mặt Trời và Trái Đất, bóng Mặt Trăng phủ lên một vùng Trái Đất. Nguyệt thực xảy ra khi Mặt Trăng đi vào bóng của Trái Đất. Quỹ đạo Mặt Trăng nghiêng 5,1° so với quỹ đạo Trái Đất nên không phải tháng nào cũng có thực.',
      'A solar eclipse happens when the Moon passes between Sun and Earth and its shadow falls on part of Earth. A lunar eclipse happens when the Moon moves into Earth\'s shadow. The Moon\'s orbit is tilted 5.1° to Earth\'s, so eclipses don\'t happen every month.'),
    facts: [
      L('Thực chỉ xảy ra khi trăng non hoặc trăng tròn trùng lúc Mặt Trăng ở gần "nút", tức giao điểm giữa hai mặt phẳng quỹ đạo. Điều này xảy ra khoảng hai "mùa thực" mỗi năm.', 'Eclipses need a new or full Moon close to a node, where the two orbit planes cross. That gives about two eclipse seasons a year.'),
      L('Mặt Trời lớn gấp ~400 lần Mặt Trăng nhưng cũng xa gấp ~400 lần, nên hai đĩa trông gần bằng nhau trên bầu trời. Đó là lý do có nhật thực toàn phần.', 'The Sun is ~400 times wider than the Moon but also ~400 times farther, so the two discs look almost the same size, which is why total solar eclipses exist.'),
      L('Trong nguyệt thực toàn phần, Mặt Trăng chuyển màu đỏ đồng ("trăng máu") do khí quyển Trái Đất bẻ cong ánh sáng đỏ vào vùng bóng tối.', 'During a total lunar eclipse the Moon turns coppery red ("blood Moon") because Earth\'s atmosphere bends red light into the shadow.'),
      L('Nhật thực toàn phần kéo dài tối đa ~7,5 phút; nguyệt thực toàn phần có thể kéo dài tới ~1 giờ 40 phút.', 'Totality lasts at most ~7.5 minutes for a solar eclipse but up to ~1 h 40 min for a lunar one.'),
      L('Các lần thực lặp lại theo chu kỳ Saros dài 18 năm 11 ngày 8 giờ.', 'Eclipses repeat in Saros cycles of 18 years 11 days 8 hours.'),
    ],
    viz: L('Sơ đồ: độ nghiêng quỹ đạo Mặt Trăng được phóng đại ×6 và khoảng cách bị nén để dễ quan sát nón bóng tối (umbra) và nửa tối (penumbra). Trạng thái thực được tính theo vị trí thật.', 'Schematic: the Moon\'s orbital tilt is exaggerated ×6 and distances compressed to show the umbra and penumbra cones. Eclipse status is computed from real positions.'),
  },
};

// Thời điểm cực đại (UTC). Nguồn: NASA Eclipse Website (F. Espenak).
export const ECLIPSES = [
  { iso: '2027-02-20T23:13:00Z', type: 'lunar', name: L('Nguyệt thực nửa tối', 'Penumbral lunar eclipse'), where: L('Việt Nam thấy giai đoạn đầu trước khi trăng lặn', 'Vietnam sees the early stage before moonset') },
  { iso: '2027-08-02T10:07:00Z', type: 'solar', name: L('Nhật thực toàn phần', 'Total solar eclipse'), where: L('Tây Ban Nha, Bắc Phi, Ai Cập (6 phút 23 giây ở Luxor); miền Nam Việt Nam thấy một phần rất nhỏ', 'Spain, North Africa, Egypt (6 min 23 s at Luxor); southern Vietnam sees a tiny partial') },
  { iso: '2028-07-22T02:56:00Z', type: 'solar', name: L('Nhật thực toàn phần', 'Total solar eclipse'), where: L('Úc, New Zealand; Việt Nam thấy một phần (~20% ở phía Nam)', 'Australia, New Zealand; partial from Vietnam (~20% in the south)') },
  { iso: '2028-12-31T16:52:00Z', type: 'lunar', name: L('Nguyệt thực toàn phần', 'Total lunar eclipse'), where: L('Thấy trọn vẹn ở Việt Nam, đêm 31/12 (cực đại ~23:52 giờ Việt Nam)', 'Fully visible from Vietnam on the night of 31 Dec (peak ~23:52 Vietnam time)') },
];

// Phổ điện từ và mức xuyên qua khí quyển (0 = bị chặn, 1 = đi qua)
export const SPECTRUM = [
  { name: L('Gamma', 'Gamma'), range: '< 0,01 nm', pass: 0, color: '#b48cff', note: L('Bị khí quyển chặn hoàn toàn', 'Fully blocked') },
  { name: L('Tia X', 'X-ray'), range: '0,01–10 nm', pass: 0, color: '#9f8cff', note: L('Bị chặn ở tầng cao', 'Blocked high up') },
  { name: L('Cực tím', 'Ultraviolet'), range: '10–400 nm', pass: 0.15, color: '#8c7dff', note: L('Tầng ôzôn chặn phần lớn; UV-A gây cháy nắng', 'Ozone blocks most; UV-A still causes sunburn') },
  { name: L('Khả kiến', 'Visible'), range: '400–700 nm', pass: 1, color: 'rainbow', note: L('Đi qua gần như hoàn toàn: "cửa sổ quang học"', 'Passes almost fully: the "optical window"') },
  { name: L('Hồng ngoại', 'Infrared'), range: '0,7 µm–1 mm', pass: 0.45, color: '#ff6b5c', note: L('Hơi nước và CO₂ hấp thụ một phần (hiệu ứng nhà kính)', 'Partly absorbed by water vapour and CO₂ (greenhouse effect)') },
  { name: L('Vi ba', 'Microwave'), range: '1 mm–1 m', pass: 0.8, color: '#ffb35c', note: L('Phần lớn đi qua: dùng cho liên lạc vệ tinh, radar', 'Mostly passes: used for satellite links and radar') },
  { name: L('Vô tuyến', 'Radio'), range: '> 1 m', pass: 0.9, color: '#ffd75c', note: L('"Cửa sổ vô tuyến"; sóng quá dài bị tầng điện ly phản xạ', 'The "radio window"; very long waves bounce off the ionosphere') },
];

export const INTERACTION_SOURCES = [
  ['NASA – Sun–Earth connection', 'https://science.nasa.gov/heliophysics/'],
  ['NOAA SWPC – Space weather scales', 'https://www.swpc.noaa.gov/noaa-scales-explanation'],
  ['NOAA – Tides & water levels', 'https://oceanservice.noaa.gov/education/tutorial_tides/'],
  ['NASA – Moon phases', 'https://science.nasa.gov/moon/moon-phases/'],
  ['NASA Eclipse Website (F. Espenak)', 'https://eclipse.gsfc.nasa.gov/eclipse.html'],
];

export function phaseName(age) {
  const a = (age / (2 * Math.PI)) * 8;
  const idx = Math.round(a) % 8;
  return [
    L('Trăng non', 'New Moon'), L('Trăng lưỡi liềm đầu tháng', 'Waxing crescent'), L('Bán nguyệt đầu tháng', 'First quarter'),
    L('Trăng khuyết đầu tháng (gần rằm)', 'Waxing gibbous'), L('Trăng tròn', 'Full Moon'), L('Trăng khuyết cuối tháng', 'Waning gibbous'),
    L('Bán nguyệt cuối tháng', 'Last quarter'), L('Trăng lưỡi liềm cuối tháng', 'Waning crescent'),
  ][idx];
}
