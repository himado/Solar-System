// Dữ liệu các thiên thể. Nguồn chính: NASA Planetary Fact Sheet, NASA Science.
// Mọi chuỗi hiển thị đều có dạng { vi, en }.

const L = (vi, en) => ({ vi, en });

export const BODIES = [
  {
    id: 'sun', kind: 'star', parent: null, texture: '2k_sun.jpg', color: '#ffb340',
    name: L('Mặt Trời', 'Sun'),
    radiusKm: 696340, mass: '1,989 × 10³⁰ kg', gravity: 274, rotationH: 609.1, tilt: 7.25,
    temp: L('Bề mặt ~5.500 °C · Lõi ~15 triệu °C', 'Surface ~5,500 °C · Core ~15 million °C'),
    summary: L(
      'Ngôi sao ở trung tâm hệ, chiếm 99,86% tổng khối lượng của cả hệ Mặt Trời. Năng lượng của nó đến từ phản ứng tổng hợp hạt nhân, biến hydro thành heli ở lõi.',
      'The star at the centre of the system, holding 99.86% of its total mass. It shines by fusing hydrogen into helium in its core.'),
    facts: [
      L('Ánh sáng Mặt Trời mất khoảng 8 phút 20 giây để tới Trái Đất.', 'Sunlight takes about 8 min 20 s to reach Earth.'),
      L('Có thể xếp khoảng 1,3 triệu Trái Đất vào bên trong Mặt Trời.', 'About 1.3 million Earths could fit inside the Sun.'),
      L('Tuổi khoảng 4,6 tỷ năm, mới đi được khoảng nửa vòng đời.', 'About 4.6 billion years old, roughly halfway through its life.'),
    ],
    composition: L('73% hydro, 25% heli, 2% nguyên tố nặng hơn', '73% hydrogen, 25% helium, 2% heavier elements'),
    layers: [
      { r: 0.25, color: '#fff3b0', name: L('Lõi', 'Core'), desc: L('~15 triệu °C, nơi diễn ra phản ứng nhiệt hạch', '~15 million °C, where fusion happens') },
      { r: 0.70, color: '#ffc94d', name: L('Vùng bức xạ', 'Radiative zone'), desc: L('Năng lượng truyền ra dưới dạng photon, mất hàng chục nghìn năm', 'Energy travels out as photons over tens of thousands of years') },
      { r: 0.98, color: '#ff9a2e', name: L('Vùng đối lưu', 'Convective zone'), desc: L('Plasma nóng cuộn lên như nồi nước sôi', 'Hot plasma churns like boiling water') },
      { r: 1.00, color: '#ff6a1a', name: L('Quang quyển', 'Photosphere'), desc: L('"Bề mặt" nhìn thấy được, ~5.500 °C', 'The visible "surface", ~5,500 °C') },
    ],
  },

  // ───────── Sao Thủy
  {
    id: 'mercury', kind: 'planet', parent: 'sun', texture: '2k_mercury.jpg', color: '#a8a39d',
    name: L('Sao Thủy', 'Mercury'),
    radiusKm: 2439.7, mass: '3,30 × 10²³ kg', gravity: 3.7, rotationH: 1407.6, tilt: 0.03,
    orbitDays: 87.97, au: 0.387, L0: 252.25, moonsCount: 0,
    temp: L('−173 °C đến 427 °C', '−173 °C to 427 °C'),
    summary: L(
      'Hành tinh nhỏ nhất và gần Mặt Trời nhất. Gần như không có khí quyển nên nhiệt độ ngày và đêm chênh lệch gần 600 °C.',
      'The smallest planet and closest to the Sun. With almost no atmosphere, day and night temperatures differ by nearly 600 °C.'),
    facts: [
      L('Một ngày Mặt Trời (từ bình minh tới bình minh) dài 176 ngày Trái Đất, gấp đôi một năm của nó.', 'One solar day (sunrise to sunrise) lasts 176 Earth days, twice its year.'),
      L('Lõi sắt chiếm khoảng 85% bán kính hành tinh.', 'Its iron core spans about 85% of the planet\'s radius.'),
      L('Có băng nước trong các miệng hố luôn chìm trong bóng tối ở hai cực.', 'Water ice hides in permanently shadowed polar craters.'),
    ],
    composition: L('Khí quyển siêu mỏng (ngoại quyển): O₂, Na, H₂, He', 'Ultra-thin exosphere: O₂, Na, H₂, He'),
    layers: [
      { r: 0.83, color: '#b5651d', name: L('Lõi sắt', 'Iron core'), desc: L('Rất lớn so với hành tinh, một phần nóng chảy', 'Huge for the planet, partly molten') },
      { r: 0.98, color: '#8c7b6b', name: L('Lớp phủ', 'Mantle'), desc: L('Đá silicat, dày ~400 km', 'Silicate rock, ~400 km thick') },
      { r: 1.00, color: '#cfc7bd', name: L('Vỏ', 'Crust'), desc: L('Dày ~35 km, đầy miệng hố', '~35 km thick, heavily cratered') },
    ],
  },

  // ───────── Sao Kim
  {
    id: 'venus', kind: 'planet', parent: 'sun', texture: '2k_venus_atmosphere.jpg', color: '#e8c27a',
    name: L('Sao Kim', 'Venus'),
    radiusKm: 6051.8, mass: '4,87 × 10²⁴ kg', gravity: 8.87, rotationH: -5832.5, tilt: 177.4,
    orbitDays: 224.7, au: 0.723, L0: 181.98, moonsCount: 0,
    temp: L('~464 °C (trung bình bề mặt)', '~464 °C (mean surface)'),
    summary: L(
      'Hành tinh nóng nhất hệ Mặt Trời do hiệu ứng nhà kính cực mạnh. Kích thước gần bằng Trái Đất nhưng áp suất bề mặt gấp 92 lần.',
      'The hottest planet thanks to a runaway greenhouse effect. Nearly Earth-sized, but with 92 times the surface pressure.'),
    facts: [
      L('Tự quay ngược chiều với hầu hết hành tinh: Mặt Trời mọc ở phía tây.', 'It spins backwards compared to most planets: the Sun rises in the west.'),
      L('Một ngày (243 ngày Trái Đất) dài hơn một năm (225 ngày).', 'A day (243 Earth days) is longer than its year (225 days).'),
      L('Mây axit sunfuric phản xạ ánh sáng mạnh, khiến nó là "sao" sáng nhất bầu trời đêm.', 'Sulfuric acid clouds make it the brightest "star" in the night sky.'),
    ],
    composition: L('Khí quyển: 96,5% CO₂, 3,5% N₂', 'Atmosphere: 96.5% CO₂, 3.5% N₂'),
    layers: [
      { r: 0.54, color: '#c0763b', name: L('Lõi sắt–niken', 'Iron–nickel core'), desc: L('Bán kính ~3.200 km', 'Radius ~3,200 km') },
      { r: 0.99, color: '#a8794e', name: L('Lớp phủ', 'Mantle'), desc: L('Đá nóng, dày ~2.800 km', 'Hot rock, ~2,800 km thick') },
      { r: 1.00, color: '#e3c18d', name: L('Vỏ', 'Crust'), desc: L('Bazan núi lửa, dày ~30–50 km', 'Volcanic basalt, ~30–50 km') },
    ],
  },

  // ───────── Trái Đất
  {
    id: 'earth', kind: 'planet', parent: 'sun', texture: '2k_earth_daymap.jpg', color: '#4b8bd6',
    name: L('Trái Đất', 'Earth'),
    radiusKm: 6371, mass: '5,97 × 10²⁴ kg', gravity: 9.81, rotationH: 23.934, tilt: 23.44,
    orbitDays: 365.256, au: 1.0, L0: 100.46, moonsCount: 1, hasSatellites: true,
    temp: L('~15 °C (trung bình)', '~15 °C (mean)'),
    summary: L(
      'Hành tinh duy nhất được biết là có sự sống. 71% bề mặt được bao phủ bởi nước lỏng, và từ trường bảo vệ bề mặt khỏi gió Mặt Trời.',
      'The only world known to host life. Liquid water covers 71% of its surface, and a magnetic field shields it from the solar wind.'),
    facts: [
      L('Là hành tinh đặc nhất hệ Mặt Trời (5,51 g/cm³).', 'The densest planet in the Solar System (5.51 g/cm³).'),
      L('Trục nghiêng 23,44° tạo ra bốn mùa.', 'A 23.44° axial tilt gives us the seasons.'),
      L('Hiện có khoảng 16.000 vệ tinh nhân tạo đang hoạt động quanh Trái Đất.', 'About 16,000 artificial satellites are currently active around Earth.'),
    ],
    composition: L('Khí quyển: 78% N₂, 21% O₂, 0,9% Ar', 'Atmosphere: 78% N₂, 21% O₂, 0.9% Ar'),
    layers: [
      { r: 0.19, color: '#fff1a8', name: L('Lõi trong', 'Inner core'), desc: L('Sắt–niken rắn, ~5.400 °C, bán kính 1.220 km', 'Solid iron–nickel, ~5,400 °C, 1,220 km radius') },
      { r: 0.55, color: '#ffb347', name: L('Lõi ngoài', 'Outer core'), desc: L('Kim loại lỏng, chuyển động tạo ra từ trường', 'Liquid metal whose motion makes the magnetic field') },
      { r: 0.89, color: '#d9572b', name: L('Lớp phủ dưới', 'Lower mantle'), desc: L('Đá nóng, rắn nhưng dẻo', 'Hot rock, solid but slowly flowing') },
      { r: 0.995, color: '#b5452a', name: L('Lớp phủ trên', 'Upper mantle'), desc: L('Đá dẻo; mảng kiến tạo trôi trên đó', 'Plastic rock that tectonic plates ride on') },
      { r: 1.00, color: '#6b8f4e', name: L('Vỏ', 'Crust'), desc: L('Dày 5–70 km (đại dương mỏng, lục địa dày)', '5–70 km thick (thin oceanic, thick continental)') },
    ],
  },
  {
    id: 'moon', kind: 'moon', parent: 'earth', texture: '2k_moon.jpg', color: '#c8c8c8',
    name: L('Mặt Trăng', 'Moon'),
    radiusKm: 1737.4, mass: '7,35 × 10²² kg', gravity: 1.62, orbitDays: 27.32, distKm: 384400,
    temp: L('−173 °C đến 127 °C', '−173 °C to 127 °C'),
    summary: L(
      'Vệ tinh tự nhiên duy nhất của Trái Đất, có lẽ hình thành từ vụ va chạm giữa Trái Đất và một thiên thể cỡ Sao Hỏa (Theia) khoảng 4,5 tỷ năm trước.',
      'Earth\'s only natural satellite, probably formed when a Mars-sized body (Theia) hit the young Earth about 4.5 billion years ago.'),
    facts: [
      L('Luôn quay một mặt về phía Trái Đất (khóa thủy triều).', 'Always shows the same face to Earth (tidally locked).'),
      L('Đang rời xa Trái Đất khoảng 3,8 cm mỗi năm.', 'Drifts away from Earth by about 3.8 cm per year.'),
      L('12 người đã đặt chân lên Mặt Trăng (Apollo, 1969–1972).', '12 people walked on it during Apollo (1969–1972).'),
    ],
    layers: [
      { r: 0.14, color: '#ffd27a', name: L('Lõi trong', 'Inner core'), desc: L('Sắt rắn, bán kính ~240 km', 'Solid iron, ~240 km radius') },
      { r: 0.20, color: '#e89a4a', name: L('Lõi ngoài', 'Outer core'), desc: L('Sắt lỏng', 'Liquid iron') },
      { r: 0.97, color: '#8a8580', name: L('Lớp phủ', 'Mantle'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#c4c0ba', name: L('Vỏ', 'Crust'), desc: L('Dày ~30–50 km', '~30–50 km thick') },
    ],
  },

  // ───────── Sao Hỏa
  {
    id: 'mars', kind: 'planet', parent: 'sun', texture: '2k_mars.jpg', color: '#d0603a',
    name: L('Sao Hỏa', 'Mars'),
    radiusKm: 3389.5, mass: '6,42 × 10²³ kg', gravity: 3.71, rotationH: 24.62, tilt: 25.19,
    orbitDays: 686.98, au: 1.524, L0: 355.43, moonsCount: 2,
    temp: L('~−63 °C (trung bình)', '~−63 °C (mean)'),
    summary: L(
      '"Hành tinh Đỏ" có màu từ bụi oxit sắt. Từng có sông hồ trong quá khứ và là mục tiêu chính của các sứ mệnh tìm kiếm dấu vết sự sống.',
      'The "Red Planet" gets its colour from iron-oxide dust. It once had rivers and lakes and is a prime target in the search for past life.'),
    facts: [
      L('Núi Olympus Mons cao ~22 km, gần gấp 2,5 lần Everest.', 'Olympus Mons is ~22 km tall, about 2.5 times Everest.'),
      L('Hẻm núi Valles Marineris dài hơn 4.000 km.', 'The Valles Marineris canyon is over 4,000 km long.'),
      L('Một ngày Sao Hỏa (sol) dài 24 giờ 37 phút, rất gần ngày Trái Đất.', 'A Martian day (sol) is 24 h 37 min, very close to Earth\'s.'),
    ],
    composition: L('Khí quyển mỏng: 95% CO₂, 2,8% N₂, 2% Ar', 'Thin atmosphere: 95% CO₂, 2.8% N₂, 2% Ar'),
    layers: [
      { r: 0.54, color: '#d98b3a', name: L('Lõi', 'Core'), desc: L('Sắt, niken, lưu huỳnh lỏng, bán kính ~1.830 km (theo InSight)', 'Liquid iron, nickel, sulfur, ~1,830 km radius (InSight)') },
      { r: 0.985, color: '#a2492c', name: L('Lớp phủ', 'Mantle'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#d27b52', name: L('Vỏ', 'Crust'), desc: L('Dày ~24–72 km', '~24–72 km thick') },
    ],
  },
  {
    id: 'phobos', kind: 'moon', parent: 'mars', texture: '2k_moon.jpg', tint: '#8a7563', color: '#8a7563',
    name: L('Phobos', 'Phobos'),
    radiusKm: 11.3, mass: '1,07 × 10¹⁶ kg', gravity: 0.0057, orbitDays: 0.319, distKm: 9376,
    temp: L('~−40 °C', '~−40 °C'),
    summary: L(
      'Vệ tinh lớn hơn của Sao Hỏa, hình củ khoai, quay quanh hành tinh 3 lần mỗi ngày.',
      'Mars\'s larger moon, potato-shaped, circling the planet three times a day.'),
    facts: [
      L('Đang tiến dần về phía Sao Hỏa ~1,8 m mỗi thế kỷ; sẽ vỡ thành vành đai sau ~50 triệu năm.', 'Spirals closer to Mars by ~1.8 m per century; will break into a ring in ~50 million years.'),
      L('Có miệng hố Stickney rộng 9 km, gần bằng nửa vệ tinh.', 'Its Stickney crater is 9 km wide, almost half the moon.'),
    ],
    layers: [{ r: 1, color: '#7b6a5a', name: L('Khối đá rời (rubble pile)', 'Rubble pile'), desc: L('Đá và bụi kết dính lỏng lẻo, rỗng ~30%', 'Loosely bound rock and dust, ~30% empty space') }],
  },
  {
    id: 'deimos', kind: 'moon', parent: 'mars', texture: '2k_moon.jpg', tint: '#a8957f', color: '#a8957f',
    name: L('Deimos', 'Deimos'),
    radiusKm: 6.2, mass: '1,48 × 10¹⁵ kg', gravity: 0.003, orbitDays: 1.263, distKm: 23460,
    temp: L('~−40 °C', '~−40 °C'),
    summary: L('Vệ tinh nhỏ hơn, ở xa hơn của Sao Hỏa, bề mặt phẳng hơn Phobos do bị phủ lớp bụi dày.', 'Mars\'s smaller, outer moon, smoother than Phobos thanks to a thick dust blanket.'),
    facts: [L('Có thể là tiểu hành tinh bị Sao Hỏa bắt giữ, hoặc mảnh vỡ từ một vụ va chạm cổ.', 'May be a captured asteroid, or debris from an ancient impact.')],
    layers: [{ r: 1, color: '#9a8873', name: L('Đá carbon và bụi', 'Carbon-rich rock and dust'), desc: L('Phủ lớp bụi (regolith) dày', 'Covered in thick regolith') }],
  },

  // ───────── Sao Mộc
  {
    id: 'jupiter', kind: 'planet', parent: 'sun', texture: '2k_jupiter.jpg', color: '#d8b08c',
    name: L('Sao Mộc', 'Jupiter'),
    radiusKm: 69911, mass: '1,90 × 10²⁷ kg', gravity: 24.79, rotationH: 9.925, tilt: 3.13,
    orbitDays: 4332.6, au: 5.203, L0: 34.35, moonsCount: 97,
    temp: L('~−110 °C (đỉnh mây)', '~−110 °C (cloud tops)'),
    summary: L(
      'Hành tinh lớn nhất, khối lượng gấp 2,5 lần tất cả các hành tinh khác cộng lại. Là khối khí khổng lồ chủ yếu gồm hydro và heli.',
      'The largest planet, 2.5 times the mass of all the others combined. A gas giant made mostly of hydrogen and helium.'),
    facts: [
      L('Vết Đỏ Lớn là cơn bão đã tồn tại hơn 350 năm, rộng hơn Trái Đất.', 'The Great Red Spot is a storm over 350 years old, wider than Earth.'),
      L('Ngày ngắn nhất hệ Mặt Trời: chưa tới 10 giờ.', 'Shortest day in the Solar System: under 10 hours.'),
      L('Có 97 vệ tinh được xác nhận (tính đến 2025).', '97 confirmed moons (as of 2025).'),
    ],
    composition: L('~90% hydro, ~10% heli', '~90% hydrogen, ~10% helium'),
    layers: [
      { r: 0.20, color: '#c98c55', name: L('Lõi "loãng"', 'Dilute core'), desc: L('Đá và băng hòa lẫn với hydro, không có ranh giới rõ', 'Rock and ice mixed with hydrogen, no sharp edge') },
      { r: 0.78, color: '#9e8a7a', name: L('Hydro kim loại', 'Metallic hydrogen'), desc: L('Áp suất cực lớn biến hydro thành chất dẫn điện; tạo từ trường mạnh', 'Extreme pressure turns hydrogen into a conductor, powering a huge magnetic field') },
      { r: 0.97, color: '#cdb293', name: L('Hydro lỏng', 'Liquid hydrogen'), desc: L('Hydro phân tử lỏng', 'Liquid molecular hydrogen') },
      { r: 1.00, color: '#e8d2b5', name: L('Khí quyển', 'Atmosphere'), desc: L('Các dải mây amoniac', 'Bands of ammonia clouds') },
    ],
  },
  {
    id: 'io', kind: 'moon', parent: 'jupiter', texture: '2k_moon.jpg', tint: '#e6d16a', color: '#e6d16a',
    name: L('Io', 'Io'),
    radiusKm: 1821.6, mass: '8,93 × 10²² kg', gravity: 1.80, orbitDays: 1.769, distKm: 421700,
    temp: L('~−130 °C (núi lửa tới 1.600 °C)', '~−130 °C (lava up to 1,600 °C)'),
    summary: L('Thiên thể có hoạt động núi lửa mạnh nhất hệ Mặt Trời, với hơn 400 núi lửa đang hoạt động.', 'The most volcanically active world in the Solar System, with over 400 active volcanoes.'),
    facts: [L('Lực thủy triều của Sao Mộc nhào nặn lòng Io, tạo nhiệt cho núi lửa.', 'Jupiter\'s tides knead Io\'s interior, heating its volcanoes.')],
    layers: [
      { r: 0.52, color: '#c9782f', name: L('Lõi sắt', 'Iron core'), desc: L('Sắt và sắt sunfua', 'Iron and iron sulfide') },
      { r: 0.98, color: '#c26a3c', name: L('Lớp phủ', 'Mantle'), desc: L('Đá silicat nóng, một phần nóng chảy', 'Hot, partly molten silicate rock') },
      { r: 1.00, color: '#e6d16a', name: L('Vỏ', 'Crust'), desc: L('Phủ lưu huỳnh nhiều màu', 'Coated in colourful sulfur') },
    ],
  },
  {
    id: 'europa', kind: 'moon', parent: 'jupiter', texture: '2k_moon.jpg', tint: '#d9c9ae', color: '#d9c9ae',
    name: L('Europa', 'Europa'),
    radiusKm: 1560.8, mass: '4,80 × 10²² kg', gravity: 1.31, orbitDays: 3.551, distKm: 671034,
    temp: L('~−160 °C', '~−160 °C'),
    summary: L('Dưới lớp vỏ băng là đại dương nước mặn có thể chứa lượng nước gấp đôi các đại dương Trái Đất, một nơi đầy hứa hẹn để tìm sự sống.', 'Beneath its ice shell lies a salty ocean holding perhaps twice Earth\'s ocean water, a promising place to look for life.'),
    facts: [L('Tàu Europa Clipper của NASA (phóng 2024) sẽ tới Sao Mộc năm 2030.', 'NASA\'s Europa Clipper (launched 2024) arrives at Jupiter in 2030.')],
    layers: [
      { r: 0.40, color: '#b07a4a', name: L('Lõi kim loại', 'Metal core'), desc: L('Sắt–niken', 'Iron–nickel') },
      { r: 0.90, color: '#8c7e6e', name: L('Lớp phủ đá', 'Rocky mantle'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 0.985, color: '#3d7fbf', name: L('Đại dương', 'Ocean'), desc: L('Nước mặn lỏng, sâu ~60–150 km', 'Liquid salt water, ~60–150 km deep') },
      { r: 1.00, color: '#e8e2d6', name: L('Vỏ băng', 'Ice shell'), desc: L('Dày ~15–25 km', '~15–25 km thick') },
    ],
  },
  {
    id: 'ganymede', kind: 'moon', parent: 'jupiter', texture: '2k_moon.jpg', tint: '#a89c8c', color: '#a89c8c',
    name: L('Ganymede', 'Ganymede'),
    radiusKm: 2634.1, mass: '1,48 × 10²³ kg', gravity: 1.43, orbitDays: 7.155, distKm: 1070412,
    temp: L('~−160 °C', '~−160 °C'),
    summary: L('Vệ tinh lớn nhất hệ Mặt Trời, lớn hơn cả Sao Thủy, và là vệ tinh duy nhất có từ trường riêng.', 'The largest moon in the Solar System, bigger than Mercury, and the only moon with its own magnetic field.'),
    facts: [L('Tàu JUICE của ESA sẽ bay vào quỹ đạo quanh Ganymede năm 2034.', 'ESA\'s JUICE spacecraft will orbit Ganymede from 2034.')],
    layers: [
      { r: 0.25, color: '#c98a4a', name: L('Lõi sắt', 'Iron core'), desc: L('Lỏng một phần, tạo từ trường', 'Partly liquid, makes a magnetic field') },
      { r: 0.60, color: '#7c6f63', name: L('Lớp phủ đá', 'Rocky mantle'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 0.88, color: '#9fb6c9', name: L('Băng áp suất cao', 'High-pressure ice'), desc: L('Các dạng băng đặc', 'Dense forms of ice') },
      { r: 0.96, color: '#3d7fbf', name: L('Đại dương', 'Ocean'), desc: L('Nước mặn kẹp giữa các lớp băng', 'Salt water sandwiched between ice layers') },
      { r: 1.00, color: '#cfc8bb', name: L('Vỏ băng', 'Ice crust'), desc: L('Dày ~150 km', '~150 km thick') },
    ],
  },
  {
    id: 'callisto', kind: 'moon', parent: 'jupiter', texture: '2k_moon.jpg', tint: '#6e6458', color: '#6e6458',
    name: L('Callisto', 'Callisto'),
    radiusKm: 2410.3, mass: '1,08 × 10²³ kg', gravity: 1.24, orbitDays: 16.69, distKm: 1882709,
    temp: L('~−139 °C', '~−139 °C'),
    summary: L('Thiên thể nhiều miệng hố nhất hệ Mặt Trời; bề mặt gần như không đổi suốt 4 tỷ năm.', 'The most heavily cratered object in the Solar System; its surface has barely changed in 4 billion years.'),
    facts: [L('Bức xạ thấp nên được xem là nơi tiềm năng cho căn cứ của con người trong tương lai.', 'Its low radiation makes it a candidate site for a future human outpost.')],
    layers: [
      { r: 0.85, color: '#6d6257', name: L('Hỗn hợp đá–băng', 'Rock–ice mix'), desc: L('Phân lớp chưa hoàn toàn', 'Only partly differentiated') },
      { r: 0.95, color: '#3d7fbf', name: L('Đại dương (giả thuyết)', 'Ocean (possible)'), desc: L('Có thể có nước lỏng', 'May hold liquid water') },
      { r: 1.00, color: '#8f857a', name: L('Vỏ băng', 'Ice crust'), desc: L('Dày ~150–200 km', '~150–200 km thick') },
    ],
  },

  // ───────── Sao Thổ
  {
    id: 'saturn', kind: 'planet', parent: 'sun', texture: '2k_saturn.jpg', color: '#e3c98f', rings: true,
    name: L('Sao Thổ', 'Saturn'),
    radiusKm: 58232, mass: '5,68 × 10²⁶ kg', gravity: 10.44, rotationH: 10.656, tilt: 26.73,
    orbitDays: 10759.2, au: 9.537, L0: 50.08, moonsCount: 274,
    temp: L('~−140 °C (đỉnh mây)', '~−140 °C (cloud tops)'),
    summary: L(
      'Nổi tiếng với hệ vành đai rực rỡ làm từ băng và đá. Mật độ thấp tới mức nó có thể "nổi" trên nước.',
      'Famous for its dazzling rings of ice and rock. It is so low in density that it could "float" in water.'),
    facts: [
      L('Vành đai rộng ~280.000 km nhưng chỉ dày khoảng 10 m–1 km.', 'The rings span ~280,000 km but are only ~10 m–1 km thick.'),
      L('Giữ kỷ lục số vệ tinh: 274 vệ tinh được công nhận (tính đến 2025).', 'Record holder with 274 recognised moons (as of 2025).'),
      L('Ở cực Bắc có cơn bão hình lục giác khổng lồ.', 'A giant hexagon-shaped storm sits over its north pole.'),
    ],
    composition: L('~96% hydro, ~3% heli', '~96% hydrogen, ~3% helium'),
    layers: [
      { r: 0.25, color: '#b98a5a', name: L('Lõi', 'Core'), desc: L('Đá và băng', 'Rock and ice') },
      { r: 0.60, color: '#9a8a78', name: L('Hydro kim loại', 'Metallic hydrogen'), desc: L('Tạo ra từ trường', 'Generates the magnetic field') },
      { r: 0.97, color: '#d6c29a', name: L('Hydro lỏng', 'Liquid hydrogen'), desc: L('Hydro và heli lỏng', 'Liquid hydrogen and helium') },
      { r: 1.00, color: '#f1e1bb', name: L('Khí quyển', 'Atmosphere'), desc: L('Mây amoniac', 'Ammonia clouds') },
    ],
  },
  {
    id: 'mimas', kind: 'moon', parent: 'saturn', texture: '2k_moon.jpg', tint: '#cfcfcf', color: '#cfcfcf',
    name: L('Mimas', 'Mimas'),
    radiusKm: 198.2, mass: '3,75 × 10¹⁹ kg', gravity: 0.064, orbitDays: 0.942, distKm: 185539,
    temp: L('~−200 °C', '~−200 °C'),
    summary: L('Có miệng hố Herschel khổng lồ khiến nó trông như "Ngôi sao Tử thần" trong Star Wars.', 'Its giant Herschel crater makes it look like the "Death Star" from Star Wars.'),
    facts: [L('Dữ liệu năm 2024 cho thấy có thể có đại dương trẻ dưới lớp băng.', '2024 data suggest a young ocean may lie beneath its ice.')],
    layers: [
      { r: 0.45, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#d9d9d9', name: L('Lớp băng', 'Ice shell'), desc: L('Chủ yếu là băng nước', 'Mostly water ice') },
    ],
  },
  {
    id: 'enceladus', kind: 'moon', parent: 'saturn', texture: '2k_moon.jpg', tint: '#f2f6ff', color: '#f2f6ff',
    name: L('Enceladus', 'Enceladus'),
    radiusKm: 252.1, mass: '1,08 × 10²⁰ kg', gravity: 0.113, orbitDays: 1.370, distKm: 237948,
    temp: L('~−198 °C', '~−198 °C'),
    summary: L('Vật thể trắng sáng nhất hệ Mặt Trời. Các mạch phun nước ở cực Nam bắn hơi nước và băng từ đại dương ngầm ra không gian.', 'The most reflective body in the Solar System. Geysers at its south pole spray water from a hidden ocean into space.'),
    facts: [L('Tàu Cassini đã bay xuyên qua mạch phun và phát hiện phân tử hữu cơ.', 'Cassini flew through the plumes and detected organic molecules.')],
    layers: [
      { r: 0.75, color: '#8a7f73', name: L('Lõi đá xốp', 'Porous rocky core'), desc: L('Nước thấm qua và được làm nóng', 'Water seeps through and warms') },
      { r: 0.92, color: '#3d7fbf', name: L('Đại dương toàn cầu', 'Global ocean'), desc: L('Nước mặn lỏng', 'Liquid salt water') },
      { r: 1.00, color: '#f2f6ff', name: L('Vỏ băng', 'Ice shell'), desc: L('Mỏng nhất ở cực Nam (~5 km)', 'Thinnest at the south pole (~5 km)') },
    ],
  },
  {
    id: 'titan', kind: 'moon', parent: 'saturn', texture: '2k_venus_atmosphere.jpg', tint: '#e0a64a', color: '#e0a64a',
    name: L('Titan', 'Titan'),
    radiusKm: 2574.7, mass: '1,35 × 10²³ kg', gravity: 1.35, orbitDays: 15.945, distKm: 1221870,
    temp: L('~−179 °C', '~−179 °C'),
    summary: L('Vệ tinh lớn thứ hai và là vệ tinh duy nhất có khí quyển dày (đặc hơn khí quyển Trái Đất). Có sông, hồ và mưa bằng mêtan lỏng.', 'The second-largest moon and the only one with a thick atmosphere (denser than Earth\'s). It has rivers, lakes and rain of liquid methane.'),
    facts: [
      L('Áp suất bề mặt bằng 1,5 lần Trái Đất.', 'Surface pressure is 1.5 times Earth\'s.'),
      L('Tàu bay Dragonfly của NASA dự kiến phóng năm 2028 để khám phá Titan.', 'NASA\'s Dragonfly rotorcraft is due to launch in 2028 to explore Titan.'),
    ],
    layers: [
      { r: 0.70, color: '#7a6a5a', name: L('Lõi đá ngậm nước', 'Hydrated rock core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 0.82, color: '#9fb6c9', name: L('Băng áp suất cao', 'High-pressure ice'), desc: L('Băng đặc', 'Dense ice') },
      { r: 0.95, color: '#3d7fbf', name: L('Đại dương', 'Ocean'), desc: L('Nước mặn có amoniac', 'Ammonia-rich salt water') },
      { r: 1.00, color: '#e0a64a', name: L('Vỏ băng', 'Ice crust'), desc: L('Phủ bởi lớp hữu cơ, khí quyển N₂', 'Organic coating under an N₂ atmosphere') },
    ],
  },
  {
    id: 'rhea', kind: 'moon', parent: 'saturn', texture: '2k_moon.jpg', tint: '#d4d0c8', color: '#d4d0c8',
    name: L('Rhea', 'Rhea'),
    radiusKm: 763.8, mass: '2,31 × 10²¹ kg', gravity: 0.26, orbitDays: 4.518, distKm: 527108,
    temp: L('~−174 °C', '~−174 °C'),
    summary: L('Vệ tinh lớn thứ hai của Sao Thổ, là quả cầu băng lạnh với bề mặt nhiều miệng hố.', 'Saturn\'s second-largest moon, a cold, cratered ball of ice.'),
    facts: [L('Có ngoại quyển mỏng chứa oxy và CO₂.', 'Has a thin exosphere of oxygen and CO₂.')],
    layers: [
      { r: 0.40, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#dcd8d0', name: L('Lớp băng', 'Ice mantle'), desc: L('Băng nước', 'Water ice') },
    ],
  },
  {
    id: 'iapetus', kind: 'moon', parent: 'saturn', texture: '2k_moon.jpg', tint: '#a6927a', color: '#a6927a',
    name: L('Iapetus', 'Iapetus'),
    radiusKm: 734.5, mass: '1,81 × 10²¹ kg', gravity: 0.22, orbitDays: 79.32, distKm: 3560820,
    temp: L('~−143 °C', '~−143 °C'),
    summary: L('Vệ tinh "hai màu": một bán cầu tối như than, bán cầu kia sáng như tuyết. Có dải núi chạy dọc xích đạo cao tới 20 km.', 'The "two-tone" moon: one hemisphere dark as coal, the other bright as snow, with an equatorial ridge up to 20 km high.'),
    facts: [L('Nhà thiên văn Cassini phát hiện nó năm 1671.', 'Discovered by Giovanni Cassini in 1671.')],
    layers: [
      { r: 0.35, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#cfc4b4', name: L('Lớp băng', 'Ice mantle'), desc: L('Băng nước', 'Water ice') },
    ],
  },

  // ───────── Sao Thiên Vương
  {
    id: 'uranus', kind: 'planet', parent: 'sun', texture: '2k_uranus.jpg', color: '#9fd8e0',
    name: L('Sao Thiên Vương', 'Uranus'),
    radiusKm: 25362, mass: '8,68 × 10²⁵ kg', gravity: 8.69, rotationH: -17.24, tilt: 97.77,
    orbitDays: 30687, au: 19.19, L0: 314.06, moonsCount: 29,
    temp: L('~−195 °C', '~−195 °C'),
    summary: L(
      'Hành tinh "băng khổng lồ" nằm nghiêng gần 98°, như đang lăn trên quỹ đạo. Màu xanh lục lam đến từ khí mêtan.',
      'An "ice giant" tipped over by nearly 98°, as if rolling along its orbit. Methane gas gives it its cyan colour.'),
    facts: [
      L('Mỗi cực có 42 năm ánh sáng liên tục rồi 42 năm tối.', 'Each pole gets 42 years of daylight followed by 42 years of darkness.'),
      L('Là hành tinh đầu tiên được phát hiện bằng kính thiên văn (William Herschel, 1781).', 'First planet discovered with a telescope (William Herschel, 1781).'),
      L('Có 29 vệ tinh được biết (tính đến 2025).', '29 known moons (as of 2025).'),
    ],
    composition: L('Khí quyển: 83% H₂, 15% He, 2% CH₄', 'Atmosphere: 83% H₂, 15% He, 2% CH₄'),
    layers: [
      { r: 0.20, color: '#9b7a5a', name: L('Lõi đá', 'Rocky core'), desc: L('Kích thước cỡ Trái Đất', 'About Earth-sized') },
      { r: 0.75, color: '#3f8fb0', name: L('Lớp phủ băng', 'Icy mantle'), desc: L('Chất lỏng nóng đặc gồm nước, amoniac, mêtan', 'Hot dense fluid of water, ammonia and methane') },
      { r: 1.00, color: '#a9e2ea', name: L('Khí quyển', 'Atmosphere'), desc: L('Hydro, heli, mêtan', 'Hydrogen, helium, methane') },
    ],
  },
  {
    id: 'miranda', kind: 'moon', parent: 'uranus', texture: '2k_moon.jpg', tint: '#bdbdbd', color: '#bdbdbd',
    name: L('Miranda', 'Miranda'),
    radiusKm: 235.8, mass: '6,4 × 10¹⁹ kg', gravity: 0.079, orbitDays: 1.413, distKm: 129390,
    temp: L('~−187 °C', '~−187 °C'),
    summary: L('Bề mặt "chắp vá" kỳ lạ, có vách đá Verona Rupes cao ~20 km, có thể là vách đá cao nhất hệ Mặt Trời.', 'A strangely patchwork surface with Verona Rupes, a ~20 km cliff, possibly the tallest in the Solar System.'),
    facts: [L('Chỉ được chụp cận cảnh một lần bởi Voyager 2 năm 1986.', 'Imaged up close only once, by Voyager 2 in 1986.')],
    layers: [
      { r: 0.55, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#cfcfcf', name: L('Lớp băng', 'Ice mantle'), desc: L('Băng nước', 'Water ice') },
    ],
  },
  {
    id: 'titania', kind: 'moon', parent: 'uranus', texture: '2k_moon.jpg', tint: '#b8aca0', color: '#b8aca0',
    name: L('Titania', 'Titania'),
    radiusKm: 788.4, mass: '3,4 × 10²¹ kg', gravity: 0.38, orbitDays: 8.706, distKm: 435910,
    temp: L('~−203 °C', '~−203 °C'),
    summary: L('Vệ tinh lớn nhất của Sao Thiên Vương, với các hẻm núi dài hàng trăm km.', 'Uranus\'s largest moon, cut by canyons hundreds of kilometres long.'),
    facts: [L('Tên lấy từ nữ hoàng tiên trong vở "Giấc mộng đêm hè" của Shakespeare.', 'Named after the fairy queen in Shakespeare\'s "A Midsummer Night\'s Dream".')],
    layers: [
      { r: 0.66, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#cdc3b8', name: L('Lớp băng', 'Ice mantle'), desc: L('Có thể có nước lỏng ở đáy', 'May hide liquid water at its base') },
    ],
  },
  {
    id: 'oberon', kind: 'moon', parent: 'uranus', texture: '2k_moon.jpg', tint: '#a09080', color: '#a09080',
    name: L('Oberon', 'Oberon'),
    radiusKm: 761.4, mass: '3,08 × 10²¹ kg', gravity: 0.35, orbitDays: 13.46, distKm: 583520,
    temp: L('~−203 °C', '~−203 °C'),
    summary: L('Vệ tinh ngoài cùng trong năm vệ tinh lớn của Sao Thiên Vương, bề mặt cổ xưa đầy miệng hố.', 'The outermost of Uranus\'s five large moons, with an ancient cratered surface.'),
    facts: [L('Có ngọn núi cao ~11 km.', 'Has a mountain about 11 km high.')],
    layers: [
      { r: 0.63, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#bcae9f', name: L('Lớp băng', 'Ice mantle'), desc: L('Băng nước', 'Water ice') },
    ],
  },

  // ───────── Sao Hải Vương
  {
    id: 'neptune', kind: 'planet', parent: 'sun', texture: '2k_neptune.jpg', color: '#4b70dd',
    name: L('Sao Hải Vương', 'Neptune'),
    radiusKm: 24622, mass: '1,02 × 10²⁶ kg', gravity: 11.15, rotationH: 16.11, tilt: 28.32,
    orbitDays: 60190, au: 30.07, L0: 304.35, moonsCount: 16,
    temp: L('~−200 °C', '~−200 °C'),
    summary: L(
      'Hành tinh xa nhất, được tìm ra nhờ tính toán toán học trước khi quan sát (1846). Có gió mạnh nhất hệ Mặt Trời, tới ~2.100 km/h.',
      'The most distant planet, predicted by mathematics before it was seen (1846). It has the fastest winds in the Solar System, up to ~2,100 km/h.'),
    facts: [
      L('Một năm dài 165 năm Trái Đất; nó mới hoàn thành một vòng kể từ khi được phát hiện (2011).', 'A year lasts 165 Earth years; it completed its first orbit since discovery only in 2011.'),
      L('Có 16 vệ tinh được biết.', '16 known moons.'),
    ],
    composition: L('Khí quyển: 80% H₂, 19% He, 1,5% CH₄', 'Atmosphere: 80% H₂, 19% He, 1.5% CH₄'),
    layers: [
      { r: 0.25, color: '#9b7a5a', name: L('Lõi đá', 'Rocky core'), desc: L('Đá và sắt, cỡ Trái Đất', 'Rock and iron, about Earth-sized') },
      { r: 0.80, color: '#2f5fb0', name: L('Lớp phủ băng', 'Icy mantle'), desc: L('Nước, amoniac, mêtan nóng đặc', 'Hot dense water, ammonia, methane') },
      { r: 1.00, color: '#5b82e6', name: L('Khí quyển', 'Atmosphere'), desc: L('Hydro, heli, mêtan', 'Hydrogen, helium, methane') },
    ],
  },
  {
    id: 'triton', kind: 'moon', parent: 'neptune', texture: '2k_moon.jpg', tint: '#d8c8c0', color: '#d8c8c0',
    name: L('Triton', 'Triton'),
    radiusKm: 1353.4, mass: '2,14 × 10²² kg', gravity: 0.78, orbitDays: -5.877, distKm: 354759,
    temp: L('~−235 °C', '~−235 °C'),
    summary: L('Vệ tinh lớn duy nhất quay ngược chiều tự quay của hành tinh mẹ, có thể là thiên thể vành đai Kuiper bị bắt giữ.', 'The only large moon orbiting backwards, probably a captured Kuiper Belt object.'),
    facts: [L('Voyager 2 phát hiện các mạch phun khí nitơ cao 8 km.', 'Voyager 2 spotted nitrogen geysers 8 km tall.')],
    layers: [
      { r: 0.70, color: '#8a7f73', name: L('Lõi đá–kim loại', 'Rock–metal core'), desc: L('Chiếm phần lớn khối lượng', 'Most of its mass') },
      { r: 0.90, color: '#3d7fbf', name: L('Đại dương (giả thuyết)', 'Ocean (possible)'), desc: L('Nước–amoniac', 'Water–ammonia') },
      { r: 1.00, color: '#e3d6cf', name: L('Vỏ băng', 'Ice crust'), desc: L('Băng nitơ và nước', 'Nitrogen and water ice') },
    ],
  },

  // ───────── Sao Diêm Vương
  {
    id: 'pluto', kind: 'dwarf', parent: 'sun', texture: '2k_moon.jpg', tint: '#d9b99b', color: '#d9b99b',
    name: L('Sao Diêm Vương', 'Pluto'),
    radiusKm: 1188.3, mass: '1,30 × 10²² kg', gravity: 0.62, rotationH: -153.3, tilt: 122.5,
    orbitDays: 90560, au: 39.48, L0: 238.93, moonsCount: 5,
    temp: L('~−229 °C', '~−229 °C'),
    summary: L(
      'Hành tinh lùn ở vành đai Kuiper, bị "hạ cấp" khỏi danh sách hành tinh năm 2006. Có vùng băng nitơ hình trái tim nổi tiếng (Tombaugh Regio).',
      'A dwarf planet in the Kuiper Belt, reclassified in 2006. Known for its heart-shaped nitrogen ice plain (Tombaugh Regio).'),
    facts: [
      L('Tàu New Horizons bay ngang qua năm 2015, chụp ảnh cận cảnh đầu tiên.', 'New Horizons flew past in 2015, taking the first close-up images.'),
      L('Nhỏ hơn cả Mặt Trăng của chúng ta.', 'Smaller than our Moon.'),
    ],
    composition: L('Khí quyển mỏng: N₂, CH₄, CO', 'Thin atmosphere: N₂, CH₄, CO'),
    layers: [
      { r: 0.72, color: '#8a7f73', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 0.85, color: '#3d7fbf', name: L('Đại dương (giả thuyết)', 'Ocean (possible)'), desc: L('Nước lỏng dưới lớp băng', 'Liquid water under the ice') },
      { r: 1.00, color: '#e8d3bd', name: L('Vỏ băng', 'Ice crust'), desc: L('Băng nước, phủ băng nitơ và mêtan', 'Water ice topped with nitrogen and methane frost') },
    ],
  },
  {
    id: 'charon', kind: 'moon', parent: 'pluto', texture: '2k_moon.jpg', tint: '#a8a29a', color: '#a8a29a',
    name: L('Charon', 'Charon'),
    radiusKm: 606, mass: '1,59 × 10²¹ kg', gravity: 0.29, orbitDays: 6.387, distKm: 19591,
    temp: L('~−220 °C', '~−220 °C'),
    summary: L('Vệ tinh lớn bằng nửa Sao Diêm Vương; hai thiên thể quay quanh một tâm chung nằm giữa chúng, như một "hành tinh đôi".', 'Half the size of Pluto; the two orbit a shared point between them, like a "double planet".'),
    facts: [L('Cực Bắc có vùng màu đỏ sẫm tên Mordor Macula.', 'Its north pole has a reddish cap nicknamed Mordor Macula.')],
    layers: [
      { r: 0.70, color: '#8a8580', name: L('Lõi đá', 'Rocky core'), desc: L('Đá silicat', 'Silicate rock') },
      { r: 1.00, color: '#bdb7ae', name: L('Lớp băng', 'Ice mantle'), desc: L('Băng nước', 'Water ice') },
    ],
  },
];

export const BY_ID = Object.fromEntries(BODIES.map(b => [b.id, b]));
// Chỉ vệ tinh tự nhiên (không tính các hành tinh quay quanh Mặt Trời)
export const childrenOf = id => BODIES.filter(b => b.parent === id && b.kind === 'moon');
export const PLANETS = BODIES.filter(b => b.parent === 'sun');
