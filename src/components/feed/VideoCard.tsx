'use client';

import React, { useRef, useEffect, useState } from 'react';
import { FeedPost } from '@/lib/types';
import useIsInViewport from '@/lib/hooks/useIsInViewport';
import { FeedSidebar } from './FeedSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface VideoCardProps {
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

export const VideoCard: React.FC<VideoCardProps> = React.memo(({
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(containerRef);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(true);

  useEffect(() => {
    if (post.mediaUrl && isInViewport && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      }, 1000);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayButton(true);
    }
  }, [isInViewport, post.mediaUrl]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayButton(true);
      }
    }
  };

  const handleSmile = () => {
    onSmile(post.id);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Truncate description for TikTok-style display
  const shouldTruncate = post.description.length > 100;
  const displayText = isExpanded ? post.description : post.description.slice(0, 100);

  return (
    <div ref={containerRef} className="h-full w-full relative bg-background">
      {/* Video Content */}
      <video
        muted={isMuted}
        preload="metadata"
        ref={videoRef}
        onClick={handleVideoClick}
        className="video w-full h-full object-cover"
        loop
        playsInline
        autoPlay={index === 0}
      >
        <source src={post.mediaUrl} type="video/mp4" />
      </video>

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
              {post.community ? (
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
              ) : (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/80 shadow-md bg-muted flex items-center justify-center">
                    <span className="text-foreground text-sm font-semibold">S</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Video Controls */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Center Play Button */}
        <AnimatePresence>
          {showPlayButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="h-6 w-6 text-white ml-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
}); 