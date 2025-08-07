import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';

// POST /api/test/mint-tokens
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

    // Get request body
    const body = await request.json();
    const { amount = 1000 } = body;

    console.log(`🪙 Minting ${amount} Smiles tokens for user ${userId}...`);

    // Use CustodialWalletService to mint tokens
    const custodialWalletService = new CustodialWalletService();
    const mintResult = await custodialWalletService.mintTokensToUser(userId, amount);
    
    if (mintResult.success) {
      console.log('✅ Successfully minted tokens!');
      console.log('📊 Transaction ID:', mintResult.transactionId);
      console.log('💰 New balance:', mintResult.newBalance, 'Smiles');

      return NextResponse.json({
        success: true,
        message: `Successfully minted ${amount} Smiles tokens`,
        data: {
          transactionId: mintResult.transactionId,
          newBalance: mintResult.newBalance
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