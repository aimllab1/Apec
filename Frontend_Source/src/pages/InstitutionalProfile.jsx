import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Telescope, Rocket, Shield, Award, 
  ArrowRight, BookOpen, Scale, FileText, 
  CheckCircle2, Users, HelpCircle, Activity 
} from 'lucide-react';

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
    <div className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Intro Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="about-intro mb-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            42-Year Academic Legacy
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Institutional Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl font-semibold">
            Adhiparasakthi Engineering College (APEC), Melmaruvathur, established in 1984, is a premier autonomous institution. Founded on the values of academic quality, research excellence, and spiritual grounding, APEC is committed to nurturing socially responsible engineers. Affiliated with Anna University and approved by AICTE, the institution has consistently maintained a reputation for progressive educational curricula.
          </p>
        </motion.div>

        {/* Vision & Mission Cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {/* Vision */}
          <motion.div 
            variants={fadeInUp}
            className="p-8 bg-slate-50/50 border border-slate-200/80 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Telescope className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">Vision Statement</h3>
              <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                To create high-quality engineers who possess a deep sense of service and spirituality, advancing the growth of society through the adoption of sustainable and appropriate technologies.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            variants={fadeInUp}
            className="p-8 bg-slate-50/50 border border-slate-200/80 rounded-3xl hover:border-pink-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/90 to-rose-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">Mission Objectives</h3>
              <ul className="space-y-3.5 text-xs text-slate-550 font-semibold leading-relaxed text-left list-none">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
                  <span>Imparting high-quality education with emphasis on contemporary technologies to achieve growth across society.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
                  <span>Cultivating empathy, discipline, and core professional ethics.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
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
          className="border-t border-slate-100 pt-16 mb-20"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Accreditations & Affiliations
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            Institutional Standing
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="font-display block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">Affiliation</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Anna University</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Permanently affiliated and registered under Anna University frameworks.</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="font-display block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">UGC Autonomous</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">10-Year Status</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Granted autonomous status by the UGC to design industry-centric curriculum pathways.</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="font-display block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">Quality Mark</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">NAAC Accredited</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Accredited with an 'A' grade for top-tier academic standards and infrastructure.</p>
            </div>
          </div>
        </motion.div>

        {/* INTEGRATION HUB: Committees, RTI, IQAC, Disclosures */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-16 mb-12"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Governance & Compliance Integrations
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Institutional Governance Hub
          </h2>
          <p className="text-xs text-slate-400 font-semibold mb-10 max-w-xl">
            Explore our governance nodes, quality control cells, welfare committees, statutory disclosures, and transparency portals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* IQAC Integration */}
            <motion.div 
              variants={fadeInUp}
              className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-white transition-all duration-300 shadow-sm flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">Internal Quality Assurance Cell (IQAC)</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-4">
                  Drives quality audits, academic parameters, and NAAC accreditation documentation.
                </p>
                <div className="flex gap-4">
                  <Link to="/iqac" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700">
                    IQAC Info <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link to="/iqac-members" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700">
                    Members <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link to="/iqac-mom-at" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700">
                    Meetings <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Committees Integration */}
            <motion.div 
              variants={fadeInUp}
              className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-pink-500 hover:bg-white transition-all duration-300 shadow-sm flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">Institutional Committees & Cells</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-4">
                  Ensures student welfare, anti-ragging protection, industry tie-ups, and career development support.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <Link to="/committees/anti-ragging" className="inline-flex items-center gap-0.5 text-[10px] font-black text-pink-600 hover:text-pink-700">
                    Anti-Ragging
                  </Link>
                  <Link to="/committees/iiic" className="inline-flex items-center gap-0.5 text-[10px] font-black text-pink-600 hover:text-pink-700">
                    IIIC
                  </Link>
                  <Link to="/committees" className="inline-flex items-center gap-1 text-[10px] font-black text-pink-600 hover:text-pink-700">
                    All Committees <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* RTI Integration */}
            <motion.div 
              variants={fadeInUp}
              className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-emerald-500 hover:bg-white transition-all duration-300 shadow-sm flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">Right to Information (RTI)</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-4">
                  Access statutory disclosures, guidelines, and guidebook publications under the RTI Act.
                </p>
                <Link to="/rti" className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:text-emerald-700">
                  Statutory Declaration <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Compliance & Disclosures */}
            <motion.div 
              variants={fadeInUp}
              className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-blue-500 hover:bg-white transition-all duration-300 shadow-sm flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="grow text-left">
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">Compliance & Disclosures</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-4">
                  Access audit profiles, annual accounts, UGC approval letters, and Institutional Development Plans (IDP).
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <Link to="/disclosures" className="inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 hover:text-blue-750">
                    Disclosures
                  </Link>
                  <Link to="/idp" className="inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 hover:text-blue-750">
                    IDP
                  </Link>
                  <Link to="/r-d-cell" className="inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 hover:text-blue-750">
                    R&D Cell
                  </Link>
                  <Link to="/annual-accounts" className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-750">
                    All Audits <ArrowRight className="w-3 h-3" />
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
