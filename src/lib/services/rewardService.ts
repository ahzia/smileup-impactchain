import { prisma } from '../database/client';
import { Reward, UserReward } from '../../generated/prisma';

export interface CreateRewardData {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  stock?: number;
}

export interface UpdateRewardData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  stock?: number;
}

export class RewardService {
  // ========================================
  // REWARD CREATION & MANAGEMENT
  // ========================================

  static async createReward(data: CreateRewardData): Promise<Reward> {
    return await prisma.reward.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable ?? true,
        stock: data.stock,
      },
    });
  }

  static async findRewardById(id: string): Promise<Reward | null> {
    return await prisma.reward.findUnique({
      where: { id },
    });
  }

  static async updateReward(id: string, data: UpdateRewardData): Promise<Reward> {
    return await prisma.reward.update({
      where: { id },
      data,
    });
  }

  static async deleteReward(id: string): Promise<void> {
    await prisma.reward.delete({
      where: { id },
    });
  }

  // ========================================
  // REWARD SEARCH & FILTERING
  // ========================================

  static async searchRewards(query: string, limit: number = 10): Promise<Reward[]> {
    return await prisma.reward.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        isAvailable: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getRewardsByCategory(category: string, limit: number = 10): Promise<Reward[]> {
    return await prisma.reward.findMany({
      where: {
        category,
        isAvailable: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAvailableRewards(limit: number = 20): Promise<Reward[]> {
    return await prisma.reward.findMany({
      where: { isAvailable: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPopularRewards(limit: number = 10): Promise<Reward[]> {
    return await prisma.reward.findMany({
      where: { isAvailable: true },
      take: limit,
      orderBy: { soldCount: 'desc' },
    });
  }

  // ========================================
  // REWARD PURCHASES
  // ========================================

  static async purchaseReward(userId: string, rewardId: string): Promise<UserReward> {
    // Check if user has enough smiles
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!user || !reward) {
      throw new Error('User or reward not found');
    }

    if (user.smiles < reward.price) {
      throw new Error('Insufficient smiles');
    }

    if (!reward.isAvailable) {
      throw new Error('Reward is not available');
    }

    if (reward.stock !== null && reward.stock <= 0) {
      throw new Error('Reward is out of stock');
    }

    // Create purchase and update user smiles and reward stock
    const [userReward] = await prisma.$transaction([
      prisma.userReward.create({
        data: {
          userId,
          rewardId,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { smiles: { decrement: reward.price } },
      }),
      prisma.reward.update({
        where: { id: rewardId },
        data: {
          soldCount: { increment: 1 },
          stock: reward.stock !== null ? { decrement: 1 } : undefined,
        },
      }),
    ]);

    return userReward;
  }

  static async getUserRewards(userId: string): Promise<UserReward[]> {
    return await prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  // ========================================
  // ANALYTICS
  // ========================================

  static async getRewardStats(rewardId: string): Promise<{
    purchaseCount: number;
    totalRevenue: number;
  }> {
    const purchaseCount = await prisma.userReward.count({ where: { rewardId } });
    
    // Get total revenue by summing up reward prices for all purchases
    const purchases = await prisma.userReward.findMany({
      where: { rewardId },
      include: { reward: true },
    });
    
    const totalRevenue = purchases.reduce((sum, purchase) => {
      return sum + (purchase.reward?.price || 0);
    }, 0);

    return {
      purchaseCount,
      totalRevenue,
    };
  }

  static async getCategoryStats(): Promise<{
    category: string;
    count: number;
    totalRevenue: number;
  }[]> {
    const stats = await prisma.reward.groupBy({
      by: ['category'],
      where: { isAvailable: true },
      _count: { id: true },
      _sum: { soldCount: true },
    });

    return stats.map(stat => ({
      category: stat.category || 'Uncategorized',
      count: stat._count.id,
      totalRevenue: stat._sum.soldCount || 0,
    }));
  }

  // ========================================
  // API COMPATIBILITY METHODS
  // ========================================

  static async getRewards(query: {
    category?: string;
    provider?: string;
    page?: number;
    pageSize?: number;
  }): Promise<any[]> {
    let rewards = await this.getAvailableRewards(100);

    // Filter by category
    if (query.category && query.category !== 'all') {
      rewards = rewards.filter(reward => reward.category === query.category);
    }

    // Filter by provider (community)
    if (query.provider && query.provider !== 'all') {
      // This would need to be implemented based on your data structure
      // For now, we'll skip this filter
    }

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Transform the data to match frontend expectations
    return rewards.slice(startIndex, endIndex).map(reward => ({
      id: reward.id,
      type: reward.category as any,
      title: reward.name,
      description: reward.description || '',
      validity: '30 days',
      cost: reward.price,
      provider: 'SmileUp',
      owned: false,
      emoji: '🎁',
      imageUrl: reward.imageUrl || '',
      community: {
        id: 'smileup',
        name: 'SmileUp',
        logo: ''
      }
    }));
  }

  static async createRewardWithUser(data: any, userId: string): Promise<any> {
    const reward = await this.createReward({
      name: data.title,
      description: data.description,
      price: data.cost,
      category: data.type,
      imageUrl: data.imageUrl,
      isAvailable: true,
      stock: data.type === 'digital' || data.type === 'certificate' ? undefined : 100,
    });

    return {
      id: reward.id,
      title: reward.name,
    };
  }
} 