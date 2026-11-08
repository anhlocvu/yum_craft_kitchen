# Feature Specification: Nguyên Liệu Đặc Sản Thanh Hóa, Nội Tạng Động Vật, Da & Mỡ Động Vật (Tự Do Sandbox)

**Feature Branch**: `001-featurename-thanh-hoa`  
**Created**: 2026-11-08  
**Status**: Ready for Implementation  
**Input**: Thêm các nguyên liệu đặc sản của Thanh Hóa (lá đắng, cơm mẻ, mắm tép, rau má, bánh đa mè), nội tạng động vật (lòng non, lòng già, tim, gan, dạ dày, mề gà, tiết mềm, cật), các loại mỡ và da (da heo, mỡ khổ heo, da gà, mỡ gà, mỡ chài, thính gạo, tai heo giòn), tuyệt vời cho snack/tóp mỡ tự do, không công thức cứng, kích hoạt trợ năng NVDA WAI-ARIA WCAG 2.2 AAA.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thưởng Thức Snack & Tóp Mỡ Giòn Béo Tự Do (Priority: P1)
Người chơi lấy da heo (`pork_skin`), da gà (`chicken_skin`) hoặc mỡ khổ heo (`pork_fatback`) từ tủ lạnh, cho vào chảo chiên (`deep_fried`), chảo wok (`wok_fried`), chảo gang (`pan_grilled`) hoặc nồi chiên không dầu (`air_fried`). Sau khi nấu chín tới hoặc chín giòn, da phồng rộp giòn rụm (`crunch >= 3.8`), mỡ thắng ra tóp mỡ béo bùi thơm lừng (`fatty >= 3.5`, `aroma >= 3.0`). Người chơi có thể tự do rắc thêm muối ớt, đường mía hoặc thính gạo (`roasted_rice_powder`) mà không hề bị ép vào bất kỳ công thức cứng nào.

**Why this priority**: Đáp ứng trực tiếp mong muốn cốt lõi của người chơi về trải nghiệm làm snack, tóp mỡ giòn rụm từ da và mỡ.

**Independent Test**:
- Lấy `pork_skin` và `pork_fatback`, chiên qua `deep_fried` hoặc `air_fried`.
- Bày ra dĩa cho thực khách nếm: Thực khách miêu tả trung thực độ giòn rụm béo ngậy, không báo thịt sống `hasRawMeat`.

**Acceptance Scenarios**:
1. **Given** người chơi chọn `pork_skin` tươi và chiên giòn bằng nồi chiên không dầu (`air_fryer`), **When** bày dĩa cho thực khách, **Then** thực khách khen ngợi độ giòn tan rụm rụm của bì heo nướng, không còn tanh sống.
2. **Given** người chơi chọn `pork_fatback` tươi và đem nướng hoặc chiên, **When** nếm món, **Then** thực khách cảm nhận được vị béo ngậy và độ giòn bùi của tóp mỡ.

---

### User Story 2 - Trải Nghiệm Ẩm Thực Đặc Sản Xứ Thanh Với Lá Đắng & Cơm Mẻ (Priority: P1)
Người chơi chọn lá đắng rừng Tây Thanh Hóa (`la_dang_thanh_hoa`), cơm mẻ ngấu (`com_me`), mắm tép Ba Làng (`mam_tep_ba_lang`) hoặc rau má (`rau_ma_thanh_hoa`). Người chơi có thể xào nấu cùng lòng mề, thịt băm hoặc cuộn lá đắng nướng than. Hệ thống cảm quan hóa học vị giác phản ánh chính xác vị đắng thanh sâu lắng hậu ngọt của lá đắng, vị chua dịu thơm men của cơm mẻ, và vị Umami đậm đà của mắm tép.

**Why this priority**: Mang hồn cốt ẩm thực truyền thống xứ Thanh vào thế giới Sandbox theo đúng văn hóa ẩm thực chân thực.

**Independent Test**:
- Nấu canh hoặc xào `la_dang_thanh_hoa` cùng `pork_liver` hoặc `pork_small_intestine`: Thực khách miêu tả rõ vị đắng thanh thảo mộc hòa quyện vị ngọt bùi Umami.
- Ướp `com_me` vào món xào: Thực khách cảm nhận rõ vị chua thanh men rượu gạo ngấu.

**Acceptance Scenarios**:
1. **Given** người chơi dùng `la_dang_thanh_hoa`, **When** thực khách nếm, **Then** lời thoại và đánh giá cảm quan miêu tả chính xác vị đắng thanh thảo mộc hậu ngọt.
2. **Given** người chơi dùng `com_me`, **When** thực khách nếm, **Then** lời thoại ghi nhận vị chua thanh dịu êm của cơm mẻ lên men.

---

### User Story 3 - Sáng Tạo Với Nội Tạng Động Vật & Cuộn Mỡ Chài (Priority: P2)
Người chơi dùng lòng non (`pork_small_intestine`), lòng già (`pork_large_intestine`), bao tử (`pork_stomach`) làm túi nhồi (`canBeVessel: true`) để nhồi nguyên liệu tùy thích, hoặc dùng mỡ chài (`caul_fat`) làm màng lưới bọc cuộn (`canBeWrapper: true`) quanh thịt nướng. Khi nướng chín, mỡ chài tan chảy làm món ăn mọng nước béo thơm mà không bị khô.

