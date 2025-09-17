const dashboardService = require("../../services/admin/dashboardService");

async function getStats(req, res) {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard verileri alınırken hata oluştu" });
  }
}

module.exports = { getStats };
