const { Web3 } = require('web3');
const ABI = require('./EvidenceABI.json');

async function testC2() {
  console.log('=== C-TC-02: Add Evidence to Blockchain ===');
  try {
    const web3 = new Web3('http://127.0.0.1:8545');
    const contract = new web3.eth.Contract(ABI, '0x1a8465E39f3538c9f3E3710a39F5269ad6F76ec7');
    const account = '0x760e87b1afcBe2eBe1c5c5c3C3f5eE2DaEc36134';
    
    // Add evidence
    const evidenceId = 'EV001';
    const caseId = 'CASE100';
    const hash = 'abc123def456';
    const ownerRole = 'POLICE';
    
    const tx = await contract.methods
      .addEvidence(evidenceId, caseId, hash, ownerRole)
      .send({ from: account, gas: 300000 });
    
    console.log('✅ Transaction Hash:', tx.transactionHash);
    console.log('✅ Block Number:', tx.blockNumber);
    console.log('✅ Evidence ID:', evidenceId);
    console.log('✅ Case ID:', caseId);
    console.log('RESULT: PASS');
  } catch (e) {
    console.log('❌ Error:', e.message);
    console.log('RESULT: FAIL');
  }
}
testC2();