**Why this priority**: Khai phóng tính sáng tạo vô tận trong kỹ thuật cuộn (`roll`) và nhồi (`stuff`) của YumCraft Kitchen.

**Independent Test**:
- Dùng `pork_stomach` hoặc `pork_small_intestine` nhồi nhân: Thao tác nhồi thành công, ghi nhận cấu trúc `stuffed`.
- Dùng `caul_fat` hoặc `pork_skin` cuộn nhân: Thao tác cuộn thành công, ghi nhận cấu trúc `rolled`.

**Acceptance Scenarios**:
1. **Given** người chơi đặt `caul_fat` làm vỏ cuốn và cuộn nhân thịt băm, **When** nướng chín và nếm thử, **Then** thực khách miêu tả kết cấu cuộn mềm mọng thơm béo.
2. **Given** người chơi dọn bất kỳ nội tạng tươi sống nào mà chưa qua nhiệt, **When** thực khách nếm, **Then** thực khách từ chối ăn vì còn thịt sống (`hasRawMeat: true`).

---

### User Story 4 - Trợ Năng Màn Hình NVDA & WAI-ARIA WCAG 2.2 AAA (Priority: P1)
Người chơi khiếm thị sử dụng trình đọc màn hình NVDA và bàn phím (Tab, Phím mũi tên, Enter, Space) có thể duyệt qua toàn bộ 20 nguyên liệu mới trong ngăn tủ lạnh `🥩 Thịt, Nội Tạng & Da Mỡ`, `🥬 Rau Củ & Các Loại Hành`, `🦐 Hải Sản & Trứng` và `🥖 Vỏ Bánh & Đồ Cuốn`. Từng nguyên liệu đọc rõ: tên gọi, mô tả cảm quan vị giác, cảnh báo cần nấu chín và khả năng cuộn/nhồi.

**Why this priority**: Đảm bảo quyền tiếp cận bình đẳng và trải nghiệm chơi game trọn vẹn cho người khiếm thị theo tôn chỉ dự án.

**Independent Test**:
- Duyệt phím qua các nguyên liệu mới: Thẻ button có `aria-label` đầy đủ thông tin, thông báo `announceNVDA` khi chọn.

---

## Edge Cases
- **Ăn sống nội tạng/da mỡ tươi**: Tất cả nguyên liệu nội tạng và da mỡ tươi sống có `needsCooking: true`. Nếu người chơi dọn ra dĩa mà chưa qua nhiệt (`cookLevel === 0`), hệ thống kích hoạt `hasRawMeat: true` và thực khách từ chối ăn hoặc trừ điểm nghiêm khắc.
- **Chiên giòn tóp mỡ / da heo**: Khi qua nhiệt chiên/nướng (`air_fried`, `deep_fried`, `pan_grilled`, `wok_fried`, `grilled`), độ giòn `crunch` và độ béo `fatty` cộng hưởng tối đa, màu sắc chuyển sang vàng óng hoặc cánh gián giòn rụm.
- **Phản ứng vị đắng lá đắng**: Lá đắng tươi có vị đắng đậm; khi qua nhiệt, vị đắng dịu xuống và bật hậu vị ngọt sâu lắng.

---

## Functional Requirements

- **FR-001**: Hệ thống BẮT BUỘC bổ sung 20 nguyên liệu mới vào mảng `INGREDIENTS` trong `index.html` với đầy đủ thuộc tính chuẩn: `id`, `name`, `category`, `emoji`, `color`, `cookedColor`, `needsCooking`, `flavorDesc`, `flavors`, `texture`, `canBeWrapper` (nếu phù hợp), `canBeVessel` (nếu phù hợp).
- **FR-002**: Hệ thống BẮT BUỘC cập nhật tên danh mục `meat` trong `FRIDGE_CATEGORIES` thành `"🥩 Thịt, Nội Tạng & Da Mỡ"` để người chơi dễ dàng nhận diện và tra cứu.
- **FR-003**: Hệ thống BẮT BUỘC tuyệt đối KHÔNG đưa vào bất kỳ công thức cứng nào (Zero Hardcoded Recipes). Mọi sự kết hợp giữa nguyên liệu mới với gia vị và thiết bị bếp đều dựa trên hóa học vị giác cảm quan động (Dynamic Sensory Chemistry).
- **FR-004**: Tất cả nội tạng động vật (`pork_small_intestine`, `pork_large_intestine`, `pork_heart`, `pork_liver`, `pork_stomach`, `chicken_gizzard`, `pork_blood_curd`, `pork_kidney`, `pork_ear`) và da mỡ tươi sống (`pork_skin`, `pork_fatback`, `chicken_skin`, `chicken_fat`, `caul_fat`) BẮT BUỘC có `needsCooking: true`.
- **FR-005**: Mọi nguyên liệu mới BẮT BUỘC có đầy đủ thông tin trợ năng WAI-ARIA (`aria-label`, thẻ tương phản cao, thông báo NVDA `announceNVDA` sống động).
- **FR-006**: BẮT BUỘC có bộ kiểm thử tự động (Unit Test) xác minh sự hiện diện, tính toàn vẹn thuộc tính và các tương tác tự do của 20 nguyên liệu mới.
- **FR-007**: BẮT BUỘC ghi nhật ký chi tiết công việc vào `GEMINI.md` sau khi hoàn thành.
