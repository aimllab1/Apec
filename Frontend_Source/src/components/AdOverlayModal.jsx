import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Calendar, ChevronRight, ChevronLeft, ExternalLink, Sparkles, Bell } from 'lucide-react';

export const DEFAULT_ADS = [
  {
    id: 'ad-default-1',
    title: 'Admissions Open for 2026–2027 Academic Year',
    details: 'Adhiparasakthi Engineering College invites applications for B.E. / B.Tech / M.E. / MBA / MCA courses. Secure your future with an autonomous degree, state-of-the-art research laboratories, and a 95%+ campus placement record.',
    link: '/admission',
    startDate: '',
    endDate: '',
    functionDate: '',
    isActive: true
  }
];

export default function AdOverlayModal({ forceOpen = null, onClose = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAds, setActiveAds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const loadAndEvaluateAds = () => {
    // 1. Check global toggle
    const enabledSetting = localStorage.getItem('apec_ad_popup_enabled');
    const isGloballyEnabled = enabledSetting === null ? true : enabledSetting === 'true';

    // If controlled via forceOpen (e.g. Preview button in admin panel)
    if (forceOpen === true) {
      setIsOpen(true);
      loadAdsList();
      return;
    }

    if (forceOpen === false) {
      setIsOpen(false);
      return;
    }

    // Default public mode (e.g. homepage)
    if (!isGloballyEnabled) {
      setIsOpen(false);
      return;
    }

    const valid = loadAdsList();

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('apec_ad_closed');
    if (dismissed === 'true') {
      setIsOpen(false);
      return;
    }

    if (valid.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  };

  const loadAdsList = () => {
    let adsList = [];
    const saved = localStorage.getItem('apec_advertisements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          adsList = parsed;
        }
      } catch (e) {}
    }

    if (adsList.length === 0) {
      adsList = DEFAULT_ADS;
      try {
        localStorage.setItem('apec_advertisements', JSON.stringify(DEFAULT_ADS));
      } catch (e) {}
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const valid = adsList.filter(ad => {
      if (ad.isActive === false) return false;
      if (ad.startDate && ad.startDate > todayStr) return false;
      if (ad.endDate && ad.endDate < todayStr) return false;
      return true;
    });

    setActiveAds(valid);
    return valid;
  };

  useEffect(() => {
    loadAndEvaluateAds();

    const handleUpdate = () => {
      sessionStorage.removeItem('apec_ad_closed');
      loadAndEvaluateAds();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('apec_storage_update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('apec_storage_update', handleUpdate);
    };
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('apec_ad_closed', 'true');
    if (onClose) onClose();
  };

  if (!isOpen || activeAds.length === 0) return null;

  const currentAd = activeAds[currentIdx] || activeAds[0];

  // Calculate days remaining if functionDate is specified
  let countdownText = null;
  if (currentAd?.functionDate) {
    try {
      const target = new Date(currentAd.functionDate);
      const now = new Date();
      target.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const diffMs = target - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        countdownText = `⏳ ${diffDays} Days Remaining`;
      } else if (diffDays === 1) {
        countdownText = `⏳ Starts Tomorrow!`;
      } else if (diffDays === 0) {
        countdownText = `🎉 Happening Today!`;
      } else {
        countdownText = `📅 Event Date: ${currentAd.functionDate}`;
      }
    } catch (e) {}
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden text-left flex flex-col"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#041744] via-[#08205F] to-[#041744] text-white flex items-center justify-between border-b border-[#D4A347]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4A347]/20 border border-[#D4A347]/40 text-[#D4A347] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-[#D4A347] block leading-none">
                  Institutional Announcement
                </span>
                <span className="text-xs font-bold text-white/90">
                  Adhiparasakthi Engineering College
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Designed Content Body (No Image) */}
          <div className="p-6 space-y-4">
            
            {/* Badge & Countdown Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Special Notice
              </span>

              {countdownText && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                  {countdownText}
                </span>
              )}
            </div>

            {/* Announcement Title */}
            <h3 className="font-title text-base sm:text-lg font-black text-slate-900 leading-snug">
              {currentAd.title}
            </h3>

            {/* Announcement Details */}
            {currentAd.details && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-150">
                {currentAd.details}
              </p>
            )}

            {/* Multiple Notices Switcher */}
            {activeAds.length > 1 && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400">
                  Notice {currentIdx + 1} of {activeAds.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(prev => (prev > 0 ? prev - 1 : activeAds.length - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Previous announcement"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(prev => (prev < activeAds.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Next announcement"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer"
            >
              Dismiss
            </button>

            {currentAd.link ? (
              currentAd.link.startsWith('http') ? (
                <a
                  href={currentAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Explore Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  to={currentAd.link}
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Explore Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                Understood
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
