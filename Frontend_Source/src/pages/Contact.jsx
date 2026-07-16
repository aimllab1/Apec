import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Plus, User, GraduationCap, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.19-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

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
      staggerChildren: 0.15
    }
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: '', email: '', contactNumber: '', cutoff: '', department: '',
    schoolName: '', board: '', yearOfPassing: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newInquiry = {
        ...formData,
        source: 'Contact Page',
        id: Date.now(),
        date: new Date().toLocaleString()
      };
      await addDoc(collection(db, "inquiries"), newInquiry);
      
      setSubmitted(true);
      setFormData({ name: '', email: '', contactNumber: '', cutoff: '', department: '', schoolName: '', board: '', yearOfPassing: '' });
      setShowMore(false);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Connect with Adhiparasakthi Engineering College
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Contact Information</h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed font-semibold">
            Reach out to our campus desk or administration coordinators for support regarding admissions, research portals, or student services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Details Panel */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:col-span-5 flex flex-col h-full order-2 lg:order-2"
          >
            <motion.div 
              variants={fadeInUp}
              className={`flex flex-col w-full bg-slate-50 border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden transition-all duration-300 ${!showMore ? 'flex-1' : 'flex-[3]'}`}
            >
              <a 
                href="tel:+919894657971"
                className="flex-1 flex gap-4 lg:gap-5 items-center p-5 lg:p-6 hover:bg-white border-b border-slate-200 transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3.5 lg:p-4 bg-indigo-50/80 lg:bg-white border border-indigo-100/50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                  <Phone className="w-5 h-5 lg:w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="block text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 lg:mb-1.5">Helpline Calls</span>
                  <p className="text-[13px] lg:text-base font-black text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors break-words">
                    +91 9894657971 <span className="text-gray-300 mx-0.5 lg:mx-1">|</span> 044-27529585
                  </p>
                  <p className="text-[10px] lg:text-[11px] text-gray-500 font-bold mt-1 lg:mt-1.5 leading-tight">Admissions Desk: 7418064336 / 7418065336</p>
                </div>
              </a>

              <a 
                href="mailto:principal@apec.edu.in"
                className="flex-1 flex gap-4 lg:gap-5 items-center p-5 lg:p-6 hover:bg-white border-b border-slate-200 transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3.5 lg:p-4 bg-indigo-50/80 lg:bg-white border border-indigo-100/50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                  <Mail className="w-5 h-5 lg:w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="block text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 lg:mb-1.5">Official Email</span>
                  <p className="text-[13px] lg:text-base font-black text-gray-900 group-hover:text-indigo-600 transition-colors break-words">principal@apec.edu.in</p>
                </div>
              </a>

              <a 
                href="https://www.google.com/maps/place/Adhiparasakthi+Engineering+College/@12.4369007,79.8210325,546m/data=!3m1!1e3!4m6!3m5!1s0x3a5319fc373f6277:0xca3a2cbf53c66b03!8m2!3d12.436921!4d79.821985!16s%2Fm%2F011197_n?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex gap-4 lg:gap-5 items-center p-5 lg:p-6 hover:bg-white transition-colors duration-300 group cursor-pointer"
              >
                <div className="p-3.5 lg:p-4 bg-indigo-50/80 lg:bg-white border border-indigo-100/50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                  <MapPin className="w-5 h-5 lg:w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="block text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 lg:mb-1.5">Campus Address</span>
                  <p className="text-[11px] lg:text-[13px] font-bold text-gray-700 leading-relaxed group-hover:text-indigo-600 transition-colors">
                    Adhiparasakthi Engineering College,<br />
                    Melmaruvathur – 603319.
                  </p>
                </div>
              </a>
            </motion.div>

            {/* Expanded Social Media Card */}
            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="hidden lg:flex flex-col justify-center items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex-1"
                >
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-black mb-4 text-center">Social Media</span>
                  <div className="flex justify-center gap-4 w-full">
                    {/* Instagram */}
                    <a href="https://www.instagram.com/apec1984/?hl=en" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                      <div className="p-3 bg-pink-50 border border-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.4)] rounded-2xl text-pink-600 transition-all duration-300 group-hover:scale-110">
                        <InstagramIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Instagram</span>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com/adhiparasakthiengineeringcollege/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                      <div className="p-3 bg-blue-50 border border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-2xl text-blue-600 transition-all duration-300 group-hover:scale-110">
                        <FacebookIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Facebook</span>
                    </a>
                    {/* Youtube */}
                    <a href="https://www.youtube.com/channel/UCHONHHxcE0lM8G60CEJT09Q" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                      <div className="p-3 bg-red-50 border border-red-200 shadow-[0_0_15px_rgba(220,38,38,0.4)] rounded-2xl text-red-600 transition-all duration-300 group-hover:scale-110">
                        <YoutubeIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">YouTube</span>
                    </a>
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/school/adhiparasakthi-engineering-college/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                      <div className="p-3 bg-blue-50 border border-blue-200 shadow-[0_0_15px_rgba(29,78,216,0.4)] rounded-2xl text-blue-700 transition-all duration-300 group-hover:scale-110">
                        <LinkedinIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">LinkedIn</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Form Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col h-full shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] order-1 lg:order-1"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Admission Inquiry Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-800 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full text-sm py-3.5 pr-3 pl-10 bg-white border border-slate-200 rounded-2xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 transition-all font-semibold shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-800 mb-1.5">Cutoff (Out of 200)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calculator className="w-[18px] h-[18px]" />
                    </div>
                    <input 
                      type="number" 
                      max="200"
                      min="0"
                      step="0.01"
                      required
                      value={formData.cutoff}
                      onChange={(e) => setFormData({ ...formData, cutoff: e.target.value })}
                      placeholder="Enter cutoff"
                      className="w-full text-sm py-3.5 pr-3 pl-10 bg-white border border-slate-200 rounded-2xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 transition-all font-semibold shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-800 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-[18px] h-[18px]" />
                    </div>
                    <input 
                      type="tel" 
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full text-sm py-3.5 pr-3 pl-10 bg-white border border-slate-200 rounded-2xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 transition-all font-semibold shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-800 mb-1.5">Preferred Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-[18px] h-[18px]" />
                  </div>
                  <select 
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-sm py-3.5 pr-8 pl-10 bg-white border border-slate-200 rounded-2xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 transition-all font-semibold appearance-none shadow-sm"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="" disabled>Select a Department</option>
                    <option value="CSE">Computer Science and Engineering</option>
                    <option value="CSD">Computer Science and Design</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics and Communication Engineering</option>
                    <option value="EEE">Electrical and Electronics Engineering</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="AI_DS">Artificial Intelligence and Data Science</option>
                    <option value="AI_ML">Artificial Intelligence and Machine Learning</option>
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden px-1 -mx-1 pb-1 -mb-1"
                  >
                    <div>
                      <label className="block text-[10px] uppercase font-extrabold text-slate-800 mb-1.5 mt-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full text-sm py-3.5 px-3 bg-white border border-slate-200 rounded-2xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-slate-800 transition-all font-semibold shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-extrabold text-gray-500 mb-1.5 mt-2">School Information</label>
                      <input 
                        type="text" 
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="Enter school name"
                        className="w-full text-sm p-3 bg-white border border-gray-300 rounded-xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-gray-800 transition-all font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-extrabold text-gray-500 mb-1.5">Board</label>
                      <select 
                        value={formData.board}
                        onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                        className="w-full text-sm p-3 bg-white border border-gray-300 rounded-xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-gray-800 transition-all font-semibold appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                      >
                        <option value="" disabled>Select board</option>
                        <option value="State Board">State Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-extrabold text-gray-500 mb-1.5">Year of passing school</label>
                      <select 
                        value={formData.yearOfPassing}
                        onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
                        className="w-full text-sm p-3 bg-white border border-gray-300 rounded-xl focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none text-gray-800 transition-all font-semibold appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                      >
                        <option value="" disabled>Select passing year</option>
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {!showMore && (
                  <button 
                    type="button"
                    onClick={() => setShowMore(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e4ebf3] hover:bg-[#d5e0ee] text-[#0B3A68] font-black text-xs uppercase tracking-wider py-4 rounded-full transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add More Details
                  </button>
                )}
                
                <button 
                  type="submit"
                  className={`${showMore ? 'w-full' : 'flex-1'} inline-flex items-center justify-center gap-2 bg-[#0B3A68] hover:bg-[#072442] text-white font-extrabold text-sm tracking-wider py-4 rounded-full transition-all cursor-pointer shadow-lg shadow-blue-900/20`}
                >
                  SEND INQUIRY <Send className="w-4 h-4 ml-1" />
                </button>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-10 rounded-3xl"
                  >
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mb-2">Inquiry Submitted!</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-xs">
                      Thank you for contacting us. Our admission desk will review your details and respond shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>

        {/* Full-width Social Media Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`mt-8 lg:mt-16 w-full ${showMore ? 'lg:hidden' : ''}`}
        >
          <div className="bg-slate-50 lg:bg-transparent p-6 lg:p-0 rounded-3xl border border-slate-200 lg:border-transparent shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] lg:shadow-none">
            <span className="block lg:hidden text-[10px] text-gray-400 uppercase tracking-widest font-black mb-4 text-center">Social Media</span>
            <div className="grid grid-cols-4 lg:flex lg:justify-center gap-1 sm:gap-4 lg:gap-12 w-full">
              {/* Instagram */}
              <a href="https://www.instagram.com/apec1984/?hl=en" target="_blank" rel="noopener noreferrer" className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 group">
                <div className="p-2.5 sm:p-3 bg-pink-50 lg:bg-white border border-pink-200 lg:border-gray-100 shadow-[0_0_15px_rgba(236,72,153,0.4)] lg:shadow-sm rounded-xl lg:rounded-2xl text-pink-600 lg:text-gray-500 group-hover:text-pink-600 group-hover:border-pink-200 group-hover:bg-pink-50 lg:group-hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-300">
                  <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-[9px] sm:text-xs lg:text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Instagram</span>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/adhiparasakthiengineeringcollege/" target="_blank" rel="noopener noreferrer" className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 group">
                <div className="p-2.5 sm:p-3 bg-blue-50 lg:bg-white border border-blue-200 lg:border-gray-100 shadow-[0_0_15px_rgba(37,99,235,0.4)] lg:shadow-sm rounded-xl lg:rounded-2xl text-blue-600 lg:text-gray-500 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50 lg:group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all duration-300">
                  <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-[9px] sm:text-xs lg:text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Facebook</span>
              </a>
              {/* Youtube */}
              <a href="https://www.youtube.com/channel/UCHONHHxcE0lM8G60CEJT09Q" target="_blank" rel="noopener noreferrer" className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 group">
                <div className="p-2.5 sm:p-3 bg-red-50 lg:bg-white border border-red-200 lg:border-gray-100 shadow-[0_0_15px_rgba(220,38,38,0.4)] lg:shadow-sm rounded-xl lg:rounded-2xl text-red-600 lg:text-gray-500 group-hover:text-red-600 group-hover:border-red-200 group-hover:bg-red-50 lg:group-hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300">
                  <YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-[9px] sm:text-xs lg:text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">YouTube</span>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/school/adhiparasakthi-engineering-college/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 group">
                <div className="p-2.5 sm:p-3 bg-blue-50 lg:bg-white border border-blue-200 lg:border-gray-100 shadow-[0_0_15px_rgba(29,78,216,0.4)] lg:shadow-sm rounded-xl lg:rounded-2xl text-blue-700 lg:text-gray-500 group-hover:text-blue-700 group-hover:border-blue-200 group-hover:bg-blue-50 lg:group-hover:shadow-[0_0_15px_rgba(29,78,216,0.4)] transition-all duration-300">
                  <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span className="text-[9px] sm:text-xs lg:text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
