const supabase = require("../supabaseClient"); // Supabase admin istemcisini import et
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const jwtUtils = require("../utils/jwtUtils");
const userLoginLogsRepository = require("../repositories/userLoginLogsRepository");

// Kullanıcı Kayıt (Register) - GÜNCELLENMİŞ HALİ
const register = async (email, password, first_name, last_name) => {
  // 1. Kullanıcının bizim 'users' tablomuzda olup olmadığını yine de kontrol edebiliriz (isteğe bağlı)
  const existingUser = await userRepository.getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  // 2. Şifre şifreleme ve kullanıcı oluşturma işini DOĞRUDAN SUPABASE'E YAPTIRIYORUZ
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Kullanıcı direkt onaylanmış olsun
  });

  if (authError) {
    // Eğer Supabase tarafında bir hata oluşursa (örn: email zaten kayıtlı), hatayı fırlat
    throw new Error(authError.message);
  }

  // 3. SİHİRLİ TETİKLEYİCİ BU AŞAMADA ÇALIŞTI!
  // Supabase, kullanıcıyı 'auth.users'a ekledi ve bizim trigger'ımız da 'public.users' tablosuna
  // 'auth_user_id' ve 'email'i dolu bir satır ekledi.

  // 4. (İsteğe Bağlı ama Önerilir) Tetikleyicinin oluşturduğu satırı ad/soyad ile güncelleyelim.
  const { error: updateError } = await supabase
    .from('users') // Senin 'users' tablon
    .update({ 
        first_name: first_name, 
        last_name: last_name,
        role_id: 2 // Rol ID'sini burada atayabilirsin
    })
    .eq('auth_user_id', authData.user.id); // UUID ile eşleştirerek doğru kullanıcıyı buluyoruz

  if (updateError) {
      // Eğer güncelleme sırasında hata olursa, bunu log'lamak iyi bir pratik.
      console.error("Kullanıcı profili güncellenirken hata oluştu:", updateError.message);
  }

  return { success: true, message: "User registered successfully" };
};
// Kullanıcı Giriş (Login)
const login = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid password" };
  }
  
 

  const accessToken = jwtUtils.generateAccessToken(user);
  const refreshToken = jwtUtils.generateRefreshToken(user);

  await userRepository.updateRefreshToken(user.user_id, refreshToken);
  const updatedUser = await userRepository.getUserById(user.user_id);

 await userLoginLogsRepository.createLog(user.user_id, "login");

 
   return { success: true, user: updatedUser, accessToken, refreshToken };
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
