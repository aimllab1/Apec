import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  FileText, 
  Award, 
  BookOpen, 
  Download, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Info, 
  Coins, 
  Clock, 
  Users, 
  FileCheck,
  Search,
  BookOpenCheck,
  Calculator
} from 'lucide-react';
import CutoffCalculator from './CutoffCalculator';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function Admission() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'courses';
  
  const cleanName = (name) => {
    return name
      .replace(/^B\.E\. - /, '')
      .replace(/^B\.Tech\. - /, '')
      .replace(/^M\.E\. - /, '')
      .replace(/^PhD - /, '')
      .replace(/^PhD\s*-\s*/, '')
      .replace(/^M\.B\.A\.\s*/, '')
      .replace(/^M\.C\.A\.\s*/, '')
      .replace(/\(Master of Business Administration\)/, 'Master of Business Administration')
      .replace(/\(Master of Computer Applications\)/, 'Master of Computer Applications')
      .replace(/Computer Science and Engineering/g, 'CSE')
      .replace(/Computer Science & Engineering/g, 'CSE')
      .replace(/Artificial Intelligence and Machine Learning/g, 'AI & ML')
      .replace(/Artificial Intelligence and Data Science/g, 'AI & DS')
      .replace(/Electronics and Communication Engineering/g, 'Electronics & Communication')
      .replace(/Electrical and Electronics Engineering/g, 'Electrical & Electronics')
      .replace(/Construction Engineering and Management/g, 'Construction Engineering & Mgmt');
  };

  // Scholarship filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Program details mapping (Intakes and names)
  const ugPrograms = [
    { name: "B.E. - Civil Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60, img: "/Images/Dept/civil dept.jpg" },
    { name: "B.E. - Mechanical Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60, img: "/Images/Dept/mech dept.jpg" },
    { name: "B.E. - Electrical and Electronics Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60, img: "/Images/Dept/eee dept.jpg" },
    { name: "B.E. - Electronics and Communication Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 90, img: "/Images/Dept/ece dept.jpg" },
    { name: "B.E. - Computer Science and Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 90, img: "/Images/Dept/cse dept.png" },
    { name: "B.E. - Computer Science & Engineering (Artificial Intelligence and Machine Learning)", duration: "4 Years", type: "Under Graduate Programme", intake: 30, img: "/Images/Dept/aiml dept.jpg" },
    { name: "B.Tech. - Information Technology", duration: "4 Years", type: "Under Graduate Programme", intake: 60, img: "/Images/Dept/it dept.jpg" },
    { name: "B.Tech. - Chemical Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 40, img: "/Images/Dept/chem dept.jpg" },
    { name: "B.Tech. - Agricultural Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 40, img: "/Images/Dept/agri dept.jpg" },
    { name: "B.Tech. - Artificial Intelligence and Data Science", duration: "4 Years", type: "Under Graduate Programme", intake: 60, img: "/Images/Dept/ai ds dept.jpg" },
    { name: "B.E. - Computer Science & Engineering (Computer System Design)", duration: "4 Years", type: "Under Graduate Programme", intake: 30, img: "/Images/Dept/csd  dept.jpg" }
  ];

  const pgPrograms = [
    { name: "M.E. - Computer Science and Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 9, img: "/Images/Dept/me.cse.jpg", key: "me-cse" },
    { name: "M.E. - Thermal Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 18, img: "/Images/Dept/me.thermak.jpg", key: "me-thermal" },
    { name: "M.E. - VLSI Design", duration: "2 Years", type: "Post Graduate Programme", intake: 9, img: "/Images/Dept/m.e.vlsi.jpg", key: "me-vlsi" },
    { name: "M.E. - Power Electronics & Drives Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 9, img: "/Images/Dept/power-electronics-electrical-drives.jpg", key: "me-ped" },
    { name: "M.E. - Construction Engineering and Management", duration: "2 Years", type: "Post Graduate Programme", intake: 18, img: "/Images/Dept/m.e.construction engg and mangement.jpg", key: "me-cem" },
    { name: "M.B.A. (Master of Business Administration)", duration: "2 Years", type: "Post Graduate Programme", intake: 60, img: "/Images/Dept/MBA.jpg", key: "mba" },
    { name: "M.C.A. (Master of Computer Applications)", duration: "2 Years", type: "Post Graduate Programme", intake: 60, img: "/Images/Dept/MCA.jpg", key: "mca" }
  ];

  const phdPrograms = [
    { name: "PhD - Civil Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)", img: "/Images/Dept/phd.civil.jpg" },
    { name: "PhD - Mechanical Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)", img: "/Images/Dept/phd.mech.jpg" },
    { name: "PhD - Electrical and Electronics Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)", img: "/Images/Dept/phd.eee.jpg" },
    { name: "PhD - Electronics and Communication Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)", img: "/Images/Dept/phd.ece.jpg" }
  ];

  // Scholarship Details
  const scholarships = [
    {
      id: 1,
      title: "Lead to Serve... Wings to Your Dreams...",
      amount: "Rs. 25,000",
      provider: "Sakthi Peedam and Spiritual Center of North America, USA",
      category: "Need-based",
      description: "Awarded every year to economically poor students with good academic performance and leadership qualities."
    },
    {
      id: 2,
      title: "Arulthiru Amma Scholarship",
      amount: "Full / Partial Fees",
      provider: "Adhiparasakthi Charitable, Medical, Educational and Cultural Trust, Melmaruvathur",
      category: "Merit-based",
      description: "Awarded to meritorious students. This scholarship covers the entire fees either in full or partially according to their cutoff marks in the higher secondary board exam."
    },
    {
      id: 3,
      title: "Full Tuition Fee Concession for SC/ST Students",
      amount: "100% Tuition Fee",
      provider: "Government of Tamil Nadu",
      category: "SC/ST Welfare",
      description: "Government is giving full tuition fee concession to SC/ST students whose annual income is less than Rs. 2,50,000/- irrespective of the quota in which admitted. They need not pay the tuition fee."
    },
    {
      id: 4,
      title: "Government of India Post Matric Scholarship",
      amount: "Maintenance & Fees Support",
      provider: "Government of India",
      category: "SC/ST Welfare",
      description: "Granted to SC/ST students whose parent's annual income is less than Rs. 2,50,000/- in addition to tuition fee concession."
    },
    {
      id: 5,
      title: "Higher Educational Special Scholarship for SC/ST",
      amount: "Rs. 8,000 / Year",
      provider: "State Government",
      category: "SC/ST Welfare",
      description: "Financial assistance provided to the SC/ST hostel students whose annual parent income is less than Rs. 1,00,000/-."
    },
    {
      id: 6,
      title: "Adhoc Merit Grants for SC/ST",
      amount: "Merit Grant",
      provider: "Director of Collegiate Education, Chennai",
      category: "SC/ST Welfare",
      description: "Awarded to SC/ST students on the basis of marks secured in the Higher Secondary Examination."
    },
    {
      id: 7,
      title: "State Govt Free Education Scholarship for BC/MBC/DNC",
      amount: "Special Fees & Book Allowance",
      provider: "District Backward Class Welfare Officer",
      category: "BC/MBC Welfare",
      description: "Awarded to BC/MBC/DNC students of Hindu religion who have secured not less than 40% aggregate in HSC/previous year examinations. Parent's annual income must be less than Rs. 2,00,000/-."
    },
    {
      id: 8,
      title: "First Generation Graduate Tuition Fee Concession",
      amount: "Rs. 20,000 / Year",
      provider: "State Government of Tamil Nadu",
      category: "First Graduate",
      description: "Granted to First Generation graduate students selected under Government quota through single window counseling (Anna University), whose parent's annual income is less than Rs. 2,00,000/-."
    },
    {
      id: 9,
      title: "AICTE’s Tuition Fee Waiver Scheme (TFW)",
      amount: "Rs. 20,000 / Year",
      provider: "AICTE / State Government",
      category: "Merit-based",
      description: "Top 5% of students in each branch are given tuition fee concession of Rs. 20,000/- per student in UG engineering courses, subject to overall admission metrics."
    },
    {
      id: 10,
      title: "National Foundation of Teachers Welfare Fund",
      amount: "Rs. 5,000 / Year",
      provider: "Government of India",
      category: "Special Category",
      description: "Scholarship awarded to candidates whose parents are working as teachers."
    },
    {
      id: 11,
      title: "Merit-Cum-Means Scholarship for Minority Students",
      amount: "Rs. 30,000 / Year",
      provider: "Government of India",
      category: "Minority Support",
      description: "Available to Muslim, Christian, and other minority students whose parents' annual income is less than Rs. 2,50,000/-."
    }
  ];

  // Filtering scholarship logic
  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Merit-based', 'Need-based', 'SC/ST Welfare', 'BC/MBC Welfare', 'First Graduate', 'Minority Support'];

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/65 border border-[#FF8A00]/25 px-4 py-1.5 rounded-full inline-block mb-4">
            Admissions 2026 - 27
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Join Adhiparasakthi Engineering College
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-medium">
            Explore our diverse programs, view step-by-step admission procedures, access state & national scholarships, and download our official information brochure.
          </p>
        </motion.div>

        {/* TAB BUTTONS (NAVIGATION) */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 border-b border-gray-150 pb-4">
          {[
            { id: 'courses', label: 'Courses Offered', icon: GraduationCap },
            { id: 'procedure', label: 'Admission Procedure', icon: FileCheck },
            { id: 'scholarships', label: 'Scholarships', icon: Coins },
            { id: 'brochure', label: 'Information Brochure', icon: FileText },
            { id: 'cutoff', label: 'Cutoff Calculator', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all ${
                  isActive 
                    ? 'bg-[#FF8A00] text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT WITH ANIMATION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="tab-panel-content"
          >

            {/* TAB 1: COURSES OFFERED */}
            {activeTab === 'courses' && (
              <div className="space-y-12 text-left">
                {/* UG Programs */}
                <div className="space-y-12">
                  {/* B.E. Programmes */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">Undergraduate B.E. Programmes</h2>
                        <p className="text-[11px] font-bold text-indigo-650 uppercase tracking-widest mt-0.5">4 Years Duration • Full Time</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ugPrograms.filter(c => !c.name.startsWith('B.Tech')).map((course, idx) => (
                        <motion.div 
                          key={idx}
                          className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-[#FF8A00]/40 transition-all flex flex-col justify-between overflow-hidden"
                          whileHover={{ y: -2 }}
                        >
                          {course.img && (
                            <div className="w-full h-48 overflow-hidden border-b border-gray-100">
                              <img 
                                src={course.img} 
                                alt={course.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF8A00] rounded-md mb-3 border border-orange-100">
                                B.E.
                              </span>
                              <h3 className="font-serif text-xs font-bold text-gray-800 leading-snug mb-2">{cleanName(course.name)}</h3>
                              <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-300" /> Duration: {course.duration}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Approved Intake</span>
                              <span className="text-[11px] font-black text-slate-800 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-gray-400" /> {course.intake} seats
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* B.Tech. Programmes */}
                  <div>
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">Undergraduate B.Tech. Programmes</h2>
                        <p className="text-[11px] font-bold text-indigo-650 uppercase tracking-widest mt-0.5">4 Years Duration • Full Time</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ugPrograms.filter(c => c.name.startsWith('B.Tech')).map((course, idx) => (
                        <motion.div 
                          key={idx}
                          className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-[#FF8A00]/40 transition-all flex flex-col justify-between overflow-hidden"
                          whileHover={{ y: -2 }}
                        >
                          {course.img && (
                            <div className="w-full h-48 overflow-hidden border-b border-gray-100">
                              <img 
                                src={course.img} 
                                alt={course.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF8A00] rounded-md mb-3 border border-orange-100">
                                B.Tech
                              </span>
                              <h3 className="font-serif text-xs font-bold text-gray-800 leading-snug mb-2">{cleanName(course.name)}</h3>
                              <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-300" /> Duration: {course.duration}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Approved Intake</span>
                              <span className="text-[11px] font-black text-slate-800 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-gray-400" /> {course.intake} seats
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PG M.E. Programs */}
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-650">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">Postgraduate M.E. Programmes</h2>
                      <p className="text-[11px] font-bold text-purple-600 uppercase tracking-widest mt-0.5">2 Years Duration • Full Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pgPrograms.filter(c => c.name.startsWith('M.E.')).map((course, idx) => (
                      <Link to={`/departments/${course.key}`} key={idx} className="block group">
                        <motion.div 
                          className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-400/40 transition-all flex flex-col justify-between overflow-hidden h-full"
                          whileHover={{ y: -2 }}
                        >
                          {course.img && (
                            <div className="w-full h-48 overflow-hidden border-b border-gray-100">
                              <img 
                                src={course.img} 
                                alt={course.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 rounded-md mb-3 border border-purple-100">
                                M.E.
                              </span>
                              <h3 className="font-serif text-xs font-bold text-gray-800 leading-snug mb-2">{cleanName(course.name)}</h3>
                              <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-300" /> Duration: {course.duration}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Approved Intake</span>
                              <span className="text-[11px] font-black text-slate-800 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-gray-400" /> {course.intake} seats
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* PG Professional Programs */}
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">Postgraduate Professional Programmes (MBA / MCA)</h2>
                      <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">2 Years Duration • Full Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pgPrograms.filter(c => !c.name.startsWith('M.E.')).map((course, idx) => (
                      <Link to={`/departments/${course.key}`} key={idx} className="block group">
                        <motion.div 
                          className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-400/40 transition-all flex flex-col justify-between overflow-hidden h-full"
                          whileHover={{ y: -2 }}
                        >
                          {course.img && (
                            <div className="w-full h-48 overflow-hidden border-b border-gray-100">
                              <img 
                                src={course.img} 
                                alt={course.name} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-650 rounded-md mb-3 border border-indigo-100">
                                {course.name.includes('M.B.A') ? 'M.B.A' : 'M.C.A.'}
                              </span>
                              <h3 className="font-serif text-xs font-bold text-gray-800 leading-snug mb-2">{cleanName(course.name)}</h3>
                              <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-300" /> Duration: {course.duration}
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Approved Intake</span>
                              <span className="text-[11px] font-black text-slate-800 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-gray-400" /> {course.intake} seats
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ph.D. Programs */}
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                    <div className="p-2 rounded-xl bg-pink-50 text-pink-650">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">Doctoral Programmes (Ph.D.)</h2>
                      <p className="text-[11px] font-bold text-pink-650 uppercase tracking-widest mt-0.5">Research Programs • Full Time / Part Time</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {phdPrograms.map((course, idx) => (
                      <motion.div 
                        key={idx}
                        className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-pink-400/40 transition-all flex flex-col justify-between overflow-hidden"
                        whileHover={{ y: -2 }}
                      >
                        {course.img && (
                          <div className="w-full h-48 overflow-hidden border-b border-gray-100">
                            <img 
                              src={course.img} 
                              alt={course.name} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-5 flex flex-col justify-between flex-grow">
                          <div>
                            <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-pink-50 text-pink-650 rounded-md mb-3 border border-pink-100">
                              Ph.D.
                            </span>
                            <h3 className="font-serif text-xs font-bold text-gray-800 leading-snug mb-2">{cleanName(course.name)}</h3>
                            <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-300" /> Duration: {course.duration}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wider">Affiliated Board</span>
                            <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                              Anna University Approved
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* PDF Link CTA for Courses */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50/20 border border-gray-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Looking for official admission publications?</h4>
                    <p className="text-xs text-gray-400 font-semibold">Download the structured official PDF list of all courses offered at APEC.</p>
                  </div>
                  <a 
                    href="/Documents/PDFs/Admission/1. Courses Offered.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Courses List PDF
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: ADMISSION PROCEDURE */}
            {activeTab === 'procedure' && (
              <div className="space-y-12 text-left">
                
                {/* Introduction & Quotas */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl text-white">
                  <h3 className="font-title text-xl md:text-2xl font-bold mb-4 text-[#FF8A00]">Admission Pathways</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium mb-6">
                    Adhiparasakthi Engineering College holds autonomous status. All student admissions are structured under two main quotas: Government Quota (through single window counseling system of the State Government) and Management Quota (through the Self-Financing Professional Colleges Consortium).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-[#FF8A00] text-xs font-bold block uppercase tracking-widest mb-1">01. Government Quota</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Allotted based on Higher Secondary cutoff marks through single window counseling organized by Anna University, Chennai.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <span className="text-purple-400 text-xs font-bold block uppercase tracking-widest mb-1">02. Management Quota</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        Allotted based on merit through Consortium of Self-Financing Professional, Arts & Science Colleges in Tamil Nadu.
                      </p>
                    </div>
                  </div>
                </div>

                {/* UG Program Procedures */}
                <div>
                  <h3 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
                    UG Programmes Admission Procedure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Government Quota UG */}
                    <div className="p-6 bg-white border border-gray-200 rounded-3xl hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF8A00]">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Government Quota</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-6">
                          Candidates seeking admission for UG Programmes Under Government Quota must apply to <strong>‘The Secretary, Engineering Admissions, Anna University, Chennai – 25.’</strong> Merit list will be prepared by Anna University. Students will be called for counseling based on this merit list, where college & branch allotment takes place.
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-gray-400">
                          <Phone className="w-4 h-4 text-[#FF8A00] shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-gray-700">Anna University Helpline:</span>
                            <span className="font-mono text-gray-500">(044) 2235 8282, 2230 1393</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Management Quota UG */}
                    <div className="p-6 bg-white border border-gray-200 rounded-3xl hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Management Quota</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-6">
                          Candidates seeking admission for UG Programmes Under Management Quota must apply to <strong>‘The Secretary, Consortium of self-financing professional, Arts & Science College in Tamil Nadu, Chennai – 14.’</strong> Merit list will be prepared by the consortium. Students are allotted college branches from this merit list based on choices filled.
                        </p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-gray-400">
                          <Phone className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-gray-700">Consortium Helpline:</span>
                            <span className="font-mono text-gray-500">(044) 2450 2203</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* PG Program Procedures */}
                <div>
                  <h3 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
                    PG Programmes Admission Procedure
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-550/5 text-gray-700 uppercase tracking-wider font-extrabold border-b border-gray-200">
                          <th className="p-4 border-r border-gray-200">Quota</th>
                          <th className="p-4 border-r border-gray-200">Entrance Exam Required</th>
                          <th className="p-4">To Whom to Apply</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 font-semibold text-gray-500">
                        <tr className="hover:bg-gray-50/50">
                          <td className="p-4 border-r border-gray-200 font-bold text-gray-800">Government Quota</td>
                          <td className="p-4 border-r border-gray-200">
                            <span className="px-2.5 py-1 rounded bg-[#FFE7CC] text-[#FF8A00] text-[10px] font-black tracking-wider uppercase">TANCET</span>
                          </td>
                          <td className="p-4 leading-relaxed">
                            <strong>For M.E. :</strong> The Secretary, TANCA, Anna University, Chennai.<br />
                            <strong>For MBA & MCA :</strong> The Secretary MBA/MCA Admissions, CIT, Coimbatore.
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50">
                          <td className="p-4 border-r border-gray-200 font-bold text-gray-800">Management Quota</td>
                          <td className="p-4 border-r border-gray-200 leading-relaxed">
                            Entrance Exam conducted by the Consortium of Self-Financing Professional, Arts & Science Colleges in Tamil Nadu.
                          </td>
                          <td className="p-4 leading-relaxed">
                            The Principal, Adhiparasakthi Engineering College, Melmaruvathur <br/>
                            - OR - <br/>
                            Secretary, Consortium of Self-Financing Professional Colleges in TN.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Intake Capacity Lists */}
                <div>
                  <h3 className="font-title text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
                    Approved Intake Capacities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* UG Intake Table */}
                    <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
                      <div className="bg-orange-50/80 px-4 py-3 border-b border-gray-200">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#FF8A00] flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" /> Undergraduate (B.E. / B.Tech)
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-150 text-xs font-semibold text-gray-500">
                        {[
                          { dept: "CIVIL", intake: 60 },
                          { dept: "MECH", intake: 60 },
                          { dept: "ECE", intake: 90 },
                          { dept: "EEE", intake: 60 },
                          { dept: "CSE", intake: 90 },
                          { dept: "IT", intake: 60 },
                          { dept: "CHEM", intake: 40 },
                          { dept: "CSE (AIML)", intake: 30 },
                          { dept: "CSE (CSD)", intake: 30 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between px-4 py-2.5 hover:bg-gray-50/50">
                            <span className="font-bold text-gray-800">{item.dept}</span>
                            <span className="font-mono text-gray-650 bg-gray-100 px-2 py-0.5 rounded font-bold">{item.intake} Seats</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PG Engineering Intake */}
                    <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
                      <div className="bg-purple-50/80 px-4 py-3 border-b border-gray-200">
                        <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" /> Postgraduate M.E.
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-150 text-xs font-semibold text-gray-500">
                        {[
                          { dept: "Construction Eng & Mgmt", intake: 18, key: "me-cem" },
                          { dept: "Thermal Engineering", intake: 18, key: "me-thermal" },
                          { dept: "VLSI Design", intake: 9, key: "me-vlsi" },
                          { dept: "Power Electronics & Drives", intake: 9, key: "me-ped" },
                          { dept: "Computer Science & Engg", intake: 9, key: "me-cse" }
                        ].map((item, idx) => (
                          <Link 
                            to={`/departments/${item.key}`}
                            key={idx} 
                            className="flex justify-between px-4 py-2.5 hover:bg-gray-50/50 transition-colors hover:text-[#FF8A00] group"
                          >
                            <span className="font-bold text-gray-800 leading-tight group-hover:text-[#FF8A00]">{item.dept}</span>
                            <span className="font-mono text-gray-650 bg-gray-100 px-2 py-0.5 rounded font-bold shrink-0">{item.intake} Seats</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* PG Professional Intake & Doctoral */}
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
                        <div className="bg-indigo-50/80 px-4 py-3 border-b border-gray-200">
                          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4" /> MBA & MCA Programmes
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-150 text-xs font-semibold text-gray-500">
                          {[
                            { dept: "Master of Business Admin (MBA)", intake: 60, key: "mba" },
                            { dept: "Master of Computer Apps (MCA)", intake: 60, key: "mca" }
                          ].map((item, idx) => (
                            <Link 
                              to={`/departments/${item.key}`}
                              key={idx} 
                              className="flex justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors hover:text-[#FF8A00] group"
                            >
                              <span className="font-bold text-gray-800 group-hover:text-[#FF8A00]">{item.dept}</span>
                              <span className="font-mono text-gray-650 bg-gray-100 px-2 py-0.5 rounded font-bold shrink-0">{item.intake} Seats</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-2xl p-5 bg-pink-50/20 border-pink-100 text-left">
                        <h4 className="text-xs font-bold text-pink-650 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpenCheck className="w-4 h-4" /> Doctoral Programmes (Ph.D.)
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                          Candidates seeking admission to Ph.D. research programmes are requested to review notifications published by Anna University directly on the official Anna University website.
                        </p>
                        <a 
                          href="https://www.annauniv.edu/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-650 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                        >
                          Visit Anna University Website <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Important Notes & Guidelines (Warning Board) */}
                <div className="p-6 border border-rose-200 bg-rose-50/20 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <h4 className="text-sm font-black uppercase tracking-wider">Critical Rules & Admission Policies</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-semibold leading-relaxed">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <p>Selected Candidates are required to pay the prescribed fees immediately on selection.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <p>All admissions are provisional, subject to the approval of the University and the Director of Technical Education (DOTE).</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <p>All Original Certificates including Community Certificates produced at the time of Admission will be retained in the college office for one year.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-rose-100/60 rounded-xl border border-rose-200">
                        <p className="text-rose-850 font-extrabold flex items-start gap-1">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                          <span>FEE ONCE PAID WILL NOT BE REFUNDED either in full or partially under any circumstances.</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <p>Admission is subject to verification of mark sheets by the director of government examinations. If found bogus, admission will be cancelled and criminal action initiated.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <p>All students must conform to the rules of discipline and good behavior, and should not indulge in any activities against management or government.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* College Admission Inquiry Desk */}
                <div className="p-6 md:p-8 bg-gradient-to-r from-gray-50 via-indigo-50/10 to-gray-50 border border-gray-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 mb-1 flex items-center gap-1.5">
                      <Phone className="w-5 h-5 text-indigo-650" /> College Inquiry Desk
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                      For any questions or support regarding admissions under either quota, reach out to the college administrative officers.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 shrink-0 font-mono text-sm font-black text-indigo-650 bg-white border border-gray-150 px-5 py-3 rounded-2xl shadow-sm">
                    <span className="flex items-center gap-1.5">
                      Phone: 7418064336
                    </span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="flex items-center gap-1.5">
                      7418065336
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: SCHOLARSHIPS */}
            {activeTab === 'scholarships' && (
              <div className="space-y-8 text-left">
                
                {/* Intro & Search Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-150">
                  <div className="text-left">
                    <h3 className="text-base font-black text-gray-900 mb-0.5">Financial Support Schemes</h3>
                    <p className="text-xs text-gray-400 font-semibold">Showing {filteredScholarships.length} of {scholarships.length} scholarships available at APEC.</p>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Search scholarships..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF8A00] focus:border-[#FF8A00]"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all border ${
                        selectedCategory === cat 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Scholarship Grid */}
                {filteredScholarships.length > 0 ? (
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {filteredScholarships.map((s, idx) => (
                      <motion.div
                        key={s.id}
                        variants={fadeInUp}
                        className="p-6 bg-white border border-gray-200 rounded-3xl hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-650 rounded-md border border-indigo-100">
                              {s.category}
                            </span>
                            <span className="font-mono text-xs font-black text-[#FF8A00] bg-orange-50/50 border border-orange-100 px-3 py-1 rounded-full">
                              {s.amount}
                            </span>
                          </div>
                          
                          <h4 className="font-serif text-base font-bold text-gray-900 leading-snug mb-2">
                            {s.id}. {s.title}
                          </h4>
                          
                          <p className="text-xs text-gray-400 font-bold mb-3 leading-snug">
                            Provider: <span className="text-gray-600">{s.provider}</span>
                          </p>
                          
                          <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                            {s.description}
                          </p>
                        </div>

                        {/* Visual verification checkmark */}
                        <div className="mt-4 pt-3.5 border-t border-gray-50 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          <span>Institutional Support</span>
                          <span className="flex items-center gap-1 text-emerald-600 font-black">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Active Application
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="py-12 border border-dashed border-gray-300 rounded-3xl text-center text-gray-400">
                    <p className="text-sm font-semibold">No scholarships matching your criteria were found.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                      className="mt-3 text-xs font-bold text-indigo-650 hover:underline"
                    >
                      Clear filters and try again
                    </button>
                  </div>
                )}

                {/* PDF Link CTA for Scholarships */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50/20 border border-gray-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Need the full scholarships circular?</h4>
                    <p className="text-xs text-gray-400 font-semibold">You can download the official college scholarships PDF document for your records.</p>
                  </div>
                  <a 
                    href="/Documents/PDFs/Admission/2. Scholarships.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Scholarships PDF
                  </a>
                </div>

              </div>
            )}

            {/* TAB 4: BROCHURE */}
            {activeTab === 'brochure' && (
              <div className="space-y-8 text-left">
                
                {/* Hero card for brochure */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-purple-50/30 border border-indigo-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-650 block">Official Publication</span>
                    <h3 className="font-title text-xl md:text-2xl font-bold text-gray-900">APEC Information Brochure</h3>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-semibold max-w-xl">
                      Read about our campus guidelines, academic cells, state-of-the-art laboratory infrastructures, campus events, and placement highlights in the official college brochure.
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                    <a 
                      href="/Documents/PDFs/bro.pdf" 
                      download="APEC_Admission_Brochure.pdf" 
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-[#FF8A00] hover:bg-[#E07B00] text-white rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all shadow-md shadow-orange-500/10 text-center"
                    >
                      <Download className="w-4 h-4" /> Download PDF (6.8 MB)
                    </a>
                    <a 
                      href="/Documents/PDFs/bro.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all text-center"
                    >
                      <ExternalLink className="w-4 h-4" /> Open In New Tab
                    </a>
                  </div>
                </div>

                {/* Embedded PDF Viewer */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden bg-gray-50 shadow-md">
                  <div className="bg-white border-b border-gray-150 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-650" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">Inline Brochure Document Preview</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 font-bold">PDF Format</span>
                  </div>
                  
                  <div className="relative w-full h-[650px] bg-[#5c6370]">
                    {/* Embedded frame */}
                    <iframe 
                      src="/Documents/PDFs/bro.pdf#toolbar=0" 
                      title="APEC Brochure PDF"
                      className="w-full h-full border-none"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                </div>

                {/* Compatibility notice */}
                <div className="flex items-start gap-2.5 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-400 font-medium leading-normal">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>PDF Loading Issue?</strong> Some mobile web browsers may disable inline PDF previews. If the document does not display above, please use the <strong>Download PDF</strong> or <strong>Open in New Tab</strong> options to view it directly.
                  </p>
                </div>

              </div>
            )}

            {/* TAB 5: CUTOFF CALCULATOR */}
            {activeTab === 'cutoff' && (
              <div className="space-y-8 text-left">
                <CutoffCalculator isEmbedded={true} />
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

