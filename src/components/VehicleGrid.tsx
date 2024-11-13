import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { Car, Bike, Truck, Loader } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { generateSlug } from '../utils/slug';
import toast from 'react-hot-toast';

export function VehicleGrid() {
  const [vehicles, setVehicles] = useState<Record<string, Vehicle[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const grouped = (data || []).reduce((acc, vehicle) => {
        if (!acc[vehicle.tipo]) {
          acc[vehicle.tipo] = [];
        }
        acc[vehicle.tipo].push(vehicle);
        return acc;
      }, {} as Record<string, Vehicle[]>);

      setVehicles(grouped);
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOTOS':
        return <Bike className="h-6 w-6" />;
      case 'CAMINHÕES':
        return <Truck className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <span className="block text-lg font-semibold">Erro ao carregar veículos</span>
          <span className="text-sm">{error}</span>
        </div>
        <button
          onClick={fetchVehicles}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (Object.keys(vehicles).length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum veículo disponível no momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {Object.entries(vehicles).map(([type, typeVehicles]) => (
        <div key={type}>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
              <div className="text-primary">{getTypeIcon(type)}</div>
            </div>
            <h3 className="text-2xl font-bold text-secondary">{type}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                to={`/veiculo/${vehicle.id}/${generateSlug(vehicle)}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={vehicle.imagens[0]}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-secondary">
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <p className="text-gray-600">
                    {vehicle.ano_fab}/{vehicle.ano_mod} - {vehicle.km.toLocaleString()} km
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className={`text-lg font-bold ${vehicle.valor === 0 ? 'text-gray-600' : 'text-primary'}`}>
                      {formatCurrency(vehicle.valor)}
                    </p>
                    <span className="text-sm text-gray-500">{vehicle.cambio}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}