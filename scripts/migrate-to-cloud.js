const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateToCloud() {
  try {
    console.log('🔄 Starting cloud database migration...\n');

    // Read backup data
    const backupFile = path.join(__dirname, '../database-backups/latest-backup.json');
    
    if (!fs.existsSync(backupFile)) {
      console.error('❌ No backup file found. Please run database backup first:');
      console.error('   node scripts/database-backup.js');
      process.exit(1);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    console.log(`📁 Loading backup from: ${backupFile}`);
    console.log(`📅 Backup timestamp: ${backupData.timestamp}`);
    console.log(`📊 Backup contains:`);
    console.log(`   - Users: ${backupData.tables.users.length}`);
    console.log(`   - Communities: ${backupData.tables.communities.length}`);
    console.log(`   - Community Wallets: ${backupData.tables.communityWallets.length}`);
    console.log(`   - Custodial Wallets: ${backupData.tables.custodialWallets.length}`);
    console.log(`   - Missions: ${backupData.tables.missions.length}`);
    console.log(`   - Rewards: ${backupData.tables.rewards.length}`);
    console.log(`   - Feed Posts: ${backupData.tables.feedPosts.length}`);

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
    console.log('✅ Existing data cleared');

    // Restore data to cloud database
    console.log('\n📦 Restoring data to cloud database...');
    
    // Restore Users
    console.log('📦 Restoring users...');
    for (const user of backupData.tables.users) {
      const { custodialWallets, communities, ...userData } = user;
      await prisma.user.create({ data: userData });
    }
    console.log(`✅ Restored ${backupData.tables.users.length} users`);

    // Restore Communities
    console.log('📦 Restoring communities...');
    for (const community of backupData.tables.communities) {
      const { members, wallet, ...communityData } = community;
      await prisma.community.create({ data: communityData });
    }
    console.log(`✅ Restored ${backupData.tables.communities.length} communities`);

    // Restore Community Members
    console.log('📦 Restoring community members...');
    for (const community of backupData.tables.communities) {
      if (community.members) {
        for (const member of community.members) {
          const { user, community: communityRef, ...memberData } = member;
          await prisma.communityMember.create({ data: memberData });
        }
      }
    }
    console.log('✅ Community members restored');

    // Restore Community Wallets
    console.log('📦 Restoring community wallets...');
    for (const wallet of backupData.tables.communityWallets) {
      await prisma.communityWallet.create({ data: wallet });
    }
    console.log(`✅ Restored ${backupData.tables.communityWallets.length} community wallets`);

    // Restore Custodial Wallets
    console.log('📦 Restoring custodial wallets...');
    for (const wallet of backupData.tables.custodialWallets) {
      await prisma.custodialWallet.create({ data: wallet });
    }
    console.log(`✅ Restored ${backupData.tables.custodialWallets.length} custodial wallets`);

    // Restore Missions
    console.log('📦 Restoring missions...');
    for (const mission of backupData.tables.missions) {
      const { users, ...missionData } = mission;
      await prisma.mission.create({ data: missionData });
    }
    console.log(`✅ Restored ${backupData.tables.missions.length} missions`);

    // Restore User Missions
    console.log('📦 Restoring user missions...');
    for (const mission of backupData.tables.missions) {
      if (mission.users) {
        for (const userMission of mission.users) {
          const { user, ...userMissionData } = userMission;
          await prisma.userMission.create({ data: userMissionData });
        }
      }
    }
    console.log('✅ User missions restored');

    // Restore Rewards
    console.log('📦 Restoring rewards...');
    for (const reward of backupData.tables.rewards) {
      const { purchases, ...rewardData } = reward;
      await prisma.reward.create({ data: rewardData });
    }
    console.log(`✅ Restored ${backupData.tables.rewards.length} rewards`);

    // Restore User Rewards
    console.log('📦 Restoring user rewards...');
    for (const reward of backupData.tables.rewards) {
      if (reward.purchases) {
        for (const userReward of reward.purchases) {
          const { user, ...userRewardData } = userReward;
          await prisma.userReward.create({ data: userRewardData });
        }
      }
    }
    console.log('✅ User rewards restored');

    // Restore Feed Posts
    console.log('📦 Restoring feed posts...');
    for (const post of backupData.tables.feedPosts) {
      const { user, community, comments, likes, ...postData } = post;
      await prisma.feedPost.create({ data: postData });
    }
    console.log(`✅ Restored ${backupData.tables.feedPosts.length} feed posts`);

    // Restore Comments
    console.log('📦 Restoring comments...');
    for (const post of backupData.tables.feedPosts) {
      if (post.comments) {
        for (const comment of post.comments) {
          const { user, ...commentData } = comment;
          await prisma.comment.create({ data: commentData });
        }
      }
    }
    console.log('✅ Comments restored');

    // Restore Likes
    console.log('📦 Restoring likes...');
    for (const post of backupData.tables.feedPosts) {
      if (post.likes) {
        for (const like of post.likes) {
          const { user, ...likeData } = like;
          await prisma.like.create({ data: likeData });
        }
      }
    }
    console.log('✅ Likes restored');

    console.log('\n✅ Cloud database migration completed successfully!');
    console.log('🌐 Your data is now in the cloud!');
    console.log('\n📊 Migration summary:');
    console.log(`   - Users: ${backupData.tables.users.length}`);
    console.log(`   - Communities: ${backupData.tables.communities.length}`);
    console.log(`   - Community Wallets: ${backupData.tables.communityWallets.length}`);
    console.log(`   - Custodial Wallets: ${backupData.tables.custodialWallets.length}`);
    console.log(`   - Missions: ${backupData.tables.missions.length}`);
    console.log(`   - Rewards: ${backupData.tables.rewards.length}`);
    console.log(`   - Feed Posts: ${backupData.tables.feedPosts.length}`);

    console.log('\n🎉 Migration completed! Your team can now:');
    console.log('   1. Update their .env.local with the cloud DATABASE_URL');
    console.log('   2. Run: npx prisma generate');
    console.log('   3. Run: npm run dev');
    console.log('   4. Access the same data from anywhere!');

  } catch (error) {
    console.error('❌ Cloud migration failed:', error);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Check your DATABASE_URL in .env.local');
    console.error('   2. Ensure your cloud database is active');
    console.error('   3. Verify network connectivity');
    console.error('   4. Check if Prisma client is generated: npx prisma generate');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateToCloud()
  .then(() => {
    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }); 