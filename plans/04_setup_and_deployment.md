# SmileUp ImpactChain — Setup & Deployment Guide

**Generated:** March 16, 2024  
**Version:** 1.0  
**Target:** Quick MVP Setup for Hackathon

---

## 🚀 Quick Start Guide

### 1. **Project Setup**

```bash
# Navigate to project directory
cd smileup-impactchain

# Install dependencies
npm install

# Install additional dependencies for UI
npm install framer-motion react-intersection-observer
npm install react-icons lucide-react
npm install @tanstack/react-query
npm install next-themes
npm install sonner
npm install react-hook-form @hookform/resolvers zod
# Note: AI Chat uses DialogFlow web components (no npm packages needed)

# Start development server
npm run dev
```

### 2. **React Query Setup**

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. **Environment Configuration**

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# DialogFlow Configuration
NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID=hey-buddy-425118
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=565449f1-c5bd-40c2-8457-295ce6ae892d

# Blockchain Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_SMILES_TOKEN_ID=0.0.123456

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id
```

---

## 📱 Mobile-First Development

### 1. **Viewport Configuration**

```html
<!-- app/layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

### 2. **Touch Gestures**

```typescript
// lib/hooks/useSwipe.ts
import { useState, useEffect } from 'react';

export function useSwipe(onSwipeUp?: () => void, onSwipeDown?: () => void) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
```

---

## 🎨 Theme Implementation

### 1. **Theme Provider Setup**

```typescript
// components/common/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 2. **CSS Variables**

```css
/* styles/globals.css */
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

---

## 🤖 AI Chat Setup

### 1. **DialogFlow Integration**

```typescript
// lib/services/aiChat.ts
export class AIChatService {
  private projectId: string;
  private agentId: string;
  private sessionId: string;

  constructor() {
    this.projectId = process.env.NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID!;
    this.agentId = process.env.NEXT_PUBLIC_DIALOGFLOW_AGENT_ID!;
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('df-messenger-sessionID');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('df-messenger-sessionID', sessionId);
    }
    return sessionId;
  }

  async sendContext(post: any): Promise<void> {
    const contextMessage = `{
      "agent": "smileUp", 
      "userName": "User", 
      "projectName": "${post.title}", 
      "projectDescription": "${post.description}",
      "communityName": "${post.community.name}",
      "challenge": "${post.challenge || ''}"
    }`;

    try {
      await fetch(
        `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/projects/${this.projectId}/agents/${this.agentId}/sessions/${this.sessionId}`,
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
      );
    } catch (error) {
      console.error('Error sending context to DialogFlow:', error);
    }
  }
}
```

### 2. **Add DialogFlow Script**

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Providers } from './providers';
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
        <Providers>
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
        </Providers>
        
        {/* DialogFlow Messenger and related scripts */}
        <link rel="stylesheet" href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css" />
        <Script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

---

## 💰 Blockchain Integration

### 1. **HashPack Wallet Integration**

```typescript
// lib/services/wallet.ts
declare global {
  interface Window {
    hashpack?: any;
  }
}

export class WalletService {
  private isConnected = false;
  private accountId = '';

  async connect(): Promise<{ success: boolean; accountId?: string }> {
    try {
      if (typeof window !== 'undefined' && window.hashpack) {
        const { walletData } = await window.hashpack.connect();
        this.accountId = walletData.accountId;
        this.isConnected = true;
        return { success: true, accountId: walletData.accountId };
      } else {
        // Fallback: redirect to HashPack
        window.open('https://www.hashpack.app/', '_blank');
        return { success: false };
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false };
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.accountId = '';
  }

  async getSmilesBalance(accountId: string): Promise<number> {
    // Implement Hedera Token Service call
    // This is a placeholder - implement actual HTS integration
    return 1000; // Mock balance
  }

  async transferSmiles(toAccountId: string, amount: number): Promise<boolean> {
    // Implement Smiles token transfer
    // This is a placeholder - implement actual HTS integration
    console.log(`Transferring ${amount} Smiles to ${toAccountId}`);
    return true; // Mock success
  }
}
```

### 2. **Wallet Hook**

```typescript
// lib/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { WalletService } from '@/lib/services/wallet';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [smilesBalance, setSmilesBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const walletService = new WalletService();

  const connect = async () => {
    setLoading(true);
    try {
      const result = await walletService.connect();
      if (result.success && result.accountId) {
        setIsConnected(true);
        setAccountId(result.accountId);
        
        // Get Smiles balance
        const balance = await walletService.getSmilesBalance(result.accountId);
        setSmilesBalance(balance);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    await walletService.disconnect();
    setIsConnected(false);
    setAccountId('');
    setSmilesBalance(0);
  };

  const transferSmiles = async (toAccountId: string, amount: number) => {
    try {
      const success = await walletService.transferSmiles(toAccountId, amount);
      if (success) {
        setSmilesBalance(prev => prev - amount);
      }
      return success;
    } catch (error) {
      console.error('Error transferring Smiles:', error);
      return false;
    }
  };

  return {
    isConnected,
    accountId,
    smilesBalance,
    loading,
    connect,
    disconnect,
    transferSmiles,
  };
}
```

