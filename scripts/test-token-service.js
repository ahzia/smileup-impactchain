const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config({ path: '.env.local' });

// Import the TokenService (we'll need to compile TypeScript first)
// For now, let's test the basic functionality

async function testTokenService() {
  try {
    console.log("🧪 Testing Token Service...");

    // Validate environment
    const required = [
      'HEDERA_OPERATOR_ID', 
      'HEDERA_OPERATOR_PRIVATE_KEY', 
      'HEDERA_NETWORK',
      'HEDERA_SMILES_TOKEN_ID'
    ];
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

    // Test basic token operations
    console.log("\n🔍 Testing token balance query...");
    
    const { AccountBalanceQuery } = require('@hashgraph/sdk');
    const balanceQuery = new AccountBalanceQuery()
      .setAccountId(operatorId);

    const balance = await balanceQuery.execute(client);
    console.log(`💰 Current HBAR balance: ${balance.hbars.toString()}`);
    
    // Check if we have any tokens
    if (balance.tokens && balance.tokens.size > 0) {
      console.log("🪙 Token balances:");
      for (const [tokenId, tokenBalance] of balance.tokens) {
        console.log(`   ${tokenId}: ${tokenBalance} tokens`);
      }
    } else {
      console.log("🪙 No tokens found in account");
    }

    // Test minting (small amount for testing)
    console.log("\n🪙 Testing token minting...");
    
    const { TokenMintTransaction, Status } = require('@hashgraph/sdk');
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(100); // Mint 100 SMILE

    const mintResponse = await mintTx.execute(client);
    const mintReceipt = await mintResponse.getReceipt(client);

    if (mintReceipt.status === Status.Success) {
      console.log("✅ Successfully minted 100 SMILE tokens");
      console.log(`📊 Transaction ID: ${mintResponse.transactionId}`);
    } else {
      console.log(`❌ Mint transaction failed: ${mintReceipt.status}`);
    }

    // Check balance after minting
    const newBalance = await balanceQuery.execute(client);
    console.log(`💰 New HBAR balance: ${newBalance.hbars.toString()}`);
    console.log(`💰 New Smiles balance: ${newBalance.tokens.get(tokenId).toString()} SMILE`);

    // Test burning (small amount for testing)
    console.log("\n🔥 Testing token burning...");
    
    const { TokenBurnTransaction } = require('@hashgraph/sdk');
    const burnTx = new TokenBurnTransaction()
      .setTokenId(tokenId)
      .setAmount(50); // Burn 50 SMILE

    const burnResponse = await burnTx.execute(client);
    const burnReceipt = await burnResponse.getReceipt(client);

    if (burnReceipt.status === Status.Success) {
      console.log("✅ Successfully burned 50 SMILE tokens");
      console.log(`📊 Transaction ID: ${burnResponse.transactionId}`);
    } else {
      console.log(`❌ Burn transaction failed: ${burnReceipt.status}`);
    }

    // Check final balance
    const finalBalance = await balanceQuery.execute(client);
    console.log(`💰 Final HBAR balance: ${finalBalance.hbars.toString()}`);
    console.log(`💰 Final Smiles balance: ${finalBalance.tokens.get(tokenId).toString()} SMILE`);

    console.log("\n✅ Token service test completed successfully!");
    console.log("📊 Summary:");
    console.log(`   Initial HBAR Balance: ${balance.hbars.toString()}`);
    console.log(`   Initial Smiles Balance: ${balance.tokens.get(tokenId).toString()} SMILE`);
    console.log(`   Minted: +100 SMILE`);
    console.log(`   Burned: -50 SMILE`);
    console.log(`   Final HBAR Balance: ${finalBalance.hbars.toString()}`);
    console.log(`   Final Smiles Balance: ${finalBalance.tokens.get(tokenId).toString()} SMILE`);

  } catch (error) {
    console.error("❌ Error testing token service:", error);
    
    if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\n💡 Solution: Add more HBAR to your account');
    } else if (error.message.includes('TOKEN_NOT_ASSOCIATED_TO_ACCOUNT')) {
      console.error('\n💡 Solution: Account needs to be associated with the token');
    } else if (error.message.includes('INVALID_TOKEN_ID')) {
      console.error('\n💡 Solution: Check your HEDERA_SMILES_TOKEN_ID');
    }
    
    process.exit(1);
  }
}

testTokenService(); 