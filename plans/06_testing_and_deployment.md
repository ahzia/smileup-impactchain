# SmileUp ImpactChain — Testing & Deployment Guide

## 🎯 **Testing Strategy Overview**

SmileUp ImpactChain requires comprehensive testing across multiple layers: unit tests for blockchain services, integration tests for API endpoints, and end-to-end tests for complete user flows.

### **Testing Layers**
- **Unit Tests**: Individual service functions
- **Integration Tests**: API endpoints and database interactions
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load testing and optimization
- **Security Tests**: Vulnerability assessment

---

## 🧪 **Unit Testing**

### **1. Test Setup**

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### **2. Token Service Tests**

Create `src/lib/hedera/__tests__/tokenService.test.ts`:

```typescript
import { TokenService } from '../tokenService';
import { HederaClient } from '../client';

// Mock Hedera SDK
jest.mock('@hashgraph/sdk', () => ({
  Client: {
    forTestnet: jest.fn(() => ({
      setOperator: jest.fn().mockReturnThis(),
    })),
  },
  TokenId: {
    fromString: jest.fn(),
  },
  AccountId: {
    fromString: jest.fn(),
  },
  TokenMintTransaction: jest.fn(() => ({
    setTokenId: jest.fn().mockReturnThis(),
    setAmount: jest.fn().mockReturnThis(),
    setTransactionMemo: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
  TransferTransaction: jest.fn(() => ({
    addTokenTransfer: jest.fn().mockReturnThis(),
    setTransactionMemo: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
  TokenBurnTransaction: jest.fn(() => ({
    setTokenId: jest.fn().mockReturnThis(),
    setAmount: jest.fn().mockReturnThis(),
    setTransactionMemo: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
  TokenBalanceQuery: jest.fn(() => ({
    setAccountId: jest.fn().mockReturnThis(),
    setTokenId: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  })),
}));

describe('TokenService', () => {
  let tokenService: TokenService;
  let mockClient: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.HEDERA_SMILES_TOKEN_ID = '0.0.123456';
    process.env.HEDERA_OPERATOR_ID = '0.0.123456';
    
    tokenService = new TokenService();
    mockClient = {
      execute: jest.fn(),
    };
  });

  describe('mintTokens', () => {
    it('should mint tokens successfully', async () => {
      const mockResponse = {
        transactionId: '0.0.123456@1234567890.123456789',
      };
      const mockReceipt = {
        status: 'SUCCESS',
      };

      const { TokenMintTransaction } = require('@hashgraph/sdk');
      const mockMintTransaction = TokenMintTransaction();
      mockMintTransaction.execute.mockResolvedValue(mockResponse);
      mockResponse.getReceipt = jest.fn().mockResolvedValue(mockReceipt);

      const result = await tokenService.mintTokens('0.0.123456', 1000);

      expect(result).toBe('0.0.123456@1234567890.123456789');
      expect(mockMintTransaction.setTokenId).toHaveBeenCalledWith('0.0.123456');
      expect(mockMintTransaction.setAmount).toHaveBeenCalledWith(1000);
    });

    it('should handle minting errors', async () => {
      const { TokenMintTransaction } = require('@hashgraph/sdk');
      const mockMintTransaction = TokenMintTransaction();
      mockMintTransaction.execute.mockRejectedValue(new Error('Minting failed'));

      await expect(tokenService.mintTokens('0.0.123456', 1000))
        .rejects.toThrow('Minting failed');
    });
  });

  describe('transferTokens', () => {
    it('should transfer tokens successfully', async () => {
      const mockResponse = {
        transactionId: '0.0.123456@1234567890.123456789',
      };
      const mockReceipt = {
        status: 'SUCCESS',
      };

      const { TransferTransaction } = require('@hashgraph/sdk');
      const mockTransferTransaction = TransferTransaction();
      mockTransferTransaction.execute.mockResolvedValue(mockResponse);
      mockResponse.getReceipt = jest.fn().mockResolvedValue(mockReceipt);

      const result = await tokenService.transferTokens(
        '0.0.123456',
        '0.0.789012',
        500,
        'Test transfer'
      );

      expect(result).toBe('0.0.123456@1234567890.123456789');
      expect(mockTransferTransaction.addTokenTransfer).toHaveBeenCalledWith(
        '0.0.123456',
        '0.0.123456',
        -500
      );
      expect(mockTransferTransaction.addTokenTransfer).toHaveBeenCalledWith(
        '0.0.123456',
        '0.0.789012',
        500
      );
    });
  });

  describe('getTokenBalance', () => {
    it('should return token balance', async () => {
      const mockBalance = 1000;

      const { TokenBalanceQuery } = require('@hashgraph/sdk');
      const mockBalanceQuery = TokenBalanceQuery();
      mockBalanceQuery.execute.mockResolvedValue(mockBalance);

      const result = await tokenService.getTokenBalance('0.0.123456');

      expect(result).toBe(1000);
      expect(mockBalanceQuery.setAccountId).toHaveBeenCalledWith('0.0.123456');
      expect(mockBalanceQuery.setTokenId).toHaveBeenCalledWith('0.0.123456');
    });
  });
});
```

