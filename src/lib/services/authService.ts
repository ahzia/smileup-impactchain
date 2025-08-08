import { UserService } from './userService';
import { JWTService } from './jwtService';
import { CustodialWalletService } from '../wallet/custodialWalletService';
import { User } from '../../generated/prisma';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  interests?: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  interests?: string[];
  avatarUrl?: string;
}

export class AuthService {
  private static custodialWalletService = new CustodialWalletService();

  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = await UserService.authenticateUser(credentials.email, credentials.password);
    
    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(user.id);
    
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
        smiles: walletBalance.smiles, // Real-time balance from wallet
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

    // Automatically create custodial wallet for new user
    try {
      console.log('🔐 Starting automatic wallet creation for user:', newUser.id);
      const wallet = await this.custodialWalletService.createWalletForUser(newUser.id);
      console.log('✅ Successfully created custodial wallet for new user:', newUser.id, 'Account ID:', wallet.accountId);
      
      // Automatically mint 1000 Smiles tokens for new user
      console.log('🪙 Minting initial 1000 Smiles tokens for new user...');
      const mintResult = await this.custodialWalletService.mintTokensToUser(newUser.id, 1000);
      
      if (mintResult.success) {
        console.log('✅ Successfully minted initial tokens for new user!');
        console.log('💰 Initial balance:', mintResult.newBalance, 'Smiles');
      } else {
        console.error('❌ Failed to mint initial tokens:', mintResult.error);
        // Continue with registration even if minting fails
      }
      
    } catch (walletError) {
      console.error('❌ Failed to create custodial wallet for user:', newUser.id, 'Error:', walletError);
      console.error('❌ Wallet creation error details:', {
        message: walletError instanceof Error ? walletError.message : 'Unknown error',
        stack: walletError instanceof Error ? walletError.stack : undefined
      });
      // Continue with registration even if wallet creation fails
      // The user can create the wallet later from the profile page
    }

    // Get real-time balance from wallet (should be 1000 for new user)
    const walletBalance = await this.custodialWalletService.getUserBalance(newUser.id);
    
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
        smiles: walletBalance.smiles, // Real-time balance from wallet
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

      // Get real-time balance from wallet
      const walletBalance = await this.custodialWalletService.getUserBalance(user.id);

      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresIn: tokenPair.expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || '',
          smiles: walletBalance.smiles, // Real-time balance from wallet
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

  // Get current user with real-time balance
  static async getCurrentUser(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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
  static async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
    const updatedUser = await UserService.updateUser(userId, updates);
    
    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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

  // Validate token and return user
  static async validateToken(token: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  } | null> {
    try {
      const decoded = JWTService.verifyAccessToken(token);
      const user = await UserService.findUserById(decoded.userId);
      
      if (!user) {
        return null;
      }

      // Get real-time balance from wallet
      const walletBalance = await this.custodialWalletService.getUserBalance(user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || '',
        smiles: walletBalance.smiles, // Real-time balance from wallet
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

  // Get user by ID with real-time balance
  static async getUserById(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  } | null> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      return null;
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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

  // Get all users with real-time balances
  static async getAllUsers(): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }[]> {
    const users = await UserService.getAllUsers();
    
    // Get real-time balances for all users
    const usersWithBalances = await Promise.all(
      users.map(async (user) => {
        const walletBalance = await this.custodialWalletService.getUserBalance(user.id);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || '',
          smiles: walletBalance.smiles, // Real-time balance from wallet
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
      })
    );

    return usersWithBalances;
  }

  // Update user smiles (now using real-time balance)
  static async updateUserSmiles(userId: string, amount: number): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
    // Since we're using real-time balances, we don't update the database
    // The balance will be updated on the blockchain and reflected in real-time queries
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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

  // Join community
  static async joinCommunity(userId: string, communityId: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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
  static async leaveCommunity(userId: string, communityId: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get real-time balance from wallet
    const walletBalance = await this.custodialWalletService.getUserBalance(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl || '',
      smiles: walletBalance.smiles, // Real-time balance from wallet
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
  static async addRecentActivity(userId: string, activity: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
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
  static async addBadge(userId: string, badge: string): Promise<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    smiles: number;
    level: number;
    score: number;
    bio: string;
    interests: string[];
    friends: number;
    communitiesJoined: string[];
    communitiesCreated: string[];
    badges: string[];
    recentActivities: { activity: string; time: string }[];
    createdAt: string;
  }> {
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