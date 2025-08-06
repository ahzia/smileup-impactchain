# UI Developer Database Setup Guide
## SmileUp ImpactChain - Database Configuration & Setup

**Created:** August 6, 2025  
**Target Audience:** UI Developers working on separate branches  
**Purpose:** Complete database setup and configuration guide  

---

## 📋 Overview

This guide helps UI developers set up the database environment for SmileUp ImpactChain, including installation, configuration, and data seeding. The guide assumes you're working on a separate branch and need to get the database running locally.

---

## 🛠️ Prerequisites

### **System Requirements**
- **Operating System**: macOS, Windows, or Linux
- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **Git**: Latest version
- **Package Manager**: npm or yarn

### **Required Software**
1. **PostgreSQL Database**
2. **Node.js & npm**
3. **Git**
4. **Code Editor** (VS Code recommended)

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Clone and Setup**
```bash
# Clone the repository
git clone <repository-url>
cd smileup-impactchain

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### **Step 2: Database Setup**
```bash
# Install PostgreSQL (if not already installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Download from https://www.postgresql.org/download/windows/

# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
# Windows: PostgreSQL service should start automatically

# Create database
createdb smileup_dev

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### **Step 3: Seed Database**
```bash
# Option A: Fresh database with demo data
node scripts/setup-fresh-database.js

# Option B: Restore from backup (if available)
node scripts/database-restore.js database-backups/latest-backup.json
```

### **Step 4: Start Development Server**
```bash
npm run dev
```

**🎉 You're ready to go!** The application should be running at `http://localhost:3000`

---

## 📊 Database Configuration

### **Environment Variables**

Create a `.env.local` file in the project root:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/smileup_dev"

# JWT Configuration
JWT_ACCESS_SECRET=smileup-access-secret-key-2024
JWT_REFRESH_SECRET=smileup-refresh-secret-key-2024

# Hedera Configuration (for wallet features)
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_SMILES_TOKEN_ID=0.0.123456

# WalletConnect Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
NEXT_PUBLIC_HEDERA_SMILES_TOKEN_ID=0.0.123456

# Wallet Encryption
WALLET_ENCRYPTION_KEY=your-wallet-encryption-key-here
```

### **Database Connection**

**Default Configuration:**
- **Host**: localhost
- **Port**: 5432
- **Database**: smileup_dev
- **Username**: Your PostgreSQL username
- **Password**: Your PostgreSQL password

**Example DATABASE_URL:**
```
postgresql://your_username:your_password@localhost:5432/smileup_dev
```

---

## 🗄️ Database Schema Overview

### **Core Tables**

#### **Users**
```sql
- id (String, Primary Key)
- email (String, Unique)
- passwordHash (String)
- name (String)
- avatarUrl (String)
- bio (String)
- interests (String[])
- smiles (Int, Default: 100)
- level (Int, Default: 1)
- score (Int, Default: 100)
- badges (String[])
- isVerified (Boolean, Default: false)
- isActive (Boolean, Default: true)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### **Communities**
```sql
- id (String, Primary Key)
- name (String)
- description (String)
- category (String)
- logoUrl (String)
- bannerUrl (String)
- location (String)
- website (String)
- status (String, Default: "active")
- isVerified (Boolean, Default: false)
- createdBy (String, User ID)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### **Wallets**
```sql
-- Custodial Wallets (Users)
- id (String, Primary Key)
- userId (String, Unique)
- accountId (String, Unique)
- publicKey (String)
- encryptedPrivateKey (String)
- hbarBalance (Float, Default: 0)
- smilesBalance (Float, Default: 0)
- isActive (Boolean, Default: true)

-- Community Wallets
- id (String, Primary Key)
- communityId (String, Unique)
- accountId (String, Unique)
- publicKey (String)
- encryptedPrivateKey (String)
- hbarBalance (Float, Default: 0)
- smilesBalance (Float, Default: 0)
- isActive (Boolean, Default: true)
```

#### **Missions & Rewards**
```sql
-- Missions
- id (String, Primary Key)
- title (String)
- description (String)
- reward (Int)
- proofRequired (Boolean)
- deadline (DateTime)
- effortLevel (String)
- requiredTime (String)
- icon (String)
- category (String)
- communityId (String)

-- Rewards
- id (String, Primary Key)
- type (String)
- title (String)
- description (String)
- validity (String)
- cost (Int)
- provider (String)
- emoji (String)
- imageUrl (String)
- communityId (String)
```

---

## 🔧 Database Management Scripts

### **Available Scripts**

#### **1. Database Backup**
```bash
# Create a backup of current database
node scripts/database-backup.js
```
**Output**: `database-backups/database-backup-YYYY-MM-DD-HH-MM-SS.json`

#### **2. Database Restore**
```bash
# Restore from specific backup
node scripts/database-restore.js path/to/backup.json

