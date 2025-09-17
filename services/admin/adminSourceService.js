const sourcesRepository = require("../../repositories/sourcesRepository");

// 1. Tüm kaynakları getir
async function getAllSources() {
  return await sourcesRepository.getAllSources();
}

// 2. Yeni kaynak ekle
async function createSource(data) {
  return await sourcesRepository.createSource(data);
}

// 3. Kaynağı güncelle (aktif/pasif veya isim değişikliği)
async function updateSource(id, data) {
  return await sourcesRepository.updateSource(id, data);
}

// 4. Kaynağı sil
async function deleteSource(id) {
  return await sourcesRepository.deleteSource(id);
}

// 5. Kaynak hata logları (opsiyonel - eğer log tablosu eklersek buraya bağlarız)
async function getSourceLogs(id) {
  // şimdilik sadece placeholder
  return { message: `Kaynak #${id} için loglar ileride eklenecek` };
}

module.exports = {
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
  getSourceLogs,
};
