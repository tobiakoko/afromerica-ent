import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format amount as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const regex = /^\+?[1-9]\d{1,14}$/
  return regex.test(phone)
}

/**
 * Format a date string for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format date with time
 */
export function formatEventDateTime(dateString: string, timeString?: string): string {
  const date = new Date(dateString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  
  if (timeString) {
    return `${formattedDate} at ${timeString}`;
  }
  
  return formattedDate;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'NGN'): string {
  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };

  const symbol = currencySymbols[currency] || currency;
  
  return `${symbol}${price.toLocaleString()}`;
}

/**
 * Format date range for events
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  
  if (!endDate) {
    return formatEventDate(startDate);
  }
  
  const end = new Date(endDate);
  
  const startOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  
  const endOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  return `${start.toLocaleDateString('en-US', startOptions)} - ${end.toLocaleDateString('en-US', endOptions)}`;
}

/**
 * Get relative time (e.g., "2 days from now")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return 'Past event';
  } else if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays < 7) {
    return `In ${diffInDays} days`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `In ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `In ${months} ${months === 1 ? 'month' : 'months'}`;
  }
}

/**
 * Format ticket availability
 */
export function formatTicketAvailability(sold: number, capacity: number): string {
  const available = capacity - sold;
  const percentage = (available / capacity) * 100;
  
  if (available === 0) {
    return 'Sold Out';
  } else if (percentage < 10) {
    return `Only ${available} left`;
  } else if (percentage < 25) {
    return 'Selling Fast';
  } else {
    return `${available} available`;
  }
}

/**
 * Check if event is sold out
 */
export function isEventSoldOut(capacity: number, soldTickets: number): boolean {
  return soldTickets >= capacity;
}

/**
 * Get remaining ticket availability
 */
export function getTicketAvailability(capacity: number, soldTickets: number): number {
  return Math.max(0, capacity - soldTickets);
}

/**
 * Generate unique booking reference
 */
export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AFM-${timestamp}-${random}`;
}