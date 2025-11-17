#!/bin/bash

# ==========================================
# DATABASE BACKUP SCRIPT
# Afromerica Entertainment Platform
# ==========================================

set -e  # Exit on error

# Configuration
BACKUP_DIR="/var/backups/afromerica"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="afromerica"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=================================="
echo "Afromerica Database Backup"
echo "Started: $(date)"
echo "=================================="

# Full database backup
echo -e "${GREEN}Creating full database backup...${NC}"
pg_dump -Fc "$DB_NAME" > "$BACKUP_DIR/full_backup_$DATE.dump"

# Schema-only backup
echo -e "${GREEN}Creating schema-only backup...${NC}"
pg_dump --schema-only "$DB_NAME" > "$BACKUP_DIR/schema_backup_$DATE.sql"

# Critical tables backup (for quick restore)
echo -e "${GREEN}Creating critical tables backup...${NC}"
pg_dump -t public.profiles \
        -t public.events \
        -t public.bookings \
        -t public.vote_purchases \
        "$DB_NAME" > "$BACKUP_DIR/critical_tables_$DATE.sql"

# Compress backups
echo -e "${GREEN}Compressing backups...${NC}"
gzip "$BACKUP_DIR/schema_backup_$DATE.sql"
gzip "$BACKUP_DIR/critical_tables_$DATE.sql"

# Calculate sizes
FULL_SIZE=$(du -h "$BACKUP_DIR/full_backup_$DATE.dump" | cut -f1)
SCHEMA_SIZE=$(du -h "$BACKUP_DIR/schema_backup_$DATE.sql.gz" | cut -f1)

echo -e "${GREEN}Full backup size: $FULL_SIZE${NC}"
echo -e "${GREEN}Schema backup size: $SCHEMA_SIZE${NC}"

# Remove old backups
echo -e "${GREEN}Removing backups older than $RETENTION_DAYS days...${NC}"
find "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# List remaining backups
echo -e "${GREEN}Remaining backups:${NC}"
ls -lh "$BACKUP_DIR" | tail -n +2

# Optional: Upload to cloud storage (uncomment and configure)
# echo -e "${GREEN}Uploading to S3...${NC}"
# aws s3 cp "$BACKUP_DIR/full_backup_$DATE.dump" s3://afromerica-backups/

# Optional: Upload to Google Cloud Storage
# gsutil cp "$BACKUP_DIR/full_backup_$DATE.dump" gs://afromerica-backups/

echo "=================================="
echo "Backup completed: $(date)"
echo "=================================="
