# Database Management Scripts

This directory contains scripts for managing the SmileUp ImpactChain database, including backup, restore, and setup operations.

## 📁 Available Scripts

### 1. `database-backup.js`
Creates a complete backup of the current database state.

**Usage:**
```bash
node scripts/database-backup.js
```

**Output:**
- Creates a timestamped backup file in `database-backups/`
- Also creates a `latest-backup.json` for easy access
- Includes all tables: users, communities, wallets, missions, rewards, feed posts

**Example Output:**
```
✅ Database backup completed successfully!
📁 Backup saved to: database-backups/database-backup-2025-08-06T18-47-06-933Z.json
📊 Backup summary:
   - Users: 12
   - Communities: 14
   - Community Wallets: 11
   - Custodial Wallets: 3
   - Missions: 21
   - Rewards: 22
   - Feed Posts: 14
```

### 2. `database-restore.js`
Restores database from a backup file.

**Usage:**
```bash
# Restore from specific backup
node scripts/database-restore.js path/to/backup.json

# Restore from latest backup
node scripts/database-restore.js
```

**Features:**
- Clears existing data before restore
- Restores all tables in correct order
- Maintains relationships between entities
- Provides detailed progress feedback

### 3. `setup-fresh-database.js`
Sets up a fresh database with demo data for new developers.

**Usage:**
```bash
node scripts/setup-fresh-database.js
```

**Creates:**
- 3 demo users with different roles
- 3 demo communities
- 3 demo missions
- 3 demo rewards
- 2 demo feed posts
- All necessary relationships

**Demo Credentials:**
- `demo@smileup.com` / `demo123`
- `admin@smileup.com` / `admin123`
- `testuser@smileup.com` / `test123`

## 🔄 Workflow for Team Development

### **Scenario 1: Sharing Database State**
```bash
# Developer A: Create backup
node scripts/database-backup.js

# Commit and push backup file
git add database-backups/
git commit -m "Add database backup with latest data"
git push

# Developer B: Pull and restore
git pull
node scripts/database-restore.js
```

### **Scenario 2: New Developer Setup**
```bash
# Clone repository
git clone <repository-url>
cd smileup-impactchain

# Setup database
npm install
npx prisma db push
npx prisma generate

# Option A: Fresh database with demo data
node scripts/setup-fresh-database.js

# Option B: Restore from team backup
node scripts/database-restore.js database-backups/latest-backup.json
```

### **Scenario 3: Regular Database Maintenance**
```bash
# Create backup before major changes
node scripts/database-backup.js

# Make changes to database
# ... your changes ...

# If something goes wrong, restore
node scripts/database-restore.js database-backups/latest-backup.json
```

## 📊 Backup File Structure

The backup files are JSON files with the following structure:

```json
{
  "timestamp": "2025-08-06T18:47:06.933Z",
  "version": "1.0",
  "tables": {
    "users": [...],
    "communities": [...],
    "communityWallets": [...],
    "custodialWallets": [...],
    "missions": [...],
    "rewards": [...],
    "feedPosts": [...]
  }
}
```

## 🛠️ Prerequisites

Before running these scripts, ensure:

1. **Database is running**: PostgreSQL service is active
2. **Environment is set**: `.env.local` has correct `DATABASE_URL`
3. **Prisma client is generated**: `npx prisma generate`
4. **Dependencies are installed**: `npm install`

## 🔍 Troubleshooting

### **Common Issues**

#### **Script fails with "Cannot find module"**
```bash
# Regenerate Prisma client
npx prisma generate

# Reinstall dependencies
npm install
```

#### **Database connection error**
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Ubuntu
sudo systemctl status postgresql
```

#### **Permission denied**
```bash
# Ensure your user has database access
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE smileup_dev TO your_username;"
```

## 📝 Notes

- **Backup files** are stored in `database-backups/` directory
- **Latest backup** is always available as `database-backups/latest-backup.json`
- **Restore operations** clear existing data before restoring
- **Demo data** includes realistic test scenarios
- **Scripts are idempotent** - safe to run multiple times

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your database connection
3. Ensure all prerequisites are met
4. Check the console output for specific error messages
5. Contact the development team with error details 