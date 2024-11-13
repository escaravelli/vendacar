import nodemailer from 'nodemailer';
import { Contact } from '../types/contact';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '7f3362001@smtp-brevo.com',
    pass: 'LWaBrM27nX6pP9VO'
  }
});

const NOTIFICATION_EMAIL = 'websiteatrautomoveis@gmail.com';

interface EmailTemplateProps {
  contact: Contact;
  vehicleInfo?: {
    marca: string;
    modelo: string;
    ano: string;
  };
}

function getEmailTemplate({ contact, vehicleInfo }: EmailTemplateProps) {
  const sourceText = {
    financing: 'Formulário de Financiamento',
    vehicle: 'Formulário de Veículo',
    general: 'Formulário de Contato Geral'
  }[contact.source || 'general'];

  const vehicleSection = vehicleInfo ? `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>Veículo:</strong> ${vehicleInfo.marca} ${vehicleInfo.modelo} ${vehicleInfo.ano}
      </td>
    </tr>
  ` : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ed3237; margin-bottom: 20px;">${sourceText}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Nome:</strong> ${contact.name}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Email:</strong> ${contact.email}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Telefone:</strong> ${contact.phone}
          </td>
        </tr>
        ${vehicleSection}
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>Mensagem:</strong><br>
            ${contact.message.replace(/\n/g, '<br>')}
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendContactNotification(contact: Contact, vehicleInfo?: { marca: string; modelo: string; ano: string; }) {
  const sourceText = {
    financing: 'Solicitação de Financiamento',
    vehicle: 'Interesse em Veículo',
    general: 'Novo Contato'
  }[contact.source || 'general'];

  try {
    await transporter.sendMail({
      from: '"ATR Automóveis" <noreply@atrautomoveis.com.br>',
      to: NOTIFICATION_EMAIL,
      subject: `${sourceText} - ${contact.name}`,
      html: getEmailTemplate({ contact, vehicleInfo })
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}