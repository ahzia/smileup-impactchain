# SmileUp ImpactChain — Mission Proof System

## 🎯 **Mission Proof Overview**

The Mission Proof System uses **Hedera Consensus Service (HCS)** to create immutable, verifiable records of all mission-related activities. This ensures transparency and builds trust in the impact ecosystem.

### **Proof Types**
- **Mission Completion**: User completes a mission
- **Mission Creation**: Organization creates a new mission
- **Donation**: User donates to a community
- **Reward Distribution**: Tokens distributed for mission completion
- **Badge Award**: User earns a new badge

---

## 🏗️ **HCS Topic Structure**

### **1. Topic Configuration**

Create `src/lib/hedera/hcsService.ts`:

```typescript
import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TopicId,
  PrivateKey,
  AccountId
} from "@hashgraph/sdk";
import { HederaClient } from "./client";

export class HCSService {
  private client: Client;
  private topics: Map<string, TopicId> = new Map();

  constructor() {
    this.client = HederaClient.getInstance().getClient();
  }

  // Create HCS topics for different event types
  async createTopics(): Promise<void> {
    const topicTypes = [
      'mission-completion',
      'mission-creation', 
      'donation',
      'reward-distribution',
      'badge-award',
      'community-event'
    ];

    for (const topicType of topicTypes) {
      await this.createTopic(topicType);
    }
  }

  // Create a single topic
  async createTopic(topicName: string): Promise<TopicId> {
    try {
      const topicCreateTx = new TopicCreateTransaction()
        .setTopicMemo(`SmileUp ${topicName} events`)
        .setAdminKey(this.client.operatorPublicKey)
        .setSubmitKey(this.client.operatorPublicKey);

      const response = await topicCreateTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      const topicId = receipt.topicId;

      this.topics.set(topicName, topicId);
      
      console.log(`✅ Created HCS topic: ${topicName} -> ${topicId}`);
      return topicId;
    } catch (error) {
      console.error(`❌ Error creating topic ${topicName}:`, error);
      throw error;
    }
  }

  // Submit message to a topic
  async submitMessage(
    topicName: string, 
    message: any, 
    memo?: string
  ): Promise<string> {
    try {
      const topicId = this.topics.get(topicName);
      if (!topicId) {
        throw new Error(`Topic ${topicName} not found`);
      }

      const messageTx = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message))
        .setTransactionMemo(memo || `SmileUp ${topicName} event`);

      const response = await messageTx.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      console.log(`✅ Submitted message to ${topicName}: ${receipt.transactionId}`);
      return receipt.transactionId.toString();
    } catch (error) {
      console.error(`❌ Error submitting message to ${topicName}:`, error);
      throw error;
    }
  }

  // Query messages from a topic
  async queryMessages(
    topicName: string, 
    startTime?: Date, 
    endTime?: Date
  ): Promise<any[]> {
    try {
      const topicId = this.topics.get(topicName);
      if (!topicId) {
        throw new Error(`Topic ${topicName} not found`);
      }

      const query = new TopicMessageQuery()
        .setTopicId(topicId);

      if (startTime) {
        query.setStartTime(startTime);
      }
      if (endTime) {
        query.setEndTime(endTime);
      }

      const messages: any[] = [];
      
      await query.subscribe(this.client, (message) => {
        try {
          const parsedMessage = JSON.parse(message.contents.toString());
          messages.push({
            timestamp: message.consensusTimestamp,
            sequenceNumber: message.sequenceNumber,
            data: parsedMessage
          });
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      });

      return messages;
    } catch (error) {
      console.error(`❌ Error querying messages from ${topicName}:`, error);
      throw error;
    }
  }
}
```

---

## 📝 **Mission Proof Implementation**

### **1. Mission Completion Proof**

Create `src/lib/hedera/missionProofService.ts`:

