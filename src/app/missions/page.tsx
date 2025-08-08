'use client';

import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { MissionCard } from '@/components/missions/MissionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Trophy, Users, Target, Sparkles, Zap, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LoadingSpinner, 
  AnimatedBackground, 
  PageHeader, 
  UniversalFilter,
  FilterSection,
  FilterState
} from '@/components/common';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>({
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

  // Filter configuration
  const filterSections: FilterSection[] = [
    {
      key: 'status',
      label: 'Status',
      icon: Target,
      options: [
        { value: 'all', label: 'All Status', icon: Target },
        { value: 'available', label: 'Available', icon: Target },
        { value: 'accepted', label: 'In Progress', icon: Clock },
        { value: 'completed', label: 'Completed', icon: Award }
      ],
      badgeColor: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40'
    },
    {
      key: 'effortLevel',
      label: 'Effort Level',
      icon: Award,
      options: [
        { value: 'all', label: 'All Levels', icon: Target },
        { value: 'Low', label: 'Low Effort', icon: Target },
        { value: 'Medium', label: 'Medium Effort', icon: Clock },
        { value: 'High', label: 'High Effort', icon: Award }
      ],
      badgeColor: 'bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-500/20 text-orange-400 border-orange-500/40'
    }
  ];

  // Header configuration
  const headerIcons = [
    { icon: Target, color: 'bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 border-primary/30' },
    { icon: Trophy, color: 'bg-gradient-to-br from-yellow-500/20 via-yellow-400/15 to-yellow-500/20 border-yellow-500/30' },
    { icon: Zap, color: 'bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/20 border-blue-500/30' }
  ];

  const headerStats = [
    { 
      icon: CheckCircle, 
      value: missions.filter(m => m.status === 'completed').length,
      color: 'bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 border-green-500/30 text-green-400'
    },
    { 
      icon: Clock, 
      value: missions.filter(m => m.status === 'accepted').length,
      color: 'bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 border-blue-500/30 text-blue-400'
    },
    { 
      icon: Target, 
      value: missions.filter(m => m.status === 'available').length,
      color: 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border-primary/30 text-primary'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <PageHeader
          icons={headerIcons}
          title="Missions"
          description="Embark on epic missions, complete challenges, and earn rewards"
          stats={headerStats}
          compact={true}
        />

        {/* Filter */}
        <motion.div 
          className="flex justify-end mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <UniversalFilter
            filter={filter}
            onFilterChange={setFilter}
            sections={filterSections}
            title="Filter Missions"
            description="Find your perfect mission"
            defaultValues={{ status: 'all', effortLevel: 'all' }}
          />
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