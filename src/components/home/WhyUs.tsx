import { Shield, Users, TrendingUp, Star, Clock, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const REASONS = [
  { icon: Shield,     num: '01', title: 'Propiedades verificadas',       description: 'Cada propiedad es inspeccionada físicamente por nuestro equipo antes de publicarse. Cero sorpresas.' },
  { icon: Users,      num: '02', title: 'Asesores certificados',         description: 'Nuestros agentes tienen más de 8 años de experiencia promedio en el mercado inmobiliario venezolano.' },
  { icon: TrendingUp, num: '03', title: 'Precios reales de mercado',     description: 'Accede a valoraciones precisas basadas en datos actualizados. Ni más ni menos de lo que vale.' },
  { icon: Star,       num: '04', title: 'Servicio de excelencia',        description: 'Atención personalizada en cada etapa del proceso. Estamos contigo desde la búsqueda hasta la firma.' },
  { icon: Clock,      num: '05', title: 'Respuesta en menos de 1 hora',  description: 'Nuestro equipo responde rápido. Ningún cliente espera más de una hora por una consulta.' },
  { icon: Key,        num: '06', title: 'Gestión completa del cierre',   description: 'Nos encargamos de toda la documentación legal, notaría y trámites para que tú no tengas que preocuparte.' },
];

export default function WhyUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">

        {/* Left — sticky header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-28"
        >
          <div className="section-accent" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Por qué elegir<br />
            <span className="text-gold-400">nosotros</span>
          </h2>
          <p className="text-navy-300/60 text-base leading-relaxed max-w-xs">
            Somos más que una inmobiliaria. Somos tu guía en la decisión más importante de tu vida.
          </p>
        </motion.div>

        {/* Right — feature list */}
        <div className="divide-y divide-navy-800/60">
          {REASONS.map(({ icon: Icon, num, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-6 py-7 group"
            >
              <div className="flex items-center gap-4 w-28 shrink-0 pt-0.5">
                <span className="font-display text-navy-700 text-xs font-bold tabular-nums group-hover:text-gold-500/60 transition-colors duration-300">
                  {num}
                </span>
                <div className="w-9 h-9 rounded-xl bg-navy-800/60 border border-navy-700/60 flex items-center justify-center group-hover:border-gold-500/30 group-hover:bg-gold-500/8 transition-all duration-300">
                  <Icon className="w-4 h-4 text-navy-400 group-hover:text-gold-400 transition-colors duration-300" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1.5 group-hover:text-gold-100 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-navy-400 text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
