interface FaroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function FaroLogo({ size = 36, className = '' }: FaroLogoProps) {
  const mark = Math.round(size * 0.9);
  const textSize = Math.round(size * 0.38);
  const taglineSize = Math.round(size * 0.22);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric mark — gold square with architectural keyhole */}
      <svg width={mark} height={mark} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#C9A84C" />
        {/* Two columns — architecture / building motif */}
        <rect x="9"  y="14" width="6" height="18" rx="1" fill="#030904" />
        <rect x="17" y="10" width="6" height="22" rx="1" fill="#030904" />
        <rect x="25" y="14" width="6" height="18" rx="1" fill="#030904" />
        {/* Baseline */}
        <rect x="7" y="33" width="26" height="2" rx="1" fill="#030904" />
        {/* Roof line */}
        <rect x="7" y="12" width="26" height="2" rx="1" fill="#030904" opacity="0.35" />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span style={{
          color: '#ffffff',
          fontSize: `${textSize}px`,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          lineHeight: 1,
        }}>
          Inmobiliaria
        </span>
        <span style={{
          color: '#C9A84C',
          fontSize: `${taglineSize}px`,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          lineHeight: 1,
          marginTop: '3px',
        }}>
          Venezuela
        </span>
      </div>
    </div>
  );
}
