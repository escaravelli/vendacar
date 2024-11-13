-- Remove content column from site_settings table
ALTER TABLE site_settings
DROP COLUMN IF EXISTS content;