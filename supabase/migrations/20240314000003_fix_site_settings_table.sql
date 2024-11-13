-- Drop existing table if it exists
DROP TABLE IF EXISTS site_settings;

-- Create site_settings table
CREATE TABLE site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contact JSONB NOT NULL DEFAULT '{
        "phone": "(11) 9999-9999",
        "email": "contato@atrautomoveis.com.br",
        "whatsapp": "5511999999999"
    }'::jsonb,
    logo JSONB NOT NULL DEFAULT '{
        "url": null,
        "updatedAt": null
    }'::jsonb,
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update site_settings" ON site_settings;

-- Create policies
CREATE POLICY "Allow public read access to site_settings"
    ON site_settings FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to update site_settings"
    ON site_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial record
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public to read site assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload site assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update site assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete site assets" ON storage.objects;

-- Create storage policies
CREATE POLICY "Allow public to read site assets"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'site-assets');

CREATE POLICY "Allow authenticated users to upload site assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Allow authenticated users to update site assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'site-assets');

CREATE POLICY "Allow authenticated users to delete site assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'site-assets');