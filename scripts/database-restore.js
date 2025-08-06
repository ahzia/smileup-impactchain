const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase(backupFile) {
  try {
    console.log('🔄 Starting database restore...\n');

    // Read backup file
    if (!fs.existsSync(backupFile)) {
      console.error(`❌ Backup file not found: ${backupFile}`);
      process.exit(1);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📁 Loading backup from: ${backupFile}`);
    console.log(`📅 Backup timestamp: ${backupData.timestamp}`);
    console.log(`📊 Backup version: ${backupData.version}\n`);

    // Clear existing data (optional - can be disabled)
    console.log('🗑️ Clearing existing data...');
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
    console.log('✅ Existing data cleared\n');

    // Restore Users
    console.log('📦 Restoring users...');
    for (const user of backupData.tables.users) {
      const { custodialWallets, communities, ...userData } = user;
      await prisma.user.create({
        data: userData
      });
    }
    console.log(`✅ Restored ${backupData.tables.users.length} users`);

    // Restore Communities
    console.log('📦 Restoring communities...');
    for (const community of backupData.tables.communities) {
      const { members, wallet, ...communityData } = community;
      await prisma.community.create({
        data: communityData
      });
    }
    console.log(`✅ Restored ${backupData.tables.communities.length} communities`);

    // Restore Community Members
    console.log('📦 Restoring community members...');
    for (const community of backupData.tables.communities) {
      if (community.members) {
        for (const member of community.members) {
          const { user, community: communityRef, ...memberData } = member;
          await prisma.communityMember.create({
            data: memberData
          });
        }
      }
    }
    console.log('✅ Community members restored');

    // Restore Community Wallets
    console.log('📦 Restoring community wallets...');
    for (const wallet of backupData.tables.communityWallets) {
      await prisma.communityWallet.create({
        data: wallet
      });
    }
    console.log(`✅ Restored ${backupData.tables.communityWallets.length} community wallets`);

    // Restore Custodial Wallets
    console.log('📦 Restoring custodial wallets...');
    for (const wallet of backupData.tables.custodialWallets) {
      await prisma.custodialWallet.create({
        data: wallet
      });
    }
    console.log(`✅ Restored ${backupData.tables.custodialWallets.length} custodial wallets`);

    // Restore Missions
    console.log('📦 Restoring missions...');
    for (const mission of backupData.tables.missions) {
      const { userMissions, ...missionData } = mission;
      await prisma.mission.create({
        data: missionData
      });
    }
    console.log(`✅ Restored ${backupData.tables.missions.length} missions`);

    // Restore User Missions
    console.log('📦 Restoring user missions...');
    for (const mission of backupData.tables.missions) {
      if (mission.users) {
        for (const userMission of mission.users) {
          const { user, ...userMissionData } = userMission;
          await prisma.userMission.create({
            data: userMissionData
          });
        }
      }
    }
    console.log('✅ User missions restored');

    // Restore Rewards
    console.log('📦 Restoring rewards...');
    for (const reward of backupData.tables.rewards) {
      const { purchases, ...rewardData } = reward;
      await prisma.reward.create({
        data: rewardData
      });
    }
    console.log(`✅ Restored ${backupData.tables.rewards.length} rewards`);

    // Restore User Rewards
    console.log('📦 Restoring user rewards...');
    for (const reward of backupData.tables.rewards) {
      if (reward.purchases) {
        for (const userReward of reward.purchases) {
          const { user, ...userRewardData } = userReward;
          await prisma.userReward.create({
            data: userRewardData
          });
        }
      }
    }
    console.log('✅ User rewards restored');

    // Restore Feed Posts
    console.log('📦 Restoring feed posts...');
    for (const post of backupData.tables.feedPosts) {
      const { user, community, comments, likes, ...postData } = post;
      await prisma.feedPost.create({
        data: postData
      });
    }
    console.log(`✅ Restored ${backupData.tables.feedPosts.length} feed posts`);

    // Restore Comments
    console.log('📦 Restoring comments...');
    for (const post of backupData.tables.feedPosts) {
      if (post.comments) {
        for (const comment of post.comments) {
          const { user, ...commentData } = comment;
          await prisma.comment.create({
            data: commentData
          });
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
          await prisma.like.create({
            data: likeData
          });
        }
      }
    }
    console.log('✅ Likes restored');

    console.log(`\n✅ Database restore completed successfully!`);
    console.log(`📊 Restore summary:`);
    console.log(`   - Users: ${backupData.tables.users.length}`);
    console.log(`   - Communities: ${backupData.tables.communities.length}`);
    console.log(`   - Community Wallets: ${backupData.tables.communityWallets.length}`);
    console.log(`   - Custodial Wallets: ${backupData.tables.custodialWallets.length}`);
    console.log(`   - Missions: ${backupData.tables.missions.length}`);
    console.log(`   - Rewards: ${backupData.tables.rewards.length}`);
    console.log(`   - Feed Posts: ${backupData.tables.feedPosts.length}`);

  } catch (error) {
    console.error('❌ Database restore failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file from command line argument or use latest
const backupFile = process.argv[2] || path.join(__dirname, '../database-backups/latest-backup.json');

// Run the restore
restoreDatabase(backupFile)
  .then(() => {
    console.log('\n✨ Restore script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Restore script failed:', error);
    process.exit(1);
  }); 