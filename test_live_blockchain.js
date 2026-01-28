// Test environment setup
require("dotenv").config();
console.log("=== Environment Check ===");
console.log("RPC URL:", process.env.BLOCKCHAIN_RPC_URL);
console.log("Contract:", process.env.CONTRACT_ADDRESS);
console.log("Account:", process.env.ACCOUNT_ADDRESS);
console.log("Private Key Set:", process.env.ACCOUNT_PRIVATE_KEY ? "Yes" : "No");
console.log("");

// Test blockchain with wallet fix
const { addEvidence, getEvidence, transferCustody, getConnectionStatus } = require("./services/blockchain");

async function test() {
  console.log("Testing blockchain service...");
  
  try {
    const status = await getConnectionStatus();
    console.log("Connection Status:", JSON.stringify(status, null, 2));
    
    const testId = "LIVE-TEST-" + Date.now();
    console.log("Adding evidence:", testId);
    
    const tx = await addEvidence(testId, "CASE-LIVE", "hash123abc", "POLICE");
    console.log("Transaction Result:", tx);
    
    if (tx && tx.startsWith("0x") && tx.indexOf("MOCK") === -1) {
      console.log("SUCCESS: Live blockchain call worked");
    } else {
      console.log("INFO: Using mock mode (fallback)");
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
  
  process.exit(0);
}

test();