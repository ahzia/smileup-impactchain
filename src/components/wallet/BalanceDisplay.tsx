'use client';

import { useWallet } from '@/contexts/WalletContext';
import { Coins, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export function BalanceDisplay() {
  const { state } = useWallet();

  if (!state.isConnected) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Blockchain Balance</span>
          </div>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔗</div>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view blockchain balances
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-medium">Blockchain Balance</span>
        </div>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Smiles Tokens</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">{state.balance.smiles.toLocaleString()}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">HBAR</span>
          <span className="font-semibold">{state.balance.hbar.toFixed(2)}</span>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Account: {state.accountId?.slice(0, 12)}...{state.accountId?.slice(-8)}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 