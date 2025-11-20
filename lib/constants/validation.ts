/**
 * Validation Constants
 * Single source of truth for:
 * - Regex patterns
 * - Validation messages
 * - Common validators
 * - Error text
 */

// ==========================================
// REGEX PATTERNS
// ==========================================

export const VALIDATION_PATTERNS = {
  /** Email validation (RFC 5322 simplified) */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** Nigerian phone number (+234 or 0, then 7/8/9, then 0/1, then 8 digits) */
  PHONE_NG: /^(\+234|0)[789][01]\d{8}$/,
  
  /** International phone (E.164 format) */
  PHONE_INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
  
  /** URL slug (lowercase letters, numbers, hyphens only) */
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  
  /** UUID v4 */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  
  /** 6-digit OTP code */
  OTP: /^\d{6}$/,
  
  /** Booking reference (format: BK-XXXXXXXX) */
  BOOKING_REF: /^BK-[A-Z0-9]{8}$/,
  
  /** Vote reference (format: VT-XXXXXXXX) */
  VOTE_REF: /^VT-[A-Z0-9]{8}$/,
  
  /** Payment reference (format: PAY-XXXXXXXX) */
  PAYMENT_REF: /^PAY-[A-Z0-9]{8}$/,
  
  /** Alphanumeric only */
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  
  /** Letters only (any language) */
  LETTERS_ONLY: /^[\p{L}\s]+$/u,
  
  /** Numbers only */
  NUMBERS_ONLY: /^\d+$/,
  
  /** Positive integer */
  POSITIVE_INTEGER: /^[1-9]\d*$/,
  
  /** Password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number) */
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  
  /** Nigerian Bank Account Number (10 digits) */
  BANK_ACCOUNT_NG: /^\d{10}$/,
  
  /** Date (YYYY-MM-DD) */
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  
  /** Time (HH:MM 24-hour format) */
  TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
  
  /** Hex color code */
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  
  /** Nigerian postal code */
  POSTAL_CODE_NG: /^\d{6}$/,
} as const;

// ==========================================
// VALIDATION MESSAGES
// ==========================================

export const VALIDATION_MESSAGES = {
  /** Required field */
  REQUIRED: 'This field is required',
  REQUIRED_FIELD: (fieldName: string) => `${fieldName} is required`,
  
  /** Email */
  INVALID_EMAIL: 'Please enter a valid email address',
  EMAIL_ALREADY_EXISTS: 'This email is already registered',
  
  /** Phone */
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PHONE_NG: 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)',
  
  /** Password */
  INVALID_PASSWORD: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
  PASSWORD_TOO_SHORT: (min: number) => `Password must be at least ${min} characters`,
  PASSWORD_TOO_LONG: (max: number) => `Password must not exceed ${max} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  
  /** String length */
  TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
  TOO_LONG: (max: number) => `Must not exceed ${max} characters`,
  LENGTH_BETWEEN: (min: number, max: number) => `Must be between ${min} and ${max} characters`,
  
  /** Numbers */
  MUST_BE_NUMBER: 'Must be a valid number',
  MUST_BE_POSITIVE: 'Must be a positive number',
  MUST_BE_INTEGER: 'Must be a whole number',
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must not exceed ${max}`,
  VALUE_BETWEEN: (min: number, max: number) => `Must be between ${min} and ${max}`,
  
  /** Amount/Currency */
  INVALID_AMOUNT: 'Please enter a valid amount',
  MIN_AMOUNT: (min: string) => `Minimum amount is ${min}`,
  MAX_AMOUNT: (max: string) => `Maximum amount is ${max}`,
  
  /** OTP */
  INVALID_OTP: 'Please enter a valid 6-digit code',
  OTP_EXPIRED: 'This code has expired. Please request a new one',
  OTP_INVALID: 'Invalid verification code',
  OTP_MAX_ATTEMPTS: 'Too many attempts. Please request a new code',
  
  /** Booking */
  INVALID_BOOKING_REF: 'Invalid booking reference',
  BOOKING_NOT_FOUND: 'Booking not found',
  BOOKING_EXPIRED: 'This booking has expired',
  
  /** Tickets */
  INVALID_QUANTITY: 'Please enter a valid quantity',
  MIN_QUANTITY: (min: number) => `Minimum quantity is ${min}`,
  MAX_QUANTITY: (max: number) => `Maximum quantity is ${max}`,
  INSUFFICIENT_TICKETS: 'Not enough tickets available',
  NO_TICKETS_SELECTED: 'Please select at least one ticket',
  
  /** Voting */
  ALREADY_VOTED: 'You have already voted',
  VOTING_CLOSED: 'Voting is currently closed',
  MAX_VOTES_EXCEEDED: (max: number) => `Maximum ${max} votes allowed`,
  
  /** Date/Time */
  INVALID_DATE: 'Please enter a valid date',
  INVALID_TIME: 'Please enter a valid time',
  DATE_IN_PAST: 'Date cannot be in the past',
  DATE_TOO_FAR: 'Date is too far in the future',
  
  /** File upload */
  FILE_TOO_LARGE: (maxMB: number) => `File must be less than ${maxMB}MB`,
  INVALID_FILE_TYPE: (types: string) => `File must be ${types}`,
  
  /** Generic */
  INVALID_INPUT: 'Invalid input',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again',
  PLEASE_TRY_AGAIN: 'Please try again',
  
  /** Rate limiting */
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later',
  RATE_LIMIT_EXCEEDED: (retryAfter?: number) => 
    retryAfter 
      ? `Too many requests. Please try again in ${retryAfter} seconds`
      : 'Too many requests. Please try again later',
} as const;

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE_NG.test(phone);
}

