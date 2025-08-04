# SmileUp ImpactChain — Environment Setup Guide

**Generated:** March 16, 2024  
**Version:** 1.0  
**Purpose:** Development and Production Environment Configuration

---

## 🎯 Environment Overview

This guide provides step-by-step instructions for setting up development and production environments for the SmileUp ImpactChain project. It covers all necessary services, configurations, and dependencies.

### Environment Types:
- 🖥️ **Development** - Local development with mock APIs
- 🧪 **Staging** - Pre-production testing environment
- 🚀 **Production** - Live application environment

---

## 🛠️ Development Environment Setup

### 1. **Prerequisites**

#### Required Software:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git** (v2.30.0 or higher)
- **VS Code** (recommended editor)

#### Optional Software:
- **PostgreSQL** (v14 or higher) - for local database testing
- **Redis** (v6.0 or higher) - for caching and rate limiting
- **Docker** (v20.0 or higher) - for containerized development

### 2. **Project Setup**

```bash
# Clone the repository
git clone <repository-url>
cd smileup-impactchain

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 3. **Environment Variables**

Create `.env.local` file:

```env
# Application
NODE_ENV=development
PORT=3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret-key

# Database (for future migration)
DATABASE_URL="postgresql://username:password@localhost:5432/smileup_dev"

# Authentication
JWT_SECRET=your-jwt-secret-key-development
JWT_EXPIRES_IN=7d

# Redis (for caching and rate limiting)
REDIS_URL=redis://localhost:6379

# File Upload (AWS S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=smileup-dev-uploads

# External Services
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development Features
ENABLE_MOCK_APIS=true
ENABLE_LOGGING=true
ENABLE_RATE_LIMITING=false
```

### 4. **Development Scripts**

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "mock:start": "ENABLE_MOCK_APIS=true npm run dev",
    "mock:stop": "pkill -f 'ENABLE_MOCK_APIS'"
  }
}
```

### 5. **Database Setup (Optional for Development)**

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb smileup_dev

# Install Prisma CLI
npm install -g prisma

# Initialize Prisma (when ready for database migration)
npx prisma init

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with mock data
npx prisma db seed
```

### 6. **Redis Setup (Optional for Development)**

```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Test Redis connection
redis-cli ping
```

---

## 🧪 Staging Environment Setup

### 1. **Infrastructure Requirements**

#### Cloud Services:
- **Vercel** or **Netlify** - for hosting
- **Supabase** or **PlanetScale** - for database
- **Upstash Redis** - for caching
- **AWS S3** - for file storage

### 2. **Environment Variables**

```env
# Application
NODE_ENV=staging
NEXTAUTH_URL=https://staging.smileup-impactchain.com
NEXTAUTH_SECRET=your-staging-secret-key

# Database
DATABASE_URL="postgresql://username:password@host:5432/smileup_staging"

# Authentication
JWT_SECRET=your-jwt-secret-key-staging
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://username:password@host:port

# File Upload
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-staging-access-key
AWS_SECRET_ACCESS_KEY=your-staging-secret-key
AWS_S3_BUCKET=smileup-staging-uploads

# External Services
NEXT_PUBLIC_API_URL=https://staging.smileup-impactchain.com/api
NEXT_PUBLIC_APP_URL=https://staging.smileup-impactchain.com

# Staging Features
ENABLE_MOCK_APIS=false
ENABLE_LOGGING=true
ENABLE_RATE_LIMITING=true
ENABLE_MONITORING=true
```

### 3. **Deployment Configuration**

#### Vercel Configuration (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "staging",
    "ENABLE_MOCK_APIS": "false"
  }
}
```

---

## 🚀 Production Environment Setup

### 1. **Infrastructure Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN (CloudFlare) │    │   Monitoring    │
│   (Nginx/AWS)   │    │                 │    │   (DataDog)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   File Storage  │    │   Logging       │
│   (Vercel)      │    │   (AWS S3)      │    │   (Winston)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Cache         │    │   Analytics     │
│   (PostgreSQL)  │    │   (Redis)       │    │   (Google Analytics)
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. **Environment Variables**

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://smileup-impactchain.com
NEXTAUTH_SECRET=your-production-secret-key

# Database
DATABASE_URL="postgresql://username:password@host:5432/smileup_prod"

# Authentication
JWT_SECRET=your-jwt-secret-key-production
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://username:password@host:port

