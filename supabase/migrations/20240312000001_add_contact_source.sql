-- Add source column to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'general';