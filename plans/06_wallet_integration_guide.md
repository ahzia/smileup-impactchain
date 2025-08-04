# SmileUp ImpactChain — Wallet Integration Guide

## 🎯 **Wallet Integration Overview**

SmileUp ImpactChain integrates with **HashPack** as the primary wallet provider, enabling users to manage their Smiles tokens, view transaction history, and interact with the blockchain directly from the frontend.

### **Supported Wallets**
- **HashPack** (Primary) - Hedera-native wallet
- **MyHbarWallet** (Secondary) - Alternative Hedera wallet
- **Future**: MetaMask, WalletConnect, etc.

---

## 🔧 **HashPack Integration**

### **1. HashPack SDK Installation**

```bash
npm install @hashpack/connect
```

### **2. HashPack Configuration**

Create `src/lib/wallet/hashpackConfig.ts`:

```typescript
import { HashPackConnector } from '@hashpack/connect';

export const HEDERA_NETWORK = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';

export const HASHPACK_CONFIG = {
  network: HEDERA_NETWORK,
  debug: process.env.NODE_ENV === 'development',
  projectId: process.env.NEXT_PUBLIC_HASHPACK_PROJECT_ID || 'smileup-impactchain',
  metadata: {
    name: 'SmileUp ImpactChain',
    description: 'Gamified social impact platform',
    icon: '/logo.png',
    url: 'https://smileup-impactchain.vercel.app'
  }
};

export const hashpackConnector = new HashPackConnector(HASHPACK_CONFIG);
```

### **3. Wallet Service Implementation**

Create `src/lib/wallet/walletService.ts`:

```typescript
import { HashPackConnector } from '@hashpack/connect';
import { hashpackConnector } from './hashpackConfig';

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  balance: {
    hbar: number;
    smiles: number;
  };
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'transfer' | 'mint' | 'burn' | 'mission' | 'donation';
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
  memo?: string;
}

export class WalletService {
  private connector: HashPackConnector;
  private state: WalletState;

  constructor() {
    this.connector = hashpackConnector;
    this.state = {
      isConnected: false,
      accountId: null,
      balance: { hbar: 0, smiles: 0 },
      transactions: []
    };
  }

  // Connect wallet
  async connect(): Promise<WalletState> {
    try {
      const result = await this.connector.connect();
      
      if (result.success) {
        this.state.isConnected = true;
        this.state.accountId = result.accountId;
        
        // Get initial balance
        await this.updateBalance();
        
        console.log('✅ Wallet connected:', result.accountId);
      } else {
        console.error('❌ Wallet connection failed:', result.error);
      }

      return this.state;
    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    try {
      await this.connector.disconnect();
      this.state = {
        isConnected: false,
        accountId: null,
        balance: { hbar: 0, smiles: 0 },
        transactions: []
      };
      
      console.log('✅ Wallet disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
      throw error;
    }
  }

  // Get current wallet state
  getState(): WalletState {
    return { ...this.state };
  }

  // Update balance
  async updateBalance(): Promise<void> {
    if (!this.state.accountId) return;

    try {
      // Get HBAR balance
      const hbarBalance = await this.connector.getBalance(this.state.accountId);
      
      // Get Smiles token balance
      const smilesBalance = await this.getSmilesBalance(this.state.accountId);

      this.state.balance = {
        hbar: hbarBalance,
        smiles: smilesBalance
      };
    } catch (error) {
      console.error('❌ Error updating balance:', error);
    }
  }

  // Get Smiles token balance
  async getSmilesBalance(accountId: string): Promise<number> {
    try {
      const tokenId = process.env.NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID;
      if (!tokenId) return 0;

      const balance = await this.connector.getTokenBalance(accountId, tokenId);
      return balance;
    } catch (error) {
      console.error('❌ Error getting Smiles balance:', error);
      return 0;
    }
  }

  // Transfer Smiles tokens
  async transferSmiles(
    toAccountId: string,
    amount: number,
    memo?: string
  ): Promise<string> {
    if (!this.state.accountId) {
      throw new Error('Wallet not connected');
    }

    try {
      const tokenId = process.env.NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID;
      if (!tokenId) {
        throw new Error('Smiles token ID not configured');
      }

      const transaction = await this.connector.transferTokens({
        tokenId,
        from: this.state.accountId,
        to: toAccountId,
        amount,
        memo: memo || 'SmileUp transfer'
      });

      // Add to transaction history
      this.state.transactions.unshift({
        id: transaction.id,
        type: 'transfer',
        amount,
        from: this.state.accountId,
        to: toAccountId,
        timestamp: new Date().toISOString(),
        status: 'pending',
        memo
      });

      // Update balance
      await this.updateBalance();

      console.log('✅ Smiles transfer initiated:', transaction.id);
      return transaction.id;
    } catch (error) {
      console.error('❌ Error transferring Smiles:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(): Promise<Transaction[]> {
    if (!this.state.accountId) return [];

    try {
      const transactions = await this.connector.getTransactionHistory(
        this.state.accountId
      );

      return transactions.map(tx => ({
        id: tx.id,
        type: this.mapTransactionType(tx.type),
        amount: tx.amount || 0,
        from: tx.from,
        to: tx.to,
        timestamp: tx.timestamp,
        status: tx.status,
        memo: tx.memo
      }));
    } catch (error) {
      console.error('❌ Error getting transaction history:', error);
      return [];
    }
  }

  // Map transaction types
  private mapTransactionType(type: string): Transaction['type'] {
    switch (type) {
      case 'TOKENTRANSFER':
        return 'transfer';
      case 'TOKENMINT':
        return 'mint';
      case 'TOKENBURN':
        return 'burn';
      default:
        return 'transfer';
    }
  }

  // Listen for wallet events
  onWalletChange(callback: (state: WalletState) => void): void {
    this.connector.on('walletChange', (event) => {
      if (event.type === 'connect') {
        this.state.isConnected = true;
        this.state.accountId = event.accountId;
      } else if (event.type === 'disconnect') {
        this.state.isConnected = false;
        this.state.accountId = null;
      }
      
      callback(this.state);
    });
  }
}
```

