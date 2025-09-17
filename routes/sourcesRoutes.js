// routes/sourcesRoutes.js
const express = require('express');
const router = express.Router();
const sourcesController = require('../controllers/sourcesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public
router.get('/sources', sourcesController.getAllSources);
router.get('/sources/active', sourcesController.getActiveSources);
router.get('/sources/:id', sourcesController.getSourceById);

// Admin/korumalı (istersen role check ekleyebilirsin)
router.post('/sources', authMiddleware, sourcesController.createSource);
router.put('/sources/:id', authMiddleware, sourcesController.updateSource);
router.delete('/sources/:id', authMiddleware, sourcesController.deleteSource);

module.exports = router;
