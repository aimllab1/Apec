import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, ArrowRight, GraduationCap, BookOpen, Award, Users, Search, 
  Sparkles, Filter, CheckCircle2, ChevronRight, Layers, Cpu, Database, 
  Zap, Flame, HardHat, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';

const departmentImages = {
  aiml: '/Images/Dept/aiml dept.jpg',
  cse: '/Images/Dept/cse dept.png',
  it: '/Images/Dept/it dept.jpg',
  ece: '/Images/Dept/ece dept.jpg',
  eee: '/Images/Dept/eee dept.jpg',
  mech: '/Images/Dept/mech dept.jpg',
  civil: '/Images/Dept/civil dept.jpg',
  chemical: '/Images/Dept/chem dept.jpg',
  agri: '/Images/Dept/agri dept.jpg',
  aids: '/Images/Dept/ai ds dept.jpg',
  csd: '/Images/Dept/csd  dept.jpg',
  mca: '/Images/Dept/MCA.jpg',
  mba: '/Images/Dept/MBA.jpg',
  'me-cse': '/Images/Dept/me.cse.jpg',
  'me-thermal': '/Images/Dept/me.thermak.jpg',
  'me-vlsi': '/Images/Dept/m.e.vlsi.jpg',
  'me-ped': '/Images/Dept/power-electronics-electrical-drives.jpg',
  'me-cem': '/Images/Dept/m.e.construction engg and mangement.jpg',
  sh: '/Images/Dept/cse dept.png',
  'phd-civil': '/Images/Dept/phd.civil.jpg',
  'phd-mech': '/Images/Dept/phd.mech.jpg',
  'phd-eee': '/Images/Dept/phd.eee.jpg',
  'phd-ece': '/Images/Dept/phd.ece.jpg',
  default: '/Images/Dept/cse dept.png'
};

