'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileBadges } from '@/components/profile/ProfileBadges';
import { ProfileActivities } from '@/components/profile/ProfileActivities';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User as UserIcon,
  Trophy, 
  Activity, 
  Settings, 
  Wallet,
  Award,
  Calendar,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load user profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Stats Cards */}
      <ProfileStats user={user} />

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bio Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  About Me
                </h3>
                <p className="text-muted-foreground mb-4">{user.bio}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communities */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Communities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Joined</h4>
                    <div className="text-2xl font-bold">{user.communitiesJoined.length}</div>
                    <p className="text-sm text-muted-foreground">Communities</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Created</h4>
                    <div className="text-2xl font-bold">{user.communitiesCreated.length}</div>
                    <p className="text-sm text-muted-foreground">Communities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <span className="font-bold">{user.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="font-bold">{user.score.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Friends</span>
                    <span className="font-bold">{user.friends}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Badges</span>
                    <span className="font-bold">{user.badges.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Member Since
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <ProfileBadges badges={user.badges} />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <ProfileActivities activities={user.recentActivities} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings user={user} onUpdate={setUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 