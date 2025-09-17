require("dotenv").config();

// 3 ana job'u import et
const extractor = require("./ai/extractor");       // { run }
const fetcher = require("./contentFetcher");       // run
const summarizer = require("./ai/summarizer");     // runSummarizerJob

async function runPipeline() {
  console.log("🚀 Pipeline started");

  try {
    // 1. Liste sayfasından haberleri al
    if (extractor.run) {
      await extractor.run();
    } else if (typeof extractor === "function") {
      await extractor();
    } else {
      throw new Error("Extractor run function not found!");
    }

    // 2. İçerikleri indir + temizle
    if (typeof fetcher === "function") {
      await fetcher();
    } else if (fetcher.run) {
      await fetcher.run();
    } else {
      throw new Error("ContentFetcher run function not found!");
    }

    // 3. Özetle
    if (typeof summarizer === "function") {
      await summarizer();
    } else if (summarizer.runSummarizerJob) {
      await summarizer.runSummarizerJob();
    } else {
      throw new Error("Summarizer run function not found!");
    }

    console.log("✅ Pipeline finished");
  } catch (err) {
    console.error("❌ Pipeline error:", err.message);
  }
}

// Elle terminalden çalıştırma
if (require.main === module) {
  runPipeline();
}

module.exports = runPipeline;
