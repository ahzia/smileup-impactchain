'use client';

import React from 'react';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  Edit, 
  TrendingUp, 
  Crown,
  LogOut,
  Shield,
  CheckCircle,
  Sparkles,
  Star,
  Sun,
  Moon
} from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
      // Redirect to home page after logout
      window.location.href = '/';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100 border-purple-200 shadow-purple-500/25 dark:bg-purple-900/20 dark:border-purple-700/30 dark:text-purple-300';
    if (level >= 7) return 'text-blue-600 bg-blue-100 border-blue-200 shadow-blue-500/25 dark:bg-blue-900/20 dark:border-blue-700/30 dark:text-blue-300';
    if (level >= 4) return 'text-green-600 bg-green-100 border-green-200 shadow-green-500/25 dark:bg-green-900/20 dark:border-green-700/30 dark:text-green-300';
    return 'text-gray-600 bg-gray-100 border-gray-200 shadow-gray-500/25 dark:bg-gray-800/20 dark:border-gray-600/30 dark:text-gray-300';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Elite';
    if (level >= 7) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    return 'Beginner';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl"></div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute top-4 right-8 w-2 h-2 bg-primary/30 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-6 left-12 w-1 h-1 bg-secondary/40 rounded-full"
          animate={{ 
            y: [0, 8, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8 relative z-10">
          {/* Avatar and Basic Info */}
          <motion.div 
            className="flex items-center space-x-6"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="h-28 w-28 ring-4 ring-primary/30 dark:ring-primary/50 shadow-2xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {/* Level Badge - Fixed positioning and styling */}
              <motion.div 
                className="absolute -bottom-1 -right-1"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  variant="outline" 
                  className={`text-xs font-bold ${getLevelColor(user.level)} shadow-lg px-2 py-1`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Lv.{user.level}
                </Badge>
              </motion.div>
              
              {/* Achievement sparkles */}
              {user.level >= 7 && (
                <motion.div
                  className="absolute -top-2 -left-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <div>
                <motion.h1 
                  className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {user.name}
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground flex items-center text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  {user.email}
                </motion.p>
              </div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Badge 
                  variant="outline" 
                  className={`text-sm font-bold ${getLevelColor(user.level)}`}
                >
                  {getLevelTitle(user.level)}
                </Badge>
                {user.level >= 10 && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="outline" className="text-sm bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 text-yellow-800 border-yellow-300 font-bold dark:from-yellow-400/10 dark:to-yellow-600/10 dark:text-yellow-300 dark:border-yellow-600/30">
                      <Crown className="h-3 w-3 mr-1" />
                      Elite
                    </Badge>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="outline" className="text-sm bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 text-emerald-700 border-emerald-300 font-bold dark:from-emerald-400/10 dark:to-emerald-600/10 dark:text-emerald-300 dark:border-emerald-600/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex-shrink-0 flex space-x-3 lg:ml-auto"
            variants={itemVariants}
          >
            {/* Theme Toggle Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={toggleTheme}
                className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 font-semibold shadow-lg dark:bg-background/20 dark:border-border/50 dark:hover:bg-background/30"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90 font-semibold shadow-lg dark:bg-background/20 dark:border-border/50 dark:hover:bg-background/30"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 bg-background/80 backdrop-blur-sm font-semibold shadow-lg dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20 dark:border-red-700/50 dark:bg-background/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 