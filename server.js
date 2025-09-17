const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log(' Veritabanı ile bağlantı kuruldu.');
  app.listen(PORT, () => {
    console.log(` Sunucu ${PORT} portunda çalışıyor...`);
  });
}).catch((err) => {
  console.error(' Veritabanı bağlantı hatası:', err);
});
