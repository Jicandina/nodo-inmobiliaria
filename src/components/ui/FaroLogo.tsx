interface FaroLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function FaroLogo({ size = 36, className = '', showText: _showText = true }: FaroLogoProps) {
  const height = size * 2.2;
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo-elfaro.png"
        alt="El Faro Bienes Raíces"
        style={{
          height: `${height}px`,
          width: 'auto',
          filter: 'brightness(0) invert(1)',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
