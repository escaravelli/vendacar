import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Car, Bike, Truck } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedType, setSelectedType] = useState<string>('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = ['TODOS', ...new Set(vehicles.map(v => v.tipo))];
  const filteredVehicles = selectedType === 'TODOS' 
    ? vehicles 
    : vehicles.filter(v => v.tipo === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOTOS':
        return <Bike className="h-5 w-5" />;
      case 'CAMINHÕES':
        return <Truck className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Veículos
          </h1>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type !== 'TODOS' && getTypeIcon(type)}
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum veículo encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <a
                key={vehicle.id}
                href={`/veiculo/${vehicle.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={vehicle.imagens[0]}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {vehicle.tipo}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <p className="text-gray-600">
                    {vehicle.ano_fab}/{vehicle.ano_mod} - {vehicle.km.toLocaleString()} km
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(vehicle.valor)}
                    </p>
                    <span className="text-sm text-gray-500">{vehicle.cambio}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
}