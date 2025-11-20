/**
 * Next.js Instrumentation
 * This file runs before the application starts, allowing you to set up monitoring,
 * logging, and other instrumentation tools.
 *
 * To enable instrumentation, add this to your next.config.js:
 * experimental: {
 *   instrumentationHook: true,
 * }
 */
 
import { getLogger, setupConsoleMonitoring } from '@/lib/monitoring';
 
/**
 * Register function runs once when the server starts
 */
export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await registerServerInstrumentation();
  }
 
  // Run on edge runtime if needed
  if (process.env.NEXT_RUNTIME === 'edge') {
    await registerEdgeInstrumentation();
  }
}
 
/**
 * Server-side instrumentation
 */
async function registerServerInstrumentation() {
  const logger = getLogger();
 
  logger.info('Server instrumentation started', {
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    runtime: process.env.NEXT_RUNTIME,
  });
 
  // Set up console monitoring in production
  if (process.env.NODE_ENV === 'production') {
    setupConsoleMonitoring();
    logger.info('Console monitoring enabled');
  }
 
  // Initialize error tracking (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/nextjs');
 
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        debug: process.env.NODE_ENV === 'development',
        enabled: process.env.NODE_ENV === 'production',
        integrations: [
          // Add custom integrations
        ],
        beforeSend(event, hint) {
          // Filter out certain errors
          if (event.exception) {
            const error = hint.originalException;
            // Filter known errors
            if (error instanceof Error) {
              if (error.message.includes('ResizeObserver')) {
                return null; // Don't send ResizeObserver errors
              }
            }
          }
          return event;
        },
      });
 
      logger.info('Sentry initialized');
    } catch (error) {
      logger.warn('Failed to initialize Sentry', { error });
    }
  }
 
  // Initialize performance monitoring
  setupPerformanceMonitoring();
 
  // Initialize database monitoring
  setupDatabaseMonitoring();
 
  // Set up graceful shutdown
  setupGracefulShutdown();
 
  logger.info('Server instrumentation completed');
}
 
/**
 * Edge runtime instrumentation
 */
async function registerEdgeInstrumentation() {
  const logger = getLogger();
  logger.info('Edge instrumentation started');
 
  // Edge runtime has limited capabilities
  // Set up only lightweight monitoring
 
  logger.info('Edge instrumentation completed');
}
 
/**
 * Set up performance monitoring
 */
function setupPerformanceMonitoring() {
  const logger = getLogger();
 
  // Monitor event loop lag (Node.js only)
  if (typeof process !== 'undefined' && process.hrtime) {
    let lastCheck = process.hrtime.bigint();
 
    setInterval(() => {
      const now = process.hrtime.bigint();
      const lag = Number(now - lastCheck) / 1e6 - 5000; // Expected 5000ms
 
      if (lag > 100) {
        logger.warn('Event loop lag detected', { lag: `${lag}ms` });
      }
 
      lastCheck = now;
    }, 5000);
  }
 
  // Monitor memory usage
  if (typeof process !== 'undefined' && process.memoryUsage) {
    setInterval(() => {
      const usage = process.memoryUsage();
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
      const usagePercent = (usage.heapUsed / usage.heapTotal) * 100;
 
      if (usagePercent > 90) {
        logger.warn('High memory usage', {
          heapUsed: `${heapUsedMB}MB`,
          heapTotal: `${heapTotalMB}MB`,
          percentage: `${usagePercent.toFixed(2)}%`,
        });
      }
 
      // Log memory stats periodically in development
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Memory usage', {
          heapUsed: `${heapUsedMB}MB`,
          heapTotal: `${heapTotalMB}MB`,
          rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
        });
      }
    }, 60000); // Every minute
  }
 
  logger.info('Performance monitoring initialized');
}
 
/**
 * Set up database monitoring
 */
function setupDatabaseMonitoring() {
  const logger = getLogger();
 
  // Monitor Supabase connection health
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Periodic health check
    setInterval(async () => {
      try {
        const { createClient } = await import('@/utils/supabase/server');
        const supabase = await createClient();
 
        // Simple query to check connection
        const { error } = await supabase.from('artists').select('count').limit(1);
 
        if (error) {
          logger.error('Database health check failed', error);
        }
      } catch (error) {
        logger.error('Database health check error', error as Error);
      }
    }, 300000); // Every 5 minutes
 
    logger.info('Database monitoring initialized');
  }
}
 
/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown() {
  const logger = getLogger();
 
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
 
    // Close database connections
    // Close server
    // Clean up resources
 
    logger.info('Graceful shutdown completed');
    process.exit(0);
  };
 
  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
 
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught exception', error);
    process.exit(1);
  });
 
  // Handle unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal('Unhandled rejection', new Error(String(reason)), {
      promise: String(promise),
    });
  });
 
  logger.info('Graceful shutdown handlers registered');
}
 
/**
 * Optional: onRequestError hook for catching request errors
 * This is called for every request error in Next.js
 */
export async function onRequestError(
  error: Error,
  request: {
    path: string;
    method: string;
    headers: Headers;
  }
) {
  const logger = getLogger();
 
  logger.error('Request error', error, {
    path: request.path,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
  });
 
  // Send to error tracking service
  if (process.env.SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/nextjs');
 
      Sentry.captureException(error, {
        contexts: {
          request: {
            url: request.path,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
          },
        },
      });
    } catch (sentryError) {
      logger.warn('Failed to send error to Sentry', { error: sentryError });
    }
  }
}