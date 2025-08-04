'use client';

import React from 'react';
import { Reward } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ShoppingCart, 
  Gift, 
  Star, 
  Coins, 
  Calendar,
  CheckCircle,
  Heart,
  Award,
  MapPin
} from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  userSmiles: number;
  onPurchase: (rewardId: string, cost: number) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, userSmiles, onPurchase }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'experience':
        return <MapPin className="h-4 w-4" />;
      case 'certificate':
        return <Award className="h-4 w-4" />;
      case 'digital':
        return <Star className="h-4 w-4" />;
      case 'merchandise':
        return <Gift className="h-4 w-4" />;
      case 'voucher':
        return <Coins className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'certificate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'digital':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'merchandise':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'voucher':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canAfford = userSmiles >= reward.cost;
  const isOwned = reward.owned;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{reward.emoji}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2">{reward.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getTypeColor(reward.type)}`}
                >
                  {getTypeIcon(reward.type)}
                  <span className="ml-1 capitalize">{reward.type}</span>
                </Badge>
                {isOwned && (
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Owned
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-600">
            <Coins className="h-4 w-4" />
            <span className="font-bold">{reward.cost}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image */}
        <div className="relative">
          <img 
            src={reward.imageUrl} 
            alt={reward.title}
            className="w-full h-32 object-cover rounded-lg"
          />
          {isOwned && (
            <div className="absolute top-2 right-2">
              <CheckCircle className="h-6 w-6 text-green-500 fill-green-500" />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {reward.description}
        </p>

        {/* Provider */}
        <div className="flex items-center space-x-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={reward.community.logo} alt={reward.provider} />
            <AvatarFallback className="text-xs">
              {reward.provider.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{reward.provider}</span>
        </div>

        {/* Validity */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{reward.validity}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {!isOwned && (
            <>
              <Button 
                onClick={() => onPurchase(reward.id, reward.cost)}
                className="flex-1"
                size="sm"
                disabled={!canAfford}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {canAfford ? 'Purchase' : 'Not Enough Smiles'}
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {isOwned && (
            <Button 
              className="flex-1"
              size="sm"
              variant="outline"
              disabled
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Owned
            </Button>
          )}
        </div>

        {/* Price Indicator */}
        {!canAfford && !isOwned && (
          <div className="text-center text-sm text-red-600">
            Need {reward.cost - userSmiles} more Smiles
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 