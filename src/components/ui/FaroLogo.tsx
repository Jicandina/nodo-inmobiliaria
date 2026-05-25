interface FaroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function FaroLogo({ size = 36, className = '' }: FaroLogoProps) {
  const fontSize = Math.round(size * 0.45);
  return (
    <div className={`flex items-center ${className}`}>
      <div style={{
        background: 'white',
        borderRadius: '7px',
        padding: '5px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <div style={{
          width: `${Math.round(size * 0.6)}px`,
          height: `${Math.round(size * 0.6)}px`,
          background: '#030904',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#fbbf24', fontSize: `${Math.round(fontSize * 1.2)}px`, fontWeight: 900, lineHeight: 1 }}>I</span>
        </div>
        <span style={{
          color: '#030904',
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          lineHeight: 1,
        }}>
          Inmobiliaria
        </span>
      </div>
    </div>
  );
}
