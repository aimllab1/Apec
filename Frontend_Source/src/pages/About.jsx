import React from 'react';
import { User, Shield, Telescope, Cpu, BookOpen, Award, ArrowRight, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import bangaruImg from '../Arulthiru Bangaru Sidhar.jpg';
import lakshmiImg from '../Sakthi Tmt. V. Lakshmi Bangaru Sidhar.jpeg';
import senthilImg from '../Sakthi Thiru. Dr. G. B. Senthil Kumar.jpeg';
import administrationData from '../data/administrationData';

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

// 3D Flip Card Component — navigates to profile page after flip completes
function AdminFlipCard({ name, role, desc, img, route }) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isFlipped) {
      // First click: flip the card
      setIsFlipped(true);
    } else {
      // Second click (already flipped): navigate to the profile page
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
            Adhiparasakthi Engineering College Legacy
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            About the Institution
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl font-semibold">
            Adhiparasakthi Engineering College, Melmaruvathur, is an autonomous institution dedicated to training professionals with technical competencies, spiritual grounding, and a deep sense of service to society. Since 1984, Adhiparasakthi Engineering College has empowered generations of engineers through value-centric, research-oriented pathways.
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
            className="p-8 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Modern Glassmorphic Circular Icon Container */}
              <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Telescope className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">Vision</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Adhiparasakthi Engineering College is committed to creating high-quality engineers, who have a sense of service and spirituality in order to advance the growth of the society at large through the adoption of appropriate technologies and ensure their sustainability.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            variants={fadeInUp}
            className="p-8 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-pink-500 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Modern Glassmorphic Circular Icon Container */}
              <div className="relative w-12 h-12 flex items-center justify-center mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/90 to-rose-600/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">Mission</h3>
              <ul className="space-y-3.5 text-xs text-gray-500 font-semibold leading-relaxed text-left list-none">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
                  <span>Imparting high-quality education with an emphasis on contemporary technologies helps achieve growth across the spectrum of society.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
                  <span>Cultivating empathy and discipline.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 mr-2.5 shrink-0" />
                  <span>Creating a spiritual environment.</span>
                </li>
              </ul>
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
                His Holiness Arulthiru Bangaru Sidhar (Amma)
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 font-semibold">
                His Holiness Arulthiru Bangaru Sidhar, addressed as 'AMMA' by millions of devotees globally, established the ACMEC Trust (Adhiparasakthi Charitable, Medical, Educational and Cultural Trust) in 1978. AMMA dedicated his life to bridging societal divides, deploying free healthcare services, and constructing premier educational ecosystems to uplift underprivileged sectors.
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
                    alt="Arulthiru Bangaru Sidhar (Amma)" 
                    className="w-full h-[400px] object-cover rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                {/* Caption tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">Founder</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Arulthiru Bangaru Sidhar (Amma)</h4>
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
                    alt="Sakthi Tmt. V. Lakshmi Bangaru Sidhar
                  " 
                    className="w-full h-[400px] object-cover rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                
                {/* Caption Tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">President Desk</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">V. Lakshmi Bangaru Sidhar</h4>
                  <span className="font-display text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">President</span>
                </div>
              </div>
            </motion.div>

            {/* Left: Biography & Highlights */}
            <div className="w-full lg:w-7/12 text-left flex flex-col justify-center">
              <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 self-start">
                President Profile
              </span>
              <h2 className="font-title text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                Guiding Institutional Development & Leadership
              </h2>
              <span className="font-display text-xs font-bold text-gray-400 uppercase tracking-widest block mb-5">
                Sakthi Tmt. V. Lakshmi Bangaru Sidhar, President
              </span>
              
              <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6 font-semibold">
                President Sakthi Tmt. V. Lakshmi Bangaru Sidhar leads the overall direction of the ACMEC Trust's educational nodes. Her focal vision rests on elevating rural student admissions, supporting girls' engineering empowerment, and allocating scholarships to underprivileged students to facilitate universal engineering education access.
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
                    className="w-full h-[400px] object-cover object-top rounded-[24px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 shadow-inner" 
                  />
                </div>
                
                {/* Holographic caption tag overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-lg transform group-hover:translate-y-[-2px] transition-transform duration-500">
                  <span className="font-display text-[9px] uppercase tracking-widest font-black text-pink-400 block mb-0.5">Management Desk</span>
                  <h4 className="font-serif text-sm font-bold text-white leading-tight">Dr. G. B. Senthil Kumar</h4>
                  <span className="font-display text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Correspondent</span>
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
