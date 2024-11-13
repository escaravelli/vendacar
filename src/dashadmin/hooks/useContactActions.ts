import { useCallback } from 'react';
import { supabase, handleSupabaseError } from '../../lib/supabase';
import { Contact } from '../types/contact';
import toast from 'react-hot-toast';

export function useContactActions() {
  const toggleReadStatus = useCallback(async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: !contact.is_read })
        .eq('id', contact.id);

      if (error) throw error;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao atualizar status: ' + errorMessage);
    }
  }, []);

  const toggleArchiveStatus = useCallback(async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_archived: !contact.is_archived })
        .eq('id', contact.id);

      if (error) throw error;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao arquivar contato: ' + errorMessage);
    }
  }, []);

  const deleteContact = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contato excluído com sucesso!');
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao excluir contato: ' + errorMessage);
    }
  }, []);

  return {
    toggleReadStatus,
    toggleArchiveStatus,
    deleteContact
  };
}