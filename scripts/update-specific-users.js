const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function updateSpecificUsers() {
  try {
    console.log('🔄 Starting specific user updates...');

    // Update Demo User to Emma Watson with img3.jpg
    console.log('🔄 Updating Demo User to Emma Watson...');
    const demoUser = await prisma.user.update({
      where: { email: 'demo@smileup.com' },
      data: {
        name: 'Emma Watson',
        avatarUrl: '/profiles/img3.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    console.log(`✅ Updated: ${demoUser.name} (${demoUser.email}) - ${demoUser.avatarUrl}`);

    // Update Auto Mint User to Zia with img1.jpg
    console.log('🔄 Updating Auto Mint User to Zia...');
    const ziaUser = await prisma.user.update({
      where: { email: 'automint@example.com' },
      data: {
        name: 'Zia',
        avatarUrl: '/profiles/img1.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    console.log(`✅ Updated: ${ziaUser.name} (${ziaUser.email}) - ${ziaUser.avatarUrl}`);

    // Update Auto Mint Test to Zamir with img2.jpg
    console.log('🔄 Updating Auto Mint Test to Zamir...');
    const zamirUser = await prisma.user.update({
      where: { email: 'automint2@example.com' },
      data: {
        name: 'Zamir',
        avatarUrl: '/profiles/img2.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    console.log(`✅ Updated: ${zamirUser.name} (${zamirUser.email}) - ${zamirUser.avatarUrl}`);

    console.log('\n🎉 Specific user updates completed!');
    console.log('\n📋 Updated Users Summary:');
    console.log(`1. Emma Watson (demo@smileup.com) - /profiles/img3.jpg`);
    console.log(`2. Zia (automint@example.com) - /profiles/img1.jpg`);
    console.log(`3. Zamir (automint2@example.com) - /profiles/img2.jpg`);

  } catch (error) {
    console.error('❌ Error updating specific users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateSpecificUsers(); 