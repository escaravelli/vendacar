-- Drop existing table and related objects if they exist
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
DROP TABLE IF EXISTS site_settings CASCADE;

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
        "aboutUs": "<p>A ATR Automóveis é referência em qualidade e procedência no mercado automotivo. Com anos de experiência, oferecemos os melhores veículos novos e seminovos, garantindo total satisfação aos nossos clientes.</p><p>Nossa equipe altamente qualificada está pronta para auxiliar você na escolha do veículo ideal, com as melhores condições do mercado.</p>",
        "financing": "<p>Facilitamos a realização do seu sonho com as melhores condições de financiamento do mercado. Trabalhamos com os principais bancos e financeiras, oferecendo:</p><ul><li>Taxas competitivas</li><li>Entrada facilitada</li><li>Parcelas que cabem no seu bolso</li><li>Aprovação rápida</li></ul><p>Entre em contato conosco e simule seu financiamento!</p>"
    }'::jsonb,
    logo JSONB NOT NULL DEFAULT '{
        "url": null,
        "updatedAt": null
    }'::jsonb,
    CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- Create trigger for updated_at
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