# Restore from latest backup
node scripts/database-restore.js
```

#### **3. Fresh Database Setup**
```bash
# Set up fresh database with demo data
node scripts/setup-fresh-database.js
```

### **Manual Database Operations**

#### **Reset Database**
```bash
# Clear all data and recreate schema
npx prisma db push --force-reset
npx prisma generate
```

#### **View Database**
```bash
# Open Prisma Studio (GUI for database)
npx prisma studio
```

#### **Run Migrations**
```bash
# Apply database migrations
npx prisma migrate dev

# Deploy migrations to production
npx prisma migrate deploy
```

---

## 🎯 Demo Data

### **Default Users**
After running the setup script, you'll have these demo users:

| Email | Password | Role | Level | Smiles |
|-------|----------|------|-------|--------|
| `demo@smileup.com` | `demo123` | Demo User | 5 | 1500 |
| `admin@smileup.com` | `admin123` | Admin | 10 | 3000 |
| `testuser@smileup.com` | `test123` | Test User | 2 | 500 |

### **Demo Communities**
- **Digital Learning Hub** (Education)
- **Green Tech Innovators** (Technology)
- **Local Arts Collective** (Culture)

### **Demo Content**
- **3 Users** with different roles and levels
- **3 Communities** with various categories
- **3 Missions** with different difficulty levels
- **3 Rewards** with different types and costs
- **2 Feed Posts** with media and engagement

---

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Database Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Ubuntu
sudo systemctl status postgresql

# Start PostgreSQL if not running
# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql
```

#### **2. Database Doesn't Exist**
```bash
Error: database "smileup_dev" does not exist
```
**Solution:**
```bash
# Create the database
createdb smileup_dev

# Or using psql
psql -U your_username -c "CREATE DATABASE smileup_dev;"
```

#### **3. Permission Denied**
```bash
Error: permission denied for database
```
**Solution:**
```bash
# Grant permissions to your user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE smileup_dev TO your_username;"
```

#### **4. Prisma Client Not Generated**
```bash
Error: Cannot find module '@prisma/client'
```
**Solution:**
```bash
# Generate Prisma client
npx prisma generate

# Reinstall dependencies
npm install
```

#### **5. Environment Variables Missing**
```bash
Error: DATABASE_URL is not set
```
**Solution:**
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local with your database credentials
nano .env.local
```

### **Debug Commands**

#### **Check Database Connection**
```bash
# Test database connection
npx prisma db pull

# View database schema
npx prisma db push --preview-feature
```

#### **Check Environment Variables**
```bash
# Verify environment variables are loaded
node -e "console.log(require('dotenv').config())"
```

#### **Reset Everything**
```bash
# Complete reset (nuclear option)
rm -rf node_modules
rm -rf .next
npm install
npx prisma db push --force-reset
npx prisma generate
node scripts/setup-fresh-database.js
```

---

## 📚 Additional Resources

### **Documentation**
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Next.js Docs**: https://nextjs.org/docs

### **Useful Commands**
```bash
# Database operations
npx prisma studio                    # Open database GUI
npx prisma db push                   # Push schema changes
npx prisma generate                  # Generate client
npx prisma migrate dev               # Run migrations

# Development
npm run dev                          # Start development server
npm run build                        # Build for production
npm run lint                         # Run linter
npm run test                         # Run tests

# Database scripts
node scripts/database-backup.js      # Backup database
node scripts/database-restore.js     # Restore database
node scripts/setup-fresh-database.js # Setup fresh database
```

### **Project Structure**
```
smileup-impactchain/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── src/
│   ├── generated/prisma/          # Generated Prisma client
│   ├── lib/
│   │   ├── database/              # Database utilities
│   │   └── services/              # Business logic
│   └── app/api/                   # API routes
├── scripts/
│   ├── database-backup.js         # Backup script
│   ├── database-restore.js        # Restore script
│   └── setup-fresh-database.js    # Setup script
├── database-backups/               # Backup files
└── .env.local                      # Environment variables
```

---

## 🎉 Success Checklist

After following this guide, you should have:

- ✅ **PostgreSQL** installed and running
- ✅ **Database** created and configured
- ✅ **Environment variables** set up
- ✅ **Prisma client** generated
- ✅ **Demo data** loaded
- ✅ **Development server** running
- ✅ **Application** accessible at `http://localhost:3000`

### **Test Your Setup**
1. **Visit** `http://localhost:3000`
2. **Login** with `demo@smileup.com` / `demo123`
3. **Navigate** to different pages
4. **Check** that data is loading correctly

---

## 🆘 Getting Help

### **When You Need Help**
1. **Check** this guide first
2. **Review** the troubleshooting section
3. **Search** existing issues in the repository
4. **Ask** in the team chat/forum
5. **Create** a new issue with detailed information

### **Information to Include**
- **Operating System**: macOS/Windows/Linux
- **Node.js Version**: `node --version`
- **PostgreSQL Version**: `psql --version`
- **Error Message**: Complete error text
- **Steps Taken**: What you've already tried
- **Environment**: Development/production

---

*Guide created on August 6, 2025*  
*SmileUp ImpactChain Development Team* 