import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

export interface WalletConnection {
  accountId: string;
  publicKey: string;
  isConnected: boolean;
  balance?: number;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  receipt?: any;
}

export class WalletService {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;
  private network: string;

  constructor(
    client: Client,
    operatorId: string,
    operatorKey: string,
    network: string
  ) {
    this.client = client;
    this.operatorId = AccountId.fromString(operatorId);
    this.operatorKey = PrivateKey.fromString(operatorKey);
    this.network = network;
  }

  /**
   * Get wallet connection status
   */
  async getConnectionStatus(): Promise<WalletConnection> {
    try {
      // For now, we'll use the operator account as the connected wallet
      // In a real implementation, this would check HashPack connection
      const { AccountInfoQuery } = require("@hashgraph/sdk");
      const accountInfoQuery = new AccountInfoQuery()
        .setAccountId(this.operatorId);
      
      const accountInfo = await accountInfoQuery.execute(this.client);
      
      return {
        accountId: this.operatorId.toString(),
        publicKey: this.operatorKey.publicKey.toString(),
        isConnected: true,
        balance: this.parseBalance(accountInfo.balance)
      };
    } catch (error) {
      console.error("❌ Error getting wallet connection status:", error);
      return {
        accountId: "",
        publicKey: "",
        isConnected: false
      };
    }
  }

  /**
   * Get HBAR balance for an account
   */
  async getHbarBalance(accountId: string): Promise<number> {
    try {
      const account = AccountId.fromString(accountId);
      const { AccountInfoQuery } = require("@hashgraph/sdk");
      const accountInfoQuery = new AccountInfoQuery()
        .setAccountId(account);
      
      const accountInfo = await accountInfoQuery.execute(this.client);
      return this.parseBalance(accountInfo.balance);
    } catch (error) {
      console.error(`❌ Error getting HBAR balance for ${accountId}:`, error);
      return 0;
    }
  }

  /**
   * Get Smiles token balance for an account
   */
  async getSmilesBalance(accountId: string, tokenId: string): Promise<number> {
    try {
      const account = AccountId.fromString(accountId);
      const balanceQuery = new (require("@hashgraph/sdk")).AccountBalanceQuery()
        .setAccountId(account);

      const balance = await balanceQuery.execute(this.client);
      
      // Check if we have the Smiles token
      if (balance.tokens && balance.tokens.has(tokenId)) {
        return balance.tokens.get(tokenId)!.toNumber();
      }
      
      return 0;
    } catch (error) {
      console.error(`❌ Error getting Smiles balance for ${accountId}:`, error);
      return 0;
    }
  }

  /**
   * Transfer HBAR to another account
   */
  async transferHbar(toAccountId: string, amount: number): Promise<TransactionResult> {
    try {
      console.log(`💸 Transferring ${amount} HBAR to ${toAccountId}...`);

      const toAccount = AccountId.fromString(toAccountId);
      const transferTx = new (require("@hashgraph/sdk")).TransferTransaction()
        .addHbarTransfer(this.operatorId, -amount)
        .addHbarTransfer(toAccount, amount);

      const transferResponse = await transferTx.execute(this.client);
      const transferReceipt = await transferResponse.getReceipt(this.client);

      console.log(`✅ Successfully transferred ${amount} HBAR`);
      console.log(`📊 Transaction ID: ${transferResponse.transactionId}`);

      return {
        success: true,
        transactionId: transferResponse.transactionId.toString(),
        receipt: transferReceipt
      };

    } catch (error) {
      console.error("❌ Error transferring HBAR:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Transfer Smiles tokens to another account
   */
  async transferSmiles(toAccountId: string, amount: number, tokenId: string): Promise<TransactionResult> {
    try {
      console.log(`💸 Transferring ${amount} SMILE to ${toAccountId}...`);

      const toAccount = AccountId.fromString(toAccountId);
      const tokenIdObj = new (require("@hashgraph/sdk")).TokenId(tokenId);
      
      const transferTx = new (require("@hashgraph/sdk")).TransferTransaction()
        .addTokenTransfer(tokenIdObj, this.operatorId, -amount)
        .addTokenTransfer(tokenIdObj, toAccount, amount);

      const transferResponse = await transferTx.execute(this.client);
      const transferReceipt = await transferResponse.getReceipt(this.client);

      console.log(`✅ Successfully transferred ${amount} SMILE`);
      console.log(`📊 Transaction ID: ${transferResponse.transactionId}`);

      return {
        success: true,
        transactionId: transferResponse.transactionId.toString(),
        receipt: transferReceipt
      };

    } catch (error) {
      console.error("❌ Error transferring Smiles:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Get transaction history for an account
   */
  async getTransactionHistory(accountId: string, limit: number = 10): Promise<any[]> {
    try {
      const account = AccountId.fromString(accountId);
      const recordsQuery = new (require("@hashgraph/sdk")).AccountRecordsQuery()
        .setAccountId(account)
        .setMaxResults(limit);

      const records = await recordsQuery.execute(this.client);
      
      return records.map((record: any) => ({
        transactionId: record.transactionId.toString(),
        timestamp: record.consensusTimestamp.toString(),
        memo: record.memo,
        status: record.status.toString()
      }));

    } catch (error) {
      console.error(`❌ Error getting transaction history for ${accountId}:`, error);
      return [];
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      network: this.network,
      explorerUrl: this.network === 'mainnet' 
        ? 'https://hashscan.io' 
        : 'https://hashscan.io/testnet',
      mirrorNodeUrl: this.network === 'mainnet'
        ? 'https://mainnet.mirrornode.hedera.com'
        : 'https://testnet.mirrornode.hedera.com'
    };
  }

  /**
   * Parse balance from Hedera balance object
   */
  private parseBalance(balance: any): number {
    const balanceStr = balance.toString();
    
    if (balanceStr.includes('ℏ')) {
      const balanceInHbar = balanceStr.split(' ')[0];
      return parseFloat(balanceInHbar);
    } else {
      const balanceInTinybars = balanceStr.split(' ')[0];
      return parseFloat(balanceInTinybars) / 100000000;
    }
  }

  /**
   * Connect to HashPack wallet (placeholder for frontend integration)
   */
  async connectHashPack(): Promise<WalletConnection> {
    // This would be implemented in the frontend with HashPack SDK
    console.log("🔗 Connecting to HashPack wallet...");
    
    // For now, return the operator account as connected
    return await this.getConnectionStatus();
  }

  /**
   * Disconnect from HashPack wallet
   */
  async disconnectHashPack(): Promise<void> {
    console.log("🔌 Disconnecting from HashPack wallet...");
    // This would be implemented in the frontend
  }

  /**
   * Sign a transaction with HashPack (placeholder)
   */
  async signTransaction(transaction: any): Promise<TransactionResult> {
    // This would be implemented in the frontend with HashPack SDK
    console.log("✍️ Signing transaction with HashPack...");
    
    return {
      success: false,
      error: "Transaction signing not implemented in backend"
    };
  }
} 