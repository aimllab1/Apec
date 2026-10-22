import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Download, ChevronDown, ChevronUp, Send, RotateCw, ChevronRight, Smartphone, Laptop,
  ExternalLink
} from 'lucide-react';
import Preloader from './components/Preloader';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import InstitutionalProfile from './pages/InstitutionalProfile';
import FounderTrustees from './pages/FounderTrustees';
import PrincipalDesk from './pages/PrincipalDesk';
import Faculty from './pages/Faculty';
import Admission from './pages/Admission';
import Facilities from './pages/Facilities';
import Placements from './pages/Placements';
import Departments from './pages/Departments';
import Regulations from './pages/Regulations';
import Administration from './pages/Administration';
import Contact from './pages/Contact';
import DepartmentDetail from './pages/DepartmentDetail';
import FacilityDetail from './pages/FacilityDetail';
import AdminPortal from './pages/AdminPortal';
import AdminProfile from './pages/AdminProfile';
import PanoramaModal from './components/PanoramaModal';
import Login from './pages/Login';
import CutoffCalculator from './pages/CutoffCalculator';
import FeePayment from './pages/FeePayment';
import RDCell from './pages/RDCell';
import IDP from './pages/IDP';
import UgcGuidelines from './pages/UgcGuidelines';
import MandatoryDisclosure from './pages/MandatoryDisclosure';
import AnnualAccounts from './pages/AnnualAccounts';
import UgcUndertaking from './pages/UgcUndertaking';
import UgcApprovalLetter from './pages/UgcApprovalLetter';
import EditorPanel from './pages/EditorPanel';
import HomeEditor from './pages/HomeEditor';
import Rti from './pages/Rti';
import Iqac from './pages/Iqac';
import IqacMembers from './pages/IqacMembers';
import IqacMeetings from './pages/IqacMeetings';
import Disclosures from './pages/Disclosures';
import AlumniCell from './pages/AlumniCell';
import Nirf from './pages/Nirf';
import InstrumentationCell from './pages/InstrumentationCell';
import Committees from './pages/Committees';
import Coe from './pages/Coe';
import CoeAdmin from './pages/CoeAdmin';
import InstitutionalHeader from './components/InstitutionalHeader';
import InstitutionalFooter from './components/InstitutionalFooter';
import { getLocalResponse } from './ai/engine/localAIClient.js';
import { getLoadedTourDataAsync } from './data/tourData';

// Scroll to Top on Page Change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 3D Hologram Torus spinning cleanly in one direction (Y-axis)
function HologramTorus() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }
  });
  return (
    <group scale={1.25}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.6, 0.18, 10, 28]} />
        <meshBasicMaterial color="#0f172a" wireframe transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

// White variant of HologramTorus for use inside the gradient chat bubble
function HologramTorusWhite() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }
  });
  return (
    <group scale={1.25}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.6, 0.18, 10, 28]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

// Consistent Page-Level transition wrapper component
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <ScrollToTop />
      <ReactLenis root>
        <AppContent isLoading={isLoading} setIsLoading={setIsLoading} />
      </ReactLenis>
    </Router>
  );
}

// List of friendly prompts for rotation (defined in module scope to prevent hook dependency issues)
const chatPrompts = [
  "Ask me anything!",
  "Need help with admissions?",
  "Looking for a department?",
  "I'm here to help!",
  "Ask me anything about APEC!",
  "Have a question?"
];

const stripEmojis = (text) => {
  if (typeof text !== 'string') return text;
  // Broad Unicode ranges to capture and remove emoji icons/symbols
  return text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
};

