'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FrontendWalletService, WalletState } from '@/lib/wallet/frontendWalletService';
import { DAppSigner } from '@hashgraph/hedera-wallet-connect';

interface WalletContextType {
  wallet: FrontendWalletService;
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateBalance: () => Promise<void>;
  getSigner: () => DAppSigner | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet] = useState(() => new FrontendWalletService());
  const [state, setState] = useState<WalletState>(wallet.getState());

  useEffect(() => {
    // Initialize wallet
    const initWallet = async () => {
      try {
        await wallet.initialize();
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initWallet();

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

  const getSigner = () => {
    return wallet.getSigner();
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        state,
        connect,
        disconnect,
        updateBalance,
        getSigner
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