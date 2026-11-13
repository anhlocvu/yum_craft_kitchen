# Feature Specification: Bàn Trộn Đa Năng (Số 18) & Nâng Cấp Trợ Năng Bếp Toàn Diện (WCAG 2.2 AAA + NVDA)

**Feature Branch**: `002-mixing-table-and-a11y`  
**Created**: 2026-11-13  
**Status**: Approved for Implementation  
**Input**: Thêm Dụng cụ số 18 (`mixing_table` - Bàn Trộn Đa Năng) cho phép người chơi trộn các nguyên liệu rắn/bột/hỗn hợp/topping với nhau (ví dụ: trộn bột mì + bột năng + bột gạo, trộn bột làm bánh, trộn gỏi/salad, trộn nhân bánh) mà vẫn giữ nguyên dạng món ăn (`kind: 'mixed'`, KHÔNG biến thành đồ uống) và vẫn bảo toàn 100% nguyên lý Trạm Pha Chế số 10 (`beverage_station`: khuấy đều, lắc bình, hãm thành đồ uống). Hỗ trợ 3 thao tác mới (`C`: Trộn Đều `mix_toss`, `K`: Nhào Nặn `knead_dough`, `W`: Đánh Bông / Đánh Tan `whisk_batter`) dùng 3 file âm thanh `.ogg` trong `sounds/`, lưu đầy đủ lịch sử nấu (`actionHistory`, `cookMethod`), đồng thời khắc phục các lỗ hổng trợ năng WAI-ARIA, quản lý focus bàn phím và live-region NVDA tại màn hình Bếp.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trộn Nguyên Liệu Rắn/Bột Thành Hỗn Hợp Ăn Được Mà Không Bị Biến Thành Thức Uống (Priority: P1)
Người chơi đặt các loại bột khô (như `wheat_flour`, `tapioca_starch`, `rice_flour`), hoặc nguyên liệu nấu ăn tự do lên Bàn Trộn (`18. Bàn Trộn`, `mixing_table`). Khi bấm `Trộn Đều Hỗn Hợp (C)`, `Nhào Nặn Dẻo Quánh (K)` hoặc `Đánh Bông / Sánh Mịn (W)`, hệ thống gộp các nguyên liệu thành một khối hỗn hợp thống nhất (`kind: 'mixed'`), KHÔNG gắn `texture: 'drink'` hay `kind: 'beverage'`, không gán cứng bất kỳ công thức nào. Sau khi trộn, người chơi có thể đem hỗn hợp đi nướng, chiên, hấp, luộc, hoặc nhào thành vỏ bọc (`canBeWrapper: true` khi nhào nặn) đi cuộn nhân ở Bàn Cuộn.

**Independent Test**:
- Trộn `wheat_flour` + `tapioca_starch` + `rice_flour` bằng `mix_toss` -> tạo `kind: 'mixed'`, `texture` khác `'drink'`, giữ `needsCooking: true` vì bột còn sống, `actionHistory` chứa `'mixed'`.
- Trộn bột + nước + trứng bằng `whisk_batter` rồi chiên chảo / nướng lò -> tạo `kind: 'mixed'`, `texture: 'soft'`, sau khi chiên/nướng chín chuyển `cookLevel >= 1`, `needsCooking: false`, `actionHistory` có dạng `['whisked', 'fried']` hoặc `['whisked', 'baked']`, thực khách nhận xét là món ăn chứ không phải thức uống.
- Nhồi/nặn bằng `knead_dough` -> hỗn hợp có thể làm vỏ cuốn (`canBeWrapper: true`), giữ vị tự nhiên và gia vị đã nêm.
- Trộn nguyên liệu giòn khô (như tóp mỡ, bánh đa bẻ vụn, rau giòn) bằng `mix_toss` -> bảo toàn độ giòn `crunch` và `texture: 'crispy'` thay vì nghiền nát hoặc hóa lỏng.

### User Story 2 - Bảo Toàn 100% Trạm Pha Chế (Số 10) & Lịch Sử Chế Biến Đồng Bộ (Priority: P1)
Trạm Pha Chế (`10. Trạm Pha Chế`, `beverage_station`) với 3 nút `stir_pour` (Khuấy Đều), `shake_shaker` (Lắc Bình), `brew_infuse` (Hãm/Ủ) giữ nguyên 100% hành vi hiện tại (`kind: 'beverage'`, `texture: 'drink'`, âm thanh pha chế cũ, mô tả thức uống). Mọi thao tác tại Bàn Trộn (`mixed`, `kneaded`, `whisked`) được ghi nhận vào `actionHistory`, `cookMethod`, hiển thị trong `describeItemStateShort`, `formatActionHistoryChain`, `groupItemsByCookingHistory`, và lời nhận xét của thực khách (`generateSensoryTastingReview`) giống hệt các dụng cụ bếp khác.

