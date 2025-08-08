import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { prisma } from '@/lib/database/client';

export async function GET(request: NextRequest) {
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

    console.log('🔍 Checking community wallet status...');

    // Get all communities with their wallets
    const communities = await prisma.community.findMany({
      include: {
        wallet: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📊 Found ${communities.length} total communities`);

    const communitiesWithWallets = communities.filter(community => community.wallet);
    const communitiesWithoutWallets = communities.filter(community => !community.wallet);
    
    console.log(`✅ Communities with wallets: ${communitiesWithWallets.length}`);
    console.log(`❌ Communities without wallets: ${communitiesWithoutWallets.length}`);

    if (communitiesWithoutWallets.length > 0) {
      console.log('\n❌ Communities missing wallets:');
      communitiesWithoutWallets.forEach(community => {
        console.log(`  - ${community.name} (ID: ${community.id})`);
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCommunities: communities.length,
        communitiesWithWallets: communitiesWithWallets.length,
        communitiesWithoutWallets: communitiesWithoutWallets.length,
        communities: communities.map(community => ({
          id: community.id,
          name: community.name,
          hasWallet: !!community.wallet,
          walletAccountId: community.wallet?.accountId || null,
          walletId: community.wallet?.id || null
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error checking community wallets:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check community wallets' 
      },
      { status: 500 }
    );
  }
} 