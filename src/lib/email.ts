import { supabase } from './supabase';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: any }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify(options)
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}