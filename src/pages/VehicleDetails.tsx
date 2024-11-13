import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { ImageGallery } from '../components/ImageGallery';
import { VehicleSpecs } from '../components/VehicleSpecs';
import { ContactForm } from '../components/ContactForm';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Footer } from '../components/Footer';
import { Loader, ChevronLeft, Share2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export function VehicleDetailsPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${vehicle?.marca} ${vehicle?.modelo}`,
        text: `Confira este ${vehicle?.marca} ${vehicle?.modelo} ${vehicle?.ano_fab}/${vehicle?.ano_mod}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getInitialMessage = (vehicle: Vehicle): string => {
    return `Olá! Tenho interesse no veículo:

${vehicle.marca} ${vehicle.modelo} ${vehicle.submodelo || ''}
Ano: ${vehicle.ano_fab}/${vehicle.ano_mod}
Cor: ${vehicle.cor}
Quilometragem: ${vehicle.km.toLocaleString()} km
Câmbio: ${vehicle.cambio}
Combustível: ${vehicle.combustivel}
Valor: ${formatCurrency(vehicle.valor)}

Gostaria de mais informações sobre este veículo.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Veículo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery and Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <ImageGallery images={vehicle.imagens} autoSlideInterval={6000} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {vehicle.marca} {vehicle.modelo}
                  </h1>
                  {vehicle.submodelo && (
                    <p className="text-lg sm:text-xl text-gray-600">{vehicle.submodelo}</p>
                  )}
                  <p className="text-base sm:text-lg text-gray-600 mt-1">
                    {vehicle.ano_fab}/{vehicle.ano_mod} - {vehicle.km.toLocaleString()} km
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                    vehicle.valor === 0 ? 'text-gray-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(vehicle.valor)}
                  </p>
                </div>
              </div>

              <VehicleSpecs vehicle={vehicle} />

              {vehicle.opcionais.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Opcionais</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vehicle.opcionais.map((opcional, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-600"
                      >
                        {opcional}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vehicle.observacao && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Observações</h2>
                  <p className="text-gray-600 whitespace-pre-line text-base">{vehicle.observacao}</p>
                </div>
              )}

              {vehicle.video_url && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Vídeo</h2>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${vehicle.video_url.split('v=')[1]}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Interessado?</h2>
              <p className="text-gray-600 mb-4">
                Entre em contato conosco para mais informações sobre este veículo.
              </p>
              <a
                href={`https://wa.me/5511943549934?text=${encodeURIComponent(getInitialMessage(vehicle))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Conversar no WhatsApp
              </a>
            </div>
            
            <ContactForm 
              source="vehicle_inquiry" 
              vehicleInfo={`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano_fab}/${vehicle.ano_mod}`}
              initialMessage={getInitialMessage(vehicle)}
            />
          </div>
        </div>
      </div>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}