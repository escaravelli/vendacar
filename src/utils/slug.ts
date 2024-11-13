import { Vehicle } from '../types/vehicle';

export function generateSlug(vehicle: Vehicle): string {
  const parts = [
    vehicle.marca,
    vehicle.modelo,
    vehicle.submodelo,
    `${vehicle.ano_fab}`,
    vehicle.cor
  ].filter(Boolean);

  return parts
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}