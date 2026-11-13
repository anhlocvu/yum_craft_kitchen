# Implementation Plan: Bàn Trộn Đa Năng (Số 18) & Nâng Cấp Trợ Năng Bếp Toàn Diện

**Branch**: `002-mixing-table-and-a11y` | **Date**: 2026-11-13 | **Spec**: [spec.md](spec.md)

## Summary
Triển khai dụng cụ bếp số 18 **`mixing_table` (Bàn Trộn Đa Năng)** theo đúng triết lý Sandbox không công thức cứng (`kind: 'mixed'`), bổ sung 3 thao tác (`mix_toss` [C], `knead_dough` [K], `whisk_batter` [W]) kèm 3 file âm thanh thực (`mix_bowl.ogg`, `knead_dough.ogg`, `whisk_batter.ogg` + fallback Web Audio) và lưu đầy đủ vào lịch sử nấu (`actionHistory`). Song song đó, xử lý toàn bộ các vấn đề trợ năng `critical`, `serious`, và `moderate` từ báo cáo kiểm toán của `accessibility-lead`, đồng thời bổ sung tùy chọn bật/tắt phím tắt đơn ký tự trong `#modal-settings`.

---

## Technical Architecture & Design

### 1. Bàn Trộn Đa Năng (`mixing_table`, Station 18)
- Thêm phần tử thứ 18 vào `STATIONS`:
  - `id: 'mixing_table'`, `name: 'Bàn Trộn Đa Năng'`, `shortName: '18. Bàn Trộn'`, `emoji: '🥣'`, `isMixingStation: true`
  - `actions`:
    1. `mix_toss`: `🥣 Trộn Đều Hỗn Hợp (C)`
    2. `knead_dough`: `👐 Nhào Nặn Dẻo Quánh (K)`
    3. `whisk_batter`: `🥢 Đánh Bông / Đánh Tan Sánh Mịn (W)`
- Phím tắt `K` và `W` chỉ kích hoạt khi đang đứng ở trạm có `isMixingStation: true` (và `singleKeyShortcutsEnabled` đang bật).

### 2. Cơ Chế Vật Lý & Hóa Học Trộn Động (`kind: 'mixed'`)
- Làm phẳng `subItems`: Nếu có item đã là `kind === 'mixed'` hoặc `kind === 'blended'`, trích xuất `subItems` con và giữ lại chuỗi `actionHistory` cũ trước khi nối action mới (`'mixed' | 'kneaded' | 'whisked'`).
- Suy diễn `texture`, `crunch`, `needsCooking`, `canBeWrapper` hoàn toàn động từ danh sách `subItems` (tuyệt đối không gán công thức cứng):
  - Nếu có bất kỳ nguyên liệu nào cần nấu chín (`needsCooking && cookLevel === 0`), hỗn hợp giữ `needsCooking: true`, `cookLevel: 0` (để người chơi có thể đem bột/nhân sống đi nướng, chiên, hấp, luộc...). Ngược lại giữ `needsCooking: false` và `cookLevel` theo trạng thái chín sẵn.
  - Tính `texture`:
    - `knead_dough`: `'soft'` (khối dẻo/nhào mịn, gắn `canBeWrapper: true` để có thể đem sang Bàn Cuộn làm vỏ cuốn).
    - `whisk_batter`: `'soft'` (hỗn hợp đánh bông/sánh mịn).
    - `mix_toss`: Nếu độ giòn tổng hợp cao (`crunch >= 2.2`) và tỷ lệ nguyên liệu lỏng không áp đảo, giữ `texture: 'crispy'`; ngược lại `'soft'` (không bao giờ thành `'drink'`).
  - Tính `flavors`: Dùng `combineFlavorProfiles(subItems)` (giữ trọn vị gốc + gia vị đã nêm); khi `knead_dough` hoặc `whisk_batter`, độ giòn `crunch` giảm tự nhiên vì kết cấu đã được nhào mịn/đánh tan; khi `mix_toss`, bảo toàn độ giòn `crunch`.
  - Cập nhật `heatMethods`: thêm `'mixed'`, `'kneaded'`, `'whisked'` vào `nonHeatMethods` để khi đem hỗn hợp trộn đi nấu nhiệt, lần nấu nhiệt đầu tiên tính đúng là `cookLevel = 1` (chín tới) thay vì bị nhầm thành chín quá (`cookLevel = 2`).
