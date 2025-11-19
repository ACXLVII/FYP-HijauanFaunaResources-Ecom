'use client'

import { CartProvider } from '@/app/hooks/useCart';

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}