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
      {/* ── LEFT CLASSICAL OLIVE BRANCH SHEAF ── */}
      <div className="absolute -left-6 sm:-left-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)]" 
          viewBox="0 0 38 52"
        >
          <defs>
            {/* 24k Gold Olive Branch Gradient */}
            <linearGradient id="goldOliveTheme" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="35%" stopColor="#FFE79A" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Sweeping Olive Branch Stem following capsule curve */}
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldOliveTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Smooth Curved Olive Leaves */}
          <path d="M28 4C22 2 16 6 20 10C24 10 27 7 28 4Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 10.5C15 8.5 9.5 12.5 13.5 16.5C17.5 16.5 20.5 13.5 21 10.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16 17.5C10 15.5 4.5 19.5 8.5 23.5C12.5 23.5 15.5 20.5 16 17.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14 24.5C8 22.5 2.5 26.5 6.5 30.5C10.5 30.5 13.5 27.5 14 24.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15.5 31.5C9.5 29.5 4 33.5 8 37.5C12 37.5 15 34.5 15.5 31.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M20 38.5C14 36.5 8.5 40.5 12.5 44.5C16.5 44.5 19.5 41.5 20 38.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />

          {/* Subtle 24k Gold Berry Accents */}
          <circle cx="23" cy="8" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="17" cy="14" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="12" cy="21" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="10" cy="28" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="11" cy="35" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
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

      {/* ── RIGHT CLASSICAL OLIVE BRANCH SHEAF ── */}
      <div className="absolute -right-6 sm:-right-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)] transform scale-x-[-1]" 
          viewBox="0 0 38 52"
        >
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldOliveTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          <path d="M28 4C22 2 16 6 20 10C24 10 27 7 28 4Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 10.5C15 8.5 9.5 12.5 13.5 16.5C17.5 16.5 20.5 13.5 21 10.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16 17.5C10 15.5 4.5 19.5 8.5 23.5C12.5 23.5 15.5 20.5 16 17.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14 24.5C8 22.5 2.5 26.5 6.5 30.5C10.5 30.5 13.5 27.5 14 24.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15.5 31.5C9.5 29.5 4 33.5 8 37.5C12 37.5 15 34.5 15.5 31.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M20 38.5C14 36.5 8.5 40.5 12.5 44.5C16.5 44.5 19.5 41.5 20 38.5Z" fill="url(#goldOliveTheme)" stroke="#78350F" strokeWidth="0.8" />

          <circle cx="23" cy="8" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="17" cy="14" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="12" cy="21" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="10" cy="28" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
          <circle cx="11" cy="35" r="2.2" fill="#FFE79A" stroke="#78350F" strokeWidth="0.6" />
        </svg>
      </div>
    </div>
  );
}