```typescript
import { HCSService } from "./hcsService";
import { TokenService } from "./tokenService";

export interface MissionCompletionProof {
  missionId: string;
  userId: string;
  communityId: string;
  completionDate: string;
  proofType: 'photo' | 'video' | 'text' | 'location';
  proofData: string;
  rewardAmount: number;
  transactionId?: string;
}

export class MissionProofService {
  private hcsService: HCSService;
  private tokenService: TokenService;

  constructor() {
    this.hcsService = new HCSService();
    this.tokenService = new TokenService();
  }

  // Log mission completion
  async logMissionCompletion(proof: MissionCompletionProof): Promise<string> {
    try {
      // 1. Log to HCS
      const hcsMessage = {
        type: 'mission-completion',
        timestamp: new Date().toISOString(),
        data: proof
      };

      const hcsTxId = await this.hcsService.submitMessage(
        'mission-completion',
        hcsMessage,
        `Mission completion: ${proof.missionId}`
      );

      // 2. Process token reward
      const tokenTxId = await this.tokenService.transferTokens(
        proof.communityId, // from community wallet
        proof.userId,      // to user
        proof.rewardAmount,
        `Mission reward: ${proof.missionId}`
      );

      // 3. Update proof with transaction IDs
      const finalProof = {
        ...proof,
        hcsTransactionId: hcsTxId,
        tokenTransactionId: tokenTxId
      };

      console.log(`✅ Mission completion logged: ${proof.missionId}`);
      return hcsTxId;

    } catch (error) {
      console.error("❌ Error logging mission completion:", error);
      throw error;
    }
  }

  // Log mission creation
  async logMissionCreation(missionData: {
    missionId: string;
    communityId: string;
    title: string;
    description: string;
    rewardAmount: number;
    deadline: string;
    requirements: string[];
  }): Promise<string> {
    try {
      const hcsMessage = {
        type: 'mission-creation',
        timestamp: new Date().toISOString(),
        data: missionData
      };

      const txId = await this.hcsService.submitMessage(
        'mission-creation',
        hcsMessage,
        `Mission creation: ${missionData.missionId}`
      );

      console.log(`✅ Mission creation logged: ${missionData.missionId}`);
      return txId;

    } catch (error) {
      console.error("❌ Error logging mission creation:", error);
      throw error;
    }
  }

  // Log donation
  async logDonation(donationData: {
    userId: string;
    communityId: string;
    amount: number;
    message?: string;
  }): Promise<string> {
    try {
      const hcsMessage = {
        type: 'donation',
        timestamp: new Date().toISOString(),
        data: donationData
      };

      const txId = await this.hcsService.submitMessage(
        'donation',
        hcsMessage,
        `Donation: ${donationData.userId} -> ${donationData.communityId}`
      );

      console.log(`✅ Donation logged: ${donationData.userId} -> ${donationData.communityId}`);
      return txId;

    } catch (error) {
      console.error("❌ Error logging donation:", error);
      throw error;
    }
  }

  // Log badge award
  async logBadgeAward(badgeData: {
    userId: string;
    badgeId: string;
    badgeName: string;
    badgeType: string;
    earnedDate: string;
  }): Promise<string> {
    try {
      const hcsMessage = {
        type: 'badge-award',
        timestamp: new Date().toISOString(),
        data: badgeData
      };

      const txId = await this.hcsService.submitMessage(
        'badge-award',
        hcsMessage,
        `Badge award: ${badgeData.badgeName} to ${badgeData.userId}`
      );

      console.log(`✅ Badge award logged: ${badgeData.badgeName} -> ${badgeData.userId}`);
      return txId;

    } catch (error) {
      console.error("❌ Error logging badge award:", error);
      throw error;
    }
  }
}
```

---

## 🔍 **Proof Verification**

### **1. Proof Verification Service**

Create `src/lib/hedera/proofVerificationService.ts`:

