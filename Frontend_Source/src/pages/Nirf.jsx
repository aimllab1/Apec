import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Award, Building2, Target, ShieldCheck } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Nirf() {
  const nirfCategories = [
    {
      name: "NIRF Overall Rankings",
      icon: Award,
      color: "text-[#FF8A00] bg-[#FFE7CC]/50 border-[#FFE7CC]",
      description: "Comprehensive institutional performance indicators across all departments and parameters.",
      files: [
        { title: "NIRF Overall Report 2025", filename: "NIFR_-_OVERALL_2025_JAN.pdf", folder: "NIRF - Overall" },
        { title: "NIRF Overall Report 2024", filename: "APEC___NIRF_Overall_2024_(IR-O-C-16487).pdf", folder: "NIRF - Overall" },
        { title: "NIRF Overall Report Archive", filename: "2da95f6d-becf-4fab-81c9-1bbb3fc1d752.pdf", folder: "NIRF - Overall" }
      ]
    },
    {
      name: "NIRF Engineering Rankings",
      icon: Building2,
      color: "text-indigo-650 bg-indigo-50 border-indigo-100",
      description: "Dedicated discipline rankings focused on engineering education, research, and placement output.",
      files: [
        { title: "NIRF Engineering Report 2025", filename: "NIRF_ENGINEERING_2025_JAN.pdf", folder: "NIRF - Engineering" },
        { title: "NIRF Engineering Report 2024", filename: "APEC___NIRF_Engineering_2024_(IR-E-C-16487).pdf", folder: "NIRF - Engineering" },
        { title: "NIRF Engineering Report Archive", filename: "19b8c368-a590-4d21-846e-1e75080771b6.pdf", folder: "NIRF - Engineering" }
      ]
    },
    {
      name: "NIRF Management Rankings",
      icon: Target,
      color: "text-emerald-650 bg-emerald-50 border-emerald-100",
      description: "Discipline rankings highlighting business administration, teaching quality, and corporate exposure.",
      files: [
        { title: "NIRF Management Report 2025", filename: "NIRF_MANAGEMENT_2025_JAN.pdf", folder: "NIRF - Management" }
      ]
    },
    {
      name: "NIRF Sustainable Development Goals (SDG)",
      icon: ShieldCheck,
      color: "text-violet-650 bg-violet-50 border-violet-100",
      description: "Evaluation of the institution's impact and alignment with global sustainable development goals.",
      files: [
        { title: "NIRF SDG Report 2025", filename: "NIRF_SDG_2025_JAN.pdf", folder: "NIRF - SDG" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              National Rankings
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              National Institutional Ranking Framework (NIRF)
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              Official submissions and parameters reporting for the Ministry of Education's national ranking system. Access reports across Overall, Engineering, Management, and SDG categories.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {nirfCategories.map((category, catIdx) => {
            const IconComponent = category.icon;
            return (
              <motion.div 
                key={catIdx}
                variants={fadeInUp}
                className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${category.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-title text-gray-900">{category.name}</h3>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{category.description}</p>
                  </div>
                </div>

                {/* Files row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {category.files.map((file, fileIdx) => (
                    <div 
                      key={fileIdx}
                      className="border border-gray-150 hover:border-indigo-150 p-5 rounded-2xl flex flex-col justify-between bg-slate-50/30 hover:bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-indigo-650 group-hover:bg-indigo-50/30 transition-colors">
                          <FileText className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-black text-gray-500 uppercase bg-white border border-gray-150 px-2 py-0.5 rounded-md">Official PDF</span>
                      </div>
                      
                      <div className="text-left mb-6">
                        <h5 className="text-sm font-black text-gray-955 group-hover:text-indigo-650 transition-colors leading-snug">{file.title}</h5>
                      </div>

                      <a 
                        href={`/Documents/PDFs/${encodeURIComponent(file.folder)}/${encodeURIComponent(file.filename)}`}
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
            );
          })}
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
