import { prisma } from '../database/client';
import { Mission, UserMission, MissionProof } from '../../generated/prisma';

export interface CreateMissionData {
  title: string;
  description?: string;
  reward: number;
  proofRequired?: boolean;
  deadline?: Date;
  maxParticipants?: number;
  category?: string;
  difficulty?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateMissionData {
  title?: string;
  description?: string;
  reward?: number;
  status?: string;
  proofRequired?: boolean;
  deadline?: Date;
  maxParticipants?: number;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

export class MissionService {
  // ========================================
  // MISSION CREATION & MANAGEMENT
  // ========================================

  static async createMission(data: CreateMissionData): Promise<Mission> {
    return await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description,
        reward: data.reward,
        proofRequired: data.proofRequired || false,
        deadline: data.deadline,
        maxParticipants: data.maxParticipants,
        category: data.category,
        difficulty: data.difficulty || 'easy',
        tags: data.tags || [],
        createdBy: data.createdBy,
      },
    });
  }

  static async findMissionById(id: string): Promise<Mission | null> {
    return await prisma.mission.findUnique({
      where: { id },
      include: {
        users: {
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
        proofs: {
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
      },
    });
  }

  static async updateMission(id: string, data: UpdateMissionData): Promise<Mission> {
    return await prisma.mission.update({
      where: { id },
      data,
    });
  }

  static async deleteMission(id: string): Promise<void> {
    await prisma.mission.delete({
      where: { id },
    });
  }

  // ========================================
  // MISSION SEARCH & FILTERING
  // ========================================

  static async searchMissions(query: string, limit: number = 10): Promise<Mission[]> {
    return await prisma.mission.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        status: 'available',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getMissionsByCategory(category: string, limit: number = 10): Promise<Mission[]> {
    return await prisma.mission.findMany({
      where: {
        category,
        status: 'available',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getMissionsByDifficulty(difficulty: string, limit: number = 10): Promise<Mission[]> {
    return await prisma.mission.findMany({
      where: {
        difficulty,
        status: 'available',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAvailableMissions(limit: number = 20): Promise<Mission[]> {
    return await prisma.mission.findMany({
      where: { status: 'available' },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPopularMissions(limit: number = 10): Promise<Mission[]> {
    return await prisma.mission.findMany({
      where: { status: 'available' },
      take: limit,
      orderBy: [
        { users: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
    });
  }

  // ========================================
  // USER MISSION PARTICIPATION
  // ========================================

  static async joinMission(userId: string, missionId: string): Promise<UserMission> {
    // Check if user is already participating
    const existingParticipation = await prisma.userMission.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
    });

    if (existingParticipation) {
      throw new Error('User is already participating in this mission');
    }

    // Check if mission is available and has capacity
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission || mission.status !== 'available') {
      throw new Error('Mission is not available');
    }

    if (mission.maxParticipants && mission.currentParticipants >= mission.maxParticipants) {
      throw new Error('Mission is at full capacity');
    }

    // Create participation and increment participant count
    const [userMission] = await prisma.$transaction([
      prisma.userMission.create({
        data: {
          userId,
          missionId,
          status: 'in_progress',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          mission: true,
        },
      }),
      prisma.mission.update({
        where: { id: missionId },
        data: {
          currentParticipants: {
            increment: 1,
          },
        },
      }),
    ]);

    return userMission;
  }

  static async leaveMission(userId: string, missionId: string): Promise<void> {
    const [userMission] = await prisma.$transaction([
      prisma.userMission.delete({
        where: {
          userId_missionId: {
            userId,
            missionId,
          },
        },
      }),
      prisma.mission.update({
        where: { id: missionId },
        data: {
          currentParticipants: {
            decrement: 1,
          },
        },
      }),
    ]);
  }

  static async completeMission(userId: string, missionId: string, proofText?: string, proofImages?: string[]): Promise<UserMission> {
    const userMission = await prisma.userMission.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
    });

    if (!userMission) {
      throw new Error('User is not participating in this mission');
    }

    if (userMission.status === 'completed') {
      throw new Error('Mission is already completed');
    }

    return await prisma.userMission.update({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
        proofText,
        proofImages: proofImages || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        mission: true,
      },
    });
  }

  static async getUserMissions(userId: string): Promise<UserMission[]> {
    return await prisma.userMission.findMany({
      where: { userId },
      include: {
        mission: true,
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  static async getMissionParticipants(missionId: string): Promise<UserMission[]> {
    return await prisma.userMission.findMany({
      where: { missionId },
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
      orderBy: { joinedAt: 'desc' },
    });
  }

  // ========================================
  // MISSION PROOFS & BLOCKCHAIN
  // ========================================

  static async submitProof(data: {
    userId: string;
    missionId: string;
    proofText?: string;
    proofImages?: string[];
    blockchainTxId?: string;
    proofHash?: string;
  }): Promise<MissionProof> {
    return await prisma.missionProof.create({
      data: {
        userId: data.userId,
        missionId: data.missionId,
        proofText: data.proofText,
        proofImages: data.proofImages || [],
        blockchainTxId: data.blockchainTxId,
        proofHash: data.proofHash,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        mission: true,
      },
    });
  }

  static async reviewProof(proofId: string, status: 'approved' | 'rejected', reviewedBy: string, reviewNotes?: string): Promise<MissionProof> {
    return await prisma.missionProof.update({
      where: { id: proofId },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes,
      },
    });
  }

  static async getProofsByMission(missionId: string): Promise<MissionProof[]> {
    return await prisma.missionProof.findMany({
      where: { missionId },
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
    });
  }

  static async getProofsByUser(userId: string): Promise<MissionProof[]> {
    return await prisma.missionProof.findMany({
      where: { userId },
      include: {
        mission: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========================================
  // ANALYTICS
  // ========================================

  static async getMissionStats(missionId: string): Promise<{
    participantCount: number;
    completedCount: number;
    totalReward: number;
  }> {
    const [participantCount, completedCount, completedMissions] = await Promise.all([
      prisma.userMission.count({ where: { missionId } }),
      prisma.userMission.count({ where: { missionId, status: 'completed' } }),
      prisma.userMission.findMany({
        where: { missionId, status: 'completed' },
        include: { mission: true },
      }),
    ]);

    const totalReward = completedMissions.reduce((sum, userMission) => {
      return sum + (userMission.mission?.reward || 0);
    }, 0);

    return {
      participantCount,
      completedCount,
      totalReward,
    };
  }

  static async getCategoryStats(): Promise<{
    category: string;
    count: number;
    totalReward: number;
  }[]> {
    const stats = await prisma.mission.groupBy({
      by: ['category'],
      where: { status: 'available' },
      _count: { id: true },
      _sum: { reward: true },
    });

    return stats.map(stat => ({
      category: stat.category || 'Uncategorized',
      count: stat._count.id,
      totalReward: stat._sum.reward || 0,
    }));
  }

  // ========================================
  // API COMPATIBILITY METHODS
  // ========================================

  static async getMissions(query: {
    type?: string;
    status?: string;
    communityId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<any[]> {
    let missions = await this.getAvailableMissions(100);

    // Filter by type (category)
    if (query.type && query.type !== 'all') {
      missions = missions.filter(mission => mission.category === query.type);
    }

    // Filter by status
    if (query.status && query.status !== 'all') {
      missions = missions.filter(mission => mission.status === query.status);
    }

    // Filter by community (if specified)
    if (query.communityId) {
      missions = missions.filter(mission => mission.createdBy === query.communityId);
    }

    // Pagination
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return missions.slice(startIndex, endIndex);
  }

  static async createMissionWithUser(data: any, userId: string): Promise<any> {
    const mission = await this.createMission({
      title: data.title,
      description: data.description,
      reward: data.reward,
      proofRequired: data.proofRequired || false,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      maxParticipants: data.effortLevel === 'High' ? 50 : data.effortLevel === 'Medium' ? 100 : 200,
      category: data.category,
      difficulty: data.effortLevel === 'High' ? 'hard' : data.effortLevel === 'Medium' ? 'medium' : 'easy',
      tags: [data.category, data.effortLevel.toLowerCase()],
      createdBy: userId,
    });

    return {
      id: mission.id,
      title: mission.title,
    };
  }
} 