'use client';

import React from 'react';
import { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Users, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Star,
  Heart
} from 'lucide-react';

interface ProfileStatsProps {
  user: User;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const stats = [
    {
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      label: 'Level',
      value: user.level,
      subtitle: 'Current Level',
      color: 'text-yellow-600'
    },
    {
      icon: <Award className="h-5 w-5 text-blue-500" />,
      label: 'Score',
      value: user.score.toLocaleString(),
      subtitle: 'Total Points',
      color: 'text-blue-600'
    },
    {
      icon: <Users className="h-5 w-5 text-green-500" />,
      label: 'Friends',
      value: user.friends,
      subtitle: 'Connections',
      color: 'text-green-600'
    },
    {
      icon: <Star className="h-5 w-5 text-purple-500" />,
      label: 'Badges',
      value: user.badges.length,
      subtitle: 'Earned',
      color: 'text-purple-600'
    },
    {
      icon: <Target className="h-5 w-5 text-orange-500" />,
      label: 'Communities',
      value: user.communitiesJoined.length,
      subtitle: 'Joined',
      color: 'text-orange-600'
    },
    {
      icon: <Heart className="h-5 w-5 text-red-500" />,
      label: 'Created',
      value: user.communitiesCreated.length,
      subtitle: 'Communities',
      color: 'text-red-600'
    }
  ];

  const getLevelProgress = () => {
    const currentLevel = user.level;
    const nextLevel = currentLevel + 1;
    const progress = ((user.score % 1000) / 1000) * 100;
    return { currentLevel, nextLevel, progress };
  };

  const { currentLevel, nextLevel, progress } = getLevelProgress();

  return (
    <div className="mb-8">
      {/* Level Progress */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Level Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.score % 1000} / 1000 XP to next level
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Level {currentLevel} → {nextLevel}
          </Badge>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Level {currentLevel}</span>
          <span>Level {nextLevel}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.subtitle}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Since */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-semibold">Member Since</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-semibold">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 