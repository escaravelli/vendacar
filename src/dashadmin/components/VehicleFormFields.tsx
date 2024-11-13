import React from 'react';
import { AlertCircle } from 'lucide-react';
import { carBrands } from '../../data/carBrands';
import { carColors } from '../../data/carColors';

interface VehicleFormFieldsProps {
  formData: any;
  errors: Record<string, string>;
  availableModels: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function VehicleFormFields({ formData, errors, availableModels, handleChange }: VehicleFormFieldsProps) {
  return (
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
  );
}