import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MessageSquare, Phone, Mail, Clock, CheckCheck, Trash2, X, Loader2 } from 'lucide-react';

type Status = 'nueva' | 'vista' | 'respondida';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  property: string;
  propertyId?: string;
  message: string;
  status: Status;
  createdAt: Date;
}

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  nueva:      { label: 'Nueva',      className: 'bg-green-500/15 text-green-400 border border-green-500/25' },
  vista:      { label: 'Vista',      className: 'bg-navy-700/60 text-navy-300 border border-navy-700' },
  respondida: { label: 'Respondida', className: 'bg-gold-500/15 text-gold-400 border border-gold-500/25' },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `Hace ${days} día${days > 1 ? 's' : ''}`;
  return date.toLocaleDateString('es-VE');
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<Inquiry | null>(null);
  const [filter, setFilter]       = useState<Status | ''>('');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => {
        const raw = d.data();
        return {
          id:         d.id,
          name:       raw.name       ?? '',
          phone:      raw.phone      ?? '',
          email:      raw.email      ?? '',
          property:   raw.property   ?? '',
          propertyId: raw.propertyId ?? '',
          message:    raw.message    ?? '',
          status:     (raw.status    ?? 'nueva') as Status,
          createdAt:  raw.createdAt instanceof Timestamp
            ? raw.createdAt.toDate()
            : new Date(),
        } as Inquiry;
      });
      setInquiries(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter ? inquiries.filter(i => i.status === filter) : inquiries;
  const newCount = inquiries.filter(i => i.status === 'nueva').length;

  const markAs = async (id: string, status: Status) => {
    await updateDoc(doc(db, 'inquiries', id), { status });
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, 'inquiries', id));
    if (selected?.id === id) setSelected(null);
  };

  const open = async (inq: Inquiry) => {
    setSelected(inq);
    if (inq.status === 'nueva') await markAs(inq.id, 'vista');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Consultas</h1>
          <p className="text-navy-400 text-sm mt-1">
            {newCount > 0
              ? <span><span className="text-green-400 font-semibold">{newCount} nuevas</span> · {inquiries.length} total</span>
              : `${inquiries.length} consultas`}
          </p>
        </div>
        <div className="flex border border-white/10 rounded-xl overflow-hidden bg-navy-800/40">
          {(['', 'nueva', 'vista', 'respondida'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                filter === s ? 'bg-gold-500/15 text-gold-400' : 'text-navy-400 hover:text-white'
              }`}>
              {s === '' ? 'Todas' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <MessageSquare className="w-8 h-8 text-navy-700 mx-auto mb-2" />
              <p className="text-navy-500 text-sm">
                {inquiries.length === 0 ? 'Aún no hay consultas' : 'Sin consultas en esta categoría'}
              </p>
            </div>
          ) : filtered.map((inq) => (
            <div key={inq.id} onClick={() => open(inq)}
              className={`card p-4 cursor-pointer transition-all duration-200 hover:border-gold-500/20 ${
                selected?.id === inq.id ? 'border-gold-500/30 bg-gold-500/5' : ''
              }`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-white text-sm font-semibold flex items-center gap-2">
                  {inq.name}
                  {inq.status === 'nueva' && (
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  )}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${STATUS_CONFIG[inq.status].className}`}>
                  {STATUS_CONFIG[inq.status].label}
                </span>
              </div>
              <p className="text-gold-400/70 text-xs mb-1 truncate">{inq.property}</p>
              <p className="text-navy-400 text-xs line-clamp-2 leading-relaxed">{inq.message}</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-navy-600" />
                <span className="text-navy-600 text-xs">{timeAgo(inq.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card p-6 space-y-5 sticky top-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg">{selected.name}</h2>
                  <p className="text-gold-400 text-sm mt-0.5">{selected.property}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 text-navy-500 hover:text-white hover:bg-white/5 rounded-lg transition-all lg:hidden">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800 border border-white/5 hover:border-gold-500/20 text-navy-300 hover:text-gold-400 text-sm transition-all">
                  <Phone className="w-4 h-4" />{selected.phone}
                </a>
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800 border border-white/5 hover:border-gold-500/20 text-navy-300 hover:text-gold-400 text-sm transition-all">
                  <Mail className="w-4 h-4" />{selected.email}
                </a>
              </div>

              <div className="bg-navy-800/60 border border-white/5 rounded-xl p-4">
                <p className="text-xs text-navy-500 mb-2 font-medium uppercase tracking-wider">Mensaje</p>
                <p className="text-navy-200 text-sm leading-relaxed">{selected.message}</p>
              </div>

              <div className="flex items-center gap-1.5 text-navy-600 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeAgo(selected.createdAt)} · {selected.createdAt.toLocaleString('es-VE')}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'').replace(/^0/,'58')}?text=${encodeURIComponent(`Hola ${selected.name}, le contactamos sobre su consulta inmobiliaria.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20b957] text-white text-sm font-semibold rounded-xl transition-all">
                  <MessageSquare className="w-4 h-4" />
                  Responder por WhatsApp
                </a>
                <button onClick={() => markAs(selected.id, 'respondida')}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-500/15 hover:bg-gold-500/25 text-gold-400 text-sm font-semibold rounded-xl border border-gold-500/25 transition-all">
                  <CheckCheck className="w-4 h-4" />
                  Marcar respondida
                </button>
                <button onClick={() => remove(selected.id)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-navy-500 hover:text-red-400 text-sm font-semibold rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-64">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 text-navy-700 mx-auto mb-3" />
                <p className="text-navy-500 text-sm">Selecciona una consulta para ver el detalle</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
