const ticketService = require("../services/ticketService");

// Yeni ticket oluştur
async function createTicket(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Başlık ve açıklama zorunludur" });
    }

    const ticket = await ticketService.createTicket(req.user.user_id, title, description);
    res.status(201).json({ message: "Ticket başarıyla oluşturuldu", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Kullanıcının kendi ticketlarını getir (özel sıralı)
async function getUserTickets(req, res) {
  try {
    const tickets = await ticketService.getUserTickets(req.user.user_id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Admin tüm ticketları görür
async function getAllTickets(req, res) {
  try {
    const tickets = await ticketService.getAllTickets(req.user);
    res.json(tickets);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

// Tek ticket detay
async function getTicketById(req, res) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id, req.user);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket bulunamadı" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

// Ticket durumunu güncelle (admin)
async function updateTicketStatus(req, res) {
  try {
    const { status } = req.body;
    const ticket = await ticketService.updateTicketStatus(req.params.id, status, req.user);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket bulunamadı" });
    }

    res.json({ message: "Ticket durumu güncellendi", ticket });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

// Ticket sil (admin)
async function deleteTicket(req, res) {
  try {
    const result = await ticketService.deleteTicket(req.params.id, req.user);

    if (!result) {
      return res.status(404).json({ error: "Ticket bulunamadı" });
    }

    res.json({ message: "Ticket başarıyla silindi" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

module.exports = {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
};