// AIAvatar component representing the college logo with online status indicator
const AIAvatar = ({ thinking }) => {
  return (
    <div className={`ai-avatar ${thinking ? 'thinking' : ''}`}>
      <img src="/Images/Logos/apec-logo.png" alt="APEC Logo" />
      {thinking && (
        <span className="absolute bottom-0 right-0 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
    </div>
  );
};

// SVG icons helper for suggestion chips
const getSuggestionIcon = (icon) => {
  switch (icon) {
    case 'Admissions':
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'Courses Offered':
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'Placement Details':
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'Departments':
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    default:
      return null;
  }
};

function AppContent({ isLoading, setIsLoading }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/editor') || 
                       location.pathname.startsWith('/admin-portal') || 
                       location.pathname.startsWith('/admin-profile') ||
                       location.pathname.startsWith('/admin/home') ||
                       location.pathname.startsWith('/home-editor');
  const isHome = location.pathname === '/';
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileDepartmentsOpen, setMobileDepartmentsOpen] = useState(false);
  const [mobileUgcOpen, setMobileUgcOpen] = useState(false);
  const [mobileAdmissionOpen, setMobileAdmissionOpen] = useState(false);
  const [mobileCommitteesOpen, setMobileCommitteesOpen] = useState(false);
  const [mobileIqacOpen, setMobileIqacOpen] = useState(false);
  const sessionId = React.useRef(`apec-${Date.now()}-${Math.random().toString(36).slice(2)}`).current;
  const [chatOpen, setChatOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isPanoOpen, setIsPanoOpen] = useState(false);
  const [branding, setBranding] = useState({
    collegeName: 'Adhiparasakthi Engineering College',
    tagline: 'An Autonomous Institution',
    helpline1: '7418064336',
    helpline2: '7418065336',
  });

  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (key) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  const [desktopOpenSection, setDesktopOpenSection] = useState(null);
  const toggleDesktopSection = (key) => {
    setDesktopOpenSection(prev => prev === key ? null : key);
  };

  const aboutLinks = [
    { label: 'About APEC', to: '/about' },
    { label: 'Vision & Mission', to: '/about' },
    { label: 'Management & Founders', to: '/about/founders' },
    { label: 'Institutional Profile', to: '/about/profile' },
    { label: 'Principal\'s Desk', to: '/about/principal' },
    { label: 'UGC Autonomous Status', to: '/ugc-self-disclosure' },
    { label: 'Mandatory Disclosure', to: '/mandatory-disclosure' },
    { label: 'Contact Directory', to: '/contact' }
  ];

  const academicsLinks = [
    { label: 'Departments List', to: '/departments' },
    { label: 'Undergraduate (B.E.)', to: '/departments' },
    { label: 'Postgraduate (M.E.)', to: '/departments' },
    { label: 'Postgraduate (MCA / MBA)', to: '/departments' },
    { label: 'Research & Development', to: '/r-d-cell' },
    { label: 'Academic Facilities', to: '/facilities' },
    { label: 'Lab Infrastructure', to: '/facilities/labs' },
    { label: 'Curriculum & Regulations', to: '/coe' }
  ];

  const admissionsCareerLinks = [
    { label: 'Admissions 2026–2027', to: '/admission' },
    { label: 'Admission Enquiry', to: '/admission' },
    { label: 'Courses Offered', to: '/admission' },
    { label: 'Cutoff Calculator', to: '/cutoff-calculator' },
    { label: 'Training & Placement', to: '/placements' },
    { label: 'Placement Records', to: '/placements' },
    { label: 'Placement Officer Contact', to: '/contact' }
  ];

  const campusServicesLinks = [
    { label: 'Campus Facilities', to: '/facilities' },
    { label: 'Central Library', to: '/facilities/library' },
    { label: 'Residential Hostels', to: '/facilities/hostels' },
    { label: 'Sports & Gymnasium', to: '/facilities/sports' },
    { label: 'Transportation & Bus', to: '/facilities/transport' },
    { label: 'Committees & Cells', to: '/committees' },
    { label: 'IQAC Portal', to: '/iqac' },
    { label: '360° VR Campus Tour', onClick: () => setIsPanoOpen(true) },
    { label: 'ERP Portal (VMedulife)', to: 'https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur' },
    { label: 'Staff & Admin Portal', to: '/login' },
    { label: 'Fee Payment Portal', to: '/fee-payment' }
  ];

  const renderMobileAccordion = (key, title, links) => {
    const isOpen = openSection === key;
    return (
      <div className="border-b border-gray-200/80">
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between py-3.5 px-1 text-sm font-bold text-[#07113A] hover:text-amber-600 transition-colors cursor-pointer"
        >
          <span className="font-title uppercase tracking-wider">{title}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="space-y-1 pb-4 pl-2 text-left">
                {links.map((link, idx) => (
                  <li key={idx}>
                    {link.onClick ? (
                      <button
                        type="button"
                        onClick={link.onClick}
                        className="w-full text-sm font-semibold text-slate-600 hover:text-[#07113A] py-2 block text-left cursor-pointer focus:outline-none"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.to}
                        className="w-full text-sm font-semibold text-slate-600 hover:text-[#07113A] py-2 block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMobileAccreditationAccordion = () => {
    const isOpen = openSection === 'accreditation';
    return (
      <div className="border-b border-gray-200/80">
        <button
          type="button"
          onClick={() => toggleSection('accreditation')}
          className="w-full flex items-center justify-between py-3.5 px-1 text-sm font-bold text-[#07113A] hover:text-amber-600 transition-colors cursor-pointer"
        >
          <span className="font-title uppercase tracking-wider">ACCREDITATION</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 py-4 pl-2 text-left">
                {/* Anna University */}
                <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
                  <img src="/Images/Logos/university_logo-rem.png" alt="Anna University" className="h-8 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#07113A] group-hover:text-amber-600 transition-colors duration-300">Anna University</span>
                    <span className="text-xs text-slate-500 font-semibold">Affiliated Institution</span>
                  </div>
                </div>

                {/* UGC Autonomous */}
                <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
                  <img src="/Images/Logos/UGC.png" alt="UGC" className="h-8 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#07113A] group-hover:text-amber-600 transition-colors duration-300 font-sans">UGC Autonomous</span>
                    <span className="text-xs text-slate-500 font-semibold">10 Years Status</span>
                  </div>
                </div>

                {/* NAAC Grade A */}
                <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
                  <img src="/Images/Logos/Naac.png" alt="NAAC" className="h-8 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#07113A] group-hover:text-amber-600 transition-colors duration-300 font-sans">NAAC Accredited</span>
                    <span className="text-xs text-slate-500 font-semibold">Grade 'A'</span>
                  </div>
                </div>

                {/* AICTE & NBA Approved */}
                <div className="flex flex-col gap-1.5 pt-1 group cursor-pointer w-fit p-2 rounded bg-gray-150 border border-gray-250 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 hover:shadow-[0_0_10px_rgba(245,158,11,0.35)] transition-all duration-300 animate-pulse">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 group-hover:text-amber-600">AICTE Approved</span>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">NBA Accredited Programs</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDesktopAccordion = (key, title, links) => {
    const isOpen = desktopOpenSection === key;
    return (
      <div className="flex flex-col text-left">
        <button
          type="button"
          onClick={() => toggleDesktopSection(key)}
          className="w-full flex items-center justify-between text-left font-title text-xs tracking-wider font-extrabold text-[#07113A] uppercase mb-3 border-b border-amber-500/10 pb-1.5 cursor-pointer hover:text-amber-600 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
            {title}
          </div>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 pb-3">
                {links.map((link, idx) => (
                  <li key={idx}>
                    {link.onClick ? (
                      <button 
                        type="button"
                        onClick={link.onClick}
                        className="text-xs font-semibold text-slate-650 hover:text-[#07113A] transition-colors duration-200 cursor-pointer text-left focus:outline-none block"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link to={link.to} className="text-xs font-semibold text-slate-650 hover:text-[#07113A] transition-colors duration-200 block">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDesktopAccreditationAccordion = () => {
    const isOpen = desktopOpenSection === 'accreditation';
    return (
      <div className="flex flex-col text-left">
        <button
          type="button"
          onClick={() => toggleDesktopSection('accreditation')}
          className="w-full flex items-center justify-between text-left font-title text-xs tracking-wider font-extrabold text-[#07113A] uppercase mb-3 border-b border-amber-500/10 pb-1.5 cursor-pointer hover:text-amber-600 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
            ACCREDITATION
          </div>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3.5 pb-3">
                {/* Anna University */}
                <div className="flex items-center gap-2 group cursor-pointer transition-all duration-300 font-sans">
                  <img src="/Images/Logos/university_logo-rem.png" alt="Anna University" className="h-7 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase group-hover:text-amber-600 transition-colors duration-300 font-sans">Anna University Affiliated</span>
                </div>

                {/* UGC Autonomous */}
                <div className="flex items-center gap-2 group cursor-pointer transition-all duration-300 font-sans">
                  <img src="/Images/Logos/UGC.png" alt="UGC" className="h-7 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase group-hover:text-amber-600 transition-colors duration-300 font-sans">UGC Autonomous</span>
                </div>

                {/* NAAC */}
                <div className="flex items-center gap-2 group cursor-pointer transition-all duration-300 font-sans">
                  <img src="/Images/Logos/Naac.png" alt="NAAC" className="h-7 w-auto object-contain filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase group-hover:text-amber-600 transition-colors duration-300 font-sans">NAAC Grade 'A'</span>
                </div>

                {/* AICTE */}
                <div className="flex items-center gap-1 bg-gray-150 border border-gray-250 px-2 py-0.5 rounded text-[9px] font-extrabold text-slate-800 tracking-wider w-fit cursor-pointer hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 hover:shadow-[0_0_10px_rgba(245,158,11,0.35)] transition-all duration-300">
                  AICTE APPROVED
                </div>

                {/* NBA */}
                <div className="flex items-center gap-1 bg-gray-150 border border-gray-250 px-2 py-0.5 rounded text-[9px] font-extrabold text-slate-800 tracking-wider w-fit cursor-pointer hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 hover:shadow-[0_0_10px_rgba(245,158,11,0.35)] transition-all duration-300 font-sans">
                  NBA ACCREDITED
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // PWA Deferred Prompt State for Desktop & Mobile Installation
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaModal(true);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const [tickerNews, setTickerNews] = useState([
    "🎓 Admissions Open for 2026–2027",
    "NAAC Accredited Institution",
    "UGC Autonomous College",
    "Affiliated to Anna University",
    "Placement Training Ongoing",
    "Campus Recruitment Updates",
    "Welcome to Adhiparasakthi Engineering College"
  ]);

  useEffect(() => {
    // Pre-warm the 360 Tour cache in the background on initial landing
    getLoadedTourDataAsync().catch(err => console.log("Tour preheat failed:", err));

    const reloadData = () => {
      const savedBranding = localStorage.getItem('apec_branding');
      if (savedBranding) {
        try { setBranding(JSON.parse(savedBranding)); } catch (e) {}
      }

      const savedTicker = localStorage.getItem('apec_ticker_news');
      if (savedTicker) {
        try { setTickerNews(JSON.parse(savedTicker)); } catch (e) {}
      }
    };

    reloadData();

    window.addEventListener('storage', reloadData);
    window.addEventListener('apec_storage_update', reloadData);
    return () => {
      window.removeEventListener('storage', reloadData);
      window.removeEventListener('apec_storage_update', reloadData);
    };
  }, []);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello 👋 I'm APEC AI Assistant. Ask me anything about admissions, departments, placements, facilities, or campus details." }
  ]);
  const chatBottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isOnline, setIsOnline] = useState(true);
  const chatbotRef = useRef(null);
  const [chatSession, setChatSession] = useState({
    turns: [],
    lastDepartment: null,
    lastTopic: null,
    lastDocId: null,
    turnCount: 0,
    createdAt: Date.now(),
    lastActivity: Date.now()
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.chatbot-avatar-container')) {
        return;
      }
      if (chatOpen && chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [chatOpen]);

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportOffsetTop, setViewportOffsetTop] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      const visualHeight = window.visualViewport.height;
      const offsetTop = window.visualViewport.offsetTop;
      
      setViewportHeight(visualHeight);
      setViewportOffsetTop(offsetTop);
      
      const isKeyboardActive = window.innerHeight - visualHeight > 150;
      setKeyboardOpen(isKeyboardActive);
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    
    handleViewportChange();

    return () => {
      window.visualViewport.removeEventListener('resize', handleViewportChange);
      window.visualViewport.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (chatOpen && windowWidth <= 768) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      const handleWindowScroll = () => {
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      window.scrollTo(0, 0);

      return () => {
        window.removeEventListener('scroll', handleWindowScroll);
        document.documentElement.style.overflow = "";
        document.documentElement.style.height = "";
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.body.style.position = "";
        document.body.style.width = "";
      };
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [chatOpen, windowWidth]);

  const chatbotStyle = {};
  if (chatOpen) {
    if (windowWidth <= 768) {
      chatbotStyle.height = `${viewportHeight}px`;
      chatbotStyle.top = `${viewportOffsetTop}px`;
    } else {
      chatbotStyle.width = '400px';
      chatbotStyle.height = '600px';
      chatbotStyle.bottom = '24px';
      chatbotStyle.right = '24px';
      chatbotStyle.borderRadius = '24px';
    }
  }

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const timer = setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [keyboardOpen]);

  useEffect(() => {
    if (chatOpen) {
      setBubbleVisible(false);
      return;
    }

    const showNewBubble = () => {
      const randomIndex = Math.floor(Math.random() * chatPrompts.length);
      setBubbleText(chatPrompts[randomIndex]);
      setBubbleVisible(true);
    };

    const runCycle = () => {
      showNewBubble();
      const hideTimeout = setTimeout(() => {
        setBubbleVisible(false);
      }, 4500);
      return hideTimeout;
    };

    let hideTimeoutId;
    // Repeat every 10 seconds
    const intervalId = setInterval(() => {
      hideTimeoutId = runCycle();
    }, 10000);

    // Initial trigger after 2 seconds
    const firstTriggerId = setTimeout(() => {
      hideTimeoutId = runCycle();
    }, 2000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(firstTriggerId);
      if (hideTimeoutId) clearTimeout(hideTimeoutId);
    };
  }, [chatOpen]);

  const handleInputFocus = () => {
    if (windowWidth <= 768) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.body.scrollTop = 0;
      }, 50);
    }
  };

  const handleChatSubmit = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    if (windowWidth <= 768) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.body.scrollTop = 0;
      }, 50);
    }
    const userText = textOverride || chatInput;
    if (!userText.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);
    if (!textOverride) setChatInput('');

    // Set typing loader
    const withLoading = [...updatedMessages, { sender: 'ai', text: 'Typing...', isLoading: true }];
    setMessages(withLoading);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      try {
        // Deep copy the session state to prevent direct mutation errors in React Strict Mode
        const sessionCopy = JSON.parse(JSON.stringify(chatSession));
        const { response, updatedSession } = getLocalResponse(userText, sessionCopy);
        
        if (updatedSession) {
          setChatSession(updatedSession);
        }
        
        setIsOnline(true);
        // Replace typing loader with the actual local AI response
        setMessages([...updatedMessages, { sender: 'ai', text: response }]);
      } catch (err) {
        console.error("Local AI Assistant error:", err);
        setIsOnline(false);
        setMessages([...updatedMessages, { 
          sender: 'ai', 
          text: "I couldn't find this information in the current college database. Please contact the college help desk for confirmation." 
        }]);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-indigo-600 selection:text-white relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes degreeBounce {
          0% {
            transform: translateY(0) scale(1);
            background-color: #f59e0b;
            box-shadow: 0 0 4px #f59e0b;
          }
          50% {
            background-color: #ef4444;
            box-shadow: 0 0 6px #ef4444;
          }
          100% {
            transform: translateY(-4px) scale(1.1);
            background-color: #3b82f6;
            box-shadow: 0 0 8px #3b82f6;
          }
        }
      `}} />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full flex flex-col grow justify-between relative"
          >
            {/* Constant College Theme Background */}
            {isHome && (
              <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#041744]" />
            )}
            
            {/* INSTITUTIONAL HEADER SYSTEM */}
            {!isAdminRoute && (
              <InstitutionalHeader setIsPanoOpen={setIsPanoOpen} />
            )}

            {/* Main Content Area: Staggered Fade Route Transitions */}
            <main className="grow">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><InstitutionalProfile /></PageTransition>} />
                  <Route path="/about/profile" element={<PageTransition><InstitutionalProfile /></PageTransition>} />
                  <Route path="/about/founders" element={<PageTransition><FounderTrustees /></PageTransition>} />
                  <Route path="/about/principal" element={<PageTransition><PrincipalDesk /></PageTransition>} />
                  <Route path="/about/administration" element={<PageTransition><Administration /></PageTransition>} />
                  <Route path="/administration" element={<PageTransition><Administration /></PageTransition>} />
                  <Route path="/about/alumni" element={<PageTransition><AlumniCell /></PageTransition>} />
                  <Route path="/alumni" element={<PageTransition><AlumniCell /></PageTransition>} />
                  <Route path="/alumni-cell" element={<PageTransition><AlumniCell /></PageTransition>} />
                  <Route path="/committees/alumni-cell" element={<PageTransition><AlumniCell /></PageTransition>} />
                  <Route path="/about/faculty" element={<PageTransition><Faculty /></PageTransition>} />
                  <Route path="/faculty" element={<PageTransition><Faculty /></PageTransition>} />
                  <Route path="/admission" element={<PageTransition><Admission /></PageTransition>} />
                  <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
                  <Route path="/placements" element={<PageTransition><Placements /></PageTransition>} />
                  <Route path="/departments" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/academics" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/academics/departments" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/regulations" element={<PageTransition><Regulations /></PageTransition>} />
                  <Route path="/academics/regulations" element={<PageTransition><Regulations /></PageTransition>} />
                  <Route path="/coe" element={<PageTransition><Coe /></PageTransition>} />
                  <Route path="/coe-admin" element={<PageTransition><CoeAdmin /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/feedback" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/fee-payment" element={<PageTransition><FeePayment /></PageTransition>} />
                  <Route path="/r-d-cell" element={<PageTransition><RDCell /></PageTransition>} />
                  <Route path="/idp" element={<PageTransition><IDP /></PageTransition>} />
                  <Route path="/ugc-self-disclosure" element={<PageTransition><UgcGuidelines /></PageTransition>} />
                  <Route path="/mandatory-disclosure" element={<PageTransition><MandatoryDisclosure /></PageTransition>} />
                  <Route path="/annual-accounts" element={<PageTransition><AnnualAccounts /></PageTransition>} />
                  <Route path="/ugc-undertaking" element={<PageTransition><UgcUndertaking /></PageTransition>} />
                  <Route path="/ugc-approval-letter" element={<PageTransition><UgcApprovalLetter /></PageTransition>} />
                  <Route path="/ugc-2f-12b" element={<PageTransition><UgcApprovalLetter /></PageTransition>} />
                  <Route path="/ugc-2f-and-12b" element={<PageTransition><UgcApprovalLetter /></PageTransition>} />
                  
                  {/* Separate detail files */}
                  <Route path="/departments/:id" element={<PageTransition><DepartmentDetail /></PageTransition>} />
                  <Route path="/facilities/:id" element={<PageTransition><FacilityDetail /></PageTransition>} />
                  <Route path="/admin-portal" element={<PageTransition><AdminPortal /></PageTransition>} />
                  <Route path="/administration/:id" element={<PageTransition><AdminProfile /></PageTransition>} />
                  <Route path="/rti" element={<PageTransition><Rti /></PageTransition>} />
                  <Route path="/iqac" element={<PageTransition><Iqac /></PageTransition>} />
                  <Route path="/iqac-members" element={<PageTransition><IqacMembers /></PageTransition>} />
                  <Route path="/iqac-mom-at" element={<PageTransition><IqacMeetings /></PageTransition>} />
                  <Route path="/disclosures" element={<PageTransition><Disclosures /></PageTransition>} />
                  <Route path="/nirf" element={<PageTransition><Nirf /></PageTransition>} />
                  <Route path="/instrumentation-cell" element={<PageTransition><InstrumentationCell /></PageTransition>} />
                  <Route path="/committees" element={<PageTransition><Committees /></PageTransition>} />
                  <Route path="/committees/:id" element={<PageTransition><Committees /></PageTransition>} />
                   <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/editor-panel" element={<PageTransition><EditorPanel /></PageTransition>} />
                  <Route path="/editor" element={<PageTransition><EditorPanel /></PageTransition>} />
                  <Route path="/admin/home" element={<PageTransition><HomeEditor /></PageTransition>} />
                  <Route path="/home-editor" element={<PageTransition><HomeEditor /></PageTransition>} />
                  <Route path="/cutoff-calculator" element={<PageTransition><CutoffCalculator /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* AI CHAT ASSISTANT WIDGET */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
              
              {/* Floating Prompt Bubble */}
              <AnimatePresence>
                {!chatOpen && bubbleVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mb-1.5 mr-1 relative px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-[20px] shadow-lg shadow-indigo-500/30 border border-white/20 flex items-center gap-2 select-none z-10 whitespace-nowrap"
                  >
                    {/* Vertically centered, mini 32px APEC 3D hologram logo */}
                    <div className="chat-bubble-logo shrink-0 relative">
                      <img 
                        src="/Images/Logos/apec-logo.png" 
                        alt="APEC Logo" 
                      />
                    </div>

                    <span>{bubbleText}</span>
                    
                    {/* Tail — outer border color matching gradient end */}
                    <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-600" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hologram Icon Button wrapped in floating container */}
              {!chatOpen && (
                <div className="chatbot-avatar-container">
                  <button 
                    onClick={() => {
                      setChatOpen(true);
                      setBubbleVisible(false); // Immediately hide the popup when clicked
                    }}
                    className="relative w-16 h-16 bg-transparent border-0 outline-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    {/* 3D hologram Canvas with subtle glow outline (no solid white circular container) */}
                    <div className="absolute inset-0 z-10 pointer-events-none chatbot-canvas-glow">
                      <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
                        <ambientLight intensity={2} />
                        <HologramTorus />
                      </Canvas>
                    </div>
                  </button>
                </div>
              )}

              {/* Chatbox Overlay Modal */}
              {chatOpen && (
                windowWidth <= 768 ? (
                  createPortal(
                    <div 
                      ref={chatbotRef}
                      style={{ height: `${viewportHeight}px`, top: `${viewportOffsetTop}px` }}
                      className="mobile-chat pointer-events-auto flex flex-col z-[99999999]"
                    >
                      {/* Mobile Chat Header */}
                      <div className="mobile-chat-header flex items-center justify-between px-4 py-2 select-none shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex items-center justify-center shrink-0">
                            {/* Circular container for header logo */}
                            <div className="w-12 h-12 rounded-full bg-white p-1.5 border-2 border-[#E8C983] flex items-center justify-center shadow-md">
                              <img 
                                src="/Images/Logos/apec-logo.png" 
                                alt="APEC Logo" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>

                          <div className="text-left leading-tight">
                            <div className="text-sm font-bold text-[#07113A] leading-snug">
                              Adhiparasakthi Engineering College
                            </div>
                            <h3 className="font-sans text-xl font-black tracking-tight text-[#D6A72C] flex items-center gap-1.5 leading-none mt-0.5">
                              AI Assistant
                            </h3>
                            {isOnline ? (
                              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Online</span>
                              </div>
                            ) : (
                              <div className="text-[9px] text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span>Offline</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => setChatOpen(false)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all duration-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mobile Messages List */}
                      <div 
                        ref={messagesContainerRef}
                        data-lenis-prevent
                        className="mobile-chat-messages grow p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/20"
                      >
                        {messages.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-bubble-in`}
                          >
                            {msg.sender === 'user' ? (
                              <div className="max-w-[78%] p-3.5 apec-msg-bubble-user text-xs leading-relaxed">
                                {stripEmojis(msg.text)}
                              </div>
                            ) : (
                              <div className="flex gap-2.5 items-start justify-start w-full animate-bubble-in">
                                <AIAvatar thinking={msg.isLoading} />
                                <div className="max-w-[78%] p-3.5 apec-msg-bubble-ai text-xs leading-relaxed">
                                  {msg.isLoading ? (
                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                      <div className="text-[9px] text-slate-450 dark:text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 select-none">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        Assistant is thinking
                                      </div>
                                      <span className="flex items-center gap-1 py-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                      </span>
                                    </div>
                                  ) : (
                                    <div>{stripEmojis(msg.text)}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Mobile Input Area */}
                      <div className="mobile-input shrink-0 select-none">
                        {/* Suggestion Chips */}
                        {!keyboardOpen && (
                          <div className="pb-3 flex flex-wrap gap-1.5">
                            {[
                              { text: 'Admissions', label: 'Admissions', icon: 'Admissions' },
                              { text: 'Courses Offered', label: 'Courses', icon: 'Courses Offered' },
                              { text: 'Placement Details', label: 'Placements', icon: 'Placement Details' },
                              { text: 'Departments', label: 'Departments', icon: 'Departments' }
                            ].map((suggestion) => (
                              <button
                                key={suggestion.text}
                                type="button"
                                onClick={() => handleChatSubmit(null, suggestion.text)}
                                className="apec-suggestion-chip animate-bubble-in"
                              >
                                {getSuggestionIcon(suggestion.icon)}
                                <span>{suggestion.label}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Input Box */}
                        <form 
                          onSubmit={(e) => handleChatSubmit(e)} 
                          className="flex items-center gap-2 pb-safe"
                        >
                          <div className="grow relative flex items-center apec-chatbot-input-container pl-4 pr-2 py-1.5 transition-all duration-300">
                            <input 
                              type="text" 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onFocus={handleInputFocus}
                              placeholder="Ask anything about APEC..."
                              className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none"
                            />
                            <button 
                              type="submit" 
                              className="w-8 h-8 flex items-center justify-center apec-send-button text-white rounded-full cursor-pointer transition-all duration-300 shadow-sm active:scale-95 group shrink-0"
                            >
                              <Send className="w-3 h-3 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>,
                    document.body
                  )
                ) : (
                  createPortal(
                    <AnimatePresence>
                      {chatOpen && (
                        <motion.div
                          ref={chatbotRef}
                          initial={{ opacity: 0, scale: 0.9, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 15 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={chatbotStyle}
                          className="apec-chatbot-window pointer-events-auto flex flex-col z-[9999]"
                        >
                          {/* Desktop Chat Header */}
                          <div className="apec-chatbot-header flex items-center justify-between px-4 py-3 shadow-sm relative overflow-hidden shrink-0 select-none">
                            <div className="absolute -top-10 -left-10 w-24 h-24 bg-slate-500/5 rounded-full blur-xl pointer-events-none" />
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-slate-500/5 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="flex items-center gap-2.5 z-10">
                              <div className="flex items-center justify-center shrink-0">
                                <div className="w-12 h-12 rounded-full bg-white p-1.5 border-2 border-[#E8C983] flex items-center justify-center shadow-md">
                                  <img 
                                    src="/Images/Logos/apec-logo.png" 
                                    alt="APEC Logo" 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>

                              <div className="text-left leading-tight">
                                <div className="text-sm font-bold text-[#07113A] leading-snug">
                                  Adhiparasakthi Engineering College
                                </div>
                                <h3 className="font-sans text-xl font-black tracking-tight text-[#D6A72C] flex items-center gap-1.5 leading-none mt-0.5">
                                  AI Assistant
                                </h3>
                                {isOnline ? (
                                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Online</span>
                                  </div>
                                ) : (
                                  <div className="text-[9px] text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    <span>Offline</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button 
                              onClick={() => setChatOpen(false)}
                              className="z-10 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all duration-300 hover:rotate-90 cursor-pointer border border-slate-200 dark:border-slate-800/50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Desktop Messages Container */}
                          <div 
                            ref={messagesContainerRef}
                            data-lenis-prevent 
                            className="grow p-4 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-950/20 scroll-smooth"
                          >
                            {messages.map((msg, idx) => (
                              <div 
                                key={idx} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-bubble-in`}
                              >
                                {msg.sender === 'user' ? (
                                  <div className="max-w-[78%] p-3.5 apec-msg-bubble-user text-xs leading-relaxed">
                                    {stripEmojis(msg.text)}
                                  </div>
                                ) : (
                                  <div className="flex gap-2.5 items-start justify-start w-full animate-bubble-in">
                                    <AIAvatar thinking={msg.isLoading} />
                                    <div className="max-w-[78%] p-3.5 apec-msg-bubble-ai text-xs leading-relaxed">
                                      {msg.isLoading ? (
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                          <div className="text-[9px] text-slate-450 dark:text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 select-none">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            Assistant is thinking
                                          </div>
                                          <span className="flex items-center gap-1 py-1">
                                            <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-indigo-650 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                          </span>
                                        </div>
                                      ) : (
                                        <div>{stripEmojis(msg.text)}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            <div ref={chatBottomRef} />
                          </div>

                          {/* Desktop Smart Suggestions */}
                          <div className="px-3 pt-2.5 pb-2 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md flex flex-wrap gap-1.5 border-t border-slate-150 dark:border-slate-800/50 select-none shrink-0">
                            {[
                              { text: 'Admissions', label: 'Admissions', icon: 'Admissions' },
                              { text: 'Courses Offered', label: 'Courses', icon: 'Courses Offered' },
                              { text: 'Placement Details', label: 'Placements', icon: 'Placement Details' },
                              { text: 'Departments', label: 'Departments', icon: 'Departments' }
                            ].map((suggestion) => (
                              <button
                                key={suggestion.text}
                                type="button"
                                onClick={() => handleChatSubmit(null, suggestion.text)}
                                className="apec-suggestion-chip animate-bubble-in"
                              >
                                {getSuggestionIcon(suggestion.icon)}
                                <span>{suggestion.label}</span>
                              </button>
                            ))}
                          </div>

                          {/* Desktop Input Form */}
                          <div className="shrink-0 apec-desktop-input-wrapper select-none pb-safe">
                            <form 
                              onSubmit={(e) => handleChatSubmit(e)} 
                              className="p-3 flex items-center gap-2"
                            >
                              <div className="grow relative flex items-center apec-chatbot-input-container pl-4 pr-2 py-1.5 transition-all duration-300">
                                <input 
                                  type="text" 
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder="Ask anything about APEC..."
                                  className="w-full text-xs bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none"
                                />
                                <button 
                                  type="submit" 
                                  className="w-8 h-8 flex items-center justify-center apec-send-button text-white rounded-full cursor-pointer transition-all duration-300 shadow-sm active:scale-95 group shrink-0"
                                >
                                  <Send className="w-3 h-3 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )
                )
              )}
            </div>

            {/* INSTITUTIONAL FOOTER */}
            {!isAdminRoute && (
              <InstitutionalFooter setIsPanoOpen={setIsPanoOpen} />
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* 360° Panorama modal */}
      <AnimatePresence>
        {isPanoOpen && (
          <PanoramaModal 
            isOpen={isPanoOpen} 
            onClose={() => setIsPanoOpen(false)} 
            initialScene="mainGate" 
          />
        )}
      </AnimatePresence>

      {/* PWA App Installation Guide Modal */}
      <AnimatePresence>
        {showPwaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left space-y-5"
            >
              <button
                onClick={() => setShowPwaModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white p-2 flex items-center justify-center shrink-0 shadow-md">
                  <img src="/Images/Logos/apec-logo.png" alt="APEC Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-title">Install APEC Web Application</h3>
                  <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider">Desktop & Mobile Standalone App</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Install Adhiparasakthi Engineering College as a standalone app on your Desktop PC, Laptop, or Mobile Home Screen for instant 1-click launch and offline resiliency.
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-150 text-xs font-semibold text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Laptop className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Desktop (Chrome / Edge / Brave):</span>
                    Click <span className="font-extrabold text-indigo-700">Install APEC</span> or click the install icon <Download className="w-3 h-3 inline" /> in your address bar.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Mobile (Android & iOS):</span>
                    Tap browser <span className="font-extrabold text-emerald-700">Share / Menu</span> and select <span className="font-extrabold text-emerald-700">"Add to Home Screen"</span>.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPwaModal(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer transition-all shadow-md"
                >
                  Understood!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
