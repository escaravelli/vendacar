import { useState, useMemo } from 'react';
import { Vehicle } from '../../types/vehicle';

interface SortConfig {
  key: keyof Vehicle;
  direction: 'asc' | 'desc';
}

export function useVehicleFilters(vehicles: Vehicle[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('TODOS');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const vehicleTypes = useMemo(() => {
    const types = new Set(vehicles.map(v => v.tipo));
    return ['TODOS', ...Array.from(types)];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Apply type filtering
    if (filterType !== 'TODOS') {
      result = result.filter(vehicle => vehicle.tipo === filterType);
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(vehicle => 
        vehicle.marca.toLowerCase().includes(search) ||
        vehicle.modelo.toLowerCase().includes(search) ||
        vehicle.placa.toLowerCase().includes(search) ||
        vehicle.submodelo?.toLowerCase().includes(search)
      );
    }
    
    return result;
  }, [vehicles, searchTerm, filterType, sortConfig]);

  const handleSort = (key: keyof Vehicle) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('TODOS');
    setSortConfig(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortConfig,
    handleSort,
    filteredVehicles,
    vehicleTypes,
    resetFilters,
  };
}