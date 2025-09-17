// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public (gerekirse buraya liste koyabilirsin ama biz auth zorunlu yapıyoruz)

// Kullanıcı kendi ticketlarını görür
router.get("/tickets/my", authMiddleware, ticketController.getUserTickets);

// Admin veya kullanıcı tüm ticketları görür (kısıtlamayı controller/middleware’de yap)
router.get("/tickets", authMiddleware, ticketController.getAllTickets);

// Tek ticket detay
router.get("/tickets/:id", authMiddleware, ticketController.getTicketById);

// Kullanıcı yeni ticket oluşturur
router.post("/tickets", authMiddleware, ticketController.createTicket);

// Admin ticket durumunu günceller
router.put("/tickets/:id/status", authMiddleware, ticketController.updateTicketStatus);

// Admin ticket siler
router.delete("/tickets/:id", authMiddleware, ticketController.deleteTicket);

module.exports = router;
