import { useState } from 'react';
import PageTransition from '../components/ui/PageTransition';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import WhatsAppButton, { buildWaUrl } from '../components/ui/WhatsAppButton';
import { saveInquiry } from '../lib/api';
import { useSEO } from '../hooks/useSEO';

const SERVICES = [
  'Quiero comprar una propiedad',
  'Quiero alquilar una propiedad',
  'Quiero vender mi propiedad',
  'Quiero alquilar mi propiedad',
  'Asesoría inmobiliaria',
  'Otro',
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useSEO({
    title: 'Contacto | Inmobiliaria',
    description: 'Contáctanos para comprar, vender o alquilar una propiedad en Venezuela. Asesores disponibles por teléfono, correo y WhatsApp.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await saveInquiry({
        name: form.name, phone: form.phone, email: form.email,
        property: form.service, propertyId: '', message: form.message,
      });
      setSent(true);
    } catch {
      setError('No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-accent mx-auto" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Hablemos de tu <span className="gradient-text">propiedad</span>
          </h1>
          <p className="text-navy-400 text-lg max-w-xl mx-auto">
            Ya sea que quieras comprar, vender o alquilar, nuestro equipo te acompaña en cada paso sin costo ni compromiso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: Phone,          title: 'Teléfono',   value: '+58 412-800-0000',    href: 'tel:+584128000000',    sub: 'Lunes a Sábado, 8am – 6pm' },
              { icon: MessageCircle,  title: 'WhatsApp',   value: '+58 412-800-0000',    href: buildWaUrl('584128000000', 'Hola, me comunico desde inmobiliaria.com.ve y quisiera asesoría.'), sub: 'Respuesta en menos de 1 hora' },
              { icon: Mail,           title: 'Correo',     value: 'info@inmobiliaria.com.ve',  href: 'mailto:info@inmobiliaria.com.ve', sub: 'Respuesta en 24 horas' },
              { icon: MapPin,         title: 'Oficina',    value: 'Las Mercedes, Caracas', href: '#',                  sub: 'Av. Principal de Las Mercedes' },
            ].map(({ icon: Icon, title, value, href, sub }) => (
              <a key={title} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 card hover:border-gold-500/25 hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 transition-all">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-navy-500 text-xs mb-0.5">{title}</p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                  <p className="text-navy-600 text-xs mt-0.5">{sub}</p>
                </div>
              </a>
            ))}

            {/* Hours */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gold-400" />
                <span className="text-white font-semibold text-sm">Horario de atención</span>
              </div>
              {[
                { day: 'Lunes – Viernes', hours: '8:00 am – 6:00 pm' },
                { day: 'Sábados',         hours: '9:00 am – 2:00 pm' },
                { day: 'Domingos',        hours: 'Solo WhatsApp' },
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between text-xs py-2 border-b border-white/5 last:border-0">
                  <span className="text-navy-400">{day}</span>
                  <span className="text-white font-medium">{hours}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="p-5 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20 text-center">
              <p className="text-white font-semibold text-sm mb-1">¿Prefieres chatear?</p>
              <p className="text-navy-500 text-xs mb-4">Respuesta inmediata por WhatsApp</p>
              <WhatsAppButton message="Hola, quiero hablar con un asesor de Inmobiliaria."
                label="Abrir WhatsApp" className="w-full justify-center" />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">¡Mensaje recibido!</h3>
                  <p className="text-navy-400 max-w-sm text-sm">
                    Nuestro equipo revisará tu solicitud y se pondrá en contacto en menos de 24 horas hábiles.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', service: '', message: '' }); }}
                    className="btn-outline mt-6 text-sm">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-white mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-navy-400 font-medium mb-1.5">Nombre completo *</label>
                        <input type="text" required placeholder="Tu nombre"
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs text-navy-400 font-medium mb-1.5">Teléfono / WhatsApp *</label>
                        <input type="tel" required placeholder="+58 412-000-0000"
                          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="input-field" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-navy-400 font-medium mb-1.5">Correo electrónico *</label>
                      <input type="email" required placeholder="tu@correo.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field" />
                    </div>

                    <div>
                      <label className="block text-xs text-navy-400 font-medium mb-2">¿En qué podemos ayudarte? *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SERVICES.map((s) => (
                          <button key={s} type="button" onClick={() => setForm({ ...form, service: s })}
                            className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                              form.service === s
                                ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                                : 'border-white/10 bg-navy-800/40 text-navy-400 hover:border-navy-600 hover:text-navy-200'
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-navy-400 font-medium mb-1.5">Mensaje adicional</label>
                      <textarea rows={4} placeholder="Cuéntanos más detalles..."
                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input-field resize-none" />
                    </div>

                    <button type="submit" disabled={loading || !form.service}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-navy-800/40 border-t-navy-950 rounded-full animate-spin" /> Enviando...</>
                        : <><Send className="w-4 h-4" /> Enviar mensaje</>
                      }
                    </button>
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                    <p className="text-navy-600 text-xs text-center">
                      Al enviar aceptas que nos comuniquemos contigo vía WhatsApp o correo.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
