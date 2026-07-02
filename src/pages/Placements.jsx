import React, { useEffect, useState } from 'react';
import { Award, Briefcase, Handshake, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

function CountUp({ end, suffix = "", duration = 1.5 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endVal = parseFloat(end);
    if (isNaN(endVal)) {
      setCount(end);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * endVal);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endVal);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

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

export default function Placements() {
  const stats = [
    { value: 92, suffix: "%", label: "Placement Percentage" },
    { value: 350, suffix: "+", label: "Offers Generated Yearly" },
    { value: 50, suffix: "+", label: "Recruiting Partners" },
    { value: 12, suffix: " LPA", label: "Highest CTC Offered" }
  ];

  const partners = [
    { name: "Tata Consultancy Services (TCS)", type: "MOU Partner" },
    { name: "Wipro Technologies", type: "MOU Partner" },
    { name: "Cognizant Technology Solutions (CTS)", type: "Recruiter" },
    { name: "Infosys", type: "Recruiter" },
    { name: "HCL Technologies", type: "MOU Partner" },
    { name: "Accenture", type: "Recruiter" },
    { name: "TVS Motors", type: "Industrial MOU" },
    { name: "FANUC India", type: "Industrial Partner" }
  ];

  const activities = [
    { title: "Campus Recruitment Training (CRT)", desc: "Aptitude, logical reasoning, and programming drills starting from the third year." },
    { title: "MOU Tie-ups & Internships", desc: "Active collaborations with core automation, chemical, and software development cells." },
    { title: "Mock Interview Drills", desc: "Conducted by alumni working in tech cells to refine students' communications and soft skills." }
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
          <span className="font-display text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Career Cells
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">Placements & MOUs</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed font-semibold">
            Adhiparasakthi Engineering College Placement cell trains students in technical skills, aptitude benchmarks, and soft skills to secure careers in corporate organisations.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 bg-gray-50 border border-gray-200 rounded-3xl text-center hover:border-indigo-500 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <span className="font-mono block text-3xl font-black text-gray-900 mb-1">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </span>
              <span className="font-display text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* MOUs & Recruiting Partners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="font-title text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-600" />
              Corporate Collaborations & MOUs
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6 font-semibold">
              Adhiparasakthi Engineering College has active Memorandum of Understanding (MOU) relationships with major enterprises to coordinate industrial visits, value-added certification courses, and direct student placements.
            </p>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {partners.map((partner, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeInUp}
                  whileHover={{ scale: 1.015 }}
                  className="p-4 bg-gray-50/50 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-indigo-500 hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <h5 className="text-xs font-bold text-gray-800 leading-snug">{partner.name}</h5>
                    <span className="font-display text-[9px] uppercase font-semibold text-gray-450 tracking-wider">{partner.type}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Placement Training Programs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h3 className="font-title text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Placement Training Programs
            </h3>
            
            <div className="space-y-6">
              {activities.map((act, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -2 }}
                  className="p-6 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-md transition-all duration-300 text-left"
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-2">{act.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">{act.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
