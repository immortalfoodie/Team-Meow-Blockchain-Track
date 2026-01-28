// blockchain integration for evidence storage
// Supports both local Ganache and Sepolia testnet
require("dotenv").config();
const { Web3 } = require("web3");
const ABI = require("../abi/EvidenceABI.json");

// config
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:7545";
const CONTRACT_ADDR = process.env.CONTRACT_ADDRESS || "0xYOUR_CONTRACT_ADDRESS";
const ACCOUNT = process.env.ACCOUNT_ADDRESS || "0xYOUR_ACCOUNT_ADDRESS";
const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || "";

// detect if using testnet (Sepolia, etc.) vs local (Ganache)
const isTestnet = RPC_URL.includes("sepolia") || RPC_URL.includes("alchemy") || RPC_URL.includes("infura");

// web3 setup
let web3 = null;
let contract = null;

try {
  web3 = new Web3(RPC_URL);
  contract = new web3.eth.Contract(ABI, CONTRACT_ADDR);
  console.log(`[Blockchain] Connected to ${isTestnet ? "Sepolia Testnet" : "Local Network"}`);
} catch (e) {
  console.log("Web3 init failed, using mock mode:", e.message);
}

// helper: sign and send transaction (required for testnets like Sepolia)
async function sendSignedTransaction(txData) {
  if (!PRIVATE_KEY) {
    throw new Error("ACCOUNT_PRIVATE_KEY not set in .env - required for testnet transactions");
  }

  const gasPrice = await web3.eth.getGasPrice();
  const nonce = await web3.eth.getTransactionCount(ACCOUNT, "pending");
  const gasEstimate = await web3.eth.estimateGas({
    from: ACCOUNT,
    to: CONTRACT_ADDR,
    data: txData
  });

  const tx = {
    from: ACCOUNT,
    to: CONTRACT_ADDR,
    gas: Math.floor(Number(gasEstimate) * 1.2), // 20% buffer
    gasPrice: gasPrice,
    nonce: nonce,
    data: txData
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
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
      const txData = contract.methods.addEvidence(evidenceId, caseId, hash, owner).encodeABI();
      
      if (isTestnet) {
        // Sepolia/testnet: use signed transactions
        const receipt = await sendSignedTransaction(txData);
        console.log(`[Blockchain] Evidence ${evidenceId} added on Sepolia. Tx: ${receipt.transactionHash}`);
        return receipt.transactionHash;
      } else {
        // Ganache/local: use direct send (accounts are unlocked)
        const tx = await contract.methods
          .addEvidence(evidenceId, caseId, hash, owner)
          .send({ from: ACCOUNT, gas: 3000000 });
        return tx.transactionHash;
      }
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
      const txData = contract.methods.transferCustody(evidenceId, newOwner).encodeABI();
      
      if (isTestnet) {
        // Sepolia/testnet: use signed transactions
        const receipt = await sendSignedTransaction(txData);
        console.log(`[Blockchain] Custody transferred for ${evidenceId}. Tx: ${receipt.transactionHash}`);
        return receipt.transactionHash;
      } else {
        // Ganache/local: use direct send
        const tx = await contract.methods
          .transferCustody(evidenceId, newOwner)
          .send({ from: ACCOUNT, gas: 300000 });
        return tx.transactionHash;
      }
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
      const ev = await contract.methods.getEvidence(evidenceId).call();
      // Smart contract returns: (evidenceId, caseId, hash, ownerRole, timestamp)
      // ev is an object with numbered indices and named properties
      return {
        evidenceId: ev[0] || ev.evidenceId || evidenceId,
        caseId: ev[1] || ev.caseId || '',
        hash: ev[2] || ev.hash || '',
        owner: ev[3] || ev.ownerRole || '',
        timestamp: ev[4] ? new Date(Number(ev[4]) * 1000).toISOString() : new Date().toISOString()
      };
    } catch (e) {
      console.log("Chain error:", e.message);
    }
  }

  return mockDB.evidence.get(evidenceId) || null;
}

