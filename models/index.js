const sequelize = require('../config/database');
const User = require('./users');
const Role = require('./roles');
const Category = require('./categories');
const UserCategory = require('./user_categories');
const Post = require('./posts');
const Notification = require('./notifications');
const Setting = require('./settings');
const Source = require('./sources');
const Ticket = require("./ticket");
const UserLoginLog = require("./userLoginLogs");
const SavedPost = require("./savedPosts");

// Relations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.belongsToMany(Category, {
  through: UserCategory,
  foreignKey: 'user_id',
  otherKey: 'category_id'
});
Category.belongsToMany(User, {
  through: UserCategory,
  foreignKey: 'category_id',
  otherKey: 'user_id'
});

Category.hasMany(Post, { foreignKey: 'category_id' });
Post.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Notification, { foreignKey: 'post_id' });
Notification.belongsTo(Post, { foreignKey: 'post_id' });

User.hasOne(Setting, { foreignKey: 'user_id' });
Setting.belongsTo(User, { foreignKey: 'user_id' });

Source.hasMany(Post, { foreignKey: 'source_id' });
Post.belongsTo(Source, { foreignKey: 'source_id' });

// ✅ SavedPost ilişkileri
SavedPost.belongsTo(Post, { as: "Post", foreignKey: "post_id" });
Post.hasMany(SavedPost, { 
  as: "SavedPosts", 
  foreignKey: "post_id",
  onDelete: "CASCADE",    // ✅ post silinince saved_posts da silinir
  hooks: true             // Sequelize'nin delete hooklarını tetiklemesi için
});

SavedPost.belongsTo(User, { as: "User", foreignKey: "user_id" });
User.hasMany(SavedPost, { as: "SavedPosts", foreignKey: "user_id" });

User.hasMany(Ticket, { foreignKey: "user_id" });
Ticket.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserLoginLog, { foreignKey: "user_id" });
UserLoginLog.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  Role,
  Category,
  UserCategory,
  Post,
  Notification,
  Setting,
  Source,
  SavedPost,
  Ticket,
  UserLoginLog
};
