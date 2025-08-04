import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/lib/types';

interface LeaderboardFilter {
  period: string;
  limit: number;
}

export function useLeaderboard(initialFilter: LeaderboardFilter = { period: 'all', limit: 50 }) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeaderboardFilter>(initialFilter);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/leaderboard?period=${filter.period}&limit=${filter.limit}`
        );
        const data = await response.json();
        
        if (data.success && data.data) {
          setLeaderboard(data.data);
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  const updateFilter = (newFilter: Partial<LeaderboardFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  // Calculate statistics
  const stats = {
    totalParticipants: leaderboard.length,
    averageSmiles: leaderboard.length > 0 
      ? Math.round(leaderboard.reduce((sum, user) => sum + user.smiles, 0) / leaderboard.length)
      : 0,
    maxSmiles: leaderboard.length > 0 ? Math.max(...leaderboard.map(user => user.smiles)) : 0,
    top3: leaderboard.slice(0, 3),
    rest: leaderboard.slice(3)
  };

  return {
    leaderboard,
    loading,
    error,
    filter,
    updateFilter,
    stats
  };
} 