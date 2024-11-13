export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_archived: boolean;
  source: string;
  vehicle_info?: string;
}