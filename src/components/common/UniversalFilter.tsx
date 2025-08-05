'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import classNames from 'classnames';

export interface FilterOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FilterSection {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
  badgeColor?: string;
}

export interface FilterState {
  [key: string]: string;
}

export interface UniversalFilterProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  sections: FilterSection[];
  title: string;
  description: string;
  defaultValues: FilterState;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  sectionClassName?: string;
  optionClassName?: string;
  badgeClassName?: string;
}

export const UniversalFilter: React.FC<UniversalFilterProps> = ({ 
  filter, 
  onFilterChange, 
  sections,
  title,
  description,
  defaultValues,
  className,
  buttonClassName,
  panelClassName,
  headerClassName,
  sectionClassName,
  optionClassName,
  badgeClassName
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange(defaultValues);
  };

  const hasActiveFilters = Object.keys(filter).some(key => {
    const defaultValue = defaultValues[key];
    return filter[key] !== defaultValue;
  });

  const activeFiltersCount = Object.keys(filter).filter(key => {
    const defaultValue = defaultValues[key];
    return filter[key] !== defaultValue;
  }).length;

  return (
    <div className={classNames("relative", className)}>
      {/* Filter Icon Button */}
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={classNames(
            "relative p-3 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 backdrop-blur-sm overflow-hidden group",
            buttonClassName
          )}
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
                  {activeFiltersCount}
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.button>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={classNames(
                "absolute top-full right-0 mt-3 p-6 bg-gradient-to-br from-card via-card/95 to-card border border-border/50 rounded-2xl shadow-2xl z-50 min-w-[350px] backdrop-blur-xl overflow-hidden",
                panelClassName
              )}
            >
              {/* Header */}
              <div className={classNames("relative flex items-center justify-between mb-6 z-10", headerClassName)}>
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/20 rounded-lg border border-primary/30 backdrop-blur-sm"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Filter className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg text-card-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
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
                    {sections.map((section, sectionIndex) => {
                      const currentValue = filter[section.key];
                      const defaultValue = defaultValues[section.key];
                      const isActive = currentValue !== defaultValue;
                      
                      if (!isActive) return null;
                      
                      const option = section.options.find(opt => opt.value === currentValue);
                      if (!option) return null;

                      return (
                        <motion.div
                          key={section.key}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className={classNames(
                              "text-xs backdrop-blur-sm",
                              section.badgeColor || "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 text-primary border-primary/40",
                              badgeClassName
                            )}
                          >
                            {section.label}: {option.label}
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filter Sections */}
              <div className="space-y-6 relative z-10">
                {sections.map((section, sectionIndex) => {
                  const Icon = section.icon;
                  const currentValue = filter[section.key];
                  
                  return (
                    <motion.div 
                      key={section.key}
                      className={classNames("space-y-3", sectionClassName)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + sectionIndex * 0.1 }}
                    >
                      <label className="text-sm font-semibold text-card-foreground flex items-center space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                        </motion.div>
                        <span>{section.label}</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {section.options.map((option, optionIndex) => {
                          const OptionIcon = option.icon;
                          const isSelected = currentValue === option.value;
                          
                          return (
                            <motion.div
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + sectionIndex * 0.1 + optionIndex * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleFilterChange(section.key, option.value)}
                                className={classNames(
                                  "w-full justify-start text-sm font-medium backdrop-blur-sm",
                                  isSelected 
                                    ? 'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-md hover:from-primary/90 hover:via-primary hover:to-primary/90' 
                                    : 'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 text-muted-foreground hover:from-accent/50 hover:via-accent/30 hover:to-accent/50 hover:text-accent-foreground border-border/50',
                                  optionClassName
                                )}
                              >
                                <motion.div
                                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <OptionIcon className="h-4 w-4 mr-2" />
                                </motion.div>
                                {option.label}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}; 