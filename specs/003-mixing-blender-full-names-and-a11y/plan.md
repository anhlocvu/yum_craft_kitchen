# Implementation Plan: Hiển Thị Đầy Đủ Nguyên Liệu Bàn Trộn & Máy Xay + Khắc Phục Trợ Năng WCAG 2.2

**Branch**: `003-mixing-blender-full-names-and-a11y` | **Date**: 2026-11-14 | **Spec**: [spec.md](spec.md)

## Summary

Cập nhật logic ghép tên và thông báo NVDA cho **Bàn Trộn Đa Năng (`mixing_table`)** và **Máy Xay Sinh Tố (`blend_smooth`)** trong `index.html` để hiển thị đầy đủ 100% nguyên liệu (không cắt 3 món, không `(+N)`), đồng thời áp dụng các bản sửa trợ năng đã tổng hợp từ 4 chuyên gia `accessibility-lead` (`text-quality-reviewer`, `live-region-controller`, `aria-specialist`, `keyboard-navigator`) trên `index.html` và `js/main-menu.js`.

## Technical Context

**Language/Version**: HTML5, Vanilla JS (ES6+), Tailwind CSS  
**Testing**: Node.js VM DOM harness (`tests/test_mixing_table_and_a11y.js`)  
**Constraints**: Tuân thủ tuyệt đối Zero Hardcoded Recipes; bảo toàn hành vi NVDA đang hoạt động ổn định (Intent-First Workflow).

## Design Details

### 1. Bàn Trộn Đa Năng & Máy Xay Sinh Tố (Full Ingredient Names)
- **`mixing_table` (`index.html`)**:
  - Đổi `previewNames` + `extraSuffix` thành `const defaultMixedName = \`${names.join(' & ')} (${methodLabel})\`;`.
  - Giữ nguyên làm phẳng `sourceItems` và `actionHistory`.
- **`blend_smooth` (`index.html`)**:
  - Làm phẳng `sourceItems` nếu xay nối tiếp một item đã `kind === 'blended'` hoặc `kind === 'mixed'` (tránh lồng ghép mất tên nguyên liệu con).
  - Đổi `defaultBlendName` từ `names.slice(0, 3).join(' & ')` thành `${names.join(' & ')} (xay nhuyễn)`.
- **`#input-custom-dish-name`**: Nâng `maxlength` từ `80` lên `2000` để không cắt tên hỗn hợp nhiều nguyên liệu (lên tới 20+ món).

### 2. Khắc Phục Trợ Năng Từ `accessibility-lead`
- **Visual Disclosure & Wrapping (`TQR-010`, `A11Y-TEXT-001`)**:
  - Trong `renderWorkbench` (`#station-items-list`), `renderStagingTray` (`#staging-items-list`), `renderServingPlate` (`#plate-items-list`): bỏ `truncate`, thay bằng `break-words leading-snug` kèm thuộc tính `title` đầy đủ; bỏ `hidden sm:inline` ở `#plate-items-list` để tóm tắt thành phần luôn hiển thị đáp ứng trên mọi màn hình; thêm `title="${it.name}"` cho nút chọn vỏ/khuôn ở `#wrap-vessel-options-container`.
- **WCAG 2.5.3 Label in Name & ARIA (`TQR-009`, `ARIA-LABEL-IN-NAME`, `ARIA-GROUP-LABEL`, `ARIA-ICON-HIDDEN`)**:
  - `#station-selector-grid`: đặt `aria-label="${st.shortName} - ${st.name}. ${st.desc}"` (khớp nhãn hiển thị `18. Bàn Trộn` ở đầu chuỗi).
  - `#station-action-buttons`: thêm `role="group" aria-labelledby="heading-station-actions"` vào HTML; giữ `aria-busy` theo yêu cầu test hiện có; khi bận đặt `aria-label="Đang chế biến: ${act.label}"` khớp chữ hiển thị `⏳ Đang chế biến...`; khi sẵn sàng giữ `aria-label="${act.label}"` và `title="${act.desc}"` (gọn tên nút cho NVDA).
  - Các nút `Ra khay`, `Xóa`, `Vào bếp`: đổi `aria-label` bắt đầu đúng bằng nhãn hiển thị (`Ra khay: Cất ${it.name} ra Khay Tạm`, `Xóa ${it.name} khỏi bếp`, `Vào bếp: Đưa ${it.name} vào Bếp hiện tại`, `Xóa ${it.name} khỏi khay`, `Xóa món ${dish.name} khỏi dĩa`, `Xóa món ${displayName} khỏi dĩa`).
  - `#btn-station-to-staging`: bọc emoji `📦` trong `<span aria-hidden="true">📦</span>`.
- **Live Region Reliability (`LIVE-REGION-DUAL-BUFFER-RACE-CONDITION`, `LIVE-REGION-INAPPROPRIATE-ASSERTIVE-POLITENESS`, `LIVE-REGION-HIDDEN-WITH-DISPLAY-NONE`)**:
  - `announceNVDA`: lưu `state.liveRegionTimer` và gọi `clearTimeout` trước khi đặt `setTimeout(..., 60)` để không xảy ra xung đột dual-buffer.
  - Chuyển các thông báo thông thường (`feedCharacter` đánh giá món, thông báo validate bếp/khay/tủ rỗng) từ `'assertive'` sang `'polite'` để không ngắt ngang lời đọc NVDA.
  - `#login-alert-box` và `#reg-alert-box` trong `index.html` & `js/main-menu.js`: dùng `sr-only` thay cho `hidden` khi ẩn rỗng để live region luôn hiện diện trong accessibility tree.
- **Keyboard & Focus (`FOCUS-001`, `FOCUS-002`, `FOCUS-003`, `KEYBOARD-002`)**:
  - `index.html`: gọi `bindDialogFocusRestore(modalSettings)`, thêm `tabindex="0"` cho `#station-items-list`, bỏ `targetBtn.focus()` thừa trong callback roving `stationGrid` (vì `click()` đã xử lý focus trên DOM mới).
  - `js/main-menu.js`: gán `modalSettings._returnFocusEl = btnMenuSettings` khi mở cài đặt và focus `#setting-sfx-toggle` hoặc nút đóng; gán `modalHelp._returnFocusEl = btnMenuHelp` và focus `#btn-close-help` khi mở hướng dẫn từ Menu Chính.
  - *(Lưu ý Intent-First: giữ nguyên `role="toolbar"` trên `#station-selector-grid` và `role="listitem"` trên placeholder trống để không phá vỡ hành vi điều hướng NVDA và test T10 hiện có).*
