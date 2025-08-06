'use client';

import { useState, useEffect, useMemo } from 'react';
import { VideoCard } from '@/components/feed/VideoCard';
import { ImageCard } from '@/components/feed/ImageCard';
import { TextCard } from '@/components/feed/TextCard';
import { AIChat } from '@/components/feed/AIChat';
import { FeedPost } from '@/lib/types';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Loading skeleton component
const FeedSkeleton = () => (
  <div className="h-screen w-full relative bg-black">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black animate-pulse">
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse"></div>
      </div>
      <div className="absolute bottom-24 left-6 right-6 z-10">
        <div className="h-8 bg-gray-600 rounded mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [smiles, setSmiles] = useState(2000);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const handleSmile = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      )
    );
    setSmiles(prev => prev + 1);
    console.log('Smiled on post:', postId);
  };

  const handleSave = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, saved: !post.saved }
          : post
      )
    );
    console.log('Saved post:', postId);
  };

  const handleAIChat = (post: FeedPost) => {
    setSelectedPost(post);
    setAiChatOpen(true);
  };

  const handleShare = (post: FeedPost) => {
    console.log('Sharing post:', post.id);
  };

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      if (posts.length === 0) {
        try {
          const response = await fetch('/api/feed');
          const data = await response.json();
          
          if (data.success && data.data) {
            // Add saved property to each post
            const postsWithSaved = data.data.map((post: FeedPost) => ({
              ...post,
              saved: false
            }));
            setPosts(postsWithSaved);
            setPostsLoaded(true);
          }
        } catch (error) {
          console.error('Error loading initial posts:', error);
        }
      }
    };

    loadInitialPosts();
  }, [posts.length]);

  // Memoize partitioned lists like GinUp
  const videoPosts = useMemo(() => posts.filter((p) => p.mediaType === 'video' && p.mediaUrl), [posts]);
  const imagePosts = useMemo(() => posts.filter((p) => p.mediaType === 'image' && p.mediaUrl), [posts]);
  const textPosts = useMemo(() => posts.filter((p) => p.mediaType === 'text' || !p.mediaUrl), [posts]);

  if (!postsLoaded) {
    return (
      <div className="h-full md:h-[calc(100vh-5rem)] relative overflow-y-auto bg-black">
        {/* Loading skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <FeedSkeleton key={index} />
        ))}
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TikTok-style Feed Container with proper spacing for navigation */}
      <div className="h-full md:h-[calc(100vh-5rem)] relative overflow-y-auto bg-black">
        <AnimatePresence>
          {/* Render video posts first */}
          {videoPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-screen w-full relative"
            >
              <VideoCard
                index={index}
                post={post}
                onSmile={handleSmile}
                onSave={handleSave}
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
              />
            </motion.div>
          ))}
          
          {/* Render image posts */}
          {imagePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: (videoPosts.length + index) * 0.1 }}
              className="h-screen w-full relative"
            >
              <ImageCard
                index={videoPosts.length + index}
                post={post}
                onSmile={handleSmile}
                onSave={handleSave}
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
              />
            </motion.div>
          ))}
          
          {/* Render text posts */}
          {textPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: (videoPosts.length + imagePosts.length + index) * 0.1 }}
              className="h-screen w-full relative"
            >
              <TextCard
                index={videoPosts.length + imagePosts.length + index}
                post={post}
                onSmile={handleSmile}
                onSave={handleSave}
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Intersection observer trigger for infinite scroll */}
        <div ref={loadMoreRef} className="h-4" />
      </div>

      {/* AI Chat Modal */}
      <AIChat
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        post={selectedPost || undefined}
      />
    </>
  );
} 