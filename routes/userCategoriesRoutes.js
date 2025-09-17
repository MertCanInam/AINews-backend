const express = require('express');
const router = express.Router();
const controller = require('../controllers/userCategoriesContoller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users/:user_id/categories', authMiddleware, controller.getUserCategories);
router.post('/users/:user_id/categories', authMiddleware, controller.setUserCategories);
router.delete('/users/:user_id/categories', authMiddleware, controller.clearUserCategories);

module.exports = router;
