-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contact JSONB NOT NULL DEFAULT '{
        "phone": "(11) 9999-9999",
        "email": "contato@atrautomoveis.com.br",
        "whatsapp": "5511999999999"
    }',
    content JSONB NOT NULL DEFAULT '{
        "aboutUs": "Sobre a ATR Automóveis",
        "financing": "Informações sobre financiamento"
    }',
    logo JSONB NOT NULL DEFAULT '{
        "url": null,
        "updatedAt": null
    }'
);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read access to site_settings" ON site_settings;
    DROP POLICY IF EXISTS "Allow authenticated users to update site_settings" ON site_settings;
    
    CREATE POLICY "Allow public read access to site_settings"
        ON site_settings FOR SELECT
        TO public
        USING (true);

    CREATE POLICY "Allow authenticated users to update site_settings"
        ON site_settings FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);
END $$;

-- Insert initial record
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for site assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site assets
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public to read site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to update site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to delete site assets" ON storage.objects;

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
END $$;