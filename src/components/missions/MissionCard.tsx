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
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
      
      <Card className="relative border border-border/50 bg-gradient-to-br from-card via-card/95 to-card overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm"
            onClick={() => setIsExpanded(!isExpanded)}>
        
        {/* Simple gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(mission.status)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Compact View */}
        <div className="relative p-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="relative p-3 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 border border-primary/30 shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center">
                  {getMissionIcon(mission.icon)}
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-2 w-2 text-primary-foreground" />
                </motion.div>
                
                {/* Floating particles */}
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
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
                  {mission.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-semibold px-2 py-0.5 ${getStatusColor(mission.status)} backdrop-blur-sm`}
                  >
                    {mission.status}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-semibold px-2 py-0.5 ${getEffortLevelColor(mission.effortLevel)} backdrop-blur-sm`}
                  >
                    {getEffortIcon(mission.effortLevel)}
                    <span className="ml-1">{mission.effortLevel}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.div 
                className="flex items-center space-x-1 text-yellow-400 bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border border-yellow-500/40 px-3 py-1 rounded-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="h-4 w-4" />
                </motion.div>
                <span className="font-bold text-sm">{mission.reward}</span>
              </motion.div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </motion.div>
            </div>
          </div>

          {/* Progress Bar (always visible) */}
          {mission.steps && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">
                  {mission.currentStep || 0} / {mission.steps}
                </span>
              </div>
              <div className="relative">
                <Progress value={getProgressPercentage()} className="h-2 bg-muted/50 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 rounded-full"></div>
                
                {/* Animated progress glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent rounded-full"
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
              <CardContent className="p-4 space-y-4">
                {/* Description */}
                <div className="p-3 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 rounded-lg border border-border/50 backdrop-blur-sm">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                {/* Community */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border border-blue-500/40 rounded-lg backdrop-blur-sm">
                  <div className="relative">
                    {mission.community ? (
                      <>
                        <img 
                          src={mission.community.logo} 
                          alt={mission.community.name}
                          className="w-6 h-6 rounded-full border-2 border-blue-400 shadow-sm"
                        />
                        <motion.div 
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-card"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-blue-400 shadow-sm bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">S</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {mission.community ? mission.community.name : 'SmileUp'}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border border-blue-500/40 rounded-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="h-4 w-4 text-blue-400" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-semibold text-card-foreground">{mission.requiredTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-500/20 border border-orange-500/40 rounded-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="h-4 w-4 text-orange-400" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-semibold text-card-foreground">{formatDeadline(mission.deadline)}</p>
                    </div>
                  </div>
                </div>

                {/* Proof Required */}
                {mission.proofRequired && (
                  <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-500/20 border border-orange-500/40 rounded-lg backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertCircle className="h-4 w-4 text-orange-400" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-orange-400">Proof Required</p>
                      <p className="text-xs text-orange-300">Submit evidence to complete</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2">
                  <AnimatePresence>
                    {mission.status === 'available' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(mission.id);
                          }}
                          className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold py-2 shadow-lg backdrop-blur-sm"
                          size="sm"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                          </motion.div>
                          Accept Mission
                        </Button>
                      </motion.div>
                    )}
                    
                    {mission.status === 'accepted' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(mission.id);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 hover:from-green-600 hover:via-emerald-500 hover:to-green-700 text-white font-semibold py-2 shadow-lg backdrop-blur-sm"
                          size="sm"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                          </motion.div>
                          Complete Mission
                        </Button>
                      </motion.div>
                    )}
                    
                    {mission.status === 'completed' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-gradient-to-r from-green-500/20 via-emerald-400/15 to-green-500/20 border border-green-500/40 rounded-lg p-3 text-center backdrop-blur-sm"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        </motion.div>
                        <p className="text-sm font-semibold text-green-400 mb-1">Completed!</p>
                        <p className="text-xs text-green-300">+{mission.reward} Smiles earned</p>
                        
                        {/* Celebration particles */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                              initial={{ 
                                x: '50%', 
                                y: '50%', 
                                opacity: 1 
                              }}
                              animate={{ 
                                x: `${50 + (Math.cos(i * 60 * Math.PI / 180) * 100)}%`,
                                y: `${50 + (Math.sin(i * 60 * Math.PI / 180) * 100)}%`,
                                opacity: 0
                              }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}; 