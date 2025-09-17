const rolesRepo = require('../repositories/rolesRepository');

const getAllRoles = async () => {
  return await rolesRepo.getAllRoles();
};

const getRoleById = async (id) => {
  if (!id) throw new Error('Rol ID gerekli');
  const role = await rolesRepo.getRoleById(id);
  return role || null;
};

module.exports = {
  getAllRoles,
  getRoleById,
};
