import { FeedPost, Comment, Like } from '@prisma/client';
import { prisma } from '../database/client';

export interface CreateFeedPostData {
  title?: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  challenge?: string;
  callToAction?: string[];
  links?: string[];
  userId?: string;
  communityId?: string;
}

export interface UpdateFeedPostData {
  title?: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  challenge?: string;
  callToAction?: string[];
  links?: string[];
  smiles?: number | { increment: number };
}

export class FeedService {
  // ========================================
  // FEED POST CREATION & MANAGEMENT
  // ========================================

  static async createFeedPost(data: CreateFeedPostData): Promise<FeedPost> {
    console.log('📝 FeedService.createFeedPost called with data:', JSON.stringify(data, null, 2));
    console.log('🔗 Prisma client status:', !!prisma);
    
    try {
      const post = await prisma.feedPost.create({
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
      });
      console.log('✅ Feed post created successfully:', post.id);
      return post;
    } catch (error) {
      console.error('❌ Error creating feed post:', error);
      throw error;
    }
  }

  static async findFeedPostById(id: string): Promise<FeedPost | null> {
    const feedPost = await prisma.feedPost.findUnique({
      where: { id },
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
          orderBy: { createdAt: 'desc' },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!feedPost) return null;

    // Transform the data to match frontend expectations
    return {
      ...feedPost,
      community: feedPost.community ? {
        id: feedPost.community.id,
        name: feedPost.community.name,
        logo: feedPost.community.logoUrl, // Map logoUrl to logo
      } : null,
    } as FeedPost;
  }

  static async updateFeedPost(id: string, data: UpdateFeedPostData): Promise<FeedPost> {
    return await prisma.feedPost.update({
      where: { id },
      data,
    });
  }

  static async deleteFeedPost(id: string): Promise<void> {
    await prisma.feedPost.delete({
      where: { id },
    });
  }

  // ========================================
  // FEED POST RETRIEVAL
  // ========================================

  static async getFeedPosts(query: {
    page?: number;
    pageSize?: number;
    category?: string;
    communityId?: string;
  }): Promise<FeedPost[]> {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Filter by community if specified
    if (query.communityId) {
      where.communityId = query.communityId;
    }

    const feedPosts = await prisma.feedPost.findMany({
      where,
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
          orderBy: { createdAt: 'desc' },
          take: 5, // Limit comments for performance
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    // Transform the data to match frontend expectations
    return feedPosts.map(post => ({
      ...post,
      community: post.community ? {
        id: post.community.id,
        name: post.community.name,
        logo: post.community.logoUrl, // Map logoUrl to logo
      } : null,
    }));
  }

  static async getUserFeedPosts(userId: string, limit: number = 20): Promise<FeedPost[]> {
    const feedPosts = await prisma.feedPost.findMany({
      where: { userId },
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Transform the data to match frontend expectations
    return feedPosts.map(post => ({
      ...post,
      community: post.community ? {
        id: post.community.id,
        name: post.community.name,
        logo: post.community.logoUrl, // Map logoUrl to logo
      } : null,
    }));
  }

  static async getCommunityFeedPosts(communityId: string, limit: number = 20): Promise<FeedPost[]> {
    const feedPosts = await prisma.feedPost.findMany({
      where: { communityId },
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Transform the data to match frontend expectations
    return feedPosts.map(post => ({
      ...post,
      community: post.community ? {
        id: post.community.id,
        name: post.community.name,
        logo: post.community.logoUrl, // Map logoUrl to logo
      } : null,
    }));
  }

  // ========================================
  // COMMENTS
  // ========================================

  static async addComment(data: {
    postId: string;
    userId: string;
    content: string;
  }): Promise<Comment> {
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content: data.content,
          userId: data.userId,
          postId: data.postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.feedPost.update({
        where: { id: data.postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return comment;
  }

  static async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      throw new Error('Comment not found or unauthorized');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // ========================================
  // LIKES
  // ========================================

  static async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.feedPost.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.feedPost.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
      return { liked: true };
    }
  }

  static async isLikedByUser(postId: string, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return !!like;
  }

  // ========================================
  // DONATIONS
  // ========================================

  static async donateToPost(postId: string, userId: string, amount: number, message?: string): Promise<{
    success: boolean;
    newBalance: number;
    newCommunitySmiles?: number;
    donationId?: string;
    error?: string;
  }> {
    try {
      console.log('🎯 FeedService.donateToPost called');
      console.log('- Post ID:', postId);
      console.log('- User ID:', userId);
      console.log('- Amount:', amount);

      // Get the feed post
      const post = await this.findFeedPostById(postId);
      if (!post) {
        console.log('❌ Feed post not found');
        throw new Error('Feed post not found');
      }

      console.log('📋 Feed post found:', {
        id: post.id,
        title: post.title,
        communityId: post.communityId,
        currentSmiles: post.smiles
      });

      // Import blockchain service for donation
      const { BlockchainService } = await import('./blockchainService');

      // Check if user has enough smiles (real-time balance)
      console.log('🔍 Checking user balance...');
      const userBalance = await BlockchainService.getUserBalance(userId);
      console.log('💰 User balance:', userBalance);

      if (userBalance < amount) {
        console.log('❌ Insufficient balance');
        throw new Error('Insufficient smiles balance');
      }

      let newCommunitySmiles: number | undefined;

      // Transfer tokens using the new donation transfer method
      console.log('🔄 Starting blockchain transfer...');
      const transferResult = await BlockchainService.transferDonation({
        userId,
        communityId: post.communityId || undefined,
        amount,
        postId
      });

      console.log('📊 Transfer result:', transferResult);

      if (!transferResult.success) {
        console.log('❌ Transfer failed');
        throw new Error('Failed to transfer tokens');
      }

      const blockchainTransactionId: string | undefined = transferResult.blockchainTransactionId;
      console.log('🔗 Blockchain transaction ID:', blockchainTransactionId);

      // If post has a community, get community balance
      if (post.communityId) {
        console.log('🏢 Getting community balance...');
        newCommunitySmiles = await BlockchainService.getCommunityBalance(post.communityId);
        console.log('🏢 Community balance:', newCommunitySmiles);
      }

      // Create donation record in database
      console.log('💾 Creating donation record...');
      const donation = await prisma.donation.create({
        data: {
          userId,
          postId,
          amount,
          message,
          blockchainTransactionId
        }
      });
      console.log('✅ Donation record created:', donation.id);

      // Update post smiles count
      console.log('📝 Updating post smiles count...');
      await this.updateFeedPost(postId, {
        smiles: { increment: amount }
      });
      console.log('✅ Post smiles updated');

      // Get updated user balance
      console.log('💰 Getting updated user balance...');
      const newBalance = await BlockchainService.getUserBalance(userId);
      console.log('💰 New user balance:', newBalance);

      console.log('🎉 Donation completed successfully!');
      return {
        success: true,
        newBalance,
        newCommunitySmiles,
        donationId: donation.id
      };

    } catch (error) {
      console.error('❌ Donation failed:', error);
      return {
        success: false,
        newBalance: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get donations for a specific post
  static async getPostDonations(postId: string): Promise<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    amount: number;
    message?: string;
    createdAt: string;
  }[]> {
    const donations = await prisma.donation.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return donations.map(donation => ({
      id: donation.id,
      userId: donation.userId,
      userName: donation.user.name,
      userAvatar: donation.user.avatarUrl || '',
      amount: donation.amount,
      message: donation.message || undefined,
      createdAt: donation.createdAt.toISOString()
    }));
  }

  // Get total donations for a post
  static async getPostTotalDonations(postId: string): Promise<number> {
    const result = await prisma.donation.aggregate({
      where: { postId },
      _sum: { amount: true }
    });

    return result._sum.amount || 0;
  }

  // ========================================
  // ANALYTICS
  // ========================================

  static async getFeedStats(): Promise<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    totalSmiles: number;
  }> {
    const [totalPosts, totalComments, totalLikes, totalSmiles] = await Promise.all([
      prisma.feedPost.count(),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.feedPost.aggregate({
        _sum: { smiles: true },
      }),
    ]);

    return {
      totalPosts,
      totalComments,
      totalLikes,
      totalSmiles: totalSmiles._sum.smiles || 0,
    };
  }

  // ========================================
  // API COMPATIBILITY METHODS
  // ========================================

  static async createFeedPostWithUser(data: CreateFeedPostData, userId: string): Promise<{ id: string; title: string | null }> {
    const post = await this.createFeedPost({
      title: data.title,
      description: data.description,
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      challenge: data.challenge,
      callToAction: data.callToAction,
      links: data.links,
      userId: userId,
      communityId: data.communityId,
    });

    return {
      id: post.id,
      title: post.title,
    };
  }
} 