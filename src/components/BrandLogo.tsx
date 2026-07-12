'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
}

export default function BrandLogo({ size = 'md', showText = true }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
    '2xl': 'text-6xl'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const logoSize = {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 96
  };

  return (
    <div className="flex items-center gap-3">
      {/* Actual Logo Image */}
      <div className="relative">
        <Image
          src="https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614050/ICONO_LOGO_TOSKA_WEBSITE_xblglk.png"
          alt="Toska CR Logo"
          width={72}
          height={72}
          className="object-contain"
          priority
        />
      </div>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-brand-bold text-brand-primary-pink uppercase tracking-widest leading-tight`}>
            TOSKA
          </span>
          <span className={`${textSizeClasses[size]} font-brand-condensed text-brand-primary-pink/80 uppercase tracking-wider text-xs leading-tight`}>
            ART PROJECT
          </span>
        </div>
      )}
    </div>
  );
}

// Language icon for header dropdown
export function LanguagesIcon() {
  return (
    <div className="relative p-1 hover:opacity-80 transition-opacity duration-300">
      <Image
        src="https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614049/ICONO_LANGUAGE_WEBSITE_zaxiq0.png"
        alt="Language selector"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  );
}
