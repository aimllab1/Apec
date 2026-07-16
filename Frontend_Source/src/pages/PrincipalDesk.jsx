import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  Download, Award, BookOpen, Clock, 
  MessageSquare, GraduationCap, Building, ShieldAlert 
} from 'lucide-react';
import principalImg from '../principal.webp';
import vpImg from '../Vice principal.jpg';
import deanImg from '../Dean.webp';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PrincipalDesk() {
  const branding = (() => {
    const saved = localStorage.getItem('apec_branding');
    return saved ? JSON.parse(saved) : {
      helpline1: '7418064336',
      helpline2: '7418065336',
    };
  })();

  const handleDownloadCV = () => {
    window.open('https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/1900c68d-255a-455f-a68d-4b7e199bbf4e/Profile_(2).pdf', '_blank');
  };

  return (
    <div className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Page title */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Administration Leadership
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Principal's Desk & Directory
          </h1>
          <p className="text-sm md:text-base text-slate-550 leading-relaxed max-w-3xl font-semibold">
            Welcome to the Office of the Principal. Explore the academic vision, leadership credentials, and direct institutional contacts directory for general communication.
          </p>
        </motion.div>

        {/* 1. PRINCIPAL DETAILS SECTION */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
          
          {/* Left: Image Card & Contact details */}
          <div className="w-full lg:w-4/12 flex flex-col items-center">
            <div className="relative group max-w-xs w-full p-2 bg-slate-50 border border-slate-200 rounded-[28px] shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-indigo-500/30">
              <div className="overflow-hidden rounded-[20px]">
                <img 
                  src={principalImg} 
                  alt="Dr. J. Raja, Principal" 
                  className="w-full h-[320px] object-cover object-center rounded-[20px] grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                />
              </div>
            </div>
            
            {/* Quick Contacts Card */}
            <div className="w-full max-w-xs mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-4">
              <div className="flex gap-3 items-start">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-450 block">Official Email</span>
                  <a href="mailto:principal@apec.ac.in" className="text-xs font-bold text-slate-800 hover:text-indigo-600 break-all">principal@apec.ac.in</a>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Building className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-455 block">Office Location</span>
                  <span className="text-xs font-bold text-slate-700 block">Principal's Office, Main Block, APEC Campus</span>
                </div>
              </div>
              <button 
                onClick={handleDownloadCV}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow hover:shadow-md hover:scale-[1.01]"
              >
                <Download className="w-3.5 h-3.5" />
                Download Academic CV
              </button>
            </div>
          </div>

          {/* Right: Academic Bio & Vision Statement */}
          <div className="w-full lg:w-8/12">
            <span className="font-display text-[9px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-3 inline-block">
              Principal Profile
            </span>
            <h2 className="font-title text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
              Dr. J. Raja, Ph.D.
            </h2>
            <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest block mb-6">
              Principal & Academic Chair, APEC (Autonomous)
            </span>
            
            <div className="space-y-4 text-xs md:text-sm text-slate-550 font-semibold leading-relaxed mb-6">
              <p>
                Dr. J. Raja is a distinguished academic leader, research guide, and the Principal of Adhiparasakthi Engineering College, Melmaruvathur. Under his executive direction, APEC has implemented major innovations under its autonomous curriculum status, establishing research collaborations and digital training portals.
              </p>
              <p>
                Dr. Raja holds a Doctorate in Engineering and has dedicated decades to teaching, mentoring, and advancing engineering policy frameworks. He works in close coordination with the Trust and University nodes to drive top placements and quality control.
              </p>
            </div>

            {/* Responsibilities and Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" /> Key Responsibilities
                </h4>
                <ul className="space-y-2 text-xs text-slate-500 font-semibold leading-relaxed list-none text-left">
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 mt-2 mr-2 shrink-0" />
                    <span>Academic & general administrative leadership of the autonomous college.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 mt-2 mr-2 shrink-0" />
                    <span>Overseeing Anna University and AICTE compliance audits.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-500 mt-2 mr-2 shrink-0" />
                    <span>Directing quality assurance operations and industry MoUs.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-650" /> Research Interests
                </h4>
                <ul className="space-y-2 text-xs text-slate-500 font-semibold leading-relaxed list-none text-left">
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-purple-500 mt-2 mr-2 shrink-0" />
                    <span>Structural Engineering & Sustainability.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-purple-500 mt-2 mr-2 shrink-0" />
                    <span>Sustainable Concrete Technology & Infrastructure.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-purple-500 mt-2 mr-2 shrink-0" />
                    <span>Outcome-Based Engineering Education Policies.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THE PRINCIPAL'S MESSAGE (Redesigned & Value-Centric) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-8 md:p-10 mb-20 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-655 flex items-center gap-1.5 mb-5 select-none">
            <MessageSquare className="w-3.5 h-3.5" /> Message from the Principal
          </span>
          
          <h3 className="font-title text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-snug">
            "Values-Driven Engineering for a Sustainable Future"
          </h3>
          
          <div className="space-y-4 text-xs md:text-sm text-slate-650 font-semibold leading-relaxed italic font-serif">
            <p>
              "Dear Students, Parents, and Stakeholders,
            </p>
            <p>
              At Adhiparasakthi Engineering College, our educational vision goes beyond the boundaries of traditional textbooks. Over the past 42 years, we have strived to build an ecosystem where technical competencies, industrial research, and spiritual human ethics converge.
            </p>
            <p>
              Our autonomous status gives us the unique flexibility to design student-centric curricula, integrate emerging fields like AI, Machine Learning, and Green Technologies, and secure top placement records. We welcome you to join our family and experience a transformation that trains you to serve society with technological innovations and moral integrity."
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-serif text-sm font-black text-slate-900 block">Dr. J. Raja, Ph.D.</span>
              <span className="font-display text-[10px] text-indigo-650 font-bold uppercase tracking-widest block mt-0.5">Principal, APEC Melmaruvathur</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white border border-indigo-150 px-3 py-1.5 rounded-lg shadow-sm">
                Counseling Code: 1401
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3. OTHER ADMINISTRATIVE OFFICERS (Short briefs, one after another) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-t border-slate-100 pt-16 mb-20 text-left"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Academic Administrators
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Academic Leadership Desk
          </h2>
          <p className="text-xs text-slate-400 font-semibold mb-12 max-w-xl">
            Brief profiles of our academic officers coordinating departmental excellence and student developments.
          </p>

          <div className="space-y-12">
            
            {/* Vice Principal */}
            <div className="flex flex-col md:flex-row gap-8 items-start bg-slate-50/50 border border-slate-150 p-6 md:p-8 rounded-3xl hover:border-indigo-300 hover:bg-white transition-all duration-300">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-sm border border-slate-200">
                <img src={vpImg} alt="Dr. A. Bhuvaneshwari" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-left grow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Dr. A. Bhuvaneshwari, M.E., Ph.D.</h3>
                    <span className="text-[10px] text-indigo-650 font-extrabold uppercase tracking-widest mt-0.5 block">Vice Principal</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    Office: Main Block
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">
                  Dr. A. Bhuvaneshwari serves as the Vice Principal of Adhiparasakthi Engineering College, bringing extensive expertise in engineering academics and institutional governance. She actively supports student welfare initiatives, academic policy implementation, and quality enhancement programs across all departments.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 border-t border-slate-200/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <a href="mailto:viceprincipal@apec.ac.in" className="hover:underline">viceprincipal@apec.ac.in</a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>M.E., Ph.D. (Computer Science & Engineering)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dean */}
            <div className="flex flex-col md:flex-row gap-8 items-start bg-slate-50/50 border border-slate-150 p-6 md:p-8 rounded-3xl hover:border-pink-300 hover:bg-white transition-all duration-300">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-sm border border-slate-200">
                <img src={deanImg} alt="Dr. V. Ramasamy" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-left grow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Dr. V. Ramasamy, Ph.D.</h3>
                    <span className="text-[10px] text-pink-650 font-extrabold uppercase tracking-widest mt-0.5 block">Dean (Academic Affairs)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    Office: Admin Block
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">
                  Dr. V. Ramasamy is the Dean of Adhiparasakthi Engineering College, responsible for overseeing academic affairs and ensuring compliance with Anna University curriculum standards. Under his leadership, the institution has expanded its digital infrastructure and championed student-centric department innovations.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 border-t border-slate-200/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <Mail className="w-3.5 h-3.5 text-pink-650" />
                    <a href="mailto:dean@apec.ac.in" className="hover:underline">dean@apec.ac.in</a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-pink-650" />
                    <span>Ph.D. (Electrical Engineering)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 4. CONTACT DIRECTORY DIRECTORY (Redesigned & Modern) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-t border-slate-100 pt-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Communication Portal
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Institutional Contacts Directory
          </h2>
          <p className="text-xs text-slate-400 font-semibold mb-8 max-w-xl">
            Get in touch with our admissions department, principal office, or general administrative desks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Admissions */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col justify-between hover:border-indigo-500 hover:bg-white hover:shadow-md transition-all duration-300">
              <div>
                <span className="font-display block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-3">Office node 1</span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1.5">Admissions Cell</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-6">Connect with our dedicated help desk regarding course intakes, counseling codes, and admission procedures.</p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <a href={`tel:+91${branding.helpline1}`} className="hover:text-indigo-600 transition-colors font-mono">{branding.helpline1}</a>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <a href={`tel:+91${branding.helpline2}`} className="hover:text-indigo-600 transition-colors font-mono">{branding.helpline2}</a>
                </div>
              </div>
            </div>

            {/* Academic Office */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col justify-between hover:border-pink-500 hover:bg-white hover:shadow-md transition-all duration-300">
              <div>
                <span className="font-display block text-[8px] font-black text-pink-600 uppercase tracking-widest mb-3">Office node 2</span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1.5">Academic Deans</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-6">Contact the offices of the Vice Principal and Academic Deans regarding curriculum schedules and department details.</p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-pink-600" />
                  <a href="mailto:viceprincipal@apec.ac.in" className="hover:text-pink-600 transition-colors break-all">viceprincipal@apec.ac.in</a>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-pink-600" />
                  <a href="mailto:dean@apec.ac.in" className="hover:text-pink-600 transition-colors break-all">dean@apec.ac.in</a>
                </div>
              </div>
            </div>

            {/* General Administration */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col justify-between hover:border-emerald-500 hover:bg-white hover:shadow-md transition-all duration-300">
              <div>
                <span className="font-display block text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-3">Office node 3</span>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1.5">Administrative Officer</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-6">Get in touch with general operations, vendor support desks, scholarship queries, and campus logistics.</p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <a href="mailto:admin@apec.ac.in" className="hover:text-emerald-600 transition-colors break-all font-mono">admin@apec.ac.in</a>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-700">Admin Office, Melmaruvathur</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
