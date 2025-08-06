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

export interface CustodialWallet {
  id: string;
  userId: string;
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

export class CustodialWalletService {
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

  // Generate a new Hedera account for a user
  async createWalletForUser(userId: string): Promise<CustodialWallet> {
    try {
      console.log('🔐 Creating custodial wallet for user:', userId);

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
      console.log('✅ Created Hedera account:', accountId);

      // Encrypt the private key before storing
      const encryptedPrivateKey = await bcrypt.hash(privateKey.toString(), 12);

      // Store wallet in database
      const wallet = await prisma.custodialWallet.create({
        data: {
          userId,
          accountId,
          publicKey: publicKey.toString(),
          encryptedPrivateKey,
          hbarBalance: 1.0,
          smilesBalance: 0,
          isActive: true
        }
      });

      console.log('✅ Stored wallet in database:', wallet.id);

      return {
        id: wallet.id,
        userId: wallet.userId,
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
      console.error('❌ Error creating custodial wallet:', error);
      throw error;
    }
  }

  // Get wallet for a user
  async getWalletForUser(userId: string): Promise<CustodialWallet | null> {
    try {
      const wallet = await prisma.custodialWallet.findFirst({
        where: {
          userId,
          isActive: true
        }
      });

      if (!wallet) {
        return null;
      }

      return {
        id: wallet.id,
        userId: wallet.userId,
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
      console.error('❌ Error getting custodial wallet:', error);
      throw error;
    }
  }

  // Update wallet balance
  async updateWalletBalance(walletId: string, balance: WalletBalance): Promise<void> {
    try {
      await prisma.custodialWallet.update({
        where: { id: walletId },
        data: {
          hbarBalance: balance.hbar,
          smilesBalance: balance.smiles,
          updatedAt: new Date()
        }
      });

      console.log('✅ Updated wallet balance:', balance);
    } catch (error) {
      console.error('❌ Error updating wallet balance:', error);
      throw error;
    }
  }

  // Transfer HBAR between accounts
  async transferHbar(fromWalletId: string, toAccountId: string, amount: number): Promise<string> {
    try {
      // Get the sender's wallet
      const fromWallet = await prisma.custodialWallet.findUnique({
        where: { id: fromWalletId }
      });

      if (!fromWallet) {
        throw new Error('Sender wallet not found');
      }

      // Decrypt the private key (in production, use proper encryption)
      const privateKey = PrivateKey.fromString(fromWallet.encryptedPrivateKey);
      
      // Create transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(fromWallet.accountId, new Hbar(-amount))
        .addHbarTransfer(toAccountId, new Hbar(amount))
        .setMaxTransactionFee(new Hbar(2));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log('✅ HBAR transfer completed:', receipt.status.toString());
      return receipt.status.toString();

    } catch (error) {
      console.error('❌ Error transferring HBAR:', error);
      throw error;
    }
  }

  // Get account balance from Hedera network
  async getAccountBalance(accountId: string): Promise<WalletBalance> {
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId));
      
      const accountBalance = await query.execute(this.client);
      
      return {
        hbar: accountBalance.hbars.toTinybars() / 100000000, // Convert to HBAR
        smiles: 0 // TODO: Implement Smiles token balance query
      };

    } catch (error) {
      console.error('❌ Error getting account balance:', error);
      return {
        hbar: 0,
        smiles: 0
      };
    }
  }

  // Sync wallet balance with Hedera network
  async syncWalletBalance(walletId: string): Promise<WalletBalance> {
    try {
      const wallet = await prisma.custodialWallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balance = await this.getAccountBalance(wallet.accountId);
      
      // Update database with current balance
      await this.updateWalletBalance(walletId, balance);

      return balance;

    } catch (error) {
      console.error('❌ Error syncing wallet balance:', error);
      throw error;
    }
  }
} 