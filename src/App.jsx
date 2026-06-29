import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, 
  Download, ChevronDown, Send
} from 'lucide-react';
import Preloader from './components/Preloader';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Facilities from './pages/Facilities';
import Placements from './pages/Placements';
import Departments from './pages/Departments';
import Contact from './pages/Contact';
import DepartmentDetail from './pages/DepartmentDetail';
import FacilityDetail from './pages/FacilityDetail';
import AdminPortal from './pages/AdminPortal';

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
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome to APEC College Assistant! How can I assist you today? Feel free to ask about admissions, TNEA code, courses, library, or placements.' }
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
        aiText = "APEC admissions for the 2026 – 2027 academic cycle are open. For details, call 7418064336 or 7418065336.";
      } else if (query.includes('placement') || query.includes('mou') || query.includes('company') || query.includes('recruit')) {
        aiText = "APEC has a 92% placement rate, with partners including TCS, Wipro, Cognizant, Infosys, and HCL. Highest package offered is 12 LPA.";
      } else if (query.includes('course') || query.includes('department') || query.includes('engineering') || query.includes('ug') || query.includes('pg') || query.includes('phd')) {
        aiText = "We offer UG courses (CSE, AI/ML, ECE, EEE, Chemical, Agri, Mechanical, Civil), PG courses (MCA, MBA, M.E.), and Ph.D. programs.";
      } else if (query.includes('facility') || query.includes('library') || query.includes('hostel') || query.includes('bus') || query.includes('ground') || query.includes('lab')) {
        aiText = "APEC offers comprehensive campus facilities including separate secure hostels, a digital Central Library (50,000+ books), fully equipped labs, and transport buses.";
      }

      setMessages([...newMessages, { sender: 'ai', text: aiText }]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-indigo-600 selection:text-white relative">
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div 
            key="content" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col grow justify-between relative"
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
            <header className="sticky top-0 z-40 bg-white/95 text-gray-900 border-b border-gray-100 backdrop-blur-md shadow-sm transition-colors duration-300">
              
              {/* TOP BAR: GRAND BRANDING & CORE ACTIONS */}
              <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
                
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
                    <span className="font-mono text-[8px] md:text-[9px] uppercase font-black text-indigo-650 tracking-wider block mt-1.5">
                      An Autonomous Institution
                    </span>
                  </div>
                </Link>

                {/* Right Actions & Mobile Toggle */}
                <div className="flex items-center gap-6">
                  {/* Desktop Right Action Panel */}
                  <div className="hidden lg:flex items-center gap-5">
                    <a 
                      href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-indigo-600 transition-colors nav-link-dynamic"
                    >
                      ERP Portal
                    </a>
                    <Link 
                      to="/contact"
                      className="text-xs font-black uppercase tracking-widest bg-gray-950 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Apply Desk
                    </Link>
                  </div>

                  {/* Mobile Menu Button */}
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

              </div>

              {/* BOTTOM BAR: NAVIGATION LINKS (Full-width centered layout) */}
              <div className="border-t border-gray-100/80 bg-white/95 hidden lg:block">
                <div className="max-w-7xl mx-auto px-6 py-1 flex justify-center">
                  <nav className="flex items-center gap-12">
                    
                    <Link 
                      to="/" 
                      className={`text-xs uppercase tracking-wider transition-colors nav-link-dynamic relative pb-1 block ${
                        isActive('/') 
                          ? 'text-indigo-600 font-black' 
                          : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                      }`}
                    >
                      Home
                      {isActive('/') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                        />
                      )}
                    </Link>
                    
                    {/* About Dropdown */}
                    <div className="relative group py-2">
                      <button 
                        className={`text-xs uppercase tracking-wider transition-colors flex items-center gap-1 nav-link-dynamic relative pb-1 ${
                          isActive('/about') 
                            ? 'text-indigo-600 font-black' 
                            : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                        }`}
                      >
                        About <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/about') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Institution Profile</Link>
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Founder & Trustees</Link>
                        <Link to="/about" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Principal Desk</Link>
                      </div>
                    </div>

                    {/* Departments Hover Mega-Menu */}
                    <div className="relative group py-2">
                      <button 
                        className={`text-xs uppercase tracking-wider transition-colors flex items-center gap-1 nav-link-dynamic relative pb-1 ${
                          isActive('/departments') 
                            ? 'text-indigo-600 font-black' 
                            : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                        }`}
                      >
                        Departments <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/departments') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:grid grid-cols-2 bg-white border border-gray-150 shadow-2xl rounded-2xl p-6 w-[500px] text-left gap-6 animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Undergraduate (B.E. / B.Tech.)</span>
                          <div className="space-y-1">
                            <Link to="/departments/cse" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Computer Science & Eng.</Link>
                            <Link to="/departments/aiml" className="block text-xs font-extrabold text-gray-650 hover:text-indigo-605 py-1 nav-dropdown-link">CSE (AI & ML)</Link>
                            <Link to="/departments/it" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Information Technology</Link>
                            <Link to="/departments/ece" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Electronics & Comm. Eng.</Link>
                            <Link to="/departments/eee" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Electrical & Electronics</Link>
                            <Link to="/departments/chemical" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Chemical Engineering</Link>
                            <Link to="/departments/agriculture" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Agricultural Engineering</Link>
                            <Link to="/departments/mech" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Mechanical Engineering</Link>
                            <Link to="/departments/civil" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Civil Engineering</Link>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block mb-3">Postgraduate & Doctoral</span>
                          <div className="space-y-1">
                            <Link to="/departments/mca" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Master of Computer Apps (MCA)</Link>
                            <Link to="/departments/mba" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Master of Business Admin (MBA)</Link>
                            <Link to="/departments" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">M.E. PG Courses</Link>
                            <Link to="/departments" className="block text-xs font-extrabold text-gray-600 hover:text-indigo-600 py-1 nav-dropdown-link">Doctoral Ph.D. Research</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to="/about" 
                      className={`text-xs uppercase tracking-wider transition-colors nav-link-dynamic relative pb-1 block ${
                        isActive('/research') 
                          ? 'text-indigo-600 font-black' 
                          : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                      }`}
                    >
                      R & D
                      {isActive('/research') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                        />
                      )}
                    </Link>
                    
                    {/* Facilities Hover Dropdown */}
                    <div className="relative group py-2">
                      <button 
                        className={`text-xs uppercase tracking-wider transition-colors flex items-center gap-1 nav-link-dynamic relative pb-1 ${
                          isActive('/facilities') 
                            ? 'text-indigo-600 font-black' 
                            : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                        }`}
                      >
                        Facilities <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        {isActive('/facilities') && (
                          <motion.span 
                            layoutId="activeNavMark" 
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                          />
                        )}
                      </button>
                      <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-gray-150 shadow-xl rounded-xl py-3 w-56 text-left animate-[fadeIn_0.2s_ease-out] nav-dropdown-menu">
                        <Link to="/facilities/library" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Central Library</Link>
                        <Link to="/facilities/labs" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Lab Infrastructures</Link>
                        <Link to="/facilities/hostels" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Hostel Blocks</Link>
                        <Link to="/facilities/transport" className="block px-5 py-2 text-xs font-extrabold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 nav-dropdown-link">Transport & Bus Routes</Link>
                      </div>
                    </div>

                    <Link 
                      to="/placements" 
                      className={`text-xs uppercase tracking-wider transition-colors nav-link-dynamic relative pb-1 block ${
                        isActive('/placements') 
                          ? 'text-indigo-600 font-black' 
                          : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                      }`}
                    >
                      Placements & MOUs
                      {isActive('/placements') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                        />
                      )}
                    </Link>

                    <Link 
                      to="/contact" 
                      className={`text-xs uppercase tracking-wider transition-colors nav-link-dynamic relative pb-1 block ${
                        isActive('/contact') 
                          ? 'text-indigo-600 font-black' 
                          : 'text-gray-500 hover:text-indigo-600 font-extrabold'
                      }`}
                    >
                      Contact
                      {isActive('/contact') && (
                        <motion.span 
                          layoutId="activeNavMark" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" 
                        />
                      )}
                    </Link>

                  </nav>
                </div>
              </div>



              {/* Mobile Dropdown */}
              {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-gray-100 py-6 px-6 flex flex-col gap-4 text-left">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-900">Home</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">About APEC</Link>
                  <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Departments</Link>
                  <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Campus Facilities</Link>
                  <Link to="/placements" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Placements & MOUs</Link>
                  <a 
                    href="https://portal.vmedulife.com/public/auth/#/login/apec-melmaruvathur"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-gray-500"
                  >
                    ERP Portal
                  </a>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-500">Contact</Link>
                  
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                    <div className="text-xs text-center font-mono py-1.5 bg-gray-50 rounded text-gray-500 border border-gray-200">
                      TNEA Counseling Code: 1401
                    </div>
                    <Link 
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center text-sm font-bold uppercase tracking-wider bg-gray-950 py-3 rounded-xl text-white"
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
                  <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
                  <Route path="/placements" element={<PageTransition><Placements /></PageTransition>} />
                  <Route path="/departments" element={<PageTransition><Departments /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  
                  {/* Separate detail files */}
                  <Route path="/departments/:id" element={<PageTransition><DepartmentDetail /></PageTransition>} />
                  <Route path="/facilities/:id" element={<PageTransition><FacilityDetail /></PageTransition>} />
                  <Route path="/admin-portal" element={<PageTransition><AdminPortal /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* AI CHAT ASSISTANT WIDGET */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
              
              {/* Hologram Icon Button */}
              {!chatOpen && (
                <button 
                  onClick={() => setChatOpen(true)}
                  className="group relative w-16 h-16 bg-transparent border-0 outline-none flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                >
                  {/* 3D hologram Canvas */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
                      <ambientLight intensity={2} />
                      <HologramTorus />
                    </Canvas>
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute right-full mr-3 bg-gray-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                    Ask me anything
                  </div>
                </button>
              )}

              {/* Chatbox Overlay Modal */}
              {chatOpen && (
                <div className="w-80 h-[380px] bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
                  
                  {/* Chatbox Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-gray-800 tracking-tight">APEC Portal Assistant</span>
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
                          {msg.text}
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
                    alt="APEC Logo" 
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
    </div>
  );
}
