// Test health endpoint components
const { getConnectionStatus } = require("./services/blockchain");
const { getStats } = require("./services/audit");

async function testHealth() {
  console.log("Testing getStats()...");
  const stats = getStats();
  console.log("Stats:", stats);
  
  console.log("\nTesting getConnectionStatus()...");
  const bcStatus = await getConnectionStatus();
  console.log("BC Status:", bcStatus);
  
  console.log("\nHealth check data:");
  console.log(JSON.stringify({
    status: "ok",
    time: new Date().toISOString(),
    blockchain: bcStatus,
    audit: stats
  }, null, 2));
  
  process.exit(0);
}

testHealth().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
