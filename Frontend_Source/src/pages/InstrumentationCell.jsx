import React from 'react';
import { motion } from 'framer-motion';

// Import images directly for Vite compilation resolution
import image1 from '../assets/instrument_cell/1.jpg';
import image2 from '../assets/instrument_cell/2.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function InstrumentationCell() {
  const images = [
    { 
      title: "Instrumentation Facility Details - Part 1", 
      path: image1
    },
    { 
      title: "Instrumentation Facility Details - Part 2", 
      path: image2
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              Research Infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Sophisticated Instrumentation Cell
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              APEC's Sophisticated Instrumentation Cell (SIC) houses advanced analytical instruments to support academic research, research projects, and testing facilities for engineering and science disciplines.
            </p>
          </div>
        </div>

        {/* Images Grid (Rendered purely as portrait images with no download or preview buttons) */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="w-full rounded-2xl overflow-hidden border border-gray-150 bg-slate-100 aspect-[3/4] relative">
                <img 
                  src={img.path} 
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-black text-gray-800 mt-4 text-center">
                {img.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-255 p-6 rounded-2xl text-center">
          <p className="text-sm md:text-base font-extrabold text-gray-600 leading-relaxed">
            Adhiparasakthi Engineering College • Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
