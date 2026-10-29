import React from 'react';

interface LabLogoProps {
  variant?: 'horizontal' | 'compact' | 'symbol' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showDescriptor?: boolean;
}

export const LabLogo: React.FC<LabLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showDescriptor = true,
}) => {
  // Dimensions based on size
  const iconDimensions = {
    sm: { box: 32, fontNumber: '8px', fontSymbol: '18px' },
    md: { box: 42, fontNumber: '9px', fontSymbol: '23px' },
    lg: { box: 54, fontNumber: '11px', fontSymbol: '29px' },
    xl: { box: 68, fontNumber: '13px', fontSymbol: '36px' },
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const isMonochrome = variant === 'monochrome';

  // SVG Periodic table cell icon "31 Cl"
  const IconElement = (
    <svg
      width={iconDimensions.box}
      height={iconDimensions.box}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="Cokito's Lab Símbolo 31 Cl"
    >
      {/* Outer rounded container with subtle lab glow border */}
      <rect
        x="1.5"
        y="1.5"
        width="51"
        height="51"
        rx="9"
        fill={isMonochrome ? '#FFFFFF' : '#0B1F2D'}
        stroke={isMonochrome ? '#FFFFFF' : '#00D9F5'}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Atomic number 31 */}
      <text
        x="7.5"
        y="15.5"
        fill={isMonochrome ? '#0B1F2D' : '#00D9F5'}
        fontSize="9.5"
        fontFamily="var(--font-mono, monospace)"
        fontWeight="700"
        letterSpacing="0.05em"
      >
        31
      </text>
      {/* Stylized Chemical Symbol "Cl" */}
      <text
        x="27"
        y="39"
        textAnchor="middle"
        fill={isMonochrome ? '#0B1F2D' : '#00D9F5'}
        fontSize="28"
        fontFamily="var(--font-sans, sans-serif)"
        fontWeight="800"
        letterSpacing="-0.03em"
      >
        Cl
      </text>
      {/* Subtle indicator bar */}
      <rect
        x="37"
        y="8.5"
        width="9"
        height="2"
        rx="1"
        fill={isMonochrome ? '#0B1F2D' : '#00E3B2'}
        opacity="0.8"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {IconElement}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {IconElement}

      <div className="flex flex-col justify-center">
        <div className={`font-bold tracking-tight leading-none ${titleSizes} whitespace-nowrap`}>
          <span className={isMonochrome ? 'text-black' : 'text-[#F5FBFF]'}>COKITO'S </span>
          <span className={isMonochrome ? 'text-black' : 'text-[#00D9F5]'}>LAB</span>
        </div>

        {showDescriptor && variant === 'horizontal' && (
          <span
            className={`font-mono uppercase tracking-widest leading-none mt-1 ${
              size === 'sm' ? 'text-[8px]' : 'text-[9.5px]'
            } ${isMonochrome ? 'text-neutral-600' : 'text-[#F5FBFF]/60'}`}
          >
            LABORATORIO DE INNOVACIÓN Y TECNOLOGÍA APLICADA
          </span>
        )}
      </div>
    </div>
  );
};
