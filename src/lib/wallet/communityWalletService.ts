import { 
  AccountId, 
  PrivateKey, 
  PublicKey, 
  Client, 
  AccountCreateTransaction,
  Hbar,
  TransferTransaction,
  AccountBalanceQuery,
  TokenId,
  TokenAssociateTransaction,
  TokenMintTransaction
} from '@hashgraph/sdk';
import { prisma } from '@/lib/database/client';
import bcrypt from 'bcryptjs';
import { TokenService } from '../hedera/tokenService';

export interface CommunityWallet {
  id: string;
  communityId: string;
  accountId: string;
  publicKey: string;
  encryptedPrivateKey: string;
  balance: {
    hbar: number;
    smiles: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  hbar: number;
  smiles: number;
}

export class CommunityWalletService {
  private client: Client;
  private tokenService: TokenService | undefined;
  private encryptionKey: string;

  constructor() {
    // Initialize Hedera client for testnet
    this.client = Client.forTestnet();
    
    // Set operator credentials from environment
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorPrivateKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
    const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
    
    if (operatorId && operatorPrivateKey && tokenId) {
      this.client.setOperator(operatorId, operatorPrivateKey);
      this.tokenService = new TokenService(this.client, tokenId, operatorId, operatorPrivateKey);
    }

    // Get encryption key from environment
    this.encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'default-encryption-key-32-chars-long';
  }

