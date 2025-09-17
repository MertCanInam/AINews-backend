const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const jwtUtils = require("../utils/jwtUtils");
const userLoginLogsRepository = require("../repositories/userLoginLogsRepository");

// Kullanıcı Kayıt (Register)
const register = async (email, password, first_name, last_name) => {
  const existingUser = await userRepository.getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
 const role_id = 2;

  
  await userRepository.createUser({
    email,
    password: hashedPassword,
    first_name: first_name,
    last_name: last_name,
   role_id
  });

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
