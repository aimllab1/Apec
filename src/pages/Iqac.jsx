import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, BookOpen, CheckCircle2, ChevronRight,
  ShieldCheck, Target, Briefcase, Award, TrendingUp
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Iqac() {
  const pdfUrl = "/ugc/statement_compliance.pdf";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              NAAC Accreditation Sustenance
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Internal Quality Assurance Cell (IQAC)
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              Establishing quality assurance systems at Adhiparasakthi Engineering College (APEC) to coordinate, internalize, and institutionalize best practices for academic and administrative excellence.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Statement of Compliance PDF
          </a>
        </div>

        {/* Content Body */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Introduction section */}
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black font-title text-gray-900 mb-4 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Introduction
            </h2>
            <div className="space-y-4 text-sm md:text-base font-semibold text-gray-655 leading-relaxed">
              <p>
                Adhiparasakthi Engineering College (APEC) establishes an Internal Quality Assurance Cell (IQAC) as a quality sustenance measure as per the guidelines of the National Assessment and Accreditation Council (NAAC). Since quality enhancement is a continuous process, the IQAC will become a part of the institution’s system and work towards realisation of the goals of quality enhancement and sustenance.
              </p>
              <p>
                The main aim of the IQAC is to develop a system for conscious, consistent, and catalytic improvement in the overall performance of institutions. For this, during the post-accreditation period, institutions need to channel their efforts and measures toward promoting holistic academic excellence including the peer committee recommendations.
              </p>
            </div>
          </motion.div>

          {/* Objectives & Strategies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black font-title text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-[#FF8A00]" /> Primary Aim & Objectives
                </h3>
                <ul className="space-y-4">
                  <li className="text-xs md:text-sm font-semibold text-gray-655 leading-relaxed flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF8A00] text-xs font-bold mt-0.5">1</span>
                    <span>To develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.</span>
                  </li>
                  <li className="text-xs md:text-sm font-semibold text-gray-655 leading-relaxed flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF8A00] text-xs font-bold mt-0.5">2</span>
                    <span>To promote measures for institutional functioning towards quality enhancement through internalization of quality culture and institutionalization of best practices.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black font-title text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-indigo-650" /> Strategic Mechanisms
                </h3>
                <ul className="space-y-3">
                  {[
                    "Ensuring timely, efficient, and progressive performance of academic, administrative, and financial tasks",
                    "Relevant and quality academic/ research programs",
                    "Equitable access to and affordability of academic programmes for various sections of society",
                    "Optimization and integration of modern methods of teaching and learning",
                    "The credibility of the assessment and evaluation process",
                    "Ensuring the adequacy, maintenance, and proper allocation of support structure and services",
                    "Sharing of research findings and networking with other institutions in India and abroad"
                  ].map((strat, i) => (
                    <li key={i} className="text-xs md:text-sm font-semibold text-gray-655 leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-650 shrink-0 mt-0.5" />
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Functions section */}
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-black font-title text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-violet-650" /> Functions of IQAC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "Development and application of quality parameters for various academic and administrative activities of the institution",
                "Facilitating the creation of a learner-centric environment conducive to quality education and faculty maturation to adopt the required knowledge and technology for participatory teaching and learning process",
                "Collection and analysis of feedback from all stakeholders on quality-related institutional processes",
                "Dissemination of information on various quality parameters to all stakeholders",
                "Organization of workshops, seminars on quality related themes and promotion of quality circles",
                "Documentation of the various programs/activities leading to quality improvement",
                "Acting as a nodal agency of the Institution for coordinating quality-related activities, including the adoption and dissemination of best practices",
                "Development and maintenance of institutional database through MIS for the purpose of maintaining/enhancing the institutional quality",
                "Periodical conduct of Academic and Administrative Audit",
                "Preparation and submission of the Annual Quality Assurance Report (AQAR) as per NAAC guidelines."
              ].map((func, i) => (
                <div key={i} className="text-xs font-semibold text-gray-655 leading-relaxed flex items-start gap-2.5 py-1">
                  <ChevronRight className="w-4.5 h-4.5 text-violet-650 shrink-0 mt-0.5" />
                  <span>{func}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Benefits section */}
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-black font-title text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-500" /> Operational Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Sustenance & Focus", desc: "Ensure clarity and focus in institutional functioning toward quality enhancement." },
                { title: "Quality Culture", desc: "Ensure internalization of the quality culture in all spheres of the college." },
                { title: "Integration & Coordination", desc: "Ensure enhancement and coordination among various activities of the institution." },
                { title: "Informed Decisions", desc: "Provide a sound basis for decision-making to improve overall institutional functioning." },
                { title: "Dynamic Growth", desc: "Act as a dynamic, responsive system for making quality changes in the campus." },
                { title: "Documentation Standards", desc: "Build an organized, robust methodology of documentation and internal communication." }
              ].map((benefit, i) => (
                <div key={i} className="border border-gray-100 hover:border-amber-200 bg-amber-50/10 hover:bg-amber-50/20 p-5 rounded-2xl transition-all shadow-sm">
                  <span className="font-title text-xs font-extrabold uppercase text-amber-600 block mb-2">{benefit.title}</span>
                  <p className="text-xs font-semibold text-gray-655 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center">
          <p className="text-sm md:text-base font-extrabold text-gray-600 leading-relaxed">
            Adhiparasakthi Engineering College • Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
