import React from 'react';
import { Link } from 'react-router-dom';

export const SparkleSymbol = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M12 1.5L14 8.5L21 10.5L14 12.5L12 19.5L10 12.5L3 10.5L10 8.5L12 1.5Z"
      fill="url(#sparkleGoldGradient)"
    />
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

/**
 * Official BrandLogo component for Rohan Fireworks
 * Uses the official brand asset with responsive scaling and exact aspect-ratio preservation.
 */
export const BrandLogo = ({
  size = 'default',
  variant = 'full',
  className = '',
  isLink = true,
  alt = 'Rohan Fireworks logo',
  showTagline = true, // Maintained for backwards compatibility
  isDark = true,
}) => {
  // Sizing definitions for horizontal full brand logo (1024x341 aspect ratio)
  const fullSizeClasses = {
    small: 'h-8 sm:h-9 max-w-[150px] sm:max-w-[170px]',
    compact: 'h-9 max-w-[170px]',
    default: 'h-10 sm:h-11 md:h-12 max-w-[180px] sm:max-w-[210px] md:max-w-[230px]',
    navbar: 'h-10 sm:h-12 md:h-13 max-w-[180px] sm:max-w-[220px] md:max-w-[250px]',
    footer: 'h-12 sm:h-14 md:h-16 max-w-[240px] sm:max-w-[280px]',
    large: 'h-16 sm:h-20 md:h-24 max-w-[300px] sm:max-w-[380px] md:max-w-[440px]',
  };

  // Sizing definitions for square emblem variant (rohan-icon.png)
  const iconSizeClasses = {
    small: 'w-8 h-8',
    compact: 'w-9 h-9',
    default: 'w-10 h-10 sm:w-11 sm:h-11',
    navbar: 'w-10 h-10 sm:w-12 sm:h-12',
    footer: 'w-12 h-12 sm:w-14 sm:h-14',
    large: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const imageSrc = variant === 'icon' ? '/rohan-icon.png' : '/rohan-fireworks-logo.png';
  const appliedClass = variant === 'icon'
    ? (iconSizeClasses[size] || iconSizeClasses.default)
    : (fullSizeClasses[size] || fullSizeClasses.default);

  const imageContent = (
    <div className={`relative inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02] ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`${appliedClass} w-auto object-contain select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]`}
        loading="eager"
        decoding="async"
      />
    </div>
  );

  if (!isLink) {
    return imageContent;
  }

  return (
    <Link
      to="/"
      className="group inline-flex items-center transition-all duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-festive-gold/50 rounded-lg"
      aria-label="Rohan Fireworks — Return to Home"
    >
      {imageContent}
    </Link>
  );
};

export default BrandLogo;
