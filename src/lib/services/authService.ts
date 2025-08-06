import { UserService } from './userService';
import { JWTService, TokenPair } from './jwtService';
import { User, LoginRequest, RegisterRequest, LoginResponse, UpdateProfileRequest } from '@/lib/types';

export class AuthService {
  // ========================================
  // AUTHENTICATION
  // ========================================

  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await UserService.authenticateUser(credentials.email, credentials.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate token pair
    const tokenPair = JWTService.generateUserTokens(user);
    
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || '',
        smiles: user.smiles,
        level: user.level,
        score: user.score,
        bio: user.bio || '',
        interests: user.interests,
        friends: 0,
        communitiesJoined: [],
        communitiesCreated: [],
        badges: user.badges,
        recentActivities: [],
        createdAt: user.createdAt.toISOString()
      }
    };
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = await UserService.createUser({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      bio: userData.bio,
      interests: userData.interests,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    });

    // Generate token pair
    const tokenPair = JWTService.generateUserTokens(newUser);
    
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresIn: tokenPair.expiresIn,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatarUrl || '',
        smiles: newUser.smiles,
        level: newUser.level,
        score: newUser.score,
        bio: newUser.bio || '',
        interests: newUser.interests,
        friends: 0,
        communitiesJoined: [],
        communitiesCreated: [],
        badges: newUser.badges,
        recentActivities: [],
        createdAt: newUser.createdAt.toISOString()
      }
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const tokenPair = JWTService.refreshAccessToken(refreshToken);
      
      // Get user from token
      const decoded = JWTService.verifyRefreshToken(refreshToken);
      const user = await UserService.findUserById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresIn: tokenPair.expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || '',
          smiles: user.smiles,
          level: user.level,
          score: user.score,
          bio: user.bio || '',
          interests: user.interests,
          friends: 0,
          communitiesJoined: [],
          communitiesCreated: [],
          badges: user.badges,
          recentActivities: [],
          createdAt: user.createdAt.toISOString()
        }
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout user
  static async logout(accessToken: string): Promise<void> {
    // Blacklist the token
    JWTService.blacklistToken(accessToken);
  }

  // ========================================
  // USER MANAGEMENT
  // ========================================

  // Get current user profile
  static async getCurrentUser(userId: string): Promise<User> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt.toISOString()
    };
  }

  // Update user profile
  static async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<User> {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.bio) updateData.bio = updates.bio;
    if (updates.interests) updateData.interests = updates.interests;
    if (updates.avatar) updateData.avatarUrl = updates.avatar;

    const updatedUser = await UserService.updateUser(userId, updateData);
    
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatarUrl || '',
      smiles: updatedUser.smiles,
      level: updatedUser.level,
      score: updatedUser.score,
      bio: updatedUser.bio || '',
      interests: updatedUser.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: updatedUser.badges,
      recentActivities: [],
      createdAt: updatedUser.createdAt.toISOString()
    };
  }

  // Validate token
  static async validateToken(token: string): Promise<User | null> {
    try {
      // Check if token is blacklisted
      if (JWTService.isTokenBlacklisted(token)) {
        return null;
      }

      // Simple token validation for development
      if (!token.startsWith('jwt_')) {
        return null;
      }

      const parts = token.split('_');
      if (parts.length < 2) {
        return null;
      }

      const userId = parts[1];
      const user = await UserService.findUserById(userId);
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || '',
        smiles: user.smiles,
        level: user.level,
        score: user.score,
        bio: user.bio || '',
        interests: user.interests,
        friends: 0,
        communitiesJoined: [],
        communitiesCreated: [],
        badges: user.badges,
        recentActivities: [],
        createdAt: user.createdAt.toISOString()
      };
    } catch (error) {
      return null;
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt.toISOString()
    };
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const users = await UserService.getTopUsers(50);
    
    return users.map(user => ({
      id: user.id!,
      name: user.name!,
      email: user.email!,
      avatar: user.avatarUrl || '',
      smiles: user.smiles!,
      level: user.level!,
      score: user.score!,
      bio: user.bio || '',
      interests: user.interests!,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges!,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    }));
  }

  // Update user smiles
  static async updateUserSmiles(userId: string, amount: number): Promise<User> {
    const user = await UserService.updateUserSmiles(userId, amount);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  // Join community
  static async joinCommunity(userId: string, communityId: string): Promise<User> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  // Leave community
  static async leaveCommunity(userId: string, communityId: string): Promise<User> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  // Add recent activity
  static async addRecentActivity(userId: string, activity: string): Promise<User> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  // Add badge
  static async addBadge(userId: string, badge: string): Promise<User> {
    const user = await UserService.addBadge(userId, badge);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: user.smiles,
      level: user.level,
      score: user.score,
      bio: user.bio || '',
      interests: user.interests,
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: user.badges,
      recentActivities: [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };
  }
} 