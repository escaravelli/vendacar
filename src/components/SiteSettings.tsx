import React, { useState } from 'react';
import { Settings, Loader, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../lib/hooks/useSiteSettings';
import { PatternFormat } from 'react-number-format';
import toast from 'react-hot-toast';

export function SiteSettings() {
  const { settings, loading, error, updateSettings } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      await updateSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleContactChange = (field: string, value: string) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      contact: {
        ...settings.contact,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar configurações
        </h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Site</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações de Contato
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <PatternFormat
                format="(##) ####-####"
                mask="_"
                value={settings.contact.phone}
                onValueChange={(values) => handleContactChange('phone', values.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <PatternFormat
                format="(##) #####-####"
                mask="_"
                value={settings.contact.whatsapp}
                onValueChange={(values) => handleContactChange('whatsapp', values.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}