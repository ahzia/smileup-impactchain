import { missions } from '@/data';
import { Mission, CreateMissionRequest, CompleteMissionRequest, MissionProgress } from '@/lib/types';
import { AuthService } from './authService';
import { CommunityService } from './communityService';

// Mock mission storage
let mockMissions = [...missions];

export class MissionService {
  // Get missions with filtering
  static async getMissions(query: {
    type?: string;
    status?: string;
    communityId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Mission[]> {
    let filteredMissions = [...mockMissions];

    // Filter by type
    if (query.type && query.type !== 'all') {
      filteredMissions = filteredMissions.filter(mission => mission.category === query.type);
    }

    // Filter by status
    if (query.status && query.status !== 'all') {
      filteredMissions = filteredMissions.filter(mission => mission.status === query.status);
    }

    // Filter by community
    if (query.communityId) {
      filteredMissions = filteredMissions.filter(mission => mission.community.id === query.communityId);
    }

    // Sort by deadline (closest first)
    filteredMissions.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredMissions.slice(startIndex, endIndex);
  }

  // Get mission by ID
  static async getMissionById(missionId: string): Promise<Mission | null> {
    const mission = mockMissions.find(m => m.id === missionId);
    return mission || null;
  }

  // Create new mission
  static async createMission(missionData: CreateMissionRequest, userId: string): Promise<Mission> {
    // Get community info
    const community = await CommunityService.getCommunityById(missionData.communityId);
    if (!community) {
      throw new Error('Community not found');
    }

    const newMission: Mission = {
      id: `mission_${Date.now()}`,
      title: missionData.title,
      description: missionData.description,
      reward: missionData.reward,
      status: 'available',
      proofRequired: missionData.proofRequired,
      deadline: missionData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      steps: 1,
      currentStep: 0,
      progress: 'Not Started',
      effortLevel: missionData.effortLevel,
      requiredTime: missionData.requiredTime,
      icon: missionData.icon,
      category: missionData.category,
      community: {
        id: community.id,
        name: community.name,
        logo: community.logo
      }
    };

    mockMissions.push(newMission);

    // Update community mission count
    await CommunityService.updateCommunityStats(community.id, {
      missions: community.missions + 1
    });

    // Add to community's recent missions
    await CommunityService.addRecentMission(community.id, {
      id: newMission.id,
      title: newMission.title,
      reward: newMission.reward,
      status: newMission.status
    });

    return newMission;
  }

  // Accept mission
  static async acceptMission(missionId: string, userId: string): Promise<Mission> {
    const missionIndex = mockMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
      throw new Error('Mission not found');
    }

    const mission = mockMissions[missionIndex];
    if (mission.status !== 'available') {
      throw new Error('Mission is not available');
    }

    mission.status = 'accepted';
    mission.progress = 'In Progress';
    mission.currentStep = 1;

    // Add activity to user
    await AuthService.addRecentActivity(userId, `Accepted mission: "${mission.title}"`);

    return mission;
  }

  // Complete mission
  static async completeMission(missionId: string, completionData: CompleteMissionRequest, userId: string): Promise<{
    success: boolean;
    reward: number;
    newBalance: number;
    mission: Mission;
  }> {
    const missionIndex = mockMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
      throw new Error('Mission not found');
    }

    const mission = mockMissions[missionIndex];
    if (mission.status !== 'accepted') {
      throw new Error('Mission must be accepted before completion');
    }

    // Validate proof if required
    if (mission.proofRequired) {
      if (!completionData.proofType || (!completionData.proofUrl && !completionData.proofText)) {
        throw new Error('Proof is required for this mission');
      }
    }

    // Update mission status
    mission.status = 'completed';
    mission.progress = 'Completed';
    mission.currentStep = mission.steps || 1;

    // Award Smiles to user
    const user = await AuthService.updateUserSmiles(userId, mission.reward);

    // Add activity to user
    await AuthService.addRecentActivity(userId, `Completed mission: "${mission.title}" and earned ${mission.reward} Smiles`);

    // Check for badges
    await this.checkForBadges(userId, mission);

    return {
      success: true,
      reward: mission.reward,
      newBalance: user.smiles,
      mission
    };
  }

  // Get mission progress
  static async getMissionProgress(missionId: string, userId: string): Promise<MissionProgress> {
    const mission = mockMissions.find(m => m.id === missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }

    return {
      id: mission.id,
      currentStep: mission.currentStep || 0,
      totalSteps: mission.steps || 1,
      progress: mission.progress
    };
  }

