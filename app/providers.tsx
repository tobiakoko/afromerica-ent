'use client';

import { ReactNode } from 'react';

/**
 * Providers component wraps the application with necessary context providers
 * Add new providers here as needed (Theme, Auth, etc.)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Add global providers here */}
      {/* Example: <ThemeProvider>...</ThemeProvider> */}
      {/* Note: CartProvider is scoped to /pilot-voting layout */}
      {children}
    </>
  );
}