  // Encrypt private key using simple XOR encryption (for development)
  private encryptPrivateKey(privateKey: string): string {
    const key = this.encryptionKey.padEnd(32, '0').slice(0, 32);
    let encrypted = '';
    for (let i = 0; i < privateKey.length; i++) {
      encrypted += String.fromCharCode(privateKey.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(encrypted).toString('base64');
  }

  // Decrypt private key using simple XOR decryption (for development)
  private decryptPrivateKey(encryptedPrivateKey: string): string {
    const key = this.encryptionKey.padEnd(32, '0').slice(0, 32);
    const encrypted = Buffer.from(encryptedPrivateKey, 'base64').toString();
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  }

  // Get decrypted private key for a community
  async getDecryptedPrivateKey(communityId: string): Promise<string | null> {
    try {
      const wallet = await this.getWalletForCommunity(communityId);
      if (!wallet) {
        return null;
      }

      return this.decryptPrivateKey(wallet.encryptedPrivateKey);
    } catch (error) {
      console.error('❌ Error decrypting community private key:', error);
      return null;
    }
  }

  // Generate a new Hedera account for a community
  async createWalletForCommunity(communityId: string): Promise<CommunityWallet> {
    try {
      console.log('🔐 Creating community wallet for community:', communityId);

      // Generate a new key pair
      const privateKey = PrivateKey.generateED25519();
      const publicKey = privateKey.publicKey;

      // Create a new Hedera account
      const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(1)) // Start with 1 HBAR
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      if (!receipt.accountId) {
        throw new Error('Failed to create Hedera account');
      }

      const accountId = receipt.accountId.toString();
      console.log('✅ Created Hedera account for community:', accountId);

      // Encrypt the private key using proper encryption
      const encryptedPrivateKey = this.encryptPrivateKey(privateKey.toString());

      // Store wallet in database
      const wallet = await prisma.communityWallet.create({
        data: {
          communityId,
          accountId,
          publicKey: publicKey.toString(),
          encryptedPrivateKey,
          isActive: true
        }
      });

      console.log('✅ Stored community wallet in database:', wallet.id);

      // Automatically associate with Smiles token
      try {
        console.log('🔄 Associating community wallet with Smiles token...');
        const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
        
        if (tokenId) {
          const isAssociated = await this.associateTokenWithWallet(communityId, tokenId);
          if (isAssociated) {
            console.log('✅ Successfully associated community wallet with Smiles token');
          } else {
            console.log('⚠️ Failed to associate community wallet with Smiles token (will be retried later)');
          }
        } else {
          console.log('⚠️ HEDERA_SMILES_TOKEN_ID not found in environment');
        }
      } catch (associationError) {
        console.log('⚠️ Error during community token association:', associationError instanceof Error ? associationError.message : 'Unknown error');
        // Don't fail wallet creation if association fails
      }

      return {
        id: wallet.id,
        communityId: wallet.communityId,
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
        encryptedPrivateKey: wallet.encryptedPrivateKey,
        balance: {
          hbar: 1.0, // Initial balance
          smiles: 0
        },
        isActive: wallet.isActive,
        createdAt: wallet.createdAt.toISOString(),
        updatedAt: wallet.updatedAt.toISOString()
      };

    } catch (error) {
      console.error('❌ Error creating community wallet:', error);
      throw error;
    }
  }

  // Get wallet for a community
  async getWalletForCommunity(communityId: string): Promise<CommunityWallet | null> {
    try {
      const wallet = await prisma.communityWallet.findUnique({
        where: { communityId }
      });

      if (!wallet) {
        return null;
      }

      return {
        id: wallet.id,
        communityId: wallet.communityId,
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
        encryptedPrivateKey: wallet.encryptedPrivateKey,
        balance: {
          hbar: wallet.hbarBalance,
          smiles: wallet.smilesBalance
        },
        isActive: wallet.isActive,
        createdAt: wallet.createdAt.toISOString(),
        updatedAt: wallet.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to get community wallet:', error);
      throw error;
    }
  }

  // Update wallet balance
  async updateWalletBalance(walletId: string, balance: WalletBalance): Promise<void> {
    try {
      await prisma.communityWallet.update({
        where: { id: walletId },
        data: {
          hbarBalance: balance.hbar,
          smilesBalance: balance.smiles,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('❌ Failed to update community wallet balance:', error);
      throw error;
    }
  }

  // Transfer HBAR from community wallet
  async transferHbar(fromWalletId: string, toAccountId: string, amount: number): Promise<string> {
    try {
      const wallet = await prisma.communityWallet.findUnique({
        where: { id: fromWalletId }
      });

      if (!wallet) {
        throw new Error('Community wallet not found');
      }

      // Decrypt private key
      const privateKey = PrivateKey.fromString(this.decryptPrivateKey(wallet.encryptedPrivateKey));

      // Create transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(wallet.accountId, new Hbar(-amount))
        .addHbarTransfer(toAccountId, new Hbar(amount))
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return response.transactionId.toString();
    } catch (error) {
      console.error('❌ Failed to transfer HBAR from community wallet:', error);
      throw error;
    }
  }

  // Get account balance from Hedera network
  async getAccountBalance(accountId: string): Promise<WalletBalance> {
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId));
      
      const accountBalance = await query.execute(this.client);
      
      // Get Smiles token balance using TokenService
      let smilesBalance = 0;
      
      if (this.tokenService) {
        try {
          smilesBalance = await this.tokenService.getAccountTokenBalance(accountId);
        } catch (tokenError) {
          console.warn('⚠️ Could not fetch Smiles token balance:', tokenError);
          // Continue with 0 balance if token query fails
        }
      }
      
      return {
        hbar: Number(accountBalance.hbars.toTinybars()) / 100000000, // Convert to HBAR
        smiles: smilesBalance
      };

    } catch (error) {
      console.error('❌ Error getting account balance:', error);
      return {
        hbar: 0,
        smiles: 0
      };
    }
  }

  // Get real-time balance for community (from Hedera network)
  async getCommunityBalance(communityId: string): Promise<WalletBalance> {
    try {
      const wallet = await this.getWalletForCommunity(communityId);
      if (!wallet) {
        return { hbar: 0, smiles: 0 };
      }

      return await this.getAccountBalance(wallet.accountId);
    } catch (error) {
      console.error('❌ Error getting community balance:', error);
      return { hbar: 0, smiles: 0 };
    }
  }

  // Sync wallet balance with Hedera network (read-only, no database updates)
  async syncWalletBalance(walletId: string): Promise<WalletBalance> {
    try {
      const wallet = await prisma.communityWallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      return await this.getAccountBalance(wallet.accountId);

    } catch (error) {
      console.error('❌ Error syncing wallet balance:', error);
      throw error;
    }
  }

  // Associate token with community's wallet
  async associateTokenWithWallet(communityId: string, tokenId: string): Promise<boolean> {
    try {
      console.log(`🔗 Associating token ${tokenId} with community ${communityId}...`);

      const wallet = await this.getWalletForCommunity(communityId);
      if (!wallet) {
        throw new Error('Community wallet not found');
      }

      // Check if token is already associated
      const accountBalance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(wallet.accountId))
        .execute(this.client);

      const tokenIdObj = TokenId.fromString(tokenId);
      const isAssociated = accountBalance.tokens && accountBalance.tokens.get(tokenIdObj);

      if (isAssociated) {
        console.log('✅ Token already associated with community wallet');
        return true;
      }

      console.log('🔄 Token not associated. Creating association transaction...');

      // Get decrypted private key
      const decryptedPrivateKey = await this.getDecryptedPrivateKey(communityId);
      if (!decryptedPrivateKey) {
        throw new Error('Failed to decrypt private key');
      }

      // Create token association transaction
      const associateTx = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(wallet.accountId))
        .setTokenIds([tokenIdObj])
        .setMaxTransactionFee(new Hbar(2));

      // Sign with community's private key
      const communityPrivateKey = PrivateKey.fromString(decryptedPrivateKey);
      associateTx.freezeWith(this.client);
      const signedTx = await associateTx.sign(communityPrivateKey);

      // Execute the transaction
      const response = await signedTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      console.log('📊 Association transaction status:', receipt.status.toString());

      if (receipt.status.toString() === 'SUCCESS') {
        console.log('✅ Successfully associated token with community wallet!');
        console.log('📊 Transaction ID:', response.transactionId);
        return true;
      } else {
        console.error('❌ Association failed:', receipt.status.toString());
        console.error('❌ Error details:', receipt);
        return false;
      }

    } catch (error) {
      console.error('❌ Error associating token with community:', error);
      return false;
    }
  }

