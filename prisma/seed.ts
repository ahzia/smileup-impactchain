import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Real profile pictures from public/profiles
const profilePictures = [
  '/profiles/img1.jpg',
  '/profiles/img2.jpeg',
  '/profiles/img3.jpg',
  '/profiles/img4.jpg',
  '/profiles/img5.jpeg'
];

const userData = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Passionate about community service',
    interests: ['environment', 'education', 'healthcare'],
    level: 5,
    score: 850,
    badges: ['first-mission', 'community-leader', 'environmental-champion']
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Dedicated to making a difference',
    interests: ['education', 'technology', 'social-impact'],
    level: 3,
    score: 650,
    badges: ['first-mission', 'education-advocate']
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'Tech enthusiast helping communities',
    interests: ['technology', 'innovation', 'community'],
    level: 4,
    score: 720,
    badges: ['first-mission', 'tech-innovator']
  }
];

const communityData = [
  {
    name: 'Green Earth Initiative',
    description: 'Environmental conservation and sustainability projects',
    category: 'environment',
    logoUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop',
    location: 'San Francisco, CA',
    website: 'https://greenearth.org',
    status: 'active',
    isVerified: true
  },
  {
    name: 'Tech for Good',
    description: 'Using technology to solve social problems',
    category: 'technology',
    logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop',
    location: 'New York, NY',
    website: 'https://techforgood.org',
    status: 'active',
    isVerified: true
  },
  {
    name: 'Education First',
    description: 'Improving access to quality education',
    category: 'education',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=150&h=150&fit=crop',
    location: 'Chicago, IL',
    website: 'https://educationfirst.org',
    status: 'active',
    isVerified: true
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.userReward.deleteMany();
  await prisma.userMission.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const users = [];
  for (let i = 0; i < userData.length; i++) {
    const userDataItem = userData[i];
    const hashedPassword = await bcrypt.hash(userDataItem.password, 12);
    const profilePicture = profilePictures[i % profilePictures.length]; // Cycle through pictures
    
    const user = await prisma.user.create({
      data: {
        name: userDataItem.name,
        email: userDataItem.email,
        passwordHash: hashedPassword,
        bio: userDataItem.bio,
        interests: userDataItem.interests,
        level: userDataItem.level,
        score: userDataItem.score,
        badges: userDataItem.badges,
        avatarUrl: profilePicture
      }
    });
    users.push(user);
    console.log(`✅ Created user: ${user.name} with avatar: ${profilePicture}`);
  }

  // Create communities
  console.log('🏘️ Creating communities...');
  const communities = [];
  for (const communityData of communityData) {
    const community = await prisma.community.create({
      data: {
        ...communityData,
        createdBy: users[0].id // First user creates all communities
      }
    });
    communities.push(community);
    console.log(`✅ Created community: ${community.name}`);
  }

  // Create community memberships
  console.log('👥 Adding users to communities...');
  for (const user of users) {
    for (const community of communities) {
      await prisma.communityMember.create({
        data: {
          userId: user.id,
          communityId: community.id,
          role: 'member'
        }
      });
    }
  }
  console.log('✅ Added users to communities');

  // Create missions
  console.log('🎯 Creating missions...');
  const missions = [
    {
      title: 'Clean Up Local Park',
      description: 'Help clean up litter and maintain the local park',
      reward: 50,
      category: 'environment',
      difficulty: 'easy',
      tags: ['environment', 'community', 'outdoors'],
      communityId: communities[0].id
    },
    {
      title: 'Teach Basic Computer Skills',
      description: 'Help seniors learn basic computer and internet skills',
      reward: 75,
      category: 'education',
      difficulty: 'medium',
      tags: ['education', 'technology', 'seniors'],
      communityId: communities[1].id
    },
    {
      title: 'Plant Community Garden',
      description: 'Help establish a community garden for fresh produce',
      reward: 100,
      category: 'environment',
      difficulty: 'hard',
      tags: ['environment', 'food', 'community'],
      communityId: communities[0].id
    }
  ];

  for (const missionData of missions) {
    const mission = await prisma.mission.create({
      data: {
        ...missionData,
        createdBy: users[0].id
      }
    });
    console.log(`✅ Created mission: ${mission.title}`);
  }

  // Create rewards
  console.log('🎁 Creating rewards...');
  const rewards = [
    {
      name: 'Eco-Friendly Water Bottle',
      description: 'Reusable water bottle made from recycled materials',
      price: 25,
      category: 'sustainability',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
      isAvailable: true,
      stock: 50,
      communityId: communities[0].id
    },
    {
      name: 'Tech Workshop Voucher',
      description: 'Free workshop on digital skills and technology',
      price: 50,
      category: 'education',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
      isAvailable: true,
      stock: 20,
      communityId: communities[1].id
    },
    {
      name: 'Community Event Ticket',
      description: 'Access to exclusive community events and meetups',
      price: 30,
      category: 'community',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=300&fit=crop',
      isAvailable: true,
      stock: 100
    }
  ];

  for (const rewardData of rewards) {
    const reward = await prisma.reward.create({
      data: {
        ...rewardData,
        createdBy: users[0].id
      }
    });
    console.log(`✅ Created reward: ${reward.name}`);
  }

  // Create feed posts
  console.log('📝 Creating feed posts...');
  const feedPosts = [
    {
      title: 'Amazing Community Cleanup Success!',
      description: 'We successfully cleaned up the local park and collected over 50 bags of litter. Thank you to everyone who participated!',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      challenge: 'Join our next cleanup event',
      callToAction: ['Sign up', 'Share photos'],
      links: ['https://greenearth.org/events'],
      communityId: communities[0].id
    },
    {
      title: 'Digital Skills Workshop Results',
      description: 'Our latest workshop helped 25 seniors learn basic computer skills. The impact was incredible!',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=600&h=400&fit=crop',
      challenge: 'Volunteer for our next workshop',
      callToAction: ['Volunteer', 'Donate'],
      links: ['https://techforgood.org/volunteer'],
      communityId: communities[1].id
    }
  ];

  for (const postData of feedPosts) {
    const post = await prisma.feedPost.create({
      data: {
        ...postData,
        createdBy: users[0].id
      }
    });
    console.log(`✅ Created feed post: ${post.title}`);
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${users.length} users, ${communities.length} communities, and various missions and rewards`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 