-- Add vehicleInfo column to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS vehicle_info TEXT;