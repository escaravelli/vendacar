import React, { useEffect, useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { VehicleList } from './components/VehicleList';
import { ContactList } from './components/ContactList';
import { SiteSettings } from './components/SiteSettings';
import { Car, LogOut, ExternalLink, MessageSquare, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';

type TabType = 'vehicles' | 'contacts' | 'settings';

function DashboardApp() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-2">
          <Car className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">ATR Automóveis</h1>
        </div>
        <AuthForm onSuccess={() => {}} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ATR Automóveis</h1>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary/5"
              >
                <ExternalLink size={20} />
                Ver Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`${
                activeTab === 'vehicles'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center gap-2`}
            >
              <Car className="h-5 w-5" />
              Veículos
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${
                activeTab === 'contacts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center gap-2`}
            >
              <MessageSquare className="h-5 w-5" />
              Contatos
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium flex items-center gap-2`}
            >
              <Settings className="h-5 w-5" />
              Configurações
            </button>
          </nav>
        </div>

        <ErrorBoundary>
          {activeTab === 'vehicles' && <VehicleList />}
          {activeTab === 'contacts' && <ContactList />}
          {activeTab === 'settings' && <SiteSettings />}
        </ErrorBoundary>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} ATR Automóveis - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DashboardApp;