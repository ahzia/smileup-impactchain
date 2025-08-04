# SmileUp ImpactChain — Real API Migration Guide

**Generated:** March 16, 2024  
**Version:** 1.0  
**Target:** Production-Ready APIs

---

## 🎯 Migration Overview

This guide outlines the step-by-step process to convert the mock APIs to production-ready, database-backed APIs. The migration maintains the same interface while adding real persistence, security, and scalability.

### Migration Goals:
- ✅ **Maintain API compatibility** with existing frontend
- ✅ **Add real database persistence** with proper relationships
- ✅ **Implement proper authentication** with JWT tokens
- ✅ **Add security measures** (input validation, rate limiting)
- ✅ **Optimize performance** with caching and indexing
- ✅ **Add real-time features** with WebSocket support

---

## 🗄️ Database Design

### Recommended Database: PostgreSQL with Prisma ORM

#### Core Tables Structure:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[],
  smiles INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  score INTEGER DEFAULT 100,
  badges TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Community memberships
CREATE TABLE community_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);

-- Feed posts
CREATE TABLE feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(50) NOT NULL,
  media_url TEXT,
  challenge TEXT,
  call_to_action TEXT[],
  links TEXT[],
  smiles INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  community_id UUID REFERENCES communities(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Missions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  proof_required BOOLEAN DEFAULT false,
  deadline TIMESTAMP,
  steps INTEGER DEFAULT 1,
  effort_level VARCHAR(50),
  required_time VARCHAR(100),
  icon VARCHAR(10),
  category VARCHAR(100),
  community_id UUID REFERENCES communities(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User mission progress
CREATE TABLE user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'accepted',
  progress VARCHAR(50) DEFAULT 'Not Started',
  current_step INTEGER DEFAULT 0,
  proof_type VARCHAR(50),
  proof_url TEXT,
  proof_text TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Rewards
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL,
  validity VARCHAR(255),
  cost INTEGER NOT NULL,
  provider VARCHAR(255),
  emoji VARCHAR(10),
  image_url TEXT,
  community_id UUID REFERENCES communities(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User rewards (purchased)
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP DEFAULT NOW(),
  redeemed_at TIMESTAMP,
  UNIQUE(user_id, reward_id)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  deadline TIMESTAMP,
  requirements TEXT[],
  steps INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User challenge progress
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  progress VARCHAR(50) DEFAULT 'Not Started',
  current_step INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- User activities (for recent activity feed)
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments on feed posts
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Likes on feed posts
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Donations to feed posts
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication & Security

### 1. **JWT Implementation**

```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class JWTService {
  private static readonly SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly EXPIRES_IN = '7d';

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, this.SECRET, { expiresIn: this.EXPIRES_IN });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, this.SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### 2. **Authentication Middleware**

```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '../auth/jwt';

export async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401 };
  }

  const token = authHeader.substring(7);
  const payload = JWTService.verifyToken(token);
  
  if (!payload) {
    return { error: 'Invalid or expired token', status: 401 };
  }

  return { userId: payload.userId };
}
```

### 3. **Rate Limiting**

```typescript
// lib/middleware/rateLimit.ts
import { NextRequest } from 'next/server';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function rateLimit(
  request: NextRequest,
  key: string,
  limit: number,
  window: number
): Promise<boolean> {
  const ip = request.ip || 'unknown';
  const rateKey = `rate_limit:${key}:${ip}`;
  
  const current = await redis.incr(rateKey);
  if (current === 1) {
    await redis.expire(rateKey, window);
  }
  
  return current <= limit;
}
```

---

## 🗄️ Database Integration

### 1. **Prisma Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String
  name              String
  avatarUrl         String?
  bio               String?
  interests         String[]
  smiles            Int      @default(100)
  level             Int      @default(1)
  score             Int      @default(100)
  badges            String[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  communities       CommunityMembership[]
  createdCommunities Community[] @relation("CommunityCreator")
  feedPosts         FeedPost[]
  missions          UserMission[]
  rewards           UserReward[]
  challenges        UserChallenge[]
  activities        UserActivity[]
  comments          Comment[]
  likes             Like[]
  donations         Donation[]

  @@map("users")
}

model Community {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String
  logoUrl     String?
  bannerUrl   String?
  location    String?
  website     String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  createdBy   User     @relation("CommunityCreator", fields: [createdById], references: [id])
  createdById String
  members     CommunityMembership[]
  feedPosts   FeedPost[]
  missions    Mission[]
  rewards     Reward[]

  @@map("communities")
}

model CommunityMembership {
  id          String   @id @default(cuid())
  role        String   @default("member")
  joinedAt    DateTime @default(now())

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  communityId String

  @@unique([userId, communityId])
  @@map("community_memberships")
}

// ... Additional models for FeedPost, Mission, Reward, etc.
```

