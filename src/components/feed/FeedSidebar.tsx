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
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 z-20">
      {/* Smile Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={isSmiling ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg"
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
                  <div className="text-2xl">😊</div>
                </motion.div>
              ) : (
                <Smile className="text-xl text-white" />
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        <div className="text-center mt-1">
          <motion.div 
            className="text-white font-bold text-sm"
            animate={isSmiling ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {post.likesCount || 0}
          </motion.div>
          <div className="text-white/70 text-xs">Smiles</div>
        </div>
      </motion.div>

      {/* AI Chat Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg"
          onClick={onAIChat}
        >
          <Bot className="text-xl text-white" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs">AI Chat</div>
        </div>
      </motion.div>

      {/* Comments Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg"
        >
          <MessageCircle className="text-xl text-white" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white font-bold text-sm">{post.commentsCount || 0}</div>
          <div className="text-white/70 text-xs">Comments</div>
        </div>
      </motion.div>

      {/* Share Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg"
          onClick={onShare}
        >
          <Share className="text-xl text-white" />
        </Button>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs">Share</div>
        </div>
      </motion.div>

      {/* Bookmark Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={isSaved ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/25 dark:bg-black/40 backdrop-blur-md hover:bg-black/35 dark:hover:bg-black/50 border border-white/25 dark:border-white/30 transition-all duration-200 shadow-lg"
            onClick={handleSave}
          >
            <Bookmark 
              className={`text-xl transition-all duration-200 ${
                isSaved 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-white'
              }`} 
            />
          </Button>
        </motion.div>
        <div className="text-center mt-1">
          <div className="text-white/70 text-xs">Save</div>
        </div>
      </motion.div>

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