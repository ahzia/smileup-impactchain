import {
  Client,
  TokenId,
  AccountId,
  PrivateKey,
  TokenMintTransaction,
  TokenBurnTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TransactionReceiptQuery,
  Status
} from "@hashgraph/sdk";

export interface TokenBalance {
  tokenId: string;
  balance: number;
  decimals: number;
}

export interface TransferResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  newBalance?: number;
}

export class TokenService {
  private client: Client;
  private tokenId: TokenId;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor(
    client: Client,
    tokenId: string,
    operatorId: string,
    operatorKey: string
  ) {
    this.client = client;
    this.tokenId = TokenId.fromString(tokenId);
    this.operatorId = AccountId.fromString(operatorId);
    this.operatorKey = PrivateKey.fromString(operatorKey);
  }

  /**
   * Mint new Smiles tokens
   */
  async mintTokens(amount: number, recipientId?: string): Promise<TransferResult> {
    try {
      console.log(`🪙 Minting ${amount} SMILE tokens...`);

      const mintTx = new TokenMintTransaction()
        .setTokenId(this.tokenId)
        .setAmount(amount);

      const mintResponse = await mintTx.execute(this.client);
      const mintReceipt = await mintResponse.getReceipt(this.client);

      if (mintReceipt.status !== Status.Success) {
        throw new Error(`Mint transaction failed with status: ${mintReceipt.status}`);
      }

      console.log(`✅ Successfully minted ${amount} SMILE tokens`);
      console.log(`📊 Transaction ID: ${mintResponse.transactionId}`);

      // If recipient is specified, transfer the minted tokens
      if (recipientId) {
        return await this.transferTokens(amount, recipientId);
      }

      return {
        success: true,
        transactionId: mintResponse.transactionId.toString(),
        newBalance: await this.getTokenBalance()
      };

    } catch (error) {
      console.error("❌ Error minting tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Burn Smiles tokens
   */
  async burnTokens(amount: number): Promise<TransferResult> {
    try {
      console.log(`🔥 Burning ${amount} SMILE tokens...`);

      const burnTx = new TokenBurnTransaction()
        .setTokenId(this.tokenId)
        .setAmount(amount);

      const burnResponse = await burnTx.execute(this.client);
      const burnReceipt = await burnResponse.getReceipt(this.client);

      if (burnReceipt.status !== Status.Success) {
        throw new Error(`Burn transaction failed with status: ${burnReceipt.status}`);
      }

      console.log(`✅ Successfully burned ${amount} SMILE tokens`);
      console.log(`📊 Transaction ID: ${burnResponse.transactionId}`);

      return {
        success: true,
        transactionId: burnResponse.transactionId.toString(),
        newBalance: await this.getTokenBalance()
      };

    } catch (error) {
      console.error("❌ Error burning tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Transfer Smiles tokens to another account
   */
  async transferTokens(amount: number, recipientId: string): Promise<TransferResult> {
    try {
      console.log(`💸 Transferring ${amount} SMILE tokens to ${recipientId}...`);

      const recipientAccountId = AccountId.fromString(recipientId);

      const transferTx = new TransferTransaction()
        .addTokenTransfer(
          this.tokenId,
          this.operatorId,
          -amount
        )
        .addTokenTransfer(
          this.tokenId,
          recipientAccountId,
          amount
        );

      const transferResponse = await transferTx.execute(this.client);
      const transferReceipt = await transferResponse.getReceipt(this.client);

      if (transferReceipt.status !== Status.Success) {
        throw new Error(`Transfer transaction failed with status: ${transferReceipt.status}`);
      }

      console.log(`✅ Successfully transferred ${amount} SMILE tokens`);
      console.log(`📊 Transaction ID: ${transferResponse.transactionId}`);

      return {
        success: true,
        transactionId: transferResponse.transactionId.toString(),
        newBalance: await this.getTokenBalance()
      };

    } catch (error) {
      console.error("❌ Error transferring tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Get Smiles token balance for the operator account
   */
  async getTokenBalance(): Promise<number> {
    try {
      const balanceQuery = new AccountBalanceQuery()
        .setAccountId(this.operatorId);

      const balance = await balanceQuery.execute(this.client);
      
      // Check if we have the Smiles token
      if (balance.tokens && balance.tokens.has(this.tokenId)) {
        return balance.tokens.get(this.tokenId)!.toNumber();
      }
      
      return 0;
    } catch (error) {
      console.error("❌ Error getting token balance:", error);
      return 0;
    }
  }

  /**
   * Get Smiles token balance for any account
   */
  async getAccountTokenBalance(accountId: string): Promise<number> {
    try {
      const account = AccountId.fromString(accountId);
      const balanceQuery = new AccountBalanceQuery()
        .setAccountId(account);

      const balance = await balanceQuery.execute(this.client);
      
      // Check if we have the Smiles token
      if (balance.tokens && balance.tokens.has(this.tokenId)) {
        return balance.tokens.get(this.tokenId)!.toNumber();
      }
      
      return 0;
    } catch (error) {
      console.error(`❌ Error getting token balance for account ${accountId}:`, error);
      return 0;
    }
  }

  /**
   * Get HBAR balance for any account
   */
  async getAccountHbarBalance(accountId: string): Promise<number> {
    try {
      const account = AccountId.fromString(accountId);
      const balanceQuery = new AccountBalanceQuery()
        .setAccountId(account);

      const balance = await balanceQuery.execute(this.client);
      const balanceStr = balance.hbars.toString();
      
      if (balanceStr.includes('ℏ')) {
        const balanceInHbar = balanceStr.split(' ')[0];
        return parseFloat(balanceInHbar);
      } else {
        const balanceInTinybars = balanceStr.split(' ')[0];
        return parseFloat(balanceInTinybars) / 100000000;
      }
    } catch (error) {
      console.error(`❌ Error getting HBAR balance for account ${accountId}:`, error);
      return 0;
    }
  }

  /**
   * Reward user with Smiles tokens for mission completion
   */
  async rewardUser(userId: string, amount: number, missionId: string): Promise<TransferResult> {
    try {
      console.log(`🏆 Rewarding user ${userId} with ${amount} SMILE for mission ${missionId}...`);

      // First mint tokens to operator account
      const mintResult = await this.mintTokens(amount);
      if (!mintResult.success) {
        throw new Error(`Failed to mint tokens: ${mintResult.error}`);
      }

      // Then transfer to user
      const transferResult = await this.transferTokens(amount, userId);
      if (!transferResult.success) {
        throw new Error(`Failed to transfer tokens: ${transferResult.error}`);
      }

      console.log(`✅ Successfully rewarded user ${userId} with ${amount} SMILE`);
      return transferResult;

    } catch (error) {
      console.error("❌ Error rewarding user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Process bazaar purchase (burn tokens)
   */
  async processPurchase(userId: string, amount: number, rewardId: string): Promise<TransferResult> {
    try {
      console.log(`🛒 Processing purchase for user ${userId}, burning ${amount} SMILE for reward ${rewardId}...`);

      // For now, we'll burn tokens from the operator account
      // In a real implementation, you'd transfer from user to operator first
      const burnResult = await this.burnTokens(amount);
      
      if (burnResult.success) {
        console.log(`✅ Successfully processed purchase, burned ${amount} SMILE`);
      }

      return burnResult;

    } catch (error) {
      console.error("❌ Error processing purchase:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Get token information
   */
  getTokenInfo() {
    return {
      tokenId: this.tokenId.toString(),
      name: "Smiles",
      symbol: "SMILE",
      decimals: 6,
      operatorId: this.operatorId.toString()
    };
  }
} 