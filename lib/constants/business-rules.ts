/**
 * Business Rules Constants
 * Single source of truth for all business logic rules:
 * - Numeric limits
 * - Timeouts and expiration periods
 * - Rate limits
 * - Pagination defaults
 * - Minimum/maximum values
 */

// ==========================================
// TICKET RULES
// ==========================================

export const TICKET_RULES = {
  /** Maximum tickets that can be purchased in a single transaction */
  MAX_PER_TRANSACTION: 10,
  
  /** Minimum tickets that can be purchased */
  MIN_PER_TRANSACTION: 1,
  
  /** How long a booking is held before expiring (minutes) */
  BOOKING_EXPIRY_MINUTES: 15,
  
  /** Minimum ticket price in kobo (NGN 1.00) */
  MIN_PRICE: 100,
  
  /** Buffer inventory to prevent overselling during high traffic */
  INVENTORY_BUFFER: 5,
  
  /** Maximum different ticket types in one booking */
  MAX_TICKET_TYPES_PER_BOOKING: 5,
} as const;

// ==========================================
// VOTING RULES
// ==========================================

export const VOTING_RULES = {
  /** OTP code expiration time (minutes) */
  OTP_EXPIRY_MINUTES: 10,
  
  /** Length of OTP code */
  OTP_LENGTH: 6,
  
  /** Maximum votes a single email can cast per event */
  MAX_VOTES_PER_EMAIL: 1000,
  
  /** Maximum votes in a single transaction */
  MAX_VOTES_PER_TRANSACTION: 100,
  
  /** Minimum votes that can be purchased */
  MIN_VOTES_PER_TRANSACTION: 1,
  
  /** Pilot voting: Minimum package amount in kobo (NGN 1.00) */
  PILOT_MIN_PACKAGE_AMOUNT: 100,
  
  /** Pilot voting: Maximum package amount in kobo (NGN 100,000.00) */
  PILOT_MAX_PACKAGE_AMOUNT: 10000000,
  
  /** Showcase voting: Free votes are allowed */
  SHOWCASE_FREE_VOTING: true,
  
  /** Time window to complete vote after OTP verification (minutes) */
  VOTE_COMPLETION_WINDOW: 5,
  
  /** Maximum OTP verification attempts before cooldown */
  MAX_OTP_ATTEMPTS: 3,
} as const;

// ==========================================
// PAYMENT RULES
// ==========================================

export const PAYMENT_RULES = {
  /** Minimum payment amount in kobo (Paystack requirement: NGN 1.00) */
  MIN_AMOUNT: 100,
  
  /** Maximum payment amount in kobo (NGN 5,000,000.00 - reasonable limit) */
  MAX_AMOUNT: 500000000,
  
  /** Payment verification timeout (seconds) */
  VERIFICATION_TIMEOUT: 30,
  
  /** Webhook retry attempts for failed deliveries */
  WEBHOOK_MAX_RETRIES: 3,
  
  /** Delay between webhook retry attempts (seconds) */
  WEBHOOK_RETRY_DELAY: 60,
  
  /** How long to keep pending payments before auto-cancellation (minutes) */
  PENDING_PAYMENT_EXPIRY: 30,
  
  /** Refund processing window (days) - after this, refunds require manual approval */
  REFUND_WINDOW_DAYS: 7,
} as const;

// ==========================================
// RATE LIMITS
// ==========================================

export const RATE_LIMITS = {
  /** General API requests per minute per IP */
  API_REQUESTS_PER_MINUTE: 60,
  
  /** Voting attempts per hour per IP (prevents abuse) */
  VOTE_ATTEMPTS_PER_HOUR: 10,
  
  /** OTP requests per hour per email (prevents spam) */
  OTP_REQUESTS_PER_HOUR: 3,
  
  /** Login attempts per hour per IP */
  LOGIN_ATTEMPTS_PER_HOUR: 5,
  
  /** Password reset requests per hour per email */
  PASSWORD_RESET_PER_HOUR: 3,
  
  /** Contact form submissions per hour per IP */
  CONTACT_FORM_PER_HOUR: 2,
  
  /** Newsletter subscription attempts per hour per IP */
  NEWSLETTER_SIGNUP_PER_HOUR: 3,
  
  /** Maximum concurrent bookings per user */
  MAX_CONCURRENT_BOOKINGS: 3,
} as const;

// ==========================================
// PAGINATION
// ==========================================

export const PAGINATION = {
  /** Default page size when not specified */
  DEFAULT_PAGE_SIZE: 10,
  
  /** Maximum allowed page size (prevents abuse) */
  MAX_PAGE_SIZE: 100,
  
  /** Events listing page size */
  EVENTS_PER_PAGE: 12,
  
  /** Artists listing page size */
  ARTISTS_PER_PAGE: 20,
  
  /** Bookings dashboard page size */
  BOOKINGS_PER_PAGE: 25,
  
  /** Admin logs page size */
  ADMIN_LOGS_PER_PAGE: 50,
  
  /** Search results page size */
  SEARCH_RESULTS_PER_PAGE: 15,
  
  /** Leaderboard results per page */
  LEADERBOARD_PER_PAGE: 50,
  
  /** First page number (1-indexed) */
  FIRST_PAGE: 1,
} as const;

// ==========================================
// CONTENT LIMITS
// ==========================================

