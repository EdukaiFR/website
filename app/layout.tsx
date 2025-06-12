// app/layout.tsx
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='fr'>
      <body className='w-full min-h-screen font-satoshi'>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
