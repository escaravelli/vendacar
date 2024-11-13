import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../supabase';
import toast from 'react-hot-toast';

export interface SiteSettings {
  id: number;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  content: {
    aboutUs: string;
    financing: string;
  };
  logo: {
    url: string | null;
    updatedAt: string | null;
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      console.error('Error fetching site settings:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', 1);

      if (error) throw error;
      
      await fetchSettings();
      toast.success('Configurações atualizadas com sucesso!');
      return true;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao atualizar configurações: ' + errorMessage);
      return false;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      await updateSettings({
        logo: {
          url: publicUrl,
          updatedAt: new Date().toISOString()
        }
      });

      return publicUrl;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao fazer upload do logo: ' + errorMessage);
      return null;
    }
  };

  useEffect(() => {
    fetchSettings();

    const subscription = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        fetchSettings
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    uploadLogo,
    refetch: fetchSettings
  };
}