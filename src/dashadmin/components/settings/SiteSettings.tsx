import React, { useState } from 'react';
import { Settings, Upload, Loader, Phone, Mail, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../../../lib/hooks/useSiteSettings';
import { RichTextEditor } from '../../../components/RichTextEditor';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../../components/ui/ErrorMessage';

export function SiteSettings() {
  const { settings, loading, error, updateSettings, uploadLogo, refetch } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadLogo(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings = {
      contact: {
        phone: formData.get('phone'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp')
      },
      content: {
        aboutUs: formData.get('aboutUs'),
        financing: formData.get('financing')
      }
    };

    await updateSettings(newSettings);
    setSaving(false);
  };

  if (loading) {
    return <LoadingSpinner />;
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

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Site</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
          <div className="space-y-4">
            {settings.logo.url && (
              <div className="w-48">
                <img
                  src={settings.logo.url}
                  alt="Logo atual"
                  className="w-full h-auto"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload novo logo
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
                  <Upload className="h-5 w-5" />
                  Selecionar arquivo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </label>
                {uploading && <Loader className="h-5 w-5 animate-spin text-primary" />}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="phone"
                  defaultValue={settings.contact.phone}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  name="email"
                  defaultValue={settings.contact.email}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={settings.contact.whatsapp}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                <MessageSquare className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conteúdo</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sobre Nós
              </label>
              <RichTextEditor
                content={settings.content.aboutUs}
                onChange={(content) => {
                  const textarea = document.querySelector('textarea[name="aboutUs"]');
                  if (textarea) {
                    (textarea as HTMLTextAreaElement).value = content;
                  }
                }}
              />
              <textarea
                name="aboutUs"
                defaultValue={settings.content.aboutUs}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Página de Financiamento
              </label>
              <RichTextEditor
                content={settings.content.financing}
                onChange={(content) => {
                  const textarea = document.querySelector('textarea[name="financing"]');
                  if (textarea) {
                    (textarea as HTMLTextAreaElement).value = content;
                  }
                }}
              />
              <textarea
                name="financing"
                defaultValue={settings.content.financing}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                Salvando...
              </>
            ) : (
              <>
                <Settings className="h-5 w-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}