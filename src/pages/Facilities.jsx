import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Laptop, Home, Award, Wifi, Shield, ArrowRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PanoramaModal from '../components/PanoramaModal';

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

export default function Facilities() {
  const [isPanoOpen, setIsPanoOpen] = useState(false);

  const facilityList = [
    {
      id: "library",
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      title: "Resourceful Central Library",
      details: [
        "Extensive Collection: Over 56,000 engineering and technical volumes, journals, and reference books.",
        "Digital Access: Subscriptions to IEEE, ScienceDirect, and e-resource databases.",
        "Ground & First Floors: Book bank, digital reference libraries, and air-conditioned reading halls."
      ]
    },
    {
      id: "labs",
      icon: <Laptop className="w-6 h-6 text-pink-600" />,
      title: "Lab Infrastructures & Computer Centre",
      details: [
        "Advanced System Labs: High-spec servers, workstations, and multi-department CAD/CAM environments.",
        "Domain-Specific Facilities: Civil structures cells, mechanical CNC bays, and chemical workshops.",
        "Electronics & Robotics: Dedicated circuitry development kits and programmable logic boards."
      ]
    },
    {
      id: "hostels",
      icon: <Home className="w-6 h-6 text-emerald-600" />,
      title: "Hostel Accommodations",
      details: [
        "Separate Blocks: Independent secure residential spaces for male and female students.",
        "Dining & Amenities: Nutrient-focused hygiene catering mess, RO water, and 24/7 power backup.",
        "Gym & Recreation: Common lounges with TV and hydraulic fitness units."
      ]
    },
    {
      id: "hostels",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Sports Grounds & Indoor Games",
      details: [
        "Outdoor Facilities: Full-sized cricket pitches, football turf, running tracks, and courts.",
        "Indoor Stadium: Premium spaces for badminton, table tennis, carrom, and chess setups.",
        "Fitness Centres: Hydraulic gymnasium structures managed by physical instructors."
      ]
    },
    {
      id: "labs",
      icon: <Wifi className="w-6 h-6 text-cyan-600" />,
      title: "WiFi Campus Coverage",
      details: [
        "Secure Network: Campus-wide high-speed optical fiber wifi access for students and mentors.",
        "Resource Linkage: Connects directly to Adhiparasakthi Engineering College database servers, e-journals, and reference catalogs."
      ]
    },
    {
      id: "hostels",
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Green & Eco-Friendly Campus",
      details: [
        "Sustainable Campus: Rainwater harvesting networks and solar powered campus street lighting.",
        "Serene Vibe: Vast lawn segments and tree pathways providing clean air ideal for academic focus."
      ]
    }
  ];

  return (
    <div className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Our Campus
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Facilities & Infrastructure</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed font-semibold">
            Adhiparasakthi Engineering College provides students with a well-maintained, high-standard campus environment. Explore our library resources, dynamic labs, separate hostels, and sports grounds.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {facilityList.map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Link 
                to={`/facilities/${item.id}`}
                className="group p-8 bg-gray-50/50 border border-gray-200 rounded-3xl flex flex-col justify-between hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full text-left"
              >
                <div>
                  <div className="w-12 h-12 bg-white border border-gray-150 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <ul className="space-y-3.5 mb-6">
                    {item.details.map((detail, dIdx) => {
                      const parts = detail.split(': ');
                      const bulletTitle = parts[0];
                      const bulletDesc = parts.slice(1).join(': ');
                      return (
                        <li key={dIdx} className="text-xs text-gray-500 leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                          <span className="font-semibold text-gray-600">
                            <strong className="text-gray-800 font-extrabold">{bulletTitle}</strong>{bulletDesc ? `: ${bulletDesc}` : ''}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {item.id === 'labs' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsPanoOpen(true);
                    }}
                    className="mb-6 inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/60 font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer relative overflow-hidden group/btn w-max"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-450 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <RotateCw className="w-3.5 h-3.5 text-indigo-500 animate-[spin_10s_linear_infinite]" />
                    <span>360° VR Tour: AIML Lab 1</span>
                  </button>
                )}

                {/* Click Callout */}
                <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 mt-4 group-hover:translate-x-1.5 transition-transform">
                  Explore Resource Details <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* 360° Panorama modal */}
      <AnimatePresence>
        {isPanoOpen && (
          <PanoramaModal 
            isOpen={isPanoOpen} 
            onClose={() => setIsPanoOpen(false)} 
            initialScene="aimlLab" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
