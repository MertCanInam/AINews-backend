const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(500), allowNull: false },
    content_raw: { type: DataTypes.TEXT, allowNull: true },   // tam içerik
    content_clean: { type: DataTypes.TEXT, allowNull: true }, // temizlenmiş içerik
    summary: { type: DataTypes.TEXT, allowNull: true },       // özet

    content: { type: DataTypes.TEXT, allowNull: true },       // (opsiyonel legacy alan)

    source_url: { type: DataTypes.STRING(1000), allowNull: true, unique: true }, // haber linki
    image_url: { type: DataTypes.STRING(1000), allowNull: true },
    source_id: { type: DataTypes.INTEGER, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },

    fingerprint: { type: DataTypes.STRING(64), allowNull: false, unique: true },

    status: {
      type: DataTypes.ENUM(
        "fetched",          // liste sayfasından alındı
        "pending_summary",  // içerik var, özet bekliyor
        "summarized",       // özet tamamlandı
        "published",        // yayına alındı / mail gönderildi
        "error"             // hata
      ),
      defaultValue: "fetched",
    },

    lang: { type: DataTypes.STRING(8), allowNull: true },
    published_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "posts",
    timestamps: false,
  }
);

module.exports = Post;
