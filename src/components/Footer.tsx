import React from 'react';
import { Car, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { BusinessHours } from './BusinessHours';

export function Footer() {
  const { settings } = useSiteSettings();

  const contact = settings?.contact || {
    phone: "(11) 94354-9934",
    email: "vendasatrautomoveis@gmail.com",
    whatsapp: "5511943549934"
  };

  const businessHours = settings?.business_hours || {
    weekdays: { open: "09:00", close: "18:00" },
    saturday: { open: "09:00", close: "13:00" },
    sunday: { open: null, close: null }
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">ATR Automóveis</h3>
            </div>
            <p className="mt-4 text-gray-400">
              {settings?.about || 'Veículos novos e seminovos de qualidade comprovada. Há 23 anos no mercado automotivo de Itu/SP, oferecemos carros periciados e com procedência garantida.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Horário de Funcionamento</h4>
            <div className="text-gray-400">
              <BusinessHours hours={businessHours} />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} ATR Automóveis - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}