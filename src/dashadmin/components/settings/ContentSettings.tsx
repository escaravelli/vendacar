import React, { useState } from 'react';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { RichTextEditor } from '../../../components/RichTextEditor';

export function ContentSettings() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    aboutUs: settings?.content?.aboutUs || '',
    financing: settings?.content?.financing || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateSettings({
        content: formData
      });
      toast.success('Conteúdo atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar conteúdo');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sobre Nós
        </label>
        <RichTextEditor
          content={formData.aboutUs}
          onChange={(content) => setFormData(prev => ({ ...prev, aboutUs: content }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Financiamento
        </label>
        <RichTextEditor
          content={formData.financing}
          onChange={(content) => setFormData(prev => ({ ...prev, financing: content }))}
        />
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