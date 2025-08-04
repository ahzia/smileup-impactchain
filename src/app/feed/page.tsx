'use client';

import { useState, useEffect, useMemo } from 'react';
import { VideoCard } from '@/components/feed/VideoCard';
import { ImageCard } from '@/components/feed/ImageCard';
import { TextCard } from '@/components/feed/TextCard';
import { AIChat } from '@/components/feed/AIChat';
import { FeedPost } from '@/lib/types';
import { useInView } from 'react-intersection-observer';

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
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <>
      <div className="bg-black h-[calc(100vh-60px)] relative">
        {/* Render video posts first */}
        {videoPosts.map((post, index) => (
          <VideoCard
            key={post.id}
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
        ))}
        
        {/* Render image posts */}
        {imagePosts.map((post, index) => (
          <ImageCard
            key={post.id}
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
        ))}
        
        {/* Render text posts */}
        {textPosts.map((post, index) => (
          <TextCard
            key={post.id}
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
        ))}
        
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