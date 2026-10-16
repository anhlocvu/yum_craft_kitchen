# NGUYÊN TẮC THIẾT KẾ CỐT LÕI — YUMCRAFT KITCHEN

> [!IMPORTANT]
> **TRIẾT LÝ NẤU BẾP TỰ DO (TOCA KITCHEN SANDBOX PHILOSOPHY)**
> 1. **Hoàn Toàn Không Có Công Thức Cố Định (Zero Hardcoded Recipes)**: YumCraft Kitchen là trò chơi nấu ăn mô phỏng tự do theo phong cách Toca Kitchen. Người chơi là bếp trưởng sáng tạo tuyệt đối, được quyền kết hợp bất kỳ nguyên liệu, dụng cụ và gia vị nào với nhau mà không bị trói buộc bởi bất kỳ công thức sách giáo khoa cứng nhắc nào.
> 2. **Hóa Học Vị Giác Cảm Quan Động (Dynamic Sensory Chemistry)**: Hệ thống đánh giá dựa trên các định luật vật lý và hóa học vị giác thực tế (Umami, Mặn, Ngọt, Chua, Cay, Béo, Đắng, Thơm, Giòn), phản ánh trung thực những gì người chơi vừa thực sự chế biến và nêm nếm. Tuyệt đối không gán ghép các nhãn hương vị tĩnh hoặc tự ý suy đoán nguyên liệu không có trong món ăn.
> 3. **Nhận Xét Của Thực Khách Sinh Động & Chân Thực (Living Character Critique)**: Khi thưởng thức, nhân vật sẽ miêu tả chi tiết cảm giác vị giác, kết cấu món ăn (nướng, luộc, chiên, cuộn, nhồi...) và mùi vị của các loại gia vị người chơi đã nêm, phản ánh đúng gu thưởng thức và biểu cảm của từng thực khách.
> 4. **Trợ Năng Toàn Diện Chuẩn Quốc Tế (WCAG AA/AAA & NVDA First)**: Mọi tương tác, cảm giác vị giác và diễn biến nấu nướng đều phải được truyền tải hoàn hảo, tự nhiên và liền mạch đến người chơi khiếm thị thông qua NVDA và bàn phím.

---

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

### H. Tối Ưu Triệt Để Khối Skip Links & Xây Dựng Bộ Máy Đánh Giá Cảm Quan Ẩm Thực Tự Do
- **Xóa bỏ hoàn toàn khối Skip Links dư thừa ở đầu trang nhà bếp**:
  - Loại bỏ khối `<nav aria-label="Liên kết nhảy nhanh nhà bếp cho NVDA">` chứa 6 liên kết anchor trỏ vào panel tab bị ẩn.
  - Khắc phục lỗi bấm vào link không nhảy (do các panel tab khác đang ở trạng thái `hidden`).
  - Tối ưu hóa tuyệt đối cho người dùng NVDA: Người chơi khiếm thị chỉ cần ấn `D` (duyệt landmark) hoặc `Alt + 1..5` để chuyển tab tức thì, không bị chặn bởi các liên kết rườm rà ở đầu trang.
- **Xóa bỏ hoàn toàn nhãn cứng "Sô-cô-la & Sữa" khỏi các món mặn**:
  - Chuyển phản ứng hòa vị béo ngọt thơm (`blended.sweet >= 2.6 && blended.fatty >= 2.0 && blended.aroma >= 1.8`) sang cơ chế động:
    - Nếu có nguyên liệu đồ ngọt thực sự (`sweets` như `chocolate`, `milk`, `oreo`): kích hoạt `🍫🥛 Hòa Quyện Đồ Ngọt Béo Thơm`.
    - Nếu là món thịt/mặn có bơ/mật ong: kích hoạt `🍯🧈 Áo Sốt Béo Ngọt Ngào Ngạt (Hòa quyện béo ngậy caramel hóa quyến rũ)`.
    - Bổ sung phản ứng phô mai tan chảy & đạm béo: `🧀🥩 Phô Mai & Đạm Béo (Ngậy thơm tan chảy quyện vị Umami)`.
