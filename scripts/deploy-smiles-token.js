const {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  PrivateKey,
  AccountId,
  Hbar,
  TokenMintTransaction,
  TokenAssociateTransaction
} = require("@hashgraph/sdk");
require("dotenv").config({ path: '.env.local' });

async function deploySmilesToken() {
  try {
    console.log("🚀 Deploying Smiles Token...");

    // Validate environment
    const required = ['HEDERA_OPERATOR_ID', 'HEDERA_OPERATOR_PRIVATE_KEY', 'HEDERA_NETWORK'];
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
    
    const client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);

    // Check account balance first
    const { AccountInfoQuery } = require('@hashgraph/sdk');
    const accountInfo = await new AccountInfoQuery()
      .setAccountId(operatorId)
      .execute(client);

    // Parse balance - check if it's in HBAR or tinybars
    const balanceStr = accountInfo.balance.toString();
    let hbarBalance;
    
    if (balanceStr.includes('ℏ')) {
      // Balance is already in HBAR
      const balanceInHbar = balanceStr.split(' ')[0];
      hbarBalance = parseFloat(balanceInHbar);
    } else {
      // Balance is in tinybars, convert to HBAR
      const balanceInTinybars = balanceStr.split(' ')[0];
      hbarBalance = parseFloat(balanceInTinybars) / 100000000;
    }

    console.log(`💰 Current Balance: ${hbarBalance.toFixed(2)} HBAR`);

    if (hbarBalance < 0.5) {
      console.error('❌ Insufficient HBAR balance for token deployment');
      console.error(`   Current: ${hbarBalance.toFixed(2)} HBAR`);
      console.error('   Required: At least 0.5 HBAR');
      
      if (network === 'testnet') {
        console.log('\n💡 Get free testnet HBAR from:');
        console.log('   https://portal.hedera.com/');
        console.log('   Or use the faucet: https://testnet.hedera.com/');
      }
      process.exit(1);
    }

    console.log('✅ Sufficient balance for token deployment');

    // Create token transaction with minimal required fields
    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("Smiles")
      .setTokenSymbol("SMILE")
      .setDecimals(6)
      .setInitialSupply(1000000) // 1M Smiles
      .setTreasuryAccountId(operatorId)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(10000000) // 10M max supply
      .setTokenMemo("SmileUp ImpactChain Reward Token");

    console.log('🔄 Creating token...');
    
    // Execute transaction
    const tokenCreateResponse = await tokenCreateTx.execute(client);
    const tokenCreateReceipt = await tokenCreateResponse.getReceipt(client);
    const tokenId = tokenCreateReceipt.tokenId;

    console.log(`✅ Token created successfully!`);
    console.log(`🪙 Token ID: ${tokenId}`);
    console.log(`📊 Token Name: Smiles (SMILE)`);
    console.log(`💰 Initial Supply: 1,000,000 SMILE`);
    console.log(`🔗 Explorer: https://hashscan.io/${network === 'mainnet' ? '' : 'testnet/'}token/${tokenId}`);

    // Save token ID to environment
    const fs = require('fs');
    const envPath = '.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (!envContent.includes('HEDERA_SMILES_TOKEN_ID')) {
      envContent += `\nHEDERA_SMILES_TOKEN_ID=${tokenId}`;
      fs.writeFileSync(envPath, envContent);
      console.log(`💾 Token ID saved to .env.local`);
    } else {
      // Update existing token ID
      envContent = envContent.replace(
        /HEDERA_SMILES_TOKEN_ID=.*/,
        `HEDERA_SMILES_TOKEN_ID=${tokenId}`
      );
      fs.writeFileSync(envPath, envContent);
      console.log(`💾 Token ID updated in .env.local`);
    }

    // Check final balance
    const finalAccountInfo = await new AccountInfoQuery()
      .setAccountId(operatorId)
      .execute(client);

    const finalBalanceStr = finalAccountInfo.balance.toString();
    let finalHbarBalance;
    
    if (finalBalanceStr.includes('ℏ')) {
      const finalBalanceInHbar = finalBalanceStr.split(' ')[0];
      finalHbarBalance = parseFloat(finalBalanceInHbar);
    } else {
      const finalBalanceInTinybars = finalBalanceStr.split(' ')[0];
      finalHbarBalance = parseFloat(finalBalanceInTinybars) / 100000000;
    }

    console.log(`\n💰 Final Balance: ${finalHbarBalance.toFixed(2)} HBAR`);
    console.log(`💸 Deployment Cost: ${(hbarBalance - finalHbarBalance).toFixed(2)} HBAR`);

    return tokenId;

  } catch (error) {
    console.error("❌ Error deploying token:", error);
    
    if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      console.error('\n💡 Solution: Add more HBAR to your account');
      if (process.env.HEDERA_NETWORK === 'testnet') {
        console.error('   Get free testnet HBAR from: https://portal.hedera.com/');
      }
    } else if (error.message.includes('INVALID_ACCOUNT_ID')) {
      console.error('\n💡 Solution: Check your HEDERA_OPERATOR_ID format');
    } else if (error.message.includes('INVALID_PRIVATE_KEY')) {
      console.error('\n💡 Solution: Check your HEDERA_OPERATOR_PRIVATE_KEY format');
    }
    
    throw error;
  }
}

deploySmilesToken(); 