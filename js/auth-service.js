/**
 * YUMCRAFT KITCHEN — AUTH & USER SERVICE
 * Quản lý Đăng Ký, Đăng Nhập, Đăng Xuất, Persistence & Đồng Bộ Hồ Sơ Người Chơi (Firestore)
 * Hỗ trợ cả Firebase Thực Tế & Chế Độ Giả Lập Cục Bộ (Mock Mode) khi chưa điền API Key.
 */

import {
  auth,
  db,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "./firebase-config.js";

// Khóa lưu trữ cục bộ cho Mock Mode
const MOCK_USERS_KEY = "yumcraft_mock_users_db";
const MOCK_SESSION_KEY = "yumcraft_mock_current_session";
const ACTIVE_PROFILE_KEY = "yumcraft_active_chef_profile";

/**
 * Lấy danh sách tài khoản Mock từ localStorage
 */
function getMockUsers() {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Lưu danh sách tài khoản Mock
 */
function saveMockUsers(users) {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Lỗi lưu mock users:", e);
  }
}

/**
 * Lưu profile đang hoạt động vào cache
 */
export function setActiveProfileCache(profile) {
  try {
    if (profile) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  } catch (e) {
    console.warn("Không thể lưu cache profile:", e);
  }
}

/**
 * Đọc profile từ cache
 */
export function getActiveProfileCache() {
  try {
    const raw = localStorage.getItem(ACTIVE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Kiểm tra tính hợp lệ của Tên người dùng (Username)
 * Quy tắc: Không dấu, không khoảng cách, 3 - 30 ký tự, chỉ gồm a-z, A-Z, 0-9, dấu gạch dưới, gạch ngang, chấm
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return { valid: false, message: "Vui lòng nhập tên người dùng." };
  }
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { valid: false, message: "Tên người dùng phải có tối thiểu 3 ký tự." };
  }
  if (trimmed.length > 30) {
    return { valid: false, message: "Tên người dùng không được vượt quá 30 ký tự." };
  }
  const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return { 
      valid: false, 
      message: "Tên người dùng không được có dấu hoặc dấu cách, chỉ gồm chữ cái, chữ số và các ký tự: _ . -" 
    };
  }
  return { valid: true, sanitized: trimmed };
}

/**
 * Kiểm tra tính hợp lệ của Tên hiển thị (Display Name)
 */
export function validateDisplayName(displayName) {
  if (!displayName || typeof displayName !== "string") {
    return { valid: false, message: "Vui lòng nhập tên hiển thị." };
  }
  const trimmed = displayName.trim();
  if (trimmed.length < 2) {
    return { valid: false, message: "Tên hiển thị phải có tối thiểu 2 ký tự." };
  }
  if (trimmed.length > 50) {
    return { valid: false, message: "Tên hiển thị không được vượt quá 50 ký tự." };
  }
  return { valid: true, sanitized: trimmed };
}

/**
 * Kiểm tra tính hợp lệ của Tên nhà bếp (Kitchen Name)
 */
export function validateKitchenName(kitchenName) {
  if (!kitchenName || typeof kitchenName !== "string") {
    return { valid: false, message: "Vui lòng nhập tên nhà bếp." };
  }
  const trimmed = kitchenName.trim();
  if (trimmed.length < 2) {
    return { valid: false, message: "Tên nhà bếp phải có tối thiểu 2 ký tự." };
  }
  if (trimmed.length > 60) {
    return { valid: false, message: "Tên nhà bếp không được vượt quá 60 ký tự." };
  }
  return { valid: true, sanitized: trimmed };
}

/**
 * Kiểm tra tính hợp lệ của Email
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Vui lòng nhập địa chỉ email." };
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: "Địa chỉ email không đúng định dạng (ví dụ: chef@example.com)." };
  }
  return { valid: true, sanitized: trimmed };
}

/**
 * Kiểm tra tính hợp lệ của Mật khẩu
 */
export function validatePassword(password, confirmPassword = null) {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Vui lòng nhập mật khẩu." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Mật khẩu phải có tối thiểu 8 ký tự." };
  }
  if (confirmPassword !== null && password !== confirmPassword) {
    return { valid: false, message: "Mật khẩu nhập lại không trùng khớp." };
  }
  return { valid: true };
}

/**
 * ĐĂNG KÝ TÀI KHOẢN MỚI
 */
