# Tasks: Hiển Thị Đầy Đủ Nguyên Liệu Bàn Trộn & Máy Xay + Khắc Phục Trợ Năng WCAG 2.2

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Specify & Accessibility Audit Artifacts
- [x] T001: Lưu 4 báo cáo JSON từ `accessibility-lead` vào `.a11y-history/20261114-0033/` và xuất `report.md` bằng `render-report.mjs`
- [x] T002: Tạo bộ tài liệu Specify `specs/003-mixing-blender-full-names-and-a11y/` (`spec.md`, `plan.md`, `tasks.md`) và cập nhật `.specify/feature.json`

## Phase 2: Bàn Trộn Đa Năng & Máy Xay Sinh Tố (Full Ingredient Names)
- [x] T003: Sửa `mixing_table` (`index.html`) bỏ `names.slice(0, 3)` và `(+N)`, hiển thị `names.join(' & ')` cho cả 3 thao tác `mix_toss`, `knead_dough`, `whisk_batter`
- [x] T004: Sửa `blend_smooth` (`index.html`) làm phẳng `sourceItems` và hiển thị `names.join(' & ')` đầy đủ thay cho `names.slice(0, 3)`
- [x] T005: Nâng `maxlength` của `#input-custom-dish-name` lên `2000` để không cắt tên món 10–20 nguyên liệu

## Phase 3: Accessibility Lead Fixes (`index.html` & `js/main-menu.js`)
- [x] T006: Sửa `#station-items-list`, `#staging-items-list`, `#plate-items-list`, `#wrap-vessel-options-container`: thay `.truncate` bằng `break-words` + `title`, gỡ `hidden sm:inline`
- [x] T007: Chuẩn hóa WCAG 2.5.3 (Label in Name) & ARIA trên `#station-selector-grid`, `#station-action-buttons` (`role="group" aria-labelledby`), các nút `Xóa`/`Ra khay`/`Vào bếp`, và `aria-hidden="true"` cho emoji `📦`
- [x] T008: Cải thiện `announceNVDA` (`clearTimeout` chống đè buffer), đổi các thông báo không khẩn cấp sang `'polite'`, giữ `#login-alert-box` / `#reg-alert-box` trong accessibility tree bằng `sr-only` thay `hidden`
- [x] T009: Sửa focus & keyboard: `bindDialogFocusRestore(modalSettings)` + `_returnFocusEl` trong `js/main-menu.js`, `tabindex="0"` trên `#station-items-list`, bỏ `targetBtn.focus()` thừa trong `stationGrid`

## Phase 4: Kiểm Thử Đa Quy Mô (4, 5, 6, 10, 20 Nguyên Liệu) & Nhật Ký
- [x] T010: Bổ sung các bài test vào `tests/test_mixing_table_and_a11y.js` (4, 5, 6, 10, 20 nguyên liệu cho Bàn Trộn & Máy Xay + kiểm tra trợ năng) và chạy đạt 100%
- [x] T011: Cập nhật nhật ký lập trình vào `GEMINI.md`
