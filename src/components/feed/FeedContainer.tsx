'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { VideoCard } from './VideoCard';
import { ImageCard } from './ImageCard';
import { TextCard } from './TextCard';
import { AIChat } from './AIChat';
import { useFeed } from '@/lib/hooks/useFeed';
import { FeedPost } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { apiClient } from '@/lib/api/client';

export default function FeedContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [donatingPostId, setDonatingPostId] = useState<string | null>(null);
  const [successfulDonationId, setSuccessfulDonationId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeed();
  const { user, isAuthenticated } = useAuth();
  
  // Flatten all pages into a single array
  const posts = data?.pages.flatMap(page => page.posts) || [];
  
  // Debug logging
  console.log('FeedContainer Debug:', {
    isLoading,
    error,
    postsCount: posts.length,
    currentIndex,
    posts: posts.slice(0, 2) // Log first 2 posts
  });
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  // Auto-advance to next post when current post is fully visible
  useEffect(() => {
    if (inView && posts && currentIndex < posts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 3000); // Auto-advance after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [inView, currentIndex, posts]);

  // Load more posts when reaching the end
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSmile = async (postId: string, amount: number = 1) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setDonatingPostId(postId);
      
      // Use the API client which handles authentication automatically
      const response = await apiClient.donateSmiles(postId, amount);
      
      if (response.success) {
        // Update the post's smile count in local state
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, smiles: (post.smiles || 0) + amount }
              : post
          )
        );
        
        // Set successful donation for animation
        setSuccessfulDonationId(postId);
        setTimeout(() => setSuccessfulDonationId(null), 2000);
        
        console.log('✅ Donation successful:', response.data?.message);
      } else {
        console.error('❌ Donation failed:', response.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error during donation:', error);
      setDonatingPostId(null);
      // You could show an error toast here
    } finally {
      setDonatingPostId(null);
    }
  };

  const handleAIChat = (post: FeedPost) => {
    setSelectedPost(post);
    setAiChatOpen(true);
  };

  const handleShare = (post: FeedPost) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', post.id);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading feed</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No posts available</p>
          <p className="text-sm text-muted-foreground">Check back later for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      {/* Current Post */}
      <div className="h-full relative">
        {posts[currentIndex] && (
          <div ref={ref} className="h-full">
            {posts[currentIndex].mediaType === 'video' && (
              <VideoCard
                index={currentIndex}
                post={posts[currentIndex]}
                onSmile={handleSmile}
                onSave={() => {}} // Placeholder for save functionality
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
                isDonating={donatingPostId === posts[currentIndex].id}
                donationSuccess={successfulDonationId === posts[currentIndex].id}
              />
            )}
            {posts[currentIndex].mediaType === 'image' && (
              <ImageCard
                index={currentIndex}
                post={posts[currentIndex]}
                onSmile={handleSmile}
                onSave={() => {}} // Placeholder for save functionality
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
                isDonating={donatingPostId === posts[currentIndex].id}
                donationSuccess={successfulDonationId === posts[currentIndex].id}
              />
            )}
            {/* For text posts, we'll use ImageCard with a placeholder image */}
            {!posts[currentIndex].mediaType && (
              <TextCard
                index={currentIndex}
                post={posts[currentIndex]}
                onSmile={handleSmile}
                onSave={() => {}} // Placeholder for save functionality
                onAIChat={handleAIChat}
                onShare={handleShare}
                aiChatOpen={aiChatOpen}
                setAiChatOpen={setAiChatOpen}
                lastPostIndex={posts.length - 1}
                isDonating={donatingPostId === posts[currentIndex].id}
                donationSuccess={successfulDonationId === posts[currentIndex].id}
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {posts.slice(0, Math.min(10, posts.length)).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIChat
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        post={selectedPost || undefined}
      />

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
} 