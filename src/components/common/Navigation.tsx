'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Trophy,
  Gift,
  User,
  Smile,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    href: '/feed',
    icon: Home,
    label: 'Feed',
    color: 'from-primary to-primary/80'
  },
  {
    href: '/missions',
    icon: Smile,
    label: 'Missions',
    color: 'from-green-500 to-emerald-600'
  },
  {
    href: '/leaderboard',
    icon: Trophy,
    label: 'Leaderboard',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    href: '/bazaar',
    icon: Gift,
    label: 'Bazaar',
    color: 'from-pink-500 to-rose-500'
  },
  {
    href: '/profile',
    icon: User,
    label: 'Profile',
    color: 'from-blue-500 to-indigo-600'
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100]">
        <div className="relative mx-3 mb-3">
          {/* Glass morphism background with enhanced styling */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl rounded-2xl border border-border/30 shadow-xl" />

          {/* Navigation items */}
          <div className="relative flex items-center justify-around px-1 py-2 rounded-2xl">
            {navigationItems.map(({ href, icon: Icon, label, color }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex flex-col items-center justify-center py-1"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex flex-col items-center justify-center h-auto p-2 min-w-0 transition-all duration-300 rounded-xl w-full",
                        "hover:bg-accent/20 active:bg-accent/30",
                        isActive && `bg-gradient-to-r ${color} text-primary-foreground shadow-md`
                      )}
                    >
                      <div className="relative flex flex-col items-center">
                        <Icon
                          className={cn(
                            "text-lg transition-all duration-300 mb-0.5",
                            isActive
                              ? "text-primary-foreground drop-shadow-sm"
                              : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium transition-all duration-300 leading-none",
                            isActive
                              ? "text-primary-foreground drop-shadow-sm"
                              : "text-muted-foreground"
                          )}
                        >
                          {label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary-foreground rounded-full shadow-sm"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
} 