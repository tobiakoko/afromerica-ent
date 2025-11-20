/**
 * Feature Flags
 * Single source of truth for feature toggles:
 * - Enable/disable features across environments
 * - A/B testing capabilities
 * - Gradual rollouts
 * - Emergency kill switches
 */

// ==========================================
// ENVIRONMENT DETECTION
// ==========================================

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
// const IS_TEST = process.env.NODE_ENV === 'test';

// ==========================================
// CORE FEATURES
// ==========================================

export const FEATURES = {
  /** Enable event ticketing system */
  TICKETING_ENABLED: true,
  
  /** Enable showcase voting (free voting) */
  SHOWCASE_VOTING_ENABLED: true,
  
  /** Enable pilot voting (paid voting) */
  PILOT_VOTING_ENABLED: true,
  
  /** Enable newsletter subscriptions */
  NEWSLETTER_ENABLED: true,
  
  /** Enable contact form */
  CONTACT_FORM_ENABLED: true,
  
  /** Enable artist profiles */
  ARTIST_PROFILES_ENABLED: true,
  
  /** Enable event search */
  EVENT_SEARCH_ENABLED: true,
  
  /** Enable event filtering */
  EVENT_FILTERING_ENABLED: true,
  
  /** Enable social sharing */
  SOCIAL_SHARING_ENABLED: true,
} as const;

// ==========================================
// PAYMENT FEATURES
// ==========================================

export const PAYMENT_FEATURES = {
  /** Enable Paystack payments */
  PAYSTACK_ENABLED: true,
  
  /** Enable test mode for payments (sandbox) */
  PAYMENT_TEST_MODE: !IS_PRODUCTION,
  
  /** Enable saved payment methods */
  SAVED_PAYMENT_METHODS: false, // Future feature
  
  /** Enable installment payments */
  INSTALLMENT_PAYMENTS: false, // Future feature
  
  /** Enable refunds */
  REFUNDS_ENABLED: true,
  
  /** Enable payment webhooks */
  PAYMENT_WEBHOOKS_ENABLED: true,
} as const;

// ==========================================
// ADMIN FEATURES
// ==========================================

export const ADMIN_FEATURES = {
  /** Enable admin dashboard */
  ADMIN_DASHBOARD_ENABLED: true,
  
  /** Enable event management */
  EVENT_MANAGEMENT_ENABLED: true,
  
  /** Enable artist management */
  ARTIST_MANAGEMENT_ENABLED: true,
  
  /** Enable booking management */
  BOOKING_MANAGEMENT_ENABLED: true,
  
  /** Enable payment management */
  PAYMENT_MANAGEMENT_ENABLED: true,
  
  /** Enable analytics dashboard */
  ANALYTICS_ENABLED: IS_PRODUCTION,
  
  /** Enable audit logs */
  AUDIT_LOGS_ENABLED: true,
  
  /** Enable newsletter management */
  NEWSLETTER_MANAGEMENT_ENABLED: true,
  
  /** Enable user management */
  USER_MANAGEMENT_ENABLED: true,
  
  /** Enable bulk operations */
  BULK_OPERATIONS_ENABLED: true,
  
  /** Enable data export */
  DATA_EXPORT_ENABLED: true,
} as const;

// ==========================================
// NOTIFICATION FEATURES
// ==========================================

export const NOTIFICATION_FEATURES = {
  /** Enable email notifications */
  EMAIL_NOTIFICATIONS_ENABLED: true,
  
  /** Enable SMS notifications (future) */
  SMS_NOTIFICATIONS_ENABLED: false,
  
  /** Enable push notifications (future) */
  PUSH_NOTIFICATIONS_ENABLED: false,
  
  /** Enable booking confirmation emails */
  BOOKING_CONFIRMATION_EMAIL: true,
  
  /** Enable vote confirmation emails */
  VOTE_CONFIRMATION_EMAIL: true,
  
  /** Enable OTP emails */
  OTP_EMAIL_ENABLED: true,
  
  /** Enable promotional emails */
  PROMOTIONAL_EMAIL_ENABLED: true,
  
  /** Enable newsletter emails */
  NEWSLETTER_EMAIL_ENABLED: true,
} as const;

// ==========================================
// SECURITY FEATURES
// ==========================================

