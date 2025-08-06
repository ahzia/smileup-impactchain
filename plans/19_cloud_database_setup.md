# Cloud Database Setup Guide
## Free Cloud Database Options for SmileUp ImpactChain

**Created:** August 6, 2025  
**Purpose:** Set up free cloud database with current data  
**Options:** Supabase, PlanetScale, Neon, Railway  

---

## 🎯 **Recommended: Supabase (PostgreSQL)**

### **Why Supabase?**
- ✅ **Free tier**: 500MB database, 50MB bandwidth
- ✅ **PostgreSQL**: Same as your current setup
- ✅ **Easy migration**: Direct PostgreSQL compatibility
- ✅ **Real-time features**: Built-in subscriptions
- ✅ **Dashboard**: Web interface for database management
- ✅ **API generation**: Automatic REST API

### **Step 1: Create Supabase Account**
1. **Visit**: https://supabase.com
2. **Sign up** with GitHub/Google
3. **Create new project**
4. **Choose region** (closest to your team)
5. **Set database password** (save this!)

### **Step 2: Get Connection Details**
```bash
# From Supabase Dashboard → Settings → Database
# You'll get these details:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### **Step 3: Update Environment Variables**
```env
# .env.local
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Keep other variables the same
JWT_ACCESS_SECRET=smileup-access-secret-key-2024
JWT_REFRESH_SECRET=smileup-refresh-secret-key-2024
HEDERA_NETWORK=testnet
# ... rest of your variables
```

### **Step 4: Deploy Schema**
```bash
# Push schema to cloud database
npx prisma db push

# Generate client
npx prisma generate
```

### **Step 5: Migrate Data**
```bash
# Create backup of current data
node scripts/database-backup.js

# Restore to cloud database
node scripts/database-restore.js database-backups/latest-backup.json
```

---

## 🚀 **Alternative: PlanetScale (MySQL)**

### **Why PlanetScale?**
- ✅ **Free tier**: 1GB database, 1 billion reads/month
- ✅ **MySQL**: Slightly different but very reliable
- ✅ **Branching**: Git-like database branching
- ✅ **Automatic scaling**: No manual scaling needed

### **Step 1: Create PlanetScale Account**
1. **Visit**: https://planetscale.com
2. **Sign up** with GitHub
3. **Create new database**
4. **Choose region** (closest to your team)

### **Step 2: Get Connection Details**
```bash
# From PlanetScale Dashboard → Connect
# You'll get these details:
DATABASE_URL="mysql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]"
```

### **Step 3: Update Prisma Schema**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### **Step 4: Deploy Schema**
```bash
# Push schema to cloud database
npx prisma db push

