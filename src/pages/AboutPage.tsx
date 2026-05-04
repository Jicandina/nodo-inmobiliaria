import { Link } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import { Shield, Heart, TrendingUp, Star, Users } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const VALUES = [
  { icon: Shield,    title: 'Confianza',      desc: 'Cada propiedad verificada personalmente. Cero sorpresas ni letra pequeña.' },
  { icon: Heart,     title: 'Compromiso',     desc: 'No cerramos hasta que encuentres exactamente lo que buscas.' },
  { icon: TrendingUp,title: 'Transparencia',  desc: 'Precios reales de mercado. Lo que ves es lo que pagas.' },
  { icon: Star,      title: 'Excelencia',     desc: 'Servicio de clase mundial adaptado al contexto venezolano.' },
];

const MILESTONES = [
  { year: '2014', event: 'Fundamos El Faro con 15 propiedades en Caracas' },
  { year: '2016', event: 'Expandimos operaciones a Valencia y Maracaibo' },
  { year: '2018', event: 'Superamos 1,000 transacciones exitosas' },
  { year: '2020', event: 'Lanzamos nuestra plataforma digital' },
  { year: '2022', event: 'Abrimos oficinas en Barcelona y Barquisimeto' },
  { year: '2024', event: 'Más de 3,000 familias encontraron su hogar con nosotros' },
];

export default function AboutPage() {
  useSEO({
    title: 'Nosotros | El Faro Inmobiliaria',
    description: 'Conoce al equipo de El Faro Inmobiliaria. Más de 10 años de experiencia en el mercado inmobiliario venezolano, 3,000+ clientes satisfechos.',
  });

  return (
    <PageTransition>
    <div className="pt-24 pb-20">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="section-accent" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              La inmobiliaria que <span className="gradient-text">Venezuela necesitaba</span>
            </h1>
            <p className="text-navy-300/80 text-lg leading-relaxed mb-5">
              Nacimos en Caracas en 2014 con una misión clara: hacer que comprar, vender y alquilar propiedades en Venezuela sea simple, seguro y transparente.
            </p>
            <p className="text-navy-400 leading-relaxed mb-8">
              Hoy somos la plataforma con más propiedades verificadas del país, con presencia en Caracas, Valencia, Maracaibo, Barquisimeto y el Oriente. Nuestro equipo conoce el mercado como nadie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/propiedades" className="btn-primary">Ver propiedades</Link>
              <Link to="/contacto" className="btn-outline">Hablar con un asesor</Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80"
                alt="Equipo El Faro" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -left-4 bg-navy-900 border border-gold-500/20 rounded-2xl p-5 shadow-gold">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '600+',    label: 'Propiedades' },
                  { value: '3,000+', label: 'Clientes' },
                  { value: '15',     label: 'Ciudades' },
                  { value: '10 años', label: 'Experiencia' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="font-display text-xl font-bold gradient-text">{value}</p>
                    <p className="text-navy-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-navy-900/30 border-y border-white/5 py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-accent mx-auto" />
            <h2 className="section-title">Nuestros valores</h2>
            <p className="section-subtitle">Lo que guía cada transacción que hacemos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:border-gold-500/25 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/20 transition-all">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-navy-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <div className="section-accent mx-auto" />
          <h2 className="section-title">10 años de historia</h2>
          <p className="section-subtitle">Construyendo confianza un hogar a la vez</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {MILESTONES.map(({ year, event }, i) => (
            <div key={year} className="flex gap-5 items-start">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <span className="text-gold-400 text-xs font-bold">{year.slice(2)}</span>
                </div>
                {i < MILESTONES.length - 1 && <div className="w-px h-8 bg-gold-500/15 mt-1" />}
              </div>
              <div className="pb-2 pt-2">
                <span className="text-gold-500 text-sm font-semibold">{year}</span>
                <p className="text-navy-200 mt-0.5">{event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden text-center py-16 px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent" />
          <div className="relative">
            <Users className="w-12 h-12 text-gold-400/60 mx-auto mb-5" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para encontrar tu propiedad ideal?
            </h2>
            <p className="text-navy-300/60 text-lg mb-8 max-w-lg mx-auto">
              Nuestro equipo te asesora sin compromiso ni costo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/propiedades" className="btn-primary px-8 py-4">Explorar propiedades</Link>
              <Link to="/contacto" className="btn-outline px-8 py-4">Contactar asesor</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
