'use client';

import React, { useState } from 'react';
import { FeedPost } from '@/lib/types';
import { FeedSidebar } from './FeedSidebar';
import { motion } from 'framer-motion';

interface ImageCardProps {
  index: number;
  post: FeedPost;
  onSmile: (postId: string) => void;
  onSave: (postId: string) => void;
  onAIChat: (post: FeedPost) => void;
  onShare: (post: FeedPost) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  lastPostIndex: number;
  isDonating?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = React.memo(({
  index,
  post,
  onSmile,
  onSave,
  onAIChat,
  onShare,
  aiChatOpen,
  setAiChatOpen,
  lastPostIndex,
  isDonating = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSmile = () => {
    onSmile(post.id);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate description for TikTok-style display
  const shouldTruncate = post.description.length > 100;
  const displayText = isExpanded ? post.description : post.description.slice(0, 100);

  return (
    <div className="h-full w-full relative bg-background group">
      {/* Desktop-only background effects */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Right Sidebar */}
      {!aiChatOpen && (
        <FeedSidebar
          post={post}
          onSmile={handleSmile}
          onSave={() => onSave(post.id)}
          onAIChat={() => onAIChat(post)}
          onShare={() => onShare(post)}
        />
      )}

      {/* Content - Image */}
      <div className="absolute inset-0">
        <img
          src={post.mediaUrl}
          alt={post.title}
          className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-700"
        />
        {/* Enhanced Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:group-hover:from-black/70 lg:group-hover:via-black/20 transition-all duration-500">
          {/* Top Section - Clean and Minimal */}
          <div className="absolute top-4 md:top-6 lg:top-8 xl:top-10 left-4 md:left-6 lg:left-8 xl:left-12 right-4 md:right-6 lg:right-8 xl:right-12 z-10">
            <div className="flex items-center justify-between">
              {/* Community Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center space-x-3 lg:group-hover:scale-110 transition-transform duration-300"
              >
                {post.community ? (
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 border-white/80 shadow-md lg:group-hover:border-white lg:group-hover:shadow-xl transition-all duration-300 bg-white">
                      <img
                        className="w-full h-full object-contain"
                        alt={post.community.name}
                        src={post.community.logo}
                        onError={(e) => {
                          console.error('Failed to load logo:', post.community.logo);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Logo loaded successfully:', post.community.logo);
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border border-white lg:group-hover:bg-green-400 lg:group-hover:scale-110 transition-all duration-300"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 border-white/80 shadow-md bg-muted flex items-center justify-center lg:group-hover:border-white lg:group-hover:shadow-xl transition-all duration-300">
                      <span className="text-foreground text-sm md:text-base lg:text-lg xl:text-xl font-semibold">S</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Image indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20 lg:group-hover:bg-black/50 lg:group-hover:border-white/40 lg:group-hover:shadow-lg transition-all duration-300"
              >
                <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 bg-white rounded-sm lg:group-hover:bg-white/90 transition-colors duration-300"></div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Clean and Readable */}
          <div className="absolute bottom-24 md:bottom-28 lg:bottom-32 xl:bottom-36 left-4 md:left-6 lg:left-8 xl:left-12 right-4 md:right-6 lg:right-8 xl:right-12 z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-end justify-between"
            >
              <div className="flex-1 max-w-[80%] md:max-w-[85%] lg:max-w-[90%] xl:max-w-[95%]">
                <h2 className="text-white font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-2 md:mb-3 lg:mb-4 drop-shadow-md lg:group-hover:drop-shadow-lg transition-all duration-300">
                  {post.title}
                </h2>
                
                {/* Description - Only show when expanded */}
                {isExpanded && (
                  <div className="mb-3 md:mb-4 lg:mb-5">
                    <p className="text-white/90 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed lg:group-hover:text-white transition-colors duration-300">
                      {post.description}
                    </p>
                  </div>
                )}
                
                {/* See More/Less Button - Always show if there's a description */}
                {post.description && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={toggleExpanded}
                    className="text-white/70 text-xs md:text-sm lg:text-base font-medium hover:text-white transition-colors mt-1 md:mt-2 lg:mt-3 lg:group-hover:text-white/90"
                  >
                    {isExpanded ? 'See Less' : 'See More'}
                  </motion.button>
                )}
                
                {/* Date */}
                <div className="flex items-center space-x-2 text-white/60 text-xs md:text-sm lg:text-base xl:text-lg lg:group-hover:text-white/80 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 bg-white/40 rounded-full lg:group-hover:bg-white/60 transition-colors duration-300"></div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop-only corner accent */}
      <div className="hidden lg:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="hidden lg:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
    </div>
  );
}); 