
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Source = sequelize.define('Source', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  type: { type: DataTypes.ENUM('rss','html'), allowNull: false, defaultValue: 'rss' },
  url: { type: DataTypes.TEXT, allowNull: false },          // RSS feed ya da site ana URL
  parser_config: { type: DataTypes.JSONB, allowNull: true }, // html için selector’lar vb.
  category_id: { type: DataTypes.INTEGER, allowNull: true },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'sources',
  timestamps: false,
});

module.exports = Source;
