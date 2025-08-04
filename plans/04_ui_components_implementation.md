# SmileUp ImpactChain — UI Components Implementation Guide

**Generated:** March 16, 2024  
**Version:** 1.0  
**Focus:** MVP Components for Hackathon

---

## 🎯 Component Implementation Overview

This guide provides detailed implementation instructions for all UI components, including setup, styling, and integration with the backend APIs.

---

## 🛠️ Setup Instructions

### 1. **Install Dependencies**

```bash
# Core dependencies
npm install framer-motion react-intersection-observer
npm install react-icons lucide-react
npm install @tanstack/react-query
npm install next-themes
npm install sonner
npm install react-hook-form @hookform/resolvers zod

# For blockchain integration
npm install @hashgraph/sdk

# Note: AI Chat uses DialogFlow web components (no npm packages needed)
```

### 2. **Tailwind Configuration**

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        secondary: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
        },
        smiles: {
          gold: '#ffd700',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
};

export default config;
```

---

## 📱 Mobile-First Layout

### 1. **Root Layout**

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/components/common/ThemeProvider';
import Navigation from '@/components/common/Navigation';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-50 dark:bg-neutral-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen pb-16">
            {children}
            <Navigation />
          </div>
        </ThemeProvider>
        
        {/* DialogFlow Messenger and related scripts */}
        <link rel="stylesheet" href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css" />
        <Script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

### 2. **Global Styles**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 142.1 76.2% 36.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 142.1 70.6% 45.3%;
    --primary-foreground: 144.9 80.4% 10%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 142.1 76.2% 36.3%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* DialogFlow Messenger Customization */
.dark {
  /* Message Bubbles */
  --df-messenger-message-bot-background: linear-gradient(
    to bottom right,
    hsl(var(--secondary)),
    hsl(var(--card))
  );
  --df-messenger-message-user-background: linear-gradient(
    to bottom right,
    hsl(var(--muted)),
    hsl(var(--card))
  );
  --df-messenger-message-user-font-color: hsl(var(--foreground));
  --df-messenger-message-bot-writing-font-color: hsl(var(--foreground));
  
  /* Input Area */
  --df-messenger-input-box-background: hsl(var(--muted));
  --df-messenger-input-box-border: 1px solid hsl(var(--border));
  --df-messenger-input-box-focus-border: 2px solid hsl(var(--primary));
  
  /* Feedback Icons */
  --df-messenger-message-feedback-icon-font-color: hsl(var(--primary));
  
  /* Chat Area */
  --df-messenger-chat-background: hsl(var(--background));
  
  /* Titlebar */
  --df-messenger-titlebar-background: linear-gradient(
    to right,
    hsl(var(--primary)),
    hsl(var(--primary-foreground))
  );
  --df-messenger-titlebar-font-color: hsl(var(--foreground));
  
  /* Buttons */
  --df-messenger-button-titlebar-color: hsl(var(--primary));
  --df-messenger-chat-scroll-button-background: hsl(var(--foreground));
  --df-messenger-chat-scroll-button-font-color: hsl(var(--primary));
  --df-messenger-link-font-color: hsl(var(--primary));
  --df-messenger-link-hover-font-color: hsl(var(--primary));
  
  /* Border radius */
  --df-messenger-message-bot-border-top-left-radius: 16px;
  --df-messenger-message-bot-border-top-right-radius: 16px;
  --df-messenger-message-bot-border-bottom-left-radius: 16px;
  --df-messenger-message-bot-border-bottom-right-radius: 16px;
  --df-messenger-message-user-border-top-left-radius: 16px;
  --df-messenger-message-user-border-top-right-radius: 16px;
  --df-messenger-message-user-border-bottom-left-radius: 16px;
  --df-messenger-message-user-border-bottom-right-radius: 16px;
  
  /* General styling */
  --df-messenger-font-family: "Inter", sans-serif;
  --df-messenger-font-size: 14px;
  --df-messenger-font-color: hsl(var(--foreground));
  --df-messenger-primary-color: hsl(var(--primary));
  --df-messenger-input-background: hsl(var(--muted));
  --df-messenger-message-feedback-icon-background: transparent;
  --df-messenger-message-feedback-icon-font-color-active: hsl(var(--primary));
  --df-messenger-send-icon-color: hsl(var(--primary));
}
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hide scrollbar for mobile */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 📺 Feed Implementation

### 1. **Feed Page**

```typescript
// app/feed/page.tsx
'use client';

