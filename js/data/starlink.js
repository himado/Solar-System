// Nội dung phần "Starlink hoạt động thế nào?". Số liệu cập nhật tới 10/2026.

const L = (vi, en) => ({ vi, en });

export const SL_STATS = [
  { value: '~11.000', valueEn: '~11,000', label: L('vệ tinh Starlink trên quỹ đạo (10/2026)', 'Starlink satellites in orbit (Oct 2026)') },
  { value: '> 10 tr', valueEn: '> 10 M', label: L('thuê bao tại 164 quốc gia & vùng lãnh thổ (31/3/2026)', 'subscribers in 164 countries & territories (31 Mar 2026)') },
  { value: '25,7 ms', valueEn: '25.7 ms', label: L('độ trễ trung vị giờ cao điểm tại Mỹ (2025)', 'median peak-hour latency in the US (2025)') },
  { value: '42 PB', valueEn: '42 PB', label: L('dữ liệu mỗi ngày qua hơn 9.000 laser (1/2024)', 'per day across 9,000+ lasers (Jan 2024)') },
];

// Các bước đường đi của dữ liệu; "seg" là phần được làm nổi bật trong cảnh 3D
export const SL_STEPS = [
  {
    seg: 'user', name: L('Chảo thu "Dishy"', 'The "Dishy" terminal'),
    text: L(
      'Chảo là một ăng-ten mảng pha: hàng trăm phần tử nhỏ phát lệch pha nhau để lái chùm sóng bằng điện tử, không cần quay cơ học. Chảo có thể theo dõi nhiều vệ tinh cùng lúc. Liên lạc ở băng Ku: tải lên 14,0–14,5 GHz, tải xuống 10,7–12,7 GHz.',
      'The dish is a phased-array antenna: hundreds of tiny elements transmit slightly out of phase to steer the beam electronically, with no moving parts. It can track several satellites at once. It talks in Ku-band: 14.0–14.5 GHz up, 10.7–12.7 GHz down.'),
  },
  {
    seg: 'serving', name: L('Vệ tinh phục vụ', 'The serving satellite'),
    text: L(
      'Vệ tinh bay ở ~550 km, gần hơn vệ tinh địa tĩnh ~65 lần, nên tín hiệu đi về rất nhanh. Theo hồ sơ FCC, chảo chỉ kết nối với vệ tinh cao hơn 25° so với đường chân trời, nên mỗi vệ tinh phục vụ một vùng bán kính ~900 km (vòng tròn trên mặt đất). Năm 2026, FCC cho phép hạ góc này với các vệ tinh bay thấp hơn.',
      'Satellites fly at ~550 km, about 65 times closer than geostationary ones, so signals make the round trip quickly. Per FCC filings, the dish only uses satellites more than 25° above the horizon, so each satellite serves an area ~900 km in radius (the ring on the ground). In 2026 the FCC allowed lower angles for lower-flying satellites.'),
  },
  {
    seg: 'handoff', name: L('Chuyển vệ tinh mỗi 15 giây', 'Re-assignment every 15 seconds'),
    text: L(
      'Mỗi vệ tinh chỉ ở trên đầu bạn vài phút. Một bộ lập lịch toàn cầu phân bổ lại vệ tinh cho mọi chảo thu cứ mỗi 15 giây, đồng bộ trên toàn thế giới vào giây thứ 12, 27, 42 và 57 của mỗi phút. Kết quả này được nhiều nhóm nghiên cứu đo đạc và khớp với hồ sơ của SpaceX gửi FCC.',
      'Each satellite is overhead for only a few minutes. A global scheduler re-assigns satellites to every dish every 15 seconds, synchronised worldwide at the 12th, 27th, 42nd and 57th second of each minute. Several research groups measured this, and it matches SpaceX\'s FCC filings.'),
  },
  {
    seg: 'laser', name: L('Laser giữa các vệ tinh', 'Inter-satellite lasers'),
    text: L(
      'Khi không có trạm mặt đất trong tầm, dữ liệu nhảy giữa các vệ tinh bằng tia laser hồng ngoại. Tháng 1/2024, SpaceX cho biết có hơn 9.000 laser, chuyển ~42 PB/ngày, mỗi liên kết tới 200 Gbps và từng nối hai vệ tinh cách nhau 5.400 km. Ánh sáng trong chân không nhanh hơn trong cáp quang ~47%.',
      'When no ground station is in range, data hops between satellites on infrared lasers. In Jan 2024 SpaceX reported 9,000+ lasers moving ~42 PB/day, links up to 200 Gbps and one link spanning 5,400 km. Light in vacuum travels ~47% faster than in optical fibre.'),
  },
  {
    seg: 'gateway', name: L('Trạm cổng & PoP', 'Gateway & PoP'),
    text: L(
      'Trạm cổng (gateway) là cụm chảo lớn trên mặt đất, liên lạc với vệ tinh ở băng Ka. Từ đây dữ liệu vào cáp quang tới điểm kết nối Internet (PoP). Ở Việt Nam, Starlink được cấp phép 4 trạm cổng tại Phú Thọ, Đà Nẵng và TP.HCM.',
      'Gateways are clusters of large ground dishes that talk to satellites in Ka-band. From there data enters fibre to a point of presence (PoP) on the Internet. In Vietnam, Starlink is licensed for 4 gateways in Phu Tho, Da Nang and Ho Chi Minh City.'),
  },
  {
    seg: 'fiber', name: L('Internet tới máy chủ', 'Internet to the server'),
    text: L(
      'Đoạn cuối đi qua mạng cáp quang thông thường tới máy chủ bạn truy cập, rồi phản hồi đi ngược lại đúng con đường đó.',
      'The last leg runs over ordinary fibre to the server you\'re reaching, and the reply comes back the same way.'),
  },
];

