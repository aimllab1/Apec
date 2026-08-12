import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, CheckCircle, ShieldCheck, FileText, 
  MapPin, GraduationCap, Building2, Users, CreditCard
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export default function UgcGuidelines() {
  const pdfUrl = "/Documents/PDFs/UGC/3. UGC Self Disclouser.pdf";

  const disclosureSections = [
    {
      title: "1. Institutional Information",
      description: "Basic profile & legal credentials of the college",
      icon: Building2,
      details: [
        "Details of College: Name, address, contact numbers, email IDs",
        "Type of Institution: UGC Autonomous, AICTE Approved, Anna University Affiliated",
        "Accreditation: NAAC grade status, accreditation validity certificates",
        "Autonomous Approvals: Letters from UGC and Anna University Chennai"
      ]
    },
    {
      title: "2. Academic Programmes & Seats",
      description: "Outline of approved courses, durations & seats",
      icon: GraduationCap,
      details: [
        "Approved courses offered: Undergraduate (B.E./B.Tech) & Postgraduate (M.E./MBA/MCA)",
        "Approved Intake: Current seat capacities approved by AICTE & Anna University",
        "Academic Calendar: Schedules for semesters, internal assessments, and end exams",
        "Course Structure: Syllabus, regulations, and credit structures for all branches"
      ]
    },
    {
      title: "3. Faculty Directory & Profiles",
      description: "Compliance details of teaching & support staff",
      icon: Users,
      details: [
        "Faculty Directory: Names, designations, departments, and emails of all instructors",
        "Academic Qualifications: Degrees (Ph.D., M.E., M.Tech.) and specialization profiles",
        "Research Profiles: Publications track record, guideship status, and research domains",
        "Empowerment: Faculty developmental workshops, FDTPs, and sponsored projects"
      ]
    },
    {
      title: "4. Student Amenities & Infrastructure",
      description: "Full disclosure of physical campus facilities",
      icon: MapPin,
      details: [
        "Central Library: Collection size, e-resources, and floor-wise structures",
        "Laboratories: List of machines, equipment, and CADD lab facilities",
        "Hostel & Dining: Room details, boarding capacities, RO water, and catering",
        "Sports Grounds: Indoor/outdoor athletic yards, gymnasium, and court outlines"
      ]
    },
    {
      title: "5. Fee Structure & Financial Aid",
      description: "Tuition, fee structures & financial aid",
      icon: CreditCard,
      details: [
        "Tuition Fees: Approved fees for governmental quota and management admissions",
        "Scholarships: State schemes, institutional waivers, and merit awards",
        "Annual Audits: Annual accounts declarations and mandatory disclosures",
        "Payment Modes: Fee payment channels, transaction gateways, and procedures"
      ]
    },
    {
      title: "6. Mandated Statutory Committees",
      description: "Cells for compliance & student welfare",
      icon: ShieldCheck,
      details: [
        "Internal Complaints Committee (ICC) & Gender Sensitization cells",
        "Anti-Ragging Committee: Member directory, guidelines, and helpline contacts",
        "SC / ST Cell: Committee members and student welfare facilitation",
        "Student Grievance Redressal Committee (SGRC) and OMBUDSPERSON contact details"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 md:pt-10 pb-16 md:pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="mb-6 border-b border-gray-200 pb-6 w-full text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-xs font-black tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full inline-flex items-center gap-2 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Compliance Portal
            </span>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all shrink-0 border border-indigo-700"
            >
              <Download className="w-4 h-4" /> Download UGC Guidelines PDF
            </a>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-slate-900 leading-tight">
            UGC Self Disclosure Guidelines
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-650 font-bold leading-relaxed sm:leading-loose w-full text-justify">
            Public disclosure of essential academic, structural, and compliance information in alignment with University Grants Commission (UGC) guidelines.
          </p>
        </div>

        {/* Introduction Compliance Status Card */}
        <div className="bg-gradient-to-r from-emerald-50/80 via-white to-indigo-50/50 border border-emerald-200/80 p-5 sm:p-6 rounded-3xl mb-8 shadow-sm flex flex-col sm:flex-row items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm mt-0.5 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-title">
                UGC Self Disclosure Compliance Status
              </h3>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-3 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active & Disclosed
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 text-justify leading-relaxed">
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
          {disclosureSections.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <motion.div 
                key={idx}
                variants={cardVariants}
                className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0 group-hover:scale-105 transition-transform">
                      <SectionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 font-title group-hover:text-indigo-650 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-[11px] text-indigo-650 font-extrabold uppercase tracking-wide">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3.5 pt-2">
                    {section.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-indigo-600" />
                        </div>
                        <span className="grow">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Info Note */}
        <div className="mt-16 bg-slate-100/70 border border-slate-200 p-6 rounded-2xl text-center">
          <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • ISO 9001:2015 Certified
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
