import { communities } from '@/data';
import { Community, CreateCommunityRequest } from '@/lib/types';

// Mock community storage
let mockCommunities = [...communities];

export class CommunityService {
  // Get all communities with filtering
  static async getCommunities(query: {
    category?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Community[]> {
    let filteredCommunities = [...mockCommunities];

    // Filter by category
    if (query.category && query.category !== 'all') {
      filteredCommunities = filteredCommunities.filter(
        community => community.category === query.category
      );
    }

    // Filter by status
    if (query.status && query.status !== 'all') {
      filteredCommunities = filteredCommunities.filter(
        community => community.status === query.status
      );
    }

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredCommunities.slice(startIndex, endIndex);
  }

  // Get community by ID
  static async getCommunityById(communityId: string): Promise<Community | null> {
    const community = mockCommunities.find(c => c.id === communityId);
    return community || null;
  }

  // Create new community
  static async createCommunity(communityData: CreateCommunityRequest, createdBy: string): Promise<Community> {
    const newCommunity: Community = {
      id: `comm_${Date.now()}`,
      name: communityData.name,
      description: communityData.description,
      category: communityData.category,
      logo: communityData.logo || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      banner: communityData.banner || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
      members: 1, // Creator is first member
      missions: 0,
      totalSmiles: 0,
      status: 'active',
      createdBy,
      createdAt: new Date().toISOString(),
      location: communityData.location || '',
      website: communityData.website || '',
      recentPosts: [],
      recentMissions: []
    };

    mockCommunities.push(newCommunity);
    return newCommunity;
  }

  // Update community
  static async updateCommunity(communityId: string, updates: Partial<Community>): Promise<Community> {
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }

    mockCommunities[communityIndex] = {
      ...mockCommunities[communityIndex],
      ...updates
    };

    return mockCommunities[communityIndex];
  }

  // Delete community
  static async deleteCommunity(communityId: string): Promise<void> {
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }

    mockCommunities.splice(communityIndex, 1);
  }

  // Join community
  static async joinCommunity(communityId: string, userId: string): Promise<Community> {
    const community = mockCommunities.find(c => c.id === communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    // In real app, you'd add user to community members list
    // For now, we'll just increment the member count
    community.members += 1;

    return community;
  }

  // Leave community
  static async leaveCommunity(communityId: string, userId: string): Promise<Community> {
    const community = mockCommunities.find(c => c.id === communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    // In real app, you'd remove user from community members list
    // For now, we'll just decrement the member count
    community.members = Math.max(0, community.members - 1);

    return community;
  }

  // Get communities by user
  static async getCommunitiesByUser(userId: string): Promise<Community[]> {
    // In real app, you'd query communities where user is a member
    // For now, return featured communities
    return mockCommunities.filter(c => c.status === 'featured');
  }

  // Get communities created by user
  static async getCommunitiesCreatedByUser(userId: string): Promise<Community[]> {
    return mockCommunities.filter(c => c.createdBy === userId);
  }

  // Update community stats
  static async updateCommunityStats(communityId: string, updates: {
    missions?: number;
    totalSmiles?: number;
  }): Promise<Community> {
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }

    mockCommunities[communityIndex] = {
      ...mockCommunities[communityIndex],
      ...updates
    };

    return mockCommunities[communityIndex];
  }

  // Add recent post to community
  static async addRecentPost(communityId: string, post: {
    id: string;
    title: string;
    mediaUrl: string;
    createdAt: string;
  }): Promise<Community> {
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }

    mockCommunities[communityIndex].recentPosts.unshift(post);
    
    // Keep only last 5 posts
    mockCommunities[communityIndex].recentPosts = mockCommunities[communityIndex].recentPosts.slice(0, 5);

    return mockCommunities[communityIndex];
  }

  // Add recent mission to community
  static async addRecentMission(communityId: string, mission: {
    id: string;
    title: string;
    reward: number;
    status: string;
  }): Promise<Community> {
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) {
      throw new Error('Community not found');
    }

    mockCommunities[communityIndex].recentMissions.unshift(mission);
    
    // Keep only last 5 missions
    mockCommunities[communityIndex].recentMissions = mockCommunities[communityIndex].recentMissions.slice(0, 5);

    return mockCommunities[communityIndex];
  }

  // Search communities
  static async searchCommunities(query: string): Promise<Community[]> {
    const searchTerm = query.toLowerCase();
    return mockCommunities.filter(community => 
      community.name.toLowerCase().includes(searchTerm) ||
      community.description.toLowerCase().includes(searchTerm) ||
      community.category.toLowerCase().includes(searchTerm)
    );
  }

  // Get featured communities
  static async getFeaturedCommunities(): Promise<Community[]> {
    return mockCommunities.filter(c => c.status === 'featured');
  }

  // Get communities by category
  static async getCommunitiesByCategory(category: string): Promise<Community[]> {
    return mockCommunities.filter(c => c.category === category);
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    const categories = new Set(mockCommunities.map(c => c.category));
    return Array.from(categories);
  }
} 