---

## 🎨 **Frontend Integration**

### **1. Wallet Context Provider**

Create `src/contexts/WalletContext.tsx`:

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletService, WalletState } from '@/lib/wallet/walletService';

interface WalletContextType {
  wallet: WalletService;
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateBalance: () => Promise<void>;
  transferSmiles: (to: string, amount: number, memo?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet] = useState(() => new WalletService());
  const [state, setState] = useState<WalletState>(wallet.getState());

  useEffect(() => {
    // Listen for wallet changes
    wallet.onWalletChange((newState) => {
      setState(newState);
    });

    // Check if wallet was previously connected
    const checkConnection = async () => {
      const currentState = wallet.getState();
      if (currentState.isConnected) {
        await wallet.updateBalance();
        setState(wallet.getState());
      }
    };

    checkConnection();
  }, [wallet]);

  const connect = async () => {
    try {
      const newState = await wallet.connect();
      setState(newState);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await wallet.disconnect();
      setState(wallet.getState());
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const updateBalance = async () => {
    try {
      await wallet.updateBalance();
      setState(wallet.getState());
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const transferSmiles = async (to: string, amount: number, memo?: string) => {
    try {
      const txId = await wallet.transferSmiles(to, amount, memo);
      await updateBalance();
      return txId;
    } catch (error) {
      console.error('Failed to transfer Smiles:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        state,
        connect,
        disconnect,
        updateBalance,
        transferSmiles
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
```

### **2. Wallet Connect Component**

Create `src/components/wallet/WalletConnect.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, RefreshCw } from 'lucide-react';

export function WalletConnect() {
  const { state, connect, disconnect, updateBalance } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      await updateBalance();
    } catch (error) {
      console.error('Balance update failed:', error);
    }
  };

  if (state.isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <div className="font-medium">
            {state.accountId?.slice(0, 8)}...{state.accountId?.slice(-8)}
          </div>
          <div className="text-muted-foreground">
            {state.balance.smiles} Smiles
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshBalance}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center space-x-2"
    >
      <Wallet className="h-4 w-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </Button>
  );
}
```

### **3. Balance Display Component**

Create `src/components/wallet/BalanceDisplay.tsx`:

```typescript
'use client';

import { useWallet } from '@/contexts/WalletContext';
import { Coins, TrendingUp } from 'lucide-react';

export function BalanceDisplay() {
  const { state } = useWallet();

  if (!state.isConnected) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-medium">Balance</span>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="mt-2 space-y-1">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Smiles</span>
          <span className="font-semibold">{state.balance.smiles.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">HBAR</span>
          <span className="font-semibold">{state.balance.hbar.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
```

### **4. Transaction History Component**

Create `src/components/wallet/TransactionHistory.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Transaction } from '@/lib/wallet/walletService';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export function TransactionHistory() {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const history = await wallet.getTransactionHistory();
        setTransactions(history);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wallet.getState().isConnected) {
      loadTransactions();
    }
  }, [wallet]);

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No transactions yet</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 bg-card rounded-lg border"
        >
          <div className="flex items-center space-x-3">
            {getStatusIcon(tx.status)}
            <div>
              <div className="font-medium capitalize">{tx.type}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(tx.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium">{tx.amount} Smiles</div>
            <div className="text-sm text-muted-foreground">
              {tx.from.slice(0, 6)}...{tx.to.slice(-6)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔗 **API Integration**

### **1. Wallet API Endpoints**

Create `src/app/api/wallet/balance/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { WalletService } from '@/lib/wallet/walletService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID required' },
        { status: 400 }
      );
    }

    const walletService = new WalletService();
    const balance = await walletService.getSmilesBalance(accountId);

    return NextResponse.json({
      success: true,
      data: { balance }
    });

  } catch (error) {
    console.error('Error getting balance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get balance' },
      { status: 500 }
    );
  }
}
```

### **2. Transaction API**

Create `src/app/api/wallet/transactions/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { WalletService } from '@/lib/wallet/walletService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Account ID required' },
        { status: 400 }
      );
    }

    const walletService = new WalletService();
    const transactions = await walletService.getTransactionHistory();

    return NextResponse.json({
      success: true,
      data: { transactions }
    });

  } catch (error) {
    console.error('Error getting transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get transactions' },
      { status: 500 }
    );
  }
}
```

---

## 🔐 **Security Considerations**

### **1. Environment Variables**

Add to `.env.local`:

```bash
# Wallet Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HASHPACK_PROJECT_ID=smileup-impactchain
NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID=0.0.123456
```

### **2. Error Handling**

```typescript
export class WalletError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

export function handleWalletError(error: any): never {
  if (error.message.includes('User rejected')) {
    throw new WalletError('Transaction was cancelled by user', 'USER_REJECTED');
  }
  if (error.message.includes('Insufficient balance')) {
    throw new WalletError('Insufficient balance for transaction', 'INSUFFICIENT_BALANCE');
  }
  throw new WalletError(`Wallet operation failed: ${error.message}`, 'UNKNOWN_ERROR');
}
```

---

## 📋 **Implementation Checklist**

### **✅ HashPack Setup**
- [ ] Install HashPack SDK
- [ ] Configure wallet connector
- [ ] Set up environment variables
- [ ] Test basic connection

### **✅ Wallet Service**
- [ ] Implement WalletService class
- [ ] Add connection/disconnection
- [ ] Implement balance queries
- [ ] Add transaction methods

### **✅ Frontend Components**
- [ ] Create WalletContext provider
- [ ] Build WalletConnect component
- [ ] Add BalanceDisplay component
- [ ] Create TransactionHistory component

### **✅ API Integration**
- [ ] Add wallet API endpoints
- [ ] Integrate with existing services
- [ ] Add error handling
- [ ] Test all endpoints

### **✅ Security**
- [ ] Validate environment variables
- [ ] Add error handling
- [ ] Implement rate limiting
- [ ] Add transaction validation

---

## 🚀 **Integration Commands**

```bash
# Install HashPack SDK
npm install @hashpack/connect

# Test wallet connection
node scripts/test-wallet-connection.js

# Verify environment setup
node scripts/verify-wallet-config.js
```

---

## 📚 **Next Steps**

1. **Install Dependencies** - Add HashPack SDK
2. **Configure Wallet** - Set up environment variables
3. **Test Connection** - Verify wallet integration
4. **Integrate Components** - Add to frontend pages

This wallet integration provides seamless blockchain interaction for SmileUp ImpactChain users. 