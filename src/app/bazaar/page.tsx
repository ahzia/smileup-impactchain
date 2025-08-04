'use client';

import { useState, useEffect } from 'react';
import { Reward } from '@/lib/types';
import { RewardCard } from '@/components/bazaar/RewardCard';
import { BazaarFilter } from '@/components/bazaar/BazaarFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Gift, 
  Star, 
  Coins, 
  TrendingUp,
  Heart,
  ShoppingCart,
  Award
} from 'lucide-react';

export default function BazaarPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSmiles, setUserSmiles] = useState(2450);
  const [filter, setFilter] = useState({
    category: 'all',
    provider: 'all',
    priceRange: 'all'
  });

  // Load rewards from API
  useEffect(() => {
    const loadRewards = async () => {
      try {
        const response = await fetch('/api/rewards');
        const data = await response.json();
        
        if (data.success && data.data) {
          setRewards(data.data);
        }
      } catch (error) {
        console.error('Error loading rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

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

  const handlePurchase = async (rewardId: string, cost: number) => {
    if (userSmiles < cost) {
      alert('Not enough Smiles! Complete more missions to earn Smiles.');
      return;
    }

    try {
      const response = await fetch(`/api/rewards/${rewardId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setRewards(prev => prev.map(reward => 
          reward.id === rewardId 
            ? { ...reward, owned: true }
            : reward
        ));
        setUserSmiles(prev => prev - cost);
        alert('Purchase successful! Check your rewards.');
      }
    } catch (error) {
      console.error('Error purchasing reward:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Bazaar</h1>
            <p className="text-muted-foreground mt-2">
              Spend your Smiles on amazing rewards and experiences
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userSmiles.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Your Smiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {rewards.filter(r => r.owned).length}
              </div>
              <div className="text-sm text-muted-foreground">Owned</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Experiences</span>
            </div>
            <div className="text-2xl font-bold mt-2">{experienceRewards.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Certificates</span>
            </div>
            <div className="text-2xl font-bold mt-2">{certificateRewards.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Digital</span>
            </div>
            <div className="text-2xl font-bold mt-2">{digitalRewards.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Merchandise</span>
            </div>
            <div className="text-2xl font-bold mt-2">{merchandiseRewards.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <BazaarFilter filter={filter} onFilterChange={setFilter} />

      {/* Rewards Tabs */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({filteredRewards.length})</TabsTrigger>
          <TabsTrigger value="experience">Experiences ({experienceRewards.length})</TabsTrigger>
          <TabsTrigger value="certificate">Certificates ({certificateRewards.length})</TabsTrigger>
          <TabsTrigger value="digital">Digital ({digitalRewards.length})</TabsTrigger>
          <TabsTrigger value="merchandise">Merchandise ({merchandiseRewards.length})</TabsTrigger>
          <TabsTrigger value="voucher">Vouchers ({voucherRewards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificate" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificateRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="digital" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="merchandise" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchandiseRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voucher" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voucherRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userSmiles={userSmiles}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold mb-2">No rewards found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for new rewards.
          </p>
        </div>
      )}
    </div>
  );
} 