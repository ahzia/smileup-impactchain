const {
  Client,
  AccountId,
  PrivateKey,
  AccountInfoQuery
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '.env.local' });

async function testHederaConnection() {
  try {
    console.log('🔗 Testing Hedera Connection...\n');

    // Validate environment first
    const required = ['HEDERA_OPERATOR_ID', 'HEDERA_OPERATOR_PRIVATE_KEY', 'HEDERA_NETWORK'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`  - ${key}`));
      process.exit(1);
    }

    // Parse credentials
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
    const network = process.env.HEDERA_NETWORK;

    console.log(`📊 Account ID: ${operatorId.toString()}`);
    console.log(`🌐 Network: ${network}`);
    console.log(`🔑 Public Key: ${operatorKey.publicKey.toString()}\n`);

    // Create client based on network
    let client;
    if (network === 'mainnet') {
      client = Client.forMainnet();
    } else {
      client = Client.forTestnet();
    }

    // Set operator
    client.setOperator(operatorId, operatorKey);

    console.log('🔄 Connecting to Hedera network...');

    // Test connection by getting account info
    const accountInfo = await new AccountInfoQuery()
      .setAccountId(operatorId)
      .execute(client);

    console.log('✅ Successfully connected to Hedera network!');
    console.log('\n📊 Account Information:');
    console.log(`   Account ID: ${accountInfo.accountId.toString()}`);
    console.log(`   Balance: ${accountInfo.balance.toString()} tinybars`);
    
    // Convert balance to HBAR properly
    const balanceInTinybars = accountInfo.balance.toString().split(' ')[0];
    const hbarBalance = parseFloat(balanceInTinybars) / 100000000;
    console.log(`   HBAR Balance: ${hbarBalance.toFixed(2)} HBAR`);
    
    console.log(`   Is Deleted: ${accountInfo.isDeleted}`);
    console.log(`   Proxy Account: ${accountInfo.proxyAccountId ? accountInfo.proxyAccountId.toString() : 'None'}`);

    // Check if account has sufficient balance for operations
    if (hbarBalance < 1) {
      console.log('\n⚠️  Warning: Low HBAR balance');
      console.log(`   Current: ${hbarBalance.toFixed(2)} HBAR`);
      console.log('   Recommended: At least 1 HBAR for operations');
      
      if (network === 'testnet') {
        console.log('\n💡 For testnet, you can get free HBAR from:');
        console.log('   https://portal.hedera.com/');
      }
    } else {
      console.log(`\n✅ Sufficient balance: ${hbarBalance.toFixed(2)} HBAR`);
    }

    // Test network endpoints
    console.log('\n🌐 Testing network endpoints...');
    
    const mirrorNodeUrl = network === 'mainnet' 
      ? 'https://mainnet.mirrornode.hedera.com/api/v1/status'
      : 'https://testnet.mirrornode.hedera.com/api/v1/status';

    try {
      const response = await fetch(mirrorNodeUrl);
      if (response.ok) {
        console.log('✅ Mirror node is accessible');
      } else {
        console.log('⚠️  Mirror node may be experiencing issues');
      }
    } catch (error) {
      console.log('⚠️  Could not reach mirror node (this is normal for some networks)');
    }

    console.log('\n🎉 Hedera connection test completed successfully!');
    console.log('   Your credentials are valid and ready for development.');

  } catch (error) {
    console.error('\n❌ Hedera connection test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('INVALID_ACCOUNT_ID')) {
      console.error('\n💡 Possible solutions:');
      console.error('   - Check your HEDERA_OPERATOR_ID format (should be 0.0.123456)');
      console.error('   - Verify the account exists on the specified network');
    } else if (error.message.includes('INVALID_PRIVATE_KEY')) {
      console.error('\n💡 Possible solutions:');
      console.error('   - Check your HEDERA_OPERATOR_PRIVATE_KEY format');
      console.error('   - Ensure the key is DER encoded');
    } else if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\n💡 Possible solutions:');
      console.error('   - Add HBAR to your account');
      console.error('   - For testnet: https://portal.hedera.com/');
    }
    
    process.exit(1);
  }
}

testHederaConnection(); 