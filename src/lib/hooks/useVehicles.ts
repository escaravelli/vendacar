import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, handleSupabaseError, deleteVehicleImage } from '../supabase';
import { Vehicle } from '../../types/vehicle';
import toast from 'react-hot-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
      setError(null);
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      setError(errorMessage);
      toast.error('Erro ao carregar veículos: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const setupRealtimeSubscription = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Clean up existing subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      const channel = supabase
        .channel(`vehicles_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'vehicles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            switch (payload.eventType) {
              case 'INSERT':
                setVehicles(prev => [payload.new as Vehicle, ...prev]);
                break;
              case 'UPDATE':
                setVehicles(prev => 
                  prev.map(vehicle => 
                    vehicle.id === payload.new.id ? payload.new as Vehicle : vehicle
                  )
                );
                break;
              case 'DELETE':
                setVehicles(prev => 
                  prev.filter(vehicle => vehicle.id !== payload.old.id)
                );
                break;
            }
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }
  }, []);

  const deleteVehicle = async (id: number) => {
    try {
      // First, get the vehicle to access its images
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) {
        throw new Error('Veículo não encontrado');
      }

      // Delete all images from storage
      if (vehicle.imagens && vehicle.imagens.length > 0) {
        const deletePromises = vehicle.imagens.map(imageUrl => deleteVehicleImage(imageUrl));
        await Promise.all(deletePromises);
      }

      // Then delete the vehicle record
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Veículo excluído com sucesso!');
      return true;
    } catch (error) {
      const errorMessage = await handleSupabaseError(error);
      toast.error('Erro ao excluir veículo: ' + errorMessage);
      return false;
    }
  };

  // Initial fetch and subscription setup
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await fetchVehicles();
        await setupRealtimeSubscription();
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [fetchVehicles, setupRealtimeSubscription]);

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await fetchVehicles();
        await setupRealtimeSubscription();
      } else if (event === 'SIGNED_OUT') {
        setVehicles([]);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchVehicles, setupRealtimeSubscription]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    deleteVehicle,
  };
}