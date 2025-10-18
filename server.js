const app = require('./app');
// sequelize'ı config dosyasından veya app.js'e eklediğimiz yerden alalım
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

// 1. ADIM: Önce sunucuyu başlat!
// Bu, Fly.io'ya "Ben ayaktayım!" mesajını hemen verir.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // 2. ADIM: Sunucu başladıktan sonra ayrı bir şekilde veritabanına bağlanmayı dene.
  const connectToDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established.');

      // 3. ADIM: Bağlantı başarılıysa scheduler'ı başlat.
      require('./jobs/scheduler');
    } catch (error) {
      console.error('❌ Initial database connection error:', error);
      // Not: Burada process.exit(1) yapmıyoruz. Sunucu çalışmaya devam etsin.
      // 5 saniye sonra tekrar denemesi için bir mantık eklenebilir.
      setTimeout(connectToDatabase, 5000); // 5 saniye sonra tekrar dene
    }
  };

  connectToDatabase();
});