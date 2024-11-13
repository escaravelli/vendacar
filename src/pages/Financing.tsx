import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Phone, Mail, MessageCircle, Calculator, Clock, ThumbsUp, Percent } from 'lucide-react';

export default function Financing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Financiamento de Veículos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Realize o sonho do seu carro novo com as melhores condições de financiamento do mercado
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que financiar conosco?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Percent className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Taxas Competitivas</h3>
              <p className="text-gray-600">As melhores taxas do mercado para você</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrada Facilitada</h3>
              <p className="text-gray-600">Condições especiais de entrada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aprovação Rápida</h3>
              <p className="text-gray-600">Processo ágil e descomplicado</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Parcelas Flexíveis</h3>
              <p className="text-gray-600">Planos que cabem no seu bolso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Entre em Contato
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-lg font-medium text-gray-900">
                      (11) 9999-9999
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-900">
                      contato@atrautomoveis.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a
                      href="https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre financiamento."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      (11) 99999-9999
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}