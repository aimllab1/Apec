import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, GraduationCap, ChevronDown, X, 
  BookOpen, Sparkles, HeartHandshake, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function CutoffCalculator({ isEmbedded = false }) {
  // Calculator Marks States
  const [mathsMark, setMathsMark] = useState(85);
  const [physicsMark, setPhysicsMark] = useState(80);
  const [chemistryMark, setChemistryMark] = useState(80);

  const m = parseFloat(mathsMark) || 0;
  const p = parseFloat(physicsMark) || 0;
  const c = parseFloat(chemistryMark) || 0;
  const cutoff = m + (p + c) / 2;

  // Admissions modal overlay and form state
  const [showAdModal, setShowAdModal] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState(0);
  const modalImages = ['/library.webp', '/library2.webp'];

  useEffect(() => {
    if (showAdModal) {
      const timer = setInterval(() => {
        setActiveModalImage(prev => (prev === 0 ? 1 : 0));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [showAdModal]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dept: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleMarkChange = (subject, val) => {
    if (val === '') {
      if (subject === 'maths') setMathsMark('');
      if (subject === 'physics') setPhysicsMark('');
      if (subject === 'chemistry') setChemistryMark('');
      return;
    }
    const num = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    if (subject === 'maths') setMathsMark(num);
    if (subject === 'physics') setPhysicsMark(num);
    if (subject === 'chemistry') setChemistryMark(num);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.dept) {
      errors.dept = 'Please select a preferred department';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const newInquiry = {
        ...formData,
        maths: mathsMark,
        physics: physicsMark,
        chemistry: chemistryMark,
        cutoff: cutoff.toFixed(1),
        id: Date.now(),
        date: new Date().toLocaleString()
      };

      try {
        await addDoc(collection(db, "inquiries"), newInquiry);
        const existing = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
        existing.push(newInquiry);
        localStorage.setItem('apec_inquiries', JSON.stringify(existing));
        setIsSubmitting(false);
        setFormSubmitted(true);
      } catch (err) {
        console.error("Firestore database connection failed. Storing locally instead: ", err);
        const existing = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
        existing.push(newInquiry);
        localStorage.setItem('apec_inquiries', JSON.stringify(existing));
        setIsSubmitting(false);
        setFormSubmitted(true);
      }
    }
  };

  return (
    <div className={isEmbedded ? "bg-white py-4" : "bg-white py-20 px-6 min-h-screen"}>
      <div className={isEmbedded ? "max-w-6xl mx-auto" : "max-w-7xl mx-auto"}>
        
        {/* Header/Intro section */}
        {!isEmbedded && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-10"
          >
            <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-rose-600 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
              Adhiparasakthi Engineering College Admission Support
            </span>
            <h1 className="font-title text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-0">
              Cutoff Calculator & Course Predictor
            </h1>
          </motion.div>
        )}

        {/* Predictor Interactive Panel */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          
          {/* Left Column: Marks Input Panel */}
          <motion.div 
            variants={fadeInUp}
            className="lg:col-span-6 bg-white border border-gray-200 p-8 rounded-3xl flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 block mb-4">Enter Subject Marks (0 - 100)</span>
              
              {/* Mathematics (Weight: 100%) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Mathematics</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={mathsMark}
                      onChange={(e) => handleMarkChange('maths', e.target.value)}
                      className="w-12 text-center text-xs font-mono font-black text-rose-650 bg-rose-50 px-1 py-0.5 rounded-md border border-rose-200 outline-none focus:border-rose-450 focus:ring-1 focus:ring-rose-450/20"
                    />
                    <span className="text-xs font-bold text-gray-400 font-mono">/ 100</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={mathsMark} 
                  onChange={(e) => handleMarkChange('maths', e.target.value)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>

              {/* Physics (Weight: 50%) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Physics</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={physicsMark}
                      onChange={(e) => handleMarkChange('physics', e.target.value)}
                      className="w-12 text-center text-xs font-mono font-black text-orange-655 bg-orange-50 px-1 py-0.5 rounded-md border border-orange-200 outline-none focus:border-orange-450 focus:ring-1 focus:ring-orange-450/20"
                    />
                    <span className="text-xs font-bold text-gray-400 font-mono">/ 100</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={physicsMark} 
                  onChange={(e) => handleMarkChange('physics', e.target.value)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Chemistry (Weight: 50%) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">Chemistry</label>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={chemistryMark}
                      onChange={(e) => handleMarkChange('chemistry', e.target.value)}
                      className="w-12 text-center text-xs font-mono font-black text-amber-600 bg-amber-50 px-1 py-0.5 rounded-md border border-amber-200 outline-none focus:border-amber-450 focus:ring-1 focus:ring-amber-450/20"
                    />
                    <span className="text-xs font-bold text-gray-400 font-mono">/ 100</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={chemistryMark} 
                  onChange={(e) => handleMarkChange('chemistry', e.target.value)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

            </div>

            {/* Calculated TNEA Cutoff Indicator */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">TNEA Formula</span>
                <span className="text-xs text-gray-550 font-bold block mt-1">Maths + (Physics + Chemistry)/2</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-orange-500/10" />
                  <span className="font-mono text-base font-black text-rose-650 leading-none">
                    {cutoff.toFixed(1)}
                  </span>
                  <span className="text-[7px] uppercase font-bold text-orange-500 tracking-wider mt-1">Cutoff</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Dynamic predicted eligible course cards */}
          <motion.div 
            variants={fadeInUp}
            className="lg:col-span-6 bg-gray-50 border border-gray-200 p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 block mb-4">
                Adhiparasakthi Engineering College Admission Seat Estimator
              </span>
              
              <div data-lenis-prevent className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  { name: "CSE (AI & ML)", cut: 165 },
                  { name: "Computer Science", cut: 160 },
                  { name: "Information Technology", cut: 155 },
                  { name: "Electronics (ECE)", cut: 145 },
                  { name: "Electrical (EEE)", cut: 135 },
                  { name: "Chemical Engg", cut: 125 },
                  { name: "Agricultural Engg", cut: 120 },
                  { name: "Mechanical Engg", cut: 110 },
                  { name: "Civil Engg", cut: 100 }
                ].map((item, idx) => {
                  const diff = cutoff - item.cut;
                  let badge = { text: "Premium Help", color: "text-indigo-650 bg-indigo-50 border-indigo-100" };
                  let cardStyle = "border-gray-150 bg-white opacity-70 scale-98";
                  if (diff >= 0) {
                    badge = { text: "High Eligible", color: "text-emerald-600 bg-emerald-50 border-emerald-100 animate-pulse" };
                    cardStyle = "border-emerald-200 bg-emerald-50/10 shadow-emerald-50/30 shadow-md scale-100";
                  } else if (diff >= -10) {
                    badge = { text: "Likely Eligible", color: "text-amber-600 bg-amber-50 border-amber-100" };
                    cardStyle = "border-amber-200 bg-amber-50/10 scale-100";
                  }
                  return (
                    <div 
                      key={idx}
                      className={`p-3 border rounded-xl flex items-center justify-between shadow-sm transition-all duration-300 shrink-0 ${cardStyle}`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-black text-gray-900 truncate">{item.name}</h4>
                        <span className="text-[9px] font-bold text-gray-400 font-mono tracking-wider block mt-0.5">Historical cutoff: {item.cut}+</span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border shrink-0 ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to action connecting to counseling help desk */}
            <div className="w-full pt-6 border-t border-gray-200 mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none text-center sm:text-left">
                Need direct counseling assistance?
              </span>
              <button 
                onClick={() => setShowAdModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Connect with Expert Advisor ({cutoff.toFixed(1)}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>

        </motion.div>

      </div>

      {/* Admissions Advertisement Modal Overlay */}
      <AnimatePresence>
        {showAdModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setShowAdModal(false)} />

            {/* Custom Embedded CSS animations */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient-border {
                background-size: 200% 200%;
                animation: gradient-shift 5s ease infinite;
              }
            `}} />

            {/* Always Static/Floating Close Button */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[110]">
              <button
                onClick={() => setShowAdModal(false)}
                className="p-2.5 bg-black/45 hover:bg-rose-600 text-white backdrop-blur-md rounded-full shadow-lg border border-white/10 transition-all duration-300 hover:rotate-90 hover:scale-110 cursor-pointer flex items-center justify-center"
                aria-label="Close Ad"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Single Container: Responsive Input Form Only */}
            <motion.div
              initial={{ scale: 0.95, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white border border-gray-200 rounded-[28px] shadow-2xl z-10 mx-auto max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col"
            >
              {/* Institution Header inside the form */}
              <div className="flex flex-col items-center text-center mb-6">
                <img 
                  src="/Images/Logos/apec-logo.png" 
                  alt="Adhiparasakthi Engineering College Logo" 
                  className="w-16 h-16 object-contain bg-white rounded-full p-1.5 shadow-md border border-gray-100 mb-3" 
                />
                <h3 className="font-title text-lg md:text-xl font-black text-gray-900 leading-tight">
                  Adhiparasakthi Engineering College
                </h3>
                <span className="font-mono text-[9px] uppercase font-black text-indigo-650 tracking-widest block mt-1">
                  An Autonomous Institution
                </span>
                <span className="text-[9px] text-gray-400 font-bold mt-0.5">
                  Affiliated to Anna University • Approved by AICTE
                </span>
                <span className="font-sans inline-block text-[9px] font-extrabold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase mt-4">
                  {`Admission Inquiry for ${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`}
                </span>

                {/* Calculated Cutoff badge inside the form */}
                <div className="mt-4 px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between w-full max-w-sm shadow-sm select-none">
                  <div className="text-left">
                    <span className="text-[8px] uppercase font-black text-rose-600 tracking-wider block">Your TNEA Cutoff</span>
                    <span className="text-[9px] text-gray-500 font-bold mt-0.5 block">Maths: {mathsMark} • Phy: {physicsMark} • Chem: {chemistryMark}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="font-mono text-xs font-black text-white leading-none">{cutoff.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="form-container"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full text-left"
                  >
                    <form onSubmit={handleFormSubmit} className="space-y-3.5">
                      {/* Name Input */}
                      <div>
                        <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Full Name</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                            <User className="w-4 h-4" />
                          </span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                              formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {formErrors.name && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.name}</p>}
                      </div>

                      {/* Email & Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Email */}
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Email Address</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="name@email.com"
                              className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {formErrors.email && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Mobile Number</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="10-digit mobile"
                              className={`w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                                formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {formErrors.phone && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.phone}</p>}
                        </div>
                      </div>

                      {/* Preferred Department */}
                      <div>
                        <label className="block text-[9px] uppercase font-black text-gray-455 tracking-wider mb-1">Preferred Department</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                            <GraduationCap className="w-4 h-4" />
                          </span>
                          <select
                            name="dept"
                            value={formData.dept}
                            onChange={handleInputChange}
                            className={`w-full text-xs pl-9 pr-9 py-2.5 bg-gray-50 border rounded-xl outline-none appearance-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold cursor-pointer ${
                              formErrors.dept ? 'border-red-500 focus:border-red-500' : 'border-gray-200'
                            }`}
                          >
                            <option value="">Select a Department</option>
                            {/* B.E. Departments */}
                            <option value="CSE">Computer Science & Engineering (B.E.)</option>
                            <option value="AIML">CSE (Artificial Intelligence & Machine Learning) (B.E.)</option>
                            <option value="EEE">Electrical & Electronics Eng. (B.E.)</option>
                            <option value="ECE">Electronics & Communication Eng. (B.E.)</option>
                            <option value="MECH">Mechanical Engineering (B.E.)</option>
                            <option value="CIVIL">Civil Engineering (B.E.)</option>
                            {/* B.Tech Departments */}
                            <option value="IT">Information Technology (B.Tech.)</option>
                            <option value="CHEM">Chemical Engineering (B.Tech.)</option>
                            <option value="CSD">Computer Science & Design (CSD) (B.Tech.)</option>
                            <option value="AGRI">Agricultural Engineering (Agri) (B.Tech.)</option>
                          </select>
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </div>
                        {formErrors.dept && <p className="text-[9px] font-bold text-red-500 mt-1">{formErrors.dept}</p>}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2 animate-gradient-border"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing Submission...
                          </span>
                        ) : (
                          'Submit Inquiry Now'
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-6 flex flex-col items-center justify-center grow w-full"
                  >
                    {/* Animated Success Badge */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 120, delay: 0.1 }}
                      className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    
                    <h4 className="font-sans text-xl md:text-2xl font-black text-gray-900 mb-1 tracking-tight">Inquiry Registered</h4>
                    <p className="font-sans text-[10px] text-indigo-600 font-extrabold mb-4 uppercase tracking-wider">
                      Thank You, {formData.name}
                    </p>
                    
                    <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-left max-w-sm w-full mb-4 space-y-3 shadow-sm text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Selected Course</span>
                        <span className="font-bold text-indigo-600">{formData.dept}</span>
                      </div>
                      
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block text-center pt-1">
                        For Further Details Contact
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-455 font-semibold text-[9px]">Admissions Cell</span>
                          <span className="font-bold text-gray-800 font-mono">
                            <a href="tel:+917418064336" className="hover:text-indigo-600 hover:underline">7418064336</a> / <a href="tel:+917418065336" className="hover:text-indigo-600 hover:underline">7418065336</a>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-455 font-semibold text-[9px]">Principal Office</span>
                          <span className="font-bold text-gray-800 font-mono">
                            <a href="tel:+919894657971" className="hover:text-indigo-600 hover:underline">9894657971</a>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-455 font-semibold text-[9px]">Office Email</span>
                          <span className="font-bold text-gray-800 font-mono">
                            <a href="mailto:principal@apec.edu.in" className="hover:text-indigo-600 hover:underline">principal@apec.edu.in</a>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6 font-semibold">
                      Our admissions team will reach out to <span className="font-bold text-gray-700">{formData.email}</span> shortly with direct counseling assistance.
                    </p>

                    <button
                      onClick={() => setShowAdModal(false)}
                      className="bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer shadow hover:shadow-lg active:scale-95"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
