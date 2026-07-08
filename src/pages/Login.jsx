import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  // Inputs
  const [usernameInput, setUsernameInput] = useState('admin@apec.edu.in');
  const [passwordInput, setPasswordInput] = useState('web-development-01');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Login Form, 2 = Success Animation

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Validate credentials: admin@apec.edu.in or admission@apec.edu.in
    const username = usernameInput.trim().toLowerCase();
    const password = passwordInput;

    const isValidUser = 
      (username === "admin@apec.edu.in" && password === "web-development-01") ||
      (username === "admission@apec.edu.in" && password === "web-development-01");

    if (!isValidUser) {
      setTimeout(() => {
        setError('Invalid username or password.');
        setIsLoading(false);
      }, 600);
      return;
    }

    // Dynamic role detection
    const detectedRole = username.includes('admission') ? 'admission' : 'admin';

    // Successful login: Bypass verification code step entirely
    setTimeout(() => {
      setStep(2); // Success step
      localStorage.setItem('apec_user', usernameInput.trim());
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('user_role', detectedRole);
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-6 relative overflow-hidden text-gray-900">
      {/* Background blur blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-white/80 border border-gray-200/80 rounded-3xl p-10 md:p-12 shadow-2xl backdrop-blur-xl relative z-10 flex flex-col justify-between text-left"
      >
        {/* Main portal heading */}
        <div className="mb-10 text-center">
          <h2 className="font-title text-2xl md:text-3xl font-black tracking-tight text-gray-900 leading-tight">
            Adhiparasakthi Engineering College
          </h2>
          <span className="text-sm md:text-base font-bold bg-indigo-50 border border-indigo-100 text-indigo-750 px-4 py-1.5 rounded-full inline-block mt-4 uppercase tracking-wider">
            Web-portal Access
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="loginForm"
              onSubmit={handleLoginSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-start gap-3 text-sm font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username field */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase text-gray-500 tracking-wider block pl-1">
                  Username or Email
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin@apec.edu.in"
                    disabled={isLoading}
                    className="w-full text-sm md:text-base pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-250 rounded-2xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-semibold text-gray-800"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase text-gray-500 tracking-wider block pl-1">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    className="w-full text-sm md:text-base pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-250 rounded-2xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-semibold text-gray-800"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-650 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-8"
              >
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Secure Login
                  </>
                )}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-900">Secure Access Granted</h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 font-semibold">Redirecting to console dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-6 border-t border-gray-150 text-center">
          <span className="text-[10px] md:text-xs text-gray-400 font-extrabold uppercase tracking-wider">
            Adhiparasakthi Engineering College
          </span>
        </div>
      </motion.div>
    </div>
  );
}
