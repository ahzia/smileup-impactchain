import { prisma } from '../database/client';
import { User, UserAnalytics } from '../../generated/prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  interests?: string[];
}

export interface UpdateUserData {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  interests?: string[];
  smiles?: number;
  level?: number;
  score?: number;
  badges?: string[];
}

export class UserService {
  // ========================================
  // USER CREATION & AUTHENTICATION
  // ========================================

  static async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        interests: data.interests || [],
      },
    });

    // Create user analytics record
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
      },
    });

    return user;
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  static async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        communities: {
          include: {
            community: true,
          },
        },
        missions: {
          include: {
            mission: true,
          },
        },
        rewards: {
          include: {
            reward: true,
          },
        },
      },
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // ========================================
  // USER UPDATES
  // ========================================

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async updateUserSmiles(id: string, smiles: number): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { smiles },
    });
  }

  static async updateUserScore(id: string, score: number): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { score },
    });
  }

  static async addBadge(id: string, badge: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const badges = user.badges || [];
    if (!badges.includes(badge)) {
      badges.push(badge);
    }

    return await prisma.user.update({
      where: { id },
      data: { badges },
    });
  }

  // ========================================
  // USER ANALYTICS
  // ========================================

  static async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    return await prisma.userAnalytics.findUnique({
      where: { userId },
    });
  }

  static async updateUserAnalytics(userId: string, data: Partial<UserAnalytics>): Promise<UserAnalytics> {
    return await prisma.userAnalytics.update({
      where: { userId },
      data,
    });
  }

  static async incrementMissionCount(userId: string): Promise<void> {
    await prisma.userAnalytics.update({
      where: { userId },
      data: {
        totalMissions: {
          increment: 1,
        },
      },
    });
  }

  static async incrementCompletedMissions(userId: string): Promise<void> {
    await prisma.userAnalytics.update({
      where: { userId },
      data: {
        completedMissions: {
          increment: 1,
        },
      },
    });
  }

  // ========================================
  // USER SEARCH & FILTERING
  // ========================================

  static async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUsersByInterests(interests: string[], limit: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        interests: {
          hasSome: interests,
        },
        isActive: true,
      },
      take: limit,
      orderBy: { score: 'desc' },
    });
  }

  // ========================================
  // LEADERBOARD
  // ========================================

  static async getTopUsers(limit: number = 10): Promise<Partial<User>[]> {
    return await prisma.user.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: { score: 'desc' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        score: true,
        level: true,
        badges: true,
      },
    });
  }

  static async getUsersByLevel(level: number, limit: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        level,
        isActive: true,
      },
      take: limit,
      orderBy: { score: 'desc' },
    });
  }

  // ========================================
  // BULK OPERATIONS
  // ========================================

  static async getUsersByIds(ids: string[]): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  static async deactivateUser(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
} 