/**
 * Validate international phone number
 */
export function isValidInternationalPhone(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE_INTERNATIONAL.test(phone);
}

/**
 * Validate phone (Nigerian or International)
 */
export function isValidPhone(phone: string): boolean {
  return isValidNigerianPhone(phone) || isValidInternationalPhone(phone);
}

/**
 * Format Nigerian phone to E.164 format
 */
export function formatNigerianPhone(phone: string): string | null {
  if (!isValidNigerianPhone(phone)) return null;
  
  // Remove any whitespace
  const cleaned = phone.replace(/\s/g, '');
  
  // Convert to +234 format
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`;
  }
  
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  
  return null;
}

/**
 * Validate URL slug
 * Ensures slug follows the pattern: lowercase alphanumeric with hyphens
 */
export function isValidSlug(slug: string): boolean {
  return VALIDATION_PATTERNS.SLUG.test(slug);
}

/**
 * Generate URL-safe slug from text
 * Handles special characters, accents, spaces, and ensures proper formatting
 *
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug string
 *
 * @example
 * generateSlug("Hello World!") // "hello-world"
 * generateSlug("Café Münster") // "cafe-munster"
 * generateSlug("  Multiple   Spaces  ") // "multiple-spaces"
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove accents/diacritics (é -> e, ñ -> n, etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters and spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Sanitize user-provided slug input
 * Use this when accepting slug values from user input
 */
export function sanitizeSlug(slug: string): string {
  return generateSlug(slug);
}

/**
 * Validate UUID
 */
export function isValidUUID(uuid: string): boolean {
  return VALIDATION_PATTERNS.UUID.test(uuid);
}

/**
 * Validate OTP code
 */
export function isValidOTP(otp: string): boolean {
  return VALIDATION_PATTERNS.OTP.test(otp);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  return VALIDATION_PATTERNS.PASSWORD_STRONG.test(password);
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  // Cap at 4
  score = Math.min(score, 4);
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
  
  return {
    score,
    label: labels[score],
    color: colors[score],
  };
}

/**
 * Validate string length
 */
export function isValidLength(
  value: string,
  min?: number,
  max?: number
): boolean {
  const length = value.length;
  
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
}

/**
 * Validate number range
 */
export function isInRange(
  value: number,
  min?: number,
  max?: number
): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  
  return true;
}

/**
 * Sanitize string (remove HTML, scripts)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return isValidEmail(trimmed) ? trimmed : null;
}

/**
 * Check if string contains only letters and spaces
 */
export function isLettersOnly(value: string): boolean {
  return VALIDATION_PATTERNS.LETTERS_ONLY.test(value);
}

/**
 * Check if string contains only numbers
 */
export function isNumbersOnly(value: string): boolean {
  return VALIDATION_PATTERNS.NUMBERS_ONLY.test(value);
}

/**
 * Check if value is a positive integer
 */
export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validate date is not in the past
 */
export function isNotPastDate(date: Date): boolean {
  return date >= new Date();
}

/**
 * Validate date is within range (e.g., next 2 years)
 */
export function isWithinDateRange(
  date: Date,
  maxDaysFromNow: number = 730 // Default 2 years
): boolean {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + maxDaysFromNow);
  
  return date >= now && date <= maxDate;
}

/**
 * Parse and validate ISO date string
 */
export function parseISODate(dateString: string): Date | null {
  if (!VALIDATION_PATTERNS.DATE_ISO.test(dateString)) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Validate file size
 */
export function isValidFileSize(
  fileSizeBytes: number,
  maxSizeBytes: number
): boolean {
  return fileSizeBytes <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(
  fileName: string,
  allowedExtensions: string[]
): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Validate credit card number (basic Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned)) return false;
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// ==========================================
// SANITIZATION FUNCTIONS
// ==========================================

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(text: string): string {
  return text.replace(/\s/g, '');
}

/**
 * Normalize whitespace (multiple spaces to single)
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}
