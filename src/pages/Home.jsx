import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { 
  ArrowRight, BookOpen, ShieldAlert, Award, Calendar, User, Eye, Compass, 
  GraduationCap, X, Mail, Phone, Sparkles, Cpu, Wifi, ChevronDown, CheckCircle2,
  HeartHandshake
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
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[1.1, 0]} />
      <meshBasicMaterial 
        color="#1f2937" 
        wireframe 
        transparent 
        opacity={0.2} 
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
  const scrollRef = useRef(null);
  const codeWidgetRef = useRef(null);
  const [activeDepartment, setActiveDepartment] = useState(0);

  // Real-time Cutoff Predictor States
  const [mathsMark, setMathsMark] = useState(85);
  const [physicsMark, setPhysicsMark] = useState(80);
  const [chemistryMark, setChemistryMark] = useState(80);

  const handleMarkChange = (subject, val) => {
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    if (subject === 'maths') setMathsMark(num);
    if (subject === 'physics') setPhysicsMark(num);
    if (subject === 'chemistry') setChemistryMark(num);
  };

  // Admissions overlay and form state
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState(0);
  const modalImages = ['./library.webp', './library2.webp'];

  useEffect(() => {
    if (showAdModal) {
      const timer = setInterval(() => {
        setActiveModalImage(prev => (prev === 0 ? 1 : 0));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [showAdModal]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API submit request
      setTimeout(() => {
        // Persist inquiry submission to localStorage under the apec_inquiries key
        const existing = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
        const newInquiry = {
          ...formData,
          id: Date.now(),
          date: new Date().toLocaleString()
        };
        existing.push(newInquiry);
        localStorage.setItem('apec_inquiries', JSON.stringify(existing));

        setIsSubmitting(false);
        setFormSubmitted(true);
      }, 1200);
    }
  };

  useEffect(() => {
    // Floating animation for the TNEA Widget
    if (codeWidgetRef.current) {
      gsap.to(codeWidgetRef.current, {
        y: '+=12',
        yoyo: true,
        repeat: -1,
        duration: 1.8,
        ease: 'sine.inOut'
      });
    }

    // Trigger admissions modal popup 1 second after component mounts
    const adTimer = setTimeout(() => {
      setShowAdModal(true);
    }, 1000);

    return () => {
      clearTimeout(adTimer);
    };
  }, []);

  const features = [
    { title: "Central Library", desc: "Digital systems & technical volumes" },
    { title: "Placement Records", desc: "Top recruiters & career guidance" },
    { title: "Equipped Labs", desc: "High-spec research & Wifi campus" },
    { title: "Indoor Stadium & Gym", desc: "Excellent athletic infrastructure" }
  ];

  const depts = [
    { name: "CSE (Artificial Intelligence & Machine Learning)", code: "AIML", details: "Specialized pathway in neural networks, machine learning algorithms, deep learning, and predictive models." },
    { name: "Computer Science & Engineering", code: "CSE", details: "Focuses on algorithms, cloud architecture, system software design, and full-stack development." },
    { name: "Information Technology", code: "IT", details: "Emphasizes database administration, web systems engineering, data security, and enterprise solutions." },
    { name: "Electronics & Communication Engineering", code: "ECE", details: "Covers high-frequency VLSI chip designs, signal processing nodes, and IoT telecommunication systems." },
    { name: "Electrical & Electronics Engineering", code: "EEE", details: "Spearheads smart power grid setups, industrial automation control, and renewable energy grids." },
    { name: "Chemical Engineering", code: "CHEM", details: "Focuses on chemical processes, materials development, mass transfer nodes, and environmental safety." },
    { name: "Agricultural Engineering", code: "AGRI", details: "Combines engineering technology with sustainable food processing, farm machinery, and soil hydrology." },
    { name: "Mechanical Engineering", code: "MECH", details: "Covers dynamic machine designing, thermal engines, CAD modeling, and industrial manufacturing systems." },
    { name: "Civil Engineering", code: "CIVIL", details: "Focuses on building structural designs, environmental hydrology, and general public transport infrastructure." },
    { name: "Master of Computer Applications", code: "MCA", details: "Professional postgraduate pathway in software development, cloud databases, web engineering, and IT applications." },
    { name: "Master of Business Administration", code: "MBA", details: "Focuses on operational management, corporate finance, marketing, and human resource systems." }
  ];



  return (
    <div className="relative" ref={scrollRef}>
      


      {/* TNEA CODE WIDGET (With 3D Dodecahedron) */}
      <div 
        ref={codeWidgetRef}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center justify-center"
      >
        <div className="relative group w-32 h-32 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-xl p-1 flex items-center justify-center select-none overflow-hidden">
          
          {/* Miniature 3D Dodecahedron inside */}
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 3.2], fov: 60 }}>
              <ambientLight intensity={1.5} />
              <DodecahedronMesh />
            </Canvas>
          </div>

          {/* HTML Code Panel overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center bg-white/90 border border-gray-100 rounded-full w-24 h-24 shadow-sm">
            <span className="font-display text-[8px] uppercase font-bold tracking-widest text-gray-400">ESTD</span>
            <span className="font-mono text-base font-extrabold tracking-tight text-gray-900 leading-none mt-1.5">1984</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse mt-2" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-6 border-b border-gray-100 overflow-hidden bg-transparent z-10">
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Text inside Bounding Box */}
          <div className="lg:col-span-7 text-left">
            <div className="bg-white/45 backdrop-blur-md border border-white/40 rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl mb-8 relative overflow-hidden">
              <span className="font-serif italic inline-flex items-center gap-2 px-4 py-1 mb-4 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
                42 Years of Academic Excellence
              </span>
              <h1 className="font-title text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-950 via-indigo-900 to-indigo-950 bg-clip-text text-transparent tracking-tight leading-tight mb-4 drop-shadow-sm">
                Adhiparasakthi Engineering College
              </h1>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-semibold">
                An autonomous institution affiliated to Anna University, committed to training engineers with a sense of service and spirituality.
              </p>
            </div>

            {/* Admission Floating Banner */}
            <div className="w-full max-w-lg p-6 bg-white/55 backdrop-blur-md border border-white/45 rounded-2xl shadow-lg">
              <h3 className="font-title text-lg font-bold text-gray-900 mb-1">2026 – 2027 Admissions Open</h3>
              <p className="text-xs text-gray-500 mb-4 font-semibold">Click below to apply or connect with our help desk.</p>
              
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                >
                  Click to Apply
                </Link>
                <div className="text-right">
                  <span className="font-display block text-[9px] text-gray-400 uppercase tracking-widest font-bold">Helpline</span>
                  <span className="font-mono text-xs md:text-sm font-bold text-gray-700 block mt-0.5">
                    <a href="tel:+917418064336" className="hover:text-indigo-600 hover:underline transition-colors">7418064336</a>
                    {" / "}
                    <a href="tel:+917418065336" className="hover:text-indigo-600 hover:underline transition-colors">7418065336</a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero: Institutional Credentials Dashboard */}
          <div className="lg:col-span-5 w-full flex items-center justify-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full p-8 bg-white/95 backdrop-blur-md border border-indigo-500/20 rounded-[32px] shadow-[0_0_20px_rgba(99,102,241,0.12)] text-left relative overflow-hidden hover:shadow-[0_0_25px_rgba(99,102,241,0.22)] transition-shadow duration-300"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <span className="font-display text-[9px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-6">
                APEC Profile
              </span>
              
              <h3 className="font-title text-lg font-bold text-gray-900 mb-6">Autonomous Credentials</h3>
              
              <div className="space-y-4">
                {/* Affiliation */}
                <div className="p-4 bg-gray-50/80 border border-gray-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-display block text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Affiliation</span>
                    <span className="text-xs font-bold text-gray-800">Anna University</span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">Affiliated</span>
                </div>

                {/* UGC Autonomous */}
                <div className="p-4 bg-gray-50/80 border border-gray-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-display block text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Academic Status</span>
                    <span className="text-xs font-bold text-gray-800">UGC Autonomous</span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">Approved</span>
                </div>

                {/* Accreditations */}
                <div className="p-4 bg-gray-50/80 border border-gray-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-display block text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Accreditation</span>
                    <span className="text-xs font-bold text-gray-800">NAAC Certified</span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Certified</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Official Accreditation Badges Showcase Grid */}
      <section className="bg-transparent border-b border-gray-100 py-10 px-6 relative z-10 select-none">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Institutional Credentials
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              { 
                title: "UGC AUTONOMOUS", 
                subtitle: "Academic Autonomy",
                icon: Award, 
                color: "text-amber-500", 
                glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)] border-amber-500/20 bg-amber-500/5 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
              },
              { 
                title: "NAAC CERTIFIED", 
                subtitle: "Quality Assurance Audited",
                icon: CheckCircle2, 
                color: "text-emerald-500", 
                glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)] border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              },
              { 
                title: "AICTE APPROVED", 
                subtitle: "Technical Council Approved",
                icon: Cpu, 
                color: "text-blue-500", 
                glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)] border-blue-500/20 bg-blue-500/5 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
              },
              { 
                title: "ANNA UNIVERSITY AFFILIATED", 
                subtitle: "Affiliated University College",
                icon: GraduationCap, 
                color: "text-purple-500", 
                glow: "shadow-[0_0_15px_rgba(168,85,247,0.1)] border-purple-500/20 bg-purple-500/5 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
              }
            ].map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className={`p-5 rounded-2xl border bg-white flex flex-col items-center justify-center text-center transition-all duration-300 shadow-sm cursor-default ${badge.glow}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-3 shadow-inner ${badge.color}`}>
                    <IconComp className="w-5 h-5 filter drop-shadow-sm" />
                  </div>
                  <h4 className="text-[11px] font-black tracking-wider text-gray-900 uppercase">
                    {badge.title}
                  </h4>
                  <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest block font-mono">
                    {badge.subtitle}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* WHY JOIN APEC FEATURE GRID */}
      <section className="py-24 px-6 bg-transparent border-b border-gray-100/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">APEC Portal</span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">Why Join APEC?</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={twistReveal}
                whileHover={{ y: -6, scale: 1.02, rotateY: -3 }}
                className="feature-card p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-200 mb-6 font-bold text-xs font-mono">
                    {idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dynamic Admission Eligibility & TNEA Cutoff Predictor */}
      <section className="py-24 px-6 bg-slate-50/50 border-b border-gray-100/50 relative z-10 select-none">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
              Interactive Tools
            </span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">
              Cutoff Calculator & Course Predictor
            </h2>
            <p className="text-xs text-gray-400 mt-2 max-w-md font-semibold">
              Enter your Board Exam marks to compute your official TNEA engineering cutoff and instantly discover eligible courses at APEC.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Marks Input Panel */}
            <div className="lg:col-span-5 bg-white border border-gray-200 p-8 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Enter Subject Marks (0 - 100)</span>
                
                {/* Mathematics (Weight: 100%) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Mathematics</label>
                    <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{mathsMark} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={mathsMark} 
                    onChange={(e) => handleMarkChange('maths', e.target.value)}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Physics (Weight: 50%) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Physics</label>
                    <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{physicsMark} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={physicsMark} 
                    onChange={(e) => handleMarkChange('physics', e.target.value)}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Chemistry (Weight: 50%) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Chemistry</label>
                    <span className="text-xs font-mono font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">{chemistryMark} / 100</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={chemistryMark} 
                    onChange={(e) => handleMarkChange('chemistry', e.target.value)}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                </div>

              </div>

              {/* Calculated TNEA Cutoff Indicator */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">TNEA Formula</span>
                  <span className="text-xs text-gray-550 font-bold block mt-1">Maths + (Physics + Chemistry)/2</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5" />
                    <span className="font-mono text-base font-black text-indigo-650 leading-none">
                      {(mathsMark + (physicsMark + chemistryMark) / 2).toFixed(1)}
                    </span>
                    <span className="text-[7px] uppercase font-bold text-indigo-400 tracking-wider mt-1">Cutoff</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic predicted eligible course cards */}
            <div className="lg:col-span-7 bg-gray-50 border border-gray-200 p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 block mb-4">
                  APEC Admission Seat Estimator
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { name: "CSE (AI & ML)", cut: 165 },
                    { name: "Computer Science", cut: 160 },
                    { name: "Information Technology", cut: 155 },
                    { name: "Electronics (ECE)", cut: 145 },
                    { name: "Electrical (EEE)", cut: 135 },
                    { name: "Chemical Engg", cut: 125 },
                    { name: "Agricultural Engg", cut: 120 },
                    { name: "Mechanical Engg", cut: 110 },
                    { name: "Civil Engg", cut: 100 }
                  ].map((item, idx) => {
                    const cutoff = mathsMark + (physicsMark + chemistryMark) / 2;
                    const diff = cutoff - item.cut;
                    let badge = { text: "Premium Help", color: "text-indigo-655 bg-indigo-50 border-indigo-100" };
                    if (diff >= 0) {
                      badge = { text: "High Eligible", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
                    } else if (diff >= -10) {
                      badge = { text: "Likely Eligible", color: "text-amber-600 bg-amber-50 border-amber-100" };
                    }
                    return (
                      <div 
                        key={idx}
                        className="p-3 bg-white border border-gray-150 rounded-xl flex items-center justify-between shadow-sm hover:border-gray-300 transition-all shrink-0"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-black text-gray-900 truncate">{item.name}</h4>
                          <span className="text-[9px] font-bold text-gray-400 font-mono tracking-wider block mt-0.5">Historical cutoff: {item.cut}+</span>
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border shrink-0 ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call to action connecting to counseling help desk */}
              <div className="w-full pt-6 border-t border-gray-200 mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none text-center sm:text-left">
                  Need direct counseling assistance?
                </span>
                <button 
                  onClick={() => setShowAdModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Connect with Expert Advisor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Bento Department Visualizer */}
      <section className="py-24 px-6 bg-transparent border-b border-gray-100/55 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-left mb-16">
            <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">Curriculum Explorer</span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-gray-900">Department Showcases</h2>
            <p className="text-xs text-gray-400 mt-2 max-w-sm font-semibold">Click the department tiles below to explore their focused structural programs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* List Selection: Scrollable area for all 11 departments */}
            <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
              {depts.map((dept, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDepartment(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all shrink-0 ${
                    activeDepartment === idx 
                      ? 'bg-gray-950 border-gray-950 text-white shadow-xl' 
                      : 'bg-white border-gray-200 text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">{dept.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      activeDepartment === idx ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {dept.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Display Interactive Details Panel */}
            <div className="lg:col-span-7 bg-gray-50 border border-gray-200 p-8 rounded-3xl flex flex-col justify-between items-start text-left relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-4">Focused Curriculum Overview</span>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{depts[activeDepartment].name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-md">{depts[activeDepartment].details}</p>
              </div>

              <div className="w-full pt-8 border-t border-gray-200/60 mt-8 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Autonomous Status</span>
                <Link to="/departments" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:gap-2.5 transition-all">
                  All departments <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
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
              { name: "Arulthiru Bangaru Adigalar", role: "Founder President", desc: "Ordained the ACMEC Trust to establish medical, educational, and cultural service foundations.", img: "./bangaru_adigalar.jpg" },
              { name: "Sakthi Tmt. V. Lakshmi Bangaru Adigalar", role: "Chairperson", desc: "Guiding the institution towards global academic and professional leadership.", img: "./lakshmi_adigalar.jpg" },
              { name: "Sakthi Thiru. Dr. G. B. Senthil Kumar", role: "Correspondent", desc: "Directing administrative functions and infrastructure expansions for students.", img: "./senthil_kumar.jpg" }
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

            {/* Custom Embedded CSS animations for premium visual effects */}
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
              @keyframes blob-float-one {
                0%, 100% { transform: translate(0px, 0px) scale(1); }
                50% { transform: translate(15px, -15px) scale(1.08); }
              }
              @keyframes blob-float-two {
                0%, 100% { transform: translate(0px, 0px) scale(1); }
                50% { transform: translate(-15px, 15px) scale(0.92); }
              }
              .animate-float-blob-1 {
                animation: blob-float-one 8s ease-in-out infinite;
              }
              .animate-float-blob-2 {
                animation: blob-float-two 12s ease-in-out infinite alternate;
              }
              @keyframes particle-fly {
                0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
                80% { opacity: 0.9; }
                100% { transform: translate(var(--x), var(--y)) scale(0) rotate(360deg); opacity: 0; }
              }
              .success-particle {
                animation: particle-fly 1.5s cubic-bezier(0.12, 0.85, 0.28, 1) forwards;
              }
            `}} />

            {/* Always Static/Floating Close Button for superior mobile/scroll UX */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[110]">
              <button
                onClick={() => setShowAdModal(false)}
                className="p-2.5 bg-black/45 hover:bg-rose-600 text-white backdrop-blur-md rounded-full shadow-lg border border-white/10 transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer flex items-center justify-center"
                aria-label="Close Ad"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Academic Border Container */}
            <motion.div
              initial={{ scale: 0.95, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-[28px] shadow-2xl z-10 mx-auto max-h-[90vh] md:max-h-none flex flex-col overflow-hidden"
            >
              {/* Inner Card Container: Responsive Scrollable Body */}
              <div
                className="w-full bg-white rounded-[26px] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row h-auto md:h-[580px]"
              >
                {/* Left Column: Academic Branding & Accreditations (Full-bleed library background gallery) */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between relative text-left text-white shrink-0 min-h-[350px] md:min-h-0 overflow-hidden">
                  
                  {/* Full-bleed moving images background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={activeModalImage}
                        src={modalImages[activeModalImage]}
                        alt="APEC Central Library" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </AnimatePresence>
                    {/* Deep gradient overlay on the image slider inside the column */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60 z-10" />
                  </div>

                  {/* Foreground Content (Branding, Letters, centered and enlarged 2x) */}
                  <div className="relative z-20 flex flex-col justify-center h-full space-y-12 text-center py-6">
                    
                    {/* Centered Large Logo & Title */}
                    <div className="flex flex-col items-center">
                      <img 
                        src="./apec-logo.png" 
                        alt="APEC Logo" 
                        className="w-28 h-28 object-contain bg-white rounded-full p-2.5 shadow-2xl border border-white/20 mb-6" 
                      />
                      <div className="text-center">
                        <span className="font-title text-2xl md:text-3xl font-black text-white block leading-tight tracking-wide drop-shadow-md">
                          Adhiparasakthi
                        </span>
                        <span className="font-title text-2xl md:text-3xl font-black text-white block leading-tight mt-1.5 tracking-wide drop-shadow-md">
                          Engineering College
                        </span>
                        <span className="font-mono text-xl md:text-2xl uppercase font-black text-white tracking-widest block mt-5 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                          An Autonomous Institution
                        </span>
                      </div>
                    </div>

                    {/* Centered Motto: Glowing Neon Interactive Badges (Sized 2x down) */}
                    <div className="flex flex-col sm:flex-row gap-2 items-center justify-center max-w-lg mx-auto w-full">
                      {[
                        { 
                          text: "Study", 
                          icon: BookOpen, 
                          color: "text-blue-400", 
                          glow: "shadow-[0_0_10px_rgba(96,165,250,0.4)] border-blue-400/25 bg-blue-500/10 hover:border-blue-400" 
                        },
                        { 
                          text: "Spirituality", 
                          icon: Sparkles, 
                          color: "text-purple-400", 
                          glow: "shadow-[0_0_10px_rgba(192,132,252,0.4)] border-purple-400/25 bg-purple-500/10 hover:border-purple-400" 
                        },
                        { 
                          text: "Service", 
                          icon: HeartHandshake, 
                          color: "text-pink-400", 
                          glow: "shadow-[0_0_10px_rgba(244,114,182,0.4)] border-pink-400/25 bg-pink-500/10 hover:border-pink-400" 
                        }
                      ].map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer select-none shrink-0 ${item.glow}`}
                          >
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 0.95, 1] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                              className={item.color}
                            >
                              <IconComponent className="w-3 h-3 filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
                            </motion.div>
                            <span className="font-serif italic text-[9px] md:text-[10px] font-black text-white tracking-widest uppercase">
                              {item.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col items-center">
                      <h3 className="font-sans text-xl md:text-2xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                        ENGINEERING THE FUTURE
                      </h3>
                      <p className="text-[10px] md:text-xs text-gray-250 font-bold mt-2">
                        Affiliated to Anna University • Approved by AICTE
                      </p>
                    </div>

                    {/* Dots indicator inside the image gallery */}
                    <div className="flex gap-1.5 justify-center mt-2">
                      {modalImages.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeModalImage === i ? 'bg-white scale-125' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>

                  </div>

                </div>

                {/* Right Column: Admission Inquiry Form (100% responsive spacing) */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center relative bg-white text-left">
                  <AnimatePresence mode="wait">
                    {!formSubmitted ? (
                      <motion.div
                        key="form-container"
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -25 }}
                        transition={{ duration: 0.35 }}
                        className="w-full"
                      >
                        <span className="font-sans inline-block text-[9px] font-extrabold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase mb-2.5">
                          Admission for 2026-27
                        </span>
                        <h4 className="font-sans text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tight">
                          Admissions Inquiry Form
                        </h4>
                        <p className="text-[11px] text-gray-400 font-semibold mb-4 leading-relaxed">
                          Submit your inquiry to register for direct counseling assistance and scholarship eligibility checks.
                        </p>

                        <form onSubmit={handleFormSubmit} className="space-y-2.5">
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
                                className={`w-full text-xs pl-9 pr-4 py-2 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                  formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                                }`}
                              />
                            </div>
                            {formErrors.name && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.name}</p>}
                          </div>

                          {/* Email & Phone grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Email */}
                            <div>
                              <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Email Address</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                  <Mail className="w-4 h-4" />
                                </span>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="name@email.com"
                                  className={`w-full text-xs pl-9 pr-4 py-2 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                    formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                                  }`}
                                />
                              </div>
                              {formErrors.email && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.email}</p>}
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
                                  className={`w-full text-xs pl-9 pr-4 py-2 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                    formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                                  }`}
                                />
                              </div>
                              {formErrors.phone && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.phone}</p>}
                            </div>
                          </div>

                          {/* Preferred Department */}
                          <div>
                            <label className="block text-[9px] uppercase font-black text-gray-450 tracking-wider mb-1">Preferred Department</label>
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
                                <option value="IT">Information Technology (B.Tech.)</option>
                                <option value="ECE">Electronics & Communication Engineering (B.E.)</option>
                                <option value="EEE">Electrical & Electronics Engineering (B.E.)</option>
                                <option value="CHEM">Chemical Engineering (B.Tech.)</option>
                                <option value="AGRI">Agricultural Engineering (B.Tech.)</option>
                                <option value="MECH">Mechanical Engineering (B.E.)</option>
                                <option value="CIVIL">Civil Engineering (B.E.)</option>
                                <option value="MCA">Master of Computer Applications (MCA)</option>
                                <option value="MBA">Master of Business Administration (MBA)</option>
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
                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-1 animate-gradient-border"
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
                        <p className="font-sans text-[10px] text-indigo-600 font-extrabold mb-4 uppercase tracking-wider">
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
                              <span className="text-gray-450 font-semibold text-[9px]">Admissions Cell</span>
                              <span className="font-bold text-gray-800 font-mono">
                                <a href="tel:+917418064336" className="hover:text-indigo-600 hover:underline">7418064336</a> / <a href="tel:+917418065336" className="hover:text-indigo-600 hover:underline">7418065336</a>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-450 font-semibold text-[9px]">Principal Office</span>
                              <span className="font-bold text-gray-800 font-mono">
                                <a href="tel:+919894657971" className="hover:text-indigo-600 hover:underline">9894657971</a>
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-450 font-semibold text-[9px]">Office Email</span>
                              <span className="font-bold text-gray-800 font-mono">
                                <a href="mailto:principal@apec.edu.in" className="hover:text-indigo-600 hover:underline">principal@apec.edu.in</a>
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6 font-semibold">
                          Our admissions team will reach out to <span className="font-bold text-gray-700">{formData.email}</span> shortly with direct counseling assistance.
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
