import { NextRequest, NextResponse } from 'next/server';
import { CommunityWalletService } from '@/lib/wallet/communityWalletService';
import { AuthMiddleware } from '@/lib/middleware/auth';

const communityWalletService = new CommunityWalletService();

// GET /api/communities/[id]/wallet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id: communityId } = await params;
    const wallet = await communityWalletService.getWalletForCommunity(communityId);

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Community wallet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: wallet
    });

  } catch (error) {
    console.error('Get community wallet error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get community wallet' 
      },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/wallet
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id: communityId } = await params;

    // Check if wallet already exists
    const existingWallet = await communityWalletService.getWalletForCommunity(communityId);
    if (existingWallet) {
      return NextResponse.json(
        { success: false, error: 'Community wallet already exists' },
        { status: 400 }
      );
    }

    // Create new wallet
    const wallet = await communityWalletService.createWalletForCommunity(communityId);

    return NextResponse.json({
      success: true,
      data: wallet
    });

  } catch (error) {
    console.error('Create community wallet error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create community wallet' 
      },
      { status: 500 }
    );
  }
} 