# Generate client
npx prisma generate
```

---

## 🔧 **Migration Script for Cloud Database**

### **Create Migration Script**
```javascript
// scripts/migrate-to-cloud.js
const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateToCloud() {
  try {
    console.log('🔄 Starting cloud database migration...\n');

    // Read backup data
    const backupFile = path.join(__dirname, '../database-backups/latest-backup.json');
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    console.log(`📁 Loading backup from: ${backupFile}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - Users: ${backupData.tables.users.length}`);
    console.log(`   - Communities: ${backupData.tables.communities.length}`);
    console.log(`   - Missions: ${backupData.tables.missions.length}`);
    console.log(`   - Rewards: ${backupData.tables.rewards.length}`);

    // Clear existing data (if any)
    console.log('\n🗑️ Clearing existing data...');
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.feedPost.deleteMany();
    await prisma.userReward.deleteMany();
    await prisma.reward.deleteMany();
    await prisma.userMission.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.communityWallet.deleteMany();
    await prisma.custodialWallet.deleteMany();
    await prisma.communityMember.deleteMany();
    await prisma.community.deleteMany();
    await prisma.user.deleteMany();

    // Restore data to cloud database
    console.log('\n📦 Restoring data to cloud database...');
    
    // Restore Users
    for (const user of backupData.tables.users) {
      const { custodialWallets, communities, ...userData } = user;
      await prisma.user.create({ data: userData });
    }
    console.log(`✅ Restored ${backupData.tables.users.length} users`);

    // Restore Communities
    for (const community of backupData.tables.communities) {
      const { members, wallet, ...communityData } = community;
      await prisma.community.create({ data: communityData });
    }
    console.log(`✅ Restored ${backupData.tables.communities.length} communities`);

    // Restore other tables...
    // (Similar to database-restore.js)

    console.log('\n✅ Cloud database migration completed successfully!');
    console.log('🌐 Your data is now in the cloud!');

  } catch (error) {
    console.error('❌ Cloud migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToCloud()
  .then(() => {
    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
```

---

## 📊 **Free Tier Comparison**

| **Provider** | **Free Tier** | **Database Type** | **Ease of Setup** | **Migration Effort** |
|--------------|---------------|-------------------|-------------------|---------------------|
| **Supabase** | 500MB, 50MB bandwidth | PostgreSQL | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **PlanetScale** | 1GB, 1B reads/month | MySQL | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Neon** | 3GB, 0.5 compute | PostgreSQL | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Railway** | $5 credit/month | PostgreSQL | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎯 **Recommended Approach: Supabase**

### **Step-by-Step Setup**

#### **1. Create Supabase Project**
```bash
# 1. Go to https://supabase.com
# 2. Sign up with GitHub
# 3. Create new project
# 4. Choose region (US East, Europe, etc.)
# 5. Set database password
```

#### **2. Get Connection String**
```bash
# From Supabase Dashboard → Settings → Database
# Copy the connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

#### **3. Update Environment**
```bash
# Edit .env.local
nano .env.local

# Replace DATABASE_URL with Supabase connection string
```

#### **4. Deploy Schema**
```bash
# Push schema to cloud
npx prisma db push

# Generate client
npx prisma generate
```

#### **5. Migrate Data**
```bash
# Create backup
node scripts/database-backup.js

# Migrate to cloud
node scripts/migrate-to-cloud.js
```

#### **6. Test Connection**
```bash
# Test cloud database
npx prisma studio

# Start development server
npm run dev
```

---

## 🔄 **Team Workflow with Cloud Database**

### **For All Developers**
```bash
# 1. Update .env.local with cloud DATABASE_URL
# 2. Pull latest changes
git pull

# 3. Generate Prisma client
npx prisma generate

# 4. Start development
npm run dev
```

### **For Data Updates**
```bash
# Mac developer updates data
node scripts/database-backup.js
node scripts/migrate-to-cloud.js

# All developers get updates automatically
# No need to sync local databases
```

---

## 🛠️ **Cloud Database Scripts**

### **Add to package.json**
```json
{
  "scripts": {
    "db:cloud:migrate": "node scripts/migrate-to-cloud.js",
    "db:cloud:backup": "node scripts/backup-to-cloud.js",
    "db:cloud:studio": "npx prisma studio"
  }
}
```

### **Usage**
```bash
# Migrate local data to cloud
npm run db:cloud:migrate

# Open cloud database in browser
npm run db:cloud:studio
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Connection Timeout**
```bash
# Check if DATABASE_URL is correct
# Verify network connectivity
# Check if database is active in cloud dashboard
```

#### **2. SSL Issues**
```bash
# Add SSL parameters to DATABASE_URL
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

#### **3. Schema Mismatch**
```bash
# Reset cloud database
npx prisma db push --force-reset

# Regenerate client
npx prisma generate
```

---

## 🎉 **Benefits of Cloud Database**

### **For Team Development**
- ✅ **No local setup** required for new developers
- ✅ **Shared data** across all team members
- ✅ **Real-time updates** for all developers
- ✅ **No sync issues** between platforms
- ✅ **Backup and recovery** handled by cloud provider

### **For Production**
- ✅ **Scalable** as your app grows
- ✅ **Reliable** with 99.9% uptime
- ✅ **Secure** with built-in security features
- ✅ **Cost-effective** with free tiers
- ✅ **Easy deployment** to production

---

## 📋 **Quick Start Commands**

### **Supabase Setup (Recommended)**
```bash
# 1. Create Supabase account and project
# 2. Get connection string from dashboard
# 3. Update .env.local with cloud DATABASE_URL
# 4. Deploy schema
npx prisma db push
npx prisma generate

# 5. Migrate data
node scripts/database-backup.js
node scripts/migrate-to-cloud.js

# 6. Test
npm run dev
```

---

*Cloud Database Setup Guide created on August 6, 2025*  
*SmileUp ImpactChain Development Team* 