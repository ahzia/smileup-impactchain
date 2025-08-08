# SmileUp ImpactChain — Hedera Setup Guide

## 🚀 **Environment Configuration**

### **1. Environment Variables Setup**

Your `.env.local` file should contain the following Hedera credentials:

```bash
# Hedera Network Configuration
HEDERA_NETWORK=testnet  # or mainnet for production
HEDERA_OPERATOR_ID=0.0.123456  # Your Account ID
HEDERA_OPERATOR_PRIVATE_KEY=302e020100300506032b657004220420...  # DER Encoded Private Key
HEDERA_OPERATOR_PUBLIC_KEY=302a300506032b6570032100...  # DER Encoded Public Key

# Optional: Additional Configuration
HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
HEDERA_EXPLORER_URL=https://hashscan.io/testnet
```

### **2. Network Selection**

| **Network** | **Purpose** | **URL** | **Explorer** |
|-------------|-------------|---------|--------------|
| **testnet** | Development & Testing | `https://testnet.mirrornode.hedera.com` | `https://hashscan.io/testnet` |
| **mainnet** | Production | `https://mainnet.mirrornode.hedera.com` | `https://hashscan.io` |

---

## 📦 **Dependencies Installation**

### **1. Install Hedera SDK**

```bash
npm install @hashgraph/sdk
```

### **2. Install Additional Dependencies**

```bash
# For environment management
npm install dotenv

# For crypto operations (if needed)
npm install crypto-js

# For transaction monitoring
npm install @hashgraph/sdk/lib/TransactionReceiptQuery
```

### **3. Update package.json**

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "hedera:setup": "node scripts/setup-hedera.js",
    "hedera:deploy-token": "node scripts/deploy-smiles-token.js",
    "hedera:test": "node scripts/test-hedera-connection.js"
  }
}
```

---

## 🔧 **Hedera Client Configuration**

### **1. Create Hedera Client Service**

Create `src/lib/hedera/client.ts`:

```typescript
import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

export class HederaClient {
  private static instance: HederaClient;
  private client: Client;

  private constructor() {
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID!);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY!);

    this.client = Client.forTestnet() // or forMainnet()
      .setOperator(operatorId, operatorKey);
  }

  public static getInstance(): HederaClient {
    if (!HederaClient.instance) {
      HederaClient.instance = new HederaClient();
    }
    return HederaClient.instance;
  }

  public getClient(): Client {
    return this.client;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const accountId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID!);
      const accountInfo = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(this.client);
      
      console.log("✅ Hedera connection successful");
      console.log(`Account Balance: ${accountInfo.balance} tinybars`);
      return true;
    } catch (error) {
      console.error("❌ Hedera connection failed:", error);
      return false;
    }
  }
}
```

### **2. Environment Validation Script**

Create `scripts/validate-env.js`:

```javascript
const dotenv = require('dotenv');
dotenv.config();

