'use client';

import { Smile, Bot, Share, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedPost } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FeedSidebarProps {
  post: FeedPost;
  onSmile: () => void;
  onSave: () => void;
  onAIChat: () => void;
  onShare: () => void;
}

export function FeedSidebar({ post, onSmile, onSave, onAIChat, onShare }: FeedSidebarProps) {
  const [isSmiling, setIsSmiling] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved || false);

  const handleSmile = () => {
    setIsSmiling(true);
    onSmile();
    setTimeout(() => setIsSmiling(false), 800);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave();
  };

  return (
    <div className="absolute right-4 md:right-8 lg:right-12 xl:right-16 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 md:space-y-8 z-20">
      {/* Desktop-only decorative elements */}
      <div className="hidden lg:block absolute -right-8 top-0 w-16 h-32 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent rounded-l-full blur-xl"></div>
      <div className="hidden lg:block absolute -right-4 bottom-0 w-8 h-16 bg-gradient-to-t from-secondary/20 via-secondary/10 to-transparent rounded-l-full blur-lg"></div>
      
      {/* Smile Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center relative group"
      >
        {/* Desktop hover glow effect */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-300"></div>
        
        <motion.div
          animate={isSmiling ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg lg:shadow-2xl lg:hover:shadow-yellow-400/25 lg:group-hover:border-yellow-400/50"
            onClick={handleSmile}
          >
            <AnimatePresence>
              {isSmiling ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl">😊</div>
                </motion.div>
              ) : (
                <Smile className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white lg:group-hover:text-yellow-300 transition-colors duration-300" />
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        <div className="text-center mt-1">
          <motion.div 
            className="text-white font-bold text-sm md:text-base lg:text-lg xl:text-xl lg:group-hover:text-yellow-300 transition-colors duration-300"
            animate={isSmiling ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {post.likesCount || 0}
          </motion.div>
          <div className="text-white/70 text-xs md:text-sm lg:text-base lg:group-hover:text-yellow-300/70 transition-colors duration-300">Smiles</div>
        </div>
      </motion.div>

      {/* AI Chat Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center relative group"
      >
        {/* Desktop hover glow effect */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-300"></div>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg lg:shadow-2xl lg:hover:shadow-blue-400/25 lg:group-hover:border-blue-400/50"
          onClick={onAIChat}
        >
          <Bot className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white lg:group-hover:text-blue-300 transition-colors duration-300" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs md:text-sm lg:text-base lg:group-hover:text-blue-300/70 transition-colors duration-300">AI Chat</div>
        </div>
      </motion.div>

      {/* Comments Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center relative group"
      >
        {/* Desktop hover glow effect */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-300"></div>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg lg:shadow-2xl lg:hover:shadow-green-400/25 lg:group-hover:border-green-400/50"
        >
          <MessageCircle className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white lg:group-hover:text-green-300 transition-colors duration-300" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white font-bold text-sm md:text-base lg:text-lg xl:text-xl lg:group-hover:text-green-300 transition-colors duration-300">{post.commentsCount || 0}</div>
          <div className="text-white/70 text-xs md:text-sm lg:text-base lg:group-hover:text-green-300/70 transition-colors duration-300">Comments</div>
        </div>
      </motion.div>

      {/* Share Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center relative group"
      >
        {/* Desktop hover glow effect */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-300"></div>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg lg:shadow-2xl lg:hover:shadow-purple-400/25 lg:group-hover:border-purple-400/50"
          onClick={onShare}
        >
          <Share className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white lg:group-hover:text-purple-300 transition-colors duration-300" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs md:text-sm lg:text-base lg:group-hover:text-purple-300/70 transition-colors duration-300">Share</div>
        </div>
      </motion.div>

      {/* Bookmark Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center relative group"
      >
        {/* Desktop hover glow effect */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-300"></div>
        
        <motion.div
          animate={isSaved ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg lg:shadow-2xl lg:hover:shadow-red-400/25 lg:group-hover:border-red-400/50"
            onClick={handleSave}
          >
            <Bookmark 
              className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl transition-all duration-200 lg:group-hover:text-red-300 ${
                isSaved 
                  ? 'text-yellow-400 fill-yellow-400 lg:group-hover:text-yellow-300' 
                  : 'text-white'
              }`} 
            />
          </Button>
        </motion.div>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs md:text-sm lg:text-base lg:group-hover:text-red-300/70 transition-colors duration-300">Save</div>
        </div>
      </motion.div>

      {/* Desktop-only floating particles */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-4 right-2 w-1 h-1 bg-yellow-400/60 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-blue-400/60 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-16 right-6 w-1 h-1 bg-green-400/60 rounded-full"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Subtle pulse effect for engagement */}
      <AnimatePresence>
        {isSmiling && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="w-full h-full rounded-full bg-yellow-400/20"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 