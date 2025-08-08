const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyProfilePictures() {
  try {
    console.log('🔍 Verifying profile pictures...');

    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });

    console.log(`📊 Found ${users.length} users`);

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    // Check each user's profile picture
    const realProfilePictures = [
      '/profiles/img1.jpg',
      '/profiles/img2.jpeg',
      '/profiles/img3.jpg',
      '/profiles/img4.jpg',
      '/profiles/img5.jpeg'
    ];

    console.log('\n📋 Profile Picture Status:');
    users.forEach((user, index) => {
      const isRealPicture = realProfilePictures.includes(user.avatarUrl);
      const status = isRealPicture ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${user.name} (${user.email})`);
      console.log(`   Avatar: ${user.avatarUrl}`);
    });

    // Count users with real pictures
    const usersWithRealPictures = users.filter(user => 
      realProfilePictures.includes(user.avatarUrl)
    );

    console.log(`\n📊 Summary:`);
    console.log(`✅ Users with real profile pictures: ${usersWithRealPictures.length}/${users.length}`);
    console.log(`❌ Users with placeholder pictures: ${users.length - usersWithRealPictures.length}/${users.length}`);

    if (usersWithRealPictures.length === users.length) {
      console.log('\n🎉 All users have real profile pictures!');
    } else {
      console.log('\n⚠️ Some users still have placeholder pictures.');
    }

  } catch (error) {
    console.error('❌ Error verifying profile pictures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
verifyProfilePictures(); 