- **Xây dựng Bộ Máy Đánh Giá Cảm Quan Ẩm Thực Động (`generateSensoryTastingReview`)**:
  - Dựa trên 100% tinh thần tự do Toca Kitchen: không áp đặt bất kỳ công thức cứng nào.
  - Mô tả sống động 4 tầng cảm quan:
    1. *Cấu trúc & Kỹ thuật*: Phân tích chi tiết vỏ ngoài (nướng than hoa, áp chảo, chiên giòn, xém cạnh...) và lớp nhân cuộn/nhồi bên trong.
    2. *Vị giác chân thực*: Chuyển đổi các con số hóa học thành ngôn từ miêu tả vị đượm đà nước thịt, vị mặn vừa vặn, vị ngọt thanh, lớp béo ngậy tan chảy, the cay ấm nồng...
    3. *Gia vị thực tế*: Nhắc tên chính xác các loại gia vị người chơi vừa nêm nếm.
    4. *Cá tính nhân vật*: Gấu Bự, Mèo Miu, Rồng Lửa, Cú Thông Thái có biểu cảm trầm trồ, khen ngợi hoặc phản ứng hài hước (nếu nấu sống, cháy khét hay mặn chát).
- **Nâng Cấp Báo Cáo Phím `I` (`readDishSummary`) Chuẩn NVDA**:
  - Khi ấn phím `I`, NVDA đọc to câu cảm quan món ăn sống động, điểm hài hòa, chi tiết 8 vị, cảnh báo nguy cơ nếu có (`warnings`) và phản ứng hòa vị (`synergies`).

---

## 3. Cấu Trúc Tệp Tin Dự Án
- `index.html`: Toàn bộ mã nguồn ứng dụng game hoàn chỉnh (HTML5, Tailwind CSS, Web Audio API, Canvas 2D, Vanilla JS).
- `index.html.bak2`: Bản sao lưu trước đợt nâng cấp YumCraft Kitchen.
- `README.md`: Tài liệu hướng dẫn, giới thiệu kiến trúc & cẩm nang phím tắt chuẩn GitHub.
- `LICENSE`: Giấy phép mã nguồn mở GNU General Public License v2.0 (GPL-2.0).
- `GEMINI.md`: Nhật ký phát triển và tài liệu dự án.

---

## 4. Thông Tin Phiên Làm Việc: Phân Tích Mã Nguồn & Xây Dựng README.md Chuẩn GitHub (16/10/2026)
- **Người phát triển**: Vũ Anh Lộc (LC Boy) & Antigravity (Google DeepMind)
- **Mục tiêu**:
  1. Phân tích sâu kiến trúc mã nguồn hơn 4.000 dòng của `index.html`: logic hóa học vị giác 8 trục, hệ thống 9 trạm nấu, 45 nguyên liệu, 18 gia vị, hệ thống trợ năng 5 Tab WCAG 2.2 AAA cho NVDA, bộ tổng hợp âm thanh foley Web Audio API thời gian thực, và bộ đánh giá cảm quan 4 tầng của 4 thực khách.
  2. Xác minh giấy phép từ file `LICENSE`: GNU General Public License v2.0 (GPL-2.0).
  3. Soạn thảo toàn diện tài liệu `README.md` chuẩn GitHub repository đẳng cấp quốc tế:
     - Hệ thống huy hiệu (Badges): License GPL v2, WCAG 2.2 AAA, NVDA Tested, Zero Dependencies, Vanilla JS.
     - Triết lý nấu bếp tự do Toca Kitchen (Zero Hardcoded Recipes).
     - Hướng dẫn chi tiết 9 trạm nấu và sơ đồ quy trình chế biến Mermaid.
     - Cẩm nang phím tắt toàn năng phục vụ người chơi khiếm thị sử dụng bàn phím và NVDA.
     - Hướng dẫn trải nghiệm trực tiếp không cần cài đặt môi trường.
     - Tuyên ngôn bản quyền và thông tin tác giả Vũ Anh Lộc (LC Boy).

