import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import PageTransition from '../components/ui/PageTransition';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List, ArrowUpDown, X, ChevronDown, Map } from 'lucide-react';
import PropertyCard from '../components/ui/PropertyCard';
import NLSearchBar from '../components/ui/NLSearchBar';
import { useProperties } from '../hooks/useProperties';
import type { SearchFilters, OperationType, PropertyType } from '../types/property';
import { VENEZUELAN_CITIES } from '../types/property';
import { useSEO } from '../hooks/useSEO';

const PropertyMap = lazy(() => import('../components/ui/PropertyMap'));

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured',   label: 'Destacados primero' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'newest',     label: 'Más recientes' },
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa',        label: 'Casa' },
  { value: 'local',       label: 'Local' },
  { value: 'oficina',     label: 'Oficina' },
  { value: 'terreno',     label: 'Terreno' },
];

function Skeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-56 bg-navy-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-navy-800 rounded w-3/4" />
        <div className="h-3 bg-navy-800 rounded w-1/2" />
        <div className="h-3 bg-navy-800 rounded w-full" />
        <div className="h-8 bg-navy-800 rounded mt-4" />
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters]   = useState<SearchFilters>({});
  const [sort, setSort]         = useState<SortKey>('featured');
  const [view, setView]         = useState<'grid' | 'list' | 'mapa'>('grid');
  const [showSort, setShowSort] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useSEO({
    title: 'Propiedades | Inmobiliaria',
    description: 'Explora cientos de propiedades en Venezuela. Apartamentos, casas, oficinas y locales en venta y alquiler en Caracas, Valencia, Maracaibo y más ciudades.',
  });

  // Local filter state
  const [op, setOp]           = useState<OperationType | ''>('');
  const [type, setType]       = useState<PropertyType | ''>('');
  const [city, setCity]       = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('');

  useEffect(() => {
    const initial: SearchFilters = {};
    const qOp   = searchParams.get('operacion');
    const qTipo = searchParams.get('tipo');
    const qCity = searchParams.get('ciudad');
    if (qOp === 'alquiler' || qOp === 'venta') { initial.operation = qOp; setOp(qOp); }
    if (qTipo) { initial.propertyType = qTipo as PropertyType; setType(qTipo as PropertyType); }
    if (qCity) { initial.city = qCity; setCity(qCity); }
    setFilters(initial);
  }, [searchParams]);

  const applyFilters = () => {
    const f: SearchFilters = {};
    if (op)       f.operation    = op;
    if (type)     f.propertyType = type;
    if (city)     f.city         = city;
    const min = Number(minPrice), max = Number(maxPrice);
    if (minPrice && !isNaN(min) && min > 0) f.minPrice = min;
    if (maxPrice && !isNaN(max) && max > 0) f.maxPrice = max;
    if (minBeds)  f.minBedrooms  = Number(minBeds);
    setFilters(f);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setOp(''); setType(''); setCity(''); setMinPrice(''); setMaxPrice(''); setMinBeds('');
    setFilters({});
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const next = { ...filters };
    delete next[key];
    setFilters(next);
    if (key === 'operation')    setOp('');
    if (key === 'propertyType') setType('');
    if (key === 'city')         setCity('');
    if (key === 'minPrice')     setMinPrice('');
    if (key === 'maxPrice')     setMaxPrice('');
    if (key === 'minBedrooms')  setMinBeds('');
  };

  const filterChips = ([
    filters.operation    && { key: 'operation'    as const, label: filters.operation === 'venta' ? 'Venta' : 'Alquiler' },
    filters.propertyType && { key: 'propertyType' as const, label: PROPERTY_TYPES.find(t => t.value === filters.propertyType)?.label ?? filters.propertyType },
    filters.city         && { key: 'city'         as const, label: filters.city },
    filters.minPrice     && { key: 'minPrice'     as const, label: `Desde $${filters.minPrice.toLocaleString()}` },
    filters.maxPrice     && { key: 'maxPrice'     as const, label: `Hasta $${filters.maxPrice.toLocaleString()}` },
    filters.minBedrooms  && { key: 'minBedrooms'  as const, label: `${filters.minBedrooms}+ hab.` },
  ].filter(Boolean)) as { key: keyof SearchFilters; label: string }[];

  const hasFilters = Object.keys(filters).length > 0;

  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { properties, loading } = useProperties(filters);

  const sorted = useMemo(() => {
    const arr = [...properties];
    if (sort === 'price-asc')  return arr.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (sort === 'newest')     return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [properties, sort]);

  return (
    <PageTransition>
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* NL Search */}
        <NLSearchBar
          onSearch={(f) => { setFilters(f); setShowFilters(false); }}
          onClear={clearFilters}
        />

        {/* Page header */}
        <div className="mb-8">
          <div className="section-accent" />
          <h1 className="text-3xl font-display font-bold text-white mb-1">Propiedades</h1>
          <p className="text-navy-400">Explora nuestra selección completa de inmuebles en Venezuela</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Filter toggle */}
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              hasFilters
                ? 'border-gold-500/50 bg-gold-500/10 text-gold-400'
                : 'border-white/10 bg-navy-800/40 text-navy-300 hover:text-white hover:border-navy-600'
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasFilters && (
              <span className="w-5 h-5 rounded-full bg-gold-500 text-navy-950 text-xs font-bold flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-navy-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}

          <p className="text-navy-500 text-sm ml-auto">
            {loading ? '' : <><span className="text-white font-semibold">{sorted.length}</span> propiedades</>}
          </p>

          {/* Sort */}
          <div className="relative">
            <button onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-navy-800/40 text-navy-300 hover:text-white text-sm transition-all">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSort && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                <div className="absolute right-0 top-11 z-20 bg-navy-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === opt.value ? 'bg-gold-500/15 text-gold-400' : 'text-navy-300 hover:bg-white/5 hover:text-white'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View toggle */}
          <div className="flex border border-white/10 rounded-xl overflow-hidden bg-navy-800/40">
            <button onClick={() => setView('grid')}
              className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-gold-500/15 text-gold-400' : 'text-navy-500 hover:text-white'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')}
              className={`p-2.5 transition-colors ${view === 'list' ? 'bg-gold-500/15 text-gold-400' : 'text-navy-500 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setView('mapa')}
              className={`p-2.5 transition-colors ${view === 'mapa' ? 'bg-gold-500/15 text-gold-400' : 'text-navy-500 hover:text-white'}`}>
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {filterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterChips.map((chip) => (
              <span key={chip.key}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium">
                {chip.label}
                <button onClick={() => removeFilter(chip.key)}
                  aria-label={`Quitar filtro ${chip.label}`}
                  className="hover:text-white transition-colors rounded-full">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filter panel */}
        {showFilters && (
          <div className="card p-5 mb-6 border-gold-500/20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              {/* Operation */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 font-medium">Operación</label>
                <select value={op} onChange={(e) => setOp(e.target.value as OperationType | '')}
                  className="select-field">
                  <option value="">Todas</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              {/* Type */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 font-medium">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value as PropertyType | '')}
                  className="select-field">
                  <option value="">Todos</option>
                  {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {/* City */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 font-medium">Ciudad</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="select-field">
                  <option value="">Todas</option>
                  {VENEZUELAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Price range */}
              <div className="col-span-2 sm:col-span-3 lg:col-span-2">
                <label className="block text-xs text-navy-400 mb-1.5 font-medium">Rango de precio (USD)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="0" placeholder="Mínimo"
                    value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                    className="input-field"
                  />
                  <span className="text-navy-500 text-sm font-medium shrink-0">–</span>
                  <input
                    type="number" min="0" placeholder="Máximo"
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              {/* Bedrooms */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 font-medium">Habitaciones mín.</label>
                <select value={minBeds} onChange={(e) => setMinBeds(e.target.value)} className="select-field">
                  <option value="">Cualquiera</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={clearFilters} className="btn-navy text-sm py-2">Limpiar</button>
              <button onClick={applyFilters} className="btn-primary text-sm py-2">Aplicar filtros</button>
            </div>
          </div>
        )}

        {/* Map view */}
        {view === 'mapa' && !loading && (
          <Suspense fallback={<div className="h-[520px] rounded-2xl bg-navy-800 animate-pulse" />}>
            <PropertyMap properties={sorted} />
          </Suspense>
        )}

        {view !== 'mapa' && loading ? (
          <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <SlidersHorizontal className="w-12 h-12 text-navy-700 mb-4" />
            <p className="text-white font-semibold text-lg mb-2">Sin resultados</p>
            <p className="text-navy-500 text-sm max-w-xs mb-6">
              No hay propiedades con esos filtros. Intenta ampliar tu búsqueda.
            </p>
            <button onClick={clearFilters} className="btn-outline text-sm py-2">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={`grid gap-5 ${
            view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-2xl'
          }`}>
            {sorted.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="fixed bottom-24 right-5 z-40 w-10 h-10 rounded-full bg-navy-800 border border-white/10 shadow-xl flex items-center justify-center text-navy-300 hover:text-gold-400 hover:border-gold-500/40 transition-all">
          ↑
        </button>
      )}
    </div>
    </PageTransition>
  );
}
