const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const htmlPath = path.join(ROOT_DIR, 'index.html');
const mainMenuPath = path.join(ROOT_DIR, 'js', 'main-menu.js');
const html = fs.readFileSync(htmlPath, 'utf8');
const mainMenuJs = fs.readFileSync(mainMenuPath, 'utf8');

// Extract main inline script from index.html
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<!-- Dual ARIA Live Regions/);
if (!scriptMatch) {
  throw new Error('Could not locate main inline <script> in index.html');
}
let gameScript = scriptMatch[1];

// Expose const/function symbols for test inspection cleanly
gameScript += `
;globalThis.__TEST_API__ = {
  STATIONS, INGREDIENTS, SPICES, CHARACTERS, FRIDGE_CATEGORIES, GARNISH_OPTIONS,
  state, createFoodItem, performStationAction, applySpice, addIngredientFromFridge,
  describeItemStateShort, formatActionHistoryChain, groupItemsByCookingHistory,
  analyzeCulinaryChemistry, generateSensoryTastingReview, getEatingSoundForItem,
  renderFridge, renderWorkbench, renderStagingTray, renderSpices, renderServingPlate,
  renderFinishModalGarnishes, bindEvents, announceNVDA
};
`;

// Minimal DOM & Web APIs Mock for Node VM execution
function createMockElement(tagName, id = '') {
  const attrs = {};
  const classes = new Set();
  const listeners = {};
  const el = {
    tagName: tagName.toUpperCase(),
    id,
    dataset: {},
    style: {},
    value: '',
    checked: false,
    disabled: false,
    open: false,
    children: [],
    parentNode: null,
    offsetParent: {},
    isConnected: true,
    _innerHTML: '',
    _textContent: '',
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      contains: (c) => classes.has(c),
      toggle: (c) => (classes.has(c) ? classes.delete(c) : classes.add(c))
    },
    set className(val) {
      classes.clear();
      String(val || '').split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
    },
    get className() {
      return Array.from(classes).join(' ');
    },
    set textContent(v) {
      this._textContent = String(v ?? '');
    },
    get textContent() {
      return this._textContent;
    },
    set innerHTML(v) {
      this._innerHTML = String(v ?? '');
      if (this._innerHTML === '') {
        this.children = [];
      } else {
        // Basic listitem detection for empty placeholders
        if (this._innerHTML.includes('role="listitem"')) {
          const ph = createMockElement('div');
          ph.setAttribute('role', 'listitem');
          this.children = [ph];
        }
      }
    },
    get innerHTML() {
      return this._innerHTML;
    },
    setAttribute(k, v) {
      attrs[k] = String(v);
      if (k === 'id') this.id = String(v);
    },
    getAttribute(k) {
      return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
    },
    removeAttribute(k) {
      delete attrs[k];
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    contains(target) {
      if (!target) return false;
      if (target === this) return true;
      return this.children.some(c => c.contains && c.contains(target));
    },
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    removeEventListener(type, fn) {
      if (!listeners[type]) return;
      listeners[type] = listeners[type].filter(f => f !== fn);
    },
    dispatchEvent(evt) {
      const e = evt || {};
      if (!e.preventDefault) e.preventDefault = () => {};
      if (!e.stopPropagation) e.stopPropagation = () => {};
      if (!e.target) e.target = this;
      e.currentTarget = this;
      (listeners[e.type] || []).forEach(fn => fn(e));
    },
    click() {
      this.dispatchEvent({ type: 'click', target: this });
    },
    focus() {
      mockDoc.activeElement = this;
    },
    select() {},
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      this.dispatchEvent({ type: 'close', target: this });
    },
    getContext() {
      return new Proxy({}, { get: () => () => {} });
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      const results = [];
      const match = (node) => {
        if (!node || !node.getAttribute) return false;
        if (selector === 'button') return node.tagName === 'BUTTON';
        const roleMatch = selector.match(/^\[role="([^"]+)"\]$/);
        if (roleMatch) return node.getAttribute('role') === roleMatch[1];
        const dataMatch = selector.match(/^\[data-([a-z0-9-]+)="([^"]+)"\]$/);
        if (dataMatch) {
          const camel = dataMatch[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          return String(node.dataset[camel]) === dataMatch[2] || node._htmlData?.[dataMatch[1]] === dataMatch[2];
        }
        return false;
      };
      const walk = (node) => {
        (node.children || []).forEach(ch => {
          if (match(ch)) results.push(ch);
          walk(ch);
        });
      };
      // Parse innerHTML query selectors on `this` and descendants for data-del-st / data-to-staging / etc.
      const dataAttrMatch = selector.match(/^\[data-([a-z0-9-]+)="([^"]+)"\]$/);
      if (dataAttrMatch && results.length === 0) {
        const attrStr = `data-${dataAttrMatch[1]}="${dataAttrMatch[2]}"`;
        const findInNode = (node) => {
          if (node._innerHTML && node._innerHTML.includes(attrStr)) {
            node._virtualButtons = node._virtualButtons || {};
            if (!node._virtualButtons[attrStr]) {
              node._virtualButtons[attrStr] = createMockElement('button');
            }
            results.push(node._virtualButtons[attrStr]);
          }
          (node.children || []).forEach(ch => findInNode(ch));
        };
        findInNode(this);
      }
      walk(this);
      return results;
    }
  };
  return el;
}

