'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, RefreshCw, Copy, ExternalLink, Shield, Coins, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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

interface CustodialWalletConnectProps {
  onViewTransactions?: () => void;
}

export function CustodialWalletConnect({ onViewTransactions }: CustodialWalletConnectProps) {
  const { isAuthenticated } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's custodial wallet
  useEffect(() => {
    if (isAuthenticated) {
      loadWallet();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('smileup_token');
      const response = await fetch('/api/user/wallet-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWalletInfo(data.data);
      } else if (response.status === 404) {
        // Wallet doesn't exist yet
        setWalletInfo(null);
      } else {
        setError(data.error || 'Failed to load wallet');
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      setError('Failed to connect to wallet service');
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setCreating(true);
      const token = localStorage.getItem('smileup_token');
      const response = await fetch('/api/wallet/custodial', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Reload wallet info after creation
        await loadWallet();
        console.log('✅ Custodial wallet created:', data.data.accountId);
      } else {
        console.error('Failed to create wallet:', data.error);
        setError(data.error || 'Failed to create wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      setError('Failed to create wallet');
    } finally {
      setCreating(false);
    }
  };

  const refreshBalance = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await loadWallet();
    } catch (error) {
      console.error('Error refreshing balance:', error);
      setError('Failed to refresh balance');
    } finally {
      setRefreshing(false);
    }
  };

  const copyAddress = () => {
    if (walletInfo?.wallet.accountId) {
      navigator.clipboard.writeText(walletInfo.wallet.accountId);
    }
  };

  const openExplorer = () => {
    if (walletInfo?.wallet.accountId) {
      const explorerUrl = `https://hashscan.io/testnet/account/${walletInfo.wallet.accountId}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading wallet...</span>
        </div>
      </motion.div>
    );
  }

  if (error && !walletInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 via-red-400/15 to-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Wallet Error</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error}
            </p>
          </div>

          <Button
            onClick={loadWallet}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!walletInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">In-App Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a secure Hedera wallet managed by SmileUp. Perfect for getting started quickly.
            </p>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>Secure & encrypted storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-3 w-3" />
              <span>1 HBAR starting balance</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-3 w-3" />
              <span>Automatic account creation</span>
            </div>
          </div>

          <Button
            onClick={createWallet}
            disabled={creating}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {creating ? 'Creating Wallet...' : 'Create In-App Wallet'}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 rounded-full flex items-center justify-center">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-medium text-sm">In-App Wallet</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshBalance}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Account</span>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-mono">
              {walletInfo.wallet.accountId.slice(0, 8)}...{walletInfo.wallet.accountId.slice(-8)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="h-6 w-6 p-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Smiles</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{walletInfo.balance.smiles.toLocaleString()}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">HBAR</span>
          <span className="font-semibold">{walletInfo.balance.hbar.toFixed(2)}</span>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Status: {walletInfo.wallet.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 