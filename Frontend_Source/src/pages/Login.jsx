import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, limit } from 'firebase/firestore';
import { encryptText, decryptText } from '../utils/crypto';

// Configure your deployed Google Apps Script Web App URL below
const GOOGLE_APPS_SCRIPT_URL = ""; 

export default function Login() {
  const navigate = useNavigate();
  
  // Inputs (prefilled for development convenience as requested)
  const [usernameInput, setUsernameInput] = useState('admin@apec.edu.in');
  const [passwordInput, setPasswordInput] = useState('web-development-01');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Login Form, 2 = Success Animation, 3 = OTP Input Screen

  // 2FA states
  const [usernameTemp, setUsernameTemp] = useState('');
  const [userRoleTemp, setUserRoleTemp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');

  // Auto-populate secure AES-encrypted accounts on first mount if database is empty
  useEffect(() => {
    const initUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let needsRebuild = querySnapshot.empty;

        // Verify if we can decrypt existing passwords using new AES 128-bit key
        if (!needsRebuild) {
          try {
            const firstUser = querySnapshot.docs[0].data();
            const testDecrypt = await decryptText(firstUser.password);
            if (testDecrypt === firstUser.password) {
              console.log("Existing passwords cannot be decrypted by AES 128-bit. Rebuilding users...");
              needsRebuild = true;
            }
          } catch (e) {
            console.log("Decryption check encountered error. Rebuilding users...", e);
            needsRebuild = true;
          }
        }

        if (needsRebuild) {
          console.log("Populating database with secure AES 128-bit encrypted accounts...");
          
          // Delete existing legacy entries
          for (const docSnap of querySnapshot.docs) {
            await deleteDoc(docSnap.ref);
          }
          
          const defaultAccounts = [
            { username: 'admin@apec.edu.in', role: 'admin' },
            { username: 'admission@apec.edu.in', role: 'admission' },
            { username: 'aiml@apec.edu.in', role: 'dept_aiml' },
            { username: 'cse@apec.edu.in', role: 'dept_cse' },
            { username: 'civil@apec.edu.in', role: 'dept_civil' },
            { username: 'mech@apec.edu.in', role: 'dept_mech' },
            { username: 'eee@apec.edu.in', role: 'dept_eee' },
            { username: 'ece@apec.edu.in', role: 'dept_ece' },
            { username: 'it@apec.edu.in', role: 'dept_it' },
            { username: 'chemical@apec.edu.in', role: 'dept_chemical' },
            { username: 'agri@apec.edu.in', role: 'dept_agri' },
            { username: 'aids@apec.edu.in', role: 'dept_aids' },
            { username: 'csd@apec.edu.in', role: 'dept_csd' },
            { username: 'mca@apec.edu.in', role: 'dept_mca' },
            { username: 'mba@apec.edu.in', role: 'dept_mba' },
            { username: 'sh@apec.edu.in', role: 'dept_sh' }
          ];

          for (const acc of defaultAccounts) {
            // Encrypt the password using PBKDF2 derived 256-bit AES-GCM
            const encryptedPassword = await encryptText('web-development-01');
            const docId = acc.username.replace(/[^a-zA-Z0-9]/g, '_'); // Safe identifier
            await setDoc(doc(db, 'users', docId), {
              username: acc.username,
              password: encryptedPassword,
              role: acc.role
            });
          }
          console.log("Database user accounts populated successfully with AES 128-bit passwords!");
        }
      } catch (err) {
        console.error("Firestore user accounts initialization skipped/failed:", err);
      }
    };
    initUsers();
  }, []);

  const triggerSendOtp = async (email, role) => {
    setIsLoading(true);
    setError('');
    setOtpNotice('');
    setOtpInput('');

    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'send_otp',
            email: email,
            role: role
          })
        });
        const data = await response.json();
        if (data.success) {
          setStep(3); // Transition to OTP Screen
        } else {
          setError(data.error || 'Failed to dispatch verification OTP email.');
        }
      } catch (err) {
        console.warn("Apps Script API offline. Initializing local sandbox verification.", err);
        startMockOtp(email);
      }
    } else {
      startMockOtp(email);
    }
    setIsLoading(false);
  };

  const startMockOtp = (email) => {
    setOtpNotice(`[2FA Sandbox] Verification code generated. Enter '123456' to log in.`);
    setStep(3);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const username = usernameInput.trim().toLowerCase();
    const password = passwordInput;

    try {
      // Query Firestore for matching user
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid username or password.');
        setIsLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0].data();
      
      // Decrypt stored AES-GCM password string for secure verification
      const decryptedPassword = await decryptText(userDoc.password);

      if (decryptedPassword !== password) {
        setError('Invalid username or password.');
        setIsLoading(false);
        return;
      }

      // First verification succeeded - trigger OTP
      setUsernameTemp(userDoc.username);
      setUserRoleTemp(userDoc.role);
      await triggerSendOtp(userDoc.username, userDoc.role);

    } catch (err) {
      console.error("Database auth failed. Falling back to offline verify:", err);
      
      // Offline fallback for seamless testing/development
      const isOfflineValid = 
        (username === 'admin@apec.edu.in' && password === 'web-development-01') ||
        (username === 'admission@apec.edu.in' && password === 'web-development-01') ||
        (username === 'cse@apec.edu.in' && password === 'web-development-01') ||
        (username === 'aiml@apec.edu.in' && password === 'web-development-01');

      if (isOfflineValid) {
        let detectedRole = 'admin';
        if (username.includes('admission')) detectedRole = 'admission';
        else if (username.includes('cse')) detectedRole = 'dept_cse';
        else if (username.includes('aiml')) detectedRole = 'dept_aiml';
        
        setUsernameTemp(username);
        setUserRoleTemp(detectedRole);
        await triggerSendOtp(username, detectedRole);
      } else {
        setError('Database connection error and offline credentials failed.');
        setIsLoading(false);
      }
    }
  };

  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!otpInput.trim() || otpInput.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsOtpLoading(true);
    
    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'verify_otp',
            email: usernameTemp,
            otp: otpInput.trim()
          })
        });
        const data = await response.json();
        if (data.success) {
          completeLogin();
        } else {
          setError(data.error || 'Invalid OTP code. Please try again.');
          setIsOtpLoading(false);
        }
      } catch (err) {
        console.warn("Apps Script verification failed. Falling back to mock verification.", err);
        verifyMockOtp();
      }
    } else {
      verifyMockOtp();
    }
  };

  const verifyMockOtp = () => {
    if (otpInput.trim() === '123456') {
      completeLogin();
    } else {
      setError('Invalid code. Enter 123456 to bypass Sandbox verification.');
      setIsOtpLoading(false);
    }
  };

  const triggerResendOtp = () => {
    triggerSendOtp(usernameTemp, userRoleTemp);
  };

  const completeLogin = () => {
    setStep(2); // Success animation
    localStorage.setItem('apec_user', usernameTemp);
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_role', userRoleTemp);
    
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1200);
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

          {step === 3 && (
            <motion.form 
              key="otpForm"
              onSubmit={handleOtpVerifySubmit} 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-start gap-3 text-sm font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {otpNotice && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-semibold leading-relaxed">
                  <span>{otpNotice}</span>
                </div>
              )}

              <div className="text-center space-y-2">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wide">Enter Verification Code</h3>
                <p className="text-xs text-gray-500 font-semibold leading-normal">
                  A 6-digit One-Time Password has been sent to <span className="text-indigo-650 font-bold">{usernameTemp}</span>.
                </p>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-black uppercase text-gray-500 tracking-wider block text-center">
                  6-Digit OTP Code
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  disabled={isOtpLoading}
                  className="w-full text-center text-2xl tracking-[0.6em] pl-[0.6em] py-4 bg-gray-50 border border-gray-250 rounded-2xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-black text-gray-800"
                />
              </div>

              {/* Submit / Action Buttons */}
              <div className="space-y-3 pt-4">
                <button 
                  type="submit"
                  disabled={isOtpLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isOtpLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Verify & Login
                    </>
                  )}
                </button>
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={triggerResendOtp}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Resend Code
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-50 hover:bg-gray-150 text-gray-500 border border-gray-200 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </motion.form>
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
