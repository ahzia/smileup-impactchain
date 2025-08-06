import { prisma } from '../database/client';
import { FeedPost, Comment, Like } from '../../generated/prisma';

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
}

export class FeedService {
  // ========================================
  // FEED POST CREATION & MANAGEMENT
  // ========================================

  static async createFeedPost(data: CreateFeedPostData): Promise<FeedPost> {
    return await prisma.feedPost.create({
      data: {
        title: data.title,
        description: data.description,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        challenge: data.challenge,
        callToAction: data.callToAction,
        links: data.links,
        smiles: 0,
        commentsCount: 0,
        likesCount: 0,
        userId: data.userId,
        communityId: data.communityId,
      },
    });
  }

  static async findFeedPostById(id: string): Promise<FeedPost | null> {
    return await prisma.feedPost.findUnique({
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

    return await prisma.feedPost.findMany({
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
  }

  static async getUserFeedPosts(userId: string, limit: number = 20): Promise<FeedPost[]> {
    return await prisma.feedPost.findMany({
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
  }

  static async getCommunityFeedPosts(communityId: string, limit: number = 20): Promise<FeedPost[]> {
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

  static async createFeedPostWithUser(data: any, userId: string): Promise<any> {
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