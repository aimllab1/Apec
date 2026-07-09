import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function IqacMeetings() {
  const meetings = [
    { title: "IQAC Meeting - 1", filename: "IQAC_ Meeting-1.pdf" },
    { title: "IQAC Meeting - 2", filename: "IQAC_ Meeting-2.pdf" },
    { title: "IQAC Meeting - 3", filename: "IQAC_ Meeting-3.pdf" },
    { title: "IQAC Meeting - 4", filename: "IQAC_ Meeting-4.pdf" },
    { title: "IQAC Meeting - 5", filename: "IQAC_ Meeting-5.pdf" },
    { title: "IQAC Meeting - 6", filename: "IQAC_ Meeting-6.pdf" },
    { title: "IQAC Meeting - 7", filename: "IQAC_Meeting-7.pdf" },
    { title: "IQAC Meeting - 8", filename: "IQAC Meeting-8.pdf" },
    { title: "IQAC Meeting - 9", filename: "IQAC Meeting-9.pdf" }
  ];

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
              Meeting Logs
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              IQAC MoM & AT
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              Official Minutes of Meetings and Action Taken (MoM & AT) reports of the Internal Quality Assurance Cell board.
            </p>
          </div>
        </div>

        {/* MoM & AT Meetings List */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black font-title text-gray-900 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#FF8A00]" /> Minutes of Meetings & Action Taken (MoM & AT)
            </h3>
            <p className="text-xs font-semibold text-gray-550">Official logs of the Internal Quality Assurance Cell board meetings and consecutive actions taken.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-200 hover:border-indigo-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-150 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-indigo-650 group-hover:bg-indigo-50/50 transition-colors">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider bg-slate-50 border border-gray-100 px-2 py-0.5 rounded-md">Official Report</span>
                </div>
                
                <div className="text-left mb-6">
                  <h5 className="text-base font-black text-gray-950 group-hover:text-indigo-650 transition-colors">{meeting.title}</h5>
                  <p className="text-xs font-bold text-gray-550 mt-1 leading-snug">Minutes log & action taken analysis documentation.</p>
                </div>

                <a 
                  href={`/ugc/iqac_meetings/${encodeURIComponent(meeting.filename)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-3 rounded-xl border border-gray-200 group-hover:border-indigo-200 text-sm font-black uppercase tracking-wider text-gray-700 group-hover:text-indigo-650 group-hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> View / Download PDF
                </a>
              </div>
            ))}
          </div>
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
