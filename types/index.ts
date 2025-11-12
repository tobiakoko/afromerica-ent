/**
 * Type Exports
 *
 * This file serves as the main entry point for types.
 * Import types from here: import { Event, Booking, Artist } from '@/types'
 */

export * from './models'

// Export comprehensive API types from centralized location
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginationMetadata,
  PaginationParams,
  ErrorCode
} from '@/lib/api/types'
export { ErrorCodes, HttpStatus } from '@/lib/api/types'

// ============================================================================
// UI & LAYOUT TYPES (specific to components, not domain models)
// ============================================================================

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  icon: string
  label: string
  href: string
}

export interface MusicPlatform {
  name: string
  icon: string
  label: string
  href: string
}

export interface FooterSocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'music' | 'mail'
  label: string
  href: string
}

export interface FooterLinkGroup {
  label: string
  href: string
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface PageHeroProps {
  badge?: string
  title: string | React.ReactNode
  description: string
  centered?: boolean
}

export interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}
