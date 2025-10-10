import type { Metadata } from 'next';
import { Comfortaa, Righteous } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import LenisProvider from '@/components/LenisProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'EcoChallenge',
  description: 'Gamified eco-tasks for students.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body
        className={`${comfortaa.variable} ${righteous.variable} font-sans antialiased bg-background min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LenisProvider>
            <div className="relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="relative z-10">
                {children}
              </div>
            </div>
            <Toaster />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
