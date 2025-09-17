const rolesService = require('../services/rolesService');

const getAllRoles = async (req, res) => {
  try {
    const items = await rolesService.getAllRoles();
    return res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error('getAllRoles error:', err);
    return res.status(500).json({ success: false, message: 'Roller getirilirken hata oluştu.' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Geçersiz rol ID.' });
    }
    const role = await rolesService.getRoleById(id);
    if (!role) return res.status(404).json({ success: false, message: 'Rol bulunamadı.' });
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    console.error('getRoleById error:', err);
    return res.status(500).json({ success: false, message: 'Rol getirilirken hata oluştu.' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
};
