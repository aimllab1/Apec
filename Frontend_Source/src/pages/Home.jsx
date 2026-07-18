import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { 
  ArrowRight, BookOpen, ShieldAlert, Award, Calendar, User, Eye, Compass, 
  GraduationCap, X, Mail, Phone, Sparkles, Cpu, Wifi, ChevronDown, CheckCircle2,
  HeartHandshake, Code, Database, Beaker, Settings, Building, Laptop, ChevronLeft, ChevronRight, Zap, Calculator,
  Clock, Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Icosahedron for Hero section (representing structured growth & clarity)
function IcosahedronMesh() {
  const meshRef = useRef(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.25;
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
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.4;
      meshRef.current.rotation.x = elapsed * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -elapsed * 0.15;
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
function LeadershipCard({ name, role, desc, img }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="w-full h-[420px] [perspective:1000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* FRONT SIDE: Portrait image and Title letters overlay */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl border border-gray-200/80 shadow-lg overflow-hidden bg-white">
          <img src={img} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-left">
            <h4 className="font-serif text-base md:text-lg font-bold text-white mb-0.5 leading-snug">{name}</h4>
            <span className="font-display text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">{role}</span>
          </div>
        </div>

        {/* BACK SIDE: Detailed biography info card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl border border-slate-800 shadow-xl bg-slate-950 text-white p-8 flex flex-col justify-between text-left">
          <div>
            <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-serif text-base md:text-lg font-bold text-white mb-1 leading-snug">{name}</h4>
            <span className="font-display text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-4">{role}</span>
            <p className="text-xs text-slate-350 leading-relaxed font-semibold">{desc}</p>
          </div>
          
          <div className="pt-4 border-t border-slate-800">
            <Link to="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:gap-2.5 transition-all">
              Read Biography <ArrowRight className="w-3.5 h-3.5" />
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

  // Admissions overlay and scheduled ads state
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeAds, setActiveAds] = useState([]);
  const [currentAdIdx, setCurrentAdIdx] = useState(0);

  // Load ads on mount or storage updates
  useEffect(() => {
    const reloadAds = async () => {
      let adEnabled = true;
      let loadedAds = [];

      try {
        const snapEnabled = await getDoc(doc(db, 'system_settings', 'ad_popup_enabled'));
        if (snapEnabled.exists()) {
          adEnabled = snapEnabled.data().enabled;
          localStorage.setItem('apec_ad_popup_enabled', String(adEnabled));
        } else {
          const savedEnabled = localStorage.getItem('apec_ad_popup_enabled');
          if (savedEnabled !== null) adEnabled = savedEnabled === 'true';
        }
      } catch (err) {
        const savedEnabled = localStorage.getItem('apec_ad_popup_enabled');
        if (savedEnabled !== null) adEnabled = savedEnabled === 'true';
      }

      if (adEnabled) {
        try {
          const snapAds = await getDoc(doc(db, 'system_settings', 'advertisements'));
          if (snapAds.exists()) {
            loadedAds = snapAds.data().items;
            localStorage.setItem('apec_advertisements', JSON.stringify(loadedAds));
          } else {
            const savedAds = localStorage.getItem('apec_advertisements');
            if (savedAds) loadedAds = JSON.parse(savedAds);
          }
        } catch (err) {
          const savedAds = localStorage.getItem('apec_advertisements');
          if (savedAds) loadedAds = JSON.parse(savedAds);
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

  // Trigger ad popup 1.5 seconds after landing
  useEffect(() => {
    if (activeAds.length > 0) {
      const timer = setTimeout(() => {
        setShowAdModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeAds]);

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
      const newInquiry = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleString()
      };

      try {
        // Save directly to Firestore inquiries collection
        await addDoc(collection(db, "inquiries"), newInquiry);

        // Also update local copy for caching/offline fallback
        const existing = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
        existing.push(newInquiry);
        localStorage.setItem('apec_inquiries', JSON.stringify(existing));

        setIsSubmitting(false);
        setFormSubmitted(true);
      } catch (err) {
        console.error("Firestore database connection failed. Storing locally instead: ", err);
        // Fallback store in localStorage if database connection fails
        const existing = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
        existing.push(newInquiry);
        localStorage.setItem('apec_inquiries', JSON.stringify(existing));

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
    { key: "aiml", name: "CSE (Artificial Intelligence & Machine Learning)", code: "AIML", details: "Specialized pathway in neural networks, machine learning algorithms, deep learning, and predictive models.", img: "/Images/Dept/aiml dept.jpg" }
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
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-start pt-14 pb-16 px-6 border-b border-gray-100 bg-transparent z-10">
        
        <div className="w-full max-w-[1800px] mx-auto px-6 flex flex-col items-center relative z-10">
          
          {/* Hero Text — pinned to top */}
          <div className="w-full text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center gap-2 px-5 py-1.5 mb-6 text-xs md:text-sm font-semibold tracking-wide text-indigo-700 bg-white border border-indigo-200 rounded-full cursor-default select-none"
              animate={{
                y: [0, -5, 0, 5, 0],
                boxShadow: [
                  '0 4px 18px rgba(99,102,241,0.18), 0 1px 4px rgba(139,92,246,0.10)',
                  '0 8px 28px rgba(99,102,241,0.32), 0 2px 8px rgba(139,92,246,0.22)',
                  '0 4px 18px rgba(99,102,241,0.18), 0 1px 4px rgba(139,92,246,0.10)',
                ]
              }}
              transition={{
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                boxShadow: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 32px rgba(99,102,241,0.38), 0 3px 10px rgba(139,92,246,0.28)',
                transition: { duration: 0.28, ease: 'easeOut' }
              }}
            >
              <span className="font-serif italic"><span className="not-italic font-black text-sm md:text-base text-indigo-800">42</span> Years of Academic Excellence</span>
            </motion.div>

            {/* Title — fluid clamp() inside 1800px container, single line lg+ */}
            <div className="w-full flex justify-center mb-5">
              <h1
                className="font-title font-black tracking-[-0.02em] leading-[1.05] text-center lg:whitespace-nowrap"
                style={{
                  fontSize: 'clamp(1.75rem, 4.2vw, 5rem)',
                  color: '#1B224A',
                  opacity: 1,
                  textShadow: '0 2px 6px rgba(255,255,255,0.15)'
                }}
              >
                Adhiparasakthi Engineering College
              </h1>
            </div>

            <p
              className="text-base md:text-lg text-black leading-relaxed font-bold max-w-[280px] sm:max-w-sm md:max-w-2xl mx-auto px-2"
              style={{ textWrap: 'balance' }}
            >
              An autonomous institution affiliated to Anna University, committed to training engineers with a sense of service and spirituality.
            </p>
          </div>

          {/* Admission Floating Banner — centered below title */}
          <div className="block w-full max-w-sm mx-auto px-8 py-6 md:p-7 bg-white/55 backdrop-blur-md border border-white/45 rounded-2xl shadow-lg mt-2 mb-20 md:mb-4 text-center">
            <h3 className="font-title text-lg font-bold text-gray-900 mb-1">{`${new Date().getFullYear()} - ${new Date().getFullYear() + 1} Admissions Open`}</h3>
            <p className="text-xs text-gray-500 mb-5 font-semibold">Click below to apply or connect with our help desk.</p>
            
            <div className="flex flex-col items-center gap-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all w-full max-w-[200px]"
              >
                Click to Apply
              </Link>
              <div className="text-center">
                <span className="font-display block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Helpline</span>
                <span className="font-mono text-xs md:text-sm font-bold text-gray-700 block mt-0.5">
                  <a href={`tel:+91${branding.helpline1}`} className="hover:text-indigo-600 hover:underline transition-colors">{branding.helpline1}</a>
                  {" / "}
                  <a href={`tel:+91${branding.helpline2}`} className="hover:text-indigo-650 hover:underline transition-colors">{branding.helpline2}</a>
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Credentials Card — Single Horizontal Row with Logos */}
          <div className="w-full max-w-5xl bg-transparent mt-8 p-6 md:p-8 select-none relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-8">
              <span className="font-display text-xs uppercase tracking-widest font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full">
                Institutional Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-stretch">
              {/* Anna University */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0 
                }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.12)' 
                }}
                className="flex flex-col items-center justify-center p-6 text-center group cursor-pointer bg-indigo-50/40 backdrop-blur-[2px] border border-indigo-100/30 rounded-2xl shadow-lg hover:bg-indigo-100/60 hover:border-indigo-300/50 transition-all duration-300"
              >
                <div className="w-72 h-40 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <img src="/Images/Logos/university_logo-rem.png" alt="Anna University Logo" className="w-full h-full object-contain scale-125 drop-shadow-md" />
                </div>
                <h4 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-650 transition-colors duration-300">
                  Anna University
                </h4>
                <p className="text-base md:text-lg lg:text-xl text-slate-950 font-black tracking-tight mt-1">
                  Affiliated to Anna University
                </p>
              </motion.div>

              {/* UGC Autonomous */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0.4 
                }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.12)' 
                }}
                className="flex flex-col items-center justify-center p-6 text-center group cursor-pointer bg-amber-50/40 backdrop-blur-[2px] border border-amber-100/30 rounded-2xl shadow-lg hover:bg-amber-100/60 hover:border-amber-300/50 transition-all duration-300"
              >
                <div className="w-72 h-40 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <img src="/Images/Logos/UGC.png" alt="UGC Logo" className="w-full h-full object-contain scale-[0.95] drop-shadow-md" />
                </div>
                <h4 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                  UGC Autonomous
                </h4>
                <p className="text-base md:text-lg lg:text-xl text-slate-950 font-black tracking-tight mt-1">
                  Autonomous Status (10 Years)
                </p>
              </motion.div>

              {/* NAAC Accredited */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: 'easeInOut', 
                  delay: 0.8 
                }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.12)' 
                }}
                className="flex flex-col items-center justify-center p-6 text-center group cursor-pointer sm:col-span-2 lg:col-span-1 sm:max-w-xs sm:mx-auto lg:max-w-none w-full bg-emerald-50/40 backdrop-blur-[2px] border border-emerald-100/30 rounded-2xl shadow-lg hover:bg-emerald-100/60 hover:border-emerald-300/50 transition-all duration-300"
              >
                <div className="w-72 h-40 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <img src="/Images/Logos/Naac.png" alt="NAAC Accredited Logo" className="w-full h-full object-contain scale-125 drop-shadow-md" />
                </div>
                <h4 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  NAAC Accredited
                </h4>
                <p className="text-base md:text-lg lg:text-xl text-slate-950 font-black tracking-tight mt-1">
                  Accredited with NAAC 'A' Grade
                </p>
              </motion.div>
            </div>
          </div>

        </div>
      </section>


      {/* WHY JOIN APEC FEATURE GRID */}
      <section className="py-24 px-6 bg-transparent border-b border-gray-100/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">Adhiparasakthi Engineering College</span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">Why Join Adhiparasakthi Engineering College?</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="features-grid grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={twistReveal}
                className="benefit-card select-none cursor-pointer relative overflow-hidden"
                style={{ 
                  backgroundColor: "#0f172a"
                }}
              >
                {/* Background image / slideshow */}
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

                {/* Background image overlay */}
                <div className="benefit-card-overlay" />

                {/* Circular Glass Badge */}
                <div className="benefit-badge">
                  {idx + 1}
                </div>

                {/* Bottom glass text overlay */}
                <div className="card-content text-left">
                  <h4 className="text-base md:text-lg font-black text-slate-900 mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-850 font-bold leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Department Visualizer replaced with centered sliding showcase */}
      <section className="py-24 px-6 bg-transparent border-b border-gray-100/55 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">Curriculum Explorer</span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">Department Showcase</h2>
            <p className="text-xs text-gray-400 mt-2 max-w-sm font-semibold font-sans">Explore our individual department portals and their focused structural curricula.</p>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-12 flex flex-col items-center">
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
                      <div className="group relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/80 rounded-3xl flex flex-col md:flex-row transition-all duration-500 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] overflow-hidden h-auto md:h-[350px] w-full max-w-4xl after:absolute after:inset-0 after:-translate-x-full hover:after:translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/15 after:to-transparent after:transition-transform after:duration-1000 after:ease-out">
                        {/* Left Column: Department Image */}
                        <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden relative border-b md:border-b-0 md:border-r border-white/20 dark:border-slate-800/50 shrink-0">
                          <img 
                            src={dept.img} 
                            alt={dept.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 pointer-events-none" />
                        </div>

                        {/* Right Column: Details & Explore */}
                        <div className="p-5 md:p-8 flex flex-col justify-between items-start text-left flex-grow relative w-full">
                          {/* Subtle gradient background glow on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          
                          <div className="w-full relative z-10">
                            {/* Top row with Icon and Badge */}
                            <div className="flex justify-between items-center mb-4 md:mb-5">
                              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/20 dark:bg-slate-800/50 border border-white/25 dark:border-slate-700/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 group-hover:bg-indigo-650 group-hover:text-white dark:group-hover:text-white transition-all duration-300">
                                <IconComponent className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/20 dark:bg-slate-800/50 border border-white/25 dark:border-slate-700/50 text-indigo-700 dark:text-indigo-400 group-hover:bg-indigo-650 group-hover:text-white dark:group-hover:text-white group-hover:border-indigo-650 transition-all duration-300">
                                {dept.code}
                              </span>
                            </div>
                            
                            <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block mb-1">Focused Curriculum Overview</span>
                            <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-slate-100 mb-1.5 md:mb-2.5 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors duration-200">{dept.name}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold mb-3 md:mb-4 max-w-xl">{dept.details}</p>
                          </div>

                          <div className="w-full pt-3 md:pt-4 border-t border-white/20 dark:border-slate-800/80 mt-auto flex justify-between items-center relative z-10">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Autonomous Status</span>
                            <Link to={`/departments/${dept.key}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 group-hover:gap-2.5 transition-all">
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

            {/* Left and Right navigation buttons */}
            <button
              onClick={() => {
                setDirection(-1);
                setCurrentIdx((prev) => (prev - 1 + depts.length) % depts.length);
              }}
              className="absolute left-[-16px] md:left-[-32px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-650 hover:text-indigo-650 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer z-20"
              aria-label="Previous department"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setDirection(1);
                setCurrentIdx((prev) => (prev + 1) % depts.length);
              }}
              className="absolute right-[-16px] md:right-[-32px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-650 hover:text-indigo-650 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer z-20"
              aria-label="Next department"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot Indicator Navigation */}
            <div className="flex gap-2 mt-6 justify-center">
              {depts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIdx ? 1 : -1);
                    setCurrentIdx(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIdx === idx ? 'w-6 bg-indigo-650' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 px-6 bg-transparent border-b border-gray-100/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">Leadership</span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">Management & Founders</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { name: "Arulthiru Bangaru Sidhar (Amma)", role: "Founder", desc: "Ordained the ACMEC Trust to establish medical, educational, and cultural service foundations.", img: "/Images/College/bangaru_sidhar.jpg" },
              { name: "Sakthi Tmt. V. Lakshmi Bangaru Sidhar", role: "President", desc: "Guiding the institution towards global academic and professional leadership.", img: "/Images/College/lakshmi_sidhar.jpg" },
              { name: "Sakthi Thiru. Dr. G. B. Senthil Kumar", role: "Correspondent", desc: "Directing administrative functions and infrastructure expansions for students.", img: "/Images/College/senthil_kumar.jpg" }
            ].map((person, idx) => (
              <motion.div key={idx} variants={twistReveal}>
                <LeadershipCard 
                  name={person.name} 
                  role={person.role} 
                  desc={person.desc} 
                  img={person.img} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Admissions Advertisement Modal Overlay */}
      <AnimatePresence>
        {showAdModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setShowAdModal(false)} />

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
            `}} />

            <motion.div
              initial={{ scale: 0.95, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="relative w-full max-w-lg md:max-w-3.5xl bg-white border border-gray-200 rounded-[28px] shadow-2xl z-10 mx-auto max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAdModal(false)}
                className="absolute top-5 right-5 md:top-6 md:right-6 z-25 p-2 bg-white/80 hover:bg-rose-100 text-gray-500 hover:text-rose-600 rounded-full shadow-sm border border-gray-200 transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ── LEFT PANEL: Logo, Info & Scheduled Ad Notices (desktop only) ── */}
              <div className="hidden md:flex flex-col items-center justify-start w-[40%] shrink-0 bg-gradient-to-b from-indigo-50 via-white to-indigo-50 rounded-l-[28px] border-r border-gray-100 p-6 max-h-[90vh] overflow-y-auto">
                <div className="w-20 h-20 rounded-full bg-white shadow-md border border-indigo-100 flex items-center justify-center mb-4 mt-2">
                  <img
                    src="/Images/Logos/apec-logo.png"
                    alt="Logo"
                    className="w-16 h-16 object-contain rounded-full"
                  />
                </div>
                <h3 className="font-title text-sm font-black text-gray-900 leading-tight text-center px-1">
                  Adhiparasakthi Engineering College
                </h3>
                <span className="block mt-2 text-center text-indigo-700 font-bold uppercase tracking-widest text-[9px]" style={{fontFamily: "'Cinzel', serif"}}>
                  An Autonomous Institution
                </span>
                <span className="block mt-1 text-center font-title font-bold text-[10px] text-[#3b3f8c]">
                  Affiliated to Anna University
                </span>

                {/* Scheduled Advertisement inside Left Panel */}
                {activeAds.length > 0 && (
                  <div className="w-full mt-6 pt-5 border-t border-gray-150 text-left space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-650 flex items-center gap-1">
                        <Megaphone className="w-3.5 h-3.5 text-indigo-600 animate-bounce" /> Live Notice / Event
                      </span>
                      {activeAds.length > 1 && (
                        <div className="flex gap-1">
                          {activeAds.map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-1 h-1 rounded-full transition-all ${i === currentAdIdx ? 'bg-indigo-650 w-2.5' : 'bg-slate-200'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {(() => {
                      const ad = activeAds[currentAdIdx] || activeAds[0];
                      let daysLeft = null;
                      if (ad.functionDate) {
                        const target = new Date(ad.functionDate);
                        const today = new Date();
                        target.setHours(0,0,0,0);
                        today.setHours(0,0,0,0);
                        const diffTime = target - today;
                        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      }

                      return (
                        <div className="bg-slate-950 text-white border border-slate-800 rounded-[22px] p-4.5 shadow-2xl space-y-4 transition-all duration-300 relative overflow-hidden group hover:scale-[1.01] hover:shadow-indigo-500/10">
                          {/* Ambient background glow effect */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

                          {ad.imgUrl && (
                            <div className="w-full h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-850 relative">
                              <img src={ad.imgUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            </div>
                          )}
                          
                          <div className="space-y-1.5 text-left">
                            <h4 className="text-xs md:text-sm font-black text-slate-100 leading-snug group-hover:text-white transition-colors">{ad.title}</h4>
                            <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">{ad.details}</p>
                          </div>

                          {/* Date Countdown widget inside premium dark capsule */}
                          {ad.functionDate && (
                            <div className="pt-0.5 text-left">
                              {daysLeft > 0 ? (
                                <div className="bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 text-[9.5px] font-black uppercase tracking-wider shadow-inner">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
                                  <span>⏳ {daysLeft} Days Remaining</span>
                                </div>
                              ) : daysLeft === 0 ? (
                                <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 text-[9.5px] font-black uppercase tracking-wider animate-pulse shadow-inner">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>🔥 Event Starts Today!</span>
                                </div>
                              ) : null}
                            </div>
                          )}

                          {/* Premium CTA Button */}
                          {ad.link && (
                            <a
                              href={ad.link.startsWith('http') ? ad.link : undefined}
                              onClick={(e) => {
                                if (!ad.link.startsWith('http')) {
                                  e.preventDefault();
                                  setShowAdModal(false);
                                  window.location.href = ad.link;
                                }
                              }}
                              target={ad.link.startsWith('http') ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="w-full bg-gradient-to-r from-indigo-650 to-purple-600 hover:from-indigo-550 hover:to-purple-500 text-white font-black text-[9.5px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-98 select-none text-center"
                            >
                              Register Now <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* ── RIGHT PANEL: Admissions Inquiry Form & Mobile notices alert ── */}
              <div className="flex flex-col w-full md:w-[60%] p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                
                {/* Mobile-only: institution header */}
                <div className="flex flex-col items-center text-center mb-5 md:hidden">
                  <img
                    src="/Images/Logos/apec-logo.png"
                    alt="Logo"
                    className="w-14 h-14 object-contain bg-white rounded-full p-1.5 shadow border border-gray-100 mb-2.5"
                  />
                  <h3 className="font-title text-base font-black text-gray-900 leading-tight">
                    Adhiparasakthi Engineering College
                  </h3>
                  <span className="text-indigo-700 font-semibold block mt-0.5 text-[10px]" style={{fontFamily: "'Cinzel', serif", letterSpacing: '0.05em'}}>
                    An Autonomous Institution
                  </span>
                </div>

                {/* Mobile-only scheduled ad banner */}
                {activeAds.length > 0 && (
                  (() => {
                    const ad = activeAds[currentAdIdx] || activeAds[0];
                    let daysLeft = null;
                    if (ad.functionDate) {
                      const target = new Date(ad.functionDate);
                      const today = new Date();
                      target.setHours(0,0,0,0);
                      today.setHours(0,0,0,0);
                      const diffTime = target - today;
                      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                    return (
                      <div className="md:hidden mb-5 bg-slate-950 text-white border border-slate-800 p-4 rounded-2xl text-left space-y-2.5 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-[8px] uppercase tracking-widest font-black text-indigo-400 flex items-center gap-1 select-none">
                            <Megaphone className="w-3.5 h-3.5 text-indigo-400 animate-bounce" /> Live Notice / Event
                          </span>
                          {activeAds.length > 1 && (
                            <span className="text-[9px] font-mono font-bold text-slate-400">
                              {currentAdIdx + 1}/{activeAds.length}
                            </span>
                          )}
                        </div>
                        <h5 className="text-[11.5px] font-black text-slate-100">{ad.title}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{ad.details}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          {/* Countdown Timer capsule */}
                          {ad.functionDate && (
                            <div>
                              {daysLeft > 0 ? (
                                <span className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-lg inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider">
                                  ⏳ {daysLeft} Days Left
                                </span>
                              ) : daysLeft === 0 ? (
                                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-lg inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider animate-pulse">
                                  🔥 Starts Today!
                                </span>
                              ) : null}
                            </div>
                          )}

                          {ad.link && (
                            <a 
                              href={ad.link.startsWith('http') ? ad.link : undefined}
                              onClick={(e) => {
                                if (!ad.link.startsWith('http')) {
                                  e.preventDefault();
                                  setShowAdModal(false);
                                  window.location.href = ad.link;
                                }
                              }}
                              target={ad.link.startsWith('http') ? "_blank" : undefined}
                              className="text-[9.5px] font-black uppercase text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5 self-end"
                            >
                              Register Now <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}

                <div className="flex justify-center md:justify-start mb-5">
                  <span className="font-sans inline-block text-[9px] font-extrabold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase">
                    {`Admission Inquiry for ${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`}
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
                      <form onSubmit={handleFormSubmit} className="space-y-3.5">
                        {/* Name Input */}
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-450 tracking-wider mb-1">Full Name</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {formErrors.name && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.name}</p>}
                        </div>

                        {/* Email & Phone grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Cutoff */}
                          <div>
                            <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Cutoff (Out of 200)</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
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
                                placeholder="Enter cutoff"
                                className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  formErrors.cutoff ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                                }`}
                              />
                            </div>
                            {formErrors.cutoff && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.cutoff}</p>}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Mobile Number</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                <Phone className="w-4 h-4" />
                              </span>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10-digit mobile"
                                className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                  formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                                }`}
                              />
                            </div>
                            {formErrors.phone && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.phone}</p>}
                          </div>
                        </div>

                        {/* Preferred Department */}
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Preferred Department</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                              <GraduationCap className="w-4 h-4" />
                            </span>
                            <select
                              name="dept"
                              value={formData.dept}
                              onChange={handleInputChange}
                              className={`w-full text-xs pl-9 pr-9 py-2.5 bg-gray-50 border rounded-xl outline-none appearance-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold cursor-pointer ${
                                formErrors.dept ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                              }`}
                            >
                              <option value="">Select a Department</option>
                              <option value="CSE">Computer Science & Engineering (B.E.)</option>
                              <option value="AIML">CSE (Artificial Intelligence & Machine Learning) (B.E.)</option>
                              <option value="EEE">Electrical & Electronics Eng. (B.E.)</option>
                              <option value="ECE">Electronics & Communication Eng. (B.E.)</option>
                              <option value="MECH">Mechanical Engineering (B.E.)</option>
                              <option value="CIVIL">Civil Engineering (B.E.)</option>
                              <option value="IT">Information Technology (B.Tech.)</option>
                              <option value="CHEM">Chemical Engineering (B.Tech.)</option>
                              <option value="CSD">Computer Science & Design (CSD) (B.Tech.)</option>
                              <option value="AGRI">Agricultural Engineering (Agri) (B.Tech.)</option>
                              <option value="MCA">Master of Computer Applications (MCA) (P.G.)</option>
                              <option value="MBA">Master of Business Administration (MBA) (P.G.)</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none">
                              <ChevronDown className="w-4 h-4" />
                            </span>
                          </div>
                          {formErrors.dept && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.dept}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2 animate-gradient-border"
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
                      className="text-center py-6 flex flex-col items-center justify-center grow w-full"
                    >
                      {/* Animated Success Badge */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 120, delay: 0.1 }}
                        className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm"
                      >
                        <CheckCircle2 className="w-8 h-8" />
                      </motion.div>
                      
                      <h4 className="font-sans text-xl md:text-2xl font-black text-gray-900 mb-1 tracking-tight">Inquiry Registered</h4>
                      <p className="font-sans text-[10px] text-indigo-650 font-extrabold mb-4 uppercase tracking-wider">
                        Thank You, {formData.name}
                      </p>
                      
                      <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-left max-w-sm w-full mb-4 space-y-3 shadow-sm text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Selected Course</span>
                          <span className="font-bold text-indigo-600">{formData.dept}</span>
                        </div>
                        
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block text-center pt-1">
                          For Further Details Contact
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-455 font-semibold text-[9px]">Admissions Cell</span>
                            <span className="font-bold text-gray-800 font-mono">
                              <a href={`tel:+91${branding.helpline1}`} className="hover:text-indigo-655 hover:underline">{branding.helpline1}</a> / <a href={`tel:+91${branding.helpline2}`} className="hover:text-indigo-655 hover:underline">{branding.helpline2}</a>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-455 font-semibold text-[9px]">Principal Office</span>
                            <span className="font-bold text-gray-800 font-mono">
                              <a href="tel:+919894657971" className="hover:text-indigo-655 hover:underline">9894657971</a>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-555 max-w-xs leading-relaxed mb-6 font-semibold">
                        Our admissions team will reach out shortly with direct counseling assistance.
                      </p>

                      <button
                        onClick={() => setShowAdModal(false)}
                        className="bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer shadow hover:shadow-lg active:scale-95"
                      >
                        Close Window
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
