import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, FileText, Calendar, Bell, Mail, Phone, MapPin, 
  Download, ExternalLink, ArrowRight, ShieldCheck, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function Coe() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-12 md:py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* 1. Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-250 pb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-5 uppercase">
              Office of the COE
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Controller of Examinations
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl leading-relaxed">
              Managing end-to-end examination processes, evaluation systems, and academic result publication to ensure academic excellence and integrity.
            </p>
            
            {/* Hero Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                type="button" 
                className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all border border-indigo-750 cursor-pointer"
              >
                View Results <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-gray-700 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-gray-300 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Exam Schedule <Calendar className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Hero Side Graphic Element */}
          <div className="w-full md:w-80 h-48 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden shrink-0">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-indigo-100/60 border border-indigo-200/50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-650" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">Autonomous Status</span>
              <h3 className="font-title text-base font-black text-slate-800 leading-snug">Anna University Affiliated</h3>
            </div>
          </div>
        </div>

        {/* 2. Quick Access Grid */}
        <div className="mb-16">
          <h2 className="text-xl font-black text-gray-900 font-title mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" /> Quick Access Services
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Results",
                desc: "Semester examination results, marks statements, and consolidated reports.",
                icon: FileText,
                color: "text-rose-600 bg-rose-50 border-rose-100/50"
              },
              {
                title: "Examination Schedule",
                desc: "Timetables, hall ticket distribution dates, and exam seating plans.",
                icon: Calendar,
                color: "text-amber-600 bg-amber-50 border-amber-100/50"
              },
              {
                title: "Notifications",
                desc: "Official academic circulars, exam registrations, and deadlines.",
                icon: Bell,
                color: "text-indigo-600 bg-indigo-50 border-indigo-100/50"
              },
              {
                title: "Downloads",
                desc: "Forms for revaluation, transcripts, duplicate certificates, and templates.",
                icon: Download,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100/50"
              }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${srv.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-black text-indigo-650 group-hover:text-indigo-800 gap-1">
                    <span>Access Portal</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* 3. Important Notifications */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black text-gray-900 font-title mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-400" /> Important Announcements
            </h2>
            
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gray-50 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-gray-400 mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">No Notifications Available</h3>
              <p className="text-xs text-gray-400 font-semibold max-w-sm leading-relaxed">
                There are currently no active announcements or notifications from the examination office.
              </p>
            </div>
          </div>
          
          {/* 4. About COE */}
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 font-title mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gray-400" /> About COE Office
            </h2>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm text-left flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900 mb-3 leading-snug">Autonomous Examination Cell</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-4">
                  The Controller of Examinations manages all evaluation processes with absolute transparency and efficiency. Key roles include scheduling examinations, appointing examiners, managing answer script evaluation, publishing results, and distributing transcripts.
                </p>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Adopting modern digital initiatives, our examination system ensures quick turnaround times and rigorous security controls.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-150 mt-6">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FF8A00] block mb-0.5">Evaluation Standards</span>
                <span className="text-xs text-gray-400 font-bold block">Outcome-Based Education (OBE) Model</span>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Important Links */}
        <div className="mb-16">
          <h2 className="text-xl font-black text-gray-900 font-title mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" /> Important Links & Resources
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Examination Regulations", desc: "UGC autonomous guidelines & grading system" },
              { title: "Examination Forms", desc: "Revaluation, duplicate card, transcript forms" },
              { title: "Academic Calendar", desc: "Semester dates, working days, and schedule" },
              { title: "Examination Guidelines", desc: "Code of conduct and instructions for students" }
            ].map((link, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-black text-gray-900 leading-snug group-hover:text-indigo-650 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-semibold mt-1">
                    {link.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-indigo-650 tracking-wider">
                  <span>Open PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Contact COE Section */}
        <div className="bg-slate-950/5 border border-indigo-150/80 rounded-3xl p-6 md:p-8 shadow-sm text-left">
          <h3 className="text-lg font-black text-gray-900 font-title mb-6">Contact Examination Office</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                <Mail className="w-5 h-5 text-indigo-650" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Email Address</span>
                <a href="mailto:coe@apec.edu.in" className="text-sm font-bold text-gray-800 hover:text-indigo-650 transition-colors font-mono">
                  coe@apec.edu.in
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                <Phone className="w-5 h-5 text-indigo-650" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Helpline Contacts</span>
                <a href="tel:+917418064336" className="text-sm font-bold text-gray-800 hover:text-indigo-650 transition-colors font-mono block">
                  +91 7418064336
                </a>
                <span className="text-[10px] text-gray-400 font-bold block mt-0.5 font-sans">(Ext. Office of the COE)</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-indigo-650" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Office Location</span>
                <p className="text-sm font-bold text-gray-800 leading-snug">
                  Ground Floor, Administrative Block, APEC Campus, Melmaruvathur - 603 319.
                </p>
              </div>
            </div>
          </div>
        </div>

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
