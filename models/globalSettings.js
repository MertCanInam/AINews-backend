const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GlobalSetting = sequelize.define(
  'GlobalSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maintenance_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'global_settings',
    timestamps: false,
  }
);

module.exports = GlobalSetting;
