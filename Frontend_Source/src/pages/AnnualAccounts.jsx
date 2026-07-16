import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, Download, Landmark, ArrowRight, ShieldCheck, 
  Calendar, PiggyBank, ArrowDownWideNarrow
} from 'lucide-react';

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

export default function AnnualAccounts() {
  const accountsData = [
    {
      year: "2022 - 2023",
      title: "Audited Financial Statement for the year 2022 – 2023",
      fileName: "Audited Financial Statement for the year 2022 - 2023.pdf",
      size: "7.0 MB"
    },
    {
      year: "2021 - 2022",
      title: "Audited Financial Statement for the year 2021 – 2022",
      fileName: "Audited Financial Statement for the year 2021 - 2022.pdf",
      size: "7.4 MB"
    },
    {
      year: "2020 - 2021",
      title: "Audited Financial Statement for the year 2020 - 2021",
      fileName: "Audited Financial Statement for the year 2020 - 2021.pdf",
      size: "3.1 MB"
    },
    {
      year: "2019 - 2020",
      title: "Audited Financial Statement for the year 2019 - 2020",
      fileName: "Audited Financial Statement for the year 2019 - 2020.pdf",
      size: "2.9 MB"
    },
    {
      year: "2018 - 2019",
      title: "Audited Financial Statement for the year 2018 - 2019",
      fileName: "Audited Financial Statement for the year 2018 - 2019.pdf",
      size: "2.8 MB"
    }
  ];

  const totalExpenditureDoc = {
    title: "Audited statement of Total Expenditure excluding salary, Expenditure on maintenance of Physical and Academic support facilities for Financial Years 2018 – 2019, 2019 – 2020, 2020 – 2021, 2021 – 2022, 2022 - 2023",
    fileName: "Audited statement of Total Expenditure excluding salary.pdf",
    size: "3.0 MB"
  };

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
              Financial Audit Disclosures
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Annual Accounts
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Official audited financial statements, expenditure statements, and maintenance reports published in compliance with UGC autonomous regulations.
            </p>
          </div>
          
          <Link 
            to="/mandatory-disclosure" 
            className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            Mandatory Disclosure <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Audited Total Expenditure Report (Featured Placement) */}
        <div className="bg-white border border-indigo-150 p-6 md:p-8 rounded-3xl mb-12 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <ArrowDownWideNarrow className="w-8 h-8 text-indigo-650" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Consolidated Statement
                </span>
                <h3 className="text-base md:text-lg font-black text-gray-900 leading-snug">
                  {totalExpenditureDoc.title}
                </h3>
                <span className="text-[10px] text-gray-400 font-bold block mt-2 uppercase">
                  PDF Size: {totalExpenditureDoc.size}
                </span>
              </div>
            </div>
            
            <a 
              href={`/Documents/PDFs/Accounts/${totalExpenditureDoc.fileName}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0 self-start md:self-center"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </div>
        </div>

        {/* Financial Year Wise Statements Grid */}
        <h2 className="text-xl font-black text-gray-900 font-title mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" /> Audited Financial Statements by Year
        </h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4"
        >
          {accountsData.map((doc, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black text-gray-900 leading-snug">
                    {doc.title}
                  </h4>
                  <span className="text-[9px] text-gray-400 font-bold block mt-1 uppercase">
                    Financial Year {doc.year} • PDF Size: {doc.size}
                  </span>
                </div>
              </div>
              
              <a 
                href={`/Documents/PDFs/Accounts/${doc.fileName}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gray-250 hover:bg-slate-50 text-gray-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all active:scale-95 shrink-0 self-start md:self-center bg-white"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
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
