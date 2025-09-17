const adminReportService = require("../../services/admin/adminReportService");

// 1. Günlük çekilen haber sayısı trendi
async function getDailyPostTrends(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 7;
    const data = await adminReportService.getDailyPostTrends(limit);
    res.json(data);
  } catch (err) {
    console.error("Admin getDailyPostTrends error:", err);
    res.status(500).json({ error: "Günlük haber trendi alınırken hata oluştu" });
  }
}

// 2. Kaynak başına haber dağılımı
async function getPostDistributionBySource(req, res) {
  try {
    const data = await adminReportService.getPostDistributionBySource();
    res.json(data);
  } catch (err) {
    console.error("Admin getPostDistributionBySource error:", err);
    res.status(500).json({ error: "Kaynak bazlı dağılım alınırken hata oluştu" });
  }
}

// 3. Kullanıcı artış grafiği
async function getMonthlyUserGrowth(req, res) {
  try {
    const data = await adminReportService.getMonthlyUserGrowth();
    res.json(data);
  } catch (err) {
    console.error("Admin getMonthlyUserGrowth error:", err);
    res.status(500).json({ error: "Kullanıcı artışı alınırken hata oluştu" });
  }
}

// 4. En çok ticket açan kullanıcılar
async function getTopTicketCreators(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const data = await adminReportService.getTopTicketCreators(limit);
    res.json(data);
  } catch (err) {
    console.error("Admin getTopTicketCreators error:", err);
    res.status(500).json({ error: "Ticket açan kullanıcılar alınırken hata oluştu" });
  }
}

// 5. En aktif kullanıcılar
async function getMostActiveUsers(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const data = await adminReportService.getMostActiveUsers(limit);
    res.json(data);
  } catch (err) {
    console.error("Admin getMostActiveUsers error:", err);
    res.status(500).json({ error: "En aktif kullanıcılar alınırken hata oluştu" });
  }
}

module.exports = {
  getDailyPostTrends,
  getPostDistributionBySource,
  getMonthlyUserGrowth,
  getTopTicketCreators,
  getMostActiveUsers,
};
