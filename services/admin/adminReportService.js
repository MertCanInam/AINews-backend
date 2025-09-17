const { Sequelize } = require("sequelize");
const { Post, Source, User, Ticket } = require("../../models");

// 1. Günlük çekilen haber sayısı trendi
async function getDailyPostTrends(limit = 7) {
  return await Post.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("Post.created_at")), "date"],
      [Sequelize.fn("COUNT", Sequelize.col("Post.id")), "count"],
    ],
    group: [Sequelize.fn("DATE", Sequelize.col("Post.created_at"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("Post.created_at")), "DESC"]],
    limit,
    raw: true,
  });
}

// 2. Kaynak başına haber dağılımı
async function getPostDistributionBySource() {
  return await Post.findAll({
    attributes: [
      "source_id",
      [Sequelize.fn("COUNT", Sequelize.col("Post.id")), "count"], // ✅ düzeltildi
    ],
    include: [{ model: Source, attributes: ["id", "name"] }],
    group: ["Post.source_id", "Source.id"],
    raw: true,
  });
}

// 3. Kullanıcı artış grafiği
async function getMonthlyUserGrowth() {
  return await User.findAll({
    attributes: [
      [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("User.created_at")), "month"],
      [Sequelize.fn("COUNT", Sequelize.col("User.user_id")), "count"],
    ],
    group: [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("User.created_at"))],
    order: [[Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("User.created_at")), "ASC"]],
    raw: true,
  });
}

// 4. En çok ticket açan kullanıcılar
async function getTopTicketCreators(limit = 5) {
  return await Ticket.findAll({
    attributes: [
      "user_id",
      [Sequelize.fn("COUNT", Sequelize.col("Ticket.id")), "ticketCount"],
    ],
    include: [{ model: User, attributes: ["user_id", "first_name", "last_name", "email"] }],
    group: ["Ticket.user_id", "User.user_id"],
    order: [[Sequelize.literal('"ticketCount"'), "DESC"]], // ✅ düzeltildi
    limit,
    raw: true,
  });
}

// 5. En aktif kullanıcılar
async function getMostActiveUsers(limit = 5) {
  return await User.findAll({
    attributes: [
      "user_id",
      "first_name",
      "last_name",
      "email",
      [
        Sequelize.literal(`(
          (SELECT COUNT(*) FROM saved_posts sp WHERE sp.user_id = "User".user_id) +
          (SELECT COUNT(*) FROM tickets t WHERE t.user_id = "User".user_id)
        )`),
        "activityScore",
      ],
    ],
    order: [[Sequelize.literal('"activityScore"'), "DESC"]], // ✅ düzeltildi
    limit,
    raw: true,
  });
}

module.exports = {
  getDailyPostTrends,
  getPostDistributionBySource,
  getMonthlyUserGrowth,
  getTopTicketCreators,
  getMostActiveUsers,
};
