interface FaroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function FaroLogo({ size = 36, className = '' }: FaroLogoProps) {
  const height = Math.round(size * 1.8);
  return (
    <div className={`flex items-center ${className}`}>
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '4px 10px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/logo-elfaro.png"
          alt="El Faro Bienes Raíces"
          style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </div>
    </div>
  );
}
