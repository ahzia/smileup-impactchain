# SmileUp ImpactChain - API Documentation

**Document ID:** 10  
**Date:** August 5, 2024  
**Version:** 1.0.0  
**Status:** ✅ Complete  

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Examples](#examples)
7. [Rate Limiting](#rate-limiting)
8. [Deployment](#deployment)

## 🌐 Overview

The SmileUp ImpactChain API provides a comprehensive REST API for the social impact platform. All endpoints return JSON responses and use standard HTTP status codes.

### Base URL
```
Development: http://localhost:3000/api
Production: https://api.smileup-impactchain.com/api
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2024-08-05T15:00:00.000Z"
}
```

## 🔐 Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Tokens) for authentication with access and refresh tokens.

#### Token Structure
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Token Format**: `Bearer <token>`

#### Authentication Flow

1. **Login** → Receive access and refresh tokens
2. **API Requests** → Include access token in Authorization header
3. **Token Expiry** → Use refresh token to get new access token
4. **Logout** → Blacklist current access token

#### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## ⚠️ Error Handling

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `AUTH_REQUIRED` | Authentication required | 401 |
| `INVALID_CREDENTIALS` | Invalid email or password | 401 |
| `TOKEN_EXPIRED` | Access token has expired | 401 |
| `INVALID_TOKEN` | Invalid or malformed token | 401 |
| `INSUFFICIENT_PERMISSIONS` | Insufficient permissions | 403 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `MISSING_REQUIRED_FIELD` | Required field missing | 400 |
| `INVALID_FORMAT` | Invalid data format | 400 |
| `RECORD_NOT_FOUND` | Resource not found | 404 |
| `DUPLICATE_RECORD` | Record already exists | 409 |
| `INSUFFICIENT_SMILES` | Insufficient smiles | 400 |
| `MISSION_ALREADY_COMPLETED` | Mission already completed | 409 |
| `COMMUNITY_FULL` | Community at capacity | 409 |
| `REWARD_OUT_OF_STOCK` | Reward out of stock | 409 |
| `INTERNAL_SERVER_ERROR` | Server error | 500 |

## 🚀 API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "Environmental activist",
  "interests": ["sustainability", "community"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "smiles": 100,
      "level": 1,
      "score": 100,
      "bio": "Environmental activist",
      "interests": ["sustainability", "community"],
      "friends": 0,
      "communitiesJoined": [],
      "communitiesCreated": [],
      "badges": [],
      "recentActivities": [],
      "createdAt": "2024-08-05T15:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register response.

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** Same as login response.

#### POST /api/auth/logout
Logout user and blacklist current token.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### User Management

#### GET /api/user/profile
Get current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "smiles": 1250,
    "level": 8,
    "score": 3200,
    "bio": "Environmental activist",
    "interests": ["sustainability", "community"],
    "friends": 45,
    "communitiesJoined": ["comm_001", "comm_002"],
    "communitiesCreated": ["comm_003"],
    "badges": ["Early Adopter", "Community Leader"],
    "recentActivities": [
      {
        "activity": "Completed 'Beach Cleanup Mission'",
        "time": "2 hours ago"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT /api/user/profile
Update user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Updated bio",
  "interests": ["sustainability", "technology"],
  "avatar": "https://new-avatar.jpg"
}
```

**Response:** Updated user profile.

### Communities

#### GET /api/communities
Get list of communities with filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status (active/featured)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "comm_001",
      "name": "Green Earth Initiative",
      "description": "Environmental organization...",
      "category": "sustainability",
      "logoUrl": "https://...",
      "bannerUrl": "https://...",
      "location": "San Francisco, CA",
      "website": "https://greenearth.org",
      "status": "featured",
      "isVerified": true,
      "createdAt": "2023-08-15T09:00:00.000Z",
      "createdBy": "user_001"
    }
  ]
}
```

#### POST /api/communities
Create a new community.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "Tech for Good",
  "description": "Leveraging technology for social impact",
  "category": "technology",
  "logo": "https://logo.jpg",
  "banner": "https://banner.jpg",
  "location": "Austin, TX",
  "website": "https://techforgood.org"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "community": {
      "id": "comm_456",
      "name": "Tech for Good",
      "status": "active"
    }
  }
}
```

### Missions

#### GET /api/missions
Get list of missions with filtering.

**Query Parameters:**
- `type` (optional): Filter by type (daily/weekly/featured/community)
- `status` (optional): Filter by status (available/accepted/completed)
- `communityId` (optional): Filter by community
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mission_001",
      "title": "Beach Cleanup Mission",
      "description": "Help clean up local beaches...",
      "reward": 50,
      "status": "available",
      "proofRequired": true,
      "deadline": "2024-12-31T23:59:59Z",
      "maxParticipants": 100,
      "currentParticipants": 25,
      "category": "environment",
      "difficulty": "medium",
      "tags": ["environment", "medium"],
      "createdAt": "2024-08-05T15:00:00.000Z",
      "createdBy": "comm_001"
    }
  ]
}
```

#### POST /api/missions
Create a new mission.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Tree Planting Mission",
  "description": "Plant trees in your community",
  "reward": 75,
  "proofRequired": true,
  "deadline": "2024-12-31T23:59:59Z",
  "effortLevel": "Medium",
  "requiredTime": "2 hours",
  "icon": "🌲",
  "category": "environment",
  "communityId": "comm_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mission": {
      "id": "mission_789",
      "title": "Tree Planting Mission"
    }
  }
}
```

### Rewards

#### GET /api/rewards
Get list of rewards with filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `provider` (optional): Filter by provider
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "reward_001",
      "name": "Early Adopter Badge",
      "description": "Exclusive digital badge...",
      "price": 100,
      "category": "digital",
      "imageUrl": "https://...",
      "isAvailable": true,
      "stock": null,
      "soldCount": 14,
      "createdAt": "2024-08-05T15:00:00.000Z"
    }
  ]
}
```

#### POST /api/rewards
Create a new reward.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Community Workshop",
  "description": "Join our community workshop",
  "type": "experience",
  "cost": 200,
  "validity": "Valid until December 31, 2024",
  "emoji": "🎓",
  "imageUrl": "https://workshop.jpg",
  "communityId": "comm_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reward": {
      "id": "reward_456",
      "title": "Community Workshop"
    }
  }
}
```

### Feed Posts

#### GET /api/feed
Get feed posts with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `communityId` (optional): Filter by community

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_001",
      "title": "Amazing Beach Cleanup Success!",
      "description": "Yesterday we collected over 500kg of waste...",
      "mediaType": "image",
      "mediaUrl": "https://cleanup.jpg",
      "challenge": "Join us next month for another cleanup event!",
      "callToAction": ["Sign up for next event", "Share your cleanup story"],
      "links": ["https://greenearth.org/events"],
      "smiles": 45,
      "commentsCount": 8,
      "likesCount": 23,
      "createdAt": "2024-08-05T15:00:00.000Z",
      "userId": "user_001",
      "communityId": "comm_001",
      "user": {
        "id": "user_001",
        "name": "Sarah Chen",
        "avatarUrl": "https://..."
      },
      "community": {
        "id": "comm_001",
        "name": "Green Earth Initiative",
        "logoUrl": "https://..."
      },
      "comments": [],
      "likes": []
    }
  ]
}
```

