import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Users, Calendar, Award, Globe, HeartHandshake, 
  Send, Search, CheckCircle2, UserCheck, Briefcase, Mail, Phone, 
  MapPin, FileText, ExternalLink, Sparkles, Building2, BookOpen
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function AlumniCell() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Distinguished Alumni Data
  const prominentAlumni = [
    {
      name: "Dr. K. Rajesh Kumar",
      batch: "Class of 2005",
      dept: "Mechanical Engineering",
      role: "Senior Director of Operations",
      company: "Tesla Inc., USA",
      location: "California, USA",
      achievement: "Pioneered automated assembly line optimizations for Next-Gen Electric Vehicles."
    },
    {
      name: "Mrs. Priya Sundaram",
      batch: "Class of 2008",
      dept: "Computer Science & Engg.",
      role: "Principal AI Architect",
      company: "Google Cloud",
      location: "Bengaluru, India",
      achievement: "Led enterprise LLM deployment frameworks for global South Asia clients."
    },
    {
      name: "Mr. S. Karthikeyan",
      batch: "Class of 2010",
      dept: "Electronics & Comm. Engg.",
      role: "Founder & CEO",
      company: "AeroTech Solutions",
      location: "Chennai, India",
      achievement: "Bootstrapped deep-tech drone surveillance startup valued at $15M."
    },
    {
      name: "Ms. Anitha Ramesh",
      batch: "Class of 2012",
      dept: "Information Technology",
      role: "Lead Product Manager",
      company: "Amazon AWS",
      location: "Seattle, USA",
      achievement: "Spearheaded cloud security tools serving over 250,000 active developers."
    },
    {
      name: "Mr. V. Balaji",
      batch: "Class of 2014",
      dept: "Electrical & Electronics Engg.",
      role: "Deputy General Manager",
      company: "NTPC Limited",
      location: "New Delhi, India",
      achievement: "Recognized with National Green Energy Innovation Award 2023."
    },
    {
      name: "Mr. M. Dinesh Kumar",
      batch: "Class of 2016",
      dept: "Civil Engineering",
      role: "Senior Structural Consultant",
      company: "L&T Construction",
      location: "Dubai, UAE",
      achievement: "Key structural design architect for mega metro and high-rise infrastructure."
    }
  ];

  // Upcoming & Past Events
  const events = [
    {
      title: "APEC Grand Alumni Reunion 2026 'Sangamam'",
      date: "December 28, 2026",
      venue: "Main Campus Auditorium, APEC Melmaruvathur",
      type: "Annual Meet",
      desc: "Annual homecoming gathering for all batches to reconnect with professors, batchmates, and witness campus advancements."
    },
    {
      title: "Silver Jubilee Celebration - Batch of 2001",
      date: "September 15, 2026",
      venue: "APEC Seminar Hall & Online Hybrid",
      type: "Milestone Reunion",
      desc: "Honoring 25 years of engineering excellence for the 2001 graduating class with special mementos and scholarship endowments."
    },
    {
      title: "Global Chapter Connect: USA & Canada Region",
      date: "November 08, 2026",
      venue: "Virtual Meet (Zoom & Teams)",
      type: "Global Meet",
      desc: "Interactive session bringing together North American alumni to expand international internship and MS guidance networks."
    },
    {
      title: "Alumni Innovation & Mentorship Drive",
      date: "October 12, 2026",
      venue: "APEC Incubation Center",
      type: "Mentorship",
      desc: "Mock interview marathons, resume reviews, and startup pitching feedback for final year B.E. / B.Tech students."
    }
  ];

  // Office Bearers & Coordinators
  const officeBearers = [
    { name: "Dr. J. Raja", role: "Patron & Principal", contact: "principal@apec.edu.in" },
    { name: "Mr. R. Vignesh", role: "Alumni Officer & Chief Coordinator", contact: "alumni@apec.edu.in | +91 7418064336" },
    { name: "Prof. S. Mothilal", role: "Faculty Coordinator (Mech)", contact: "mech.alumni@apec.edu.in" },
    { name: "Dr. N. Elamathi", role: "Faculty Coordinator (AIML/CSE)", contact: "cse.alumni@apec.edu.in" }
  ];

  // Filtered Alumni List
  const filteredAlumni = prominentAlumni.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.dept.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-12 md:py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-left">
        
        {/* TOP BREADCRUMB & HEADER BADGE */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-purple-700 bg-purple-100/70 border border-purple-200 px-4 py-1.5 rounded-full uppercase shadow-xs">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>APEC Global Alumni Network</span>
          </div>
          <a 
            href="/Documents/PDFs/Committees/4. Alumni Cell.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-purple-700 bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-xs hover:border-purple-300 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Alumni Cell PDF Guidelines</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>

        {/* HERO TITLE & HERO CONTENT */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 leading-tight">
              Adhiparasakthi Engineering College <span className="text-purple-300">Alumni Cell</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-medium leading-relaxed mb-8">
              Connecting thousands of proud APEC graduates across the globe. Our Alumni Association fosters lifelong bonds, student mentorship, career guidance, and collaborative growth between past and present scholars.
            </p>

            {/* QUICK HIGHLIGHT STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">15,000+</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Global Alumni</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-purple-300">25+</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Batches Graduated</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">12+</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Regional Chapters</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-sky-400">500+</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">Mentors & Talks</div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE TAB NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 border-b border-gray-200 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Objectives', icon: BookOpen },
            { id: 'alumni-list', label: 'Distinguished Alumni', icon: Award },
            { id: 'events', label: 'Reunions & Events', icon: Calendar },
            { id: 'contact', label: 'Cell Committee & Contact', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Mission & Key Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold mb-5">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 font-title">
                    Cell Mission & Vision
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4">
                    The APEC Alumni Cell strives to create a vibrant global ecosystem connecting past graduates, current students, faculty, and industry leaders. We enable seamless communication, continuous learning, and collective pride.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Through structured mentorship, placement assistance, guest lectures, and campus development funds, the Alumni Association empowers the next generation of engineers to excel in their careers.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-150 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center text-white font-bold mb-5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-purple-950 mb-4 font-title">
                    Core Objectives
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Maintain an active and updated directory of global APEC alumni.",
                      "Organize annual reunions, milestone meets, and regional chapter gatherings.",
                      "Engage alumni for student mentorship, mock interviews, and career counseling.",
                      "Facilitate alumni guest lectures, workshops, and industry exposure webinars.",
                      "Encourage alumni contributions for lab enhancements and merit scholarships."
                    ].map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm font-bold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Key Features & Initiatives */}
              <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 font-title">
                  Alumni Engagement Initiatives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all">
                    <HeartHandshake className="w-8 h-8 text-purple-600 mb-3" />
                    <h4 className="font-extrabold text-sm text-gray-900 mb-1">Student Mentorship</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      One-on-one resume guidance, technical interview drills, and career roadmaps provided by senior alumni.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all">
                    <Building2 className="w-8 h-8 text-indigo-600 mb-3" />
                    <h4 className="font-extrabold text-sm text-gray-900 mb-1">Placement Tie-ups</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Alumni entrepreneurs and corporate managers offer off-campus hiring opportunities and internships.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all">
                    <Award className="w-8 h-8 text-amber-500 mb-3" />
                    <h4 className="font-extrabold text-sm text-gray-900 mb-1">Distinguished Awards</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      Annual recognition of prominent alumni achievements in engineering, innovation, and public service.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* DISTINGUISHED ALUMNI TAB */}
          {activeTab === 'alumni-list' && (
            <motion.div 
              key="alumni-list"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search & Filter Bar */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search by name, company, role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Filter Dept:</span>
                  <select 
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="w-full sm:w-auto bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-extrabold text-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All Departments</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Computer Science">Computer Science (CSE)</option>
                    <option value="Electronics">Electronics & Comm (ECE)</option>
                    <option value="Information Technology">Information Tech (IT)</option>
                    <option value="Electrical">Electrical & Elect (EEE)</option>
                    <option value="Civil">Civil Engineering</option>
                  </select>
                </div>
              </div>

              {/* Alumni Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((alumnus, idx) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-extrabold text-base text-gray-900">{alumnus.name}</h3>
                          <span className="text-xs font-bold text-purple-600">{alumnus.dept}</span>
                        </div>
                        <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full shrink-0">
                          {alumnus.batch}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-3.5 mb-4 border border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-800 mb-1">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{alumnus.role}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{alumnus.company}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{alumnus.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                        "{alumnus.achievement}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">APEC Distinguished Alumnus</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <motion.div 
              key="events"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((evt, idx) => (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:border-purple-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase">
                          {evt.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          <span>{evt.date}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-gray-900 mb-2 font-title leading-snug">{evt.title}</h3>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                        {evt.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CONTACT & COMMITTEE TAB */}
          {activeTab === 'contact' && (
            <motion.div 
              key="contact"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Committee Members */}
              <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-title flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Alumni Cell Office Bearers</span>
                </h3>
                <div className="space-y-4">
                  {officeBearers.map((bearer, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-sm text-gray-900">{bearer.name}</div>
                        <div className="text-xs font-bold text-purple-700">{bearer.role}</div>
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {bearer.contact}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Office Address & Helpdesk */}
              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black mb-4 font-title flex items-center gap-2 text-purple-300">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span>Cell Office & Helpdesk</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6">
                    For transcripts, alumni verification, reunion registrations, or campus visit permissions, please contact our dedicated alumni officer.
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm font-bold text-slate-200">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Alumni Cell Office, Main Block, APEC Campus, Melmaruvathur - 603 319.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>alumni@apec.edu.in</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>+91 7418064336 / 044-27529247</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs font-extrabold text-purple-200">
                  Adhiparasakthi Engineering College • Autonomous Institution
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
