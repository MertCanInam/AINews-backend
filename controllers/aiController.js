// controllers/aiController.js
const extractor = require("../jobs/ai/extractor");
const summarizer = require("../jobs/ai/summarizer");

const extractPosts = async (req, res) => {
  try {
    const result = await extractor.run();
    res.status(200).json({ success: true, extracted: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const summarizePosts = async (req, res) => {
  try {
    const result = await summarizer.run();
    res.status(200).json({ success: true, summarized: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const runPipeline = async (req, res) => {
  try {
    const extracted = await extractor.run();
    const summarized = await summarizer.run();
    res.status(200).json({ success: true, extracted, summarized });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { extractPosts, summarizePosts, runPipeline };
