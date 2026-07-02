import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Clock, Users, ArrowRight, BookOpen, FileText, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';

export default function Departments() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Process departments from JSON
  const depts = Object.values(departmentsData).map(dept => {
    // Determine category based on key or description
    const isPG = dept.key === 'mca' || dept.key === 'mba';
    
    // Custom info from txt metadata
    let duration = "4 Years";
    let intake = "60 Seats";
    let focus = "";

    if (dept.key === 'aiml') {
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
    }

    return {
      ...dept,
      category: isPG ? 'pg' : 'ug',
      duration,
      intake,
      focus
    };
  });

  const filteredDepts = depts.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dept.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.focus.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return dept.category === activeTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6 md:px-12 relative overflow-hidden text-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-violet-650/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full inline-block mb-4"
          >
            Academic Departments
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-title tracking-tight mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent"
          >
            Redesigned Portals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed font-medium"
          >
            Explore our state-of-the-art departments, fully loaded with official curriculum, faculty profiles, publication track records, and student accomplishments.
          </motion.p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-md">
          {/* Tabs */}
          <div className="flex gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'ug', label: 'Undergraduate (B.E. / B.Tech)' },
              { id: 'pg', label: 'Postgraduate (MCA / MBA)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-650 text-white shadow-lg' 
                    : 'text-gray-450 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search departments, labs, focus areas..."
              className="w-full text-xs px-5 py-3.5 pl-11 bg-slate-900/60 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:bg-slate-900 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all font-medium text-gray-200 placeholder-gray-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-550">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-black cursor-pointer"
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
                <div className="col-span-full p-20 bg-slate-800/10 rounded-3xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-sm font-semibold">No departments found matching your search criteria.</span>
                </div>
              ) : (
                filteredDepts.map((dept) => (
                  <motion.div 
                    key={dept.key}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    className="group bg-slate-800/30 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-800/60 hover:shadow-[0_15px_40px_rgba(99,102,241,0.08)] transition-all duration-300 text-left"
                  >
                    <div>
                      {/* Badge / Duration */}
                      <div className="flex justify-between items-center gap-3 mb-6">
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          dept.category === 'pg' 
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        }`}>
                          {dept.category === 'pg' ? 'Postgraduate' : 'Undergraduate'}
                        </span>
                        <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" /> {dept.duration}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-black text-white leading-tight mb-4 group-hover:text-indigo-300 transition-colors">
                        {dept.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        {dept.about}
                      </p>

                      {/* Focus Tags */}
                      <div className="mb-6">
                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider block mb-2">Core Focus</span>
                        <div className="flex flex-wrap gap-1.5">
                          {dept.focus.split(', ').slice(0, 3).map((f, idx) => (
                            <span key={idx} className="text-[9px] font-bold bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded-lg text-slate-350">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Link */}
                    <div className="pt-6 border-t border-slate-800/60">
                      <div className="grid grid-cols-3 gap-2 text-center mb-6">
                        <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/40">
                          <span className="block text-xs font-black text-indigo-400">{dept.faculty.length}</span>
                          <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">Faculty</span>
                        </div>
                        <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/40">
                          <span className="block text-xs font-black text-emerald-400">{dept.labs.length}</span>
                          <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">Labs</span>
                        </div>
                        <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/40">
                          <span className="block text-xs font-black text-amber-400">{dept.placements.length}</span>
                          <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">Placed</span>
                        </div>
                      </div>

                      <Link 
                        to={`/departments/${dept.key}`}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-95 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20"
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
