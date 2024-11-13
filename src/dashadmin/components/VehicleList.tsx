import React, { useState } from 'react';
import { Car, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { VehicleForm } from './VehicleForm';
import { useVehicles } from '../../lib/hooks/useVehicles';
import { useVehicleFilters } from '../../lib/hooks/useVehicleFilters';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../utils/format';

export function VehicleList() {
  const { vehicles, loading, error, fetchVehicles, deleteVehicle } = useVehicles();
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortConfig,
    handleSort,
    filteredVehicles,
    vehicleTypes,
    resetFilters
  } = useVehicleFilters(vehicles);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleDeleteClick = async (id: number) => {
    const success = await deleteVehicle(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar veículos"
        message={error}
        onRetry={fetchVehicles}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Veículos</h2>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          Novo Veículo
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {filteredVehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title={searchTerm || filterType !== 'TODOS' 
              ? "Nenhum veículo encontrado com os filtros atuais"
              : "Nenhum veículo cadastrado"}
            action={
              searchTerm || filterType !== 'TODOS'
                ? { label: "Limpar filtros", onClick: resetFilters }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th 
                    onClick={() => handleSort('marca')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    Veículo
                    {sortConfig?.key === 'marca' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('placa')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    Placa
                    {sortConfig?.key === 'placa' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('ano_fab')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    Ano
                    {sortConfig?.key === 'ano_fab' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('tipo')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    Tipo
                    {sortConfig?.key === 'tipo' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => handleSort('valor')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    Valor
                    {sortConfig?.key === 'valor' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={vehicle.imagens[0]}
                          alt=""
                          className="h-12 w-16 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {vehicle.marca} {vehicle.modelo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.submodelo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.ano_fab}/{vehicle.ano_mod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {vehicle.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(vehicle.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowForm(true);
                          }}
                          className="text-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1"
                          title="Editar"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        {showDeleteConfirm === vehicle.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteClick(vehicle.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900 text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(vehicle.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingVehicle(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <VehicleForm
                onSuccess={handleFormSuccess}
                initialData={editingVehicle || undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}