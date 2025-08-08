import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  PrivateKey,
  TopicInfoQuery,
  TopicMessageQuery,
  TopicMessage
} from "@hashgraph/sdk";

export interface MissionProof {
  missionId: string;
  userId: string;
  completionDate: string;
  rewardAmount: number;
  impactMetrics: {
    smilesEarned: number;
    communitiesHelped: number;
    challengesCompleted: number;
  };
  proofHash: string;
}

export interface DonationProof {
  donationId: string;
  fromUserId: string;
  toCommunityId: string;
  amount: number;
  donationDate: string;
  message?: string;
  proofHash: string;
}

export interface BadgeProof {
  badgeId: string;
  userId: string;
  badgeType: string;
  earnedDate: string;
  criteria: string[];
  proofHash: string;
}

export class HCSService {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;
  private missionTopicId?: TopicId;
  private donationTopicId?: TopicId;
  private badgeTopicId?: TopicId;

  constructor(
    client: Client,
    operatorId: string,
    operatorKey: string
  ) {
    this.client = client;
    this.operatorId = AccountId.fromString(operatorId);
    this.operatorKey = PrivateKey.fromString(operatorKey);
  }

  /**
   * Create HCS topics for different types of proofs
   */
  async createTopics(): Promise<{
    missionTopic: TopicId;
    donationTopic: TopicId;
    badgeTopic: TopicId;
  }> {
    try {
      console.log("🏗️ Creating HCS topics for mission proofs...");

      // Create mission completion topic
      const missionTopicTx = new TopicCreateTransaction()
        .setTopicMemo("SmileUp Mission Completion Proofs")
        .setAdminKey(this.operatorKey.publicKey)
        .setSubmitKey(this.operatorKey.publicKey);

      const missionTopicResponse = await missionTopicTx.execute(this.client);
      const missionTopicReceipt = await missionTopicResponse.getReceipt(this.client);
      this.missionTopicId = missionTopicReceipt.topicId!;

      console.log(`✅ Mission topic created: ${this.missionTopicId}`);

      // Create donation topic
      const donationTopicTx = new TopicCreateTransaction()
        .setTopicMemo("SmileUp Donation Proofs")
        .setAdminKey(this.operatorKey.publicKey)
        .setSubmitKey(this.operatorKey.publicKey);

      const donationTopicResponse = await donationTopicTx.execute(this.client);
      const donationTopicReceipt = await donationTopicResponse.getReceipt(this.client);
      this.donationTopicId = donationTopicReceipt.topicId!;

      console.log(`✅ Donation topic created: ${this.donationTopicId}`);

      // Create badge topic
      const badgeTopicTx = new TopicCreateTransaction()
        .setTopicMemo("SmileUp Badge Award Proofs")
        .setAdminKey(this.operatorKey.publicKey)
        .setSubmitKey(this.operatorKey.publicKey);

      const badgeTopicResponse = await badgeTopicTx.execute(this.client);
      const badgeTopicReceipt = await badgeTopicResponse.getReceipt(this.client);
      this.badgeTopicId = badgeTopicReceipt.topicId!;

      console.log(`✅ Badge topic created: ${this.badgeTopicId}`);

      return {
        missionTopic: this.missionTopicId,
        donationTopic: this.donationTopicId,
        badgeTopic: this.badgeTopicId
      };

    } catch (error) {
      console.error("❌ Error creating HCS topics:", error);
      throw error;
    }
  }

  /**
   * Log mission completion proof
   */
  async logMissionCompletion(proof: MissionProof): Promise<string> {
    try {
      if (!this.missionTopicId) {
        throw new Error("Mission topic not created. Call createTopics() first.");
      }

      console.log(`📝 Logging mission completion proof for mission ${proof.missionId}...`);

      const message = JSON.stringify({
        type: "mission_completion",
        data: proof,
        timestamp: new Date().toISOString()
      });

      const submitTx = new TopicMessageSubmitTransaction()
        .setTopicId(this.missionTopicId)
        .setMessage(message);

      const submitResponse = await submitTx.execute(this.client);
      const submitReceipt = await submitResponse.getReceipt(this.client);

      console.log(`✅ Mission completion proof logged`);
      console.log(`📊 Transaction ID: ${submitResponse.transactionId}`);
      console.log(`🔗 Topic ID: ${this.missionTopicId}`);

      return submitResponse.transactionId.toString();

    } catch (error) {
      console.error("❌ Error logging mission completion:", error);
      throw error;
    }
  }

