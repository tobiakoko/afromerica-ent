/**
 * Constants Index
 * Central export point for all application constants
 * 
 * Usage:
 * import { EVENT_STATUS, formatCurrency, TICKET_RULES } from '@/lib/constants'
 * 
 * Or import specific modules:
 * import { EVENT_STATUS } from '@/lib/constants/enums'
 * import { formatCurrency } from '@/lib/constants/currency'
 */

// ==========================================
// ENUMS & STATUS VALUES
// ==========================================
export {
  // Event enums
  EVENT_STATUS,
  EVENT_CATEGORY,
  EVENT_STATUS_VALUES,
  EVENT_CATEGORY_VALUES,
  type EventStatus,
  type EventCategory,
  
  // Booking enums
  BOOKING_STATUS,
  BOOKING_STATUS_VALUES,
  type BookingStatus,
  
  // Payment enums
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_PROVIDER,
  PAYMENT_STATUS_VALUES,
  PAYMENT_METHOD_VALUES,
  PAYMENT_PROVIDER_VALUES,
  type PaymentStatus,
  type PaymentMethod,
  type PaymentProvider,
  
  // Voting enums
  VOTE_TYPE,
  VOTE_STATUS,
  VOTE_TYPE_VALUES,
  VOTE_STATUS_VALUES,
  type VoteType,
  type VoteStatus,
  
  // User & Admin enums
  USER_ROLE,
  USER_ROLE_VALUES,
  type UserRole,
  
  // Communication enums
  EMAIL_TYPE,
  EMAIL_STATUS,
  EMAIL_TYPE_VALUES,
  EMAIL_STATUS_VALUES,
  type EmailType,
  type EmailStatus,
  
  // Audit log enums
  AUDIT_ACTION,
  AUDIT_RESOURCE,
  AUDIT_ACTION_VALUES,
  AUDIT_RESOURCE_VALUES,
  type AuditAction,
  type AuditResource,
  
  // Display labels
  EVENT_STATUS_LABELS,
  EVENT_CATEGORY_LABELS,
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  USER_ROLE_LABELS,
  
  // Badge colors
  EVENT_STATUS_COLORS,
  BOOKING_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from './enums';

// ==========================================
// BUSINESS RULES
// ==========================================
export {
  // Ticket rules
  TICKET_RULES,
  
  // Voting rules
  VOTING_RULES,
  
  // Payment rules
  PAYMENT_RULES,
  
  // Rate limits
  RATE_LIMITS,
  
  // Pagination
  PAGINATION,
  
  // Content limits
  CONTENT_LIMITS,
  
  // Auth rules
  AUTH_RULES,
  
  // Email rules
  EMAIL_RULES,
  
  // Caching
  CACHE_TTL,
  
  // Performance
  PERFORMANCE,
  
  // Analytics
  ANALYTICS,
  
  // Helper functions
  getBookingExpiryTime,
  getOTPExpiryTime,
  isValidPaymentAmount,
  isValidTicketQuantity,
  isValidVoteQuantity,
} from './business-rules';

// ==========================================
// CURRENCY & FORMATTING
// ==========================================
export {
  // Currency config
  CURRENCY,
  
  // Paystack config
  PAYSTACK_CONFIG,
  
  // Number format
  NUMBER_FORMAT,
  
  // Formatting functions
  formatCurrency,
  formatCurrencyCompact,
  parseCurrency,
  nairaToKobo,
  koboToNaira,
  formatNumber,
  formatPercentage,
  calculatePercentage,
  
  // Price display helpers
  formatPriceRange,
  formatFromPrice,
  isFreePrice,
  formatPriceWithFree,
  
  // Validation helpers
  isValidPaystackAmount,
  roundToKobo,
  calculateTotal,
  calculateDiscount,
  applyDiscount,
  
  // Cost comparison
  PAYMENT_PROCESSOR_COMPARISON,
} from './currency';

// ==========================================
// ROUTES
// ==========================================
export {
  // Route groups
  PUBLIC_ROUTES,
  API_ROUTES,
  ADMIN_ROUTES,
  AUTH_ROUTES,
  EXTERNAL_URLS,
  
  // Protected routes lists
  UNPROTECTED_ROUTES,
  ADMIN_PROTECTED_ROUTES,
  PROTECTED_API_ROUTES,
  AUTH_REDIRECT_ROUTES,
  
  // Route utilities
  isAdminRoute,
  isApiRoute,
  isWebhookRoute,
  isPublicRoute,
  getPostLoginRedirect,
  buildQueryString,
  buildUrl,
  getAbsoluteUrl,
  getApiUrl,
  parsePaginationParams,
  buildPaginationQuery,
} from './routes';

// ==========================================
// VALIDATION
// ==========================================
export {
  // Regex patterns
  VALIDATION_PATTERNS,
  
  // Validation messages
  VALIDATION_MESSAGES,
  
  // Validation functions
  isValidEmail,
  isValidNigerianPhone,
  isValidInternationalPhone,
  isValidPhone,
  formatNigerianPhone,
  isValidSlug,
  generateSlug,
  sanitizeSlug,
  isValidUUID,
  isValidOTP,
  isStrongPassword,
  getPasswordStrength,
  isValidLength,
  isInRange,
  sanitizeString,
  sanitizeEmail,
  isLettersOnly,
  isNumbersOnly,
  isPositiveInteger,
  isNotPastDate,
  isWithinDateRange,
  parseISODate,
  isValidFileSize,
  isValidFileType,
  isValidCreditCard,
  
  // Sanitization functions
  escapeHtml,
  removeWhitespace,
  normalizeWhitespace,
  truncate,
} from './validation';

// ==========================================
// FEATURE FLAGS
// ==========================================
export {
  // Feature groups
  FEATURES,
  PAYMENT_FEATURES,
  ADMIN_FEATURES,
  NOTIFICATION_FEATURES,
  SECURITY_FEATURES,
  PERFORMANCE_FEATURES,
  ANALYTICS_FEATURES,
  UI_FEATURES,
  EXPERIMENTAL_FEATURES,
  INTEGRATION_FEATURES,
  MAINTENANCE_FEATURES,
  
  // All features combined
  ALL_FEATURES,
  
  // Utilities
  isFeatureEnabled,
  getEnabledFeatures,
  getClientFeatureFlags,
  isMaintenanceMode,
  isProductionOnly,
  
  // Types
  type FeatureCategory,
  type Feature,
  type PaymentFeature,
  type AdminFeature,
  type NotificationFeature,
  type SecurityFeature,
  type PerformanceFeature,
  type AnalyticsFeature,
  type UIFeature,
  type ExperimentalFeature,
  type IntegrationFeature,
  type MaintenanceFeature,
} from './features';

// ==========================================
// COMMON CONSTANTS
// ==========================================

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: 'Afromerica Entertainment',
  SHORT_NAME: 'AfroMerica',
  DESCRIPTION: 'Discover music, events and more from the best African and Afro-Caribbean artists. Celebrating culture through music, art, and unforgettable experiences.',
  TAGLINE: 'Voice of Soul, Sound of Now',
  VERSION: '1.0.0',
  AUTHOR: 'Afromerica Entertainment',
  URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://afromericaent.com',
  OG_IMAGE: '/og-image.jpg',
  EMAIL: 'info@afromericaent.com',
  SUPPORT_EMAIL: 'support@afromericaent.com',
  BOOKINGS_EMAIL: 'bookings@afromericaent.com',
  CAREER_EMAIL:'career@afromericaent.com',
  PRESS_EMAIL: 'press@afromericaent.com',
  PHONE: '+234 (0) 708 031 5470',
  LOCATION: 'Lagos, Nigeria',
  BUSINESS_HOURS: 'Mon - Fri: 9:00 AM - 6:00 PM WAT',
} as const;

