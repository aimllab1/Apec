import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
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
  sh: '/Images/Dept/cse dept.png',
  'phd-civil': '/Images/Dept/phd.civil.jpg',
  'phd-mech': '/Images/Dept/phd.mech.jpg',
  'phd-eee': '/Images/Dept/phd.eee.jpg',
  'phd-ece': '/Images/Dept/phd.ece.jpg',
  default: '/Images/Dept/cse dept.png'
};

export default function Departments() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sortOrder = [
    'civil', 'mech', 'eee', 'ece', 'cse', 'aiml', 'csd',
    'it', 'chemical', 'agri', 'aids',
    'mca', 'mba', 'sh',
    'phd-civil', 'phd-mech', 'phd-ece', 'phd-eee'
  ];

  // Process departments from JSON or local storage config
  const currentDeptsData = (() => {
    const saved = localStorage.getItem('apec_departments_data');
    return saved ? JSON.parse(saved) : departmentsData;
  })();

  const depts = Object.values(currentDeptsData).map(dept => {
    // Determine category based on key or description
    const isPG = dept.key === 'mca' || dept.key === 'mba';
    const isPhD = dept.key.startsWith('phd-');
    
    // Custom info from txt metadata
    let duration = "4 Years";
    let intake = "60 Seats";
    let focus = "";

    if (dept.key.startsWith('phd-')) {
      duration = "3 - 5 Years";
      intake = "Based on Vacancy";
      focus = "Research Methodologies, Specialized Domain Research, Publications & Thesis Defense";
    } else if (dept.key === 'aiml') {
      duration = "4 Years";
      intake = "30 Seats";
      focus = "Neural Networks, Deep Learning, Python Data Science, Machine Learning";
    } else if (dept.key === 'cse') {
      duration = "4 Years";
      intake = "90 Seats";
      focus = "AI, Cloud Computing, Web Technologies, Database Systems, Software Engineering";
    } else if (dept.key === 'it') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Network Lab, Cloud Architectures, Web Essentials, Cybersecurity Systems";
    } else if (dept.key === 'chemical') {
      duration = "4 Years";
      intake = "40 Seats";
      focus = "Process Control, Fluid Dynamics, Mass Transfer, Chemical Reaction Engineering";
    } else if (dept.key === 'mech') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "CAD/CAM, Thermal Engineering, Fluid Machinery, IoT Mechatronics";
    } else if (dept.key === 'civil') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Soil Mechanics, Strength of Materials, Structural Surveying, Concrete Technology";
    } else if (dept.key === 'mca') {
      duration = "2 Years";
      intake = "60 Seats";
      focus = "Full Stack Web Development, Cloud Databases, Advanced Java, Software Testing";
    } else if (dept.key === 'eee') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Power Systems, Control Systems, Electrical Machines, Smart Grids, Renewable Energy";
    } else if (dept.key === 'ece') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "VLSI, Embedded Systems, Communication Systems, Signal Processing, IoT";
    } else if (dept.key === 'mba') {
      duration = "2 Years";
      intake = "60 Seats";
      focus = "Strategic Management, Marketing, Finance, HR Management, Entrepreneurship";
    } else if (dept.key === 'sh') {
      duration = "1 Year";
      intake = "N/A";
      focus = "Engineering Mathematics, Applied Physics, Applied Chemistry, Communication Skills";
    } else if (dept.key === 'csd') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "UI/UX Design, Computer Graphics, Visual Computing, Web & Mobile App Design";
    } else if (dept.key === 'agri') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Farm Mechanization, Irrigation Engineering, Post-Harvest Tech, Food Process Eng.";
    } else if (dept.key === 'aids') {
      duration = "4 Years";
      intake = "60 Seats";
      focus = "Data Mining, Big Data Analytics, Python for Data Science, Machine Learning Models";
    }

    let category = 'be';
    if (isPhD) category = 'phd';
    else if (isPG) category = 'pg';
    else if (['it', 'chemical', 'agri', 'aids'].includes(dept.key)) category = 'btech';

    return {
      ...dept,
      category,
      duration,
      intake,
      focus
    };
  }).sort((a, b) => sortOrder.indexOf(a.key) - sortOrder.indexOf(b.key));

  const filteredDepts = depts.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dept.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.focus.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return dept.category === activeTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 md:px-12 relative overflow-hidden text-gray-900">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center md:text-left">

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-title tracking-tight mb-6 text-gray-900"
          >
            Academic Departments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed font-medium"
          >
            Explore our state-of-the-art departments, fully loaded with official curriculum, faculty profiles, publication track records, and student accomplishments.
          </motion.p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-center mb-12 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-row gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-150 shrink-0 w-full xl:w-auto">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'be', label: 'Undergraduate (B.E.)' },
              { id: 'btech', label: 'Undergraduate (B.Tech.)' },
              { id: 'pg', label: 'Postgraduate (MCA / MBA)' },
              { id: 'phd', label: 'Doctor of Philosophy (Ph.D.)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`text-center py-3 px-3 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer xl:whitespace-nowrap grow ${
                  activeTab === tab.id 
                    ? 'bg-indigo-650 text-white shadow-md' 
                    : 'text-gray-600 hover:text-indigo-650 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full xl:max-w-md">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search departments, labs, focus areas..."
              className="w-full text-sm px-5 py-3.5 pl-11 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-indigo-650 focus:bg-white focus:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-all font-medium text-gray-800 placeholder-gray-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-850 text-xs font-black cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab + searchTerm}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { staggerChildren: 0.05 } 
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:col-span-2 lg:col-span-3"
            >
              {filteredDepts.length === 0 ? (
                <div className="col-span-full p-20 bg-gray-100/50 rounded-3xl border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                  <span className="text-gray-550 text-sm font-semibold">No departments found matching your search criteria.</span>
                </div>
              ) : (
                filteredDepts.map((dept) => (
                  <motion.div 
                    key={dept.key}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="group bg-white border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-indigo-300 hover:shadow-[0_15px_40px_rgba(99,102,241,0.05)] transition-all duration-300 text-left"
                  >
                    <div>
                      {/* Department Image */}
                      <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative shadow-sm group">
                        <img 
                          src={departmentImages[dept.key] || departmentImages.default} 
                          alt={`${dept.name} Department`}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        {/* Subtle decorative overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Badge / Duration */}
                      <div className="flex justify-between items-center gap-3 mb-6">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                          dept.category === 'pg' 
                            ? 'bg-purple-550/10 border-purple-550/20 text-purple-650' 
                            : dept.category === 'btech'
                              ? 'bg-emerald-550/10 border-emerald-550/20 text-emerald-650'
                              : 'bg-indigo-550/10 border-indigo-550/20 text-indigo-650'
                        }`}>
                          {dept.category === 'pg' ? 'Postgraduate' : dept.category === 'btech' ? 'UG (B.Tech)' : 'UG (B.E.)'}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-gray-500 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-650" /> {dept.duration}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-indigo-650 transition-colors">
                        {dept.name.replace(/^Department of\s+/i, '')}
                      </h3>



                      {/* Focus Tags */}
                      <div className="mb-6">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-2.5">Core Focus</span>
                        <div className="flex flex-wrap gap-2">
                          {dept.focus.split(', ').slice(0, 3).map((f, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl text-gray-700">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Link */}
                    <div className="pt-6 border-t border-gray-150">
                      <div className="grid grid-cols-3 gap-2.5 text-center mb-6">
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-150">
                          <span className="block text-sm font-black text-indigo-600">{dept.faculty.length}</span>
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Faculty</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-150">
                          <span className="block text-sm font-black text-emerald-650">{dept.labs.length}</span>
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Labs</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-150">
                          <span className="block text-sm font-black text-amber-600">{dept.placements.length}</span>
                          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Placed</span>
                        </div>
                      </div>

                      <Link 
                        to={`/departments/${dept.key}`}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-95 text-white font-bold text-sm py-4 rounded-2xl transition-all shadow-md hover:shadow-indigo-500/10"
                      >
                        Explore Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
