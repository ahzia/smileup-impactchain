import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { UserService } from '@/lib/services/userService';

// POST /api/admin/mint-tokens
export async function POST(request: NextRequest) {
  try {
    // Validate authentication and extract user ID from JWT token
    const authResult = await AuthMiddleware.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const adminUserId = AuthMiddleware.getCurrentUserId(authResult);
    if (!adminUserId) {
      return NextResponse.json(
        { success: false, error: 'Admin user ID not found in token' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { targetUserId, amount = 1000 } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'targetUserId is required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'amount must be greater than 0' },
        { status: 400 }
      );
    }

    console.log(`🪙 Admin minting ${amount} Smiles tokens for user ${targetUserId}...`);

    // Verify target user exists
    const targetUser = await UserService.findUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Mint tokens using CustodialWalletService
    const custodialWalletService = new CustodialWalletService();
    const mintResult = await custodialWalletService.mintTokensToUser(targetUserId, amount);
    
    if (mintResult.success) {
      console.log('✅ Successfully minted tokens!');
      console.log('📊 Transaction ID:', mintResult.transactionId);
      console.log('💰 New balance:', mintResult.newBalance, 'Smiles');

      return NextResponse.json({
        success: true,
        message: `Successfully minted ${amount} Smiles tokens`,
        data: {
          targetUserId,
          amount,
          transactionId: mintResult.transactionId,
          newBalance: mintResult.newBalance,
          targetUserName: targetUser.name
        }
      });

    } else {
      console.error('❌ Failed to mint tokens:', mintResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to mint tokens: ${mintResult.error}` 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error minting tokens:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mint tokens' 
      },
      { status: 500 }
    );
  }
} 