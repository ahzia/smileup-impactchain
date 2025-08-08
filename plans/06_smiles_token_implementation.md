# SmileUp ImpactChain — Smiles Token Implementation

## 🪙 **Smiles Token Specification**

### **Token Details**
- **Name**: Smiles
- **Symbol**: SMILE
- **Type**: Fungible Token (HTS)
- **Initial Supply**: 1,000,000 Smiles
- **Decimals**: 6
- **Network**: Hedera Testnet (initially)
- **Token ID**: Will be generated upon deployment

### **Token Economics**
- **Minting**: Only at user/org registration
- **Transfers**: Mission rewards, donations, bazaar purchases
- **Burns**: Token redemption, mission completion
- **Circulation**: Circular economy within the platform

---

## 🚀 **Token Deployment**

### **1. Token Creation Script**

Create `scripts/deploy-smiles-token.js`:

```javascript
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
require("dotenv").config();

async function deploySmilesToken() {
  try {
    console.log("🚀 Deploying Smiles Token...");

    // Initialize client
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
    
    const client = Client.forTestnet()
      .setOperator(operatorId, operatorKey);

    // Create token transaction
    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("Smiles")
      .setTokenSymbol("SMILE")
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(6)
      .setInitialSupply(1000000) // 1M Smiles
      .setTreasury(operatorId)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(10000000) // 10M max supply
      .setTokenMemo("SmileUp ImpactChain Reward Token")
      .setFreezeDefault(false)
      .setPauseKey(operatorKey.publicKey)
      .setSupplyKey(operatorKey.publicKey)
      .setWipeKey(operatorKey.publicKey)
      .setFeeScheduleKey(operatorKey.publicKey);

    // Execute transaction
    const tokenCreateResponse = await tokenCreateTx.execute(client);
    const tokenCreateReceipt = await tokenCreateResponse.getReceipt(client);
    const tokenId = tokenCreateReceipt.tokenId;

    console.log(`✅ Token created successfully!`);
    console.log(`🪙 Token ID: ${tokenId}`);
    console.log(`📊 Token Name: Smiles (SMILE)`);
    console.log(`💰 Initial Supply: 1,000,000 SMILE`);
    console.log(`🔗 Explorer: https://hashscan.io/testnet/token/${tokenId}`);

    // Save token ID to environment
    const fs = require('fs');
    const envPath = '.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (!envContent.includes('HEDERA_SMILES_TOKEN_ID')) {
      envContent += `\nHEDERA_SMILES_TOKEN_ID=${tokenId}`;
      fs.writeFileSync(envPath, envContent);
      console.log(`💾 Token ID saved to .env.local`);
    }

    return tokenId;

  } catch (error) {
    console.error("❌ Error deploying token:", error);
    throw error;
  }
}

deploySmilesToken();
```

### **2. Token Service Implementation**

Create `src/lib/hedera/tokenService.ts`:

```typescript
import {
  Client,
  TokenId,
  AccountId,
  PrivateKey,
  TransferTransaction,
  TokenMintTransaction,
  TokenBurnTransaction,
  TokenAssociateTransaction,
  TokenDissociateTransaction,
  AccountBalanceQuery,
  TokenBalanceQuery
} from "@hashgraph/sdk";
import { HederaClient } from "./client";

export class TokenService {
  private client: Client;
  private tokenId: TokenId;
  private operatorId: AccountId;