/**
 * Brand colors (from tailwind.config.ts)
 */
// FIX ME: Update the Brand Colors here
export const BRAND_COLORS = {
  ORANGE: '#FF6B00',
  GOLD: '#FFD700',
  CYAN: '#00FFF0',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

/**
 * Social media handles
 */
export const SOCIAL_HANDLES = {
  INSTAGRAM: '@afromerica.official',
  FACEBOOK: 'afromerica.official',
  TWITTER: '@afromerica.official',
  YOUTUBE: '@afromerica.official',
  TIKTOK: '@afromerica.official',
} as const;

/**
 * Social media links (full URLs)
 */
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/afromerica.official',
  INSTAGRAM: 'https://instagram.com/afromerica.official',
  TWITTER: 'https://twitter.com/afromerica.official',
  YOUTUBE: 'https://youtube.com/@afromerica.official',
  TIKTOK: 'https://tiktok.com/@afromerica.official',
  LINKEDIN: 'https://linkedin.com/company/afromerica.official',
} as const;

/**
 * Navigation items
 */
export const NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'Artists', href: '/artists' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/**
 * Footer navigation groups
 */
export const FOOTER_LINKS = {
  COMPANY: [
    { label: 'About', href: '/about' },
    { label: 'Artists', href: '/artists' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ],
  LEGAL: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
  ],
} as const;

