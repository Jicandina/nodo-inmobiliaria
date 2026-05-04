import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '../../types/property';
import PropertyCard from '../ui/PropertyCard';

function Skeleton() {
  return (
    <div className="rounded-2xl bg-navy-900 border border-navy-800/60 overflow-hidden animate-pulse">
      <div className="h-56 bg-navy-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-navy-800 rounded w-3/4" />
        <div className="h-3 bg-navy-800 rounded w-1/2" />
        <div className="h-3 bg-navy-800 rounded w-2/3" />
      </div>
    </div>
  );
}

interface Props {
  properties: Property[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function FeaturedProperties({
  properties,
  loading = false,
  title = 'Propiedades Destacadas',
  subtitle = 'Las mejores oportunidades del mercado',
  showViewAll = true,
}: Props) {
  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-end justify-between mb-12"
      >
        <div>
          <p className="text-gold-400 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">Destacadas</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">{title}</h2>
          <p className="text-white/30 text-sm mt-2">{subtitle}</p>
        </div>
        {showViewAll && (
          <Link to="/propiedades"
            className="hidden sm:flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors group">
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/25 text-sm">No se encontraron propiedades.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </div>
      )}

      {showViewAll && properties.length > 0 && (
        <div className="text-center mt-12 sm:hidden">
          <Link to="/propiedades" className="btn-outline">
            Ver todas las propiedades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
