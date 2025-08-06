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
    <div className="h-full w-full relative bg-black">
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
          className="w-full h-full object-cover"
        />
        {/* Enhanced Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          {/* Top Section - Clean and Minimal */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between">
              {/* Community Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      alt={post.community.name}
                      src={post.community.logo}
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                </div>
              </motion.div>

              {/* Image indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20"
              >
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Clean and Readable */}
          <div className="absolute bottom-24 left-4 right-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-end justify-between"
            >
              <div className="flex-1 max-w-[80%]">
                <h2 className="text-white font-bold text-xl mb-2 drop-shadow-md">
                  {post.title}
                </h2>
                
                {/* Description */}
                <div className="mb-3">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {displayText}
                    {shouldTruncate && !isExpanded && (
                      <span className="text-white/60">...</span>
                    )}
                  </p>
                  {shouldTruncate && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={toggleExpanded}
                      className="text-white/70 text-xs font-medium hover:text-white transition-colors mt-1"
                    >
                      {isExpanded ? 'See Less' : 'See More'}
                    </motion.button>
                  )}
                </div>
                
                {/* Date */}
                <div className="flex items-center space-x-2 text-white/60 text-xs">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}); 