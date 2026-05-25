import { useState, useEffect, useRef } from 'react';
import PageTransition from '../components/ui/PageTransition';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, BedDouble, Bath, Car, Maximize2, MapPin,
  Phone, Mail, ChevronLeft, ChevronRight, Share2, Heart,
  CheckCircle2, Loader2, Send, X,
} from 'lucide-react';
import { useProperty, useProperties } from '../hooks/useProperties';
import { saveInquiry } from '../lib/api';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import PropertyCard from '../components/ui/PropertyCard';
import MortgageCalculator from '../components/ui/MortgageCalculator';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import Toast from '../components/ui/Toast';
import { useSEO } from '../hooks/useSEO';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { property, loading } = useProperty(id ?? '');
  const { properties: all }   = useProperties({});

  const { toggle: toggleFav, isFav } = useFavorites();
  const { recentIds } = useRecentlyViewed(id);
  const [toast, setToast]     = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [img, setImg]         = useState(0);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [lightbox, setLightbox] = useState(false);
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({ name: '', phone: '', email: '', message: '' });
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!lightbox || !property) return;
    const n = property.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setImg((i) => (i - 1 + n) % n);
      if (e.key === 'ArrowRight') setImg((i) => (i + 1) % n);
      if (e.key === 'Escape')     setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, property]);

  useSEO({
    title: property ? `${property.title} | Inmobiliaria` : 'Inmobiliaria',
    description: property
      ? `${property.title} — ${property.location.zone}, ${property.location.city}. ${property.features.area}m², ${property.features.bedrooms > 0 ? `${property.features.bedrooms} hab., ` : ''}precio ${property.currency === 'USD' ? '$' : ''}${property.price.toLocaleString()} ${property.currency}.`
      : 'Detalle de propiedad en Inmobiliaria.',
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-navy-400 text-lg">Propiedad no encontrada.</p>
      <Link to="/propiedades" className="btn-outline">Ver propiedades</Link>
    </div>
  );

  const fmt = (price: number, cur: string) =>
    cur === 'USD' ? `$${price.toLocaleString('en-US')}` : `${price.toLocaleString()} ${cur}`;

  const waMsg = `Hola, estoy interesado en la propiedad "${property.title}" (${fmt(property.price, property.currency)}) que vi en Inmobiliaria. ¿Me pueden dar más información?`;

  const prev = () => setImg((i) => (i - 1 + property.images.length) % property.images.length);
  const next = () => setImg((i) => (i + 1) % property.images.length);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await saveInquiry({
        name: form.name, phone: form.phone, email: form.email,
        property: property!.title, propertyId: property!.id, message: form.message,
      });
      setSent(true);
    } catch {
      setError('No pudimos enviar tu consulta. Intenta de nuevo o contáctanos por WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  const similar = all
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  return (
    <PageTransition>
    <div className="pt-20 pb-20">
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (delta > 50) prev();
            else if (delta < -50) next();
            touchStartX.current = null;
          }}>
          <button aria-label="Cerrar galería" className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <button aria-label="Imagen anterior" onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img src={property.images[img]}
            alt={`${property.title} — foto ${img + 1} de ${property.images.length}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" />
          <button aria-label="Imagen siguiente" onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, i) => (
              <button key={i} aria-label={`Ver foto ${i + 1}`} onClick={(e) => { e.stopPropagation(); setImg(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === img ? 'bg-gold-400 scale-125' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/propiedades"
          className="inline-flex items-center gap-2 text-navy-400 hover:text-gold-400 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a propiedades
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] cursor-zoom-in bg-navy-900"
              onClick={() => setLightbox(true)}>
              <img src={property.images[img]} alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent pointer-events-none" />

              {property.images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-navy-900 transition-all">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-navy-900 transition-all">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              <div className="absolute top-3 left-3 flex gap-2">
                <span className={property.operation === 'alquiler' ? 'badge-rent' : 'badge-sale'}>
                  {property.operation === 'alquiler' ? 'Alquiler' : 'Venta'}
                </span>
                {property.featured && <span className="badge-featured">★ Destacado</span>}
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-navy-950/70 backdrop-blur-sm text-xs text-white/60">
                {img + 1} / {property.images.length} · Clic para ampliar
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((src, i) => (
                  <button key={i} onClick={() => setImg(i)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === img ? 'border-gold-500' : 'border-transparent opacity-50 hover:opacity-75'
                    }`}>
                    <img src={src} alt={`${property.title} — miniatura ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-navy-400 text-sm">
                  <MapPin className="w-4 h-4 text-gold-500/70" />
                  {property.location.address || `${property.location.zone}, ${property.location.city}`}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => property && toggleFav(property.id)}
                  aria-label={property && isFav(property.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  aria-pressed={property ? isFav(property.id) : false}
                  className="w-10 h-10 rounded-xl bg-navy-800 border border-white/10 flex items-center justify-center hover:border-gold-500/30 transition-all">
                  <Heart className={`w-5 h-5 ${property && isFav(property.id) ? 'text-red-400 fill-red-400' : 'text-navy-400'}`} />
                </button>
                <button onClick={handleShare}
                  className="w-10 h-10 rounded-xl bg-navy-800 border border-white/10 flex items-center justify-center hover:border-gold-500/30 transition-all">
                  <Share2 className="w-5 h-5 text-navy-400" />
                </button>
              </div>
            </div>

            {/* Price + features */}
            <div className="card p-5">
              <div className="flex flex-wrap items-center gap-5 mb-5">
                <div>
                  <p className="text-xs text-navy-500 mb-1">Precio</p>
                  <p className="font-display text-3xl font-bold gradient-text">
                    {fmt(property.price, property.currency)}
                    {property.operation === 'alquiler' && (
                      <span className="text-base font-normal text-navy-500">/mes</span>
                    )}
                  </p>
                </div>
                <WhatsAppButton phone={property.contactPhone} message={waMsg} label="Consultar por WhatsApp" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: BedDouble, label: 'Habitaciones',     value: property.features.bedrooms,   hide: property.features.bedrooms === 0 },
                  { icon: Bath,      label: 'Baños',            value: property.features.bathrooms,  hide: false },
                  { icon: Car,       label: 'Estacionamientos', value: property.features.parking,    hide: false },
                  { icon: Maximize2, label: 'Área',             value: `${property.features.area} m²`, hide: false },
                ].filter((f) => !f.hide).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-navy-800/60 border border-white/5">
                    <Icon className="w-5 h-5 text-gold-400/70 mx-auto mb-1.5" />
                    <p className="text-white font-bold text-lg">{value}</p>
                    <p className="text-navy-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-3">Descripción</h3>
              <p className="text-navy-300/80 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="card p-6">
                <h3 className="text-white font-semibold mb-4">Amenidades</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800/50 border border-white/5 text-sm text-navy-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage calculator — only for sale properties */}
            {property.operation === 'venta' && (
              <MortgageCalculator price={property.price} currency={property.currency} />
            )}

            {/* Map */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Ubicación</h3>
                  <p className="text-navy-400 text-sm">{property.location.zone}, {property.location.city}</p>
                </div>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${property.location.zone} ${property.location.city} Venezuela`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gold-400 hover:text-gold-300 border border-gold-500/30 px-3 py-1.5 rounded-lg transition-colors">
                  Ver en Google Maps
                </a>
              </div>
              <div className="h-52 bg-navy-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="absolute border-gold-500/30" style={{ left: `${(i+1)*12.5}%`, top: 0, bottom: 0, borderLeftWidth: 1 }} />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="absolute border-gold-500/30" style={{ top: `${(i+1)*16.7}%`, left: 0, right: 0, borderTopWidth: 1 }} />
                  ))}
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-gold">
                    <MapPin className="w-5 h-5 text-navy-950" />
                  </div>
                  <p className="text-white text-sm font-medium">{property.location.zone}</p>
                  <p className="text-navy-400 text-xs mt-0.5">{property.location.city}, Venezuela</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Contact */}
          <div>
            <div className="card p-6 sticky top-24 space-y-4">
              <div>
                <h3 className="text-white font-semibold">¿Te interesa esta propiedad?</h3>
                <p className="text-navy-400 text-sm mt-1">Respuesta garantizada en menos de 1 hora</p>
              </div>

              <WhatsAppButton phone={property.contactPhone} message={waMsg}
                label="Consultar por WhatsApp" className="w-full justify-center" />

              <div className="space-y-2">
                {property.contactPhone && (
                  <a href={`tel:${property.contactPhone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/60 border border-white/5 hover:border-gold-500/20 transition-all group">
                    <Phone className="w-4 h-4 text-gold-400/70" />
                    <span className="text-navy-300 text-sm group-hover:text-white transition-colors">{property.contactPhone}</span>
                  </a>
                )}
                {property.contactEmail && (
                  <a href={`mailto:${property.contactEmail}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/60 border border-white/5 hover:border-gold-500/20 transition-all group">
                    <Mail className="w-4 h-4 text-gold-400/70" />
                    <span className="text-navy-300 text-sm group-hover:text-white transition-colors truncate">{property.contactEmail}</span>
                  </a>
                )}
              </div>

              <div className="border-t border-white/5 pt-4">
                {sent ? (
                  <div className="text-center py-3">
                    <CheckCircle2 className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm">¡Mensaje enviado!</p>
                    <p className="text-navy-400 text-xs mt-1">Te contactamos pronto</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <p className="text-navy-500 text-xs">O déjanos tus datos:</p>
                    <input type="text" required placeholder="Tu nombre" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                    <input type="tel" placeholder="+58 412-000-0000" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
                    <input type="email" required placeholder="tu@correo.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                    <textarea rows={3} className="input-field resize-none"
                      placeholder={`Me interesa "${property.title}"...`}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
                      {sending
                        ? <><span className="w-4 h-4 border-2 border-navy-800/40 border-t-navy-950 rounded-full animate-spin" /> Enviando...</>
                        : <><Send className="w-4 h-4" /> Enviar consulta</>
                      }
                    </button>
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="section-accent" />
            <h2 className="font-display text-2xl font-bold text-white mb-2">Propiedades similares</h2>
            <p className="text-navy-400 mb-6">Otros {property.type}s que podrían interesarte</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </section>
        )}

        {/* Recently viewed */}
        {recentIds.length > 0 && (() => {
          const recentProps = all.filter((p) => recentIds.includes(p.id))
            .sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
          if (recentProps.length === 0) return null;
          return (
            <section className="mt-16">
              <div className="section-accent" />
              <h2 className="font-display text-2xl font-bold text-white mb-2">Vistas recientemente</h2>
              <p className="text-navy-400 mb-6">Propiedades que exploraste antes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentProps.slice(0, 3).map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
    {showTop && (
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
        className="fixed bottom-24 right-5 z-40 w-10 h-10 rounded-full bg-navy-800 border border-white/10 shadow-xl flex items-center justify-center text-navy-300 hover:text-gold-400 hover:border-gold-500/40 transition-all">
        ↑
      </button>
    )}
    <Toast message="¡Enlace copiado!" visible={toast} onHide={() => setToast(false)} />
    </PageTransition>
  );
}
