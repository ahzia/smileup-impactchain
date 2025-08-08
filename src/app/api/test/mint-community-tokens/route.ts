import { NextRequest, NextResponse } from 'next/server';
import { CommunityWalletService } from '@/lib/wallet/communityWalletService';
import { AuthMiddleware } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await AuthMiddleware.requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { communityId, amount } = await req.json();

    if (!communityId || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid community ID or amount' }, { status: 400 });
    }

    const communityWalletService = new CommunityWalletService();
    const mintResult = await communityWalletService.mintTokensToCommunity(communityId, amount);

    if (mintResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Successfully minted ${amount} Smiles to community ${communityId}. New balance: ${mintResult.newBalance}`, 
        transactionId: mintResult.transactionId 
      });
    } else {
      return NextResponse.json({ success: false, error: mintResult.error || 'Failed to mint tokens' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in /api/test/mint-community-tokens:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 