- Bảo toàn **100%** `beverage_station` (Trạm 10) như nguyên bản.

### 3. Âm Thanh & Canvas Bàn Trộn
- `playExternalAudio('mix_bowl.ogg' | 'knead_dough.ogg' | 'whisk_batter.ogg', true)` với dự phòng tự động gọi Web Audio `playSoundEffect` tương ứng nếu audio ngoại vi gặp lỗi.
- `drawWorkbenchCanvas`: Khi `activeSt.id === 'mixing_table'`, vẽ tô trộn inox/gỗ sâu lòng, hiển thị các nguyên liệu/hỗn hợp bên trong kèm hiệu ứng đảo trộn / nhào bột / đánh bông khi `state.isAnimatingAction`.

### 4. Lịch Sử Nấu & Tường Thuật Thực Khách
- Bổ sung `'mixed'`, `'kneaded'`, `'whisked'` vào:
  - `describeItemStateShort` (`methodMap`)
  - `formatActionHistoryChain` (`interMap` & `getFinalActionText`)
  - `analyzeCulinaryChemistry` (`walkItem` nhánh `kind === 'mixed'` + không loại trừ `crunch` của món trộn giòn)
  - `generateSensoryTastingReview` & `generateSmartDishTitle`

### 5. Sửa Lỗi Trợ Năng (Accessibility Lead Integration)
- **Live Region (`announceNVDA`)**: Xóa truy vấn DOM chết `live-status-text`, tăng debounce buffer từ `25ms` lên `60ms`, chuyển các thông báo hoàn tất bình thường sang `'polite'`, bổ sung thông báo bắt đầu khi thực khách nếm (`feedCharacter`) và khi đang bận (`isCookingBusy`).
- **Focus & Roving Tabindex**:
  - Cập nhật in-place hoặc khôi phục focus chính xác cho `#station-selector-grid` và `#station-action-buttons`; đặt `aria-busy` lên container thao tác thay vì nút đang disabled; đồng bộ `aria-label`.
  - Cài roving `tabindex` + phím mũi tên (`ArrowLeft/Right/Up/Down`, `Home/End`) cho `#station-selector-grid`, `#fridge-category-tabs`, `#wrap-vessel-options-container`, `#finish-garnish-list`.
  - Khôi phục focus sau khi xóa/chuyển nguyên liệu khỏi danh sách trên thớt, khay chờ, dĩa; chuyển focus vào `#tab-fridge` khi vào bếp; khôi phục focus khi đóng các modal (`modal-help`, `modal-finish-dish`, `modal-confirm-back`, `modal-confirm-back-to-menu`, `modal-settings`); thống nhất phím `Escape` cho tất cả modal.
- **ARIA & Landmarks**:
  - Sửa tiêu đề & mô tả từ `17 Dụng Cụ` -> `18 Dụng Cụ`.
  - Bỏ `<section aria-labelledby>` lồng bên trong `#panel-workbench`, đổi sang `<div>`; bỏ `role="region"` dư thừa trên `#fridge-items-grid` và `#spices-grid`; bỏ `role="dialog"` / `aria-modal="true"` dư thừa trên thẻ `<dialog>`; đổi `aria-label` tĩnh ở `#wrap-vessel-options-container` sang `aria-labelledby="wrap-vessel-selector-title"`.
  - Cập nhật `aria-pressed` cho `#dest-btn-*` và `#spice-target-*`; đặt `role="listitem"` cho placeholder danh sách rỗng.
- **Cài đặt phím tắt (WCAG 2.1.4 A)**:
  - Thêm checkbox `#setting-single-key-shortcuts` trong `#modal-settings` (cùng đồng bộ trong `js/main-menu.js` và `index.html`) để bật/tắt phím tắt đơn ký tự trong bếp.
