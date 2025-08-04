# SmileUp ImpactChain — Frontend Incorporation Guide

**Generated:** March 16, 2024  
**Version:** 1.0  
**Target:** MVP for Blockchain Hackathon

---

## 🎯 Frontend Overview

This guide provides comprehensive instructions for building the SmileUp ImpactChain frontend, incorporating the best elements from existing implementations (`smileup` and `GinUp`) while creating a modern, mobile-first design with blockchain integration.

### Key Features:
- 📱 **Mobile-first design** with responsive layout
- 🎨 **Theme system** with dark/light mode
- 📺 **TikTok-style feed** with infinite scroll
- 🤖 **AI Chat integration** from existing implementations
- 💰 **Blockchain wallet integration** for Smiles token
- 🎮 **Gamified UI** with animations and micro-interactions

---

## 🏗️ Project Structure

```
smileup-impactchain/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── feed/page.tsx
│   │   ├── missions/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── bazaar/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── common/
│   │   │   ├── Navigation.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   ├── feed/
│   │   │   ├── FeedContainer.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   ├── TextCard.tsx
│   │   │   ├── FeedSidebar.tsx
│   │   │   └── AIChat.tsx
│   │   ├── missions/
│   │   │   ├── MissionList.tsx
│   │   │   ├── MissionCard.tsx
│   │   │   └── MissionProgress.tsx
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardList.tsx
│   │   │   └── LeaderboardCard.tsx
│   │   ├── bazaar/
│   │   │   ├── RewardGrid.tsx
│   │   │   ├── RewardCard.tsx
│   │   │   └── RewardModal.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── WalletConnection.tsx
│   │       └── ActivityFeed.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── feed.ts
│   │   │   ├── missions.ts
│   │   │   └── rewards.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useFeed.ts
│   │   │   ├── useWallet.ts
│   │   │   └── useTheme.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── animations.ts
│   │   │   └── blockchain.ts
│   │   └── types/
│   │       └── index.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   └── data/
│       └── mock/
│           ├── feed.ts
│           ├── missions.ts
│           └── rewards.ts
```

---

## 🎨 Design System & Theme

### 1. **Color Palette**

```css
/* styles/theme.css */
:root {
  /* Primary Colors */
  --primary-50: #f0fdf4;
  --primary-100: #dcfce7;
  --primary-500: #22c55e;
  --primary-600: #16a34a;
  --primary-700: #15803d;
  
  /* Secondary Colors */
  --secondary-50: #fef3c7;
  --secondary-100: #fde68a;
  --secondary-500: #f59e0b;
  --secondary-600: #d97706;
  
  /* Neutral Colors */
  --neutral-50: #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e5e5e5;
  --neutral-800: #262626;
  --neutral-900: #171717;
  
  /* Smiles Token Colors */
  --smiles-gold: #ffd700;
  --smiles-bronze: #cd7f32;
  --smiles-silver: #c0c0c0;
}

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
  --border-color: #404040;
}

/* Light Mode */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --text-primary: #171717;
  --text-secondary: #525252;
  --border-color: #e5e5e5;
}
```

### 2. **Theme Provider**

