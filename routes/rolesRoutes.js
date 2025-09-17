const express = require('express');
const router = express.Router();
const controller = require('../controllers/rolesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Roller çoğunlukla admin/maintainer içindir → korumalı yapıyoruz
router.get('/roles', authMiddleware, controller.getAllRoles);
router.get('/roles/:id', authMiddleware, controller.getRoleById);

module.exports = router;
