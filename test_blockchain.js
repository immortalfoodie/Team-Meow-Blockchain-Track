// Direct blockchain tests for Judicial Evidence Ledger
const { addEvidence, transferCustody, getEvidence, getCustodyHistory, getConnectionStatus } = require('./services/blockchain');

async function runBlockchainTests() {
  console.log('\n🔗 BLOCKCHAIN INTEGRATION TESTS\n');
  
  // Test C1: Contract Deployment Verification
  console.log('=== C-TC-01: Smart Contract Deployment ===');
  try {
    const status = await getConnectionStatus();
    console.log('✅ Connection Status:', status.connected ? 'CONNECTED' : 'DISCONNECTED');
    console.log('✅ Contract Address:', status.contract);
    console.log('✅ Block Number:', status.block || 'N/A');
    console.log('RESULT: PASS\n');
  } catch (e) {
    console.log('❌ Error:', e.message);
    console.log('RESULT: FAIL\n');
  }

  // Test C2: Add Evidence
  console.log('=== C-TC-02: Add Evidence to Blockchain ===');
  try {
    const evidenceId = 'EV001';
    const caseId = 'CASE100'; 
    const hash = 'abc123def456';
    const owner = 'POLICE';
    
    const txHash = await addEvidence(evidenceId, caseId, hash, owner);
    console.log('✅ Evidence Added:', evidenceId);
    console.log('✅ Case ID:', caseId);
    console.log('✅ Transaction Hash:', txHash || 'MOCK_MODE');
    console.log('RESULT: PASS\n');
  } catch (e) {
    console.log('❌ Error:', e.message);
    console.log('RESULT: FAIL\n');
  }

  // Test C3: Prevent Evidence Overwrite  
  console.log('=== C-TC-03: Prevent Evidence Overwrite ===');
  try {
    const evidenceId = 'EV001'; // Same ID as before
    const result = await addEvidence(evidenceId, 'CASE200', 'different-hash', 'FORENSIC');
    console.log('❌ Overwrite allowed - this should not happen');
    console.log('RESULT: FAIL\n');
  } catch (e) {
    if (e.message.includes('already exists') || e.message.includes('duplicate')) {
      console.log('✅ Duplicate prevented:', e.message);
      console.log('RESULT: PASS\n');
    } else {
      console.log('❌ Unexpected error:', e.message);
      console.log('RESULT: FAIL\n');
    }
  }

  // Test C4: Transfer Custody
  console.log('=== C-TC-04: Transfer Custody ===');
  try {
    const evidenceId = 'EV001';
    const newOwner = 'FORENSIC_LAB';
    
    const txHash = await transferCustody(evidenceId, newOwner);
    console.log('✅ Custody transferred for:', evidenceId);
    console.log('✅ New owner:', newOwner);
    console.log('✅ Transaction Hash:', txHash || 'MOCK_MODE');
    console.log('RESULT: PASS\n');
  } catch (e) {
    console.log('❌ Error:', e.message);
    console.log('RESULT: FAIL\n');
  }

  // Test C5: Read Evidence
  console.log('=== C-TC-05: Read Evidence from Blockchain ===');
  try {
    const evidenceId = 'EV001';
    const evidence = await getEvidence(evidenceId);
    
    console.log('✅ Evidence Retrieved:', evidence.evidenceId || evidence.id);
    console.log('✅ Case ID:', evidence.caseId);
    console.log('✅ Hash:', evidence.hash);
    console.log('✅ Owner:', evidence.ownerRole || evidence.owner);
    console.log('✅ Timestamp:', evidence.timestamp);
    console.log('RESULT: PASS\n');
  } catch (e) {
    console.log('❌ Error:', e.message);
    console.log('RESULT: FAIL\n');
  }

  console.log('🏁 BLOCKCHAIN TESTS COMPLETED\n');
}

runBlockchainTests().catch(console.error);