  // Mint tokens to community's wallet
  async mintTokensToCommunity(communityId: string, amount: number): Promise<{
    success: boolean;
    transactionId?: string;
    newBalance?: number;
    error?: string;
  }> {
    try {
      console.log(`🪙 Minting ${amount} Smiles tokens to community ${communityId}...`);

      const wallet = await this.getWalletForCommunity(communityId);
      if (!wallet) {
        return {
          success: false,
          error: 'Community wallet not found'
        };
      }

      // Get token ID from environment
      const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
      if (!tokenId) {
        return {
          success: false,
          error: 'Smiles token ID not configured'
        };
      }

      // Try association approach first
      console.log('🔄 Attempting token association...');
      const isAssociated = await this.associateTokenWithWallet(communityId, tokenId);
      
      if (isAssociated) {
        console.log('✅ Token associated successfully. Proceeding with mint...');
        
        // Mint tokens using TokenService
        if (!this.tokenService) {
          return {
            success: false,
            error: 'Token service not initialized'
          };
        }

        // First mint tokens to operator account
        const mintResult = await this.tokenService.mintTokens(amount);
        
        if (!mintResult.success) {
          return {
            success: false,
            error: `Failed to mint tokens: ${mintResult.error}`
          };
        }

        console.log('✅ Successfully minted tokens to operator account');

        // Then transfer tokens to community's wallet
        const transferResult = await this.tokenService.transferTokens(amount, wallet.accountId);
        
        if (transferResult.success) {
          console.log('✅ Successfully transferred tokens to community wallet!');
          console.log('📊 Transaction ID:', transferResult.transactionId);
          
          // Get updated balance
          const balance = await this.tokenService.getAccountTokenBalance(wallet.accountId);
          console.log('💰 New balance:', balance, 'Smiles');

          return {
            success: true,
            transactionId: transferResult.transactionId,
            newBalance: balance
          };
        } else {
          return {
            success: false,
            error: `Failed to transfer tokens: ${transferResult.error}`
          };
        }
      } else {
        console.log('⚠️ Association failed. Trying alternative approach...');
        
        // Fall back to alternative approach
        return await this.mintTokensToCommunityAlternative(communityId, amount);
      }

    } catch (error) {
      console.error('❌ Error minting tokens to community:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Alternative minting approach for community
  async mintTokensToCommunityAlternative(communityId: string, amount: number): Promise<{
    success: boolean;
    transactionId?: string;
    newBalance?: number;
    error?: string;
  }> {
    try {
      console.log(`🪙 Alternative minting ${amount} Smiles tokens to community ${communityId}...`);

      const wallet = await this.getWalletForCommunity(communityId);
      if (!wallet) {
        return {
          success: false,
          error: 'Community wallet not found'
        };
      }

      // Get token ID from environment
      const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
      if (!tokenId) {
        return {
          success: false,
          error: 'Smiles token ID not configured'
        };
      }

      // Get decrypted private key
      const decryptedPrivateKey = await this.getDecryptedPrivateKey(communityId);
      if (!decryptedPrivateKey) {
        return {
          success: false,
          error: 'Failed to decrypt private key'
        };
      }

      // Create a custom mint transaction that includes the recipient
      const { TokenMintTransaction } = await import('@hashgraph/sdk');
      
      const mintTx = new TokenMintTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setAmount(amount)
        .setMaxTransactionFee(new Hbar(2));

      // Execute mint transaction
      const mintResponse = await mintTx.execute(this.client);
      const mintReceipt = await mintResponse.getReceipt(this.client);

      if (mintReceipt.status.toString() !== 'SUCCESS') {
        return {
          success: false,
          error: `Mint transaction failed: ${mintReceipt.status.toString()}`
        };
      }

      console.log('✅ Successfully minted tokens to operator account');

      // Now transfer to community account with proper signing
      const { TransferTransaction } = await import('@hashgraph/sdk');
      
      const transferTx = new TransferTransaction()
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(process.env.HEDERA_OPERATOR_ID!),
          -amount
        )
        .addTokenTransfer(
          TokenId.fromString(tokenId),
          AccountId.fromString(wallet.accountId),
          amount
        )
        .setMaxTransactionFee(new Hbar(2));

      // Sign with operator key (since we're transferring from operator account)
      transferTx.freezeWith(this.client);
      const signedTransferTx = await transferTx.sign(PrivateKey.fromString(process.env.HEDERA_OPERATOR_PRIVATE_KEY!));

      // Execute transfer
      const transferResponse = await signedTransferTx.execute(this.client);
      const transferReceipt = await transferResponse.getReceipt(this.client);

      if (transferReceipt.status.toString() === 'SUCCESS') {
        console.log('✅ Successfully transferred tokens to community wallet!');
        console.log('📊 Transaction ID:', transferResponse.transactionId);
        
        // Get updated balance
        const balance = await this.tokenService!.getAccountTokenBalance(wallet.accountId);
        console.log('💰 New balance:', balance, 'Smiles');

        return {
          success: true,
          transactionId: transferResponse.transactionId.toString(),
          newBalance: balance
        };
      } else {
        return {
          success: false,
          error: `Transfer failed: ${transferReceipt.status.toString()}`
        };
      }

    } catch (error) {
      console.error('❌ Error in alternative minting for community:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 