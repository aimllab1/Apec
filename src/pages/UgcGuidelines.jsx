import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, CheckCircle, ShieldCheck, Info, FileText, 
  MapPin, HelpCircle, GraduationCap, Building2, Users
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

export default function UgcGuidelines() {
  const pdfUrl = "/ugc/3. UGC Self Disclouser.pdf";

  const disclosureSections = [
    {
      title: "1. Institutional Information",
      description: "Basic profile and legal credentials of the college.",
      details: [
        "Details of College: Name, address, contact numbers, email IDs",
        "Type of Institution: UGC Autonomous, AICTE Approved, Anna University Affiliated",
        "Accreditation: NAAC grade status, accreditation validity certificates",
        "Autonomous Approvals: Letters from UGC and Anna University Chennai"
      ]
    },
    {
      title: "2. Academic Programmes & Seats",
      description: "Outline of all approved courses, durations, and seats.",
      details: [
        "Approved courses offered: Undergraduate (B.E./B.Tech) & Postgraduate (M.E./MBA/MCA)",
        "Approved Intake: Current seat capacities approved by AICTE & Anna University",
        "Academic Calendar: Schedules for semesters, internal assessments, and end exams",
        "Course Structure: Syllabus, regulations, and credit structures for all branches"
      ]
    },
    {
      title: "3. Faculty Directory & Profiles",
      description: "Compliance details about teaching and support staff.",
      details: [
        "Faculty Directory: Names, designations, departments, and emails of all instructors",
        "Academic Qualifications: Degrees (Ph.D., M.E., M.Tech.) and specialization profiles",
        "Research Profiles: Publications track record, guideship status, and research domains",
        "Empowerment: Faculty developmental workshops, FDTPs, and sponsored projects"
      ]
    },
    {
      title: "4. Student Amenities & Infrastructure",
      description: "Full disclosure of physical campus facilities.",
      details: [
        "Central Library: Collection size, e-resources, and floor-wise structures",
        "Laboratories: List of machines, equipment, and CADD lab facilities",
        "Hostel & Dining: Room details, boarding capacities, RO water, and catering",
        "Sports Grounds: Indoor/outdoor athletic yards, gymnasium, and court outlines"
      ]
    },
    {
      title: "5. Fee Structure & Financial Aid",
      description: "Tuition, fee structures, and financial assistance guidelines.",
      details: [
        "Tuition Fees: Approved fees for governmental quota and management admissions",
        "Scholarships: State schemes, institutional waivers, and merit awards",
        "Annual Audits: Annual accounts declarations and mandatory disclosures",
        "Payment Modes: Fee payment channels, transaction gateways, and procedures"
      ]
    },
    {
      title: "6. Mandated Statutory Committees",
      description: "Cells established to ensure compliance and student welfare.",
      details: [
        "Internal Complaints Committee (ICC) & Gender Sensitization cells",
        "Anti-Ragging Committee: Member directory, guidelines, and helpline contacts",
        "SC / ST Cell: Committee members and student welfare facilitation",
        "Student Grievance Redressal Committee (SGRC) and OMBUDSPERSON contact details"
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
              Compliance Portal
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              UGC Self Disclosure Guidelines
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Public disclosure of essential academic, structural, and compliance information in alignment with University Grants Commission (UGC) guidelines.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            <Download className="w-4 h-4" /> Download UGC Guidelines PDF
          </a>
        </div>

        {/* Introduction Compliance Status Card */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl mb-12 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-650" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 font-title mb-1.5 flex items-center gap-2">
              UGC Self Disclosure Compliance Status
              <span className="text-[10px] font-black uppercase text-emerald-650 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 animate-pulse">
                Active & Disclosed
              </span>
            </h3>
            <p className="text-xs md:text-sm font-semibold text-gray-500 leading-relaxed">
              Adhiparasakthi Engineering College strictly adheres to the transparency mandates of the UGC. All academic records, governance portfolios, and audit accounts are regularly updated in our public archives for student, guardian, and administrative reference.
            </p>
          </div>
        </div>

        {/* Compliance Guidelines Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {disclosureSections.map((section, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-black text-gray-900 font-title mb-2">
                  {section.title}
                </h3>
                <p className="text-xs text-indigo-650 font-extrabold uppercase mb-6 tracking-wide">
                  {section.description}
                </p>
                <ul className="space-y-3.5">
                  {section.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs font-semibold text-gray-650 leading-relaxed flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-indigo-650" />
                      </div>
                      <span>{detail}</span>
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
