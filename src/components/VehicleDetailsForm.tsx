import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { supabase } from '../lib/supabase';
import { Car, Loader, AlertCircle } from 'lucide-react';
import { carBrands } from '../data/carBrands';
import { carColors } from '../data/carColors';
import { CurrencyInput } from './CurrencyInput';
import toast from 'react-hot-toast';

interface VehicleDetailsFormProps {
  initialData?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleDetailsForm({ initialData, onSuccess, onCancel }: VehicleDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableModels, setAvailableModels] = useState<string[]>(() => {
    if (initialData?.marca) {
      const brand = carBrands.find(b => b.name === initialData.marca);
      return brand?.models || [];
    }
    return [];
  });

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
    if (formData.valor < 0) {
      newErrors.valor = 'Valor deve ser maior ou igual a zero';
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
        valor: parseFloat(formData.valor.toString()),
        opcionais: formData.opcionais.split(',').map(opt => opt.trim()).filter(Boolean),
        observacao: formData.observacao,
        video_url: formData.video_url,
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
      console.error('Error saving vehicle:', error);
      toast.error('Erro ao salvar veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (marca: string) => {
    setFormData(prev => ({ ...prev, marca, modelo: '' }));
    const brand = carBrands.find(b => b.name === marca);
    setAvailableModels(brand?.models || []);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Car className="h-6 w-6" />
        <h2 className="text-xl font-semibold">
          {initialData ? 'Editar Veículo' : 'Novo Veículo'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Placa
          </label>
          <input
            type="text"
            value={formData.placa}
            onChange={(e) => setFormData(prev => ({ ...prev, placa: e.target.value }))}
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
            value={formData.marca}
            onChange={(e) => handleBrandChange(e.target.value)}
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
            value={formData.modelo}
            onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
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
            value={formData.submodelo}
            onChange={(e) => setFormData(prev => ({ ...prev, submodelo: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ano Fabricação
          </label>
          <input
            type="number"
            value={formData.ano_fab}
            onChange={(e) => setFormData(prev => ({ ...prev, ano_fab: parseInt(e.target.value) }))}
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
            value={formData.ano_mod}
            onChange={(e) => setFormData(prev => ({ ...prev, ano_mod: parseInt(e.target.value) }))}
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
            value={formData.cor}
            onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
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
            value={formData.combustivel}
            onChange={(e) => setFormData(prev => ({ ...prev, combustivel: e.target.value }))}
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
            value={formData.km}
            onChange={(e) => setFormData(prev => ({ ...prev, km: parseInt(e.target.value) }))}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Câmbio
          </label>
          <select
            value={formData.cambio}
            onChange={(e) => setFormData(prev => ({ ...prev, cambio: e.target.value }))}
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
            value={formData.tipo}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
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
            value={formData.portas}
            onChange={(e) => setFormData(prev => ({ ...prev, portas: e.target.value }))}
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
        <label className="block text-sm font-medium text-gray-700">
          Valor
        </label>
        <CurrencyInput
          value={formData.valor}
          onChange={(value) => setFormData(prev => ({ ...prev, valor: value }))}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.valor ? 'border-red-300' : 'border-gray-300'
          } focus:ring-primary focus:border-primary`}
        />
        {errors.valor && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.valor}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Opcionais (separados por vírgula)
        </label>
        <textarea
          value={formData.opcionais}
          onChange={(e) => setFormData(prev => ({ ...prev, opcionais: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          value={formData.observacao}
          onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
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
          value={formData.video_url}
          onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
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
            'Salvar'
          )}
        </button>
      </div>
    </form>
  );
}</content>