#### POST /api/feed
Create a new feed post.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Community Garden Success",
  "description": "Our community garden is thriving!",
  "mediaType": "image",
  "mediaUrl": "https://garden.jpg",
  "challenge": "Start your own community garden",
  "callToAction": ["Learn more", "Share your garden"],
  "links": ["https://communitygarden.org"],
  "communityId": "comm_001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "post_789",
      "title": "Community Garden Success"
    }
  }
}
```

### Database Test

#### GET /api/test-db
Test database connection and get statistics.

**Response:**
```json
{
  "success": true,
  "message": "Database connection successful!",
  "stats": {
    "users": 9,
    "communities": 11,
    "missions": 21,
    "rewards": 22
  },
  "sampleUser": {
    "id": "user_001",
    "name": "Sarah Chen",
    "email": "sarah.chen@email.com",
    "smiles": 1250,
    "level": 8,
    "score": 3200,
    "badges": ["Early Adopter", "Community Leader"],
    "communities": 5,
    "missions": 2,
    "analytics": {
      "totalMissions": 13,
      "completedMissions": 6,
      "totalSmiles": 1250,
      "totalRewards": 3,
      "impactScore": 3200
    }
  }
}
```

## 📊 Data Models

### User Model
```typescript
interface User {
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
```

### Community Model
```typescript
interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  bannerUrl: string;
  location: string;
  website: string;
  status: "active" | "featured";
  isVerified: boolean;
  createdAt: string;
  createdBy: string;
}
```

### Mission Model
```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "available" | "accepted" | "completed";
  proofRequired: boolean;
  deadline: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt: string;
  createdBy: string;
}
```

### Reward Model
```typescript
interface Reward {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  stock: number | null;
  soldCount: number;
  createdAt: string;
}
```

### Feed Post Model
```typescript
interface FeedPost {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "video" | "text";
  mediaUrl: string | null;
  challenge: string | null;
  callToAction: string[];
  links: string[];
  smiles: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
  userId: string;
  communityId: string;
}
```

## 💡 Examples

### Complete Authentication Flow

```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "bio": "Environmental activist",
    "interests": ["sustainability", "community"]
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# 3. Use access token for API calls
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# 4. Refresh token when expired
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'

# 5. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Community Management

```bash
# Get communities
curl "http://localhost:3000/api/communities?category=sustainability&page=1&pageSize=5"

# Create community
curl -X POST http://localhost:3000/api/communities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Tech for Good",
    "description": "Leveraging technology for social impact",
    "category": "technology",
    "logo": "https://logo.jpg",
    "banner": "https://banner.jpg",
    "location": "Austin, TX",
    "website": "https://techforgood.org"
  }'
```

### Mission Management

```bash
# Get missions
curl "http://localhost:3000/api/missions?type=daily&page=1&pageSize=5"

# Create mission
curl -X POST http://localhost:3000/api/missions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Tree Planting Mission",
    "description": "Plant trees in your community",
    "reward": 75,
    "proofRequired": true,
    "deadline": "2024-12-31T23:59:59Z",
    "effortLevel": "Medium",
    "requiredTime": "2 hours",
    "icon": "🌲",
    "category": "environment",
    "communityId": "comm_001"
  }'
```

## ⚡ Rate Limiting

Currently, the API does not implement rate limiting. For production deployment, consider implementing:

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Database operations**: 50 requests per minute per user

## 🚀 Deployment

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smileup_dev"

# JWT Configuration
JWT_ACCESS_SECRET="your-access-secret-key-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="production"
LOG_LEVEL="error"
```

### Production Checklist

- [ ] Configure production database
- [ ] Set secure JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Implement rate limiting
- [ ] Configure logging service
- [ ] Set up backup strategy

### Health Check

```bash
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "stats": {
    "users": 9,
    "communities": 11,
    "missions": 21,
    "rewards": 22
  }
}
```

---

**Document Generated:** August 5, 2024  
**Last Updated:** August 5, 2024  
**Version:** 1.0.0  
**Status:** ✅ Complete and Ready for Production 