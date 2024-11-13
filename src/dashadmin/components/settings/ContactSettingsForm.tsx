import React from 'react';
import { Phone, Mail, MessageCircle, Loader } from 'lucide-react';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { SiteContact } from '../../types/settings';

export function ContactSettingsForm() {
  const { settings, saving, errors, handleSubmit } = useSettingsForm();
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contact: Partial<SiteContact> = {
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string
    };

    await handleSubmit({ contact });
  };

  if (!settings) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            defaultValue={settings.contact.phone}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="(11) 9999-9999"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            defaultValue={settings.contact.email}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="contato@exemplo.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="whatsapp"
            defaultValue={settings.contact.whatsapp}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="5511999999999"
          />
        </div>
        {errors.whatsapp && (
          <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Formato: 5511999999999 (código do país + DDD + número)
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </button>
      </div>
    </form>
  );
}