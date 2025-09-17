const userRepository = require("../../repositories/userRepository");
const { hashPassword, comparePasswords } = require("../../utils/bcrypt");

// 1. Admin kendi profilini görsün
async function getProfile(adminId) {
  const user = await userRepository.getUserById(adminId);
  if (!user) throw new Error("Admin bulunamadı");

  // Hassas alanları çıkartıyoruz
  const { password, refresh_token, ...safeUser } = user.get({ plain: true });
  return safeUser;
}

// 2. Profil bilgilerini güncelle
async function updateProfile(adminId, data) {
  const allowedFields = ["first_name", "last_name", "email"];
  const updateData = {};

  for (const key of allowedFields) {
    if (data[key]) updateData[key] = data[key];
  }

  await userRepository.updateUser(adminId, updateData);
  return { message: "Profil güncellendi" };
}

// 3. Şifre değiştirme
async function changePassword(adminId, oldPassword, newPassword) {
  const user = await userRepository.getUserById(adminId);
  if (!user) throw new Error("Admin bulunamadı");

  const isMatch = await comparePasswords(oldPassword, user.password);
  if (!isMatch) throw new Error("Mevcut şifre yanlış");

  const hashed = await hashPassword(newPassword);
  await userRepository.updateUser(adminId, { password: hashed });

  return { message: "Şifre başarıyla güncellendi" };
}

// 4. Yeni admin ekleme
async function createAdmin(data) {
  const hashedPassword = await hashPassword(data.password);

  const newAdmin = await userRepository.createUser({
    email: data.email,
    password: hashedPassword,
    first_name: data.first_name,
    last_name: data.last_name,
    role_id: 1, // admin rolü
  });

  // Hassas alanları çıkartıyoruz
  const { password, refresh_token, ...safeUser } = newAdmin.get({ plain: true });
  return safeUser;
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  createAdmin,
};