### **3. Mission Proof Service Tests**

Create `src/lib/hedera/__tests__/missionProofService.test.ts`:

```typescript
import { MissionProofService } from '../missionProofService';
import { HCSService } from '../hcsService';
import { TokenService } from '../tokenService';

// Mock dependencies
jest.mock('../hcsService');
jest.mock('../tokenService');

describe('MissionProofService', () => {
  let missionProofService: MissionProofService;
  let mockHcsService: jest.Mocked<HCSService>;
  let mockTokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockHcsService = new HCSService() as jest.Mocked<HCSService>;
    mockTokenService = new TokenService() as jest.Mocked<TokenService>;
    
    missionProofService = new MissionProofService();
  });

  describe('logMissionCompletion', () => {
    it('should log mission completion successfully', async () => {
      const proof = {
        missionId: 'mission-123',
        userId: 'user-456',
        communityId: 'community-789',
        completionDate: new Date().toISOString(),
        proofType: 'photo' as const,
        proofData: 'base64-image-data',
        rewardAmount: 100
      };

      mockHcsService.submitMessage.mockResolvedValue('hcs-tx-id');
      mockTokenService.transferTokens.mockResolvedValue('token-tx-id');

      const result = await missionProofService.logMissionCompletion(proof);

      expect(result).toBe('hcs-tx-id');
      expect(mockHcsService.submitMessage).toHaveBeenCalledWith(
        'mission-completion',
        expect.objectContaining({
          type: 'mission-completion',
          data: proof
        }),
        'Mission completion: mission-123'
      );
      expect(mockTokenService.transferTokens).toHaveBeenCalledWith(
        'community-789',
        'user-456',
        100,
        'Mission reward: mission-123'
      );
    });

    it('should handle mission completion errors', async () => {
      const proof = {
        missionId: 'mission-123',
        userId: 'user-456',
        communityId: 'community-789',
        completionDate: new Date().toISOString(),
        proofType: 'photo' as const,
        proofData: 'base64-image-data',
        rewardAmount: 100
      };

      mockHcsService.submitMessage.mockRejectedValue(new Error('HCS error'));

      await expect(missionProofService.logMissionCompletion(proof))
        .rejects.toThrow('HCS error');
    });
  });

  describe('logDonation', () => {
    it('should log donation successfully', async () => {
      const donationData = {
        userId: 'user-456',
        communityId: 'community-789',
        amount: 50,
        message: 'Supporting the cause!'
      };

      mockHcsService.submitMessage.mockResolvedValue('hcs-tx-id');

      const result = await missionProofService.logDonation(donationData);

      expect(result).toBe('hcs-tx-id');
      expect(mockHcsService.submitMessage).toHaveBeenCalledWith(
        'donation',
        expect.objectContaining({
          type: 'donation',
          data: donationData
        }),
        'Donation: user-456 -> community-789'
      );
    });
  });
});
```

---

## 🔗 **Integration Testing**

### **1. API Integration Tests**

Create `src/app/api/__tests__/missions.test.ts`:

