'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Gift, User, Smile } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center h-auto p-2 min-w-0 transition-colors ${
                  isActive ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-muted'
                }`}
              >
                <Icon
                  className={`text-2xl transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
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