'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Award, 
  Crown,
  Target,
  Heart,
  Zap,
  Shield
} from 'lucide-react';

interface ProfileBadgesProps {
  badges: string[];
}

export const ProfileBadges: React.FC<ProfileBadgesProps> = ({ badges }) => {
  const badgeData = [
    {
      name: 'Early Adopter',
      description: 'One of the first users to join SmileUp',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rarity: 'Rare'
    },
    {
      name: 'Community Leader',
      description: 'Created and managed successful communities',
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      rarity: 'Epic'
    },
    {
      name: 'Eco Warrior',
      description: 'Completed 10+ environmental missions',
      icon: <Target className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 text-green-800 border-green-200',
      rarity: 'Common'
    },
    {
      name: 'Mission Master',
      description: 'Completed 50+ missions successfully',
      icon: <Trophy className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      rarity: 'Rare'
    },
    {
      name: 'Health Champion',
      description: 'Contributed to healthcare and wellness initiatives',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      color: 'bg-red-100 text-red-800 border-red-200',
      rarity: 'Epic'
    },
    {
      name: 'Tech Innovator',
      description: 'Led technology and innovation projects',
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      rarity: 'Rare'
    },
    {
      name: 'Digital Nomad',
      description: 'Active across multiple digital communities',
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      rarity: 'Common'
    },
    {
      name: 'Top Contributor',
      description: 'Among the top contributors in the platform',
      icon: <Award className="h-6 w-6 text-pink-500" />,
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      rarity: 'Legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Epic':
        return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'Rare':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const earnedBadges = badgeData.filter(badge => badges.includes(badge.name));
  const unearnedBadges = badgeData.filter(badge => !badges.includes(badge.name));

  return (
    <div className="space-y-6">
      {/* Badge Summary */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Badge Collection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{badges.length}</div>
            <div className="text-sm text-muted-foreground">Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{badgeData.length - badges.length}</div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((badges.length / badgeData.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {earnedBadges.filter(b => b.rarity === 'Epic' || b.rarity === 'Legendary').length}
            </div>
            <div className="text-sm text-muted-foreground">Rare+</div>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🏆 Earned Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {earnedBadges.map((badge, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {badge.icon}
                </div>
                <h4 className="font-semibold text-lg mb-2">{badge.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {badge.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${badge.color}`}
                  >
                    {badge.name}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(badge.rarity)}`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Unearned Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🎯 Available Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unearnedBadges.map((badge, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow opacity-60">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 opacity-50">
                  {badge.icon}
                </div>
                <h4 className="font-semibold text-lg mb-2">{badge.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {badge.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gray-100 text-gray-600 border-gray-200"
                  >
                    Locked
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(badge.rarity)}`}
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {badges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold mb-2">No badges yet</h3>
          <p className="text-muted-foreground">
            Complete missions and contribute to communities to earn badges!
          </p>
        </div>
      )}
    </div>
  );
}; 