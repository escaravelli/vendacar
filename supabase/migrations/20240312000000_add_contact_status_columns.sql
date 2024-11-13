-- Add missing columns to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Remove old status column if it exists
ALTER TABLE contacts 
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS is_public;

-- Update existing rows
UPDATE contacts 
SET is_read = FALSE, 
    is_archived = FALSE 
WHERE is_read IS NULL 
   OR is_archived IS NULL;