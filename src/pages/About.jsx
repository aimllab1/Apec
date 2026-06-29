import React from 'react';
import { User, Shield, Target, Compass, Sparkles, Cpu, BookOpen, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import bangaruImg from '../Arulthiru Bangaru Adigalar.jpg';
import lakshmiImg from '../Sakthi Tmt. V. Lakshmi Bangaru Adigalar.jpeg';
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

export default function About() {
  return (
    <div className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Intro Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="about-intro mb-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            APEC Legacy
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            About the Institution
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl font-semibold">
            Adhiparasakthi Engineering College (APEC), Melmaruvathur, is an autonomous institution dedicated to training professionals with technical competencies, spiritual grounding, and a deep sense of service to society. Since 1984, APEC has empowered generations of engineers through value-centric, research-oriented pathways.
          </p>
        </motion.div>

        {/* Vision & Mission Cards (Staggered Animation on Scroll) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {/* Vision */}
          <motion.div 
            variants={fadeInUp}
            className="p-8 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                To create high-quality engineers who have a sense of service and spirituality in order to advance the growth of society at large through the adoption of appropriate technologies.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            variants={fadeInUp}
            className="p-8 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-pink-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white mb-6 shadow-md">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Imparting high-quality education with an emphasis on contemporary technologies to help achieve growth across the spectrum of society, cultivating empathy and discipline in a spiritual environment.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Founder Spotlight */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-100 pt-16 mb-20 text-left"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Founder Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
                Our Founder
              </span>
              <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                His Holiness Arulthiru Bangaru Adigalar (Amma)
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 font-semibold">
                His Holiness Arulthiru Bangaru Adigalar, addressed as 'AMMA' by millions of devotees globally, established the ACMEC Trust (Adhiparasakthi Charitable, Medical, Educational and Cultural Trust) in 1978. AMMA dedicated his life to bridging societal divides, deploying free healthcare services, and constructing premier educational ecosystems to uplift underprivileged sectors.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                  <span className="font-display block text-[8px] font-black text-gray-450 uppercase tracking-widest mb-1.5">Trust Inception</span>
                  <span className="font-mono text-xs font-bold text-gray-800">ACMEC Trust (1978)</span>
                </div>
                <div className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                  <span className="font-display block text-[8px] font-black text-gray-455 uppercase tracking-widest mb-1.5">Social Welfare</span>
                  <span className="text-xs font-bold text-gray-850">Free Medical</span>
                </div>
                <div className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                  <span className="font-display block text-[8px] font-black text-gray-455 uppercase tracking-widest mb-1.5">Outreach</span>
                  <span className="font-mono text-xs font-bold text-gray-850">70+ Countries</span>
                </div>
              </div>
            </div>

            {/* Right: Founder Image */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-sm w-full p-2 bg-gray-50 border border-gray-200/80 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={bangaruImg} 
                    alt="Arulthiru Bangaru Adigalar" 
                    className="w-full h-[400px] object-cover rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                {/* Caption tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">Founder President</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Arulthiru Bangaru Adigalar</h4>
                  <span className="font-display text-[10px] text-gray-450 font-semibold uppercase tracking-wider block mt-0.5">Amma (1940 – 2023)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chairperson Spotlight (Sakthi Tmt. V. Lakshmi Bangaru Adigalar) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="border-t border-gray-100 pt-16 mb-20 text-left"
        >
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            
            {/* Right: Chairperson Image Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-5/12 flex justify-center"
            >
              <div className="relative group max-w-sm w-full p-2 bg-gray-50 border border-gray-200/80 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={lakshmiImg} 
                    alt="Sakthi Tmt. V. Lakshmi Bangaru Adigalar" 
                    className="w-full h-[400px] object-cover rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                
                {/* Caption Tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">Chairperson Desk</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">V. Lakshmi Bangaru Adigalar</h4>
                  <span className="font-display text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">APEC Chairperson</span>
                </div>
              </div>
            </motion.div>

            {/* Left: Biography & Highlights */}
            <div className="w-full lg:w-7/12 text-left flex flex-col justify-center">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 self-start">
                Chairperson Profile
              </span>
              <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Guiding Institutional Development & Leadership
              </h2>
              <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest block mb-5">
                Sakthi Tmt. V. Lakshmi Bangaru Adigalar, Chairperson
              </span>
              
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6 font-semibold">
                Chairperson Sakthi Tmt. V. Lakshmi Bangaru Adigalar leads the overall direction of the ACMEC Trust's educational nodes. Her focal vision rests on elevating rural student admissions, supporting girls' engineering empowerment, and allocating scholarships to underprivileged students to facilitate universal engineering education access.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                  <span className="font-display block text-[8px] font-bold text-gray-450 uppercase tracking-widest leading-none mb-1.5">Scholarships Disbursed</span>
                  <span className="font-mono text-sm font-bold text-gray-800">1000+ Students</span>
                </div>
                <div className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl">
                  <span className="font-display block text-[8px] font-bold text-gray-450 uppercase tracking-widest leading-none mb-1.5">Women Empowerment</span>
                  <span className="font-mono text-sm font-bold text-gray-800">45% Female Intake</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

        {/* Correspondent Spotlight (Sakthi Thiru. Dr. G. B. Senthil Kumar) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="border-t border-gray-100 pt-16 mb-20 text-left"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left: Correspondent Image Card with Fade/Scale Entrance Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-5/12 flex justify-center"
            >
              <div className="relative group max-w-sm w-full p-2 bg-gray-50 border border-gray-200/80 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={senthilImg} 
                    alt="Dr. G. B. Senthil Kumar" 
                    className="w-full h-[400px] object-cover rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                
                {/* Holographic caption tag overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-pink-400 block mb-0.5">Management Desk</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Dr. G. B. Senthil Kumar</h4>
                  <span className="font-display text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">APEC Correspondent</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Biography & Highlights */}
            <div className="w-full lg:w-7/12 text-left flex flex-col justify-center">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 self-start">
                Correspondent Profile
              </span>
              <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Driving Excellence & Academic Innovation
              </h2>
              <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest block mb-5">
                Sakthi Thiru. Dr. G. B. Senthil Kumar, Correspondent
              </span>
              
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6 font-semibold">
                Under the strategic management of Dr. G. B. Senthil Kumar, Adhiparasakthi Engineering College has transitioned into a premier autonomous engineering research hub. He actively leads governance structures, guides patent creations, expands digital smart campus operations, and oversees corporate partnerships to unlock elite placement records.
              </p>

              {/* Highlights cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: "Administrative Desk", desc: "Oversees general operations, resource deployments, and governance structures.", icon: User, color: "from-blue-500 to-indigo-600" },
                  { title: "Infrastructure Growth", desc: "Pioneered high-speed campus networks and digital smart labs.", icon: Cpu, color: "from-pink-500 to-rose-600" },
                  { title: "Research Incubation", desc: "Promotes multi-field R&D nodes and student patent creations.", icon: BookOpen, color: "from-purple-500 to-violet-600" },
                  { title: "Placement READY", desc: "Drives MNC recruitment linkages and corporate partnerships.", icon: Award, color: "from-emerald-500 to-teal-600" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="p-4 bg-gray-50/50 border border-gray-150 rounded-2xl hover:border-indigo-500 hover:bg-white transition-all duration-300 shadow-sm flex gap-3.5"
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-left">
                        <h4 className="text-xs font-bold text-gray-800 mb-0.5">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Administration Bios (Staggered Scroll Animation) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-100 pt-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Administration
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            Institutional Administration
          </h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[
              { name: "Dr. J. Raja, Ph.D.", role: "Principal", desc: "Guiding academic research operations, accreditation policies, and professional certification pathways." },
              { name: "Dr. V. Ramasamy, Ph.D.", role: "Dean", desc: "Overseeing Anna University curriculum compliance and student-centric department infrastructure expansions." },
              { name: "Mr. M. Sadanandan, MBA", role: "Administrative Officer", desc: "Managing administrative frameworks, campus logistics, resource allocation, and general corporate relations." }
            ].map((leader, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="p-6 border border-gray-150 rounded-2xl flex flex-col md:flex-row md:items-center gap-6 hover:border-indigo-500 hover:bg-gray-50/20 transition-all duration-300 shadow-sm"
              >
                <div className="w-11 h-11 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-base font-bold text-gray-900 mb-0.5">{leader.name}</h4>
                  <span className="font-display text-[9px] uppercase tracking-widest font-extrabold text-indigo-600 block mb-2">{leader.role}</span>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{leader.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
