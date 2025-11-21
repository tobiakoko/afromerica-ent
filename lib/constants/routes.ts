/**
 * Routes Constants
 * Single source of truth for all URL paths:
 * - Public pages
 * - API endpoints
 * - Admin routes
 * - Auth routes
 * - External URLs
 */

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const PUBLIC_ROUTES = {
  /** Homepage */
  HOME: '/',
  
  /** Events listing */
  EVENTS: '/events',
  
  /** Single event detail page */
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  
  /** Event checkout */
  EVENT_CHECKOUT: (slug: string) => `/events/${slug}/checkout`,
  
  /** Artists listing */
  ARTISTS: '/artists',
  
  /** Single artist detail page */
  ARTIST_DETAIL: (slug: string) => `/artists/${slug}`,
  
  /** Voting page */
  VOTING: '/voting',
  
  /** Showcase voting */
  VOTING_SHOWCASE: '/voting/showcase',
  
  /** Vote for specific artist */
  VOTE_ARTIST: (artistId: string) => `/voting/${artistId}`,
  
  /** Leaderboard */
  LEADERBOARD: '/voting/leaderboard',
  
  /** About page */
  ABOUT: '/about',
  
  /** Contact page */
  CONTACT: '/contact',
  
  /** Booking confirmation */
  BOOKING_CONFIRMATION: (reference: string) => `/bookings/${reference}`,
  
  /** Vote confirmation */
  VOTE_CONFIRMATION: (reference: string) => `/votes/${reference}`,
  
  /** Privacy policy */
  PRIVACY: '/privacy',
  
  /** Terms of service */
  TERMS: '/terms',
} as const;

// ==========================================
// API ROUTES
// ==========================================

export const API_ROUTES = {
  /** Events API */
  EVENTS: '/api/events',
  EVENT_DETAIL: (id: string) => `/api/events/${id}`,
  
  /** Artists API */
  ARTISTS: '/api/artists',
  ARTIST_DETAIL: (id: string) => `/api/artists/${id}`,
  
  /** Bookings API */
  BOOKINGS: '/api/bookings',
  BOOKING_DETAIL: (id: string) => `/api/bookings/${id}`,
  BOOKING_VERIFY: '/api/bookings/verify',
  BOOKING_CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  
  /** Tickets API */
  TICKETS: '/api/tickets',
  TICKET_TYPES: (eventId: string) => `/api/tickets/${eventId}/types`,
  TICKET_AVAILABILITY: (eventId: string) => `/api/tickets/${eventId}/availability`,
  
  /** Voting API */
  VOTING: '/api/voting',
  VOTE_INIT: '/api/voting/init',
  VOTE_VERIFY: '/api/voting/verify',
  VOTE_SUBMIT: '/api/voting/submit',
  VOTE_LEADERBOARD: '/api/voting/leaderboard',
  
  /** OTP API */
  OTP_REQUEST: '/api/otp/request',
  OTP_VERIFY: '/api/otp/verify',
  
  /** Payments API */
  PAYMENTS: '/api/payments',
  PAYMENT_INITIALIZE: '/api/payments/initialize',
  PAYMENT_VERIFY: '/api/payments/verify',
  PAYMENT_CALLBACK: '/api/payments/callback',
  
  /** Webhooks */
  WEBHOOK_PAYSTACK: '/api/webhooks/paystack',
  WEBHOOK_RESEND: '/api/webhooks/resend',
  
  /** Newsletter API future enhancement */
  NEWSLETTER_SUBSCRIBE: '/api/newsletter/subscribe',
  NEWSLETTER_UNSUBSCRIBE: '/api/newsletter/unsubscribe',
  
  /** Contact API */
  CONTACT: '/api/contact',
  
  /** Health check */
  HEALTH: '/api/health',
  
  /** Admin API base */
  ADMIN_API: '/api/admin',
} as const;

// ==========================================
// ADMIN ROUTES
// ==========================================

export const ADMIN_ROUTES = {
  /** Admin dashboard home */
  DASHBOARD: '/admin',
  
  /** Login */
  LOGIN: '/login',
  
  /** Events management */
  EVENTS: '/admin/events',
  EVENT_CREATE: '/admin/events/new',
  EVENT_EDIT: (id: string) => `/admin/events/${id}/edit`,
  EVENT_DETAIL: (id: string) => `/admin/events/${id}`,
  
  /** Artists management */
  ARTISTS: '/admin/artists',
  ARTIST_CREATE: '/admin/artists/new',
  ARTIST_EDIT: (id: string) => `/admin/artists/${id}/edit`,
  ARTIST_DETAIL: (id: string) => `/admin/artists/${id}`,
  
  /** Bookings management */
  BOOKINGS: '/admin/bookings',
  BOOKING_DETAIL: (id: string) => `/admin/bookings/${id}`,
  
  /** Tickets management */
  TICKETS: '/admin/tickets',
  
  /** Voting management */
  VOTING: '/admin/voting',
  VOTING_SHOWCASE: '/admin/voting/showcase',
  
  /** Payments management */
  PAYMENTS: '/admin/payments',
  PAYMENT_DETAIL: (id: string) => `/admin/payments/${id}`,
  
  /** Newsletter management future enhancement */
  NEWSLETTER: '/admin/newsletter',
  NEWSLETTER_SEND: '/admin/newsletter/send',
  
  /** Users/Admins management */
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  
  /** Analytics */
  ANALYTICS: '/admin/analytics',
  
  /** Audit logs */
  AUDIT_LOGS: '/admin/audit-logs',
  
  /** Settings */
  SETTINGS: '/admin/settings',
  
  /** Profile */
  PROFILE: '/admin/profile',
} as const;

