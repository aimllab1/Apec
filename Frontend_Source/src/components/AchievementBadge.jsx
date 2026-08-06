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
      className={`relative inline-flex items-center justify-center my-3 group select-none cursor-default ${className}`}
      role="status"
      aria-label={`${years} ${text}`}
    >
      {/* ── LEFT WHEAT PADDY EAR (Positioned Symmetrically Outside Capsule) ── */}
      <div className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-1 group-hover:scale-105">
        <svg 
          className="w-8 h-12 sm:w-10 sm:h-14 text-[#E3B54C] drop-shadow-[0_2px_12px_rgba(227,181,76,0.65)]" 
          viewBox="0 0 36 52" 
          fill="currentColor"
        >
          {/* Curved Main Paddy Stalk */}
          <path d="M30 48C18 39 10 26 12 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          
          {/* Plump Golden Paddy Grains along curvature */}
          <path d="M12 4C9 2 6 4 7.5 7.5C10 7.5 12.5 5.5 12 4Z" />
          <path d="M11 11C7.5 8.5 4 11 5.5 15C9 15 11.5 13 11 11Z" />
          <path d="M12.5 18C9 15.5 5.5 18 7 22C10.5 22 13 20 12.5 18Z" />
          <path d="M15 25C11.5 22.5 8 25 9.5 29C13 29 15.5 27 15 25Z" />
          <path d="M18.5 32C15 29.5 11.5 32 13 36C16.5 36 19 34 18.5 32Z" />
          <path d="M23 39C19.5 36.5 16 39 17.5 43C21 43 23.5 41 23 39Z" />

          {/* Radiating Paddy Awns (Spikes) */}
          <path d="M7.5 7.5L2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5.5 15L1 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M7 22L2 16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 29L4 23.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 36L7.5 30.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          {/* Symmetric Inner Grains */}
          <path d="M12 4C15 2 18 4 16.5 7.5C14 7.5 12 5.5 12 4Z" />
          <path d="M13 11C16.5 8.5 20 11 18.5 15C15 15 13 13 13 11Z" />
          <path d="M14.5 18C18 15.5 21.5 18 20 22C16.5 22 14.5 20 14.5 18Z" />
          <path d="M17 25C20.5 22.5 24 25 22.5 29C19 29 17 27 17 25Z" />
          <path d="M20.5 32C24 29.5 27.5 32 26 36C22.5 36 20.5 34 20.5 32Z" />
        </svg>
      </div>

      {/* ── CAPSULE CONTAINER (1px Gradient Border + Black Glass Background) ── */}
      <div className="relative p-[1.5px] rounded-[9999px] bg-gradient-to-r from-[#8D5C18] via-[#E3B54C] to-[#8D5C18] shadow-[0_0_20px_rgba(227,181,76,0.30)] transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_0_35px_rgba(227,181,76,0.65)] group-hover:from-[#E3B54C] group-hover:via-[#FFE79A] group-hover:to-[#E3B54C] overflow-hidden z-10">
        
        {/* Animated Golden Shimmer Beam across the border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Inner Transparent Black Glass Layer */}
        <div className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-[9999px] bg-black/60 backdrop-blur-[12px] flex items-center justify-center gap-1.5 transition-colors duration-500 group-hover:bg-black/70">
          <span className="font-serif font-extrabold text-white text-sm sm:text-base md:text-lg tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {years}
          </span>
          <span className="font-serif italic font-normal text-white text-xs sm:text-sm md:text-base tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {text}
          </span>
        </div>
      </div>

      {/* ── RIGHT WHEAT PADDY EAR (Positioned Symmetrically Outside Capsule) ── */}
      <div className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-1 group-hover:scale-105">
        <svg 
          className="w-8 h-12 sm:w-10 sm:h-14 text-[#E3B54C] drop-shadow-[0_2px_12px_rgba(227,181,76,0.65)] transform scale-x-[-1]" 
          viewBox="0 0 36 52" 
          fill="currentColor"
        >
          <path d="M30 48C18 39 10 26 12 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M12 4C9 2 6 4 7.5 7.5C10 7.5 12.5 5.5 12 4Z" />
          <path d="M11 11C7.5 8.5 4 11 5.5 15C9 15 11.5 13 11 11Z" />
          <path d="M12.5 18C9 15.5 5.5 18 7 22C10.5 22 13 20 12.5 18Z" />
          <path d="M15 25C11.5 22.5 8 25 9.5 29C13 29 15.5 27 15 25Z" />
          <path d="M18.5 32C15 29.5 11.5 32 13 36C16.5 36 19 34 18.5 32Z" />
          <path d="M23 39C19.5 36.5 16 39 17.5 43C21 43 23.5 41 23 39Z" />

          <path d="M7.5 7.5L2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5.5 15L1 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M7 22L2 16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 29L4 23.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 36L7.5 30.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

          <path d="M12 4C15 2 18 4 16.5 7.5C14 7.5 12 5.5 12 4Z" />
          <path d="M13 11C16.5 8.5 20 11 18.5 15C15 15 13 13 13 11Z" />
          <path d="M14.5 18C18 15.5 21.5 18 20 22C16.5 22 14.5 20 14.5 18Z" />
          <path d="M17 25C20.5 22.5 24 25 22.5 29C19 29 17 27 17 25Z" />
          <path d="M20.5 32C24 29.5 27.5 32 26 36C22.5 36 20.5 34 20.5 32Z" />
        </svg>
      </div>
    </div>
  );
}
