/**
 * YUMCRAFT KITCHEN — MAIN MENU & AUTH CONTROLLER
 * Điều phối luồng màn hình: Xác thực (Đăng nhập / Đăng ký) <-> Menu Chính <-> Chọn Nhân Vật <-> Nhà Bếp
 * Đảm bảo 100% tiêu chuẩn WCAG 2.2 AAA & NVDA First
 */

import {
  registerUser,
  loginUser,
  logoutUser,
  initAuthListener,
  getActiveProfileCache
} from "./auth-service.js";

// Khóa lưu cài đặt
const SETTINGS_STORAGE_KEY = "yumcraft_game_settings";

/**
 * Đọc cài đặt trò chơi từ localStorage
 */
export function getSavedSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Không thể đọc cài đặt trò chơi:", e);
  }
  return {
    sfxEnabled: true,
    sfxVolume: 80,
    voiceAnnouncements: true
  };
}

/**
 * Lưu cài đặt trò chơi vào localStorage
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Lỗi khi lưu cài đặt:", e);
  }
}

/**
 * Phát loa thông báo cho NVDA / Trình đọc màn hình
 */
function announceToScreenReader(text, assertive = false) {
  const liveId = assertive ? "nvda-live-assertive-a" : "nvda-live-polite-a";
  const region = document.getElementById(liveId);
  if (region) {
    region.textContent = "";
    setTimeout(() => {
      region.textContent = text;
    }, 50);
  }
}

/**
 * Hiển thị alert trong form
 */
function showAlert(boxId, message, isError = true) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.textContent = message;
  box.classList.remove("hidden");
  if (isError) {
    box.className = "mb-4 p-3.5 rounded-2xl text-sm font-semibold border bg-red-50 text-red-700 border-red-300";
  } else {
    box.className = "mb-4 p-3.5 rounded-2xl text-sm font-semibold border bg-emerald-50 text-emerald-800 border-emerald-300";
  }
  announceToScreenReader(message, true);
}

function clearAlert(boxId) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.textContent = "";
  box.classList.add("hidden");
}

/**
 * Quản lý chuyển đổi giữa các Màn Hình Cấp Cao (Screens)
 * screenName: 'auth' | 'main-menu' | 'character-select' | 'kitchen'
 */
export function showScreen(screenName) {
  const screenAuth = document.getElementById("screen-auth");
  const screenMainMenu = document.getElementById("screen-main-menu");
  const screenSelect = document.getElementById("screen-character-select");
  const screenKitchen = document.getElementById("screen-kitchen");

  const allScreens = [screenAuth, screenMainMenu, screenSelect, screenKitchen];
  allScreens.forEach(s => {
    if (s) {
      s.classList.add("hidden");
      s.classList.remove("flex");
    }
  });

  if (screenName === "auth") {
    if (screenAuth) {
      screenAuth.classList.remove("hidden");
      screenAuth.classList.add("flex");
      const firstInput = document.getElementById("login-identifier");
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
      announceToScreenReader("Màn hình Đăng Nhập YumCraft Kitchen.");
    }
  } else if (screenName === "main-menu") {
    if (screenMainMenu) {
      screenMainMenu.classList.remove("hidden");
      screenMainMenu.classList.add("flex");
      const btnEnter = document.getElementById("btn-menu-enter-kitchen");
      if (btnEnter) setTimeout(() => btnEnter.focus(), 100);
      announceToScreenReader("Menu Chính YumCraft Kitchen. Sử dụng phím Tab hoặc mũi tên để chọn.");
    }
  } else if (screenName === "character-select") {
    if (screenSelect) {
      screenSelect.classList.remove("hidden");
      screenSelect.classList.add("flex");
      const btnBack = document.getElementById("btn-back-to-main-menu");
      if (btnBack) setTimeout(() => btnBack.focus(), 100);
      announceToScreenReader("Màn hình Chọn Thực Khách. Chọn 1 trong 4 nhân vật để bắt đầu nấu.");
    }
  } else if (screenName === "kitchen") {
    if (screenKitchen) {
      screenKitchen.classList.remove("hidden");
      screenKitchen.classList.add("flex");
    }
  }
}

/**
 * Quản lý chuyển đổi giữa Đăng Nhập và Đăng Ký trong Screen Auth
 */
export function showAuthView(viewName) {
  const viewLogin = document.getElementById("view-login");
  const viewRegister = document.getElementById("view-register");
  clearAlert("login-alert-box");
  clearAlert("reg-alert-box");

  if (viewName === "register") {
    if (viewLogin) viewLogin.classList.add("hidden");
    if (viewRegister) {
      viewRegister.classList.remove("hidden");
      const firstInput = document.getElementById("reg-username");
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
      announceToScreenReader("Giao diện Đăng Ký Tài Khoản Bếp Trưởng Mới.");
    }
  } else {
    if (viewRegister) viewRegister.classList.add("hidden");
    if (viewLogin) {
      viewLogin.classList.remove("hidden");
      const firstInput = document.getElementById("login-identifier");
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
      announceToScreenReader("Giao diện Đăng Nhập Bếp Trưởng.");
    }
  }
}

