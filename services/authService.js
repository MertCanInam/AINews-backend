const supabase = require("../supabaseClient"); // Supabase admin istemcisini import et
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const jwtUtils = require("../utils/jwtUtils");
const userLoginLogsRepository = require("../repositories/userLoginLogsRepository");

// Kullanıcı Kayıt (Register) - GÜNCELLENMİŞ HALİ
const register = async (email, password, first_name, last_name) => {
  const existingUser = await userRepository.getUserByEmail(email);
  if (existingUser) throw new Error("Email is already in use");

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) throw new Error(authError.message);

  const authUserId = authData.user.id;

  // Trigger'ın çalışmasını bekleyelim
  await new Promise(resolve => setTimeout(resolve, 500));

  // Sadece ad-soyad güncelle
  const { error: updateError } = await supabase
    .from('users')
    .update({ first_name, last_name })
    .eq('auth_user_id', authUserId);

  if (updateError) console.error("Profil güncellenirken hata:", updateError.message);

  return { success: true, message: "User registered successfully" };
};


// Kullanıcı Giriş (Login) - YENİ VE DOĞRU HALİ
const login = async (email, password) => {
  // 1. Kimlik doğrulama işini DOĞRUDAN SUPABASE'E YAPTIRIYORUZ
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (authError) {
    // Supabase "Invalid login credentials" gibi bir hata dönerse, bunu direkt kullanıcıya iletiyoruz.
    return { success: false, message: authError.message };
  }

  // 2. Giriş başarılı! Şimdi Supabase'den gelen auth user ID'si ile KENDİ veritabanımızdan
  // kullanıcının profil bilgilerini (rol, isim, soyisim vb.) çekmeliyiz.
  const user = await userRepository.getUserByAuthId(authData.user.id); // Bu fonksiyonu repoya ekleyeceğiz!
  if (!user) {
    // Bu durum normalde olmamalı (trigger çalıştığı için), ama bir güvenlik kontrolü olarak ekleyelim.
    return { success: false, message: "User profile not found in public users table." };
  }
  
  // 3. Her şey yolunda. Artık KENDİ JWT tokenlarımızı oluşturabiliriz.
  const accessToken = jwtUtils.generateAccessToken(user);
  const refreshToken = jwtUtils.generateRefreshToken(user);

  // 4. Kendi refresh token'ımızı veritabanımıza kaydediyoruz.
  await userRepository.updateRefreshToken(user.user_id, refreshToken);
  await userLoginLogsRepository.createLog(user.user_id, "login");

  // Not: updatedUser'a gerek yok, zaten 'user' objesi en güncel halini içeriyor.
  return { success: true, user, accessToken, refreshToken };
};
// Kullanıcı Çıkış (Logout)
const logout = async (user_id) => {
  await userRepository.clearRefreshToken(user_id);
  await userLoginLogsRepository.createLog(user_id, "logout");
console.log("Logout kaydı atıldı", user_id);


  return { success: true, message: "User logged out successfully" };
};

// Token Yenileme (Refresh Token)
const refreshAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;
  try {
    decoded = jwtUtils.verifyToken(oldRefreshToken);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await userRepository.getUserById(decoded.user_id);
  if (!user || user.refresh_token !== oldRefreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwtUtils.generateAccessToken(user);
  const newRefreshToken = jwtUtils.generateRefreshToken(user);

  await userRepository.updateRefreshToken(user.user_id, newRefreshToken);

  return {
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Kullanıcı doğrulama işlemi
const verifyUser = async (token) => {
  const decoded = jwtUtils.verifyToken(token);
  const user = await userRepository.getUserById(decoded.user_id);
  if (!user) {
    throw new Error("User not found");
  }

  return user.toJSON();
};

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  verifyUser,
};
