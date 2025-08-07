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
  Zap,
  Globe,
  Star
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
                    <UserIcon className="h-5 w-5 mr-2" />
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
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Wallet Section - Enhanced */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <Wallet className="h-5 w-5 md:h-7 md:w-7 mr-2 md:mr-3 text-primary" />
              Digital Wallets
            </h2>
            <Badge variant="outline" className="text-xs md:text-sm font-semibold bg-primary/10 border-primary/30 text-primary">
              Secure & Fast
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Option 1: Custodial Wallet */}
            <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-blue-600 flex items-center">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                  In-App Wallet
                </h3>
                <Badge variant="outline" className="text-xs font-semibold bg-blue-500/10 border-blue-500/30 text-blue-600">
                  Recommended
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm leading-relaxed">
                Quick and secure wallet built into the app. Perfect for beginners and daily use.
              </p>
              <CustodialWalletConnect />
            </div>
            
            {/* Option 2: WalletConnect */}
            <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-green-600 flex items-center">
                  <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                  External Wallet
                </h3>
                <Badge variant="outline" className="text-xs font-semibold bg-green-500/10 border-green-500/30 text-green-600">
                  Advanced
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm leading-relaxed">
                Connect your existing wallet for full control and advanced features.
              </p>
              <WalletConnect />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ProfileStats user={user} />

        {/* Profile Tabs - Enhanced */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 md:mt-10">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-xl md:rounded-2xl p-1 h-12 md:h-14">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="badges" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm"
            >
              Badges
            </TabsTrigger>
            <TabsTrigger 
              value="activities" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 md:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Bio Section - Enhanced */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold flex items-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <UserIcon className="h-5 w-5 md:h-7 md:w-7 mr-2 md:mr-3 text-primary" />
                      About Me
                    </h3>
                    <Badge variant="outline" className="text-xs md:text-sm font-semibold bg-primary/10 border-primary/30 text-primary">
                      Profile
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base leading-relaxed">{user.bio}</p>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="font-bold text-base md:text-lg flex items-center text-foreground">
                      <Star className="h-4 w-4 md:h-6 md:w-6 mr-2 md:mr-3 text-yellow-500" />
                      Interests & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {user.interests.map((interest, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30 font-semibold hover:scale-105 transition-transform duration-200"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Communities - Enhanced */}
                <div className="bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold flex items-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <Users className="h-5 w-5 md:h-7 md:w-7 mr-2 md:mr-3 text-primary" />
                      Communities
                    </h3>
                    <Badge variant="outline" className="text-xs md:text-sm font-semibold bg-primary/10 border-primary/30 text-primary">
                      {user.communitiesJoined.length + user.communitiesCreated.length} Total
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="text-center p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl md:rounded-2xl border border-green-200/50 dark:border-green-700/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-center mb-2 md:mb-3">
                        <Users className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-green-600 dark:text-green-400" />
                        <h4 className="font-bold text-sm md:text-base text-green-700 dark:text-green-300">Joined</h4>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 md:mb-2">{user.communitiesJoined.length}</div>
                      <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">Communities</p>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl md:rounded-2xl border border-blue-200/50 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-center mb-2 md:mb-3">
                        <Target className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-bold text-sm md:text-base text-blue-700 dark:text-blue-300">Created</h4>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 md:mb-2">{user.communitiesCreated.length}</div>
                      <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">Communities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats - Enhanced */}
              <div className="space-y-6 md:space-y-8">
                {/* Removed Quick Stats and Member Since sections as they're already displayed above */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-8">
            <ProfileBadges badges={user.badges} />
          </TabsContent>

          <TabsContent value="activities" className="mt-8">
            <ProfileActivities activities={user.recentActivities} />
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
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