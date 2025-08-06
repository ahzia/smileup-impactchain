import { NextRequest, NextResponse } from 'next/server';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { AuthMiddleware } from '@/lib/middleware/auth';

const custodialWalletService = new CustodialWalletService();

// GET /api/wallet/custodial - Get user's custodial wallet
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

    // Get user's wallet
    const wallet = await custodialWalletService.getWalletForUser(userId);
    
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: wallet });

  } catch (error) {
    console.error('Error getting custodial wallet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get wallet' },
      { status: 500 }
    );
  }
}

// POST /api/wallet/custodial - Create new custodial wallet for user
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

    // Check if user already has a wallet
    const existingWallet = await custodialWalletService.getWalletForUser(userId);
    if (existingWallet) {
      return NextResponse.json({ success: false, error: 'Wallet already exists' }, { status: 400 });
    }

    // Create new wallet
    const wallet = await custodialWalletService.createWalletForUser(userId);

    return NextResponse.json({ success: true, data: wallet });

  } catch (error) {
    console.error('Error creating custodial wallet:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
} 