import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Download, ChevronDown, Send, RotateCw,
  Calculator
} from 'lucide-react';
import Preloader from './components/Preloader';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import Facilities from './pages/Facilities';
import Placements from './pages/Placements';
import Departments from './pages/Departments';
import Contact from './pages/Contact';
import DepartmentDetail from './pages/DepartmentDetail';
import FacilityDetail from './pages/FacilityDetail';
import AdminPortal from './pages/AdminPortal';
import AdminProfile from './pages/AdminProfile';
import PanoramaModal from './components/PanoramaModal';
import Login from './pages/Login';
import CutoffCalculator from './pages/CutoffCalculator';
import FeePayment from './pages/FeePayment';

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
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
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
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
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
  "Ask me anything about AEC!",
  "Have a question?"
];

const stripEmojis = (text) => {
  if (typeof text !== 'string') return text;
  // Broad Unicode ranges to capture and remove emoji icons/symbols
  return text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
};

function AppContent({ isLoading, setIsLoading }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUgcOpen, setMobileUgcOpen] = useState(false);
  const [mobileAdmissionOpen, setMobileAdmissionOpen] = useState(false);
  const [mobileCommunitiesOpen, setMobileCommunitiesOpen] = useState(false);
  const [mobileIqacOpen, setMobileIqacOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isPanoOpen, setIsPanoOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome to Adhiparasakthi Engineering College Assistant! How can I assist you today? Feel free to ask about admissions, TNEA code, courses, library, or placements.' }
  ]);
  const chatBottomRef = useRef(null);
  const videoRef = useRef(null);

  // Autoplay hook for the global video background
  useEffect(() => {
    if (location.pathname === '/' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.log("Autoplay was blocked by browser:", err);
      });
    }
  }, [location.pathname, isLoading]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let aiText = "Thank you for your query. For specific questions, you can contact our administration cell directly at +91 9894657971 or email principal@apec.edu.in.";
      const query = userText.toLowerCase();
      
      if (query.includes('tnea') || query.includes('counseling') || query.includes('code')) {
        aiText = "The TNEA Counseling Code for Adhiparasakthi Engineering College is 1401.";
      } else if (query.includes('admission') || query.includes('apply') || query.includes('open') || query.includes('date')) {
        aiText = "Adhiparasakthi Engineering College admissions for the 2026 – 2027 academic cycle are open. For details, call 7418064336 or 7418065336.";
      } else if (query.includes('placement') || query.includes('mou') || query.includes('company') || query.includes('recruit')) {
        aiText = "Adhiparasakthi Engineering College has a 92% placement rate, with partners including TCS, Wipro, Cognizant, Infosys, and HCL. Highest package offered is 12 LPA.";
      } else if (query.includes('course') || query.includes('department') || query.includes('engineering') || query.includes('ug') || query.includes('pg') || query.includes('phd')) {
        aiText = "We offer UG courses (CSE, AI/ML, ECE, EEE, Chemical, Agri, Mechanical, Civil), PG courses (MCA, MBA, M.E.), and Ph.D. programs.";
      } else if (query.includes('facility') || query.includes('library') || query.includes('hostel') || query.includes('bus') || query.includes('ground') || query.includes('lab')) {
        aiText = "Adhiparasakthi Engineering College offers comprehensive campus facilities including separate secure hostels, a digital Central Library (50,000+ books), fully equipped labs, and transport buses.";
      }

      setMessages([...newMessages, { sender: 'ai', text: aiText }]);
    }, 700);
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
            {/* Global Fixed Background Video Loop (rendered only on Home path, outside Lenis scroll context) */}
            {isHome && (
              <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <video 
                  ref={videoRef}
                  src="./bg_loop.mp4" 
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  className="w-full h-full object-cover opacity-90" 
                />
                {/* Clean bright overlays for text separation and flow blending */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/10" />
              </div>
            )}
            
            {/* NAVIGATION BAR WITH DETAILED HOVER MEGA-MENUS */}
            {/* STACKED HEADER SYSTEM */}
            <header
              className="sticky top-0 z-40 bg-white/95 text-gray-900 border-b border-gray-100 backdrop-blur-md shadow-sm transition-colors duration-300"
              style={{ width: '100vw', maxWidth: '100vw' }}
            >
              
              {/* TOP BAR: GRAND BRANDING & CORE ACTIONS */}
              <div className="w-full px-4 md:px-6 py-1.5 flex items-center justify-between gap-4 md:gap-10">
                
                {/* Enlarged College Logo & Name */}
                <Link to="/" className="flex items-center gap-4 shrink-0">
                  <img 
                    src="./apec-logo.png" 
                    alt="APEC Logo" 
                    className={`w-12 h-12 object-contain transition-all ${isHome ? 'bg-white rounded-full p-0.5 shadow-sm border border-gray-100' : 'mix-blend-multiply'}`} 
                  />
                  <div className="text-left flex flex-col justify-center">
                    <span className="font-title text-xs md:text-sm lg:text-base xl:text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-950 bg-clip-text text-transparent block leading-none drop-shadow-sm">
                      Adhiparasakthi Engineering College
                    </span>
                    <span className="font-mono text-[9px] md:text-[9px] uppercase font-black text-indigo-650 tracking-wider block mt-1.5">
                      An Autonomous Institution
                    </span>
                  </div>
                </Link>
                {/* Right Actions & Mobile Toggle */}
                <div className="flex items-center gap-6">
                  {/* Desktop Right Action Panel */}
                  <div className="hidden lg:flex items-center gap-4">
                    <button 
                      onClick={() => setIsPanoOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-all bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 px-2.5 py-1.5 rounded-xl cursor-pointer relative overflow-hidden group/btn"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                      </span>
                      <RotateCw className="w-3 h-3 text-indigo-550 animate-[spin_10s_linear_infinite]" />
                      <span>360° VR Tour</span>
                    </button>

                    <Link 
                      to="/fee-payment" 
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-all bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/40 px-2.5 py-1.5 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
                    >
                      <span>Fee Payment</span>
                    </Link>
                    <a 
                      href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-all bg-blue-50 hover:bg-blue-100/80 border border-blue-200/40 px-2.5 py-1.5 rounded-xl cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
                    >
                      <span>ERP Portal</span>
                    </a>
                    {localStorage.getItem('is_logged_in') === 'true' && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-indigo-655 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 select-none animate-fade-in">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          gxwr1
                        </span>
                        <button 
                          onClick={() => {
                            localStorage.removeItem('apec_user');
                            localStorage.removeItem('is_logged_in');
                            window.location.reload();
                          }}
                          className="text-xs font-extrabold uppercase tracking-wider text-rose-500 hover:text-rose-750 transition-colors cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    <Link 
                      to="/contact"
                      className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-red-800 via-orange-800 to-amber-900 hover:from-red-900 hover:via-orange-900 hover:to-amber-950 text-white px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Apply Desk
                    </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 pr-1 text-gray-800 hover:text-gray-950 transition-colors shrink-0"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
                  </button>
                </div>

              </div>

              {/* Scrolling News Ticker */}
              <div className="w-full bg-white border-b border-[#FFD6A5]/50 py-0.5 overflow-hidden relative z-10 select-none flex items-center">
                {/* Announcement Icon Badge */}
                <div className="bg-[#FF8A00] text-white px-3.5 py-[1px] rounded-r-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-20 shadow-sm ml-0">
                  <span role="img" aria-label="announcement">📢</span>
                  <span>News</span>
                </div>
                
                {/* Scrolling Track */}
                <div className="relative w-full overflow-hidden flex items-center">
                  <div 
                    className="animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer flex items-center gap-12 text-sm md:text-base font-semibold text-[#1B224A]"
                    style={{
                      whiteSpace: 'nowrap',
                      display: 'inline-flex'
                    }}
                  >
                    <div className="flex items-center gap-12">
                      <span>🎓 Admissions Open for 2026–2027</span>
                      <span>•</span>
                      <span>NAAC Accredited Institution</span>
                      <span>•</span>
                      <span>UGC Autonomous College</span>
                      <span>•</span>
                      <span>Affiliated to Anna University</span>
                      <span>•</span>
                      <span>Placement Training Ongoing</span>
                      <span>•</span>
                      <span>Campus Recruitment Updates</span>
                      <span>•</span>
                      <span>Welcome to Adhiparasakthi Engineering College</span>
                    </div>
                    <div className="flex items-center gap-12" aria-hidden="true">
                      <span>🎓 Admissions Open for 2026–2027</span>
                      <span>•</span>
                      <span>NAAC Accredited Institution</span>
                      <span>•</span>
                      <span>UGC Autonomous College</span>
                      <span>•</span>
                      <span>Affiliated to Anna University</span>
                      <span>•</span>
                      <span>Placement Training Ongoing</span>
                      <span>•</span>
                      <span>Campus Recruitment Updates</span>
                      <span>•</span>
                      <span>Welcome to Adhiparasakthi Engineering College</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing Divider Separator */}
              <div 
                className="w-full h-[3px] animate-[shimmer_5s_linear_infinite] relative z-20"
                style={{
                  background: 'linear-gradient(90deg, #FFB347 0%, #FFD580 50%, #FFB347 100%)',
                  backgroundSize: '200% 100%',
                  boxShadow: '0 0 10px rgba(255, 179, 71, 0.5), 0 0 4px rgba(255, 213, 128, 0.3)'
                }}
              />

              {/* BOTTOM BAR: NAVIGATION LINKS (Full-width centered layout) */}
              <div className="bg-[#FFF4E8] border-b border-[#FFD6A5] hidden lg:block">
                <div className="w-full px-6 py-0.5 flex justify-center relative">
                  <nav className="flex items-center gap-2 xl:gap-3.5 py-0.5">
                    
                    <Link 
                      to="/" 
                      className={`text-[11px] uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-1 rounded-lg block ${
                        isActive('/') 
                          ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                          : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                      }`}
                    >
                      Home
                      {isActive('/') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                        />
                      )}
                    </Link>
                    
                    {/* About Dropdown */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/about') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        About <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/about') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Institution Profile</Link>
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Founder & Trustees</Link>
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Principal Desk</Link>
                      </div>
                    </div>

                    {/* Admission Dropdown */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-xs uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-3 py-1 rounded-lg ${
                          isActive('/admission') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-slate-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-bold'
                        }`}
                      >
                        Admission <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/admission') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/admission?tab=courses" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Courses Offered</Link>
                        <Link to="/admission?tab=procedure" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Admission Procedure</Link>
                        <Link to="/admission?tab=scholarships" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Scholarships</Link>
                        <Link to="/admission?tab=brochure" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Information Brochure</Link>
                      </div>
                    </div>

                    {/* Departments Hover Mega-Menu */}
                    <div className="group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/departments') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Departments <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/departments') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:grid grid-cols-4 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[1000px] text-left gap-6 animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Undergraduate (B.E.)</span>
                          <div className="space-y-1">
                            <Link to="/departments/civil" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Civil Engineering</Link>
                            <Link to="/departments/mech" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Mechanical Engineering</Link>
                            <Link to="/departments/eee" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Electrical & Electronics Engg.</Link>
                            <Link to="/departments/ece" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Electronics & Communication Engg.</Link>
                            <Link to="/departments/cse" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Computer Science & Engg.</Link>
                            <Link to="/departments/aiml" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">CSE (AI & ML)</Link>
                            <Link to="/departments/csd" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Computer Science & Design (CSD)</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Undergraduate (B.Tech.)</span>
                          <div className="space-y-1">
                            <Link to="/departments/it" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Information Technology</Link>
                            <Link to="/departments/chemical" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Chemical Engineering</Link>
                            <Link to="/departments/agri" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Agricultural Engineering</Link>
                            <Link to="/departments/aids" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Artificial Intelligence & Data Science (AI & DS)</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Postgraduate & Sciences</span>
                          <div className="space-y-1">
                            <Link to="/departments/mca" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Master of Computer Apps (MCA)</Link>
                            <Link to="/departments/mba" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Management Studies (MBA)</Link>
                            <Link to="/departments/sh" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Science & Humanities</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Doctor of Philosophy (Ph.D.)</span>
                          <div className="space-y-1">
                            <Link to="/departments/phd-civil" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">PhD - Civil Engg.</Link>
                            <Link to="/departments/phd-mech" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">PhD - Mechanical Engg.</Link>
                            <Link to="/departments/phd-ece" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">PhD - Electronics & Comm. Engg.</Link>
                            <Link to="/departments/phd-eee" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">PhD - Electrical & Elect. Engg.</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* UGC Hover Mega-Menu */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/ugc') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        UGC <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/ugc') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[520px] text-left gap-6 animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Institutional Compliance & Strategy</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/r-d-cell/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">R & D Cell</a>
                            <a href="https://apec.edu.in/wp-content/uploads/2024/02/IDP.pdf" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IDP (Institutional Development Plan)</a>
                            <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Self Disclosure Guidelines</a>
                            <a href="https://apec.edu.in/mandatory-disclosure/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Mandatory Disclosure</a>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Audits, Approvals & Recognition</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/annual-accounts/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Annual Accounts</a>
                            <a href="https://apec.edu.in/wp-content/uploads/2024/02/APEC-2f-12B.pdf" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">2(f) and 12(b) Recognition</a>
                            <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Undertaking</a>
                            <a href="https://apec.edu.in/wp-content/uploads/2025/07/UGC-Autonomous-Approval-Letter.pdf" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Autonomous Approval Letter</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Facilities Hover Dropdown */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/facilities') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Facilities <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/facilities') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/facilities/library" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Central Library</Link>
                        <Link to="/facilities/labs" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Lab Infrastructures</Link>
                        <Link to="/facilities/hostels" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Hostel Blocks</Link>
                        <Link to="/facilities/transport" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Transport & Bus Routes</Link>
                      </div>
                    </div>

                    {/* Placements Dropdown */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/placements') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Placements <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/placements') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-64 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Placement Cell Profile</Link>
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Placement Records</Link>
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">MOUs & Industrial Tie-ups</Link>
                        <a href="https://apec.edu.in/rti/" target="_blank" rel="noopener noreferrer" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">RTI (Right to Information)</a>
                      </div>
                    </div>

                    {/* Communities Dropdown */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/communities') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Communities <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/communities') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[540px] text-left gap-6 animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Student Cells & Associations</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/anti-ragging/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Anti-Ragging Committee</a>
                            <a href="https://apec.edu.in/industry-institute-interaction-cell/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IIIC Cell (Industry-Institute)</a>
                            <a href="https://apec.edu.in/women-empowerment-cell/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Women Empowerment Cell</a>
                            <a href="https://apec.edu.in/alumni/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Alumni Cell</a>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Welfare & Career Clubs</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/sc-st-committee/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">SC/ST Committee</a>
                            <a href="https://apec.edu.in/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Electoral Literacy Club</a>
                            <a href="https://apec.edu.in/career-guidance-cell/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Career Guidance Cell</a>
                            <a href="https://apec.edu.in/entrepreneurship-development-cell/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Entrepreneurship Cell</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IQAC Megamenu */}
                    <div className="relative group py-0.5">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-1 rounded-lg ${
                          isActive('/iqac') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        IQAC <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/iqac') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[540px] text-left gap-6 animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Quality Assurance & NAAC</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/naac/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">NAAC</a>
                            <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC</a>
                            <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC Members</a>
                            <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC MoM & AT</a>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Rankings & Disclosures</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/mandatory-disclosure/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Disclosures (NIRF, AICTE & MD)</a>
                            <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Undertaking</a>
                            <a href="https://apec.edu.in/nirf/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">NIRF</a>
                            <a href="https://apec.edu.in/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Instrumentation Cell</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to="/contact" 
                      className={`text-[11px] uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-1 rounded-lg block ${
                        isActive('/contact') 
                          ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                          : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                      }`}
                    >
                      Contact
                      {isActive('/contact') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                        />
                      )}
                    </Link>

                    <Link 
                      to="/cutoff-calculator" 
                      className={`text-[11px] uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-1 rounded-lg block ${
                        isActive('/cutoff-calculator') 
                          ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                          : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                      }`}
                      title="Cutoff Calculator"
                    >
                      <Calculator className="w-4 h-4 text-current inline-block" />
                      {isActive('/cutoff-calculator') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                        />
                      )}
                    </Link>

                  </nav>
                </div>
              </div>



              {/* Mobile Dropdown */}
              {mobileMenuOpen && (
                <div className="lg:hidden bg-[#FFF4E8] border-b border-[#FFD6A5] py-6 px-6 flex flex-col gap-4 text-left max-h-[75vh] overflow-y-auto">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-900">Home</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">About APEC</Link>
                  
                  {/* Collapsible Mobile Admission Section */}
                  <div>
                    <button 
                      onClick={() => setMobileAdmissionOpen(!mobileAdmissionOpen)} 
                      className="w-full text-left text-sm font-semibold text-gray-500 flex items-center justify-between focus:outline-none"
                    >
                      <span>Admission</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileAdmissionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileAdmissionOpen && (
                      <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gray-100">
                        <Link to="/admission?tab=courses" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Courses Offered</Link>
                        <Link to="/admission?tab=procedure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Admission Procedure</Link>
                        <Link to="/admission?tab=scholarships" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Scholarships</Link>
                        <Link to="/admission?tab=brochure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Information Brochure</Link>
                      </div>
                    )}
                  </div>

                  <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Departments</Link>
                  <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Campus Facilities</Link>
                  <Link to="/placements" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Placements</Link>
                  
                  {/* Collapsible Mobile UGC Section */}
                  <div>
                    <button 
                      onClick={() => setMobileUgcOpen(!mobileUgcOpen)} 
                      className="w-full text-left text-sm font-semibold text-gray-500 flex items-center justify-between focus:outline-none"
                    >
                      <span>UGC</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileUgcOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileUgcOpen && (
                      <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gray-100">
                        <a href="https://apec.edu.in/r-d-cell/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">R & D Cell</a>
                        <a href="https://apec.edu.in/wp-content/uploads/2024/02/IDP.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IDP (Institutional Development Plan)</a>
                        <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Self Disclosure Guidelines</a>
                        <a href="https://apec.edu.in/mandatory-disclosure/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Mandatory Disclosure</a>
                        <a href="https://apec.edu.in/annual-accounts/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Annual Accounts</a>
                        <a href="https://apec.edu.in/wp-content/uploads/2024/02/APEC-2f-12B.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">2(f) and 12(b) Recognition</a>
                        <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Undertaking</a>
                        <a href="https://apec.edu.in/wp-content/uploads/2025/07/UGC-Autonomous-Approval-Letter.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Autonomous Approval Letter</a>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Mobile Communities Section */}
                  <div>
                    <button 
                      onClick={() => setMobileCommunitiesOpen(!mobileCommunitiesOpen)} 
                      className="w-full text-left text-sm font-semibold text-gray-500 flex items-center justify-between focus:outline-none"
                    >
                      <span>Communities</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileCommunitiesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileCommunitiesOpen && (
                      <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gray-100">
                        <a href="https://apec.edu.in/anti-ragging/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Anti-Ragging Committee</a>
                        <a href="https://apec.edu.in/industry-institute-interaction-cell/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IIIC Cell (Industry-Institute)</a>
                        <a href="https://apec.edu.in/women-empowerment-cell/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Women Empowerment Cell</a>
                        <a href="https://apec.edu.in/alumni/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Alumni Cell</a>
                        <a href="https://apec.edu.in/sc-st-committee/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">SC/ST Committee</a>
                        <a href="https://apec.edu.in/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Electoral Literacy Club</a>
                        <a href="https://apec.edu.in/career-guidance-cell/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Career Guidance Cell</a>
                        <a href="https://apec.edu.in/entrepreneurship-development-cell/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Entrepreneurship Cell</a>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Mobile IQAC Section */}
                  <div>
                    <button 
                      onClick={() => setMobileIqacOpen(!mobileIqacOpen)} 
                      className="w-full text-left text-sm font-semibold text-gray-500 flex items-center justify-between focus:outline-none"
                    >
                      <span>IQAC</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileIqacOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileIqacOpen && (
                      <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gray-100">
                        <a href="https://apec.edu.in/naac/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">NAAC</a>
                        <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC</a>
                        <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC Members</a>
                        <a href="https://apec.edu.in/iqac/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC MoM & AT</a>
                        <a href="https://apec.edu.in/mandatory-disclosure/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Disclosures (NIRF, AICTE & MD)</a>
                        <a href="https://apec.edu.in/ugc/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Undertaking</a>
                        <a href="https://apec.edu.in/nirf/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">NIRF</a>
                        <a href="https://apec.edu.in/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Instrumentation Cell</a>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPanoOpen(true);
                    }}
                    className="text-left text-sm font-semibold text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                    </span>
                    360° VR Tour
                  </button>
                  <Link 
                    to="/fee-payment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-sm font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-4 py-2.5 rounded-xl flex items-center justify-between hover:bg-emerald-50 transition-colors"
                  >
                    <span>Fee Payment</span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-500 bg-emerald-100/50 px-2 py-0.5 rounded-md">Pay Online</span>
                  </Link>
                  <a 
                    href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left text-sm font-bold text-blue-600 bg-blue-50/50 border border-blue-100 px-4 py-2.5 rounded-xl flex items-center justify-between hover:bg-blue-50 transition-colors"
                  >
                    <span>ERP Portal</span>
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-500 bg-blue-100/50 px-2 py-0.5 rounded-md">VMedulife</span>
                  </a>

                  {localStorage.getItem('is_logged_in') === 'true' && (
                    <div className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-sm font-bold text-indigo-650 flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        gxwr1
                      </span>
                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          localStorage.removeItem('apec_user');
                          localStorage.removeItem('is_logged_in');
                          window.location.reload();
                        }}
                        className="text-xs font-black uppercase tracking-wider text-rose-500 hover:text-rose-750 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Contact</Link>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.02, 1],
                        borderColor: ["#e2e8f0", "#a5b4fc", "#e2e8f0"]
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="text-xs text-center font-mono py-1.5 bg-indigo-50/50 rounded text-indigo-750 border border-indigo-200 shadow-sm"
                    >
                      TNEA Counseling Code: 1401
                    </motion.div>
                    <Link 
                      to="/cutoff-calculator"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center text-sm font-bold uppercase tracking-wider text-pink-650 bg-pink-50 border border-pink-150 py-3 rounded-xl shadow-sm hover:scale-[1.01] active:scale-95 transition-all"
                    >
                      Cutoff Calculator
                    </Link>
                    <Link 
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-red-800 via-orange-800 to-amber-900 py-3 rounded-xl text-white shadow-md"
                    >
                      Apply Desk
                    </Link>
                  </div>

                </div>
              )}
            </header>

            {/* Main Content Area: Staggered Fade Route Transitions */}
            <main className="grow">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                  <Route path="/admission" element={<PageTransition><Admission /></PageTransition>} />
                  <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
                  <Route path="/placements" element={<PageTransition><Placements /></PageTransition>} />
                  <Route path="/departments" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/fee-payment" element={<PageTransition><FeePayment /></PageTransition>} />
                  
                  {/* Separate detail files */}
                  <Route path="/departments/:id" element={<PageTransition><DepartmentDetail /></PageTransition>} />
                  <Route path="/facilities/:id" element={<PageTransition><FacilityDetail /></PageTransition>} />
                  <Route path="/admin-portal" element={<PageTransition><AdminPortal /></PageTransition>} />
                  <Route path="/administration/:id" element={<PageTransition><AdminProfile /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
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
                    {/* Vertically centered, mini 24px 3D hologram torus avatar matching the chatbot avatar */}
                    <div className="w-6 h-6 shrink-0 relative">
                      <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
                        <ambientLight intensity={2} />
                        <HologramTorusWhite />
                      </Canvas>
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
                <div className="w-80 h-[380px] bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
                  
                  {/* Chatbox Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-gray-800 tracking-tight">Adhiparasakthi Engineering College Portal Assistant</span>
                    </div>
                    <button 
                      onClick={() => setChatOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages Container */}
                  <div className="grow p-4 overflow-y-auto space-y-3.5 text-xs text-left bg-gray-50/50">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-gray-950 text-white rounded-br-none' 
                            : 'bg-white border border-gray-150 text-gray-700 rounded-bl-none'
                        }`}>
                          {stripEmojis(msg.text)}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about admissions, code, placement..."
                      className="grow text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-900 transition-colors"
                    />
                    <button 
                      type="submit" 
                      className="p-2.5 bg-gray-950 hover:bg-gray-800 text-white rounded-xl cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                </div>
              )}
            </div>

            {/* Clean, Sleek, Compact Footer */}
            <footer className="py-8 px-6 bg-gray-50 border-t border-gray-100 relative select-none">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-3">
                  <img 
                    src="./apec-logo.png" 
                    alt="Adhiparasakthi Engineering College Logo" 
                    className="w-9 h-9 object-contain mix-blend-multiply" 
                  />
                  <div className="text-left">
                    <h3 className="font-title text-xs font-black tracking-tight text-gray-900 leading-none">
                      Adhiparasakthi Engineering College
                    </h3>
                    <span className="font-mono text-[8px] uppercase font-black text-indigo-650 tracking-wider block mt-1">
                      An Autonomous Institution
                    </span>
                  </div>
                </div>

                {/* Inline Nav Links */}
                <nav className="flex flex-wrap justify-center gap-6 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                  <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
                  <Link to="/admission" className="hover:text-gray-900 transition-colors">Admission</Link>
                  <Link to="/departments" className="hover:text-gray-900 transition-colors">Departments</Link>
                  <Link to="/placements" className="hover:text-gray-900 transition-colors">Placements</Link>
                  <Link to="/facilities" className="hover:text-gray-900 transition-colors">Facilities</Link>
                  <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
                </nav>

              </div>

              {/* Bottom Copyright & Contacts row */}
              <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] text-gray-450 font-bold uppercase tracking-wider">
                <span>
                  © 2026 Adhiparasakthi Engineering College. All Rights Reserved.
                </span>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <span>Helpline: <a href="tel:+917418064336" className="text-gray-500 hover:text-indigo-600 transition-colors">7418064336</a></span>
                  <span>Email: <span className="text-gray-500">principal@apec.edu.in</span></span>
                </div>
              </div>
            </footer>

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
    </div>
  );
}
