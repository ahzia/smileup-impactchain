const { PrismaClient } = require('@prisma/client');
const { CommunityWalletService } = require('../src/lib/wallet/communityWalletService');

const prisma = new PrismaClient();

async function createMissingCommunityWallets() {
  try {
    console.log('🔍 Checking for communities without wallets...');

    // Get all communities
    const communities = await prisma.community.findMany({
      include: {
        wallet: true
      }
    });

    console.log(`📊 Found ${communities.length} total communities`);

    const communitiesWithoutWallets = communities.filter(community => !community.wallet);
    
    console.log(`❌ Found ${communitiesWithoutWallets.length} communities without wallets:`);
    
    communitiesWithoutWallets.forEach(community => {
      console.log(`  - ${community.name} (ID: ${community.id})`);
    });

    if (communitiesWithoutWallets.length === 0) {
      console.log('✅ All communities already have wallets!');
      return;
    }

    console.log('\n🔄 Creating wallets for communities without them...');

    const communityWalletService = new CommunityWalletService();

    for (const community of communitiesWithoutWallets) {
      try {
        console.log(`\n📝 Creating wallet for community: ${community.name}`);
        
        const wallet = await communityWalletService.createWalletForCommunity(community.id);
        
        if (wallet) {
          console.log(`✅ Successfully created wallet for ${community.name}:`);
          console.log(`   Account ID: ${wallet.accountId}`);
          console.log(`   Wallet ID: ${wallet.id}`);
        } else {
          console.log(`❌ Failed to create wallet for ${community.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating wallet for ${community.name}:`, error.message);
      }
    }

    console.log('\n🎉 Wallet creation process completed!');

    // Verify all communities now have wallets
    const updatedCommunities = await prisma.community.findMany({
      include: {
        wallet: true
      }
    });

    const stillMissingWallets = updatedCommunities.filter(community => !community.wallet);
    
    if (stillMissingWallets.length === 0) {
      console.log('✅ All communities now have wallets!');
    } else {
      console.log(`❌ ${stillMissingWallets.length} communities still missing wallets:`);
      stillMissingWallets.forEach(community => {
        console.log(`  - ${community.name} (ID: ${community.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error in wallet creation process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createMissingCommunityWallets(); 