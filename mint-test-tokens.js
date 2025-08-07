require('dotenv').config({ path: './.env.local' });

const { Client } = require('@hashgraph/sdk');

async function mintTestTokens() {
  try {
    console.log('🔍 Setting up Hedera client...');
    
    // Initialize Hedera client
    const client = Client.forTestnet();
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
    const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
    
    if (!operatorId || !operatorKey || !tokenId) {
      throw new Error('Missing required Hedera environment variables');
    }
    
    client.setOperator(operatorId, operatorKey);
    
    console.log('✅ Hedera client initialized');
    console.log('🔑 Operator ID:', operatorId);
    console.log('🪙 Token ID:', tokenId);
    
    // Import TokenService
    const { TokenService } = require('./src/lib/hedera/tokenService');
    const tokenService = new TokenService(client, tokenId, operatorId, operatorKey);
    
    // For now, let's just test the token service
    console.log('🧪 Testing token service...');
    
    // Get operator balance
    const operatorBalance = await tokenService.getTokenBalance();
    console.log('💰 Operator balance:', operatorBalance, 'Smiles');
    
    // Test minting to operator account
    console.log('🪙 Minting 1000 Smiles tokens to operator...');
    const mintResult = await tokenService.mintTokens(1000);
    
    if (mintResult.success) {
      console.log('✅ Successfully minted 1000 Smiles tokens!');
      console.log('📊 Transaction ID:', mintResult.transactionId);
      
      // Get updated balance
      const newBalance = await tokenService.getTokenBalance();
      console.log('💰 New operator balance:', newBalance, 'Smiles');
      
    } else {
      console.error('❌ Failed to mint tokens:', mintResult.error);
    }

  } catch (error) {
    console.error('❌ Error minting tokens:', error);
  }
}

mintTestTokens(); 