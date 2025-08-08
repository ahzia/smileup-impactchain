'use client';

import { DAppConnector, DAppSigner } from '@hashgraph/hedera-wallet-connect';
import { getDAppConnector } from './hashpackConfig';
import { AccountId, LedgerId } from '@hashgraph/sdk';

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  balance: {
    hbar: number;
    smiles: number;
  };
  transactions: Transaction[];
  signer?: DAppSigner;
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

export class FrontendWalletService {
  private connector: DAppConnector | null;
  private state: WalletState;
  private sessionTopic: string | null = null;

  constructor() {
    this.connector = getDAppConnector();
    this.state = {
      isConnected: false,
      accountId: null,
      balance: { hbar: 0, smiles: 0 },
      transactions: []
    };
  }

  // Initialize DAppConnector
  async initialize(): Promise<void> {
    if (!this.connector) {
      throw new Error('DAppConnector not available');
    }

    try {
      await this.connector.init();
      console.log('✅ DAppConnector initialized');
    } catch (error) {
      console.error('❌ Error initializing DAppConnector:', error);
      throw error;
    }
  }

  // Connect wallet using WalletConnect modal
  async connect(): Promise<WalletState> {
    if (!this.connector) {
      throw new Error('DAppConnector not available');
    }

    try {
      console.log('🔗 Opening WalletConnect modal...');
      console.log('📱 Make sure you have HashPack or Blade wallet installed');
      console.log('🌐 If using browser extension, ensure it\'s enabled');
      
      // Open the WalletConnect modal
      const session = await this.connector.openModal();
      
      if (session) {
        this.sessionTopic = session.topic;
        console.log('✅ Wallet connected:', session);
        console.log('📋 Session details:', {
          topic: session.topic,
          namespaces: session.namespaces,
          accounts: session.namespaces.hedera?.accounts
        });
        
        // Get the first account from the session
        const accountIds = session.namespaces.hedera?.accounts || [];
        if (accountIds.length > 0) {
          const accountId = accountIds[0];
          this.state.isConnected = true;
          this.state.accountId = accountId;
          
          console.log('✅ Account connected:', accountId);
          
          // Get the signer for this account
          try {
            const signer = this.connector.getSigner(AccountId.fromString(accountId));
            this.state.signer = signer;
            console.log('✅ Signer obtained for account:', accountId);
          } catch (error) {
            console.warn('⚠️ Could not get signer for account:', accountId, error);
          }
          
          // Update balance
          await this.updateBalance();
        } else {
          console.warn('⚠️ No accounts found in session');
        }
      } else {
        console.warn('⚠️ No session returned from modal');
      }
      
      return this.state;
    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      
      // Provide helpful error messages
      if (error instanceof Error && error.message?.includes('scheme')) {
        console.error('💡 Solution: Install HashPack or Blade wallet extension');
        console.error('🔗 HashPack: https://hashpack.app/');
        console.error('🔗 Blade: https://blade.xyz/');
      }
      
      throw error;
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    if (!this.connector || !this.sessionTopic) {
      return;
    }

    try {
      await this.connector.disconnect(this.sessionTopic);
      this.state = {
        isConnected: false,
        accountId: null,
        balance: { hbar: 0, smiles: 0 },
        transactions: []
      };
      this.sessionTopic = null;
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

  // Get signer for the connected account
  getSigner(): DAppSigner | null {
    return this.state.signer || null;
  }

  // Update balance by querying the network
  async updateBalance(): Promise<void> {
    if (!this.state.accountId || !this.connector) return;

    try {
      // For now, we'll use mock data since we need to implement proper balance queries
      // In a real implementation, this would query the Hedera network using the signer
      this.state.balance = {
        hbar: 100.0 + Math.random() * 10,
        smiles: 2500 + Math.floor(Math.random() * 100)
      };
    } catch (error) {
      console.error('❌ Error updating balance:', error);
    }
  }

  // Get Smiles token balance
  async getSmilesBalance(accountId: string): Promise<number> {
    try {
      // Mock balance for now
      // In a real implementation, this would query the token balance
      return 2500 + Math.floor(Math.random() * 100);
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
    if (!this.state.accountId || !this.state.signer) {
      throw new Error('Wallet not connected or no signer available');
    }

    try {
      // For now, return a mock transaction ID
      // In a real implementation, this would create and submit a transaction
      const transactionId = `mock-tx-${Date.now()}`;
      
      // Add to transaction history
      this.state.transactions.unshift({
        id: transactionId,
        type: 'transfer',
        amount,
        from: this.state.accountId,
        to: toAccountId,
        timestamp: new Date().toISOString(),
        status: 'success',
        memo
      });

      // Update balance
      this.state.balance.smiles -= amount;

      console.log('✅ Smiles transfer completed (mock):', transactionId);
      return transactionId;
    } catch (error) {
      console.error('❌ Error transferring Smiles:', error);
      throw error;
    }
  }

  // Sign a message
  async signMessage(message: string): Promise<string> {
    if (!this.state.accountId || !this.connector) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await this.connector.signMessage({
        signerAccountId: this.state.accountId,
        message
      });
      
      console.log('✅ Message signed:', result);
      return result.result.signatureMap;
    } catch (error) {
      console.error('❌ Error signing message:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(): Promise<Transaction[]> {
    if (!this.state.accountId) return [];

    try {
      // Mock transaction history
      return [
        {
          id: 'mock-tx-1',
          type: 'transfer',
          amount: 100,
          from: this.state.accountId,
          to: '0.0.123456',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'success',
          memo: 'Mission reward'
        },
        {
          id: 'mock-tx-2',
          type: 'mission',
          amount: 50,
          from: this.state.accountId,
          to: '0.0.123456',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'success',
          memo: 'Community contribution'
        },
        {
          id: 'mock-tx-3',
          type: 'donation',
          amount: 25,
          from: this.state.accountId,
          to: '0.0.789012',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          status: 'success',
          memo: 'Charity donation'
        }
      ];
    } catch (error) {
      console.error('❌ Error getting transaction history:', error);
      return [];
    }
  }

  // Listen for wallet events
  onWalletChange(callback: (state: WalletState) => void): void {
    if (!this.connector) return;

    // In a real implementation, this would listen to actual wallet events
    // For now, we'll just call the callback when state changes
    const originalState = { ...this.state };
    
    // Simulate periodic state updates
    setInterval(() => {
      if (JSON.stringify(this.state) !== JSON.stringify(originalState)) {
        callback(this.state);
        Object.assign(originalState, this.state);
      }
    }, 1000);
  }
} 