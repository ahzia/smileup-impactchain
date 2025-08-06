'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const copyAddress = () => {
    if (state.accountId) {
      navigator.clipboard.writeText(state.accountId);
    }
  };

  const openExplorer = () => {
    if (state.accountId) {
      const explorerUrl = `https://hashscan.io/testnet/account/${state.accountId}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (state.isConnected) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 via-green-400/15 to-green-500/20 rounded-full flex items-center justify-center">
              <Wallet className="h-4 w-4 text-green-400" />
            </div>
            <span className="font-medium text-sm">Connected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshBalance}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="h-8 w-8 p-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Account</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-mono">
                {state.accountId?.slice(0, 8)}...{state.accountId?.slice(-8)}
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
            <span className="font-semibold">{state.balance.smiles.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">HBAR</span>
            <span className="font-semibold">{state.balance.hbar.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold shadow-lg backdrop-blur-sm"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </motion.div>
  );
} 