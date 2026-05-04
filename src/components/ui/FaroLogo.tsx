interface FaroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function FaroLogo({ size = 36, className = '', showText = true }: FaroLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Lighthouse SVG icon */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow */}
        <circle cx="20" cy="20" r="18" fill="url(#glowBg)" opacity="0.3" />
        {/* Base */}
        <path d="M13 36 L27 36 L24 28 L16 28 Z" fill="#1b2b4a" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Tower body */}
        <path d="M16 28 L24 28 L22 14 L18 14 Z" fill="#2b3f6a" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Stripes */}
        <path d="M16.5 26 L23.5 26 L23.2 24 L16.8 24 Z" fill="#f59e0b" opacity="0.5" />
        <path d="M17.5 21 L22.5 21 L22.2 19 L17.8 19 Z" fill="#f59e0b" opacity="0.4" />
        {/* Lantern room */}
        <rect x="17" y="10" width="6" height="5" rx="1" fill="#1b2b4a" stroke="#f59e0b" strokeWidth="0.8" />
        {/* Light rays */}
        <line x1="20" y1="9" x2="20" y2="5" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="9" x2="14" y2="6" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <line x1="20" y1="9" x2="26" y2="6" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        <line x1="20" y1="9" x2="11" y2="8" stroke="#fbbf24" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
        <line x1="20" y1="9" x2="29" y2="8" stroke="#fbbf24" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
        {/* Top */}
        <circle cx="20" cy="12" r="2" fill="#f59e0b" />
        {/* Water */}
        <path d="M8 36 Q12 34 16 36 Q20 38 24 36 Q28 34 32 36" stroke="#507099" strokeWidth="1" fill="none" opacity="0.6" />
        <defs>
          <radialGradient id="glowBg" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#1b2b4a" />
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="leading-none">
          <span className="font-display font-bold text-white text-xl tracking-wide">
            El <span className="text-gold-400">Faro</span>
          </span>
          <p className="text-navy-400 text-[9px] font-medium tracking-[0.2em] uppercase mt-0.5">
            Inmobiliaria
          </p>
        </div>
      )}
    </div>
  );
}