---

## 📱 Navigation Implementation

### 1. **Bottom Navigation**

```typescript
// components/common/Navigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaTrophy, 
  FaGift, 
  FaUser, 
  FaSmile 
} from 'react-icons/fa';

const navigationItems = [
  { href: '/feed', icon: FaHome, label: 'Feed' },
  { href: '/missions', icon: FaSmile, label: 'Missions' },
  { href: '/leaderboard', icon: FaTrophy, label: 'Leaderboard' },
  { href: '/bazaar', icon: FaGift, label: 'Bazaar' },
  { href: '/profile', icon: FaUser, label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-around items-center h-16 px-4">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link key={href} href={href} className="flex flex-col items-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon 
                  className={`text-2xl transition-colors ${
                    isActive 
                      ? 'text-primary-500' 
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              <span className={`text-xs mt-1 transition-colors ${
                isActive 
                  ? 'text-primary-500 font-medium' 
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 🎯 API Integration

### 1. **API Client Setup**

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Feed endpoints
  async getFeedPosts(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request(`/feed?${searchParams.toString()}`);
  }

  async donateSmiles(postId: string, amount: number) {
    return this.request(`/feed/${postId}/donate`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Missions endpoints
  async getMissions() {
    return this.request('/missions');
  }

  async acceptMission(missionId: string) {
    return this.request(`/missions/${missionId}/accept`, {
      method: 'POST',
    });
  }

  async completeMission(missionId: string, proof: any) {
    return this.request(`/missions/${missionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(proof),
    });
  }

  // Rewards endpoints
  async getRewards() {
    return this.request('/rewards');
  }

  async redeemReward(rewardId: string) {
    return this.request(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getLeaderboard() {
    return this.request('/leaderboard');
  }
}

export const apiClient = new ApiClient();
```

### 2. **Custom Hooks**

```typescript
// lib/hooks/useFeed.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export function useFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFeedPosts();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return { posts, loading, error, loadPosts };
}
```

---

## 🚀 Deployment

### 1. **Vercel Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID=your-project-id
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id
```

### 2. **Environment Variables**

```env
# Production
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_DIALOGFLOW_PROJECT_ID=your-project-id
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id
NEXT_PUBLIC_HEDERA_NETWORK=mainnet
NEXT_PUBLIC_SMILES_TOKEN_ID=0.0.123456
```

### 3. **Build Configuration**

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🧪 Testing

### 1. **Component Testing**

```typescript
// __tests__/components/FeedContainer.test.tsx
import { render, screen } from '@testing-library/react';
import FeedContainer from '@/components/feed/FeedContainer';

describe('FeedContainer', () => {
  it('renders loading state', () => {
    render(<FeedContainer />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### 2. **API Testing**

```typescript
// __tests__/api/feed.test.ts
import { apiClient } from '@/lib/api/client';

describe('Feed API', () => {
  it('should fetch feed posts', async () => {
    const posts = await apiClient.getFeedPosts();
    expect(posts).toBeDefined();
    expect(Array.isArray(posts.posts)).toBe(true);
  });
});
```

---

## 📋 Implementation Checklist

### ✅ Setup Complete
- [ ] **Project Structure** - Next.js with TypeScript
- [ ] **Dependencies** - All required packages installed
- [ ] **Environment** - Configuration files set up
- [ ] **Theme System** - Dark/light mode working
- [ ] **Navigation** - Bottom navigation implemented
- [ ] **API Integration** - Mock APIs connected

### ✅ Core Features
- [ ] **Feed** - TikTok-style infinite scroll
- [ ] **AI Chat** - DialogFlow integration
- [ ] **Missions** - Mission list and progress
- [ ] **Leaderboard** - User rankings
- [ ] **Bazaar** - Reward marketplace
- [ ] **Profile** - User profile and wallet

### ✅ Blockchain Features
- [ ] **Wallet Connection** - HashPack integration
- [ ] **Smiles Token** - Balance display
- [ ] **Transactions** - Token transfers

### ✅ Polish & Deploy
- [ ] **Animations** - Framer Motion
- [ ] **Responsive Design** - Mobile-first
- [ ] **Performance** - Loading states
- [ ] **Deployment** - Vercel setup

---

**Setup & Deployment Guide Generated:** March 16, 2024  
**Target:** MVP for Blockchain Hackathon  
**Status:** Ready for Implementation 