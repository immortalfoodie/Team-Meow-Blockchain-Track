// blockchain integration for evidence storage
require("dotenv").config();
const { Web3 } = require("web3");
const ABI = require("../abi/EvidenceABI.json");

// config
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545";
const CONTRACT_ADDR = process.env.CONTRACT_ADDRESS || "0xYOUR_CONTRACT_ADDRESS";
const ACCOUNT = process.env.ACCOUNT_ADDRESS || "0xYOUR_GANACHE_ACCOUNT";

// web3 setup
let web3 = null;
let contract = null;

try {
  web3 = new Web3(RPC_URL);
  contract = new web3.eth.Contract(ABI, CONTRACT_ADDR);
} catch (e) {
  console.log("Web3 init failed, using mock mode:", e.message);
}

// mock storage for dev/testing when blockchain isnt running
const mockDB = {
  evidence: new Map(),
  history: new Map()
};

// check if blockchain is up
async function isChainUp() {
  if (!web3) return false;
  try {
    await web3.eth.getBlockNumber();
    return true;
  } catch (e) {
    return false;
  }
}

// add evidence to blockchain
async function addEvidence(evidenceId, caseId, hash, owner) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      const tx = await contract.methods
        .addEvidence(evidenceId, caseId, hash, owner)
        .send({ from: ACCOUNT, gas: 3000000 });
      return tx.transactionHash;
    } catch (e) {
      console.log("Chain error, falling back to mock:", e.message);
    }
  }

  // mock fallback
  const ts = new Date().toISOString();
  const mockTx = `0xMOCK${Date.now().toString(16)}`;

  mockDB.evidence.set(evidenceId, { evidenceId, caseId, hash, owner, timestamp: ts });
  mockDB.history.set(evidenceId, [{ owner, timestamp: ts, action: "CREATED", txHash: mockTx }]);

  console.log(`[MOCK] Evidence ${evidenceId} stored`);
  return mockTx;
}

// transfer custody
async function transferCustody(evidenceId, newOwner) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      const tx = await contract.methods
        .transferCustody(evidenceId, newOwner)
        .send({ from: ACCOUNT, gas: 300000 });
      return tx.transactionHash;
    } catch (e) {
      console.log("Chain error:", e.message);
    }
  }

  // mock
  const ev = mockDB.evidence.get(evidenceId);
  if (!ev) throw new Error("Evidence not found");

  const prevOwner = ev.owner;
  ev.owner = newOwner;

  const hist = mockDB.history.get(evidenceId) || [];
  const mockTx = `0xMOCK${Date.now().toString(16)}`;
  hist.push({ previousOwner: prevOwner, owner: newOwner, timestamp: new Date().toISOString(), txHash: mockTx });
  mockDB.history.set(evidenceId, hist);

  return mockTx;
}

// get evidence
async function getEvidence(evidenceId) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      return await contract.methods.getEvidence(evidenceId).call();
    } catch (e) {
      console.log("Chain error:", e.message);
    }
  }

  return mockDB.evidence.get(evidenceId) || null;
}

// get custody history
async function getCustodyHistory(evidenceId) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      return await contract.methods.getCustodyHistory(evidenceId).call();
    } catch (e) { /* fall through */ }
  }

  return mockDB.history.get(evidenceId) || [];
}

// get all evidence for a case
async function getAllCaseEvidence(caseId) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      return await contract.methods.getAllCaseEvidence(caseId).call();
    } catch (e) { /* fall through */ }
  }

  // mock - filter by case
  const results = [];
  for (const [id, ev] of mockDB.evidence) {
    if (ev.caseId === caseId) results.push(ev);
  }
  return results;
}

// connection status
async function getConnectionStatus() {
  try {
    const block = await web3.eth.getBlockNumber();
    return { connected: true, block: block.toString(), contract: CONTRACT_ADDR };
  } catch (e) {
    return { connected: false, error: e.message, usingMock: true };
  }
}

module.exports = {
  addEvidence,
  transferCustody,
  getEvidence,
  getCustodyHistory,
  getAllCaseEvidence,
  getConnectionStatus
};
