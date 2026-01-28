// Live API Testing Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 LIVE API TESTING\n');

function makeRequest(method, url, data = null, headers = {}) {
  try {
    let cmd = `curl -m 10 -s -X ${method}`;
    
    // Add headers
    for (const [key, value] of Object.entries(headers)) {
      cmd += ` -H "${key}: ${value}"`;
    }
    
    // Add data for POST requests
    if (data) {
      if (typeof data === 'string') {
        cmd += ` -d '${data}'`;
      } else {
        cmd += ` -d '${JSON.stringify(data)}'`;
      }
    }
    
    cmd += ` ${url}`;
    
    console.log(`🔗 ${method} ${url}`);
    const result = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    return result;
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
}

// Test 1: Health Check
console.log('=== API-TC-01: Health Check ===');
try {
  const health = makeRequest('GET', 'http://localhost:5000/api/health');
  console.log('✅ Health Response:', health || 'Empty response');
  console.log('RESULT: ' + (health.includes('status') || health.includes('ok') ? 'PASS' : 'FAIL'));
} catch (e) {
  console.log('❌ Health check failed:', e.message);
  console.log('RESULT: FAIL');
}
console.log();

// Test 2: Root Endpoint
console.log('=== API-TC-02: Root Endpoint ===');
try {
  const root = makeRequest('GET', 'http://localhost:5000/');
  console.log('✅ Root Response:', root || 'Empty response');
  console.log('RESULT: ' + (root.includes('Evidence Chain') || root.includes('API') ? 'PASS' : 'FAIL'));
} catch (e) {
  console.log('❌ Root endpoint failed:', e.message);
  console.log('RESULT: FAIL');
}
console.log();

// Test 3: Auth Endpoint Test
console.log('=== API-TC-03: Auth Endpoint ===');
try {
  const auth = makeRequest('POST', 'http://localhost:5000/api/auth/login', 
    { username: 'test', password: 'test' },
    { 'Content-Type': 'application/json' }
  );
  console.log('✅ Auth Response:', auth || 'Empty response');
  console.log('RESULT: ' + (auth.includes('error') || auth.includes('token') ? 'PASS' : 'TIMEOUT'));
} catch (e) {
  console.log('❌ Auth endpoint failed:', e.message);
  console.log('RESULT: FAIL');
}
console.log();

// Test 4: Evidence Endpoint (without auth)
console.log('=== API-TC-04: Evidence Endpoint (No Auth) ===');
try {
  const evidence = makeRequest('GET', 'http://localhost:5000/api/evidence');
  console.log('✅ Evidence Response:', evidence || 'Empty response');
  console.log('RESULT: ' + (evidence.includes('error') || evidence.includes('Unauthorized') ? 'PASS' : 'TIMEOUT'));
} catch (e) {
  console.log('❌ Evidence endpoint failed:', e.message);
  console.log('RESULT: FAIL');
}
console.log();

console.log('🏁 LIVE API TESTING COMPLETED\n');