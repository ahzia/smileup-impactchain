'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Calendar, Users } from 'lucide-react';

interface FilterState {
  period: string;
  limit: number;
}

interface LeaderboardFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const LeaderboardFilter: React.FC<LeaderboardFilterProps> = ({ filter, onFilterChange }) => {
  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'yearly', label: 'This Year' }
  ];

  const limitOptions = [
    { value: 10, label: 'Top 10' },
    { value: 25, label: 'Top 25' },
    { value: 50, label: 'Top 50' },
    { value: 100, label: 'Top 100' }
  ];

  const handlePeriodChange = (period: string) => {
    onFilterChange({
      ...filter,
      period
    });
  };

  const handleLimitChange = (limit: number) => {
    onFilterChange({
      ...filter,
      limit
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Leaderboard Filters</span>
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Time Period Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Time Period</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.period === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Limit Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Show Rankings</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {limitOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.limit === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleLimitChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          Period: {periodOptions.find(p => p.value === filter.period)?.label}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Showing: {limitOptions.find(l => l.value === filter.limit)?.label}
        </Badge>
      </div>
    </div>
  );
}; 