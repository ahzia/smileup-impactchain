import { rewards } from '@/data';
import { Reward, CreateRewardRequest } from '@/lib/types';
import { AuthService } from './authService';
import { CommunityService } from './communityService';

// Mock reward storage
let mockRewards = [...rewards];

export class RewardService {
  // Get rewards with filtering
  static async getRewards(query: {
    category?: string;
    provider?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Reward[]> {
    let filteredRewards = [...mockRewards];

    // Filter by category
    if (query.category && query.category !== 'all') {
      filteredRewards = filteredRewards.filter(reward => reward.type === query.category);
    }

    // Filter by provider
    if (query.provider && query.provider !== 'all') {
      filteredRewards = filteredRewards.filter(reward => reward.provider === query.provider);
    }

    // Sort by cost (lowest first)
    filteredRewards.sort((a, b) => a.cost - b.cost);

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredRewards.slice(startIndex, endIndex);
  }

  // Get reward by ID
  static async getRewardById(rewardId: string): Promise<Reward | null> {
    const reward = mockRewards.find(r => r.id === rewardId);
    return reward || null;
  }

  // Create new reward
  static async createReward(rewardData: CreateRewardRequest, userId: string): Promise<Reward> {
    // Get community info
    const community = await CommunityService.getCommunityById(rewardData.communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    const newReward: Reward = {
      id: `reward_${Date.now()}`,
      type: rewardData.type,
      title: rewardData.title,
      description: rewardData.description,
      validity: rewardData.validity,
      cost: rewardData.cost,
      provider: community.name,
      owned: false,
      emoji: rewardData.emoji,
      imageUrl: rewardData.imageUrl,
      community: {
        id: community.id,
        name: community.name,
        logo: community.logo
      }
    };

    mockRewards.push(newReward);
    return newReward;
  }

  // Redeem reward
  static async redeemReward(rewardId: string, userId: string): Promise<{
    success: boolean;
    newBalance: number;
    reward: Reward;
  }> {
    const reward = mockRewards.find(r => r.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }

    // Check if user has enough Smiles
    const user = await AuthService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.smiles < reward.cost) {
      throw new Error('Insufficient Smiles');
    }

    // Deduct Smiles from user
    const updatedUser = await AuthService.updateUserSmiles(userId, -reward.cost);

    // Mark reward as owned
    reward.owned = true;

    // Add activity to user
    await AuthService.addRecentActivity(userId, `Redeemed reward: "${reward.title}" for ${reward.cost} Smiles`);

    return {
      success: true,
      newBalance: updatedUser.smiles,
      reward
    };
  }

  // Get user's owned rewards
  static async getUserRewards(userId: string): Promise<Reward[]> {
    // In real app, you'd track which rewards each user owns
    // For now, return rewards that are marked as owned
    return mockRewards.filter(reward => reward.owned);
  }

  // Get rewards by community
  static async getRewardsByCommunity(communityId: string): Promise<Reward[]> {
    return mockRewards.filter(reward => reward.community.id === communityId);
  }

  // Get rewards by type
  static async getRewardsByType(type: string): Promise<Reward[]> {
    return mockRewards.filter(reward => reward.type === type);
  }

  // Get rewards by provider
  static async getRewardsByProvider(provider: string): Promise<Reward[]> {
    return mockRewards.filter(reward => reward.provider === provider);
  }

  // Get affordable rewards for user
  static async getAffordableRewards(userId: string): Promise<Reward[]> {
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return [];
    }

    return mockRewards.filter(reward => reward.cost <= user.smiles);
  }

  // Get premium rewards (high cost)
  static async getPremiumRewards(): Promise<Reward[]> {
    return mockRewards.filter(reward => reward.cost >= 500);
  }

  // Get limited time rewards
  static async getLimitedTimeRewards(): Promise<Reward[]> {
    const now = new Date();
    return mockRewards.filter(reward => {
      // Check if reward has expiration date
      if (reward.validity === 'Never Expires') return false;
      
      // Parse validity date (simplified)
      const validityDate = new Date(reward.validity);
      return validityDate > now;
    });
  }

  // Search rewards
  static async searchRewards(query: string): Promise<Reward[]> {
    const searchTerm = query.toLowerCase();
    return mockRewards.filter(reward => 
      reward.title.toLowerCase().includes(searchTerm) ||
      reward.description.toLowerCase().includes(searchTerm) ||
      reward.provider.toLowerCase().includes(searchTerm)
    );
  }

  // Get reward categories
  static async getRewardCategories(): Promise<string[]> {
    const categories = new Set(mockRewards.map(reward => reward.type));
    return Array.from(categories);
  }

  // Get reward providers
  static async getRewardProviders(): Promise<string[]> {
    const providers = new Set(mockRewards.map(reward => reward.provider));
    return Array.from(providers);
  }

  // Update reward
  static async updateReward(rewardId: string, updates: Partial<Reward>, userId: string): Promise<Reward> {
    const rewardIndex = mockRewards.findIndex(r => r.id === rewardId);
    if (rewardIndex === -1) {
      throw new Error('Reward not found');
    }

    mockRewards[rewardIndex] = {
      ...mockRewards[rewardIndex],
      ...updates
    };

    return mockRewards[rewardIndex];
  }

  // Delete reward
  static async deleteReward(rewardId: string, userId: string): Promise<void> {
    const rewardIndex = mockRewards.findIndex(r => r.id === rewardId);
    if (rewardIndex === -1) {
      throw new Error('Reward not found');
    }

    mockRewards.splice(rewardIndex, 1);
  }

  // Get trending rewards
  static async getTrendingRewards(): Promise<Reward[]> {
    // Sort by cost (higher cost = more trending)
    const sortedRewards = [...mockRewards].sort((a, b) => b.cost - a.cost);
    return sortedRewards.slice(0, 10);
  }

  // Get new rewards
  static async getNewRewards(): Promise<Reward[]> {
    // Return rewards created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return mockRewards.filter(reward => {
      // For mock data, assume newer rewards have higher IDs
      const rewardId = parseInt(reward.id.split('_')[1]);
      return rewardId > Date.now() - (30 * 24 * 60 * 60 * 1000);
    });
  }

  // Get rewards by price range
  static async getRewardsByPriceRange(minPrice: number, maxPrice: number): Promise<Reward[]> {
    return mockRewards.filter(reward => 
      reward.cost >= minPrice && reward.cost <= maxPrice
    );
  }

  // Get free rewards
  static async getFreeRewards(): Promise<Reward[]> {
    return mockRewards.filter(reward => reward.cost === 0);
  }

  // Get digital rewards
  static async getDigitalRewards(): Promise<Reward[]> {
    return mockRewards.filter(reward => 
      reward.type === 'digital' || 
      reward.type === 'certificate' || 
      reward.type === 'award'
    );
  }

  // Get experience rewards
  static async getExperienceRewards(): Promise<Reward[]> {
    return mockRewards.filter(reward => 
      reward.type === 'experience' || 
      reward.type === 'event' || 
      reward.type === 'service'
    );
  }

  // Get merchandise rewards
  static async getMerchandiseRewards(): Promise<Reward[]> {
    return mockRewards.filter(reward => 
      reward.type === 'merchandise' || 
      reward.type === 'voucher' || 
      reward.type === 'discount'
    );
  }
} 