```typescript
import { NextRequest } from 'next/server';
import { POST } from '../missions/[id]/complete/route';
import { MissionProofService } from '@/lib/hedera/missionProofService';

// Mock dependencies
jest.mock('@/lib/hedera/missionProofService');

describe('Mission Completion API', () => {
  let mockMissionProofService: jest.Mocked<MissionProofService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMissionProofService = new MissionProofService() as jest.Mocked<MissionProofService>;
  });

  it('should complete mission successfully', async () => {
    const requestBody = {
      userId: 'user-456',
      communityId: 'community-789',
      proofType: 'photo',
      proofData: 'base64-image-data',
      rewardAmount: 100
    };

    const request = new NextRequest('http://localhost:3000/api/missions/mission-123/complete', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    mockMissionProofService.logMissionCompletion.mockResolvedValue('tx-id-123');

    const response = await POST(request, { params: { id: 'mission-123' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.transactionId).toBe('tx-id-123');
    expect(mockMissionProofService.logMissionCompletion).toHaveBeenCalledWith(
      expect.objectContaining({
        missionId: 'mission-123',
        userId: 'user-456',
        communityId: 'community-789',
        proofType: 'photo',
        proofData: 'base64-image-data',
        rewardAmount: 100
      })
    );
  });

  it('should handle mission completion errors', async () => {
    const requestBody = {
      userId: 'user-456',
      communityId: 'community-789',
      proofType: 'photo',
      proofData: 'base64-image-data',
      rewardAmount: 100
    };

    const request = new NextRequest('http://localhost:3000/api/missions/mission-123/complete', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    mockMissionProofService.logMissionCompletion.mockRejectedValue(
      new Error('Mission completion failed')
    );

    const response = await POST(request, { params: { id: 'mission-123' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to complete mission');
  });
});
```

### **2. Wallet Integration Tests**

Create `src/lib/wallet/__tests__/walletService.test.ts`:

```typescript
import { WalletService } from '../walletService';

// Mock HashPack connector
jest.mock('@hashpack/connect', () => ({
  HashPackConnector: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    getBalance: jest.fn(),
    getTokenBalance: jest.fn(),
    transferTokens: jest.fn(),
    getTransactionHistory: jest.fn(),
    on: jest.fn(),
  })),
}));

describe('WalletService', () => {
  let walletService: WalletService;
  let mockConnector: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID = '0.0.123456';
    
    walletService = new WalletService();
    mockConnector = walletService['connector'];
  });

  describe('connect', () => {
    it('should connect wallet successfully', async () => {
      const mockResult = {
        success: true,
        accountId: '0.0.123456'
      };

      mockConnector.connect.mockResolvedValue(mockResult);
      mockConnector.getBalance.mockResolvedValue(1000);
      mockConnector.getTokenBalance.mockResolvedValue(500);

      const result = await walletService.connect();

      expect(result.isConnected).toBe(true);
      expect(result.accountId).toBe('0.0.123456');
      expect(result.balance.hbar).toBe(1000);
      expect(result.balance.smiles).toBe(500);
    });

    it('should handle connection failure', async () => {
      const mockResult = {
        success: false,
        error: 'Connection failed'
      };

      mockConnector.connect.mockResolvedValue(mockResult);

      const result = await walletService.connect();

      expect(result.isConnected).toBe(false);
      expect(result.accountId).toBeNull();
    });
  });

  describe('transferSmiles', () => {
    it('should transfer Smiles successfully', async () => {
      // Set up connected state
      walletService['state'] = {
        isConnected: true,
        accountId: '0.0.123456',
        balance: { hbar: 1000, smiles: 500 },
        transactions: []
      };

      const mockTransaction = {
        id: 'tx-id-123'
      };

      mockConnector.transferTokens.mockResolvedValue(mockTransaction);
      mockConnector.getBalance.mockResolvedValue(1000);
      mockConnector.getTokenBalance.mockResolvedValue(400);

      const result = await walletService.transferSmiles('0.0.789012', 100, 'Test transfer');

      expect(result).toBe('tx-id-123');
      expect(mockConnector.transferTokens).toHaveBeenCalledWith({
        tokenId: '0.0.123456',
        from: '0.0.123456',
        to: '0.0.789012',
        amount: 100,
        memo: 'Test transfer'
      });
    });

    it('should throw error when wallet not connected', async () => {
      await expect(walletService.transferSmiles('0.0.789012', 100))
        .rejects.toThrow('Wallet not connected');
    });
  });
});
```

