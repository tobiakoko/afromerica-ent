import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"
import { APP_METADATA, BRAND_COLORS, SOCIAL_HANDLES, SEO_CONFIG } from '@/lib/constants'

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
    default: `${APP_METADATA.NAME} - African Music & Events`,
    template: `%s | ${APP_METADATA.NAME}`,
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: [...SEO_CONFIG.KEYWORDS],
  authors: [{ name: APP_METADATA.AUTHOR }],
  creator: APP_METADATA.AUTHOR,
  publisher: APP_METADATA.AUTHOR,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_METADATA.URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_METADATA.URL,
    siteName: APP_METADATA.NAME,
    title: `${APP_METADATA.NAME} - African Music & Events`,
    description: APP_METADATA.DESCRIPTION,
    images: [
      {
        url: APP_METADATA.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: APP_METADATA.NAME,
      },
    ],
  },
  twitter: {
    card: SEO_CONFIG.TWITTER_CARD,
    site: SOCIAL_HANDLES.TWITTER,
    creator: SOCIAL_HANDLES.TWITTER,
    title: `${APP_METADATA.NAME} - African Music & Events`,
    description: APP_METADATA.DESCRIPTION,
    images: [APP_METADATA.OG_IMAGE],
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
  themeColor: BRAND_COLORS.ORANGE,
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