import FeedContainer from '@/components/feed/FeedContainer';

export default function FeedPage() {
  return (
    <div className="h-screen bg-black">
      <FeedContainer />
    </div>
  );
}
```

### 2. **Feed Container with API Integration**

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

export default function FeedContainer() {
  const { posts, loading, error, loadMore } = useFeed();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Handle swipe gestures
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Handle Smiles donation
  const handleSmile = async (postId: string) => {
    try {
      const response = await fetch(`/api/feed/${postId}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 })
      });
      
      if (response.ok) {
        // Update local state or trigger refetch
        console.log('Smiles donated successfully');
      }
    } catch (error) {
      console.error('Error donating Smiles:', error);
    }
  };

  // Handle AI Chat
  const handleAIChat = (post: any) => {
    setSelectedPost(post);
    setAiChatOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black">
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
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3. **Video Card with Intersection Observer**

```typescript
// components/feed/VideoCard.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
    <div ref={ref} className="relative h-full w-full bg-black">
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
          <img 
            src={post.community.logo} 
            alt={post.community.name}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
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
            <div className="mt-3 bg-primary-500/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-primary-300 text-sm font-medium">
                Challenge: {post.challenge}
              </p>
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
    </div>
  );
}
```

---

## 🤖 AI Chat Integration

### 1. **AI Chat Component with DialogFlow**

```typescript
// components/feed/AIChat.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Bot } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  post?: any;
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
        <div className="flex-1 relative">
          <df-messenger
            project-id="hey-buddy-425118"
            agent-id="565449f1-c5bd-40c2-8457-295ce6ae892d"
            language-code="en"
            max-query-length="-1"
            allow-feedback="all"
          >
            <df-messenger-chat chat-title="SmileUp AI"></df-messenger-chat>
          </df-messenger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 2. **Add DialogFlow Script to Layout**

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-neutral-50 dark:bg-neutral-900">
        <ThemeProvider>
          <div className="min-h-screen pb-16">
            {children}
            <Navigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 💰 Blockchain Integration

### 1. **Wallet Connection Component**

```typescript
// components/profile/WalletConnection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaCoins } from 'react-icons/fa';

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
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Wallet Connection
        </h3>
        <FaWallet className="text-2xl text-primary-500" />
      </div>

      {!isConnected ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={connectWallet}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Connect HashPack Wallet
        </motion.button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Connected Address
              </p>
              <p className="font-mono text-sm text-neutral-900 dark:text-white">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCoins className="text-yellow-500" />
              <span className="font-semibold text-neutral-900 dark:text-white">
                {smilesBalance} Smiles
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={disconnectWallet}
            className="w-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </motion.button>
        </div>
      )}
    </div>
  );
}
```

---

## 🎮 Missions Implementation

### 1. **Mission Card Component**

```typescript
// components/missions/MissionCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSmile, FaClock, FaTrophy, FaCheck } from 'react-icons/fa';

interface MissionCardProps {
  mission: any;
}

export default function MissionCard({ mission }: MissionCardProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/missions/${mission.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsAccepted(true);
      }
    } catch (error) {
      console.error('Error accepting mission:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch(`/api/missions/${mission.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proofType: 'text',
          proofText: 'Mission completed!'
        })
      });
      
      if (response.ok) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error completing mission:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800"
    >
      {/* Mission Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{mission.icon}</div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              {mission.title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {mission.category}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaTrophy className="text-yellow-500" />
          <span className="font-semibold text-neutral-900 dark:text-white">
            {mission.reward} Smiles
          </span>
        </div>
      </div>

      {/* Mission Description */}
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        {mission.description}
      </p>

      {/* Mission Details */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FaClock className="text-neutral-400" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {mission.requiredTime}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaSmile className="text-neutral-400" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {mission.effortLevel} Effort
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          mission.status === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : mission.status === 'accepted'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
        }`}>
          {mission.status}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {mission.status === 'available' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAccept}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Accept Mission
          </motion.button>
        )}
        
        {mission.status === 'accepted' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Complete Mission
          </motion.button>
        )}
        
        {mission.status === 'completed' && (
          <div className="flex-1 flex items-center justify-center text-green-500">
            <FaCheck className="mr-2" />
            Completed!
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

---

## 📊 Leaderboard Implementation

### 1. **Leaderboard Card Component**

```typescript
// components/leaderboard/LeaderboardCard.tsx
'use client';

