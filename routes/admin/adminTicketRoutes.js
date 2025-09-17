const express = require("express");
const router = express.Router();
const adminTicketController = require("../../controllers/admin/adminTicketController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

//  sadece admin (role_id = 1) erişebilir
router.use(authMiddleware, roleMiddleware([1]));

// Tüm ticketlar
router.get("/", adminTicketController.getAllTickets);

// Ticket durumunu güncelle
router.patch("/:id/status", adminTicketController.updateTicketStatus);

// Ticket sil
router.delete("/:id", adminTicketController.deleteTicket);

module.exports = router;
