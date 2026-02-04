
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md", theme = "light" }) => {
  const sizes = {
    sm: "h-6",
    md: "h-10",
    lg: "h-24"
  };

  const textColor = theme === 'light' ? '#0f2a4a' : '#f8fafc';

  return (
    <div className={`flex items-center gap-2 ${sizes[size]} ${className}`}>
      <svg viewBox="0 0 400 120" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Carrinho de Compras Cromado */}
        <g id="cart">
          <path d="M40 30H60L80 90H140" stroke={theme === 'light' ? "#94a3b8" : "#475569"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M60 45H155L145 80H80" stroke={theme === 'light' ? "#cbd5e1" : "#64748b"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="95" cy="105" r="8" fill={theme === 'light' ? "#64748b" : "#94a3b8"}/>
          <circle cx="130" cy="105" r="8" fill={theme === 'light' ? "#64748b" : "#94a3b8"}/>
          
          {/* Groceries inside cart */}
          <circle cx="75" cy="35" r="10" fill="#4ade80"/>
          <circle cx="95" cy="35" r="10" fill="#f87171"/>
          <rect x="110" y="25" width="15" height="20" rx="2" fill="#60a5fa"/>
          <path d="M85 55L100 70" stroke="#fb923c" strokeWidth="8" strokeLinecap="round"/>
          <path d="M110 55C120 55 135 65 140 75" stroke="#facc15" strokeWidth="6" strokeLinecap="round"/>
        </g>

        {/* Fundo da Pílula (Pill Shape) */}
        <rect x="140" y="45" width="240" height="50" rx="25" fill={theme === 'light' ? "white" : "#1e293b"} filter="url(#shadow)"/>
        
        {/* Texto mercadoPLUS */}
        <text x="160" y="82" fontFamily="Lexend, sans-serif" fontWeight="900" fontSize="36" fill={textColor}>mercado</text>
        <text x="315" y="82" fontFamily="Lexend, sans-serif" fontWeight="900" fontSize="36" fill="#10b981">PLUS</text>

        {/* Swoosh Laranja */}
        <path d="M180 95C220 115 280 115 320 95" stroke="#f97316" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M310 50L325 40L330 55" fill="#f97316"/>

        <defs>
          <filter id="shadow" x="130" y="40" width="260" height="70" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="3"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_9"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3_9" result="shape"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
