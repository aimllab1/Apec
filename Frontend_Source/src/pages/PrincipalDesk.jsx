import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Download, Award, BookOpen, 
  MessageSquare, Building
} from 'lucide-react';
import principalImg from '../principal.webp';

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
      staggerChildren: 0.1
    }
  }
};

export default function PrincipalDesk() {
  const handleDownloadCV = () => {
    window.open('https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/1900c68d-255a-455f-a68d-4b7e199bbf4e/Profile_(2).pdf', '_blank');
  };

  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Page title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            Institutional Leadership
          </span>
          <h1 className="font-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2.5">
            Principal's Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-4xl font-semibold">
            Welcome to the Office of the Principal. Explore the academic vision, leadership credentials, and official message from the Principal.
          </p>
        </motion.div>

        {/* 1. PRINCIPAL DETAILS SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start mb-8 sm:mb-10">
          
          {/* Left: Image Card & Contact details */}
          <div className="w-full lg:w-4/12 flex flex-col items-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                <img 
                  src={principalImg} 
                  alt="Dr. J. Raja, Principal" 
                  className="w-full h-[360px] sm:h-[380px] lg:h-[400px] object-cover object-[center_15%] rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-0.5">
                    Dr. J. Raja, Ph.D.
                  </h4>
                  <span className="font-display text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-widest block drop-shadow">
                    PRINCIPAL & PROFESSOR
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Contacts Card */}
            <div className="w-full max-w-xs sm:max-w-sm mt-3.5 p-3.5 sm:p-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl text-left space-y-3 shadow-2xs">
              <div className="flex gap-2.5 items-start">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-0.5">Official Email</span>
                  <a href="mailto:principal@apec.ac.in" className="text-xs font-bold text-slate-900 hover:text-indigo-600 break-all">principal@apec.ac.in</a>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <Building className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 block mb-0.5">Office Location</span>
                  <span className="text-xs font-bold text-slate-900 block leading-snug">Principal's Office, Main Block, APEC Campus</span>
                </div>
              </div>
              <button 
                onClick={handleDownloadCV}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                Download Academic CV
              </button>
            </div>
          </div>

          {/* Right: Academic Bio & Vision Statement */}
          <div className="w-full lg:w-8/12">
            <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
              Principal Profile
            </span>
            <h2 className="font-title text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 leading-tight">
              Dr. J. Raja, Ph.D.
            </h2>
            <span className="font-display text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Principal & Academic Chair, APEC (Autonomous)
            </span>
            
            <div className="space-y-3 text-sm sm:text-base text-slate-650 font-normal leading-relaxed mb-5">
              <p>
                Dr. J. Raja is a distinguished academic leader, research guide, and the Principal of Adhiparasakthi Engineering College, Melmaruvathur. Under his executive direction, APEC has implemented major innovations under its autonomous curriculum status, establishing research collaborations and digital training portals.
              </p>
              <p>
                Dr. Raja holds a Doctorate in Engineering and has dedicated decades to teaching, mentoring, and advancing engineering policy frameworks. He works in close coordination with the Trust and University nodes to drive top placements and quality control.
              </p>
            </div>

            {/* Responsibilities and Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" /> Key Responsibilities
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-650 font-medium leading-relaxed list-none text-left">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                    <span>Academic & general administrative leadership of the autonomous college.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                    <span>Overseeing Anna University and AICTE compliance audits.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                    <span>Directing quality assurance operations and industry MoUs.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-700" /> Research Interests
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-650 font-medium leading-relaxed list-none text-left">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
                    <span>Structural Engineering & Sustainability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
                    <span>Sustainable Concrete Technology & Infrastructure.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
                    <span>Outcome-Based Engineering Education Policies.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THE PRINCIPAL'S MESSAGE (Redesigned & Value-Centric) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-indigo-50/50 border border-indigo-150 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 mb-6 sm:mb-8 text-left relative overflow-hidden shadow-xs"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <span className="font-display text-[10px] uppercase tracking-widest font-extrabold text-indigo-700 flex items-center gap-1.5 mb-2 select-none">
            <MessageSquare className="w-3.5 h-3.5" /> Message from the Principal
          </span>
          
          <h3 className="font-title text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">
            "Values-Driven Engineering for a Sustainable Future"
          </h3>
          
          <div className="space-y-2.5 text-sm sm:text-base text-slate-700 font-medium leading-relaxed italic font-serif">
            <p>
              "Dear Students, Parents, and Stakeholders,
            </p>
            <p>
              At Adhiparasakthi Engineering College, our educational vision goes beyond the boundaries of traditional textbooks. Over the past 42 years, we have strived to build an ecosystem where technical competencies, industrial research, and spiritual human ethics converge.
            </p>
            <p>
              Our autonomous status gives us the unique flexibility to design student-centric curricula, integrate emerging fields like AI, Machine Learning, and Green Technologies, and secure top placement records. We welcome you to join our family and experience a transformation that trains you to serve society with technological innovations and moral integrity."
            </p>
          </div>
          
          <div className="mt-5 pt-4 border-t border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="font-serif text-sm sm:text-base font-bold text-slate-900 block">Dr. J. Raja, Ph.D.</span>
              <span className="font-display text-[10px] sm:text-[11px] text-indigo-700 font-bold uppercase tracking-wider block mt-0.5">Principal, APEC Melmaruvathur</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wider bg-white border border-indigo-200 px-3 py-1 rounded-md shadow-2xs">
                Counseling Code: 1401
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
