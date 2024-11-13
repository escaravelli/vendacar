import React from 'react';
import { Phone, Mail, Users, Shield, Award } from 'lucide-react';
import { VehicleGrid } from '../components/VehicleGrid';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Header } from '../components/Header';
import { BusinessHours } from '../components/BusinessHours';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function Landing() {
  const { settings } = useSiteSettings();

  const businessHours = settings?.business_hours || {
    weekdays: { open: "09:00", close: "18:00" },
    saturday: { open: "09:00", close: "13:00" },
    sunday: { open: null, close: null }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              ATR Automóveis
            </h1>
            <p className="text-base sm:text-lg md:text-xl">
              Sua melhor escolha em veículos novos e seminovos em São Paulo
            </p>
          </div>
          <a
            href="#vehicles"
            className="inline-block bg-white text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            Ver Veículos
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Sobre Nós
          </h2>
          <div className="prose prose-invert max-w-none">
            <p>{settings?.about || 'Veículos novos e seminovos de qualidade comprovada. Há 23 anos no mercado automotivo de Itu/SP, oferecemos carros periciados e com procedência garantida.'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Procedência Garantida</h3>
                <p className="text-gray-300">Todos os nossos veículos passam por rigorosa inspeção técnica.</p>
              </div>
              
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Qualidade Comprovada</h3>
                <p className="text-gray-300">Excelência em atendimento e pós-venda.</p>
              </div>
              
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Atendimento Personalizado</h3>
                <p className="text-gray-300">Equipe especializada para melhor atender você.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-secondary">
            Nossos Veículos
          </h2>
          <VehicleGrid />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 bg-secondary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-white">
            Contato
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-secondary">
                  Informações de Contato
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-secondary">{settings?.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-secondary">{settings?.contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-secondary">
                  Horário de Funcionamento
                </h3>
                <BusinessHours hours={businessHours} />
              </div>
            </div>

            <div>
              <ContactForm source="general" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}