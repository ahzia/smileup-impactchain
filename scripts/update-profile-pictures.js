const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

// Profile pictures available in public/profiles
const profilePictures = [
  '/profiles/img1.jpg',
  '/profiles/img2.jpeg',
  '/profiles/img3.jpg',
  '/profiles/img4.jpg',
  '/profiles/img5.jpeg'
];

async function updateProfilePictures() {
  try {
    console.log('🖼️ Starting profile picture update...');

    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });

    console.log(`📊 Found ${users.length} users to update`);

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    // Update each user with a profile picture
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const profilePicture = profilePictures[i % profilePictures.length]; // Cycle through pictures
      
      console.log(`🔄 Updating ${user.name} (${user.email}) with ${profilePicture}`);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: profilePicture
        }
      });
      
      console.log(`✅ Updated ${user.name} with profile picture`);
    }

    console.log('\n🎉 Profile picture update completed!');
    console.log(`📸 Updated ${users.length} users with real profile pictures`);

    // Show summary of updates
    const updatedUsers = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        avatarUrl: true
      }
    });

    console.log('\n📋 Updated Users:');
    updatedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.avatarUrl}`);
    });

  } catch (error) {
    console.error('❌ Error updating profile pictures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateProfilePictures(); 