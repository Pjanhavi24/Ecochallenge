'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const studentNavLinks = [
  { href: '/student/tasks', label: 'Tasks' },
  { href: '/student/lessons', label: 'Lessons' },
  { href: '/student/leaderboard', label: 'Leaderboard' },
  { href: '/student/eco-coach', label: 'Eco-Coach' },
  { href: '/student/profile', label: 'Profile' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/student" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {studentNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname?.startsWith(link.href) ? 'text-primary font-bold' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Mobile Logo */}
        <div className="md:hidden flex-1">
           <Link href="/student" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
             <Button asChild variant="secondary" size="sm">
              <Link href="/">Switch Role</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
