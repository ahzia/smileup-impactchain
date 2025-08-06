import { 
  AccountId, 
  PrivateKey, 
  PublicKey, 
  Client, 
  AccountCreateTransaction,
  Hbar,
  TransferTransaction,
  AccountBalanceQuery
} from '@hashgraph/sdk';
import { prisma } from '@/lib/database/client';
import bcrypt from 'bcryptjs';

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

  constructor() {
    // Initialize Hedera client for testnet
    this.client = Client.forTestnet();
    
    // Set operator credentials from environment
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorPrivateKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
    
    if (operatorId && operatorPrivateKey) {
      this.client.setOperator(operatorId, operatorPrivateKey);
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

      // Encrypt the private key before storing
      const encryptedPrivateKey = await bcrypt.hash(privateKey.toString(), 12);

      // Store wallet in database
      const wallet = await prisma.communityWallet.create({
        data: {
          communityId,
          accountId,
          publicKey: publicKey.toString(),
          encryptedPrivateKey,
          hbarBalance: 1.0,
          smilesBalance: 0,
          isActive: true
        }
      });

      console.log('✅ Stored community wallet in database:', wallet.id);

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
      console.error('❌ Failed to create community wallet:', error);
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
      const privateKey = PrivateKey.fromString(wallet.encryptedPrivateKey);

      // Create transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(wallet.accountId, new Hbar(-amount))
        .addHbarTransfer(toAccountId, new Hbar(amount))
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return receipt.transactionId.toString();
    } catch (error) {
      console.error('❌ Failed to transfer HBAR from community wallet:', error);
      throw error;
    }
  }

  // Get account balance from Hedera
  async getAccountBalance(accountId: string): Promise<WalletBalance> {
    try {
      const accountBalance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId))
        .execute(this.client);

      return {
        hbar: accountBalance.hbars.toTinybars() / 100000000,
        smiles: 0
      };
    } catch (error) {
      console.error('❌ Failed to get account balance:', error);
      throw error;
    }
  }

  // Sync wallet balance with Hedera
  async syncWalletBalance(walletId: string): Promise<WalletBalance> {
    try {
      const wallet = await prisma.communityWallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        throw new Error('Community wallet not found');
      }

      const balance = await this.getAccountBalance(wallet.accountId);
      
      // Update database with current balance
      await this.updateWalletBalance(walletId, balance);

      return balance;
    } catch (error) {
      console.error('❌ Failed to sync community wallet balance:', error);
      throw error;
    }
  }
} 