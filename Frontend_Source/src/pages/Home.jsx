import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';

import { 
  ArrowRight, BookOpen, ShieldAlert, Award, Calendar, User, Eye, Compass, 
  GraduationCap, X, Mail, Phone, Sparkles, Cpu, Wifi, ChevronDown, CheckCircle2,
  HeartHandshake, Code, Database, Beaker, Settings, Building, Laptop, ChevronLeft, ChevronRight, Zap, Calculator,
  Clock, Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AchievementBadge from '../components/AchievementBadge';
import { submitInquiry } from '../utils/inquiryService';

gsap.registerPlugin(ScrollTrigger);

// 3D Icosahedron for Hero section (representing structured growth & clarity)
function IcosahedronMesh() {
  const meshRef = useRef(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial 
        color="#111827" 
        wireframe 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
}

// 3D Dodecahedron for TNEA widget (representing structural stability)
function DodecahedronMesh() {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[1.4, 0]} />
      <meshBasicMaterial 
        color="#ffffff" 
        wireframe 
        transparent 
        opacity={0.85} 
      />
    </mesh>
  );
}

// 3D Wireframe sphere with floating particles representing APEC Innovation
function Innovation3D() {
  const meshRef = useRef(null);
  const particlesRef = useRef(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.15;
    }
  });

  const count = 60;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.85, 12, 12]} />
        <meshBasicMaterial 
          color="#f43f5e" 
          wireframe 
          transparent 
          opacity={0.35} 
        />
      </mesh>
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial 
          transparent 
          color="#38bdf8" 
          size={0.045} 
          sizeAttenuation={true} 
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

// Motion animation variables for professional slide twisting reveals
const twistReveal = {
  hidden: { opacity: 0, rotateY: 12, y: 35, scale: 0.98 },
  visible: { 
    opacity: 1, 
    rotateY: 0, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)"
  }),
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 1.05,
    filter: "blur(4px)",
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

