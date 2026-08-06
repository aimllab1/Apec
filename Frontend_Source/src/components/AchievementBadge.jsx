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
      {/* ── LEFT CURVED WHEAT PADDY EAR (Tightly Hugging Capsule Curve) ── */}
      <div className="absolute -left-5 sm:-left-6.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-6 h-9 sm:w-7.5 sm:h-11 text-[#E3B54C] drop-shadow-[0_2px_8px_rgba(227,181,76,0.60)]" 
          viewBox="0 0 36 50" 
          fill="currentColor"
        >
          {/* Accentuated Tightly Curved Main Stem */}
          <path d="M30 46C14 36 6 22 12 4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          
          {/* Tightly Arc-fitted Golden Grains */}
          <path d="M12 4C9 2 6 4 7.5 7.5C10 7.5 12.5 5.5 12 4Z" />
          <path d="M10.5 10.5C7 8 3.5 10.5 5 14.5C8.5 14.5 11 12.5 10.5 10.5Z" />
          <path d="M11.5 17.5C8 15 4.5 17.5 6 21.5C9.5 21.5 12 19.5 11.5 17.5Z" />
          <path d="M14 24.5C10.5 22 7 24.5 8.5 28.5C12 28.5 14.5 26.5 14 24.5Z" />
          <path d="M17.5 31.5C14 29 10.5 31.5 12 35.5C15.5 35.5 18 33.5 17.5 31.5Z" />
          <path d="M22 38.5C18.5 36 15 38.5 16.5 42.5C20 42.5 22.5 40.5 22 38.5Z" />

          {/* Radiating Paddy Awns */}
          <path d="M7.5 7.5L2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5 14.5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6 21.5L1.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8.5 28.5L3.5 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 35.5L7 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          {/* Symmetric Inner Grains */}
          <path d="M12 4C15 2 18 4 16.5 7.5C14 7.5 12 5.5 12 4Z" />
          <path d="M12.5 10.5C16 8 19.5 10.5 18 14.5C14.5 14.5 12.5 12.5 12.5 10.5Z" />
          <path d="M13.5 17.5C17 15 20.5 17.5 19 21.5C15.5 21.5 13.5 19.5 13.5 17.5Z" />
          <path d="M16 24.5C19.5 22 23 24.5 21.5 28.5C18 28.5 16 26.5 16 24.5Z" />
          <path d="M19.5 31.5C23 29 26.5 31.5 25 35.5C21.5 35.5 19.5 33.5 19.5 31.5Z" />
        </svg>
      </div>

      {/* ── CAPSULE CONTAINER (Compact Sleek 1px Gradient Border + Black Glass Background) ── */}
      <div className="relative p-[1.5px] rounded-[9999px] bg-gradient-to-r from-[#8D5C18] via-[#E3B54C] to-[#8D5C18] shadow-[0_0_16px_rgba(227,181,76,0.25)] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_0_28px_rgba(227,181,76,0.55)] group-hover:from-[#E3B54C] group-hover:via-[#FFE79A] group-hover:to-[#E3B54C] overflow-hidden z-10">
        
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

      {/* ── RIGHT CURVED WHEAT PADDY EAR (Tightly Hugging Capsule Curve) ── */}
      <div className="absolute -right-5 sm:-right-6.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-6 h-9 sm:w-7.5 sm:h-11 text-[#E3B54C] drop-shadow-[0_2px_8px_rgba(227,181,76,0.60)] transform scale-x-[-1]" 
          viewBox="0 0 36 50" 
          fill="currentColor"
        >
          <path d="M30 46C14 36 6 22 12 4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          
          <path d="M12 4C9 2 6 4 7.5 7.5C10 7.5 12.5 5.5 12 4Z" />
          <path d="M10.5 10.5C7 8 3.5 10.5 5 14.5C8.5 14.5 11 12.5 10.5 10.5Z" />
          <path d="M11.5 17.5C8 15 4.5 17.5 6 21.5C9.5 21.5 12 19.5 11.5 17.5Z" />
          <path d="M14 24.5C10.5 22 7 24.5 8.5 28.5C12 28.5 14.5 26.5 14 24.5Z" />
          <path d="M17.5 31.5C14 29 10.5 31.5 12 35.5C15.5 35.5 18 33.5 17.5 31.5Z" />
          <path d="M22 38.5C18.5 36 15 38.5 16.5 42.5C20 42.5 22.5 40.5 22 38.5Z" />

          <path d="M7.5 7.5L2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5 14.5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6 21.5L1.5 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8.5 28.5L3.5 23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 35.5L7 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          <path d="M12 4C15 2 18 4 16.5 7.5C14 7.5 12 5.5 12 4Z" />
          <path d="M12.5 10.5C16 8 19.5 10.5 18 14.5C14.5 14.5 12.5 12.5 12.5 10.5Z" />
          <path d="M13.5 17.5C17 15 20.5 17.5 19 21.5C15.5 21.5 13.5 19.5 13.5 17.5Z" />
          <path d="M16 24.5C19.5 22 23 24.5 21.5 28.5C18 28.5 16 26.5 16 24.5Z" />
          <path d="M19.5 31.5C23 29 26.5 31.5 25 35.5C21.5 35.5 19.5 33.5 19.5 31.5Z" />
        </svg>
      </div>
    </div>
  );
}
