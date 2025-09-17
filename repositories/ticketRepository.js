// repositories/ticketRepository.js
const { Ticket, User } = require("../models");
const sequelize = require("../config/database");

// Yeni ticket oluştur
async function createTicket(data) {
  return await Ticket.create(data);
}

// Tüm ticketları getir (admin için, user bilgisi dahil)
async function getAllTickets() {
  return await Ticket.findAll({
    include: [
      { model: User, attributes: ["user_id", "first_name", "last_name", "email"] }
    ],
    order: [["created_at", "DESC"]],
  });
}

// Kullanıcıya ait ticketlar (özel sıralı)
async function getUserTicketsOrdered(user_id) {
  return await Ticket.findAll({
    where: { user_id },
    order: [
      [
        sequelize.literal(`CASE 
          WHEN status = 'open' THEN 1 
          WHEN status = 'read' THEN 2 
          WHEN status = 'closed' THEN 3 
        END`), 
        "ASC"
      ],
      ["created_at", "DESC"],
    ],
  });
}

// Tek ticket
async function getTicketById(id) {
  return await Ticket.findByPk(id);
}

// Ticket güncelle (ör: status değiştir)
async function updateTicket(id, updates) {
  const ticket = await Ticket.findByPk(id);
  if (!ticket) return null;
  return await ticket.update(updates);
}

// Ticket sil (sadece admin)
async function deleteTicket(id) {
  return await Ticket.destroy({ where: { id } });
}

const countTickets = async () => {
  return await Ticket.count();
};

const countTicketsByStatus = async () => {
  const results = await Ticket.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("status")), "count"]
    ],
    group: ["status"],
  });
  return results;
};

module.exports = {
  createTicket,
  getAllTickets,
  getUserTicketsOrdered,
  getTicketById,
  updateTicket,
  deleteTicket,
  countTickets,
  countTicketsByStatus
};
