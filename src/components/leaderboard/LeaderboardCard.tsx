'use client';

import React from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  TrendingUp,
  Crown
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
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 shadow-lg scale-105';
      case 'second':
        return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 shadow-md scale-102';
      case 'third':
        return 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300 shadow-md scale-101';
      default:
        return 'bg-card border';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100';
    if (level >= 7) return 'text-blue-600 bg-blue-100';
    if (level >= 4) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isPodium ? getPodiumStyles(position) : 'bg-card border'}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="flex flex-col items-center space-y-1">
            {isPodium ? (
              <div className="text-center">
                {getRankIcon(rank)}
                <div className="text-sm font-bold mt-1">#{rank}</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">#{rank}</div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative">
            <Avatar className={`h-12 w-12 ${isPodium ? 'ring-2 ring-yellow-400' : ''}`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isPodium && (
              <div className="absolute -top-1 -right-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{user.name}</h3>
              {isPodium && (
                <Badge variant="outline" className="text-xs">
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
                className={`text-xs ${getLevelColor(user.level)}`}
              >
                {user.level >= 10 ? 'Elite' : 
                 user.level >= 7 ? 'Advanced' : 
                 user.level >= 4 ? 'Intermediate' : 'Beginner'}
              </Badge>
            </div>
          </div>

          {/* Score */}
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
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
          <div className="mt-3 pt-3 border-t border-muted">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-primary">
                  {position === 'first' ? '🏆' : position === 'second' ? '🥈' : '🥉'}
                </div>
                <div className="text-muted-foreground">Champion</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  +{user.smiles > 1000 ? '1000+' : user.smiles} XP
                </div>
                <div className="text-muted-foreground">Experience</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {user.level >= 10 ? 'Elite' : user.level >= 7 ? 'Advanced' : 'Intermediate'}
                </div>
                <div className="text-muted-foreground">Status</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 