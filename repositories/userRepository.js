const User = require("../models/users");
const bcrypt = require("../utils/bcrypt");

const createUser = async (data) => {
  return await User.create({
    email: data.email,
    password: data.password,
    first_name: data.first_name,
    last_name: data.last_name,
    role_id: data.role_id
  });
};

const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["user_id", "email", "first_name", "last_name", "role_id", "created_at"],
  });
};

const getUserById = async (id, opts = {}) => {
  return await User.findByPk(id, opts);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateUser = async (id, data) => {
  return await User.update(data, { where: { user_id: id } });
};

// ✅ yeni: sadece şifreyi güncelle
const updatePassword = async (id, hashedPassword) => {
  return await User.update(
    { password: hashedPassword },
    { where: { user_id: id } }
  );
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { user_id: id } });
};

const updateRefreshToken = async (user_id, token) => {
  return await User.update({ refresh_token: token }, { where: { user_id } });
};

const clearRefreshToken = async (user_id) => {
  return await User.update({ refresh_token: null }, { where: { user_id } });
};

const clearAllRefreshTokens = async () => {
  return await User.update({ refresh_token: null }, { where: {} });
};

const countUsers = async () => {
  return await User.count();
};

// yeni mail isteği kaydet
const setPendingEmail = async (user_id, pending_email, token) => {
  return await User.update(
    { pending_email, email_token: token },
    { where: { user_id } }
  );
};

// token'ı bul, maili kalıcı değiştir
const consumeEmailToken = async (token) => {
  const user = await User.findOne({ where: { email_token: token } });
  if (!user) return null;

  user.email = user.pending_email;
  user.pending_email = null;
  user.email_token = null;
  await user.save();
  return user;
};

// Supabase Auth ID'sine göre kullanıcıyı getiren fonksiyon
const getUserByAuthId = async (authId) => {
  return await User.findOne({ where: { auth_user_id: authId } });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updatePassword, 
  deleteUser,
  updateRefreshToken,
  clearRefreshToken,
  clearAllRefreshTokens,
  countUsers,
  setPendingEmail,
  consumeEmailToken,
  getUserByAuthId
};
