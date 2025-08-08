const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config({ path: '.env.local' });

async function testWalletService() {
  try {
    console.log("🧪 Testing Wallet Service...");

    // Validate environment
    const required = ['HEDERA_OPERATOR_ID', 'HEDERA_OPERATOR_PRIVATE_KEY', 'HEDERA_NETWORK', 'HEDERA_SMILES_TOKEN_ID'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`  - ${key}`));
      process.exit(1);
    }

    // Initialize client
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
    const network = process.env.HEDERA_NETWORK;
    const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
    
    const client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);

    console.log("✅ Environment validated");
    console.log(`📊 Account ID: ${operatorId.toString()}`);
    console.log(`🪙 Token ID: ${tokenId}`);
    console.log(`🌐 Network: ${network}`);

    // Test wallet connection status
    console.log("\n🔗 Testing wallet connection status...");
    
    const { AccountInfoQuery } = require('@hashgraph/sdk');
    const accountInfoQuery = new AccountInfoQuery()
      .setAccountId(operatorId);
    
    const accountInfo = await accountInfoQuery.execute(client);
    
    console.log(`✅ Wallet connected`);
    console.log(`📊 Account ID: ${accountInfo.accountId}`);
    console.log(`💰 Balance: ${accountInfo.balance.toString()}`);

    // Test HBAR balance
    console.log("\n💰 Testing HBAR balance query...");
    
    const balanceStr = accountInfo.balance.toString();
    let hbarBalance;
    
    if (balanceStr.includes('ℏ')) {
      const balanceInHbar = balanceStr.split(' ')[0];
      hbarBalance = parseFloat(balanceInHbar);
    } else {
      const balanceInTinybars = balanceStr.split(' ')[0];
      hbarBalance = parseFloat(balanceInTinybars) / 100000000;
    }
    
    console.log(`💰 HBAR Balance: ${hbarBalance.toFixed(2)} HBAR`);

    // Test Smiles balance
    console.log("\n🪙 Testing Smiles balance query...");
    
    const { AccountBalanceQuery } = require('@hashgraph/sdk');
    const balanceQuery = new AccountBalanceQuery()
      .setAccountId(operatorId);

    const balance = await balanceQuery.execute(client);
    
    console.log(`💰 HBAR Balance: ${balance.hbars.toString()}`);
    
    // Check if we have any tokens
    if (balance.tokens && balance.tokens.size > 0) {
      console.log("🪙 Token balances:");
      for (const [tokenId, tokenBalance] of balance.tokens) {
        console.log(`   ${tokenId}: ${tokenBalance} tokens`);
        if (tokenId === tokenId) {
          console.log(`🪙 Smiles Balance: ${tokenBalance} SMILE`);
        }
      }
    } else {
      console.log(`🪙 Smiles Balance: 0 SMILE (not associated)`);
    }

    // Test transaction history
    console.log("\n📜 Testing transaction history...");
    
    const { AccountRecordsQuery } = require('@hashgraph/sdk');
    const recordsQuery = new AccountRecordsQuery()
      .setAccountId(operatorId);

    const records = await recordsQuery.execute(client);
    
    console.log(`✅ Retrieved ${records.length} recent transactions`);
    if (records.length > 0) {
      records.slice(0, 5).forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.transactionId} - ${record.status}`);
      });
    } else {
      console.log("   No recent transactions found");
    }

    // Test network info
    console.log("\n🌐 Testing network info...");
    
    const networkInfo = {
      network: network,
      explorerUrl: network === 'mainnet' 
        ? 'https://hashscan.io' 
        : 'https://hashscan.io/testnet',
      mirrorNodeUrl: network === 'mainnet'
        ? 'https://mainnet.mirrornode.hedera.com'
        : 'https://testnet.mirrornode.hedera.com'
    };
    
    console.log(`✅ Network: ${networkInfo.network}`);
    console.log(`🔗 Explorer: ${networkInfo.explorerUrl}`);
    console.log(`📡 Mirror Node: ${networkInfo.mirrorNodeUrl}`);

    console.log("\n✅ Wallet service test completed successfully!");
    console.log("📊 Summary:");
    console.log(`   Wallet Connected: ✅`);
    console.log(`   HBAR Balance: ${hbarBalance.toFixed(2)} HBAR`);
    console.log(`   Recent Transactions: ${records.length}`);
    console.log(`   Network Info: ✅`);

  } catch (error) {
    console.error("❌ Error testing wallet service:", error);
    
    if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\n💡 Solution: Add more HBAR to your account');
    } else if (error.message.includes('INVALID_ACCOUNT_ID')) {
      console.error('\n💡 Solution: Check your HEDERA_OPERATOR_ID format');
    }
    
    process.exit(1);
  }
}

testWalletService(); 