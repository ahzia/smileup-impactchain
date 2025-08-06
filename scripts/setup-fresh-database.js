const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupFreshDatabase() {
  try {
    console.log('🔄 Setting up fresh database with seed data...\n');

    // Clear existing data
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

    // Create demo users
    console.log('👥 Creating demo users...');
    const demoUsers = [
      {
        email: 'demo@smileup.com',
        passwordHash: await bcrypt.hash('demo123', 12),
        name: 'Demo User',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Passionate about making a positive impact through technology and social innovation.',
        interests: ['Technology', 'Social Impact', 'Community Service', 'Environmental Conservation'],
        smiles: 1500,
        level: 5,
        score: 2500,
        badges: ['Early Adopter', 'Community Builder', 'Mission Master'],
        isVerified: true,
        isActive: true
      },
      {
        email: 'admin@smileup.com',
        passwordHash: await bcrypt.hash('admin123', 12),
        name: 'Admin User',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Platform administrator and community leader.',
        interests: ['Administration', 'Community Management', 'Technology'],
        smiles: 3000,
        level: 10,
        score: 5000,
        badges: ['Admin', 'Elite Member', 'Community Leader'],
        isVerified: true,
        isActive: true
      },
      {
        email: 'testuser@smileup.com',
        passwordHash: await bcrypt.hash('test123', 12),
        name: 'Test User',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Testing the platform features and functionality.',
        interests: ['Testing', 'Quality Assurance', 'Development'],
        smiles: 500,
        level: 2,
        score: 800,
        badges: ['Tester'],
        isVerified: true,
        isActive: true
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = await prisma.user.create({
        data: userData
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create demo communities
    console.log('\n🏘️ Creating demo communities...');
    const demoCommunities = [
      {
        name: 'Digital Learning Hub',
        description: 'Bridging the digital divide through education. We provide free computer classes, coding workshops, and digital literacy programs for all ages.',
        category: 'education',
        logoUrl: 'https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=800&h=300&fit=crop',
        location: 'Miami, FL',
        website: 'https://digitallearninghub.org',
        status: 'active',
        isVerified: true,
        createdBy: createdUsers[0].id
      },
      {
        name: 'Green Tech Innovators',
        description: 'Advancing sustainable technology solutions. We bring together engineers, designers, and entrepreneurs to develop innovative solutions for environmental challenges.',
        category: 'technology',
        logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
        location: 'Seattle, WA',
        website: 'https://greentechinnovators.org',
        status: 'active',
        isVerified: true,
        createdBy: createdUsers[1].id
      },
      {
        name: 'Local Arts Collective',
        description: 'Celebrating local artists and cultural diversity. We organize art exhibitions, workshops, and cultural events to bring communities together through creativity.',
        category: 'culture',
        logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
        location: 'Portland, OR',
        website: 'https://localartscollective.org',
        status: 'active',
        isVerified: true,
        createdBy: createdUsers[2].id
      }
    ];

    const createdCommunities = [];
    for (const communityData of demoCommunities) {
      const community = await prisma.community.create({
        data: communityData
      });
      createdCommunities.push(community);
      console.log(`✅ Created community: ${community.name}`);
    }

    // Add users to communities
    console.log('\n👥 Adding users to communities...');
    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < createdCommunities.length; j++) {
        const role = i === 0 ? 'admin' : 'member';
        await prisma.communityMember.create({
          data: {
            userId: createdUsers[i].id,
            communityId: createdCommunities[j].id,
            role: role
          }
        });
      }
    }
    console.log('✅ Users added to communities');

    // Create demo missions
    console.log('\n🎯 Creating demo missions...');
    const demoMissions = [
      {
        title: 'Digital Literacy Workshop',
        description: 'Help organize and conduct a digital literacy workshop for seniors in the community.',
        reward: 100,
        proofRequired: true,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        effortLevel: 'Medium',
        requiredTime: '4 hours',
        icon: '💻',
        category: 'education',
        communityId: createdCommunities[0].id
      },
      {
        title: 'Community Garden Maintenance',
        description: 'Help maintain the community garden and teach others about sustainable gardening practices.',
        reward: 75,
        proofRequired: true,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        effortLevel: 'Low',
        requiredTime: '2 hours',
        icon: '🌱',
        category: 'sustainability',
        communityId: createdCommunities[1].id
      },
      {
        title: 'Art Workshop for Kids',
        description: 'Organize and conduct an art workshop for children in the local community center.',
        reward: 120,
        proofRequired: true,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        effortLevel: 'High',
        requiredTime: '6 hours',
        icon: '🎨',
        category: 'culture',
        communityId: createdCommunities[2].id
      }
    ];

    for (const missionData of demoMissions) {
      const mission = await prisma.mission.create({
        data: missionData
      });
      console.log(`✅ Created mission: ${mission.title}`);
    }

    // Create demo rewards
    console.log('\n🎁 Creating demo rewards...');
    const demoRewards = [
      {
        type: 'experience',
        title: 'VIP Community Event Access',
        description: 'Exclusive access to upcoming community events and workshops.',
        validity: '2025-12-31',
        cost: 200,
        provider: 'SmileUp',
        emoji: '🎫',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
        communityId: createdCommunities[0].id
      },
      {
        type: 'certificate',
        title: 'Digital Literacy Certificate',
        description: 'Official certificate recognizing digital literacy teaching skills.',
        validity: '2025-12-31',
        cost: 150,
        provider: 'Digital Learning Hub',
        emoji: '📜',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        communityId: createdCommunities[0].id
      },
      {
        type: 'voucher',
        title: 'Local Coffee Shop Voucher',
        description: 'Voucher for a free coffee at participating local coffee shops.',
        validity: '2025-06-30',
        cost: 50,
        provider: 'Local Coffee Collective',
        emoji: '☕',
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop',
        communityId: createdCommunities[1].id
      }
    ];

    for (const rewardData of demoRewards) {
      const reward = await prisma.reward.create({
        data: rewardData
      });
      console.log(`✅ Created reward: ${reward.title}`);
    }

    // Create demo feed posts
    console.log('\n📝 Creating demo feed posts...');
    const demoPosts = [
      {
        title: 'Amazing Community Workshop!',
        description: 'Just completed our first digital literacy workshop. The energy was incredible and everyone learned so much!',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=800&h=400&fit=crop',
        challenge: 'Digital Literacy for All',
        callToAction: ['Join our next workshop', 'Share your experience'],
        links: ['https://digitallearninghub.org/workshops'],
        smiles: 25,
        commentsCount: 3,
        likesCount: 12,
        userId: createdUsers[0].id,
        communityId: createdCommunities[0].id
      },
      {
        title: 'Community Garden Update',
        description: 'Our community garden is thriving! Check out the new sustainable irrigation system we installed.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
        challenge: 'Sustainable Urban Agriculture',
        callToAction: ['Visit the garden', 'Volunteer for maintenance'],
        links: ['https://urbangardennetwork.org'],
        smiles: 18,
        commentsCount: 2,
        likesCount: 8,
        userId: createdUsers[1].id,
        communityId: createdCommunities[1].id
      }
    ];

    for (const postData of demoPosts) {
      const post = await prisma.feedPost.create({
        data: postData
      });
      console.log(`✅ Created feed post: ${post.title}`);
    }

    console.log(`\n✅ Fresh database setup completed successfully!`);
    console.log(`📊 Setup summary:`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Communities: ${createdCommunities.length}`);
    console.log(`   - Missions: ${demoMissions.length}`);
    console.log(`   - Rewards: ${demoRewards.length}`);
    console.log(`   - Feed Posts: ${demoPosts.length}`);
    console.log(`\n🔑 Demo Credentials:`);
    console.log(`   - Demo User: demo@smileup.com / demo123`);
    console.log(`   - Admin User: admin@smileup.com / admin123`);
    console.log(`   - Test User: testuser@smileup.com / test123`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupFreshDatabase()
  .then(() => {
    console.log('\n✨ Database setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database setup failed:', error);
    process.exit(1);
  }); 