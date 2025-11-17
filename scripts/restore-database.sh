#!/bin/bash

# ==========================================
# DATABASE RESTORE SCRIPT
# Afromerica Entertainment Platform
# ==========================================

set -e

# Configuration
BACKUP_FILE=$1
DB_NAME="afromerica"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
  echo -e "${RED}Error: Backup file not specified${NC}"
  echo "Usage: $0 <backup_file>"
  exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
  exit 1
fi

# Warning
echo -e "${YELLOW}=================================="
echo "WARNING: This will restore the database"
echo "from backup: $BACKUP_FILE"
echo "=================================="
echo -e "Are you sure? (yes/no)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

echo "=================================="
echo "Database Restore"
echo "Started: $(date)"
echo "=================================="

# Create backup of current state before restore
echo -e "${GREEN}Creating safety backup of current state...${NC}"
SAFETY_BACKUP="/tmp/pre_restore_backup_$(date +%Y%m%d_%H%M%S).dump"
pg_dump -Fc "$DB_NAME" > "$SAFETY_BACKUP"
echo -e "${GREEN}Safety backup created: $SAFETY_BACKUP${NC}"

# Terminate existing connections
echo -e "${GREEN}Terminating existing connections...${NC}"
psql -d postgres -c "
  SELECT pg_terminate_backend(pg_stat_activity.pid)
  FROM pg_stat_activity
  WHERE pg_stat_activity.datname = '$DB_NAME'
    AND pid <> pg_backend_pid();
"

# Drop and recreate database
echo -e "${GREEN}Dropping and recreating database...${NC}"
psql -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
echo -e "${GREEN}Restoring database from backup...${NC}"
if [[ "$BACKUP_FILE" == *.dump ]]; then
  # Custom format backup
  pg_restore -d "$DB_NAME" "$BACKUP_FILE"
else
  # SQL format backup
  if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | psql "$DB_NAME"
  else
    psql "$DB_NAME" < "$BACKUP_FILE"
  fi
fi

# Run post-restore tasks
echo -e "${GREEN}Running post-restore tasks...${NC}"

# Analyze tables
psql "$DB_NAME" -c "ANALYZE;"

# Refresh materialized views
psql "$DB_NAME" -c "SELECT public.refresh_all_materialized_views();" || true

# Verify restore
echo -e "${GREEN}Verifying restore...${NC}"
psql "$DB_NAME" -c "
  SELECT 
    'profiles' as table_name, COUNT(*) as row_count 
  FROM public.profiles
  UNION ALL
  SELECT 'events', COUNT(*) FROM public.events
  UNION ALL
  SELECT 'bookings', COUNT(*) FROM public.bookings
  UNION ALL
  SELECT 'artists', COUNT(*) FROM public.artists;
"

echo "=================================="
echo "Restore completed: $(date)"
echo -e "${YELLOW}Safety backup saved at: $SAFETY_BACKUP${NC}"
echo "=================================="