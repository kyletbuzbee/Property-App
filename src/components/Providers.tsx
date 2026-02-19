'use client';

import { ReactNode } from 'react';
import { PropertyProvider } from '@/context/PropertyContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PropertyProvider>
      {children}
    </PropertyProvider>
  );
}
