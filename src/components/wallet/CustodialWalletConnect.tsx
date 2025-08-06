'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, RefreshCw, Copy, ExternalLink, Shield, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, getAuthHeaders } from '@/contexts/AuthContext';

interface CustodialWallet {
  id: string;
  userId: string;
  accountId: string;
  publicKey: string;
  balance: {
    hbar: number;
    smiles: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function CustodialWalletConnect() {
  const { token, isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState<CustodialWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      const response = await fetch('/api/wallet/custodial', {
        headers: getAuthHeaders(token),
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setWallet(data.data);
      } else if (response.status === 404) {
        // Wallet doesn't exist yet
        setWallet(null);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    try {
      setCreating(true);
      const response = await fetch('/api/wallet/custodial', {
        method: 'POST',
        headers: getAuthHeaders(token),
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setWallet(data.data);
        console.log('✅ Custodial wallet created:', data.data.accountId);
      } else {
        console.error('Failed to create wallet:', data.error);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setCreating(false);
    }
  };

  const refreshBalance = async () => {
    try {
      setRefreshing(true);
      // TODO: Implement balance refresh API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await loadWallet();
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.accountId) {
      navigator.clipboard.writeText(wallet.accountId);
    }
  };

  const openExplorer = () => {
    if (wallet?.accountId) {
      const explorerUrl = `https://hashscan.io/testnet/account/${wallet.accountId}`;
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

  if (!wallet) {
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
              {wallet.accountId.slice(0, 8)}...{wallet.accountId.slice(-8)}
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
          <span className="font-semibold">{wallet.balance.smiles.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">HBAR</span>
          <span className="font-semibold">{wallet.balance.hbar.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
} 