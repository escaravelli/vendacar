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
        "aboutUs": "<p>A ATR Automóveis é referência em qualidade e procedência na venda de veículos novos e seminovos em São Paulo.</p><p>Com mais de 15 anos de experiência no mercado automotivo, nossa equipe está preparada para oferecer o melhor atendimento e as melhores condições para você realizar o sonho do seu carro novo.</p>",
        "financing": "<p>Na ATR Automóveis, facilitamos a realização do seu sonho com as melhores condições de financiamento do mercado.</p><p>Trabalhamos com os principais bancos e financeiras, garantindo taxas competitivas e planos que cabem no seu bolso.</p>"
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

-- Create storage bucket for site assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site assets
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow public to read site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to upload site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to update site assets" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated users to delete site assets" ON storage.objects;

    -- Create new policies
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