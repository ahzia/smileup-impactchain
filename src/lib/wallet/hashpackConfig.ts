'use client';

import { DAppConnector } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';

export const HEDERA_NETWORK = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';

export const DAPP_METADATA = {
  name: 'SmileUp ImpactChain',
  description: 'Gamified social impact platform',
  icons: ['/logo.png'],
  url: 'https://smileup-impactchain.vercel.app'
};

// Initialize DAppConnector only on client side
let dAppConnector: DAppConnector | null = null;

export const getDAppConnector = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!dAppConnector) {
    // Use a valid test project ID - you should replace this with your own from WalletConnect Cloud
    const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd9';
    
    dAppConnector = new DAppConnector(
      DAPP_METADATA,
      LedgerId.TESTNET, // network
      projectId, // project ID
      [
        'hedera_signAndExecuteTransaction',
        'hedera_signTransaction',
        'hedera_signMessage',
        'hedera_signAndExecuteQuery',
        'hedera_getNodeAddresses'
      ], // supported methods
      [
        'session_connect',
        'session_disconnect',
        'session_update',
        'session_event'
      ], // supported events
      [
        'hedera:testnet',
        'hedera:mainnet'
      ] // supported chains
    );
  }
  
  return dAppConnector;
}; 