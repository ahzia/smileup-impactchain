import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { users } from '../src/data/users';
import { communities } from '../src/data/communities';
import { missions } from '../src/data/missions';
import { rewards } from '../src/data/rewards';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with SmileUp data...');

  // ========================================
  // CLEAN DATABASE
  // ========================================
  console.log('🧹 Cleaning database...');
  await prisma.userReward.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.missionProof.deleteMany();
  await prisma.userMission.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.userAnalytics.deleteMany();
  await prisma.user.deleteMany();

  // ========================================
  // CREATE USERS FROM DATA
  // ========================================
  console.log('👥 Creating users from data...');
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const createdUsers = await Promise.all(
    users.map(async (userData) => {
      return await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          avatarUrl: userData.avatar,
          bio: userData.bio,
          interests: userData.interests,
          smiles: userData.smiles,
          level: userData.level,
          score: userData.score,
          badges: userData.badges,
          isVerified: true,
          isActive: true,
          createdAt: new Date(userData.createdAt),
        },
      });
    })
  );

  // Create user analytics for each user
  await Promise.all(
    createdUsers.map(user => {
      const userData = users.find(u => u.id === user.id);
      return prisma.userAnalytics.create({
        data: {
          userId: user.id,
          totalMissions: Math.floor(Math.random() * 30) + 10,
          completedMissions: Math.floor(Math.random() * 20) + 5,
          totalSmiles: user.smiles,
          totalRewards: Math.floor(Math.random() * 15) + 2,
          impactScore: user.score,
          lastActiveAt: new Date(),
        },
      });
    })
  );

  // ========================================
  // CREATE COMMUNITIES FROM DATA
  // ========================================
  console.log('🏘️ Creating communities from data...');
  
  const createdCommunities = await Promise.all(
    communities.map(async (communityData) => {
      return await prisma.community.create({
        data: {
          id: communityData.id,
          name: communityData.name,
          description: communityData.description,
          category: communityData.category,
          logoUrl: communityData.logo,
          bannerUrl: communityData.banner,
          location: communityData.location,
          website: communityData.website,
          status: communityData.status,
          isVerified: true,
          createdAt: new Date(communityData.createdAt),
          createdBy: communityData.createdBy,
        },
      });
    })
  );

  // ========================================
  // CREATE COMMUNITY MEMBERSHIPS
  // ========================================
  console.log('👥 Creating community memberships...');
  
  const membershipPromises: Promise<any>[] = [];
  
  // Create memberships based on user data
  users.forEach(user => {
    user.communitiesJoined.forEach(communityId => {
      membershipPromises.push(
        prisma.communityMember.create({
          data: {
            userId: user.id,
            communityId: communityId,
            role: 'member',
          },
        })
      );
    });
    
    // Add creators as admins
    user.communitiesCreated.forEach(communityId => {
      membershipPromises.push(
        prisma.communityMember.create({
          data: {
            userId: user.id,
            communityId: communityId,
            role: 'admin',
          },
        })
      );
    });
  });
  
  await Promise.all(membershipPromises);

  // ========================================
  // CREATE MISSIONS FROM DATA
  // ========================================
  console.log('🎯 Creating missions from data...');
  
  const createdMissions = await Promise.all(
    missions.map(async (missionData) => {
      return await prisma.mission.create({
        data: {
          id: missionData.id,
          title: missionData.title,
          description: missionData.description,
          reward: missionData.reward,
          status: missionData.status === 'available' ? 'available' : 'completed',
          proofRequired: missionData.proofRequired,
          deadline: new Date(missionData.deadline),
          maxParticipants: missionData.effortLevel === 'High' ? 50 : missionData.effortLevel === 'Medium' ? 100 : 200,
          currentParticipants: Math.floor(Math.random() * 50) + 5,
          category: missionData.category,
          difficulty: missionData.effortLevel === 'High' ? 'hard' : missionData.effortLevel === 'Medium' ? 'medium' : 'easy',
          tags: [missionData.category, missionData.effortLevel.toLowerCase()],
          createdAt: new Date(),
          createdBy: missionData.community.id === 'system' ? null : missionData.community.id,
        },
      });
    })
  );

  // ========================================
  // CREATE USER MISSION PARTICIPATIONS
  // ========================================
  console.log('🎯 Creating mission participations...');
  
  const participationPromises: Promise<any>[] = [];
  
  // Create some realistic mission participations
  createdUsers.forEach(user => {
    const userData = users.find(u => u.id === user.id);
    if (!userData) return;
    
    // Each user participates in 2-4 random missions
    const randomMissions = createdMissions
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);
    
    randomMissions.forEach(mission => {
      const isCompleted = Math.random() > 0.6; // 40% chance of completion
      
      participationPromises.push(
        prisma.userMission.create({
          data: {
            userId: user.id,
            missionId: mission.id,
            status: isCompleted ? 'completed' : 'in_progress',
            completedAt: isCompleted ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
            proofText: isCompleted ? `Completed ${mission.title} successfully!` : null,
            proofImages: isCompleted ? ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'] : [],
          },
        })
      );
    });
  });
  
  await Promise.all(participationPromises);

  // ========================================
  // CREATE REWARDS FROM DATA
  // ========================================
  console.log('🎁 Creating rewards from data...');
  
  const createdRewards = await Promise.all(
    rewards.map(async (rewardData) => {
      return await prisma.reward.create({
        data: {
          id: rewardData.id,
          name: rewardData.title,
          description: rewardData.description,
          price: rewardData.cost,
          category: rewardData.type,
          imageUrl: rewardData.imageUrl,
          isAvailable: true,
          stock: rewardData.type === 'digital' || rewardData.type === 'certificate' ? null : Math.floor(Math.random() * 50) + 10,
          soldCount: Math.floor(Math.random() * 20),
        },
      });
    })
  );

  // ========================================
  // CREATE USER REWARD PURCHASES
  // ========================================
  console.log('🛒 Creating reward purchases...');
  
  const purchasePromises: Promise<any>[] = [];
  
  // Create some realistic reward purchases
  createdUsers.forEach(user => {
    const userData = users.find(u => u.id === user.id);
    if (!userData) return;
    
    // Each user purchases 1-3 random rewards
    const randomRewards = createdRewards
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    randomRewards.forEach(reward => {
      if (user.smiles >= reward.price) {
        purchasePromises.push(
          prisma.userReward.create({
            data: {
              userId: user.id,
              rewardId: reward.id,
              purchasedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            },
          })
        );
      }
    });
  });
  
  await Promise.all(purchasePromises);

  // ========================================
  // CREATE FEED POSTS
  // ========================================
  console.log('📝 Creating feed posts...');
  
  const feedPosts = [
    {
      title: 'Amazing Beach Cleanup Success!',
      description: 'Yesterday we collected over 500kg of waste from our local beach. The community came together and it was incredible to see everyone working for a cleaner environment.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      challenge: 'Join us next month for another cleanup event!',
      callToAction: ['Sign up for next event', 'Share your cleanup story'],
      links: ['https://greenearthinitiative.org/events'],
      smiles: 45,
      commentsCount: 8,
      likesCount: 23,
      userId: createdUsers[0].id, // Sarah Chen
      communityId: createdCommunities[0].id, // Green Earth Initiative
    },
    {
      title: 'Hackathon Results - 15 New Apps for Nonprofits',
      description: 'Our weekend hackathon was a huge success! We developed 15 new applications to help local nonprofits with their digital needs.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      challenge: 'Help us implement these solutions in your community',
      callToAction: ['Learn about the apps', 'Volunteer for implementation'],
      links: ['https://techforsocialimpact.org/hackathon'],
      smiles: 67,
      commentsCount: 12,
      likesCount: 34,
      userId: createdUsers[1].id, // Marcus Johnson
      communityId: createdCommunities[1].id, // Tech for Social Impact
    },
    {
      title: 'Mental Health Workshop Success',
      description: 'Our community health workshop reached 25 people today. We covered stress management, mindfulness, and building healthy habits.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      challenge: 'Organize a health workshop in your community',
      callToAction: ['Learn about organizing workshops', 'Share your health tips'],
      links: ['https://communityhealth.org/workshops'],
      smiles: 89,
      commentsCount: 15,
      likesCount: 42,
      userId: createdUsers[2].id, // Aisha Patel
      communityId: createdCommunities[2].id, // Community Health Network
    },
    {
      title: 'Digital Literacy Program Launch',
      description: 'We\'re excited to launch our digital literacy program for seniors. Teaching basic computer skills to help them stay connected.',
      mediaType: 'text',
      challenge: 'Help someone learn something new this week',
      callToAction: ['Volunteer to teach', 'Share your teaching story'],
      links: ['https://techforsocialimpact.org/digital-literacy'],
      smiles: 32,
      commentsCount: 5,
      likesCount: 18,
      userId: createdUsers[1].id, // Marcus Johnson
      communityId: createdCommunities[1].id, // Tech for Social Impact
    },
    {
      title: 'Tree Planting Initiative - 100 Trees Planted',
      description: 'Our community planted 100 trees this weekend! Each tree will help combat climate change and provide habitat for local wildlife.',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop',
      challenge: 'Plant a tree in your neighborhood',
      callToAction: ['Join next planting event', 'Share your tree story'],
      links: ['https://greenearthinitiative.org/tree-planting'],
      smiles: 56,
      commentsCount: 9,
      likesCount: 28,
      userId: createdUsers[0].id, // Sarah Chen
      communityId: createdCommunities[0].id, // Green Earth Initiative
    },
  ];

  await Promise.all(
    feedPosts.map(post =>
      prisma.feedPost.create({
        data: post,
      })
    )
  );

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${createdUsers.length} users, ${createdCommunities.length} communities, ${createdMissions.length} missions, and ${createdRewards.length} rewards`);
  console.log('🎉 SmileUp ImpactChain database is ready with realistic data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 