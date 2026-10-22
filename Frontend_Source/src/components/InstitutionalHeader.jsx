import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, MapPin, ShieldCheck, Shield, Landmark, BookOpen, FileText, LogOut
} from 'lucide-react';
import logo40Years from '../assets/logo40Years.js';
import ugcLogo from '../assets/ugcLogo.js';
import apecLogo from '../assets/apecLogo.js';
import { getRootCollegeUrl, isSubdomainMode } from '../utils/subdomain';

export default function InstitutionalHeader({ setIsPanoOpen }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const homeUrl = isSubdomainMode() ? getRootCollegeUrl('/') : '/';
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    const checkLogin = () => {
      setIsUserLoggedIn(localStorage.getItem('is_logged_in') === 'true');
      setCurrentUserRole(localStorage.getItem('user_role') || '');
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.nav-dropdown-group')) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleMobileSubmenu = (key) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const DEFAULT_TICKER_ITEMS = [
    { text: "UGC Autonomous 10 Years Status Conferred", icon: "🏛", link: "/ugc-self-disclosure" },
    { text: "95%+ Placement Track Record – 150+ Top Recruiters", icon: "👨‍💼", link: "/placements" },
    { text: "Admissions Open for B.E. / B.Tech / M.E. / MBA / MCA 2026–2027", icon: "📢", link: "/admission" },
    { text: "NAAC Accredited Institution with Grade 'A'", icon: "🎖", link: "/about/profile" },
    { text: "Anna University Affiliated Autonomous Institution", icon: "🎓", link: "/about/profile" },
  ];

  const [tickerItems, setTickerItems] = useState(() => {
    try {
      const saved = localStorage.getItem('apec_ticker_news');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_TICKER_ITEMS;
  });

  useEffect(() => {
    const updateTicker = () => {
      try {
        const saved = localStorage.getItem('apec_ticker_news');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTickerItems(parsed);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('storage', updateTicker);
    window.addEventListener('apec_storage_update', updateTicker);
    return () => {
      window.removeEventListener('storage', updateTicker);
      window.removeEventListener('apec_storage_update', updateTicker);
    };
  }, []);

  return (
    <header className="w-full relative z-[100] select-none">
      <div className="w-full">
      
      {/* ─────────────────────────────────────────────────────────────
          LEVEL 1 — MAIN BRAND HEADER (Accurate 1:1 Banner Layout)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-white border-b border-[#E6D4B2]/80">
        
        {/* DESKTOP FULL-WIDTH BAR (≥ 1024px) */}
        <div className="hidden lg:flex items-center justify-between w-full h-[138px] lg:h-[144px] xl:h-[160px] 2xl:h-[170px] bg-white px-2 py-1.5 xl:py-2 overflow-hidden">
            
          {/* ── 1. LEFT: NAVY BRANDING RIBBON ── */}
          <div className="relative shrink-0 h-full flex items-stretch select-none">
            {/* Outer Gold Slanted Bevel Edge with rounded left corners */}
            <div className="relative h-full flex items-stretch rounded-l-2xl xl:rounded-l-3xl [clip-path:polygon(0_0,100%_0,calc(100%-45px)_100%,0_100%)] xl:[clip-path:polygon(0_0,100%_0,calc(100%-55px)_100%,0_100%)] bg-gradient-to-r from-[#D4A347] via-[#F3D78A] to-[#C4962C] pr-[4px] xl:pr-[5px]">
              
              {/* Inner Deep Navy Background with rounded left corners */}
              <div className="relative h-full rounded-l-2xl xl:rounded-l-3xl bg-[#041744] text-white flex items-center pl-3 sm:pl-4 lg:pl-5 xl:pl-9 pr-14 lg:pr-16 xl:pr-22 [clip-path:polygon(0_0,100%_0,calc(100%-45px)_100%,0_100%)] xl:[clip-path:polygon(0_0,100%_0,calc(100%-55px)_100%,0_100%)]">
                
                <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
                  {/* College Logo in Sunburst Medallion */}
                  <a href={homeUrl} className="relative flex items-center justify-center group shrink-0" title="APEC Home">
                    <div className="relative w-[82px] h-[82px] lg:w-[96px] lg:h-[96px] xl:w-[124px] xl:h-[124px] 2xl:w-[134px] 2xl:h-[134px] aspect-square flex items-center justify-center select-none group-hover:scale-105 transition-all duration-300 ease-out">
                      {/* SVG Sunburst Medallion Background (Rotates continuously behind the stationary logo) */}
                      <svg 
                        viewBox="0 0 200 200" 
                        className="absolute inset-0 w-full h-full drop-shadow-md animate-[spin_25s_linear_infinite] origin-center will-change-transform"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="apecSunburstGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F7E298" />
                            <stop offset="25%" stopColor="#DFB75A" />
                            <stop offset="50%" stopColor="#FFE7A0" />
                            <stop offset="75%" stopColor="#C4962C" />
                            <stop offset="100%" stopColor="#8C620E" />
                          </linearGradient>
                          <linearGradient id="apecBeadedRim" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFE599" />
                            <stop offset="50%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#7A5207" />
                          </linearGradient>
                          <radialGradient id="apecPorcelainDisc" cx="50%" cy="50%" r="58%">
                            <stop offset="68%" stopColor="#FFFFFF" />
                            <stop offset="90%" stopColor="#FDFCFA" />
                            <stop offset="100%" stopColor="#F5EFE0" />
                          </radialGradient>
                        </defs>
                        <path 
                          d="M 188.00 100.00 L 195.54 109.41 L 186.31 117.17 L 191.87 127.87 L 181.30 133.68 L 184.66 145.25 L 173.17 148.89 L 174.21 160.90 L 162.23 162.23 L 160.90 174.21 L 148.89 173.17 L 145.25 184.66 L 133.68 181.30 L 127.87 191.87 L 117.17 186.31 L 109.41 195.54 L 100.00 188.00 L 90.59 195.54 L 82.83 186.31 L 72.13 191.87 L 66.32 181.30 L 54.75 184.66 L 51.11 173.17 L 39.10 174.21 L 37.77 162.23 L 25.79 160.90 L 26.83 148.89 L 15.34 145.25 L 18.70 133.68 L 8.13 127.87 L 13.69 117.17 L 4.46 109.41 L 12.00 100.00 L 4.46 90.59 L 13.69 82.83 L 8.13 72.13 L 18.70 66.32 L 15.34 54.75 L 26.83 51.11 L 25.79 39.10 L 37.77 37.77 L 39.10 25.79 L 51.11 26.83 L 54.75 15.34 L 66.32 18.70 L 72.13 8.13 L 82.83 13.69 L 90.59 4.46 L 100.00 12.00 L 109.41 4.46 L 117.17 13.69 L 127.87 8.13 L 133.68 18.70 L 145.25 15.34 L 148.89 26.83 L 160.90 25.79 L 162.23 37.77 L 174.21 39.10 L 173.17 51.11 L 184.66 54.75 L 181.30 66.32 L 191.87 72.13 L 186.31 82.83 L 195.54 90.59 L 188.00 100.00 Z" 
                          fill="url(#apecSunburstGold)" 
                          stroke="#8C620E" 
                          strokeWidth="0.8" 
                        />
                        <circle cx="100" cy="100" r="87.5" fill="none" stroke="url(#apecBeadedRim)" strokeWidth="1.6" />
                        <circle cx="100" cy="100" r="83.5" fill="none" stroke="#FFE599" strokeWidth="2.2" strokeDasharray="1.8 6.4" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#9C7216" strokeWidth="1.2" />
                        <circle cx="100" cy="100" r="78" fill="url(#apecPorcelainDisc)" />
                        <circle cx="100" cy="100" r="73.5" fill="none" stroke="#D4AF37" strokeWidth="0.7" strokeOpacity="0.4" strokeDasharray="3 2" />
                      </svg>

                      {/* Original Red Logo */}
                      <div className="relative z-10 w-[90%] h-[90%] flex items-center justify-center">
                        <img 
                          src={apecLogo} 
                          alt="Adhiparasakthi Engineering College Emblem" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </a>

                  {/* Branding Typography */}
                  <div className="flex flex-col items-center justify-center min-w-0 pr-1 lg:pr-2 select-none">
                    
                    {/* Line 1: ✦ OM SAKTHI ✦ */}
                    <div className="flex items-center justify-center gap-1 lg:gap-1.5 mb-0.5 leading-none text-[#E5B54F]">
                      <span className="text-[7.5px] lg:text-[8px] xl:text-[9.5px] text-[#E5B54F]">✦</span>
                      <span 
                        className="text-[8.5px] lg:text-[9.5px] xl:text-[11.5px] font-bold tracking-[0.32em] uppercase text-[#E5B54F]"
                        style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', serif" }}
                      >
                        OM SAKTHI
                      </span>
                      <span className="text-[7.5px] lg:text-[8px] xl:text-[9.5px] text-[#E5B54F]">✦</span>
                    </div>

                    {/* Dedicated Title Block: strictly locks width(ENGINEERING COLLEGE) == width(ADHIPARASAKTHI) */}
                    <div className="inline-flex flex-col items-stretch w-fit">
                      {/* Line 2: ADHIPARASAKTHI */}
                      <h1 
                        className="text-[24px] lg:text-[30px] xl:text-[44px] 2xl:text-[48px] font-black tracking-[0.015em] text-white leading-none uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] whitespace-nowrap text-center"
                        style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
                      >
                        ADHIPARASAKTHI
                      </h1>

                      {/* Line 3: Full-width Gold Horizontal Underline (strictly equal to ADHIPARASAKTHI length) */}
                      <div className="w-full h-[1.5px] xl:h-[2px] bg-[#D4AF37] my-0.5 xl:my-1" />

                      {/* Line 4: ENGINEERING COLLEGE (strictly equal to ADHIPARASAKTHI length) */}
                      <div 
                        className="w-full flex items-center justify-between my-0.5 select-none"
                        aria-label="ENGINEERING COLLEGE"
                      >
                        {"ENGINEERING COLLEGE".split("").map((char, index) => (
                          <span
                            key={index}
                            className={`text-[10px] lg:text-[12px] xl:text-[17px] 2xl:text-[18.5px] font-black text-white uppercase leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
                              char === " " ? "w-2 lg:w-3 xl:w-4 inline-block" : ""
                            }`}
                            style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Line 5: Bottom Row (Autonomous Badge & Location) */}
                    <div className="flex items-center justify-center gap-2 lg:gap-3 xl:gap-3.5 mt-1 text-[8.5px] lg:text-[9.5px] xl:text-[11.5px] whitespace-nowrap leading-none">
                      <span className="inline-flex items-center gap-1 lg:gap-1.5 px-2.5 lg:px-3 xl:px-3.5 py-0.5 xl:py-1 rounded-full bg-[#E5A835] text-[#041744] font-black uppercase tracking-wider text-[7.5px] lg:text-[8.5px] xl:text-[10px] shadow-sm">
                        <ShieldCheck className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-[#041744] stroke-[2.5]" />
                        <span>AN AUTONOMOUS INSTITUTION</span>
                      </span>
                      <span className="flex items-center gap-1 lg:gap-1.5 text-white font-bold uppercase tracking-wider text-[9px] lg:text-[10.5px] xl:text-[13px]">
                        <MapPin className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-[#E5B54F]" /> MELMARUVATHUR – 603 319
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── 2. RIGHT: WHITE AREA (Center Badges + Right Action Buttons) ── */}
          <div className="flex-1 h-full flex items-center justify-between pl-2 lg:pl-3 xl:pl-6 pr-2 lg:pr-4 xl:pr-8 py-1 bg-white min-w-0">
            
            {/* 4 Accreditation Badges (Balanced and Evenly Spaced) */}
            <div className="flex-1 flex items-center justify-around xl:justify-evenly px-1 lg:px-2 xl:px-6">
              
              {/* 1. ANNA UNIV */}
              <Link 
                to="/about/profile" 
                className="flex flex-col items-center justify-center text-center group cursor-pointer shrink-0"
                title="Affiliated to Anna University, Chennai"
              >
                <div className="w-[56px] h-[56px] lg:w-[66px] lg:h-[66px] xl:w-[86px] xl:h-[86px] 2xl:w-[94px] 2xl:h-[94px] rounded-full p-0.5 lg:p-1 border-[1.5px] xl:border-[2px] border-[#D9A441] shadow-xs group-hover:border-[#E8B859] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white aspect-square overflow-hidden">
                  <img 
                    src="/Images/Logos/university_logo-rem.png" 
                    alt="Anna University" 
                    className="w-full h-full object-contain scale-[1.22]"
                  />
                </div>
                <span className="text-[11px] lg:text-[12.5px] xl:text-[16px] 2xl:text-[17px] font-black text-[#041744] uppercase mt-1 leading-none group-hover:text-[#123B8F] transition-colors whitespace-nowrap tracking-wide">
                  ANNA UNIV
                </span>
                <span className="text-[8.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[13px] text-[#041744] font-extrabold uppercase leading-none mt-0.5 xl:mt-1 whitespace-nowrap tracking-wider">
                  AFFILIATED
                </span>
              </Link>

              {/* 2. UGC 2(f) & 12(B) */}
              <Link 
                to="/ugc-approval-letter" 
                className="flex flex-col items-center justify-center text-center group cursor-pointer shrink-0"
                title="UGC 2(f) & 12(B) Status"
              >
                <div className="w-[56px] h-[56px] lg:w-[66px] lg:h-[66px] xl:w-[86px] xl:h-[86px] 2xl:w-[94px] 2xl:h-[94px] rounded-full p-0.5 lg:p-1 border-[1.5px] xl:border-[2px] border-[#D9A441] shadow-xs group-hover:border-[#E8B859] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white aspect-square overflow-hidden">
                  <img 
                    src={ugcLogo} 
                    alt="UGC 2(f) & 12(B)" 
                    className="w-full h-full object-contain scale-[1.11]"
                  />
                </div>
                <span className="text-[11px] lg:text-[12.5px] xl:text-[16px] 2xl:text-[17px] font-black text-[#041744] uppercase mt-1 leading-none group-hover:text-[#123B8F] transition-colors whitespace-nowrap tracking-wide">
                  UGC
                </span>
                <span className="text-[8.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[13px] text-[#041744] font-extrabold uppercase leading-none mt-0.5 xl:mt-1 whitespace-nowrap tracking-wider">
                  2(f) & 12(B)
                </span>
              </Link>

              {/* 3. NAAC */}
              <Link 
                to="/about/profile" 
                className="flex flex-col items-center justify-center text-center group cursor-pointer shrink-0"
                title="NAAC Accredited Grade 'A' Institution"
              >
                <div className="w-[56px] h-[56px] lg:w-[66px] lg:h-[66px] xl:w-[86px] xl:h-[86px] 2xl:w-[94px] 2xl:h-[94px] rounded-full p-0.5 lg:p-1 border-[1.5px] xl:border-[2px] border-[#D9A441] shadow-xs group-hover:border-[#E8B859] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white aspect-square overflow-hidden">
                  <img 
                    src="/Images/Logos/Naac.png" 
                    alt="NAAC Accredited" 
                    className="w-full h-full object-contain scale-[1.14]"
                  />
                </div>
                <span className="text-[11px] lg:text-[12.5px] xl:text-[16px] 2xl:text-[17px] font-black text-[#041744] uppercase mt-1 leading-none group-hover:text-[#123B8F] transition-colors whitespace-nowrap tracking-wide">
                  NAAC
                </span>
                <span className="text-[8.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[13px] text-[#041744] font-extrabold uppercase leading-none mt-0.5 xl:mt-1 whitespace-nowrap tracking-wider">
                  GRADE 'A'
                </span>
              </Link>

              {/* 4. 40+ YEARS */}
              <Link 
                to="/about/profile" 
                className="flex flex-col items-center justify-center text-center group cursor-pointer shrink-0"
                title="40+ Years of Academic Excellence"
              >
                <div className="w-[56px] h-[56px] lg:w-[66px] lg:h-[66px] xl:w-[86px] xl:h-[86px] 2xl:w-[94px] 2xl:h-[94px] rounded-full p-0.5 lg:p-1 border-[1.5px] xl:border-[2px] border-[#D9A441] shadow-xs group-hover:border-[#E8B859] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white aspect-square overflow-hidden">
                  <img 
                    src={logo40Years} 
                    alt="40+ Years" 
                    className="w-full h-full object-contain scale-[1.04]"
                  />
                </div>
                <span className="text-[11px] lg:text-[12.5px] xl:text-[16px] 2xl:text-[17px] font-black text-[#041744] uppercase mt-1 leading-none group-hover:text-[#123B8F] transition-colors whitespace-nowrap tracking-wide">
                  40+ YEARS
                </span>
                <span className="text-[8.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[13px] text-[#D9A441] font-black uppercase leading-none mt-0.5 xl:mt-1 whitespace-nowrap tracking-wider">
                  EXCELLENCE
                </span>
              </Link>

            </div>

            {/* Action Pill Buttons (Right-aligned Vertical Stack: 4 buttons if logged in, 3 buttons default) */}
            <div className={`flex flex-col justify-center items-end ${isUserLoggedIn ? 'gap-1 lg:gap-1.5 xl:gap-2' : 'gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3'} shrink-0 pl-1.5 lg:pl-2`}>
              
              {/* 1. ACTIVE CONSOLE / EDITOR PANEL (Shown only when logged in as Admin or Department) */}
              {isUserLoggedIn && (
                <div className="flex items-center gap-1 lg:gap-1.5 w-[125px] lg:w-[138px] xl:w-[155px] 2xl:w-[162px]">
                  <Link
                    to="/editor-panel"
                    className="flex-1 h-[24px] lg:h-[26px] xl:h-[29px] rounded-full border-[1.5px] border-[#D4A347] bg-[#041744] text-[#E5B54F] hover:bg-[#08297a] transition-all duration-200 text-[8.5px] lg:text-[9px] xl:text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    title="Open Department / Admin Editor Portal"
                  >
                    <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-[#E5B54F] shrink-0" />
                    <span className="truncate">{currentUserRole.startsWith('dept_') ? `${currentUserRole.replace('dept_', '').toUpperCase()}` : 'ADMIN'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('is_logged_in');
                      localStorage.removeItem('user_role');
                      localStorage.removeItem('apec_user');
                      window.dispatchEvent(new Event('storage'));
                      window.dispatchEvent(new Event('apec_storage_update'));
                      window.location.reload();
                    }}
                    className="h-[24px] lg:h-[26px] xl:h-[29px] px-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[9px] lg:text-[10px] font-black uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all shadow-2xs shrink-0"
                    title="Sign Out from Portal"
                  >
                    <LogOut className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-rose-600" />
                  </button>
                </div>
              )}

              {/* 2. ERP PORTAL (Always present) */}
              <a
                href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-[125px] lg:w-[138px] xl:w-[155px] 2xl:w-[162px] ${isUserLoggedIn ? 'h-[24px] lg:h-[26px] xl:h-[29px]' : 'h-[25px] lg:h-[28px] xl:h-[32px]'} rounded-full border-[1.5px] border-[#0A58CA] bg-[#0A58CA] text-white hover:bg-[#084298] transition-all duration-200 text-[8.5px] lg:text-[9.5px] xl:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 lg:gap-1.5 shadow-sm cursor-pointer`}
                title="VMedulife ERP Student & Faculty Portal"
              >
                <Landmark className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0 text-white" />
                <span>ERP PORTAL</span>
              </a>

              {/* 3. FEE PAYMENT (Green Outline Pill with App/Card Icon) */}
              <Link
                to="/fee-payment"
                className={`w-[125px] lg:w-[138px] xl:w-[155px] 2xl:w-[162px] ${isUserLoggedIn ? 'h-[24px] lg:h-[26px] xl:h-[29px]' : 'h-[25px] lg:h-[28px] xl:h-[32px]'} rounded-full border-[1.5px] border-[#15803D] bg-white text-[#15803D] hover:bg-[#15803D] hover:text-white transition-all duration-200 text-[8.5px] lg:text-[9.5px] xl:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 lg:gap-1.5 shadow-2xs cursor-pointer`}
                title="Online Fee Payment Portal"
              >
                <svg viewBox="0 0 22 18" className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="1.5" width="19" height="15" rx="3" />
                  <path d="M5 6h5M5 10h12M5 13.5h7" />
                </svg>
                <span>FEE PAYMENT</span>
              </Link>

              {/* 4. 360° TOUR (Blue Outline Pill with 360 Oval Icon) */}
              <button
                type="button"
                onClick={() => setIsPanoOpen(true)}
                className={`w-[125px] lg:w-[138px] xl:w-[155px] 2xl:w-[162px] ${isUserLoggedIn ? 'h-[24px] lg:h-[26px] xl:h-[29px]' : 'h-[25px] lg:h-[28px] xl:h-[32px]'} rounded-full border-[1.5px] border-[#1D4ED8] bg-white text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all duration-200 text-[8.5px] lg:text-[9.5px] xl:text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 lg:gap-1.5 shadow-2xs cursor-pointer`}
                title="Open 360° Virtual Campus Tour"
              >
                <svg viewBox="0 0 28 16" className="w-3.5 h-3 lg:w-4 lg:h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <ellipse cx="14" cy="8" rx="12" ry="7" />
                  <text x="14" y="10.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor" stroke="none">360°</text>
                </svg>
                <span>360° TOUR</span>
              </button>

            </div>

          </div>

        </div>

        {/* ── MOBILE & TABLET COMPACT RESPONSIVE HEADER (< 1024px) ── */}
        <div className="lg:hidden flex items-center justify-between w-full h-[64px] sm:h-[70px] bg-[#041744] px-2.5 sm:px-4 border-b border-[#D4A347]/60 shadow-md select-none relative z-30">
          
          {/* Left: Brand Identity (Enlarged Logo + Clear Visible Screen-Responsive College Name) */}
          <a href={homeUrl} className="flex items-center gap-2 sm:gap-3 group min-w-0 pr-1" title="APEC Home">
            {/* Enlarged College Logo Medallion */}
            <div className="relative w-[50px] h-[50px] xs:w-[54px] xs:h-[54px] sm:w-[60px] sm:h-[60px] aspect-square shrink-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 200 200" 
                className="absolute inset-0 w-full h-full drop-shadow-md animate-[spin_25s_linear_infinite] origin-center will-change-transform"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="apecSunburstGoldMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F7E298" />
                    <stop offset="25%" stopColor="#DFB75A" />
                    <stop offset="50%" stopColor="#FFE7A0" />
                    <stop offset="75%" stopColor="#C4962C" />
                    <stop offset="100%" stopColor="#8C620E" />
                  </linearGradient>
                  <radialGradient id="apecPorcelainDiscMobile" cx="50%" cy="50%" r="58%">
                    <stop offset="68%" stopColor="#FFFFFF" />
                    <stop offset="90%" stopColor="#FDFCFA" />
                    <stop offset="100%" stopColor="#F5EFE0" />
                  </radialGradient>
                </defs>
                <path 
                  d="M 188.00 100.00 L 195.54 109.41 L 186.31 117.17 L 191.87 127.87 L 181.30 133.68 L 184.66 145.25 L 173.17 148.89 L 174.21 160.90 L 162.23 162.23 L 160.90 174.21 L 148.89 173.17 L 145.25 184.66 L 133.68 181.30 L 127.87 191.87 L 117.17 186.31 L 109.41 195.54 L 100.00 188.00 L 90.59 195.54 L 82.83 186.31 L 72.13 191.87 L 66.32 181.30 L 54.75 184.66 L 51.11 173.17 L 39.10 174.21 L 37.77 162.23 L 25.79 160.90 L 26.83 148.89 L 15.34 145.25 L 18.70 133.68 L 8.13 127.87 L 13.69 117.17 L 4.46 109.41 L 12.00 100.00 L 4.46 90.59 L 13.69 82.83 L 8.13 72.13 L 18.70 66.32 L 15.34 54.75 L 26.83 51.11 L 25.79 39.10 L 37.77 37.77 L 39.10 25.79 L 51.11 26.83 L 54.75 15.34 L 66.32 18.70 L 72.13 8.13 L 82.83 13.69 L 90.59 4.46 L 100.00 12.00 L 109.41 4.46 L 117.17 13.69 L 127.87 8.13 L 133.68 18.70 L 145.25 15.34 L 148.89 26.83 L 160.90 25.79 L 162.23 37.77 L 174.21 39.10 L 173.17 51.11 L 184.66 54.75 L 181.30 66.32 L 191.87 72.13 L 186.31 82.83 L 195.54 90.59 L 188.00 100.00 Z" 
                  fill="url(#apecSunburstGoldMobile)" 
                  stroke="#8C620E" 
                  strokeWidth="0.8" 
                />
                <circle cx="100" cy="100" r="82" fill="none" stroke="#FFE599" strokeWidth="1.5" strokeDasharray="1.5 5" />
                <circle cx="100" cy="100" r="78" fill="url(#apecPorcelainDiscMobile)" stroke="#D4AF37" strokeWidth="1" />
              </svg>
              <div className="relative z-10 w-[88%] h-[88%] flex items-center justify-center p-0.5">
                <img 
                  src={apecLogo} 
                  alt="APEC Emblem" 
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
            </div>

            {/* Clear Visible Typography (Screen Responsive, High Contrast) */}
            <div className="flex flex-col text-left justify-center min-w-0">
              <span className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] font-bold text-[#E5B54F] tracking-[0.25em] uppercase leading-none">
                ✦ OM SAKTHI ✦
              </span>
              <span 
                className="text-[13.5px] 2xs:text-[15px] xs:text-[17px] sm:text-[20px] font-black text-white tracking-[0.015em] uppercase leading-tight mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] whitespace-nowrap"
                style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', serif" }}
              >
                ADHIPARASAKTHI
              </span>
              <div className="flex items-center gap-1 xs:gap-1.5 mt-0.5 leading-none">
                <span className="text-[7.5px] xs:text-[9px] sm:text-[11px] font-black text-[#E5B54F] uppercase tracking-wider whitespace-nowrap">
                  ENGINEERING COLLEGE
                </span>
                <span className="text-[6px] xs:text-[7px] sm:text-[8px] px-1.5 py-[1px] rounded bg-[#D4A347]/20 border border-[#D4A347]/40 text-[#F3D78A] font-black uppercase tracking-wider whitespace-nowrap shrink-0">
                  AUTONOMOUS
                </span>
              </div>
            </div>
          </a>

          {/* Right: ONLY 360 Degree Tour + Menu Hamburger Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 360° VR Tour Pill */}
            <button
              type="button"
              onClick={() => setIsPanoOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#D4A347]/70 bg-gradient-to-r from-white/10 to-[#D4A347]/20 hover:bg-[#D4A347]/30 text-[#D4A347] hover:text-[#F3D78A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title="Open 360° Virtual Campus Tour"
            >
              <svg viewBox="0 0 28 16" className="w-3.5 h-2.5 sm:w-4 sm:h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
                <ellipse cx="14" cy="8" rx="12" ry="7" />
                <text x="14" y="10.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor" stroke="none">360°</text>
              </svg>
              <span>360°</span>
            </button>

            {/* Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#D4A347] to-[#B38022] hover:from-[#E5B54F] hover:to-[#C4962C] text-[#041744] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer border border-[#F3D78A]/40 shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 2 — NEWS / UPDATES BAR (Light Cream Background + Subtle Borders)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#FAF6EC] border-y border-[#E6D4B2]/80 py-0.5 sm:py-1 px-2.5 sm:px-6 lg:px-8 xl:px-10 overflow-hidden relative shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Executive Left Tag: [ UPDATES ] */}
          <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 rounded-full bg-[#041744] text-[#E5B54F] font-black text-[8px] sm:text-[9.5px] uppercase tracking-wider shrink-0 shadow-2xs">
            <span>UPDATES</span>
          </div>

          {/* Continuous Infinite Scrolling Ticker Track */}
          <div className="w-full overflow-hidden flex items-center">
            <div 
              className="flex items-center gap-6 md:gap-10 whitespace-nowrap animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer text-xs font-bold text-[#041744]"
            >
              {/* Loop Item Block 1 */}
              <div className="flex items-center gap-6 md:gap-10">
                {tickerItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-[#D4A347] font-black text-[10px]">◆</span>}
                    <Link 
                      to={item.link} 
                      className="inline-flex items-center gap-1.5 text-[#041744] hover:text-[#B38734] transition-colors duration-200"
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="font-bold tracking-normal text-xs">{item.text}</span>
                    </Link>
                  </React.Fragment>
                ))}
              </div>

              {/* Loop Item Block 2 for Seamless Infinite Scroll */}
              <div className="flex items-center gap-6 md:gap-10" aria-hidden="true">
                {tickerItems.map((item, idx) => (
                  <React.Fragment key={`repeat-${idx}`}>
                    <span className="text-[#D4A347] font-black text-[10px]">◆</span>
                    <Link 
                      to={item.link} 
                      className="inline-flex items-center gap-1.5 text-[#041744] hover:text-[#B38734] transition-colors duration-200"
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span className="font-bold tracking-normal text-xs">{item.text}</span>
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 3 — MAIN NAVIGATION ROW (Constant Institutional Navy Background)
          ───────────────────────────────────────────────────────────── */}
      <nav className="w-full bg-[#041744] border-b border-[#D4A347]/30 hidden lg:block relative z-[100] py-2 lg:py-2.5 select-none shadow-md">
        <div className="w-full max-w-[1850px] mx-auto px-1.5 sm:px-2 lg:px-3 xl:px-6 flex items-center justify-center flex-wrap gap-1.5 lg:gap-2 xl:gap-3 2xl:gap-4 relative">
          
          {/* 1. HOME (Active Gold Pill) */}
          <a 
            href={homeUrl} 
            className={`rounded-full px-3 lg:px-3.5 xl:px-5 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center whitespace-nowrap ${
              isActive('/') 
                ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
            }`}
            style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
          >
            {isSubdomainMode() ? 'COLLEGE HOME' : 'HOME'}
          </a>

          {/* 2. ABOUT Dropdown */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'about' ? null : 'about')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/about') 
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>ABOUT</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''} text-black`} />
            </button>
            <div className={`absolute top-full left-0 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_20px_50px_rgba(3,20,61,0.25)] rounded-2xl py-2.5 w-60 xl:w-64 text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'about' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              <Link to="/about/profile" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Institutional Profile</Link>
              <Link to="/about/founders" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Founder & Trustees</Link>
              <Link to="/about/principal" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Principal Desk</Link>
              <Link to="/about/administration" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Administration</Link>
            </div>
          </div>

          {/* 3. ADMISSION Dropdown */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('admission')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'admission' ? null : 'admission')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/admission') 
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>ADMISSION</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${activeDropdown === 'admission' ? 'rotate-180' : ''} text-black`} />
            </button>
            <div className={`absolute top-full left-0 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_20px_50px_rgba(3,20,61,0.25)] rounded-2xl py-2.5 w-60 xl:w-64 text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'admission' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              <Link to="/admission?tab=courses" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Courses Offered</Link>
              <Link to="/admission?tab=procedure" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Admission Procedure</Link>
              <Link to="/cutoff-calculator" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Cutoff Calculator</Link>
              <Link to="/admission?tab=scholarships" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Scholarships</Link>
              <Link to="/fee-payment" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Online Fee Payment</Link>
            </div>
          </div>

          {/* 4. ACADEMICS Mega Menu */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('academics')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'academics' ? null : 'academics')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/departments') || isActive('/regulations') || isActive('/academics') 
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>ACADEMICS</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${activeDropdown === 'academics' ? 'rotate-180' : ''} text-black`} />
            </button>
            <div className={`absolute top-full left-1/2 -translate-x-[45%] xl:-translate-x-1/2 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_20px_50px_rgba(3,20,61,0.2)] rounded-2xl py-3.5 px-3.5 lg:px-4 w-[95vw] max-w-[960px] text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'academics' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              
              {/* Inner Navigation Bar: [ DEPARTMENTS ] and [ REGULATIONS: Reg 21, Reg 25, Reg 26 ] */}
              <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-150 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Departments Main Button */}
                  <Link 
                    to="/departments" 
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-[#041744] text-indigo-900 hover:text-[#E5B54F] border border-indigo-200/80 font-black text-xs uppercase tracking-wider transition-all shadow-2xs group/item"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 group-hover/item:text-[#E5B54F]" />
                    <span>Departments</span>
                    <span className="text-[10px] bg-indigo-200/60 group-hover/item:bg-[#D4A347]/30 text-indigo-800 group-hover/item:text-white px-2 py-0.5 rounded-full font-extrabold">14 Branches</span>
                  </Link>

                  {/* Regulations Button with Reg 21, Reg 25, Reg 26 Buttons */}
                  <div className="flex items-center bg-[#041744] text-white rounded-xl p-0.5 border border-[#D4A347]/50 shadow-xs">
                    <Link 
                      to="/regulations" 
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-[#E5B54F] font-black text-xs uppercase tracking-wider hover:bg-white/10 rounded-lg transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#E5B54F]" />
                      <span>Regulations</span>
                    </Link>
                    
                    <span className="w-px h-4 bg-white/20 my-auto" />
                    
                    <Link 
                      to="/regulations?reg=26" 
                      onClick={() => setActiveDropdown(null)}
                      className="px-2.5 py-1 text-[11px] font-black uppercase text-slate-200 hover:text-[#041744] hover:bg-[#E5B54F] rounded-lg transition-all"
                      title="Autonomous Regulation 2026"
                    >
                      Reg 26
                    </Link>

                    <Link 
                      to="/regulations?reg=25" 
                      onClick={() => setActiveDropdown(null)}
                      className="px-2.5 py-1 text-[11px] font-black uppercase text-slate-200 hover:text-[#041744] hover:bg-[#E5B54F] rounded-lg transition-all"
                      title="Autonomous Regulation 2025"
                    >
                      Reg 25
                    </Link>

                    <Link 
                      to="/regulations?reg=21" 
                      onClick={() => setActiveDropdown(null)}
                      className="px-2.5 py-1 text-[11px] font-black uppercase text-slate-200 hover:text-[#041744] hover:bg-[#E5B54F] rounded-lg transition-all"
                      title="Anna University & Autonomous Regulation 2021"
                    >
                      Reg 21
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <Link 
                    to="/coe" 
                    onClick={() => setActiveDropdown(null)}
                    className="text-xs font-extrabold text-indigo-650 hover:text-indigo-800 hover:underline flex items-center gap-1"
                  >
                    <span>CoE Portal & Timetables</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                
                {/* 1. UNDERGRADUATE (B.E.) */}
                <div className="border-r border-slate-100 pr-2">
                  <span className="text-[11.5px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b-[1.5px] border-[#D9A441]/50 pb-1 whitespace-nowrap">
                    UNDERGRADUATE (B.E.)
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/civil" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Civil Engineering
                    </Link>
                    <Link to="/departments/mech" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Mechanical Engineering
                    </Link>
                    <Link to="/departments/eee" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Electrical & Electronics Engg.
                    </Link>
                    <Link to="/departments/ece" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Electronics & Comm. Engg.
                    </Link>
                    <Link to="/departments/cse" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Computer Science & Engg.
                    </Link>
                    <Link to="/departments/aiml" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      CSE (AI & ML)
                    </Link>
                    <Link to="/departments/csd" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Computer Science & Design (CSD)
                    </Link>
                  </div>
                </div>

                {/* 2. UNDERGRADUATE (B.TECH.) & SCIENCE & HUMANITIES */}
                <div className="border-r border-slate-100 pr-2">
                  <span className="text-[11.5px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b-[1.5px] border-[#D9A441]/50 pb-1 whitespace-nowrap">
                    UNDERGRADUATE (B.TECH.)
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/it" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Information Technology
                    </Link>
                    <Link to="/departments/chemical" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Chemical Engineering
                    </Link>
                    <Link to="/departments/agri" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Agricultural Engineering
                    </Link>
                    <Link to="/departments/aids" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      AI & Data Science (AI & DS)
                    </Link>
                  </div>

                  <span className="text-[10.5px] uppercase font-black text-slate-600 tracking-wider block mt-2.5 mb-1 border-b border-slate-200 pb-0.5 whitespace-nowrap">
                    SCIENCE & HUMANITIES
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/sh" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Science & Humanities (S&H)
                    </Link>
                  </div>
                </div>

                {/* 3. POSTGRADUATE (P.G.) & M.E. PROGRAMMES */}
                <div className="border-r border-slate-100 pr-2">
                  <span className="text-[11.5px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b-[1.5px] border-[#D9A441]/50 pb-1 whitespace-nowrap">
                    POSTGRADUATE (P.G.)
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/mca" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Master of Computer Apps (MCA)
                    </Link>
                    <Link to="/departments/mba" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      Management Studies (MBA)
                    </Link>
                  </div>

                  <span className="text-[10.5px] uppercase font-black text-slate-600 tracking-wider block mt-2.5 mb-1 border-b border-slate-200 pb-0.5 whitespace-nowrap">
                    M.E. PROGRAMMES
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/me-cse" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      M.E. – Computer Science
                    </Link>
                    <Link to="/departments/me-thermal" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      M.E. – Thermal Engineering
                    </Link>
                    <Link to="/departments/me-vlsi" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      M.E. – VLSI Design
                    </Link>
                    <Link to="/departments/me-ped" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      M.E. – Power Electronics & Drives
                    </Link>
                    <Link to="/departments/me-cem" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      M.E. – Construction Engg. & Mgmt.
                    </Link>
                  </div>
                </div>

                {/* 4. DOCTOR OF PHILOSOPHY (PH.D.) */}
                <div>
                  <span className="text-[11.5px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b-[1.5px] border-[#D9A441]/50 pb-1 whitespace-nowrap">
                    DOCTOR OF PHILOSOPHY (PH.D.)
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/departments/phd-civil" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      PhD – Civil Engg.
                    </Link>
                    <Link to="/departments/phd-mech" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      PhD – Mechanical Engg.
                    </Link>
                    <Link to="/departments/phd-ece" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      PhD – Electronics & Comm. Engg.
                    </Link>
                    <Link to="/departments/phd-eee" onClick={() => setActiveDropdown(null)} className="block text-[12.5px] font-extrabold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-1.5 px-1.5 py-0.5 rounded-md transition-all whitespace-nowrap">
                      PhD – Electrical & Elect. Engg.
                    </Link>
                  </div>
                </div>

              </div>

              {/* Bottom Footer Bar */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                  APEC ACADEMIC DIRECTORIES
                </span>
                <Link 
                  to="/faculty" 
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border-[1.5px] border-[#E5A835] text-[#C59228] hover:bg-[#D4A347] hover:text-white font-black text-xs transition-all duration-200 shadow-2xs"
                >
                  <span>Open Faculty Directory</span>
                  <span className="text-xs font-bold leading-none">&gt;</span>
                </Link>
              </div>

            </div>
          </div>

          {/* 5. COE Direct Link */}
          <Link 
            to="/coe" 
            className={`rounded-full px-3 lg:px-3.5 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center whitespace-nowrap ${
              isActive('/coe') 
                ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
            }`}
            style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            title="Controller of Examinations"
          >
            COE
          </Link>

          {/* 6. PLACEMENTS Dropdown */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('placements')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'placements' ? null : 'placements')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/placements') 
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>PLACEMENTS</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${activeDropdown === 'placements' ? 'rotate-180' : ''} text-black`} />
            </button>
            <div className={`absolute top-full left-0 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_20px_50px_rgba(3,20,61,0.25)] rounded-2xl py-2.5 w-60 xl:w-64 text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'placements' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              <Link to="/placements" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Placement Records</Link>
              <Link to="/placements" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Recruiting Partners</Link>
              <Link to="/placements" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Industrial MOUs</Link>
            </div>
          </div>

          {/* 7. IQAC (Mega Menu with 3 Columns: IQAC, UGC, COMMITTEES) */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('iqac')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'iqac' ? null : 'iqac')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/iqac') || isActive('/ugc') || isActive('/committees') || isActive('/idp') || isActive('/mandatory-disclosure') || isActive('/annual-accounts') || isActive('/disclosures')
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>IQAC</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${
                activeDropdown === 'iqac' ? 'rotate-180' : ''
              } text-black`} />
            </button>

            {/* 3-Column Split Dropdown (IQAC, UGC, COMMITTEES) */}
            <div className={`absolute top-full left-1/2 -translate-x-[55%] xl:-translate-x-1/2 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_25px_50px_rgba(3,20,61,0.2)] rounded-2xl py-4 px-4 lg:px-5 w-[92vw] max-w-[750px] text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'iqac' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-4">
                
                {/* Column 1: IQAC */}
                <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-2 md:pb-0 md:pr-3">
                  <span className="text-[11px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b border-[#D9A441]/40 pb-1">
                    IQAC
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/iqac" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      IQAC Overview & Policy
                    </Link>
                    <Link to="/iqac-members" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      IQAC Committee Members
                    </Link>
                    <Link to="/iqac-mom-at" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      IQAC MoM & Action Taken
                    </Link>
                    <Link to="/disclosures" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Public Disclosures (NIRF/AICTE)
                    </Link>
                    <Link to="/about/profile" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Institutional Profile & NAAC
                    </Link>
                  </div>
                </div>

                {/* Column 2: UGC (2(f) & 12(B)) */}
                <div className="border-b md:border-b-0 md:border-r border-slate-100 pb-2 md:pb-0 md:pr-3">
                  <span className="text-[11px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b border-[#D9A441]/40 pb-1">
                    UGC 2(f) & 12(B)
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/ugc-approval-letter" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      UGC Autonomous Approval
                    </Link>
                    <Link to="/ugc-self-disclosure" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      UGC Self Disclosure Portal
                    </Link>
                    <Link to="/idp" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Institutional Development (IDP)
                    </Link>
                    <Link to="/mandatory-disclosure" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Mandatory Disclosure
                    </Link>
                    <Link to="/annual-accounts" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Annual Audited Accounts
                    </Link>
                    <Link to="/ugc-undertaking" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      UGC Undertaking Letter
                    </Link>
                  </div>
                </div>

                {/* Column 3: COMMITTEES */}
                <div>
                  <span className="text-[11px] uppercase font-black text-[#B38734] tracking-wider block mb-2 border-b border-[#D9A441]/40 pb-1">
                    Committees
                  </span>
                  <div className="space-y-0.5">
                    <Link to="/committees/anti-ragging" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Anti-Ragging Committee
                    </Link>
                    <Link to="/committees/iiic" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Industry-Institute Interaction
                    </Link>
                    <Link to="/committees/women-empowerment" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Women Empowerment Cell
                    </Link>
                    <Link to="/committees/sc-st-committee" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      SC / ST Cell
                    </Link>
                    <Link to="/committees/career-guidance" onClick={() => setActiveDropdown(null)} className="block text-xs font-bold text-[#03143D] hover:text-[#B38734] hover:bg-[#FAF8F2] hover:pl-2.5 px-2 py-1 rounded-md transition-all whitespace-nowrap">
                      Career Guidance & Placement
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 8. RESEARCH Direct Link */}
          <Link 
            to="/r-d-cell" 
            className={`rounded-full px-3 lg:px-3.5 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center whitespace-nowrap ${
              isActive('/r-d-cell') 
                ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
            }`}
            style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
          >
            RESEARCH
          </Link>

          {/* 9. LIFE AT APEC Dropdown */}
          <div 
            className="relative nav-dropdown-group"
            onMouseEnter={() => setActiveDropdown('facilities')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              type="button"
              onClick={() => setActiveDropdown(prev => prev === 'facilities' ? null : 'facilities')}
              className={`rounded-full px-2.5 lg:px-3 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isActive('/facilities') 
                  ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                  : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
            >
              <span>LIFE AT APEC</span>
              <ChevronDown className={`w-3 h-3 stroke-[2.5] transition-transform duration-200 ${activeDropdown === 'facilities' ? 'rotate-180' : ''} text-black`} />
            </button>
            <div className={`absolute top-full left-0 bg-white border border-slate-200 border-t-3 border-t-[#D9A441] shadow-[0_20px_50px_rgba(3,20,61,0.25)] rounded-2xl py-2.5 w-60 xl:w-64 text-left transition-all duration-200 z-[150] mt-1.5 before:content-[''] before:absolute before:-top-3.5 before:left-0 before:w-full before:h-3.5 ${activeDropdown === 'facilities' ? 'opacity-100 visible pointer-events-auto translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-1'}`}>
              <Link to="/facilities" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">All Campus Facilities</Link>
              <Link to="/facilities/library" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Central Library</Link>
              <Link to="/facilities/labs" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Advanced Laboratories</Link>
              <Link to="/facilities/hostels" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Hostel Accommodation</Link>
              <Link to="/facilities/sports" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Sports & Gymnasium</Link>
              <Link to="/facilities/transport" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-xs font-bold text-[#03143D] hover:bg-[#FAF8F2] hover:text-[#B38734] hover:pl-5 rounded-lg mx-2 transition-all">Transport Fleet</Link>
            </div>
          </div>

          {/* 10. ALUMNI Direct Link */}
          <Link 
            to="/alumni" 
            className={`rounded-full px-3 lg:px-3.5 xl:px-4 py-1.5 text-[9.5px] lg:text-[10px] xl:text-[11.5px] font-black uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center justify-center whitespace-nowrap ${
              isActive('/alumni') 
                ? 'bg-[#D4A347] text-black shadow-md ring-2 ring-[#F5E5B8]' 
                : 'bg-white text-black hover:bg-amber-50 hover:shadow-md'
            }`}
            style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" }}
          >
            ALUMNI
          </Link>

        </div>
      </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE NAVIGATION DRAWER (Slide-In / Slide-Down Menu)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden"
            />

            {/* Animated Mobile Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-[#071B52] text-white shadow-2xl z-[9999] flex flex-col border-l-2 border-[#D4A347] lg:hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-white/15 flex items-center justify-between bg-[#05143D] shrink-0">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={apecLogo} 
                    alt="APEC Emblem" 
                    className="w-9 h-9 object-contain bg-white rounded-full p-0.5" 
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-title text-xs font-black text-white leading-tight">APEC COLLEGE</span>
                    <span className="text-[8px] text-[#D4A347] font-black uppercase tracking-wider">Autonomous Portal</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white bg-white/10 rounded-lg cursor-pointer focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left">
                
                {/* Mobile Quick Action Buttons (Admin, ERP, Fee Payment) */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/15">
                  {isUserLoggedIn ? (
                    <>
                      <Link
                        to="/editor-panel"
                        onClick={() => setMobileMenuOpen(false)}
                        className="h-8.5 col-span-2 rounded-lg border border-[#D4A347] bg-[#D4A347] text-[#041744] text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#041744]" />
                        <span>{currentUserRole.startsWith('dept_') ? `${currentUserRole.replace('dept_', '').toUpperCase()} PANEL` : 'ADMIN CONSOLE'}</span>
                      </Link>
                      <Link
                        to="/admin/home"
                        onClick={() => setMobileMenuOpen(false)}
                        className="h-8 col-span-2 rounded-lg border border-[#D4A347]/50 bg-white/10 hover:bg-[#D4A347]/20 text-[#F3D78A] text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        <span>🖼️ CUSTOMIZE HOME PAGE</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="h-8.5 col-span-2 rounded-lg border border-[#D4A347] bg-[#D4A347]/20 hover:bg-[#D4A347]/30 text-[#F3D78A] text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#D4A347]" />
                      <span>ADMIN & STAFF LOGIN</span>
                    </Link>
                  )}

                  <a
                    href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-8 rounded-lg border border-[#0A58CA] bg-[#0A58CA] text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <Landmark className="w-3 h-3 text-white" />
                    <span>ERP PORTAL</span>
                  </a>

                  <Link
                    to="/fee-payment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-8 rounded-lg border border-[#15803D] bg-[#15803D]/25 text-[#4ade80] text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <span>FEE PAYMENT</span>
                  </Link>
                </div>

                {/* Mobile Accreditation Badges */}
                <div className="grid grid-cols-4 gap-2 py-2 px-1 border-b border-white/10 items-center justify-items-center">
                  <Link to="/about/profile" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-center">
                    <img src="/Images/Logos/university_logo-rem.png" alt="Anna Univ" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
                    <span className="text-[7.5px] font-bold text-white uppercase mt-1 leading-tight">ANNA UNIV</span>
                  </Link>
                  <Link to="/ugc-approval-letter" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-center">
                    <img src={ugcLogo} alt="UGC" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
                    <span className="text-[7.5px] font-bold text-white uppercase mt-1 leading-tight">UGC 12(B)</span>
                  </Link>
                  <Link to="/about/profile" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-center">
                    <img src="/Images/Logos/Naac.png" alt="NAAC" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
                    <span className="text-[7.5px] font-bold text-white uppercase mt-1 leading-tight">NAAC 'A'</span>
                  </Link>
                  <Link to="/about/profile" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center text-center">
                    <img src={logo40Years} alt="40+ Years" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
                    <span className="text-[7.5px] font-bold text-[#D4A347] uppercase mt-1 leading-tight">40+ YRS</span>
                  </Link>
                </div>

                {/* 1. HOME */}
                <a
                  href={homeUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider ${
                    isActive('/') ? 'bg-[#D4A347] text-[#071B52]' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  {isSubdomainMode() ? 'COLLEGE HOME' : 'HOME'}
                </a>

                {/* 2. ABOUT Accordion */}
                <div className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('about')}
                    className="w-full py-2 px-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white"
                  >
                    <span>ABOUT</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4A347] transition-transform ${mobileExpanded.about ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded.about && (
                    <div className="pl-4 space-y-1.5 pt-1 text-xs text-slate-300 border-l border-[#D4A347]/40 ml-3">
                      <Link to="/about/profile" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Institutional Profile</Link>
                      <Link to="/about/founders" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Founder & Trustees</Link>
                      <Link to="/about/principal" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Principal Desk</Link>
                      <Link to="/about/administration" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Administration</Link>
                    </div>
                  )}
                </div>

                {/* 3. ADMISSION Accordion */}
                <div className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('admission')}
                    className="w-full py-2 px-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white"
                  >
                    <span>ADMISSION</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4A347] transition-transform ${mobileExpanded.admission ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded.admission && (
                    <div className="pl-4 space-y-1.5 pt-1 text-xs text-slate-300 border-l border-[#D4A347]/40 ml-3">
                      <Link to="/admission?tab=courses" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Courses Offered</Link>
                      <Link to="/admission?tab=procedure" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Admission Procedure</Link>
                      <Link to="/cutoff-calculator" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Cutoff Calculator</Link>
                      <Link to="/admission?tab=scholarships" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Scholarships</Link>
                      <Link to="/fee-payment" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Online Fee Payment</Link>
                    </div>
                  )}
                </div>

                {/* 4. ACADEMICS Accordion */}
                <div className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('academics')}
                    className="w-full py-2 px-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white"
                  >
                    <span>ACADEMICS</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4A347] transition-transform ${mobileExpanded.academics ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded.academics && (
                    <div className="pl-4 space-y-2 pt-1 text-xs text-slate-300 border-l border-[#D4A347]/40 ml-3">
                      {/* Key Sections & Regulation Buttons */}
                      <div className="space-y-1.5 pb-2 border-b border-white/10">
                        <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="block px-2.5 py-1 rounded-md bg-white/10 text-white font-bold hover:bg-[#D4A347] hover:text-[#041744] transition-all">
                          🏛️ All Departments (14 Branches)
                        </Link>
                        
                        <div className="pt-1">
                          <span className="text-[10px] uppercase font-black text-[#D4A347] block mb-1">Academic Regulations</span>
                          <div className="grid grid-cols-3 gap-1">
                            <Link 
                              to="/regulations?reg=26" 
                              onClick={() => setMobileMenuOpen(false)} 
                              className="px-2 py-1 text-center rounded-md bg-[#D4A347]/20 text-[#E5B54F] font-bold text-[11px] hover:bg-[#D4A347] hover:text-[#041744] transition-all"
                            >
                              Reg 26
                            </Link>
                            <Link 
                              to="/regulations?reg=25" 
                              onClick={() => setMobileMenuOpen(false)} 
                              className="px-2 py-1 text-center rounded-md bg-[#D4A347]/20 text-[#E5B54F] font-bold text-[11px] hover:bg-[#D4A347] hover:text-[#041744] transition-all"
                            >
                              Reg 25
                            </Link>
                            <Link 
                              to="/regulations?reg=21" 
                              onClick={() => setMobileMenuOpen(false)} 
                              className="px-2 py-1 text-center rounded-md bg-[#D4A347]/20 text-[#E5B54F] font-bold text-[11px] hover:bg-[#D4A347] hover:text-[#041744] transition-all"
                            >
                              Reg 21
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Department Quick List */}
                      <span className="text-[10px] uppercase font-black text-[#D4A347] block pt-1">Academic Branches</span>
                      <Link to="/departments/cse" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">CSE</Link>
                      <Link to="/departments/aiml" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">AI & ML</Link>
                      <Link to="/departments/it" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">Information Tech (IT)</Link>
                      <Link to="/departments/ece" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">ECE</Link>
                      <Link to="/departments/eee" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">EEE</Link>
                      <Link to="/departments/mech" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">Mechanical</Link>
                      <Link to="/departments/civil" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">Civil</Link>
                      <Link to="/departments/sh" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 hover:text-[#D4A347]">Science & Humanities</Link>
                      
                      <div className="pt-1.5 border-t border-white/10 space-y-1">
                        <Link to="/faculty" onClick={() => setMobileMenuOpen(false)} className="block py-0.5 text-slate-300 hover:text-[#D4A347] font-semibold">
                          👥 Faculty Directory
                        </Link>
                      </div>
                    </div>
                  )}
                </div>


                {/* 5. COE */}
                <Link
                  to="/coe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  COE
                </Link>

                {/* 6. PLACEMENTS */}
                <Link
                  to="/placements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  PLACEMENTS
                </Link>

                {/* 7. RTI */}
                <Link
                  to="/rti"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  RTI
                </Link>

                {/* 8. IQAC Accordion (includes IQAC, UGC, COMMITTEES) */}
                <div className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('iqac')}
                    className="w-full py-2 px-3 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white"
                  >
                    <span>IQAC, UGC & COMMITTEES</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4A347] transition-transform ${mobileExpanded.iqac ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded.iqac && (
                    <div className="pl-4 space-y-3 pt-1 text-xs text-slate-300 border-l border-[#D4A347]/40 ml-3">
                      {/* Sub-Group 1: IQAC */}
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#D4A347] tracking-wider block mb-1">IQAC</span>
                        <div className="pl-2 space-y-1 border-l border-white/10">
                          <Link to="/iqac" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">IQAC Overview</Link>
                          <Link to="/iqac-members" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">IQAC Members</Link>
                          <Link to="/iqac-mom-at" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">MoM & Action Taken</Link>
                          <Link to="/disclosures" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Disclosures (NIRF/AICTE)</Link>
                        </div>
                      </div>

                      {/* Sub-Group 2: UGC */}
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#D4A347] tracking-wider block mb-1">UGC 2(f) & 12(B)</span>
                        <div className="pl-2 space-y-1 border-l border-white/10">
                          <Link to="/ugc-approval-letter" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">UGC Autonomous Approval</Link>
                          <Link to="/ugc-self-disclosure" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">UGC Self Disclosure</Link>
                          <Link to="/idp" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">IDP</Link>
                          <Link to="/mandatory-disclosure" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Mandatory Disclosure</Link>
                          <Link to="/annual-accounts" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Annual Accounts</Link>
                          <Link to="/ugc-undertaking" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">UGC Undertaking</Link>
                        </div>
                      </div>

                      {/* Sub-Group 3: Committees */}
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#D4A347] tracking-wider block mb-1">Committees</span>
                        <div className="pl-2 space-y-1 border-l border-white/10">
                          <Link to="/committees/anti-ragging" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Anti-Ragging Committee</Link>
                          <Link to="/committees/iiic" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Industry-Institute (IIIC)</Link>
                          <Link to="/committees/women-empowerment" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Women Empowerment</Link>
                          <Link to="/committees/sc-st-committee" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">SC/ST Cell</Link>
                          <Link to="/committees/career-guidance" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#D4A347]">Career Guidance Cell</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. RESEARCH */}
                <Link
                  to="/r-d-cell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  RESEARCH
                </Link>

                {/* 10. LIFE AT APEC */}
                <Link
                  to="/facilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  LIFE AT APEC
                </Link>

                {/* 11. ALUMNI CELL */}
                <Link
                  to="/alumni"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  ALUMNI CELL
                </Link>

                {/* Bottom Action Quick Buttons */}
                <div className="pt-4 space-y-2 border-t border-white/15">
                  <Link
                    to="/coe"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-[#8A1538] hover:bg-[#70102D] text-white font-black text-xs uppercase tracking-wider rounded-xl text-center shadow"
                  >
                    🎓 COE (CONTROLLER OF EXAMINATIONS)
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPanoOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#D4A347] text-[#071B52] font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow flex items-center justify-center gap-2"
                  >
                    <span>🧭 360° VR CAMPUS TOUR</span>
                  </button>

                  <Link
                    to="/fee-payment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-[#175C3B] hover:bg-[#124B30] text-white font-black text-xs uppercase tracking-wider rounded-xl text-center shadow"
                  >
                    💳 ONLINE FEE PAYMENT
                  </Link>

                  <a
                    href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 bg-[#071B52] hover:bg-[#122347] text-white font-black text-xs uppercase tracking-wider rounded-xl text-center shadow"
                  >
                    💻 ERP PORTAL (VMEDULIFE)
                  </a>

                  {isUserLoggedIn ? (
                    <div className="pt-2 border-t border-white/20 space-y-2">
                      <Link
                        to="/editor-panel"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#D4A347] text-[#041744] font-black text-xs uppercase tracking-wider rounded-xl text-center shadow active:scale-95 transition-all"
                      >
                        <Shield className="w-4 h-4 text-[#041744]" />
                        <span>{currentUserRole.startsWith('dept_') ? `${currentUserRole.replace('dept_', '').toUpperCase()} PANEL` : 'ADMIN CONSOLE'}</span>
                      </Link>
                      <Link
                        to="/admin/home"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-[#D4A347]/20 text-[#F3D78A] border border-[#D4A347]/40 font-black text-xs uppercase tracking-wider rounded-xl text-center shadow active:scale-95 transition-all"
                      >
                        <span>🖼️ CUSTOMIZE HOME PAGE</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          localStorage.removeItem('is_logged_in');
                          localStorage.removeItem('user_role');
                          localStorage.removeItem('apec_user');
                          window.dispatchEvent(new Event('storage'));
                          window.dispatchEvent(new Event('apec_storage_update'));
                          window.location.reload();
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-400/40 font-black text-xs uppercase tracking-wider rounded-xl text-center shadow cursor-pointer active:scale-95 transition-all"
                      >
                        <LogOut className="w-4 h-4 text-rose-300" />
                        <span>SIGN OUT FROM PORTAL</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-white/20">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#D4A347]/20 hover:bg-[#D4A347]/30 border border-[#D4A347] text-[#F3D78A] font-black text-xs uppercase tracking-wider rounded-xl text-center shadow active:scale-95 transition-all"
                      >
                        <Shield className="w-4 h-4 text-[#D4A347]" />
                        <span>ADMIN & STAFF LOGIN</span>
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
