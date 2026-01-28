const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:8545');

async function checkGanache() {
  console.log('🔍 GANACHE STATUS CHECK');
  console.log('==============================');
  
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    
    console.log('✅ RPC Connection: ACTIVE');
    console.log('✅ Current Block:', blockNumber.toString());
    console.log('✅ Network ID:', networkId.toString());
    console.log('✅ Available Accounts:', accounts.length);
    console.log('✅ Primary Account:', accounts[0]);
    
    // Check account balance
    const balance = await web3.eth.getBalance(accounts[0]);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    console.log('✅ Account Balance:', balanceEth, 'ETH');
    
    // Check smart contract
    const contractAddr = '0x1a8465E39f3538c9f3E3710a39F5269ad6F76ec7';
    const code = await web3.eth.getCode(contractAddr);
    console.log('✅ Smart Contract:', code.length > 2 ? 'DEPLOYED' : 'NOT FOUND');
    console.log('✅ Contract Address:', contractAddr);
    
    console.log('\n🎯 GANACHE STATUS: FULLY OPERATIONAL');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('\n🚨 GANACHE STATUS: NOT WORKING');
  }
}

checkGanache();