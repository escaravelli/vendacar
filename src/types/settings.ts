export interface BusinessHours {
  weekdays: {
    open: string | null;
    close: string | null;
  };
  saturday: {
    open: string | null;
    close: string | null;
  };
  sunday: {
    open: string | null;
    close: string | null;
  };
}

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
  business_hours: BusinessHours;
  about: string;
  logo: SiteLogo;
  created_at: string;
  updated_at: string;
}

export type SettingsUpdatePayload = Partial<{
  contact: Partial<SiteContact>;
  business_hours: Partial<BusinessHours>;
  about: string;
  logo: Partial<SiteLogo>;
}>;