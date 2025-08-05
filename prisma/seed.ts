import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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
  // CREATE USERS
  // ========================================
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@smileup.com',
        passwordHash: hashedPassword,
        name: 'Alice Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Passionate about environmental sustainability and community building.',
        interests: ['environment', 'sustainability', 'community'],
        smiles: 1250,
        level: 3,
        score: 850,
        badges: ['First Mission', 'Community Leader'],
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@smileup.com',
        passwordHash: hashedPassword,
        name: 'Bob Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Tech enthusiast helping communities through digital innovation.',
        interests: ['technology', 'innovation', 'education'],
        smiles: 890,
        level: 2,
        score: 650,
        badges: ['Tech Pioneer'],
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@smileup.com',
        passwordHash: hashedPassword,
        name: 'Carol Davis',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Healthcare professional dedicated to improving community health.',
        interests: ['healthcare', 'wellness', 'community'],
        smiles: 2100,
        level: 4,
        score: 1200,
        badges: ['Health Champion', 'Mission Master'],
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'david@smileup.com',
        passwordHash: hashedPassword,
        name: 'David Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Student activist working on social justice and education.',
        interests: ['social-justice', 'education', 'activism'],
        smiles: 450,
        level: 1,
        score: 300,
        badges: ['First Mission'],
        isVerified: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma@smileup.com',
        passwordHash: hashedPassword,
        name: 'Emma Brown',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Artist using creativity to inspire positive change in communities.',
        interests: ['art', 'creativity', 'community'],
        smiles: 1750,
        level: 3,
        score: 950,
        badges: ['Creative Spirit', 'Community Leader'],
        isVerified: true,
      },
    }),
  ]);

  // Create user analytics for each user
  await Promise.all(
    users.map(user =>
      prisma.userAnalytics.create({
        data: {
          userId: user.id,
          totalMissions: Math.floor(Math.random() * 20) + 5,
          completedMissions: Math.floor(Math.random() * 15) + 3,
          totalSmiles: user.smiles,
          totalRewards: Math.floor(Math.random() * 10) + 1,
          impactScore: user.score,
          lastActiveAt: new Date(),
        },
      })
    )
  );

  // ========================================
  // CREATE COMMUNITIES
  // ========================================
  console.log('🏘️ Creating communities...');
  
  const communities = await Promise.all([
    prisma.community.create({
      data: {
        name: 'Green Earth Initiative',
        description: 'A community dedicated to environmental sustainability and climate action.',
        category: 'environment',
        logoUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop',
        location: 'Global',
        website: 'https://greenearth.org',
        status: 'active',
        isVerified: true,
        createdBy: users[0].id,
      },
    }),
    prisma.community.create({
      data: {
        name: 'Tech for Good',
        description: 'Leveraging technology to solve social challenges and improve lives.',
        category: 'technology',
        logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
        location: 'San Francisco, CA',
        website: 'https://techforgood.org',
        status: 'active',
        isVerified: true,
        createdBy: users[1].id,
      },
    }),
    prisma.community.create({
      data: {
        name: 'Community Health Network',
        description: 'Promoting health and wellness through community-based initiatives.',
        category: 'healthcare',
        logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=300&fit=crop',
        location: 'New York, NY',
        website: 'https://communityhealth.org',
        status: 'active',
        isVerified: true,
        createdBy: users[2].id,
      },
    }),
    prisma.community.create({
      data: {
        name: 'Youth Empowerment Collective',
        description: 'Empowering young people to create positive change in their communities.',
        category: 'education',
        logoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=300&fit=crop',
        location: 'Los Angeles, CA',
        website: 'https://youthempowerment.org',
        status: 'active',
        isVerified: false,
        createdBy: users[3].id,
      },
    }),
  ]);

  // ========================================
  // CREATE COMMUNITY MEMBERSHIPS
  // ========================================
  console.log('👥 Creating community memberships...');
  
  await Promise.all([
    // Alice joins all communities
    prisma.communityMember.create({
      data: { userId: users[0].id, communityId: communities[0].id, role: 'admin' },
    }),
    prisma.communityMember.create({
      data: { userId: users[0].id, communityId: communities[1].id, role: 'member' },
    }),
    prisma.communityMember.create({
      data: { userId: users[0].id, communityId: communities[2].id, role: 'member' },
    }),
    
    // Bob joins Tech for Good and Community Health
    prisma.communityMember.create({
      data: { userId: users[1].id, communityId: communities[1].id, role: 'admin' },
    }),
    prisma.communityMember.create({
      data: { userId: users[1].id, communityId: communities[2].id, role: 'member' },
    }),
    
    // Carol joins Community Health and Youth Empowerment
    prisma.communityMember.create({
      data: { userId: users[2].id, communityId: communities[2].id, role: 'admin' },
    }),
    prisma.communityMember.create({
      data: { userId: users[2].id, communityId: communities[3].id, role: 'member' },
    }),
    
    // David joins Youth Empowerment
    prisma.communityMember.create({
      data: { userId: users[3].id, communityId: communities[3].id, role: 'admin' },
    }),
    
    // Emma joins Green Earth and Tech for Good
    prisma.communityMember.create({
      data: { userId: users[4].id, communityId: communities[0].id, role: 'member' },
    }),
    prisma.communityMember.create({
      data: { userId: users[4].id, communityId: communities[1].id, role: 'member' },
    }),
  ]);

  // ========================================
  // CREATE MISSIONS
  // ========================================
  console.log('🎯 Creating missions...');
  
  const missions = await Promise.all([
    prisma.mission.create({
      data: {
        title: 'Plant 10 Trees in Your Community',
        description: 'Help combat climate change by planting trees in your local area. Document your planting process and share the impact.',
        reward: 150,
        proofRequired: true,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        category: 'environment',
        difficulty: 'medium',
        tags: ['trees', 'climate', 'community'],
        createdBy: users[0].id,
      },
    }),
    prisma.mission.create({
      data: {
        title: 'Teach Basic Computer Skills',
        description: 'Help someone learn basic computer skills. This could be an elderly neighbor, a child, or anyone who wants to learn.',
        reward: 200,
        proofRequired: true,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
        category: 'education',
        difficulty: 'easy',
        tags: ['education', 'technology', 'teaching'],
        createdBy: users[1].id,
      },
    }),
    prisma.mission.create({
      data: {
        title: 'Organize a Community Health Workshop',
        description: 'Organize and host a health and wellness workshop in your community. Focus on topics like nutrition, exercise, or mental health.',
        reward: 300,
        proofRequired: true,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        category: 'healthcare',
        difficulty: 'hard',
        tags: ['health', 'workshop', 'community'],
        createdBy: users[2].id,
      },
    }),
    prisma.mission.create({
      data: {
        title: 'Clean Up a Local Park',
        description: 'Organize or participate in a park cleanup event. Document the before and after with photos.',
        reward: 100,
        proofRequired: true,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        category: 'environment',
        difficulty: 'easy',
        tags: ['cleanup', 'environment', 'community'],
        createdBy: users[0].id,
      },
    }),
    prisma.mission.create({
      data: {
        title: 'Create Digital Art for Social Cause',
        description: 'Create digital artwork that raises awareness about a social issue. Share your art and the message behind it.',
        reward: 250,
        proofRequired: true,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        category: 'art',
        difficulty: 'medium',
        tags: ['art', 'digital', 'social-cause'],
        createdBy: users[4].id,
      },
    }),
  ]);

  // ========================================
  // CREATE USER MISSION PARTICIPATIONS
  // ========================================
  console.log('🎯 Creating mission participations...');
  
  await Promise.all([
    // Alice participates in tree planting and park cleanup
    prisma.userMission.create({
      data: {
        userId: users[0].id,
        missionId: missions[0].id,
        status: 'completed',
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        proofText: 'Planted 10 oak trees in the community garden. Photos attached showing the planting process.',
        proofImages: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'],
      },
    }),
    prisma.userMission.create({
      data: {
        userId: users[0].id,
        missionId: missions[3].id,
        status: 'in_progress',
      },
    }),
    
    // Bob participates in computer teaching
    prisma.userMission.create({
      data: {
        userId: users[1].id,
        missionId: missions[1].id,
        status: 'completed',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        proofText: 'Taught my neighbor basic computer skills including email, internet browsing, and document creation.',
        proofImages: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'],
      },
    }),
    
    // Carol participates in health workshop
    prisma.userMission.create({
      data: {
        userId: users[2].id,
        missionId: missions[2].id,
        status: 'in_progress',
      },
    }),
    
    // David participates in park cleanup
    prisma.userMission.create({
      data: {
        userId: users[3].id,
        missionId: missions[3].id,
        status: 'completed',
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        proofText: 'Organized a cleanup event at Central Park. 15 people participated and we collected 20 bags of trash.',
        proofImages: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'],
      },
    }),
    
    // Emma participates in digital art
    prisma.userMission.create({
      data: {
        userId: users[4].id,
        missionId: missions[4].id,
        status: 'in_progress',
      },
    }),
  ]);

  // ========================================
  // CREATE REWARDS
  // ========================================
  console.log('🎁 Creating rewards...');
  
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: 'Eco-Friendly Water Bottle',
        description: 'Reusable stainless steel water bottle to help reduce plastic waste.',
        price: 200,
        category: 'sustainability',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
        stock: 50,
      },
    }),
    prisma.reward.create({
      data: {
        name: 'Community Impact T-Shirt',
        description: 'Comfortable cotton t-shirt with a design celebrating community impact.',
        price: 150,
        category: 'clothing',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        stock: 100,
      },
    }),
    prisma.reward.create({
      data: {
        name: 'Digital Art Workshop',
        description: 'Online workshop to learn digital art techniques for social impact.',
        price: 500,
        category: 'education',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
        stock: 25,
      },
    }),
    prisma.reward.create({
      data: {
        name: 'Local Coffee Shop Gift Card',
        description: '$25 gift card to support local businesses in your community.',
        price: 300,
        category: 'local-business',
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop',
        stock: 75,
      },
    }),
  ]);

  // ========================================
  // CREATE FEED POSTS
  // ========================================
  console.log('📝 Creating feed posts...');
  
  await Promise.all([
    prisma.feedPost.create({
      data: {
        title: 'Amazing Community Tree Planting Event!',
        description: 'Yesterday we planted 50 trees in our local park. The community came together and it was incredible to see everyone working together for a greener future.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        challenge: 'Join us next month for another tree planting event!',
        callToAction: ['Sign up for next event', 'Share your tree planting story'],
        links: ['https://greenearth.org/events'],
        smiles: 45,
        commentsCount: 8,
        likesCount: 23,
        userId: users[0].id,
        communityId: communities[0].id,
      },
    }),
    prisma.feedPost.create({
      data: {
        title: 'Teaching Tech Skills to Seniors',
        description: 'Spent the afternoon teaching basic computer skills to my elderly neighbors. Their enthusiasm for learning was inspiring!',
        mediaType: 'text',
        challenge: 'Help someone learn something new this week',
        callToAction: ['Share your teaching story', 'Find someone to help'],
        links: ['https://techforgood.org/mentoring'],
        smiles: 32,
        commentsCount: 5,
        likesCount: 18,
        userId: users[1].id,
        communityId: communities[1].id,
      },
    }),
    prisma.feedPost.create({
      data: {
        title: 'Community Health Workshop Success',
        description: 'Our nutrition workshop was a huge success! 25 people attended and learned about healthy eating habits.',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
        challenge: 'Organize a health workshop in your community',
        callToAction: ['Learn about organizing workshops', 'Share your health tips'],
        links: ['https://communityhealth.org/workshops'],
        smiles: 67,
        commentsCount: 12,
        likesCount: 34,
        userId: users[2].id,
        communityId: communities[2].id,
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${users.length} users, ${communities.length} communities, ${missions.length} missions, and ${rewards.length} rewards`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 