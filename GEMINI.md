# NHẬT KÝ DỰ ÁN — YUMCRAFT KITCHEN

## 1. Thông Tin Phiên Làm Việc Mới Nhất
- **Ngày thực hiện**: 16/10/2026
- **Người phát triển**: Vũ Anh Lộc (LC Boy) & Antigravity (Google DeepMind)
- **Mục tiêu**: Đổi tên thương hiệu game thành **YumCraft Kitchen** (loại bỏ hoàn toàn xung đột bản quyền), bổ sung các loại mì và bột làm bánh, tái cấu trúc toàn diện không gian nhà bếp thành hệ thống 5 Tab chuẩn trợ năng quốc tế WCAG AA/AAA cho trình đọc màn hình **NVDA** và bàn phím, tinh gọn cấu trúc heading (khắc phục lỗi bấm phím H bị loạn), dọn dẹp các thông báo live region ở đầu trang, và hoàn thiện quy trình hoàn thành món động.

---

## 2. Các Tính Năng & Thay Đổi Đã Triển Khai (Phiên 16/10/2026)

### A. Đổi Tên Game Thương Hiệu Mới: YumCraft Kitchen
- Đổi toàn bộ nhận diện thương hiệu từ tiêu đề trang, giao diện giới thiệu, tiêu đề nhà bếp, cẩm nang phím tắt đến code logic thành **YumCraft Kitchen**.
- Loại bỏ 100% mọi tham chiếu tên gọi thương hiệu cũ, đảm bảo không gặp bất kỳ xung đột bản quyền nào.

### B. Bổ Sung Nhóm Nguyên Liệu "🍜 Mì & Bột Làm Bánh"
- Mở rộng kho nguyên liệu tủ lạnh lên **45 nguyên liệu** và thêm danh mục mới `noodles_flour`:
  1. 🍜 **Mì trứng tươi sợi vàng** (`egg_noodles`): Thơm bùi đậm vị trứng, luộc chín mềm trong nồi hoặc xào thịt bò rau củ.
  2. 🍝 **Mì Ý Spaghetti hảo hạng** (`spaghetti`): Sợi dài dai ngon chuẩn Al Dente, sốt cà chua thịt băm hoặc sốt phô mai kem béo.
  3. 🍜 **Mì Udon Nhật Bản sợi to** (`udon_noodles`): Sợi to dày mướt dai mềm, nấu súp hầm ngọt nước hoặc xào cay.
  4. 🥢 **Mì gói tôm chua cay giòn rụm** (`instant_ramen`): Giòn rụm ăn sống cực đã, kẹp bánh mì hoặc nhúng nước sôi / chiên xào.
  5. 🌾 **Bột mì đa dụng cao cấp** (`wheat_flour`): Nhào bột làm bánh nướng lò, pha sốt sánh ngậy hoặc làm vỏ bánh.
  6. 🍚 **Bột gạo tẻ thơm mịn** (`rice_flour`): Dẻo thanh ngọt nhẹ, dùng pha bột đổ bánh xèo, làm bánh bao hấp hoặc bánh cuốn.
  7. 🍤 **Bột chiên giòn Tempura** (`tempura_batter`): Áo lớp bột nhúng tôm, mực, xúc xích rồi chiên ngập dầu giòn tan béo ngậy.

### C. Tái Cấu Trúc Bố Cục Nhà Bếp Thành 5 Tab Chuẩn WCAG
- Chuyển đổi toàn diện từ dạng bố cục 3 cột nhiều heading con sang **Hệ thống 5 Tab (`role="tablist"` / `role="tab"` / `role="tabpanel"`)**:
  - **Tab 1 (`#tab-fridge`)**: 1. Tủ Lạnh & Kho Đồ (`Alt + 1`)
  - **Tab 2 (`#tab-workbench`)**: 2. Bàn Chế Biến (`Alt + 2`)
  - **Tab 3 (`#tab-staging`)**: 3. Khay Tạm (`Alt + 3`)
  - **Tab 4 (`#tab-spices`)**: 4. Gia Vị (`Alt + 4`)
  - **Tab 5 (`#tab-dining`)**: 5. Bàn Tiệc & Thưởng Thức (`Alt + 5`)
- **Khắc phục triệt để lỗi "lòi tab 0 và phím tắt tùm lum" khi duyệt bằng mũi tên NVDA**:
  - Loại bỏ hoàn toàn các thẻ số lượng badge (trước đây đọc ngắt quãng thành dòng số "0" riêng biệt trong buffer của NVDA).
  - Loại bỏ thẻ `sr-only` phím tắt riêng biệt gây tách dòng. Đưa phím tắt vào thuộc tính `title` và tài liệu hướng dẫn phím tắt `modal-help`.
  - Tên mỗi tab giờ đây là một dòng văn bản thuần túy, sạch đẹp, đọc liền mạch và đúng chuẩn: "1. Tủ Lạnh & Kho Đồ", "2. Bàn Chế Biến", "3. Khay Tạm", "4. Gia Vị", "5. Bàn Tiệc & Thưởng Thức".
