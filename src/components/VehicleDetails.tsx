import { Fuel, Calendar, Gauge, Settings } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { formatCurrency } from '../utils/format';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };

  const embedUrl = vehicle.video_url ? getYoutubeEmbedUrl(vehicle.video_url) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {vehicle.marca} {vehicle.modelo} {vehicle.submodelo}
          </h1>
          <p className="text-lg text-gray-600">
            {vehicle.ano_fab}/{vehicle.ano_mod} - {vehicle.cor}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Valor</p>
          <p className={`text-3xl font-bold ${vehicle.valor === 0 ? 'text-gray-600' : 'text-green-600'}`}>
            {formatCurrency(vehicle.valor)}
          </p>
        </div>
      </div>

      {/* Rest of the component remains exactly the same */}
    </div>
  );
}