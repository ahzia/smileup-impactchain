# SmileUp ImpactChain — Transaction Management

## 🎯 **Transaction Management Overview**

The Transaction Management system handles all blockchain operations with proper error handling, retry mechanisms, and monitoring. It ensures reliable execution of Hedera transactions while maintaining data consistency.

### **Transaction Types**
- **Token Transfers**: Smiles token movements
- **Token Minting**: New token creation
- **Token Burning**: Token destruction
- **HCS Messages**: Proof logging
- **Account Operations**: Wallet management

---

## 🏗️ **Transaction Service Architecture**

### **1. Core Transaction Service**

Create `src/lib/hedera/transactionService.ts`:

```typescript
import {
  Client,
  TransactionId,
  TransactionReceipt,
  TransactionResponse,
  Status,
  PrecheckStatus,
  ReceiptStatus
} from "@hashgraph/sdk";
import { HederaClient } from "./client";

export interface TransactionResult {
  success: boolean;
  transactionId: string;
  receipt?: TransactionReceipt;
  error?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  gasUsed?: number;
  cost?: number;
}

export interface TransactionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  memo?: string;
}

export class TransactionService {
  private client: Client;
  private defaultOptions: Required<TransactionOptions> = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
    memo: 'SmileUp transaction'
  };

  constructor() {
    this.client = HederaClient.getInstance().getClient();
  }

  // Execute transaction with retry logic
  async executeTransaction(
    transaction: any,
    options: TransactionOptions = {}
  ): Promise<TransactionResult> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        console.log(`🔄 Executing transaction (attempt ${attempt}/${config.maxRetries})`);

        // Set transaction memo
        if (config.memo) {
          transaction.setTransactionMemo(config.memo);
        }

        // Execute transaction
        const response: TransactionResponse = await transaction.execute(this.client);
        const transactionId = response.transactionId.toString();

        console.log(`✅ Transaction submitted: ${transactionId}`);

        // Wait for receipt
        const receipt = await this.waitForReceipt(response, config.timeout);

        if (receipt.status === Status.Success) {
          console.log(`✅ Transaction successful: ${transactionId}`);
          return {
            success: true,
            transactionId,
            receipt,
            status: 'success',
            timestamp: new Date().toISOString(),
            gasUsed: receipt.gasUsed,
            cost: receipt.gasUsed ? receipt.gasUsed * 0.0001 : undefined
          };
        } else {
          throw new Error(`Transaction failed with status: ${receipt.status}`);
        }

      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Transaction attempt ${attempt} failed:`, error);

        if (attempt < config.maxRetries) {
          console.log(`⏳ Retrying in ${config.retryDelay}ms...`);
          await this.delay(config.retryDelay);
        }
      }
    }

    return {
      success: false,
      transactionId: 'unknown',
      error: lastError?.message || 'Transaction failed after all retries',
      status: 'failed',
      timestamp: new Date().toISOString()
    };
  }

  // Wait for transaction receipt
  private async waitForReceipt(
    response: TransactionResponse,
    timeout: number
  ): Promise<TransactionReceipt> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const receipt = await response.getReceipt(this.client);
        
        if (receipt.status !== Status.Unknown) {
          return receipt;
        }
      } catch (error) {
        // Receipt not ready yet, continue waiting
      }

      await this.delay(1000); // Wait 1 second before next check
    }

    throw new Error('Transaction receipt timeout');
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get transaction status
  async getTransactionStatus(transactionId: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    receipt?: TransactionReceipt;
    error?: string;
  }> {
    try {
      const txId = TransactionId.fromString(transactionId);
      const receipt = await new TransactionReceiptQuery()
        .setTransactionId(txId)
        .execute(this.client);

      if (receipt.status === Status.Success) {
        return { status: 'success', receipt };
      } else {
        return { status: 'failed', error: `Status: ${receipt.status}` };
      }
    } catch (error) {
      return { status: 'pending', error: (error as Error).message };
    }
  }

  // Get transaction details
  async getTransactionDetails(transactionId: string): Promise<{
    transactionId: string;
    status: string;
    timestamp: string;
    gasUsed?: number;
    cost?: number;
    memo?: string;
  }> {
    try {
      const txId = TransactionId.fromString(transactionId);
      const receipt = await new TransactionReceiptQuery()
        .setTransactionId(txId)
        .execute(this.client);

      return {
        transactionId,
        status: receipt.status.toString(),
        timestamp: receipt.timestamp?.toString() || new Date().toISOString(),
        gasUsed: receipt.gasUsed,
        cost: receipt.gasUsed ? receipt.gasUsed * 0.0001 : undefined,
        memo: receipt.memo
      };
    } catch (error) {
      throw new Error(`Failed to get transaction details: ${error}`);
    }
  }
}
```

---

## 🔄 **Transaction Queue Management**

### **1. Transaction Queue Service**

Create `src/lib/hedera/transactionQueue.ts`:

```typescript
import { TransactionService, TransactionResult, TransactionOptions } from './transactionService';

export interface QueuedTransaction {
  id: string;
  type: string;
  transaction: any;
  options: TransactionOptions;
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: TransactionResult;
  retryCount: number;
}

