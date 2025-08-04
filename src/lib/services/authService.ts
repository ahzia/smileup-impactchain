import { users, currentUser } from '@/data';
import { User, LoginRequest, RegisterRequest, LoginResponse, UpdateProfileRequest } from '@/lib/types';

// Mock JWT token generation
const generateToken = (userId: string): string => {
  return `mock_jwt_${userId}_${Date.now()}`;
};

// Mock user storage (in real app, this would be a database)
let mockUsers = [...users];
let currentUserId = currentUser.id;

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In real app, verify password hash
    if (credentials.password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    const token = generateToken(user.id);
    currentUserId = user.id;
    
    return {
      token,
      user
    };
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      smiles: 100, // Initial Smiles
      level: 1,
      score: 100,
      bio: userData.bio || '',
      interests: userData.interests || [],
      friends: 0,
      communitiesJoined: [],
      communitiesCreated: [],
      badges: ['Newcomer'],
      recentActivities: [],
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    currentUserId = newUser.id;
    
    const token = generateToken(newUser.id);
    
    return {
      token,
      user: newUser
    };
  }

  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    const user = mockUsers.find(u => u.id === currentUserId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Update user profile
  static async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === currentUserId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates
    };

    return mockUsers[userIndex];
  }

  // Validate token (mock implementation)
  static async validateToken(token: string): Promise<User | null> {
    // In real app, verify JWT token
    if (!token.startsWith('mock_jwt_')) {
      return null;
    }
    
    const user = mockUsers.find(u => u.id === currentUserId);
    return user || null;
  }

  // Logout user
  static async logout(): Promise<void> {
    currentUserId = '';
    // In real app, invalidate token
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
  }

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<User[]> {
    return mockUsers;
  }

  // Update user Smiles
  static async updateUserSmiles(userId: string, amount: number): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].smiles += amount;
    
    // Update level based on Smiles
    const newLevel = Math.floor(mockUsers[userIndex].smiles / 100) + 1;
    mockUsers[userIndex].level = newLevel;
    
    return mockUsers[userIndex];
  }

  // Add user to community
  static async joinCommunity(userId: string, communityId: string): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (!mockUsers[userIndex].communitiesJoined.includes(communityId)) {
      mockUsers[userIndex].communitiesJoined.push(communityId);
    }

    return mockUsers[userIndex];
  }

  // Remove user from community
  static async leaveCommunity(userId: string, communityId: string): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].communitiesJoined = mockUsers[userIndex].communitiesJoined.filter(
      id => id !== communityId
    );

    return mockUsers[userIndex];
  }

  // Add recent activity
  static async addRecentActivity(userId: string, activity: string): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const newActivity = {
      activity,
      time: new Date().toLocaleString()
    };

    mockUsers[userIndex].recentActivities.unshift(newActivity);
    
    // Keep only last 10 activities
    mockUsers[userIndex].recentActivities = mockUsers[userIndex].recentActivities.slice(0, 10);

    return mockUsers[userIndex];
  }

  // Add badge to user
  static async addBadge(userId: string, badge: string): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (!mockUsers[userIndex].badges.includes(badge)) {
      mockUsers[userIndex].badges.push(badge);
    }

    return mockUsers[userIndex];
  }
} 