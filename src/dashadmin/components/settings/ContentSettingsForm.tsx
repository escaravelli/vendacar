import React from 'react';
import { Loader } from 'lucide-react';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { RichTextEditor } from '../../../components/RichTextEditor';
import { SiteContent } from '../../types/settings';

export function ContentSettingsForm() {
  const { settings, saving, errors, handleSubmit } = useSettingsForm();
  const [content, setContent] = React.useState<SiteContent>({
    aboutUs: settings?.content.aboutUs || '',
    financing: settings?.content.financing || ''
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit('content', { content });
  };

  if (!settings) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sobre Nós
        </label>
        <RichTextEditor
          content={content.aboutUs}
          onChange={(value) => setContent(prev => ({ ...prev, aboutUs: value }))}
        />
        {errors.aboutUs && (
          <p className="mt-1 text-sm text-red-600">{errors.aboutUs}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Financiamento
        </label>
        <RichTextEditor
          content={content.financing}
          onChange={(value) => setContent(prev => ({ ...prev, financing: value }))}
        />
        {errors.financing && (
          <p className="mt-1 text-sm text-red-600">{errors.financing}</p>
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