const elementsById = new Map();
const trackedIds = [
  'btn-start-kitchen', 'screen-character-select', 'screen-kitchen',
  'kitchen-char-avatar', 'kitchen-char-title', 'kitchen-char-craving-snippet',
  'start-btn-toggle-sfx', 'start-btn-toggle-tts', 'start-btn-help', 'footer-btn-help',
  'modal-help', 'btn-close-help', 'kitchen-btn-sfx', 'kitchen-btn-tts',
  'k-icon-sfx', 'k-label-sfx', 'k-icon-tts', 'k-label-tts',
  'modal-confirm-back-to-menu', 'btn-kitchen-back-to-mainmenu', 'btn-cancel-back-to-menu', 'btn-do-back-to-mainmenu',
  'modal-confirm-back', 'btn-back-to-select', 'btn-cancel-back', 'btn-do-reset-and-back',
  'btn-char-hint', 'dining-speech-bubble', 'dining-mood-tag',
  'tab-fridge', 'tab-workbench', 'tab-staging', 'tab-spices', 'tab-dining',
  'panel-fridge', 'panel-workbench', 'panel-staging', 'panel-spices', 'panel-dining',
  'dest-btn-station', 'dest-btn-staging', 'fridge-category-tabs', 'fridge-search-input', 'fridge-items-grid', 'fridge-total-count-badge',
  'station-selector-grid', 'active-station-badge', 'canvas-overlay-station-name', 'canvas-overlay-temp',
  'station-desc-sub', 'station-items-count-label', 'heading-station-actions', 'heading-station-items',
  'station-wrapper-vessel-selector', 'wrap-vessel-selector-title', 'wrap-vessel-selected-label', 'wrap-vessel-selector-hint', 'wrap-vessel-options-container',
  'workbench-canvas', 'station-action-buttons', 'station-items-list', 'btn-station-to-staging', 'btn-clear-station-items',
  'staging-count-badge', 'btn-staging-to-station', 'staging-items-list',
  'spice-target-station', 'spice-target-staging', 'spices-grid',
  'plate-items-count-badge', 'plate-dish-title', 'plate-components-summary', 'plate-harmony-score', 'plate-garnish-badge',
  'flavor-bars-list', 'synergy-tags-container', 'plate-items-list', 'btn-clear-plate-items',
  'btn-give-water', 'btn-master-finish-dish', 'btn-master-feed', 'master-feed-label', 'dock-btn-read-dish',
  'modal-finish-dish', 'btn-close-finish-modal', 'btn-cancel-finish', 'btn-confirm-plate-dish', 'btn-suggest-dish-name',
  'finish-modal-ingredients-summary', 'input-custom-dish-name', 'finish-garnish-list',
  'modal-settings', 'nvda-live-assertive-a', 'nvda-live-assertive-b', 'nvda-live-polite-a', 'nvda-live-polite-b',
  'start-char-cards', 'share-community-container'
];
trackedIds.forEach(id => elementsById.set(id, createMockElement('div', id)));
['btn-start-kitchen', 'tab-fridge', 'tab-workbench', 'tab-staging', 'tab-spices', 'tab-dining', 'dest-btn-station', 'dest-btn-staging', 'spice-target-station', 'spice-target-staging', 'btn-close-help', 'btn-master-feed'].forEach(id => {
  elementsById.get(id).tagName = 'BUTTON';
});
['modal-help', 'modal-finish-dish', 'modal-confirm-back', 'modal-confirm-back-to-menu', 'modal-settings'].forEach(id => {
  elementsById.get(id).tagName = 'DIALOG';
});