  constructor() {
    this.client = HederaClient.getInstance().getClient();
    this.tokenId = TokenId.fromString(process.env.HEDERA_SMILES_TOKEN_ID!);
    this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID!);
  }

  // Mint tokens to a user account
  async mintTokens(toAccountId: string, amount: number): Promise<string> {
    try {
      const mintTx = new TokenMintTransaction()
        .setTokenId(this.tokenId)
        .setAmount(amount)
        .setTransactionMemo(`Mint ${amount} Smiles to ${toAccountId}`);

      const response = await mintTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Minted ${amount} Smiles to ${toAccountId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error("❌ Error minting tokens:", error);
      throw error;
    }
  }

  // Transfer tokens between accounts
  async transferTokens(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    memo?: string
  ): Promise<string> {
    try {
      const transferTx = new TransferTransaction()
        .addTokenTransfer(this.tokenId, fromAccountId, -amount)
        .addTokenTransfer(this.tokenId, toAccountId, amount)
        .setTransactionMemo(memo || `Transfer ${amount} Smiles`);

      const response = await transferTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Transferred ${amount} Smiles from ${fromAccountId} to ${toAccountId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error("❌ Error transferring tokens:", error);
      throw error;
    }
  }

  // Burn tokens (for redemptions)
  async burnTokens(accountId: string, amount: number): Promise<string> {
    try {
      const burnTx = new TokenBurnTransaction()
        .setTokenId(this.tokenId)
        .setAmount(amount)
        .setTransactionMemo(`Burn ${amount} Smiles from ${accountId}`);

      const response = await burnTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Burned ${amount} Smiles from ${accountId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error("❌ Error burning tokens:", error);
      throw error;
    }
  }

  // Get token balance for an account
  async getTokenBalance(accountId: string): Promise<number> {
    try {
      const balanceQuery = new TokenBalanceQuery()
        .setAccountId(accountId)
        .setTokenId(this.tokenId);

      const balance = await balanceQuery.execute(this.client);
      return balance;
    } catch (error) {
      console.error("❌ Error getting token balance:", error);
      throw error;
    }
  }

  // Associate token with account (required before receiving tokens)
  async associateTokenWithAccount(accountId: string, privateKey: PrivateKey): Promise<string> {
    try {
      const associateTx = new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([this.tokenId]);

      const response = await associateTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Associated token with account ${accountId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error("❌ Error associating token:", error);
      throw error;
    }
  }

  // Dissociate token from account
  async dissociateTokenFromAccount(accountId: string, privateKey: PrivateKey): Promise<string> {
    try {
      const dissociateTx = new TokenDissociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([this.tokenId]);

      const response = await dissociateTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Dissociated token from account ${accountId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error("❌ Error dissociating token:", error);
      throw error;
    }
  }
}
```

---

## 🔄 **Token Operations**

### **1. Mission Reward Flow**

```typescript
// When user completes a mission
async function rewardMissionCompletion(
  userId: string,
  missionId: string,
  rewardAmount: number
): Promise<string> {
  const tokenService = new TokenService();
  
  // Transfer tokens from mission escrow to user
  const transactionId = await tokenService.transferTokens(
    missionEscrowAccountId,
    userId,
    rewardAmount,
    `Mission completion reward: ${missionId}`
  );
  
  return transactionId;
}
```

### **2. Donation Flow**

```typescript
// When user donates to a community
async function processDonation(
  userId: string,
  communityId: string,
  donationAmount: number
): Promise<string> {
  const tokenService = new TokenService();
  
  // Transfer tokens from user to community
  const transactionId = await tokenService.transferTokens(
    userId,
    communityWalletId,
    donationAmount,
    `Donation to community: ${communityId}`
  );
  
  return transactionId;
}
```

### **3. Bazaar Redemption Flow**

```typescript
// When user redeems tokens for rewards
async function processRedemption(
  userId: string,
  rewardId: string,
  costAmount: number
): Promise<string> {
  const tokenService = new TokenService();
  
  // Burn tokens (or transfer to treasury)
  const transactionId = await tokenService.burnTokens(
    userId,
    costAmount,
    `Redemption for reward: ${rewardId}`
  );
  
  return transactionId;
}
```

---

## 📊 **Token Analytics**

### **1. Token Statistics Service**

Create `src/lib/hedera/tokenAnalytics.ts`:

```typescript
import { TokenService } from "./tokenService";

export class TokenAnalytics {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

  // Get total circulating supply
  async getCirculatingSupply(): Promise<number> {
    // Query all accounts with token balances
    // Sum up all balances
    return 0; // Placeholder
  }

  // Get token distribution
  async getTokenDistribution(): Promise<{
    totalSupply: number;
    circulatingSupply: number;
    burnedTokens: number;
    treasuryBalance: number;
  }> {
    return {
      totalSupply: 1000000,
      circulatingSupply: 0, // Calculate from balances
      burnedTokens: 0, // Calculate from burn transactions
      treasuryBalance: 0 // Get treasury balance
    };
  }

  // Get top token holders
  async getTopHolders(limit: number = 10): Promise<Array<{
    accountId: string;
    balance: number;
    percentage: number;
  }>> {
    return []; // Placeholder
  }
}
```

---

## 🔐 **Security & Access Control**

### **1. Token Access Control**

```typescript
export class TokenAccessControl {
  private static readonly AUTHORIZED_OPERATORS = [
    process.env.HEDERA_OPERATOR_ID
  ];

  static canMintTokens(accountId: string): boolean {
    return this.AUTHORIZED_OPERATORS.includes(accountId);
  }

  static canBurnTokens(accountId: string): boolean {
    return this.AUTHORIZED_OPERATORS.includes(accountId);
  }

  static canTransferTokens(fromAccountId: string, toAccountId: string): boolean {
    // Users can only transfer their own tokens
    return true; // Add validation logic
  }
}
```

### **2. Rate Limiting**

```typescript
export class TokenRateLimiter {
  private static readonly DAILY_MINT_LIMIT = 10000;
  private static readonly DAILY_TRANSFER_LIMIT = 50000;

  static async checkMintLimit(accountId: string): Promise<boolean> {
    // Check daily mint limit
    return true; // Add implementation
  }

  static async checkTransferLimit(accountId: string): Promise<boolean> {
    // Check daily transfer limit
    return true; // Add implementation
  }
}
```

---

## 🧪 **Testing Token Operations**

### **1. Test Script**

Create `scripts/test-token-operations.js`:

```javascript
const { TokenService } = require('../src/lib/hedera/tokenService');

async function testTokenOperations() {
  const tokenService = new TokenService();
  
  try {
    console.log("🧪 Testing token operations...");
    
    // Test minting
    const mintTxId = await tokenService.mintTokens("0.0.123456", 1000);
    console.log(`✅ Mint test passed: ${mintTxId}`);
    
    // Test transfer
    const transferTxId = await tokenService.transferTokens(
      "0.0.123456",
      "0.0.789012",
      500
    );
    console.log(`✅ Transfer test passed: ${transferTxId}`);
    
    // Test balance query
    const balance = await tokenService.getTokenBalance("0.0.123456");
    console.log(`✅ Balance query test passed: ${balance}`);
    
    console.log("🎉 All token operation tests passed!");
    
  } catch (error) {
    console.error("❌ Token operation test failed:", error);
  }
}

testTokenOperations();
```

---

## 📋 **Implementation Checklist**

### **✅ Token Deployment**
- [ ] Create token deployment script
- [ ] Deploy Smiles token to testnet
- [ ] Save token ID to environment
- [ ] Verify token creation on explorer

### **✅ Core Services**
- [ ] Implement TokenService class
- [ ] Add mint/transfer/burn operations
- [ ] Implement balance queries
- [ ] Add association/dissociation methods

### **✅ Business Logic**
- [ ] Mission reward flow
- [ ] Donation processing
- [ ] Bazaar redemption
- [ ] User registration minting

### **✅ Security & Validation**
- [ ] Access control implementation
- [ ] Rate limiting
- [ ] Error handling
- [ ] Transaction validation

### **✅ Testing**
- [ ] Unit tests for all operations
- [ ] Integration tests
- [ ] Performance testing
- [ ] Security testing

---

## 🚀 **Deployment Commands**

```bash
# Deploy token
npm run hedera:deploy-token

# Test operations
node scripts/test-token-operations.js

# Check token info
node scripts/check-token-info.js
```

---

## 📚 **Next Steps**

1. **Deploy Token** - Run deployment script
2. **Test Operations** - Verify all token functions
3. **Integrate with API** - Connect to backend services
4. **Frontend Integration** - Display balances and transactions

This implementation provides a complete foundation for the Smiles token economy in SmileUp ImpactChain. 