const categoryBadgeStyles = {
  ug_be: { label: 'UG Programme (B.E.)', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700' },
  ug_btech: { label: 'UG Programme (B.Tech.)', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700' },
  pg_me: { label: 'PG Programme (M.E.)', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700' },
  pg_other: { label: 'PG Programme (MCA / MBA)', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700' },
  phd: { label: 'Ph.D. Research Center', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700' }
};

export default function Departments() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortOrder = [
    // Undergraduate Programs
    'civil', 'mech', 'eee', 'ece', 'cse', 'aiml', 'csd', 'it', 'chemical', 'agri', 'aids', 'sh',
    // Postgraduate M.E. Programs
    'me-cse', 'me-vlsi', 'me-ped', 'me-thermal', 'me-cem',
    // Postgraduate MCA & MBA
    'mca', 'mba',
    // Ph.D. Research Centers
    'phd-civil', 'phd-mech', 'phd-ece', 'phd-eee'
  ];

  // Process departments from JSON or local storage config
  const currentDeptsData = (() => {
    const saved = localStorage.getItem('apec_departments_data');
    return saved ? JSON.parse(saved) : departmentsData;
  })();

  const depts = Object.values(currentDeptsData).map(dept => {
    const isME = dept.key.startsWith('me-');
    const isPGOther = dept.key === 'mca' || dept.key === 'mba';
    const isPhD = dept.key.startsWith('phd-');
    const isBTech = ['it', 'chemical', 'agri', 'aids'].includes(dept.key);

    let category = 'ug_be';
    if (isPhD) category = 'phd';
    else if (isME) category = 'pg_me';
    else if (isPGOther) category = 'pg_other';
    else if (isBTech) category = 'ug_btech';

    // Program metadata definitions
    let duration = "4 Years";
    let intake = "60 Seats";
    let focus = "";

    if (dept.key === 'me-cse') {
      duration = "2 Years";
      intake = "9 Seats";
      focus = "Advanced Algorithms, Cloud Architecture, Deep Learning, Software Security";
    } else if (dept.key === 'me-vlsi') {
      duration = "2 Years";
      intake = "9 Seats";
      focus = "Analog & Digital IC Design, System-on-Chip (SoC), Low Power VLSI, EDA Tools";
    } else if (dept.key === 'me-ped') {
      duration = "2 Years";
      intake = "9 Seats";
      focus = "Smart Grids, Renewable Energy Topologies, Electric Vehicle Drives, Power Converters";
    } else if (dept.key === 'me-thermal') {
      duration = "2 Years";
      intake = "9 Seats";
      focus = "Computational Fluid Dynamics (CFD), Advanced Heat Exchangers, Sustainable Energy Systems";
    } else if (dept.key === 'me-cem') {
      duration = "2 Years";
      intake = "9 Seats";
      focus = "Construction Project Scheduling, Building Information Modeling (BIM), Contract Management";
    } else if (isPhD) {
      duration = "3 - 5 Years";
      intake = "Based on Vacancy";
      focus = "Advanced Research Methodologies, High-Impact Publications, Thesis & Patent Filings";
    } else if (dept.key === 'aiml') {
      duration = "4 Years";
      intake = "30 Seats";
      focus = "Neural Networks, Deep Learning, Python Data Science, Artificial Intelligence";
    } else if (dept.key === 'cse') {
      duration = "4 Years";
      intake = "90 Seats";
      focus = "AI, Cloud Computing, Full-Stack Web Development, Software Engineering";
    } else if (dept.key === 'it') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Network Architectures, Cloud Infrastructure, Web Essentials, Cybersecurity";
    } else if (dept.key === 'chemical') {
      duration = "4 Years";
      intake = "40 Seats";
      focus = "Process Control, Fluid Dynamics, Chemical Reaction Engineering, Mass Transfer";
    } else if (dept.key === 'mech') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "CAD/CAM Robotics, Thermal Engineering, Fluid Machinery, IoT Mechatronics";
    } else if (dept.key === 'civil') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Structural Analysis, Geotechnical Engg, Concrete Tech, Surveying & GIS";
    } else if (dept.key === 'mca') {
      duration = "2 Years";
      intake = "60 Seats";
      focus = "Enterprise Software Development, Cloud Databases, Mobile App Dev, Systems Testing";
    } else if (dept.key === 'eee') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Power Systems, Electrical Machines, Control Systems, Smart Grid Automation";
    } else if (dept.key === 'ece') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "VLSI Circuits, Embedded IoT Systems, Signal Processing, Digital Communications";
    } else if (dept.key === 'mba') {
      duration = "2 Years";
      intake = "60 Seats";
      focus = "Strategic Management, Corporate Finance, Marketing Analytics, HR Leadership";
    } else if (dept.key === 'sh') {
      duration = "1 Year";
      intake = "N/A";
      focus = "Engineering Mathematics, Applied Physics, Applied Chemistry, Technical English";
    } else if (dept.key === 'csd') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "UI/UX Design, Computer Graphics, Visual Computing, Web & Mobile App Design";
    } else if (dept.key === 'agri') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Farm Machinery, Precision Irrigation, Post-Harvest Tech, Food Engineering";
    } else if (dept.key === 'aids') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Big Data Analytics, Statistical Machine Learning, Data Mining, Predictive Modeling";
    }

    return {
      ...dept,
      category,
      duration,
      intake,
      focus: focus || "Core Engineering Fundamentals & Advanced Practical Labs"
    };
  }).sort((a, b) => {
    const indexA = sortOrder.indexOf(a.key);
    const indexB = sortOrder.indexOf(b.key);
    return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
  });

  // Filter departments based on search and selected tab
  const filteredDepts = depts.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (dept.about && dept.about.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (dept.focus && dept.focus.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          dept.key.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'ug') return (dept.category === 'ug_be' || dept.category === 'ug_btech') && matchesSearch;
    if (activeTab === 'pg_me') return dept.category === 'pg_me' && matchesSearch;
    if (activeTab === 'pg_other') return dept.category === 'pg_other' && matchesSearch;
    if (activeTab === 'phd') return dept.category === 'phd' && matchesSearch;
    
    return matchesSearch;
  });

  // Counts for summary metrics
  const totalCount = depts.length;
  const ugCount = depts.filter(d => d.category === 'ug_be' || d.category === 'ug_btech').length;
  const meCount = depts.filter(d => d.category === 'pg_me').length;
  const pgOtherCount = depts.filter(d => d.category === 'pg_other').length;
  const phdCount = depts.filter(d => d.category === 'phd').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden text-gray-900">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Hero Section */}
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 font-title text-center mb-10"
          >
            Our Academic Departments
          </motion.h1>

          {/* Quick Metrics Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-md max-w-3xl mx-auto"
          >
            <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-2xl font-black text-indigo-600">{ugCount}</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">UG Degrees</span>
            </div>
            <div className="p-3 text-center rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="block text-2xl font-black text-amber-600">{meCount}</span>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">M.E. Programs</span>
            </div>
            <div className="p-3 text-center rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="block text-2xl font-black text-purple-600">{pgOtherCount}</span>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">MCA & MBA</span>
            </div>
            <div className="p-3 text-center rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="block text-2xl font-black text-rose-600">{phdCount}</span>
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Ph.D. Centers</span>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-10 bg-white/90 backdrop-blur-md border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {[
              { id: 'all', label: `All Programs (${totalCount})` },
              { id: 'ug', label: `Undergraduate (${ugCount})` },
              { id: 'pg_me', label: `M.E. Programs (${meCount})` },
              { id: 'pg_other', label: `MCA / MBA (${pgOtherCount})` },
              { id: 'phd', label: `Ph.D. Centers (${phdCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`py-2.5 px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer grow lg:grow-0 text-center ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 shrink-0">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search departments or focus areas..."
              className="w-full text-sm py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Department Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + searchTerm}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredDepts.length === 0 ? (
              <div className="col-span-full p-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
                <Search className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Departments Found</h3>
                <p className="text-sm text-slate-500 max-w-md">No programs match your current search query. Try clearing the filter or searching for another keyword.</p>
                <button
                  onClick={() => { setActiveTab('all'); setSearchTerm(''); }}
                  className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredDepts.map((dept) => {
                const badgeInfo = categoryBadgeStyles[dept.category] || categoryBadgeStyles.ug_be;
                const facultyCount = Array.isArray(dept.faculty) ? dept.faculty.length : 0;
                const labCount = Array.isArray(dept.labs) ? dept.labs.length : 0;
                const placementCount = Array.isArray(dept.placements) ? dept.placements.length : 0;

                return (
                  <motion.div 
                    key={dept.key}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-indigo-400 hover:shadow-[0_20px_45px_rgba(99,102,241,0.08)] transition-all duration-300 text-left"
                  >
                    <div>
                      {/* Department Image Header */}
                      <div className="w-full h-52 overflow-hidden relative bg-slate-100">
                        <img 
                          src={departmentImages[dept.key] || departmentImages.default} 
                          alt={`${dept.name} Department`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.target.src = departmentImages.default; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                        
                        {/* Category Badge over Image */}
                        <div className="absolute top-4 left-4">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${badgeInfo.bg}`}>
                            {badgeInfo.label}
                          </span>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[11px] font-extrabold text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{dept.duration}</span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6">
                        {/* Department Name */}
                        <h3 className="text-xl font-black text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors font-title">
                          {dept.name}
                        </h3>

                        {/* Intake Info */}
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Approved Intake: <strong className="text-slate-900">{dept.intake}</strong></span>
                        </div>

                        {/* Core Focus Pills */}
                        <div className="mb-6">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Key Focus Areas</span>
                          <div className="flex flex-wrap gap-1.5">
                            {dept.focus.split(', ').slice(0, 3).map((f, idx) => (
                              <span key={idx} className="text-[11px] font-bold bg-indigo-50/70 border border-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Footer Link */}
                    <div className="px-6 pb-6 pt-2">
                      <div className="grid grid-cols-3 gap-2 text-center mb-5 border-t border-slate-100 pt-4">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="block text-sm font-black text-indigo-600">{facultyCount || 'Expert'}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Faculty</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="block text-sm font-black text-emerald-600">{labCount || 'Advanced'}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Labs</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="block text-sm font-black text-amber-600">{placementCount || 'High'}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Placements</span>
                        </div>
                      </div>

                      <Link 
                        to={`/departments/${dept.key}`}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                      >
                        <span>Explore Department Portal</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
