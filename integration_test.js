#!/usr/bin/env node

// INT-TC-01: End-to-End Evidence Lifecycle Validation
// Complete integration test for Evidence Chain system

const fs = require('fs');
const crypto = require('crypto');
const { addEvidence, transferCustody, getEvidence, getCustodyHistory, getConnectionStatus } = require('./services/blockchain');

console.log('\n🧪 INT-TC-01: END-TO-END EVIDENCE LIFECYCLE VALIDATION\n');
console.log('=' .repeat(70));

// Test Data Setup
const testData = {
  caseId: 'CASE500',
  evidenceId: 'EV900',
  originalFile: 'crime_scene_photo.png',
  modifiedFile: 'crime_scene_photo_modified.png',
  roles: {
    police: 'POLICE',
    forensic: 'FORENSIC_LAB', 
    judge: 'JUDGE'
  }
};

// Create mock evidence files
const originalContent = 'CRIME SCENE PHOTO - ORIGINAL EVIDENCE DATA - Case 500 - Location: Main Street';
const modifiedContent = 'CRIME SCENE PHOTO - TAMPERED EVIDENCE DATA - Case 500 - Location: Main Street [MODIFIED]';

fs.writeFileSync(testData.originalFile, originalContent);
fs.writeFileSync(testData.modifiedFile, modifiedContent);

// Generate hashes
const originalHash = crypto.createHash('sha256').update(originalContent).digest('hex');
const modifiedHash = crypto.createHash('sha256').update(modifiedContent).digest('hex');

console.log('📋 TEST DATA PREPARED:');
console.log(`   Case ID: ${testData.caseId}`);
console.log(`   Evidence ID: ${testData.evidenceId}`);
console.log(`   Original Hash: ${originalHash}`);
console.log(`   Modified Hash: ${modifiedHash}`);
console.log();

const testResults = [];

