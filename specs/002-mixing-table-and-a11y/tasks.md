# Tasks: Bàn Trộn Đa Năng (Số 18) & Nâng Cấp Trợ Năng Bếp Toàn Diện

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Specify Artifacts & Settings Sync Survey
- [x] T001: Kiểm tra luồng lưu cài đặt trong `js/main-menu.js` và cấu trúc Spec 001
- [x] T002: Hoàn tất `spec.md`, `plan.md`, `tasks.md` tại `specs/002-mixing-table-and-a11y/`

## Phase 2: Accessibility Lead Fixes (HTML, Modals, Live Regions, Focus & Keyboard)
- [x] T003: Sửa markup HTML trong `index.html`: cập nhật `18 Dụng Cụ`, thay `<section>` lồng trong `#panel-workbench` bằng `<div>`, bỏ `role="region"` trên `#fridge-items-grid` / `#spices-grid`, dọn thuộc tính dư thừa trên `<dialog>`, đổi `aria-labelledby="wrap-vessel-selector-title"`, thêm checkbox `#setting-single-key-shortcuts` trong `#modal-settings`, cập nhật `#modal-help` với Bàn Trộn + phím `K`/`W`
- [x] T004: Đồng bộ cài đặt `singleKeyShortcutsEnabled` giữa `js/main-menu.js` và `index.html` (`state`, `applySettingsToGameState`, `bindEvents`)
- [x] T005: Nâng cấp `announceNVDA` (`60ms`, bỏ `live-status-text`), điều chỉnh politeness (`roll_tight`, `stuff_pack`, `confirmPlatingDish`, `readDishSummary`), thêm thông báo bắt đầu `feedCharacter` & `performStationAction`, thông báo khi `isCookingBusy`
- [x] T006: Khắc phục quản lý focus & roving `tabindex`: `#station-selector-grid`, `#station-action-buttons` (cập nhật in-place, `aria-busy` container), `#fridge-category-tabs`, `#wrap-vessel-options-container`, `#finish-garnish-list`, `aria-pressed` cho `#dest-btn-*` & `#spice-target-*`, placeholder `role="listitem"`, khôi phục focus khi xóa item / đóng mở modal / vào bếp, `Escape` cho toàn bộ modal

## Phase 3: Bàn Trộn Đa Năng (Station 18) & Âm Thanh & Lịch Sử Chế Biến
- [x] T007: Thêm trạm `mixing_table` (`18. Bàn Trộn`, `isMixingStation: true`) vào `STATIONS` với 3 thao tác `mix_toss` (`C`), `knead_dough` (`K`), `whisk_batter` (`W`)
- [x] T008: Tích hợp `mix_bowl.ogg`, `knead_dough.ogg`, `whisk_batter.ogg` kèm Web Audio fallback trong `playSoundEffect`
- [x] T009: Cài đặt xử lý động trong `performStationAction` cho `mixing_table` (tạo `kind: 'mixed'`, làm phẳng `subItems`, ghi `actionHistory` `'mixed'|'kneaded'|'whisked'`, bảo toàn 100% `beverage_station`)
- [x] T010: Cập nhật `heatMethods` (`nonHeatMethods`), `analyzeCulinaryChemistry`, `describeItemStateShort`, `formatActionHistoryChain`, `groupItemsByCookingHistory`, `generateSmartDishTitle`, `generateSensoryTastingReview`, `drawWorkbenchCanvas`, và phím tắt `K`/`W` trong `bindEvents`

## Phase 4: Verification, Tests & Documentation
- [x] T011: Viết và chạy bộ kiểm thử Node.js `tests/test_mixing_table_and_a11y.js` (10/10 PASSED)
- [x] T012: Kiểm chứng trợ năng sau sửa đổi, cập nhật `README.md` và ghi nhật ký vào `GEMINI.md`
