import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Loader, AlertCircle } from 'lucide-react';
import { PatternFormat } from 'react-number-format';
import { SiteSettings } from '../../types/siteSettings';
import { formatWhatsAppNumber, validateWhatsAppNumber } from '../../utils/phone';
import toast from 'react-hot-toast';

interface ContactFormProps {
  initialData: SiteSettings['contact'];
  onSubmit: (data: SiteSettings['contact']) => Promise<void>;
}

export function ContactForm({ initialData, onSubmit }: ContactFormProps) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialData);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate phone
    if (!formData.phone.match(/^\(\d{2}\) \d{4,5}-\d{4}$/)) {
      newErrors.phone = 'Telefone inválido. Use o formato (11) 99999-9999';
    }

    // Validate email
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido';
    }

    // Validate WhatsApp
    if (!validateWhatsAppNumber(formData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp inválido. Use o formato 5511999999999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        whatsapp: formatWhatsAppNumber(formData.whatsapp)
      });
      toast.success('Informações de contato atualizadas!');
    } catch (error) {
      toast.error('Erro ao atualizar informações de contato');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <PatternFormat
            format="(##) #####-####"
            mask="_"
            value={formData.phone}
            onValueChange={(values) => {
              setFormData(prev => ({ ...prev, phone: values.formattedValue }));
              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
            }}
            className={`block w-full pl-10 sm:text-sm rounded-md ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            placeholder="(11) 99999-9999"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.phone}
          </p>
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
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }));
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            className={`block w-full pl-10 sm:text-sm rounded-md ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            placeholder="contato@exemplo.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.email}
          </p>
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
          <PatternFormat
            format="55## #####-####"
            mask="_"
            value={formData.whatsapp}
            onValueChange={(values) => {
              setFormData(prev => ({ ...prev, whatsapp: values.value.replace(/\D/g, '') }));
              if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: '' }));
            }}
            className={`block w-full pl-10 sm:text-sm rounded-md ${
              errors.whatsapp ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            placeholder="5511999999999"
          />
        </div>
        {errors.whatsapp ? (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.whatsapp}
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            Formato: 5511999999999 (código do país + DDD + número)
          </p>
        )}
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