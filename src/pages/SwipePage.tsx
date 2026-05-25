import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ArrowLeft, BedDouble, Bath, Maximize2, MapPin, RotateCcw } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import PageTransition from '../components/ui/PageTransition';
import type { Property } from '../types/property';
import { useSEO } from '../hooks/useSEO';

const fmt = (p: number, c: string) =>
  c === 'USD' ? `$${p.toLocaleString('en-US')}` : `${p.toLocaleString()} ${c}`;

const THRESHOLD = 90;

function SwipeCard({
  property, onSwipe, isTop,
}: {
  property: Property; onSwipe: (dir: 'left' | 'right') => void; isTop: boolean;
}) {
  const [pos, setPos]       = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const startRef            = useRef({ x: 0, y: 0 });

  const triggerSwipe = (dir: 'left' | 'right') => {
    setPos({ x: dir === 'right' ? 600 : -600, y: 0 });
    setTimeout(() => onSwipe(dir), 350);
  };

  const onDown = (e: React.PointerEvent) => {
    if (!isTop) return;
    setDrag(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y });
  };

  const onUp = () => {
    if (!dragging) return;
    setDrag(false);
    if (pos.x > THRESHOLD)       triggerSwipe('right');
    else if (pos.x < -THRESHOLD) triggerSwipe('left');
    else setPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!isTop) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') triggerSwipe('right');
      if (e.key === 'ArrowLeft')  triggerSwipe('left');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isTop]);

  const rotate = pos.x * 0.07;
  const likeOpacity  = Math.max(0, pos.x / THRESHOLD);
  const nopeOpacity  = Math.max(0, -pos.x / THRESHOLD);

  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      style={{
        position: 'absolute', inset: 0,
        transform: `translateX(${pos.x}px) translateY(${pos.y * 0.2}px) rotate(${rotate}deg)`,
        transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(.25,.46,.45,.94)',
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
        touchAction: 'none',
      }}
      className="rounded-3xl overflow-hidden shadow-2xl bg-navy-900 border border-white/10"
    >
      {/* Image */}
      <div className="relative h-[55%]">
        <img src={property.images[0]} alt={property.title}
          className="w-full h-full object-cover pointer-events-none" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

        {/* Like overlay */}
        <div className="absolute top-8 left-8 border-4 border-green-400 rounded-2xl px-4 py-2 rotate-[-20deg]"
          style={{ opacity: likeOpacity }}>
          <p className="text-green-400 font-black text-2xl tracking-widest">GUARDAR</p>
        </div>
        {/* Nope overlay */}
        <div className="absolute top-8 right-8 border-4 border-red-400 rounded-2xl px-4 py-2 rotate-[20deg]"
          style={{ opacity: nopeOpacity }}>
          <p className="text-red-400 font-black text-2xl tracking-widest">SALTAR</p>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <span className={property.operation === 'alquiler' ? 'badge-rent' : 'badge-sale'}>
            {property.operation === 'alquiler' ? 'Alquiler' : 'Venta'}
          </span>
          <span className="badge bg-navy-950/70 text-navy-300 border border-white/10 capitalize backdrop-blur-sm">
            {property.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 h-[45%] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-white font-display font-bold text-lg leading-tight line-clamp-2">{property.title}</h2>
            <p className="text-gold-400 font-bold text-lg shrink-0">
              {fmt(property.price, property.currency)}
              {property.operation === 'alquiler' && <span className="text-xs text-gold-500/70 font-normal">/mes</span>}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-navy-400 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 text-gold-500/70 shrink-0" />
            {property.location.zone}, {property.location.city}
          </div>
          <p className="text-navy-400 text-sm line-clamp-2 leading-relaxed">{property.description}</p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          {property.features.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-navy-400 text-sm">
              <BedDouble className="w-4 h-4" /> {property.features.bedrooms} hab.
            </div>
          )}
          <div className="flex items-center gap-1.5 text-navy-400 text-sm">
            <Bath className="w-4 h-4" /> {property.features.bathrooms}
          </div>
          <div className="flex items-center gap-1.5 text-navy-400 text-sm ml-auto">
            <Maximize2 className="w-4 h-4" /> {property.features.area} m²
          </div>
          <Link to={`/propiedad/${property.id}`}
            className="text-xs text-gold-400 hover:text-gold-300 border border-gold-500/30 px-3 py-1.5 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}>
            Ver más →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SwipePage() {
  const { properties, loading } = useProperties({});
  const { toggle, isFav }       = useFavorites();
  const [queue, setQueue]       = useState<Property[]>([]);
  const [liked, setLiked]       = useState(0);
  const [skipped, setSkipped]   = useState(0);
  const [done, setDone]         = useState(false);

  useSEO({
    title: 'Explorar Propiedades | Inmobiliaria',
    description: 'Descubre propiedades en Venezuela de forma divertida. Desliza para explorar apartamentos, casas y más en modo interactivo.',
  });

  useEffect(() => {
    if (properties.length > 0 && queue.length === 0 && !done) {
      setQueue([...properties].sort(() => Math.random() - 0.5));
    }
  }, [properties]);

  const handleSwipe = (dir: 'left' | 'right') => {
    const current = queue[queue.length - 1];
    if (dir === 'right') {
      if (!isFav(current.id)) toggle(current.id);
      setLiked(l => l + 1);
    } else {
      setSkipped(s => s + 1);
    }
    const next = queue.slice(0, -1);
    setQueue(next);
    if (next.length === 0) setDone(true);
  };

  const restart = () => {
    setQueue([...properties].sort(() => Math.random() - 0.5));
    setLiked(0); setSkipped(0); setDone(false);
  };

  const progress = properties.length > 0
    ? Math.round(((liked + skipped) / properties.length) * 100)
    : 0;

  return (
    <PageTransition>
      <div className="pt-20 pb-10 min-h-screen flex flex-col">
        <div className="max-w-md mx-auto w-full px-4 flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/propiedades"
              className="flex items-center gap-2 text-navy-400 hover:text-gold-400 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Link>
            <div className="text-center">
              <p className="text-white font-display font-bold">Modo Explorar</p>
              <p className="text-navy-500 text-xs">← Saltar · Guardar →</p>
            </div>
            <Link to="/favoritos" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
              ❤ {liked}
            </Link>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-navy-800 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          {/* Card stack */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
            </div>
          ) : done ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
              <div className="text-6xl">🏠</div>
              <div>
                <p className="text-white font-display font-bold text-2xl mb-2">¡Viste todo!</p>
                <p className="text-navy-400 text-sm">
                  Guardaste <span className="text-gold-400 font-bold">{liked}</span> propiedades ·
                  Saltaste <span className="text-navy-300 font-bold">{skipped}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={restart}
                  className="flex items-center gap-2 btn-navy py-3 px-6">
                  <RotateCcw className="w-4 h-4" /> Repetir
                </button>
                <Link to="/favoritos" className="btn-primary py-3 px-6">
                  Ver guardados →
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Stack */}
              <div className="relative flex-1" style={{ maxHeight: 520 }}>
                {/* Back card */}
                {queue.length > 1 && (
                  <div className="absolute inset-0 rounded-3xl bg-navy-800 border border-white/5"
                    style={{ transform: 'scale(0.95) translateY(12px)', zIndex: 0 }} />
                )}
                {/* Top card */}
                {queue.length > 0 && (
                  <SwipeCard
                    key={queue[queue.length - 1].id}
                    property={queue[queue.length - 1]}
                    onSwipe={handleSwipe}
                    isTop
                  />
                )}
              </div>

              {/* Counter */}
              <p className="text-center text-navy-500 text-xs mt-3">
                {liked + skipped} de {properties.length} exploradas
              </p>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-8 mt-6">
                <button onClick={() => handleSwipe('left')}
                  className="w-16 h-16 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-500/10 transition-all shadow-lg">
                  <X className="w-7 h-7 text-red-400" />
                </button>
                <button onClick={() => handleSwipe('right')}
                  className="w-16 h-16 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center hover:border-green-400/50 hover:bg-green-500/10 transition-all shadow-lg">
                  <Heart className="w-7 h-7 text-green-400" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

