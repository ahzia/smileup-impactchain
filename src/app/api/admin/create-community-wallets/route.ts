import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CommunityWalletService } from '@/lib/wallet/communityWalletService';
import { prisma } from '@/lib/database/client';

export async function POST(request: NextRequest) {
  try {
    // Validate authentication and extract user ID from JWT token
    const authResult = await AuthMiddleware.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const userId = AuthMiddleware.getCurrentUserId(authResult);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found in token' },
        { status: 401 }
      );
    }

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
      return NextResponse.json({
        success: true,
        message: 'All communities already have wallets!',
        data: {
          totalCommunities: communities.length,
          communitiesWithoutWallets: 0,
          createdWallets: 0
        }
      });
    }

    console.log('\n🔄 Creating wallets for communities without them...');

    const communityWalletService = new CommunityWalletService();
    const createdWallets = [];

    for (const community of communitiesWithoutWallets) {
      try {
        console.log(`\n📝 Creating wallet for community: ${community.name}`);
        
        const wallet = await communityWalletService.createWalletForCommunity(community.id);
        
        if (wallet) {
          console.log(`✅ Successfully created wallet for ${community.name}:`);
          console.log(`   Account ID: ${wallet.accountId}`);
          console.log(`   Wallet ID: ${wallet.id}`);
          
          createdWallets.push({
            communityId: community.id,
            communityName: community.name,
            walletId: wallet.id,
            accountId: wallet.accountId
          });
        } else {
          console.log(`❌ Failed to create wallet for ${community.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating wallet for ${community.name}:`, error instanceof Error ? error.message : 'Unknown error');
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

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdWallets.length} community wallets`,
      data: {
        totalCommunities: communities.length,
        communitiesWithoutWallets: communitiesWithoutWallets.length,
        createdWallets: createdWallets.length,
        wallets: createdWallets,
        stillMissingWallets: stillMissingWallets.length
      }
    });

  } catch (error) {
    console.error('❌ Error in wallet creation process:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create community wallets' 
      },
      { status: 500 }
    );
  }
} 