// 3D Flip Card Component for Founders & Management
function LeadershipCard({ name, role, desc, img, isActive }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    if (!isActive) {
      setIsFlipped(false);
    }
  }, [isActive]);

  const handleFlip = () => {
    if (!isActive) return;
    setIsFlipped(!isFlipped);
  };
  
  return (
    <div 
      className="w-full h-full [perspective:1000px] cursor-pointer"
      onMouseEnter={() => isActive && setIsFlipped(true)}
      onMouseLeave={() => isActive && setIsFlipped(false)}
      onClick={handleFlip}
    >
      <motion.div 
        className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* FRONT SIDE: Portrait image and Title overlay with Pure White Border + Mild Gold BoxShadow */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl border-2 border-white shadow-[0_0_25px_rgba(245,158,11,0.45)] overflow-hidden bg-white">
          <img src={img} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 xs:p-5 md:p-6 text-left">
            <h4 className="font-title text-sm xs:text-base md:text-lg font-bold text-white mb-1 leading-snug drop-shadow-md">{name}</h4>
            <span className="font-display text-[10px] xs:text-xs font-extrabold text-amber-300 uppercase tracking-wider">{role}</span>
          </div>
        </div>

        {/* BACK SIDE: Detailed biography info card with Pure White Border + Mild Gold BoxShadow */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl border-2 border-white shadow-[0_0_25px_rgba(245,158,11,0.45)] bg-white/90 backdrop-blur-xl text-slate-900 p-4 xs:p-5 md:p-7 flex flex-col justify-between text-left">
          <div>
            <div className="w-9 h-9 xs:w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mb-2 xs:mb-3 md:mb-5 shadow-sm">
              <User className="w-5 h-5 xs:w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-title text-sm xs:text-base md:text-lg font-bold text-slate-900 mb-1 leading-snug">{name}</h4>
            <span className="font-display text-[10px] xs:text-xs font-extrabold text-amber-600 uppercase tracking-wider block mb-2 xs:mb-3 md:mb-4">{role}</span>
            <p className="text-[11px] xs:text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">{desc}</p>
          </div>
          
          <div className="pt-3 xs:pt-4 border-t border-slate-200/80">
            <Link to="/about" className="inline-flex items-center gap-2 text-[11px] xs:text-xs md:text-sm font-extrabold text-amber-600 hover:text-amber-800 hover:gap-3 transition-all">
              Read Biography <ArrowRight className="w-3.5 h-3.5 xs:w-4 h-4 text-amber-600" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const branding = (() => {
    const saved = localStorage.getItem('apec_branding');
    return saved ? JSON.parse(saved) : {
      collegeName: 'Adhiparasakthi Engineering College',
      tagline: 'An Autonomous Institution',
      helpline1: '7418064336',
      helpline2: '7418065336',
    };
  })();

  const scrollRef = useRef(null);
  const codeWidgetRef = useRef(null);
  const [widgetVisible, setWidgetVisible] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [leadershipIdx, setLeadershipIdx] = useState(0);

  // Admissions overlay and scheduled ads state
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeAds, setActiveAds] = useState([]);
  const [currentAdIdx, setCurrentAdIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [adFacilityIdx, setAdFacilityIdx] = useState(0);
  const adFacilityImages = [
    { url: '/Images/College/library.webp', title: 'Central Library' },
    { url: '/Images/Gallery/infrastructure/campus.jpg', title: 'Green Campus' },
    { url: '/Images/Gallery/infrastructure/lab.jpg', title: 'Advanced Labs' }
  ];

  // Rotate facilities slideshow
  useEffect(() => {
    if (showAdModal) {
      const timer = setInterval(() => {
        setAdFacilityIdx(prev => (prev + 1) % adFacilityImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [showAdModal]);

  // Check mobile screen sizes for responsive popup layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close helper for current view
  const handleCloseAdModal = () => {
    setShowAdModal(false);
  };

  // Load ads on mount or storage updates
  useEffect(() => {
    const reloadAds = () => {
      // Check if user is logged into an administrative / admission / HOD portal
      const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
      const userRole = (localStorage.getItem('user_role') || '').toLowerCase();
      const isPortalRole = isLoggedIn && (
        userRole === 'admin' || 
        userRole === 'admission' || 
        userRole.startsWith('dept_') || 
        userRole.includes('hod') ||
        userRole === 'staff'
      );

      if (isPortalRole) {
        setActiveAds([]);
        setShowAdModal(false);
        return;
      }

      let adEnabled = true;
      let loadedAds = [];

      const savedEnabled = localStorage.getItem('apec_ad_popup_enabled');
      if (savedEnabled !== null) adEnabled = savedEnabled === 'true';

      if (adEnabled) {
        const savedAds = localStorage.getItem('apec_advertisements');
        if (savedAds) {
          try { loadedAds = JSON.parse(savedAds); } catch (e) {}
        }

        if (loadedAds.length === 0) {
          loadedAds = [
            {
              id: 'ad-default-1',
              title: 'APEC 2026 Admissions Open',
              details: 'Register now to secure your seat. Click below to inquire.',
              imgUrl: '/Images/College/library.webp',
              link: '/admission',
              startDate: '',
              endDate: '',
              functionDate: '',
              isActive: true
            }
          ];
        }

        const nowStr = new Date().toISOString().split('T')[0];
        const filtered = loadedAds.filter(ad => {
          if (!ad.isActive) return false;
          if (ad.startDate && ad.startDate > nowStr) return false;
          if (ad.endDate && ad.endDate < nowStr) return false;
          return true;
        });

        setActiveAds(filtered);
      } else {
        setActiveAds([]);
      }
    };

    reloadAds();

    window.addEventListener('storage', reloadAds);
    window.addEventListener('apec_storage_update', reloadAds);
    return () => {
      window.removeEventListener('storage', reloadAds);
      window.removeEventListener('apec_storage_update', reloadAds);
    };
  }, []);

  // Trigger ad popup every time website loads/reloads (Public viewing pages only)
  useEffect(() => {
    // Check if user is an authenticated portal user (admin, admission, hod)
    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
    const userRole = (localStorage.getItem('user_role') || '').toLowerCase();
    const isPortalRole = isLoggedIn && (
      userRole === 'admin' || 
      userRole === 'admission' || 
      userRole.startsWith('dept_') || 
      userRole.includes('hod') ||
      userRole === 'staff'
    );

    // Check if current URL is a portal path
    const currentPath = (window.location.pathname || '').toLowerCase();
    const isPortalPath = 
      currentPath.includes('admin') || 
      currentPath.includes('login') || 
      currentPath.includes('editor') || 
      currentPath.includes('portal');

    if (isPortalRole || isPortalPath) {
      setShowAdModal(false);
      return;
    }

    const startTimer = () => {
      return setTimeout(() => {
        // Re-verify portal status before opening
        const activeLogin = localStorage.getItem('is_logged_in') === 'true';
        const activeRole = (localStorage.getItem('user_role') || '').toLowerCase();
        if (!activeLogin && !activeRole.startsWith('dept_') && activeRole !== 'admin' && activeRole !== 'admission') {
          setShowAdModal(true);
        }
      }, 400);
    };

    let timer;

    if (document.readyState === 'complete') {
      timer = startTimer();
    } else {
      const handleLoad = () => {
        timer = startTimer();
      };
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Slideshow for multiple active ads (cycles every 5 seconds)
  useEffect(() => {
    if (showAdModal && activeAds.length > 1) {
      const timer = setInterval(() => {
        setCurrentAdIdx(prev => (prev + 1) % activeAds.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [showAdModal, activeAds]);

  // Library slideshow state
  const [libraryImageIdx, setLibraryImageIdx] = useState(0);
  const libraryImages = [
    "/Images/Gallery/library/cl.jpg",
    "/Images/Gallery/library/2860d03c-30f4-42ff-89e0-84e69198edd4.jpg",
    "/Images/Gallery/library/b8d6dbd7-848a-4f97-8df6-5187bdf2139a.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLibraryImageIdx(prev => (prev + 1) % libraryImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Labs slideshow state
  const [labImageIdx, setLabImageIdx] = useState(0);
  const labImages = [
    "/Images/Gallery/labs/lab.jpg",
    "/Images/Gallery/labs/Labs.jpg",
    "/Images/Gallery/labs/Labss.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLabImageIdx(prev => (prev + 1) % labImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Indoor Stadium slideshow state
  const [indoorImageIdx, setIndoorImageIdx] = useState(0);
  const indoorImages = [
    "/Images/Gallery/indoor/indoor1.png",
    "/Images/Gallery/indoor/indoor2.png",
    "/Images/Gallery/indoor/indoor3.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndoorImageIdx(prev => (prev + 1) % indoorImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Placement Records slideshow state
  const [placementImageIdx, setPlacementImageIdx] = useState(0);
  const placementImages = [
    "/Images/Gallery/placement/placement_cell.jpg",
    "/Images/Gallery/placement/placement2.jpg",
    "/Images/Gallery/placement/placement3.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlacementImageIdx(prev => (prev + 1) % placementImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cutoff: '',
    phone: '',
    dept: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.cutoff) {
      errors.cutoff = 'Cutoff is required';
    } else if (isNaN(formData.cutoff) || Number(formData.cutoff) < 0 || Number(formData.cutoff) > 200) {
      errors.cutoff = 'Cutoff must be between 0 and 200';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.dept) {
      errors.dept = 'Please select a preferred department';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await submitInquiry({
          name: formData.name.trim(),
          cutoff: formData.cutoff,
          phone: formData.phone.trim(),
          dept: formData.dept,
          source: 'Admission Popup Modal'
        });
      } catch (err) {
        console.error('Error submitting inquiry:', err);
      } finally {
        setIsSubmitting(false);
        setFormSubmitted(true);
      }
    }
  };

  useEffect(() => {
    // Smooth slow drifting animation for the TNEA Widget (horizontal drift, no vertical bounce)
    if (codeWidgetRef.current) {
      gsap.to(codeWidgetRef.current, {
        x: '-=8',
        yoyo: true,
        repeat: -1,
        duration: 2.5,
        ease: 'sine.inOut'
      });
    }
  }, []);

  // Department Showcase Carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIdx((prev) => (prev + 1) % depts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIdx]);

  // Auto-play for Management & Founders section on mobile (every 2 seconds, resets timer on user interaction)
  useEffect(() => {
    if (isMobile) {
      const timer = setInterval(() => {
        setLeadershipIdx(prev => (prev + 1) % 3);
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [isMobile, leadershipIdx]);

  // Cycle the visibility of the TNEA Counseling Widget (10s visible, 10s hidden)
  useEffect(() => {
    let timerId;
    let isActive = true;

    const cycle = () => {
      timerId = setTimeout(() => {
        if (!isActive) return;
        setWidgetVisible(false);

        timerId = setTimeout(() => {
          if (!isActive) return;
          setWidgetVisible(true);
          cycle();
        }, 10000);
      }, 10000);
    };

    cycle();

    return () => {
      isActive = false;
      clearTimeout(timerId);
    };
  }, []);

  const features = [
    { title: "Central Library", desc: "Digital systems & technical volumes", img: "/Images/Gallery/library/cl.jpg" },
    { title: "Placement Records", desc: "Top recruiters & career guidance", img: "/Images/Gallery/placement/placement_cell.jpg" },
    { title: "Equipped Labs", desc: "High-spec research & Wifi campus", img: "/Images/Gallery/labs/lab.jpg" },
    { title: "Indoor Stadium & Gym", desc: "Excellent athletic infrastructure", img: "/Images/Panorama/Main_Gate.webp" }
  ];

  const depts = [
    { key: "civil", name: "Civil Engineering", code: "CIVIL", details: "Focuses on building structural designs, environmental hydrology, and general public transport infrastructure.", img: "/Images/Dept/civil dept.jpg" },
    { key: "mech", name: "Mechanical Engineering", code: "MECH", details: "Covers dynamic machine designing, thermal engines, CAD modeling, and industrial manufacturing systems.", img: "/Images/Dept/mech dept.jpg" },
    { key: "ece", name: "Electronics & Communication Engineering", code: "ECE", details: "Covers microelectronics, digital signal processing, embedded systems, and advanced wireless communication network architectures.", img: "/Images/Dept/ece dept.jpg" },
    { key: "eee", name: "Electrical & Electronics Engineering", code: "EEE", details: "Focuses on electrical power systems, smart grid systems, control instrumentation, and electrical machinery design.", img: "/Images/Dept/eee dept.jpg" },
    { key: "cse", name: "Computer Science & Engineering", code: "CSE", details: "Focuses on algorithms, cloud architecture, system software design, and full-stack development.", img: "/Images/Dept/cse dept.png" },
    { key: "aiml", name: "CSE (Artificial Intelligence & Machine Learning)", code: "AIML", details: "Specialized pathway in neural networks, machine learning algorithms, deep learning, and predictive models.", img: "/Images/Department/aiml/askan tech IV.jpeg" }
  ];



  return (
    <div className="relative" ref={scrollRef}>
      
      {/* TNEA CODE WIDGET (With 3D Dodecahedron) */}
      <div 
        className="fixed left-4 top-[75%] z-40 hidden md:flex flex-col items-center justify-center transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateY(-50%) translateX(${widgetVisible ? '0' : 'calc(-100% - 32px)'})`
        }}
      >
        <motion.div 
          ref={codeWidgetRef}
          whileHover={{ scale: 1.04, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="counselling-card relative group bg-gradient-to-l from-rose-600 via-red-500 to-amber-400 text-white border border-white/20 rounded-3xl shadow-[0_15px_35px_rgba(220,38,38,0.3)] select-none cursor-pointer"
        >
          {/* Spinning dashed border outline inside - colored white/20 for defined style */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-1.5 rounded-[22px] border border-dashed border-white/10 pointer-events-none"
          />
          
          {/* Miniature 3D Dodecahedron on the left */}
          <div className="counselling-icon-section relative z-0 shrink-0">
            <div className="counselling-icon relative">
              <Canvas camera={{ position: [0, 0, 3.2], fov: 60 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={2.2} />
                <DodecahedronMesh />
              </Canvas>
            </div>
          </div>

          {/* Defined Structure separator line */}
          <div className="self-stretch w-[1px] bg-white/20 mx-1 shrink-0 z-10" />

          {/* Text Info on the right */}
          <div className="counselling-content select-none relative z-10">
            <span className="counselling-title font-display uppercase text-amber-100 block select-none">
              Counselling Code
            </span>
            <span className="counselling-number font-display text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none">
              1401
            </span>
          </div>
        </motion.div>
      </div>




      {/* Hero Section */}
      <section className="relative flex flex-col justify-start pt-12 pb-10 md:pt-20 md:pb-16 px-4 sm:px-6 bg-transparent z-10">
        
        <div className="w-full max-w-[1800px] mx-auto px-1 sm:px-6 flex flex-col items-center relative z-10">
          
          {/* Hero Text — pinned to top */}
          <div className="w-full text-center mb-2">
            
            {/* Premium Glassmorphism Achievement Badge */}
            <AchievementBadge years={42} text="Years of Academic Excellence" />
            {/* Title — fluid clamp() inside 1800px container, single line lg+ */}
            <div className="w-full flex justify-center mb-3">
              <h1
                className="font-title font-black tracking-[-0.02em] leading-[1.05] text-center lg:whitespace-nowrap text-white"
                style={{
                  fontSize: 'clamp(1.75rem, 4.2vw, 5rem)',
                  color: '#FFFFFF',
                  textShadow: '0 0 25px hsla(38, 71%, 56%, 0.70), 0 0 50px rgba(251,191,36,0.45), 0 4px 18px rgba(15,23,42,0.9)'
                }}
              >
                Adhiparasakthi Engineering College
              </h1>
            </div>

            {/* Subtitle — Forced Single Straight Line matching title style */}
            <div className="w-full flex justify-center mb-2 px-2">
              <h2
                className="font-title font-bold tracking-[0.06em] text-slate-100 uppercase text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{
                  fontSize: 'clamp(0.75rem, 1.8vw, 1.35rem)',
                  color: '#F8FAFC',
                  textShadow: '0 0 18px rgba(245,158,11,0.65), 0 0 35px rgba(251,191,36,0.35), 0 2px 10px rgba(15,23,42,0.8)'
                }}
              >
                An Autonomous Institution Affiliated to Anna University
              </h2>
            </div>

            {/* Core Pillars: STUDY • SPIRITUALITY • SERVICE — Same Cinzel Title Font as College Name */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-nowrap items-center justify-center gap-2 xs:gap-3 sm:gap-6 my-3 whitespace-nowrap max-w-full px-1 select-none"
            >
              {['STUDY', 'SPIRITUALITY', 'SERVICE'].map((word, idx) => (
                <React.Fragment key={word}>
                  {idx > 0 && (
                    <span className="text-white/60 text-[10px] sm:text-xs select-none">•</span>
                  )}
                  <motion.span
                    whileHover={{ scale: 1.08, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="font-title font-black text-xs xs:text-sm sm:text-base md:text-lg tracking-[0.16em] xs:tracking-[0.20em] sm:tracking-[0.24em] uppercase text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] cursor-pointer hover:text-amber-200 transition-colors"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                  >
                    {word}
                  </motion.span>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* Institutional Credentials Card — 3-Column Layout with Enlarged Anna University & NAAC Logos */}
          <div className="w-full max-w-3xl mx-auto bg-transparent mt-2 p-0.5 sm:p-1 select-none relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-3 md:mb-4">
              <span className="font-display text-[10px] sm:text-[11px] uppercase tracking-widest font-black text-amber-300 bg-black/60 border border-amber-400/40 px-3.5 py-1 rounded-full shadow-md backdrop-blur-md">
                Recognition & Accreditation
              </span>
            </div>

            {/* 3-Column Square Box Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5 justify-center items-center w-full">
              {/* Anna University — Enlarged Image */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0 
                }}
                whileHover={{ 
                  scale: 1.06, 
                  boxShadow: '0 0 35px rgba(251, 191, 36, 0.75)' 
                }}
                className="aspect-square w-full flex flex-col items-center justify-center p-0.5 sm:p-1 text-center group cursor-pointer bg-white/10 backdrop-blur-[4px] border-0 rounded-2xl shadow-[0_0_22px_rgba(245,158,11,0.55)] hover:bg-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className="w-full h-[72%] sm:h-[76%] flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-108">
                  <img src="/Images/Logos/university_logo-rem.png" alt="Anna University Logo" className="w-auto h-full max-h-24 sm:max-h-30 md:max-h-36 object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
                </div>
                <div className="mt-0 flex flex-col items-center justify-center px-1 pb-1">
                  <h4 className="font-title text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-extrabold text-white leading-none drop-shadow-md group-hover:text-amber-300 transition-colors">
                    Anna University
                  </h4>
                  <p className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-xs text-slate-100 font-bold tracking-tight leading-none mt-0.5">
                    Affiliated
                  </p>
                </div>
              </motion.div>

              {/* UGC Autonomous — Standard Unchanged Size */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0.4 
                }}
                whileHover={{ 
                  scale: 1.06, 
                  boxShadow: '0 0 35px rgba(251, 191, 36, 0.75)' 
                }}
                className="aspect-square w-full flex flex-col items-center justify-center p-0.5 sm:p-1 text-center group cursor-pointer bg-white/10 backdrop-blur-[4px] border-0 rounded-2xl shadow-[0_0_22px_rgba(245,158,11,0.55)] hover:bg-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className="w-full h-[62%] sm:h-[65%] flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-108">
                  <img src="/Images/Logos/UGC.png" alt="UGC Logo" className="w-auto h-full max-h-16 sm:max-h-20 md:max-h-24 object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
                </div>
                <div className="mt-0 flex flex-col items-center justify-center px-1 pb-1">
                  <h4 className="font-title text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-extrabold text-white leading-none drop-shadow-md group-hover:text-amber-300 transition-colors">
                    UGC Autonomous
                  </h4>
                  <p className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-xs text-slate-100 font-bold tracking-tight leading-none mt-0.5">
                    10 Years Status
                  </p>
                </div>
              </motion.div>

              {/* NAAC Accredited — Enlarged Image */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0.8 
                }}
                whileHover={{ 
                  scale: 1.06, 
                  boxShadow: '0 0 35px rgba(251, 191, 36, 0.75)' 
                }}
                className="aspect-square w-full flex flex-col items-center justify-center p-0.5 sm:p-1 text-center group cursor-pointer bg-white/10 backdrop-blur-[4px] border-0 rounded-2xl shadow-[0_0_22px_rgba(245,158,11,0.55)] hover:bg-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className="w-full h-[72%] sm:h-[76%] flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-108">
                  <img src="/Images/Logos/Naac.png" alt="NAAC Accredited Logo" className="w-auto h-full max-h-24 sm:max-h-30 md:max-h-36 object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
                </div>
                <div className="mt-0 flex flex-col items-center justify-center px-1 pb-1">
                  <h4 className="font-title text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm font-extrabold text-white leading-none drop-shadow-md group-hover:text-amber-300 transition-colors">
                    NAAC Accredited
                  </h4>
                  <p className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-xs text-slate-100 font-bold tracking-tight leading-none mt-0.5">
                    Grade 'A'
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>


      {/* Leadership Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
            <h2 className="font-title text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-3 uppercase tracking-wide">Management & Founders</h2>
          </div>

          {!isMobile ? (
            /* Desktop Layout: Show all cards side-by-side as a normal grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto py-4">
              {[
                { name: "Arulthiru Bangaru Sidhar (Amma)", role: "Founder", desc: "Ordained the ACMEC Trust to establish medical, educational, and cultural service foundations.", img: "/Images/College/bangaru_sidhar.jpg" },
                { name: "Sakthi Tmt. V. Lakshmi Bangaru Sidhar", role: "President", desc: "Guiding the institution towards global academic and professional leadership.", img: "/Images/College/lakshmi_sidhar.jpg" },
                { name: "Sakthi Thiru. Dr. G. B. Senthil Kumar", role: "Correspondent", desc: "Directing administrative functions and infrastructure expansions for students.", img: "/Images/College/senthil_kumar.jpg" }
              ].map((person, idx) => (
                <div key={idx} className="h-[400px] w-full">
                  <LeadershipCard 
                    name={person.name} 
                    role={person.role} 
                    desc={person.desc} 
                    img={person.img}
                    isActive={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Mobile Layout: Auto-sliding Gallery Carousel */
            <>
              <div className="relative w-full max-w-5xl mx-auto h-[320px] xs:h-[350px] flex items-center justify-center overflow-hidden">
                {/* Left Arrow Button */}
                <button 
                  type="button"
                  onClick={() => setLeadershipIdx(prev => (prev - 1 + 3) % 3)}
                  className="absolute left-2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  aria-label="Previous management member"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Gallery Cards Container */}
                <div className="relative w-[280px] xs:w-[310px] h-[300px] xs:h-[330px] flex items-center justify-center">
                  {[
                    { name: "Arulthiru Bangaru Sidhar (Amma)", role: "Founder", desc: "Ordained the ACMEC Trust to establish medical, educational, and cultural service foundations.", img: "/Images/College/bangaru_sidhar.jpg" },
                    { name: "Sakthi Tmt. V. Lakshmi Bangaru Sidhar", role: "President", desc: "Guiding the institution towards global academic and professional leadership.", img: "/Images/College/lakshmi_sidhar.jpg" },
                    { name: "Sakthi Thiru. Dr. G. B. Senthil Kumar", role: "Correspondent", desc: "Directing administrative functions and infrastructure expansions for students.", img: "/Images/College/senthil_kumar.jpg" }
                  ].map((person, idx) => {
                    const diff = (idx - leadershipIdx + 3) % 3;
                    let animateStyle = {};
                    let pointerEvents = "auto";
                    
                    if (diff === 0) {
                      animateStyle = {
                        x: "0%",
                        scale: 1,
                        opacity: 1,
                        zIndex: 20,
                        display: "block"
                      };
                      pointerEvents = "auto";
                    } else {
                      animateStyle = {
                        x: diff === 1 ? "120%" : "-120%",
                        scale: 0.85,
                        opacity: 0,
                        zIndex: 10,
                        transitionEnd: { display: "none" }
                      };
                      pointerEvents = "none";
                    }

                    return (
                      <motion.div
                        key={idx}
                        animate={animateStyle}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute w-full h-full"
                        style={{ pointerEvents }}
                        onClick={() => {
                          if (idx !== leadershipIdx) {
                            setLeadershipIdx(idx);
                          }
                        }}
                      >
                        <LeadershipCard 
                          name={person.name} 
                          role={person.role} 
                          desc={person.desc} 
                          img={person.img}
                          isActive={idx === leadershipIdx}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Arrow Button */}
                <button 
                  type="button"
                  onClick={() => setLeadershipIdx(prev => (prev + 1) % 3)}
                  className="absolute right-2 z-30 w-8 h-8 rounded-full bg-black/45 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  aria-label="Next management member"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dot Indicator Navigation */}
              <div className="flex gap-2.5 mt-6 justify-center">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setLeadershipIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      leadershipIdx === idx 
                        ? 'w-6 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                        : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bento Department Visualizer replaced with centered sliding showcase */}
      <section className="dept-showcase-section py-12 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
            <h2 className="font-title text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-3 uppercase tracking-wide">Department Showcase</h2>
          </div>

          <div className="relative w-full max-w-[1120px] mx-auto px-0 sm:px-6 md:px-12 flex flex-col items-center">
            {/* Carousel card container */}
            <div className="w-full min-h-[420px] md:min-h-[380px] relative overflow-hidden flex items-center justify-center py-4">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {(() => {
                  const dept = depts[currentIdx];
                  const deptIcons = {
                    AIML: Cpu,
                    CSE: Code,
                    IT: Database,
                    CHEM: Beaker,
                    MECH: Settings,
                    CIVIL: Building,
                    MCA: Laptop,
                    ECE: Wifi,
                    EEE: Zap
                  };
                  const IconComponent = deptIcons[dept.code] || BookOpen;

                  return (
                    <motion.div
                      key={currentIdx}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full h-full flex items-center justify-center"
                    >
                      <div className="dept-showcase-card">
                        {/* Edge-to-edge Background Image */}
                        <div className="dept-bg-image-wrapper">
                          <img 
                            src={dept.img} 
                            alt={dept.name} 
                            className="dept-bg-image"
                          />
                        </div>

                        {/* Single uniform dark/black transparent overlay */}
                        <div className="dept-card-overlay" />

                        {/* Top-Left Info Container (Name, Icon, Badge) */}
                        <div className="dept-top-left-panel">
                          <div className="dept-header-info">
                            <div className="dept-icon-badge-row">
                              <div className="dept-icon-container">
                                <IconComponent className="w-5 h-5 text-indigo-300" />
                              </div>
                              <span className="dept-code-badge">
                                {dept.code}
                              </span>
                            </div>
                            <span className="dept-subtitle">Focused Curriculum Overview</span>
                            <h3 className="dept-title">{dept.name}</h3>
                          </div>
                        </div>

                        {/* Bottom-Right Info Container (Description, Explore Link) */}
                        <div className="dept-bottom-right-panel">
                          <p className="dept-description">{dept.details}</p>
                          <div className="dept-actions">
                            <span className="dept-status-badge">Autonomous Status</span>
                            <Link to={`/departments/${dept.key}`} className="dept-link-btn">
                              Explore Portal <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Dot Indicator Navigation */}
            <div className="flex gap-2 mt-6 justify-center">
              {depts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIdx ? 1 : -1);
                    setCurrentIdx(idx);
                  }}
                  className={`indicator-dot cursor-pointer ${
                    currentIdx === idx ? 'active' : 'inactive'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* WHY JOIN APEC FEATURE GRID */}
      <section className="why-join-gallery py-12 md:py-20 px-4 sm:px-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
            <h2 className="font-title text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-3 uppercase tracking-wide">Why Join Adhiparasakthi Engineering College?</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="features-grid"
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={twistReveal}
                className="benefit-card select-none cursor-pointer relative overflow-hidden"
              >
                {/* Background image / slideshow wrapper */}
                <div className="benefit-image-wrapper absolute inset-0 w-full h-full">
                  {feat.title === "Central Library" ? (
                    <div className="absolute inset-0 w-full h-full">
                      {libraryImages.map((img, i) => (
                        <motion.div
                          key={img}
                          className="absolute inset-0"
                          style={{ 
                            backgroundImage: `url(${img})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: i === libraryImageIdx ? 1 : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ))}
                    </div>
                  ) : feat.title === "Equipped Labs" ? (
                    <div className="absolute inset-0 w-full h-full">
                      {labImages.map((img, i) => (
                        <motion.div
                          key={img}
                          className="absolute inset-0"
                          style={{ 
                            backgroundImage: `url(${img})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: i === labImageIdx ? 1 : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ))}
                    </div>
                  ) : feat.title === "Indoor Stadium & Gym" ? (
                    <div className="absolute inset-0 w-full h-full">
                      {indoorImages.map((img, i) => (
                        <motion.div
                          key={img}
                          className="absolute inset-0"
                          style={{ 
                            backgroundImage: `url(${img})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: i === indoorImageIdx ? 1 : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ))}
                    </div>
                  ) : feat.title === "Placement Records" ? (
                    <div className="absolute inset-0 w-full h-full">
                      {placementImages.map((img, i) => (
                        <motion.div
                          key={img}
                          className="absolute inset-0"
                          style={{ 
                            backgroundImage: `url(${img})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: i === placementImageIdx ? 1 : 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backgroundImage: `url(${feat.img})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center"
                      }}
                    />
                  )}
                </div>

                {/* Background image overlay */}
                <div className="benefit-card-overlay" />


                {/* Bottom gradient text overlay */}
                <div className="card-content text-left">
                  <h4 className="font-bold">
                    {feat.title}
                  </h4>
                  <p className="font-semibold leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Admissions Advertisement Modal Overlay */}
      <motion.div
        animate={showAdModal ? "visible" : "hidden"}
        initial={{ opacity: 0, pointerEvents: "none", visibility: "hidden" }}
        variants={{
          hidden: { opacity: 0, pointerEvents: "none", transitionEnd: { visibility: "hidden" } },
          visible: { opacity: 1, pointerEvents: "auto", visibility: "visible" }
        }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Backdrop click to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={handleCloseAdModal} />

        {/* Custom Embedded CSS animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-border {
            background-size: 200% 200%;
            animation: gradient-shift 5s ease infinite;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .no-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}} />

        <motion.div
          variants={{
            hidden: isMobile 
              ? { y: '100%', opacity: 0, scale: 0.9 } 
              : { scale: 0.85, opacity: 0, y: 25 },
            visible: { 
              y: 0, 
              scale: 1, 
              opacity: 1,
              transition: { type: 'spring', damping: 22, stiffness: 280 }
            }
          }}
          animate={showAdModal ? "visible" : "hidden"}
          className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-t-[2.5rem] md:rounded-[32px] overflow-hidden shadow-2xl bg-slate-950 flex flex-col items-center justify-center min-h-[540px] max-h-[92vh] md:max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-10 mx-auto"
        >
          {/* ── FULL COVER BACKGROUND IMAGE (POPUP ZOOM EFFECT) ── */}
          <motion.div 
            initial={{ scale: 1.15 }}
            animate={{ scale: showAdModal ? 1.04 : 1.15 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `url(${activeAds.length > 0 && activeAds[currentAdIdx]?.imgUrl ? activeAds[currentAdIdx].imgUrl : adFacilityImages[adFacilityIdx].url})`
            }}
          />
          
          {/* Aesthetic Dark Gradient & Glass Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/85 backdrop-blur-[1px]" />

          {/* Close Button */}
          <button
            onClick={handleCloseAdModal}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-30 p-2 bg-slate-900/70 hover:bg-rose-600 text-white backdrop-blur-md rounded-full shadow-lg border border-white/25 transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* ── CENTER CONTENT: College Branding & Admissions Enquiry Form ── */}
          <div className="relative z-10 w-full p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center my-auto">
            {/* Top Branding / Circular White Logo & College Name */}
            <div className="flex flex-col items-center text-center mb-3 select-none">
              {/* Circular White Logo Frame */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-4 border-white shadow-[0_0_25px_rgba(255,255,255,0.45)] flex items-center justify-center p-1.5 mb-2 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/Images/Logos/apec-logo.png"
                  alt="APEC Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* College Name in Ad */}
              <h3 className="font-title text-lg sm:text-xl md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {activeAds.length > 0 && activeAds[currentAdIdx]?.title 
                  ? activeAds[currentAdIdx].title 
                  : "Adhiparasakthi Engineering College"}
              </h3>

              <div className="flex items-center justify-center flex-wrap gap-2 mt-1">
                <span className="inline-block text-[9px] sm:text-[10px] font-extrabold tracking-widest text-amber-300 uppercase px-2.5 py-0.5 bg-amber-400/15 backdrop-blur-md rounded-full border border-amber-400/30 shadow-sm">
                  Autonomous Institution
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-200 font-bold drop-shadow">
                  Affiliated to Anna University • AICTE Approved • TNEA: 1401
                </span>
              </div>
            </div>

            {/* Fully Transparent Admissions Inquiry Form */}
            <div className="w-full max-w-md bg-transparent p-2 sm:p-3">
              <div className="flex justify-between items-center mb-3.5">
                <span className="font-sans inline-block text-[9px] sm:text-[10px] font-extrabold tracking-wider text-amber-300 bg-amber-400/20 border border-amber-400/35 backdrop-blur-md px-3.5 py-1.5 rounded-full uppercase shadow-sm">
                  {`Admission Inquiry for ${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`}
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-200 uppercase tracking-widest hidden sm:inline-block drop-shadow">
                  Direct Counseling
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="form-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full text-left"
                  >
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      {/* Name Input */}
                      <div>
                        <label className="block text-[10px] sm:text-[11px] uppercase font-black text-slate-100 tracking-wider mb-1 drop-shadow">Full Name</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/80 pointer-events-none">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-slate-300 border backdrop-blur-md rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all font-semibold shadow-inner ${
                              formErrors.name ? 'border-red-400 focus:border-red-400' : 'border-white/30'
                            }`}
                          />
                        </div>
                        {formErrors.name && <p className="text-[10px] font-extrabold text-red-300 drop-shadow mt-1">{formErrors.name}</p>}
                      </div>

                      {/* Cutoff & Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Cutoff */}
                        <div>
                          <label className="block text-[10px] sm:text-[11px] uppercase font-black text-slate-100 tracking-wider mb-1 drop-shadow">Cutoff (Out of 200)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/80 pointer-events-none">
                              <Calculator className="w-4 h-4" />
                            </span>
                            <input
                              type="number"
                              name="cutoff"
                              max="200"
                              min="0"
                              step="0.01"
                              value={formData.cutoff}
                              onChange={handleInputChange}
                              placeholder="Cutoff"
                              className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-slate-300 border backdrop-blur-md rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all font-semibold shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                formErrors.cutoff ? 'border-red-400 focus:border-red-400' : 'border-white/30'
                              }`}
                            />
                          </div>
                          {formErrors.cutoff && <p className="text-[10px] font-extrabold text-red-300 drop-shadow mt-1">{formErrors.cutoff}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-[10px] sm:text-[11px] uppercase font-black text-slate-100 tracking-wider mb-1 drop-shadow">Mobile Number</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/80 pointer-events-none">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="10-digit mobile"
                              className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-slate-300 border backdrop-blur-md rounded-xl outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all font-semibold shadow-inner ${
                                formErrors.phone ? 'border-red-400 focus:border-red-400' : 'border-white/30'
                              }`}
                            />
                          </div>
                          {formErrors.phone && <p className="text-[10px] font-extrabold text-red-300 drop-shadow mt-1">{formErrors.phone}</p>}
                        </div>
                      </div>

                      {/* Preferred Department */}
                      <div>
                        <label className="block text-[10px] sm:text-[11px] uppercase font-black text-slate-100 tracking-wider mb-1 drop-shadow">Preferred Department</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/80 pointer-events-none">
                            <GraduationCap className="w-4 h-4" />
                          </span>
                          <select
                            name="dept"
                            value={formData.dept}
                            onChange={handleInputChange}
                            className={`w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 sm:py-3 bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white border backdrop-blur-md rounded-xl outline-none appearance-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all font-semibold cursor-pointer shadow-inner ${
                              formErrors.dept ? 'border-red-400 focus:border-red-400' : 'border-white/30'
                            }`}
                          >
                            <option value="" className="bg-slate-900 text-white font-medium">Select a Department</option>
                            <option value="CSE" className="bg-slate-900 text-white font-medium">Computer Science & Engineering (B.E.)</option>
                            <option value="AIML" className="bg-slate-900 text-white font-medium">CSE (Artificial Intelligence & Machine Learning) (B.E.)</option>
                            <option value="EEE" className="bg-slate-900 text-white font-medium">Electrical & Electronics Eng. (B.E.)</option>
                            <option value="ECE" className="bg-slate-900 text-white font-medium">Electronics & Communication Eng. (B.E.)</option>
                            <option value="MECH" className="bg-slate-900 text-white font-medium">Mechanical Engineering (B.E.)</option>
                            <option value="CIVIL" className="bg-slate-900 text-white font-medium">Civil Engineering (B.E.)</option>
                            <option value="IT" className="bg-slate-900 text-white font-medium">Information Technology (B.Tech.)</option>
                            <option value="CHEM" className="bg-slate-900 text-white font-medium">Chemical Engineering (B.Tech.)</option>
                            <option value="CSD" className="bg-slate-900 text-white font-medium">Computer Science & Design (CSD) (B.Tech.)</option>
                            <option value="AGRI" className="bg-slate-900 text-white font-medium">Agricultural Engineering (Agri) (B.Tech.)</option>
                            <option value="MCA" className="bg-slate-900 text-white font-medium">Master of Computer Applications (MCA) (P.G.)</option>
                            <option value="MBA" className="bg-slate-900 text-white font-medium">Master of Business Administration (MBA) (P.G.)</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/80 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </div>
                        {formErrors.dept && <p className="text-[10px] font-extrabold text-red-300 drop-shadow mt-1">{formErrors.dept}</p>}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-[0_4px_25px_rgba(245,158,11,0.5)] hover:shadow-orange-500/60 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2 animate-gradient-border"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing Submission...
                          </span>
                        ) : (
                          'Submit Inquiry Now'
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-6 flex flex-col items-center justify-center grow w-full bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl text-white"
                  >
                    {/* Animated Success Badge */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 120, delay: 0.1 }}
                      className="w-14 h-14 bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 rounded-full flex items-center justify-center mb-3 shadow-lg"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    
                    <h4 className="font-sans text-xl sm:text-2xl font-black text-white mb-0.5 tracking-tight drop-shadow">Inquiry Registered</h4>
                    <p className="font-sans text-xs text-amber-300 font-extrabold mb-4 uppercase tracking-wider drop-shadow">
                      Thank You, {formData.name}
                    </p>
                    
                    <div className="bg-white/15 border border-white/25 rounded-2xl p-4 text-left max-w-sm w-full mb-4 space-y-3 shadow-inner text-xs backdrop-blur-md">
                      <div className="flex justify-between items-center pb-2 border-b border-white/20">
                        <span className="text-slate-300 font-bold uppercase tracking-wider text-[9px]">Selected Course</span>
                        <span className="font-bold text-amber-300 text-xs">{formData.dept}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-semibold text-[10px]">Admissions Cell</span>
                          <span className="font-bold text-white font-mono text-xs">
                            <a href={`tel:+91${branding.helpline1}`} className="hover:text-amber-300 hover:underline">{branding.helpline1}</a> / <a href={`tel:+91${branding.helpline2}`} className="hover:text-amber-300 hover:underline">{branding.helpline2}</a>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-semibold text-[10px]">Principal Office</span>
                          <span className="font-bold text-white font-mono text-xs">
                            <a href="tel:+919894657971" className="hover:text-amber-300 hover:underline">9894657971</a>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 max-w-xs leading-relaxed mb-5 font-semibold drop-shadow">
                      Our admissions team will reach out shortly with direct counseling assistance.
                    </p>

                    <button
                      onClick={handleCloseAdModal}
                      className="bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl active:scale-95"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
