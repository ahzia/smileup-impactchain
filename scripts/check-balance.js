const {
  Client,
  AccountId,
  PrivateKey,
  AccountInfoQuery,
  TokenBalanceQuery
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '.env.local' });

async function checkBalance() {
  try {
    console.log('💰 Checking Account Balance...\n');

    // Validate environment
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

    // Create client
    const client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);

    // Get account info
    const accountInfo = await new AccountInfoQuery()
      .setAccountId(operatorId)
      .execute(client);

    console.log('📊 Account Information:');
    console.log(`   Account ID: ${accountInfo.accountId.toString()}`);
    console.log(`   Network: ${network}`);
    console.log(`   Balance: ${accountInfo.balance.toString()} tinybars`);
    console.log(`   HBAR Balance: ${(Number(accountInfo.balance) / 100000000).toFixed(2)} HBAR`);
    console.log(`   Is Deleted: ${accountInfo.isDeleted}`);
    console.log(`   Auto Renew Period: ${accountInfo.autoRenewPeriod} seconds`);

    // Check if Smiles token exists
    if (process.env.HEDERA_SMILES_TOKEN_ID) {
      console.log('\n🪙 Checking Smiles Token Balance...');
      
      try {
        const { TokenId } = require('@hashgraph/sdk');
        const tokenId = TokenId.fromString(process.env.HEDERA_SMILES_TOKEN_ID);
        
        const tokenBalance = await new TokenBalanceQuery()
          .setAccountId(operatorId)
          .setTokenId(tokenId)
          .execute(client);

        console.log(`   Token ID: ${tokenId.toString()}`);
        console.log(`   Smiles Balance: ${tokenBalance.toLocaleString()} SMILE`);
        
        // Calculate USD value (approximate)
        const smilesValue = tokenBalance * 0.01; // Assuming 1 SMILE = $0.01
        console.log(`   Estimated Value: $${smilesValue.toFixed(2)}`);
        
      } catch (error) {
        console.log('   ⚠️  Could not check Smiles token balance:');
        console.log(`      ${error.message}`);
        console.log('   💡 Token may not exist yet or account not associated');
      }
    } else {
      console.log('\n🪙 Smiles Token:');
      console.log('   ⚠️  HEDERA_SMILES_TOKEN_ID not set');
      console.log('   💡 Run deploy-smiles-token.js to create the token');
    }

    // Balance recommendations
    const hbarBalance = Number(accountInfo.balance) / 100000000;
    console.log('\n💡 Balance Recommendations:');
    
    if (hbarBalance < 0.5) {
      console.log('   ❌ Very low balance - add HBAR immediately');
      console.log('   💰 Recommended: At least 2 HBAR for development');
    } else if (hbarBalance < 1) {
      console.log('   ⚠️  Low balance - consider adding more HBAR');
      console.log('   💰 Recommended: At least 1 HBAR for operations');
    } else if (hbarBalance < 5) {
      console.log('   ✅ Adequate balance for development');
      console.log('   💰 Consider adding more for production');
    } else {
      console.log('   ✅ Excellent balance for all operations');
    }

    if (network === 'testnet' && hbarBalance < 2) {
      console.log('\n🆓 Testnet HBAR:');
      console.log('   Get free testnet HBAR from: https://portal.hedera.com/');
    }

    console.log('\n✅ Balance check completed successfully!');

  } catch (error) {
    console.error('\n❌ Balance check failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('INVALID_ACCOUNT_ID')) {
      console.error('\n💡 Check your HEDERA_OPERATOR_ID format');
    } else if (error.message.includes('INVALID_PRIVATE_KEY')) {
      console.error('\n💡 Check your HEDERA_OPERATOR_PRIVATE_KEY format');
    }
    
    process.exit(1);
  }
}

checkBalance(); 