### 2. **Database Service Layer**

```typescript
// lib/services/databaseService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseService {
  // User operations
  static async createUser(userData: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: userData
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async updateUserSmiles(userId: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        smiles: { increment: amount },
        level: { increment: Math.floor(amount / 100) }
      }
    });
  }

  // Community operations
  static async createCommunity(communityData: CreateCommunityData): Promise<Community> {
    return prisma.community.create({
      data: communityData,
      include: {
        createdBy: true
      }
    });
  }

  static async joinCommunity(userId: string, communityId: string): Promise<CommunityMembership> {
    return prisma.communityMembership.create({
      data: {
        userId,
        communityId
      },
      include: {
        community: true,
        user: true
      }
    });
  }

  // ... Additional database operations
}
```

---

## 🔄 Migration Steps

### Phase 1: Database Setup (Week 1)

1. **Install Dependencies**
   ```bash
   npm install @prisma/client bcryptjs jsonwebtoken
   npm install -D prisma
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Create Database Schema**
   - Copy the Prisma schema above
   - Run `npx prisma generate`
   - Run `npx prisma db push`

4. **Seed Database**
   ```bash
   npx prisma db seed
   ```

### Phase 2: Authentication Migration (Week 2)

1. **Update AuthService**
   - Replace mock token generation with real JWT
   - Add password hashing with bcrypt
   - Implement proper session management

2. **Add Authentication Middleware**
   - Create middleware for protected routes
   - Add rate limiting
   - Implement proper error handling

3. **Update API Routes**
   - Replace mock authentication with real JWT validation
   - Add proper error responses
   - Implement user session management

### Phase 3: Service Layer Migration (Week 3)

1. **Update AuthService**
   ```typescript
   // Replace mock data with database calls
   static async login(credentials: LoginRequest): Promise<LoginResponse> {
     const user = await DatabaseService.findUserByEmail(credentials.email);
     if (!user) throw new Error('User not found');
     
     const isValidPassword = await JWTService.comparePassword(
       credentials.password, 
       user.passwordHash
     );
     if (!isValidPassword) throw new Error('Invalid credentials');
     
     const token = JWTService.generateToken(user.id);
     return { token, user };
   }
   ```

2. **Update CommunityService**
   ```typescript
   // Replace mock arrays with database queries
   static async getCommunities(query: CommunitiesQuery): Promise<Community[]> {
     return DatabaseService.findCommunities(query);
   }
   ```

3. **Update Other Services**
   - FeedService with real database operations
   - MissionService with proper progress tracking
   - RewardService with transaction support
   - ChallengeService with real-time updates

### Phase 4: Advanced Features (Week 4)

1. **Add Real-time Features**
   ```typescript
   // lib/websocket/websocketService.ts
   import { Server } from 'socket.io';
   
   export class WebSocketService {
     static initialize(server: any) {
       const io = new Server(server);
       
       io.on('connection', (socket) => {
         socket.on('join-community', (communityId) => {
           socket.join(`community-${communityId}`);
         });
         
         socket.on('new-post', (data) => {
           io.to(`community-${data.communityId}`).emit('post-created', data);
         });
       });
     }
   }
   ```

2. **Add Caching Layer**
   ```typescript
   // lib/cache/redisService.ts
   import Redis from 'ioredis';
   
   export class RedisService {
     private static redis = new Redis(process.env.REDIS_URL);
     
     static async cache(key: string, data: any, ttl: number = 3600) {
       await this.redis.setex(key, ttl, JSON.stringify(data));
     }
     
     static async get(key: string) {
       const data = await this.redis.get(key);
       return data ? JSON.parse(data) : null;
     }
   }
   ```

3. **Add File Upload**
   ```typescript
   // lib/upload/fileUploadService.ts
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   
   export class FileUploadService {
     private static s3 = new S3Client({
       region: process.env.AWS_REGION,
       credentials: {
         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
       }
     });
     
     static async uploadFile(file: Buffer, key: string): Promise<string> {
       await this.s3.send(new PutObjectCommand({
         Bucket: process.env.AWS_S3_BUCKET,
         Key: key,
         Body: file,
         ContentType: 'image/jpeg'
       }));
       
       return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
     }
   }
   ```

---

## 🚀 Performance Optimizations

### 1. **Database Indexing**

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_smiles ON users(smiles DESC);
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_communities_status ON communities(status);
CREATE INDEX idx_feed_posts_community ON feed_posts(community_id);
CREATE INDEX idx_feed_posts_created_at ON feed_posts(created_at DESC);
CREATE INDEX idx_missions_community ON missions(community_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_user_missions_user ON user_missions(user_id);
CREATE INDEX idx_user_missions_status ON user_missions(status);
```