```typescript
import { HCSService } from "./hcsService";

export class ProofVerificationService {
  private hcsService: HCSService;

  constructor() {
    this.hcsService = new HCSService();
  }

  // Verify mission completion proof
  async verifyMissionCompletion(
    missionId: string, 
    userId: string
  ): Promise<{
    verified: boolean;
    proof?: any;
    timestamp?: string;
  }> {
    try {
      const messages = await this.hcsService.queryMessages('mission-completion');
      
      const proof = messages.find(msg => 
        msg.data.missionId === missionId && 
        msg.data.userId === userId
      );

      if (proof) {
        return {
          verified: true,
          proof: proof.data,
          timestamp: proof.timestamp.toString()
        };
      }

      return { verified: false };

    } catch (error) {
      console.error("❌ Error verifying mission completion:", error);
      return { verified: false };
    }
  }

  // Get user's mission history
  async getUserMissionHistory(userId: string): Promise<any[]> {
    try {
      const messages = await this.hcsService.queryMessages('mission-completion');
      
      return messages
        .filter(msg => msg.data.userId === userId)
        .map(msg => ({
          missionId: msg.data.missionId,
          completionDate: msg.data.completionDate,
          rewardAmount: msg.data.rewardAmount,
          proofType: msg.data.proofType,
          hcsTransactionId: msg.data.hcsTransactionId,
          tokenTransactionId: msg.data.tokenTransactionId
        }));

    } catch (error) {
      console.error("❌ Error getting user mission history:", error);
      return [];
    }
  }

  // Get community's mission history
  async getCommunityMissionHistory(communityId: string): Promise<any[]> {
    try {
      const messages = await this.hcsService.queryMessages('mission-creation');
      
      return messages
        .filter(msg => msg.data.communityId === communityId)
        .map(msg => ({
          missionId: msg.data.missionId,
          title: msg.data.title,
          description: msg.data.description,
          rewardAmount: msg.data.rewardAmount,
          deadline: msg.data.deadline,
          creationDate: msg.timestamp
        }));

    } catch (error) {
      console.error("❌ Error getting community mission history:", error);
      return [];
    }
  }

  // Get donation history
  async getDonationHistory(userId?: string, communityId?: string): Promise<any[]> {
    try {
      const messages = await this.hcsService.queryMessages('donation');
      
      let filteredMessages = messages;
      
      if (userId) {
        filteredMessages = filteredMessages.filter(msg => msg.data.userId === userId);
      }
      
      if (communityId) {
        filteredMessages = filteredMessages.filter(msg => msg.data.communityId === communityId);
      }

      return filteredMessages.map(msg => ({
        userId: msg.data.userId,
        communityId: msg.data.communityId,
        amount: msg.data.amount,
        message: msg.data.message,
        timestamp: msg.timestamp
      }));

    } catch (error) {
      console.error("❌ Error getting donation history:", error);
      return [];
    }
  }
}
```

---

## 📊 **Proof Analytics**

### **1. Impact Analytics Service**

Create `src/lib/hedera/impactAnalyticsService.ts`:

```typescript
import { HCSService } from "./hcsService";

export class ImpactAnalyticsService {
  private hcsService: HCSService;

  constructor() {
    this.hcsService = new HCSService();
  }

  // Get total impact metrics
  async getTotalImpact(): Promise<{
    totalMissionsCompleted: number;
    totalDonations: number;
    totalRewardsDistributed: number;
    totalBadgesAwarded: number;
    activeUsers: number;
    activeCommunities: number;
  }> {
    try {
      const completionMessages = await this.hcsService.queryMessages('mission-completion');
      const donationMessages = await this.hcsService.queryMessages('donation');
      const badgeMessages = await this.hcsService.queryMessages('badge-award');

      const uniqueUsers = new Set([
        ...completionMessages.map(msg => msg.data.userId),
        ...donationMessages.map(msg => msg.data.userId)
      ]);

      const uniqueCommunities = new Set([
        ...completionMessages.map(msg => msg.data.communityId),
        ...donationMessages.map(msg => msg.data.communityId)
      ]);

      return {
        totalMissionsCompleted: completionMessages.length,
        totalDonations: donationMessages.length,
        totalRewardsDistributed: completionMessages.reduce((sum, msg) => sum + msg.data.rewardAmount, 0),
        totalBadgesAwarded: badgeMessages.length,
        activeUsers: uniqueUsers.size,
        activeCommunities: uniqueCommunities.size
      };

    } catch (error) {
      console.error("❌ Error getting total impact:", error);
      return {
        totalMissionsCompleted: 0,
        totalDonations: 0,
        totalRewardsDistributed: 0,
        totalBadgesAwarded: 0,
        activeUsers: 0,
        activeCommunities: 0
      };
    }
  }

  // Get user impact score
  async getUserImpactScore(userId: string): Promise<{
    missionsCompleted: number;
    totalRewards: number;
    donationsMade: number;
    badgesEarned: number;
    impactScore: number;
  }> {
    try {
      const completionMessages = await this.hcsService.queryMessages('mission-completion');
      const donationMessages = await this.hcsService.queryMessages('donation');
      const badgeMessages = await this.hcsService.queryMessages('badge-award');

      const userCompletions = completionMessages.filter(msg => msg.data.userId === userId);
      const userDonations = donationMessages.filter(msg => msg.data.userId === userId);
      const userBadges = badgeMessages.filter(msg => msg.data.userId === userId);

      const totalRewards = userCompletions.reduce((sum, msg) => sum + msg.data.rewardAmount, 0);
      const totalDonations = userDonations.reduce((sum, msg) => sum + msg.data.amount, 0);

      // Calculate impact score (missions * 10 + donations * 5 + badges * 20)
      const impactScore = (userCompletions.length * 10) + (userDonations.length * 5) + (userBadges.length * 20);

      return {
        missionsCompleted: userCompletions.length,
        totalRewards,
        donationsMade: userDonations.length,
        badgesEarned: userBadges.length,
        impactScore
      };

    } catch (error) {
      console.error("❌ Error getting user impact score:", error);
      return {
        missionsCompleted: 0,
        totalRewards: 0,
        donationsMade: 0,
        badgesEarned: 0,
        impactScore: 0
      };
    }
  }
}
```

