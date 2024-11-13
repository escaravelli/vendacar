import React, { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, uploadVehicleImage, deleteVehicleImage } from '../../lib/supabase';
import { Vehicle } from '../../types/vehicle';
import { Upload, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { carBrands } from '../../data/carBrands';
import { carColors } from '../../data/carColors';
import { FileUpload } from '../../components/FileUpload';
import { CurrencyInput } from '../../components/CurrencyInput';

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
    if (previewUrls.length === 0 && images.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Delete removed images
      for (const imageUrl of removedImageUrls) {
        await deleteVehicleImage(imageUrl);
      }

      // Start with existing images that weren't removed
      const remainingImages = (initialData?.imagens || []).filter(
        url => !removedImageUrls.includes(url)
      );

      // Upload new images
      const uploadPromises = images.map(image => uploadVehicleImage(image));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const allImages = [...remainingImages, ...uploadedUrls];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Placa
          </label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.placa ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          />
          {errors.placa && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.placa}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <select
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.marca ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          >
            <option value="">Selecione uma marca</option>
            {carBrands.map(brand => (
              <option key={brand.name} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.marca && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.marca}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <select
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.modelo ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
            disabled={!formData.marca}
          >
            <option value="">Selecione um modelo</option>
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          {errors.modelo && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.modelo}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Versão
          </label>
          <input
            type="text"
            name="submodelo"
            value={formData.submodelo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ano Fabricação
          </label>
          <input
            type="number"
            name="ano_fab"
            value={formData.ano_fab}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ano Modelo
          </label>
          <input
            type="number"
            name="ano_mod"
            value={formData.ano_mod}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cor
          </label>
          <select
            name="cor"
            value={formData.cor}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.cor ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          >
            <option value="">Selecione uma cor</option>
            {carColors.map(color => (
              <option key={color.name} value={color.name}>
                {color.name}
              </option>
            ))}
          </select>
          {errors.cor && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cor}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Combustível
          </label>
          <select
            name="combustivel"
            value={formData.combustivel}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.combustivel ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          >
            <option value="">Selecione o combustível</option>
            <option value="Flex">Flex</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Etanol">Etanol</option>
            <option value="Diesel">Diesel</option>
            <option value="GNV">GNV</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido">Híbrido</option>
          </select>
          {errors.combustivel && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.combustivel}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quilometragem
          </label>
          <input
            type="number"
            name="km"
            value={formData.km}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Câmbio
          </label>
          <select
            name="cambio"
            value={formData.cambio}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.cambio ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          >
            <option value="">Selecione o câmbio</option>
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
            <option value="CVT">CVT</option>
            <option value="Automatizado">Automatizado</option>
            <option value="Semi-automático">Semi-automático</option>
          </select>
          {errors.cambio && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.cambio}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.tipo ? 'border-red-300' : 'border-gray-300'
            } focus:ring-primary focus:border-primary`}
          >
            <option value="">Selecione o tipo</option>
            <option value="CARROS">CARROS</option>
            <option value="MOTOS">MOTOS</option>
            <option value="CAMINHÕES">CAMINHÕES</option>
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.tipo}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portas
          </label>
          <select
            name="portas"
            value={formData.portas}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            disabled={formData.tipo === 'MOTOS'}
          >
            <option value="0">Selecione o número de portas</option>
            <option value="2">2 portas</option>
            <option value="3">3 portas</option>
            <option value="4">4 portas</option>
            <option value="5">5 portas</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preço</label>
        <div className="mt-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="priceUponRequest"
              checked={!showPriceInput}
              onChange={(e) => {
                setShowPriceInput(!e.target.checked);
                if (e.target.checked) {
                  setFormData(prev => ({ ...prev, valor: 0 }));
                }
              }}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="priceUponRequest" className="text-sm text-gray-600">
              Sob consulta
            </label>
          </div>
          
          {showPriceInput && (
            <CurrencyInput
              value={formData.valor}
              onChange={(value) => setFormData(prev => ({ ...prev, valor: value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.valor ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          )}
          {errors.valor && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.valor}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Opcionais (separados por vírgula)
        </label>
        <textarea
          name="opcionais"
          value={formData.opcionais}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          name="observacao"
          value={formData.observacao}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          URL do Vídeo (YouTube)
        </label>
        <input
          type="url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens
        </label>
        <FileUpload
          value={previewUrls}
          onChange={setPreviewUrls}
          onFilesChange={setImages}
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

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Salvar
            </>
          )}
        </button>
      </div>
    </form>
  );
}