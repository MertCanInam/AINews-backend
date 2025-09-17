const ticketRepository = require("../repositories/ticketRepository");

// Kullanıcı yeni ticket açar
async function createTicket(user_id, title, description) {
  return await ticketRepository.createTicket({ user_id, title, description });
}

// Kullanıcı kendi ticketlarını sıralı çeker
async function getUserTickets(user_id) {
  return await ticketRepository.getUserTicketsOrdered(user_id);
}

// Admin tüm ticketları görebilir
async function getAllTickets(user) {
  if (user.role_id === 1) {
    // Normal kullanıcı tüm ticketları göremez
    throw new Error("Yetkisiz erişim");
  }
  return await ticketRepository.getAllTickets();
}

// Tek ticket detay
async function getTicketById(id, user) {
  const ticket = await ticketRepository.getTicketById(id);
  if (!ticket) return null;

  // Eğer normal kullanıcıysa, sadece kendi ticketını görebilsin
  if (user.role_id === 1 && ticket.user_id !== user.user_id) {
    throw new Error("Yetkisiz erişim");
  }

  return ticket;
}

// Ticket durumunu güncelle (sadece admin)
async function updateTicketStatus(id, status, user) {
  if (user.role_id === 1) {
    throw new Error("Sadece admin ticket durumunu değiştirebilir");
  }

  const ticket = await ticketRepository.getTicketById(id);
  if (!ticket) return null;

  return await ticketRepository.updateTicket(id, { status });
}

// Ticket sil (sadece admin)
async function deleteTicket(id, user) {
  if (user.role_id === 1) {
    throw new Error("Sadece admin ticket silebilir");
  }

  return await ticketRepository.deleteTicket(id);
}

module.exports = {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
};
