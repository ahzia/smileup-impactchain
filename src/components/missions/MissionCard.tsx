'use client';

import React, { useState } from 'react';
import { Mission } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Trophy, 
  Target, 
  CheckCircle, 
  PlayCircle, 
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  Flame,
  Heart,
  Shield,
  Sword,
  Crown,
  Gem
} from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onAccept: (missionId: string) => void;
  onComplete: (missionId: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onAccept, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-white shadow-lg';
      case 'accepted':
        return 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-white shadow-lg';
      case 'available':
        return 'bg-gradient-to-r from-primary via-primary/80 to-primary/90 text-primary-foreground shadow-lg';
      default:
        return 'bg-gradient-to-r from-muted via-muted/80 to-muted/90 text-muted-foreground shadow-lg';
    }
  };

  const getEffortLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 text-white shadow-md';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 text-white shadow-md';
      case 'High':
        return 'bg-gradient-to-r from-red-400 via-pink-300 to-red-500 text-white shadow-md';
      default:
        return 'bg-gradient-to-r from-muted via-muted/80 to-muted/90 text-muted-foreground shadow-md';
    }
  };

  const getProgressPercentage = () => {
    if (mission.steps && mission.currentStep !== undefined) {
      return (mission.currentStep / mission.steps) * 100;
    }
    return mission.progress === 'Completed' ? 100 : 0;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  const getEffortIcon = (level: string) => {
    switch (level) {
      case 'Low':
        return <Star className="h-3 w-3" />;
      case 'Medium':
        return <Zap className="h-3 w-3" />;
      case 'High':
        return <Award className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getMissionIcon = (icon: string) => {
    // Enhanced icon mapping with better visual design
    const iconMap: { [key: string]: React.ReactNode } = {
      '🎯': <Target className="h-6 w-6 text-primary" />,
      '🏆': <Trophy className="h-6 w-6 text-yellow-400" />,
      '⚡': <Zap className="h-6 w-6 text-blue-400" />,
      '🔥': <Flame className="h-6 w-6 text-red-400" />,
      '❤️': <Heart className="h-6 w-6 text-pink-400" />,
      '🛡️': <Shield className="h-6 w-6 text-indigo-400" />,
      '⚔️': <Sword className="h-6 w-6 text-muted-foreground" />,
      '👑': <Crown className="h-6 w-6 text-yellow-500" />,
      '⭐': <Star className="h-6 w-6 text-yellow-400" />,
      '🎖️': <Award className="h-6 w-6 text-primary" />,
    };

    return iconMap[icon] || <span className="text-2xl">{icon}</span>;
  };

  const getCardGradient = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-emerald-500/10 via-green-400/5 to-emerald-600/10';
      case 'accepted':
        return 'from-blue-500/10 via-cyan-400/5 to-blue-600/10';
      case 'available':
        return 'from-primary/10 via-primary/5 to-primary/10';
      default:
        return 'from-muted/10 via-muted/5 to-muted/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      {/* Desktop-only enhanced background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 lg:group-hover:blur-2xl lg:group-hover:from-primary/30 lg:group-hover:to-primary/30"
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
      
      {/* Desktop-only corner accents */}
      <div className="hidden lg:block absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="hidden lg:block absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
      
      <Card className="relative border border-border/50 bg-gradient-to-br from-card via-card/95 to-card overflow-hidden shadow-lg hover:shadow-2xl lg:group-hover:shadow-3xl transition-all duration-500 cursor-pointer backdrop-blur-sm lg:group-hover:backdrop-blur-md"
            onClick={() => setIsExpanded(!isExpanded)}>
        
        {/* Simple gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(mission.status)} opacity-0 group-hover:opacity-100 lg:group-hover:opacity-150 transition-opacity duration-500`} />
        
        {/* Compact View */}
        <div className="relative p-4 lg:p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <motion.div 
                className="relative p-3 lg:p-4 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 border border-primary/30 shadow-lg backdrop-blur-sm lg:group-hover:shadow-xl lg:group-hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center lg:group-hover:scale-110 transition-transform duration-300">
                  {getMissionIcon(mission.icon)}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg lg:group-hover:shadow-xl transition-all duration-300"
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-2 w-2 lg:h-3 lg:w-3 text-primary-foreground" />
                </motion.div>
                
                {/* Desktop-only enhanced floating particles */}
                <motion.div
                  className="absolute -top-2 -left-2 w-2 h-2 lg:w-3 lg:h-3 bg-yellow-400 rounded-full opacity-60 lg:group-hover:opacity-80 transition-opacity duration-300"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute -bottom-1 -right-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-400 rounded-full opacity-60 lg:group-hover:opacity-80 transition-opacity duration-300"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="hidden lg:block absolute top-1 -right-3 w-1 h-1 bg-green-400 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  animate={{ 
                    y: [0, -6, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 1.5 }}
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg lg:text-xl text-card-foreground line-clamp-1 group-hover:text-primary lg:group-hover:text-primary/90 transition-colors duration-300">
                  {mission.title}
                </h3>
                <div className="flex items-center space-x-2 lg:space-x-3 mt-1 lg:mt-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs lg:text-sm font-semibold px-2 py-0.5 lg:px-3 lg:py-1 ${getStatusColor(mission.status)} backdrop-blur-sm lg:group-hover:shadow-md transition-all duration-300`}
                  >
                    {mission.status}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs lg:text-sm font-semibold px-2 py-0.5 lg:px-3 lg:py-1 ${getEffortLevelColor(mission.effortLevel)} backdrop-blur-sm lg:group-hover:shadow-md transition-all duration-300`}
                  >
                    {getEffortIcon(mission.effortLevel)}
                    <span className="ml-1">{mission.effortLevel}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <motion.div 
                className="flex items-center space-x-1 text-yellow-400 bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border border-yellow-500/40 px-3 py-1 lg:px-4 lg:py-2 rounded-lg backdrop-blur-sm lg:group-hover:shadow-lg lg:group-hover:border-yellow-400/60 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="lg:group-hover:scale-110 transition-transform duration-300"
                >
                  <Trophy className="h-4 w-4 lg:h-5 lg:w-5" />
                </motion.div>
                <span className="font-bold text-sm lg:text-base">{mission.reward}</span>
              </motion.div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground lg:group-hover:text-primary transition-colors duration-300"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4 lg:h-5 lg:w-5" /> : <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5" />}
              </motion.div>
            </div>
          </div>

          {/* Progress Bar (always visible) */}
          {mission.steps && (
            <div className="mt-3 lg:mt-4">
              <div className="flex items-center justify-between text-xs lg:text-sm mb-1 lg:mb-2">
                <span className="text-muted-foreground lg:group-hover:text-muted-foreground/80 transition-colors duration-300">Progress</span>
                <span className="font-semibold text-primary lg:group-hover:text-primary/90 transition-colors duration-300">
                  {mission.currentStep || 0} / {mission.steps}
                </span>
              </div>
              <div className="relative">
                <Progress value={getProgressPercentage()} className="h-2 lg:h-3 bg-muted/50 backdrop-blur-sm lg:group-hover:bg-muted/70 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-full lg:group-hover:from-primary/40 lg:group-hover:to-primary/40 transition-all duration-300"></div>
                
                {/* Animated progress glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent rounded-full lg:group-hover:from-primary/50 lg:group-hover:to-transparent transition-all duration-300"
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scaleX: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ 
                    transformOrigin: 'left',
                    width: `${getProgressPercentage()}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border/50 relative z-10"
            >
              <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* Description */}
                <div className="p-3 lg:p-4 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-lg lg:rounded-xl border border-border/50 backdrop-blur-sm lg:group-hover:shadow-md lg:group-hover:border-border/70 transition-all duration-300">
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed lg:group-hover:text-muted-foreground/90 transition-colors duration-300">
                    {mission.description}
                  </p>
                </div>

                {/* Community */}
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border border-blue-500/40 rounded-lg lg:rounded-xl backdrop-blur-sm lg:group-hover:shadow-md lg:group-hover:border-blue-400/60 lg:group-hover:from-blue-500/25 lg:group-hover:to-blue-500/25 transition-all duration-300">
                  <div className="relative">
                    {mission.community ? (
                      <>
                        <img 
                          src={mission.community.logo} 
                          alt={mission.community.name}
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white/50 shadow-md lg:group-hover:shadow-lg lg:group-hover:border-white/70 transition-all duration-300"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border border-white lg:group-hover:bg-green-400 transition-colors duration-300"></div>
                      </>
                    ) : (
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-muted border-2 border-white/50 shadow-md lg:group-hover:shadow-lg lg:group-hover:border-white/70 transition-all duration-300 flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-semibold text-muted-foreground">C</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm lg:text-base text-blue-600 lg:group-hover:text-blue-500 transition-colors duration-300">
                      {mission.community?.name || 'Community Mission'}
                    </h4>
                    <p className="text-xs lg:text-sm text-blue-600/70 lg:group-hover:text-blue-500/80 transition-colors duration-300">
                      {mission.category} • {mission.requiredTime}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-500/10 border border-orange-500/30 rounded-lg lg:rounded-xl backdrop-blur-sm lg:group-hover:shadow-md lg:group-hover:border-orange-400/50 lg:group-hover:from-orange-500/15 lg:group-hover:to-orange-500/15 transition-all duration-300">
                  <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600 lg:group-hover:text-orange-500 transition-colors duration-300" />
                  <span className="text-xs lg:text-sm text-orange-600 lg:group-hover:text-orange-500 transition-colors duration-300">
                    Deadline: {formatDeadline(mission.deadline)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 lg:space-x-3">
                  {mission.status === 'available' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept(mission.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base shadow-lg lg:shadow-xl lg:group-hover:shadow-2xl transition-all duration-300"
                    >
                      Accept Mission
                    </motion.button>
                  )}
                  {mission.status === 'accepted' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(mission.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base shadow-lg lg:shadow-xl lg:group-hover:shadow-2xl transition-all duration-300"
                    >
                      Complete Mission
                    </motion.button>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}; 