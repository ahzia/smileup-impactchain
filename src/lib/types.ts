// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
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
  recentActivities: {
    activity: string;
    time: string;
  }[];
  createdAt: string;
}

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
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  interests?: string[];
  avatar?: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  banner: string;
  members: number;
  missions: number;
  totalSmiles: number;
  status: "active" | "featured";
  createdBy: string;
  createdAt: string;
  location: string;
  website: string;
  recentPosts: {
    id: string;
    title: string;
    mediaUrl: string;
    createdAt: string;
  }[];
  recentMissions: {
    id: string;
    title: string;
    reward: number;
    status: string;
  }[];
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
  category: string;
  logo?: string;
  banner?: string;
  location?: string;
  website?: string;
}

// Feed Types
export interface FeedPost {
  id: string;
  mediaType: "video" | "image" | "text";
  mediaUrl?: string;
  title: string;
  description: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
  challenge: string;
  callToAction: string[];
  links: string[];
  smiles: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  saved?: boolean;
}

export interface CreateFeedPostRequest {
  title: string;
  description: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  challenge?: string;
  callToAction?: string[];
  links?: string[];
  communityId: string;
}

export interface DonateRequest {
  amount: number;
}

export interface DonateResponse {
  success: boolean;
  newBalance: number;
  newCommunitySmiles: number;
}

export interface CommentRequest {
  message: string;
}

export interface Comment {
  id: string;
  message: string;
  userId: string;
  timestamp: string;
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "available" | "accepted" | "completed";
  proofRequired: boolean;
  deadline: string;
  steps?: number;
  currentStep?: number;
  progress: "Not Started" | "In Progress" | "Completed";
  effortLevel: "Low" | "Medium" | "High";
  requiredTime: string;
  icon: string;
  category: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
}

export interface CreateMissionRequest {
  title: string;
  description: string;
  reward: number;
  proofRequired: boolean;
  deadline?: string;
  effortLevel: "Low" | "Medium" | "High";
  requiredTime: string;
  icon: string;
  category: string;
  communityId: string;
}

export interface CompleteMissionRequest {
  proofType: "image" | "video" | "text";
  proofUrl?: string;
  proofText?: string;
}

export interface MissionProgress {
  id: string;
  currentStep: number;
  totalSteps: number;
  progress: "Not Started" | "In Progress" | "Completed";
}

// Activity Types
export interface Activity {
  activityId: string;
  communityId: string;
  name: string;
  description: string;
  reward: number;
  requiredTime: string;
  effortLevel: "Low" | "Medium" | "High";
  status: "active" | "completed" | "pending";
  deadline?: string;
  location?: string;
  participants: number;
  maxParticipants: number;
  community: {
    id: string;
    name: string;
    logo: string;
  };
}

export interface CreateActivityRequest {
  name: string;
  description: string;
  reward: number;
  requiredTime: string;
  effortLevel: "Low" | "Medium" | "High";
  deadline?: string;
  location?: string;
  maxParticipants: number;
  communityId: string;
}

// Reward Types
export interface Reward {
  id: string;
  type: "experience" | "certificate" | "digital" | "event" | "voucher" | "award" | "discount" | "merchandise" | "service";
  title: string;
  description: string;
  validity: string;
  cost: number;
  provider: string;
  owned: boolean;
  emoji: string;
  imageUrl: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
}

export interface CreateRewardRequest {
  title: string;
  description: string;
  type: "experience" | "certificate" | "digital" | "event" | "voucher" | "award" | "discount" | "merchandise" | "service";
  cost: number;
  validity: string;
  emoji: string;
  imageUrl: string;
  communityId: string;
}

// Hub Types
export interface Hub {
  hub_id: string;
  name: string;
  description: string;
  created_by: string;
  category: string;
  image: string;
  participants: number;
  max_participants: number;
  community: {
    id: string;
    name: string;
    logo: string;
  };
  recentMessages: {
    id: string;
    userId: string;
    message: string;
    timestamp: string;
  }[];
}

export interface CreateHubRequest {
  name: string;
  description: string;
  category: string;
  image: string;
  max_participants: number;
  communityId: string;
}

export interface HubMessageRequest {
  message: string;
}

export interface HubMessage {
  id: string;
  message: string;
  userId: string;
  timestamp: string;
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: "streak" | "referral" | "special" | "community";
  deadline: string;
  progress: "Not Started" | "In Progress" | "Completed";
  requirements?: string[];
  steps?: number;
  currentStep?: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  smiles: number;
  level: number;
  score: number;
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  url: string;
}

// Query Parameters
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface FeedQuery extends PaginationQuery {
  category?: "all" | "sustainability" | "community" | "innovation";
  communityId?: string;
}

export interface MissionsQuery extends PaginationQuery {
  type?: "daily" | "weekly" | "featured" | "community";
  status?: "all" | "available" | "accepted" | "completed";
  communityId?: string;
}

export interface CommunitiesQuery extends PaginationQuery {
  category?: "all" | "sustainability" | "education" | "health" | "environment";
  status?: "all" | "active" | "featured";
}

export interface ActivitiesQuery extends PaginationQuery {
  communityId?: string;
  effortLevel?: "Low" | "Medium" | "High";
}

export interface RewardsQuery extends PaginationQuery {
  category?: "nft" | "merch" | "voucher" | "experience" | "service";
  provider?: "all" | "community" | "smileup";
}

export interface HubsQuery extends PaginationQuery {
  category?: "all" | "sustainable-business" | "digital-innovation" | "lifestyle-wellness" | "cultural-experiences";
  communityId?: string;
}

export interface ChallengesQuery extends PaginationQuery {
  type?: "streak" | "referral" | "special" | "community";
}

export interface LeaderboardQuery extends PaginationQuery {
  period?: "all" | "weekly" | "monthly";
  limit?: number;
} 