export class TransactionQueue {
  private queue: QueuedTransaction[] = [];
  private processing: boolean = false;
  private transactionService: TransactionService;
  private maxConcurrent: number = 5;
  private activeTransactions: number = 0;

  constructor() {
    this.transactionService = new TransactionService();
  }

  // Add transaction to queue
  async addTransaction(
    type: string,
    transaction: any,
    options: TransactionOptions = {},
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    const queuedTransaction: QueuedTransaction = {
      id: this.generateId(),
      type,
      transaction,
      options,
      priority,
      createdAt: new Date().toISOString(),
      status: 'pending',
      retryCount: 0
    };

    // Insert based on priority
    if (priority === 'high') {
      this.queue.unshift(queuedTransaction);
    } else {
      this.queue.push(queuedTransaction);
    }

    console.log(`📝 Added transaction to queue: ${queuedTransaction.id} (${type})`);
    
    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return queuedTransaction.id;
  }

  // Process queue
  private async processQueue(): Promise<void> {
    if (this.processing) return;

    this.processing = true;
    console.log('🚀 Starting transaction queue processing');

    while (this.queue.length > 0 && this.activeTransactions < this.maxConcurrent) {
      const transaction = this.queue.shift();
      if (!transaction) break;

      this.activeTransactions++;
      this.processTransaction(transaction);
    }

    this.processing = false;
  }

  // Process individual transaction
  private async processTransaction(queuedTransaction: QueuedTransaction): Promise<void> {
    try {
      queuedTransaction.status = 'processing';
      console.log(`⚡ Processing transaction: ${queuedTransaction.id}`);

      const result = await this.transactionService.executeTransaction(
        queuedTransaction.transaction,
        queuedTransaction.options
      );

      queuedTransaction.result = result;
      queuedTransaction.status = result.success ? 'completed' : 'failed';

      console.log(`✅ Transaction completed: ${queuedTransaction.id} (${result.success ? 'success' : 'failed'})`);

    } catch (error) {
      console.error(`❌ Transaction failed: ${queuedTransaction.id}`, error);
      queuedTransaction.status = 'failed';
      queuedTransaction.result = {
        success: false,
        transactionId: 'unknown',
        error: (error as Error).message,
        status: 'failed',
        timestamp: new Date().toISOString()
      };
    } finally {
      this.activeTransactions--;
      
      // Continue processing if there are more transactions
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  // Get queue status
  getQueueStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    const status = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      total: this.queue.length
    };

    this.queue.forEach(tx => {
      switch (tx.status) {
        case 'pending':
          status.pending++;
          break;
        case 'processing':
          status.processing++;
          break;
        case 'completed':
          status.completed++;
          break;
        case 'failed':
          status.failed++;
          break;
      }
    });

    return status;
  }

  // Get transaction by ID
  getTransaction(id: string): QueuedTransaction | undefined {
    return this.queue.find(tx => tx.id === id);
  }

