'use client';

import React from 'react';
import { FeedPost } from '@/lib/types';
import { FeedSidebar } from './FeedSidebar';

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
  const handleSmile = () => {
    onSmile(post.id);
  };

  return (
    <div className="slider-children h-full relative">
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
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          {/* Top Section */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full w-12 h-12 border-2 border-white">
                  <img
                    className="aspect-square size-full"
                    alt={post.community.name}
                    src={post.community.logo}
                  />
                </span>
                <div>
                  <h3 className="text-white font-semibold text-lg">{post.community.name}</h3>
                  <p className="text-white/80 text-sm">{post.title}</p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 border-transparent bg-primary/20 text-primary-foreground">
                Challenge: {post.challenge}
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h2 className="text-white font-bold text-xl mb-2">{post.title}</h2>
                <p className="text-white/90 text-sm mb-3 line-clamp-2">{post.description}</p>
                <div className="flex items-center space-x-4 text-white/80 text-sm">
                  <span>{post.likesCount} Smiles</span>
                  <span>{post.commentsCount} Comments</span>
                  <span>{post.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}); 