export async function registerUser({
  username,
  displayName,
  email,
  password,
  confirmPassword,
  kitchenName,
  rememberMe = true
}) {
  // 1. Kiểm tra validation phía client
  const validUsername = validateUsername(username);
  if (!validUsername.valid) throw new Error(validUsername.message);

  const validDisplayName = validateDisplayName(displayName);
  if (!validDisplayName.valid) throw new Error(validDisplayName.message);

  const validEmail = validateEmail(email);
  if (!validEmail.valid) throw new Error(validEmail.message);

  const validPass = validatePassword(password, confirmPassword);
  if (!validPass.valid) throw new Error(validPass.message);

  const validKitchen = validateKitchenName(kitchenName);
  if (!validKitchen.valid) throw new Error(validKitchen.message);

  const cleanUsername = validUsername.sanitized;
  const usernameLower = cleanUsername.toLowerCase();
  const cleanDisplayName = validDisplayName.sanitized;
  const cleanKitchenName = validKitchen.sanitized;
  const cleanEmail = validEmail.sanitized;

  // 2. Chế độ Firebase Thực Tế
  if (isFirebaseConfigured() && auth && db) {
    try {
      // Thiết lập persistence trước khi tạo tài khoản
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      // Kiểm tra username đã tồn tại chưa trên Firestore
      const usernameDocRef = doc(db, "usernames", usernameLower);
      const usernameSnap = await getDoc(usernameDocRef);
      if (usernameSnap.exists()) {
        throw new Error(`Tên người dùng '${cleanUsername}' đã có người sử dụng. Vui lòng chọn tên khác.`);
      }

      // Tạo tài khoản Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Cập nhật displayName cho user Auth
      await updateProfile(user, { displayName: cleanDisplayName });

      // Lưu chi tiết profile vào Firestore
      const userProfile = {
        uid: user.uid,
        username: cleanUsername,
        usernameLower: usernameLower,
        displayName: cleanDisplayName,
        kitchenName: cleanKitchenName,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      await setDoc(usernameDocRef, {
        uid: user.uid,
        email: cleanEmail,
        username: cleanUsername
      });

      setActiveProfileCache(userProfile);
      return userProfile;
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        throw new Error("Địa chỉ email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Địa chỉ email không hợp lệ.");
      } else if (err.code === "auth/weak-password") {
        throw new Error("Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn (tối thiểu 8 ký tự).");
      }
      throw err;
    }
  }

  // 3. Chế độ Giả Lập Cục Bộ (Mock Mode)
  const mockUsers = getMockUsers();
  if (mockUsers.some(u => u.usernameLower === usernameLower)) {
    throw new Error(`Tên người dùng '${cleanUsername}' đã có người sử dụng. Vui lòng chọn tên khác.`);
  }
  if (mockUsers.some(u => u.email.toLowerCase() === cleanEmail.toLowerCase())) {
    throw new Error("Địa chỉ email này đã được đăng ký trong hệ thống.");
  }

  const newMockUser = {
    uid: "mock_user_" + Date.now(),
    username: cleanUsername,
    usernameLower: usernameLower,
    displayName: cleanDisplayName,
    kitchenName: cleanKitchenName,
    email: cleanEmail,
    password: password, // Chỉ dùng trong mock mode nội bộ
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  mockUsers.push(newMockUser);
  saveMockUsers(mockUsers);

  if (rememberMe) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ uid: newMockUser.uid, rememberMe: true }));
  } else {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ uid: newMockUser.uid, rememberMe: false }));
  }

  const profile = { ...newMockUser };
  delete profile.password;
  setActiveProfileCache(profile);
  return profile;
}

/**
 * ĐĂNG NHẬP
 * Hỗ trợ đăng nhập bằng Email HOẶC Username
 */
