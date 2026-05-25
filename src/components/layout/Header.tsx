import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Heart } from 'lucide-react';
import FaroLogo from '../ui/FaroLogo';
import { useFavorites } from '../../hooks/useFavorites';

const NAV = [
  { label: 'Inicio',      to: '/' },
  { label: 'Propiedades', to: '/propiedades' },
  { label: 'Explorar',   to: '/explorar' },
  { label: 'Nosotros',    to: '/nosotros' },
  { label: 'Contacto',    to: '/contacto' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile]     = useState(false);
  const location = useLocation();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobile(false), [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-5 lg:px-8 pt-4">

      {/* Floating pill */}
      <div className={`max-w-7xl mx-auto transition-all duration-300 rounded-2xl ${
        scrolled
          ? 'bg-navy-950/96 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(11,21,37,0.7)]'
          : 'bg-navy-950/50 backdrop-blur-sm border border-white/6'
      }`}>
        <div className="flex items-center justify-between px-5 py-3">

          <Link to="/" className="shrink-0">
            <FaroLogo size={32} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((link) => {
              const active = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to.replace(/s$/, ''));
              return (
                <Link key={link.to} to={link.to}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                    active
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-navy-200 hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+584128000000"
              className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition duration-200">
              <Phone className="w-4 h-4" />
              +58 412-800-0000
            </a>
            <Link to="/favoritos" aria-label="Mis favoritos"
              className="relative p-2 text-navy-300 hover:text-gold-400 transition duration-200">
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
            <Link to="/contacto" className="btn-primary text-sm py-2 px-5">
              Publicar propiedad
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-navy-200 hover:text-white transition duration-200"
            onClick={() => setMobile(!mobile)}
            aria-label={mobile ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              <X  className={`absolute w-5 h-5 transition-all duration-200 ${mobile ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
              <Menu className={`absolute w-5 h-5 transition-all duration-200 ${mobile ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
            </span>
          </button>

        </div>
      </div>

      {/* Mobile menu — separate floating panel */}
      {mobile && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 bg-navy-950/98 backdrop-blur-md border border-white/8 rounded-2xl px-4 py-4 space-y-1 shadow-[0_8px_32px_rgba(11,21,37,0.7)]">
          {NAV.map((link) => {
            const active = link.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(link.to.replace(/s$/, ''));
            return (
              <Link key={link.to} to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition duration-200 ${
                  active ? 'bg-gold-500/10 text-gold-400' : 'text-navy-200 hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            );
          })}
          <Link to="/favoritos"
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition duration-200 ${
              location.pathname === '/favoritos' ? 'bg-gold-500/10 text-gold-400' : 'text-navy-200 hover:bg-white/5'
            }`}>
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" /> Favoritos
            </span>
            {favCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>
          <div className="pt-2">
            <Link to="/contacto" className="btn-primary w-full text-sm py-3">
              Publicar propiedad
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
