import React from 'react';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import AuthProvider from '@/components/AuthProvider';
import SmoothScrolling from '@/components/SmoothScrolling';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: 'Sweksha Beauty | Best Parlour in Haveli Kharagpur',
    template: '%s | Sweksha Beauty'
  },
  description: 'Sweksha Beauty - Your go-to parlour for glow, gloss and confidence. Expert services in waxing, facials, hair care, and bridal makeup in Haveli Kharagpur, Munger.',
  keywords: ['Beauty Parlour', 'Haveli Kharagpur', 'Munger', 'Bridal Makeup', 'Facial', 'Hair Spa', 'Waxing', 'Salon', 'Sweksha Beauty'],
  authors: [{ name: 'Sweksha Beauty' }],
  creator: 'Sweksha Beauty',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://swekshabeauty.com',
    title: 'Sweksha Beauty | Best Parlour in Haveli Kharagpur',
    description: 'Expert beauty services including bridal makeup, facials, and hair care. Visit us in Haveli Kharagpur.',
    siteName: 'Sweksha Beauty',
    images: [
      {
        url: '/images/og-image.jpg', // We will need to ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'Sweksha Beauty Salon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sweksha Beauty | Best Parlour in Haveli Kharagpur',
    description: 'Expert beauty services including bridal makeup, facials, and hair care.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-brand-bg text-gray-800`}>
        <AuthProvider>
          <SmoothScrolling>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingButtons />
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
