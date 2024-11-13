export interface SiteContact {
  phone: string;
  email: string;
  whatsapp: string;
}

export interface SiteLogo {
  url: string | null;
  updatedAt: string | null;
}

export interface SiteSettings {
  id: number;
  contact: SiteContact;
  logo: SiteLogo;
  created_at: string;
  updated_at: string;
}

export type SettingsUpdatePayload = Partial<{
  contact: Partial<SiteContact>;
  logo: Partial<SiteLogo>;
}>;