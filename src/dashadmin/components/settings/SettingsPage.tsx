import React from 'react';
import { Settings } from 'lucide-react';
import { ContactSettingsForm } from './ContactSettingsForm';
import { LogoSettingsForm } from './LogoSettingsForm';
import { ErrorBoundary } from '../ErrorBoundary';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Site</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
            <ContactSettingsForm />
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Logo do Site</h3>
            <LogoSettingsForm />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}