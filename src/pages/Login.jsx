import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Credentials: username "gxwr1", password "@Neosyntor1"
      if (usernameInput.trim() === 'gxwr1' && passwordInput === '@Neosyntor1') {
        setSuccess(true);
        setIsLoading(false);
        localStorage.setItem('apec_user', 'gxwr1');
        localStorage.setItem('is_logged_in', 'true');
        
        // Redirect to home page after success animation
        setTimeout(() => {
          navigate('/');
          // Force a reload to update header state globally
          window.location.reload();
        }, 1500);
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Animated Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl flex flex-col justify-between text-left text-white"
      >
        {/* Top Branding Logo & Info */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl p-2.5 shadow-xl border border-white/10 mb-4 flex items-center justify-center">
            <img src="./apec-logo.png" alt="Adhiparasakthi Engineering College Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-title text-xl font-black uppercase tracking-wider bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Adhiparasakthi Engineering College Access Portal
          </h2>
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mt-1">
            An Autonomous Institution
          </span>
        </div>

        {success ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Access Granted</h3>
              <p className="text-xs text-gray-450 mt-1">Redirecting to home page...</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs font-semibold leading-relaxed"
              >
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest block pl-1">
                Username
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full text-xs pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-semibold"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest block pl-1">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full text-xs pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-semibold"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                'Secure Log In'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Adhiparasakthi Engineering College
          </span>
        </div>
      </motion.div>
    </div>
  );
}
