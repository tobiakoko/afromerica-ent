import { Metadata } from 'next';
 
/**
 * Base URL for the application
 */
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://afromerica-ent.com';
 
/**
 * Default SEO configuration
 */
export const DEFAULT_SEO = {
  title: 'AfroMerica Entertainment',
  description:
    'Discover amazing artists, attend unforgettable events, and immerse yourself in the vibrant world of African and Afro-Caribbean entertainment.',
  keywords: [
    'African music',
    'Afro-Caribbean entertainment',
    'live events',
    'concerts',
    'artists',
    'booking',
    'cultural events',
    'AfroMerica',
  ],
  siteName: 'AfroMerica Entertainment',
  locale: 'en_US',
  type: 'website',
};
 
/**
 * Social media handles
 */
export const SOCIAL_MEDIA = {
  twitter: '@afromerica',
  facebook: 'afromerica',
  instagram: 'afromerica',
  youtube: 'afromerica',
};
 
/**
 * Generate page metadata
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title === DEFAULT_SEO.title ? title : `${title} | ${DEFAULT_SEO.title}`;
  const fullDescription = description || DEFAULT_SEO.description;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const fullImage = image || `${BASE_URL}/og-image.png`;
  const allKeywords = [...DEFAULT_SEO.keywords, ...(keywords || [])];
 
  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: 'AfroMerica Entertainment' }],
    creator: 'AfroMerica Entertainment',
    publisher: 'AfroMerica Entertainment',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: fullUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: DEFAULT_SEO.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: DEFAULT_SEO.locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: SOCIAL_MEDIA.twitter,
      site: SOCIAL_MEDIA.twitter,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}
 
/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_SEO.siteName,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_SEO.description,
    sameAs: [
      `https://twitter.com/${SOCIAL_MEDIA.twitter}`,
      `https://facebook.com/${SOCIAL_MEDIA.facebook}`,
      `https://instagram.com/${SOCIAL_MEDIA.instagram}`,
      `https://youtube.com/${SOCIAL_MEDIA.youtube}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@afromerica-ent.com',
    },
  };
}
 
/**
 * Generate JSON-LD structured data for Event
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  image?: string;
  price?: number;
  currency?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        addressCountry: event.location.country,
      },
    },
    image: event.image ? `${BASE_URL}${event.image}` : undefined,
    offers: event.price
      ? {
          '@type': 'Offer',
          price: event.price,
          priceCurrency: event.currency || 'USD',
          availability: 'https://schema.org/InStock',
          url: event.url ? `${BASE_URL}${event.url}` : undefined,
        }
      : undefined,
    organizer: {
      '@type': 'Organization',
      name: DEFAULT_SEO.siteName,
      url: BASE_URL,
    },
  };
}
 
/**
 * Generate JSON-LD structured data for Person (Artist)
 */
export function generatePersonSchema(artist: {
  name: string;
  bio?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    description: artist.bio,
    image: artist.image ? `${BASE_URL}${artist.image}` : undefined,
    url: artist.url ? `${BASE_URL}${artist.url}` : undefined,
    sameAs: artist.sameAs,
  };
}
 
/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}
 
/**
 * Generate JSON-LD structured data for WebSite
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SEO.siteName,
    description: DEFAULT_SEO.description,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
 
/**
 * Generate JSON-LD structured data for ItemList (Artists/Events)
 */
export function generateItemListSchema(
  items: Array<{ name: string; url: string; image?: string }>,
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: `${BASE_URL}${item.url}`,
        image: item.image ? `${BASE_URL}${item.image}` : undefined,
      },
    })),
  };
}
 
/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}
 
/**
 * Generate alternate language links
 */
export function generateAlternateLinks(path: string, languages: string[] = ['en']) {
  return languages.map((lang) => ({
    hrefLang: lang,
    href: `${BASE_URL}/${lang}${path}`,
  }));
}
 
/**
 * Extract keywords from content
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove common stop words
  const stopWords = new Set([
    'the',
    'is',
    'at',
    'which',
    'on',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'with',
    'to',
    'for',
    'of',
    'as',
    'by',
    'from',
  ]);
 
  // Extract words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));
 
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
 
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
 
/**
 * Generate meta description from content
 */
export function generateDescription(text: string, maxLength: number = 155): string {
  const cleanText = text.replace(/\s+/g, ' ').trim();
 
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
 
  // Find last complete sentence within limit
  const truncated = cleanText.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
 
  if (lastPeriod > maxLength * 0.6) {
    return truncated.substring(0, lastPeriod + 1);
  }
 
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
 
  return truncated + '...';
}
 
/**
 * Format title for SEO
 */
export function formatTitle(title: string, suffix: string = DEFAULT_SEO.title): string {
  const maxLength = 60;
 
  if (title === suffix) {
    return title;
  }
 
  const fullTitle = `${title} | ${suffix}`;
 
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
 
  // Truncate the title part, keep the suffix
  const availableLength = maxLength - suffix.length - 3; // 3 for " | "
  return `${title.substring(0, availableLength)}... | ${suffix}`;
}
 
/**
 * Validate and sanitize slug
 */
export function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
 
/**
 * Generate Open Graph image URL
 */
export function generateOgImageUrl(params: {
  title: string;
  description?: string;
  image?: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set('title', params.title);
  if (params.description) searchParams.set('description', params.description);
  if (params.image) searchParams.set('image', params.image);
 
  return `${BASE_URL}/api/og?${searchParams.toString()}`;
}
 
/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, BASE_URL);
    return urlObj.origin !== new URL(BASE_URL).origin;
  } catch {
    return false;
  }
}
 
/**
 * Add nofollow to external links
 */
export function processExternalLinks(html: string): string {
  return html.replace(
    /<a\s+href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    (match, url, rest) => {
      if (isExternalUrl(url)) {
        const hasRel = /rel=/i.test(rest);
        if (hasRel) {
          return match.replace(/rel="([^"]*)"/i, 'rel="$1 nofollow"');
        }
        return `<a href="${url}"${rest} rel="nofollow">`;
      }
      return match;
    }
  );
}