// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token gerekli' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT doğrulama hatası:', error.message);
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
};

module.exports = authMiddleware;
