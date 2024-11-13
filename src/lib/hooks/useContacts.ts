import { useState, useEffect, useCallback } from 'react';
import { supabase, handleSupabaseError } from '../supabase';
import toast from 'react-hot-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  read: boolean;
  archived: boolean;
}

export type ContactFilter = 'all' | 'unread' | 'archived';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const [filter, setFilter] = useState<ContactFilter>('all');

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      setError(errorMessage);
      toast.error('Erro ao carregar contatos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const setupRealtimeSubscription = useCallback(async () => {
    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = supabase
      .channel('contacts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts'
        },
        async (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setContacts(prev => [payload.new as Contact, ...prev]);
              toast.success('Novo contato recebido!');
              break;
            case 'UPDATE':
              setContacts(prev => 
                prev.map(contact => 
                  contact.id === payload.new.id ? payload.new as Contact : contact
                )
              );
              break;
            case 'DELETE':
              setContacts(prev => 
                prev.filter(contact => contact.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    setSubscription(newSubscription);
  }, [subscription]);

  const toggleReadStatus = async (id: number) => {
    try {
      const contact = contacts.find(c => c.id === id);
      if (!contact) throw new Error('Contato não encontrado');

      const { error } = await supabase
        .from('contacts')
        .update({ read: !contact.read })
        .eq('id', id);

      if (error) throw error;
      toast.success(contact.read ? 'Marcado como não lido' : 'Marcado como lido');
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao atualizar status: ' + errorMessage);
    }
  };

  const toggleArchiveStatus = async (id: number) => {
    try {
      const contact = contacts.find(c => c.id === id);
      if (!contact) throw new Error('Contato não encontrado');

      const { error } = await supabase
        .from('contacts')
        .update({ archived: !contact.archived })
        .eq('id', id);

      if (error) throw error;
      toast.success(contact.archived ? 'Desarquivado' : 'Arquivado');
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao arquivar: ' + errorMessage);
    }
  };

  const deleteContact = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contato excluído com sucesso');
      return true;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao excluir contato: ' + errorMessage);
      return false;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    switch (filter) {
      case 'unread':
        return !contact.read && !contact.archived;
      case 'archived':
        return contact.archived;
      default:
        return !contact.archived;
    }
  });

  useEffect(() => {
    fetchContacts();
    setupRealtimeSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchContacts, setupRealtimeSubscription]);

  return {
    contacts: filteredContacts,
    loading,
    error,
    filter,
    setFilter,
    toggleReadStatus,
    toggleArchiveStatus,
    deleteContact,
    fetchContacts,
  };
}