'use client';

import React from 'react';
import { Reward } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Gift, 
  Star, 
  Coins, 
  Calendar,
  CheckCircle,
  Heart,
  Award,
  MapPin,
  Sparkles,
  Zap
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
        return 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40';
      case 'certificate':
        return 'bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 text-blue-400 border-blue-500/40';
      case 'digital':
        return 'bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 text-purple-400 border-purple-500/40';
      case 'merchandise':
        return 'bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-500/20 text-orange-400 border-orange-500/40';
      case 'voucher':
        return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-gradient-to-r from-gray-500/20 via-gray-400/15 to-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const canAfford = userSmiles >= reward.cost;
  const isOwned = reward.owned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20"
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
      
      <Card className="relative h-full bg-gradient-to-br from-card via-card/95 to-card border border-border/50 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {reward.emoji}
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {reward.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getTypeColor(reward.type)} backdrop-blur-sm`}
                  >
                    {getTypeIcon(reward.type)}
                    <span className="ml-1 capitalize">{reward.type}</span>
                  </Badge>
                  {isOwned && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Badge variant="outline" className="text-xs bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40 backdrop-blur-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Owned
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <motion.div 
              className="flex items-center space-x-1 text-yellow-600"
              animate={canAfford ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coins className="h-4 w-4" />
              <span className="font-bold">{reward.cost}</span>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            <motion.img 
              src={reward.imageUrl} 
              alt={reward.title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isOwned && (
              <motion.div 
                className="absolute top-2 right-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500 fill-green-500 drop-shadow-lg" />
              </motion.div>
            )}
            
            {/* Floating particles for owned items */}
            {isOwned && (
              <>
                <motion.div
                  className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full opacity-60"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60"
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {reward.description}
          </p>

          {/* Provider */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-5 h-5 ring-1 ring-border">
              <AvatarImage src={reward.community?.logo} alt={reward.provider || 'Provider'} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground">
                {reward.provider ? reward.provider.split(' ').map(n => n[0]).join('') : 'P'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{reward.provider || 'Provider'}</span>
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
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={() => onPurchase(reward.id, reward.cost)}
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground shadow-md"
                    size="sm"
                    disabled={!canAfford}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {canAfford ? 'Purchase' : 'Not Enough Smiles'}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="px-3 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border-border/50 hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </motion.div>
              </>
            )}
            
            {isOwned && (
              <motion.div 
                className="flex-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40 backdrop-blur-sm"
                  size="sm"
                  variant="outline"
                  disabled
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Owned
                </Button>
              </motion.div>
            )}
          </div>

          {/* Price Indicator */}
          {!canAfford && !isOwned && (
            <motion.div 
              className="text-center text-sm text-red-600 bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 border border-red-500/20 rounded-md py-1 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Need {reward.cost - (userSmiles || 0)} more Smiles
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 