const windowListeners = {};
const playedExternalAudios = [];
const timersScheduled = [];

const mockDoc = {
  activeElement: null,
  body: createMockElement('body', 'body'),
  getElementById(id) {
    if (!elementsById.has(id)) {
      const el = createMockElement('div', id);
      elementsById.set(id, el);
    }
    return elementsById.get(id);
  },
  createElement(tag) {
    return createMockElement(tag);
  }
};

class MockAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this._listeners = {};
    playedExternalAudios.push(src);
  }
  addEventListener(ev, fn) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(fn);
  }
  removeEventListener(ev, fn) {
    if (!this._listeners[ev]) return;
    this._listeners[ev] = this._listeners[ev].filter(f => f !== fn);
  }
  play() {
    // Emit ended immediately on microtask so await playExternalAudio resolves cleanly
    queueMicrotask(() => {
      (this._listeners.ended || []).forEach(fn => fn());
    });
    return Promise.resolve();
  }
}

const sandbox = {
  console,
  Math,
  JSON,
  Set,
  Map,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Promise,
  Error,
  encodeURI,
  Audio: MockAudio,
  document: mockDoc,
  localStorage: {
    _store: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._store, k) ? this._store[k] : null; },
    setItem(k, v) { this._store[k] = String(v); }
  },
  setTimeout(fn, ms) {
    timersScheduled.push(ms);
    if (ms <= 100) fn();
    return 1;
  },
  clearTimeout() {},
  requestAnimationFrame() {},
  window: {
    AudioContext: null,
    webkitAudioContext: null,
    addEventListener(ev, fn) {
      if (!windowListeners[ev]) windowListeners[ev] = [];
      windowListeners[ev].push(fn);
    },
    dispatchEvent(evt) {
      const e = evt || {};
      if (!e.preventDefault) e.preventDefault = () => {};
      (windowListeners[e.type] || []).forEach(fn => fn(e));
    },
    speechSynthesis: null,
    showScreen: () => {}
  }
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(gameScript, sandbox);

