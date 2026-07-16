import React from 'react';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, FileCheck, Calendar } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function UgcUndertaking() {
  const pdfUrl = "/Documents/PDFs/UGC/Undertaking.pdf";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-left animate-fade-in">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              UGC Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              UGC Undertaking
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Official institutional declaration submitted to the University Grants Commission, establishing APEC's commitment to quality education and statutory compliance.
            </p>
          </div>
        </div>

        {/* Central File Showcase Card */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shadow-sm mb-6">
            <FileCheck className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-title mb-3">
            UGC Undertaking Declaration
          </h3>
          
          <p className="text-sm md:text-base font-bold text-gray-650 leading-relaxed max-w-md mb-8">
            Adhiparasakthi Engineering College strictly conforms to the regulations of the UGC. Access the complete signed compliance document detailing our continuous pledge to educational standards, non-commercialization, and anti-ragging measures.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
            <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-xl">
              <span className="text-xs font-black text-gray-400 uppercase block mb-0.5">File Format</span>
              <span className="text-sm font-extrabold text-gray-950">PDF Document</span>
            </div>
            <div className="bg-slate-50 border border-gray-100 p-3.5 rounded-xl">
              <span className="text-xs font-black text-gray-400 uppercase block mb-0.5">Verification</span>
              <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Signed & Approved
              </span>
            </div>
          </div>

          {/* Large Action Download Link */}
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm py-4.5 bg-indigo-650 hover:bg-indigo-600 border border-indigo-750 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" /> View / Download Undertaking PDF
          </a>
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-255 p-6 rounded-2xl text-center">
          <p className="text-sm md:text-base font-extrabold text-gray-600 leading-relaxed">
            Adhiparasakthi Engineering College • Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
