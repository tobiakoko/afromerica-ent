import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Afromerica Entertainment - African Music & Events',
    template: '%s | Afromerica Entertainment',
  },
  description: 'Discover the hottest African music events, artists, and experiences. Book tickets to festivals, concerts, and cultural celebrations.',
  keywords: ['African music', 'events', 'concerts', 'festivals', 'Afrobeat', 'tickets', 'Nigeria', 'Ghana', 'Kenya'],
  authors: [{ name: 'Afromerica Entertainment' }],
  creator: 'Afromerica Entertainment',
  publisher: 'Afromerica Entertainment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://afromerica.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Afromerica Entertainment',
    title: 'Afromerica Entertainment - African Music & Events',
    description: 'Discover the hottest African music events, artists, and experiences.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Afromerica Entertainment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@afromerica',
    creator: '@afromerica',
    title: 'Afromerica Entertainment - African Music & Events',
    description: 'Discover the hottest African music events, artists, and experiences.',
    images: ['/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6B00',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}