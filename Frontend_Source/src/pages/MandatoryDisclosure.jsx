import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, CheckSquare, ShieldCheck, ClipboardList, FileSpreadsheet, 
  MapPin, CheckCircle, GraduationCap, Building2, Users
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

export default function MandatoryDisclosure() {
  const pdfUrl = "/Documents/PDFs/UGC/4. Mandatory_Disclosure.pdf";

  const disclosureDetails = [
    {
      category: "I. AICTE Approval & Status",
      items: [
        "Permanent AICTE ID: 1-14399061",
        "Latest Extension of Approval (EOA) details",
        "UGC Autonomous Approval validation",
        "Anna University Chennai affiliation confirmation"
      ]
    },
    {
      category: "II. Governing Body & Councils",
      items: [
        "Governing Council member names and designations",
        "Academic Council constitution and meeting frequency",
        "Board of Studies (BoS) for all departments",
        "Strategic developmental guidelines and IQAC cell"
      ]
    },
    {
      category: "III. Student Protection Committees",
      items: [
        "Anti-Ragging Committee: Member directory and helplines",
        "Anti-Ragging Squad: Operational patrol details",
        "Internal Complaints Committee (ICC) for women safety",
        "Equal Opportunity Cell: SC/ST committee designations"
      ]
    },
    {
      category: "IV. Grievance Redressal & Support",
      items: [
        "Student Grievance Redressal Committee (SGRC) details",
        "OMBUDSPERSON appointment details and contact",
        "Student counseling and mentorship networks",
        "Online grievance submission and tracking channels"
      ]
    },
    {
      category: "V. Infrastructural Resources",
      items: [
        "Classrooms & Seminar Halls: Sizes and ICT amenities",
        "Laboratories: List of machinery, instruments, and CADD setups",
        "Computer Center: Bandwidth speed, system models, and configurations",
        "Central Library: Digital journals, book volume index, and amenities"
      ]
    },
    {
      category: "VI. Admissions & Placements",
      items: [
        "TNEA Counselling Code: 1401",
        "Cutoff thresholds and seat allocation ratios",
        "Placement Cell: MOUs, company list, and salary packages",
        "Alumni Network: Student track records and entrepreneur achievements"
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
              UGC Compliance Directive
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Mandatory Disclosure
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Public disclosure details in accordance with AICTE, Anna University, and UGC norms for engineering college compliance and transparency.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            <Download className="w-4 h-4" /> Download Mandatory Disclosure PDF
          </a>
        </div>

        {/* AICTE Summary Compliance Status */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
            <ClipboardList className="w-8 h-8 text-indigo-650" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">AICTE Permanent ID</span>
              <span className="text-sm font-black text-gray-950">1-14399061</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Counselling Code</span>
              <span className="text-sm font-black text-gray-950">1401</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Compliance Status</span>
              <span className="text-xs font-black text-emerald-650 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 inline-block">
                Fully Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Disclosure categories grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {disclosureDetails.map((sec, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-black text-gray-900 font-title mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> {sec.category}
                </h3>
                <ul className="space-y-3.5">
                  {sec.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-xs font-semibold text-gray-655 leading-relaxed flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckSquare className="w-3 h-3 text-indigo-650" />
                      </div>
                      <span>{item}</span>
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
