import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CommunityWalletService } from '@/lib/wallet/communityWalletService';
import { prisma } from '@/lib/database/client';

// POST /api/test/recreate-community-wallet
export async function POST(request: NextRequest) {
  try {
    // Validate authentication and extract user ID from JWT token
    const authResult = await AuthMiddleware.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { communityId } = await request.json();

    if (!communityId) {
      return NextResponse.json(
        { success: false, error: 'Community ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔧 Recreating wallet for community ${communityId}...`);

    // Delete existing wallet
    await prisma.communityWallet.deleteMany({
      where: { communityId }
    });

    console.log('🗑️ Deleted existing community wallet');

    // Create new wallet with proper encryption
    const communityWalletService = new CommunityWalletService();
    const newWallet = await communityWalletService.createWalletForCommunity(communityId);
    
    console.log('✅ Created new community wallet:', newWallet.accountId);

    return NextResponse.json({
      success: true,
      message: 'Successfully recreated community wallet with proper encryption',
      data: {
        walletAddress: newWallet.accountId,
        walletId: newWallet.id
      }
    });

  } catch (error) {
    console.error('❌ Error recreating community wallet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to recreate community wallet' 
      },
      { status: 500 }
    );
  }
} 