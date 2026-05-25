import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/ui/PropertyCard';
import PageTransition from '../components/ui/PageTransition';
import { useSEO } from '../hooks/useSEO';

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const { properties, loading } = useProperties({});

  useSEO({
    title: 'Mis Favoritos | Inmobiliaria',
    description: 'Tus propiedades guardadas en Inmobiliaria. Compara y contacta fácilmente las propiedades que más te gustaron.',
  });

  const favs = properties.filter(p => ids.includes(p.id));

  return (
    <PageTransition>
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/propiedades"
          className="inline-flex items-center gap-2 text-navy-400 hover:text-gold-400 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Ver todas las propiedades
        </Link>

        <div className="mb-8">
          <div className="section-accent" />
          <h1 className="text-3xl font-display font-bold text-white mb-1 flex items-center gap-3">
            Mis favoritos
            {ids.length > 0 && (
              <span className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-sm font-bold flex items-center justify-center">
                {ids.length}
              </span>
            )}
          </h1>
          <p className="text-navy-400">Propiedades que guardaste para revisar después</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-56 bg-navy-800 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-navy-800 rounded w-3/4" />
                  <div className="h-3 bg-navy-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-navy-800/60 border border-white/5 flex items-center justify-center mb-6">
              <Heart className="w-9 h-9 text-navy-700" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">Aún no tienes favoritos</p>
            <p className="text-navy-500 text-sm max-w-xs mb-6">
              Toca el corazón en cualquier propiedad para guardarla aquí.
            </p>
            <Link to="/propiedades" className="btn-primary">
              Explorar propiedades
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favs.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
