'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DesktopTopBar } from './DesktopTopBar';
import { GlobalModals } from '@/components/GlobalModals';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F2F3F5] dark:bg-canvas-dark flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60 min-w-0 overflow-hidden">
        <Header />
        <DesktopTopBar />
        <main className="flex-1 p-4 sm:p-6 overflow-hidden min-w-0">
          {children}
        </main>
      </div>
      <GlobalModals />
    </div>
  );
}
