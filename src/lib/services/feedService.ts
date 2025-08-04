import { feedPosts } from '@/data';
import { FeedPost, CreateFeedPostRequest, DonateRequest, DonateResponse, CommentRequest, Comment } from '@/lib/types';
import { AuthService } from './authService';
import { CommunityService } from './communityService';

// Mock feed storage
let mockFeedPosts = [...feedPosts];

export class FeedService {
  // Get feed posts with filtering and pagination
  static async getFeedPosts(query: {
    page?: number;
    pageSize?: number;
    category?: string;
    communityId?: string;
  }): Promise<FeedPost[]> {
    let filteredPosts = [...mockFeedPosts];

    // Filter by category
    if (query.category && query.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => {
        // Map category to community category
        const community = mockFeedPosts.find(p => p.id === post.id)?.community;
        return community && community.id && this.getCommunityCategory(community.id) === query.category;
      });
    }

    // Filter by community
    if (query.communityId) {
      filteredPosts = filteredPosts.filter(post => post.community.id === query.communityId);
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredPosts.slice(startIndex, endIndex);
  }

  // Get feed post by ID
  static async getFeedPostById(postId: string): Promise<FeedPost | null> {
    const post = mockFeedPosts.find(p => p.id === postId);
    return post || null;
  }

  // Create new feed post
  static async createFeedPost(postData: CreateFeedPostRequest, userId: string): Promise<FeedPost> {
    // Get community info
    const community = await CommunityService.getCommunityById(postData.communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      mediaType: postData.mediaType,
      mediaUrl: postData.mediaUrl,
      title: postData.title,
      description: postData.description,
      community: {
        id: community.id,
        name: community.name,
        logo: community.logo
      },
      challenge: postData.challenge || '',
      callToAction: postData.callToAction || [],
      links: postData.links || [],
      smiles: 0,
      commentsCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    mockFeedPosts.unshift(newPost);

    // Add to community's recent posts
    await CommunityService.addRecentPost(community.id, {
      id: newPost.id,
      title: newPost.title,
      mediaUrl: newPost.mediaUrl,
      createdAt: newPost.createdAt
    });

    return newPost;
  }

  // Donate Smiles to a feed post
  static async donateToPost(postId: string, donation: DonateRequest, userId: string): Promise<DonateResponse> {
    const post = mockFeedPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Update user's Smiles
    const user = await AuthService.updateUserSmiles(userId, -donation.amount);
    
    // Update post Smiles
    post.smiles += donation.amount;

    // Update community total Smiles
    await CommunityService.updateCommunityStats(post.community.id, {
      totalSmiles: post.smiles
    });

    // Add activity to user
    await AuthService.addRecentActivity(userId, `Donated ${donation.amount} Smiles to "${post.title}"`);

    return {
      success: true,
      newBalance: user.smiles,
      newCommunitySmiles: post.smiles
    };
  }

  // Like/unlike a feed post
  static async toggleLike(postId: string, userId: string): Promise<{ success: boolean; liked: boolean; likesCount: number }> {
    const post = mockFeedPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // In real app, you'd track who liked what
    // For now, we'll just toggle the like count
    const isLiked = Math.random() > 0.5; // Mock logic
    post.likesCount += isLiked ? 1 : -1;
    post.likesCount = Math.max(0, post.likesCount);

    return {
      success: true,
      liked: isLiked,
      likesCount: post.likesCount
    };
  }

  // Add comment to feed post
  static async addComment(postId: string, commentData: CommentRequest, userId: string): Promise<Comment> {
    const post = mockFeedPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      message: commentData.message,
      userId,
      timestamp: new Date().toISOString()
    };

    post.commentsCount += 1;

    return newComment;
  }

  // Get comments for a feed post
  static async getComments(postId: string): Promise<Comment[]> {
    const post = mockFeedPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Mock comments
    return [
      {
        id: 'comment_1',
        message: 'Great initiative! Keep up the good work.',
        userId: 'user_001',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'comment_2',
        message: 'I love seeing communities come together like this.',
        userId: 'user_002',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  // Delete feed post
  static async deleteFeedPost(postId: string, userId: string): Promise<void> {
    const postIndex = mockFeedPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    const post = mockFeedPosts[postIndex];
    
    // Check if user is the creator or community admin
    // For now, allow deletion
    mockFeedPosts.splice(postIndex, 1);
  }

  // Update feed post
  static async updateFeedPost(postId: string, updates: Partial<FeedPost>, userId: string): Promise<FeedPost> {
    const postIndex = mockFeedPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    mockFeedPosts[postIndex] = {
      ...mockFeedPosts[postIndex],
      ...updates
    };

    return mockFeedPosts[postIndex];
  }

  // Get trending posts
  static async getTrendingPosts(): Promise<FeedPost[]> {
    // Sort by engagement (likes + comments + smiles)
    const sortedPosts = [...mockFeedPosts].sort((a, b) => {
      const engagementA = a.likesCount + a.commentsCount + a.smiles;
      const engagementB = b.likesCount + b.commentsCount + b.smiles;
      return engagementB - engagementA;
    });

    return sortedPosts.slice(0, 10);
  }

  // Get posts by community
  static async getPostsByCommunity(communityId: string): Promise<FeedPost[]> {
    return mockFeedPosts.filter(post => post.community.id === communityId);
  }

  // Search feed posts
  static async searchFeedPosts(query: string): Promise<FeedPost[]> {
    const searchTerm = query.toLowerCase();
    return mockFeedPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.community.name.toLowerCase().includes(searchTerm)
    );
  }

  // Get posts by category
  static async getPostsByCategory(category: string): Promise<FeedPost[]> {
    return mockFeedPosts.filter(post => {
      const community = post.community;
      return this.getCommunityCategory(community.id) === category;
    });
  }

  // Helper method to get community category
  private static getCommunityCategory(communityId: string): string {
    const community = mockFeedPosts.find(p => p.community.id === communityId)?.community;
    if (!community) return 'all';
    
    // Map community ID to category
    const categoryMap: { [key: string]: string } = {
      'comm_001': 'sustainability',
      'comm_002': 'technology',
      'comm_003': 'education',
      'comm_004': 'culture',
      'comm_005': 'health',
      'comm_006': 'sustainability',
      'comm_007': 'technology',
      'comm_008': 'health',
      'comm_009': 'culture',
      'comm_010': 'education'
    };

    return categoryMap[communityId] || 'all';
  }
} 