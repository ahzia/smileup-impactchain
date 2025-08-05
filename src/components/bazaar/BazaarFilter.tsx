'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Tag, Building, DollarSign, ChevronDown, ChevronUp, ShoppingBag, Gift, Star } from 'lucide-react';

interface FilterState {
  provider: string;
  priceRange: string;
}

interface BazaarFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const BazaarFilter: React.FC<BazaarFilterProps> = ({ filter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = {
    provider: [
      { value: 'all', label: 'All Providers', icon: Building },
      { value: 'SmileUp', label: 'SmileUp', icon: Building },
      { value: 'Green Earth Initiative', label: 'Green Earth', icon: Building },
      { value: 'Tech for Good', label: 'Tech for Good', icon: Building },
      { value: 'Community Health', label: 'Community Health', icon: Building }
    ],
    priceRange: [
      { value: 'all', label: 'All Prices', icon: DollarSign },
      { value: 'low', label: 'Under 100 Smiles', icon: DollarSign },
      { value: 'medium', label: '100-300 Smiles', icon: DollarSign },
      { value: 'high', label: 'Over 300 Smiles', icon: DollarSign }
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
      provider: 'all',
      priceRange: 'all'
    });
  };

  const hasActiveFilters = filter.provider !== 'all' || filter.priceRange !== 'all';

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
                  {[filter.provider, filter.priceRange].filter(f => f !== 'all').length}
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
                    <h3 className="font-bold text-lg text-card-foreground">Filter Bazaar</h3>
                    <p className="text-sm text-muted-foreground">Find perfect rewards</p>
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
                    {filter.provider !== 'all' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-500/20 text-purple-400 border-purple-500/40 backdrop-blur-sm">
                          Provider: {filterOptions.provider.find(f => f.value === filter.provider)?.label}
                        </Badge>
                      </motion.div>
                    )}
                    {filter.priceRange !== 'all' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-500/20 text-green-400 border-green-500/40 backdrop-blur-sm">
                          Price: {filterOptions.priceRange.find(f => f.value === filter.priceRange)?.label}
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filter Sections */}
              <div className="space-y-6 relative z-10">
                {/* Provider Filter */}
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="text-sm font-semibold text-card-foreground flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Building className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span>Provider</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.provider.map((option, index) => {
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
                            variant={filter.provider === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange('provider', option.value)}
                            className={`w-full justify-start text-sm font-medium backdrop-blur-sm ${
                              filter.provider === option.value 
                                ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-md hover:from-primary/90 hover:via-primary hover:to-primary/90' 
                                : 'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 text-muted-foreground hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 hover:text-accent-foreground border-border/50'
                            }`}
                          >
                            <motion.div
                              animate={filter.provider === option.value ? { scale: [1, 1.1, 1] } : {}}
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

                {/* Price Range Filter */}
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
                      <DollarSign className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span>Price Range</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.priceRange.map((option, index) => {
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
                            variant={filter.priceRange === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange('priceRange', option.value)}
                            className={`w-full justify-start text-sm font-medium backdrop-blur-sm ${
                              filter.priceRange === option.value 
                                ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-md hover:from-primary/90 hover:via-primary hover:to-primary/90' 
                                : 'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 text-muted-foreground hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 hover:text-accent-foreground border-border/50'
                            }`}
                          >
                            <motion.div
                              animate={filter.priceRange === option.value ? { scale: [1, 1.1, 1] } : {}}
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