  /**
   * Log donation proof
   */
  async logDonation(proof: DonationProof): Promise<string> {
    try {
      if (!this.donationTopicId) {
        throw new Error("Donation topic not created. Call createTopics() first.");
      }

      console.log(`📝 Logging donation proof for donation ${proof.donationId}...`);

      const message = JSON.stringify({
        type: "donation",
        data: proof,
        timestamp: new Date().toISOString()
      });

      const submitTx = new TopicMessageSubmitTransaction()
        .setTopicId(this.donationTopicId)
        .setMessage(message);

      const submitResponse = await submitTx.execute(this.client);
      const submitReceipt = await submitResponse.getReceipt(this.client);

      console.log(`✅ Donation proof logged`);
      console.log(`📊 Transaction ID: ${submitResponse.transactionId}`);
      console.log(`🔗 Topic ID: ${this.donationTopicId}`);

      return submitResponse.transactionId.toString();

    } catch (error) {
      console.error("❌ Error logging donation:", error);
      throw error;
    }
  }

  /**
   * Log badge award proof
   */
  async logBadgeAward(proof: BadgeProof): Promise<string> {
    try {
      if (!this.badgeTopicId) {
        throw new Error("Badge topic not created. Call createTopics() first.");
      }

      console.log(`📝 Logging badge award proof for badge ${proof.badgeId}...`);

      const message = JSON.stringify({
        type: "badge_award",
        data: proof,
        timestamp: new Date().toISOString()
      });

      const submitTx = new TopicMessageSubmitTransaction()
        .setTopicId(this.badgeTopicId)
        .setMessage(message);

      const submitResponse = await submitTx.execute(this.client);
      const submitReceipt = await submitResponse.getReceipt(this.client);

      console.log(`✅ Badge award proof logged`);
      console.log(`📊 Transaction ID: ${submitResponse.transactionId}`);
      console.log(`🔗 Topic ID: ${this.badgeTopicId}`);

      return submitResponse.transactionId.toString();

    } catch (error) {
      console.error("❌ Error logging badge award:", error);
      throw error;
    }
  }

  /**
   * Get topic information
   */
  async getTopicInfo(topicId: TopicId): Promise<any> {
    try {
      const topicInfoQuery = new TopicInfoQuery()
        .setTopicId(topicId);

      const topicInfo = await topicInfoQuery.execute(this.client);
      return topicInfo;
    } catch (error) {
      console.error("❌ Error getting topic info:", error);
      throw error;
    }
  }

  /**
   * Get recent messages from a topic
   */
  async getTopicMessages(topicId: TopicId, limit: number = 10): Promise<TopicMessage[]> {
    try {
      const messages: TopicMessage[] = [];
      const topicMessageQuery = new TopicMessageQuery()
        .setTopicId(topicId)
        .setLimit(limit);

      // Use a different approach to iterate through messages
      let count = 0;
      const messageStream = topicMessageQuery.subscribe(this.client, (message) => {
        messages.push(message);
        count++;
        if (count >= limit) {
          return false; // Stop subscription
        }
        return true; // Continue subscription
      });

      // Wait for messages to be collected
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      return messages;
    } catch (error) {
      console.error("❌ Error getting topic messages:", error);
      throw error;
    }
  }

  /**
   * Verify a proof by checking if it exists in the topic
   */
  async verifyProof(topicId: TopicId, proofHash: string): Promise<boolean> {
    try {
      const messages = await this.getTopicMessages(topicId, 100);
      
      for (const message of messages) {
        try {
          const data = JSON.parse(message.contents.toString());
          if (data.data.proofHash === proofHash) {
            return true;
          }
        } catch (e) {
          // Skip invalid JSON messages
          continue;
        }
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error verifying proof:", error);
      return false;
    }
  }

  /**
   * Get impact analytics from topic messages
   */
  async getImpactAnalytics(topicId: TopicId): Promise<{
    totalMissions: number;
    totalDonations: number;
    totalBadges: number;
    totalSmilesEarned: number;
    totalCommunitiesHelped: number;
  }> {
    try {
      const messages = await this.getTopicMessages(topicId, 1000);
      const analytics = {
        totalMissions: 0,
        totalDonations: 0,
        totalBadges: 0,
        totalSmilesEarned: 0,
        totalCommunitiesHelped: 0
      };

      for (const message of messages) {
        try {
          const data = JSON.parse(message.contents.toString());
          
          switch (data.type) {
            case "mission_completion":
              analytics.totalMissions++;
              analytics.totalSmilesEarned += data.data.impactMetrics.smilesEarned;
              analytics.totalCommunitiesHelped += data.data.impactMetrics.communitiesHelped;
              break;
            case "donation":
              analytics.totalDonations++;
              break;
            case "badge_award":
              analytics.totalBadges++;
              break;
          }
        } catch (e) {
          // Skip invalid JSON messages
          continue;
        }
      }

      return analytics;
    } catch (error) {
      console.error("❌ Error getting impact analytics:", error);
      throw error;
    }
  }
} 