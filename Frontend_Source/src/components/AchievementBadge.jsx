import React from 'react';

/**
 * Premium Glassmorphism Achievement Badge Component
 * 
 * Features:
 * - Horizontal capsule (pill) shape with rounded-[9999px]
 * - Transparent black glass background with 12px backdrop blur
 * - Thin premium gold gradient border (#8D5C18 → #E3B54C → #8D5C18)
 * - Soft golden outer glow & interactive hover state
 * - Golden laurel leaves positioned symmetrically on both sides
 * - Playfair Display serif typography with bold white "42" and white italic text
 * - Shimmer sweep animation across the border on hover
 */
export default function AchievementBadge({ 
  years = 42, 
  text = "Years of Academic Excellence",
  className = "" 
}) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center my-1.5 group select-none cursor-default ${className}`}
      role="status"
      aria-label={`${years} ${text}`}
    >
      {/* ── LEFT VICTORIAN PALM FROND WREATH ── */}
      <div className="absolute -left-6 sm:-left-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)]" 
          viewBox="0 0 38 52"
        >
          <defs>
            {/* 24k Gold Palm Frond Gradient */}
            <linearGradient id="goldPalmTheme" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="35%" stopColor="#FFE79A" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Sweeping Palm Spine following capsule curve */}
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldPalmTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Radiating Slender Palm Pinnae Leaves with Dark Outlines */}
          <path d="M28 4C20 1 12 5 18 9C23 9 26 6.5 28 4Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M23 8.5C15 6 7 10 13 14.5C18.5 14.5 21.5 11.5 23 8.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M18 14.5C10 12 3 16 9 20.5C14.5 20.5 17.5 17.5 18 14.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15 21.5C7 19 1 23 6.5 27.5C12 27.5 14.5 24.5 15 21.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14.5 28.5C6.5 26 0.5 30 6 34.5C11.5 34.5 14 31.5 14.5 28.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16.5 35.5C8.5 33 2.5 37 8 41.5C13.5 41.5 16 38.5 16.5 35.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 41.5C13.5 39.5 8 43.5 13.5 47.5C18.5 47.5 20.5 44.5 21 41.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
        </svg>
      </div>

      {/* ── CAPSULE CONTAINER (Compact Sleek 1px Gradient Border + Black Glass Background) ── */}
      <div className="relative p-[1.5px] rounded-[9999px] bg-gradient-to-r from-[#8D5C18] via-[#E3B54C] to-[#8D5C18] shadow-[0_0_20px_rgba(245,158,11,0.40)] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_35px_rgba(251,191,36,0.75)] group-hover:from-[#E3B54C] group-hover:via-[#FFE79A] group-hover:to-[#E3B54C] overflow-hidden z-10">
        
        {/* Animated Golden Shimmer Beam across the border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Inner Transparent Black Glass Layer — Reduced Padding & Sleek Typography */}
        <div className="px-4 sm:px-5.5 py-1.5 sm:py-2 rounded-[9999px] bg-black/60 backdrop-blur-[12px] flex items-center justify-center gap-1.5 transition-colors duration-500 group-hover:bg-black/70">
          <span className="font-serif font-extrabold text-white text-xs sm:text-sm md:text-base tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {years}
          </span>
          <span className="font-serif italic font-normal text-white text-[11px] sm:text-xs md:text-sm tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {text}
          </span>
        </div>
      </div>

      {/* ── RIGHT VICTORIAN PALM FROND WREATH ── */}
      <div className="absolute -right-6 sm:-right-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)] transform scale-x-[-1]" 
          viewBox="0 0 38 52"
        >
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldPalmTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          <path d="M28 4C20 1 12 5 18 9C23 9 26 6.5 28 4Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M23 8.5C15 6 7 10 13 14.5C18.5 14.5 21.5 11.5 23 8.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M18 14.5C10 12 3 16 9 20.5C14.5 20.5 17.5 17.5 18 14.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15 21.5C7 19 1 23 6.5 27.5C12 27.5 14.5 24.5 15 21.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14.5 28.5C6.5 26 0.5 30 6 34.5C11.5 34.5 14 31.5 14.5 28.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16.5 35.5C8.5 33 2.5 37 8 41.5C13.5 41.5 16 38.5 16.5 35.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 41.5C13.5 39.5 8 43.5 13.5 47.5C18.5 47.5 20.5 44.5 21 41.5Z" fill="url(#goldPalmTheme)" stroke="#78350F" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}
