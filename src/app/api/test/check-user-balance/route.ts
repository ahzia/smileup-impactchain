import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { BlockchainService } from '@/lib/services/blockchainService';

export async function GET(req: NextRequest) {
  try {
    const authResult = await AuthMiddleware.requireAuth(req);
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

    console.log(`💰 Checking balance for user ${userId}...`);

    // Test direct wallet service
    const custodialWalletService = new CustodialWalletService();
    const walletBalance = await custodialWalletService.getUserBalance(userId);
    
    // Test blockchain service
    const blockchainBalance = await BlockchainService.getUserBalance(userId);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        walletBalance,
        blockchainBalance,
        difference: walletBalance.smiles - blockchainBalance
      }
    });

  } catch (error) {
    console.error('❌ Error checking user balance:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check user balance' 
      },
      { status: 500 }
    );
  }
} 