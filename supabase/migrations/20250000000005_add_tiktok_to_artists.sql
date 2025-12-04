-- Add TikTok column to artists table
-- This migration adds the missing tiktok field to the artists table

ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS tiktok TEXT;

COMMENT ON COLUMN public.artists.tiktok IS 'TikTok profile URL or handle for the artist';
