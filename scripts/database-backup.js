const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('🔄 Starting database backup...\n');

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {}
    };

    // Backup Users
    console.log('📦 Backing up users...');
    const users = await prisma.user.findMany({
      include: {
        custodialWallets: true,
        communities: {
          include: {
            community: true
          }
        }
      }
    });
    backupData.tables.users = users;
    console.log(`✅ Backed up ${users.length} users`);

    // Backup Communities
    console.log('📦 Backing up communities...');
    const communities = await prisma.community.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        wallet: true
      }
    });
    backupData.tables.communities = communities;
    console.log(`✅ Backed up ${communities.length} communities`);

    // Backup Community Wallets
    console.log('📦 Backing up community wallets...');
    const communityWallets = await prisma.communityWallet.findMany();
    backupData.tables.communityWallets = communityWallets;
    console.log(`✅ Backed up ${communityWallets.length} community wallets`);

    // Backup Custodial Wallets
    console.log('📦 Backing up custodial wallets...');
    const custodialWallets = await prisma.custodialWallet.findMany();
    backupData.tables.custodialWallets = custodialWallets;
    console.log(`✅ Backed up ${custodialWallets.length} custodial wallets`);

    // Backup Missions
    console.log('📦 Backing up missions...');
    const missions = await prisma.mission.findMany({
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    backupData.tables.missions = missions;
    console.log(`✅ Backed up ${missions.length} missions`);

    // Backup Rewards
    console.log('📦 Backing up rewards...');
    const rewards = await prisma.reward.findMany({
      include: {
        purchases: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    backupData.tables.rewards = rewards;
    console.log(`✅ Backed up ${rewards.length} rewards`);

    // Backup Feed Posts
    console.log('📦 Backing up feed posts...');
    const feedPosts = await prisma.feedPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    backupData.tables.feedPosts = feedPosts;
    console.log(`✅ Backed up ${feedPosts.length} feed posts`);

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../database-backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `database-backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);

    // Write backup to file
    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

    console.log(`\n✅ Database backup completed successfully!`);
    console.log(`📁 Backup saved to: ${filepath}`);
    console.log(`📊 Backup summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Communities: ${communities.length}`);
    console.log(`   - Community Wallets: ${communityWallets.length}`);
    console.log(`   - Custodial Wallets: ${custodialWallets.length}`);
    console.log(`   - Missions: ${missions.length}`);
    console.log(`   - Rewards: ${rewards.length}`);
    console.log(`   - Feed Posts: ${feedPosts.length}`);

    // Create a latest backup symlink
    const latestBackupPath = path.join(backupDir, 'latest-backup.json');
    fs.writeFileSync(latestBackupPath, JSON.stringify(backupData, null, 2));
    console.log(`🔗 Latest backup link: ${latestBackupPath}`);

  } catch (error) {
    console.error('❌ Database backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the backup
backupDatabase()
  .then(() => {
    console.log('\n✨ Backup script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Backup script failed:', error);
    process.exit(1);
  }); 