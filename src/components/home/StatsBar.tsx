import { useEffect, useRef, useState } from 'react';

const STATS = [
  { target: 600,  suffix: '+',     label: 'propiedades listadas' },
  { target: 3000, suffix: '+',     label: 'clientes atendidos', format: true },
  { target: 8,    suffix: '',      label: 'ciudades activas' },
  { target: 10,   suffix: ' años', label: 'de trayectoria' },
];

function Counter({ target, suffix, format, inView }: {
  target: number; suffix: string; format?: boolean; inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const startTime = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  const display = format ? count.toLocaleString('es-VE') : count;
  return <>{display}{suffix}</>;
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="border-y border-white/6 py-12">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/6"
      >
        {STATS.map(({ target, suffix, format, label }, i) => (
          <div key={label} className={`px-8 ${i === 0 ? 'pl-0' : ''} ${i === STATS.length - 1 ? 'pr-0' : ''}`}>
            <p className="font-display text-4xl md:text-5xl font-bold text-white tabular-nums leading-none">
              <Counter target={target} suffix={suffix} format={format} inView={inView} />
            </p>
            <p className="text-white/35 text-xs mt-2 tracking-wider uppercase">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
