'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileBadges } from '@/components/profile/ProfileBadges';
import { ProfileActivities } from '@/components/profile/ProfileActivities';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { CustodialWalletConnect } from '@/components/wallet/CustodialWalletConnect';
import { BalanceDisplay } from '@/components/wallet/BalanceDisplay';
import { WalletProvider } from '@/contexts/WalletContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
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
  Lock,
  User
} from 'lucide-react';
import { 
  LoadingSpinner, 
  AnimatedBackground, 
  PageHeader 
} from '@/components/common';

function ProfilePageContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLoginSuccess = (userData: User) => {
    // Auth context will handle the user state automatically
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = (userData: User) => {
    // Auth context will handle the user state automatically
    setShowRegisterModal(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 rounded-full flex items-center justify-center"
                >
                  <UserIcon className="h-12 w-12 text-primary" />
                </motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Sign In to Continue</h2>
                  <p className="text-muted-foreground">
                    Join the SmileUp community and start making a difference
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    size="lg"
                    className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary/80 hover:to-primary/90 text-primary-foreground font-semibold"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                  
                  <Button 
                    onClick={() => setShowRegisterModal(true)}
                    size="lg"
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Create Account
                  </Button>
                </div>
                
                <p className="flex items-center justify-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try our demo account: demo@smileup.com / demo123
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Login Modal */}
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />

          {/* Register Modal */}
          <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Wallet Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Blockchain Wallets
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Option 1: Custodial Wallet */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-600">Option 1: In-App Wallet</h3>
              <CustodialWalletConnect />
            </div>
            
            {/* Option 2: WalletConnect */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-green-600">Option 2: External Wallet</h3>
              <WalletConnect />
            </div>
          </div>
          
          {/* Balance Display */}
          <div className="mt-6">
            <BalanceDisplay />
          </div>
        </div>

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
            <ProfileSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <WalletProvider>
      <ProfilePageContent />
    </WalletProvider>
  );
} 