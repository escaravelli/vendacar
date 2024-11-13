import React from 'react';
import { Mail, Search } from 'lucide-react';

interface ContactFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: 'all' | 'unread' | 'archived';
  onFilterChange: (value: 'all' | 'unread' | 'archived') => void;
}

export function ContactFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange
}: ContactFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Mail className="h-8 w-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Contatos</h2>
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as 'all' | 'unread' | 'archived')}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="all">Todos</option>
          <option value="unread">Não lidos</option>
          <option value="archived">Arquivados</option>
        </select>
      </div>
    </div>
  );
}