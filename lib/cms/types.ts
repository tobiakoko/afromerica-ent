import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Base Sanity Document
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

// Sanity Image with metadata
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Block Content (Rich Text)
export interface BlockContent {
  _type: "block";
  children: Array<{
    _type: "span";
    text: string;
    marks?: string[];
  }>;
  style?: string;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

// Artist
export interface Artist extends SanityDocument {
  _type: "artist";
  name: string;
  slug: {
    current: string;
  };
  image: SanityImage;
  bio: BlockContent[];
  genre: string[];
  location: string;
  city: string;
  state: string;
  country: string;
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
  };
  specialties: string[];
  awards?: string[];
  rating?: number;
  totalBookings?: number;
  joinedDate: string;
  status: "active" | "inactive";
  featured?: boolean;
}

// Event
export interface Event extends SanityDocument {
  _type: "event";
  title: string;
  slug: {
    current: string;
  };
  description: BlockContent[];
  shortDescription?: string;
  image: SanityImage;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  artists: Array<{
    _ref: string;
    _type: "reference";
    _key: string;
  }>;
  lineup?: Array<{
    artist: {
      _ref: string;
      _type: "reference";
    };
    role: string;
    setTime?: string;
  }>;
  pricing: {
    earlyBird?: number;
    general: number;
    vip?: number;
    currency: string;
  };
  capacity: number;
  attendees?: number;
  highlights?: string[];
  ageRequirement?: string;
  dressCode?: string;
  refundPolicy?: string;
  accessibility?: string;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  featured?: boolean;
  ticketUrl?: string;
}

// Page Content (for About, Contact, etc.)
export interface PageContent extends SanityDocument {
  _type: "page";
  title: string;
  slug: {
    current: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: SanityImage;
  };
  sections: Array<ContentSection>;
}

// Content Section
export type ContentSection =
  | HeroSection
  | FeaturesSection
  | StatsSection
  | TeamSection
  | CTASection
  | RichTextSection;

export interface HeroSection {
  _type: "heroSection";
  _key: string;
  heading: string;
  subheading?: string;
  image?: SanityImage;
  ctaButtons?: Array<{
    _key: string;
    text: string;
    url: string;
    variant: "primary" | "secondary";
  }>;
}

export interface FeaturesSection {
  _type: "featuresSection";
  _key: string;
  heading: string;
  subheading?: string;
  features: Array<{
    _key: string;
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface StatsSection {
  _type: "statsSection";
  _key: string;
  heading?: string;
  stats: Array<{
    _key: string;
    number: string;
    label: string;
  }>;
}

export interface TeamSection {
  _type: "teamSection";
  _key: string;
  heading: string;
  subheading?: string;
  members: Array<{
    _key: string;
    name: string;
    position: string;
    bio?: string;
    image?: SanityImage;
  }>;
}

export interface CTASection {
  _type: "ctaSection";
  _key: string;
  heading: string;
  description?: string;
  buttons: Array<{
    _key: string;
    text: string;
    url: string;
    variant: "primary" | "secondary";
  }>;
  backgroundColor?: string;
}

export interface RichTextSection {
  _type: "richTextSection";
  _key: string;
  content: BlockContent[];
}

// Site Settings
export interface SiteSettings extends SanityDocument {
  _type: "siteSettings";
  title: string;
  description: string;
  logo?: SanityImage;
  favicon?: SanityImage;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  navigation: Array<{
    _key: string;
    title: string;
    url: string;
  }>;
  footer: {
    copyright: string;
    links: Array<{
      _key: string;
      title: string;
      links: Array<{
        _key: string;
        title: string;
        url: string;
      }>;
    }>;
  };
}

// Testimonial
export interface Testimonial extends SanityDocument {
  _type: "testimonial";
  name: string;
  role?: string;
  company?: string;
  image?: SanityImage;
  quote: string;
  rating?: number;
  featured?: boolean;
}

// Blog Post
export interface BlogPost extends SanityDocument {
  _type: "post";
  title: string;
  slug: {
    current: string;
  };
  author: {
    _ref: string;
    _type: "reference";
  };
  mainImage: SanityImage;
  categories: Array<{
    _ref: string;
    _type: "reference";
  }>;
  publishedAt: string;
  excerpt?: string;
  body: BlockContent[];
  featured?: boolean;
}

// Helper type for populated references
export interface PopulatedEvent extends Omit<Event, "artists"> {
  artists: Artist[];
}
