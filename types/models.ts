/**
 * Centralized Domain Models
 *
 * This file contains all core business domain types used across the application.
 * These types should be the single source of truth for domain entities.
 *
 * DO NOT duplicate these types in feature-specific files.
 * Import from this file instead: import { Event, Booking, Artist } from '@/types/models'
 */

// ============================================================================
// EVENTS
// ============================================================================

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  date: string
  time: string
  venue: Venue
  location?: string // For backward compatibility
  city?: string
  image?: string
  featuredImage?: string
  coverImage?: string
  artists: Artist[]
  ticketTypes: TicketType[]
  price?: number // Minimum price for display
  capacity: number
  ticketsSold: number
  status: EventStatus
  category: EventCategory
  featured?: boolean
  ticketsAvailable?: boolean
  createdAt: string
  updatedAt: string
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'concert' | 'festival' | 'club' | 'private'

export interface Venue {
  name: string
  address: string
  city: string
  state?: string
  country?: string
  capacity?: number
}

export interface TicketType {
  id: string
  name: string
  price: number
  quantity: number
  available: number
  description?: string
}

// Filter and query types for events
export type EventFilter = 'all' | 'upcoming' | 'past' | 'featured' | 'soldout'
export type EventCategoryFilter = 'all' | EventCategory
export type EventSortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'popular'

export interface EventQueryParams {
  page?: number
  limit?: number
  filter?: EventFilter
  category?: EventCategoryFilter
  city?: string
  search?: string
  sort?: EventSortOption
  startDate?: string
  endDate?: string
}

// ============================================================================
// ARTISTS
// ============================================================================

export interface Artist {
  id: string
  slug: string
  name: string
  stageName?: string
  bio: string
  genre: string[]
  image?: string
  profileImage?: string
  coverImage?: string
  socialMedia: SocialLinks
  stats?: ArtistStats
  albums?: Album[]
  featured?: boolean
  verified?: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  facebook?: string
  youtube?: string
  spotify?: string
  appleMusic?: string
}

export interface ArtistStats {
  followers: number
  monthlyListeners: number
}

export interface Album {
  id: string
  title: string
  year: number
  coverArt?: string
  tracks: number
  releaseDate: string
  streamingLinks?: {
    spotify?: string
    appleMusic?: string
    youtube?: string
  }
}

// ============================================================================
// BOOKINGS
// ============================================================================

export interface Booking {
  id: string
  userId: string
  eventId: string
  ticketType: string
  quantity: number
  totalAmount: number
  status: BookingStatus
  attendeeInfo: AttendeeInfo[]
  paymentReference?: string
  createdAt: string
  updatedAt: string
  // Relations (when included)
  user?: BookingUser
  event?: Event
  transaction?: Transaction
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface AttendeeInfo {
  name: string
  email: string
  phone: string
}

export interface BookingUser {
  id: string
  email: string
  name: string | null
}

// ============================================================================
// PAYMENTS & TRANSACTIONS
// ============================================================================

export interface Transaction {
  id: string
  bookingId: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  status: TransactionStatus
  paymentMethod?: string
  createdAt: string
}

export type TransactionStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface PaymentIntent {
  reference: string
  amount: number
  currency: string
  email: string
  metadata?: Record<string, any>
}

// ============================================================================
// USERS & AUTH
// ============================================================================

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserRole = 'USER' | 'ADMIN'

// ============================================================================
// CMS CONTENT (for Sanity integration)
// ============================================================================

export interface CMSImage {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface CMSLink {
  title: string
  url: string
  external?: boolean
}

// ============================================================================
// SANITY-SPECIFIC TYPES (when fetching from CMS)
// ============================================================================

/**
 * Event structure from Sanity CMS
 * Transform this to Event type when using in app
 */
export interface SanityEvent {
  _id: string
  title: string
  slug: {
    current: string
  }
  description: string
  longDescription?: any[]
  featuredImage: {
    asset: {
      url: string
    }
    alt?: string
  }
  gallery?: Array<{
    asset: {
      url: string
    }
  }>
  eventDate: string
  eventTime: string
  venue?: SanityVenue
  location: string
  category?: SanityCategory
  price: number
  ticketTypes?: TicketType[]
  capacity: number
  soldTickets: number
  featured: boolean
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  artists?: SanityArtist[]
  seo?: SEO
}

export interface SanityArtist {
  _id: string
  name: string
  stageName?: string
  slug: {
    current: string
  }
  bio: string
  fullBio?: any[]
  profileImage: {
    asset: {
      url: string
    }
  }
  coverImage?: {
    asset: {
      url: string
    }
  }
  gallery?: Array<{
    asset: {
      url: string
    }
  }>
  genre: string[]
  socials?: SocialLinks
  featured: boolean
  verified: boolean
  albums?: Album[]
}

export interface SanityVenue {
  _id: string
  name: string
  slug: {
    current: string
  }
  address: string
  city: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
  capacity: number
  image?: {
    asset: {
      url: string
    }
  }
  description?: string
  amenities?: string[]
}

export interface SanityCategory {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  color?: string
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
}

// ============================================================================
// VOTING SYSTEM
// ============================================================================

export interface Vote {
  id: string
  userId: string
  artistId: string
  category: string
  createdAt: string
}

export interface VoteStats {
  artistId: string
  category: string
  voteCount: number
  rank: number
}

/*
// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: any
}
  
*/
