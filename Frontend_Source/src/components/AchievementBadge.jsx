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
      {/* ── LEFT CURVED WHEAT PADDY EAR (Precision Arc Matching Capsule Curve + Gold Glow) ── */}
      <div className="absolute -left-5 sm:-left-6.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-6.5 h-10 sm:w-8 sm:h-12 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(245,158,11,0.85)] drop-shadow-[0_0_18px_rgba(251,191,36,0.60)]" 
          viewBox="0 0 36 50" 
          fill="currentColor"
        >
          {/* Stem following the exact semi-circular curve of the capsule end */}
          <path d="M28 4C12 8 6 36 28 44" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          
          {/* Paddy Grains following capsule semi-circle */}
          <path d="M28 4C24 2 20 4.5 22 7.5C24.5 7.5 27 6 28 4Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M22 10.5C18 8 14.5 10.5 16 14.5C19.5 14.5 22 12.5 22 10.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />
          <path d="M17.5 17.5C13.5 15.5 10 18 11.5 22C15 22 17.5 20 17.5 17.5Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M16 25C12 23 8.5 25.5 10 29.5C13.5 29.5 16 27.5 16 25Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />
          <path d="M18.5 32.5C14.5 30.5 11 33 12.5 37C16 37 18.5 35 18.5 32.5Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M24 39.5C20 37.5 16.5 40 18 43.5C21.5 43.5 24 41.5 24 39.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />

          {/* Radiating Glowing Awns */}
          <path d="M22 7.5L16 2" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M16 14.5L10 9" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M11.5 22L5.5 16.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10 29.5L4 24" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12.5 37L6.5 31.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Inner Accent Grains */}
          <path d="M28 4C30 2 32 4 30.5 7.5C28 7.5 27 5.5 28 4Z" fill="#FEF08A" />
          <path d="M22 10.5C25 8.5 27.5 11 26 14.5C23 14.5 21 12.5 22 10.5Z" fill="#FEF08A" />
          <path d="M17.5 17.5C20.5 15.5 23 18 21.5 22C18.5 22 16.5 20 17.5 17.5Z" fill="#FEF08A" />
          <path d="M16 25C19 23 21.5 25.5 20 29.5C17 29.5 15 27.5 16 25Z" fill="#FEF08A" />
          <path d="M18.5 32.5C21.5 30.5 24 33 22.5 37C19.5 37 17.5 35 18.5 32.5Z" fill="#FEF08A" />
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

      {/* ── RIGHT CURVED WHEAT PADDY EAR (Precision Arc Matching Capsule Curve + Gold Glow) ── */}
      <div className="absolute -right-5 sm:-right-6.5 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:scale-105">
        <svg 
          className="w-6.5 h-10 sm:w-8 sm:h-12 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(245,158,11,0.85)] drop-shadow-[0_0_18px_rgba(251,191,36,0.60)] transform scale-x-[-1]" 
          viewBox="0 0 36 50" 
          fill="currentColor"
        >
          <path d="M28 4C12 8 6 36 28 44" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          
          <path d="M28 4C24 2 20 4.5 22 7.5C24.5 7.5 27 6 28 4Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M22 10.5C18 8 14.5 10.5 16 14.5C19.5 14.5 22 12.5 22 10.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />
          <path d="M17.5 17.5C13.5 15.5 10 18 11.5 22C15 22 17.5 20 17.5 17.5Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M16 25C12 23 8.5 25.5 10 29.5C13.5 29.5 16 27.5 16 25Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />
          <path d="M18.5 32.5C14.5 30.5 11 33 12.5 37C16 37 18.5 35 18.5 32.5Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.6" />
          <path d="M24 39.5C20 37.5 16.5 40 18 43.5C21.5 43.5 24 41.5 24 39.5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.6" />

          <path d="M22 7.5L16 2" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M16 14.5L10 9" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M11.5 22L5.5 16.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10 29.5L4 24" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12.5 37L6.5 31.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />

          <path d="M28 4C30 2 32 4 30.5 7.5C28 7.5 27 5.5 28 4Z" fill="#FEF08A" />
          <path d="M22 10.5C25 8.5 27.5 11 26 14.5C23 14.5 21 12.5 22 10.5Z" fill="#FEF08A" />
          <path d="M17.5 17.5C20.5 15.5 23 18 21.5 22C18.5 22 16.5 20 17.5 17.5Z" fill="#FEF08A" />
          <path d="M16 25C19 23 21.5 25.5 20 29.5C17 29.5 15 27.5 16 25Z" fill="#FEF08A" />
          <path d="M18.5 32.5C21.5 30.5 24 33 22.5 37C19.5 37 17.5 35 18.5 32.5Z" fill="#FEF08A" />
        </svg>
      </div>
    </div>
  );
}
