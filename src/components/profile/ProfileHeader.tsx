'use client';

import React from 'react';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit, 
  Wallet, 
  TrendingUp, 
  Award,
  Crown,
  Star
} from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100 border-purple-200';
    if (level >= 7) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (level >= 4) return 'text-green-600 bg-green-100 border-green-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Elite';
    if (level >= 7) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getLevelColor(user.level)}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Lv.{user.level}
                </Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getLevelColor(user.level)}`}
                >
                  {getLevelTitle(user.level)}
                </Badge>
                {user.level >= 10 && (
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Elite
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Wallet and Stats */}
          <div className="flex-1 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Smiles Wallet */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">Smiles Wallet</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {user.smiles.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Available Smiles</p>
              </CardContent>
            </Card>

            {/* Score */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Total Score</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {user.score.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Achievement Points</p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Badges</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {user.badges.length}
                </div>
                <p className="text-sm text-muted-foreground">Earned Badges</p>
              </CardContent>
            </Card>
          </div>

          {/* Edit Button */}
          <div className="flex-shrink-0">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 