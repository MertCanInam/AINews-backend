require("dotenv").config();
const extractor = require("./ai/extractor");
const fetcher = require("./contentFetcher");
const summarizer = require("./ai/summarizer");

async function runPipeline() {
  console.log("🚀 Pipeline started");
  try {
    console.log("📥 Step 1: extractor");
    if (extractor.run) await extractor.run();
    else if (typeof extractor === "function") await extractor();
    else throw new Error("Extractor run function not found!");

    console.log("🧹 Step 2: content fetch/clean");
    if (typeof fetcher === "function") await fetcher();
    else if (fetcher.run) await fetcher.run();
    else throw new Error("ContentFetcher run function not found!");

    console.log("📝 Step 3: summarizer");
    if (typeof summarizer === "function") await summarizer();
    else if (summarizer.runSummarizerJob) await summarizer.runSummarizerJob();
    else throw new Error("Summarizer run function not found!");

    console.log("✅ Pipeline finished");
  } catch (err) {
    console.error("❌ Pipeline error:", err.message);
    throw err;
  }
}

if (require.main === module) runPipeline();
module.exports = runPipeline;
