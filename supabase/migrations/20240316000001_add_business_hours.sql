-- Add business_hours to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS business_hours JSONB NOT NULL DEFAULT '{
    "weekdays": {
        "open": "09:00",
        "close": "18:00"
    },
    "saturday": {
        "open": "09:00",
        "close": "13:00"
    },
    "sunday": {
        "open": null,
        "close": null
    }
}'::jsonb;