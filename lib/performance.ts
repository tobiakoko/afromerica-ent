// Performance Monitoring Utilities
// Measure and track application performance metrics

/**
 * Performance metric types
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

/**
 * Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    poor: 4000,
  },
  // First Input Delay (FID)
  FID: {
    good: 100,
    poor: 300,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    poor: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    poor: 1800,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    poor: 500,
  },
};

/**
 * Get performance rating based on value and metric name
 */
export function getPerformanceRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];

  if (!thresholds) {
    return 'good';
  }

  if (value <= thresholds.good) {
    return 'good';
  }

  if (value <= thresholds.poor) {
    return 'needs-improvement';
  }

  return 'poor';
}

/**
 * Report web vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', metric.name, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to analytics service
  // You can integrate with Google Analytics, Vercel Analytics, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon if available, otherwise fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, body);
    } else {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error);
    }
  }
}

/**
 * Measure function execution time
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    // Mark performance entry
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Performance observer for monitoring metrics
 */
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;
  private metrics: Map<string, number[]> = new Map();

  constructor() {
    if (typeof window === 'undefined') return;

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration);
        }
      });

      this.observer.observe({
        entryTypes: ['measure', 'navigation', 'resource', 'paint'],
      });
    } catch (error) {
      console.warn('PerformanceObserver not supported', error);
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string): number {
    const values = this.getMetrics(name);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  clearMetrics() {
    this.metrics.clear();
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll(selector);

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      const src = img.getAttribute('data-src');
      if (src) {
        (img as HTMLImageElement).src = src;
      }
    });
  }
}

/**
 * Prefetch resources for faster navigation
 */
export function prefetchResources(urls: string[]) {
  if (typeof document === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Get connection quality
 */
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  if (typeof navigator === 'undefined' || !(navigator as any).connection) {
    return 'fast';
  }

  const connection = (navigator as any).connection;
  const effectiveType = connection.effectiveType;

  if (effectiveType === '4g') return 'fast';
  if (effectiveType === '3g') return 'medium';
  return 'slow';
}

/**
 * Check if device has low memory
 */
export function isLowMemoryDevice(): boolean {
  if (typeof navigator === 'undefined' || !(navigator as any).deviceMemory) {
    return false;
  }

  const memory = (navigator as any).deviceMemory;
  return memory < 4; // Less than 4GB
}

/**
 * Get device performance tier
 */
export function getDevicePerformanceTier(): 'low' | 'medium' | 'high' {
  const connection = getConnectionQuality();
  const lowMemory = isLowMemoryDevice();

  if (lowMemory || connection === 'slow') return 'low';
  if (connection === 'medium') return 'medium';
  return 'high';
}

/**
 * Resource hints for performance optimization
 */
export function addResourceHints(hints: {
  preconnect?: string[];
  dnsPrefetch?: string[];
  preload?: Array<{ href: string; as: string }>;
}) {
  if (typeof document === 'undefined') return;

  // Add preconnect hints
  hints.preconnect?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  });

  // Add DNS prefetch hints
  hints.dnsPrefetch?.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });

  // Add preload hints
  hints.preload?.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  });
}
