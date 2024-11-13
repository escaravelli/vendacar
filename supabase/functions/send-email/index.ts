// @ts-ignore
import { serve } from 'https://deno.fresh.dev/std@v1/http/server.ts';
import { Resend } from 'https://esm.sh/@resend/node';

const resend = new Resend('re_gpsVJJgU_Pbc18STk1ZCSa5KfQUawsPp2');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const emailData: EmailData = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'ATR Automóveis <noreply@atrautomoveis.com.br>',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});