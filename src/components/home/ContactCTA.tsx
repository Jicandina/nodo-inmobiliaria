import { Link } from 'react-router-dom';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { buildWaUrl } from '../ui/WhatsAppButton';

export default function ContactCTA() {
  return (
    <section className="border-t border-white/6 py-24 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-gold-400 text-[11px] font-semibold tracking-[0.25em] uppercase mb-6">Contáctanos</p>
          <h2 className="font-display text-4xl md:text-5xl xl:text-[58px] font-bold text-white leading-[0.95] mb-6">
            ¿Listo para<br />dar el paso?
          </h2>
          <p className="text-white/40 text-base leading-relaxed max-w-sm">
            Habla con un asesor hoy mismo. Sin compromiso, sin costo. Solo resultados.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          <a
            href={buildWaUrl('584128000000', 'Hola, me gustaría hablar con un asesor inmobiliario.')}
            target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between px-7 py-5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 hover:border-[#25D366]/40 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <div>
                <p className="text-white font-semibold text-sm">Escribir por WhatsApp</p>
                <p className="text-white/35 text-xs mt-0.5">Respuesta inmediata</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200" />
          </a>

          <a
            href="tel:+584128000000"
            className="group flex items-center justify-between px-7 py-5 bg-white/4 hover:bg-white/7 border border-white/8 hover:border-white/15 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-gold-400" />
              <div>
                <p className="text-white font-semibold text-sm">+58 412-800-0000</p>
                <p className="text-white/35 text-xs mt-0.5">Lun–Sáb, 8am–6pm</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200" />
          </a>

          <Link
            to="/contacto"
            className="group flex items-center justify-between px-7 py-5 bg-gold-500/8 hover:bg-gold-500/15 border border-gold-500/15 hover:border-gold-500/35 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border border-gold-400/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Formulario de contacto</p>
                <p className="text-white/35 text-xs mt-0.5">Detalla tu consulta</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-gold-400 group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
