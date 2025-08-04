'use client';

import React from 'react';
import { Mission } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Trophy, 
  Target, 
  CheckCircle, 
  PlayCircle, 
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onAccept: (missionId: string) => void;
  onComplete: (missionId: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onAccept, onComplete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'available':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffortLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{mission.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2">{mission.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(mission.status)}`}
                >
                  {mission.status}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getEffortLevelColor(mission.effortLevel)}`}
                >
                  {mission.effortLevel}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-600">
            <Trophy className="h-4 w-4" />
            <span className="font-bold">{mission.reward}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {mission.description}
        </p>

        {/* Community */}
        <div className="flex items-center space-x-2">
          <img 
            src={mission.community.logo} 
            alt={mission.community.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{mission.community.name}</span>
        </div>

        {/* Progress */}
        {mission.steps && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {mission.currentStep || 0} / {mission.steps}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{mission.requiredTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDeadline(mission.deadline)}</span>
          </div>
        </div>

        {/* Proof Required */}
        {mission.proofRequired && (
          <div className="flex items-center space-x-2 text-sm">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-orange-600">Proof required</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {mission.status === 'available' && (
            <Button 
              onClick={() => onAccept(mission.id)}
              className="flex-1"
              size="sm"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
          )}
          
          {mission.status === 'accepted' && (
            <Button 
              onClick={() => onComplete(mission.id)}
              className="flex-1"
              size="sm"
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
          
          {mission.status === 'completed' && (
            <Button 
              className="flex-1"
              size="sm"
              variant="outline"
              disabled
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 