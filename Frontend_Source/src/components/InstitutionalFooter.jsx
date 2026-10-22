import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

export default function InstitutionalFooter({ setIsPanoOpen }) {
  const [mobileSections, setMobileSections] = useState({
    about: false,
    academics: false,
    portals: false,
  });

  const toggleMobileSection = (key) => {
    setMobileSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#0D182E] via-[#091224] to-[#050A14] text-[#FAF8F5] relative select-none pt-5 lg:pt-8 pb-4 lg:pb-5 px-3.5 sm:px-6 md:px-12 z-20 overflow-hidden">
      
      {/* ── Top Radiant Gold Trim & Center Glow ── */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059] to-[#C5A059]/20 shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-48 h-6 bg-[#C5A059]/10 blur-xl pointer-events-none" />

      {/* ── Subtle Background Ambient Texture ── */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="max-w-[1550px] mx-auto relative z-10">
        
        {/* ═════════════════════════════════════════════════════════════
            MOBILE COMPACT SHORTENED FOOTER (< 1024px)
            Drastically shortened for mobile view alone:
            - Compact logo & institutional identity
            - 1-tap quick buttons for Call, Email & Location
            - Sleek collapsible accordions for link sections
            ═════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden space-y-3 pb-4 border-b border-white/10 text-left">
          
          {/* Mobile Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-white p-1 border-2 border-[#C5A059] shadow-md flex items-center justify-center shrink-0">
              <img 
                src="/Images/Logos/apec-logo.png" 
                alt="APEC Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title text-sm xs:text-base font-black text-white tracking-wide uppercase leading-tight truncate">
                ADHIPARASAKTHI
              </span>
              <span className="text-[9px] xs:text-[10px] text-[#C5A059] font-black uppercase tracking-wider mt-0.5">
                Engineering College (Autonomous)
              </span>
              <span className="text-[8px] xs:text-[9px] text-[#E5DEC9]/80 font-bold tracking-wider">
                Anna Univ Affiliated • Estd. 1984 • Melmaruvathur
              </span>
            </div>
          </div>

          {/* Quick 1-Tap Action Row */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
            <a 
              href="tel:+917418064336" 
              className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#C5A059]/40 text-[#DDD5C5] hover:text-[#C5A059] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Phone className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>Call</span>
            </a>
            <a 
              href="mailto:principal@apec.edu.in" 
              className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#C5A059]/40 text-[#DDD5C5] hover:text-[#C5A059] flex items-center justify-center gap-1.5 active:scale-95 transition-all truncate"
            >
              <Mail className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>Email</span>
            </a>
            <Link 
              to="/contact" 
              className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#C5A059]/40 text-[#DDD5C5] hover:text-[#C5A059] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>Location</span>
            </Link>
          </div>

          {/* Collapsible Mobile Link Accordions (Collapsed by default to keep footer ultra-short) */}
          <div className="space-y-1.5 pt-1">
            
            {/* 1. College & About Accordion */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileSection('about')}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-[#E5DEC9] hover:text-white cursor-pointer"
              >
                <span className="font-title uppercase tracking-wider text-[10.5px] text-[#C5A059]">
                  🏛️ College & Governance
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-200 ${mobileSections.about ? 'rotate-180' : ''}`} />
              </button>
              {mobileSections.about && (
                <div className="px-3 pb-2.5 pt-1 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-[#DDD5C5] border-t border-white/5">
                  <Link to="/about/profile" className="hover:text-[#C5A059]">› Profile</Link>
                  <Link to="/about/founders" className="hover:text-[#C5A059]">› Trustees</Link>
                  <Link to="/about/principal" className="hover:text-[#C5A059]">› Principal</Link>
                  <Link to="/about" className="hover:text-[#C5A059]">› Vision & Mission</Link>
                  <Link to="/ugc-self-disclosure" className="hover:text-[#C5A059]">› UGC Status</Link>
                  <Link to="/mandatory-disclosure" className="hover:text-[#C5A059]">› Disclosures</Link>
                  <Link to="/rti" className="hover:text-[#C5A059] col-span-2">› RTI Act</Link>
                </div>
              )}
            </div>

            {/* 2. Academics & Admissions Accordion */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileSection('academics')}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-[#E5DEC9] hover:text-white cursor-pointer"
              >
                <span className="font-title uppercase tracking-wider text-[10.5px] text-[#C5A059]">
                  🎓 Academics & Admissions
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-200 ${mobileSections.academics ? 'rotate-180' : ''}`} />
              </button>
              {mobileSections.academics && (
                <div className="px-3 pb-2.5 pt-1 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-[#DDD5C5] border-t border-white/5">
                  <Link to="/admission" className="hover:text-[#C5A059]">› Admissions</Link>
                  <Link to="/departments" className="hover:text-[#C5A059]">› Departments</Link>
                  <Link to="/cutoff-calculator" className="hover:text-[#C5A059]">› Cutoff Calc</Link>
                  <Link to="/coe" className="hover:text-[#C5A059]">› COE Office</Link>
                  <Link to="/faculty" className="hover:text-[#C5A059]">› Faculty</Link>
                  <Link to="/r-d-cell" className="hover:text-[#C5A059]">› R&D Cell</Link>
                  <Link to="/facilities/library" className="hover:text-[#C5A059] col-span-2">› Central Library</Link>
                </div>
              )}
            </div>

            {/* 3. Quick Portals & Facilities Accordion */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileSection('portals')}
                className="w-full px-3 py-2 flex items-center justify-between text-left text-xs font-bold text-[#E5DEC9] hover:text-white cursor-pointer"
              >
                <span className="font-title uppercase tracking-wider text-[10.5px] text-[#C5A059]">
                  ⚡ Portals & Facilities
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-200 ${mobileSections.portals ? 'rotate-180' : ''}`} />
              </button>
              {mobileSections.portals && (
                <div className="px-3 pb-2.5 pt-1 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-[#DDD5C5] border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsPanoOpen && setIsPanoOpen(true)}
                    className="hover:text-[#C5A059] text-left cursor-pointer"
                  >
                    › 360° VR Tour
                  </button>
                  <Link to="/fee-payment" className="hover:text-[#C5A059]">› Fee Payment</Link>
                  <a href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059]">› ERP Portal</a>
                  <Link to="/login" className="hover:text-white text-[#D4A347]">› Staff Login</Link>
                  <Link to="/placements" className="hover:text-[#C5A059]">› Placements</Link>
                  <Link to="/facilities" className="hover:text-[#C5A059]">› Facilities</Link>
                  <Link to="/alumni" className="hover:text-[#C5A059]">› Alumni</Link>
                  <Link to="/contact" className="hover:text-[#C5A059]">› Helpdesk</Link>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════
            DESKTOP FULL 5-COLUMN GRID (≥ 1024px)
            Unchanged: Full institutional identity, full descriptions,
            and comprehensive 22+ links across 3 dedicated columns.
            ═════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:grid grid-cols-5 gap-8 pb-7 border-b border-white/10 text-left">
          
          {/* Column 1: Institutional Identity */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 border-2 border-[#C5A059] shadow-xl ring-4 ring-[#C5A059]/15 flex items-center justify-center shrink-0">
                <img 
                  src="/Images/Logos/apec-logo.png" 
                  alt="APEC Emblem" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-title text-base sm:text-lg font-black text-white tracking-wide uppercase leading-tight">
                  ADHIPARASAKTHI
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#C5A059] font-black uppercase tracking-widest mt-0.5">
                  Engineering College (Autonomous)
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#E5DEC9]/80 font-bold tracking-wider">
                  Affiliated to Anna University • Estd. 1984
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 max-w-lg backdrop-blur-xs">
              <p className="text-[11px] sm:text-xs text-[#DDD5C5] leading-relaxed font-medium">
                Empowering youth through world-class technical education, character building, research excellence, and human values anchored in our motto: <strong className="text-[#C5A059] font-bold">Study, Spirituality, and Service</strong>.
              </p>
            </div>

            {/* Address & Quick Helplines */}
            <div className="space-y-2 pt-0.5 text-xs text-[#E8E2D5] font-medium max-w-lg">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                </div>
                <span className="leading-snug text-[#DDD5C5]">Melmaruvathur, Cheyyur Taluk, Chengalpattu District, Tamil Nadu – 603319, India.</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3 text-[#C5A059]" />
                  </div>
                  <span className="text-[#DDD5C5]">
                    <a href="tel:+917418064336" className="hover:text-[#C5A059] transition-colors font-mono font-bold">+91 7418064336</a>
                    <span className="text-[#C5A059]/50 mx-1">/</span>
                    <a href="tel:+917418065336" className="hover:text-[#C5A059] transition-colors font-mono font-bold">7418065336</a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-3 h-3 text-[#C5A059]" />
                  </div>
                  <a href="mailto:principal@apec.edu.in" className="hover:text-[#C5A059] transition-colors font-mono font-bold text-[#DDD5C5] break-all">principal@apec.edu.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: College & Governance */}
          <div className="space-y-2.5">
            <div className="relative pb-1.5 border-b border-white/10 mb-2.5">
              <h4 className="font-title text-xs font-black text-[#C5A059] uppercase tracking-widest">
                College & About
              </h4>
              <div className="absolute -bottom-px left-0 w-8 h-0.5 bg-[#C5A059]" />
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-[#DDD5C5]">
              <li><Link to="/about/profile" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Institutional Profile</Link></li>
              <li><Link to="/about/founders" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Founder & Trustees</Link></li>
              <li><Link to="/about/principal" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Principal's Desk</Link></li>
              <li><Link to="/about" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Vision & Mission</Link></li>
              <li><Link to="/ugc-self-disclosure" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> UGC Autonomous Status</Link></li>
              <li><Link to="/mandatory-disclosure" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Mandatory Disclosure</Link></li>
              <li><Link to="/rti" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Right to Information (RTI)</Link></li>
            </ul>
          </div>

          {/* Column 3: Academics & Admissions */}
          <div className="space-y-2.5">
            <div className="relative pb-1.5 border-b border-white/10 mb-2.5">
              <h4 className="font-title text-xs font-black text-[#C5A059] uppercase tracking-widest">
                Academics & Admissions
              </h4>
              <div className="absolute -bottom-px left-0 w-8 h-0.5 bg-[#C5A059]" />
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-[#DDD5C5]">
              <li><Link to="/admission" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Admissions 2026–2027</Link></li>
              <li><Link to="/departments" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> All Academic Departments</Link></li>
              <li><Link to="/cutoff-calculator" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> TNEA Cutoff Calculator</Link></li>
              <li><Link to="/coe" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Controller of Examinations</Link></li>
              <li><Link to="/faculty" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Faculty Directory</Link></li>
              <li><Link to="/r-d-cell" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Research & Development</Link></li>
              <li><Link to="/facilities/library" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Central Library OPAC</Link></li>
            </ul>
          </div>

          {/* Column 4: Quick Portals & Facilities */}
          <div className="space-y-2.5">
            <div className="relative pb-1.5 border-b border-white/10 mb-2.5">
              <h4 className="font-title text-xs font-black text-[#C5A059] uppercase tracking-widest">
                Quick Portals
              </h4>
              <div className="absolute -bottom-px left-0 w-8 h-0.5 bg-[#C5A059]" />
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-[#DDD5C5]">
              <li>
                <button 
                  type="button" 
                  onClick={() => setIsPanoOpen && setIsPanoOpen(true)}
                  className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 text-left cursor-pointer font-bold hover:translate-x-1 duration-200"
                >
                  <span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> 360° VR Campus Tour
                </button>
              </li>
              <li><Link to="/fee-payment" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Online Fee Payment</Link></li>
              <li>
                <a 
                  href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"
                >
                  <span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> ERP Portal (VMedulife)
                </a>
              </li>
              <li><Link to="/login" className="group text-[#D4A347] hover:text-white transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059] group-hover:text-white transition-colors">›</span> Staff & Admin Portal</Link></li>
              <li><Link to="/placements" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Training & Placements</Link></li>
              <li><Link to="/facilities" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Campus Facilities</Link></li>
              <li><Link to="/alumni" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Alumni Network</Link></li>
              <li><Link to="/contact" className="group hover:text-[#C5A059] transition-all flex items-center gap-1.5 font-bold hover:translate-x-1 duration-200"><span className="text-[#C5A059]/60 group-hover:text-[#C5A059] transition-colors">›</span> Contact & Helpdesk</Link></li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM SECTION: Copyright, Social Media & Policy Links ── */}
        <div className="pt-3 sm:pt-5 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold text-[#C5BBA4] text-center">
          <p>© 2026 Adhiparasakthi Engineering College. All Rights Reserved.</p>

          {/* Social Media (Desktop large pill, Mobile compact sleek row) */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4.5 bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] border border-white/20 rounded-full px-4 py-1.5 sm:px-6 sm:py-2.5 shadow-md backdrop-blur-md">
            <a 
              href="https://www.facebook.com/adhiparasakthiengineeringcollege/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center relative shadow-sm ring-1 ring-white/25 hover:ring-white/60 transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(24,119,242,0.6)]"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 22v-8.5h2.8l.4-3.5h-3.2v-2.2c0-1 .3-1.7 1.7-1.7h1.8V3c-.3 0-1.4-.1-2.7-.1-2.7 0-4.6 1.6-4.6 4.7v2.4H6.8v3.5h2.9V22h3.8z" />
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/apec1984/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center relative shadow-sm ring-1 ring-white/25 hover:ring-white/60 transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(220,39,67,0.6)]"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/school/adhiparasakthi-engineering-college/?originalSubdomain=in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center relative shadow-sm ring-1 ring-white/25 hover:ring-white/60 transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,102,194,0.6)]"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
              </svg>
            </a>
            <a 
              href="https://www.youtube.com/channel/UCHONHHxcE0lM8G60CEJT09Q" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#FF0000] text-white flex items-center justify-center relative shadow-sm ring-1 ring-white/25 hover:ring-white/60 transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,0,0,0.6)]"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 font-bold">
            <Link to="/mandatory-disclosure" className="hover:text-[#C5A059] transition-colors">Mandatory Disclosure</Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/rti" className="hover:text-[#C5A059] transition-colors">RTI Act</Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/iqac" className="hover:text-[#C5A059] transition-colors">IQAC Policy</Link>
            <span className="text-[#C5A059]/40">•</span>
            <Link to="/contact" className="hover:text-[#C5A059] transition-colors">Help Desk</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
