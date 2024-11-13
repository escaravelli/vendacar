import React from 'react';
import { Vehicle } from '../types/vehicle';
import { Calendar, Gauge, Settings, Fuel, Car } from 'lucide-react';

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Ano</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {vehicle.ano_fab}/{vehicle.ano_mod}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Gauge className="h-5 w-5" />
          <span className="text-sm">Quilometragem</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {vehicle.km.toLocaleString()} km
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Settings className="h-5 w-5" />
          <span className="text-sm">Câmbio</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {vehicle.cambio}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Fuel className="h-5 w-5" />
          <span className="text-sm">Combustível</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {vehicle.combustivel}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Car className="h-5 w-5" />
          <span className="text-sm">Cor</span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {vehicle.cor}
        </p>
      </div>

      {vehicle.tipo !== 'MOTOS' && vehicle.portas !== '0' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Car className="h-5 w-5" />
            <span className="text-sm">Portas</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {vehicle.portas} portas
          </p>
        </div>
      )}
    </div>
  );
}