# File Upload
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-production-access-key
AWS_SECRET_ACCESS_KEY=your-production-secret-key
AWS_S3_BUCKET=smileup-prod-uploads

# External Services
NEXT_PUBLIC_API_URL=https://smileup-impactchain.com/api
NEXT_PUBLIC_APP_URL=https://smileup-impactchain.com

# Production Features
ENABLE_MOCK_APIS=false
ENABLE_LOGGING=true
ENABLE_RATE_LIMITING=true
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_CDN=true
```

### 3. **Security Configuration**

#### SSL/TLS:
```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name smileup-impactchain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Rate Limiting:
```typescript
// lib/middleware/rateLimit.ts
export const productionRateLimits = {
  login: { limit: 5, window: 300 }, // 5 attempts per 5 minutes
  register: { limit: 3, window: 3600 }, // 3 attempts per hour
  api: { limit: 1000, window: 3600 }, // 1000 requests per hour
  upload: { limit: 10, window: 3600 }, // 10 uploads per hour
  donation: { limit: 50, window: 3600 } // 50 donations per hour
};
```

---

## 🔧 Service Configuration

### 1. **Database Configuration**

#### PostgreSQL Setup:
```sql
-- Create production database
CREATE DATABASE smileup_prod;

-- Create application user
CREATE USER smileup_app WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE smileup_prod TO smileup_app;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

#### Connection Pooling:
```typescript
// lib/database/connection.ts
import { Pool } from 'pg';

export const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. **Redis Configuration**

#### Redis Setup:
```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Key configurations:
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### Redis Connection:
```typescript
// lib/cache/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});
```

### 3. **File Storage Configuration**

#### AWS S3 Setup:
```typescript
// lib/storage/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// S3 bucket policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::smileup-prod-uploads/*"
    }
  ]
}
```

---

## 📊 Monitoring & Logging

### 1. **Application Monitoring**

#### Winston Logger Configuration:
```typescript
// lib/logging/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'smileup-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

#### Performance Monitoring:
```typescript
// lib/monitoring/performance.ts
export class PerformanceMonitor {
  static async measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      
      logger.info('Performance', {
        operation: name,
        duration,
        success: true
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      logger.error('Performance Error', {
        operation: name,
        duration,
        error: error.message,
        success: false
      });
      
      throw error;
    }
  }
}
```

### 2. **Health Checks**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/cache/redis';
import { dbPool } from '@/lib/database/connection';

export async function GET() {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Check database
    await dbPool.query('SELECT 1');
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check Redis
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  const isHealthy = checks.database && checks.redis;

  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks,
    uptime: process.uptime()
  }, {
    status: isHealthy ? 200 : 503
  });
}
```

---

## 🧪 Testing Environment

### 1. **Test Database Setup**

```bash
# Create test database
createdb smileup_test

# Set test environment variables
export DATABASE_URL="postgresql://username:password@localhost:5432/smileup_test"
export NODE_ENV=test
export JWT_SECRET=test-jwt-secret
```

### 2. **Jest Configuration**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 3. **Test Utilities**

```typescript
// lib/test/testUtils.ts
import { PrismaClient } from '@prisma/client';

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL
    }
  }
});

export async function cleanTestDatabase() {
  const tables = await testPrisma.$queryRaw`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
  `;
  
  for (const table of tables) {
    await testPrisma.$executeRaw`TRUNCATE TABLE "${table.tablename}" CASCADE`;
  }
}

export async function createTestUser() {
  return testPrisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      name: 'Test User'
    }
  });
}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring tools configured
- [ ] Backup procedures tested

### Post-Deployment:
- [ ] Health checks passing
- [ ] Performance metrics within targets
- [ ] Error rates monitored
- [ ] User acceptance testing completed
- [ ] Rollback plan prepared

---

## 🔄 Environment Migration Steps

### Development → Staging:
1. **Code Review** - All changes reviewed and approved
2. **Testing** - Comprehensive testing completed
3. **Database Migration** - Schema changes applied
4. **Deployment** - Staging environment updated
5. **Validation** - Staging environment tested

### Staging → Production:
1. **Final Testing** - Staging environment validated
2. **Database Backup** - Production database backed up
3. **Deployment** - Production environment updated
4. **Monitoring** - Production metrics monitored
5. **Validation** - Production environment tested

---

**Environment Setup Guide Generated:** March 16, 2024  
**Next Review:** Before production deployment  
**Status:** Ready for implementation 