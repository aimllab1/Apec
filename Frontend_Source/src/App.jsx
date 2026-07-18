import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Download, ChevronDown, Send, RotateCw
} from 'lucide-react';
import Preloader from './components/Preloader';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import InstitutionalProfile from './pages/InstitutionalProfile';
import FounderTrustees from './pages/FounderTrustees';
import PrincipalDesk from './pages/PrincipalDesk';
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
import RDCell from './pages/RDCell';
import IDP from './pages/IDP';
import UgcGuidelines from './pages/UgcGuidelines';
import MandatoryDisclosure from './pages/MandatoryDisclosure';
import AnnualAccounts from './pages/AnnualAccounts';
import UgcUndertaking from './pages/UgcUndertaking';
import UgcApprovalLetter from './pages/UgcApprovalLetter';
import EditorPanel from './pages/EditorPanel';
import Rti from './pages/Rti';
import Iqac from './pages/Iqac';
import IqacMembers from './pages/IqacMembers';
import IqacMeetings from './pages/IqacMeetings';
import Disclosures from './pages/Disclosures';
import Nirf from './pages/Nirf';
import InstrumentationCell from './pages/InstrumentationCell';
import Committees from './pages/Committees';
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
  const isHome = location.pathname === '/';
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
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

    const reloadData = async () => {
      try {
        const snapBranding = await getDoc(doc(db, 'system_settings', 'branding'));
        if (snapBranding.exists()) {
          setBranding(snapBranding.data());
          localStorage.setItem('apec_branding', JSON.stringify(snapBranding.data()));
        } else {
          const saved = localStorage.getItem('apec_branding');
          if (saved) setBranding(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem('apec_branding');
        if (saved) setBranding(JSON.parse(saved));
      }

      try {
        const snapTicker = await getDoc(doc(db, 'system_settings', 'ticker_news'));
        if (snapTicker.exists()) {
          setTickerNews(snapTicker.data().items);
          localStorage.setItem('apec_ticker_news', JSON.stringify(snapTicker.data().items));
        } else {
          const saved = localStorage.getItem('apec_ticker_news');
          if (saved) setTickerNews(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem('apec_ticker_news');
        if (saved) setTickerNews(JSON.parse(saved));
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
  const videoRef = useRef(null);
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
            {/* Global Fixed Background Video Loop (rendered only on Home path, outside Lenis scroll context) */}
            {isHome && (
              <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <video 
                  ref={videoRef}
                  src="/Videos/Background/bg_loop.mp4" 
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
              className="w-full sticky top-0 z-40 bg-white/95 text-gray-900 border-b border-gray-100 backdrop-blur-md shadow-sm transition-colors duration-300"
            >
              
              {/* TOP BAR: GRAND BRANDING & CORE ACTIONS */}
              <div className="w-full px-4 md:px-6 h-[60px] sm:h-[70px] lg:h-auto py-1.5 lg:py-0.5 flex items-center justify-between gap-2 md:gap-10">
                
                {/* Enlarged College Logo & Name */}
                <Link to="/" className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                  <img 
                    src="/Images/Logos/apec-logo.png" 
                    alt="APEC Logo" 
                    className={`w-10 h-10 sm:w-12 sm:h-12 object-contain transition-all ${isHome ? 'bg-white rounded-full p-0.5 shadow-sm border border-gray-100' : 'mix-blend-multiply'}`} 
                  />
                  <div className="text-left flex flex-col justify-center max-w-[170px] xs:max-w-[210px] sm:max-w-md lg:max-w-none">
                    <span className="font-title text-[9px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-950 bg-clip-text text-transparent block leading-tight drop-shadow-sm">
                      {branding.collegeName}
                    </span>
                    <span className="font-mono text-[6.5px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] uppercase font-black tracking-wider block mt-0.5 text-violet-750">
                      {branding.tagline}
                    </span>
                  </div>
                </Link>
                {/* Right Actions & Mobile Toggle */}
                <div className="flex items-center gap-6">
                  {/* Desktop Right Action Panel */}
                  <div className="hidden lg:flex items-center gap-4">
                    <button 
                      onClick={() => setIsPanoOpen(true)}
                      className="relative w-10 h-10 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] hover:scale-[1.08] active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-sm cursor-pointer group/vrbtn"
                      title="Open 360° VR Campus Tour"
                    >
                      {/* Pulse background shine */}
                      <span className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover/vrbtn:opacity-100 transition-opacity" />
                      
                      {/* Minimalist Panoramic 360 Circular Arrow Logo (Expanded, Padding Removed) */}
                      <div className="relative w-8 h-8 flex items-center justify-center overflow-visible text-black">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="relative overflow-visible">
                          {/* Panoramic Circular Arrow loop */}
                          <path d="M23 12a11 11 0 1 1-3.2-7.8L23 8" className="animate-[spin_16s_linear_infinite] origin-center" />
                          {/* Arrow head */}
                          <path d="M23 3v5h-5" />
                          {/* Central panoramic text "360°" */}
                          <text x="12" y="14.8" textAnchor="middle" fontSize="7.5" fontWeight="900" stroke="none" fill="currentColor" style={{ fontFamily: 'system-ui, sans-serif' }}>360°</text>
                        </svg>
                        {/* Bouncing degree circle on the top-right corner of container */}
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white shadow-sm animate-[degreeBounce_1.2s_infinite_alternate]" />
                      </div>
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
                          {localStorage.getItem('apec_user') ? localStorage.getItem('apec_user').split('@')[0] : 'Admin'}
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
                      New Admission
                    </Link>
                  </div>

                  {/* Mobile Actions: 360 VR & Menu Button */}
                  <div className="flex items-center gap-2 sm:gap-3.5 lg:hidden shrink-0">
                    <button 
                      onClick={() => setIsPanoOpen(true)}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] hover:scale-[1.08] active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                      title="Open 360° VR Campus Tour"
                    >
                      <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center overflow-visible text-black">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="relative overflow-visible">
                          <path d="M23 12a11 11 0 1 1-3.2-7.8L23 8" className="animate-[spin_16s_linear_infinite] origin-center" />
                          <path d="M23 3v5h-5" />
                          <text x="12" y="14.8" textAnchor="middle" fontSize="7.5" fontWeight="900" stroke="none" fill="currentColor" style={{ fontFamily: 'system-ui, sans-serif' }}>360°</text>
                        </svg>
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full border border-white shadow-sm animate-[degreeBounce_1.2s_infinite_alternate]" />
                      </div>
                    </button>

                    <button 
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="p-1.5 text-gray-800 hover:text-gray-950 transition-colors shrink-0 focus:outline-none"
                      aria-label="Toggle navigation menu"
                    >
                      {mobileMenuOpen ? <X className="w-5.5 h-5.5 sm:w-6 sm:h-6" /> : <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Scrolling News Ticker */}
              <div className="w-full bg-white border-b border-[#FFD6A5]/50 h-[32px] sm:h-[36px] overflow-hidden relative z-10 select-none flex items-center shrink-0">
                {/* Announcement Icon Badge */}
                <div className="bg-[#FF8A00] text-white px-3 py-[1px] h-full rounded-r-lg font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-20 shadow-sm ml-0">
                  <span role="img" aria-label="announcement">📢</span>
                  <span>News</span>
                </div>
                
                {/* Scrolling Track */}
                <div className="relative w-full overflow-hidden flex items-center">
                  <div 
                    className="animate-[ticker_35s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer flex items-center gap-12 text-[11px] sm:text-xs md:text-sm font-semibold text-[#1B224A]"
                    style={{
                      whiteSpace: 'nowrap',
                      display: 'inline-flex'
                    }}
                  >
                    <div className="flex items-center gap-12">
                      {tickerNews.map((item, idx) => {
                        const text = typeof item === 'object' ? item.text : item;
                        const link = typeof item === 'object' ? item.link : null;
                        return (
                          <React.Fragment key={idx}>
                            {idx > 0 && <span className="text-[#FF8A00]">•</span>}
                            {link ? (
                              link.startsWith('http') ? (
                                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#FF8A00] transition-colors">{text}</a>
                              ) : (
                                <Link to={link} className="hover:underline hover:text-[#FF8A00] transition-colors">{text}</Link>
                              )
                            ) : (
                              <span>{text}</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-12" aria-hidden="true">
                      {tickerNews.map((item, idx) => {
                        const text = typeof item === 'object' ? item.text : item;
                        const link = typeof item === 'object' ? item.link : null;
                        return (
                          <React.Fragment key={`loop-${idx}`}>
                            {idx > 0 && <span className="text-[#FF8A00]">•</span>}
                            {link ? (
                              link.startsWith('http') ? (
                                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[#FF8A00] transition-colors">{text}</a>
                              ) : (
                                <Link to={link} className="hover:underline hover:text-[#FF8A00] transition-colors">{text}</Link>
                              )
                            ) : (
                              <span>{text}</span>
                            )}
                          </React.Fragment>
                        );
                      })}
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
              <div className="bg-[#FFF4E8] hidden lg:block">
                <div className="w-full px-6 py-0 flex justify-center relative">
                  <nav className="flex items-center gap-2 xl:gap-3.5 py-0">
                    
                    <Link 
                      to="/" 
                      className={`text-[11px] uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-0.5 rounded-lg block ${
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
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-full left-0 block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <Link to="/about/profile" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Institution Profile</Link>
                        <Link to="/about/founders" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Founder & Trustees</Link>
                        <Link to="/about/principal" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Principal Desk & Contacts</Link>
                      </div>
                    </div>

                    {/* Admission Dropdown */}
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
                          isActive('/admission') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Admission <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/admission') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <Link to="/admission?tab=courses" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Courses Offered</Link>
                        <Link to="/admission?tab=procedure" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Admission Procedure</Link>
                        <Link to="/admission?tab=scholarships" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Scholarships</Link>
                        <Link to="/admission?tab=brochure" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Information Brochure</Link>
                        <Link to="/admission?tab=cutoff" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Cutoff Calculator</Link>
                      </div>
                    </div>

                    {/* Departments Hover Mega-Menu */}
                    <div className="group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 grid grid-cols-4 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[1000px] text-left gap-6 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
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
                            <div className="pt-2">
                              <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block px-2 mb-1.5">M.E. Programmes</span>
                              <Link to="/departments/me-cse" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">M.E. - Computer Science & Engg.</Link>
                              <Link to="/departments/me-thermal" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">M.E. - Thermal Engineering</Link>
                              <Link to="/departments/me-vlsi" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">M.E. - VLSI Design</Link>
                              <Link to="/departments/me-ped" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">M.E. - Power Electronics & Drives</Link>
                              <Link to="/departments/me-cem" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">M.E. - Construction Engg. & Mgmt.</Link>
                            </div>
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
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-full left-1/2 -translate-x-1/2 grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[520px] text-left gap-6 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Institutional Compliance & Strategy</span>
                          <div className="space-y-1">
                            <Link to="/r-d-cell" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">R & D Cell</Link>
                            <Link to="/idp" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IDP (Institutional Development Plan)</Link>
                            <Link to="/ugc-self-disclosure" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Self Disclosure Guidelines</Link>
                            <Link to="/mandatory-disclosure" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Mandatory Disclosure</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Audits, Approvals & Recognition</span>
                          <div className="space-y-1">
                            <Link to="/annual-accounts" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Annual Accounts</Link>
                            <a href="/Documents/PDFs/UGC/6. 2f-and-12b.pdf" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">2(f) and 12(b) Recognition</a>
                            <Link to="/ugc-undertaking" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Undertaking</Link>
                            <Link to="/ugc-approval-letter" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">UGC Autonomous Approval Letter</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Facilities Hover Dropdown */}
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-full left-0 block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <Link to="/facilities" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Facility Overview</Link>
                        <Link to="/facilities/library" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Library Facilities</Link>
                        <Link to="/facilities/labs" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Lab Infrastructure</Link>
                        <Link to="/facilities/hostels" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Hostel Provision</Link>
                        <Link to="/facilities/sports" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Sports Facilities</Link>
                        <Link to="/facilities/campus" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Campus Infrastructure</Link>
                        <Link to="/facilities/transport" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Bus Facilities</Link>
                      </div>
                    </div>

                    {/* Placements Dropdown */}
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-full left-0 block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-64 text-left opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Placement Cell Profile</Link>
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">Placement Records</Link>
                        <Link to="/placements" className="block px-5 py-2 text-xs font-extrabold text-gray-700 hover:bg-[#FFE7CC] hover:text-[#FF8A00] nav-dropdown-link transition-colors">MOUs & Industrial Tie-ups</Link>
                      </div>
                    </div>

                    {/* Committees Dropdown */}
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
                          isActive('/committees') 
                            ? 'text-[#FF8A00] font-black bg-[#FFE7CC]/50' 
                            : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC] font-black'
                        }`}
                      >
                        Committees <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/committees') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[540px] text-left gap-6 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Student Cells & Associations</span>
                          <div className="space-y-1">
                            <Link to="/committees/anti-ragging" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Anti-Ragging Committee</Link>
                            <Link to="/committees/iiic" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Industry-Institute Interaction Cell (IIIC)</Link>
                            <Link to="/committees/women-empowerment" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Women Empowerment Cell</Link>
                            <Link to="/committees/alumni-cell" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Alumni Cell</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Welfare & Career Clubs</span>
                          <div className="space-y-1">
                            <Link to="/committees/sc-st-committee" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">SC/ST Committee</Link>
                            <Link to="/committees/electoral-literacy" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Electoral Literacy Club</Link>
                            <Link to="/committees/career-guidance" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Career Guidance Cell</Link>
                            <Link to="/committees/entrepreneurship" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Entrepreneurship Cell</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RTI Link */}
                    <Link 
                      to="/rti" 
                      className={`text-[11px] uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-0.5 rounded-lg block font-black ${
                        isActive('/rti') 
                          ? 'text-[#FF8A00] bg-[#FFE7CC]/50' 
                          : 'text-black hover:text-[#FF8A00] hover:bg-[#FFE7CC]'
                      }`}
                    >
                      RTI
                      {isActive('/rti') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FF8A00]" 
                        />
                      )}
                    </Link>

                    {/* IQAC Megamenu */}
                    <div className="relative group py-0">
                      <button 
                        className={`text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
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
                      <div className="absolute top-full left-1/2 -translate-x-1/2 grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[540px] text-left gap-6 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 delay-100 group-hover:delay-0 nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Quality Assurance & NAAC</span>
                          <div className="space-y-1">
                            <a href="https://apec.edu.in/naac/" target="_blank" rel="noopener noreferrer" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">NAAC</a>
                            <Link to="/iqac" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC</Link>
                            <Link to="/iqac-members" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC Members</Link>
                            <Link to="/iqac-mom-at" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">IQAC MoM & AT</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Rankings & Disclosures</span>
                          <div className="space-y-1">
                            <Link to="/disclosures" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Disclosures (NIRF, AICTE & MD)</Link>
                            <Link to="/ugc-undertaking" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Undertaking</Link>
                            <Link to="/nirf" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">NIRF</Link>
                            <Link to="/instrumentation-cell" className="block text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] hover:bg-[#FFE7CC] px-2 py-1 rounded nav-dropdown-link transition-all">Instrumentation Cell</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to="/contact" 
                      className={`text-xs uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-0.5 rounded-lg block ${
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

                    {localStorage.getItem('is_logged_in') === 'true' && (
                      <Link 
                        to="/editor-panel" 
                        className={`text-xs uppercase tracking-wider transition-all nav-link-dynamic relative px-2 py-0.5 rounded-lg ${
                          isActive('/editor-panel') 
                            ? 'text-indigo-650 font-black bg-indigo-50/50 border border-indigo-100' 
                            : 'text-indigo-600 hover:text-indigo-750 hover:bg-indigo-50 font-black'
                        }`}
                      >
                        Editor Panel
                        {isActive('/editor-panel') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-indigo-600" 
                          />
                        )}
                      </Link>
                    )}

                  </nav>
                </div>
              </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Backdrop Overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] lg:hidden"
                  />

                  {/* Drawer Content */}
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                    data-lenis-prevent
                    className="fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-[#FFF4E8] shadow-2xl z-[9999] flex flex-col text-left border-l border-[#FFD6A5] lg:hidden"
                  >
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-[#FFD6A5]/50 flex items-center justify-between bg-white shrink-0">
                      <div className="flex items-center gap-2">
                        <img 
                          src="/Images/Logos/apec-logo.png" 
                          alt="APEC Logo" 
                          className="w-8 h-8 object-contain mix-blend-multiply" 
                        />
                        <div className="flex flex-col text-left justify-center">
                          <span className="font-title text-[10px] font-black text-gray-900 leading-tight">APEC College</span>
                          <span className="text-[7px] uppercase font-black tracking-wider text-violet-750">Autonomous Portal</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-1.5 text-gray-700 hover:text-gray-950 transition-colors focus:outline-none"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Drawer Body (Scrollable Content) */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-900 block border-b border-gray-150 pb-2">Home</Link>
                      
                      {/* Collapsible Mobile About Section */}
                      <div className="border-b border-gray-150 pb-2">
                        <button 
                          onClick={() => setMobileAboutOpen(!mobileAboutOpen)} 
                          className="w-full text-left text-sm font-semibold text-gray-700 flex items-center justify-between focus:outline-none"
                        >
                          <span>About APEC</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileAboutOpen && (
                          <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-[#FFD6A5]/60">
                            <Link to="/about/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Institution Profile</Link>
                            <Link to="/about/founders" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Founder & Trustees</Link>
                            <Link to="/about/principal" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Principal Desk & Contacts</Link>
                          </div>
                        )}
                      </div>
                      
                      {/* Collapsible Mobile Admission Section */}
                      <div className="border-b border-gray-150 pb-2">
                        <button 
                          onClick={() => setMobileAdmissionOpen(!mobileAdmissionOpen)} 
                          className="w-full text-left text-sm font-semibold text-gray-700 flex items-center justify-between focus:outline-none"
                        >
                          <span>Admission</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileAdmissionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileAdmissionOpen && (
                          <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-[#FFD6A5]/60">
                            <Link to="/admission?tab=courses" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Courses Offered</Link>
                            <Link to="/admission?tab=procedure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Admission Procedure</Link>
                            <Link to="/admission?tab=scholarships" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Scholarships</Link>
                            <Link to="/admission?tab=brochure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Information Brochure</Link>
                            <Link to="/admission?tab=cutoff" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Cutoff Calculator</Link>
                          </div>
                        )}
                      </div>

                      <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 block border-b border-gray-150 pb-2">Departments</Link>
                      <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 block border-b border-gray-150 pb-2">Facilities</Link>
                      <Link to="/placements" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 block border-b border-gray-150 pb-2">Placements</Link>
                      
                      {/* Collapsible Mobile UGC Section */}
                      <div className="border-b border-gray-150 pb-2">
                        <button 
                          onClick={() => setMobileUgcOpen(!mobileUgcOpen)} 
                          className="w-full text-left text-sm font-semibold text-gray-700 flex items-center justify-between focus:outline-none"
                        >
                          <span>UGC</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileUgcOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileUgcOpen && (
                          <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-[#FFD6A5]/60">
                            <Link to="/r-d-cell" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">R & D Cell</Link>
                            <Link to="/idp" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IDP (Institutional Development Plan)</Link>
                            <Link to="/ugc-self-disclosure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Self Disclosure Guidelines</Link>
                            <Link to="/mandatory-disclosure" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Mandatory Disclosure</Link>
                            <Link to="/annual-accounts" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Annual Accounts</Link>
                            <a href="/Documents/PDFs/UGC/6. 2f-and-12b.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">2(f) and 12(b) Recognition</a>
                            <Link to="/ugc-undertaking" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Undertaking</Link>
                            <Link to="/ugc-approval-letter" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">UGC Autonomous Approval Letter</Link>
                          </div>
                        )}
                      </div>

                      {/* Collapsible Mobile Committees Section */}
                      <div className="border-b border-gray-150 pb-2">
                        <button 
                          onClick={() => setMobileCommitteesOpen(!mobileCommitteesOpen)} 
                          className="w-full text-left text-sm font-semibold text-gray-700 flex items-center justify-between focus:outline-none"
                        >
                          <span>Committees</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileCommitteesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileCommitteesOpen && (
                          <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-[#FFD6A5]/60">
                            <Link to="/committees/anti-ragging" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Anti-Ragging Committee</Link>
                            <Link to="/committees/iiic" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Industry-Institute Interaction Cell (IIIC)</Link>
                            <Link to="/committees/women-empowerment" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Women Empowerment Cell</Link>
                            <Link to="/committees/alumni-cell" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Alumni Cell</Link>
                            <Link to="/committees/sc-st-committee" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">SC/ST Committee</Link>
                            <Link to="/committees/electoral-literacy" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Electoral Literacy Club</Link>
                            <Link to="/committees/career-guidance" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Career Guidance Cell</Link>
                            <Link to="/committees/entrepreneurship" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 text-left">Entrepreneurship Cell</Link>
                          </div>
                        )}
                      </div>

                      {/* RTI Mobile Link */}
                      <Link 
                        to="/rti" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-sm font-semibold text-gray-700 block border-b border-gray-150 pb-2"
                      >
                        RTI
                      </Link>

                      {/* Collapsible Mobile IQAC Section */}
                      <div className="border-b border-gray-150 pb-2">
                        <button 
                          onClick={() => setMobileIqacOpen(!mobileIqacOpen)} 
                          className="w-full text-left text-sm font-semibold text-gray-700 flex items-center justify-between focus:outline-none"
                        >
                          <span>IQAC</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileIqacOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileIqacOpen && (
                          <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-[#FFD6A5]/60">
                            <a href="https://apec.edu.in/naac/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">NAAC</a>
                            <Link to="/iqac" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC</Link>
                            <Link to="/iqac-members" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC Members</Link>
                            <Link to="/iqac-mom-at" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">IQAC MoM & AT</Link>
                            <Link to="/disclosures" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Disclosures (NIRF, AICTE & MD)</Link>
                            <Link to="/ugc-undertaking" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Undertaking</Link>
                            <Link to="/nirf" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">NIRF</Link>
                            <Link to="/instrumentation-cell" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500">Instrumentation Cell</Link>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setIsPanoOpen(true);
                        }}
                        className="w-full text-left text-sm font-bold text-indigo-650 flex items-center gap-1.5 cursor-pointer py-1.5 border-b border-gray-150"
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
                            {localStorage.getItem('apec_user') ? localStorage.getItem('apec_user').split('@')[0] : 'Admin'}
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
                      
                      <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-705 block border-b border-gray-150 pb-2">Contact</Link>
                      
                      {localStorage.getItem('is_logged_in') === 'true' && (
                        <Link to="/editor-panel" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-indigo-600 block border-b border-gray-150 pb-2">Editor Panel</Link>
                      )}
                      
                      <div className="flex flex-col gap-3 pt-4 border-t border-gray-150">
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
                          to="/admission?tab=cutoff"
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
                          New Admission
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content Area: Staggered Fade Route Transitions */}
            <main className="grow">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><InstitutionalProfile /></PageTransition>} />
                  <Route path="/about/profile" element={<PageTransition><InstitutionalProfile /></PageTransition>} />
                  <Route path="/about/founders" element={<PageTransition><FounderTrustees /></PageTransition>} />
                  <Route path="/about/principal" element={<PageTransition><PrincipalDesk /></PageTransition>} />
                  <Route path="/admission" element={<PageTransition><Admission /></PageTransition>} />
                  <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
                  <Route path="/placements" element={<PageTransition><Placements /></PageTransition>} />
                  <Route path="/departments" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/fee-payment" element={<PageTransition><FeePayment /></PageTransition>} />
                  <Route path="/r-d-cell" element={<PageTransition><RDCell /></PageTransition>} />
                  <Route path="/idp" element={<PageTransition><IDP /></PageTransition>} />
                  <Route path="/ugc-self-disclosure" element={<PageTransition><UgcGuidelines /></PageTransition>} />
                  <Route path="/mandatory-disclosure" element={<PageTransition><MandatoryDisclosure /></PageTransition>} />
                  <Route path="/annual-accounts" element={<PageTransition><AnnualAccounts /></PageTransition>} />
                  <Route path="/ugc-undertaking" element={<PageTransition><UgcUndertaking /></PageTransition>} />
                  
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

            {/* Clean, Sleek, Compact Footer */}
            <footer className="footer bg-gray-50 border-t border-gray-100 relative select-none">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* Left Section (College Branding) */}
                <div className="footer-brand select-none">
                  <img 
                    src="/Images/Logos/apec-logo.png" 
                    alt="Adhiparasakthi Engineering College Logo" 
                    className="footer-logo mix-blend-multiply shrink-0" 
                  />
                  <div className="footer-brand-text">
                    <h3 className="font-title text-xs md:text-sm font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-950 bg-clip-text text-transparent block leading-none drop-shadow-sm uppercase">
                      {branding.collegeName}
                    </h3>
                    <span className="font-mono text-[9px] uppercase font-black text-indigo-650 tracking-wider block mt-1">
                      {branding.tagline}
                    </span>
                  </div>
                </div>

                {/* Center Section: Copyright & Socials */}
                <div className="flex flex-col items-center gap-4 text-center w-full md:w-auto">
                  <div className="footer-copyright font-sans text-xs md:text-sm tracking-wider uppercase leading-relaxed font-semibold">
                    <p>© 2026 ADHIPARASAKTHI ENGINEERING COLLEGE</p>
                    <p>ALL RIGHTS RESERVED.</p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <a 
                      href="https://www.instagram.com/apec1984/?hl=en" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon instagram flex items-center justify-center"
                      aria-label="Instagram"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/adhiparasakthiengineeringcollege/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon facebook flex items-center justify-center"
                      aria-label="Facebook"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/school/adhiparasakthi-engineering-college/?originalSubdomain=in" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon linkedin flex items-center justify-center"
                      aria-label="LinkedIn"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a 
                      href="https://www.youtube.com/channel/UCHONHHxcE0lM8G60CEJT09Q" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-icon youtube flex items-center justify-center"
                      aria-label="YouTube"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Right Section Contact */}
                <div className="footer-contact w-full md:w-auto">
                  <div className="footer-contact-item flex items-center gap-2 text-sm font-bold text-[#07113A]">
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      <Phone className="w-3.5 h-3.5 text-indigo-650" /> Helpline:
                    </span>
                    <a 
                      href={`tel:+91${branding.helpline1}`} 
                      className="hover:text-indigo-650 transition-colors"
                    >
                      {branding.helpline1}
                    </a>
                  </div>
                  
                  <div className="footer-contact-item flex items-center gap-2 text-sm font-bold text-[#07113A]">
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      <Mail className="w-3.5 h-3.5 text-indigo-650" /> Email:
                    </span>
                    <a 
                      href="mailto:principal@apec.edu.in" 
                      className="email-text hover:text-indigo-650 transition-colors"
                    >
                      principal@apec.edu.in
                    </a>
                  </div>
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
