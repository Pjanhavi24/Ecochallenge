'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const studentNavLinks = [
  { href: '/student/tasks', label: 'Tasks' },
  { href: '/student/lessons', label: 'Lessons' },
  { href: '/student/leaderboard', label: 'Leaderboard' },
  { href: '/student/eco-coach', label: 'Eco-Coach' },
  { href: '/student/profile', label: 'Profile' },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center px-6">
        <div className="mr-8 hidden md:flex">
          <Link href="/student" className="mr-8 flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <Logo />
            <span className="font-heading text-xl font-semibold text-foreground">EcoChallenge</span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {studentNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative transition-all duration-200 hover:text-foreground py-2 px-1 rounded-md',
                  pathname?.startsWith(link.href)
                    ? 'text-foreground font-semibold after:absolute after:bottom-0 after:left-1 after:right-1 after:h-0.5 after:bg-primary after:rounded-full'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Mobile Logo */}
        <div className="md:hidden flex-1">
           <Link href="/student" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
            <Logo />
            <span className="font-heading text-lg font-semibold text-foreground">EcoChallenge</span>
           </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-border hover:border-accent hover:bg-accent/10"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
             <Button asChild variant="outline" size="sm" className="border-border hover:border-accent hover:bg-accent/10">
               <Link href="/">Switch Role</Link>
             </Button>
           </nav>
        </div>
      </div>
    </header>
  );
}
