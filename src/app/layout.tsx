import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import RootProvider from '@/components/providers/root-provider';

import { Recursive, IBM_Plex_Sans } from 'next/font/google';

// Configure fonts
const recursive = Recursive({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-recursive',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
  title: 'Notivus - Note Taking Application',
  description: 'A modern note-taking application with collaborative features',
  icons: {
    icon: '/notivus-icon.svg',
  },
  keywords: [
    'note',
    'taking',
    'application',
    'note-taking',
    'note-taker',
    'note-taking-app',
    'note-taker-app',
    'note-taking-application',
    'note-taker-application',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/notivus-icon.svg" />
      </head>
      <body className={`${recursive.variable} ${ibmPlexSans.variable} font-body`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
