const adminTicketService = require("../../services/admin/adminTicketService");

// 1. Tüm ticketları getir
async function getAllTickets(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tickets = await adminTicketService.getAllTickets(page, limit);
    res.json(tickets);
  } catch (err) {
    console.error("Admin getAllTickets error:", err);
    res.status(500).json({ error: "Ticketlar alınırken hata oluştu" });
  }
}

// 2. Ticket durumunu güncelle
async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await adminTicketService.updateTicketStatus(id, status);
    res.json({ message: "Ticket durumu güncellendi" });
  } catch (err) {
    console.error("Admin updateTicketStatus error:", err);
    res.status(500).json({ error: "Ticket durumu güncellenirken hata oluştu" });
  }
}

// 3. Ticket sil
async function deleteTicket(req, res) {
  try {
    const { id } = req.params;
    await adminTicketService.deleteTicket(id);
    res.json({ message: "Ticket silindi" });
  } catch (err) {
    console.error("Admin deleteTicket error:", err);
    res.status(500).json({ error: "Ticket silinirken hata oluştu" });
  }
}

module.exports = {
  getAllTickets,
  updateTicketStatus,
  deleteTicket,
};
