'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import classNames from 'classnames';

export interface HeaderIcon {
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export interface HeaderStat {
  icon: LucideIcon;
  value: string | number;
  color: string;
  label?: string;
}

export interface PageHeaderProps {
  icons: HeaderIcon[];
  title: string;
  description: string;
  stats?: HeaderStat[];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconsContainerClassName?: string;
  iconClassName?: string;
  statsContainerClassName?: string;
  statClassName?: string;
  titleGradient?: string;
  compact?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icons,
  title,
  description,
  stats,
  className,
  titleClassName,
  descriptionClassName,
  iconsContainerClassName,
  iconClassName,
  statsContainerClassName,
  statClassName,
  titleGradient = "from-primary via-primary/90 to-primary",
  compact = false
}) => {
  return (
    <motion.div 
      className={classNames(
        "text-center",
        compact ? "mb-4" : "mb-6",
        className
      )}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Icons */}
      <div className={classNames(
        "flex items-center justify-center space-x-2",
        compact ? "mb-2" : "mb-3",
        iconsContainerClassName
      )}>
        {icons.map((iconData, index) => {
          const Icon = iconData.icon;
          return (
            <motion.div
              key={index}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: iconData.delay || index * 0.5 }}
            >
              <div className={classNames(
                "p-2 rounded-lg border backdrop-blur-sm",
                iconData.color,
                iconClassName
              )}>
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Title */}
      <motion.h1 
        className={classNames(
          "font-bold bg-clip-text text-transparent",
          compact ? "text-3xl md:text-4xl mb-2" : "text-3xl md:text-4xl mb-3",
          `bg-gradient-to-r ${titleGradient}`,
          titleClassName
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h1>
      
      {/* Description */}
      <motion.p 
        className={classNames(
          "text-muted-foreground max-w-xl mx-auto",
          compact ? "text-sm mb-4" : "text-sm mb-4",
          descriptionClassName
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {description}
      </motion.p>
      
      {/* Stats */}
      {stats && (
        <motion.div 
          className={classNames(
            "flex flex-wrap justify-center gap-3",
            statsContainerClassName
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                className={classNames(
                  "flex items-center space-x-1 px-3 py-2 border rounded-lg backdrop-blur-sm",
                  stat.color,
                  statClassName
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span className="text-sm font-semibold">
                  {stat.value}
                  {stat.label && <span className="ml-1 opacity-75">{stat.label}</span>}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}; 