import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Award, Calendar 
} from 'lucide-react';
import PanoramaModal from '../components/PanoramaModal';
import defaultHomeData from '../data/homeData.json';
import achievement1Img from '../assets/Hero/achivement_1.jpeg';
import placementsImg from '../assets/Hero/placements.jpeg';
import goldMedalImg from '../assets/Hero/gold_medal.jpeg';
import fresherDayImg from '../assets/Hero/fresher_day.jpeg';

export default function Home() {
  const [isPanoOpen, setIsPanoOpen] = useState(false);
  const [homeConfig, setHomeConfig] = useState(defaultHomeData);
  const [achievementSlide, setAchievementSlide] = useState(0);
  const [upcomingSlide, setUpcomingSlide] = useState(0);

  // Touch Swipe State for Mobile Responsiveness
  const achTouchStartX = useRef(0);
  const achTouchEndX = useRef(0);
  const upTouchStartX = useRef(0);
  const upTouchEndX = useRef(0);

  // Sync with LocalStorage and Server API
  useEffect(() => {
    const loadHomeData = async () => {
      // 1. Try local cache first for instant render
      const localData = localStorage.getItem('apec_homepage_data');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed && parsed.achievementsSection) {
            setHomeConfig(parsed);
          }
        } catch (e) {
          console.error("Failed to parse local home data:", e);
        }
      }

      // 2. Fetch latest data from server
      try {
        const res = await fetch('/api/homepage');
        if (res.ok) {
          const data = await res.json();
          if (data && data.achievementsSection) {
            setHomeConfig(data);
            localStorage.setItem('apec_homepage_data', JSON.stringify(data));
          }
        }
      } catch (err) {
        // Fallback to local data or defaultHomeData
      }
    };

    loadHomeData();

    // Listen to admin edits
    const handleStorageUpdate = () => {
      const updated = localStorage.getItem('apec_homepage_data');
      if (updated) {
        try {
          setHomeConfig(JSON.parse(updated));
        } catch (e) {}
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('apec_storage_update', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('apec_storage_update', handleStorageUpdate);
    };
  }, []);

  const achievements = homeConfig.achievementsSection || defaultHomeData.achievementsSection;
  const upcoming = homeConfig.upcomingSection || defaultHomeData.upcomingSection;

  const achievementSlides = achievements.slides && achievements.slides.length > 0 
    ? achievements.slides 
    : defaultHomeData.achievementsSection.slides;

  const upcomingSlides = upcoming.slides && upcoming.slides.length > 0 
    ? upcoming.slides 
    : defaultHomeData.upcomingSection.slides;

  // Auto rotate achievement slides
  useEffect(() => {
    if (!achievements.autoplay || achievementSlides.length <= 1) return;
    const intervalTime = achievements.interval || 6000;
    const interval = setInterval(() => {
      setAchievementSlide(prev => (prev + 1) % achievementSlides.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [achievementSlides.length, achievements.autoplay, achievements.interval]);

  // Auto rotate upcoming slides
  useEffect(() => {
    if (!upcoming.autoplay || upcomingSlides.length <= 1) return;
    const intervalTime = upcoming.interval || 7000;
    const interval = setInterval(() => {
      setUpcomingSlide(prev => (prev + 1) % upcomingSlides.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [upcomingSlides.length, upcoming.autoplay, upcoming.interval]);

  const nextAchievementSlide = () => {
    setAchievementSlide(prev => (prev + 1) % achievementSlides.length);
  };
  const prevAchievementSlide = () => {
    setAchievementSlide(prev => (prev - 1 + achievementSlides.length) % achievementSlides.length);
  };

  const nextUpcomingSlide = () => {
    setUpcomingSlide(prev => (prev + 1) % upcomingSlides.length);
  };
  const prevUpcomingSlide = () => {
    setUpcomingSlide(prev => (prev - 1 + upcomingSlides.length) % upcomingSlides.length);
  };

  // Touch Swipe Handlers for Achievements
  const handleAchTouchStart = (e) => {
    achTouchStartX.current = e.targetTouches[0].clientX;
  };
  const handleAchTouchMove = (e) => {
    achTouchEndX.current = e.targetTouches[0].clientX;
  };
  const handleAchTouchEnd = () => {
    if (!achTouchStartX.current || !achTouchEndX.current) return;
    const diff = achTouchStartX.current - achTouchEndX.current;
    if (diff > 45) nextAchievementSlide();
    else if (diff < -45) prevAchievementSlide();
    achTouchStartX.current = 0;
    achTouchEndX.current = 0;
  };

  // Touch Swipe Handlers for Upcoming
  const handleUpTouchStart = (e) => {
    upTouchStartX.current = e.targetTouches[0].clientX;
  };
  const handleUpTouchMove = (e) => {
    upTouchEndX.current = e.targetTouches[0].clientX;
  };
  const handleUpTouchEnd = () => {
    if (!upTouchStartX.current || !upTouchEndX.current) return;
    const diff = upTouchStartX.current - upTouchEndX.current;
    if (diff > 45) nextUpcomingSlide();
    else if (diff < -45) prevUpcomingSlide();
    upTouchStartX.current = 0;
    upTouchEndX.current = 0;
  };

  return (
    <div className="w-full bg-[#041744] text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          DUAL-CONTAINER SHOWCASE (Only Necessary Components: Achievements + Upcoming)
          100% Mobile Responsive with Touch Swipe and Compact Spacing
          ───────────────────────────────────────────────────────────── */}
      {(achievements.enabled || upcoming.enabled) && (
        <div className="w-full bg-gradient-to-b from-[#041744] via-[#051A4C] to-[#020C24] px-2.5 sm:px-5 lg:px-8 py-3.5 sm:py-6">
          <div className="max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 xl:gap-8">
            
            {/* ══════════════════════════════════════════════════════════
                CONTAINER 1: ACHIEVEMENTS
                ══════════════════════════════════════════════════════════ */}
            {achievements.enabled && (
              <div className="flex flex-col w-full">
                {/* Header Banner */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-[#D4A347]/20 border border-[#D4A347]/50 shadow-sm backdrop-blur-md">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A347] shrink-0" />
                    <h2 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-wider font-serif">
                      {achievements.title || "Achievements"}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 border border-white/15 text-[10px] sm:text-[11px] font-bold text-[#D4A347] tracking-wider uppercase backdrop-blur-md shadow-xs">
                    {achievementSlide + 1} / {achievementSlides.length}
                  </span>
                </div>

                {/* Achievement Card Container (16:9 Aspect Ratio with Touch Swipe) */}
                <div 
                  className="relative w-full aspect-video bg-[#07132B] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)] border border-[#D4A347]/40 group touch-pan-y"
                  onTouchStart={handleAchTouchStart}
                  onTouchMove={handleAchTouchMove}
                  onTouchEnd={handleAchTouchEnd}
                >
                  
                  {/* Slides */}
                  {achievementSlides.map((slide, idx) => {
                    const slideImg = slide.imageUrl || slide.bgImage || placementsImg;
                    return (
                      <div
                        key={slide.id || idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${
                          idx === achievementSlide 
                            ? 'opacity-100 z-10 pointer-events-auto visible' 
                            : 'opacity-0 z-0 pointer-events-none invisible'
                        }`}
                      >
                        <img
                          src={slideImg}
                          alt={slide.alt || slide.title || "APEC Achievement"}
                          loading={idx === 0 ? "eager" : "lazy"}
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = "/Images/Hero/placements.jpeg"; 
                          }}
                          className="w-full h-full object-cover object-center select-none"
                        />
                        
                        {/* Optional subtle slide badge if defined */}
                        {slide.tag && (
                          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 pointer-events-none">
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-md border border-[#D4A347]/40 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#D4A347] shadow-sm">
                              {slide.tag}
                            </span>
                          </div>
                        )}
                        
                        {/* Optional Slide Link */}
                        {slide.link && (
                          <Link 
                            to={slide.link} 
                            className="absolute inset-0 z-20"
                            aria-label={slide.title || "View details"}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Navigation Controls (Visible on mobile & desktop) */}
                  {achievementSlides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevAchievementSlide}
                        className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#D4A347] text-white/90 hover:text-[#041744] flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#D4A347] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        aria-label="Previous Achievement"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={nextAchievementSlide}
                        className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#D4A347] text-white/90 hover:text-[#041744] flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#D4A347] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        aria-label="Next Achievement"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {/* Indicator Dots */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 flex items-center gap-1 sm:gap-1.5 bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
                        {achievementSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAchievementSlide(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              idx === achievementSlide
                                ? 'w-4 sm:w-5 h-1 sm:h-1.5 bg-[#D4A347]'
                                : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/40 hover:bg-white/80'
                            }`}
                            aria-label={`Achievement ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                CONTAINER 2: UPCOMING
                ══════════════════════════════════════════════════════════ */}
            {upcoming.enabled && (
              <div className="flex flex-col w-full">
                {/* Header Banner */}
                <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-[#D4A347]/20 border border-[#D4A347]/50 shadow-sm backdrop-blur-md">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A347] shrink-0" />
                    <h2 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-wider font-serif">
                      {upcoming.title || "Upcoming"}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/40 border border-white/15 text-[10px] sm:text-[11px] font-bold text-[#D4A347] tracking-wider uppercase backdrop-blur-md shadow-xs">
                    {upcomingSlide + 1} / {upcomingSlides.length}
                  </span>
                </div>

                {/* Upcoming Card Container (16:9 Aspect Ratio with Touch Swipe) */}
                <div 
                  className="relative w-full aspect-video bg-[#07132B] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)] border border-[#D4A347]/40 group touch-pan-y"
                  onTouchStart={handleUpTouchStart}
                  onTouchMove={handleUpTouchMove}
                  onTouchEnd={handleUpTouchEnd}
                >
                  
                  {/* Slides */}
                  {upcomingSlides.map((slide, idx) => {
                    const slideImg = slide.imageUrl || slide.bgImage || fresherDayImg;
                    return (
                      <div
                        key={slide.id || idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${
                          idx === upcomingSlide 
                            ? 'opacity-100 z-10 pointer-events-auto visible' 
                            : 'opacity-0 z-0 pointer-events-none invisible'
                        }`}
                      >
                        <img
                          src={slideImg}
                          alt={slide.alt || slide.title || "APEC Upcoming Event"}
                          loading="lazy"
                          onError={(e) => { 
                            e.target.onerror = null;
                            e.target.src = "/Images/Hero/fresher_day.jpeg"; 
                          }}
                          className="w-full h-full object-cover object-center select-none"
                        />

                        {/* Optional subtle slide badge if defined */}
                        {slide.tag && (
                          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 pointer-events-none">
                            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-md border border-[#D4A347]/40 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#D4A347] shadow-sm">
                              {slide.tag}
                            </span>
                          </div>
                        )}

                        {/* Optional Slide Link */}
                        {slide.link && (
                          <Link 
                            to={slide.link} 
                            className="absolute inset-0 z-20"
                            aria-label={slide.title || "View upcoming event"}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Navigation Controls (Visible on mobile & desktop) */}
                  {upcomingSlides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevUpcomingSlide}
                        className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#D4A347] text-white/90 hover:text-[#041744] flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#D4A347] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        aria-label="Previous Upcoming"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={nextUpcomingSlide}
                        className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-[#D4A347] text-white/90 hover:text-[#041744] flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#D4A347] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        aria-label="Next Upcoming"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      {/* Indicator Dots */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 flex items-center gap-1 sm:gap-1.5 bg-black/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
                        {upcomingSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setUpcomingSlide(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              idx === upcomingSlide
                                ? 'w-4 sm:w-5 h-1 sm:h-1.5 bg-[#D4A347]'
                                : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/40 hover:bg-white/80'
                            }`}
                            aria-label={`Upcoming ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          360° PANORAMA MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isPanoOpen && (
          <PanoramaModal
            isOpen={isPanoOpen}
            onClose={() => setIsPanoOpen(false)}
            initialScene="mainGate"
          />
        )}
      </AnimatePresence>

    </div>
  );
}
