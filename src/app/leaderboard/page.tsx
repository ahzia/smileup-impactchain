'use client';

import { LeaderboardEntry } from '@/lib/types';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
import { LeaderboardFilter } from '@/components/leaderboard/LeaderboardFilter';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Crown,
  Target
} from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, loading, error, filter, updateFilter, stats } = useLeaderboard();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Error loading leaderboard</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground mt-2">
              Top changemakers making a difference in their communities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalParticipants}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.averageSmiles}</div>
              <div className="text-sm text-muted-foreground">Avg Smiles</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Champion</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {stats.top3[0]?.name || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.top3[0]?.smiles || 0} Smiles
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Runner Up</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {stats.top3[1]?.name || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.top3[1]?.smiles || 0} Smiles
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Medal className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Third Place</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {stats.top3[2]?.name || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.top3[2]?.smiles || 0} Smiles
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Highest Score</span>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.maxSmiles}</div>
            <div className="text-sm text-muted-foreground">Smiles</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <LeaderboardFilter filter={filter} onFilterChange={updateFilter} />

      {/* Podium Section */}
      {stats.top3.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🏆 Top 3 Champions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Second Place */}
            {stats.top3[1] && (
              <div className="order-2 md:order-1">
                <LeaderboardCard
                  user={stats.top3[1]}
                  rank={2}
                  isPodium={true}
                  position="second"
                />
              </div>
            )}
            
            {/* First Place */}
            {stats.top3[0] && (
              <div className="order-1 md:order-2">
                <LeaderboardCard
                  user={stats.top3[0]}
                  rank={1}
                  isPodium={true}
                  position="first"
                />
              </div>
            )}
            
            {/* Third Place */}
            {stats.top3[2] && (
              <div className="order-3">
                <LeaderboardCard
                  user={stats.top3[2]}
                  rank={3}
                  isPodium={true}
                  position="third"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">📊 Full Rankings</h2>
          <Badge variant="secondary">
            {leaderboard.length} Participants
          </Badge>
        </div>
        
        <div className="space-y-2">
          {stats.rest.map((user, index) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              rank={index + 4}
              isPodium={false}
            />
          ))}
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
          <p className="text-muted-foreground">
            Start completing missions to appear on the leaderboard!
          </p>
        </div>
      )}
    </div>
  );
} 