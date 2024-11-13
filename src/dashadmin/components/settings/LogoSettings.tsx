import React, { useState } from 'react';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import { Upload, Loader, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export function LogoSettings() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(settings?.logo?.url || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      // Update settings
      await updateSettings({
        logo: {
          url: publicUrl,
          updatedAt: new Date().toISOString()
        }
      });

      toast.success('Logo atualizado com sucesso!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao atualizar logo');
    } finally {
      setUploading(false);
      setFile(null);
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Atual
        </label>
        {preview ? (
          <div className="relative w-64 h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 h-32 bg-gray-100 rounded-lg">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Novo Logo
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
          />
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="-ml-1 mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          PNG, JPG ou SVG (máx. 2MB)
        </p>
      </div>
    </div>
  );
}