import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Panel */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:col-span-5 space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-indigo-600 mt-1 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Helpline Calls</span>
                <p className="text-sm font-black text-gray-800 mt-1.5">+91 9894657971 / 044-27529585</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Admissions Desk: 7418064336 / 7418065336</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-indigo-600 mt-1 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Official Email</span>
                <a href="mailto:principal@apec.edu.in" className="text-sm font-black text-gray-800 hover:text-indigo-600 transition-colors mt-1.5 block">principal@apec.edu.in</a>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 items-start">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-indigo-600 mt-1 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Campus Address</span>
                <p className="text-sm font-semibold text-gray-700 mt-1.5 leading-relaxed">
                  Adhiparasakthi Engineering College,<br />
                  Melmaruvathur – 603319,<br />
                  Chengalpattu District, Tamil Nadu.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-gray-50/50 border border-gray-200 p-8 rounded-3xl relative overflow-hidden"
          >
            <h3 className="text-lg font-black text-gray-900 mb-6">Send an Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-gray-400 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-gray-800 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-gray-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-gray-800 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-gray-400 mb-1.5">Message / Inquiry</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here"
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-gray-800 transition-all resize-none font-semibold"
                />
              </div>

              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Send Message <Send className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mb-2">Inquiry Submitted!</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-xs">
                      Thank you for contacting us. Our admin desk will review your details and respond shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
