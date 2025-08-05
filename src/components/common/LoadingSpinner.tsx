'use client';

import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

export interface LoadingSpinnerProps {
  className?: string;
  containerClassName?: string;
  spinnerClassName?: string;
  particlesCount?: number;
  particlesClassName?: string;
  showParticles?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  containerClassName,
  spinnerClassName,
  particlesCount = 20,
  particlesClassName,
  showParticles = true,
  size = 'md',
  text
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={classNames("min-h-screen bg-background relative overflow-hidden", className)}>
      {/* Animated background particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(particlesCount)].map((_, i) => (
            <motion.div
              key={i}
              className={classNames(
                "absolute w-1 h-1 bg-primary/20 rounded-full",
                particlesClassName
              )}
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
      )}
      
      <div className={classNames("container mx-auto px-4 py-8 relative z-10", containerClassName)}>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className={classNames(
              "border-4 border-primary/30 border-t-primary rounded-full",
              sizeClasses[size],
              spinnerClassName
            )} />
          </motion.div>
          
          {text && (
            <motion.p
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}; 