---

## 5. Thông Tin Phiên Làm Việc: Chuẩn Hóa Bộ Từ Điển Vị Giác Cảm Quan Tiếng Việt Thuần Túy & Hệ Thống Kiểm Thử Tự Động (16/10/2026)
- **Người phát triển**: Vũ Anh Lộc (LC Boy) & Antigravity (Google DeepMind)
- **Mục tiêu**:
  1. Loại bỏ triệt để lỗi suy đoán nguyên liệu phi lý (ví dụ: gán nhãn "vị ngọt đượm đà tự nhiên của nước thịt" và gợi ý "vắt chanh, thêm dưa leo" vào ly sinh tố ngọt Oreo đá xay).
  2. Tuyệt đối không ví von vị giác với bất kỳ nguyên liệu/món ăn cụ thể nào (như không dùng "chua như chanh", "ngọt của sữa/mật", "mặn mắm", "đạm thịt").
  3. Loại bỏ việc gán ghép cảm giác nhiệt độ vào tính từ vị giác (như "ngọt mát lành" trong khi món có thể được đun sôi/nướng lò nóng).
  4. Ứng dụng kho tàng thuật ngữ chuyên ngành **Khoa học Đánh giá Cảm quan Thực phẩm (Sensory Evaluation)** tiếng Việt: phân cấp vi tế sắc thái vị giác (ngọt dịu, ngọt thanh, ngọt đằm, ngọt đượm, ngọt lịm sắc nét, ngọt gắt; vị đượm đà Umami; béo bùi, béo ngậy; mặn mà, mặn chát; chua thanh, chua rôn rốt, chua gắt; the cay, cay nồng, cay xé lưỡi...).
  5. Phát triển thuật toán **Xếp Hạng Vị Nổi Bật (Dominant Flavor Priority Sorting)**: tự động gom Top 2–3 vị có điểm số thực tế cao nhất đưa lên đầu câu cảm quan món ăn.
  6. Xây dựng và thực thi thành công bộ kiểm thử tự động 21 kịch bản món ăn đa dạng (`test_culinary_engine.js`) đạt kết quả tuyệt đối **21/21 PASS (100%)**.

### Các Cải Tiến Mã Nguồn Chi Tiết
1. **Hàm `describePureFlavorDescriptor(tasteKey, score, seed)`**:
   - Chuyển đổi điểm số 8 trục vị giác (0.0 đến 10.0) thành ngôn từ cảm quan tiếng Việt phong phú, thuần chất mô tả phản ứng của gai vị giác và hậu vị (Aftertaste).
   - Hỗ trợ đa dạng hóa từ ngữ đồng nghĩa (Word Variety) chống lặp từ máy móc.
2. **Thuật toán Dominant Flavor Priority trong `generateSensoryTastingReview`**:
   - Đánh giá tất cả các vị vượt ngưỡng, sắp xếp giảm dần theo điểm số `score`.
   - Với món "Oreo đá xay" (Ngọt 10, Béo 10, Thơm 10): miêu tả lập tức đưa vị ngọt lịm sắc sảo và độ béo ngậy nồng đậm lên hàng đầu, loại bỏ hoàn toàn việc bị vị Umami chèn ép.
3. **Làm sạch phản ứng hòa vị & Cảnh báo & Tiêu đề**:
   - `Muối + Umami`: Đổi thành `🧂✨ Muối Hài Hòa Tôn Vị Umami (Kích hoạt chiều sâu đượm đà)` (loại bỏ mắm/thịt).
   - Cảnh báo béo cao: `⚠️ Món ăn có độ béo khá cao (Gợi ý: điều chỉnh giảm độ béo hoặc bổ sung vị thanh để cân bằng)` (loại bỏ dưa leo/chanh).
   - Tiêu đề tự động: Đổi `Đậm Vị Ngọt Thịt` thành `Đậm Vị Umami` (không tự tiện suy đoán là thịt).
   - Máy xay: Chỉ thông báo `mát lạnh` khi trong công thức thực sự có Đá viên (`ice_cubes`).
