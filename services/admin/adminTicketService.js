const ticketRepository = require("../../repositories/ticketRepository");

// 1. Tüm ticketları getir (pagination + paketleme)
async function getAllTickets(page = 1, limit = 10) {
  const allTickets = await ticketRepository.getAllTickets(); // artık User include'lu geliyor
  const offset = (page - 1) * limit;

  const tickets = allTickets.slice(offset, offset + limit);

  return {
    total: allTickets.length,
    tickets,
    currentPage: page,
    totalPages: Math.ceil(allTickets.length / limit),
  };
}

// 2. Ticket durumunu güncelle
async function updateTicketStatus(id, status) {
  return await ticketRepository.updateTicket(id, { status });
}

// 3. Ticket sil
async function deleteTicket(id) {
  return await ticketRepository.deleteTicket(id);
}

module.exports = {
  getAllTickets,
  updateTicketStatus,
  deleteTicket,
};
