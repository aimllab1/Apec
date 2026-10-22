import React, { useState, useEffect } from 'react';
import { QrCode, ExternalLink, Edit3, Check, Sparkles, X } from 'lucide-react';

export default function FacultyOrcidQr({ facultyName, defaultOrcid = '' }) {
  const normalizedKey = (facultyName || '').toLowerCase().trim();

  // Load custom overrides from localStorage
  const getStoredOrcid = () => {
    try {
      const saved = localStorage.getItem('apec_faculty_orcid_map');
      if (saved) {
        const map = JSON.parse(saved);
        if (map && map[normalizedKey]) {
          return map[normalizedKey];
        }
      }
    } catch (e) {}
    return '';
  };

  const initialOrcid = (defaultOrcid || getStoredOrcid() || '').trim();
  const [orcidVal, setOrcidVal] = useState(initialOrcid);
  const [inputVal, setInputVal] = useState(initialOrcid);
  const [isEditing, setIsEditing] = useState(!initialOrcid);
  const [justSaved, setJustSaved] = useState(false);

  // Sync if facultyName or defaultOrcid changes
  useEffect(() => {
    const current = (defaultOrcid || getStoredOrcid() || '').trim();
    setOrcidVal(current);
    setInputVal(current);
    setIsEditing(!current);
  }, [facultyName, defaultOrcid]);

  const cleanInput = (val) => {
    return (val || '')
      .trim()
      .replace(/^https?:\/\/orcid\.org\//i, '')
      .replace(/\/$/, '');
  };

  const handleApplyOrcid = (rawId) => {
    const cleaned = cleanInput(rawId);
    if (!cleaned) return;
    setOrcidVal(cleaned);
    setIsEditing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);

    // Persist in localStorage
    try {
      const saved = localStorage.getItem('apec_faculty_orcid_map');
      const map = saved ? JSON.parse(saved) : {};
      map[normalizedKey] = cleaned;
      localStorage.setItem('apec_faculty_orcid_map', JSON.stringify(map));
      window.dispatchEvent(new Event('apec_storage_update'));
    } catch (e) {}
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setInputVal(newVal);
    const cleaned = cleanInput(newVal);
    // Automatic generation when standard 16-character / 19-formatted ORCID is entered (e.g. 0009-0008-8912-4929)
    const isStandardOrcid = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(cleaned);
    if (isStandardOrcid) {
      handleApplyOrcid(cleaned);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyOrcid(inputVal);
    }
  };

  // If verified ORCID is present and not currently in edit mode
  if (orcidVal && !isEditing) {
    const orcidUrl = `https://orcid.org/${orcidVal}`;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(orcidUrl)}`;

    return (
      <div className="p-2.5 sm:p-3 bg-gradient-to-r from-emerald-50/95 via-teal-50/60 to-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-2.5 sm:gap-3 shadow-xs transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Scannable QR Code */}
          <a
            href={orcidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-13 h-13 sm:w-15 sm:h-15 bg-white p-1 rounded-xl border border-emerald-200 shadow-2xs shrink-0 flex items-center justify-center hover:scale-105 hover:border-emerald-400 transition-all cursor-pointer group/qr"
            title="Click or scan to open ORCID profile"
          >
            <img
              src={qrImgUrl}
              alt={`${facultyName} ORCID QR Code`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </a>

          {/* Details */}
          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-4 h-4 rounded bg-[#A6CE39] text-white font-black text-[8.5px] flex items-center justify-center font-mono shrink-0 shadow-2xs">iD</span>
              <span className="text-[10.5px] sm:text-[11px] font-black text-emerald-950 uppercase tracking-wide truncate">
                ORCID Researcher iD
              </span>
              {justSaved && (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md animate-pulse flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> Generated!
                </span>
              )}
            </div>
            <a
              href={orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs font-mono font-bold text-emerald-700 hover:text-emerald-950 hover:underline truncate block"
              title={orcidUrl}
            >
              https://orcid.org/{orcidVal}
            </a>
            <span className="text-[9px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <QrCode className="w-3 h-3 text-emerald-600 shrink-0" /> Scan QR to view verified research publications
            </span>
          </div>
        </div>

        {/* Right Action: Verified Badge + Edit button */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[8px] sm:text-[8.5px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-300 shadow-2xs">
            VERIFIED
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-[9.5px] text-slate-500 hover:text-emerald-800 flex items-center gap-0.5 hover:underline cursor-pointer"
              title="Edit ORCID iD"
            >
              <Edit3 className="w-2.5 h-2.5" /> Edit
            </button>
            <a
              href={orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9.5px] font-bold text-emerald-700 hover:text-emerald-950 hover:underline flex items-center gap-0.5"
            >
              Open <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If NO ORCID registered, or user clicked Edit
  return (
    <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/90 rounded-2xl transition-all text-left">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-slate-300 text-slate-700 font-black text-[8.5px] flex items-center justify-center font-mono shrink-0">iD</span>
          <span className="text-[11px] font-bold text-slate-700 font-mono">
            {orcidVal ? 'Update ORCID iD' : 'ORCID iD Not Registered'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8.5px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            Enter iD to Auto-Generate QR
          </span>
          {orcidVal && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Cancel editing"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <span className="text-[10.5px] font-mono text-slate-400 select-none mr-1 shrink-0">orcid.org/</span>
          <input
            type="text"
            placeholder="0009-0008-8912-4929"
            value={inputVal}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full text-xs font-mono font-bold text-slate-800 outline-none bg-transparent"
          />
        </div>
        <button
          type="button"
          onClick={() => handleApplyOrcid(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          title="Generate QR code for this ORCID iD"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Generate QR</span>
        </button>
      </div>

      {inputVal && !orcidVal && (
        <p className="text-[9.5px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" /> Press Enter or click Generate QR to create & verify
        </p>
      )}
    </div>
  );
}