4. **Tôn vinh tên món tùy chỉnh & Bóc tách nguyên liệu tự nhiên (Custom Dish Name Priority)**:
   - Loại bỏ hoàn toàn nhãn kỹ thuật `Ly Sinh Tố / Thức Uống` và các tiền tố gượng gạo.
   - Món ăn được xưng danh trực tiếp theo tên người chơi đặt (ví dụ: `Món 'oreo đá say' được xay nhuyễn sánh mịn mát lạnh từ Sữa tươi thanh trùng, Thanh Sô-cô-la Đen và Bánh quy Oreo kẹp kem...`), đảm bảo tôn trọng tuyệt đối quyền tự do sáng tạo và định danh món ăn của người chơi.

---

## 6. Thông Tin Phiên Làm Việc: Mở Rộng Kho Nguyên Liệu Lên 61 Món & Tinh Chỉnh Cảm Quan Trợ Năng (16/10/2026)
- **Người phát triển**: Vũ Anh Lộc (LC Boy) & Antigravity (Google DeepMind)
- **Mục tiêu**:
  1. Phân loại và mở rộng kho nguyên liệu từ 46 lên **61 nguyên liệu (+15 nguyên liệu mới)** mang đậm hương vị nhiệt đới và bản sắc ẩm thực Việt Nam:
     - Tách riêng **Xoài xanh giòn chua** (`green_mango`) cho các món gỏi/nộm và **Xoài chín vàng ngọt** (`ripe_mango`) cho các món tráng miệng/sinh tố.
     - Chuẩn hóa **Khoai lang mật tươi nguyên củ** (`sweet_potato`) và **Khoai môn củ tươi** (`taro`) thành nguyên liệu thô (`needsCooking: true`), người chơi nướng than, hấp luộc hoặc chiên giòn để thưởng thức hương vị dẻo bùi ứa mật.
     - Bổ sung **Đậu phộng rang bùi thơm** (`roasted_peanuts`) và **Mạch nha dẻo quánh** (`malt_syrup`) phục vụ làm kẹo lạc, kẹo cu đơ, rắc nộm gỏi hoặc kẹp bánh tráng nướng.
     - Bổ sung **Cóc non giòn rụm** (`june_plum`), **Ổi giòn ngọt thanh** (`guava`), **Trái bơ sáp dẻo béo** (`avocado`), **Bắp ngô ngọt tươi** (`sweet_corn`), **Nấm kim châm tươi** (`enoki_mushroom`).
     - Bổ sung đạm và phô mai: **Thịt nạc băm tươi** (`minced_meat`), **Đậu hũ non thanh mát** (`tofu`), **Phô mai khối Mozzarella** (`mozzarella`), **Bánh sừng bò Croissant bơ Pháp** (`croissant`, hỗ trợ `canBeVessel: true` để nhồi nhân).
  2. Cập nhật nhãn số lượng ngăn tủ thành `Tất cả (61)` và cập nhật tự động huy hiệu `fridge-total-count-badge`.
  3. Đảm bảo 100% tiêu chuẩn trợ năng **WCAG 2.2 AAA & NVDA First**:
     - Tất cả 15 nguyên liệu mới đều có nhãn `aria-label` tự nhiên, rõ nghĩa kết hợp tên và câu miêu tả cảm quan.
     - Biểu tượng emoji có `aria-hidden="true"`, các thao tác chọn nguyên liệu đều phản hồi tức thì qua Web Audio API và ARIA Live Region.
  4. Thực thi kiểm thử tích hợp động cơ cảm quan ẩm thực thành công 100% với các món ăn kết hợp mới: Gỏi xoài xanh đậu phộng, Kẹo lạc mạch nha, Khoai lang mật nướng, Croissant kẹp phô mai thịt băm.