export const SL_VIETNAM = [
  L('26/3/2025: Thủ tướng ban hành Quyết định 659/QĐ-TTg cho phép thí điểm có kiểm soát dịch vụ Internet vệ tinh quỹ đạo thấp.', '26 Mar 2025: the Prime Minister\'s Decision 659/QĐ-TTg allowed a controlled pilot of low-orbit satellite internet.'),
  L('13–14/2/2026: Starlink Services Vietnam được cấp giấy phép tần số và giấy phép cung cấp dịch vụ viễn thông.', '13–14 Feb 2026: Starlink Services Vietnam received its spectrum and telecom service licences.'),
  L('Tối đa 600.000 thuê bao; giai đoạn thí điểm phải kết thúc trước 1/1/2031; ưu tiên vùng sâu, vùng xa, biên giới, hải đảo.', 'Up to 600,000 subscribers; the pilot must end before 1 Jan 2031; focus on remote, border and island areas.'),
  L('12–13/8/2026: theo báo chí, Starlink thông báo đã có mặt tại Việt Nam và bản đồ vùng phủ chuyển sang "Có sẵn".', '12–13 Aug 2026: per press reports, Starlink announced availability in Vietnam and its coverage map switched to "Available".'),
];

// Trạm cổng. real = true: địa điểm được công bố; còn lại là vị trí minh hoạ.
export const SL_GATEWAYS = [
  { name: L('Phú Thọ', 'Phu Tho'), lat: 21.4, lon: 105.22, real: true },
  { name: L('Đà Nẵng', 'Da Nang'), lat: 16.05, lon: 108.2, real: true },
  { name: L('TP.HCM', 'Ho Chi Minh City'), lat: 10.82, lon: 106.63, real: true },
  { name: L('Singapore', 'Singapore'), lat: 1.35, lon: 103.82 },
  { name: L('Manila', 'Manila'), lat: 14.6, lon: 121.0 },
  { name: L('Tokyo', 'Tokyo'), lat: 35.68, lon: 139.69 },
  { name: L('Guam', 'Guam'), lat: 13.44, lon: 144.79 },
  { name: L('Hawaii', 'Hawaii'), lat: 21.31, lon: -157.86 },
  { name: L('Sydney', 'Sydney'), lat: -33.87, lon: 151.21 },
  { name: L('Perth', 'Perth'), lat: -31.95, lon: 115.86 },
  { name: L('Auckland', 'Auckland'), lat: -36.85, lon: 174.76 },
  { name: L('Los Angeles', 'Los Angeles'), lat: 34.05, lon: -118.24 },
  { name: L('Seattle', 'Seattle'), lat: 47.61, lon: -122.33 },
  { name: L('New York', 'New York'), lat: 40.71, lon: -74.0 },
  { name: L('São Paulo', 'São Paulo'), lat: -23.55, lon: -46.63 },
  { name: L('Punta Arenas', 'Punta Arenas'), lat: -53.16, lon: -70.92 },
  { name: L('London', 'London'), lat: 51.5, lon: -0.13 },
  { name: L('Frankfurt', 'Frankfurt'), lat: 50.11, lon: 8.68 },
  { name: L('Lagos', 'Lagos'), lat: 6.52, lon: 3.38 },
  { name: L('Nairobi', 'Nairobi'), lat: -1.29, lon: 36.82 },
];

