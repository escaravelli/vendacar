import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export function FileUpload({
  value = [],
  onChange,
  onFilesChange,
  maxFiles = 10,
  maxSizeInMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    Array.from(files).forEach(file => {
      if (!acceptedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Tipo de arquivo não suportado. Use apenas ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`);
        return;
      }

      if (file.size > maxSizeInBytes) {
        newErrors.push(`${file.name}: Arquivo muito grande. Máximo permitido: ${maxSizeInMB}MB`);
        return;
      }

      validFiles.push(file);
    });

    if (value.length + validFiles.length > maxFiles) {
      newErrors.push(`Máximo de ${maxFiles} arquivos permitidos`);
      return { valid: [], errors: newErrors };
    }

    return { valid: validFiles, errors: newErrors };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const { valid, errors } = validateFiles(Array.from(files));
    setErrors(errors);

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    if (valid.length > 0) {
      onFilesChange(valid);
      const newPreviewUrls = valid.map(file => URL.createObjectURL(file));
      onChange([...value, ...newPreviewUrls]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    // Create new arrays without the removed item
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);

    // If there are no images left, clear any errors
    if (newUrls.length === 0) {
      setErrors([]);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    
    const newUrls = [...value];
    const [movedItem] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, movedItem);
    onChange(newUrls);
  };

  const setAsMain = (index: number) => {
    if (index === 0) return; // Already main photo
    
    const newUrls = [...value];
    const [selectedImage] = newUrls.splice(index, 1);
    newUrls.unshift(selectedImage); // Add to beginning of array
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary hover:text-primary-dark font-medium focus:outline-none focus:underline"
            >
              Selecione arquivos
            </button>
            <p className="mt-1 text-sm text-gray-500">
              ou arraste e solte aqui
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {acceptedTypes.map(type => type.split('/')[1]).join(', ')} • Máximo {maxSizeInMB}MB • Até {maxFiles} arquivos
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erros no upload de arquivos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            A primeira imagem será a imagem principal do veículo
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className={`h-24 w-full object-cover rounded-lg cursor-pointer transition-all ${
                    index === 0 ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  onClick={() => setAsMain(index)}
                  title={index === 0 ? 'Imagem principal' : 'Clique para definir como principal'}
                />
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    disabled={index === value.length - 1}
                    className="p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-primary text-white px-2 py-1 rounded-full">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}