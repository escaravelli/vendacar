import { z } from 'zod';

// Phone number format: (99) 9999-9999 or (99) 99999-9999
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

// WhatsApp format: 5511999999999 (13 digits)
const whatsappRegex = /^55\d{2}\d{8,9}$/;

export const contactSchema = z.object({
  phone: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(phoneRegex, 'Formato inválido. Use (99) 9999-9999 ou (99) 99999-9999'),
  
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  
  whatsapp: z.string()
    .min(1, 'WhatsApp é obrigatório')
    .regex(whatsappRegex, 'Formato inválido. Use 5511999999999')
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatWhatsApp(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers.startsWith('55')) {
    return '55' + numbers;
  }
  
  return numbers;
}

export function validateContact(data: ContactFormData) {
  const result = contactSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach(err => {
      if (err.path[0]) {
        errors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}