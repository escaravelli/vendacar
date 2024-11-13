import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ezxjvzqyegpefbqtpgjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6eGp2enF5ZWdwZWZicXRwZ2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NDI5MTAsImV4cCI6MjA0NjIxODkxMH0.kvjf_X2-f9XpHQp0I0hdnFfvVjZq0nyrvs4qF45eY-8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export async function handleSupabaseError(error: any): Promise<string> {
  if (error?.message?.includes('invalid_mime_type')) {
    return 'Tipo de arquivo não suportado. Use apenas imagens JPG, PNG ou WebP.';
  }

  if (error?.message?.includes('JWT expired')) {
    await supabase.auth.signOut();
    window.location.href = '/';
    return 'Sua sessão expirou. Por favor, faça login novamente.';
  }
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Erro de conexão. Por favor, verifique sua internet e tente novamente.';
  }

  if (error?.message?.includes('row-level security')) {
    return 'Você não tem permissão para realizar esta operação.';
  }

  return error?.message || 'Ocorreu um erro inesperado. Tente novamente.';
}

export async function uploadVehicleImage(file: File): Promise<string> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploadatr')
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('uploadatr')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteVehicleImage(imageUrl: string): Promise<void> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const urlParts = imageUrl.split('/uploadatr/');
    if (urlParts.length !== 2) {
      throw new Error('URL inválida');
    }
    
    const path = urlParts[1];
    
    const { error } = await supabase.storage
      .from('uploadatr')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Initialize site settings table
export async function initializeSiteSettings() {
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert([
        {
          id: 1,
          contact: {
            phone: "(11) 94354-9934",
            email: "vendasatrautomoveis@gmail.com",
            whatsapp: "5511943549934"
          },
          business_hours: {
            weekdays: {
              open: "09:00",
              close: "18:00"
            },
            saturday: {
              open: "09:00",
              close: "13:00"
            },
            sunday: {
              open: null,
              close: null
            }
          },
          about: "Veículos novos e seminovos de qualidade comprovada. Há 23 anos no mercado automotivo de Itu/SP, oferecemos carros periciados e com procedência garantida. Entre em contato conosco para mais informações.",
          logo: {
            url: null,
            updatedAt: null
          }
        }
      ], 
      { onConflict: 'id' });

    if (error) throw error;
  } catch (error) {
    console.error('Error initializing site settings:', error);
    throw error;
  }
}