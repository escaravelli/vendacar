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
    content JSONB NOT NULL DEFAULT '{
        "aboutUs": "Sobre a ATR Automóveis",
        "financing": "Informações sobre financiamento"
    }'::jsonb,
    logo JSONB NOT NULL DEFAULT '{
        "url": null,
        "updatedAt": null
    }'::jsonb,
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

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

-- Create storage bucket for site assets
DO $$ 
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('site-assets', 'site-assets', true)
    ON CONFLICT (id) DO NOTHING;

    -- Create storage policies
    CREATE POLICY "Allow public to read site assets"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'site-assets');

    CREATE POLICY "Allow authenticated users to manage site assets"
        ON storage.objects FOR ALL
        TO authenticated
        USING (bucket_id = 'site-assets')
        WITH CHECK (bucket_id = 'site-assets');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;