'use client';

import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

export interface AnimatedBackgroundProps {
  className?: string;
  showGradientOrbs?: boolean;
  showFloatingParticles?: boolean;
  showFloatingCoins?: boolean;
  showSparkles?: boolean;
  particlesCount?: number;
  coinsCount?: number;
  sparklesCount?: number;
  particlesClassName?: string;
  coinsClassName?: string;
  sparklesClassName?: string;
  gradientOrbsClassName?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className,
  showGradientOrbs = true,
  showFloatingParticles = true,
  showFloatingCoins = false,
  showSparkles = false,
  particlesCount = 15,
  coinsCount = 8,
  sparklesCount = 12,
  particlesClassName,
  coinsClassName,
  sparklesClassName,
  gradientOrbsClassName
}) => {
  return (
    <div className={classNames("absolute inset-0 overflow-hidden", className)}>
      {/* Gradient orbs */}
      {showGradientOrbs && (
        <>
          <motion.div
            className={classNames(
              "absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl",
              gradientOrbsClassName
            )}
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
            className={classNames(
              "absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl",
              gradientOrbsClassName
            )}
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
        </>
      )}
      
      {/* Floating particles */}
      {showFloatingParticles && (
        <>
          {[...Array(particlesCount)].map((_, i) => (
            <motion.div
              key={i}
              className={classNames(
                "absolute w-1 h-1 bg-primary/30 rounded-full",
                particlesClassName
              )}
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
        </>
      )}

      {/* Floating coins animation */}
      {showFloatingCoins && (
        <>
          {[...Array(coinsCount)].map((_, i) => (
            <motion.div
              key={`coin-${i}`}
              className={classNames("absolute text-yellow-400/40", coinsClassName)}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                rotate: [0, 360],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
              }}
            >
              💰
            </motion.div>
          ))}
        </>
      )}

      {/* Sparkle effects */}
      {showSparkles && (
        <>
          {[...Array(sparklesCount)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className={classNames("absolute text-yellow-300/60", sparklesClassName)}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 8 + 8}px`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}; 