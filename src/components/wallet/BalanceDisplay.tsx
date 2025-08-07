'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, TrendingUp, Wallet, RefreshCw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WalletInfo {
  wallet: {
    id: string;
    accountId: string;
    publicKey: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  balance: {
    hbar: number;
    smiles: number;
  };
}

export function BalanceDisplay() {
  const { user, isAuthenticated } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletInfo = async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('smileup_token');
      const response = await fetch('/api/user/wallet-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setWalletInfo(data.data);
      } else {
        setError(data.error || 'Failed to fetch wallet info');
      }
    } catch (err) {
      setError('Failed to connect to wallet service');
      console.error('Error fetching wallet info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWalletInfo();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
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
            Sign in to view your blockchain balances
          </p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
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
          <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-sm text-muted-foreground">
            Loading wallet information...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-red-500" />
            <span className="font-medium">Blockchain Balance</span>
          </div>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <Button 
            onClick={fetchWalletInfo}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!walletInfo) {
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
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔗</div>
          <p className="text-sm text-muted-foreground">
            Wallet not found. Please contact support.
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
        <Button
          onClick={fetchWalletInfo}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Smiles Tokens</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">{walletInfo.balance.smiles.toLocaleString()}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">HBAR</span>
          <span className="font-semibold">{walletInfo.balance.hbar.toFixed(2)}</span>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-2">
            Account: {walletInfo.wallet.accountId}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              Status: {walletInfo.wallet.isActive ? 'Active' : 'Inactive'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => {
                const url = `https://hashscan.io/testnet/account/${walletInfo.wallet.accountId}`;
                window.open(url, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 