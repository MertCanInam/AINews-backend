const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCategory = sequelize.define('UserCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'user_categories',
  timestamps: false,
});

module.exports = UserCategory;
