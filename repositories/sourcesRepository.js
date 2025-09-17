// repositories/sourcesRepository.js
const Source = require("../models/sources");

const createSource = async (data) => {
  return await Source.create(data);
};

const getAllSources = async () => {
  return await Source.findAll({ order: [["created_at", "DESC"]] });
};

const getActiveSources = async () => {
  return await Source.findAll({
    where: { active: true },
    order: [["created_at", "DESC"]],
  });
};

const getSourceById = async (id) => {
  return await Source.findByPk(id);
};

const updateSource = async (id, data) => {
  return await Source.update(data, { where: { id } });
};

const deleteSource = async (id) => {
  return await Source.destroy({ where: { id } });
};
const countSources = async () => {
  return await Source.count();
};


module.exports = {
  createSource,
  getAllSources,
  getActiveSources,
  getSourceById,
  updateSource,
  deleteSource,
  countSources
};
