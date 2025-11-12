/*
APP CONSTANTS
Should contain API URLs, pagination limits, etc.
*/

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const ITEMS_PER_PAGE = 12;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const CURRENCY = 'NGN';
export const COMPANY_NAME = 'Afromerica Entertainment';
export const SUPPORT_EMAIL = 'support@afromerica.com';