export const CONTENT_LIMITS = {
  /** Event title maximum length */
  EVENT_TITLE_MAX: 200,
  
  /** Event description maximum length */
  EVENT_DESCRIPTION_MAX: 5000,
  
  /** Event short description maximum length */
  EVENT_SHORT_DESC_MAX: 200,
  
  /** Artist name maximum length */
  ARTIST_NAME_MAX: 100,
  
  /** Artist bio maximum length */
  ARTIST_BIO_MAX: 2000,
  
  /** User full name maximum length */
  USER_NAME_MAX: 100,
  
  /** Email maximum length */
  EMAIL_MAX: 255,
  
  /** Phone number maximum length */
  PHONE_MAX: 20,
  
  /** Metadata JSON maximum size (bytes) */
  METADATA_MAX_SIZE: 10000,
  
  /** Maximum images in event gallery */
  MAX_GALLERY_IMAGES: 10,
  
  /** Maximum file upload size (bytes) - 5MB */
  MAX_FILE_UPLOAD_SIZE: 5242880,
} as const;

// ==========================================
// SESSION & AUTH
// ==========================================

export const AUTH_RULES = {
  /** Session expiration (days) */
  SESSION_EXPIRY_DAYS: 7,
  
  /** Remember me session expiration (days) */
  REMEMBER_ME_EXPIRY_DAYS: 30,
  
  /** Password minimum length */
  PASSWORD_MIN_LENGTH: 8,
  
  /** Password maximum length */
  PASSWORD_MAX_LENGTH: 128,
  
  /** JWT token expiration (seconds) */
  JWT_EXPIRY_SECONDS: 3600, // 1 hour
  
  /** Refresh token expiration (seconds) */
  REFRESH_TOKEN_EXPIRY_SECONDS: 604800, // 7 days
  
  /** Account lockout duration after failed attempts (minutes) */
  ACCOUNT_LOCKOUT_MINUTES: 30,
  
  /** Maximum failed login attempts before lockout */
  MAX_FAILED_LOGINS: 5,
} as const;

// ==========================================
// EMAIL & COMMUNICATION
// ==========================================

export const EMAIL_RULES = {
  /** Email sending retry attempts */
  MAX_SEND_RETRIES: 3,
  
  /** Delay between retry attempts (seconds) */
  RETRY_DELAY_SECONDS: 30,
  
  /** Newsletter unsubscribe token expiration (days) */
  UNSUBSCRIBE_TOKEN_EXPIRY_DAYS: 90,
  
  /** Maximum recipients per bulk email */
  MAX_BULK_RECIPIENTS: 1000,
  
  /** Email queue batch size */
  EMAIL_BATCH_SIZE: 50,
  
  /** Promotional email cooldown (hours) - prevent spam */
  PROMOTIONAL_COOLDOWN_HOURS: 24,
} as const;

// ==========================================
// CACHING
// ==========================================

export const CACHE_TTL = {
  /** Events list cache (seconds) */
  EVENTS_LIST: 300, // 5 minutes
  
  /** Single event cache (seconds) */
  EVENT_DETAIL: 600, // 10 minutes
  
  /** Artists list cache (seconds) */
  ARTISTS_LIST: 600, // 10 minutes
  
  /** Leaderboard cache (seconds) */
  LEADERBOARD: 60, // 1 minute
  
  /** Static pages cache (seconds) */
  STATIC_PAGES: 3600, // 1 hour
  
  /** User session cache (seconds) */
  SESSION: 300, // 5 minutes
  
  /** API response cache (seconds) */
  API_RESPONSE: 60, // 1 minute
} as const;

// ==========================================
// PERFORMANCE
// ==========================================

export const PERFORMANCE = {
  /** Database query timeout (milliseconds) */
  DB_QUERY_TIMEOUT: 5000,
  
  /** API request timeout (milliseconds) */
  API_REQUEST_TIMEOUT: 10000,
  
  /** External service timeout (milliseconds) */
  EXTERNAL_SERVICE_TIMEOUT: 15000,
  
  /** Maximum request body size (bytes) - 10MB */
  MAX_REQUEST_BODY_SIZE: 10485760,
  
  /** Slow query threshold for logging (milliseconds) */
  SLOW_QUERY_THRESHOLD: 1000,
} as const;

// ==========================================
// ANALYTICS & REPORTING
// ==========================================

export const ANALYTICS = {
  /** Event views required to mark as trending */
  TRENDING_THRESHOLD: 100,
  
  /** Time window for trending calculation (hours) */
  TRENDING_WINDOW_HOURS: 24,
  
  /** Popular events minimum ticket sales */
  POPULAR_MIN_SALES: 50,
  
  /** Featured artist minimum vote threshold */
  FEATURED_ARTIST_MIN_VOTES: 100,
  
  /** Dashboard refresh interval (seconds) */
  DASHBOARD_REFRESH_INTERVAL: 30,
} as const;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Calculate booking expiry timestamp
 */
export function getBookingExpiryTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + TICKET_RULES.BOOKING_EXPIRY_MINUTES);
  return now;
}

/**
 * Calculate OTP expiry timestamp
 */
export function getOTPExpiryTime(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + VOTING_RULES.OTP_EXPIRY_MINUTES);
  return now;
}

/**
 * Check if amount is within payment limits
 */
export function isValidPaymentAmount(amountInKobo: number): boolean {
  return (
    amountInKobo >= PAYMENT_RULES.MIN_AMOUNT &&
    amountInKobo <= PAYMENT_RULES.MAX_AMOUNT
  );
}

/**
 * Check if ticket quantity is valid
 */
export function isValidTicketQuantity(quantity: number): boolean {
  return (
    quantity >= TICKET_RULES.MIN_PER_TRANSACTION &&
    quantity <= TICKET_RULES.MAX_PER_TRANSACTION &&
    Number.isInteger(quantity)
  );
}

/**
 * Check if vote quantity is valid
 */
export function isValidVoteQuantity(quantity: number): boolean {
  return (
    quantity >= VOTING_RULES.MIN_VOTES_PER_TRANSACTION &&
    quantity <= VOTING_RULES.MAX_VOTES_PER_TRANSACTION &&
    Number.isInteger(quantity)
  );
}
