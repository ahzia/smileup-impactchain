'use client';

import React, { useState, useEffect } from 'react';
import { FeedPost } from '@/lib/types';

interface SlideShowCardProps {
  post: FeedPost;
}

const gradientClasses = [
  "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
  "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  "bg-gradient-to-r from-blue-400 via-green-400 to-teal-500",
  "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
  "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
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
    const durations = [3000, 3000, 4000, 5000];
    const timer = setTimeout(() => {
      setSlideIndex((prev) => (prev + 1) % durations.length);
    }, durations[slideIndex]);

    return () => clearTimeout(timer);
  }, [slideIndex]);

  const renderSlideContent = () => {
    switch (slideIndex) {
      case 0:
        return (
          <div className="flex flex-col items-center transition-opacity duration-500">
            <img
              src={post.community.logo}
              alt={`${post.community.name} logo`}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-6 object-contain"
            />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{post.community.name}</h3>
          </div>
        );
      case 1:
        return (
          <div className="text-center transition-opacity duration-500">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4">{post.community.name}</h3>
          </div>
        );
      case 2:
        return (
          <div className="text-center transition-opacity duration-500">
            <p className="text-xl sm:text-2xl md:text-3xl text-white">{post.challenge}</p>
          </div>
        );
      case 3:
        return (
          <div className="text-center transition-opacity duration-500 max-w-xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-white">{post.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center ${gradient} p-6`}
    >
      {renderSlideContent()}
    </div>
  );
};

export default SlideShowCard; 