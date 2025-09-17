const Role = require('../models/roles');

const getAllRoles = async () => {
  return await Role.findAll();
};

const getRoleById = async (id) => {
  return await Role.findByPk(id);
};

module.exports = {
  getAllRoles,
  getRoleById,
};
