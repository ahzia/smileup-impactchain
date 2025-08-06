import { prisma } from '../database/client';
import { Community, CommunityMember, FeedPost } from '../../generated/prisma';
import { CommunityWalletService } from '../wallet/communityWalletService';

export interface CreateCommunityData {
  name: string;
  description?: string;
  category: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  website?: string;
  createdBy?: string;
}

export interface UpdateCommunityData {
  name?: string;
  description?: string;
  category?: string;
  logoUrl?: string;
  bannerUrl?: string;
  location?: string;
  website?: string;
  status?: string;
}

export class CommunityService {
  // ========================================
  // COMMUNITY CREATION & MANAGEMENT
  // ========================================

  static async createCommunity(data: CreateCommunityData): Promise<Community> {
    return await prisma.community.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        location: data.location,
        website: data.website,
        createdBy: data.createdBy,
      },
    });
  }

  static async findCommunityById(id: string): Promise<Community | null> {
    return await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                level: true,
                score: true,
              },
            },
          },
        },
        feedPosts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            likes: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async updateCommunity(id: string, data: UpdateCommunityData): Promise<Community> {
    return await prisma.community.update({
      where: { id },
      data,
    });
  }

  static async deleteCommunity(id: string): Promise<void> {
    await prisma.community.delete({
      where: { id },
    });
  }

  // ========================================
  // COMMUNITY SEARCH & FILTERING
  // ========================================

  static async searchCommunities(query: string, limit: number = 10): Promise<Community[]> {
    return await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        status: 'active',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCommunitiesByCategory(category: string, limit: number = 10): Promise<Community[]> {
    return await prisma.community.findMany({
      where: {
        category,
        status: 'active',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPopularCommunities(limit: number = 10): Promise<Community[]> {
    return await prisma.community.findMany({
      where: { status: 'active' },
      take: limit,
      orderBy: [
        { members: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
    });
  }

  static async getAllCommunities(limit: number = 50): Promise<Community[]> {
    return await prisma.community.findMany({
      where: { status: 'active' },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========================================
  // MEMBERSHIP MANAGEMENT
  // ========================================

  static async joinCommunity(userId: string, communityId: string): Promise<CommunityMember> {
    return await prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        community: true,
      },
    });
  }

  static async leaveCommunity(userId: string, communityId: string): Promise<void> {
    await prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });
  }

  static async updateMemberRole(userId: string, communityId: string, role: string): Promise<CommunityMember> {
    return await prisma.communityMember.update({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
      data: { role },
    });
  }

  static async isMember(userId: string, communityId: string): Promise<boolean> {
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });
    return !!membership;
  }

  static async getMemberRole(userId: string, communityId: string): Promise<string | null> {
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });
    return membership?.role || null;
  }

  static async getCommunityMembers(communityId: string, limit: number = 50): Promise<CommunityMember[]> {
    return await prisma.communityMember.findMany({
      where: { communityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            level: true,
            score: true,
          },
        },
      },
      take: limit,
      orderBy: { joinedAt: 'desc' },
    });
  }

  static async getUserCommunities(userId: string): Promise<Community[]> {
    const memberships = await prisma.communityMember.findMany({
      where: { userId },
      include: { community: true },
    });
    return memberships.map(membership => membership.community);
  }

  // ========================================
  // FEED POSTS
  // ========================================

  static async createFeedPost(data: {
    title?: string;
    description?: string;
    mediaType?: string;
    mediaUrl?: string;
    challenge?: string;
    callToAction?: string[];
    links?: string[];
    userId?: string;
    communityId?: string;
  }): Promise<FeedPost> {
    return await prisma.feedPost.create({
      data: {
        title: data.title,
        description: data.description,
        mediaType: data.mediaType || 'text',
        mediaUrl: data.mediaUrl,
        challenge: data.challenge,
        callToAction: data.callToAction || [],
        links: data.links || [],
        userId: data.userId,
        communityId: data.communityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });
  }

  static async getCommunityFeed(communityId: string, limit: number = 20): Promise<FeedPost[]> {
    return await prisma.feedPost.findMany({
      where: { communityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        likes: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========================================
  // ANALYTICS
  // ========================================

  static async getCommunityStats(communityId: string): Promise<{
    memberCount: number;
    postCount: number;
    totalSmiles: number;
  }> {
    const [memberCount, postCount, totalSmiles] = await Promise.all([
      prisma.communityMember.count({ where: { communityId } }),
      prisma.feedPost.count({ where: { communityId } }),
      prisma.feedPost.aggregate({
        where: { communityId },
        _sum: { smiles: true },
      }),
    ]);

    return {
      memberCount,
      postCount,
      totalSmiles: totalSmiles._sum.smiles || 0,
    };
  }

  // ========================================
  // VERIFICATION & MODERATION
  // ========================================

  static async verifyCommunity(id: string): Promise<Community> {
    return await prisma.community.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  static async deactivateCommunity(id: string): Promise<Community> {
    return await prisma.community.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  // ========================================
  // API COMPATIBILITY METHODS
  // ========================================

  static async getCommunities(query: {
    category?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<any[]> {
    let communities = await this.getAllCommunities(100);

    // Filter by category
    if (query.category && query.category !== 'all') {
      communities = communities.filter(community => community.category === query.category);
    }

    // Filter by status
    if (query.status && query.status !== 'all') {
      communities = communities.filter(community => community.status === query.status);
    }

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return communities.slice(startIndex, endIndex);
  }

  static async createCommunityWithUser(data: any, userId: string): Promise<any> {
    const community = await this.createCommunity({
      name: data.name,
      description: data.description,
      category: data.category,
      logoUrl: data.logo,
      bannerUrl: data.banner,
      location: data.location,
      website: data.website,
      createdBy: userId,
    });

    // Automatically create community wallet
    try {
      console.log('🔐 Starting automatic wallet creation for community:', community.id);
      const communityWalletService = new CommunityWalletService();
      const wallet = await communityWalletService.createWalletForCommunity(community.id);
      console.log('✅ Successfully created community wallet for community:', community.id, 'Account ID:', wallet.accountId);
    } catch (walletError) {
      console.error('❌ Failed to create community wallet for community:', community.id, 'Error:', walletError);
      console.error('❌ Community wallet creation error details:', {
        message: walletError instanceof Error ? walletError.message : 'Unknown error',
        stack: walletError instanceof Error ? walletError.stack : undefined
      });
      // Continue with community creation even if wallet creation fails
      // The community can create the wallet later if needed
    }

    // Add creator as admin
    await this.joinCommunity(userId, community.id);
    await this.updateMemberRole(userId, community.id, 'admin');

    return {
      id: community.id,
      name: community.name,
      status: community.status,
    };
  }
} 