/**
 * Music streaming platforms
 */
export const MUSIC_PLATFORMS = [
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
] as const;

/**
 * Contact address
 */
export const CONTACT_ADDRESS = {
  STREET: '123 Entertainment Avenue',
  CITY: 'Lagos',
  STATE: 'Lagos State',
  COUNTRY: 'Nigeria',
  POSTAL: '100001',
} as const;

/**
 * SEO Configuration
 */
export const SEO_CONFIG = {
  KEYWORDS: [
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
  TWITTER_CARD: 'summary_large_image',
} as const;

/**
 * Developer credit
 */
export const DEVELOPER = {
  NAME: 'Tobi Akoko',
  URL: 'https://github.com/tobiakoko',
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  /** Full date with time: "Monday, January 15, 2024 at 7:00 PM" */
  FULL_WITH_TIME: 'EEEE, MMMM d, yyyy \'at\' h:mm a',
  
  /** Full date: "Monday, January 15, 2024" */
  FULL: 'EEEE, MMMM d, yyyy',
  
  /** Short date: "Jan 15, 2024" */
  SHORT: 'MMM d, yyyy',
  
  /** Numeric: "01/15/2024" */
  NUMERIC: 'MM/dd/yyyy',
  
  /** ISO: "2024-01-15" */
  ISO: 'yyyy-MM-dd',
  
  /** Time only: "7:00 PM" */
  TIME: 'h:mm a',
  
  /** Relative: "2 hours ago" */
  RELATIVE: 'relative',
} as const;

/**
 * Image sizes (for optimization)
 */
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 320, height: 240 },
  MEDIUM: { width: 640, height: 480 },
  LARGE: { width: 1280, height: 720 },
  HERO: { width: 1920, height: 1080 },
} as const;

/**
 * Breakpoints (match Tailwind config)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Z-index layers (for consistent stacking)
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const;

/**
 * Common HTTP headers
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
  PAYSTACK_SIGNATURE: 'x-paystack-signature',
  CORRELATION_ID: 'x-correlation-id',
  RATE_LIMIT: 'x-ratelimit-limit',
  RATE_LIMIT_REMAINING: 'x-ratelimit-remaining',
  RATE_LIMIT_RESET: 'x-ratelimit-reset',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'afromerica-theme',
  CART: 'afromerica-cart',
  RECENT_EVENTS: 'afromerica-recent-events',
  USER_PREFERENCES: 'afromerica-preferences',
} as const;

/**
 * Cookie names
 */
export const COOKIE_NAMES = {
  SESSION: 'afromerica-session',
  CSRF: 'afromerica-csrf',
  CONSENT: 'afromerica-consent',
} as const;

/**
 * Query keys (for TanStack Query)
 */
export const QUERY_KEYS = {
  EVENTS: 'events',
  EVENT: 'event',
  ARTISTS: 'artists',
  ARTIST: 'artist',
  BOOKINGS: 'bookings',
  BOOKING: 'booking',
  VOTES: 'votes',
  LEADERBOARD: 'leaderboard',
  PAYMENTS: 'payments',
  USER: 'user',
} as const;

/**
 * Environment variables (with fallbacks)
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;