export const SL_USERS = [
  { id: 'hanoi', name: L('Hà Nội', 'Hanoi'), lat: 21.03, lon: 105.85 },
  { id: 'truongsa', name: L('Quần đảo Trường Sa', 'Spratly Islands'), lat: 8.64, lon: 111.92 },
  { id: 'pacific', name: L('Tàu giữa Thái Bình Dương', 'Ship mid-Pacific'), lat: 5, lon: -140 },
  { id: 'antarctica', name: L('Trạm McMurdo, Nam Cực', 'McMurdo, Antarctica'), lat: -77.85, lon: 166.67 },
];

export const SL_SERVERS = [
  { id: 'sg', name: L('Singapore', 'Singapore'), lat: 1.35, lon: 103.82 },
  { id: 'tokyo', name: L('Tokyo', 'Tokyo'), lat: 35.68, lon: 139.69 },
  { id: 'fra', name: L('Frankfurt', 'Frankfurt'), lat: 50.11, lon: 8.68 },
  { id: 'la', name: L('Los Angeles', 'Los Angeles'), lat: 34.05, lon: -118.24 },
];

export const SL_NOTE = L(
  'Mô phỏng đơn giản hoá: vị trí ~10.000 vệ tinh theo các lớp vỏ quỹ đạo thật nhưng không phải vị trí thực tế; tuyến laser chọn tham lam theo hướng trạm cổng (mạng thật dùng định tuyến tối ưu toàn cục); trạm cổng ngoài Việt Nam là vị trí minh hoạ; độ trễ chỉ tính thời gian lan truyền tín hiệu, độ trễ đo thực tế cao hơn do xử lý và xếp hàng.',
  'Simplified simulation: ~10,000 satellites follow the real orbital shells but not their actual positions; laser routes are chosen greedily towards the gateway (the real network optimises globally); gateways outside Vietnam are illustrative; latency counts signal propagation only, and measured latency is higher due to processing and queuing.');

export const SL_SOURCES = [
  ['Making Sense of Constellations (lịch 15 giây)', 'https://arxiv.org/abs/2307.00402'],
  ['A Multifaceted Look at Starlink Performance', 'https://arxiv.org/abs/2310.09242'],
  ['FCC – SpaceX filing (25° elevation)', 'https://apps.fcc.gov/els/GetAtt.html?id=271541'],
  ['Hackaday – 42 PB/day over 9,000 lasers', 'https://hackaday.com/2024/02/05/starlinks-inter-satellite-laser-links-are-setting-new-record-with-42-million-gb-per-day/'],
  ['The Register – Starlink network update 2025', 'https://www.theregister.com/2025/07/16/starlink_network_update/'],
  ['Tuổi Trẻ – 4 trạm cổng Starlink tại Việt Nam', 'https://tuoitre.vn/cap-phep-trien-khai-4-tram-cong-dau-tien-cua-starlink-tai-viet-nam-2026022016175063.htm'],
  ['VnExpress – Địa điểm 4 trạm mặt đất', 'https://vnexpress.net/dia-diem-dat-bon-tram-mat-dat-starlink-tai-viet-nam-5042572.html'],
  ['Axis Intelligence – Starlink statistics 2026', 'https://axis-intelligence.com/starlink-statistics/'],
  ['QĐND – Thí điểm có kiểm soát', 'https://www.qdnd.vn/giao-duc-khoa-hoc/cac-van-de/dich-vu-internet-ve-tinh-starlink-duoc-cap-phep-theo-co-che-thi-diem-co-kiem-soat-chat-che-1033020'],
];
