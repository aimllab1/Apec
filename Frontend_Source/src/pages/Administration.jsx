import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mail, MapPin, ArrowRight, GraduationCap, 
  Building2, Users, FileText, ChevronRight, User,
  X, ExternalLink, CheckCircle2, Clock, Briefcase
} from 'lucide-react';
import principalImg from '../principal.webp';
import vpImg from '../Vice principal.jpg';
import deanImg from '../Dean.webp';
import aoImg from '../administrative officer.jpg';
import FacultyOrcidQr from '../components/FacultyOrcidQr';

// Motion animation variables for clean, staggered fades
const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
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

// Department HODs Data
const departmentHods = [
  {
    deptKey: 'civil',
    deptName: 'Civil Engineering',
    code: 'CIVIL',
    name: 'Dr. P. Somiyadevi',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'somiya86@gmail.com',
    experience: '17+ Years',
    image: '/Images/Faculty/Civil/sowmayadevi.jpg'
  },
  {
    deptKey: 'mech',
    deptName: 'Mechanical Engineering',
    code: 'MECH',
    name: 'Dr. C. K. Dhinakarraj',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'ckd@apec.edu.in',
    experience: '30+ Years',
    image: '/Images/Faculty/mech/dhinakaraj.jpg'
  },
  {
    deptKey: 'eee',
    deptName: 'Electrical & Electronics Engineering',
    code: 'EEE',
    name: 'Dr. P. Rajivgandhi',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'rajivgandhi@apec.edu.in',
    experience: '12+ Years',
    image: '/Images/Faculty/eee/rajivgandhi.jpg'
  },
  {
    deptKey: 'ece',
    deptName: 'Electronics & Communication Engineering',
    code: 'ECE',
    name: 'Dr. M. Malathi',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'ecemalathi@gmail.com',
    experience: '31+ Years',
    image: '/Images/Faculty/ece/malathi.jpg'
  },
  {
    deptKey: 'cse',
    deptName: 'Computer Science & Engineering',
    code: 'CSE',
    name: 'Dr. C. Dhaya',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'dhaya@apec.edu.in',
    experience: '25+ Years',
    image: '/Images/Faculty/cse/dhaya.jpg'
  },
  {
    deptKey: 'it',
    deptName: 'Information Technology',
    code: 'IT',
    name: 'Dr. A. Bhuvaneswari',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'bhuvaneswari@apec.edu.in',
    experience: '25+ Years',
    image: '/Images/Faculty/it/bhuvaneshwari.jpg'
  },
  {
    deptKey: 'chemical',
    deptName: 'Chemical Engineering',
    code: 'CHEM',
    name: 'Dr. B. Ganesh',
    qualification: 'M.Tech., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'ganeshevst@gmail.com',
    experience: '10+ Years',
    image: '/Images/Faculty/chemical/ganesh.jpg'
  },
  {
    deptKey: 'aiml',
    deptName: 'Computer Science & Engineering (AI & ML)',
    code: 'CSE (AIML)',
    name: 'Dr. N. Elamathi',
    qualification: 'M.E., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'elamathi@apec.edu.in',
    experience: '19+ Years',
    image: '/Images/Faculty/aiml/elamathi.jpg',
    orcid: '0009-0004-5988-5664'
  },
  {
    deptKey: 'sh',
    deptName: 'Science & Humanities',
    code: 'S & H',
    name: 'Dr. Sakthi Raadha. S',
    qualification: 'M.Sc., M.Phil., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'sakthiraadhas@gmail.com',
    experience: '21+ Years',
    image: '/Images/Faculty/s & h/sakthi radha.jpg'
  },
  {
    deptKey: 'mba',
    deptName: 'Management Studies (MBA)',
    code: 'MBA',
    name: 'Dr. M. Saviour',
    qualification: 'Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'saviour@apec.edu.in',
    experience: '28+ Years',
    image: '/Images/Faculty/MBA/saviour.jpg'
  },
  {
    deptKey: 'mca',
    deptName: 'Master of Computer Applications (MCA)',
    code: 'MCA',
    name: 'Dr. S. Selvaraj',
    qualification: 'MCA., Ph.D.',
    designation: 'Head of Department & Professor',
    email: 'mca@apec.edu.in',
    experience: '20+ Years',
    image: '/Images/Faculty/MCA/selva raj.jpg'
  }
];

