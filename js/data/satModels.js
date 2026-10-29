// Cấu trúc và thông số kỹ thuật của các vệ tinh nổi bật (dùng cho mô hình 3D).
// Mỗi "part" ứng với một nhóm chi tiết trong mô hình (js/models/satellites.js).

const L = (vi, en) => ({ vi, en });

export const SAT_MODELS = {
  iss: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~420.000 kg', '~420,000 kg')],
      [L('Kích thước', 'Size'), L('109 m × 73 m (dài giàn × sải cánh pin)', '109 m × 73 m (truss × array span)')],
      [L('Thể tích điều áp', 'Pressurised volume'), L('~916 m³ (bằng một máy bay Boeing 747)', '~916 m³ (about a Boeing 747)')],
      [L('Pin Mặt Trời', 'Solar arrays'), L('8 cánh chính, ~2.500 m², cùng các tấm iROSA lắp thêm từ 2021', '8 main wings, ~2,500 m², plus iROSA panels added from 2021')],
    ],
    parts: [
      { key: 'truss', name: L('Giàn tích hợp', 'Integrated truss'), desc: L('"Xương sống" dài 109 m, mang pin, tản nhiệt và thiết bị bên ngoài', 'The 109 m backbone carrying arrays, radiators and external payloads') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar array wings'), desc: L('8 cánh dài ~35 m, xoay theo Mặt Trời', 'Eight ~35 m wings that track the Sun') },
      { key: 'radiators', name: L('Tấm tản nhiệt', 'Radiators'), desc: L('Thải nhiệt dư ra không gian bằng amoniac lỏng tuần hoàn', 'Dump excess heat to space using circulating ammonia') },
      { key: 'usModules', name: L('Mô-đun Mỹ', 'US modules'), desc: L('Destiny (phòng thí nghiệm), Unity, Harmony (nút nối)', 'Destiny (lab), Unity and Harmony (nodes)') },
      { key: 'labs', name: L('Phòng thí nghiệm châu Âu & Nhật', 'European & Japanese labs'), desc: L('Columbus (ESA) và Kibo (JAXA) — Kibo là mô-đun lớn nhất', 'Columbus (ESA) and Kibo (JAXA), the largest module') },
      { key: 'ruModules', name: L('Mô-đun Nga', 'Russian modules'), desc: L('Zarya (mô-đun đầu tiên, 1998) và Zvezda (khu ở, động cơ)', 'Zarya (first module, 1998) and Zvezda (living quarters, engines)') },
      { key: 'cupola', name: L('Cupola', 'Cupola'), desc: L('Mái vòm 7 cửa sổ để quan sát Trái Đất và điều khiển cánh tay robot', 'Seven-window dome for Earth viewing and robotic-arm work') },
    ],
    sources: [['NASA – Space Station Facts and Figures', 'https://www.nasa.gov/international-space-station/space-station-facts-and-figures/']],
  },

  tiangong: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~100 tấn (3 mô-đun, mỗi mô-đun ~22–23 tấn)', '~100 t (three modules of ~22–23 t each)')],
      [L('Mô-đun lõi Thiên Hòa', 'Tianhe core'), L('Dài 16,6 m, đường kính 4,2 m', '16.6 m long, 4.2 m diameter')],
      [L('Pin Mặt Trời', 'Solar arrays'), L('Cánh dẻo dài ~27 m trên Vấn Thiên và Mộng Thiên', 'Flexible ~27 m wings on Wentian and Mengtian')],
      [L('Cánh tay robot', 'Robotic arms'), L('10 m (Thiên Hòa) + 5 m (Vấn Thiên)', '10 m (Tianhe) + 5 m (Wentian)')],
    ],
    parts: [
      { key: 'core', name: L('Mô-đun lõi Thiên Hòa', 'Tianhe core module'), desc: L('Khu ở, điều khiển, hỗ trợ sự sống; phóng 2021', 'Living, control and life support; launched 2021') },
      { key: 'node', name: L('Nút nối & cổng ghép', 'Docking hub'), desc: L('Đầu hình cầu với nhiều cổng ghép cho tàu Thần Châu, Thiên Châu', 'Spherical hub with ports for Shenzhou and Tianzhou ships') },
      { key: 'wentian', name: L('Mô-đun Vấn Thiên', 'Wentian module'), desc: L('Phòng thí nghiệm sinh học, có khoang dự phòng cho phi hành đoàn', 'Life-science lab with backup crew quarters') },
      { key: 'mengtian', name: L('Mô-đun Mộng Thiên', 'Mengtian module'), desc: L('Phòng thí nghiệm vật lý vi trọng lực, đồng hồ nguyên tử lạnh', 'Microgravity physics lab, including cold-atom clocks') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Pin gali arsenua dạng dẻo, gập được', 'Flexible, foldable gallium-arsenide arrays') },
      { key: 'arm', name: L('Cánh tay robot', 'Robotic arm'), desc: L('Di chuyển mô-đun, hỗ trợ đi bộ ngoài không gian', 'Moves modules and supports spacewalks') },
    ],
    sources: [['Wikipedia – Tiangong space station', 'https://en.wikipedia.org/wiki/Tiangong_space_station'], ['Anadolu – China launches core module', 'https://aa.com.tr/en/science-technology/china-launches-core-module-of-its-space-station/2224128']],
  },

  hubble: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~12.200 kg (sau lần bảo dưỡng 2009)', '~12,200 kg (after the 2009 servicing)')],
      [L('Kích thước', 'Size'), L('Dài 13,2 m, đường kính 4,2 m', '13.2 m long, 4.2 m diameter')],
      [L('Gương chính', 'Primary mirror'), L('2,4 m, kiểu Cassegrain (Ritchey–Chrétien)', '2.4 m, Ritchey–Chrétien Cassegrain')],
      [L('Bước sóng', 'Wavelengths'), L('Cực tím, khả kiến, cận hồng ngoại', 'Ultraviolet, visible, near-infrared')],
    ],
    parts: [
      { key: 'door', name: L('Nắp khẩu độ', 'Aperture door'), desc: L('Tự đóng lại để che ánh sáng Mặt Trời chiếu thẳng vào ống', 'Closes automatically to block direct sunlight') },
      { key: 'tube', name: L('Ống quang học (OTA)', 'Optical Telescope Assembly'), desc: L('Vỏ bọc lớp cách nhiệt bạc, giữ quang học ở nhiệt độ ổn định', 'Silver-insulated tube keeping the optics thermally stable') },
      { key: 'primary', name: L('Gương chính 2,4 m', '2.4 m primary mirror'), desc: L('Thủy tinh siêu giãn nở thấp, phủ nhôm', 'Ultra-low-expansion glass coated with aluminium') },
      { key: 'secondary', name: L('Gương phụ 0,3 m', '0.3 m secondary mirror'), desc: L('Phản xạ ánh sáng ngược qua lỗ giữa gương chính tới thiết bị', 'Bounces light back through the primary\'s central hole') },
      { key: 'instruments', name: L('Khoang thiết bị', 'Instrument bay'), desc: L('WFC3, ACS, COS, STIS và cảm biến dẫn hướng chính xác', 'WFC3, ACS, COS, STIS and Fine Guidance Sensors') },
      { key: 'arrays', name: L('Pin Mặt Trời', 'Solar arrays'), desc: L('Hai tấm cứng 7,1 × 2,6 m, lắp năm 2002', 'Two rigid 7.1 × 2.6 m panels, fitted in 2002') },
      { key: 'antennas', name: L('Ăng-ten độ lợi cao', 'High-gain antennas'), desc: L('Liên lạc qua vệ tinh chuyển tiếp TDRS', 'Talk to Earth via TDRS relay satellites') },
    ],
    sources: [['NASA – Hubble Observatory', 'https://science.nasa.gov/mission/hubble/observatory/']],
  },

  starlink: {
    specs: [
      [L('Phiên bản', 'Version'), L('Starlink V2 Mini (từ 2023)', 'Starlink V2 Mini (from 2023)')],
      [L('Khối lượng', 'Mass'), L('~800 kg', '~800 kg')],
      [L('Kích thước', 'Size'), L('Thân ~4 m; sải cánh ~30 m', '~4 m body; ~30 m span')],
      [L('Pin Mặt Trời', 'Solar arrays'), L('2 cánh × 52,5 m²', '2 wings × 52.5 m²')],
    ],
    parts: [
      { key: 'bus', name: L('Thân phẳng', 'Flat-pack bus'), desc: L('Thiết kế dẹt để xếp chồng hàng chục chiếc trong một tên lửa', 'Flat so dozens stack inside one rocket fairing') },
      { key: 'arrays', name: L('Hai cánh pin', 'Two solar wings'), desc: L('Mỗi cánh 52,5 m²', '52.5 m² each') },
      { key: 'antennas', name: L('Ăng-ten mảng pha', 'Phased-array antennas'), desc: L('Lái chùm sóng bằng điện tử, không cần xoay ăng-ten', 'Steer beams electronically with no moving parts') },
      { key: 'lasers', name: L('Liên kết laser', 'Laser links'), desc: L('Truyền dữ liệu giữa các vệ tinh mà không cần trạm mặt đất', 'Pass data satellite-to-satellite without ground stations') },
      { key: 'thruster', name: L('Động cơ Hall chạy argon', 'Argon Hall thruster'), desc: L('Động cơ điện để nâng quỹ đạo, né va chạm và tự rời quỹ đạo', 'Electric engine for raising orbit, dodging debris and de-orbiting') },
    ],
    sources: [['Spaceflight Now – V2 Mini (2023)', 'https://spaceflightnow.com/2023/02/26/spacex-unveils-first-batch-of-larger-upgraded-starlink-satellites/']],
  },

  oneweb: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~150 kg', '~150 kg')],
      [L('Nhà sản xuất', 'Builder'), L('OneWeb Satellites (Airbus)', 'OneWeb Satellites (Airbus)')],
      [L('Tần số', 'Bands'), L('Ku (người dùng), Ka (trạm cổng)', 'Ku (users), Ka (gateways)')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Sản xuất hàng loạt, tới 2 chiếc mỗi ngày', 'Mass-produced at up to two a day') },
      { key: 'arrays', name: L('Pin Mặt Trời', 'Solar arrays'), desc: L('Hai cánh gập', 'Two folding wings') },
      { key: 'antennas', name: L('Ăng-ten Ku', 'Ku-band antennas'), desc: L('Phủ sóng người dùng bên dưới', 'Cover users below') },
      { key: 'gateway', name: L('Ăng-ten Ka', 'Ka-band gateway antennas'), desc: L('Kết nối với trạm cổng mặt đất', 'Link to ground gateways') },
    ],
    sources: [['eoPortal – OneWeb', 'https://www.eoportal.org/satellite-missions/oneweb']],
  },

  vnredsat: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~120 kg', '~120 kg')],
      [L('Nền tảng', 'Platform'), L('AstroSat-100 (Airbus/Astrium)', 'AstroSat-100 (Airbus/Astrium)')],
      [L('Độ phân giải', 'Resolution'), L('2,5 m (toàn sắc), 10 m (4 kênh đa phổ)', '2.5 m (pan), 10 m (4 multispectral bands)')],
      [L('Bề rộng dải chụp', 'Swath'), L('17,5 km', '17.5 km')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Nhỏ gọn, cỡ một chiếc tủ lạnh', 'Compact, about fridge-sized') },
      { key: 'arrays', name: L('Ba tấm pin', 'Three solar panels'), desc: L('Mở ra cố định quanh thân', 'Deploy into a fixed fan around the body') },
      { key: 'camera', name: L('Camera NAOMI', 'NAOMI camera'), desc: L('Kính thiên văn quang học hướng xuống mặt đất', 'Optical telescope pointed at the ground') },
      { key: 'antenna', name: L('Ăng-ten băng X', 'X-band antenna'), desc: L('Truyền ảnh về trạm thu tại Hòa Lạc', 'Downlinks images to the Hoa Lac ground station') },
    ],
    sources: [['eoPortal – VNREDSat-1', 'https://www.eoportal.org/satellite-missions/vnredsat-1']],
  },

  landsat9: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~2,7 tấn', '~2.7 t')],
      [L('Thiết bị', 'Instruments'), L('OLI-2 (9 kênh, 15–30 m), TIRS-2 (2 kênh nhiệt, 100 m)', 'OLI-2 (9 bands, 15–30 m), TIRS-2 (2 thermal bands, 100 m)')],
      [L('Bề rộng dải chụp', 'Swath'), L('185 km; chụp lại sau 16 ngày (8 ngày khi kết hợp Landsat 8)', '185 km; 16-day revisit (8 days with Landsat 8)')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Do Northrop Grumman chế tạo', 'Built by Northrop Grumman') },
      { key: 'oli', name: L('OLI-2', 'OLI-2'), desc: L('Chụp ảnh ánh sáng khả kiến và hồng ngoại', 'Images in visible and infrared light') },
      { key: 'tirs', name: L('TIRS-2', 'TIRS-2'), desc: L('Đo nhiệt độ bề mặt (tưới tiêu, núi lửa, đô thị)', 'Measures surface temperature (irrigation, volcanoes, cities)') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar array'), desc: L('Một cánh lớn ở một bên', 'A single large wing on one side') },
    ],
    sources: [['NASA – Landsat 9', 'https://landsat.gsfc.nasa.gov/satellites/landsat-9/']],
  },

  gps: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~3.900 kg', '~3,900 kg')],
      [L('Nền tảng', 'Platform'), L('Lockheed Martin LM2100', 'Lockheed Martin LM2100')],
      [L('Tuổi thọ thiết kế', 'Design life'), L('15 năm', '15 years')],
      [L('Đồng hồ', 'Clocks'), L('3 đồng hồ nguyên tử rubidi', '3 rubidium atomic clocks')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Bọc màng cách nhiệt vàng; bên trong là đồng hồ nguyên tử', 'Wrapped in gold insulation; atomic clocks inside') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Hai cánh xoay theo Mặt Trời', 'Two Sun-tracking wings') },
      { key: 'lband', name: L('Mảng ăng-ten băng L', 'L-band antenna array'), desc: L('Các ăng-ten xoắn phát tín hiệu định vị xuống Trái Đất', 'Helical antennas beaming navigation signals to Earth') },
      { key: 'crosslink', name: L('Ăng-ten liên lạc chéo', 'Crosslink antenna'), desc: L('Trao đổi dữ liệu giữa các vệ tinh GPS', 'Exchanges data between GPS satellites') },
    ],
    sources: [['GPS.gov – Space segment', 'https://www.gps.gov/systems/gps/space/']],
  },

  galileo: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~733 kg', '~733 kg')],
      [L('Kích thước', 'Size'), L('Thân 2,5 × 1,1 × 1,2 m; sải cánh 14,7 m', '2.5 × 1.1 × 1.2 m body; 14.7 m span')],
      [L('Đồng hồ', 'Clocks'), L('2 maser hydro thụ động + 2 đồng hồ rubidi', '2 passive hydrogen masers + 2 rubidium clocks')],
      [L('Tuổi thọ thiết kế', 'Design life'), L('12 năm', '12 years')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Chứa đồng hồ maser hydro, chỉ lệch ~1 giây sau 3 triệu năm', 'Holds hydrogen masers, off by ~1 s in 3 million years') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Cung cấp ~1,9 kW', 'Supply ~1.9 kW') },
      { key: 'lband', name: L('Ăng-ten băng L', 'L-band antenna'), desc: L('Phát tín hiệu định vị', 'Broadcasts navigation signals') },
      { key: 'sar', name: L('Ăng-ten tìm kiếm cứu nạn', 'Search & rescue antenna'), desc: L('Thu tín hiệu cấp cứu từ tàu thuyền, máy bay', 'Picks up distress beacons from ships and aircraft') },
    ],
    sources: [['ESA – Galileo satellites', 'https://www.esa.int/Applications/Satellite_navigation/Galileo/Galileo_satellites']],
  },

  glonass: {
    specs: [
      [L('Phiên bản', 'Version'), L('GLONASS-K / K2', 'GLONASS-K / K2')],
      [L('Khối lượng', 'Mass'), L('~935 kg (GLONASS-K)', '~935 kg (GLONASS-K)')],
      [L('Tuổi thọ thiết kế', 'Design life'), L('10 năm', '10 years')],
    ],
    parts: [
      { key: 'bus', name: L('Thân không điều áp', 'Unpressurised bus'), desc: L('Nhẹ hơn nhiều so với thế hệ GLONASS-M cũ', 'Much lighter than the older GLONASS-M') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Hai cánh xoay theo Mặt Trời', 'Two Sun-tracking wings') },
      { key: 'lband', name: L('Ăng-ten định vị', 'Navigation antenna'), desc: L('Phát tín hiệu FDMA và CDMA mới', 'Broadcasts FDMA and newer CDMA signals') },
    ],
    sources: [["Gunter's Space Page – GLONASS-K", 'https://space.skyrocket.de/doc_sdat/uragan-k.htm']],
  },

  vinasat1: {
    specs: [
      [L('Khối lượng phóng', 'Launch mass'), L('~2,6 tấn', '~2.6 t')],
      [L('Nền tảng', 'Platform'), L('Lockheed Martin A2100A', 'Lockheed Martin A2100A')],
      [L('Bộ phát đáp', 'Transponders'), L('12 băng Ku + 8 băng C (đang khai thác)', '12 Ku-band + 8 C-band (active)')],
      [L('Vị trí', 'Slot'), L('132° Đông · phóng 19/4/2008 bằng Ariane 5', '132° E · launched 19 Apr 2008 on Ariane 5')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh A2100', 'A2100 bus'), desc: L('Chứa bộ phát đáp, nhiên liệu và động cơ', 'Holds transponders, propellant and engines') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Hai cánh luôn xoay hướng Mặt Trời', 'Two wings always turned to the Sun') },
      { key: 'reflectors', name: L('Chảo phản xạ', 'Antenna reflectors'), desc: L('Tập trung sóng xuống vùng phủ Việt Nam và lân cận', 'Focus beams onto Vietnam and nearby regions') },
      { key: 'feeds', name: L('Loa thu phát', 'Feed horns'), desc: L('Phát sóng vào chảo phản xạ', 'Illuminate the reflectors') },
    ],
    sources: [['Lockheed Martin – VINASAT-1 launch', 'https://news.lockheedmartin.com/2008-04-18-Lockheed-Martin-Built-VINASAT-1-Satellite-Launched-Successfully-for-Vietnam-Posts-and-Telecommunications-Group'], ["Gunter's Space Page – VINASAT-1", 'https://space.skyrocket.de/doc_sdat/vinasat-1.htm']],
  },

  vinasat2: {
    specs: [
      [L('Khối lượng phóng', 'Launch mass'), L('~3 tấn', '~3 t')],
      [L('Nền tảng', 'Platform'), L('Lockheed Martin A2100A', 'Lockheed Martin A2100A')],
      [L('Bộ phát đáp', 'Transponders'), L('24 băng Ku khai thác (+6 dự phòng)', '24 Ku-band active (+6 spare)')],
      [L('Vị trí', 'Slot'), L('131,8° Đông · phóng 16/5/2012 bằng Ariane 5', '131.8° E · launched 16 May 2012 on Ariane 5')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh A2100', 'A2100 bus'), desc: L('Cùng dòng với VINASAT-1, chỉ có băng Ku', 'Same family as VINASAT-1, Ku-band only') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar arrays'), desc: L('Hai cánh luôn xoay hướng Mặt Trời', 'Two wings always turned to the Sun') },
      { key: 'reflectors', name: L('Chảo phản xạ', 'Antenna reflectors'), desc: L('Phủ sóng Việt Nam, Lào, Campuchia, Myanmar', 'Cover Vietnam, Laos, Cambodia and Myanmar') },
      { key: 'feeds', name: L('Loa thu phát', 'Feed horns'), desc: L('Phát sóng vào chảo phản xạ', 'Illuminate the reflectors') },
    ],
    sources: [["Gunter's Space Page – VINASAT-2", 'https://space.skyrocket.de/doc_sdat/vinasat-2.htm'], ['Bộ TT&TT – Vinasat-2 launched', 'https://english.mic.gov.vn/print/vinasat-2-launched-into-orbit-197114441.htm']],
  },

  himawari: {
    specs: [
      [L('Nền tảng', 'Platform'), L('Mitsubishi Electric DS2000', 'Mitsubishi Electric DS2000')],
      [L('Khối lượng phóng', 'Launch mass'), L('~3,5 tấn', '~3.5 t')],
      [L('Thiết bị chính', 'Main instrument'), L('AHI: 16 kênh phổ, chụp toàn đĩa Trái Đất mỗi 10 phút', 'AHI: 16 bands, full Earth disk every 10 minutes')],
      [L('Hoạt động', 'In service'), L('Phóng 2016, vận hành chính từ 12/2022', 'Launched 2016, primary since Dec 2022')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Nền tảng DS2000', 'DS2000 platform') },
      { key: 'imager', name: L('Máy chụp AHI', 'AHI imager'), desc: L('Chụp mây, bão, tro núi lửa, khói cháy rừng', 'Images clouds, typhoons, volcanic ash and smoke') },
      { key: 'arrays', name: L('Cánh pin Mặt Trời', 'Solar array'), desc: L('Một cánh duy nhất để không che tầm nhìn của máy chụp', 'A single wing keeps the imager\'s view clear') },
      { key: 'antennas', name: L('Ăng-ten', 'Antennas'), desc: L('Truyền ảnh về Trung tâm Khí tượng Nhật Bản', 'Send images to the Japan Meteorological Agency') },
    ],
    sources: [['JMA – Himawari-8/9 AHI', 'https://www.data.jma.go.jp/mscweb/en/himawari89/space_segment/spsg_ahi.html']],
  },

  goes: {
    specs: [
      [L('Nền tảng', 'Platform'), L('Lockheed Martin A2100A', 'Lockheed Martin A2100A')],
      [L('Khối lượng phóng', 'Launch mass'), L('~5.200 kg', '~5,200 kg')],
      [L('Thiết bị', 'Instruments'), L('ABI (16 kênh), GLM (sét), SUVI/EXIS (Mặt Trời), CCOR-1 (nhật hoa)', 'ABI (16 bands), GLM (lightning), SUVI/EXIS (Sun), CCOR-1 (corona)')],
      [L('Hoạt động', 'In service'), L('Phóng 6/2024, là GOES-East từ 4/2025', 'Launched Jun 2024, GOES-East since Apr 2025')],
    ],
    parts: [
      { key: 'bus', name: L('Thân vệ tinh', 'Bus'), desc: L('Nền tảng A2100', 'A2100 platform') },
      { key: 'imager', name: L('ABI & GLM', 'ABI & GLM'), desc: L('Chụp ảnh thời tiết và đếm tia sét liên tục', 'Weather imaging and continuous lightning mapping') },
      { key: 'arrays', name: L('Cánh pin & bệ hướng Mặt Trời', 'Solar array & Sun platform'), desc: L('Mang SUVI, EXIS theo dõi bão Mặt Trời', 'Carries SUVI and EXIS to watch solar storms') },
      { key: 'boom', name: L('Cần từ kế', 'Magnetometer boom'), desc: L('Đo từ trường Trái Đất ở độ cao GEO', 'Measures Earth\'s magnetic field at GEO') },
    ],
    sources: [['NOAA/NASA – GOES-R spacecraft', 'https://www.goes-r.gov/spacesegment/spacecraft.html']],
  },

  molniya: {
    specs: [
      [L('Khối lượng', 'Mass'), L('~1.600 kg (Molniya-1)', '~1,600 kg (Molniya-1)')],
      [L('Quỹ đạo', 'Orbit'), L('Elip, chu kỳ ~12 giờ, nghiêng 63,4°', 'Elliptical, ~12 h period, 63.4° inclination')],
      [L('Nhiệm vụ', 'Role'), L('Truyền hình, điện thoại cho Liên Xô (từ 1965)', 'TV and telephone relay for the USSR (from 1965)')],
    ],
    parts: [
      { key: 'bus', name: L('Thân hình trụ', 'Cylindrical body'), desc: L('Khoang kín điều áp chứa thiết bị', 'Sealed, pressurised equipment compartment') },
      { key: 'arrays', name: L('Sáu tấm pin "cánh quạt"', 'Six "windmill" panels'), desc: L('Mở ra như cánh hoa', 'Open out like petals') },
      { key: 'reflectors', name: L('Hai chảo ăng-ten', 'Two dish antennas'), desc: L('Một chảo hoạt động, một chảo dự phòng', 'One active, one spare') },
    ],
    sources: [["Gunter's Space Page – Molniya-1", 'https://space.skyrocket.de/doc_sdat/molniya-1.htm']],
  },
};
