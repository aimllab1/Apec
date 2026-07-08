import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Phone, MapPin, Download, Scale, User, Landmark, BookOpen } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  })
};

const documents = [
  {
    title: "RTI Act - Tamil Nadu Guidebook",
    fileName: "RTI-Act-Tamil_Nadu_Guidebook.pdf",
    size: "1182.0 KB",
    icon: BookOpen,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100"
  },
  {
    title: "RTI Act - English",
    fileName: "RTI-Act-English.pdf",
    size: "1089.5 KB",
    icon: FileText,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100"
  },
  {
    title: "Statutory Declaration on RTI Act",
    fileName: "Statutory_Declaration_on_RTI_Act.pdf",
    size: "431.9 KB",
    icon: Scale,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100"
  }
];

export default function Rti() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Hero Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-full mb-6">
            <Scale className="w-3.5 h-3.5" /> Right to Information Act, 2005
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight text-gray-900 leading-tight mb-5">
            RTI — Right to Information
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-semibold max-w-3xl mx-auto leading-relaxed">
            The Right to Information Act, 2005 (22 of 2005) enacted by the Parliament provides citizens the right to secure access to information under the control of public authorities.
          </p>
        </motion.div>

        {/* Act Description Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm mb-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Landmark className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black font-title text-gray-900 mb-1">RTI Act</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">Act No. 22 of 2005 • Effective 15 June 2005</span>
            </div>
          </div>
          
          <div className="space-y-4 text-xs md:text-sm font-semibold text-gray-600 leading-relaxed">
            <p>
              The Right to Information Act, 2005 (22 of 2005) has been enacted by the Parliament and has come into force from 15 June, 2005. This Act provides for right to information for citizens to secure access to information under the control of public authorities.
            </p>
            <p>
              All Universities and Colleges established by law made by Parliament or by State Legislature or by notification by the appropriate Government or owned, controlled or substantially financed directly or indirectly by funds provided by the Government shall come within the meaning of a <strong className="text-gray-900">Public Authority</strong> under this Act.
            </p>
            <p>
              In accordance with the RTI Act, 2005, the college has a <strong className="text-gray-900">Public Information Officer (PIO)</strong> and <strong className="text-gray-900">Appellate Authority (AA)</strong>. The following officials are presently deputed to act as RTI officials on behalf of the college and these officials hold the responsibility of complying with any query under RTI Act, 2005.
            </p>
          </div>
        </motion.div>

        {/* Officers Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {/* PIO Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-amber-100 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">
                  Public Information Officer
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Mr. M. Sadanandan</h3>
              <p className="text-sm font-bold text-gray-500 mb-5">Administrative Officer</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Adhiparasakthi Engineering College, Melmaruvathur.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appellate Authority Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-100/50 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">
                  Appellate Authority
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Dr. J. Raja</h3>
              <p className="text-sm font-bold text-gray-500 mb-5">Principal</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs font-semibold text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Adhiparasakthi Engineering College, Melmaruvathur.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Downloads Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm mb-10"
        >
          <h2 className="text-lg md:text-xl font-black font-title text-gray-900 mb-2">RTI Documents</h2>
          <p className="text-xs font-bold text-gray-400 mb-8">Download the official RTI Act documents and statutory declarations below.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {documents.map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <a
                  key={idx}
                  href={`/ugc/${doc.fileName}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-150 hover:border-amber-200 hover:shadow-md transition-all duration-200 hover:bg-amber-50/30"
                >
                  <div className={`w-14 h-14 rounded-2xl ${doc.bgColor} border ${doc.borderColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${doc.color}`} />
                  </div>
                  <h4 className="text-xs font-black text-gray-900 mb-1 leading-snug">{doc.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 mb-4">{doc.size}</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full group-hover:bg-amber-100 transition-colors">
                    <Download className="w-3 h-3" /> Download PDF
                  </span>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center"
        >
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • ISO 9001:2015 Certified
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
