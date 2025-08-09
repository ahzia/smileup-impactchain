import { NextRequest, NextResponse } from 'next/server';
import { BlockchainService } from '@/lib/services/blockchainService';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { CommunityWalletService } from '@/lib/wallet/communityWalletService';

export async function POST(request: NextRequest) {
  try {
    const { userId, communityId, amount } = await request.json();

    console.log('🧪 Testing donation process...');
    console.log('User ID:', userId);
    console.log('Community ID:', communityId);
    console.log('Amount:', amount);

    // Instantiate services
    const custodialWalletService = new CustodialWalletService();
    const communityWalletService = new CommunityWalletService();

    // Get user wallet
    const userWallet = await custodialWalletService.getWalletForUser(userId);
    console.log('User wallet:', userWallet);

    if (!userWallet) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 });
    }

    // Get community wallet
    const communityWallet = await communityWalletService.getWalletForCommunity(communityId);
    console.log('Community wallet:', communityWallet);

    if (!communityWallet) {
      return NextResponse.json({ error: 'Community wallet not found' }, { status: 404 });
    }

    // Get user private key
    const userPrivateKey = await custodialWalletService.getDecryptedPrivateKey(userId);
    console.log('User private key exists:', !!userPrivateKey);

    if (!userPrivateKey) {
      return NextResponse.json({ error: 'Failed to get user private key' }, { status: 500 });
    }

    // Get balances before
    const userBalanceBefore = await BlockchainService.getUserBalance(userId);
    const communityBalanceBefore = await BlockchainService.getCommunityBalance(communityId);

    console.log('User balance before:', userBalanceBefore);
    console.log('Community balance before:', communityBalanceBefore);

    // Test the donation transfer
    const result = await BlockchainService.transferDonation({
      userId,
      communityId,
      amount,
      postId: 'test-post'
    });

    console.log('Transfer result:', result);

    // Get balances after
    const userBalanceAfter = await BlockchainService.getUserBalance(userId);
    const communityBalanceAfter = await BlockchainService.getCommunityBalance(communityId);

    console.log('User balance after:', userBalanceAfter);
    console.log('Community balance after:', communityBalanceAfter);

    return NextResponse.json({
      success: true,
      result,
      balances: {
        user: {
          before: userBalanceBefore,
          after: userBalanceAfter,
          difference: userBalanceAfter - userBalanceBefore
        },
        community: {
          before: communityBalanceBefore,
          after: communityBalanceAfter,
          difference: communityBalanceAfter - communityBalanceBefore
        }
      }
    });

  } catch (error) {
    console.error('❌ Test donation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 