  // Update mission progress
  static async updateMissionProgress(missionId: string, step: number, userId: string): Promise<Mission> {
    const missionIndex = mockMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
      throw new Error('Mission not found');
    }

    const mission = mockMissions[missionIndex];
    if (mission.status !== 'accepted') {
      throw new Error('Mission must be accepted to update progress');
    }

    mission.currentStep = step;
    
    if (step >= (mission.steps || 1)) {
      mission.progress = 'Completed';
    } else {
      mission.progress = 'In Progress';
    }

    return mission;
  }

  // Get daily missions
  static async getDailyMissions(): Promise<Mission[]> {
    return mockMissions.filter(mission => mission.category === 'daily');
  }

  // Get weekly missions
  static async getWeeklyMissions(): Promise<Mission[]> {
    return mockMissions.filter(mission => mission.category === 'weekly');
  }

  // Get community missions
  static async getCommunityMissions(communityId: string): Promise<Mission[]> {
    return mockMissions.filter(mission => mission.community.id === communityId);
  }

  // Get missions by effort level
  static async getMissionsByEffortLevel(effortLevel: string): Promise<Mission[]> {
    return mockMissions.filter(mission => mission.effortLevel === effortLevel);
  }

  // Get missions by deadline
  static async getMissionsByDeadline(days: number): Promise<Mission[]> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    
    return mockMissions.filter(mission => {
      const missionDeadline = new Date(mission.deadline);
      return missionDeadline <= deadline;
    });
  }

  // Search missions
  static async searchMissions(query: string): Promise<Mission[]> {
    const searchTerm = query.toLowerCase();
    return mockMissions.filter(mission => 
      mission.title.toLowerCase().includes(searchTerm) ||
      mission.description.toLowerCase().includes(searchTerm) ||
      mission.community.name.toLowerCase().includes(searchTerm)
    );
  }

  // Get recommended missions for user
  static async getRecommendedMissions(userId: string): Promise<Mission[]> {
    const user = await AuthService.getUserById(userId);
    if (!user) {
      return [];
    }

    // Get missions from communities user has joined
    const userCommunities = user.communitiesJoined;
    const communityMissions = mockMissions.filter(mission => 
      userCommunities.includes(mission.community.id)
    );

    // Sort by reward and effort level
    return communityMissions.sort((a, b) => {
      // Prioritize higher rewards and lower effort
      const scoreA = a.reward / (a.effortLevel === 'High' ? 3 : a.effortLevel === 'Medium' ? 2 : 1);
      const scoreB = b.reward / (b.effortLevel === 'High' ? 3 : b.effortLevel === 'Medium' ? 2 : 1);
      return scoreB - scoreA;
    }).slice(0, 10);
  }

  // Delete mission
  static async deleteMission(missionId: string, userId: string): Promise<void> {
    const missionIndex = mockMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
      throw new Error('Mission not found');
    }

    const mission = mockMissions[missionIndex];
    
    // Check if user is the creator or community admin
    // For now, allow deletion
    mockMissions.splice(missionIndex, 1);
  }

  // Update mission
  static async updateMission(missionId: string, updates: Partial<Mission>, userId: string): Promise<Mission> {
    const missionIndex = mockMissions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) {
      throw new Error('Mission not found');
    }

    mockMissions[missionIndex] = {
      ...mockMissions[missionIndex],
      ...updates
    };

    return mockMissions[missionIndex];
  }

  // Check for badges based on mission completion
  private static async checkForBadges(userId: string, mission: Mission): Promise<void> {
    const user = await AuthService.getUserById(userId);
    if (!user) return;

    // Check for mission completion badges
    const completedMissions = mockMissions.filter(m => m.status === 'completed');
    
    if (completedMissions.length >= 10) {
      await AuthService.addBadge(userId, 'Mission Master');
    }
    
    if (completedMissions.length >= 5) {
      await AuthService.addBadge(userId, 'Dedicated Volunteer');
    }
    
    if (completedMissions.length >= 1) {
      await AuthService.addBadge(userId, 'First Mission');
    }

    // Check for community-specific badges
    const communityMissions = completedMissions.filter(m => m.community.id === mission.community.id);
    if (communityMissions.length >= 3) {
      await AuthService.addBadge(userId, `${mission.community.name} Supporter`);
    }
  }
} 