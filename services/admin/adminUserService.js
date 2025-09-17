const userRepository = require("../../repositories/userRepository");
const savedPostsRepository = require("../../repositories/savedPostsRepository");
const ticketRepository = require("../../repositories/ticketRepository");
const userLoginLogsRepository = require("../../repositories/userLoginLogsRepository");
const { hashPassword } = require("../../utils/bcrypt"); 


// 1. Tüm kullanıcıları getir (opsiyonel filtreleme)
// 1. Tüm kullanıcıları getir (opsiyonel filtreleme)
async function getAllUsers(filters = {}) {
  const users = await userRepository.getAllUsers();

  // her user için son giriş tarihini al
 for (const u of users) {
  const lastLogin = await userLoginLogsRepository.getUserLastLogin(u.user_id);
  u.last_login = lastLogin ? lastLogin.created_at : null;  // artık çalışacak
}


  // filtre uygula
  if (filters.search) {
    const search = filters.search.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        (u.first_name && u.first_name.toLowerCase().includes(search)) ||
        (u.last_name && u.last_name.toLowerCase().includes(search))
    );
  }

  return users;
}



// 2. Yeni kullanıcı oluştur
async function createUser(data) {
  if (data.password) {
    data.password = await hashPassword(data.password); 
  }
  return await userRepository.createUser(data);
}
// 3. Kullanıcı rolünü güncelle
async function updateUserRole(userId, roleId) {
  return await userRepository.updateUser(userId, { role_id: roleId });
}

// 4. Kullanıcıyı sil
async function deleteUser(userId) {
  return await userRepository.deleteUser(userId);
}

// 5. Kullanıcı aktivitelerini getir
async function getUserActivity(userId) {
  const savedPosts = await savedPostsRepository.getUserSavedPosts(userId);
  const tickets = await ticketRepository.getUserTicketsOrdered(userId);

  const lastLogin = await userLoginLogsRepository.getUserLastLogin(userId);

  return {
    savedPostsCount: savedPosts.length,
    ticketsCount: tickets.length,
    lastLogin: lastLogin ? lastLogin.created_at : null, // ✅ düzelttim
  };
}


module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getUserActivity,
};
