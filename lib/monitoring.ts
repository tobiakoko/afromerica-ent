// Application Monitoring and Logging Utilities
// Track errors, events, and application health

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Event types for tracking
 */
export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  API_CALL = 'api_call',
  ERROR = 'error',
  PAYMENT = 'payment',
  VOTE = 'vote',
  BOOKING = 'booking',
  CUSTOM = 'custom',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Event tracking interface
 */
export interface TrackingEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

/**
 * Error context interface
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      data,
      error,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);

    // Keep only the last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to external service if configured
    this.sendToService(entry);
  }

  private sendToService(entry: LogEntry) {
    // Send to monitoring service (e.g., Sentry, Datadog, LogRocket)
    if (process.env.NEXT_PUBLIC_MONITORING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      }).catch((err) => {
        console.error('Failed to send log to service:', err);
      });
    }
  }

  debug(message: string, data?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
    this.addLog(entry);

    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.INFO, message, data);
    this.addLog(entry);

    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.WARN, message, data);
    this.addLog(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: Error, data?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, error);
    this.addLog(entry);
    console.error(`[ERROR] ${message}`, error, data);
  }

  fatal(message: string, error?: Error, data?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.FATAL, message, data, error);
    this.addLog(entry);
    console.error(`[FATAL] ${message}`, error, data);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return this.logs;
    return this.logs.filter((log) => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }
}

/**
 * Get logger instance
 */
export function getLogger(): Logger {
  return Logger.getInstance();
}

/**
 * Error tracking and reporting
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Array<{ error: Error; context?: ErrorContext }> = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.captureError(event.error, {
          component: 'Global',
          action: 'uncaught_error',
          metadata: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(new Error(event.reason), {
          component: 'Global',
          action: 'unhandled_rejection',
        });
      });
    }
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  captureError(error: Error, context?: ErrorContext) {
    this.errors.push({ error, context });

    // Log the error
    getLogger().error(error.message, error, context);

    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: { custom: context },
      });
    }

    // Send to custom error endpoint
    if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          context,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
        keepalive: true,
      }).catch(console.error);
    }
  }

  getErrors(): Array<{ error: Error; context?: ErrorContext }> {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

/**
 * Get error tracker instance
 */
export function getErrorTracker(): ErrorTracker {
  return ErrorTracker.getInstance();
}

/**
 * Event tracking for analytics
 */
export class EventTracker {
  private static instance: EventTracker;

  private constructor() {}

  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }

  track(type: EventType, name: string, properties?: Record<string, any>) {
    const event: TrackingEvent = {
      type,
      name,
      properties,
      timestamp: Date.now(),
    };

    // Log the event
    getLogger().info(`Event: ${name}`, { type, properties });

    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: type,
        ...properties,
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(console.error);
    }
  }

  // Convenience methods
  trackPageView(path: string, title?: string) {
    this.track(EventType.PAGE_VIEW, 'page_view', { path, title });
  }

  trackClick(element: string, properties?: Record<string, any>) {
    this.track(EventType.CLICK, 'click', { element, ...properties });
  }

  trackFormSubmit(formName: string, properties?: Record<string, any>) {
    this.track(EventType.FORM_SUBMIT, 'form_submit', { formName, ...properties });
  }

  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.track(EventType.API_CALL, 'api_call', {
      endpoint,
      method,
      duration,
      status,
    });
  }

  trackPayment(amount: number, currency: string, type: 'voting' | 'booking', status: string) {
    this.track(EventType.PAYMENT, 'payment', {
      amount,
      currency,
      type,
      status,
    });
  }

  trackVote(artistId: string, votes: number, amount: number) {
    this.track(EventType.VOTE, 'vote_purchase', {
      artistId,
      votes,
      amount,
    });
  }

  trackBooking(eventId: string, ticketType: string, quantity: number, amount: number) {
    this.track(EventType.BOOKING, 'booking', {
      eventId,
      ticketType,
      quantity,
      amount,
    });
  }
}

/**
 * Get event tracker instance
 */
export function getEventTracker(): EventTracker {
  return EventTracker.getInstance();
}

/**
 * API monitoring wrapper
 */
export async function monitoredFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const startTime = performance.now();
  const method = options?.method || 'GET';

  try {
    const response = await fetch(url, options);
    const duration = performance.now() - startTime;

    // Track API call
    getEventTracker().trackApiCall(url, method, duration, response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const duration = performance.now() - startTime;

    // Track failed API call
    getEventTracker().trackApiCall(url, method, duration, 0);

    // Capture error
    getErrorTracker().captureError(error as Error, {
      component: 'API',
      action: 'fetch',
      metadata: { url, method },
    });

    throw error;
  }
}

/**
 * Console override for production monitoring
 */
export function setupConsoleMonitoring() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
    return;
  }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  console.log = (...args) => {
    getLogger().info(args.join(' '));
    originalConsole.log(...args);
  };

  console.warn = (...args) => {
    getLogger().warn(args.join(' '));
    originalConsole.warn(...args);
  };

  console.error = (...args) => {
    const error = args.find((arg) => arg instanceof Error);
    const message = args.map((arg) => String(arg)).join(' ');
    getLogger().error(message, error);
    originalConsole.error(...args);
  };
}

/**
 * Health check monitoring
 */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database?: boolean;
    api?: boolean;
    cache?: boolean;
  };
  timestamp: number;
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = {};

  try {
    // Check API health
    const apiResponse = await fetch('/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    checks.api = apiResponse.ok;
  } catch {
    checks.api = false;
  }

  const healthyCount = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  let status: HealthCheckResult['status'] = 'healthy';
  if (healthyCount === 0) {
    status = 'unhealthy';
  } else if (healthyCount < totalChecks) {
    status = 'degraded';
  }

  return {
    status,
    checks,
    timestamp: Date.now(),
  };
}

/**
 * Session tracking
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }

  return sessionId;
}

/**
 * User tracking
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('user_id');
}

export function setUserId(userId: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('user_id', userId);
}
