'use client';

import { LeaderboardEntry } from '@/lib/types';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
import { LeaderboardFilter } from '@/components/leaderboard/LeaderboardFilter';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Crown,
  Target,
  Zap,
  Flame,
  Heart,
  Sparkles,
  CheckCircle,
  Clock,
  TrendingDown
} from 'lucide-react';

export default function LeaderboardPage() {
  const { leaderboard, loading, error, filter, updateFilter, stats } = useLeaderboard();

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

  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ⚠️
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Error loading leaderboard</h3>
            <p className="text-muted-foreground">{error}</p>
          </motion.div>
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
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Compact Header Section */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-2 bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="p-2 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 rounded-lg border border-primary/30 backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="p-2 bg-gradient-to-br from-amber-500/20 via-amber-400/15 to-amber-500/20 rounded-lg border border-amber-500/30 backdrop-blur-sm">
                <Medal className="h-5 w-5 text-amber-400" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Leaderboard
          </motion.h1>
          
          <motion.p 
            className="text-sm text-muted-foreground max-w-xl mx-auto mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Top changemakers making a difference in their communities
          </motion.p>
          
          {/* Compact Stats Row */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border border-primary/30 rounded-md backdrop-blur-sm">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {stats.totalParticipants}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border border-green-500/30 rounded-md backdrop-blur-sm">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs font-semibold text-green-400">
                {stats.averageSmiles}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border border-yellow-500/30 rounded-md backdrop-blur-sm">
              <Target className="h-3 w-3 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">
                {stats.maxSmiles}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <LeaderboardFilter filter={filter} onFilterChange={updateFilter} />
        </motion.div>

        {/* Podium Section */}
        {stats.top3.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.h2 
              className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              🏆 Top 3 Champions
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Second Place */}
              {stats.top3[1] && (
                <motion.div 
                  className="order-2 md:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <LeaderboardCard
                    user={stats.top3[1]}
                    rank={2}
                    isPodium={true}
                    position="second"
                  />
                </motion.div>
              )}
              
              {/* First Place */}
              {stats.top3[0] && (
                <motion.div 
                  className="order-1 md:order-2"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <LeaderboardCard
                    user={stats.top3[0]}
                    rank={1}
                    isPodium={true}
                    position="first"
                  />
                </motion.div>
              )}
              
              {/* Third Place */}
              {stats.top3[2] && (
                <motion.div 
                  className="order-3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                >
                  <LeaderboardCard
                    user={stats.top3[2]}
                    rank={3}
                    isPodium={true}
                    position="third"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rest of Leaderboard */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <div className="flex items-center justify-between">
            <motion.h2 
              className="text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.2 }}
            >
              📊 Full Rankings
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.2 }}
            >
              <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border border-primary/30">
                {leaderboard.length} Participants
              </Badge>
            </motion.div>
          </div>
          
          <div className="space-y-2">
            {stats.rest.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.4 + index * 0.1 }}
              >
                <LeaderboardCard
                  user={user}
                  rank={index + 4}
                  isPodium={false}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {leaderboard.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 2.6 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🏆
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No rankings yet</h3>
            <p className="text-muted-foreground">
              Start completing missions to appear on the leaderboard!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 