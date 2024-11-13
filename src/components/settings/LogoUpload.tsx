import React from 'react';
import { Upload, Loader } from 'lucide-react';

interface LogoUploadProps {
  logo: {
    url: string | null;
    updatedAt: string | null;
  };
  onUpload: (file: File) => Promise<void>;
  uploading?: boolean;
}

export function LogoUpload({ logo, onUpload, uploading = false }: LogoUploadProps) {
  return (
    <div className="space-y-4">
      {logo.url && (
        <div className="border rounded-lg p-4">
          <img
            src={logo.url}
            alt="Logo atual"
            className="max-h-32 mx-auto"
          />
          <p className="text-sm text-gray-500 text-center mt-2">
            Última atualização: {
              logo.updatedAt
                ? new Date(logo.updatedAt).toLocaleDateString('pt-BR', {
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
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