function validateEnvironment() {
  const required = [
    'HEDERA_OPERATOR_ID',
    'HEDERA_OPERATOR_PRIVATE_KEY',
    'HEDERA_OPERATOR_PUBLIC_KEY',
    'HEDERA_NETWORK'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
  
  // Validate Account ID format
  const accountId = process.env.HEDERA_OPERATOR_ID;
  if (!accountId.match(/^\d+\.\d+\.\d+$/)) {
    console.error('❌ Invalid HEDERA_OPERATOR_ID format. Expected: 0.0.123456');
    process.exit(1);
  }

  console.log('✅ Account ID format is valid');
}
```

---

## 🧪 **Testing Setup**

### **1. Connection Test Script**

Create `scripts/test-hedera-connection.js`:

```javascript
const { HederaClient } = require('../src/lib/hedera/client');

async function testHederaConnection() {
  try {
    console.log('🔗 Testing Hedera connection...');
    
    const hederaClient = HederaClient.getInstance();
    const isConnected = await hederaClient.testConnection();
    
    if (isConnected) {
      console.log('✅ Hedera connection test passed');
    } else {
      console.log('❌ Hedera connection test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing Hedera connection:', error);
    process.exit(1);
  }
}

testHederaConnection();
```

### **2. Account Balance Check**

Create `scripts/check-balance.js`:

```javascript
const { Client, AccountId, AccountInfoQuery } = require('@hashgraph/sdk');
require('dotenv').config();

async function checkBalance() {
  try {
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY);
    
    const client = Client.forTestnet()
      .setOperator(operatorId, operatorKey);

    const accountInfo = await new AccountInfoQuery()
      .setAccountId(operatorId)
      .execute(client);

    console.log(`💰 Account Balance: ${accountInfo.balance} tinybars`);
    console.log(`📊 Account ID: ${operatorId.toString()}`);
    
    // Convert to HBAR for readability
    const hbarBalance = accountInfo.balance / 100000000;
    console.log(`💎 HBAR Balance: ${hbarBalance} HBAR`);
    
  } catch (error) {
    console.error('❌ Error checking balance:', error);
  }
}

checkBalance();
```

---

## 🔐 **Security Best Practices**

### **1. Key Management**

```typescript
// Never log private keys
const privateKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
if (!privateKey) {
  throw new Error('HEDERA_OPERATOR_PRIVATE_KEY not found in environment');
}

// Use environment-specific keys
const network = process.env.HEDERA_NETWORK || 'testnet';
const client = network === 'mainnet' 
  ? Client.forMainnet() 
  : Client.forTestnet();
```

### **2. Error Handling**

```typescript
export class HederaError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'HederaError';
  }
}

export function handleHederaError(error: any): never {
  if (error.message.includes('INSUFFICIENT_PAYER_BALANCE')) {
    throw new HederaError('Insufficient account balance', 'INSUFFICIENT_BALANCE');
  }
  if (error.message.includes('INVALID_ACCOUNT_ID')) {
    throw new HederaError('Invalid account ID', 'INVALID_ACCOUNT');
  }
  throw new HederaError(`Hedera operation failed: ${error.message}`);
}
```

---

## 📋 **Setup Checklist**

### **✅ Environment Setup**
- [ ] Create `.env.local` with Hedera credentials
- [ ] Validate environment variables
- [ ] Test network connection
- [ ] Verify account balance

### **✅ Dependencies**
- [ ] Install `@hashgraph/sdk`
- [ ] Install additional crypto packages
- [ ] Update `package.json` scripts
- [ ] Test imports and basic functionality

### **✅ Configuration**
- [ ] Create Hedera client service
- [ ] Set up environment validation
- [ ] Configure network selection
- [ ] Implement error handling

### **✅ Testing**
- [ ] Test connection to Hedera network
- [ ] Verify account balance and permissions
- [ ] Test basic SDK operations
- [ ] Validate error handling

---

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
npm install @hashgraph/sdk dotenv

# 2. Validate environment
node scripts/validate-env.js

# 3. Test connection
node scripts/test-hedera-connection.js

# 4. Check balance
node scripts/check-balance.js

# 5. Run setup (if needed)
npm run hedera:setup
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

| **Issue** | **Solution** |
|-----------|-------------|
| Invalid Account ID | Check format: `0.0.123456` |
| Invalid Private Key | Ensure DER encoding is correct |
| Insufficient Balance | Add HBAR to testnet account |
| Network Connection | Verify network URL and credentials |

### **Debug Commands**

```bash
# Check environment variables
node -e "console.log(process.env.HEDERA_OPERATOR_ID)"

# Test network connectivity
curl https://testnet.mirrornode.hedera.com/api/v1/status

# Validate account format
node -e "console.log(/^\d+\.\d+\.\d+$/.test('0.0.123456'))"
```

---

## 📚 **Next Steps**

1. **Verify Setup** - Run all test scripts
2. **Create Token** - Deploy Smiles token contract
3. **Implement Services** - Build HTS/HCS operations
4. **Frontend Integration** - Connect wallet and display data

This setup guide ensures a solid foundation for Hedera integration in SmileUp ImpactChain. 