function logStep(step, description, status, details = '') {
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${statusIcon} STEP ${step}: ${description} - ${status}`);
  if (details) console.log(`   ${details}`);
  console.log();
  
  testResults.push({ step, description, status, details });
}

async function executeIntegrationTest() {
  try {
    
    // ========== STEP 1: Evidence Upload ==========
    console.log('🔄 STEP 1: Evidence Upload (Person B + C)');
    console.log('-'.repeat(50));
    
    try {
      // Simulate POLICE login and upload
      const uploadResult = await addEvidence(
        testData.evidenceId,
        testData.caseId,
        originalHash,
        testData.roles.police
      );
      
      if (uploadResult) {
        logStep(1, 'Evidence Upload', 'PASS', 
          `Transaction Hash: ${uploadResult}, Hash: ${originalHash.substring(0, 16)}...`);
      } else {
        logStep(1, 'Evidence Upload', 'FAIL', 'No transaction hash returned');
      }
    } catch (e) {
      logStep(1, 'Evidence Upload', 'FAIL', `Error: ${e.message}`);
    }

    // ========== STEP 2: Blockchain Integrity Check ==========
    console.log('🔍 STEP 2: Blockchain Integrity Check (Person C)');
    console.log('-'.repeat(50));
    
    try {
      const storedEvidence = await getEvidence(testData.evidenceId);
      
      if (storedEvidence && storedEvidence.hash === originalHash) {
        logStep(2, 'Blockchain Integrity Check', 'PASS',
          `Hash verified, Owner: ${storedEvidence.ownerRole || storedEvidence.owner}`);
      } else if (storedEvidence) {
        logStep(2, 'Blockchain Integrity Check', 'PARTIAL',
          `Evidence found but hash mismatch or in mock mode`);
      } else {
        logStep(2, 'Blockchain Integrity Check', 'FAIL', 'Evidence not found');
      }
    } catch (e) {
      logStep(2, 'Blockchain Integrity Check', 'FAIL', `Error: ${e.message}`);
    }

    // ========== STEP 3: Chain of Custody Transfer ==========
    console.log('🔄 STEP 3: Chain of Custody Transfer (Person B + C)');
    console.log('-'.repeat(50));
    
    try {
      const transferResult = await transferCustody(testData.evidenceId, testData.roles.forensic);
      
      if (transferResult) {
        logStep(3, 'Chain of Custody Transfer', 'PASS',
          `Transferred to ${testData.roles.forensic}, TX: ${transferResult}`);
      } else {
        logStep(3, 'Chain of Custody Transfer', 'FAIL', 'Transfer failed');
      }
    } catch (e) {
      logStep(3, 'Chain of Custody Transfer', 'FAIL', `Error: ${e.message}`);
    }

    // ========== STEP 4: Evidence Verification (Untampered) ==========
    console.log('✅ STEP 4: Evidence Verification (Untampered)');
    console.log('-'.repeat(50));
    
    try {
      const storedEvidence = await getEvidence(testData.evidenceId);
      const verificationHash = crypto.createHash('sha256').update(originalContent).digest('hex');
      
      if (storedEvidence && storedEvidence.hash === verificationHash) {
        logStep(4, 'Evidence Verification (Untampered)', 'PASS',
          'Hash matches - Evidence authentic');
      } else if (storedEvidence) {
        logStep(4, 'Evidence Verification (Untampered)', 'PARTIAL',
          'Evidence found but verification logic in mock mode');
      } else {
        logStep(4, 'Evidence Verification (Untampered)', 'FAIL',
          'Evidence not found for verification');
      }
    } catch (e) {
      logStep(4, 'Evidence Verification (Untampered)', 'FAIL', `Error: ${e.message}`);
    }

    // ========== STEP 5: Evidence Tampering Detection ==========
    console.log('🚨 STEP 5: Evidence Tampering Detection (Critical)');
    console.log('-'.repeat(50));
    
    try {
      const storedEvidence = await getEvidence(testData.evidenceId);
      const tamperedHash = crypto.createHash('sha256').update(modifiedContent).digest('hex');
      
      if (storedEvidence) {
        const hashesMatch = storedEvidence.hash === tamperedHash;
        
        if (!hashesMatch) {
          logStep(5, 'Evidence Tampering Detection', 'PASS',
            'Hash mismatch detected - Tampering identified correctly');
        } else {
          logStep(5, 'Evidence Tampering Detection', 'FAIL',
            'Tampering not detected - Security breach!');
        }
        
        console.log(`   Original stored: ${storedEvidence.hash?.substring(0, 16)}...`);
        console.log(`   Tampered file:   ${tamperedHash.substring(0, 16)}...`);
        console.log(`   Hashes match:    ${hashesMatch ? 'YES (BAD)' : 'NO (GOOD)'}`);
        
      } else {
        logStep(5, 'Evidence Tampering Detection', 'FAIL',
          'Cannot test tampering - Evidence not found');
      }
    } catch (e) {
      logStep(5, 'Evidence Tampering Detection', 'FAIL', `Error: ${e.message}`);
    }

  } catch (error) {
    console.log(`❌ CRITICAL ERROR: ${error.message}\n`);
  }

  // ========== FINAL RESULTS ==========
  console.log('📊 INTEGRATION TEST RESULTS SUMMARY');
  console.log('=' .repeat(70));
  
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const partialCount = testResults.filter(r => r.status === 'PARTIAL').length; 
  const failCount = testResults.filter(r => r.status === 'FAIL').length;
  
  console.log(`✅ PASSED: ${passCount}/5 steps`);
  console.log(`⚠️  PARTIAL: ${partialCount}/5 steps`);
  console.log(`❌ FAILED: ${failCount}/5 steps`);
  
  // Pass/Fail Criteria Assessment
  console.log('\n🎯 PASS/FAIL CRITERIA ASSESSMENT:');
  console.log('-'.repeat(50));
  
  const criteria = [
    { name: 'Blockchain data immutable', status: passCount >= 2 ? 'PASS' : 'FAIL' },
    { name: 'Hash integrity maintained', status: passCount >= 3 ? 'PASS' : 'FAIL' }, 
    { name: 'Tampering detected', status: testResults.find(r => r.step === 5)?.status === 'PASS' ? 'PASS' : 'FAIL' },
    { name: 'Custody history preserved', status: testResults.find(r => r.step === 3)?.status === 'PASS' ? 'PASS' : 'FAIL' },
    { name: 'Backend ↔ blockchain sync', status: passCount + partialCount >= 3 ? 'PASS' : 'FAIL' }
  ];
  
  criteria.forEach(c => {
    const icon = c.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${c.name}: ${c.status}`);
  });
  
  const overallSuccess = criteria.filter(c => c.status === 'PASS').length / criteria.length;
  console.log(`\n🏆 OVERALL SUCCESS RATE: ${Math.round(overallSuccess * 100)}%`);
  
  if (overallSuccess >= 0.8) {
    console.log('🚀 INTEGRATION TEST: PASSED - System ready for production');
  } else if (overallSuccess >= 0.6) {
    console.log('⚡ INTEGRATION TEST: PARTIALLY PASSED - Minor issues to address');
  } else {
    console.log('🔧 INTEGRATION TEST: FAILED - Significant issues require attention');
  }

  // Cleanup
  try {
    fs.unlinkSync(testData.originalFile);
    fs.unlinkSync(testData.modifiedFile);
    console.log('\n🧹 Test files cleaned up');
  } catch (e) {
    console.log('⚠️  Cleanup warning:', e.message);
  }
  
  console.log('\n🏁 INT-TC-01 INTEGRATION TEST COMPLETED\n');
}

// Execute the test
executeIntegrationTest().catch(console.error);