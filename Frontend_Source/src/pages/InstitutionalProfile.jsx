import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Telescope, Rocket, Shield, Award, 
  ArrowRight, BookOpen, Scale, FileText, 
  CheckCircle2, Users, HelpCircle, Activity 
} from 'lucide-react';
import ugcLogo from '../assets/ugcLogo.js';

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

export default function InstitutionalProfile() {
  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 w-full">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Intro Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="about-intro mb-6 sm:mb-8 w-full"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            42-Year Academic Legacy
          </span>
          <h1 className="font-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2.5">
            Institutional Profile
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-4xl font-semibold">
            Adhiparasakthi Engineering College (APEC), Melmaruvathur, established in 1984, is a premier autonomous institution. Founded on the values of academic quality, research excellence, and spiritual grounding, APEC is committed to nurturing socially responsible engineers. Affiliated with Anna University and approved by AICTE, the institution has consistently maintained a reputation for progressive educational curriculum.
          </p>
        </motion.div>

        {/* Vision & Mission Cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Vision */}
          <motion.div 
            variants={fadeInUp}
            className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mb-3.5">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-md">
                  <Telescope className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Vision Statement</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-650 font-medium leading-relaxed text-left list-none">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                  <span>Creating high-quality engineers possessing a deep sense of service and spirituality.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                  <span>Advancing societal growth through the adoption of sustainable and appropriate technologies.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                  <span>Fostering continuous academic excellence, innovation, and global professional standards.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            variants={fadeInUp}
            className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl hover:border-pink-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center mb-3.5">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500/90 to-rose-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-md">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Mission Objectives</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-650 font-medium leading-relaxed text-left list-none">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2 shrink-0" />
                  <span>Imparting high-quality education with emphasis on contemporary technologies to achieve growth across society.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2 shrink-0" />
                  <span>Cultivating empathy, discipline, and core professional ethics.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2 shrink-0" />
                  <span>Creating a holistic, value-centric, and spiritual campus environment.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Credentials Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-6 sm:mb-8"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            Recognition & Accreditation
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Institutional Standing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Anna University */}
            <motion.div 
              variants={fadeInUp}
              className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-full h-20 sm:h-24 mb-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/Images/Logos/university_logo-rem.png" 
                  alt="Anna University Logo" 
                  className="h-16 sm:h-20 w-auto max-w-full object-contain filter drop-shadow-sm" 
                />
              </div>
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2 inline-block">
                Affiliation
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 leading-snug">
                Anna University
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
                Permanently affiliated and registered under Anna University frameworks.
              </p>
            </motion.div>

            {/* Card 2: UGC Autonomous */}
            <motion.div 
              variants={fadeInUp}
              className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-full h-20 sm:h-24 mb-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={ugcLogo} 
                  alt="UGC 2(f) & 12(B) Status Logo" 
                  className="h-16 sm:h-20 w-auto max-w-full object-contain filter drop-shadow-sm" 
                />
              </div>
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2 inline-block">
                UGC Autonomous
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 leading-snug">
                10-Year Status
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
                Granted autonomous status by the UGC to design industry-centric curriculum pathways.
              </p>
            </motion.div>

            {/* Card 3: NAAC Accredited */}
            <motion.div 
              variants={fadeInUp}
              className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-full h-20 sm:h-24 mb-3 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/Images/Logos/Naac.png" 
                  alt="NAAC Accredited Logo" 
                  className="h-16 sm:h-20 w-auto max-w-full object-contain filter drop-shadow-sm" 
                />
              </div>
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2 inline-block">
                Quality Mark
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 leading-snug">
                NAAC Accredited
              </h3>
              <p className="text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
                Accredited with an 'A' grade for top-tier academic standards and infrastructure.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* INTEGRATION HUB: Committees, RTI, IQAC, Disclosures */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-6 sm:mb-8"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            Governance & Compliance Integrations
          </span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
            Institutional Governance Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-650 font-semibold leading-relaxed max-w-4xl mb-6">
            Explore our governance nodes, quality control cells, welfare committees, statutory disclosures, and transparency portals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            
            {/* IQAC Integration */}
            <motion.div 
              variants={fadeInUp}
              className="relative p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-white transition-all duration-300 shadow-xs flex gap-3.5 sm:gap-4 group cursor-pointer"
            >
              <Link to="/iqac" className="absolute inset-0 z-10 rounded-2xl" aria-label="Internal Quality Assurance Cell (IQAC)" />
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform pointer-events-none">
                <Award className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  Internal Quality Assurance Cell (IQAC)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-3">
                  Drives quality audits, academic parameters, and NAAC accreditation documentation.
                </p>
                <div className="relative z-20 flex flex-wrap gap-3">
                  <Link to="/iqac" className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-700">
                    IQAC Info <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to="/iqac-members" className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-700">
                    Members <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to="/iqac-mom-at" className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 hover:text-indigo-700">
                    Meetings <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Committees Integration */}
            <motion.div 
              variants={fadeInUp}
              className="relative p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-pink-500 hover:bg-white transition-all duration-300 shadow-xs flex gap-3.5 sm:gap-4 group cursor-pointer"
            >
              <Link to="/committees" className="absolute inset-0 z-10 rounded-2xl" aria-label="Institutional Committees & Cells" />
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-105 transition-transform pointer-events-none">
                <Users className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 group-hover:text-pink-600 transition-colors">
                  Institutional Committees & Cells
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-2.5">
                  Ensures student welfare, anti-ragging protection, industry tie-ups, and career development support.
                </p>
                <div className="relative z-20 flex flex-wrap gap-x-4 gap-y-1.5">
                  <Link to="/committees/anti-ragging" className="inline-flex items-center gap-1 text-xs font-black text-pink-600 hover:text-pink-700">
                    Anti-Ragging
                  </Link>
                  <Link to="/committees/iiic" className="inline-flex items-center gap-1 text-xs font-black text-pink-600 hover:text-pink-700">
                    IIIC
                  </Link>
                  <Link to="/committees" className="inline-flex items-center gap-1 text-xs font-black text-pink-600 hover:text-pink-700">
                    All Committees <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* RTI Integration */}
            <motion.div 
              variants={fadeInUp}
              className="relative p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-white transition-all duration-300 shadow-xs flex gap-3.5 sm:gap-4 group cursor-pointer"
            >
              <Link to="/rti" className="absolute inset-0 z-10 rounded-2xl" aria-label="Right to Information (RTI)" />
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform pointer-events-none">
                <Scale className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  Right to Information (RTI)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-2.5">
                  Access statutory disclosures, guidelines, and guidebook publications under the RTI Act.
                </p>
                <div className="relative z-20 flex flex-wrap gap-3">
                  <Link to="/rti" className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 hover:text-emerald-700">
                    Statutory Declaration <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Compliance & Disclosures */}
            <motion.div 
              variants={fadeInUp}
              className="relative p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-white transition-all duration-300 shadow-xs flex gap-3.5 sm:gap-4 group cursor-pointer"
            >
              <Link to="/disclosures" className="absolute inset-0 z-10 rounded-2xl" aria-label="Compliance & Disclosures" />
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform pointer-events-none">
                <FileText className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Compliance & Disclosures
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-2.5">
                  Access audit profiles, annual accounts, UGC approval letters, and Institutional Development Plans (IDP).
                </p>
                <div className="relative z-20 flex flex-wrap gap-x-4 gap-y-1.5">
                  <Link to="/disclosures" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-750">
                    Disclosures
                  </Link>
                  <Link to="/idp" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-750">
                    IDP
                  </Link>
                  <Link to="/r-d-cell" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-750">
                    R&D Cell
                  </Link>
                  <Link to="/annual-accounts" className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-750">
                    All Audits <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
