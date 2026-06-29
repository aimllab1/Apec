import React, { useState } from 'react';
import { GraduationCap, Award, Clock, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Departments() {
  const [activeTab, setActiveTab] = useState('ug');

  const programs = {
    ug: [
      { name: "B.E. Computer Science & Engineering", intake: 120, duration: "4 Years", focus: "AI, Machine Learning, Web Technologies, Database Systems" },
      { name: "B.E. Computer Science & Eng. (AI & ML)", intake: 60, duration: "4 Years", focus: "Neural Networks, Deep Learning, Python Data Science" },
      { name: "B.E. Computer Science & Eng. (Computer System Design)", intake: 60, duration: "4 Years", focus: "Systems engineering, IoT, system-on-chip setups" },
      { name: "B.Tech. Information Technology", intake: 60, duration: "4 Years", focus: "Cloud Architectures, Networks, Cybersecurity systems" },
      { name: "B.E. Electronics & Communication Engineering", intake: 90, duration: "4 Years", focus: "VLSI, Signals and Systems, Antennas, Satellite links" },
      { name: "B.E. Electrical & Electronics Engineering", intake: 60, duration: "4 Years", focus: "Power Systems, Smart Grids, Control Units, Electric Vehicles" },
      { name: "B.Tech. Chemical Engineering", intake: 30, duration: "4 Years", focus: "Process Control, Fluid Dynamics, Organic Chemistry cells" },
      { name: "B.Tech. Agricultural Engineering", intake: 30, duration: "4 Years", focus: "Irrigation systems, Soil engineering, Farm machineries" },
      { name: "B.E. Mechanical Engineering", intake: 30, duration: "4 Years", focus: "CAD/CAM, Thermodynamics, Fluid Dynamics, Materials Science" },
      { name: "B.E. Civil Engineering", intake: 30, duration: "4 Years", focus: "Structural engineering, Surveying, concrete labs" }
    ],
    pg: [
      { name: "Master of Computer Applications (MCA)", intake: 60, duration: "2 Years", focus: "Advanced coding, software project development" },
      { name: "Master of Business Administration (MBA)", intake: 60, duration: "2 Years", focus: "Finance cells, Marketing strategies, HR admin" },
      { name: "M.E. Computer Science & Engineering", intake: 18, duration: "2 Years", focus: "Distributed grids, computational algorithms" },
      { name: "M.E. VLSI Design", intake: 18, duration: "2 Years", focus: "Microchip architecture, digital circuit compilers" },
      { name: "M.E. Thermal Engineering", intake: 18, duration: "2 Years", focus: "Heat exchangers, advanced thermodynamics" },
      { name: "M.E. Power Electronics & Drives", intake: 18, duration: "2 Years", focus: "Industrial automation drives, solid state converters" },
      { name: "M.E. Construction Engineering & Management", intake: 18, duration: "2 Years", focus: "Asset management, building structural designs" }
    ],
    phd: [
      { name: "Ph.D. Civil Engineering", intake: "As per vacancy", duration: "3-6 Years", focus: "Structural sustainability, concrete material developments" },
      { name: "Ph.D. Mechanical Engineering", intake: "As per vacancy", duration: "3-6 Years", focus: "Heat transfer analysis, bio-fuels testing" },
      { name: "Ph.D. Electrical & Electronics Engineering", intake: "As per vacancy", duration: "3-6 Years", focus: "Renewable energy setups, power converter topologies" },
      { name: "Ph.D. Electronics & Communication Engineering", intake: "As per vacancy", duration: "3-6 Years", focus: "Wireless communication networks, smart antenna systems" }
    ]
  };

  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Header */}
        <div className="mb-16">
          <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Academic Programs
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">Our Departments</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed font-semibold">
            Adhiparasakthi Engineering College offers a wide range of undergraduate (B.E./B.Tech.), postgraduate (M.E./M.B.A./M.C.A.), and doctoral programs with comprehensive laboratory cells.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-100 pb-4">
          {[
            { id: 'ug', label: 'Undergraduate (B.E. / B.Tech.)' },
            { id: 'pg', label: 'Postgraduate (M.E. / MBA / MCA)' },
            { id: 'phd', label: 'Doctoral (Ph.D.)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-display text-xs font-extrabold uppercase tracking-wider pb-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 font-black' 
                  : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { staggerChildren: 0.08 } 
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2"
            >
              {programs[activeTab].map((prog, idx) => (
                <motion.div 
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  className="p-8 bg-gray-50/50 border border-gray-200 rounded-3xl flex flex-col justify-between hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-base font-black text-gray-900 leading-snug">{prog.name}</h3>
                      <span className="font-mono text-[9px] uppercase font-black tracking-widest bg-white border border-gray-200 px-2.5 py-1 rounded-xl text-indigo-600 shrink-0 shadow-sm flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> {prog.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed font-semibold">
                      <span className="font-display text-gray-400 font-extrabold uppercase text-[9px] tracking-wider block mb-1">Focus Core</span>
                      {prog.focus}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    <span className="font-display flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /> Intake Capacity</span>
                    <span className="font-mono text-indigo-600 font-black">{prog.intake} seats</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
