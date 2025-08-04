import { challenges } from '@/data';
import { Challenge } from '@/lib/types';
import { AuthService } from './authService';

// Mock challenge storage
let mockChallenges = [...challenges];

export class ChallengeService {
  // Get challenges with filtering
  static async getChallenges(query: {
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Challenge[]> {
    let filteredChallenges = [...mockChallenges];

    // Filter by type
    if (query.type && query.type !== 'all') {
      filteredChallenges = filteredChallenges.filter(challenge => challenge.type === query.type);
    }

    // Sort by deadline (closest first)
    filteredChallenges.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredChallenges.slice(startIndex, endIndex);
  }

  // Get challenge by ID
  static async getChallengeById(challengeId: string): Promise<Challenge | null> {
    const challenge = mockChallenges.find(c => c.id === challengeId);
    return challenge || null;
  }

  // Claim challenge reward
  static async claimChallengeReward(challengeId: string, userId: string): Promise<{
    success: boolean;
    reward: number;
    newBalance: number;
  }> {
    const challenge = mockChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.progress !== 'Completed') {
      throw new Error('Challenge must be completed before claiming reward');
    }

    // Award Smiles to user
    const user = await AuthService.updateUserSmiles(userId, challenge.reward);

    // Add activity to user
    await AuthService.addRecentActivity(userId, `Claimed challenge reward: "${challenge.title}" for ${challenge.reward} Smiles`);

    return {
      success: true,
      reward: challenge.reward,
      newBalance: user.smiles
    };
  }

  // Update challenge progress
  static async updateChallengeProgress(challengeId: string, progress: string, userId: string): Promise<Challenge> {
    const challengeIndex = mockChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) {
      throw new Error('Challenge not found');
    }

    const challenge = mockChallenges[challengeIndex];
    challenge.progress = progress as "Not Started" | "In Progress" | "Completed";

    // Update current step if it's a multi-step challenge
    if (challenge.steps && challenge.progress === 'In Progress') {
      challenge.currentStep = (challenge.currentStep || 0) + 1;
    }

    return challenge;
  }

  // Get challenges by type
  static async getChallengesByType(type: string): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.type === type);
  }

  // Get streak challenges
  static async getStreakChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.type === 'streak');
  }

  // Get referral challenges
  static async getReferralChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.type === 'referral');
  }

  // Get special challenges
  static async getSpecialChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.type === 'special');
  }

  // Get community challenges
  static async getCommunityChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.type === 'community');
  }

  // Get active challenges
  static async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date();
    return mockChallenges.filter(challenge => {
      const deadline = new Date(challenge.deadline);
      return deadline > now;
    });
  }

  // Get completed challenges
  static async getCompletedChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.progress === 'Completed');
  }

  // Get challenges by deadline
  static async getChallengesByDeadline(days: number): Promise<Challenge[]> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    
    return mockChallenges.filter(challenge => {
      const challengeDeadline = new Date(challenge.deadline);
      return challengeDeadline <= deadline;
    });
  }

  // Search challenges
  static async searchChallenges(query: string): Promise<Challenge[]> {
    const searchTerm = query.toLowerCase();
    return mockChallenges.filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm) ||
      challenge.description.toLowerCase().includes(searchTerm)
    );
  }

  // Get recommended challenges for user
  static async getRecommendedChallenges(userId: string): Promise<Challenge[]> {
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return [];
    }

    // Get challenges based on user's interests and communities
    const userInterests = user.interests;
    const userCommunities = user.communitiesJoined;

    return mockChallenges.filter(challenge => {
      // Filter by user interests (simplified)
      const hasMatchingInterest = userInterests.some(interest => 
        challenge.description.toLowerCase().includes(interest.toLowerCase())
      );

      // Filter by community participation
      const hasCommunityInvolvement = userCommunities.length > 0;

      return hasMatchingInterest || hasCommunityInvolvement;
    }).slice(0, 5);
  }

  // Create new challenge
  static async createChallenge(challengeData: Partial<Challenge>): Promise<Challenge> {
    const newChallenge: Challenge = {
      id: `challenge_${Date.now()}`,
      title: challengeData.title || 'New Challenge',
      description: challengeData.description || 'Complete this challenge to earn rewards!',
      reward: challengeData.reward || 50,
      type: challengeData.type || 'special',
      deadline: challengeData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 'Not Started',
      requirements: challengeData.requirements || [],
      steps: challengeData.steps || 1,
      currentStep: 0
    };

    mockChallenges.push(newChallenge);
    return newChallenge;
  }

  // Update challenge
  static async updateChallenge(challengeId: string, updates: Partial<Challenge>): Promise<Challenge> {
    const challengeIndex = mockChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) {
      throw new Error('Challenge not found');
    }

    mockChallenges[challengeIndex] = {
      ...mockChallenges[challengeIndex],
      ...updates
    };

    return mockChallenges[challengeIndex];
  }

  // Delete challenge
  static async deleteChallenge(challengeId: string): Promise<void> {
    const challengeIndex = mockChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) {
      throw new Error('Challenge not found');
    }

    mockChallenges.splice(challengeIndex, 1);
  }

  // Get challenge statistics
  static async getChallengeStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    totalRewards: number;
  }> {
    const total = mockChallenges.length;
    const active = mockChallenges.filter(c => c.progress === 'In Progress').length;
    const completed = mockChallenges.filter(c => c.progress === 'Completed').length;
    const totalRewards = mockChallenges.reduce((sum, c) => sum + c.reward, 0);

    return {
      total,
      active,
      completed,
      totalRewards
    };
  }

  // Get challenges by reward range
  static async getChallengesByRewardRange(minReward: number, maxReward: number): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => 
      challenge.reward >= minReward && challenge.reward <= maxReward
    );
  }

  // Get high-value challenges
  static async getHighValueChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => challenge.reward >= 200);
  }

  // Get quick challenges (low steps)
  static async getQuickChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => (challenge.steps || 1) <= 3);
  }

  // Get long-term challenges
  static async getLongTermChallenges(): Promise<Challenge[]> {
    return mockChallenges.filter(challenge => (challenge.steps || 1) > 5);
  }

  // Get challenges ending soon
  static async getChallengesEndingSoon(days: number = 7): Promise<Challenge[]> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    
    return mockChallenges.filter(challenge => {
      const challengeDeadline = new Date(challenge.deadline);
      return challengeDeadline <= deadline && challenge.progress !== 'Completed';
    });
  }

  // Get user's challenge progress
  static async getUserChallengeProgress(userId: string): Promise<{
    totalChallenges: number;
    completedChallenges: number;
    totalRewardsEarned: number;
    currentStreak: number;
  }> {
    const userChallenges = mockChallenges.filter(c => c.progress === 'Completed');
    const totalRewards = userChallenges.reduce((sum, c) => sum + c.reward, 0);

    return {
      totalChallenges: mockChallenges.length,
      completedChallenges: userChallenges.length,
      totalRewardsEarned: totalRewards,
      currentStreak: Math.floor(Math.random() * 10) + 1 // Mock streak
    };
  }
} 