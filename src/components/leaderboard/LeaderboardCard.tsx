'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  TrendingUp,
  Crown,
  Sparkles,
  Zap,
  Flame,
  Heart,
  Target,
  CheckCircle
} from 'lucide-react';

interface LeaderboardCardProps {
  user: LeaderboardEntry;
  rank: number;
  isPodium: boolean;
  position?: 'first' | 'second' | 'third';
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  user, 
  rank, 
  isPodium, 
  position 
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPodiumStyles = (position?: string) => {
    switch (position) {
      case 'first':
        return 'bg-gradient-to-br from-yellow-500/30 via-yellow-400/25 to-yellow-500/30 border-yellow-500/50 shadow-lg scale-105';
      case 'second':
        return 'bg-gradient-to-br from-gray-500/30 via-gray-400/25 to-gray-500/30 border-gray-500/50 shadow-md scale-102';
      case 'third':
        return 'bg-gradient-to-br from-amber-500/30 via-amber-400/25 to-amber-500/30 border-amber-500/50 shadow-md scale-101';
      default:
        return 'bg-gradient-to-br from-card via-card/95 to-card border-border/50';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-400 bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 border-purple-500/40';
    if (level >= 7) return 'text-blue-400 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border-blue-500/40';
    if (level >= 4) return 'text-green-400 bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border-green-500/40';
    return 'text-muted-foreground bg-gradient-to-r from-muted/20 via-muted/15 to-muted/20 border-muted/40';
  };

  const getPodiumGlow = (position?: string) => {
    switch (position) {
      case 'first':
        return 'shadow-[0_0_20px_rgba(234,179,8,0.2)]';
      case 'second':
        return 'shadow-[0_0_15px_rgba(156,163,175,0.2)]';
      case 'third':
        return 'shadow-[0_0_15px_rgba(217,119,6,0.2)]';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative"
    >
      {/* Animated background glow for podium */}
      {isPodium && (
        <motion.div
          className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            position === 'first' ? 'bg-yellow-500/30' :
            position === 'second' ? 'bg-gray-500/30' :
            'bg-amber-500/30'
          }`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <Card className={`relative transition-all duration-300 hover:shadow-xl ${isPodium ? getPodiumStyles(position) : 'bg-gradient-to-br from-card via-card/95 to-card border-border/50'} ${getPodiumGlow(position)} backdrop-blur-sm overflow-hidden`}>
        {/* Shimmer effect for podium cards */}
        {isPodium && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center space-x-4">
            {/* Rank */}
            <div className="flex flex-col items-center space-y-1">
              {isPodium ? (
                <motion.div 
                  className="text-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {getRankIcon(rank)}
                  <div className="text-sm font-bold mt-1 text-yellow-400">#{rank}</div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">#{rank}</div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className={`h-12 w-12 ${isPodium ? 'ring-2 ring-yellow-400 shadow-lg' : 'ring-1 ring-border'}`}>
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              {isPodium && (
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                </motion.div>
              )}
              
              {/* Floating particles for podium */}
              {isPodium && (
                <>
                  <motion.div
                    className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full opacity-60"
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60"
                    animate={{ 
                      y: [0, -8, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  />
                </>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors duration-300">
                  {user.name}
                </h3>
                {isPodium && (
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/40 text-yellow-400">
                    {position === 'first' ? '🥇 Champion' : 
                     position === 'second' ? '🥈 Runner Up' : 
                     '🥉 Third Place'}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Level {user.level}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getLevelColor(user.level)} backdrop-blur-sm`}
                >
                  {user.level >= 10 ? 'Elite' : 
                   user.level >= 7 ? 'Advanced' : 
                   user.level >= 4 ? 'Intermediate' : 'Beginner'}
                </Badge>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                {user.smiles.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Smiles</div>
              {user.score > 0 && (
                <div className="text-xs text-muted-foreground">
                  Score: {user.score.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Podium Special Effects */}
          {isPodium && (
            <motion.div 
              className="mt-3 pt-3 border-t border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-yellow-400 text-lg">
                    {position === 'first' ? '🏆' : position === 'second' ? '🥈' : '🥉'}
                  </div>
                  <div className="text-muted-foreground">Champion</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-400">
                    +{user.smiles > 1000 ? '1000+' : user.smiles} XP
                  </div>
                  <div className="text-muted-foreground">Experience</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-400">
                    {user.level >= 10 ? 'Elite' : user.level >= 7 ? 'Advanced' : 'Intermediate'}
                  </div>
                  <div className="text-muted-foreground">Status</div>
                </div>
              </div>
              
              {/* Celebration particles for podium */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    initial={{ 
                      x: '50%', 
                      y: '50%', 
                      opacity: 1 
                    }}
                    animate={{ 
                      x: `${50 + (Math.cos(i * 45 * Math.PI / 180) * 80)}%`,
                      y: `${50 + (Math.sin(i * 45 * Math.PI / 180) * 80)}%`,
                      opacity: 0
                    }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 