// ==========================================
// AUTH ROUTES
// ==========================================

export const AUTH_ROUTES = {
  /** Sign in */
  SIGN_IN: '/sign-in',
  
  /** Sign out */
  SIGN_OUT: '/sign-out',
  
  /** Forgot password */
  FORGOT_PASSWORD: '/forgot-password',
  
  /** Reset password */
  RESET_PASSWORD: '/reset-password',
  
  /** Verify email */
  VERIFY_EMAIL: '/verify-email',
  
  /** Auth callback (OAuth) */
  CALLBACK: '/callback',
  
  /** Auth error */
  ERROR: '/error',
} as const;

// ==========================================
// EXTERNAL URLS
// ==========================================

export const EXTERNAL_URLS = {
  /** Social media */
  INSTAGRAM: 'https://instagram.com/afromerica.official',
  FACEBOOK: 'https://facebook.com/afromerica.official',
  TWITTER: 'https://twitter.com/afromerica.official',
  YOUTUBE: 'https://youtube.com/@afromerica.official',
  
  /** Paystack */
  PAYSTACK_DASHBOARD: 'https://dashboard.paystack.com',
  PAYSTACK_DOCS: 'https://paystack.com/docs',
  
  /** Supabase */
  SUPABASE_DASHBOARD: 'https://supabase.com/dashboard',
  
  /** Support */
  SUPPORT_EMAIL: 'mailto:support@afromericaent.com',
  SUPPORT_PHONE: 'tel:+2347080315470',
} as const;

// ==========================================
// ROUTE GROUPS
// ==========================================

/**
 * Routes that don't require authentication
 */
export const UNPROTECTED_ROUTES = [
  PUBLIC_ROUTES.HOME,
  PUBLIC_ROUTES.EVENTS,
  PUBLIC_ROUTES.ARTISTS,
  PUBLIC_ROUTES.VOTING,
  PUBLIC_ROUTES.ABOUT,
  PUBLIC_ROUTES.CONTACT,
  PUBLIC_ROUTES.PRIVACY,
  PUBLIC_ROUTES.TERMS,
  AUTH_ROUTES.SIGN_IN,
  AUTH_ROUTES.FORGOT_PASSWORD,
] as const;

/**
 * Routes that require admin authentication
 */
export const ADMIN_PROTECTED_ROUTES = [
  ADMIN_ROUTES.DASHBOARD,
  ADMIN_ROUTES.EVENTS,
  ADMIN_ROUTES.ARTISTS,
  ADMIN_ROUTES.BOOKINGS,
  ADMIN_ROUTES.TICKETS,
  ADMIN_ROUTES.VOTING,
  ADMIN_ROUTES.PAYMENTS,
  ADMIN_ROUTES.NEWSLETTER,
  ADMIN_ROUTES.USERS,
  ADMIN_ROUTES.ANALYTICS,
  ADMIN_ROUTES.AUDIT_LOGS,
  ADMIN_ROUTES.SETTINGS,
] as const;

/**
 * API routes that require authentication
 */
export const PROTECTED_API_ROUTES = [
  API_ROUTES.ADMIN_API,
] as const;

/**
 * Routes that should redirect if already authenticated
 */
export const AUTH_REDIRECT_ROUTES = [
  AUTH_ROUTES.SIGN_IN,
] as const;

// ==========================================
// ROUTE UTILITIES
// ==========================================

/**
 * Check if route is protected (admin)
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

/**
 * Check if route is an API route
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api');
}

/**
 * Check if route is a webhook route
 */
export function isWebhookRoute(pathname: string): boolean {
  return pathname.startsWith('/api/webhooks');
}

/**
 * Check if route is public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  // Webhooks are always public
  if (isWebhookRoute(pathname)) return true;
  
  // Auth routes are public
  if (pathname.startsWith('/auth')) return true;
  
  // Admin routes require auth
  if (isAdminRoute(pathname)) return false;
  
  // Check against unprotected routes list
  return UNPROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Get redirect URL after login based on user role
 */
export function getPostLoginRedirect(role?: string): string {
  if (role === 'admin' || role === 'super_admin' || role === 'content_manager') {
    return ADMIN_ROUTES.DASHBOARD;
  }
  return PUBLIC_ROUTES.HOME;
}

/**
 * Build query string from params
 */
export function buildQueryString(params: Record<string, any>): string { //FIXME: figure out how to fix this type error
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Build full URL with query params
 */
export function buildUrl(
  path: string,
  params?: Record<string, any> //FIXME: figure out how to fix this type error
): string {
  if (!params) return path;
  return `${path}${buildQueryString(params)}`;
}

/**
 * Get full absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

/**
 * Get API URL (absolute)
 */
export function getApiUrl(path: string): string {
  return getAbsoluteUrl(path);
}

/**
 * Parse pagination from query params
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
  };
}

/**
 * Build pagination query string
 */
export function buildPaginationQuery(params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): string {
  return buildQueryString({
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
}
