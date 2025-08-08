import { prisma } from '../database/client';
import { User } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import { CustodialWalletService } from '../wallet/custodialWalletService';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  bio?: string;
  interests?: string[];
  avatarUrl?: string;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  interests?: string[];
  avatarUrl?: string;
}

export class UserService {
  private static custodialWalletService = new CustodialWalletService();

  // Create a new user
  static async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        bio: data.bio,
        interests: data.interests || [],
        avatarUrl: data.avatarUrl,
        smiles: 0, // We'll get this from wallet
        level: 1,
        score: 100,
        badges: [],
      },
    });
  }

  // Find user by email
  static async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by ID
  static async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.passwordHash) {
      throw new Error('Invalid authentication method');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return user;
  }

  // Update user
  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Get user with real-time balance
  static async getUserWithBalance(id: string): Promise<User & { realTimeBalance: number }> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(id);
    
    return {
      ...user,
      realTimeBalance: walletBalance.smiles
    };
  }

  // Get user profile with real-time data
  static async getUserProfile(id: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0, // TODO: Implement friend count
      communitiesJoined: [], // TODO: Implement community memberships
      communitiesCreated: [], // TODO: Implement created communities
      badges: user.badges,
      recentActivities: [], // TODO: Implement activity tracking
      createdAt: user.createdAt.toISOString()
    };
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Add badge to user
  static async addBadge(userId: string, badge: string): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedBadges = [...user.badges, badge];
    
    return await prisma.user.update({
      where: { id: userId },
      data: { badges: updatedBadges }
    });
  }
} 