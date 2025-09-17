const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SavedPost = sequelize.define("SavedPost", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  post_id: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "saved_posts",
  timestamps: false
});

module.exports = SavedPost;
