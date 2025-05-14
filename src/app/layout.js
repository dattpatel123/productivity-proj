
'use client';

import { Quicksand } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.className} data-theme="dark">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