const api = sandbox.__TEST_API__;

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL: ${name}\n  -> ${err.stack || err.message}`);
  }
}

function makeItem(id) {
  const ing = api.INGREDIENTS.find(i => i.id === id);
  if (!ing) throw new Error(`Ingredient not found: ${id}`);
  return api.createFoodItem(ing);
}

function resetStation() {
  api.state.stationItems = [];
  api.state.stagingItems = [];
  api.state.plateItems = [];
  api.state.servedDishes = [];
  api.state.isCookingBusy = false;
  api.state.singleKeyShortcutsEnabled = true;
  playedExternalAudios.length = 0;
}

(async () => {
  await test('T1: STATIONS co 18 dung cu & dung cu 18 la mixing_table voi 3 thao tac', () => {
    assert.strictEqual(api.STATIONS.length, 18);
    assert.strictEqual(api.STATIONS[9].id, 'beverage_station');
    assert.strictEqual(api.STATIONS[9].shortName, '10. Pha Chế');
    const mixSt = api.STATIONS[17];
    assert.strictEqual(mixSt.id, 'mixing_table');
    assert.strictEqual(mixSt.shortName, '18. Bàn Trộn');
    assert.strictEqual(mixSt.isMixingStation, true);
    assert.deepStrictEqual(Array.from(mixSt.actions.map(a => a.id)), ['mix_toss', 'knead_dough', 'whisk_batter']);
  });

  await test('T2: 3 file am thanh Ban Tron ton tai trong sounds/', () => {
    ['mix_bowl.ogg', 'knead_dough.ogg', 'whisk_batter.ogg'].forEach(f => {
      const fp = path.join(ROOT_DIR, 'sounds', f);
      assert.ok(fs.existsSync(fp), `Missing sound file ${f}`);
      assert.ok(fs.statSync(fp).size > 1000, `Sound file ${f} too small`);
    });
  });

  await test('T3: Tron bot mi + bot nang + bot gao tren Ban Tron tao kind=mixed, KHONG thanh do uong', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(
      makeItem('wheat_flour'),
      makeItem('tapioca_starch'),
      makeItem('rice_flour')
    );

    await api.performStationAction('mix_toss');

    assert.ok(playedExternalAudios.includes('sounds/mix_bowl.ogg'), 'Phai phat mix_bowl.ogg');
    assert.strictEqual(api.state.stationItems.length, 1);
    const mixed = api.state.stationItems[0];
    assert.strictEqual(mixed.kind, 'mixed');
    assert.notStrictEqual(mixed.texture, 'drink');
    assert.strictEqual(mixed.cookMethod, 'mixed');
    assert.deepStrictEqual(Array.from(mixed.actionHistory), ['mixed']);
    assert.strictEqual(mixed.needsCooking, true);
    assert.strictEqual(mixed.cookLevel, 0);
    assert.strictEqual(mixed.subItems.length, 3);
    assert.ok(api.describeItemStateShort(mixed).includes('trộn đều hỗn hợp'));

    const rawCheck = api.analyzeCulinaryChemistry([mixed]);
    assert.strictEqual(rawCheck.hasRawMeat, true, 'Bot song chua nau phai bao chua chin khi don song');
  });

  await test('T4: Danh bot + trung + sua + duong (W), sau do chien chao -> chin toi (cookLevel=1), mon an khong phai thuc uong', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(
      makeItem('wheat_flour'),
      makeItem('egg'),
      makeItem('milk'),
      makeItem('white_sugar')
    );

    await api.performStationAction('whisk_batter');
    assert.ok(playedExternalAudios.includes('sounds/whisk_batter.ogg'), 'Phai phat whisk_batter.ogg');
    const batter = api.state.stationItems[0];
    assert.strictEqual(batter.kind, 'mixed');
    assert.strictEqual(batter.cookMethod, 'whisked');
    assert.strictEqual(batter.texture, 'soft');
    assert.deepStrictEqual(Array.from(batter.actionHistory), ['whisked']);

    // Bring batter to frying pan
    api.state.activeStationId = 'frying_pan';
    await api.performStationAction('fry_step');

    const cooked = api.state.stationItems[0];
    assert.strictEqual(cooked.cookLevel, 1, 'Nau nhiet lan dau phai la cookLevel=1 (khong nham voi chin qua)');
    assert.strictEqual(cooked.needsCooking, false);
    assert.strictEqual(cooked.cookMethod, 'fried');
    assert.deepStrictEqual(Array.from(cooked.actionHistory), ['whisked', 'fried']);
    assert.ok(cooked.subItems.every(s => s.cookLevel === 1 && s.needsCooking === false));

    const analysis = api.analyzeCulinaryChemistry([cooked]);
    assert.strictEqual(analysis.hasRawMeat, false);
    const review = api.generateSensoryTastingReview([cooked], analysis, api.CHARACTERS[0], 'Bánh Rán Ngọt');
    assert.ok(review.sensorySentence.startsWith("Món 'Bánh Rán Ngọt'"), 'Phai nhan xet la Mon an, khong phai Thuc uong');
    assert.ok(review.sensorySentence.includes('đánh bông sánh mịn'), 'Phai ghi nhan buoc danh bong trong lich su');
    assert.ok(review.sensorySentence.includes('áp chảo'), 'Phai ghi nhan buoc ap chao trong lich su');
    assert.notStrictEqual(api.getEatingSoundForItem(cooked), 'drink.ogg');
  });

  await test('T5: Nhao nan bot (K) cho phep lam vo cuon & phat knead_dough.ogg', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(
      makeItem('wheat_flour'),
      makeItem('pure_water')
    );

    await api.performStationAction('knead_dough');
    assert.ok(playedExternalAudios.includes('sounds/knead_dough.ogg'), 'Phai phat knead_dough.ogg');
    const dough = api.state.stationItems[0];
    assert.strictEqual(dough.cookMethod, 'kneaded');
    assert.strictEqual(dough.canBeWrapper, true);
    assert.deepStrictEqual(Array.from(dough.actionHistory), ['kneaded']);

    // Use dough as wrapper in rolling mat
    api.state.activeStationId = 'rolling_mat';
    api.state.stationItems.push(makeItem('pate'));
    api.state.selectedWrapperUid = dough.uid;
    await api.performStationAction('roll_tight');
    assert.strictEqual(api.state.stationItems[0].kind, 'rolled');
    assert.strictEqual(api.state.stationItems[0].outerItem.uid, dough.uid);
  });

  await test('T6: Tron mon gion san sang an (mix_toss) bao toan do gion va am thanh nhai gion', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(
      makeItem('banh_da_thanh_hoa'),
      makeItem('roasted_rice_powder'),
      makeItem('rau_ma_thanh_hoa')
    );

    await api.performStationAction('mix_toss');
    const crispyMix = api.state.stationItems[0];
    assert.strictEqual(crispyMix.needsCooking, false);
    assert.strictEqual(crispyMix.texture, 'crispy');
    assert.ok(crispyMix.flavors.crunch >= 2.0);
    assert.strictEqual(api.getEatingSoundForItem(crispyMix), 'eat_crispy_food.ogg');
  });

  await test('T7: Tron lien tiep nhieu buoc (mix_toss -> knead_dough -> bake_step) lam phang subItems & luu lich su day du', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(makeItem('wheat_flour'), makeItem('egg'));
    await api.performStationAction('mix_toss');
    api.state.stationItems.push(makeItem('white_sugar'));
    await api.performStationAction('knead_dough');
    api.state.activeStationId = 'oven';
    await api.performStationAction('bake_step');

    const finalItem = api.state.stationItems[0];
    assert.strictEqual(finalItem.subItems.length, 3, 'Khong duoc long item mix cu vao subItems');
    assert.deepStrictEqual(Array.from(finalItem.actionHistory), ['mixed', 'kneaded', 'baked']);
    const shortDesc = api.describeItemStateShort(finalItem);
    assert.ok(shortDesc.includes('trộn đều hỗn hợp ➔ nhào nặn dẻo quánh ➔ đút lò nướng'), `Unexpected shortDesc: ${shortDesc}`);
    const chain = api.formatActionHistoryChain(finalItem.actionHistory, finalItem.cookLevel, false, false, false);
    assert.ok(chain.includes('trộn đều') && chain.includes('nhào nặn dẻo quánh') && chain.includes('đút lò nướng'), `Unexpected chain: ${chain}`);
  });

  await test('T8: Bao toan 100% Tram Pha Che so 10 (beverage_station van thanh do uong)', async () => {
    resetStation();
    api.state.activeStationId = 'beverage_station';
    api.state.stationItems.push(
      makeItem('espresso'),
      makeItem('milk'),
      makeItem('ice_cubes')
    );

    await api.performStationAction('stir_pour');
    const bev = api.state.stationItems[0];
    assert.strictEqual(bev.kind, 'beverage');
    assert.strictEqual(bev.texture, 'drink');
    assert.strictEqual(bev.cookMethod, 'stirred');
    assert.strictEqual(api.getEatingSoundForItem(bev), 'drink_with_ice.ogg');
    const review = api.generateSensoryTastingReview([bev], api.analyzeCulinaryChemistry([bev]), api.CHARACTERS[0], 'Bạc Xỉu');
    assert.ok(review.sensorySentence.startsWith("Thức uống 'Bạc Xỉu'"));
  });

  await test('T9: Phi cong thuc cung (Zero Hardcoded Recipes) & bao toan gia vi khi tron', async () => {
    resetStation();
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems.push(
      makeItem('pork_skin'),
      makeItem('chocolate'),
      makeItem('tomato')
    );
    api.applySpice('chili');
    await api.performStationAction('mix_toss');
    const oddMix = api.state.stationItems[0];
    assert.strictEqual(oddMix.kind, 'mixed');
    assert.strictEqual(oddMix.spicesApplied.length, 3);
    assert.ok(oddMix.flavors.spicy > 2.0);
  });

  await test('T10: Kiem tra HTML & WAI-ARIA (18 Dung Cu, landmark sach, dialog, settings toggle, roving tabindex, focus)', async () => {
    assert.ok(html.includes('Bàn Chế Biến &amp; 18 Dụng Cụ'));
    assert.ok(html.includes('1. Chọn Dụng Cụ Nấu (18 Dụng Cụ)'));
    assert.ok(html.includes('setting-single-key-shortcuts'));
    assert.ok(mainMenuJs.includes('singleKeyShortcutsEnabled'));
    // Ensure no nested <section> inside #panel-workbench
    const wbStart = html.indexOf('id="panel-workbench"');
    const wbEnd = html.indexOf('id="panel-staging"');
    const wbSlice = html.slice(wbStart, wbEnd);
    assert.ok(!wbSlice.includes('<section'), 'Khong duoc con <section> long ben trong #panel-workbench');
    assert.ok(!html.includes('id="fridge-items-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-[500px] overflow-y-auto custom-scroll pr-1.5" role="region"'));
    assert.ok(html.includes('id="wrap-vessel-options-container" class="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-labelledby="wrap-vessel-selector-title"'));

    // Bind events & render workbench
    api.bindEvents();
    api.renderAll ? api.renderAll() : null;
    api.renderWorkbench();
    api.renderFridge();

    // Check roving tabindex on station-selector-grid
    const stGrid = mockDoc.getElementById('station-selector-grid');
    assert.strictEqual(stGrid.children.length, 18);
    const activeButtons = stGrid.children.filter(b => b.getAttribute('tabindex') === '0');
    assert.strictEqual(activeButtons.length, 1, 'Chi co dung 1 dung cu co tabindex=0');
    assert.strictEqual(stGrid.children[17].dataset.stationId, 'mixing_table');

    // Focus preservation when clicking station button & moving with ArrowRight
    stGrid.children[16].focus();
    stGrid.dispatchEvent({ type: 'keydown', key: 'ArrowRight' });
    assert.strictEqual(api.state.activeStationId, 'mixing_table');
    assert.strictEqual(mockDoc.activeElement.dataset.stationId, 'mixing_table', 'Focus phai giu tren mixing_table sau khi nhan ArrowRight');

    // Check in-place update & aria-busy container on #station-action-buttons
    const actContainer = mockDoc.getElementById('station-action-buttons');
    assert.strictEqual(actContainer.children.length, 3);
    const firstActionBtnRef = actContainer.children[0];
    firstActionBtnRef.focus();
    api.state.isCookingBusy = true;
    api.renderWorkbench();
    assert.strictEqual(actContainer.getAttribute('aria-busy'), 'true');
    assert.strictEqual(actContainer.children[0], firstActionBtnRef, 'Nut thao tac phai duoc cap nhat in-place, khong huy DOM mat focus');
    assert.strictEqual(firstActionBtnRef.disabled, false, 'Khong dat .disabled=true de tranh rot focus');
    assert.strictEqual(firstActionBtnRef.getAttribute('aria-disabled'), 'true');
    api.state.isCookingBusy = false;
    api.renderWorkbench();

    // Check aria-pressed sync on dest-btn & spice-target
    const destStaging = mockDoc.getElementById('dest-btn-staging');
    const destStation = mockDoc.getElementById('dest-btn-station');
    destStaging.click();
    assert.strictEqual(destStaging.getAttribute('aria-pressed'), 'true');
    assert.strictEqual(destStation.getAttribute('aria-pressed'), 'false');

    const spStaging = mockDoc.getElementById('spice-target-staging');
    const spStation = mockDoc.getElementById('spice-target-station');
    spStaging.click();
    assert.strictEqual(spStaging.getAttribute('aria-pressed'), 'true');
    assert.strictEqual(spStation.getAttribute('aria-pressed'), 'false');

    // Check empty list placeholder has role="listitem"
    api.state.stationItems = [];
    api.renderWorkbench();
    assert.strictEqual(mockDoc.getElementById('station-items-list').children[0].getAttribute('role'), 'listitem');

    // Check announceNVDA uses 60ms delay and skips live-status-text
    timersScheduled.length = 0;
    api.announceNVDA('Thử nghiệm NVDA live region', 'polite');
    assert.ok(timersScheduled.includes(60), 'announceNVDA phai dung 60ms delay');

    // Check keyboard shortcuts K, W, Ctrl+C guard & singleKeyShortcutsEnabled toggle (WCAG 2.1.4)
    api.state.currentScreen = 'kitchen';
    api.state.activeStationId = 'mixing_table';
    api.state.stationItems = [makeItem('wheat_flour'), makeItem('pure_water')];
    api.state.singleKeyShortcutsEnabled = false;
    sandbox.window.dispatchEvent({ type: 'keydown', key: 'k', target: mockDoc.body });
    assert.strictEqual(api.state.stationItems.length, 2, 'Khi tat phim tat don ky tu, phim K khong duoc kich hoat');

    // Ctrl+K should NOT trigger game shortcut
    api.state.singleKeyShortcutsEnabled = true;
    sandbox.window.dispatchEvent({ type: 'keydown', key: 'k', ctrlKey: true, target: mockDoc.body });
    assert.strictEqual(api.state.stationItems.length, 2, 'To hop Ctrl+K khong duoc kich hoat phim tat trong bep');

    // Active K shortcut triggers knead_dough
    sandbox.window.dispatchEvent({ type: 'keydown', key: 'k', target: mockDoc.body });
    await new Promise(r => setTimeout(r, 10));
    assert.strictEqual(api.state.stationItems.length, 1);
    assert.strictEqual(api.state.stationItems[0].cookMethod, 'kneaded');

    // Active W shortcut triggers whisk_batter
    api.state.stationItems.push(makeItem('egg'));
    sandbox.window.dispatchEvent({ type: 'keydown', key: 'w', target: mockDoc.body });
    await new Promise(r => setTimeout(r, 10));
    assert.strictEqual(api.state.stationItems.length, 1);
    assert.strictEqual(api.state.stationItems[0].cookMethod, 'whisked');
    assert.deepStrictEqual(Array.from(api.state.stationItems[0].actionHistory), ['kneaded', 'whisked']);
  });

  console.log(`\nSUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
})();
