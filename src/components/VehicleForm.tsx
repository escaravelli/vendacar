import React, { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, uploadVehicleImage, deleteVehicleImage } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { Upload, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { carBrands } from '../data/carBrands';
import { carColors } from '../data/carColors';
import { FileUpload } from './FileUpload';
import { CurrencyInput } from './CurrencyInput';

interface VehicleFormProps {
  onSuccess: () => void;
  initialData?: Vehicle;
}

export function VehicleForm({ onSuccess, initialData }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialData?.imagens || []);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPriceInput, setShowPriceInput] = useState(initialData?.valor !== 0);

  const [formData, setFormData] = useState({
    placa: initialData?.placa || '',
    marca: initialData?.marca || '',
    modelo: initialData?.modelo || '',
    submodelo: initialData?.submodelo || '',
    ano_fab: initialData?.ano_fab || new Date().getFullYear(),
    ano_mod: initialData?.ano_mod || new Date().getFullYear(),
    cor: initialData?.cor || '',
    combustivel: initialData?.combustivel || '',
    km: initialData?.km || 0,
    cambio: initialData?.cambio || '',
    tipo: initialData?.tipo || '',
    portas: initialData?.portas || '0',
    valor: initialData?.valor || 0,
    opcionais: initialData?.opcionais?.join(', ') || '',
    observacao: initialData?.observacao || '',
    video_url: initialData?.video_url || '',
  });

  useEffect(() => {
    if (formData.marca) {
      const brand = carBrands.find(b => b.name === formData.marca);
      setAvailableModels(brand?.models || []);
      if (!brand?.models.includes(formData.modelo)) {
        setFormData(prev => ({ ...prev, modelo: '' }));
      }
    }
  }, [formData.marca]);

  const handleImageChange = (urls: string[]) => {
    setPreviewUrls(urls);
  };

  const handleFilesChange = (files: File[]) => {
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleImageRemove = (index: number) => {
    const removedUrl = previewUrls[index];
    
    // If it's an existing image (not a new upload), add to removedImageUrls
    if (initialData?.imagens?.includes(removedUrl)) {
      setRemovedImageUrls(prev => [...prev, removedUrl]);
    }

    // Remove from preview URLs
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));

    // Remove from new images if it's a new upload
    if (images.length > index) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= previewUrls.length) return;

    const newUrls = [...previewUrls];
    const [movedUrl] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, movedUrl);
    setPreviewUrls(newUrls);

    // Also reorder the new images array if both indices are within its bounds
    if (fromIndex < images.length && toIndex < images.length) {
      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      setImages(newImages);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    }
    if (!formData.marca) {
      newErrors.marca = 'Marca é obrigatória';
    }
    if (!formData.modelo) {
      newErrors.modelo = 'Modelo é obrigatório';
    }
    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }
    if (!formData.cor) {
      newErrors.cor = 'Cor é obrigatória';
    }
    if (!formData.combustivel) {
      newErrors.combustivel = 'Combustível é obrigatório';
    }
    if (!formData.cambio) {
      newErrors.cambio = 'Câmbio é obrigatório';
    }
    if (showPriceInput && formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }
    if (previewUrls.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
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

    setLoading(true);

    try {
      // Delete removed images
      for (const imageUrl of removedImageUrls) {
        await deleteVehicleImage(imageUrl);
      }

      // Start with existing images that weren't removed
      const remainingImages = initialData?.imagens?.filter(
        url => !removedImageUrls.includes(url)
      ) || [];

      // Upload new images
      const uploadPromises = images.map(image => uploadVehicleImage(image));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Combine remaining and new images in the correct order
      const allImages = previewUrls.map(url => {
        // If it's an existing image that wasn't removed
        if (remainingImages.includes(url)) return url;
        // If it's a new image that was just uploaded
        const index = Array.from(images).findIndex(
          (_, i) => URL.createObjectURL(images[i]) === url
        );
        return uploadedUrls[index];
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const vehicleData = {
        placa: formData.placa,
        marca: formData.marca,
        modelo: formData.modelo,
        submodelo: formData.submodelo,
        ano_fab: parseInt(formData.ano_fab.toString()),
        ano_mod: parseInt(formData.ano_mod.toString()),
        cor: formData.cor,
        combustivel: formData.combustivel,
        km: parseInt(formData.km.toString()),
        cambio: formData.cambio,
        tipo: formData.tipo,
        portas: formData.portas,
        valor: showPriceInput ? parseFloat(formData.valor.toString()) : 0,
        opcionais: formData.opcionais.split(',').map(opt => opt.trim()).filter(Boolean),
        observacao: formData.observacao,
        video_url: formData.video_url,
        imagens: allImages,
        user_id: user.id
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Veículo atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert([vehicleData]);

        if (error) throw error;
        toast.success('Veículo cadastrado com sucesso!');
      }

      onSuccess();
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao salvar veículo: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens
        </label>
        <FileUpload
          value={previewUrls}
          onChange={handleImageChange}
          onFilesChange={handleFilesChange}
          maxFiles={10}
          maxSizeInMB={5}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.images}
          </p>
        )}
      </div>

      {/* Rest of the form fields */}
      {/* ... (rest of the form JSX remains the same) ... */}
    </form>
  );
}