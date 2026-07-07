import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Calendar, Shield, Cpu, BookOpen, Users, Compass, 
  TrendingUp, Award, Zap, Briefcase, GraduationCap, CheckCircle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 80, damping: 15 } 
  }
};

export default function IDP() {
  const pdfUrl = "/ugc/2. IDP.pdf";

  const timelineData = [
    {
      year: "2023",
      title: "Foundation & Accreditation Planning",
      theme: "border-[#FF8A00] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent",
      colorCode: "#FF8A00",
      icon: <Shield className="w-6 h-6 text-[#FF8A00]" />,
      goals: [
        "Plan to go for NAAC Accreditation",
        "Academic Progression & Curriculum Development",
        "Faculty Empowerment & Up-gradation Programs",
        "Improving student enrollment in all branches",
        "Improve Internal Quality Assurance Cell (IQAC) activities"
      ]
    },
    {
      year: "2024",
      title: "Collaborations & Research Launch",
      theme: "border-indigo-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent",
      colorCode: "#6366f1",
      icon: <Cpu className="w-6 h-6 text-indigo-500" />,
      goals: [
        "Focus on achieving top National Institutional Ranking Framework (NIRF) Ranking",
        "Promote industry-institution collaboration with leading organizations",
        "Collaborate with external institutions to promote higher education & knowledge",
        "Strategic plan to start other branches / specialized domains",
        "Initiate comprehensive Research & Development (R&D) activities"
      ]
    },
    {
      year: "2025",
      title: "Infrastructure & Industrial Integration",
      theme: "border-emerald-500 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent",
      colorCode: "#10b981",
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      goals: [
        "Establish modern auditorium facilities & seminar halls",
        "Incorporate Industrial Collaborated Courses directly into the curriculum",
        "Strengthening social activities & rural community engagement",
        "Implement a 70% self-sufficient renewable power (Solar/Clean Energy) strategy",
        "Focus on placements in Tier-1 global IT and engineering companies"
      ]
    },
    {
      year: "2026",
      title: "Quality Benchmarking & Modernization",
      theme: "border-purple-500 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent",
      colorCode: "#a855f7",
      icon: <Award className="w-6 h-6 text-purple-500" />,
      goals: [
        "Attain National Board of Accreditation (NBA) certification for all courses",
        "Complete campus-wide Library Automation and digital system linkage",
        "Achieve 100% faculty strength with Ph.D. qualifications",
        "Improve funding proposals submitted to government and industry bodies",
        "Modernization of core department laboratories with state-of-the-art systems"
      ]
    },
    {
      year: "2027",
      title: "Incubation, Autonomy & Global Stature",
      theme: "border-pink-500 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent",
      colorCode: "#ec4899",
      icon: <TrendingUp className="w-6 h-6 text-pink-500" />,
      goals: [
        "Support and incubate student entrepreneurs through the campus cell",
        "Attain UGC Autonomous status for the college",
        "Establish Approved Research Centres for all academic departments",
        "Increase the H-index metric of the institution through quality publications",
        "Increase the D-index of the institution's researchers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              UGC Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Institutional Development Plan
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl">
              Strategic Plan (2023 - 2027) outlining APEC's key milestones in academic excellence, research initiatives, and administrative autonomy.
            </p>
          </div>
          
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all self-start md:self-center shrink-0 border border-indigo-750"
          >
            <Download className="w-4 h-4" /> Download Official IDP PDF
          </a>
        </div>

        {/* Timeline Roadmap */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative pl-6 md:pl-10 border-l border-gray-200 space-y-12"
        >
          {timelineData.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              className="relative"
            >
              {/* Timeline Bullet Indicator */}
              <div 
                className="absolute -left-[35px] md:-left-[51px] top-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center shadow-sm"
                style={{ borderColor: item.colorCode }}
              >
                <span className="text-[10px] font-black text-gray-900">{item.year}</span>
              </div>

              {/* Year Card */}
              <div className={`border border-gray-250 p-6 md:p-8 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow ${item.theme}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-gray-400 block">
                      Academic Year {item.year}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 font-title">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Goals list */}
                <ul className="space-y-4">
                  {item.goals.map((goal, gIdx) => (
                    <li key={gIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-650" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 leading-relaxed">
                        {goal}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
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