---

## 🔗 **API Integration**

### **1. Mission Completion API**

Update `src/app/api/missions/[id]/complete/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { MissionProofService } from '@/lib/hedera/missionProofService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, proofType, proofData } = body;

    const missionProofService = new MissionProofService();

    const proof: MissionCompletionProof = {
      missionId: params.id,
      userId,
      communityId: body.communityId,
      completionDate: new Date().toISOString(),
      proofType,
      proofData,
      rewardAmount: body.rewardAmount
    };

    const transactionId = await missionProofService.logMissionCompletion(proof);

    return NextResponse.json({
      success: true,
      data: {
        transactionId,
        proof
      }
    });

  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete mission' },
      { status: 500 }
    );
  }
}
```

### **2. Proof Verification API**

Create `src/app/api/proofs/verify/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ProofVerificationService } from '@/lib/hedera/proofVerificationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const missionId = searchParams.get('missionId');
    const userId = searchParams.get('userId');

    if (!missionId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Mission ID and User ID required' },
        { status: 400 }
      );
    }

    const proofVerificationService = new ProofVerificationService();
    const verification = await proofVerificationService.verifyMissionCompletion(missionId, userId);

    return NextResponse.json({
      success: true,
      data: verification
    });

  } catch (error) {
    console.error('Error verifying proof:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify proof' },
      { status: 500 }
    );
  }
}
```

---

## 📋 **Implementation Checklist**

### **✅ HCS Setup**
- [ ] Create HCS topics for all event types
- [ ] Implement message submission service
- [ ] Add message querying functionality
- [ ] Test topic creation and messaging

### **✅ Proof Services**
- [ ] Implement MissionProofService
- [ ] Add all proof logging methods
- [ ] Create proof verification service
- [ ] Build impact analytics service

### **✅ API Integration**
- [ ] Update mission completion API
- [ ] Add proof verification endpoints
- [ ] Integrate with existing services
- [ ] Add error handling and validation

### **✅ Testing**
- [ ] Test proof logging
- [ ] Verify proof retrieval
- [ ] Test analytics calculations
- [ ] Validate API endpoints

---

## 🚀 **Deployment Commands**

```bash
# Create HCS topics
node scripts/create-hcs-topics.js

# Test proof system
node scripts/test-proof-system.js

# Verify proofs
node scripts/verify-proofs.js
```

---

## 📚 **Next Steps**

1. **Create HCS Topics** - Deploy all required topics
2. **Test Proof System** - Verify logging and retrieval
3. **Integrate with Frontend** - Display proof verification
4. **Add Analytics** - Show impact metrics

This proof system ensures complete transparency and verifiability for all SmileUp ImpactChain activities. 