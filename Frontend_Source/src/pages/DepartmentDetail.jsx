import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, Users, Award, Briefcase, 
  Search, Mail, GraduationCap, Trophy, 
  BookOpenCheck, UserCheck, Milestone, Library, FileText,
  // New icons for department hero & KPIs
  Cpu, Laptop, BrainCircuit, Zap, Settings, Hammer, FlaskConical, Sprout, Building, ExternalLink
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

export default function DepartmentDetail() {
  const { id } = useParams();
  
  // Dynamically load from localStorage config to support the content editor
  const dept = (() => {
    const saved = localStorage.getItem('apec_departments_data');
    const data = saved ? JSON.parse(saved) : departmentsData;
    return data[id] || data.cse;
  })();
  const deptImage = departmentImages[id] || departmentImages[dept.key] || departmentImages.default;

  // Department icon mapping
  const departmentIcons = {
    aiml: BrainCircuit,
    aids: BrainCircuit,
    cse: Cpu,
    csd: Cpu,
    it: Laptop,
    ece: Zap,
    eee: Zap,
    mech: Settings,
    civil: Hammer,
    chemical: FlaskConical,
    agri: Sprout,
    mca: GraduationCap,
    mba: Briefcase,
    sh: BookOpen,
    'me-cse': Cpu,
    'me-vlsi': Zap,
    'me-ped': Zap,
    'me-thermal': Settings,
    'me-cem': Hammer,
    default: Building
  };

  const DeptIcon = departmentIcons[dept.key] || departmentIcons.default;

  // Department establishment years
  const deptEstYears = {
    civil: "1984",
    mech: "1984",
    eee: "1993",
    ece: "1984",
    cse: "1993",
    it: "2001",
    chemical: "1997",
    aiml: "2023",
    csd: "2021",
    agri: "2021",
    aids: "2022",
    mca: "1998",
    mba: "1995",
    'me-cse': "2009",
    'me-vlsi': "2009",
    'me-ped': "2009",
    'me-thermal': "2009",
    'me-cem': "2006"
  };

  // Attempt to parse establishment year dynamically or use fallback
  const estYearMatch = dept.about ? dept.about.match(/(?:established|started|started in|inception in|year of|est\.)\s+(?:the\s+year\s+(?:of\s+)?)?(\d{4})/i) : null;
  const estYear = deptEstYears[dept.key] || (estYearMatch ? estYearMatch[1] : null);

  // NBA accreditation indicator
  const isNBA = dept.about && (dept.about.includes('NBA') || dept.about.toLowerCase().includes('nba accredited'));

  // Get intake capacities dynamically based on current department
  const deptIntakeCourses = (() => {
    const mapping = {
      civil: [{ name: "B.E. Civil Engineering", duration: "4 Years", seats: 60 }],
      mech: [{ name: "B.E. Mechanical Engineering", duration: "4 Years", seats: 60 }],
      eee: [{ name: "B.E. Electrical and Electronics Engineering", duration: "4 Years", seats: 60 }],
      ece: [{ name: "B.E. Electronics and Communication Engineering", duration: "4 Years", seats: 90 }],
      cse: [{ name: "B.E. Computer Science and Engineering", duration: "4 Years", seats: 90 }],
      it: [{ name: "B.Tech. Information Technology", duration: "4 Years", seats: 60 }],
      chemical: [{ name: "B.Tech. Chemical Engineering", duration: "4 Years", seats: 40 }],
      aiml: [{ name: "B.E. Computer Science & Engineering (Artificial Intelligence and Machine Learning)", duration: "4 Years", seats: 30 }],
      csd: [{ name: "B.E. Computer Science & Engineering (Computer System Design)", duration: "4 Years", seats: 30 }],
      agri: [{ name: "B.Tech. Agricultural Engineering", duration: "4 Years", seats: 40 }],
      aids: [{ name: "B.Tech. Artificial Intelligence and Data Science", duration: "4 Years", seats: 60 }],
      mca: [{ name: "Master of Computer Applications (MCA)", duration: "2 Years", seats: 60 }],
      mba: [{ name: "Master of Business Administration (MBA)", duration: "2 Years", seats: 60 }],
      'me-cse': [{ name: "M.E. Computer Science and Engineering", duration: "2 Years", seats: 9 }],
      'me-vlsi': [{ name: "M.E. VLSI Design", duration: "2 Years", seats: 9 }],
      'me-ped': [{ name: "M.E. Power Electronics & Drives Engineering", duration: "2 Years", seats: 9 }],
      'me-thermal': [{ name: "M.E. Thermal Engineering", duration: "2 Years", seats: 18 }],
      'me-cem': [{ name: "M.E. Construction Engineering and Management", duration: "2 Years", seats: 18 }],
      sh: [{ name: "Science & Humanities", duration: "1 Year", seats: 0, label: "N/A" }],
      'phd-civil': [{ name: "Ph.D. Civil Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-mech': [{ name: "Ph.D. Mechanical Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-ece': [{ name: "Ph.D. Electronics and Communication Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-eee': [{ name: "Ph.D. Electrical and Electronics Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
    };
    return mapping[dept.key] || [{ name: dept.name, duration: "4 Years", seats: 60 }];
  })();

  // Calculate total intake seats dynamically from the courses array
  const totalSeats = deptIntakeCourses.reduce((sum, course) => sum + course.seats, 0);
  const displayIntakeValue = totalSeats > 0 ? totalSeats : (deptIntakeCourses[0]?.seats === 0 && dept.key.startsWith('phd-') ? "Vacancy" : "N/A");
  const displayIntakeLabel = totalSeats > 0 ? "Intake Capacity" : (dept.key.startsWith('phd-') ? "Based on Vacancy" : "Intake Capacity");

  // Local state for tabs
  const [activeSubTab, setActiveSubTab] = useState('overview');
  // Local state for faculty search
  const [facultySearch, setFacultySearch] = useState('');
  // Local state for publication search
  const [pubSearch, setPubSearch] = useState('');

  // Local state for sub-publication tabs (journals, books, conferences)
  const [activePubType, setActivePubType] = useState('journals');

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Department Not Found</h2>
          <Link to="/departments" className="text-indigo-600 hover:underline text-sm font-bold">Back to Departments</Link>
        </div>
      </div>
    );
  }

  // Filtered Faculty
  const filteredFaculty = (dept.faculty || []).filter(f => 
    f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
    (f.qualification || '').toLowerCase().includes(facultySearch.toLowerCase()) ||
    (f.designation || '').toLowerCase().includes(facultySearch.toLowerCase())
  );

  // Filtered Journals
  const filteredJournals = (dept.publications?.journals || []).filter(j => 
    j.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.author.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.journal.toLowerCase().includes(pubSearch.toLowerCase())
  );

  // Tabs structure
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'labs', label: 'Laboratories', icon: Library },
    { id: 'curriculum', label: 'PEOs & Outcomes', icon: Milestone },
    { id: 'publications', label: 'Research & Books', icon: BookOpenCheck },
    { id: 'achievements', label: 'Placements & Ranks', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/departments" 
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-550 hover:text-indigo-650 transition-colors bg-white hover:bg-gray-50 border border-gray-200/80 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 rounded-3xl mb-12 flex flex-col gap-8 hover:shadow-md transition-shadow duration-300 animate-fadeIn"
        >
          {/* Top Row: Image & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Department Image */}
            <div className="w-full h-56 sm:h-64 md:h-72 md:col-span-5 rounded-2xl overflow-hidden shadow-sm relative group">
              <img 
                src={deptImage} 
                alt={`${dept.name} Department`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right Column: Title and Details */}
            <div className="flex flex-col justify-center items-start text-left md:col-span-7 space-y-5">
              <div className="space-y-4 w-full">
                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase">
                    Department Portal
                  </span>
                  {estYear && (
                    <span className="text-[10px] font-extrabold tracking-widest text-gray-650 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full uppercase">
                      Est. {estYear}
                    </span>
                  )}
                  {isNBA ? (
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase animate-pulse">
                      NBA Accredited
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-full uppercase">
                      AICTE Approved
                    </span>
                  )}
                </div>
                
                {/* Title with Logo/Icon */}
                <div className="flex items-center gap-3.5 pt-1">
                  <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2.5 sm:p-3 rounded-2xl shrink-0 shadow-sm">
                    <DeptIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-title tracking-tight text-gray-900 leading-tight">
                    {dept.name.replace(/^Department of\s+/i, '')}
                  </h1>
                </div>
                
                {/* College & Location */}
                <p className="text-xs sm:text-sm md:text-base text-gray-550 font-bold leading-relaxed flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                  Adhiparasakthi Engineering College
                  <span className="text-gray-300">•</span>
                  Melmaruvathur
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 KPI Cards */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-6 border-t border-gray-150"
          >
            
            {/* KPI 1: Laboratories */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group bg-gradient-to-br from-blue-50/60 to-indigo-50/20 backdrop-blur-md border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
            >
              <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                <FlaskConical className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">{(dept.labs || []).length}</span>
                <span className="text-[10px] font-black uppercase text-blue-750 tracking-wider">Laboratories</span>
              </div>
            </motion.div>

            {/* KPI 2: Publications */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group bg-gradient-to-br from-purple-50/60 to-fuchsia-50/20 backdrop-blur-md border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-[0_12px_32px_rgba(147,51,234,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
            >
              <div className="bg-purple-650 text-white p-3.5 rounded-xl shadow-md shadow-purple-500/20 group-hover:rotate-6 transition-transform duration-300">
                <BookOpen className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-900 to-fuchsia-950 bg-clip-text text-transparent tracking-tight">
                  {(dept.publications?.journals || []).length + (dept.publications?.books || []).length + (dept.publications?.conferences || []).length}
                </span>
                <span className="text-[10px] font-black uppercase text-purple-750 tracking-wider">Publications</span>
              </div>
            </motion.div>

            {/* KPI 3: Intake Capacity */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group bg-gradient-to-br from-amber-50/60 to-orange-50/20 backdrop-blur-md border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
            >
              <div className="bg-amber-600 text-white p-3.5 rounded-xl shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform duration-300">
                <GraduationCap className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent tracking-tight">
                  {displayIntakeValue}
                </span>
                <span className="text-[10px] font-black uppercase text-amber-750 tracking-wider">
                  {displayIntakeLabel}
                </span>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Tab Selection */}
        <div className="flex flex-row flex-nowrap overflow-x-auto gap-1 bg-white p-1 rounded-xl sm:rounded-2xl border border-gray-200 mb-8 sm:mb-12 w-full shadow-sm hide-scrollbar snap-x snap-mandatory scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setFacultySearch('');
                  setPubSearch('');
                }}
                className={`flex flex-row items-center justify-center gap-1.5 text-[10px] sm:text-xs md:text-sm font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl transition-all cursor-pointer whitespace-nowrap grow shrink-0 snap-start ${
                  activeSubTab === tab.id 
                    ? 'bg-indigo-650 text-white shadow-md' 
                    : 'text-gray-500 hover:text-indigo-650 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* TAB 1: OVERVIEW */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* About Block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 font-title text-indigo-650 flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> About the Department
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                      {dept.about}
                    </p>
                  </div>

                  {/* Vision & Mission Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                    {/* Vision Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                          <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Vision
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-semibold italic">
                          "{dept.vision}"
                        </p>
                      </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                        <UserCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Mission
                      </h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {dept.mission.map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex items-start gap-2 sm:gap-2.5 font-semibold">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Approved Intake Capacities */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 font-title flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Approved Intake Capacities
                    </h3>
                    <div className="overflow-hidden border border-gray-250 rounded-2xl bg-white shadow-sm">
                      <table className="w-full text-xs md:text-sm text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-250 text-gray-550 uppercase text-[10px] font-black tracking-wider">
                            <th className="py-3 px-4">Programme</th>
                            <th className="py-3 px-4 text-center">Duration</th>
                            <th className="py-3 px-4 text-right">Approved Intake</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
                          {deptIntakeCourses.map((course, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                              <td className="py-3.5 px-4 text-gray-900 font-bold">{course.name}</td>
                              <td className="py-3.5 px-4 text-center text-gray-550">{course.duration}</td>
                              <td className="py-3.5 px-4 text-right text-indigo-650 font-mono font-bold">
                                {course.seats > 0 ? `${course.seats} Seats` : (course.label || "N/A")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: FACULTY DIRECTORY */}
              {activeSubTab === 'faculty' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 text-left self-start sm:self-auto">
                      <Users className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Faculty Directory
                    </h2>
                    
                    {/* Faculty search */}
                    <div className="relative w-full sm:max-w-xs">
                      <input 
                        type="text"
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        placeholder="Search faculty..."
                        className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 pl-9 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-medium text-gray-800"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {filteredFaculty.length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No faculty members found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left">
                      {filteredFaculty.map((f, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                        >
                          {/* Background soft blurs for premium aesthetic */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100/50 transition-colors" />

                          {/* Left side: Image / Fallback Avatar */}
                          <div className="relative shrink-0 w-20 h-20 sm:w-32 sm:h-32 rounded-full sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                            {f.image ? (
                              <img 
                                src={f.image} 
                                alt={f.name} 
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {/* Fallback avatar */}
                            <div 
                              className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-650 font-bold"
                              style={{ display: f.image ? 'none' : 'flex' }}
                            >
                              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-650" />
                            </div>
                          </div>

                          {/* Right side: Information */}
                          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start justify-between py-0.5 self-stretch text-center sm:text-left">
                            <div className="w-full flex flex-col items-center sm:items-start">
                              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                <h4 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 leading-snug">{f.name}</h4>
                                {f.qualification && (
                                  <span className="text-[9px] font-black bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-650 uppercase font-mono tracking-wider shrink-0 mt-0.5 sm:mt-0">
                                    {f.qualification}
                                  </span>
                                )}
                              </div>
                              
                              <span className="text-[11px] sm:text-xs md:text-sm text-indigo-650 font-extrabold uppercase tracking-wider block mb-1">
                                {f.designation}
                              </span>
                              
                              {f.department && (
                                <span className="text-xs sm:text-sm text-gray-550 font-bold block mb-3 leading-relaxed">
                                  {f.department}
                                </span>
                              )}
                            </div>

                            {/* Contact/Options & Additional Metadata */}
                            <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-gray-100 w-full">
                              <div className="flex items-center gap-4">
                                {f.experience && (
                                  <div className="text-[10px] sm:text-xs text-gray-550 font-extrabold flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>Exp: {f.experience.split(',')[0]}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {f.email && (
                                  <a 
                                    href={`mailto:${f.email}`}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-900 hover:bg-indigo-650 text-white flex items-center justify-center shadow hover:shadow-indigo-500/30 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                                    title={`Email: ${f.email}`}
                                  >
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LABORATORIES */}
              {activeSubTab === 'labs' && (
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-6 sm:mb-8 text-left">
                    <Library className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Infrastructure & Laboratories
                  </h2>

                  {(dept.labs || []).length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No laboratories information currently available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
                      {dept.labs.map((lab, idx) => (
                        <div 
                          key={idx}
                          className="p-4 sm:p-6 bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all duration-300"
                        >
                          <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                            <Library className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
                          </div>
                          <div>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">Laboratory {String(idx + 1).padStart(2, '0')}</span>
                            <h4 className="text-xs sm:text-sm md:text-base font-black text-gray-800 leading-relaxed">{lab}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CURRICULUM OBJECTIVES */}
              {activeSubTab === 'curriculum' && (
                <div className="space-y-6 sm:space-y-10 text-left">
                  
                  {/* PEOs & PSOs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* PEOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Educational Objectives (PEOs)
                      </h3>
                      {(!dept.peos || dept.peos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold">PEOs are in alignment with university structures.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.peos.map((peo, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{peo}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* PSOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Specific Outcomes (PSOs)
                      </h3>
                      {(!dept.psos || dept.psos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-550 font-semibold">PSOs are configured as per program focus.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.psos.map((pso, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{pso}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* POs */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Outcomes (POs)
                    </h3>
                    {(!dept.pos || dept.pos.length === 0) ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold">Standard engineering program outcomes apply.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {dept.pos.map((po, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:border-indigo-300 transition-all shadow-sm"
                          >
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">
                              PO {idx + 1} {po.title ? `• ${po.title}` : ''}
                            </span>
                            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-semibold">
                              {po.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: PUBLICATIONS */}
              {activeSubTab === 'publications' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 sm:mb-8 text-left">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2">
                        <BookOpenCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Research Publications
                      </h2>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 uppercase font-black tracking-wider">Journals, books, and conference proceedings</p>
                    </div>

                    {/* Sub-tabs for publication types */}
                    <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-xl sm:rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
                      {[
                        { id: 'journals', label: `Journals (${(dept.publications?.journals || []).length})` },
                        { id: 'books', label: `Books (${(dept.publications?.books || []).length})` },
                        { id: 'conferences', label: `Conferences (${(dept.publications?.conferences || []).length})` }
                      ].map(pType => (
                        <button
                          key={pType.id}
                          onClick={() => {
                            setActivePubType(pType.id);
                            setPubSearch('');
                          }}
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap ${
                            activePubType === pType.id 
                              ? 'bg-indigo-650 text-white shadow-md' 
                              : 'text-gray-650 hover:text-indigo-650 hover:bg-gray-150'
                          }`}
                        >
                          {pType.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Publications lists */}
                  <div className="bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
                    {activePubType === 'journals' && (
                      <div>
                        {(!dept.publications?.journals || dept.publications.journals.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No journal articles listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Title of Paper</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 px-4">Journal</th>
                                    <th className="pb-3.5 px-4 text-center">Year</th>
                                    <th className="pb-3.5 pl-4 text-right">Link</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.journals.map((j, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{j.title}</td>
                                      <td className="py-4 px-4 text-gray-650 leading-normal max-w-[120px]">{j.author}</td>
                                      <td className="py-4 px-4 text-indigo-650 max-w-[150px] leading-normal italic">{j.journal}</td>
                                      <td className="py-4 px-4 text-center text-gray-500 font-mono">{j.year}</td>
                                      <td className="py-4 pl-4 text-right">
                                        {j.link && j.link.startsWith('http') ? (
                                          <a 
                                            href={j.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-750 font-bold hover:underline inline-flex items-center gap-1"
                                          >
                                            View <FileText className="w-3.5 h-3.5" />
                                          </a>
                                        ) : (
                                          <span className="text-gray-400 font-bold">—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.journals.map((j, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Journal Paper
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{j.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {j.author}</p>
                                    <p><span className="font-bold text-gray-400">Journal:</span> <span className="italic text-indigo-650">{j.journal}</span></p>
                                    <p><span className="font-bold text-gray-400">Year:</span> <span className="font-mono">{j.year}</span></p>
                                  </div>

                                  {j.link && j.link.startsWith('http') && (
                                    <div className="pt-2 border-t border-gray-100">
                                      <a 
                                        href={j.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-bold text-xs py-2 rounded-lg transition-colors"
                                      >
                                        View Document <FileText className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'books' && (
                      <div>
                        {(!dept.publications?.books || dept.publications.books.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No books published.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Book Title</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 pl-4 text-right">Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.books.map((b, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold max-w-xs">{b.title}</td>
                                      <td className="py-4 px-4 text-gray-600">{b.author}</td>
                                      <td className="py-4 pl-4 text-right text-indigo-650 italic max-w-xs">{b.publisher}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.books.map((b, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-2">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Book Title
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{b.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-655 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {b.author}</p>
                                    <p><span className="font-bold text-gray-400">Publisher:</span> <span className="italic text-indigo-650">{b.publisher}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'conferences' && (
                      <div>
                        {(!dept.publications?.conferences || dept.publications.conferences.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No conference proceedings listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Paper Title</th>
                                    <th className="pb-3.5 px-4">Faculty Member</th>
                                    <th className="pb-3.5 px-4">Conference Proceeding</th>
                                    <th className="pb-3.5 pl-4 text-right">ISBN / Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.conferences.map((c, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{c.paperTitle || '—'}</td>
                                      <td className="py-4 px-4 text-gray-600">{c.faculty}</td>
                                      <td className="py-4 px-4 text-indigo-650 italic max-w-xs">{c.proceeding}</td>
                                      <td className="py-4 pl-4 text-right text-gray-550 font-mono max-w-[150px]">
                                        {c.isbn ? `ISBN: ${c.isbn}` : ''} {c.publisher ? ` [${c.publisher}]` : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.conferences.map((c, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Conference
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{c.paperTitle || '—'}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Faculty:</span> {c.faculty}</p>
                                    <p><span className="font-bold text-gray-400">Proceeding:</span> <span className="italic text-indigo-650">{c.proceeding}</span></p>
                                    {c.isbn && <p><span className="font-bold text-gray-400">ISBN:</span> <span className="font-mono text-xs">{c.isbn}</span></p>}
                                    {c.publisher && <p><span className="font-bold text-gray-400">Publisher:</span> {c.publisher}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PLACEMENTS & ACHIEVEMENTS */}
              {activeSubTab === 'achievements' && (
                <div className="space-y-8 sm:space-y-10 text-left">
                  
                  {/* placements block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                    <h3 className="text-lg sm:text-xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Student Placement Records
                    </h3>
                    
                    {(!dept.placements || dept.placements.length === 0) ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold text-center py-6 sm:py-8">First-batch students currently building projects; placements commencing soon.</p>
                    ) : (
                      <div>
                        {/* Desktop Table view */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-xs md:text-sm text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                <th className="pb-3.5 pr-4">Register Number</th>
                                <th className="pb-3.5 px-4">Student Name</th>
                                <th className="pb-3.5 px-4">Recruiter / Employer</th>
                                <th className="pb-3.5 pl-4 text-right">Compensation Package</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                              {dept.placements.map((p, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                  <td className="py-3 pr-4 text-gray-500 font-mono">{p.registerNumber}</td>
                                  <td className="py-3 px-4 text-gray-900 font-bold">{p.studentName}</td>
                                  <td className="py-3 px-4 text-indigo-650">{p.companyName}</td>
                                  <td className="py-3 pl-4 text-right text-emerald-650 font-bold">{p.salaryPackage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile responsive view */}
                        <div className="block sm:hidden space-y-4">
                          {dept.placements.map((p, idx) => (
                            <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{p.studentName}</h4>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{p.registerNumber}</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                                  {p.salaryPackage}
                                </span>
                              </div>
                              
                              <div className="text-xs pt-2 border-t border-gray-100 flex items-center justify-between text-gray-655">
                                <span>Employer / Recruiter</span>
                                <span className="font-bold text-indigo-650">{p.companyName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* toppers & university ranks grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* University Rank Holders */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Trophy className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> University Rank Holders
                      </h3>
                      {(!dept.rankHolders || dept.rankHolders.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-555 font-semibold text-center py-4 sm:py-6">Ranks are aggregated annually by affiliated university.</p>
                      ) : (
                        <div>
                          {/* Desktop Table view */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-xs md:text-sm text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                  <th className="pb-3 pr-4 text-center">Year</th>
                                  <th className="pb-3 px-4">Student Name</th>
                                  <th className="pb-3 pl-4 text-right">University Rank</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                {dept.rankHolders.map((r, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-2.5 pr-4 text-center text-gray-500 font-mono">{r.academicYear}</td>
                                    <td className="py-2.5 px-4 text-gray-900 font-bold">{r.studentName}</td>
                                    <td className="py-2.5 pl-4 text-right text-amber-650 font-black">Rank {r.rank}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile responsive view */}
                          <div className="block sm:hidden space-y-3">
                            {dept.rankHolders.map((r, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{r.studentName}</h4>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">Academic Year: {r.academicYear}</p>
                                </div>
                                <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                                  Rank {r.rank}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Semester Toppers */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Department Toppers
                      </h3>
                      {(!dept.toppers || dept.toppers.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-550 font-semibold text-center py-4 sm:py-6">Toppers data are updated following end-semester examinations.</p>
                      ) : (
                        <div>
                          {/* Desktop Table view */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-xs md:text-sm text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                  <th className="pb-3 pr-4">Student Name</th>
                                  <th className="pb-3 px-4">Year/Sem</th>
                                  <th className="pb-3 px-4 text-center">GPA</th>
                                  <th className="pb-3 pl-4 text-right">Topper Position</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                {dept.toppers.map((t, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-2.5 pr-4 text-gray-900 font-bold">{t.studentName}</td>
                                    <td className="py-2.5 px-4 text-gray-550">{t.yearSem}</td>
                                    <td className="py-2.5 px-4 text-center text-indigo-650 font-bold">{t.gpa}</td>
                                    <td className="py-2.5 pl-4 text-right text-amber-600 font-bold">Topper {t.rank}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile responsive view */}
                          <div className="block sm:hidden space-y-4">
                            {dept.toppers.map((t, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">{t.studentName}</h4>
                                    <p className="text-[10px] text-gray-550 mt-0.5">{t.yearSem}</p>
                                  </div>
                                  <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                                    Topper {t.rank}
                                  </span>
                                </div>
                                
                                <div className="text-xs pt-2 border-t border-gray-100 flex items-center justify-between text-gray-650">
                                  <span>GPA Score</span>
                                  <span className="font-bold text-indigo-650 text-sm">{t.gpa}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
