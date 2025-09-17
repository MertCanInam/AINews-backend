const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserLoginLog = sequelize.define("UserLoginLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.ENUM("login", "logout"),
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(45),
  },
  user_agent: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field:"created_at",
  },
}, {
  tableName: "user_login_logs",
  timestamps: false,
});

module.exports = UserLoginLog;
