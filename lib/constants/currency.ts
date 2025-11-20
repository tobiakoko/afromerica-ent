/**
 * Currency and Formatting Constants
 * Single source of truth for:
 * - Currency configuration (NGN)
 * - Paystack integration settings
 * - Number/currency formatting
 * - Money calculation utilities
 * 
 * CRITICAL: All amounts are stored in kobo (smallest unit)
 * 1 NGN = 100 kobo
 */

// ==========================================
// CURRENCY CONFIGURATION
// ==========================================

export const CURRENCY = {
  /** Currency code (ISO 4217) */
  CODE: 'NGN',
  
  /** Currency symbol */
  SYMBOL: '₦',
  
  /** Number of decimal places */
  DECIMAL_PLACES: 2,
  
  /** Smallest currency unit (kobo) */
  SUBUNIT: 100, // 100 kobo = 1 NGN
  
  /** Locale for number formatting */
  LOCALE: 'en-NG',
  
  /** Full currency name */
  NAME: 'Nigerian Naira',
  
  /** Plural name */
  NAME_PLURAL: 'Nigerian Naira',
} as const;

// ==========================================
// PAYSTACK CONFIGURATION
// ==========================================

export const PAYSTACK_CONFIG = {
  /** Minimum amount Paystack accepts (in kobo) - NGN 1.00 */
  MIN_AMOUNT: 100,
  
  /** Payment callback URL (dynamically set from env) */
  CALLBACK_URL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/callback`,
  
  /** Webhook endpoint path */
  WEBHOOK_PATH: '/api/webhooks/paystack',
  
  /** Paystack API base URL */
  API_BASE_URL: 'https://api.paystack.co',
  
  /** Transaction verification endpoint */
  VERIFY_ENDPOINT: '/transaction/verify',
  
  /** Initialize transaction endpoint */
  INITIALIZE_ENDPOINT: '/transaction/initialize',
  
  /** Default payment channels */
  CHANNELS: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'] as const,
  
  /** Currency (must be NGN for Nigerian businesses) */
  CURRENCY: CURRENCY.CODE,
  
  /** Test mode flag (from environment) */
  IS_TEST_MODE: process.env.NODE_ENV !== 'production',
} as const;

// ==========================================
// NUMBER FORMATTING
// ==========================================

export const NUMBER_FORMAT = {
  /** Locale for formatting */
  LOCALE: CURRENCY.LOCALE,
  
  /** Thousands separator */
  THOUSANDS_SEPARATOR: ',',
  
  /** Decimal separator */
  DECIMAL_SEPARATOR: '.',
  
  /** Decimal places for currency */
  CURRENCY_DECIMALS: CURRENCY.DECIMAL_PLACES,
  
  /** Decimal places for percentages */
  PERCENTAGE_DECIMALS: 1,
  
  /** Decimal places for statistics */
  STATS_DECIMALS: 0,
} as const;

// ==========================================
// FORMATTING FUNCTIONS
// ==========================================

/**
 * Format amount in kobo to currency string
 * @param amountInKobo - Amount in kobo (e.g., 150000 for ₦1,500.00)
 * @param showSymbol - Whether to include currency symbol (default: true)
 * @returns Formatted string (e.g., "₦1,500.00")
 * 
 * @example
 * formatCurrency(150000) // "₦1,500.00"
 * formatCurrency(150000, false) // "1,500.00"
 */
export function formatCurrency(
  amountInKobo: number,
  showSymbol: boolean = true
): string {
  const amountInNaira = amountInKobo / CURRENCY.SUBUNIT;
  
  const formatted = amountInNaira.toLocaleString(CURRENCY.LOCALE, {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  });
  
  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
}

/**
 * Format amount in kobo to compact currency string
 * @param amountInKobo - Amount in kobo
 * @returns Compact string (e.g., "₦1.5K", "₦2.3M")
 * 
 * @example
 * formatCurrencyCompact(150000) // "₦1.5K"
 * formatCurrencyCompact(230000000) // "₦2.3M"
 */
export function formatCurrencyCompact(amountInKobo: number): string {
  const amountInNaira = amountInKobo / CURRENCY.SUBUNIT;
  
  const formatter = new Intl.NumberFormat(CURRENCY.LOCALE, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  
  return `${CURRENCY.SYMBOL}${formatter.format(amountInNaira)}`;
}

/**
 * Parse currency string to amount in kobo
 * @param currencyString - String like "₦1,500.00" or "1500"
 * @returns Amount in kobo
 * 
 * @example
 * parseCurrency("₦1,500.00") // 150000
 * parseCurrency("1500") // 150000
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbol, commas, and spaces
  const cleaned = currencyString
    .replace(CURRENCY.SYMBOL, '')
    .replace(/,/g, '')
    .trim();
  
  const amountInNaira = parseFloat(cleaned);
  
  if (isNaN(amountInNaira)) {
    throw new Error(`Invalid currency string: ${currencyString}`);
  }
  
  return Math.round(amountInNaira * CURRENCY.SUBUNIT);
}

/**
 * Convert Naira to kobo
 * @param naira - Amount in Naira (e.g., 1500.50)
 * @returns Amount in kobo (e.g., 150050)
 * 
 * @example
 * nairaToKobo(1500.50) // 150050
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * CURRENCY.SUBUNIT);
}

/**
 * Convert kobo to Naira
 * @param kobo - Amount in kobo (e.g., 150050)
 * @returns Amount in Naira (e.g., 1500.50)
 * 
 * @example
 * koboToNaira(150050) // 1500.50
 */
export function koboToNaira(kobo: number): number {
  return kobo / CURRENCY.SUBUNIT;
}

/**
 * Format number with thousands separator
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string
 * 
 * @example
 * formatNumber(1500) // "1,500"
 * formatNumber(1500.5, 2) // "1,500.50"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString(NUMBER_FORMAT.LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with % symbol
 * 
 * @example
 * formatPercentage(75.5) // "75.5%"
 * formatPercentage(75.5, 0) // "76%"
 */
export function formatPercentage(
  value: number,
  decimals: number = NUMBER_FORMAT.PERCENTAGE_DECIMALS
): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage
 * @param part - Part value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Percentage value
 * 
 * @example
 * calculatePercentage(75, 100) // 75.0
 * calculatePercentage(1, 3, 2) // 33.33
 */
export function calculatePercentage(
  part: number,
  total: number,
  decimals: number = NUMBER_FORMAT.PERCENTAGE_DECIMALS
): number {
  if (total === 0) return 0;
  return parseFloat(((part / total) * 100).toFixed(decimals));
}

// ==========================================
// PRICE DISPLAY HELPERS
// ==========================================

/**
 * Format price range
 * @param minKobo - Minimum price in kobo
 * @param maxKobo - Maximum price in kobo
 * @returns Formatted range string
 * 
 * @example
 * formatPriceRange(500000, 1000000) // "₦5,000 - ₦10,000"
 */
export function formatPriceRange(minKobo: number, maxKobo: number): string {
  if (minKobo === maxKobo) {
    return formatCurrency(minKobo);
  }
  return `${formatCurrency(minKobo)} - ${formatCurrency(maxKobo)}`;
}

/**
 * Format "from" price (for event cards)
 * @param minKobo - Minimum price in kobo
 * @returns Formatted string
 * 
 * @example
 * formatFromPrice(500000) // "From ₦5,000"
 */
export function formatFromPrice(minKobo: number): string {
  return `From ${formatCurrency(minKobo)}`;
}

/**
 * Check if price is free
 * @param priceInKobo - Price in kobo
 * @returns true if price is 0 or undefined
 */
export function isFreePrice(priceInKobo?: number | null): boolean {
  return !priceInKobo || priceInKobo === 0;
}

/**
 * Format price with "Free" fallback
 * @param priceInKobo - Price in kobo (can be null/undefined)
 * @returns Formatted string or "Free"
 * 
 * @example
 * formatPriceWithFree(0) // "Free"
 * formatPriceWithFree(null) // "Free"
 * formatPriceWithFree(500000) // "₦5,000.00"
 */
export function formatPriceWithFree(priceInKobo?: number | null): string {
  if (isFreePrice(priceInKobo)) {
    return 'Free';
  }
  return formatCurrency(priceInKobo!);
}

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate amount meets Paystack minimum
 * @param amountInKobo - Amount in kobo
 * @returns true if amount is valid for Paystack
 */
export function isValidPaystackAmount(amountInKobo: number): boolean {
  return amountInKobo >= PAYSTACK_CONFIG.MIN_AMOUNT;
}

/**
 * Round to nearest kobo (for calculations)
 * @param amountInKobo - Amount that may have decimal kobo
 * @returns Rounded amount
 * 
 * @example
 * roundToKobo(1500.7) // 1501
 */
export function roundToKobo(amountInKobo: number): number {
  return Math.round(amountInKobo);
}

/**
 * Calculate total with quantity
 * @param priceInKobo - Unit price in kobo
 * @param quantity - Quantity
 * @returns Total in kobo
 * 
 * @example
 * calculateTotal(500000, 3) // 1500000 (₦15,000.00)
 */
export function calculateTotal(priceInKobo: number, quantity: number): number {
  return roundToKobo(priceInKobo * quantity);
}

/**
 * Calculate discount amount
 * @param originalKobo - Original price in kobo
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discount amount in kobo
 * 
 * @example
 * calculateDiscount(100000, 10) // 10000 (10% of ₦1,000)
 */
export function calculateDiscount(
  originalKobo: number,
  discountPercent: number
): number {
  return roundToKobo((originalKobo * discountPercent) / 100);
}

/**
 * Apply discount to price
 * @param originalKobo - Original price in kobo
 * @param discountPercent - Discount percentage (0-100)
 * @returns Final price in kobo
 * 
 * @example
 * applyDiscount(100000, 10) // 90000 (₦1,000 - 10% = ₦900)
 */
export function applyDiscount(
  originalKobo: number,
  discountPercent: number
): number {
  const discountAmount = calculateDiscount(originalKobo, discountPercent);
  return originalKobo - discountAmount;
}

// ==========================================
// COST COMPARISON (Paystack vs Stripe)
// ==========================================

/**
 * Cost savings using Paystack instead of Stripe for Nigerian market
 * Based on typical transaction fees:
 * - Paystack: 1.5% + ₦100 (capped at ₦2,000)
 * - Stripe: 3.9% + $0.30 (no cap, USD conversion)
 * 
 * For NGN 100,000,000 annual volume (~$65,000 USD):
 * - Paystack fees: ~₦1,880,000
 * - Stripe fees: ~₦5,000,000+ (with forex)
 * - Savings: ~₦3,120,000 annually
 */
export const PAYMENT_PROCESSOR_COMPARISON = {
  PAYSTACK_FEE_PERCENT: 1.5,
  PAYSTACK_FEE_FIXED: 10000, // ₦100 in kobo
  PAYSTACK_FEE_CAP: 200000, // ₦2,000 in kobo
  
  STRIPE_FEE_PERCENT: 3.9,
  STRIPE_FEE_FIXED_USD: 0.30,
  
  // Estimated annual savings for ₦100M volume
  ANNUAL_SAVINGS_NGN: 312000000, // ₦3,120,000 in kobo
} as const;
