import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, ArrowLeft, ImagePlus, X, Loader2, CheckCircle2, Star, Upload, Link as LinkIcon,
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { fetchProperty, createProperty, updateProperty } from '../../lib/api';
import type { PropertyType, OperationType } from '../../types/property';
import { VENEZUELAN_CITIES } from '../../types/property';

const PROPERTY_TYPES: PropertyType[] = ['apartamento', 'casa', 'local', 'oficina', 'terreno'];
const COMMON_AMENITIES = [
  'Piscina', 'Gimnasio', 'Seguridad 24/7', 'Planta Eléctrica', 'Agua 24/7',
  'Amoblado', 'Balcón', 'Terraza', 'Jardín', 'BBQ', 'Jacuzzi',
  'Generador', 'Cisterna', 'Ascensor', 'Portón Eléctrico', 'Depósito',
];

type FormData = {
  title: string; description: string; type: PropertyType; operation: OperationType;
  price: string; currency: string; city: string; zone: string; address: string;
  bedrooms: string; bathrooms: string; parking: string; area: string;
  amenities: string[]; featured: boolean; available: boolean;
  contactPhone: string; contactEmail: string;
};

const EMPTY: FormData = {
  title: '', description: '', type: 'apartamento', operation: 'venta',
  price: '', currency: 'USD', city: 'Caracas', zone: '', address: '',
  bedrooms: '', bathrooms: '', parking: '', area: '',
  amenities: [], featured: false, available: true,
  contactPhone: '', contactEmail: '',
};

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm]         = useState<FormData>(EMPTY);
  const [imageUrls, setImageUrls]     = useState<string[]>([]);
  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setProgress] = useState(0);
  const [loading, setLoading]         = useState(isEdit);
  const fileInputRef                  = useRef<HTMLInputElement>(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProperty(id).then((p) => {
      if (!p) return;
      setForm({
        title: p.title, description: p.description, type: p.type, operation: p.operation,
        price: String(p.price), currency: p.currency, city: p.location.city,
        zone: p.location.zone, address: p.location.address ?? '',
        bedrooms: String(p.features.bedrooms), bathrooms: String(p.features.bathrooms),
        parking: String(p.features.parking), area: String(p.features.area),
        amenities: p.amenities, featured: p.featured, available: p.available,
        contactPhone: p.contactPhone, contactEmail: p.contactEmail,
      });
      setImageUrls(p.images.length > 0 ? p.images : ['']);
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (key: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      setUploading(true);
      const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed',
        (snap) => setProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
        (err) => { console.error(err); setUploading(false); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setImageUrls((prev) => [...prev, url]);
          setUploading(false);
          setProgress(0);
        }
      );
    });
  };

  const toggleAmenity = (a: string) =>
    set('amenities', form.amenities.includes(a)
      ? form.amenities.filter((x) => x !== a)
      : [...form.amenities, a]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description,
        type: form.type, operation: form.operation,
        price: Number(form.price), currency: form.currency as 'USD' | 'EUR' | 'VES',
        location: { city: form.city, zone: form.zone, address: form.address },
        features: {
          bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
          parking: Number(form.parking), area: Number(form.area),
        },
        amenities: form.amenities,
        images: imageUrls.filter(Boolean),
        featured: form.featured, available: form.available,
        contactPhone: form.contactPhone, contactEmail: form.contactEmail,
        createdAt: new Date(), updatedAt: new Date(),
      };
      if (isEdit && id) await updateProperty(id, payload);
      else await createProperty(payload);
      setSaved(true);
      setTimeout(() => navigate('/admin/propiedades'), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 text-gold-400 animate-spin" />
      </div>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card p-6 space-y-4">
      <h2 className="text-white font-semibold border-b border-white/5 pb-3">{title}</h2>
      {children}
    </div>
  );

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs text-navy-400 font-medium mb-1.5">
        {label}{required && <span className="text-gold-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)}
          className="p-2 text-navy-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Editar propiedad' : 'Nueva propiedad'}
          </h1>
          <p className="text-navy-400 text-sm mt-0.5">
            {isEdit ? 'Modifica los datos de la propiedad' : 'Completa el formulario para publicar'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <Section title="Información básica">
          <Field label="Título de la propiedad" required>
            <input type="text" required value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ej: Apartamento de lujo en Altamira"
              className="input-field" />
          </Field>

          <Field label="Descripción" required>
            <textarea rows={4} required value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe la propiedad con detalle..."
              className="input-field resize-none" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de propiedad" required>
              <select value={form.type} onChange={(e) => set('type', e.target.value as PropertyType)}
                className="select-field">
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Operación" required>
              <select value={form.operation} onChange={(e) => set('operation', e.target.value as OperationType)}
                className="select-field">
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Price */}
        <Section title="Precio">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio" required>
              <input type="number" required min="0" value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0" className="input-field" />
            </Field>
            <Field label="Moneda">
              <select value={form.currency} onChange={(e) => set('currency', e.target.value)}
                className="select-field">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="VES">VES (Bs.)</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Location */}
        <Section title="Ubicación">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ciudad" required>
              <select value={form.city} onChange={(e) => set('city', e.target.value)}
                className="select-field">
                {VENEZUELAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Zona / Urbanización" required>
              <input type="text" required value={form.zone}
                onChange={(e) => set('zone', e.target.value)}
                placeholder="Ej: Altamira, Las Mercedes..."
                className="input-field" />
            </Field>
          </div>
          <Field label="Dirección completa">
            <input type="text" value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Ej: Av. Luis Roche, Res. Torre Ámbar, Piso 12"
              className="input-field" />
          </Field>
        </Section>

        {/* Features */}
        <Section title="Características">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { key: 'bedrooms',  label: 'Habitaciones' },
              { key: 'bathrooms', label: 'Baños' },
              { key: 'parking',   label: 'Estacionamientos' },
              { key: 'area',      label: 'Área (m²)' },
            ] as const).map(({ key, label }) => (
              <Field key={key} label={label}>
                <input type="number" min="0" value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder="0" className="input-field" />
              </Field>
            ))}
          </div>
        </Section>

        {/* Amenities */}
        <Section title="Amenidades">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMMON_AMENITIES.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  form.amenities.includes(a)
                    ? 'border-gold-500/50 bg-gold-500/10 text-gold-300'
                    : 'border-white/10 bg-navy-800/40 text-navy-400 hover:border-navy-600 hover:text-navy-200'
                }`}>
                {a}
              </button>
            ))}
          </div>
        </Section>

        {/* Images */}
        <Section title="Fotos de la propiedad">
          {/* Upload zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
            className="border-2 border-dashed border-navy-700 hover:border-gold-500/50 rounded-xl p-8 text-center cursor-pointer transition-all group">
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)} />
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
                <p className="text-navy-400 text-sm">Subiendo... {uploadProgress}%</p>
                <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-navy-600 group-hover:text-gold-400 mx-auto mb-2 transition-colors" />
                <p className="text-navy-400 text-sm">Arrastra fotos aquí o <span className="text-gold-400">haz clic para seleccionar</span></p>
                <p className="text-navy-600 text-xs mt-1">JPG, PNG, WebP — múltiples archivos</p>
              </>
            )}
          </div>

          {/* URL manual */}
          <details className="group">
            <summary className="flex items-center gap-2 text-xs text-navy-500 hover:text-navy-300 cursor-pointer transition-colors list-none">
              <LinkIcon className="w-3.5 h-3.5" />
              O añadir por URL
            </summary>
            <div className="mt-2 flex gap-2">
              <input type="url" id="urlInput" placeholder="https://..." className="input-field flex-1 text-sm" />
              <button type="button"
                onClick={() => {
                  const input = document.getElementById('urlInput') as HTMLInputElement;
                  if (input.value) { setImageUrls(prev => [...prev, input.value]); input.value = ''; }
                }}
                className="btn-navy text-xs py-2 px-3">Añadir</button>
            </div>
          </details>

          {/* Preview grid */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group/img aspect-video rounded-lg overflow-hidden bg-navy-800">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                      className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[9px] bg-gold-500 text-navy-950 font-bold px-1.5 py-0.5 rounded">
                      PORTADA
                    </span>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-lg border-2 border-dashed border-navy-700 hover:border-gold-500/40 flex items-center justify-center transition-all">
                <ImagePlus className="w-5 h-5 text-navy-600" />
              </button>
            </div>
          )}
        </Section>

        {/* Contact */}
        <Section title="Datos de contacto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono de contacto">
              <input type="tel" value={form.contactPhone}
                onChange={(e) => set('contactPhone', e.target.value)}
                placeholder="+58 412-000-0000" className="input-field" />
            </Field>
            <Field label="Correo de contacto">
              <input type="email" value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="info@inmobiliaria.com.ve" className="input-field" />
            </Field>
          </div>
        </Section>

        {/* Options */}
        <Section title="Opciones de publicación">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set('featured', !form.featured)}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-gold-500' : 'bg-navy-700'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.featured ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold-400" />
                  <span className="text-white text-sm font-medium">Propiedad destacada</span>
                </div>
                <p className="text-navy-500 text-xs">Aparece primero en el listado</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set('available', !form.available)}
                className={`w-10 h-6 rounded-full transition-colors relative ${form.available ? 'bg-green-500' : 'bg-navy-700'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.available ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="text-white text-sm font-medium">Disponible</span>
                <p className="text-navy-500 text-xs">Visible en el sitio web</p>
              </div>
            </label>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-navy px-6">
            Cancelar
          </button>
          <button type="submit" disabled={saving || saved}
            className="btn-primary px-8 disabled:opacity-70">
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Guardado</>
            ) : saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-4 h-4" /> {isEdit ? 'Guardar cambios' : 'Publicar propiedad'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
