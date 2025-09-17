// controllers/sourcesController.js
const sourcesService = require('../services/sourcesService');

const createSource = async (req, res) => {
  try {
    const data = await sourcesService.createSource(req.body);
    return res.status(201).json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getAllSources = async (_req, res) => {
  try {
    const data = await sourcesService.getAllSources();
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getActiveSources = async (_req, res) => {
  try {
    const data = await sourcesService.getActiveSources();
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getSourceById = async (req, res) => {
  try {
    const data = await sourcesService.getSourceById(req.params.id);
    return res.json({ success: true, data });
  } catch (e) {
    const status = e.message.includes('bulunamadı') ? 404 : 400;
    return res.status(status).json({ success: false, message: e.message });
  }
};

const updateSource = async (req, res) => {
  try {
    const data = await sourcesService.updateSource(req.params.id, req.body);
    return res.json({ success: true, ...data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const deleteSource = async (req, res) => {
  try {
    const data = await sourcesService.deleteSource(req.params.id);
    return res.json({ success: true, ...data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

module.exports = {
  createSource,
  getAllSources,
  getActiveSources,
  getSourceById,
  updateSource,
  deleteSource,
};
