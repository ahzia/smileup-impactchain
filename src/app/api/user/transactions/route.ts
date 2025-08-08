import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { prisma } from '@/lib/database/client';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Fetch all types of transactions
    const [donations, userRewards, userMissions] = await Promise.all([
      // Donations
      prisma.donation.findMany({
        where: { userId },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              community: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit
      }),

      // Reward purchases
      prisma.userReward.findMany({
        where: { userId },
        include: {
          reward: {
            select: {
              id: true,
              name: true,
              price: true,
              community: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { purchasedAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit
      }),

      // Mission completions
      prisma.userMission.findMany({
        where: { userId },
        include: {
          mission: {
            select: {
              id: true,
              title: true,
              reward: true,
              community: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit
      })
    ]);

    // Combine and format transactions
    const transactions = [
      // Donations
      ...donations.map(donation => ({
        id: donation.id,
        type: 'donation',
        amount: donation.amount,
        description: `Donated ${donation.amount} Smiles to ${donation.post.community?.name || 'platform post'}`,
        timestamp: donation.createdAt,
        blockchainTransactionId: donation.blockchainTransactionId,
        details: {
          postTitle: donation.post.title,
          communityName: donation.post.community?.name,
          message: donation.message
        }
      })),

      // Reward purchases
      ...userRewards.map(purchase => ({
        id: purchase.id,
        type: 'reward_purchase',
        amount: -purchase.reward.price, // Negative because it's an expense
        description: `Purchased ${purchase.reward.name} for ${purchase.reward.price} Smiles`,
        timestamp: purchase.purchasedAt,
        blockchainTransactionId: purchase.blockchainTransactionId,
        details: {
          rewardName: purchase.reward.name,
          communityName: purchase.reward.community?.name
        }
      })),

      // Mission completions
      ...userMissions.map(completion => ({
        id: completion.id,
        type: 'mission_completion',
        amount: completion.mission.reward,
        description: `Completed mission "${completion.mission.title}" and earned ${completion.mission.reward} Smiles`,
        timestamp: completion.completedAt,
        blockchainTransactionId: completion.blockchainTransactionId,
        details: {
          missionTitle: completion.mission.title,
          communityName: completion.mission.community?.name,
          proofText: completion.proofText
        }
      }))
    ];

    // Sort by timestamp (most recent first)
    transactions.sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return bTime - aTime;
    });

    // Get total counts for pagination
    const [totalDonations, totalRewards, totalMissions] = await Promise.all([
      prisma.donation.count({ where: { userId } }),
      prisma.userReward.count({ where: { userId } }),
      prisma.userMission.count({ where: { userId } })
    ]);

    const totalTransactions = totalDonations + totalRewards + totalMissions;

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total: totalTransactions,
          totalPages: Math.ceil(totalTransactions / limit)
        },
        summary: {
          totalDonations,
          totalRewards,
          totalMissions,
          totalTransactions
        }
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch transactions' 
      },
      { status: 500 }
    );
  }
} 