### 2. **Caching Strategy**

```typescript
// lib/cache/cacheService.ts
export class CacheService {
  static async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = await RedisService.get(key);
    if (cached) return cached;
    
    const data = await fetcher();
    await RedisService.cache(key, data);
    return data;
  }
}
```

### 3. **Pagination Optimization**

```typescript
// lib/services/paginationService.ts
export class PaginationService {
  static async paginate<T>(
    query: any,
    page: number,
    pageSize: number
  ): Promise<{ data: T[], total: number, hasMore: boolean }> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    
    const [data, total] = await Promise.all([
      query.skip(skip).take(take),
      query.count()
    ]);
    
    return {
      data,
      total,
      hasMore: skip + take < total
    };
  }
}
```

---

## 🔒 Security Measures

### 1. **Input Validation**

```typescript
// lib/validation/validationService.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  bio: z.string().optional(),
  interests: z.array(z.string()).optional()
});

export class ValidationService {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }
}
```

### 2. **Rate Limiting**

```typescript
// lib/middleware/rateLimit.ts
export const rateLimitConfig = {
  login: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
  register: { limit: 3, window: 3600 }, // 3 attempts per hour
  api: { limit: 100, window: 60 } // 100 requests per minute
};
```

### 3. **SQL Injection Prevention**

```typescript
// Use Prisma ORM for all database queries
// Prisma automatically prevents SQL injection
const users = await prisma.user.findMany({
  where: {
    email: { contains: searchTerm }
  }
});
```

---

## 📊 Monitoring & Logging

### 1. **Application Logging**

```typescript
// lib/logging/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. **Performance Monitoring**

```typescript
// lib/monitoring/performanceMonitor.ts
export class PerformanceMonitor {
  static async measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      logger.info(`Performance: ${name} took ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`Performance: ${name} failed after ${duration}ms`, error);
      throw error;
    }
  }
}
```

---

## 🧪 Testing Strategy

### 1. **Unit Tests**

```typescript
// __tests__/services/authService.test.ts
import { AuthService } from '@/lib/services/authService';

describe('AuthService', () => {
  test('should register new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const result = await AuthService.register(userData);
    expect(result.user.email).toBe(userData.email);
    expect(result.token).toBeDefined();
  });
});
```

### 2. **Integration Tests**

```typescript
// __tests__/api/auth.test.ts
import { createMocks } from 'node-mocks-http';
import loginHandler from '@/app/api/auth/login/route';

describe('/api/auth/login', () => {
  test('should login with valid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    await loginHandler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

---

## 📋 Migration Checklist

### Phase 1: Database Setup
- [ ] Install Prisma and database dependencies
- [ ] Create database schema
- [ ] Set up database connection
- [ ] Create database seed script
- [ ] Test database connectivity

### Phase 2: Authentication
- [ ] Implement JWT token generation
- [ ] Add password hashing with bcrypt
- [ ] Create authentication middleware
- [ ] Update login/register endpoints
- [ ] Test authentication flow

### Phase 3: Service Migration
- [ ] Update AuthService with database calls
- [ ] Update CommunityService with database calls
- [ ] Update FeedService with database calls
- [ ] Update MissionService with database calls
- [ ] Update RewardService with database calls
- [ ] Update ChallengeService with database calls

### Phase 4: Advanced Features
- [ ] Add WebSocket support for real-time features
- [ ] Implement Redis caching
- [ ] Add file upload functionality
- [ ] Set up monitoring and logging
- [ ] Add comprehensive testing

### Phase 5: Production Deployment
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up backup and recovery procedures

---

## 🎯 Success Metrics

### Performance Targets
- **API Response Time:** < 200ms for 95% of requests
- **Database Query Time:** < 50ms for simple queries
- **Authentication Time:** < 100ms for login/register
- **Cache Hit Rate:** > 80% for frequently accessed data

### Security Targets
- **Zero SQL Injection:** All queries use Prisma ORM
- **Rate Limiting:** Prevent abuse on all endpoints
- **Input Validation:** 100% of user inputs validated
- **Authentication:** Secure JWT tokens with proper expiration

### Scalability Targets
- **Concurrent Users:** Support 10,000+ concurrent users
- **Database Connections:** Efficient connection pooling
- **Caching Strategy:** Reduce database load by 60%
- **Real-time Features:** WebSocket support for live updates

---

**Migration Guide Generated:** March 16, 2024  
**Estimated Timeline:** 4-6 weeks  
**Next Review:** After Phase 1 completion  
**Status:** Ready for implementation 