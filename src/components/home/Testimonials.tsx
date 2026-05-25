import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Patricia Herrera',
    role: 'Compradora — Las Mercedes',
    text: 'El equipo encontró exactamente lo que buscaba y manejó toda la documentación sin un solo error. La experiencia más fluida que he tenido comprando un inmueble.',
  },
  {
    name: 'Alejandro Bravo',
    role: 'Vendedor — El Hatillo',
    text: 'Vendí mi casa en 5 semanas al precio que pedí. Conocen el mercado a la perfección y su proceso es completamente transparente.',
  },
  {
    name: 'Valeria Díaz',
    role: 'Arrendataria — Chacao',
    text: 'Busqué oficina por semanas sin éxito. Me encontraron el espacio ideal en menos de una semana y negoció mejores condiciones de las que esperaba.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-gold-400 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">Testimonios</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Lo que dicen<br />quienes confiaron.
          </h2>
        </div>
        <p className="text-white/30 text-sm max-w-xs">
          Más de 3.000 clientes han encontrado su propiedad con nosotros.
        </p>
      </motion.div>

      <div className="divide-y divide-white/6">
        {TESTIMONIALS.map(({ name, role, text }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-[80px_1fr_220px] gap-6 md:gap-12 py-10 group"
          >
            <span className="font-display text-5xl font-bold text-white/8 leading-none select-none pt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="font-display text-xl md:text-2xl text-white/75 leading-snug italic group-hover:text-white/90 transition-colors duration-300">
              "{text}"
            </p>
            <div className="md:text-right pt-1">
              <p className="text-white font-semibold text-sm">{name}</p>
              <p className="text-white/30 text-xs mt-1">{role}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
