-- ==========================================
-- DATABASE MAINTENANCE SCRIPT
-- Run periodically for optimal performance
-- ==========================================

-- ==========================================
-- SECTION 1: CLEANUP TASKS
-- ==========================================

-- Clean expired OTP codes (older than 24 hours)
SELECT public.clean_expired_otp_codes();

-- Clean old audit logs (keep 90 days)
SELECT public.clean_old_audit_logs(90);

-- Delete old email logs (keep 180 days)
DELETE FROM public.email_logs 
WHERE created_at < NOW() - INTERVAL '180 days';

-- Delete old webhook logs (keep 30 days)
DELETE FROM public.webhook_logs 
WHERE created_at < NOW() - INTERVAL '30 days' AND processed = true;

-- Delete old performance metrics (keep 30 days)
DELETE FROM public.performance_metrics 
WHERE created_at < NOW() - INTERVAL '30 days';

-- ==========================================
-- SECTION 2: DATA INTEGRITY CHECKS
-- ==========================================

-- Check for orphaned booking items
SELECT 'Orphaned booking_items' as issue, COUNT(*) as count
FROM public.booking_items bi
WHERE NOT EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = bi.booking_id);

-- Check for orphaned vote transactions
SELECT 'Orphaned vote_transactions' as issue, COUNT(*) as count
FROM public.vote_transactions vt
WHERE NOT EXISTS (SELECT 1 FROM public.vote_purchases vp WHERE vp.id = vt.purchase_id);

-- Check for bookings with mismatched totals
SELECT 'Bookings with incorrect totals' as issue, COUNT(*) as count
FROM public.bookings b
WHERE b.total_amount != (
  SELECT COALESCE(SUM(total_price), 0)
  FROM public.booking_items
  WHERE booking_id = b.id
);

-- Check for tickets oversold
SELECT 'Oversold ticket types' as issue, COUNT(*) as count
FROM public.ticket_types
WHERE available < 0;

-- Check for duplicate emails in profiles
SELECT 'Duplicate profile emails' as issue, COUNT(*) - COUNT(DISTINCT email) as count
FROM public.profiles;

-- ==========================================
-- SECTION 3: REFRESH MATERIALIZED VIEWS
-- ==========================================

SELECT public.refresh_all_materialized_views();

-- ==========================================
-- SECTION 4: VACUUM AND ANALYZE
-- ==========================================

-- Vacuum analyze high-activity tables
VACUUM ANALYZE public.bookings;
VACUUM ANALYZE public.booking_items;
VACUUM ANALYZE public.vote_transactions;
VACUUM ANALYZE public.showcase_votes;
VACUUM ANALYZE public.email_logs;
VACUUM ANALYZE public.webhook_logs;

-- Analyze all tables to update statistics
ANALYZE;

-- ==========================================
-- SECTION 5: REINDEX (if needed)
-- ==========================================

-- Check for bloated indexes
WITH index_bloat AS (
  SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public'
)
SELECT * FROM index_bloat
WHERE idx_scan = 0 AND pg_relation_size(indexrelid) > 1000000
ORDER BY pg_relation_size(indexrelid) DESC;

-- Reindex specific tables if needed (run during low-traffic periods)
-- REINDEX TABLE CONCURRENTLY public.bookings;
-- REINDEX TABLE CONCURRENTLY public.events;

-- ==========================================
-- SECTION 6: UPDATE STATISTICS
-- ==========================================

-- Recalculate showcase rankings
SELECT public.recalculate_showcase_rankings();

-- ==========================================
-- SECTION 7: PERFORMANCE REPORT
-- ==========================================

-- Database size
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                 pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;

-- Index usage statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC
LIMIT 20;

-- Slow queries (if pg_stat_statements is enabled)
SELECT 
  query,
  calls,
  ROUND(total_exec_time::numeric, 2) as total_time_ms,
  ROUND(mean_exec_time::numeric, 2) as avg_time_ms,
  ROUND((100 * total_exec_time / SUM(total_exec_time) OVER ())::numeric, 2) as percent_total
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- Table bloat estimation
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  ROUND(100 * (pg_total_relation_size(schemaname||'.'||tablename) - 
               pg_relation_size(schemaname||'.'||tablename)) / 
        NULLIF(pg_total_relation_size(schemaname||'.'||tablename), 0), 2) as index_ratio
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT 
  datname,
  count(*) as connections,
  max(state) as max_state
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY datname;

-- ==========================================
-- SECTION 8: CLEANUP COMPLETED
-- ==========================================

SELECT 'Maintenance completed at ' || NOW() || 
       ' - Next run recommended in 24 hours';