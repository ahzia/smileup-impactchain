'use client';

import { useState, useEffect } from 'react';
import { Reward } from '@/lib/types';
import { RewardCard } from '@/components/bazaar/RewardCard';
import { BazaarFilter } from '@/components/bazaar/BazaarFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Target
} from 'lucide-react';

export default function BazaarPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSmiles, setUserSmiles] = useState(2450);
  const [filter, setFilter] = useState({
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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, Math.random() * window.innerWidth],
                y: [0, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Floating coins animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`coin-${i}`}
            className="absolute text-yellow-400/40"
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              rotate: [0, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 10}px`,
            }}
          >
            💰
          </motion.div>
        ))}

        {/* Sparkle effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300/60"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 8 + 8}px`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Beautiful Header Section */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-2 bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-purple-500/20 rounded-lg border border-purple-500/30 backdrop-blur-sm">
                <ShoppingBag className="h-5 w-5 text-purple-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="p-2 bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                <Gift className="h-5 w-5 text-yellow-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <Star className="h-5 w-5 text-blue-400" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Bazaar
          </motion.h1>
          
          <motion.p 
            className="text-sm text-muted-foreground max-w-xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Spend your Smiles on amazing rewards and experiences
          </motion.p>
          
          {/* Compact Stats Row */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Coins className="h-4 w-4 text-yellow-400" />
              </motion.div>
              <span className="text-sm font-semibold text-yellow-400">
                {userSmiles.toLocaleString()}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Award className="h-4 w-4 text-green-400" />
              </motion.div>
              <span className="text-sm font-semibold text-green-400">
                {rewards.filter(r => r.owned).length}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 border border-purple-500/30 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Target className="h-4 w-4 text-purple-400" />
              </motion.div>
              <span className="text-sm font-semibold text-purple-400">
                {filteredRewards.length}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Filter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <BazaarFilter filter={filter} onFilterChange={setFilter} />
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