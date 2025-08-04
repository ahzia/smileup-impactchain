# SmileUp ImpactChain — UI Components Implementation Guide (Updated)

**Generated:** March 16, 2024  
**Updated:** December 2024  
**Version:** 2.0  
**Focus:** MVP Components for Hackathon - Updated for Current Setup

---

## 🎯 Component Implementation Overview

This guide provides detailed implementation instructions for all UI components, updated to match the current project setup with Next.js 15.4.4, React 19.1.0, Tailwind CSS v4, and shadcn/ui components.

---

## 🛠️ Current Setup Analysis

### ✅ Already Installed Dependencies
```json
{
  "@hashgraph/sdk": "^2.69.0",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-slot": "^1.2.3",
  "@tanstack/react-query": "^5.84.1",
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.534.0",
  "next": "15.4.4",
  "next-themes": "^0.4.6",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-intersection-observer": "^9.16.0",
  "sonner": "^2.0.7",
  "tailwindcss": "^4"
}
```

### 🔧 Additional Dependencies Needed (Optional)
```bash
# Only install if specific functionality is needed
npm install @types/node  # Already installed
npm install class-variance-authority clsx tailwind-merge  # Already installed
```

---

## 🎨 Updated Theme System

### 1. **Theme Provider (Using next-themes)**

```typescript
// components/common/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

### 2. **Updated Globals CSS (Tailwind v4 Compatible)**

```css
/* src/app/globals.css - Updated for current setup */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* SmileUp Custom Colors */
@theme inline {
  --color-smiles-gold: #ffd700;
  --color-smiles-silver: #c0c0c0;
  --color-smiles-bronze: #cd7f32;
  --color-impact-green: #22c55e;
  --color-impact-blue: #3b82f6;
  --color-community-purple: #8b5cf6;
}

/* Custom animations for gamification */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
  50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
}

@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

.animate-confetti {
  animation: confetti 1s ease-out forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground));
}

/* Hide scrollbar for mobile */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 📱 Mobile-First Navigation (Updated)

### 1. **Bottom Navigation Bar**

```typescript
// components/common/Navigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  Gift, 
  User, 
  Target 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/missions', icon: Target, label: 'Missions' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/bazaar', icon: Gift, label: 'Bazaar' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex justify-around items-center h-16 px-4">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center h-auto p-2 gap-1",
                  "hover:bg-transparent"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Icon 
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs transition-colors",
                  isActive 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground"
                )}>
                  {label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 📺 TikTok-Style Feed Implementation (Updated)

### 1. **Feed Container with React Query**

```typescript
// components/feed/FeedContainer.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import VideoCard from './VideoCard';
import ImageCard from './ImageCard';
import TextCard from './TextCard';
import FeedSidebar from './FeedSidebar';
import AIChat from './AIChat';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

async function fetchFeedPosts() {
  const response = await fetch('/api/feed');
  if (!response.ok) {
    throw new Error('Failed to fetch feed posts');
  }
  return response.json();
}

