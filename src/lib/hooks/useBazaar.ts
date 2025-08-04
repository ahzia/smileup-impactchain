import { useState, useEffect } from 'react';
import { Reward } from '@/lib/types';

interface BazaarFilter {
  category: string;
  provider: string;
  priceRange: string;
}

export function useBazaar(initialFilter: BazaarFilter = { category: 'all', provider: 'all', priceRange: 'all' }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BazaarFilter>(initialFilter);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/rewards');
        const data = await response.json();
        
        if (data.success && data.data) {
          setRewards(data.data);
        } else {
          setError(data.error || 'Failed to load rewards');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const updateFilter = (newFilter: Partial<BazaarFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  // Filter rewards based on current filter
  const filteredRewards = rewards.filter(reward => {
    if (filter.category !== 'all' && reward.type !== filter.category) return false;
    if (filter.provider !== 'all' && reward.provider !== filter.provider) return false;
    if (filter.priceRange !== 'all') {
      const cost = reward.cost;
      switch (filter.priceRange) {
        case 'low':
          if (cost > 100) return false;
          break;
        case 'medium':
          if (cost < 100 || cost > 300) return false;
          break;
        case 'high':
          if (cost < 300) return false;
          break;
      }
    }
    return true;
  });

  // Group rewards by category
  const experienceRewards = filteredRewards.filter(r => r.type === 'experience');
  const certificateRewards = filteredRewards.filter(r => r.type === 'certificate');
  const digitalRewards = filteredRewards.filter(r => r.type === 'digital');
  const merchandiseRewards = filteredRewards.filter(r => r.type === 'merchandise');
  const voucherRewards = filteredRewards.filter(r => r.type === 'voucher');

  // Calculate statistics
  const stats = {
    totalRewards: rewards.length,
    affordableRewards: rewards.filter(r => r.cost <= 200).length,
    ownedRewards: rewards.filter(r => r.owned).length,
    experienceRewards: experienceRewards.length,
    certificateRewards: certificateRewards.length,
    digitalRewards: digitalRewards.length,
    merchandiseRewards: merchandiseRewards.length,
    voucherRewards: voucherRewards.length
  };

  return {
    rewards,
    filteredRewards,
    loading,
    error,
    filter,
    updateFilter,
    stats,
    experienceRewards,
    certificateRewards,
    digitalRewards,
    merchandiseRewards,
    voucherRewards
  };
} 