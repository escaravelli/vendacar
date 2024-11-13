import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function WhatsAppButton() {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings?.contact?.whatsapp || '5511943549934';
  const message = 'Olá! Gostaria de saber mais sobre os veículos disponíveis.';
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center gap-2"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden md:inline">Fale Conosco</span>
    </a>
  );
}