export default function FeedContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: fetchFeedPosts,
  });

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSmile = async (postId: string) => {
    try {
      const response = await fetch(`/api/feed/${postId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });
      
      if (response.ok) {
        toast.success('Smiles donated! 😊', {
          description: 'You donated 1 Smile to this project',
        });
      }
    } catch (error) {
      toast.error('Failed to donate Smiles', {
        description: 'Please try again later',
      });
    }
  };

  const handleAIChat = (post: any) => {
    setSelectedPost(post);
    setAiChatOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive">Error loading feed</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-screen bg-background">
      {/* Main Feed */}
      <div className="h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {posts[currentIndex] && (
            <motion.div
              key={posts[currentIndex].id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
              className="h-full relative"
            >
              {posts[currentIndex].mediaType === 'video' && (
                <VideoCard 
                  post={posts[currentIndex]}
                  onSmile={() => handleSmile(posts[currentIndex].id)}
                  onAIChat={() => handleAIChat(posts[currentIndex])}
                />
              )}
              {posts[currentIndex].mediaType === 'image' && (
                <ImageCard 
                  post={posts[currentIndex]}
                  onSmile={() => handleSmile(posts[currentIndex].id)}
                  onAIChat={() => handleAIChat(posts[currentIndex])}
                />
              )}
              {posts[currentIndex].mediaType === 'text' && (
                <TextCard 
                  post={posts[currentIndex]}
                  onSmile={() => handleSmile(posts[currentIndex].id)}
                  onAIChat={() => handleAIChat(posts[currentIndex])}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <FeedSidebar 
        post={posts[currentIndex]}
        onSmile={() => handleSmile(posts[currentIndex]?.id)}
        onAIChat={() => handleAIChat(posts[currentIndex])}
      />

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        post={selectedPost}
      />

      {/* Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex 
                ? "bg-primary" 
                : "bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
```

### 2. **Video Card Component (Updated)**

```typescript
// components/feed/VideoCard.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  post: any;
  onSmile: () => void;
  onAIChat: () => void;
}

export default function VideoCard({ post, onSmile, onAIChat }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSmile = () => {
    setIsLiked(!isLiked);
    onSmile();
  };

  return (
    <Card ref={ref} className="relative h-full w-full bg-background border-0 rounded-none">
      {/* Video */}
      <video
        ref={videoRef}
        src={post.mediaUrl}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        onClick={handleVideoClick}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        {/* Community Info */}
        <div className="absolute top-4 left-4 flex items-center space-x-3">
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={post.community.logo} alt={post.community.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.community.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-white">
            <h3 className="font-semibold">{post.community.name}</h3>
            <p className="text-sm opacity-90">{post.title}</p>
          </div>
        </div>

        {/* Description */}
        <div className="absolute bottom-20 left-4 right-20">
          <p className="text-white text-lg font-medium mb-2">
            {post.title}
          </p>
          <p className="text-white/90 text-sm line-clamp-3">
            {post.description}
          </p>
          {post.challenge && (
            <div className="mt-3 bg-primary/20 backdrop-blur-sm rounded-lg p-3">
              <Badge variant="secondary" className="bg-primary/20 text-white border-primary/30">
                Challenge: {post.challenge}
              </Badge>
            </div>
          )}
        </div>

        {/* Play/Pause Indicator */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-black/50 rounded-full p-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
```

### 3. **Feed Sidebar (Updated)**

```typescript
// components/feed/FeedSidebar.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bot, Share, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FeedSidebarProps {
  post: any;
  onSmile: () => void;
  onAIChat: () => void;
}

export default function FeedSidebar({ post, onSmile, onAIChat }: FeedSidebarProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSmile = () => {
    setIsLiked(!isLiked);
    onSmile();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Saved to your collection');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
      {/* Smile Button */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={handleSmile}
        className="flex flex-col items-center space-y-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Heart 
            className={cn(
              "h-6 w-6 transition-colors",
              isLiked ? "text-red-500 fill-red-500" : "text-white"
            )} 
          />
        </Button>
        <span className="text-white text-xs font-medium">
          {(post.smiles || 0) + (isLiked ? 1 : 0)}
        </span>
      </motion.div>

      {/* AI Chat Button */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={onAIChat}
        className="flex flex-col items-center space-y-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
        <span className="text-white text-xs font-medium">AI Chat</span>
      </motion.div>

      {/* Save Button */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={handleSave}
        className="flex flex-col items-center space-y-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Bookmark 
            className={cn(
              "h-6 w-6 transition-colors",
              isSaved ? "text-yellow-500 fill-yellow-500" : "text-white"
            )} 
          />
        </Button>
        <span className="text-white text-xs font-medium">Save</span>
      </motion.div>

      {/* Share Button */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className="flex flex-col items-center space-y-1"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Share className="h-6 w-6 text-white" />
        </Button>
        <span className="text-white text-xs font-medium">Share</span>
      </motion.div>
    </div>
  );
}
```

---

## 🤖 AI Chat Integration (Updated)

### 1. **AI Chat Component with Dialog**

```typescript
// components/feed/AIChat.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

export default function AIChat({ isOpen, onClose, post }: AIChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get or create session ID
    let id = sessionStorage.getItem('df-messenger-sessionID');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('df-messenger-sessionID', id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (isOpen && post && sessionId) {
      // Send context to DialogFlow
      const contextMessage = `{
        "agent": "smileUp", 
        "userName": "User", 
        "projectName": "${post.title}", 
        "projectDescription": "${post.description}",
        "communityName": "${post.community.name}",
        "challenge": "${post.challenge || ''}"
      }`;

      fetch(
        `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/projects/${process.env.NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID}/agents/${process.env.NEXT_PUBLIC_DIALOGFLOW_AGENT_ID}/sessions/${sessionId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queryInput: {
              text: { text: contextMessage },
              languageCode: 'en',
            },
            queryParams: { channel: 'DF_MESSENGER' },
          }),
        }
      ).catch(error => {
        console.error('Error sending context to DialogFlow:', error);
      });
    }
  }, [isOpen, post, sessionId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>SmileUp AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* DialogFlow Messenger */}
        <div className="flex-1 p-4 pt-0">
          <div className="h-full bg-muted/30 rounded-lg p-4">
            <df-messenger
              project-id={process.env.NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID}
              agent-id={process.env.NEXT_PUBLIC_DIALOGFLOW_AGENT_ID}
              language-code="en"
              max-query-length="-1"
              allow-feedback="all"
            >
              <df-messenger-chat chat-title="SmileUp AI">
              </df-messenger-chat>
            </df-messenger>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 💰 Blockchain Integration (Updated)

### 1. **Wallet Connection Component**

```typescript
// components/profile/WalletConnection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

declare global {
  interface Window {
    hashpack?: any;
  }
}

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [smilesBalance, setSmilesBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Check if HashPack is available
      if (typeof window !== 'undefined' && window.hashpack) {
        const { walletData } = await window.hashpack.connect();
        setWalletAddress(walletData.accountId);
        setIsConnected(true);
        
        // Get Smiles token balance
        const balance = await getSmilesBalance(walletData.accountId);
        setSmilesBalance(balance);
        
        toast.success('Wallet connected successfully!');
      } else {
        // Fallback: redirect to HashPack
        window.open('https://www.hashpack.app/', '_blank');
        toast.info('Please install HashPack wallet extension');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setSmilesBalance(0);
    toast.success('Wallet disconnected');
  };

  const getSmilesBalance = async (accountId: string) => {
    // Implement Hedera Token Service call to get Smiles balance
    // This is a placeholder - implement actual HTS integration
    return 1000; // Mock balance
  };

  const viewOnExplorer = () => {
    window.open(`https://hashscan.io/testnet/account/${walletAddress}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Wallet Connection
          <Wallet className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect HashPack Wallet'}
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Connected Address
                </p>
                <p className="font-mono text-sm">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={viewOnExplorer}
                className="p-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Smiles Balance</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                {smilesBalance.toLocaleString()}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </>
        )}
