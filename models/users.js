const User = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    refresh_token: { type: DataTypes.TEXT, allowNull: true },
    pending_email: { type: DataTypes.STRING(255), allowNull: true },
    email_token: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,         // Sequelize kendi created/updated set etsin
    createdAt: "created_at",  // DB kolon adlarıyla eşleştirdik
    updatedAt: "updated_at",
  }
);