```typescript
// components/common/ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Auto-detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

---

## 📱 Mobile-First Navigation

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
  Smile 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/missions', icon: Smile, label: 'Missions' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/bazaar', icon: Gift, label: 'Bazaar' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16 px-4">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center h-auto p-2"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Icon 
                    className={`text-2xl transition-colors ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}
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
                <span className={`text-xs mt-1 transition-colors ${
                  isActive 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}>
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

## 📺 TikTok-Style Feed Implementation

### 1. **Feed Container**

```typescript
// components/feed/FeedContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from './VideoCard';
import ImageCard from './ImageCard';
import TextCard from './TextCard';
import FeedSidebar from './FeedSidebar';
import AIChat from './AIChat';
import { useFeed } from '@/lib/hooks/useFeed';
import { Card } from '@/components/ui/card';

export default function FeedContainer() {
  const { posts, loading, error, loadMore } = useFeed();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSmile = async (postId: string) => {
    try {
      // Call API to donate Smiles
      await fetch(`/api/feed/${postId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });
      
      // Update local state
      // ... update post smiles count
    } catch (error) {
      console.error('Error donating Smiles:', error);
    }
  };

  const handleAIChat = (post: any) => {
    setSelectedPost(post);
    setAiChatOpen(true);
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center h-screen">
        Error: {error}
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
      {aiChatOpen && selectedPost && (
        <AIChat 
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
          post={selectedPost}
        />
      )}

      {/* Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-primary' 
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

### 2. **Video Card Component**

```typescript
// components/feed/VideoCard.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    <Card ref={ref} className="relative h-full w-full bg-background">
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
            <AvatarFallback>{post.community.name[0]}</AvatarFallback>
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
          <p className="text-white/90 text-sm">
            {post.description}
          </p>
          {post.challenge && (
            <div className="mt-3 bg-primary/20 backdrop-blur-sm rounded-lg p-3">
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
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

### 3. **Feed Sidebar**

```typescript
// components/feed/FeedSidebar.tsx
'use client';

import { motion } from 'framer-motion';
import { Smile, Bot, Share, Bookmark, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Smile className={`text-2xl ${
            isLiked ? 'text-yellow-400' : 'text-white'
          }`} />
        </Button>
        <span className="text-white text-xs font-medium">
          {post.smiles || 0}
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
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Bot className="text-2xl text-white" />
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
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Bookmark className={`text-2xl ${
            isSaved ? 'text-yellow-400' : 'text-white'
          }`} />
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
          className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Share className="text-2xl text-white" />
        </Button>
        <span className="text-white text-xs font-medium">Share</span>
      </motion.div>
    </div>
  );
}
```

---

## 🤖 AI Chat Integration

### 1. **AI Chat Component**

```typescript
// components/feed/AIChat.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot } from 'lucide-react';
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
        `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/projects/hey-buddy-425118/agents/565449f1-c5bd-40c2-8457-295ce6ae892d/sessions/${sessionId}`,
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
      <DialogContent className="sm:max-w-[425px] h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="text-2xl text-primary" />
            <span>SmileUp AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* DialogFlow Messenger */}
        <div className="h-full">
          <df-messenger
            project-id="hey-buddy-425118"
            agent-id="565449f1-c5bd-40c2-8457-295ce6ae892d"
            language-code="en"
            max-query-length="-1"
            allow-feedback="all"
          >
            <df-messenger-chat chat-title="SmileUp AI">
            </df-messenger-chat>
          </df-messenger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 💰 Blockchain Integration

### 1. **Wallet Connection**

```typescript
// components/profile/WalletConnection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

declare global {
  interface Window {
    hashpack?: any;
  }
}

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [smilesBalance, setSmilesBalance] = useState(0);

  const connectWallet = async () => {
    try {
      // Check if HashPack is available
      if (typeof window !== 'undefined' && window.hashpack) {
        const { walletData } = await window.hashpack.connect();
        setWalletAddress(walletData.accountId);
        setIsConnected(true);
        
        // Get Smiles token balance
        const balance = await getSmilesBalance(walletData.accountId);
        setSmilesBalance(balance);
      } else {
        // Fallback: redirect to HashPack
        window.open('https://www.hashpack.app/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setSmilesBalance(0);
  };

  const getSmilesBalance = async (accountId: string) => {
    // Implement Hedera Token Service call to get Smiles balance
    // This is a placeholder - implement actual HTS integration
    return 1000; // Mock balance
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Wallet Connection
          <Wallet className="text-2xl text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <Button
            onClick={connectWallet}
            className="w-full"
          >
            Connect HashPack Wallet
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">
                  Connected Address
                </p>
                <p className="font-mono text-sm">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="text-yellow-500" />
                <Badge variant="secondary">
                  {smilesBalance} Smiles
                </Badge>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🎮 Missions Page

### 1. **Mission List Component**

```typescript
// components/missions/MissionList.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MissionCard from './MissionCard';
import { useMissions } from '@/lib/hooks/useMissions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MissionList() {
  const { missions, loading, error } = useMissions();
  const [filter, setFilter] = useState('all');

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.category === filter;
  });

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center text-destructive p-4">
        Error loading missions: {error}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'daily', 'weekly', 'community'].map((tab) => (
          <Badge
            key={tab}
            variant={filter === tab ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Mission Cards */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <MissionCard mission={mission} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

## 📊 Leaderboard Page

### 1. **Leaderboard Component**

```typescript
// components/leaderboard/LeaderboardList.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LeaderboardCard from './LeaderboardCard';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardList() {
  const { leaderboard, loading, error } = useLeaderboard();
  const [period, setPeriod] = useState('all');

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex space-x-2">
        {['all', 'weekly', 'monthly'].map((p) => (
          <Badge
            key={p}
            variant={period === p ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LeaderboardCard 
              user={user} 
              rank={index + 1}
              isTopThree={index < 3}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🛍️ Bazaar/Rewards Page

### 1. **Reward Grid Component**

```typescript
// components/bazaar/RewardGrid.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import RewardCard from './RewardCard';
import { useRewards } from '@/lib/hooks/useRewards';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RewardGrid() {
  const { rewards, loading, error } = useRewards();
  const [category, setCategory] = useState('all');

  const filteredRewards = rewards.filter(reward => {
    if (category === 'all') return true;
    return reward.type === category;
  });

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'digital', 'experience', 'merchandise', 'service'].map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Reward Grid */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredRewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <RewardCard reward={reward} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Core Setup
- [ ] **Project Structure** - Set up Next.js with TypeScript
- [ ] **Theme System** - Implement dark/light mode
- [ ] **Navigation** - Bottom navigation bar
- [ ] **API Integration** - Connect to mock APIs

### Phase 2: Feed Implementation
- [ ] **Feed Container** - TikTok-style infinite scroll
- [ ] **Video/Image Cards** - Media playback
- [ ] **Sidebar Actions** - Smile, AI Chat, Share, Save
- [ ] **AI Chat Integration** - DialogFlow setup

### Phase 3: Core Pages
- [ ] **Missions Page** - Mission list and progress
- [ ] **Leaderboard Page** - User rankings
- [ ] **Bazaar Page** - Reward marketplace
- [ ] **Profile Page** - User profile and wallet

### Phase 4: Blockchain Integration
- [ ] **Wallet Connection** - HashPack integration
- [ ] **Smiles Token** - Balance display and transactions
- [ ] **Smart Contracts** - Hedera integration

### Phase 5: Polish & Testing
- [ ] **Animations** - Framer Motion implementation
- [ ] **Responsive Design** - Mobile-first optimization
- [ ] **Performance** - Loading states and caching
- [ ] **Testing** - Component and integration tests

---

**Frontend Incorporation Guide Generated:** March 16, 2024  
**Target:** MVP for Blockchain Hackathon  
**Next Steps:** Begin Phase 1 implementation 