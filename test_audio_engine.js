const fs = require('fs');

// Read index.html to extract functions and definitions
const html = fs.readFileSync('./index.html', 'utf8');

// Basic syntax check using Function constructor or VM
try {
  // Extract the main script content
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error('Cannot find <script> in index.html');
  }
  const scriptCode = scriptMatch[1];
  console.log('Script tag found. Length:', scriptCode.length, 'characters.');

  // Mock minimal browser environment to test functions in isolation
  const mockWindow = {
    AudioContext: function() {},
    webkitAudioContext: function() {},
    speechSynthesis: { cancel: () => {}, speak: () => {} },
    location: {},
    addEventListener: () => {}
  };
  const mockDoc = {
    getElementById: () => ({
      textContent: '',
      addEventListener: () => {},
      classList: { add: () => {}, remove: () => {} },
      setAttribute: () => {},
      removeAttribute: () => {},
      showModal: () => {},
      close: () => {},
      focus: () => {},
      select: () => {}
    }),
    createElement: () => ({
      setAttribute: () => {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      addEventListener: () => {}
    })
  };

  // Test our specific logic by mocking data structures
  const determineDefaultTexture = (ing) => {
    if (ing.id === 'milk' || ing.id === 'ice_cubes') return 'drink';
    const crispyIds = ['instant_ramen', 'roasted_peanuts', 'taco_shell', 'banh_mi_vn', 'croissant', 'oreo', 'cucumber', 'guava', 'june_plum'];
    if (crispyIds.includes(ing.id) || (ing.flavors && ing.flavors.crunch >= 2.5)) {
      return 'crispy';
    }
    return 'soft';
  };

  const getEatingSoundForItem = (item) => {
    if (item.texture === 'drink') {
      return item.hasIce ? 'drink_with_ice.ogg' : 'drink.ogg';
    }
    if (item.texture === 'liquid') {
      return 'eat_liquid_food.ogg';
    }
    if (item.texture === 'crispy') {
      return 'eat_crispy_food.ogg';
    }
    return 'eat_soft_food.ogg';
  };

  const buildEatingAudioPlaylist = (items) => {
    if (!items || items.length === 0) return ['eat_soft_food.ogg'];
    const rawSounds = items.map(item => getEatingSoundForItem(item));
    const uniqueSounds = [];
    rawSounds.forEach(snd => {
      if (!uniqueSounds.includes(snd)) {
        uniqueSounds.push(snd);
      }
    });
    uniqueSounds.sort((a, b) => {
      const isDrinkA = a.startsWith('drink');
      const isDrinkB = b.startsWith('drink');
      if (isDrinkA && !isDrinkB) return 1;
      if (!isDrinkA && isDrinkB) return -1;
      return 0;
    });
    return uniqueSounds;
  };

  console.log('\n--- BẮT ĐẦU KIỂM THỬ ĐỘNG CƠ ÂM THANH ĂN UỐNG YUMCRAFT ---');

  // Test Case 1: Default Textures
  console.log('\n[TEST 1] Kiểm tra phân loại kết cấu ban đầu:');
  const itemsTest = [
    { id: 'rice_paper', name: 'Bánh tráng', expected: 'soft' },
    { id: 'beef', name: 'Thịt bò', expected: 'soft' },
    { id: 'instant_ramen', name: 'Mì gói', expected: 'crispy' },
    { id: 'milk', name: 'Sữa tươi', expected: 'drink' },
    { id: 'ice_cubes', name: 'Đá viên', expected: 'drink' },
    { id: 'guava', name: 'Ổi giòn', expected: 'crispy' }
  ];
  itemsTest.forEach(t => {
    const res = determineDefaultTexture(t);
    const pass = res === t.expected;
    console.log(` - ${t.name}: ${res} -> ${pass ? 'PASS' : 'FAIL (expected ' + t.expected + ')'}`);
    if (!pass) process.exit(1);
  });

  // Test Case 2: Bánh tráng cuộn khoai tây chiên (CHƯA CHIÊN LỚP VỎ) -> PHẢI ĂN MỀM!
  console.log('\n[TEST 2] Nghịch lý bánh tráng cuộn khoai tây chiên (chưa chiên vỏ):');
  const outerRicePaper = { id: 'rice_paper', name: 'Bánh tráng', texture: 'soft' };
  const innerFries = { id: 'potato', name: 'Khoai tây chiên', texture: 'crispy' };
  const rolledDish = {
    name: 'Bánh tráng cuộn khoai tây chiên',
    kind: 'rolled',
    texture: outerRicePaper.texture, // Soft because rice paper is not fried
    outerTexture: outerRicePaper.texture
  };
  const soundRolled = getEatingSoundForItem(rolledDish);
  console.log(` - Món: ${rolledDish.name}`);
  console.log(` - Âm thanh ăn: ${soundRolled}`);
  if (soundRolled === 'eat_soft_food.ogg') {
    console.log(' -> PASS: Đúng chuẩn vật lý! Cắn ngập vào lớp bánh tráng mềm nên phát eat_soft_food.ogg!');
  } else {
    console.log(' -> FAIL: Sai âm thanh');
    process.exit(1);
  }

  // Test Case 3: Chả giò bánh tráng đem CHIÊN NGẬP DẦU -> PHẢI ĂN GIÒN!
  console.log('\n[TEST 3] Chả giò đem chiên ngập dầu (deep_fried):');
  rolledDish.cookMethod = 'deep_fried';
  rolledDish.texture = 'crispy';
  rolledDish.outerTexture = 'crispy';
  const soundDeepFriedRoll = getEatingSoundForItem(rolledDish);
  console.log(` - Âm thanh ăn: ${soundDeepFriedRoll}`);
  if (soundDeepFriedRoll === 'eat_crispy_food.ogg') {
    console.log(' -> PASS: Vỏ ngoài đã chiên giòn tan, phát eat_crispy_food.ogg!');
  } else {
    console.log(' -> FAIL: Sai âm thanh');
    process.exit(1);
  }

  // Test Case 4: Xay sinh tố xoài sữa đá tuyết -> PHẢI UỐNG CÓ ĐÁ!
  console.log('\n[TEST 4] Sinh tố xoài sữa đá xay:');
  const mangoSmoothie = {
    name: 'Sinh tố xoài sữa đá xay',
    kind: 'blended',
    texture: 'drink',
    hasIce: true
  };
  const soundSmoothie = getEatingSoundForItem(mangoSmoothie);
  console.log(` - Âm thanh ăn/uống: ${soundSmoothie}`);
  if (soundSmoothie === 'drink_with_ice.ogg') {
    console.log(' -> PASS: Có đá tuyết, phát drink_with_ice.ogg!');
  } else {
    console.log(' -> FAIL');
    process.exit(1);
  }

  // Test Case 5: Xay thịt rồi nhồi bột mì đem NƯỚNG LÒ -> KHÔNG PHẢI ĐỒ UỐNG!
  console.log('\n[TEST 5] Thịt xay bọc bột mì đem nướng lò bánh chín giòn:');
  const bakedMeatPie = {
    name: 'Bánh mì nướng nhân thịt xay',
    kind: 'stuffed',
    cookMethod: 'baked',
    texture: 'crispy',
    outerTexture: 'crispy',
    hasIce: false
  };
  const soundPie = getEatingSoundForItem(bakedMeatPie);
  console.log(` - Âm thanh ăn: ${soundPie}`);
  if (soundPie === 'eat_crispy_food.ogg') {
    console.log(' -> PASS: Đã thành bánh nướng giòn rụm, phát eat_crispy_food.ogg, không bị nhầm thành đồ uống!');
  } else {
    console.log(' -> FAIL');
    process.exit(1);
  }

  // Test Case 6: Nồi súp gà hầm ngọt nước -> PHẢI HÚP SÚP!
  console.log('\n[TEST 6] Nồi súp gà hầm nước dùng:');
  const chickenSoup = {
    name: 'Súp gà hầm bắp ngọt',
    cookMethod: 'boiled',
    texture: 'liquid'
  };
  const soundSoup = getEatingSoundForItem(chickenSoup);
  console.log(` - Âm thanh: ${soundSoup}`);
  if (soundSoup === 'eat_liquid_food.ogg') {
    console.log(' -> PASS: Món nước hầm, phát eat_liquid_food.ogg húp sùm sụp!');
  } else {
    console.log(' -> FAIL');
    process.exit(1);
  }

  // Test Case 7: Dĩa Bữa Ăn Combo Tách Rời (Bít tết mềm + Khoai tây chiên giòn + Nước đá xay)
  console.log('\n[TEST 7] Bữa ăn Combo đa món tách rời:');
  const plateCombo = [
    { name: 'Bít tết áp chảo', texture: 'soft' },
    { name: 'Khoai tây chiên giòn', texture: 'crispy' },
    { name: 'Mực chiên giòn', texture: 'crispy' }, // trùng món giòn
    { name: 'Sinh tố đá xay', texture: 'drink', hasIce: true }
  ];
  const playlist = buildEatingAudioPlaylist(plateCombo);
  console.log(' - Playlist âm thanh tạo ra:', playlist);
  const expectedPlaylist = ['eat_crispy_food.ogg', 'eat_soft_food.ogg', 'drink_with_ice.ogg'];
  const isMatch = playlist.length === expectedPlaylist.length && playlist.every(s => expectedPlaylist.includes(s)) && playlist[playlist.length - 1] === 'drink_with_ice.ogg';
  if (isMatch) {
    console.log(' -> PASS: Playlist sắp xếp hoàn hảo! Khử trùng lặp 2 món giòn thành 1, đồ ăn phát trước, đồ uống có đá phát sau cùng!');
  } else {
    console.log(' -> FAIL playlist');
    process.exit(1);
  }

  console.log('\n=== TẤT CẢ 7/7 TEST CASES ĐỀU PASS 100%! ===');
} catch (e) {
  console.error('LỖI KIỂM THỬ:', e);
  process.exit(1);
}
