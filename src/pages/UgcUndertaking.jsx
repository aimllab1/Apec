import React from 'react';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, CheckCircle2, FileCheck, Bookmark, Award } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function UgcUndertaking() {
  const pdfUrl = "/ugc/7. undertaking-ugc.pdf";

  const undertakingDeclarations = [
    {
      title: "I. Regulatory Compliance",
      points: [
        "Commitment to adhere strictly to all provisions of the UGC Act, 1956 and its subsequent amendments.",
        "Compliance with the rules laid down by the All India Council for Technical Education (AICTE), New Delhi.",
        "Maintenance of affiliation guidelines and curriculum benchmarks set by Anna University, Chennai."
      ]
    },
    {
      title: "II. Operational Transparency",
      points: [
        "Commitment to public self-disclosure of all academic portfolios, fees, and faculty rosters on the institutional website.",
        "Publishing audited annual accounts, expenditure statements, and mandatory disclosures regularly.",
        "Providing honest information to inspecting statutory bodies during audits and verification visits."
      ]
    },
    {
      title: "III. Student Safety & Non-Discrimination",
      points: [
        "Zero-tolerance policy towards ragging, with strict implementation of UGC anti-ragging regulations.",
        "Ensuring gender safety and institutional support via the active Internal Complaints Committee (ICC).",
        "Strict adherence to reservation policies and equal opportunity clauses for SC/ST and minority groups."
      ]
    },
    {
      title: "IV. Quality & Academic Integrity",
      points: [
        "Upholding examination security and curriculum standards under UGC autonomous status regulations.",
        "Continuous performance monitoring via internal peer committees and the IQAC cell.",
        "Promotion of research ethics, preventing plagiarism, and ensuring faculty empowerment schemes."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              UGC Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              UGC Undertaking
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Official institutional declaration submitted to the University Grants Commission, establishing APEC's commitment to quality education, equity, and statutory compliance.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            download
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            <Download className="w-4 h-4" /> Download UGC Undertaking PDF
          </a>
        </div>

        {/* Declaration Status Card */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-650" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 font-title mb-1.5 flex items-center gap-2">
              Statutory Undertaking Status
              <span className="text-[10px] font-black uppercase text-emerald-650 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 animate-pulse">
                Active & Signed
              </span>
            </h3>
            <p className="text-xs md:text-sm font-semibold text-gray-500 leading-relaxed">
              Adhiparasakthi Engineering College strictly conforms to the regulations of the UGC. The institutional undertaking details our continuous pledge to educational standards, non-commercialization of higher education, and anti-ragging measures.
            </p>
          </div>
        </div>

        {/* Declarations Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {undertakingDeclarations.map((section, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-black text-gray-900 font-title mb-4 border-b border-gray-150 pb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#FF8A00]" /> {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="text-xs font-semibold text-gray-650 leading-relaxed flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-indigo-650" />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • ISO 9001:2015 Certified
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
