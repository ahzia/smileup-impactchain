import { TokenService } from '../hedera/tokenService';
import { HCSService } from '../hedera/hcsService';
import { CustodialWalletService } from '../wallet/custodialWalletService';
import { CommunityWalletService } from '../wallet/communityWalletService';
import { prisma } from '../database/client';
import { Client } from '@hashgraph/sdk';

export interface MissionCompletionData {
  userId: string;
  missionId: string;
  proofText?: string;
  proofImages?: string[];
}

export interface RewardPurchaseData {
  userId: string;
  rewardId: string;
}

export class BlockchainService {
  private static client: Client;
  private static tokenService: TokenService;
  private static hcsService: HCSService;
  private static custodialWalletService: CustodialWalletService;
  private static communityWalletService: CommunityWalletService;

  private static initializeServices() {
    if (!this.client) {
      this.client = Client.forTestnet();
      const operatorId = process.env.HEDERA_OPERATOR_ID;
      const operatorKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
      const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
      
      if (operatorId && operatorKey && tokenId) {
        this.client.setOperator(operatorId, operatorKey);
        this.tokenService = new TokenService(this.client, tokenId, operatorId, operatorKey);
        this.hcsService = new HCSService(this.client, operatorId, operatorKey);
        this.custodialWalletService = new CustodialWalletService();
        this.communityWalletService = new CommunityWalletService();
      } else {
        throw new Error('Missing required Hedera environment variables');
      }
    }
  }

  // ========================================
  // MISSION COMPLETION WITH BLOCKCHAIN
  // ========================================

