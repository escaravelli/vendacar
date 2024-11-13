import React, { useEffect, useState } from 'react';
import { supabase, handleSupabaseError, deleteVehicleImage } from '../lib/supabase';
import { Vehicle } from '../types/vehicle';
import { Pencil, Trash2, Plus, Loader, Car, Search, AlertCircle } from 'lucide-react';
import { VehicleForm } from './VehicleForm';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/format';

// Rest of the component remains the same until handleDelete function

const handleDelete = async (id: number) => {
  try {
    // First, get the vehicle to access its images
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle?.imagens) {
      // Delete all images from storage
      for (const imageUrl of vehicle.imagens) {
        await deleteVehicleImage(imageUrl);
      }
    }

    // Then delete the vehicle record
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    toast.success('Veículo excluído com sucesso!');
    setShowDeleteConfirm(null);
    fetchVehicles();
  } catch (error) {
    const errorMessage = await handleSupabaseError(error);
    toast.error('Erro ao excluir veículo: ' + errorMessage);
  }
};

// Rest of the component remains exactly the same