import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';
import { ContactFilters } from './ContactFilters';
import { ContactTable } from './ContactTable';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export function ContactList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const { contacts, loading, error } = useContacts();

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);

    const matchesFilter = 
      filter === 'all' ? !contact.is_archived :
      filter === 'unread' ? !contact.is_read && !contact.is_archived :
      filter === 'archived' ? contact.is_archived :
      true;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <EmptyState icon={Mail} message={error} />;
  }

  return (
    <div className="space-y-6">
      <ContactFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
      />

      {filteredContacts.length === 0 ? (
        <EmptyState
          icon={Mail}
          message="Nenhum contato encontrado"
          description={searchTerm || filter !== 'all' ? 'Tente ajustar os filtros' : undefined}
        />
      ) : (
        <ContactTable contacts={filteredContacts} />
      )}
    </div>
  );
}