**Independent Test**:
- Kiểm tra `beverage_station`: vẫn tạo `kind: 'beverage'`, `texture: 'drink'`, đọc `"Thức uống..."`.
- Kiểm tra trộn 2 bước liên tiếp (`mix_toss` rồi `knead_dough` rồi `baked`): `subItems` được làm phẳng không lồng nhau vô tận, `actionHistory` là `['mixed', 'kneaded', 'baked']`, `formatActionHistoryChain` diễn đạt tự nhiên chuỗi thao tác.

### User Story 3 - Âm Thanh Bàn Trộn Chân Thực & Dự Phòng Web Audio (Priority: P2)
Mỗi thao tác trên Bàn Trộn phát file âm thanh thực tế tương ứng (`sounds/mix_bowl.ogg`, `sounds/knead_dough.ogg`, `sounds/whisk_batter.ogg`), chờ âm thanh phát xong trong tối đa ~1.6-2.5 giây trước khi hoàn tất bước chế biến, và có sẵn bộ tổng hợp Web Audio API dự phòng nếu trình duyệt không phát được file `.ogg`.

### User Story 4 - Nâng Cấp Trợ Năng WAI-ARIA, Quản Lý Focus & NVDA (Priority: P1)
Người chơi khiếm thị dùng NVDA và bàn phím có trải nghiệm mượt mà ở màn hình Bếp:
- Chọn dụng cụ trong `#station-selector-grid` bằng mũi tên / Tab / Enter không bao giờ bị mất focus do `innerHTML = ''`.
- Bấm nút thao tác trong `#station-action-buttons` không bị mất focus, thông báo bắt đầu thao tác trước khi phát audio chờ, báo rõ khi bếp đang bận (`isCookingBusy`), và trạng thái `aria-busy` đặt đúng ngữ nghĩa.
- Nút chọn nơi nhận nguyên liệu (`#dest-btn-*`) và nơi rắc gia vị (`#spice-target-*`) cập nhật `aria-pressed` chính xác; các nhóm radio (`#wrap-vessel-options-container`, `#finish-garnish-list`) và tab tủ lạnh (`#fridge-category-tabs`) hỗ trợ roving `tabindex` + phím mũi tên; các modal có khôi phục focus khi đóng, hỗ trợ `Escape` thống nhất; người chơi có thể bật/tắt phím tắt đơn ký tự (`C, K, W, R, S, B, T, P, F, I, H`) trong `#modal-settings` (WCAG 2.1.4 Level A).

---

## Functional Requirements
- **FR-001**: Thêm trạm thứ 18 `mixing_table` (`shortName: '18. Bàn Trộn'`, `isMixingStation: true`) vào cuối mảng `STATIONS`, không thay đổi số thứ tự 1..17 của các dụng cụ cũ.
- **FR-002**: 3 action id của `mixing_table`: `mix_toss` (`C`), `knead_dough` (`K`), `whisk_batter` (`W`), lưu mã trạng thái `'mixed'`, `'kneaded'`, `'whisked'` vào `cookMethod` và `actionHistory`.
- **FR-003**: `mixing_table` không dùng bất kỳ công thức cứng nào; tính chất vật lý (`texture`, `crunch`, `needsCooking`, `canBeWrapper`, `flavors`) suy diễn động 100% từ thuộc tính thực của các `subItems` và thao tác trộn (`mix_toss` / `knead_dough` / `whisk_batter`).
- **FR-004**: `beverage_station` giữ nguyên 100% logic cũ.
- **FR-005**: Tích hợp 3 âm thanh `sounds/mix_bowl.ogg`, `sounds/knead_dough.ogg`, `sounds/whisk_batter.ogg` kèm fallback Web Audio (`mix_bowl`, `knead_dough`, `whisk_batter`).
- **FR-006**: Đồng bộ 100% các hàm đọc/nhận xét/nhóm lịch sử (`describeItemStateShort`, `formatActionHistoryChain`, `groupItemsByCookingHistory`, `analyzeCulinaryChemistry`, `generateSensoryTastingReview`, `heatMethods`, `drawWorkbenchCanvas`, `#modal-help`).
- **FR-007**: Áp dụng đầy đủ các bản sửa lỗi trợ năng được duyệt từ Accessibility Lead (`keyboard-navigator`, `aria-specialist`, `live-region-controller`) và thêm tuỳ chọn bật/tắt phím tắt một ký tự trong `#modal-settings` (`singleKeyShortcutsEnabled`).
