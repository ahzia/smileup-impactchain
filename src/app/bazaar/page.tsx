'use client';

import { useState, useEffect } from 'react';
import { Reward } from '@/lib/types';
import { RewardCard } from '@/components/bazaar/RewardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Gift, 
  Star, 
  Coins, 
  TrendingUp,
  Heart,
  ShoppingCart,
  Award,
  Sparkles,
  Zap,
  Target,
  Building,
  DollarSign
} from 'lucide-react';
import { 
  LoadingSpinner, 
  AnimatedBackground, 
  PageHeader, 
  UniversalFilter,
  FilterSection,
  FilterState
} from '@/components/common';

export default function BazaarPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSmiles, setUserSmiles] = useState<number>(0);
  const [filter, setFilter] = useState<FilterState>({
    provider: 'all',
    priceRange: 'all'
  });

  // Load rewards and user data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load rewards
        const rewardsResponse = await fetch('/api/rewards');
        const rewardsData = await rewardsResponse.json();
        
        if (rewardsData.success && rewardsData.data) {
          setRewards(rewardsData.data);
        }

        // Load user profile to get smiles
        const userResponse = await fetch('/api/user/profile');
        const userData = await userResponse.json();
        
        if (userData.success && userData.data) {
          setUserSmiles(userData.data.smiles || 0);
        } else {
          // User not authenticated or API error, use default value
          setUserSmiles(1000);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Set default smiles if API fails
        setUserSmiles(1000);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter rewards based on current filter
  const filteredRewards = rewards.filter(reward => {
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

  // Filter configuration
  const filterSections: FilterSection[] = [
    {
      key: 'provider',
      label: 'Provider',
      icon: Building,
      options: [
        { value: 'all', label: 'All Providers', icon: Building },
        { value: 'SmileUp', label: 'SmileUp', icon: Building },
        { value: 'Green Earth Initiative', label: 'Green Earth', icon: Building },
        { value: 'Tech for Good', label: 'Tech for Good', icon: Building },
        { value: 'Community Health', label: 'Community Health', icon: Building }
      ],
      badgeColor: 'bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 text-purple-400 border-purple-500/40'
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      icon: DollarSign,
      options: [
        { value: 'all', label: 'All Prices', icon: DollarSign },
        { value: 'low', label: 'Under 100 Smiles', icon: DollarSign },
        { value: 'medium', label: '100-300 Smiles', icon: DollarSign },
        { value: 'high', label: 'Over 300 Smiles', icon: DollarSign }
      ],
      badgeColor: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40'
    }
  ];

  // Header configuration
  const headerIcons = [
    { icon: ShoppingBag, color: 'bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-purple-500/20 border-purple-500/30' },
    { icon: Gift, color: 'bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30' },
    { icon: Star, color: 'bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 border-blue-500/30' }
  ];

  const headerStats = [
    { 
      icon: Coins, 
      value: userSmiles.toLocaleString(),
      color: 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30 text-yellow-400'
    },
    { 
      icon: Award, 
      value: rewards.filter(r => r.owned).length,
      color: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border-green-500/30 text-green-400'
    },
    { 
      icon: Target, 
      value: filteredRewards.length,
      color: 'bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 border-purple-500/30 text-purple-400'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <AnimatedBackground 
        showFloatingCoins={true}
        showSparkles={true}
      />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <PageHeader
          icons={headerIcons}
          title="Bazaar"
          description="Spend your Smiles on amazing rewards and experiences"
          stats={headerStats}
          titleGradient="from-purple-400 via-purple-500 to-purple-600"
        />

        {/* Filter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <UniversalFilter
            filter={filter}
            onFilterChange={setFilter}
            sections={filterSections}
            title="Filter Bazaar"
            description="Find perfect rewards"
            defaultValues={{ provider: 'all', priceRange: 'all' }}
          />
        </motion.div>

        {/* Perfectly Positioned Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative"
        >
          {/* Single Tabs Component with TabsList and TabsContent */}
          <Tabs defaultValue="all" className="w-full">
            {/* Tabs Container */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-card via-card/95 to-card border border-border/50 rounded-2xl p-3 backdrop-blur-sm shadow-lg max-w-4xl w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-transparent border-0 p-0 gap-3 h-auto">
                  <TabsTrigger 
                    value="all" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>All</span>
                      <span className="text-[10px] opacity-75">({filteredRewards.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>Experiences</span>
                      <span className="text-[10px] opacity-75">({experienceRewards.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="certificate" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>Certificates</span>
                      <span className="text-[10px] opacity-75">({certificateRewards.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="digital" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>Digital</span>
                      <span className="text-[10px] opacity-75">({digitalRewards.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="merchandise" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>Merchandise</span>
                      <span className="text-[10px] opacity-75">({merchandiseRewards.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="voucher" 
                    className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-accent/50 font-medium leading-tight"
                  >
                    <div className="flex flex-col items-center">
                      <span>Vouchers</span>
                      <span className="text-[10px] opacity-75">({voucherRewards.length})</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Tabs Content */}
            <TabsContent value="all" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {experienceRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="certificate" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {certificateRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="digital" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {digitalRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="merchandise" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {merchandiseRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="voucher" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {voucherRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <RewardCard
                      reward={reward}
                      userSmiles={userSmiles}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {filteredRewards.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🛍️
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No rewards found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new rewards.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 