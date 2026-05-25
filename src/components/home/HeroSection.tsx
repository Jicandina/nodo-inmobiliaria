import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface Props { onSearch: () => void; }

const STATS = [
  { value: '10+',    label: 'Años activos' },
  { value: '3.000+', label: 'Clientes' },
  { value: '15',     label: 'Ciudades' },
];

export default function HeroSection({ onSearch }: Props) {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], ['0%', '18%']);

  return (
    <section className="relative h-[100dvh] overflow-hidden">

      {/* Full-bleed photo */}
      <div className="absolute inset-0">
        <motion.img
          src="/faro-lecheria.jpg"
          alt="Propiedad premium en Venezuela"
          style={{ y: bgY }}
          className="absolute w-full h-[112%] -top-[6%] object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-navy-950/20 to-transparent" />
      </div>

      {/* Editorial content — anchored bottom-left */}
      <div className="absolute inset-x-0 bottom-0 px-6 sm:px-10 lg:px-20 pb-14">
        <div className="max-w-4xl">

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gold-400 text-[11px] font-semibold tracking-[0.25em] uppercase mb-6"
          >
            Bienes Raíces · Venezuela
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(52px,8vw,100px)] font-bold text-white leading-[0.92] tracking-tight mb-9"
          >
            Encuentra<br />
            <span className="italic text-gold-400">el lugar</span><br />
            que buscas.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-5"
          >
            <button
              onClick={onSearch}
              className="btn-primary px-8 py-4 text-[15px]"
            >
              Ver propiedades
            </button>
            <Link
              to="/contacto"
              className="group flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Hablar con un asesor
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex items-center gap-10 mt-12 pt-8 border-t border-white/10"
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-bold text-2xl leading-none tabular-nums">{value}</p>
                <p className="text-white/35 text-[11px] mt-1.5 tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 text-white/25" />
      </motion.div>

    </section>
  );
}
