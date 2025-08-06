'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileBadges } from '@/components/profile/ProfileBadges';
import { ProfileActivities } from '@/components/profile/ProfileActivities';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { LoginModal } from '@/components/auth/LoginModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
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
  TrendingUp,
  LogIn,
  Sparkles,
  Heart,
  Lock
} from 'lucide-react';
import { 
  LoadingSpinner, 
  AnimatedBackground, 
  PageHeader 
} from '@/components/common';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Load user profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          // User not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden pb-20">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          {/* Header */}
          <PageHeader
            icons={[
              { icon: UserIcon, color: 'bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 border-primary/30' },
              { icon: Trophy, color: 'bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30' },
              { icon: Award, color: 'bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-purple-500/20 border-purple-500/30' }
            ]}
            title="Profile"
            description="Your impact journey and achievements"
            titleGradient="from-primary via-primary/90 to-primary"
          />

          {/* Login Prompt */}
          <motion.div 
            className="max-w-2xl mx-auto text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              👤
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to Your Profile
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Sign in to view your impact journey, track your progress, and manage your achievements.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 via-green-400/15 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Track Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your contributions and see the difference you're making
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Earn Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect badges and rewards for your community contributions
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Level Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Progress through levels and unlock new opportunities
                  </p>
                </motion.div>
              </div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold py-3 px-8 shadow-lg backdrop-blur-sm"
                  size="lg"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Continue
                </Button>
              </motion.div>

              {/* Demo Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-sm text-muted-foreground"
              >
                <p className="flex items-center justify-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try our demo account: demo@smileup.com / demo123
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
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
                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm">
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
                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm">
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
                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm">
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

                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-xl p-6 backdrop-blur-sm">
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
    </div>
  );
} 