  static async completeMissionWithBlockchain(data: MissionCompletionData) {
    this.initializeServices();
    const { userId, missionId, proofText, proofImages } = data;

    // Get mission details
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { community: true }
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    // Get user's custodial wallet
    const userWallet = await this.custodialWalletService.getWalletForUser(userId);
    if (!userWallet) {
      throw new Error('User wallet not found');
    }

    let blockchainTransactionId: string | undefined;
    let proofHash: string | undefined;

    try {
      // If mission is created by a community, transfer from community wallet to user wallet
      if (mission.communityId && mission.community) {
        console.log(`🎯 Mission ${missionId} is community-sponsored. Transferring ${mission.reward} Smiles from community to user.`);
        
        // Get community wallet
        const communityWallet = await this.communityWalletService.getWalletForCommunity(mission.communityId);
        if (!communityWallet) {
          throw new Error('Community wallet not found');
        }

        // Transfer tokens from community to user
        const transferResult = await this.tokenService.transferTokens(
          mission.reward,
          userWallet.accountId
        );

        blockchainTransactionId = transferResult.transactionId;
        console.log(`✅ Transferred ${mission.reward} Smiles from community ${mission.communityId} to user ${userId}. Transaction: ${blockchainTransactionId}`);

      } else {
        // If mission is not community-sponsored, mint tokens to user
        console.log(`🎯 Mission ${missionId} is platform-sponsored. Minting ${mission.reward} Smiles to user.`);
        
        const mintResult = await this.tokenService.mintTokens(mission.reward, userWallet.accountId);
        blockchainTransactionId = mintResult.transactionId;
        console.log(`✅ Minted ${mission.reward} Smiles to user ${userId}. Transaction: ${blockchainTransactionId}`);
      }

      // Log proof to HCS
      const proofData = {
        missionId,
        userId,
        completionDate: new Date().toISOString(),
        rewardAmount: mission.reward,
        impactMetrics: {
          smilesEarned: mission.reward,
          communitiesHelped: mission.communityId ? 1 : 0,
          challengesCompleted: 1
        },
        proofHash: blockchainTransactionId || 'pending'
      };

      const hcsResult = await this.hcsService.logMissionCompletion(proofData);
      proofHash = hcsResult;
      console.log(`📝 Logged mission proof to HCS. Message ID: ${proofHash}`);

      // Get real-time balance after transaction
      const realTimeBalance = await this.getUserBalance(userId);

      return {
        success: true,
        blockchainTransactionId,
        proofHash,
        reward: mission.reward,
        newBalance: realTimeBalance
      };

    } catch (error) {
      console.error('❌ Blockchain mission completion failed:', error);
      throw new Error(`Blockchain operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========================================
  // REWARD PURCHASE WITH BLOCKCHAIN
  // ========================================

  static async purchaseRewardWithBlockchain(data: RewardPurchaseData) {
    this.initializeServices();
    const { userId, rewardId } = data;

    // Get reward details
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
      include: { community: true }
    });

    if (!reward) {
      throw new Error('Reward not found');
    }

    // Get user's custodial wallet
    const userWallet = await this.custodialWalletService.getWalletForUser(userId);
    if (!userWallet) {
      throw new Error('User wallet not found');
    }

    // Check if user has enough smiles
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.smiles < reward.price) {
      throw new Error('Insufficient smiles');
    }

    let blockchainTransactionId: string | undefined;

    try {
      // If reward is created by a community, transfer from user to community wallet
      if (reward.communityId && reward.community) {
        console.log(`🛒 Reward ${rewardId} is community-provided. Transferring ${reward.price} Smiles from user to community.`);
        
        // Get community wallet
        const communityWallet = await this.communityWalletService.getWalletForCommunity(reward.communityId);
        if (!communityWallet) {
          throw new Error('Community wallet not found');
        }

        // Transfer tokens from user to community
        const transferResult = await this.tokenService.transferTokens(
          reward.price,
          communityWallet.accountId
        );

        blockchainTransactionId = transferResult.transactionId;
        console.log(`✅ Transferred ${reward.price} Smiles from user ${userId} to community ${reward.communityId}. Transaction: ${blockchainTransactionId}`);

      } else {
        // If reward is platform-provided, burn tokens from user
        console.log(`🛒 Reward ${rewardId} is platform-provided. Burning ${reward.price} Smiles from user.`);
        
        const burnResult = await this.tokenService.burnTokens(reward.price);
        blockchainTransactionId = burnResult.transactionId;
        console.log(`✅ Burned ${reward.price} Smiles from user ${userId}. Transaction: ${blockchainTransactionId}`);
      }

      // Log purchase to HCS (using donation proof for now)
      try {
        const purchaseData = {
          donationId: `reward-${rewardId}-${userId}`,
          fromUserId: userId,
          toCommunityId: reward.communityId || 'platform',
          amount: reward.price,
          donationDate: new Date().toISOString(),
          message: `Purchased reward: ${reward.name}`,
          proofHash: blockchainTransactionId || 'pending'
        };

        await this.hcsService.logDonation(purchaseData);
        console.log(`📝 Logged reward purchase to HCS`);
      } catch (hcsError) {
        console.warn('⚠️ HCS logging failed, but reward purchase transaction succeeded:', hcsError);
        // Don't fail the entire transaction if HCS logging fails
      }

      // Get real-time balance after transaction
      const realTimeBalance = await this.getUserBalance(userId);

      return {
        success: true,
        blockchainTransactionId,
        price: reward.price,
        newBalance: realTimeBalance
      };

    } catch (error) {
      console.error('❌ Blockchain reward purchase failed:', error);
      throw new Error(`Blockchain operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========================================
  // DONATION TRANSFERS
  // ========================================

  static async transferDonation(data: {
    userId: string;
    communityId?: string;
    amount: number;
    postId: string;
  }) {
    try {
      // Check if user has enough smiles (real-time balance)
      const userBalance = await this.getUserBalance(data.userId);
      if (userBalance < data.amount) {
        throw new Error('Insufficient smiles balance');
      }

      let newCommunitySmiles: number | undefined;
      let blockchainTransactionId: string | undefined;

      if (data.communityId) {
        // Get or create community wallet
        let communityWallet = await this.communityWalletService.getWalletForCommunity(data.communityId);
        
        if (!communityWallet) {
          console.log(`🔄 Community wallet not found for ${data.communityId}, creating one...`);
          communityWallet = await this.communityWalletService.createWalletForCommunity(data.communityId);
          
          if (!communityWallet) {
            throw new Error('Failed to create community wallet');
          }
          
          console.log(`✅ Successfully created community wallet: ${communityWallet.accountId}`);
        }

        // Transfer tokens from user to community
        const transferResult = await this.tokenService.transferTokens(
          data.amount, communityWallet.accountId
        );

        if (!transferResult.success) {
          throw new Error('Failed to transfer tokens to community');
        }

        blockchainTransactionId = transferResult.transactionId;
        newCommunitySmiles = await this.getCommunityBalance(data.communityId);

      } else {
        // Burn tokens from user for platform donations
        const burnResult = await this.tokenService.burnTokens(data.amount);
        
        if (!burnResult.success) {
          throw new Error('Failed to burn tokens');
        }

        blockchainTransactionId = burnResult.transactionId;
      }

      // Log to HCS with error handling
      try {
        await this.hcsService.logDonation({
          donationId: `donation_${Date.now()}`,
          fromUserId: data.userId,
          toCommunityId: data.communityId || 'platform',
          amount: data.amount,
          donationDate: new Date().toISOString(),
          message: `Donation to ${data.communityId ? 'community' : 'platform'}`,
          proofHash: blockchainTransactionId || `donation_${Date.now()}`
        });
        console.log(`📝 Logged donation to HCS`);
      } catch (hcsError) {
        console.warn('⚠️ HCS logging failed, but transaction succeeded:', hcsError);
      }

      return {
        success: true,
        blockchainTransactionId,
        newCommunitySmiles
      };

    } catch (error) {
      console.error('❌ Blockchain donation transfer failed:', error);
      throw new Error(`Blockchain operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  static async getUserBalance(userId: string): Promise<number> {
    try {
      this.initializeServices();
      const walletBalance = await this.custodialWalletService.getUserBalance(userId);
      return walletBalance.smiles;
    } catch (error) {
      console.error('❌ Error getting user balance:', error);
      return 0;
    }
  }

  static async getCommunityBalance(communityId: string): Promise<number> {
    try {
      const walletBalance = await this.communityWalletService.getCommunityBalance(communityId);
      return walletBalance.smiles;
    } catch (error) {
      console.error('❌ Error getting community balance:', error);
      return 0;
    }
  }

  static async validateBlockchainConnection(): Promise<boolean> {
    try {
      this.initializeServices();
      // Test token service connection
      await this.tokenService.getTokenBalance();
      return true;
    } catch (error) {
      console.error('Blockchain connection validation failed:', error);
      return false;
    }
  }
} 