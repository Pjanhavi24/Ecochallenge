'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/student/tasks', label: 'Tasks', icon: Home },
  { href: '/student/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/student/eco-coach', label: 'Coach', icon: Sparkles },
  { href: '/student/leaderboard', label: 'Ranks', icon: Trophy },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50">
      <div className="flex justify-around items-center h-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-sm',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
