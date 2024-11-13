import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../../lib/supabase';
import { Contact } from '../types/contact';
import toast from 'react-hot-toast';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setError(null);
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
    };

    fetchContacts();

    const subscription = supabase
      .channel('contacts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contacts' 
        }, 
        fetchContacts
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { contacts, loading, error };
}