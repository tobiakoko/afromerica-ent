import type { NavItem, SocialLink, MusicPlatform, FooterSocialLink } from '@/types';

/**
 * Site Configuration
 *
 * Central configuration for all site metadata, links, and settings.
 * Update these values with your production URLs and information.
 */

export const siteConfig = {
  name: 'Afromerica Entertainment',
  description: 'Discover music, events and more from the best African and Afro-Caribbean artists. Celebrating culture through music, art, and unforgettable experiences.',
  tagline: 'Voice of Soul, Sound of Now',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://afromerica-entertainment.com',
  ogImage: '/og-image.jpg',

  // Brand
  brand: {
    initial: 'A',
    fullName: 'Afromerica Entertainment',
    shortName: 'AfroMerica',
  },

  // Main Navigation
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Artists', href: '/artists' },
    { label: 'Events', href: '/events' },
    { label: 'Pilot Vote', href: '/pilot-vote' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],

  // Footer Navigation Groups
  footerLinks: {
    company: [
      { label: 'About', href: '/about' },
      { label: 'Artists', href: '/artists' },
      { label: 'Events', href: '/events' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms of Service', href: '/legal/terms' },
      { label: 'Cookie Policy', href: '/legal/cookies' },
    ],
  },

  // Social Media Links
  // TODO: Update with your actual social media handles
  socialLinks: {
    facebook: 'https://facebook.com/afromericaent',
    instagram: 'https://instagram.com/afromericaent',
    twitter: 'https://twitter.com/afromericaent',
    youtube: 'https://youtube.com/@afromericaent',
    tiktok: 'https://tiktok.com/@afromericaent',
    linkedin: 'https://linkedin.com/company/afromerica-entertainment',
  },

  // Social Links Array (with Lucide icons)
  footerSocialLinks: [
    { platform: 'facebook', label: 'Facebook', href: 'https://facebook.com/afromericaent' },
    { platform: 'instagram', label: 'Instagram', href: 'https://instagram.com/afromericaent' },
    { platform: 'twitter', label: 'Twitter', href: 'https://twitter.com/afromericaent' },
    { platform: 'youtube', label: 'YouTube', href: 'https://youtube.com/@afromericaent' },
  ] as FooterSocialLink[],

  // Music Streaming Platforms
  // TODO: Update with your actual artist/label profiles
  musicPlatforms: [
    {
      name: 'Spotify',
      label: 'Listen on Spotify',
      href: 'https://open.spotify.com/user/afromericaent',
      icon: 'spotify',
    },
    {
      name: 'Apple Music',
      label: 'Listen on Apple Music',
      href: 'https://music.apple.com/us/artist/afromerica',
      icon: 'apple',
    },
    {
      name: 'SoundCloud',
      label: 'Listen on SoundCloud',
      href: 'https://soundcloud.com/afromericaent',
      icon: 'cloud',
    },
    {
      name: 'YouTube Music',
      label: 'Listen on YouTube Music',
      href: 'https://music.youtube.com/channel/afromericaent',
      icon: 'youtube',
    },
  ] as MusicPlatform[],

  // Contact Information
  // TODO: Update with your actual contact details
  contact: {
    email: 'info@afromerica-entertainment.com',
    bookings: 'bookings@afromerica-entertainment.com',
    press: 'press@afromerica-entertainment.com',
    phone: '+234 (0) 800 123 4567', // Update with actual phone
    location: 'Lagos, Nigeria',
    address: {
      street: '123 Entertainment Avenue',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      postal: '100001',
    },
    businessHours: 'Mon - Fri: 9:00 AM - 6:00 PM WAT',
  },

  // SEO Configuration
  seo: {
    keywords: [
      'african music',
      'afro-caribbean entertainment',
      'live events',
      'concerts',
      'african artists',
      'music events',
      'entertainment booking',
      'afrobeats',
      'Lagos entertainment',
      'Nigerian music',
    ],
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterSite: '@afromericaent',
    twitterCreator: '@afromericaent',
  },

  // Developer Credit
  developer: {
    name: 'Tobi Akoko',
    url: 'https://github.com/tobiakoko', // Update with actual URL
  },

  // Feature Flags
  features: {
    pilotVoting: true,
    newsletter: true,
    bookings: true,
    merchandise: false, // Enable when ready
    blog: false, // Enable when ready
  },
};

// Helper function to get config
export async function getSiteConfig() {
  return siteConfig;
}

// Helper to get social link by platform
export function getSocialLink(platform: keyof typeof siteConfig.socialLinks): string {
  return siteConfig.socialLinks[platform];
}

// Helper to check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof siteConfig.features): boolean {
  return siteConfig.features[feature];
}