export const SECURITY_FEATURES = {
  /** Enable rate limiting */
  RATE_LIMITING_ENABLED: IS_PRODUCTION,
  
  /** Enable CAPTCHA (future) */
  CAPTCHA_ENABLED: false,
  
  /** Enable two-factor authentication (future) */
  TWO_FACTOR_AUTH_ENABLED: false,
  
  /** Enable IP blocking */
  IP_BLOCKING_ENABLED: IS_PRODUCTION,
  
  /** Enable request logging */
  REQUEST_LOGGING_ENABLED: true,
  
  /** Enable webhook signature verification */
  WEBHOOK_SIGNATURE_VERIFICATION: IS_PRODUCTION,
  
  /** Enable CORS */
  CORS_ENABLED: true,
  
  /** Enable security headers */
  SECURITY_HEADERS_ENABLED: IS_PRODUCTION,
} as const;

// ==========================================
// PERFORMANCE FEATURES
// ==========================================

export const PERFORMANCE_FEATURES = {
  /** Enable caching */
  CACHING_ENABLED: IS_PRODUCTION,
  
  /** Enable Redis caching (future) */
  REDIS_CACHE_ENABLED: false,
  
  /** Enable CDN for static assets */
  CDN_ENABLED: IS_PRODUCTION,
  
  /** Enable image optimization */
  IMAGE_OPTIMIZATION_ENABLED: true,
  
  /** Enable lazy loading */
  LAZY_LOADING_ENABLED: true,
  
  /** Enable compression */
  COMPRESSION_ENABLED: IS_PRODUCTION,
  
  /** Enable query optimization */
  QUERY_OPTIMIZATION_ENABLED: true,
} as const;

// ==========================================
// ANALYTICS & TRACKING
// ==========================================

export const ANALYTICS_FEATURES = {
  /** Enable Google Analytics (future) */
  GOOGLE_ANALYTICS_ENABLED: false,
  
  /** Enable event tracking */
  EVENT_TRACKING_ENABLED: IS_PRODUCTION,
  
  /** Enable conversion tracking */
  CONVERSION_TRACKING_ENABLED: IS_PRODUCTION,
  
  /** Enable error tracking (Sentry, etc.) */
  ERROR_TRACKING_ENABLED: IS_PRODUCTION,
  
  /** Enable performance monitoring */
  PERFORMANCE_MONITORING_ENABLED: IS_PRODUCTION,
  
  /** Enable user behavior tracking */
  USER_BEHAVIOR_TRACKING_ENABLED: IS_PRODUCTION,
} as const;

// ==========================================
// UI/UX FEATURES
// ==========================================

export const UI_FEATURES = {
  /** Enable dark mode */
  DARK_MODE_ENABLED: true,
  
  /** Enable animations */
  ANIMATIONS_ENABLED: true,
  
  /** Enable skeleton loaders */
  SKELETON_LOADERS_ENABLED: true,
  
  /** Enable toast notifications */
  TOAST_NOTIFICATIONS_ENABLED: true,
  
  /** Enable breadcrumbs */
  BREADCRUMBS_ENABLED: true,
  
  /** Enable back-to-top button */
  BACK_TO_TOP_ENABLED: true,
  
  /** Enable infinite scroll */
  INFINITE_SCROLL_ENABLED: false,
  
  /** Enable pagination */
  PAGINATION_ENABLED: true,
} as const;

// ==========================================
// EXPERIMENTAL FEATURES
// ==========================================

export const EXPERIMENTAL_FEATURES = {
  /** Enable new homepage design */
  NEW_HOMEPAGE_DESIGN: false,
  
  /** Enable AI-powered recommendations (future) */
  AI_RECOMMENDATIONS: false,
  
  /** Enable live chat support (future) */
  LIVE_CHAT_SUPPORT: false,
  
  /** Enable virtual events (future) */
  VIRTUAL_EVENTS: false,
  
  /** Enable membership/subscriptions (future) */
  MEMBERSHIPS: false,
  
  /** Enable gift cards (future) */
  GIFT_CARDS: false,
  
  /** Enable loyalty program (future) */
  LOYALTY_PROGRAM: false,
} as const;

// ==========================================
// INTEGRATION FEATURES
// ==========================================

