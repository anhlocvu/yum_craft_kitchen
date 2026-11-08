# Tasks: Thêm 20 Nguyên Liệu Đặc Sản Thanh Hóa, Nội Tạng Động Vật, Da & Mỡ Động Vật (Tự Do Sandbox)

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup & Category Update
- [x] T001: Khảo sát cấu trúc `INGREDIENTS` và `FRIDGE_CATEGORIES` trong `index.html`
- [x] T002: Cập nhật tên danh mục `meat` trong `FRIDGE_CATEGORIES` thành `'🥩 Thịt, Nội Tạng & Da Mỡ'`

## Phase 2: Implementation of 20 New Ingredients
- [x] T003: Thêm 5 nguyên liệu Đặc sản Thanh Hóa vào `INGREDIENTS` (`la_dang_thanh_hoa`, `com_me`, `mam_tep_ba_lang`, `rau_ma_thanh_hoa`, `banh_da_thanh_hoa`)
- [x] T004: Thêm 8 nguyên liệu Nội tạng Động vật vào `INGREDIENTS` (`pork_small_intestine`, `pork_large_intestine`, `pork_heart`, `pork_liver`, `pork_stomach`, `chicken_gizzard`, `pork_blood_curd`, `pork_kidney`)
- [x] T005: Thêm 4 nguyên liệu Da & Mỡ Động vật vào `INGREDIENTS` (`pork_skin`, `pork_fatback`, `chicken_skin`, `chicken_fat`)
- [x] T006: Thêm 3 nguyên liệu Mở rộng độc đáo vào `INGREDIENTS` (`caul_fat`, `roasted_rice_powder`, `pork_ear`)

## Phase 3: Accessibility & Chemistry Verification
- [x] T007: Kiểm tra khả năng trợ năng WAI-ARIA, phím tắt và thông báo màn hình NVDA trong `renderFridgeItems`
- [x] T008: Kiểm tra động cơ hóa học cảm quan vị giác (phản ứng `crunch`, `fatty`, `needsCooking`, `canBeWrapper`, `canBeVessel`) đảm bảo 100% không có công thức cứng

## Phase 4: Automated Testing
- [x] T009: Xây dựng bộ kiểm thử tự động `tests/test_thanh_hoa_and_offal_ingredients.js` bao quát 20 nguyên liệu mới, kiểm tra các thao tác chiên snack/tóp mỡ, nấu lá đắng, cuộn mỡ chài, nhồi dồi, và cảnh báo thịt sống
- [x] T010: Chạy toàn bộ test suites hiện có và test mới, đảm bảo 14/14 test đạt 100% PASS

## Phase 5: Documentation & Logging
- [x] T011: Cập nhật nhật ký dự án `GEMINI.md` với đầy đủ thông tin chi tiết về 20 nguyên liệu mới và cấu trúc mở rộng
