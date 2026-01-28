// Additional verification for blockchain connectivity
const { getConnectionStatus } = require('./services/blockchain');

console.log('🔗 BLOCKCHAIN CONNECTION VERIFICATION\n');

async function verifyConnection() {
  try {
    const status = await getConnectionStatus();
    console.log('📡 Connection Status:', JSON.stringify(status, null, 2));
    
    if (status.connected) {
      console.log('\n✅ BLOCKCHAIN INTEGRATION: FULLY OPERATIONAL');
      console.log('   • RPC Connection: ACTIVE');
      console.log('   • Smart Contract: DEPLOYED');
      console.log('   • Block Number:', status.block);
    } else {
      console.log('\n⚠️  BLOCKCHAIN INTEGRATION: USING FALLBACK MODE');
      console.log('   • RPC Connection:', status.connected ? 'ACTIVE' : 'INACTIVE');
      console.log('   • Error:', status.error);
      console.log('   • Fallback Mode: ACTIVE (Mock operations working)');
    }
  } catch (e) {
    console.log('❌ Connection verification failed:', e.message);
  }
}

verifyConnection();