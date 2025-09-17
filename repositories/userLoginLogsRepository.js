const UserLoginLog = require("../models/userLoginLogs");
const { Op } = require("sequelize");

// Yeni log kaydı oluştur (login/logout)
async function createLog(user_id, action) {
  return await UserLoginLog.create({
    user_id,
    action,
  });
}

// Belirli kullanıcının tüm login/logout geçmişini getir
async function getUserLoginHistory(user_id, limit = 50) {
  return await UserLoginLog.findAll({
    where: { user_id },
    order: [["created_at", "DESC"]],
    limit,
  });
}

// Belirli kullanıcının en son girişini getir
async function getUserLastLogin(user_id) {
  return await UserLoginLog.findOne({
    where: { user_id, action: "login" },
    order: [["created_at", "DESC"]],
  });
}

// Belirli tarih aralığında tüm login/logout loglarını getir (raporlama için)
async function getLogsByDateRange(startDate, endDate) {
  return await UserLoginLog.findAll({
    where: {
      created_at: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["created_at", "DESC"]],
  });
}


module.exports = {
  createLog,
  getUserLoginHistory,
  getUserLastLogin,
  getLogsByDateRange,
  
};
