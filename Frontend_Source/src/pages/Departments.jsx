import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, ArrowRight, GraduationCap, Search, Sparkles, X, 
  BookOpen, Award, Users, ShieldCheck, ChevronRight, Layers, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';
import { getDepartmentUrl } from '../utils/subdomain';

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
  sh: '/Images/Dept/S&H dept.jpg',
  'phd-civil': '/Images/Dept/phd.civil.jpg',
  'phd-mech': '/Images/Dept/phd.mech.jpg',
  'phd-eee': '/Images/Dept/phd.eee.jpg',
  'phd-ece': '/Images/Dept/phd.ece.jpg',
  default: '/Images/Dept/cse dept.png'
};

const categoryBadgeStyles = {
  ug_be: { label: 'UG (B.E.)', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 font-bold' },
  ug_btech: { label: 'UG (B.Tech)', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-bold' },
  pg_me: { label: 'PG (M.E.)', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 font-bold' },
  pg_other: { label: 'PG (MCA / MBA)', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 font-bold' },
  phd: { label: 'Ph.D. Center', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 font-bold' }
};

export default function Departments() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
  const ugCount = depts.filter(d => d.category === 'ug_be' || d.category === 'ug_btech').length;
  const meCount = depts.filter(d => d.category === 'pg_me').length;
  const pgOtherCount = depts.filter(d => d.category === 'pg_other').length;
  const phdCount = depts.filter(d => d.category === 'phd').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 sm:pt-8 md:pt-10 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden text-gray-900">
      {/* Premium Ambient Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-100/50 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1550px] mx-auto relative z-10">
        
        {/* Elite Centered Heading */}
        <div className="mb-4 sm:mb-5 text-center max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 font-title text-center"
          >
            Our Academic Departments
          </motion.h1>
        </div>

        {/* Elite Floating Metrics Bar */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-5 max-w-5xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-2xl p-2 sm:p-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            
            {/* Metric 1 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/90 hover:bg-indigo-50/90 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm shrink-0">
                {ugCount}
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs font-black text-slate-900 leading-tight truncate">UG Degrees</span>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block truncate">B.E. / B.Tech</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-amber-50/70 border border-amber-100/90 hover:bg-amber-50/90 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm shrink-0">
                {meCount}
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs font-black text-slate-900 leading-tight truncate">M.E. Programs</span>
                <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider block truncate">Postgraduate</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-purple-50/70 border border-purple-100/90 hover:bg-purple-50/90 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm shrink-0">
                {pgOtherCount}
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs font-black text-slate-900 leading-tight truncate">MCA & MBA</span>
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block truncate">Professional</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-rose-50/70 border border-rose-100/90 hover:bg-rose-50/90 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm shrink-0">
                {phdCount}
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs font-black text-slate-900 leading-tight truncate">Ph.D. Centers</span>
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block truncate">Research</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Elite Compact Mini-Nav Bar with Inline Search Icon Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 max-w-5xl mx-auto flex items-center justify-between gap-3 bg-slate-900 text-white p-1.5 sm:p-2 rounded-2xl shadow-xl border border-slate-800"
        >
          {/* Mini-Nav Category Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1 px-1 grow">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'ug', label: `UG Degrees (${ugCount})` },
              { id: 'pg_me', label: `M.E. Programs (${meCount})` },
              { id: 'pg_other', label: `MCA & MBA (${pgOtherCount})` },
              { id: 'phd', label: `Ph.D. Centers (${phdCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`py-2 px-3.5 sm:px-4 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Compact Search Control */}
          <div className="relative shrink-0 flex items-center pr-1">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 220 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search program..."
                    className="w-full text-xs py-2 pl-8 pr-7 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-xl outline-none focus:border-amber-400 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-white text-xs cursor-pointer p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer flex items-center justify-center shadow-inner"
                  title="Search Departments"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Department Cards Grid (Fluid Responsive 4 Columns with Uniform Height) */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab + searchTerm}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredDepts.length === 0 ? (
              <div className="col-span-full p-14 bg-white rounded-3xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
                <Search className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700 mb-1">No Matching Department Found</h3>
                <p className="text-xs text-slate-500 max-w-md mb-4">Try clearing your search keyword or switching category tabs.</p>
                <button
                  onClick={() => { setActiveTab('all'); setSearchTerm(''); setIsSearchOpen(false); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-sm cursor-pointer"
                >
                  Reset All Filters
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
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-400 hover:shadow-[0_16px_35px_rgba(217,119,6,0.12)] transition-all duration-300 text-left h-full"
                  >
                    {/* Department Image Header (Clean Compact Height) */}
                    <div className="w-full h-32 sm:h-36 overflow-hidden relative bg-slate-100 shrink-0">
                      <img 
                        src={departmentImages[dept.key] || departmentImages.default} 
                        alt={`${dept.name} Department`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = departmentImages.default; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      {/* Category Badge over Image */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badgeInfo.bg}`}>
                          {badgeInfo.label}
                        </span>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[9.5px] font-extrabold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{dept.duration}</span>
                      </div>
                    </div>

                    {/* Content Area (Carefully Proportioned & Aligned) */}
                    <div className="p-3.5 sm:p-4 flex flex-col grow justify-between">
                      <div>
                        {/* Department Name */}
                        <h3 className="text-sm sm:text-[15px] font-black text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors font-title line-clamp-2 min-h-[40px] flex items-start">
                          {dept.name}
                        </h3>

                        {/* Intake Info */}
                        <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-150 p-2 rounded-xl shrink-0">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Approved Intake: <strong className="text-slate-900">{dept.intake}</strong></span>
                        </div>

                        {/* Core Focus Pills */}
                        <div className="mb-2.5">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Key Focus Areas</span>
                          <div className="flex flex-wrap gap-1">
                            {dept.focus.split(', ').slice(0, 2).map((f, idx) => (
                              <span key={idx} className="text-[9.5px] font-bold bg-slate-100/80 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-full">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Stats Bar */}
                        <div className="grid grid-cols-3 gap-1.5 text-center my-2.5 border-t border-slate-100 pt-2">
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-150">
                            <span className="block text-[11px] font-black text-indigo-600 leading-tight">{facultyCount || 'Expert'}</span>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Faculty</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-150">
                            <span className="block text-[11px] font-black text-emerald-600 leading-tight">{labCount || 'Advanced'}</span>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Labs</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-150">
                            <span className="block text-[11px] font-black text-amber-600 leading-tight">{placementCount || 'High'}</span>
                            <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider">Placed</span>
                          </div>
                        </div>

                        {/* CTA Link */}
                        <a 
                          href={getDepartmentUrl(dept.key)}
                          className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-[10.5px] sm:text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer mt-1"
                        >
                          <span>Explore Portal</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
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
