'use client';

import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { MissionCard } from '@/components/missions/MissionCard';
import { MissionFilter } from '@/components/missions/MissionFilter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Trophy, Users, Target } from 'lucide-react';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
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
    if (filter.type !== 'all' && mission.category !== filter.type) return false;
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Missions</h1>
            <p className="text-muted-foreground mt-2">
              Complete missions to earn smiles and make a difference
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,450</div>
              <div className="text-sm text-muted-foreground">Total Smiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">12</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">Daily</span>
            </div>
            <div className="text-2xl font-bold mt-2">{dailyMissions.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Weekly</span>
            </div>
            <div className="text-2xl font-bold mt-2">{weeklyMissions.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Featured</span>
            </div>
            <div className="text-2xl font-bold mt-2">{featuredMissions.length}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2">68%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <MissionFilter filter={filter} onFilterChange={setFilter} />

      {/* Missions Tabs */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredMissions.length})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({dailyMissions.length})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({weeklyMissions.length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({featuredMissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAccept={handleAcceptMission}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAccept={handleAcceptMission}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAccept={handleAcceptMission}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAccept={handleAcceptMission}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No missions found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for new missions.
          </p>
        </div>
      )}
    </div>
  );
} 