---

## 🚀 **E2E Testing**

### **1. Playwright Setup**

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **2. E2E Test Examples**

Create `e2e/wallet-integration.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Wallet Integration', () => {
  test('should connect wallet successfully', async ({ page }) => {
    await page.goto('/');
    
    // Click connect wallet button
    await page.click('[data-testid="connect-wallet"]');
    
    // Wait for HashPack popup
    await page.waitForSelector('[data-testid="hashpack-modal"]');
    
    // Mock wallet connection
    await page.evaluate(() => {
      window.mockWalletConnection = {
        success: true,
        accountId: '0.0.123456'
      };
    });
    
    // Click connect in modal
    await page.click('[data-testid="hashpack-connect"]');
    
    // Verify wallet is connected
    await expect(page.locator('[data-testid="wallet-address"]')).toContainText('0.0.123456');
    await expect(page.locator('[data-testid="smiles-balance"]')).toBeVisible();
  });

  test('should transfer Smiles tokens', async ({ page }) => {
    // Setup: Connect wallet first
    await page.goto('/');
    await page.click('[data-testid="connect-wallet"]');
    await page.waitForSelector('[data-testid="hashpack-modal"]');
    await page.click('[data-testid="hashpack-connect"]');
    
    // Navigate to profile page
    await page.click('[data-testid="profile-tab"]');
    
    // Click transfer button
    await page.click('[data-testid="transfer-smiles"]');
    
    // Fill transfer form
    await page.fill('[data-testid="recipient-address"]', '0.0.789012');
    await page.fill('[data-testid="transfer-amount"]', '50');
    await page.fill('[data-testid="transfer-memo"]', 'Test transfer');
    
    // Submit transfer
    await page.click('[data-testid="submit-transfer"]');
    
    // Verify transaction success
    await expect(page.locator('[data-testid="transaction-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-id"]')).toContainText('0.0.');
  });

  test('should complete mission and earn rewards', async ({ page }) => {
    await page.goto('/missions');
    
    // Find a mission to complete
    await page.click('[data-testid="mission-card"]:first-child');
    
    // Click accept mission
    await page.click('[data-testid="accept-mission"]');
    
    // Upload proof
    await page.setInputFiles('[data-testid="proof-upload"]', 'e2e/fixtures/proof-image.jpg');
    
    // Submit completion
    await page.click('[data-testid="complete-mission"]');
    
    // Verify mission completion
    await expect(page.locator('[data-testid="mission-completed"]')).toBeVisible();
    await expect(page.locator('[data-testid="reward-earned"]')).toContainText('100');
  });
});
```

---

## 📊 **Performance Testing**

### **1. Load Testing Setup**

Create `tests/load/loadTest.ts`:

```typescript
import { check, group } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  group('API Endpoints', () => {
    // Test feed API
    const feedResponse = http.get(`${BASE_URL}/api/feed`);
    check(feedResponse, {
      'feed status is 200': (r) => r.status === 200,
      'feed response time < 500ms': (r) => r.timings.duration < 500,
    });

    // Test missions API
    const missionsResponse = http.get(`${BASE_URL}/api/missions`);
    check(missionsResponse, {
      'missions status is 200': (r) => r.status === 200,
      'missions response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    // Test wallet balance API
    const balanceResponse = http.get(`${BASE_URL}/api/wallet/balance?accountId=0.0.123456`);
    check(balanceResponse, {
      'balance status is 200': (r) => r.status === 200,
      'balance response time < 2000ms': (r) => r.timings.duration < 2000,
    });
  });

  group('Blockchain Operations', () => {
    // Test transaction status
    const txStatusResponse = http.get(`${BASE_URL}/api/transactions/status/0.0.123456@1234567890.123456789`);
    check(txStatusResponse, {
      'transaction status is 200': (r) => r.status === 200,
      'transaction status response time < 3000ms': (r) => r.timings.duration < 3000,
    });
  });
}
```

### **2. Run Load Tests**

```bash
# Install k6
npm install -g k6

# Run load test
k6 run tests/load/loadTest.ts
```

---

## 🔐 **Security Testing**

### **1. Security Test Suite**

