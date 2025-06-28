import { Quicksand } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import SessionProviderWrapper from './SessionProviderWrapper';

const quicksand = Quicksand({
  weight: '400',
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.className} data-theme="dark">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        
      </body>
    </html>
  );
}
