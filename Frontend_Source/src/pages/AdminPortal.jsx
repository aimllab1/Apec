import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, AlertCircle, Shield } from 'lucide-react';
import EditorPanel from './EditorPanel';

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('is_logged_in') === 'true'
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(localStorage.getItem('is_logged_in') === 'true');
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const isDefaultAdmin = username.trim().toLowerCase() === 'admin' && password === 'admin';
    const isTestUser = username.trim() === 'gxwr1' && password === '@Neosyntor1';

    if (isDefaultAdmin || isTestUser) {
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('apec_user', username.trim().toLowerCase().includes('@') ? username.trim() : 'admin@apec.edu.in');
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Credentials');
    }
  };

  if (isLoggedIn) {
    return <EditorPanel />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 font-sans text-left">
      <div className="max-w-md mx-auto my-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Executive Master Portal</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1.5">Sign in to access student counseling leads & master CMS console</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Username / Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full text-xs pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex gap-2 items-center bg-red-50 border border-red-200/50 text-red-600 p-3 rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer text-center"
              >
                Unlock Master Dashboard
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-5">
            Secure Master Console for APEC Administration & Admissions.
            <div className="mt-1 text-indigo-500 font-mono">Default: admin / admin</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
