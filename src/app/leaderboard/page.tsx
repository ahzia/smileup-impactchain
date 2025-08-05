'use client';

import { LeaderboardEntry } from '@/lib/types';
import { LeaderboardCard } from '@/components/leaderboard/LeaderboardCard';
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
import { 
  LoadingSpinner, 
  AnimatedBackground, 
  PageHeader, 
  UniversalFilter,
  FilterSection,
  FilterState
} from '@/components/common';

export default function LeaderboardPage() {
  const { leaderboard, loading, error, filter, updateFilter, stats } = useLeaderboard();

  // Filter configuration
  const filterSections: FilterSection[] = [
    {
      key: 'sortBy',
      label: 'Sort By',
      icon: TrendingUp,
      options: [
        { value: 'smiles', label: 'Most Smiles', icon: TrendingUp },
        { value: 'level', label: 'Highest Level', icon: Star },
        { value: 'recent', label: 'Recently Active', icon: Clock },
        { value: 'name', label: 'Name A-Z', icon: Users }
      ],
      badgeColor: 'bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 text-blue-400 border-blue-500/40'
    },
    {
      key: 'level',
      label: 'Level',
      icon: Star,
      options: [
        { value: 'all', label: 'All Levels', icon: Target },
        { value: 'beginner', label: 'Beginner', icon: Target },
        { value: 'intermediate', label: 'Intermediate', icon: Clock },
        { value: 'advanced', label: 'Advanced', icon: Award },
        { value: 'elite', label: 'Elite', icon: Star }
      ],
      badgeColor: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40'
    }
  ];

  // Header configuration
  const headerIcons = [
    { icon: Crown, color: 'bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30' },
    { icon: Trophy, color: 'bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 border-primary/30' },
    { icon: Medal, color: 'bg-gradient-to-br from-amber-500/20 via-amber-400/15 to-amber-500/20 border-amber-500/30' }
  ];

  const headerStats = [
    { 
      icon: Users, 
      value: stats.totalParticipants,
      color: 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border-primary/30 text-primary'
    },
    { 
      icon: TrendingUp, 
      value: stats.averageSmiles,
      color: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border-green-500/30 text-green-400'
    },
    { 
      icon: Target, 
      value: stats.maxSmiles,
      color: 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30 text-yellow-400'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
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
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <PageHeader
          icons={headerIcons}
          title="Leaderboard"
          description="Top changemakers making a difference in their communities"
          stats={headerStats}
          compact={true}
          titleGradient="from-yellow-400 via-yellow-500 to-yellow-600"
        />

        {/* Filter */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <UniversalFilter
            filter={filter}
            onFilterChange={updateFilter}
            sections={filterSections}
            title="Filter Leaderboard"
            description="Find top performers"
            defaultValues={{ sortBy: 'smiles', level: 'all' }}
          />
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