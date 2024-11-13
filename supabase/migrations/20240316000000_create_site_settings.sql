-- Drop existing table if it exists
DROP TABLE IF EXISTS site_settings;

-- Create site_settings table
CREATE TABLE site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contact JSONB NOT NULL DEFAULT '{
        "phone": "(11) 94354-9934",
        "email": "vendasatrautomoveis@gmail.com",
        "whatsapp": "5511943549934"
    }'::jsonb,
    business_hours JSONB NOT NULL DEFAULT '{
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
    }'::jsonb,
    about TEXT NOT NULL DEFAULT 'Veículos novos e seminovos de qualidade comprovada. Há 23 anos no mercado automotivo de Itu/SP, oferecemos carros periciados e com procedência garantida. Entre em contato conosco para mais informações.',
    logo JSONB NOT NULL DEFAULT '{
        "url": null,
        "updatedAt": null
    }'::jsonb,
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

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