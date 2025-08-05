'use client';

import React, { useState, useEffect } from 'react';
import { FeedPost } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Target, Sparkles } from 'lucide-react';

interface SlideShowCardProps {
  post: FeedPost;
}

const gradientClasses = [
  "bg-gradient-to-br from-purple-600 via-pink-600 to-red-500",
  "bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400",
  "bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500",
  "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
  "bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500",
];

const SlideShowCard: React.FC<SlideShowCardProps> = ({ post }) => {
  const [gradient, setGradient] = useState<string>("");
  const [slideIndex, setSlideIndex] = useState<number>(0);

  useEffect(() => {
    // Pick a random gradient from the list
    const randomIndex = Math.floor(Math.random() * gradientClasses.length);
    setGradient(gradientClasses[randomIndex]);
  }, []);

  useEffect(() => {
    // Define durations for each slide (in milliseconds)
    const durations = [4000, 4000, 5000, 6000];
    const timer = setTimeout(() => {
      setSlideIndex((prev) => (prev + 1) % durations.length);
    }, durations[slideIndex]);

    return () => clearTimeout(timer);
  }, [slideIndex]);

  const renderSlideContent = () => {
    switch (slideIndex) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src={post.community.logo}
                  alt={`${post.community.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            >
              {post.community.name}
            </motion.h3>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center space-x-4 text-white/90"
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className="text-lg font-semibold">{post.likesCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-lg font-semibold">{post.commentsCount}</span>
              </div>
            </motion.div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto px-6"
          >
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight"
            >
              {post.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center space-x-6 text-white/80"
            >
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span className="text-xl font-medium">Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6" />
                <span className="text-xl font-medium">Community</span>
              </div>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🎯
              </motion.div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                The Challenge
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
                {post.challenge}
              </p>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl mb-6"
              >
                ✨
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Making a Difference
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
                {post.description}
              </p>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full flex flex-col justify-center items-center ${gradient} relative overflow-hidden`}>
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
      />
      
      {/* Slide indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            animate={{ 
              scale: slideIndex === index ? 1.2 : 1,
              opacity: slideIndex === index ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
            className={`w-2 h-2 rounded-full ${
              slideIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {renderSlideContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SlideShowCard; 