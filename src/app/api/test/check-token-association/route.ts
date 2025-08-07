import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { Client, AccountBalanceQuery, AccountId, TokenId } from '@hashgraph/sdk';

// GET /api/test/check-token-association
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

    console.log(`🔍 Checking token association for user ${userId}...`);

    // Get user's custodial wallet
    const custodialWalletService = new CustodialWalletService();
    const wallet = await custodialWalletService.getWalletForUser(userId);
    
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

    // Check account balance and token association
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(wallet.accountId))
      .execute(client);

    const tokenIdObj = TokenId.fromString(tokenId);
    const isAssociated = accountBalance.tokens && accountBalance.tokens.get(tokenIdObj);
    const tokenBalance = isAssociated ? accountBalance.tokens.get(tokenIdObj)?.toNumber() || 0 : 0;

    console.log('📊 Account balance check results:');
    console.log('- HBAR Balance:', accountBalance.hbars.toString());
    console.log('- Token Associated:', isAssociated);
    console.log('- Token Balance:', tokenBalance);

    return NextResponse.json({
      success: true,
      data: {
        walletAddress: wallet.accountId,
        tokenId: tokenId,
        isAssociated: isAssociated,
        tokenBalance: tokenBalance,
        hbarBalance: accountBalance.hbars.toString(),
        allTokens: accountBalance.tokens ? Object.keys(accountBalance.tokens).map(tokenKey => ({
          token: tokenKey,
          balance: accountBalance.tokens.get(tokenKey)?.toNumber() || 0
        })) : []
      }
    });

  } catch (error) {
    console.error('❌ Error checking token association:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check token association' 
      },
      { status: 500 }
    );
  }
} 