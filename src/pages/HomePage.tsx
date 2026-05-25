import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Home, TrendingUp } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import HeroSection from '../components/home/HeroSection';
import SearchBar from '../components/home/SearchBar';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyUs from '../components/home/WhyUs';
import StatsBar from '../components/home/StatsBar';
import ContactCTA from '../components/home/ContactCTA';
import { useProperties } from '../hooks/useProperties';
import type { SearchFilters } from '../types/property';
import { useSEO } from '../hooks/useSEO';

const CATEGORIES = [
  { title: 'Apartamentos en venta',   count: '200+ propiedades', to: '/propiedades?operacion=venta&tipo=apartamento',    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',  badge: 'Venta' },
  { title: 'Casas y residencias',      count: '120+ propiedades', to: '/propiedades?operacion=venta&tipo=casa',           img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', badge: 'Venta' },
  { title: 'Alquileres en Caracas',    count: '180+ propiedades', to: '/propiedades?operacion=alquiler&ciudad=Caracas',   img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',  badge: 'Alquiler' },
  { title: 'Locales y oficinas',       count: '85+ propiedades',  to: '/propiedades?tipo=local',                          img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',  badge: 'Comercial' },
];

export default function HomePage() {
  useSEO({
    title: 'Inmobiliaria — Tu hogar en Venezuela',
    description: 'Compra, vende o alquila propiedades en Venezuela con Inmobiliaria. Más de 10 años de experiencia, propiedades verificadas en Caracas, Valencia, Maracaibo y más.',
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { properties, loading } = useProperties(filters);

  const scrollToSearch = () =>
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const featured = properties.filter((p) => p.featured);
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <PageTransition>
      <>
      <HeroSection onSearch={scrollToSearch} />

      {/* Search */}
      <div ref={searchRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <SearchBar onSearch={setFilters} />
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="section-accent" />
          <h2 className="section-title">Explora por categoría</h2>
          <p className="section-subtitle">Encuentra el inmueble que se ajusta a tus necesidades</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ perspective: '900px' }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={cat.to}
                className="relative overflow-hidden rounded-2xl h-52 flex group border border-white/5 hover:border-gold-500/30 transition-all duration-300">
                <img src={cat.img} alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-55 group-hover:opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 to-navy-950/20" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className={cat.badge === 'Alquiler' ? 'badge-rent mb-2 self-start' : 'badge-sale mb-2 self-start'}>
                    {cat.badge}
                  </span>
                  <h3 className="text-white font-bold text-xl font-display">{cat.title}</h3>
                  <p className="text-gold-400/70 text-sm mt-1">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured / Results */}
      <FeaturedProperties
        properties={hasFilters ? properties : featured.length >= 3 ? featured : properties.slice(0, 6)}
        loading={loading}
        title={hasFilters ? 'Resultados de búsqueda' : 'Propiedades Destacadas'}
        subtitle={hasFilters
          ? `${properties.length} propiedad${properties.length !== 1 ? 'es' : ''} encontrada${properties.length !== 1 ? 's' : ''}`
          : 'Selección premium de los mejores inmuebles del mercado'}
      />

      {/* Stats */}
      <StatsBar />

      {/* Why Us */}
      <WhyUs />

      {/* Sell your property */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-gold-500/15 bg-gradient-to-r from-navy-900 to-navy-800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-gold-500/8 via-transparent to-transparent" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 px-8 py-10 sm:px-12">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/25 flex items-center justify-center shrink-0 mt-0.5">
                <Home className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-gold-400 text-[11px] font-semibold tracking-[0.22em] uppercase">Para propietarios</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  ¿Tienes una propiedad<br className="hidden sm:block" /> que vender o alquilar?
                </h3>
                <p className="text-white/40 text-sm mt-2 max-w-md leading-relaxed">
                  Publicamos tu inmueble, lo mostramos a miles de compradores verificados y cerramos el trato contigo. Comisión solo al vender.
                </p>
              </div>
            </div>
            <Link
              to="/contacto"
              className="group flex items-center gap-2.5 shrink-0 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm px-7 py-4 rounded-xl transition-colors duration-200 whitespace-nowrap"
            >
              Publicar mi propiedad
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <ContactCTA />
      </>
    </PageTransition>
  );
}
