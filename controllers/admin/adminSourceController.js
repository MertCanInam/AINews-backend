const adminSourceService = require("../../services/admin/adminSourceService");

// 1. Tüm kaynakları getir
async function getAllSources(req, res) {
  try {
    const sources = await adminSourceService.getAllSources();
    res.json(sources);
  } catch (err) {
    console.error("Admin getAllSources error:", err);
    res.status(500).json({ error: "Kaynaklar alınırken hata oluştu" });
  }
}

// 2. Yeni kaynak ekle
async function createSource(req, res) {
  try {
    const source = await adminSourceService.createSource(req.body);
    res.status(201).json(source);
  } catch (err) {
    console.error("Admin createSource error:", err);
    res.status(500).json({ error: "Kaynak eklenirken hata oluştu" });
  }
}

// 3. Kaynağı güncelle
async function updateSource(req, res) {
  try {
    const { id } = req.params;
    await adminSourceService.updateSource(id, req.body);
    res.json({ message: "Kaynak güncellendi" });
  } catch (err) {
    console.error("Admin updateSource error:", err);
    res.status(500).json({ error: "Kaynak güncellenirken hata oluştu" });
  }
}

// 4. Kaynağı sil
async function deleteSource(req, res) {
  try {
    const { id } = req.params;
    await adminSourceService.deleteSource(id);
    res.json({ message: "Kaynak silindi" });
  } catch (err) {
    console.error("Admin deleteSource error:", err);
    res.status(500).json({ error: "Kaynak silinirken hata oluştu" });
  }
}

// 5. Kaynak loglarını getir (şimdilik placeholder)
async function getSourceLogs(req, res) {
  try {
    const { id } = req.params;
    const logs = await adminSourceService.getSourceLogs(id);
    res.json(logs);
  } catch (err) {
    console.error("Admin getSourceLogs error:", err);
    res.status(500).json({ error: "Kaynak logları alınırken hata oluştu" });
  }
}

module.exports = {
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
  getSourceLogs,
};
