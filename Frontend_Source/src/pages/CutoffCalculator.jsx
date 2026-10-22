import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Award, Plus, Minus } from 'lucide-react';

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 24
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
  const cutoffPercentage = Math.min(100, Math.max(0, (cutoff / 200) * 100));

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

  const adjustMark = (subject, delta) => {
    if (subject === 'maths') {
      setMathsMark(prev => Math.min(100, Math.max(0, (parseInt(prev, 10) || 0) + delta)));
    } else if (subject === 'physics') {
      setPhysicsMark(prev => Math.min(100, Math.max(0, (parseInt(prev, 10) || 0) + delta)));
    } else if (subject === 'chemistry') {
      setChemistryMark(prev => Math.min(100, Math.max(0, (parseInt(prev, 10) || 0) + delta)));
    }
  };

  const getCutoffTier = (score) => {
    if (score >= 185) {
      return { 
        label: 'Top Tier & High Merit', 
        badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
        accentBorder: 'border-emerald-500/50'
      };
    }
    if (score >= 165) {
      return { 
        label: 'Merit Distinction', 
        badgeBg: 'bg-[#0A58CA]/25 border-cyan-400/40 text-cyan-200',
        glow: 'shadow-[0_0_20px_rgba(10,88,202,0.45)]',
        accentBorder: 'border-cyan-500/50'
      };
    }
    if (score >= 140) {
      return { 
        label: 'First Class Eligible', 
        badgeBg: 'bg-[#D4A347]/20 border-[#D4A347]/50 text-[#F3D78A]',
        glow: 'shadow-[0_0_20px_rgba(212,163,71,0.35)]',
        accentBorder: 'border-[#D4A347]/50'
      };
    }
    return { 
      label: 'Qualifying Foundation', 
      badgeBg: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.35)]',
      accentBorder: 'border-indigo-500/40'
    };
  };

  const tier = getCutoffTier(cutoff);

  return (
    <div className={isEmbedded ? "py-1" : "bg-slate-50/80 py-5 sm:py-6 px-3 sm:px-5 lg:px-8 relative overflow-hidden"}>
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header/Intro section (for Standalone Page - Ultra Compact) */}
        {!isEmbedded && (
          <div className="text-center mb-3 sm:mb-4">
            <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-[#041744] bg-[#041744]/10 border border-[#041744]/20 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 mb-1 shadow-2xs">
              <Zap className="w-3 h-3 text-[#D4A347]" /> TNEA Admission Support
            </span>
            <h1 className="font-title text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              TNEA Cutoff Calculator
            </h1>
          </div>
        )}

        {/* Main Compact Card in Navbar Blue (#041744) */}
        <div className="bg-gradient-to-b from-[#082261] via-[#041744] to-[#020d29] border border-[#D4A347]/35 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_15px_40px_rgba(4,23,68,0.25)] backdrop-blur-xl relative overflow-hidden text-left text-slate-100">
          
          {/* Top Gold Glowing Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A347] to-transparent opacity-85" />

          {/* Compact Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D4A347]/20">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#E5B54F]" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Standard Anna University Engineering Cutoff
              </h2>
            </div>
          </div>

          {/* 2-Column Side-by-Side Ergonomic Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3.5 items-stretch">
            
            {/* LEFT COLUMN: 3 Compact Subject Sliders (7 Cols) */}
            <div className="lg:col-span-7 space-y-2.5 flex flex-col justify-between">
              
              {/* 1. Mathematics */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#03143D]/80 border border-[#0A58CA]/40 hover:border-cyan-400/50 transition-all shadow-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                    <label className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      Mathematics
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Quick - / + Buttons */}
                    <div className="flex items-center bg-[#041744] rounded border border-[#0A58CA]/60">
                      <button
                        type="button"
                        onClick={() => adjustMark('maths', -5)}
                        className="px-1.5 py-0.5 hover:bg-[#0A58CA] rounded text-cyan-300 hover:text-white transition-colors"
                        title="-5 Marks"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustMark('maths', 5)}
                        className="px-1.5 py-0.5 hover:bg-[#0A58CA] rounded text-cyan-300 hover:text-white transition-colors"
                        title="+5 Marks"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={mathsMark}
                        onChange={(e) => handleMarkChange('maths', e.target.value)}
                        className="w-12 text-center text-xs font-mono font-black text-cyan-300 bg-[#041744] px-1 py-0.5 rounded border border-[#0A58CA] outline-none focus:border-cyan-400 shadow-inner"
                      />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">/100</span>
                    </div>
                  </div>
                </div>

                {/* Slider with dynamic filled color track */}
                <div className="relative w-full flex items-center h-4">
                  <div className="absolute w-full h-2 bg-[#020b22] rounded-full border border-[#0A58CA]/40 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0A58CA] via-cyan-500 to-sky-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.7)]"
                      style={{ width: `${Math.min(100, Math.max(0, m))}%` }}
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={m} 
                    onChange={(e) => handleMarkChange('maths', e.target.value)}
                    className="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.95)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-cyan-400 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.95)]"
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5 px-0.5">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* 2. Physics */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#03143D]/80 border border-[#D4A347]/30 hover:border-[#E5B54F]/60 transition-all shadow-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#E5B54F] shadow-[0_0_8px_rgba(229,181,79,0.9)]" />
                    <label className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      Physics
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick - / + Buttons */}
                    <div className="flex items-center bg-[#041744] rounded border border-[#D4A347]/50">
                      <button
                        type="button"
                        onClick={() => adjustMark('physics', -5)}
                        className="px-1.5 py-0.5 hover:bg-[#D4A347] rounded text-[#E5B54F] hover:text-[#041744] transition-colors"
                        title="-5 Marks"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustMark('physics', 5)}
                        className="px-1.5 py-0.5 hover:bg-[#D4A347] rounded text-[#E5B54F] hover:text-[#041744] transition-colors"
                        title="+5 Marks"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={physicsMark}
                        onChange={(e) => handleMarkChange('physics', e.target.value)}
                        className="w-12 text-center text-xs font-mono font-black text-[#F3D78A] bg-[#041744] px-1 py-0.5 rounded border border-[#D4A347]/60 outline-none focus:border-[#E5B54F] shadow-inner"
                      />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">/100</span>
                    </div>
                  </div>
                </div>

                {/* Slider with dynamic filled color track */}
                <div className="relative w-full flex items-center h-4">
                  <div className="absolute w-full h-2 bg-[#020b22] rounded-full border border-[#D4A347]/30 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#B38734] via-[#D4A347] to-[#F3D78A] rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(212,163,71,0.7)]"
                      style={{ width: `${Math.min(100, Math.max(0, p))}%` }}
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={p} 
                    onChange={(e) => handleMarkChange('physics', e.target.value)}
                    className="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#E5B54F] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(229,181,79,0.95)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#E5B54F] [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(229,181,79,0.95)]"
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5 px-0.5">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* 3. Chemistry */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#03143D]/80 border border-emerald-600/30 hover:border-emerald-400/50 transition-all shadow-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <label className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      Chemistry
                    </label>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Quick - / + Buttons */}
                    <div className="flex items-center bg-[#041744] rounded border border-emerald-700/50">
                      <button
                        type="button"
                        onClick={() => adjustMark('chemistry', -5)}
                        className="px-1.5 py-0.5 hover:bg-emerald-800/80 rounded text-emerald-300 hover:text-white transition-colors"
                        title="-5 Marks"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustMark('chemistry', 5)}
                        className="px-1.5 py-0.5 hover:bg-emerald-800/80 rounded text-emerald-300 hover:text-white transition-colors"
                        title="+5 Marks"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={chemistryMark}
                        onChange={(e) => handleMarkChange('chemistry', e.target.value)}
                        className="w-12 text-center text-xs font-mono font-black text-emerald-300 bg-[#041744] px-1 py-0.5 rounded border border-emerald-600/50 outline-none focus:border-emerald-400 shadow-inner"
                      />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">/100</span>
                    </div>
                  </div>
                </div>

                {/* Slider with dynamic filled color track */}
                <div className="relative w-full flex items-center h-4">
                  <div className="absolute w-full h-2 bg-[#020b22] rounded-full border border-emerald-900/40 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                      style={{ width: `${Math.min(100, Math.max(0, c))}%` }}
                    />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={c} 
                    onChange={(e) => handleMarkChange('chemistry', e.target.value)}
                    className="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.95)] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-400 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.95)]"
                  />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5 px-0.5">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Real-Time Score Badge & Formula (5 Cols) */}
            <div className={`lg:col-span-5 p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#061e57]/95 via-[#041744]/95 to-[#020d2b]/95 border ${tier.accentBorder} flex flex-col justify-between shadow-lg relative overflow-hidden`}>
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4A347]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Top Tier Merit Badge */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${tier.badgeBg} flex items-center gap-1`}>
                  <Award className="w-3 h-3" />
                  {tier.label}
                </span>
                <span className="text-[9.5px] font-bold text-slate-300 font-mono">
                  {cutoffPercentage.toFixed(1)}% of Max
                </span>
              </div>

              {/* Glowing Cutoff Score Badge in Center */}
              <div className="my-3 flex items-center justify-center relative z-10">
                <motion.div 
                  key={cutoff}
                  initial={{ scale: 0.94, opacity: 0.85 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={springTransition}
                  className={`w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#082875] via-[#041744] to-[#020b22] border border-[#D4A347] ${tier.glow} flex items-center justify-between shadow-md`}
                >
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#E5B54F] block">TNEA Cutoff</span>
                    <span className="text-[10.5px] font-medium text-slate-300 block">Out of 200.0</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-white via-amber-100 to-[#E5B54F] bg-clip-text text-transparent">
                      {cutoff.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">/ 200</span>
                  </div>
                </motion.div>
              </div>

              {/* Live Formula computation readout */}
              <div className="font-mono text-[10.5px] text-indigo-100 bg-[#020d2b]/80 px-2.5 py-1.5 rounded-lg border border-[#D4A347]/25 text-center relative z-10">
                Maths <strong className="text-cyan-300 font-bold">{m}</strong> + (Phys <strong className="text-[#F3D78A]">{p}</strong> + Chem <strong className="text-emerald-300">{c}</strong>) ÷ 2
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}