Create `tests/security/securityTests.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Security Tests', () => {
  test('should not expose sensitive environment variables', async ({ page }) => {
    await page.goto('/');
    
    // Check that private keys are not exposed in client-side code
    const pageContent = await page.content();
    expect(pageContent).not.toContain('HEDERA_OPERATOR_PRIVATE_KEY');
    expect(pageContent).not.toContain('HEDERA_OPERATOR_PUBLIC_KEY');
  });

  test('should validate transaction inputs', async ({ page }) => {
    await page.goto('/profile');
    
    // Try to transfer negative amount
    await page.click('[data-testid="transfer-smiles"]');
    await page.fill('[data-testid="transfer-amount"]', '-100');
    await page.click('[data-testid="submit-transfer"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
  });

  test('should prevent unauthorized token transfers', async ({ page }) => {
    await page.goto('/api/wallet/transfer');
    
    // Try to transfer without authentication
    const response = await page.request.post('/api/wallet/transfer', {
      data: {
        to: '0.0.789012',
        amount: 100
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('should validate wallet addresses', async ({ page }) => {
    await page.goto('/profile');
    
    // Try to transfer to invalid address
    await page.click('[data-testid="transfer-smiles"]');
    await page.fill('[data-testid="recipient-address"]', 'invalid-address');
    await page.click('[data-testid="submit-transfer"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="address-error"]')).toBeVisible();
  });
});
```

---

## 🚀 **Deployment**

### **1. Production Environment Setup**

Create `.env.production`:

```bash
# Production Environment Variables
NODE_ENV=production
HEDERA_NETWORK=mainnet
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_OPERATOR_PUBLIC_KEY=302a300506032b6570032100...
HEDERA_SMILES_TOKEN_ID=0.0.123456

# Frontend Environment Variables
NEXT_PUBLIC_HEDERA_NETWORK=mainnet
NEXT_PUBLIC_HASHPACK_PROJECT_ID=smileup-impactchain
NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID=0.0.123456

# Database
DATABASE_URL=postgresql://user:password@host:5432/smileup_prod

# Redis
REDIS_URL=redis://host:6379

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

### **2. Deployment Script**

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying SmileUp ImpactChain..."

# Check environment
if [ -z "$HEDERA_OPERATOR_ID" ]; then
  echo "❌ HEDERA_OPERATOR_ID not set"
  exit 1
fi

if [ -z "$HEDERA_OPERATOR_PRIVATE_KEY" ]; then
  echo "❌ HEDERA_OPERATOR_PRIVATE_KEY not set"
  exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Run E2E tests
echo "🔗 Running E2E tests..."
npm run test:e2e
if [ $? -ne 0 ]; then
  echo "❌ E2E tests failed"
  exit 1
fi

# Build application
echo "🏗️ Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
```

### **3. CI/CD Pipeline**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy SmileUp ImpactChain

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 📋 **Testing Checklist**

### **✅ Unit Tests**
- [ ] Token service functions
- [ ] Mission proof service
- [ ] Wallet service
- [ ] Transaction management
- [ ] Error handling

### **✅ Integration Tests**
- [ ] API endpoints
- [ ] Database interactions
- [ ] Blockchain operations
- [ ] Wallet integration

### **✅ E2E Tests**
- [ ] User registration flow
- [ ] Mission completion flow
- [ ] Token transfer flow
- [ ] Wallet connection flow

### **✅ Performance Tests**
- [ ] Load testing
- [ ] Stress testing
- [ ] Endurance testing
- [ ] Spike testing

### **✅ Security Tests**
- [ ] Input validation
- [ ] Authentication
- [ ] Authorization
- [ ] Data exposure

### **✅ Deployment**
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring setup
- [ ] Rollback procedures

---

## 🚀 **Quick Start Commands**

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run load tests
npm run test:load

# Run security tests
npm run test:security

# Deploy to production
npm run deploy
```

---

## 📚 **Next Steps**

1. **Set Up Testing Environment** - Configure Jest and Playwright
2. **Write Test Cases** - Implement comprehensive test coverage
3. **Set Up CI/CD** - Configure automated testing and deployment
4. **Monitor Performance** - Add monitoring and alerting

This testing and deployment guide ensures reliable and secure blockchain operations for SmileUp ImpactChain. 