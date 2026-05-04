import { Shield, Award, Users, MapPin, Bed, Maximize2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props { onSearch: () => void; }

const PROPERTY_CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    label: 'Penthouse · Altamira',
    price: '$285,000',
    beds: 3,
    size: '180m²',
    tag: 'Destacado',
    to: '/propiedades?operacion=venta&tipo=apartamento',
  },
  {
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    label: 'Casa · La Lagunita',
    price: '$198,000',
    beds: 4,
    size: '320m²',
    tag: 'Nuevo',
    to: '/propiedades?operacion=venta&tipo=casa',
  },
];

const TRUST = [
  { icon: Award,  value: '10+',    label: 'Años de experiencia' },
  { icon: Users,  value: '3,000+', label: 'Clientes satisfechos' },
  { icon: Shield, value: '100%',   label: 'Propiedades verificadas' },
];

export default function HeroSection({ onSearch }: Props) {
  const { scrollY } = useScroll();
  const bgY        = useTransform(scrollY, [0, 700], ['0%', '22%']);
  const bgOpacity  = useTransform(scrollY, [0, 500], [0.68, 0.38]);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">

      {/* Parallax background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="/faro-lecheria.jpg"
          alt="Faro de Lechería · Barcelona"
          style={{ y: bgY, opacity: bgOpacity }}
          className="absolute -top-[10%] left-0 w-full h-[120%] object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/96 via-navy-950/72 to-navy-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/35" />
        {/* ambient forest glow top-left */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-navy-500/8 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left */}
          <div className="flex-1 lg:max-w-[55%]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              La inmobiliaria de confianza en Venezuela
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-6xl xl:text-[72px] font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              Tu próxima
              <br />
              propiedad
              <br />
              <span className="italic text-gold-400">te espera.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="text-navy-200/70 text-lg max-w-lg mb-10 leading-relaxed"
            >
              Compra, vende o alquila con la inmobiliaria más confiable de Venezuela.
              Propiedades verificadas en Caracas, Valencia, Maracaibo y más.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-14"
            >
              <button onClick={onSearch} className="btn-primary text-base px-8 py-3.5">
                Buscar propiedades
              </button>
              <a href="/contacto" className="btn-outline text-base px-8 py-3.5">
                Hablar con un asesor
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-8 border-t border-white/10 pt-8"
            >
              {TRUST.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{value}</p>
                    <p className="text-navy-400 text-xs mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — 3D floating property showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-4 w-80 xl:w-96 shrink-0"
            style={{ perspective: '1400px' }}
          >
            {PROPERTY_CARDS.map((card, i) => (
              <Link key={card.label} to={card.to} className="block group/card">
                <motion.div
                  initial={{ opacity: 0, y: 24, rotateX: 6 }}
                  animate={{
                    opacity: 1,
                    rotateX: 0,
                    y: [0, i === 0 ? -11 : -8, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.5 + i * 0.15 },
                    rotateX: { duration: 0.6, delay: 0.5 + i * 0.15 },
                    y: {
                      duration: i === 0 ? 5.5 : 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 1.4,
                    },
                  }}
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: i === 0 ? -3 : 3 }}
                  className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-[border-color] duration-300 group-hover/card:border-gold-500/40"
                  style={{
                    background: 'rgba(11,21,37,0.90)',
                    backdropFilter: 'blur(16px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 20px 60px rgba(11,21,37,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-950 text-xs font-bold">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{card.label}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-navy-400" />
                          <p className="text-navy-400 text-xs">Caracas, Venezuela</p>
                        </div>
                      </div>
                      <p className="text-gold-400 font-bold text-base">{card.price}</p>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/8 pt-3 mt-1">
                      <div className="flex items-center gap-1.5 text-navy-300 text-xs">
                        <Bed className="w-3.5 h-3.5" />
                        {card.beds} hab.
                      </div>
                      <div className="flex items-center gap-1.5 text-navy-300 text-xs">
                        <Maximize2 className="w-3.5 h-3.5" />
                        {card.size}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
