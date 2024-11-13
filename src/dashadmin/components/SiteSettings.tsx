import React from 'react';
import { Settings, Loader } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { ContactForm } from '../../components/settings/ContactForm';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

export function SiteSettings() {
  const { settings, loading, error, updateSettings, refetch } = useSiteSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar configurações"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!settings) return null;

  const handleContactSubmit = async (contactData: typeof settings.contact) => {
    await updateSettings({ contact: contactData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Site</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
          <ContactForm
            initialData={settings.contact}
            onSubmit={handleContactSubmit}
          />
        </div>
      </div>
    </div>
  );
}