// get custody history (getCustodyTrailDetailed in smart contract)
async function getCustodyHistory(evidenceId) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      // Use detailed custody trail for full info
      const detailed = await contract.methods.getCustodyTrailDetailed(evidenceId).call();
      // Returns: [roles[], timestamps[], actions[]]
      const roles = detailed[0] || detailed.roles || [];
      const timestamps = detailed[1] || detailed.timestamps || [];
      const actions = detailed[2] || detailed.actions || [];
      
      const history = [];
      for (let i = 0; i < roles.length; i++) {
        history.push({
          role: roles[i],
          timestamp: new Date(Number(timestamps[i]) * 1000).toISOString(),
          action: actions[i] || (i === 0 ? 'CREATED' : 'TRANSFERRED')
        });
      }
      
      console.log(`[Blockchain] Retrieved custody history for ${evidenceId}: ${history.length} entries`);
      return history;
    } catch (e) {
      console.log("Chain error getting custody trail:", e.message);
      // Fallback to simple trail
      try {
        const simpleTrail = await contract.methods.getCustodyTrail(evidenceId).call();
        return simpleTrail.map((role, i) => ({
          role,
          timestamp: new Date().toISOString(),
          action: i === 0 ? 'CREATED' : 'TRANSFERRED'
        }));
      } catch (e2) { /* fall through */ }
    }
  }

  return mockDB.history.get(evidenceId) || [];
}

// get all evidence for a case (not available in smart contract, uses mock storage)
async function getAllCaseEvidence(caseId) {
  // Note: This method is not in the smart contract ABI
  // It only works with mock storage for now
  const results = [];
  for (const [id, ev] of mockDB.evidence) {
    if (ev.caseId === caseId) results.push(ev);
  }
  return results;
}

// get all registered evidence from blockchain
async function getAllEvidence() {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      // Get all evidence IDs from blockchain
      const evidenceIds = await contract.methods.getAllEvidenceIds().call();
      const results = [];
      
      // Fetch each evidence detail
      for (const evidenceId of evidenceIds) {
        try {
          const ev = await contract.methods.getEvidence(evidenceId).call();
          // Smart contract returns: [caseId, hash, ownerRole, userId, timestamp]
          // Based on actual data: ev[0]=caseId, ev[1]=hash, ev[2]=ownerUserId, ev[3]=status?, ev[4]=timestamp
          results.push({
            evidenceId: evidenceId,
            caseId: ev[0],
            hash: ev[1],
            owner: ev[2],      // ownerRole/userId
            status: ev[3],     // status field
            timestamp: new Date(Number(ev[4]) * 1000).toISOString()
          });
        } catch (e) {
          console.log(`Error fetching evidence ${evidenceId}:`, e.message);
        }
      }
      
      console.log(`[Blockchain] Retrieved ${results.length} evidence records from chain`);
      return results;
    } catch (e) {
      console.log("Chain error fetching all evidence:", e.message);
    }
  }

  // mock fallback
  const results = [];
  for (const [id, ev] of mockDB.evidence) {
    results.push(ev);
  }
  return results;
}

// connection status
async function getConnectionStatus() {
  try {
    const block = await web3.eth.getBlockNumber();
    const balance = await web3.eth.getBalance(ACCOUNT);
    return { 
      connected: true, 
      network: isTestnet ? "Sepolia Testnet" : "Local Network",
      block: block.toString(), 
      contract: CONTRACT_ADDR,
      account: ACCOUNT,
      balance: web3.utils.fromWei(balance, "ether") + " ETH"
    };
  } catch (e) {
    return { connected: false, error: e.message, usingMock: true };
  }
}

// verify evidence hash matches stored hash
async function verifyHash(evidenceId, hashToVerify) {
  const chainUp = await isChainUp();

  if (chainUp && CONTRACT_ADDR !== "0xYOUR_CONTRACT_ADDRESS") {
    try {
      const evidence = await contract.methods.getEvidence(evidenceId).call();
      const storedHash = evidence[2]; // hash is the 3rd return value
      return {
        valid: storedHash === hashToVerify,
        storedHash: storedHash,
        providedHash: hashToVerify
      };
    } catch (e) {
      console.log("Chain error:", e.message);
    }
  }

  // mock verification
  const ev = mockDB.evidence.get(evidenceId);
  if (!ev) throw new Error("Evidence not found");
  
  return {
    valid: ev.hash === hashToVerify,
    storedHash: ev.hash,
    providedHash: hashToVerify
  };
}

// get transaction details from hash (for audit trail)
async function getTransactionDetails(txHash) {
  const chainUp = await isChainUp();
  
  if (chainUp) {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber?.toString(),
        from: tx.from,
        to: tx.to,
        status: receipt?.status ? "Success" : "Failed",
        gasUsed: receipt?.gasUsed?.toString()
      };
    } catch (e) {
      return { error: e.message };
    }
  }
  
  return { error: "Blockchain not connected", mock: true };
}

module.exports = {
  addEvidence,
  transferCustody,
  getEvidence,
  getCustodyHistory,
  getAllCaseEvidence,
  getAllEvidence,
  getConnectionStatus,
  verifyHash,
  getTransactionDetails
};
