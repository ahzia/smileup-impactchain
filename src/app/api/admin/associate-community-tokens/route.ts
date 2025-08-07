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

    console.log('🔍 Associating community wallets with Smiles token...');

    // Get all communities with wallets
    const communities = await prisma.community.findMany({
      include: {
        wallet: true
      }
    });

    const communitiesWithWallets = communities.filter(community => community.wallet);
    
    console.log(`📊 Found ${communitiesWithWallets.length} communities with wallets`);

    if (communitiesWithWallets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No communities with wallets found',
        data: {
          totalCommunities: communities.length,
          communitiesWithWallets: 0,
          associatedWallets: 0
        }
      });
    }

    const communityWalletService = new CommunityWalletService();
    const associatedWallets = [];
    const failedAssociations = [];

    for (const community of communitiesWithWallets) {
      try {
        console.log(`\n📝 Associating token for community: ${community.name}`);
        
        const isAssociated = await communityWalletService.associateTokenWithWallet(
          community.id, 
          process.env.HEDERA_SMILES_TOKEN_ID || '0.0.6494998'
        );
        
        if (isAssociated) {
          console.log(`✅ Successfully associated token for ${community.name}`);
          
          associatedWallets.push({
            communityId: community.id,
            communityName: community.name,
            walletAccountId: community.wallet?.accountId,
            associated: true
          });
        } else {
          console.log(`❌ Failed to associate token for ${community.name}`);
          
          failedAssociations.push({
            communityId: community.id,
            communityName: community.name,
            walletAccountId: community.wallet?.accountId,
            associated: false
          });
        }
      } catch (error) {
        console.error(`❌ Error associating token for ${community.name}:`, error instanceof Error ? error.message : 'Unknown error');
        
        failedAssociations.push({
          communityId: community.id,
          communityName: community.name,
          walletAccountId: community.wallet?.accountId,
          associated: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('\n🎉 Token association process completed!');

    return NextResponse.json({
      success: true,
      message: `Successfully associated ${associatedWallets.length} community wallets with Smiles token`,
      data: {
        totalCommunities: communities.length,
        communitiesWithWallets: communitiesWithWallets.length,
        associatedWallets: associatedWallets.length,
        failedAssociations: failedAssociations.length,
        successful: associatedWallets,
        failed: failedAssociations
      }
    });

  } catch (error) {
    console.error('❌ Error in token association process:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to associate community tokens' 
      },
      { status: 500 }
    );
  }
} 