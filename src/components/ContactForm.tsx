import React, { useState } from 'react';
import { Send, Loader, AlertCircle } from 'lucide-react';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';
import { sendEmail } from '../lib/email';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(14, 'Telefone inválido'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  source: z.string(),
  vehicle_info: z.string().optional()
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  source?: 'general' | 'financing' | 'vehicle_inquiry';
  vehicleInfo?: string;
  initialMessage?: string;
}

export function ContactForm({ source = 'general', vehicleInfo = '', initialMessage = '' }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: initialMessage,
    source,
    vehicle_info: vehicleInfo
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ContactFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const getEmailContent = () => {
    const sourceText = {
      financing: 'Financiamento',
      vehicle_inquiry: `Interesse em Veículo: ${vehicleInfo}`,
      general: 'Contato Geral',
    }[source];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ed3237; margin-bottom: 20px;">Novo Contato - ${sourceText}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Nome:</strong> ${formData.name}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Email:</strong> ${formData.email}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Telefone:</strong> ${formData.phone}
            </td>
          </tr>
          ${vehicleInfo ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Veículo:</strong> ${vehicleInfo}
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Mensagem:</strong><br>
              ${formData.message.replace(/\n/g, '<br>')}
            </td>
          </tr>
        </table>
      </div>
    `;

    const text = `
      Novo Contato - ${sourceText}
      Nome: ${formData.name}
      Email: ${formData.email}
      Telefone: ${formData.phone}
      ${vehicleInfo ? `Veículo: ${vehicleInfo}\n` : ''}
      Mensagem: ${formData.message}
    `;

    return { html, text };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from('contacts').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: formData.source,
        vehicle_info: formData.vehicle_info,
        created_at: new Date().toISOString(),
        is_read: false,
        is_archived: false
      }]);

      if (dbError) throw dbError;

      // Send email notification
      const { html, text } = getEmailContent();
      const emailResult = await sendEmail({
        to: 'vendasatrautomoveis@gmail.com',
        subject: `Novo Contato - ${formData.name}`,
        text,
        html
      });

      if (!emailResult.success) {
        console.error('Email notification failed:', emailResult.error);
        // Don't throw error here - we still want to show success if DB save worked
      }

      toast.success('Mensagem enviada com sucesso!');
      setFormData(prev => ({
        ...prev,
        name: '',
        email: '',
        phone: '',
        message: initialMessage
      }));
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-secondary">Envie uma Mensagem</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <PatternFormat
            format="(##) #####-####"
            mask="_"
            id="phone"
            value={formData.phone}
            onValueChange={(values) => setFormData(prev => ({ ...prev, phone: values.formattedValue }))}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mensagem
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.message ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            disabled={loading}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Enviar Mensagem
            </>
          )}
        </button>
      </form>
    </div>
  );
}