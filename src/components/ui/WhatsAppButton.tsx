import { MessageCircle } from 'lucide-react';

const DEFAULT_PHONE = '584128000000';
const DEFAULT_MSG   = 'Hola, quisiera información sobre una propiedad.';

interface Props {
  phone?:   string;
  message?: string;
  label?:   string;
  className?: string;
  variant?: 'floating' | 'inline' | 'card';
}

export function buildWaUrl(phone: string, message: string) {
  const n = phone.replace(/\D/g, '');
  const num = n.startsWith('58') ? n : `58${n.replace(/^0/, '')}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppButton({
  phone   = DEFAULT_PHONE,
  message = DEFAULT_MSG,
  label   = 'WhatsApp',
  className = '',
  variant = 'inline',
}: Props) {
  const url = buildWaUrl(phone, message);

  if (variant === 'floating') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20b957] text-white font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="WhatsApp">
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Chatea con nosotros
        </span>
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold rounded-lg transition-all duration-200 ${className}`}>
        <MessageCircle className="w-3.5 h-3.5" />
        WhatsApp
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20b957] text-white font-bold rounded-xl transition-all duration-200 active:scale-95 ${className}`}>
      <MessageCircle className="w-5 h-5" />
      {label}
    </a>
  );
}
