import React, { useEffect, useState, useCallback } from 'react';
import { supabase, handleSupabaseError } from '../../lib/supabase';
import { Loader, Search, Trash2, Mail, Phone, Archive, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_archived: boolean;
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao carregar contatos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('contacts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contacts' 
        }, 
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchContacts]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contato excluído com sucesso!');
      setShowDeleteConfirm(null);
      fetchContacts();
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao excluir contato: ' + errorMessage);
    }
  };

  const toggleReadStatus = async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: !contact.is_read })
        .eq('id', contact.id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao atualizar status: ' + errorMessage);
    }
  };

  const toggleArchiveStatus = async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_archived: !contact.is_archived })
        .eq('id', contact.id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao arquivar contato: ' + errorMessage);
    }
  };

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
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'archived')}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="unread">Não lidos</option>
            <option value="archived">Arquivados</option>
          </select>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum contato encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Mensagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className={`hover:bg-gray-50 ${!contact.is_read ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleReadStatus(contact)}
                        className={`p-1 rounded-full ${
                          contact.is_read ? 'text-green-600' : 'text-gray-400'
                        }`}
                        title={contact.is_read ? 'Marcar como não lido' : 'Marcar como lido'}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${contact.email}`} className="hover:text-primary">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${contact.phone}`} className="hover:text-primary">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleArchiveStatus(contact)}
                          className={`p-1 rounded-full ${
                            contact.is_archived ? 'text-yellow-600' : 'text-gray-400'
                          }`}
                          title={contact.is_archived ? 'Desarquivar' : 'Arquivar'}
                        >
                          <Archive className="h-5 w-5" />
                        </button>
                        {showDeleteConfirm === contact.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(contact.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}