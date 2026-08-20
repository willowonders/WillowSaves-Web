'use client';

import { ReactNode } from 'react';
import { FabProvider } from '@/lib/fab-context';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <FabProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </FabProvider>
  );
}
