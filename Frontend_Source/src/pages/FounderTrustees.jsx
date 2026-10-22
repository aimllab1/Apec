import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, BookOpen, Award, Sparkles, HeartHandshake, Eye, Compass, ArrowRight } from 'lucide-react';
import bangaruImg from '../Arulthiru Bangaru Sidhar.jpg';
import lakshmiImg from '../Sakthi Tmt. V. Lakshmi Bangaru Sidhar.jpeg';
import senthilImg from '../Sakthi Thiru. Dr. G. B. Senthil Kumar.jpeg';

// Motion animation variables for clean, staggered fades
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function FounderTrustees() {
  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block mb-2">
            Our Visionary Founders
          </span>
          <h1 className="font-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2.5">
            Founders & Management
          </h1>
          <p className="text-sm sm:text-base text-slate-650 leading-relaxed max-w-4xl font-semibold">
            Adhiparasakthi Engineering College is guided by the spiritual ideals, compassion, and leadership of our founder and trustees. Under their stewardship, the institution has provided world-class technical education to students from all walks of life.
          </p>
        </motion.div>

        {/* 1. FOUNDER SECTION: Arulthiru Bangaru Adigalar (Amma) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Founder & Spiritual Guide
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                His Holiness Arulthiru Bangaru Siddhar (Amma)
              </h2>
              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  His Holiness Arulthiru Bangaru Siddhar, affectionately revered as 'AMMA' by millions of followers, established the ACMEC Trust (Adhiparasakthi Charitable, Medical, Educational and Cultural Trust) in 1978. 
                </p>
                <p>
                  Believing that "Service to humanity is service to God," Amma focused on breaking traditional boundaries. Under his guidance, the Trust became a force for social reform—pioneering accessible higher education, high-tech healthcare, and vocational courses. 
                </p>
                <p>
                  Amma was awarded the prestigious <strong className="text-slate-900 font-bold">Padma Shri</strong> by the Government of India in 2019 for his outstanding contributions to social work and spiritual guidance. His legacy continues to inspire the value-centric training of engineers at APEC.
                </p>
              </div>

              {/* Core Philosophy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-5">
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl hover:border-indigo-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-2">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Empowerment Through Education</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Making technical engineering education affordable and accessible to rural and underprivileged students.</p>
                </div>
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl hover:border-purple-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Spiritual Ethics</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Instilling core integrity, human empathy, and strong moral character in future global leaders.</p>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={bangaruImg} 
                    alt="Arulthiru Bangaru Siddhar (Amma)" 
                    className="w-full h-[380px] sm:h-[400px] lg:h-[420px] object-cover rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-1">
                      Arulthiru Bangaru Siddhar
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-widest block drop-shadow">
                      FOUNDER (1940 – 2023)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. PRESIDENT SECTION: Sakthi Tmt. V. Lakshmi Bangaru Siddhar */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-8 sm:mb-10"
        >
          <div className="flex flex-col-reverse lg:flex-row-reverse gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Trust President
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                Sakthi Tmt. V. Lakshmi Bangaru Siddhar
              </h2>
              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  As the President of the ACMEC Trust, Sakthi Tmt. V. Lakshmi Bangaru Siddhar has successfully transitioned the institution into a modern, research-first environment. 
                </p>
                <p>
                  Her presidential leadership is defined by a strong commitment to girls' engineering education, rural enrollment drives, and state-of-the-art campus expansions. Under her oversight, the Trust awards millions in academic scholarships annually to deserving candidates.
                </p>
                <p>
                  She continuously guides the college administration to ensure value-added learning frameworks and ensures our engineering pathways align with the socio-economic welfare of the country.
                </p>
              </div>

              {/* Focus points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-5">
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl hover:border-pink-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-700 mb-2">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Women Empowerment</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Ensuring equal opportunities, robust safety networks, and specialized programs for women in tech fields.</p>
                </div>
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl hover:border-rose-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 mb-2">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Universal Inclusivity</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Establishing scholarship funds and structural support networks to ensure no student is denied higher learning.</p>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-pink-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={lakshmiImg} 
                    alt="V. Lakshmi Bangaru Siddhar" 
                    className="w-full h-[380px] sm:h-[400px] lg:h-[420px] object-cover rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-1">
                      Sakthi Tmt. V. Lakshmi Bangaru Siddhar
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-widest block drop-shadow">
                      PRESIDENT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. CORRESPONDENT SECTION: Dr. G. B. Senthil Kumar */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-6 sm:pt-8 mb-6 sm:mb-8"
        >
          <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 rounded-md mb-2 inline-block">
                Correspondent Profile
              </span>
              <h2 className="font-title text-2xl sm:text-3xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                Dr. G. B. Senthil Kumar, Ph.D.
              </h2>
              <div className="space-y-2.5 text-sm sm:text-base text-slate-650 font-normal leading-relaxed">
                <p>
                  As the Correspondent of Adhiparasakthi Engineering College, Dr. G. B. Senthil Kumar is the main architect of the institution's operational governance, academic planning, and corporate strategy.
                </p>
                <p>
                  Under his active management, APEC obtained its autonomous status, implemented outcome-based educational curriculum structures, and expanded its R&D labs. He is highly passionate about integrating digital technology, resulting in a fully smart, Wi-Fi-enabled campus.
                </p>
                <p>
                  Dr. Senthil Kumar also directs our placement division, establishing direct MoUs and recruitment ties with major multi-national corporations (MNCs) to ensure top placement records.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-5">
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl flex gap-3 hover:border-blue-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">Autonomous Transition</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Guided the college through extensive academic audits to secure autonomous standing.</p>
                  </div>
                </div>
                <div className="p-3 sm:p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-xl flex gap-3 hover:border-purple-200 transition-colors shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">Research Incubation</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Promotes faculty research nodes, student patents, and high-spec lab facilities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-xs sm:max-w-sm w-full p-2 bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-indigo-500/40">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl relative">
                  <img 
                    src={senthilImg} 
                    alt="Dr. G. B. Senthil Kumar" 
                    className="w-full h-[380px] sm:h-[400px] lg:h-[420px] object-cover object-top rounded-xl sm:rounded-2xl grayscale-[5%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent rounded-xl sm:rounded-2xl" />
                  <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-tight tracking-wide drop-shadow-md mb-1">
                      Dr. G. B. Senthil Kumar
                    </h4>
                    <span className="font-display text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-widest block drop-shadow">
                      CORRESPONDENT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
