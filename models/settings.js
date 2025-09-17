const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  email_notifications_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  system_notifications_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  language: { type: DataTypes.STRING(10), defaultValue: 'tr' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'settings',
  timestamps: false,
});

module.exports = Setting;