/**
 * Cập nhật thông tin người dùng lên Menu Chính
 */
export function updateMainMenuUserProfile(profile) {
  if (!profile) return;
  const nameEl = document.getElementById("menu-user-display-name");
  const usernameEl = document.getElementById("menu-user-username");
  const kitchenEl = document.getElementById("menu-user-kitchen-name");

  if (nameEl) nameEl.textContent = profile.displayName || "Bếp Trưởng";
  if (usernameEl) usernameEl.textContent = profile.username ? `(@${profile.username})` : "";
  if (kitchenEl) kitchenEl.textContent = profile.kitchenName || "Nhà Bếp Sáng Tạo";
}

/**
 * Đồng bộ cài đặt vào game state nếu có
 */
function applySettingsToGameState(settings) {
  if (window.state) {
    window.state.sfxEnabled = settings.sfxEnabled;
    window.state.sfxVolume = settings.sfxVolume / 100;
  }
}

/**
 * Khởi tạo toàn bộ sự kiện và luồng hoạt động
 */
export function initMainMenuController() {
  // 1. Áp dụng cài đặt lưu trữ
  const currentSettings = getSavedSettings();
  applySettingsToGameState(currentSettings);

  // 2. Chuyển đổi giữa Login và Register
  const btnSwitchToReg = document.getElementById("btn-switch-to-register");
  if (btnSwitchToReg) {
    btnSwitchToReg.addEventListener("click", () => showAuthView("register"));
  }

  const btnBackToLogin = document.getElementById("btn-back-to-login");
  if (btnBackToLogin) {
    btnBackToLogin.addEventListener("click", () => showAuthView("login"));
  }

  // 3. Nút Ẩn/Hiện mật khẩu ở Đăng Nhập
  const btnToggleLoginPwd = document.getElementById("btn-toggle-login-pwd");
  const inputLoginPwd = document.getElementById("login-password");
  if (btnToggleLoginPwd && inputLoginPwd) {
    btnToggleLoginPwd.addEventListener("click", () => {
      const isPwd = inputLoginPwd.type === "password";
      inputLoginPwd.type = isPwd ? "text" : "password";
      btnToggleLoginPwd.textContent = isPwd ? "🔒 Ẩn mật khẩu" : "👁️ Hiện mật khẩu";
      btnToggleLoginPwd.setAttribute("aria-label", isPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    });
  }

  // 4. Xử lý Form Đăng Nhập
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert("login-alert-box");

      const identifier = document.getElementById("login-identifier").value.trim();
      const password = document.getElementById("login-password").value;
      const rememberMe = document.getElementById("login-remember-me").checked;
      const btnSubmit = document.getElementById("btn-login-submit");
      const btnText = document.getElementById("btn-login-text");

      try {
        if (btnSubmit) btnSubmit.disabled = true;
        if (btnText) btnText.textContent = "Đang kiểm tra đăng nhập...";

        const profile = await loginUser({ identifier, password, rememberMe });
        
        updateMainMenuUserProfile(profile);
        showScreen("main-menu");
        announceToScreenReader(`Đăng nhập thành công! Chào mừng Bếp Trưởng ${profile.displayName} đến với YumCraft Kitchen.`);
      } catch (err) {
        showAlert("login-alert-box", err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnText) btnText.textContent = "Đăng Nhập";
      }
    });
  }

  // 5. Xử lý Form Đăng Ký
  const formRegister = document.getElementById("form-register");
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert("reg-alert-box");

      const username = document.getElementById("reg-username").value.trim();
      const displayName = document.getElementById("reg-display-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;
      const kitchenName = document.getElementById("reg-kitchen-name").value.trim();
      const rememberMe = document.getElementById("reg-remember-me").checked;
      const btnSubmit = document.getElementById("btn-register-submit");
      const btnText = document.getElementById("btn-register-text");

      try {
        if (btnSubmit) btnSubmit.disabled = true;
        if (btnText) btnText.textContent = "Đang khởi tạo tài khoản Bếp Trưởng...";

        const profile = await registerUser({
          username,
          displayName,
          email,
          password,
          confirmPassword,
          kitchenName,
          rememberMe
        });

        updateMainMenuUserProfile(profile);
        showScreen("main-menu");
        announceToScreenReader(`Đăng ký tài khoản thành công! Chào mừng Bếp Trưởng ${profile.displayName} cùng gian bếp ${profile.kitchenName}.`);
      } catch (err) {
        showAlert("reg-alert-box", err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnText) btnText.textContent = "Hoàn Tất Đăng Ký & Vào Bếp";
      }
    });
  }

  // 6. Xử lý Các Nút Trong Menu Chính
  const btnMenuEnter = document.getElementById("btn-menu-enter-kitchen");
  if (btnMenuEnter) {
    btnMenuEnter.addEventListener("click", () => {
      showScreen("character-select");
    });
  }

  const btnMenuSettings = document.getElementById("btn-menu-settings");
  const modalSettings = document.getElementById("modal-settings");
  const btnCloseSettings = document.getElementById("btn-close-settings");
  const btnSaveSettings = document.getElementById("btn-save-settings");

  // Nạp trạng thái cài đặt vào modal
  const populateSettingsModal = () => {
    const s = getSavedSettings();
    const toggleSfx = document.getElementById("setting-sfx-toggle");
    const volSlider = document.getElementById("setting-sfx-volume");
    const volLabel = document.getElementById("setting-sfx-volume-val");
    const voiceToggle = document.getElementById("setting-voice-announcements");

    if (toggleSfx) toggleSfx.checked = s.sfxEnabled;
    if (volSlider) volSlider.value = s.sfxVolume;
    if (volLabel) volLabel.textContent = s.sfxVolume + "%";
    if (voiceToggle) voiceToggle.checked = s.voiceAnnouncements;
  };

  if (btnMenuSettings && modalSettings) {
    btnMenuSettings.addEventListener("click", () => {
      populateSettingsModal();
      modalSettings.showModal();
    });
  }

  if (btnCloseSettings && modalSettings) {
    btnCloseSettings.addEventListener("click", () => {
      modalSettings.close();
      if (btnMenuSettings) btnMenuSettings.focus();
    });
  }

  const sfxSlider = document.getElementById("setting-sfx-volume");
  const sfxLabel = document.getElementById("setting-sfx-volume-val");
  if (sfxSlider && sfxLabel) {
    sfxSlider.addEventListener("input", (e) => {
      sfxLabel.textContent = e.target.value + "%";
    });
  }

  if (btnSaveSettings && modalSettings) {
    btnSaveSettings.addEventListener("click", () => {
      const toggleSfx = document.getElementById("setting-sfx-toggle");
      const volSlider = document.getElementById("setting-sfx-volume");
      const voiceToggle = document.getElementById("setting-voice-announcements");

      const newSettings = {
        sfxEnabled: toggleSfx ? toggleSfx.checked : true,
        sfxVolume: volSlider ? parseInt(volSlider.value, 10) : 80,
        voiceAnnouncements: voiceToggle ? voiceToggle.checked : true
      };

      saveSettings(newSettings);
      applySettingsToGameState(newSettings);
      modalSettings.close();
      if (btnMenuSettings) btnMenuSettings.focus();
      announceToScreenReader("Đã lưu cài đặt trò chơi thành công.");
    });
  }

  // Nút Hướng dẫn trong Menu Chính
  const btnMenuHelp = document.getElementById("btn-menu-help");
  const modalHelp = document.getElementById("modal-help");
  if (btnMenuHelp && modalHelp) {
    btnMenuHelp.addEventListener("click", () => {
      modalHelp.showModal();
    });
  }

  // Nút Đăng xuất trong Menu Chính
  const btnMenuLogout = document.getElementById("btn-menu-logout");
  if (btnMenuLogout) {
    btnMenuLogout.addEventListener("click", async () => {
      const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất tài khoản Bếp Trưởng khỏi thiết bị này?");
      if (confirmLogout) {
        await logoutUser();
        showScreen("auth");
        showAuthView("login");
        announceToScreenReader("Đã đăng xuất tài khoản. Quay lại màn hình đăng nhập.");
      }
    });
  }

  // Nút Quay lại Menu Chính ở Màn hình Chọn Thực Khách
  const btnBackToMenu = document.getElementById("btn-back-to-main-menu");
  if (btnBackToMenu) {
    btnBackToMenu.addEventListener("click", () => {
      showScreen("main-menu");
    });
  }

  // 7. Lắng nghe Session ban đầu (Tự động đăng nhập nếu có duy trì đăng nhập)
  initAuthListener((profile) => {
    if (profile) {
      updateMainMenuUserProfile(profile);
      // Nếu đang ở màn hình auth thì chuyển vào main-menu
      const screenAuth = document.getElementById("screen-auth");
      if (screenAuth && !screenAuth.classList.contains("hidden")) {
        showScreen("main-menu");
        announceToScreenReader(`Chào mừng Bếp Trưởng ${profile.displayName} đã trở lại YumCraft Kitchen.`);
      }
    } else {
      // Chưa đăng nhập: hiển thị màn hình Auth
      showScreen("auth");
      showAuthView("login");
    }
  });

  // Hỗ trợ phím tắt toàn cục cho Menu Chính
  window.addEventListener("keydown", (e) => {
    const screenMainMenu = document.getElementById("screen-main-menu");
    const isMainMenuVisible = screenMainMenu && !screenMainMenu.classList.contains("hidden");

    if (isMainMenuVisible) {
      // Phím H: Mở hướng dẫn
      if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (modalHelp && !modalHelp.open && modalSettings && !modalSettings.open) {
          e.preventDefault();
          modalHelp.showModal();
        }
      }
    }
  });
}

// Gắn các hàm toàn cục để tương thích hệ thống
window.showScreen = showScreen;
window.showAuthView = showAuthView;

// Khởi chạy khi DOM đã sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMainMenuController);
} else {
  initMainMenuController();
}
