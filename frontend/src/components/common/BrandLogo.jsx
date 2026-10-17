import React from 'react';
import { Link } from 'react-router-dom';

export const SparkleSymbol = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Central Spark */}
    <path
      d="M12 1.5L14 8.5L21 10.5L14 12.5L12 19.5L10 12.5L3 10.5L10 8.5L12 1.5Z"
      fill="url(#sparkleGoldGradient)"
    />
    {/* Micro Embers */}
    <circle cx="19" cy="4" r="1.5" fill="#F97316" />
    <circle cx="5" cy="18" r="1.5" fill="#F59E0B" />
    <circle cx="20" cy="18" r="1.2" fill="#FEF08A" />
    <circle cx="4" cy="5" r="1.2" fill="#FB923C" />
    <defs>
      <linearGradient id="sparkleGoldGradient" x1="3" y1="1.5" x2="21" y2="19.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
  </svg>
);

export const BrandLogo = ({ showTagline = true, isDark = true, size = 'default' }) => {
  const isLarge = size === 'large';

  return (
    <Link to="/" className="group inline-flex items-center gap-3 transition-opacity hover:opacity-95">
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-midnight-900 border border-festive-gold/30 shadow-gold group-hover:border-festive-gold/60 transition-all duration-300">
        <SparkleSymbol className={isLarge ? 'w-8 h-8' : 'w-6 h-6'} />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-festive-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-festive-orange"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-display tracking-wider font-extrabold text-slate-100">
          <span className={`tracking-widest ${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
            ROHAN
          </span>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r from-festive-gold via-amber-400 to-festive-orange ${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
            FIREWORKS
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-widest uppercase font-medium text-amber-300/70 font-sans -mt-0.5">
            Festive Celebrations • Safe Quality
          </span>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;
