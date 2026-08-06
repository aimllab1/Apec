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
      {/* ── LEFT CLASSIC ACADEMIC LAUREL WREATH ── */}
      <div className="absolute -left-6 sm:-left-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)]" 
          viewBox="0 0 38 52"
        >
          <defs>
            {/* 24k Gold Laurel Gradient */}
            <linearGradient id="goldLaurelTheme" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="35%" stopColor="#FFE79A" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Sweeping Laurel Vine Stem following capsule curve */}
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldLaurelTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          {/* Classic Academic Laurel Leaves with Crisp Dark Outlines */}
          <path d="M28 4C23 1 17 4 20 8.5C24 8.5 27 6.5 28 4Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M28 4C30 1 33 4 30.5 8.5C27 8.5 25 6.5 28 4Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M21 10.5C15 8 10 11.5 13.5 15.5C17.5 15.5 20.5 13 21 10.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 10.5C24 8 27.5 10 25.5 14.5C22.5 14.5 20 13 21 10.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M16 17.5C10 15 5 18.5 8.5 22.5C12.5 22.5 15.5 20 16 17.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16 17.5C19 15 22.5 17 20.5 21.5C17.5 21.5 15 20 16 17.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M14 24.5C8 22 3 25.5 6.5 29.5C10.5 29.5 13.5 27 14 24.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14 24.5C17 22 20.5 24 18.5 28.5C15.5 28.5 13 27 14 24.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M15.5 31.5C9.5 29 4.5 32.5 8 36.5C12 36.5 15 34 15.5 31.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15.5 31.5C18.5 29 22 31 20 35.5C17 35.5 14.5 34 15.5 31.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M20 38.5C14 36.5 9.5 40 13 43.5C17 43.5 19.5 41 20 38.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M20 38.5C23 36.5 26.5 38 24.5 42.5C21.5 42.5 19 41 20 38.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
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

      {/* ── RIGHT CLASSIC ACADEMIC LAUREL WREATH ── */}
      <div className="absolute -right-6 sm:-right-7.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-7.5 h-11 sm:w-9 sm:h-13 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.50)] transform scale-x-[-1]" 
          viewBox="0 0 38 52"
        >
          <path d="M28 4C12 10 8 36 28 44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 4C12 10 8 36 28 44" stroke="url(#goldLaurelTheme)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          
          <path d="M28 4C23 1 17 4 20 8.5C24 8.5 27 6.5 28 4Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M28 4C30 1 33 4 30.5 8.5C27 8.5 25 6.5 28 4Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M21 10.5C15 8 10 11.5 13.5 15.5C17.5 15.5 20.5 13 21 10.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M21 10.5C24 8 27.5 10 25.5 14.5C22.5 14.5 20 13 21 10.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M16 17.5C10 15 5 18.5 8.5 22.5C12.5 22.5 15.5 20 16 17.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M16 17.5C19 15 22.5 17 20.5 21.5C17.5 21.5 15 20 16 17.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M14 24.5C8 22 3 25.5 6.5 29.5C10.5 29.5 13.5 27 14 24.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M14 24.5C17 22 20.5 24 18.5 28.5C15.5 28.5 13 27 14 24.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M15.5 31.5C9.5 29 4.5 32.5 8 36.5C12 36.5 15 34 15.5 31.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M15.5 31.5C18.5 29 22 31 20 35.5C17 35.5 14.5 34 15.5 31.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />

          <path d="M20 38.5C14 36.5 9.5 40 13 43.5C17 43.5 19.5 41 20 38.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
          <path d="M20 38.5C23 36.5 26.5 38 24.5 42.5C21.5 42.5 19 41 20 38.5Z" fill="url(#goldLaurelTheme)" stroke="#78350F" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}
