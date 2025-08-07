'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Trophy, 
  Users, 
  Target,
  Heart,
  Star,
  Award,
  Calendar,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Coins
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'donation' | 'reward_purchase' | 'mission_completion';
  amount: number;
  description: string;
  timestamp: string;
  blockchainTransactionId?: string;
  details: {
    postTitle?: string;
    communityName?: string;
    message?: string;
    rewardName?: string;
    missionTitle?: string;
    proofText?: string;
  };
}

interface TransactionSummary {
  totalDonations: number;
  totalRewards: number;
  totalMissions: number;
  totalTransactions: number;
}

interface ProfileActivitiesProps {
  activities: Array<{ activity: string; time: string }>;
}

export const ProfileActivities: React.FC<ProfileActivitiesProps> = ({ activities }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('smileup_token');
      const response = await fetch('/api/user/transactions?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.data.transactions);
        setSummary(data.data.summary);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Failed to load transaction history');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'reward_purchase':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'mission_completion':
        return <Trophy className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'donation':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/30';
      case 'reward_purchase':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/30';
      case 'mission_completion':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/30';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700/30';
    }
  };

  const getTransactionType = (type: string) => {
    switch (type) {
      case 'donation':
        return 'Donation';
      case 'reward_purchase':
        return 'Purchase';
      case 'mission_completion':
        return 'Mission';
      default:
        return 'Transaction';
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    return (
      <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{amount.toLocaleString()} Smiles
      </span>
    );
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold mb-2">Sign in to view transactions</h3>
          <p className="text-muted-foreground">
            Connect your wallet to see your transaction history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Transaction Summary
          </h3>
          <Button
            onClick={fetchTransactions}
            size="sm"
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summary.totalTransactions}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.totalMissions}</div>
              <div className="text-sm text-muted-foreground">Missions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.totalDonations}</div>
              <div className="text-sm text-muted-foreground">Donations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.totalRewards}</div>
              <div className="text-sm text-muted-foreground">Purchases</div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Coins className="h-5 w-5 mr-2" />
          Recent Transactions
        </h3>
        
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchTransactions} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTransactionColor(transaction.type)}`}
                          >
                            {getTransactionType(transaction.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {formatAmount(transaction.amount)}
                          {transaction.amount > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                        
                        {transaction.blockchainTransactionId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              const url = `https://hashscan.io/testnet/transaction/${transaction.blockchainTransactionId}`;
                              window.open(url, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {transaction.details.communityName && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Community: {transaction.details.communityName}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground">
              Start completing missions, making donations, and purchasing rewards to see your transaction history here!
            </p>
          </div>
        )}
      </div>

      {/* Legacy Activities (fallback) */}
      {activities.length > 0 && transactions.length === 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">📅 Activity Timeline</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Activity className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">{activity.activity}</p>
                        <Badge variant="outline" className="text-xs">
                          Activity
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 