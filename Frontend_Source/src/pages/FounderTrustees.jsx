import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Shield, BookOpen, Award, Sparkles, HeartHandshake, Eye, Compass, ArrowRight } from 'lucide-react';
import bangaruImg from '../Arulthiru Bangaru Sidhar.jpg';
import lakshmiImg from '../Sakthi Tmt. V. Lakshmi Bangaru Sidhar.jpeg';
import senthilImg from '../Sakthi Thiru. Dr. G. B. Senthil Kumar.jpeg';
import administrationData from '../data/administrationData';

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

// 3D Flip Card Component
function AdminFlipCard({ name, role, desc, img, route }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      navigate(route);
    }
  };

  const handleMouseEnter = () => setIsFlipped(true);
  const handleMouseLeave = () => setIsFlipped(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(route);
    }
  };

  return (
    <div
      className="w-full h-[390px] [perspective:1000px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl"
      role="button"
      tabIndex={0}
      title="View Profile"
      aria-label={`View profile of ${name}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl border border-gray-200/80 shadow-md overflow-hidden bg-white flex flex-col justify-between">
          <div className="w-full h-[76%] overflow-hidden bg-gray-50 flex items-center justify-center">
            {img ? (
              <img src={img} alt={name} className="w-full h-full object-cover object-[center_12%] grayscale-[10%] hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="w-full h-full bg-indigo-50/50 flex items-center justify-center text-indigo-400">
                <User className="w-16 h-16 opacity-75" />
              </div>
            )}
          </div>
          <div className="p-5 text-left grow flex flex-col justify-center border-t border-gray-100 bg-white">
            <h4 className="font-serif text-sm md:text-base font-bold text-gray-900 leading-snug">{name}</h4>
            <span className="font-display text-[9px] font-extrabold text-indigo-650 uppercase tracking-widest mt-1 block">{role}</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl border border-slate-800 shadow-xl bg-slate-950 text-white p-7 flex flex-col justify-between text-left">
          <div>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-serif text-sm md:text-base font-bold text-white leading-snug">{name}</h4>
            <span className="font-display text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-4">{role}</span>
            <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">{desc}</p>
          </div>
          {/* View Profile CTA */}
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowRight className="w-3 h-3" />
            View Profile
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FounderTrustees() {
  return (
    <div className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 animate-pulse">
            Our Visionary Founders
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Founders & Management
          </h1>
          <p className="text-sm md:text-base text-slate-550 leading-relaxed max-w-3xl font-semibold">
            Adhiparasakthi Engineering College is guided by the spiritual ideals, compassion, and leadership of our founder and trustees. Under their stewardship, the institution has provided world-class technical education to students from all walks of life.
          </p>
        </motion.div>

        {/* 1. FOUNDER SECTION: Arulthiru Bangaru Adigalar (Amma) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-16 mb-24"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[9px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-4 inline-block">
                Founder & Spiritual Guide
              </span>
              <h2 className="font-title text-2xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                His Holiness Arulthiru Bangaru Adigalar (Amma)
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-slate-550 font-semibold leading-relaxed">
                <p>
                  His Holiness Arulthiru Bangaru Adigalar, affectionately revered as 'AMMA' by millions of followers, established the ACMEC Trust (Adhiparasakthi Charitable, Medical, Educational and Cultural Trust) in 1978. 
                </p>
                <p>
                  Believing that "Service to humanity is service to God," Amma focused on breaking traditional boundaries. Under his guidance, the Trust became a force for social reform—pioneering accessible higher education, high-tech healthcare, and vocational courses. 
                </p>
                <p>
                  Amma was awarded the prestigious **Padma Shri** by the Government of India in 2019 for his outstanding contributions to social work and spiritual guidance. His legacy continues to inspire the value-centric training of engineers at APEC.
                </p>
              </div>

              {/* Core Philosophy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <HeartHandshake className="w-5 h-5 text-indigo-650 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Empowerment Through Education</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Making technical engineering education affordable and accessible to rural and underprivileged students.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <Sparkles className="w-5 h-5 text-purple-650 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Spiritual Ethics</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Instilling core integrity, human empathy, and strong moral character in future global leaders.</p>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-sm w-full p-2 bg-slate-50 border border-slate-200 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30">
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={bangaruImg} 
                    alt="Arulthiru Bangaru Sidhar (Amma)" 
                    className="w-full h-[420px] object-cover rounded-[24px] grayscale-[10%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">Founder</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Arulthiru Bangaru Adigalar</h4>
                  <span className="font-display text-[9px] text-slate-450 font-semibold uppercase tracking-wider block mt-0.5">Founder (1940 – 2023)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. PRESIDENT SECTION: Sakthi Tmt. V. Lakshmi Bangaru Adigalar */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-16 mb-24"
        >
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[9px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-4 inline-block">
                Trust President
              </span>
              <h2 className="font-title text-2xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Sakthi Tmt. V. Lakshmi Bangaru Adigalar
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-slate-550 font-semibold leading-relaxed">
                <p>
                  As the President of the ACMEC Trust, Sakthi Tmt. V. Lakshmi Bangaru Adigalar has successfully transitioned the institution into a modern, research-first environment. 
                </p>
                <p>
                  Her presidential leadership is defined by a strong commitment to girls' engineering education, rural enrollment drives, and state-of-the-art campus expansions. Under her oversight, the Trust awards millions in academic scholarships annually to deserving candidates.
                </p>
                <p>
                  She continuously guides the college administration to ensure value-added learning frameworks and ensures our engineering pathways align with the socio-economic welfare of the country.
                </p>
              </div>

              {/* Focus points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <Eye className="w-5 h-5 text-pink-600 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Women Empowerment</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Ensuring equal opportunities, robust safety networks, and specialized programs for women in tech fields.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <Compass className="w-5 h-5 text-rose-600 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Universal Inclusivity</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Establishing scholarship funds and structural support networks to ensure no student is denied higher learning.</p>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-sm w-full p-2 bg-slate-50 border border-slate-200 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-pink-500/30">
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={lakshmiImg} 
                    alt="V. Lakshmi Bangaru Adigalar" 
                    className="w-full h-[420px] object-cover rounded-[24px] grayscale-[10%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-pink-400 block mb-0.5">President</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">V. Lakshmi Bangaru Adigalar</h4>
                  <span className="font-display text-[9px] text-slate-450 font-semibold uppercase tracking-wider block mt-0.5">Trust President</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. CORRESPONDENT SECTION: Dr. G. B. Senthil Kumar */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="border-t border-slate-100 pt-16 mb-24"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Biography */}
            <div className="w-full lg:w-7/12">
              <span className="font-display text-[9px] uppercase font-black tracking-widest text-indigo-650 bg-indigo-50 px-3 py-1 rounded-md mb-4 inline-block">
                Correspondent Profile
              </span>
              <h2 className="font-title text-2xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Dr. G. B. Senthil Kumar, Ph.D.
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-slate-550 font-semibold leading-relaxed">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-0.5">Autonomous Transition</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Guided the college through extensive academic audits to secure autonomous standing.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-650 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-0.5">Research Incubation</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Promotes faculty research nodes, student patents, and high-spec lab facilities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Frame */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative group max-w-sm w-full p-2 bg-slate-50 border border-slate-200 rounded-[32px] shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30">
                <div className="overflow-hidden rounded-[24px]">
                  <img 
                    src={senthilImg} 
                    alt="Dr. G. B. Senthil Kumar" 
                    className="w-full h-[420px] object-cover object-top rounded-[24px] grayscale-[10%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" 
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">Correspondent</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Dr. G. B. Senthil Kumar</h4>
                  <span className="font-display text-[9px] text-slate-450 font-semibold uppercase tracking-wider block mt-0.5">Trust Correspondent</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Administration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="border-t border-slate-100 pt-16"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Institutional Leadership
          </span>
          <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            Institutional Administration
          </h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {administrationData.map((leader, idx) => (
              <motion.div key={leader.id} variants={fadeInUp}>
                <AdminFlipCard
                  name={leader.name}
                  role={leader.role}
                  desc={leader.bio.substring(0, 120) + '…'}
                  img={leader.img}
                  route={leader.route}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
