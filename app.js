// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser'); 
const { sequelize } = require('./models'); // Model dosyanızın yolu farklıysa burayı düzenleyin

const app = express();

/* ========== Middlewares ========== */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Eğer origin yoksa (Postman, curl gibi) veya izinli listede varsa -> kabul et
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Reddet ama hata fırlatma, sadece izin verme
      console.warn("❌ CORS engellendi:", origin);
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

/* ========== Routes ========== */
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const globalSettingsRoutes = require('./routes/globalSettingsRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const postsRoutes = require('./routes/postsRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const userCategoriesRoutes = require('./routes/userCategoriesRoutes');
const sourcesRoutes = require('./routes/sourcesRoutes');
const aiRoutes = require("./routes/aiRoutes");
const savedPosts = require("./routes/savedPostsRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const dashboardRoutes = require('./routes/admin/dashboardRoutes');
const adminUserRoutes = require ('./routes/admin/adminUserRoutes');
const adminSourceRoutes = require('./routes/admin/adminSourceRoutes');
const adminPostRoutes = require('./routes/admin/adminPostRoutes');
const adminTicketRoutes = require('./routes/admin/adminTicketRoutes');
const adminSavedPostRoutes = require('./routes/admin/adminSavedPostRoutes');
const adminReportRoutes = require("./routes/admin/adminReportRoutes");
const adminProfileRoutes = require("./routes/admin/adminProfileRoutes");
const userRoutes = require("./routes/userRoutes");

app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', globalSettingsRoutes);
app.use('/api', notificationsRoutes);
app.use('/api', postsRoutes);
app.use('/api', rolesRoutes);
app.use('/api', settingsRoutes);
app.use('/api', userCategoriesRoutes);
app.use('/api',sourcesRoutes);
app.use("/api", aiRoutes);
app.use("/api", savedPosts);
app.use("/api",ticketRoutes);
app.use("/api/admin",dashboardRoutes);
app.use("/api/admin/users",adminUserRoutes);
app.use("/api/admin/sources",adminSourceRoutes);
app.use("/api/admin/posts",adminPostRoutes);
app.use("/api/admin/tickets",adminTicketRoutes);
app.use("/api/admin/saved-posts",adminSavedPostRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api",userRoutes);

/* ========== Healthcheck ========== */
app.get('/api/health', async (_req, res) => {
  try {
    // Veritabanına basit bir sorgu atarak bağlantıyı test et ve onu "uyandır"
    await sequelize.authenticate(); 
    
    // Her şey yolundaysa 200 dön
    res.status(200).json({
      ok: true,
      message: 'API ve Veritabanı bağlantısı aktif.',
      env: process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
    });

  } catch (error) {
    // Eğer veritabanı uyanamazsa veya bir sorun varsa, hata dön
    console.error('Health check veritabanı hatası:', error.message);
    res.status(503).json({ // 503 Service Unavailable daha doğru bir status kodu
      ok: false,
      message: 'API aktif fakat veritabanı bağlantısı kurulamadı.',
      error: error.message,
    });
  }
});

/* ========== 404 Handler ========== */
app.use((req, res, _next) => {
  return res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı.',
    path: req.originalUrl,
  });
});

/* ========== Global Error Handler ========== */
app.use((err, _req, res, _next) => {
  console.error('Global error:', err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Sunucu hatası.',
  });
});

module.exports = app;
