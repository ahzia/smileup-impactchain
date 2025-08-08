import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';

export async function GET(request: NextRequest) {
  try {
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

    const custodialWalletService = new CustodialWalletService();
    
    // Get wallet information
    const wallet = await custodialWalletService.getWalletForUser(userId);
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Get real-time balance
    const balance = await custodialWalletService.getUserBalance(userId);

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          id: wallet.id,
          accountId: wallet.accountId,
          publicKey: wallet.publicKey,
          isActive: wallet.isActive,
          createdAt: wallet.createdAt,
          updatedAt: wallet.updatedAt
        },
        balance: {
          hbar: balance.hbar,
          smiles: balance.smiles
        }
      }
    });

  } catch (error) {
    console.error('Error fetching wallet info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch wallet info' 
      },
      { status: 500 }
    );
  }
} 