export async function loginUser({
  identifier,
  password,
  rememberMe = true
}) {
  if (!identifier || !identifier.trim()) {
    throw new Error("Vui lòng nhập Email hoặc Tên người dùng.");
  }
  if (!password) {
    throw new Error("Vui lòng nhập mật khẩu.");
  }

  const cleanId = identifier.trim();
  const isEmail = cleanId.includes("@");

  // 1. Chế độ Firebase Thực Tế
  if (isFirebaseConfigured() && auth && db) {
    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      let targetEmail = cleanId;

      // Nếu người chơi nhập username, tra cứu email trong Firestore
      if (!isEmail) {
        const usernameSnap = await getDoc(doc(db, "usernames", cleanId.toLowerCase()));
        if (!usernameSnap.exists()) {
          throw new Error(`Tên người dùng '${cleanId}' không tồn tại.`);
        }
        targetEmail = usernameSnap.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
      const user = userCredential.user;

      // Lấy profile từ Firestore
      const userDocSnap = await getDoc(doc(db, "users", user.uid));
      let userProfile = null;
      if (userDocSnap.exists()) {
        userProfile = userDocSnap.data();
        // Cập nhật lastLoginAt
        await setDoc(doc(db, "users", user.uid), { lastLoginAt: new Date().toISOString() }, { merge: true });
      } else {
        userProfile = {
          uid: user.uid,
          username: user.email.split("@")[0],
          displayName: user.displayName || user.email.split("@")[0],
          kitchenName: "Nhà Bếp " + (user.displayName || "Sáng Tạo"),
          email: user.email,
          lastLoginAt: new Date().toISOString()
        };
      }

      setActiveProfileCache(userProfile);
      return userProfile;
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        throw new Error("Thông tin đăng nhập hoặc mật khẩu không chính xác.");
      } else if (err.code === "auth/too-many-requests") {
        throw new Error("Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.");
      }
      throw err;
    }
  }

  // 2. Chế độ Mock Mode
  const mockUsers = getMockUsers();
  const user = mockUsers.find(u => {
    if (isEmail) {
      return u.email.toLowerCase() === cleanId.toLowerCase();
    } else {
      return u.usernameLower === cleanId.toLowerCase();
    }
  });

  if (!user || user.password !== password) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
  }

  user.lastLoginAt = new Date().toISOString();
  saveMockUsers(mockUsers);

  if (rememberMe) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ uid: user.uid, rememberMe: true }));
  } else {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ uid: user.uid, rememberMe: false }));
    localStorage.removeItem(MOCK_SESSION_KEY);
  }

  const profile = { ...user };
  delete profile.password;
  setActiveProfileCache(profile);
  return profile;
}

/**
 * ĐĂNG XUẤT
 */
export async function logoutUser() {
  setActiveProfileCache(null);
  localStorage.removeItem(MOCK_SESSION_KEY);
  sessionStorage.removeItem(MOCK_SESSION_KEY);

  if (isFirebaseConfigured() && auth) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn("Lỗi khi đăng xuất Firebase:", e);
    }
  }
  return true;
}

/**
 * LẮNG NGHE & KIỂM TRA TRẠNG THÁI PHIÊN ĐĂNG NHẬP (SESSION RESTORATION)
 */
export function initAuthListener(onAuthChangedCallback) {
  // 1. Chế độ Firebase Thực Tế
  if (isFirebaseConfigured() && auth && db) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            const profile = userDocSnap.data();
            setActiveProfileCache(profile);
            onAuthChangedCallback(profile);
            return;
          }
        } catch (e) {
          console.warn("Lỗi khi tải profile Firestore:", e);
        }
        // Fallback profile nếu chưa load được Firestore
        const fallbackProfile = {
          uid: user.uid,
          username: user.email ? user.email.split("@")[0] : "chef",
          displayName: user.displayName || "Bếp Trưởng",
          kitchenName: "Nhà Bếp " + (user.displayName || "Sáng Tạo"),
          email: user.email || ""
        };
        setActiveProfileCache(fallbackProfile);
        onAuthChangedCallback(fallbackProfile);
      } else {
        setActiveProfileCache(null);
        onAuthChangedCallback(null);
      }
    });
  }

  // 2. Chế độ Mock Mode
  const checkMockSession = () => {
    let sessionRaw = localStorage.getItem(MOCK_SESSION_KEY);
    if (!sessionRaw) {
      sessionRaw = sessionStorage.getItem(MOCK_SESSION_KEY);
    }
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        const mockUsers = getMockUsers();
        const found = mockUsers.find(u => u.uid === session.uid);
        if (found) {
          const profile = { ...found };
          delete profile.password;
          setActiveProfileCache(profile);
          onAuthChangedCallback(profile);
          return;
        }
      } catch (e) {
        console.warn("Lỗi đọc mock session:", e);
      }
    }
    setActiveProfileCache(null);
    onAuthChangedCallback(null);
  };

  // Khởi chạy kiểm tra ngay
  setTimeout(checkMockSession, 50);

  // Trả về hàm dọn dẹp
  return () => {};
}
