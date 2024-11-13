import React from 'react';
import { Upload, Loader, Image as ImageIcon } from 'lucide-react';
import { useSettingsForm } from '../../hooks/useSettingsForm';

export function LogoSettingsForm() {
  const { settings, handleLogoUpload } = useSettingsForm();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await handleLogoUpload(file);
    } finally {
      setUploading(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {settings.logo.url && (
        <div className="border rounded-lg p-4">
          <img
            src={settings.logo.url}
            alt="Logo atual"
            className="max-h-32 mx-auto"
          />
          <p className="text-sm text-gray-500 text-center mt-2">
            Última atualização: {
              settings.logo.updatedAt
                ? new Date(settings.logo.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Nunca'
            }
          </p>
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
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          {uploading && <Loader className="h-5 w-5 animate-spin text-primary" />}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          PNG, JPG ou SVG (máx. 2MB)
        </p>
      </div>
    </div>
  );
}