export const INTEGRATION_FEATURES = {
  /** Enable Supabase integration */
  SUPABASE_ENABLED: true,
  
  /** Enable Paystack integration */
  PAYSTACK_INTEGRATION: true,
  
  /** Enable Resend email integration */
  RESEND_INTEGRATION: true,
  
  /** Enable Sanity CMS (currently disabled) */
  SANITY_CMS_ENABLED: false,
  
  /** Enable social media integrations */
  SOCIAL_MEDIA_INTEGRATION: true,
  
  /** Enable calendar integrations (future) */
  CALENDAR_INTEGRATION: false,
} as const;

// ==========================================
// MAINTENANCE FEATURES
// ==========================================

export const MAINTENANCE_FEATURES = {
  /** Enable maintenance mode */
  MAINTENANCE_MODE: false,
  
  /** Show maintenance banner */
  MAINTENANCE_BANNER: false,
  
  /** Maintenance message */
  MAINTENANCE_MESSAGE: 'We are currently performing scheduled maintenance. We will be back shortly.',
  
  /** Enable read-only mode */
  READ_ONLY_MODE: false,
  
  /** Enable limited access mode (admin only) */
  LIMITED_ACCESS_MODE: false,
} as const;

// ==========================================
// FEATURE FLAG UTILITIES
// ==========================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(
  category: keyof typeof ALL_FEATURES,
  feature: string
): boolean {
  const featureGroup = ALL_FEATURES[category];
  return (featureGroup as any)[feature] ?? false;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  const enabled: string[] = [];
  
  Object.entries(ALL_FEATURES).forEach(([category, features]) => {
    Object.entries(features).forEach(([feature, isEnabled]) => {
      if (isEnabled) {
        enabled.push(`${category}.${feature}`);
      }
    });
  });
  
  return enabled;
}

/**
 * Get feature flags for client (safe to expose)
 */
export function getClientFeatureFlags() {
  return {
    ticketing: FEATURES.TICKETING_ENABLED,
    showcaseVoting: FEATURES.SHOWCASE_VOTING_ENABLED,
    pilotVoting: FEATURES.PILOT_VOTING_ENABLED,
    newsletter: FEATURES.NEWSLETTER_ENABLED,
    contactForm: FEATURES.CONTACT_FORM_ENABLED,
    darkMode: UI_FEATURES.DARK_MODE_ENABLED,
    animations: UI_FEATURES.ANIMATIONS_ENABLED,
    socialSharing: FEATURES.SOCIAL_SHARING_ENABLED,
    eventSearch: FEATURES.EVENT_SEARCH_ENABLED,
    eventFiltering: FEATURES.EVENT_FILTERING_ENABLED,
  };
}

/**
 * Check if maintenance mode is active
 */
export function isMaintenanceMode(): boolean {
  return MAINTENANCE_FEATURES.MAINTENANCE_MODE;
}

/**
 * Check if feature requires production environment
 */
export function isProductionOnly(feature: string): boolean {
  const productionOnlyFeatures = [
    'ANALYTICS_ENABLED',
    'ERROR_TRACKING_ENABLED',
    'RATE_LIMITING_ENABLED',
    'IP_BLOCKING_ENABLED',
  ];
  
  return productionOnlyFeatures.includes(feature);
}

// ==========================================
// COMBINED FEATURES OBJECT
// ==========================================

export const ALL_FEATURES = {
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
} as const;

// ==========================================
// TYPE EXPORTS
// ==========================================

export type FeatureCategory = keyof typeof ALL_FEATURES;
export type Feature = keyof typeof FEATURES;
export type PaymentFeature = keyof typeof PAYMENT_FEATURES;
export type AdminFeature = keyof typeof ADMIN_FEATURES;
export type NotificationFeature = keyof typeof NOTIFICATION_FEATURES;
export type SecurityFeature = keyof typeof SECURITY_FEATURES;
export type PerformanceFeature = keyof typeof PERFORMANCE_FEATURES;
export type AnalyticsFeature = keyof typeof ANALYTICS_FEATURES;
export type UIFeature = keyof typeof UI_FEATURES;
export type ExperimentalFeature = keyof typeof EXPERIMENTAL_FEATURES;
export type IntegrationFeature = keyof typeof INTEGRATION_FEATURES;
export type MaintenanceFeature = keyof typeof MAINTENANCE_FEATURES;
