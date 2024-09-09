import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import '@mantine/core/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://smll.app'),
  title: 'Smll',
  description:
    'Powerful, fast, and easy to use link shortener. Think big, link smll.',
  icons: {
    icon: '/favicon.png'
  },
  alternates: {
    canonical: '/'
  },
  twitter: {
    title: 'Smll',
    description:
      'Powerful, fast, and easy to use link shortener. Think big, link smll.',
    creator: '@waxer59',
    card: 'summary_large_image'
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Smll',
    description:
      'Powerful, fast, and easy to use link shortener. Think big, link smll.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} bg-zinc-950 dark h-full`}>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
