'use client';

import React from 'react';

interface BackgroundPatternProps {
  variant?: 'dots' | 'grid' | 'gradient';
  className?: string;
}

export default function BackgroundPattern({ 
  variant = 'dots', 
  className = '' 
}: BackgroundPatternProps) {
  const patterns = {
    dots: (
      <div className={`absolute inset-0 ${className}`}>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
    ),
    grid: (
      <div className={`absolute inset-0 ${className}`}>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
    ),
    gradient: (
      <div className={`absolute inset-0 ${className}`}>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>
    ),
  };

  return patterns[variant];
}
