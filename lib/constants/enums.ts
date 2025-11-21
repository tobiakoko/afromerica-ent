/**
 * Enums and Status Constants
 * Single source of truth for all enum-like values used across:
 * - Database constraints
 * - API validation (Zod schemas)
 * - Frontend displays
 * - Business logic
 */

// ==========================================
// EVENT ENUMS
// ==========================================

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SOLDOUT: 'soldout',
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_CATEGORY = {
  CONCERT: 'concert',
  FESTIVAL: 'festival',
  CLUB: 'club',
  PRIVATE: 'private',
  TOUR: 'tour',
} as const;

export type EventCategory = (typeof EVENT_CATEGORY)[keyof typeof EVENT_CATEGORY];

// Helper arrays for Zod schemas
export const EVENT_STATUS_VALUES = Object.values(EVENT_STATUS) as [
  EventStatus,
  ...EventStatus[]
];
export const EVENT_CATEGORY_VALUES = Object.values(EVENT_CATEGORY) as [
  EventCategory,
  ...EventCategory[]
];

// ==========================================
// BOOKING ENUMS
// ==========================================

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  REFUNDED: 'refunded',
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS) as [
  BookingStatus,
  ...BookingStatus[]
];

// ==========================================
// PAYMENT ENUMS
// ==========================================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_METHOD = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  USSD: 'ussd',
  MOBILE_MONEY: 'mobile_money',
  QR: 'qr',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_PROVIDER = {
  PAYSTACK: 'paystack',
  // Future: Add other providers if needed -- maybe Stripe
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS) as [
  PaymentStatus,
  ...PaymentStatus[]
];
export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD) as [
  PaymentMethod,
  ...PaymentMethod[]
];
export const PAYMENT_PROVIDER_VALUES = Object.values(PAYMENT_PROVIDER) as [
  PaymentProvider,
  ...PaymentProvider[]
];

// ==========================================
// VOTING ENUMS
// ==========================================

export const VOTE_TYPE = {
  SHOWCASE: 'showcase'
} as const;

export type VoteType = (typeof VOTE_TYPE)[keyof typeof VOTE_TYPE];

export const VOTE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type VoteStatus = (typeof VOTE_STATUS)[keyof typeof VOTE_STATUS];

export const VOTE_TYPE_VALUES = Object.values(VOTE_TYPE) as [
  VoteType,
  ...VoteType[]
];
export const VOTE_STATUS_VALUES = Object.values(VOTE_STATUS) as [
  VoteStatus,
  ...VoteStatus[]
];

// ==========================================
// USER & ADMIN ENUMS
// ==========================================

export const USER_ROLE = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  CONTENT_MANAGER: 'content_manager', // Depending on how large the site gets, this might have something to do with CMS
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE_VALUES = Object.values(USER_ROLE) as [
  UserRole,
  ...UserRole[]
];

// ==========================================
// COMMUNICATION ENUMS
// ==========================================

export const EMAIL_TYPE = {
  BOOKING_CONFIRMATION: 'booking_confirmation', // FINDOUT: Is this Booking or ticket?
  BOOKING_CANCELLATION: 'booking_cancellation',
  VOTE_CONFIRMATION: 'vote_confirmation',
  OTP_VERIFICATION: 'otp_verification',
  NEWSLETTER: 'newsletter',
  PROMOTIONAL: 'promotional',
} as const;

export type EmailType = (typeof EMAIL_TYPE)[keyof typeof EMAIL_TYPE];

export const EMAIL_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  BOUNCED: 'bounced',
} as const;

export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];

export const EMAIL_TYPE_VALUES = Object.values(EMAIL_TYPE) as [
  EmailType,
  ...EmailType[]
];
export const EMAIL_STATUS_VALUES = Object.values(EMAIL_STATUS) as [
  EmailStatus,
  ...EmailStatus[]
];

// ==========================================
// AUDIT LOG ENUMS
// ==========================================

export const AUDIT_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PAYMENT: 'payment',
  REFUND: 'refund',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export const AUDIT_RESOURCE = {
  EVENT: 'event',
  BOOKING: 'booking',
  VOTE: 'vote',
  ARTIST: 'artist',
  PAYMENT: 'payment',
  USER: 'user',
} as const;

export type AuditResource = (typeof AUDIT_RESOURCE)[keyof typeof AUDIT_RESOURCE];

export const AUDIT_ACTION_VALUES = Object.values(AUDIT_ACTION) as [
  AuditAction,
  ...AuditAction[]
];
export const AUDIT_RESOURCE_VALUES = Object.values(AUDIT_RESOURCE) as [
  AuditResource,
  ...AuditResource[]
];

// ==========================================
// DISPLAY LABELS (for UI)
// ==========================================

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EVENT_STATUS.UPCOMING]: 'Upcoming',
  [EVENT_STATUS.ONGOING]: 'Ongoing',
  [EVENT_STATUS.COMPLETED]: 'Completed',
  [EVENT_STATUS.CANCELLED]: 'Cancelled',
  [EVENT_STATUS.SOLDOUT]: 'Sold Out',
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  [EVENT_CATEGORY.CONCERT]: 'Concert',
  [EVENT_CATEGORY.FESTIVAL]: 'Festival',
  [EVENT_CATEGORY.CLUB]: 'Club Night',
  [EVENT_CATEGORY.PRIVATE]: 'Private Event',
  [EVENT_CATEGORY.TOUR]: 'Tour',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.EXPIRED]: 'Expired',
  [BOOKING_STATUS.REFUNDED]: 'Refunded',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.SUCCESS]: 'Successful',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.CARD]: 'Card Payment',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHOD.USSD]: 'USSD',
  [PAYMENT_METHOD.MOBILE_MONEY]: 'Mobile Money',
  [PAYMENT_METHOD.QR]: 'QR Code',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLE.ADMIN]: 'Administrator',
  [USER_ROLE.SUPER_ADMIN]: 'Super Administrator',
  [USER_ROLE.CONTENT_MANAGER]: 'Content Manager',
};

// ==========================================
// STATUS BADGE COLORS (for UI components)
// ==========================================

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  [EVENT_STATUS.UPCOMING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [EVENT_STATUS.ONGOING]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [EVENT_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  [EVENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [EVENT_STATUS.SOLDOUT]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [BOOKING_STATUS.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [BOOKING_STATUS.EXPIRED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  [BOOKING_STATUS.REFUNDED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [PAYMENT_STATUS.SUCCESS]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PAYMENT_STATUS.FAILED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PAYMENT_STATUS.REFUNDED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};
