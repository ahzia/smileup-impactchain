'use client';

import React from 'react';
import { FeedPost } from '@/lib/types';
import { FeedSidebar } from './FeedSidebar';
import SlideShowCard from './SlideShowCard';

interface TextCardProps {
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

export const TextCard: React.FC<TextCardProps> = React.memo(({
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
  const handleSmile = () => {
    onSmile(post.id);
  };

  return (
    <div className="h-full w-full relative">
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

      {/* Text Content - Always use slideshow for text */}
      <div className="absolute inset-0">
        <SlideShowCard
          post={post}
        />
      </div>
    </div>
  );
}); 