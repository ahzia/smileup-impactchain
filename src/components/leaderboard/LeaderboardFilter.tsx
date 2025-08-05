'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Target, Clock, Award, ChevronDown, ChevronUp, TrendingUp, Users, Star } from 'lucide-react';

interface FilterState {
  sortBy: string;
  level: string;
}

interface LeaderboardFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const LeaderboardFilter: React.FC<LeaderboardFilterProps> = ({ filter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = {
    sortBy: [
      { value: 'smiles', label: 'Most Smiles', icon: TrendingUp },
      { value: 'level', label: 'Highest Level', icon: Star },
      { value: 'recent', label: 'Recently Active', icon: Clock },
      { value: 'name', label: 'Name A-Z', icon: Users }
    ],
    level: [
      { value: 'all', label: 'All Levels', icon: Target },
      { value: 'beginner', label: 'Beginner', icon: Target },
      { value: 'intermediate', label: 'Intermediate', icon: Clock },
      { value: 'advanced', label: 'Advanced', icon: Award },
      { value: 'elite', label: 'Elite', icon: Star }
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
      sortBy: 'smiles',
      level: 'all'
    });
  };

  const hasActiveFilters = filter.sortBy !== 'smiles' || filter.level !== 'all';

  return (
    <div className="relative">
      {/* Filter Icon Button */}
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 backdrop-blur-sm overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative flex items-center space-x-2 z-10">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Filter className="h-5 w-5" />
            </motion.div>
            <span className="font-semibold text-sm">Filter</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </motion.div>
          </div>
          
          {/* Active filters indicator */}
          {hasActiveFilters && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-destructive to-destructive/80 rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-destructive-foreground">
                  {[filter.sortBy, filter.level].filter(f => f !== 'smiles' && f !== 'all').length}
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.button>

        {/* Collapsible Filter Panel - Positioned to the left */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-full right-0 mt-3 p-6 bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl shadow-2xl z-50 min-w-[350px] backdrop-blur-xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative flex items-center justify-between mb-6 z-10">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 rounded-lg border border-primary/30 backdrop-blur-sm"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Filter className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg text-card-foreground">Filter Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">Find top performers</p>
                  </div>
                </div>
                <AnimatePresence>
                  {hasActiveFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/20 backdrop-blur-sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mb-6 relative z-10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filter.sortBy !== 'smiles' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-500/20 text-blue-400 border-blue-500/40 backdrop-blur-sm">
                          Sort: {filterOptions.sortBy.find(f => f.value === filter.sortBy)?.label}
                        </Badge>
                      </motion.div>
                    )}
                    {filter.level !== 'all' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40 backdrop-blur-sm">
                          Level: {filterOptions.level.find(f => f.value === filter.level)?.label}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filter Sections */}
              <div className="space-y-6 relative z-10">
                {/* Sort By Filter */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="text-sm font-semibold text-card-foreground flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span>Sort By</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.sortBy.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={filter.sortBy === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange('sortBy', option.value)}
                            className={`w-full justify-start text-sm font-medium backdrop-blur-sm ${
                              filter.sortBy === option.value 
                                ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-md hover:from-primary/90 hover:via-primary hover:to-primary/90' 
                                : 'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 text-muted-foreground hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 hover:text-accent-foreground border-border/50'
                            }`}
                          >
                            <motion.div
                              animate={filter.sortBy === option.value ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                            </motion.div>
                            {option.label}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Level Filter */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-sm font-semibold text-card-foreground flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span>Level</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.level.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={filter.level === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange('level', option.value)}
                            className={`w-full justify-start text-sm font-medium backdrop-blur-sm ${
                              filter.level === option.value 
                                ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-md hover:from-primary/90 hover:via-primary hover:to-primary/90' 
                                : 'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 text-muted-foreground hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 hover:text-accent-foreground border-border/50'
                            }`}
                          >
                            <motion.div
                              animate={filter.level === option.value ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                            </motion.div>
                            {option.label}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}; 