export default function Administration() {
  const [selectedHod, setSelectedHod] = useState(null);

  // Prevent background scrolling when modal is open and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedHod(null);
    };
    if (selectedHod) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedHod]);

  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Breadcrumb & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 text-left"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
            <Link to="/" className="hover:text-indigo-650">Home</Link>
            <span>/</span>
            <Link to="/about/profile" className="hover:text-indigo-650">About</Link>
            <span>/</span>
            <span className="text-gray-800">Administration</span>
          </div>

          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            Institutional Leadership
          </span>
          <h1 className="font-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2.5">
            Institutional Administration
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-4xl font-semibold">
            Apex academic and administrative leaders steering autonomous policies, curriculum excellence, student mentorship, accreditations, and modern campus infrastructure.
          </p>
        </motion.div>

        {/* 1. PRINCIPAL: Dr. J. Raja */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          {/* Top: Description & Portrait Frame */}
          <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left: Short & Factual Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Office of the Principal
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-1 leading-tight">
                Dr. J. Raja, Ph.D.
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm font-bold text-indigo-700 font-display">
                <span>Principal & Professor</span>
                <span>•</span>
                <span className="text-slate-500 font-mono text-[11px] sm:text-xs">M.E., Ph.D.</span>
                <span>•</span>
                <span className="text-slate-500 text-[11px] sm:text-xs">31+ Years Experience</span>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  Dr. J. Raja is the Principal of Adhiparasakthi Engineering College. With over 31 years of academic, administrative, and research experience, he oversees institutional governance, Anna University autonomous regulations, and NAAC/NBA quality accreditations.
                </p>
                <p>
                  He is an approved doctoral research supervisor under Anna University in VLSI Design and Communication Systems, guiding Ph.D. scholars and leading sponsored research projects funded by AICTE and government agencies.
                </p>
              </div>
            </div>

            {/* Right: Portrait Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={principalImg} 
                    alt="Dr. J. Raja, Ph.D. - Principal" 
                    className="w-full h-[360px] sm:h-[380px] lg:h-[400px] object-cover object-[center_15%] rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <span className="font-display text-[9px] uppercase font-black text-amber-400 tracking-widest block drop-shadow mb-0.5">
                      OFFICE OF THE PRINCIPAL
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-0.5">
                      Dr. J. Raja, Ph.D.
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-slate-300 uppercase tracking-widest block drop-shadow">
                      PRINCIPAL & PROFESSOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Full-Width Contact & Actions Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <a 
                href="mailto:principal@apec.edu.in" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-indigo-50 hover:text-indigo-650 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>principal@apec.edu.in</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Main Admin Block, Campus</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/1900c68d-255a-455f-a68d-4b7e199bbf4e/Profile_(2).pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Curriculum Vitae</span>
              </a>
              <Link 
                to="/about/principal" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Principal Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link 
                to="/administration/principal" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2. DEAN: Dr. V. Ramasamy */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          {/* Top: Description & Portrait Frame */}
          <div className="flex flex-col-reverse lg:flex-row-reverse gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Right/Text: Short & Factual Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Dean — Academic Affairs
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-1 leading-tight">
                Dr. V. Ramasamy, Ph.D.
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm font-bold text-indigo-700 font-display">
                <span>Dean (Academic Affairs) & Professor</span>
                <span>•</span>
                <span className="text-slate-500 font-mono text-[11px] sm:text-xs">M.E., Ph.D.</span>
                <span>•</span>
                <span className="text-slate-500 text-[11px] sm:text-xs">32+ Years Experience (Since 1994)</span>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  Dr. V. Ramasamy serves as the Dean of Academic Affairs and Professor of Civil Engineering. Associated with APEC for over 32 years since 1994, he directs Autonomous curriculum regulations, Choice Based Credit System (CBCS) implementation, and smart campus academic infrastructure.
                </p>
                <p>
                  An active structural engineering researcher, he has published over 30+ peer-reviewed journal articles and leads academic progression audits across all engineering departments.
                </p>
              </div>
            </div>

            {/* Left/Image: Portrait Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={deanImg} 
                    alt="Dr. V. Ramasamy - Dean" 
                    className="w-full h-[360px] sm:h-[380px] lg:h-[400px] object-cover object-[center_12%] rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <span className="font-display text-[9px] uppercase font-black text-amber-400 tracking-widest block drop-shadow mb-0.5">
                      DEAN'S OFFICE — ACADEMIC AFFAIRS
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-0.5">
                      Dr. V. Ramasamy
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-slate-300 uppercase tracking-widest block drop-shadow">
                      DEAN & PROFESSOR (CIVIL)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Full-Width Contact & Actions Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <a 
                href="mailto:dean@apec.ac.in" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-indigo-50 hover:text-indigo-650 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>dean@apec.ac.in</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Dean's Office, Admin Block</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/4c98a694-544d-4c49-bde8-cbb8333b9049/Profile.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Curriculum Vitae</span>
              </a>
              <Link 
                to="/administration/dean" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 3. VICE PRINCIPAL: Dr. A. Bhuvaneshwari */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          {/* Top: Description & Portrait Frame */}
          <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left: Short & Factual Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Office of the Vice Principal
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-1 leading-tight">
                Dr. A. Bhuvaneshwari, M.E., Ph.D.
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm font-bold text-indigo-700 font-display">
                <span>Vice Principal & Professor</span>
                <span>•</span>
                <span className="text-slate-500 font-mono text-[11px] sm:text-xs">M.E., Ph.D.</span>
                <span>•</span>
                <span className="text-slate-500 text-[11px] sm:text-xs">25+ Years Experience</span>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  Dr. A. Bhuvaneshwari is the Vice Principal and Professor of Information Technology & Computer Science. With 25+ years of experience, she coordinates academic operations, student welfare, internal quality assurance, and faculty development programs.
                </p>
                <p>
                  She has authored academic textbooks on Computer Architecture and Programming and coordinates inter-departmental synergies to promote a student-first, inclusive learning environment.
                </p>
              </div>
            </div>

            {/* Right: Portrait Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-pink-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={vpImg} 
                    alt="Dr. A. Bhuvaneshwari - Vice Principal" 
                    className="w-full h-[360px] sm:h-[380px] lg:h-[400px] object-cover object-[center_12%] rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <span className="font-display text-[9px] uppercase font-black text-amber-400 tracking-widest block drop-shadow mb-0.5">
                      OFFICE OF THE VICE PRINCIPAL
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-0.5">
                      Dr. A. Bhuvaneshwari
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-slate-300 uppercase tracking-widest block drop-shadow">
                      VICE PRINCIPAL & PROFESSOR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Full-Width Contact & Actions Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <a 
                href="mailto:viceprincipal@apec.ac.in" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-indigo-50 hover:text-indigo-650 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>viceprincipal@apec.ac.in</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Vice Principal's Office, Main Block</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Link 
                to="/administration/vice-principal" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 4. ADMINISTRATIVE OFFICER: Mr. M. Sadanandan */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          {/* Top: Description & Portrait Frame */}
          <div className="flex flex-col-reverse lg:flex-row-reverse gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Right/Text: Short & Factual Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                General Administration
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-1 leading-tight">
                Mr. M. Sadanandan, MBA
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm font-bold text-indigo-700 font-display">
                <span>Administrative Officer (AO)</span>
                <span>•</span>
                <span className="text-slate-500 font-mono text-[11px] sm:text-xs">MBA</span>
                <span>•</span>
                <span className="text-slate-500 text-[11px] sm:text-xs">General Administration</span>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  Mr. M. Sadanandan serves as the Administrative Officer, managing the college's operational administration, campus infrastructure, logistical coordination, and procurement frameworks.
                </p>
                <p>
                  He oversees campus facilities, transportation, hostel amenities, and regulatory documentation to ensure seamless day-to-day operations across the institution.
                </p>
              </div>
            </div>

            {/* Left/Image: Portrait Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={aoImg} 
                    alt="Mr. M. Sadanandan - Administrative Officer" 
                    className="w-full h-[360px] sm:h-[380px] lg:h-[400px] object-cover object-[center_15%] rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <span className="font-display text-[9px] uppercase font-black text-amber-400 tracking-widest block drop-shadow mb-0.5">
                      GENERAL ADMINISTRATION
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-0.5">
                      Mr. M. Sadanandan
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-slate-300 uppercase tracking-widest block drop-shadow">
                      ADMINISTRATIVE OFFICER (AO)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Full-Width Contact & Actions Bar */}
          <div className="w-full mt-4 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <a 
                href="mailto:admin@apec.ac.in" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-indigo-50 hover:text-indigo-650 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>admin@apec.ac.in</span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Block, Campus</span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Link 
                to="/administration/administrative-officer" 
                className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 5. HEADS OF DEPARTMENTS (HODs) SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10 text-left"
        >
          <div className="mb-6 sm:mb-8">
            <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
              Academic Department Leadership
            </span>
            <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Heads of Departments (HODs)
            </h2>
            <p className="text-sm sm:text-base text-slate-650 font-semibold max-w-4xl leading-relaxed">
              Distinguished academic leaders steering specialized engineering disciplines, research laboratories, curriculum delivery, and student career outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {departmentHods.map((hod) => (
              <motion.div
                key={hod.deptKey}
                variants={fadeInUp}
                onClick={() => setSelectedHod(hod)}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-400/60 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                <div className="p-3.5 sm:p-4">
                  {/* Portrait & Dept Tag */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-20 h-26 sm:w-22 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 shrink-0 shadow-2xs relative">
                      {hod.image ? (
                        <img 
                          src={hod.image} 
                          alt={hod.name} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center grow text-left min-w-0">
                      <span className="font-display text-[9px] uppercase font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-full inline-block w-fit mb-1">
                        {hod.code}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors truncate">
                        {hod.name}
                      </h3>
                      <p className="font-mono text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                        {hod.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Department & Role Info */}
                  <div className="pt-2.5 border-t border-slate-100 text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mb-1">
                      {hod.deptName}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                      <span className="truncate pr-1">{hod.designation}</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">{hod.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Email & View Profile Button */}
                <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a 
                    href={`mailto:${hod.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-700 transition-colors truncate max-w-[170px]"
                    title={hod.email}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{hod.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedHod(hod); }}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#FF8A00] hover:text-orange-700 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* HOD PROFILE POP-UP MODAL */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedHod && (
              <div 
                className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
                onClick={() => setSelectedHod(null)}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl sm:max-w-2xl w-full relative overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
                >
                  {/* TOP NAVY BLUE COLOR HEADER TAG */}
                  <div className="bg-[#041744] px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-white border-b-2 border-[#FF8A00] shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse shrink-0" />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-white font-title">
                        HOD Leadership Profile
                      </span>
                      <span className="ml-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FF8A00] text-white uppercase tracking-wider">
                        HOD
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedHod(null)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Close Profile"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* MODAL BODY (BIG PHOTO ON LEFT, BALANCED TEXT MATCHING PHOTO HEIGHT ON RIGHT) */}
                  <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-white">
                    
                    {/* MAIN SIDE-BY-SIDE CONTENT BLOCK */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5">
                      
                      {/* LEFT: BIG SIZE HOD PHOTO */}
                      <div className="w-36 h-48 sm:w-44 sm:h-56 mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#041744]/15 shrink-0 relative shadow-md">
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          <User className="w-14 h-14 text-slate-400" />
                        </div>
                        {selectedHod.image && (
                          <img 
                            src={selectedHod.image} 
                            alt={selectedHod.name} 
                            className="absolute inset-0 w-full h-full object-cover object-top z-10"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>

                      {/* RIGHT: NAME, DEPT, DESIGNATION & CREDENTIALS BALANCED TO IMAGE SIZE */}
                      <div className="min-w-0 flex-1 flex flex-col justify-between text-left py-0.5">
                        
                        {/* TOP SECTION: NAME, ROLE, DESIGNATION, DEPARTMENT */}
                        <div>
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <h2 className="text-lg sm:text-xl font-black text-[#041744] font-title leading-tight">
                              {selectedHod.name}
                            </h2>
                            <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-[#FF8A00] text-white uppercase tracking-wider shrink-0">
                              HOD
                            </span>
                          </div>

                          {/* Designation */}
                          <p className="text-xs sm:text-sm font-extrabold text-[#FF8A00] leading-snug mb-2">
                            {selectedHod.designation}
                          </p>

                          {/* Department */}
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 max-w-full">
                            <Building2 className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                            <span className="truncate">{selectedHod.deptName}</span>
                          </div>
                        </div>

                        {/* BOTTOM SECTION: QUALIFICATION, EXPERIENCE, EMAIL (Fills height evenly) */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedHod.qualification}
                              </span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedHod.experience}
                              </span>
                            </div>
                          </div>

                          {selectedHod.email && (
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <div className="min-w-0 overflow-hidden text-xs">
                                <a 
                                  href={`mailto:${selectedHod.email}`} 
                                  className="font-bold text-[#041744] hover:text-[#FF8A00] hover:underline truncate block"
                                >
                                  {selectedHod.email}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* ORCID iD & DYNAMIC QR CODE CONTAINER */}
                    <FacultyOrcidQr 
                      facultyName={selectedHod.name} 
                      defaultOrcid={selectedHod.orcid} 
                    />

                    {/* COMPACT FOOTER */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/departments/${selectedHod.deptKey}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:underline transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Visit Department Page &rarr;</span>
                      </Link>
                      <button 
                        onClick={() => setSelectedHod(null)}
                        className="px-4 py-1.5 bg-[#041744] hover:bg-[#06236b] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Close Profile
                      </button>
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Administrative Contact Banner */}
        <div className="bg-gradient-to-r from-[#041744] to-[#0A2A7A] rounded-2xl p-4 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg text-left">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#E5B54F] block mb-1">Institutional Administration</span>
            <h3 className="text-lg sm:text-xl font-bold">Office of the Principal & General Administration</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Adhiparasakthi Engineering College, Melmaruvathur, Tamil Nadu — 603319
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a 
              href="mailto:principal@apec.edu.in" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/15"
            >
              <Mail className="w-3.5 h-3.5 text-[#E5B54F]" />
              <span>principal@apec.edu.in</span>
            </a>
            <Link 
              to="/about/principal" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4A347] hover:bg-[#c49235] text-[#041744] text-xs font-black transition-all shadow-md"
            >
              <span>Principal Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}