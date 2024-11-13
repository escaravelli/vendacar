import { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { SettingsUpdatePayload } from '../types/settings';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  phone: z.string().min(8, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido')
});

export function useSettingsForm() {
  const { settings, updateSettings, uploadLogo } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateContact = (data: any) => {
    try {
      contactSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          setErrors(prev => ({
            ...prev,
            [err.path.join('.')]: err.message
          }));
        });
      }
      return false;
    }
  };

  const handleSubmit = async (data: SettingsUpdatePayload) => {
    setErrors({});
    
    if (data.contact && !validateContact(data.contact)) {
      toast.error('Por favor, corrija os erros no formulário');
      return false;
    }

    setSaving(true);
    try {
      await updateSettings(data);
      toast.success('Configurações atualizadas com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar configurações');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    try {
      const url = await uploadLogo(file);
      if (url) {
        toast.success('Logo atualizado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar logo');
    }
  };

  return {
    settings,
    saving,
    errors,
    handleSubmit,
    handleLogoUpload
  };
}