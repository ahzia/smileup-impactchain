'use client';

import { Smile, Bot, Share, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedPost } from '@/lib/types';

interface FeedSidebarProps {
  post: FeedPost;
  onSmile: () => void;
  onSave: () => void;
  onAIChat: () => void;
  onShare: () => void;
}

export function FeedSidebar({ post, onSmile, onSave, onAIChat, onShare }: FeedSidebarProps) {
  return (
    <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
      {/* Smile Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={onSmile}
      >
        <Smile className="text-2xl transition-colors text-white" />
      </Button>

      {/* Smile Count */}
      <div className="text-center">
        <div className="text-white font-bold text-sm">{post.likesCount || 0}</div>
        <div className="text-white/60 text-xs">Smiles</div>
      </div>

      {/* AI Chat Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={onAIChat}
      >
        <Bot className="text-2xl text-white" />
      </Button>

      {/* Comments Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <MessageCircle className="text-2xl text-white" />
      </Button>

      {/* Comment Count */}
      <div className="text-center">
        <div className="text-white font-bold text-sm">{post.commentsCount || 0}</div>
        <div className="text-white/60 text-xs">Comments</div>
      </div>

      {/* Share Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={onShare}
      >
        <Share className="text-2xl text-white" />
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        onClick={onSave}
      >
        <Bookmark className={`text-2xl ${post.saved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
      </Button>
    </div>
  );
} 