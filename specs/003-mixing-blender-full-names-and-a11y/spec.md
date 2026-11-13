# Feature Specification: Hiển Thị Đầy Đủ Nguyên Liệu Bàn Trộn & Máy Xay + Khắc Phục Trợ Năng WCAG 2.2

**Feature Branch**: `003-mixing-blender-full-names-and-a11y`  
**Created**: 2026-11-14  
**Status**: Approved for Implementation  
**Input**: Khắc phục lỗi Bàn Trộn Đa Năng (Dụng cụ số 18) và Máy Xay Sinh Tố cắt tên còn 3 nguyên liệu và thêm hậu tố `(+1)`/`(+2)` khi trộn/xay từ 4 đến 20+ nguyên liệu; đồng thời khắc phục toàn diện các lỗi trợ năng từ báo cáo 4 chuyên gia `accessibility-lead` (`text-quality-reviewer`, `live-region-controller`, `aria-specialist`, `keyboard-navigator`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hiển Thị Đầy Đủ 100% Tên Nguyên Liệu Trên Bàn Trộn Đa Năng & Máy Xay Sinh Tố (Priority: P1)

Khi người chơi bỏ 4, 5, 6, 10 hoặc 20 nguyên liệu bất kỳ vào **Bàn Trộn Đa Năng (`mixing_table`)** và thực hiện bất kỳ thao tác nào (`mix_toss` [C], `knead_dough` [K], `whisk_batter` [W]) hoặc bỏ vào **Máy Xay Sinh Tố (`blender`, `blend_smooth`)**, tên món ăn kết quả và thông báo NVDA phải liệt kê **toàn bộ tên các nguyên liệu đã trộn/xay**, tuyệt đối không cắt bớt còn 3 món hay thay bằng `(+1)`, `(+2)`.

**Why this priority**: Người chơi khiếm thị dùng NVDA và người chơi thông thường cần biết chính xác toàn bộ các thành phần mình vừa kết hợp mà không bị mất thông tin từ nguyên liệu thứ 4 trở đi.

**Independent Test**:
- Trộn 4 nguyên liệu (`chocolate`, `brewed_coffee`, `egg`, `milk`) bằng `mix_toss`, `knead_dough`, `whisk_batter`: tên món chứa đủ 4 tên nguyên liệu, không chứa `(+1)`.
- Trộn 5, 6, 10, 20 nguyên liệu trên Bàn Trộn (kể cả trộn nối tiếp nhiều bước): `subItems` được làm phẳng, `defaultMixedName` và `announceNVDA` chứa đủ tất cả tên nguyên liệu theo đúng thứ tự, không có `(+...)`.
- Xay 4, 5, 10, 20 nguyên liệu trong Máy Xay Sinh Tố (`blend_smooth`, kể cả xay nối tiếp): `defaultBlendName` và `announceNVDA` chứa đủ tất cả tên nguyên liệu, không bỏ sót món thứ 4 trở đi.

**Acceptance Scenarios**:
1. **Given** người chơi đặt 4 nguyên liệu (*Thanh Sô-cô-la Đen*, *Cà phê phin truyền thống nguyên chất*, *Trứng gà ta*, *Sữa tươi thanh trùng*) lên Bàn Trộn, **When** bấm `mix_toss` (C), `knead_dough` (K) hoặc `whisk_batter` (W), **Then** tên hỗn hợp chứa đủ cả 4 tên nguyên liệu và không có `(+1)`.
2. **Given** người chơi đặt 5, 6, 10 hoặc 20 nguyên liệu lên Bàn Trộn hoặc Máy Xay, **When** trộn hoặc xay, **Then** tên hỗn hợp và thông báo NVDA chứa đủ tất cả tên nguyên liệu, đồng thời ô đặt tên `#input-custom-dish-name` cho phép giữ và chỉnh sửa tên dài không bị cắt ở 80 ký tự.

---

### User Story 2 - Đồng Bộ Hiển Thị Đầy Đủ & Sửa Lỗi Trợ Năng Từ Accessibility Lead (Priority: P1)

Khắc phục các vấn đề trợ năng tại Bàn Chế Biến, Khay Tạm, Đĩa Ăn, Live Region và Modal theo chuẩn WCAG 2.2 AA/AAA:
- Bỏ cắt chữ `.truncate` ở danh sách món (`#station-items-list`, `#staging-items-list`, `#plate-items-list`, `#wrap-vessel-options-container`), cho phép xuống dòng rõ ràng kèm thuộc tính `title` đầy đủ và hiển thị tóm tắt thành phần đĩa ăn trên mọi kích thước màn hình.
- Chuẩn hóa WCAG 2.5.3 (Label in Name) cho nút chọn dụng cụ (`${st.shortName} - ${st.name}`), nút trạng thái bận (`Đang chế biến: ...`), và các nút `Xóa`, `Ra khay`, `Vào bếp`.
- Chống đè timer trong `announceNVDA` (`clearTimeout` trước khi đặt timer mới `60ms`), chuyển thông báo không khẩn cấp (`feedCharacter`, nhắc nhở kiểm tra hợp lệ thông thường) sang `'polite'`, bỏ `hidden` (`display:none`) khỏi live region `#login-alert-box` / `#reg-alert-box` để trình đọc màn hình luôn đăng ký sẵn.
- Bổ sung `role="group"` + `aria-labelledby="heading-station-actions"` cho `#station-action-buttons`, `aria-hidden="true"` cho icon `📦`, `tabindex="0"` cho danh sách cuộn `#station-items-list`, dọn callback focus thừa ở `stationGrid`, và đảm bảo khôi phục focus đầy đủ khi đóng `#modal-settings` và `#modal-help` từ Menu Chính.

---

### Edge Cases

- Trộn nhiều lần liên tiếp trên Bàn Trộn hoặc Máy Xay (vd: trộn 3 món -> thêm 3 món nữa trộn tiếp -> nhào nặn -> đánh bông): tên nguyên liệu được nối phẳng từ `sourceItems` (không lặp vỏ bọc hỗn hợp cũ, không hiện `(+N)`).
- Kết hợp 20 nguyên liệu có độ dài chuỗi > 500 ký tự: `#input-custom-dish-name` không bị giới hạn `maxlength="80"`.
- Khi `announceNVDA` được gọi liên tiếp dưới 60ms: timer cũ bị hủy bằng `clearTimeout` để tránh xung đột lời đọc.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `mixing_table` (`mix_toss`, `knead_dough`, `whisk_batter`) phải ghép toàn bộ `names.join(' & ')` vào `defaultMixedName` và thông báo đầy đủ qua `announceNVDA`, không cắt `.slice(0, 3)` hay thêm `(+N)`.
- **FR-002**: Máy Xay Sinh Tố (`blend_smooth`) phải làm phẳng `sourceItems` khi xay nối tiếp và ghép toàn bộ `names.join(' & ')` vào `defaultBlendName` và thông báo `announceNVDA`, không cắt `.slice(0, 3)`.
- **FR-003**: Ô `#input-custom-dish-name` phải hỗ trợ tên món dài (nâng `maxlength` lên `2000`) và các danh sách hiển thị món ăn (`#station-items-list`, `#staging-items-list`, `#plate-items-list`) không bị cắt chữ bởi `.truncate` hay `hidden sm:inline`.
- **FR-004**: Áp dụng đầy đủ các sửa lỗi WCAG 2.5.3, WCAG 4.1.3, WCAG 2.4.3 và WCAG 2.1.1 từ 4 báo cáo `accessibility-lead` mà không làm hỏng hành vi NVDA hoặc bộ test hiện có.
- **FR-005**: Không đưa bất kỳ công thức cứng nào vào mã nguồn (Zero Hardcoded Recipes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% bài test trộn/xay 4, 5, 6, 10, 20 nguyên liệu đều chứa đủ tên mọi nguyên liệu và không xuất hiện `(+1)` / `(+2)` hay bị thiếu món.
- **SC-002**: 100% test suite `tests/test_mixing_table_and_a11y.js` (bao gồm các kiểm tra WAI-ARIA, focus, label-in-name, live region) PASS hoàn toàn.
