import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { prisma } from '@/lib/database/client';

// POST /api/test/recreate-wallet
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

    console.log(`🔧 Recreating wallet for user ${userId}...`);

    // Delete existing wallet
    await prisma.custodialWallet.deleteMany({
      where: { userId }
    });

    console.log('🗑️ Deleted existing wallet');

    // Create new wallet with proper encryption
    const custodialWalletService = new CustodialWalletService();
    const newWallet = await custodialWalletService.createWalletForUser(userId);
    
    console.log('✅ Created new wallet:', newWallet.accountId);

    return NextResponse.json({
      success: true,
      message: 'Successfully recreated wallet with proper encryption',
      data: {
        walletAddress: newWallet.accountId,
        walletId: newWallet.id
      }
    });

  } catch (error) {
    console.error('❌ Error recreating wallet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to recreate wallet' 
      },
      { status: 500 }
    );
  }
} 