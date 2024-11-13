import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Phone, Mail, MessageCircle, Loader } from 'lucide-react';
import { PatternFormat } from 'react-number-format';
import toast from 'react-hot-toast';

export function ContactSettings() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phone: settings?.contact?.phone || '',
    email: settings?.contact?.email || '',
    whatsapp: settings?.contact?.whatsapp || ''
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (number: string): boolean => {
    const whatsappRegex = /^55\d{10,11}$/;
    return whatsappRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    if (!validateWhatsApp(formData.whatsapp)) {
      toast.error('Número do WhatsApp inválido. Use o formato: 5511999999999');
      return;
    }

    setSaving(true);

    try {
      await updateSettings({
        contact: formData
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <PatternFormat
            format="(##) ####-####"
            mask="_"
            value={formData.phone}
            onValueChange={(values) => setFormData(prev => ({ ...prev, phone: values.value }))}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="(11) 9999-9999"
          />
        </div>
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
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="contato@exemplo.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          WhatsApp
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
          <PatternFormat
            format="55## #####-####"
            mask="_"
            value={formData.whatsapp}
            onValueChange={(values) => setFormData(prev => ({ ...prev, whatsapp: values.value.replace(/\D/g, '') }))}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="5511999999999"
          />
        </div>
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