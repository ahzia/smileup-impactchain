'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface FilterState {
  type: string;
  status: string;
  effortLevel: string;
}

interface MissionFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const MissionFilter: React.FC<MissionFilterProps> = ({ filter, onFilterChange }) => {
  const filterOptions = {
    type: [
      { value: 'all', label: 'All Types' },
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'featured', label: 'Featured' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'available', label: 'Available' },
      { value: 'accepted', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ],
    effortLevel: [
      { value: 'all', label: 'All Levels' },
      { value: 'Low', label: 'Low Effort' },
      { value: 'Medium', label: 'Medium Effort' },
      { value: 'High', label: 'High Effort' }
    ]
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      status: 'all',
      effortLevel: 'all'
    });
  };

  const hasActiveFilters = filter.type !== 'all' || filter.status !== 'all' || filter.effortLevel !== 'all';

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filter Missions</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filter.type !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Type: {filterOptions.type.find(f => f.value === filter.type)?.label}
            </Badge>
          )}
          {filter.status !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Status: {filterOptions.status.find(f => f.value === filter.status)?.label}
            </Badge>
          )}
          {filter.effortLevel !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Level: {filterOptions.effortLevel.find(f => f.value === filter.effortLevel)?.label}
            </Badge>
          )}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="space-y-3">
        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Mission Type
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.type.map((option) => (
              <Button
                key={option.value}
                variant={filter.type === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('type', option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.status.map((option) => (
              <Button
                key={option.value}
                variant={filter.status === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('status', option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Effort Level Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Effort Level
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.effortLevel.map((option) => (
              <Button
                key={option.value}
                variant={filter.effortLevel === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('effortLevel', option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 