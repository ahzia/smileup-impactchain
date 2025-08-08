'use client';

import React from 'react';
import { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp,
  Award,
  Star,
  Heart,
  Zap,
  Sparkles,
  Crown,
  Medal,
  Target as TargetIcon,
  Flame,
  Calendar,
  Clock,
  TrendingUp as TrendingUpIcon,
  CheckCircle
} from 'lucide-react';

interface ProfileStatsProps {
  user: User;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const stats = [
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      label: 'Level',
      value: user.level,
      subtitle: 'Current Level',
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      glowColor: 'shadow-yellow-500/25',
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600'
    },
    {
      icon: <Award className="h-6 w-6 text-blue-500" />,
      label: 'Score',
      value: user.score.toLocaleString(),
      subtitle: 'Total Points',
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-400/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/25',
      gradient: 'from-blue-400 via-blue-500 to-blue-600'
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      label: 'Friends',
      value: user.friends,
      subtitle: 'Connections',
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-400/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/25',
      gradient: 'from-green-400 via-green-500 to-green-600'
    },
    {
      icon: <Star className="h-6 w-6 text-purple-500" />,
      label: 'Badges',
      value: user.badges.length,
      subtitle: 'Earned',
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-400/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/25',
      gradient: 'from-purple-400 via-purple-500 to-purple-600'
    },
    {
      icon: <TargetIcon className="h-6 w-6 text-orange-500" />,
      label: 'Communities',
      value: user.communitiesJoined.length,
      subtitle: 'Joined',
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      glowColor: 'shadow-orange-500/25',
      gradient: 'from-orange-400 via-orange-500 to-orange-600'
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      label: 'Created',
      value: user.communitiesCreated.length,
      subtitle: 'Communities',
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-400/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      glowColor: 'shadow-red-500/25',
      gradient: 'from-red-400 via-red-500 to-red-600'
    }
  ];

  const getLevelProgress = () => {
    const currentLevel = user.level;
    const nextLevel = currentLevel + 1;
    const progress = ((user.score % 1000) / 1000) * 100;
    return { currentLevel, nextLevel, progress };
  };

  const { currentLevel, nextLevel, progress } = getLevelProgress();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const achievements = [
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Level Achiever",
      description: `Reached Level ${user.level}`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      completed: true
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Social Butterfly",
      description: `${user.friends} friends connected`,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      completed: user.friends >= 5
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Badge Collector",
      description: `${user.badges.length} badges earned`,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      completed: user.badges.length >= 3
    },
    {
      icon: <TargetIcon className="h-5 w-5" />,
      title: "Community Leader",
      description: `${user.communitiesCreated.length} communities created`,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      completed: user.communitiesCreated.length >= 1
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Level Progress */}
      <motion.div 
        className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm mb-8 md:mb-10 relative overflow-hidden"
        variants={itemVariants}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold flex items-center mb-3 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <div className="relative mr-3 md:mr-4">
                  <Zap className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                Level Progress
              </h3>
              <p className="text-muted-foreground text-base md:text-lg font-medium">
                {user.score % 1000} / 1000 XP to next level
              </p>
            </div>
            <Badge variant="outline" className="text-sm font-bold bg-primary/10 border-primary/30 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg self-start md:self-auto">
              <Crown className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Level {currentLevel} → {nextLevel}
            </Badge>
          </div>
          
          <div className="relative">
            <div className="w-full bg-muted/30 rounded-full h-6 md:h-8 mb-3 md:mb-4 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-primary via-primary/90 to-secondary h-6 md:h-8 rounded-full relative"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-between text-sm md:text-base text-muted-foreground font-semibold">
              <span>Level {currentLevel}</span>
              <span>Level {nextLevel}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className={`hover:shadow-2xl transition-all duration-500 border-2 ${stat.borderColor} bg-gradient-to-br from-card via-card/95 to-card backdrop-blur-sm relative overflow-hidden group`}>
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-current opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <CardContent className="p-4 md:p-6 text-center relative z-10">
                <motion.div 
                  className={`flex justify-center mb-3 md:mb-4 p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.bgColor} mx-auto w-16 h-16 md:w-20 md:h-20 items-center border ${stat.borderColor} group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  {stat.icon}
                </motion.div>
                
                <motion.div 
                  className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1 md:mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                
                <div className="text-sm md:text-base font-bold text-foreground mb-1">
                  {stat.label}
                </div>
                
                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.subtitle}
                </div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute top-2 right-2 w-1 h-1 bg-current opacity-60 rounded-full"
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-3 w-1 h-1 bg-current opacity-40 rounded-full"
                    animate={{ 
                      y: [0, 8, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievement Timeline */}
      <motion.div 
        className="mt-8 md:mt-10"
        variants={containerVariants}
      >
        <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3">
            <div className="flex items-center">
              <div className="relative mr-3 md:mr-4">
                <Medal className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Achievements</h3>
            </div>
            <Badge variant="outline" className="text-xs md:text-sm font-semibold bg-primary/10 border-primary/30 text-primary self-start md:self-auto">
              {achievements.filter(a => a.completed).length}/{achievements.length} Complete
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 ${achievement.borderColor} ${achievement.bgColor} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className={`p-1.5 md:p-2 rounded-full ${achievement.bgColor} ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs md:text-sm text-foreground truncate">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {achievement.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-muted-foreground/30 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="mt-2 md:mt-3">
                  <div className="w-full bg-muted/30 rounded-full h-1.5 md:h-2">
                    <motion.div 
                      className={`h-1.5 md:h-2 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                      initial={{ width: 0 }}
                      animate={{ width: achievement.completed ? '100%' : '30%' }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Member since info - More compact */}
          <motion.div
            variants={itemVariants}
            className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl md:rounded-2xl border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-foreground">Member Since</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg md:text-xl font-bold text-primary">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-xs text-muted-foreground">days active</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 