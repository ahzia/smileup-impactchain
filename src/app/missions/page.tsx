'use client';

import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { MissionCard } from '@/components/missions/MissionCard';
import { MissionFilter } from '@/components/missions/MissionFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Trophy, Users, Target, Sparkles, Zap, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    effortLevel: 'all'
  });

  // Load missions from API
  useEffect(() => {
    const loadMissions = async () => {
      try {
        const response = await fetch('/api/missions');
        const data = await response.json();
        
        if (data.success && data.data) {
          setMissions(data.data);
        }
      } catch (error) {
        console.error('Error loading missions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, []);

  // Filter missions based on current filter
  const filteredMissions = missions.filter(mission => {
    if (filter.status !== 'all' && mission.status !== filter.status) return false;
    if (filter.effortLevel !== 'all' && mission.effortLevel !== filter.effortLevel) return false;
    return true;
  });

  // Group missions by category
  const dailyMissions = filteredMissions.filter(m => m.category === 'daily');
  const weeklyMissions = filteredMissions.filter(m => m.category === 'weekly');
  const featuredMissions = filteredMissions.filter(m => m.category === 'featured');

  const handleAcceptMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setMissions(prev => prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: 'accepted' as const }
            : mission
        ));
      }
    } catch (error) {
      console.error('Error accepting mission:', error);
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update local state
        setMissions(prev => prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: 'completed' as const, progress: 'Completed' as const }
            : mission
        ));
      }
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, Math.random() * window.innerWidth],
                y: [0, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Beautiful Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-3 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 rounded-xl border border-primary/30 backdrop-blur-sm">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="p-3 bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Missions
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Embark on epic missions, complete challenges, and earn rewards. 
            Every mission brings you closer to making a positive impact in the world.
          </motion.p>
          
          {/* Stats Row */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="h-5 w-5 text-green-400" />
              </motion.div>
              <span className="text-sm font-semibold text-green-400">
                {missions.filter(m => m.status === 'completed').length} Completed
              </span>
            </div>
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border border-blue-500/30 rounded-lg backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Clock className="h-5 w-5 text-blue-400" />
              </motion.div>
              <span className="text-sm font-semibold text-blue-400">
                {missions.filter(m => m.status === 'accepted').length} In Progress
              </span>
            </div>
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border border-primary/30 rounded-lg backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Award className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm font-semibold text-primary">
                {missions.filter(m => m.status === 'available').length} Available
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter */}
        <motion.div 
          className="flex justify-end mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <MissionFilter filter={filter} onFilterChange={setFilter} />
        </motion.div>

        {/* Missions Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-card via-card/95 to-card border border-border/50 backdrop-blur-sm shadow-lg">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md backdrop-blur-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  All ({filteredMissions.length})
                </motion.div>
              </TabsTrigger>
              <TabsTrigger 
                value="daily" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md backdrop-blur-sm"
              >
                Daily ({dailyMissions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="weekly" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md backdrop-blur-sm"
              >
                Weekly ({weeklyMissions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md backdrop-blur-sm"
              >
                Featured ({featuredMissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {filteredMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <MissionCard
                      mission={mission}
                      onAccept={handleAcceptMission}
                      onComplete={handleCompleteMission}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="daily" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {dailyMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <MissionCard
                      mission={mission}
                      onAccept={handleAcceptMission}
                      onComplete={handleCompleteMission}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {weeklyMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <MissionCard
                      mission={mission}
                      onAccept={handleAcceptMission}
                      onComplete={handleCompleteMission}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {featuredMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <MissionCard
                      mission={mission}
                      onAccept={handleAcceptMission}
                      onComplete={handleCompleteMission}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {filteredMissions.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No missions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new missions.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 