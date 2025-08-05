const {
  Client,
  TokenUpdateTransaction,
  AccountId,
  PrivateKey,
  TokenId
} = require("@hashgraph/sdk");
require("dotenv").config({ path: '.env.local' });

async function updateTokenKeys() {
  try {
    console.log("🔧 Updating Smiles Token Keys...");

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
    const tokenId = TokenId.fromString(process.env.HEDERA_SMILES_TOKEN_ID);
    
    const client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);

    console.log(`🪙 Token ID: ${tokenId.toString()}`);
    console.log(`📊 Account ID: ${operatorId.toString()}`);

    // Update token with supply key
    const updateTx = new TokenUpdateTransaction()
      .setTokenId(tokenId)
      .setSupplyKey(operatorKey.publicKey);

    console.log('🔄 Updating token with supply key...');
    
    const updateResponse = await updateTx.execute(client);
    const updateReceipt = await updateResponse.getReceipt(client);

    console.log(`✅ Token updated successfully!`);
    console.log(`📊 Transaction ID: ${updateResponse.transactionId}`);
    console.log(`🔑 Supply key added: ${operatorKey.publicKey.toString()}`);

    console.log('\n🎉 Token is now ready for minting and burning operations!');

  } catch (error) {
    console.error("❌ Error updating token keys:", error);
    
    if (error.message.includes('TOKEN_IS_IMMUTABLE')) {
      console.error('\n💡 Solution: Token was created as immutable');
      console.error('   You need to create a new token with the correct keys');
    } else if (error.message.includes('INVALID_TOKEN_ID')) {
      console.error('\n💡 Solution: Check your HEDERA_SMILES_TOKEN_ID');
    }
    
    throw error;
  }
}

updateTokenKeys(); 