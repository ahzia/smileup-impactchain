'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Trophy, 
  Users, 
  Target,
  Heart,
  Star,
  Award,
  Calendar
} from 'lucide-react';

interface Activity {
  activity: string;
  time: string;
}

interface ProfileActivitiesProps {
  activities: Activity[];
}

export const ProfileActivities: React.FC<ProfileActivitiesProps> = ({ activities }) => {
  const getActivityIcon = (activity: string) => {
    if (activity.includes('Completed')) return <Trophy className="h-4 w-4 text-green-500" />;
    if (activity.includes('Earned')) return <Star className="h-4 w-4 text-yellow-500" />;
    if (activity.includes('Joined')) return <Users className="h-4 w-4 text-blue-500" />;
    if (activity.includes('Created')) return <Target className="h-4 w-4 text-purple-500" />;
    if (activity.includes('Donated')) return <Heart className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getActivityColor = (activity: string) => {
    if (activity.includes('Completed')) return 'bg-green-100 text-green-800 border-green-200';
    if (activity.includes('Earned')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (activity.includes('Joined')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (activity.includes('Created')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (activity.includes('Donated')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActivityType = (activity: string) => {
    if (activity.includes('Completed')) return 'Mission';
    if (activity.includes('Earned')) return 'Reward';
    if (activity.includes('Joined')) return 'Community';
    if (activity.includes('Created')) return 'Creation';
    if (activity.includes('Donated')) return 'Donation';
    return 'Activity';
  };

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activities.length}</div>
            <div className="text-sm text-muted-foreground">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.activity.includes('Completed')).length}
            </div>
            <div className="text-sm text-muted-foreground">Missions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activities.filter(a => a.activity.includes('Joined')).length}
            </div>
            <div className="text-sm text-muted-foreground">Communities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activities.filter(a => a.activity.includes('Created')).length}
            </div>
            <div className="text-sm text-muted-foreground">Created</div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📅 Activity Timeline</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.activity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm">{activity.activity}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getActivityColor(activity.activity)}`}
                      >
                        {getActivityType(activity.activity)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Trophy className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.activity.includes('Completed')).length}
            </div>
            <div className="text-sm text-muted-foreground">Missions Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {activities.filter(a => a.activity.includes('Earned')).length}
            </div>
            <div className="text-sm text-muted-foreground">Rewards Earned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {activities.filter(a => a.activity.includes('Joined')).length}
            </div>
            <div className="text-sm text-muted-foreground">Communities Joined</div>
          </CardContent>
        </Card>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
          <p className="text-muted-foreground">
            Start completing missions and joining communities to see your activity here!
          </p>
        </div>
      )}
    </div>
  );
}; 