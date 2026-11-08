# Implementation Plan: Thêm 20 Nguyên Liệu Đặc Sản Thanh Hóa, Nội Tạng Động Vật, Da & Mỡ Động Vật (Tự Do Sandbox)

**Branch**: `001-featurename-thanh-hoa` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

## Summary
Triển khai bổ sung 20 nguyên liệu mới vào `INGREDIENTS` trong `index.html` bao gồm 5 nguyên liệu đặc sản xứ Thanh (lá đắng, cơm mẻ, mắm tép Ba Làng, rau má, bánh đa mè), 8 nội tạng động vật tươi sống (lòng non, lòng già, tim, gan, bao tử, mề gà, tiết mềm, cật heo), 4 loại da và mỡ động vật (da heo, mỡ khổ heo, da gà, mỡ gà) và 3 nguyên liệu mở rộng độc đáo (mỡ chài bọc nướng, thính gạo rang vàng, tai heo gân giòn). Toàn bộ hệ thống tuân thủ nghiêm ngặt triết lý Toca Kitchen Sandbox: 100% không công thức cứng, phản ánh hóa học vị giác cảm quan trung thực, hỗ trợ chế biến nhiệt, cuộn, nhồi và tối ưu trợ năng WAI-ARIA WCAG 2.2 AAA & NVDA screen reader.

---

## Technical Architecture & Design

### 1. Cấu Trúc Khai Báo Nguyên Liệu Mới (`INGREDIENTS`)
Mỗi nguyên liệu mới tuân thủ schema:
```javascript
{
  id: string,                 // Định danh duy nhất
  name: string,               // Tên tiếng Việt rõ ràng, chuẩn phong vị ẩm thực
  category: string,           // Phân loại tủ lạnh: 'meat', 'veg', 'seafood', 'wrappers', 'noodles_flour'
  emoji: string,              // Biểu tượng cảm xúc trực quan
  color: string,              // Màu sắc khi còn tươi sống
  cookedColor: string,        // Màu sắc khi đã nấu chín vàng / chín tới
  needsCooking: boolean,      // Bắt buộc nấu chín (true với nội tạng, da mỡ sống)
  flavorDesc: string,         // Mô tả hương vị và gợi ý tự do
  canBeWrapper?: boolean,     // Có thể làm vỏ cuộn (như lá đắng, mỡ chài, da heo)
  canBeVessel?: boolean,      // Có thể làm túi/đế nhồi (như bao tử, lòng non, lòng già, bánh đa)
  isFreshBalancer?: boolean,  // Thanh nhiệt, cân bằng ngấy (rau má)
  texture?: string,           // 'crisp', 'soft', 'drink', ...
  flavors: {
    umami: number,
    salty: number,
    sweet: number,
    sour: number,
    spicy: number,
    fatty: number,
    bitter: number,
    aroma: number,
    crunch: number
  }
}
```

### 2. Danh Mục Tủ Lạnh (`FRIDGE_CATEGORIES`)
- Nâng cấp nhãn `id: 'meat'` từ `'🥩 Thịt, Xúc Xích & Pate'` thành `'🥩 Thịt, Nội Tạng & Da Mỡ'`.

### 3. Phản Ứng Hóa Học Cảm Quan & 17 Dụng Cụ Bếp
- Mỡ khổ heo (`pork_fatback`) & da heo (`pork_skin`) & da gà (`chicken_skin`):
  - Khi chiên/nướng nhiệt (`air_fried`, `deep_fried`, `wok_fried`, `pan_grilled`, `grilled`): Kích hoạt độ giòn `crunch` bùng nổ, tỏa hương thơm `aroma` ngào ngạt của tóp mỡ / snack da giòn rụm.
- Mỡ chài (`caul_fat`): Dùng làm lớp vỏ cuộn nhân thịt bọc nướng mềm mọng nước.
- Bao tử (`pork_stomach`) & Lòng già (`pork_large_intestine`): Dùng làm túi nhồi nhân dồi.
- Lá đắng (`la_dang_thanh_hoa`): Vị đắng sâu lắng thảo mộc, dịu ngọt khi qua lửa.
- Cơm mẻ (`com_me`): Vị chua thanh thơm men tự nhiên.

### 4. Trợ Năng Màn Hình NVDA & WAI-ARIA
- Duyệt phím mượt mà qua các danh mục tủ lạnh.
- Thẻ button nguyên liệu có đầy đủ `aria-label` mô tả: Tên, danh mục, hương vị, lưu ý cần nấu chín hoặc khả năng cuộn/nhồi.
- Tự động phát âm thanh và thông báo NVDA `announceNVDA` khi nhặt nguyên liệu lên thớt/bếp.

---

## Phases & Execution Order

1. **Phase 1: Chuẩn bị & Cập nhật Danh mục Tủ Lạnh**:
   - Cập nhật nhãn category `meat` thành `🥩 Thịt, Nội Tạng & Da Mỡ`.
2. **Phase 2: Bổ sung 20 Nguyên Liệu Mới vào `INGREDIENTS`**:
   - Khai báo chi tiết 20 nguyên liệu với đầy đủ thông số hóa học vị giác và tương tác.
3. **Phase 3: Kiểm tra Trợ Năng & Tương Tác Sandbox**:
   - Rà soát các bộ lọc, hiển thị danh mục và đọc màn hình NVDA.
4. **Phase 4: Bộ Kiểm Thử Tự Động (Unit Testing)**:
   - Viết file `tests/test_thanh_hoa_and_offal_ingredients.js` kiểm tra 20 nguyên liệu, tương tác chiên rán tóp mỡ/snack, nấu lá đắng, nhồi bao tử, cuộn mỡ chài. Chạy test 100% pass.
5. **Phase 5: Ghi Nhật Ký `GEMINI.md`**:
   - Ghi lại toàn bộ công việc và cấu trúc nguyên liệu mới.