  // Generate unique ID
  private generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 📊 **Transaction Monitoring**

### **1. Transaction Monitor Service**

Create `src/lib/hedera/transactionMonitor.ts`:

```typescript
import { TransactionService } from './transactionService';
import { TransactionQueue } from './transactionQueue';

export interface TransactionMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageExecutionTime: number;
  totalGasUsed: number;
  totalCost: number;
  successRate: number;
}

export class TransactionMonitor {
  private transactionService: TransactionService;
  private queue: TransactionQueue;
  private metrics: TransactionMetrics = {
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    averageExecutionTime: 0,
    totalGasUsed: 0,
    totalCost: 0,
    successRate: 0
  };

  constructor() {
    this.transactionService = new TransactionService();
    this.queue = new TransactionQueue();
  }

  // Monitor transaction execution
  async monitorTransaction(transactionId: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    details?: any;
    metrics?: TransactionMetrics;
  }> {
    try {
      const status = await this.transactionService.getTransactionStatus(transactionId);
      
      if (status.status === 'success') {
        this.updateMetrics('success', status.receipt);
      } else if (status.status === 'failed') {
        this.updateMetrics('failed');
      }

      return {
        status: status.status,
        details: status.receipt,
        metrics: this.getMetrics()
      };
    } catch (error) {
      console.error('Error monitoring transaction:', error);
      return { status: 'pending' };
    }
  }

  // Update metrics
  private updateMetrics(status: 'success' | 'failed', receipt?: any): void {
    this.metrics.totalTransactions++;

    if (status === 'success') {
      this.metrics.successfulTransactions++;
      if (receipt?.gasUsed) {
        this.metrics.totalGasUsed += receipt.gasUsed;
        this.metrics.totalCost += receipt.gasUsed * 0.0001;
      }
    } else {
      this.metrics.failedTransactions++;
    }

    this.metrics.successRate = (this.metrics.successfulTransactions / this.metrics.totalTransactions) * 100;
  }

  // Get current metrics
  getMetrics(): TransactionMetrics {
    return { ...this.metrics };
  }

  // Get queue status
  getQueueStatus() {
    return this.queue.getQueueStatus();
  }

  // Get transaction details
  async getTransactionDetails(transactionId: string) {
    return await this.transactionService.getTransactionDetails(transactionId);
  }
}
```

---

## 🔗 **API Integration**

### **1. Transaction API Endpoints**

Create `src/app/api/transactions/status/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TransactionMonitor } from '@/lib/hedera/transactionMonitor';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const monitor = new TransactionMonitor();
    const result = await monitor.monitorTransaction(params.id);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting transaction status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get transaction status' },
      { status: 500 }
    );
  }
}
```

### **2. Queue Status API**

Create `src/app/api/transactions/queue/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { TransactionMonitor } from '@/lib/hedera/transactionMonitor';

export async function GET(request: NextRequest) {
  try {
    const monitor = new TransactionMonitor();
    const queueStatus = monitor.getQueueStatus();
    const metrics = monitor.getMetrics();

    return NextResponse.json({
      success: true,
      data: {
        queue: queueStatus,
        metrics
      }
    });

  } catch (error) {
    console.error('Error getting queue status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get queue status' },
      { status: 500 }
    );
  }
}
```

---

## 🔐 **Error Handling & Recovery**

### **1. Transaction Error Handler**

Create `src/lib/hedera/transactionErrorHandler.ts`:

```typescript
export enum TransactionErrorType {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_ACCOUNT = 'INVALID_ACCOUNT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export interface TransactionError {
  type: TransactionErrorType;
  message: string;
  transactionId?: string;
  retryable: boolean;
  details?: any;
}

export class TransactionErrorHandler {
  static parseError(error: any): TransactionError {
    const message = error.message || error.toString();
    
    if (message.includes('INSUFFICIENT_PAYER_BALANCE')) {
      return {
        type: TransactionErrorType.INSUFFICIENT_BALANCE,
        message: 'Insufficient balance for transaction',
        retryable: false
      };
    }

    if (message.includes('INVALID_ACCOUNT_ID')) {
      return {
        type: TransactionErrorType.INVALID_ACCOUNT,
        message: 'Invalid account ID',
        retryable: false
      };
    }

    if (message.includes('INVALID_TOKEN_ID')) {
      return {
        type: TransactionErrorType.INVALID_TOKEN,
        message: 'Invalid token ID',
        retryable: false
      };
    }

    if (message.includes('timeout') || message.includes('TIMEOUT')) {
      return {
        type: TransactionErrorType.TIMEOUT,
        message: 'Transaction timeout',
        retryable: true
      };
    }

    if (message.includes('network') || message.includes('connection')) {
      return {
        type: TransactionErrorType.NETWORK_ERROR,
        message: 'Network connection error',
        retryable: true
      };
    }

    return {
      type: TransactionErrorType.UNKNOWN,
      message: message,
      retryable: true
    };
  }

  static shouldRetry(error: TransactionError): boolean {
    return error.retryable;
  }

  static getRetryDelay(error: TransactionError, attempt: number): number {
    // Exponential backoff
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }
}
```

---

## 📋 **Implementation Checklist**

### **✅ Core Services**
- [ ] Implement TransactionService
- [ ] Add retry logic and error handling
- [ ] Create TransactionQueue for batch processing
- [ ] Build TransactionMonitor for metrics

### **✅ Error Handling**
- [ ] Implement TransactionErrorHandler
- [ ] Add error classification
- [ ] Create retry strategies
- [ ] Add error logging

### **✅ API Integration**
- [ ] Add transaction status endpoints
- [ ] Create queue monitoring APIs
- [ ] Integrate with existing services
- [ ] Add error responses

### **✅ Monitoring**
- [ ] Add transaction metrics
- [ ] Implement queue monitoring
- [ ] Create performance tracking
- [ ] Add alerting system

---

## 🚀 **Usage Examples**

### **1. Basic Transaction Execution**

```typescript
const transactionService = new TransactionService();

const result = await transactionService.executeTransaction(
  transferTransaction,
  {
    maxRetries: 3,
    retryDelay: 2000,
    memo: 'Smiles transfer'
  }
);

if (result.success) {
  console.log('Transaction successful:', result.transactionId);
} else {
  console.error('Transaction failed:', result.error);
}
```

### **2. Queue Management**

```typescript
const queue = new TransactionQueue();

// Add high priority transaction
await queue.addTransaction(
  'token-transfer',
  transferTransaction,
  { memo: 'Urgent transfer' },
  'high'
);

// Check queue status
const status = queue.getQueueStatus();
console.log('Queue status:', status);
```

### **3. Transaction Monitoring**

```typescript
const monitor = new TransactionMonitor();

// Monitor specific transaction
const status = await monitor.monitorTransaction('0.0.123456@1234567890.123456789');

// Get overall metrics
const metrics = monitor.getMetrics();
console.log('Success rate:', metrics.successRate);
```

---

## 📚 **Next Steps**

1. **Implement Core Services** - Build transaction management system
2. **Add Error Handling** - Implement robust error recovery
3. **Create Monitoring** - Add metrics and alerting
4. **Test Integration** - Verify with real transactions

This transaction management system ensures reliable and monitored blockchain operations for SmileUp ImpactChain. 