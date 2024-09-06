import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

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
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 dark`}>{children}</body>
    </html>
  );
}
