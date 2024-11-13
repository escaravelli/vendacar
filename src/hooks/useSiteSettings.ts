import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types/siteSettings';
import toast from 'react-hot-toast';

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
      console.error('Error fetching site settings:', error);
      setError(error.message);
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
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações: ' + error.message);
      return false;
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
    refetch: fetchSettings
  };
}