import { motion } from 'framer-motion';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface LeaderboardCardProps {
  user: any;
  rank: number;
  isTopThree: boolean;
}

export default function LeaderboardCard({ user, rank, isTopThree }: LeaderboardCardProps) {
  const getRankIcon = () => {
    if (rank === 1) return <FaTrophy className="text-yellow-500" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-600" />;
    return null;
  };

  const getRankColor = () => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    return 'bg-white dark:bg-neutral-900';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${getRankColor()} rounded-xl p-4 shadow-lg border border-neutral-200 dark:border-neutral-800`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getRankIcon()}
            <span className="font-bold text-lg text-neutral-900 dark:text-white">
              #{rank}
            </span>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-white dark:border-neutral-800"
          />
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              {user.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Level {user.level}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <FaTrophy className="text-yellow-500" />
            <span className="font-bold text-lg text-neutral-900 dark:text-white">
              {user.smiles}
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.score} points
          </p>
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 🛍️ Bazaar Implementation

### 1. **Reward Card Component**

```typescript
// components/bazaar/RewardCard.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaGift } from 'react-icons/fa';

interface RewardCardProps {
  reward: any;
}

export default function RewardCard({ reward }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async () => {
    setIsRedeeming(true);
    try {
      const response = await fetch(`/api/rewards/${reward.id}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Show success message
        console.log('Reward redeemed successfully!');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800"
    >
      {/* Reward Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
        <img 
          src={reward.imageUrl} 
          alt={reward.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white dark:bg-neutral-900 rounded-full p-2 shadow-lg">
          <div className="text-2xl">{reward.emoji}</div>
        </div>
      </div>

      {/* Reward Info */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
          {reward.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          {reward.description}
        </p>

        {/* Provider Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img 
              src={reward.community.logo} 
              alt={reward.community.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {reward.community.name}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaCoins className="text-yellow-500" />
            <span className="font-semibold text-neutral-900 dark:text-white">
              {reward.cost}
            </span>
          </div>
        </div>

        {/* Redeem Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRedeem}
          disabled={isRedeeming}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isRedeeming ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Redeeming...</span>
            </>
          ) : (
            <>
              <FaGift />
              <span>Redeem Reward</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Core Setup ✅
- [ ] **Project Structure** - Next.js with TypeScript
- [ ] **Theme System** - Dark/light mode
- [ ] **Navigation** - Bottom navigation bar
- [ ] **API Integration** - Connect to mock APIs

### Phase 2: Feed Implementation ✅
- [ ] **Feed Container** - TikTok-style infinite scroll
- [ ] **Video/Image Cards** - Media playback
- [ ] **Sidebar Actions** - Smile, AI Chat, Share, Save
- [ ] **AI Chat Integration** - DialogFlow setup

### Phase 3: Core Pages ✅
- [ ] **Missions Page** - Mission list and progress
- [ ] **Leaderboard Page** - User rankings
- [ ] **Bazaar Page** - Reward marketplace
- [ ] **Profile Page** - User profile and wallet

### Phase 4: Blockchain Integration ✅
- [ ] **Wallet Connection** - HashPack integration
- [ ] **Smiles Token** - Balance display and transactions
- [ ] **Smart Contracts** - Hedera integration

### Phase 5: Polish & Testing ✅
- [ ] **Animations** - Framer Motion implementation
- [ ] **Responsive Design** - Mobile-first optimization
- [ ] **Performance** - Loading states and caching
- [ ] **Testing** - Component and integration tests

---

**UI Components Implementation Guide Generated:** March 16, 2024  
**Target:** MVP for Blockchain Hackathon  
**Next Steps:** Begin Phase 1 implementation 