import React from 'react';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, CheckCircle2, FileText, Landmark, Milestone } from 'lucide-react';

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

export default function UgcApprovalLetter() {
  const pdfUrl = "/ugc/8. ugc-approval-letter.pdf";

  const approvalDetails = [
    {
      title: "I. Conferment Specifications",
      points: [
        "Conferment of Fresh Autonomous Status by the University Grants Commission (UGC), New Delhi.",
        "Effective Academic Term: Ten-year tenure in accordance with UGC Autonomous Colleges Regulations.",
        "Affiliated University: Anna University, Chennai will award the degrees with APEC listed as an autonomous college."
      ]
    },
    {
      title: "II. Academic Freedom & Syllabus",
      points: [
        "Privilege to design the curriculum, introduce new courses of study, and update syllabi to meet industry needs.",
        "Authority to offer elective and value-added courses for enhanced student employability.",
        "Freedom to establish collaborative degrees and industrial internship programs."
      ]
    },
    {
      title: "III. Evaluation & Examination Control",
      points: [
        "Establishment of an independent Controller of Examinations (CoE) office on campus.",
        "Authority to conduct exams, implement continuous internal assessment (CIA) models, and process grades.",
        "Timely declaration of results and official grade sheet releases."
      ]
    },
    {
      title: "IV. Governance & Grants",
      points: [
        "Establishment of statutory bodies: Governing Body, Academic Council, Board of Studies (BoS), and Finance Committee.",
        "Direct receipt of UGC developmental grants allocated for autonomous colleges.",
        "Self-governance for institutional development, recruitment of competent faculty, and infrastructural upgrades."
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
              UGC Autonomous Sanction
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              UGC Autonomous Approval Letter
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Official approval letter issued by the University Grants Commission conferring Autonomous Status upon Adhiparasakthi Engineering College.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            download
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            <Download className="w-4 h-4" /> Download Approval Letter PDF
          </a>
        </div>

        {/* Conferment Status Card */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-8 h-8 text-indigo-650" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Conferred By</span>
              <span className="text-sm font-black text-gray-950">UGC, New Delhi</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Status Granted</span>
              <span className="text-sm font-black text-gray-950">Autonomous status</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Validation Status</span>
              <span className="text-xs font-black text-emerald-650 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block">
                Active & Conferred
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {approvalDetails.map((section, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-black text-gray-900 font-title mb-4 border-b border-gray-150 pb-3 flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-indigo-550" /> {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="text-xs font-semibold text-gray-655 leading-relaxed flex items-start gap-2.5">
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