- Hỗ trợ đầy đủ phím điều hướng tab WCAG:
  - Bấm `ArrowRight` / `ArrowDown`: Chuyển sang tab tiếp theo và cập nhật tiêu điểm (không bị double speech).
  - Bấm `ArrowLeft` / `ArrowUp`: Quay lại tab trước đó.
  - Bấm `Home`: Nhảy nhanh về Tab 1.
  - Bấm `End`: Nhảy nhanh tới Tab 5.
  - `Alt + 1..5`: Nhảy trực tiếp tới bất kỳ tab nào từ bất cứ đâu trong bếp.

### D. Tinh Gọn Cấu Trúc Heading — Khắc Phục Lỗi Bấm Phím H Bị Loạn Trên NVDA
- Trước đây: Mỗi phân khu có nhiều heading h3, h4 lồng ghép, khiến người dùng NVDA khi bấm phím `H` để duyệt tài liệu bị nhảy tán loạn qua hàng chục tiêu đề vụn.
- Hiện tại: Trong mỗi tabpanel chỉ chứa **duy nhất một thẻ semantic `<h2>` đại diện cho phân khu đó**. Các thông tin phụ được chuyển thành cấu trúc trực quan với nhãn aria rõ ràng, giúp phím tắt `H` hoạt động cực kỳ mượt mà, chính xác và không bị rối.

### E. Dọn Dẹp Thông Báo Trình Đọc Màn Hình Trên Đầu Trang
- Đưa toàn bộ các vùng ARIA Live kép (`#nvda-live-assertive-a/b` và `#nvda-live-polite-a/b`) xuống cuối cùng của mã nguồn (ngay trước `</body>`).
- Xóa bỏ hoàn toàn thanh text banner thông báo trực quan ở đỉnh trang, giữ cho đầu trang luôn sạch sẽ, thoáng đãng.

### F. Nút Hướng Dẫn & Phím Tắt (Help) Xuống Chân Trang (Footer)
- Bố trí nút **`⌨️ Hướng Dẫn & Phím Tắt (H)`** nằm riêng biệt, cố định tại thanh chân trang (`<footer>`).
- Khi bấm (hoặc nhấn phím `H`), mở hộp thoại độc lập `<dialog id="modal-help">` hiển thị chi tiết toàn bộ cơ chế game, 5 tab và bảng phím tắt, tự động bẫy tiêu điểm và trả tiêu điểm về nút khi nhấn `Esc`.

### G. Quy Trình Hoàn Thành Món Động & Đưa Ra Dĩa Chuẩn Mực
- **Loại bỏ hoàn toàn cơ chế đưa đồ ra dĩa vụn vặt**:
  - Xóa bỏ nút đưa ra dĩa ở Tủ Lạnh (chỉ lấy vào Bếp hoặc Khay Tạm).
  - Xóa bỏ tùy chọn nêm gia vị ra dĩa ở Khay Gia Vị (chỉ nêm vào Bếp hoặc Khay Tạm).
- **Nút `⭐ HOÀN THÀNH MÓN (Phím P)`**:
  - Là cách thức duy nhất để chuyển đồ ăn lên dĩa.
  - **Trạng thái động**: Chỉ hiển thị khi trong Bếp hoặc Khay Tạm có ít nhất 1 nguyên liệu. Khi cả hai đều trống, nút sẽ tự động ẩn đi.
  - Khi bấm Hoàn Thành Món: Người chơi tự do đặt tên món tùy thích, chọn đồ trang trí rồi bấm Enter.
  - Ngay sau khi xác nhận:
    1. Toàn bộ món ăn được chuyển sạch sẽ lên Dĩa Ăn.
    2. Nút Hoàn Thành Món tự động biến mất.
    3. Giao diện **tự động chuyển sang Tab 5: "🍽️ Bàn Tiệc & Thưởng Thức"**.
    4. Trình duyệt **tự động đặt tiêu điểm (focus) vào nút `🥄 ĐÚT CHO THỰC KHÁCH ĂN! (Phím F)`**.
    5. NVDA đọc thông báo món ăn đã hoàn thành và sẵn sàng cho thực khách ăn.

---

## 3. Cấu Trúc Tệp Tin Dự Án
- `index.html`: Toàn bộ mã nguồn ứng dụng game hoàn chỉnh (HTML5, Tailwind CSS, Web Audio API, Canvas 2D, Vanilla JS).
- `index.html.bak2`: Bản sao lưu trước đợt nâng cấp YumCraft Kitchen.
- `GEMINI.md`: Nhật ký phát triển và tài liệu dự án.
