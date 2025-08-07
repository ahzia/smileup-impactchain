import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { Client, AccountId, TokenId, TokenAssociateTransaction, PrivateKey } from '@hashgraph/sdk';
import bcrypt from 'bcryptjs';

// POST /api/test/associate-token
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

    console.log(`🔗 Associating Smiles token with user ${userId}...`);

    // Get user's custodial wallet from database
    const { prisma } = await import('@/lib/database/client');
    const wallet = await prisma.custodialWallet.findFirst({
      where: { userId }
    });
    
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'User wallet not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found user wallet:', wallet.accountId);

    // Initialize Hedera client
    const client = Client.forTestnet();
    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_PRIVATE_KEY;
    const tokenId = process.env.HEDERA_SMILES_TOKEN_ID;
    
    if (!operatorId || !operatorKey || !tokenId) {
      return NextResponse.json(
        { success: false, error: 'Missing Hedera environment variables' },
        { status: 500 }
      );
    }
    
    client.setOperator(operatorId, operatorKey);

    // Decrypt the user's private key
    const privateKey = PrivateKey.fromString(wallet.encryptedPrivateKey);

    // Create token association transaction
    const associateTx = new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(wallet.accountId))
      .setTokenIds([TokenId.fromString(tokenId)]);

    console.log('🔄 Submitting association transaction...');
    
    // Sign with user's private key
    const response = await associateTx.execute(client);
    const receipt = await response.getReceipt(client);

    if (receipt.status.toString() === 'SUCCESS') {
      console.log('✅ Successfully associated token with account!');
      console.log('📊 Transaction ID:', response.transactionId);

      return NextResponse.json({
        success: true,
        message: 'Successfully associated Smiles token with user wallet',
        data: {
          transactionId: response.transactionId.toString(),
          walletAddress: wallet.accountId,
          tokenId: tokenId
        }
      });

    } else {
      console.error('❌ Association failed:', receipt.status.toString());
      return NextResponse.json(
        { 
          success: false, 
          error: `Token association failed: ${receipt.status.toString()}` 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error associating token:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to associate token' 
      },
      { status: 500 }
    );
  }
} 