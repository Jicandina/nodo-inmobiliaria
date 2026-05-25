import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import FaroLogo from '../ui/FaroLogo';

const LINKS = [
  { label: 'Inicio',               to: '/' },
  { label: 'Propiedades',           to: '/propiedades' },
  { label: 'Apartamentos en venta', to: '/propiedades?operacion=venta&tipo=apartamento' },
  { label: 'Alquileres Caracas',    to: '/propiedades?operacion=alquiler&ciudad=Caracas' },
  { label: 'Nosotros',              to: '/nosotros' },
  { label: 'Contacto',              to: '/contacto' },
];

const LEGAL = [
  { label: 'Política de Privacidad', to: '/privacidad' },
  { label: 'Términos de Uso',        to: '/terminos' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/6 mt-4">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-16">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/5">

          <div className="md:col-span-5">
            <div className="mb-6">
              <FaroLogo size={32} />
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Tu aliado de confianza para encontrar la propiedad perfecta en Venezuela.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-white/50 text-[11px] font-semibold tracking-[0.2em] uppercase mb-5">Explorar</p>
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/35 hover:text-white text-sm transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-white/50 text-[11px] font-semibold tracking-[0.2em] uppercase mb-5">Contacto</p>
            <ul className="space-y-4">
              <li>
                <a href="tel:+584128000000" className="flex items-center gap-3 text-white/35 hover:text-white text-sm transition-colors duration-150 group">
                  <Phone className="w-4 h-4 text-gold-500/50 group-hover:text-gold-400 transition-colors shrink-0" />
                  +58 412-800-0000
                </a>
                <p className="text-white/18 text-xs mt-1 ml-7">Lun–Sáb, 8am–6pm</p>
              </li>
              <li>
                <a href="mailto:info@inmobiliaria.com.ve" className="flex items-center gap-3 text-white/35 hover:text-white text-sm transition-colors duration-150 group">
                  <Mail className="w-4 h-4 text-gold-500/50 group-hover:text-gold-400 transition-colors shrink-0" />
                  info@inmobiliaria.com.ve
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/35 text-sm">
                <MapPin className="w-4 h-4 text-gold-500/50 mt-0.5 shrink-0" />
                Las Mercedes, Caracas, Venezuela
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/18 text-xs">
            © {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL.map((l) => (
              <Link key={l.to} to={l.to} className="text-white/18 text-xs hover:text-white/40 transition duration-150">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
