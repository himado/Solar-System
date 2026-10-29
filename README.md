# Khám phá Hệ Mặt Trời

Website 3D song ngữ (Tiếng Việt / English) để tìm hiểu hệ Mặt Trời, lấy cảm hứng từ phần Explore của Solar System Scope.

## Tính năng

- **Toàn cảnh hệ Mặt Trời**: 8 hành tinh và Sao Diêm Vương nằm đúng vị trí theo ngày hiện tại (quỹ đạo tròn gần đúng), có vành đai tiểu hành tinh; có thể tua nhanh hoặc chậm thời gian.
- **Cận cảnh từng thiên thể**: Mặt Trời, 8 hành tinh, Sao Diêm Vương và 18 vệ tinh tự nhiên tiêu biểu. Mỗi thiên thể có 4 tab: Tổng quan, Thông số, Cấu trúc và Vệ tinh. Tab Cấu trúc biến mô hình thành **mặt cắt 3D**: một múi 90° bị khoét đi để lộ các lớp bên trong.
- **Quỹ đạo Trái Đất**: mô phỏng khoảng 16.000 vệ tinh đang hoạt động và 29.000 mảnh rác được theo dõi. Quỹ đạo Kepler được tính trên GPU. Gồm các vòng LEO, SSO, MEO, GEO, HEO, 15 vệ tinh nổi bật (có VINASAT-1/2, VNREDSat-1) và thông tin về rác vũ trụ.
- **Mô hình 3D vệ tinh**: 15 vệ tinh nổi bật có mô hình xoay được. Bấm vào từng bộ phận để làm nổi bật, kèm thông số kỹ thuật và nguồn tham khảo (NASA, ESA, NOAA, JMA, Lockheed Martin…).
- **Tương tác Mặt Trời – Trái Đất – Mặt Trăng**: vị trí Mặt Trời và Mặt Trăng tính theo ngày giờ thật, gồm 5 chủ đề:
  - ánh sáng và bốn mùa (kèm phổ điện từ);
  - gió Mặt Trời, từ quyển và cực quang;
  - thủy triều (triều cường, triều kém);
  - pha Mặt Trăng;
  - nhật thực và nguyệt thực, có nút nhảy tới các lần thực sắp tới.
- **Starlink hoạt động thế nào?**: chọn vị trí (hoặc nhấp lên quả địa cầu) và máy chủ. Mô phỏng dò tuyến dữ liệu qua ~10.000 vệ tinh: chảo thu → vệ tinh → laser → trạm cổng → cáp quang. Có chuyển vệ tinh theo lịch 15 giây, so sánh độ trễ, nút bật/tắt laser và thông tin Starlink tại Việt Nam.
- Ẩn/hiện thanh bên và bảng thông tin (nút ⛶ hoặc phím H) để mở rộng không gian xem.
- Mỗi màn hình có địa chỉ riêng để chia sẻ: `#mars`, `#europa`, `#earth-orbit/iss`, `#sun-earth-moon/tides`, `#starlink`…

## Chạy thử

Trang dùng ES modules nên cần chạy qua một web server tĩnh, không mở trực tiếp file:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

Three.js (0.169.0) được tải từ CDN jsDelivr, nên máy cần có Internet.

## Cấu trúc

```
index.html
css/style.css
js/main.js              điều phối, giao diện, bảng thông tin
js/i18n.js              chuỗi song ngữ
js/core/engine.js       renderer, camera, shader Trái Đất, tiện ích 3D
js/scenes/overview.js   toàn cảnh hệ Mặt Trời
js/scenes/system.js     cận cảnh hành tinh và các vệ tinh
js/scenes/earthOrbit.js vệ tinh nhân tạo và rác vũ trụ
js/scenes/cutaway.js    mô hình mặt cắt 3D các lớp bên trong
js/scenes/interactions.js  Mặt Trời – Trái Đất – Mặt Trăng
js/scenes/starlink.js   mô phỏng tuyến Starlink
js/data/starlink.js     nội dung & số liệu Starlink
js/sim/ephemeris.js     vị trí gần đúng của Mặt Trời, Mặt Trăng
js/models/satellites.js mô hình 3D các vệ tinh
js/ui/satViewer.js      khung xem mô hình vệ tinh
js/data/satModels.js    cấu trúc & thông số vệ tinh
js/data/interactions.js nội dung các hiện tượng, lịch thực
js/sim/population.js    sinh quần thể vệ tinh/rác, hàm Kepler
js/data/bodies.js       dữ liệu thiên thể
js/data/orbits.js       dữ liệu vòng quỹ đạo, vệ tinh nổi bật, rác vũ trụ
js/ui/visuals.js        SVG: mặt cắt, so sánh kích thước, thang độ cao
assets/textures/        texture © Solar System Scope (CC BY 4.0)
```

## Nguồn dữ liệu

NASA Planetary Fact Sheet, CelesTrak, Space-Track (qua Orbital Radar, KeepTrack), ESA DISCOS và ESA Space Environment Report 2026. Số liệu vệ tinh cập nhật tới 10/2026.
