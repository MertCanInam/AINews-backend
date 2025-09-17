// services/sourcesService.js
const sourcesRepository = require('../repositories/sourcesRepository');

const createSource = async (payload) => {
  const { name, type, url, parser_config, category_id, active } = payload || {};
  if (!name || !type || !url) throw new Error('name, type ve url zorunludur');
  if (!['rss', 'html'].includes(type)) throw new Error('type değeri rss | html olmalı');

  const source = await sourcesRepository.createSource({
    name, type, url, parser_config, category_id: category_id || null, active: active ?? true,
  });
  return source;
};

const getAllSources = () => sourcesRepository.getAllSources();

const getActiveSources = () => sourcesRepository.getActiveSources();

const getSourceById = async (id) => {
  if (!id) throw new Error('id gerekli');
  const src = await sourcesRepository.getSourceById(id);
  if (!src) throw new Error('Source bulunamadı');
  return src;
};

const updateSource = async (id, data) => {
  if (!id) throw new Error('id gerekli');
  await getSourceById(id); // existence check
  await sourcesRepository.updateSource(id, data);
  return { success: true };
};

const deleteSource = async (id) => {
  if (!id) throw new Error('id gerekli');
  await sourcesRepository.deleteSource(id);
  return { success: true };
};

module.exports = {
  createSource,
  getAllSources,
  getActiveSources,
  getSourceById,
  updateSource,
  deleteSource,
};
