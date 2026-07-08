import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, AlertCircle, RefreshCw, Users, FileText, Settings, Plus, Trash2, 
  Edit3, Check, CheckCircle2, ChevronRight, UserCheck, ShieldAlert, KeyRound, Globe
} from 'lucide-react';
import departmentsData from '../data/departmentsData.json';

export default function EditorPanel() {
  const navigate = useNavigate();
  
  // Auth Check
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Tab State: 'branding' | 'ticker' | 'departments' | 'faculty'
  const [activeTab, setActiveTab] = useState('branding');

  // Success Notification state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Branding Form State
  const [branding, setBranding] = useState({
    collegeName: 'Adhiparasakthi Engineering College',
    tagline: 'An Autonomous Institution',
    helpline1: '7418064336',
    helpline2: '7418065336',
  });

  // 2. Ticker News Form State
  const [tickerNews, setTickerNews] = useState([]);
  const [newTickerText, setNewTickerText] = useState('');

  // 3. Departments Form State
  const [depts, setDepts] = useState([]);
  const [selectedDeptIdx, setSelectedDeptIdx] = useState(0);
  const [selectedFacultyIdx, setSelectedFacultyIdx] = useState(null);
  
  // Faculty edit state
  const [editFaculty, setEditFaculty] = useState({
    name: '',
    qualification: '',
    designation: '',
    department: '',
    email: '',
    experience: '',
    joiningDate: '',
    image: ''
  });

  // Loading initial data
  useEffect(() => {
    // Load branding
    const savedBranding = localStorage.getItem('apec_branding');
    if (savedBranding) {
      setBranding(JSON.parse(savedBranding));
    }

    // Load ticker
    const savedTicker = localStorage.getItem('apec_ticker_news');
    if (savedTicker) {
      setTickerNews(JSON.parse(savedTicker));
    } else {
      setTickerNews([
        "🎓 Admissions Open for 2026–2027",
        "NAAC Accredited Institution",
        "UGC Autonomous College",
        "Affiliated to Anna University",
        "Placement Training Ongoing",
        "Campus Recruitment Updates",
        "Welcome to Adhiparasakthi Engineering College"
      ]);
    }

    // Load departments & faculty
    const savedDepts = localStorage.getItem('apec_departments_data');
    if (savedDepts) {
      const parsed = JSON.parse(savedDepts);
      setDepts(Object.values(parsed));
    } else {
      setDepts(Object.values(departmentsData));
    }
  }, []);

  const saveDepts = (updatedArray) => {
    setDepts(updatedArray);
    const obj = {};
    updatedArray.forEach(d => {
      obj[d.key] = d;
    });
    localStorage.setItem('apec_departments_data', JSON.stringify(obj));
  };

  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Save General Branding
  const saveBranding = () => {
    localStorage.setItem('apec_branding', JSON.stringify(branding));
    triggerSuccess('College branding settings published successfully!');
  };

  // Add Ticker Item
  const addTickerItem = () => {
    if (!newTickerText.trim()) return;
    const updated = [...tickerNews, newTickerText.trim()];
    setTickerNews(updated);
    localStorage.setItem('apec_ticker_news', JSON.stringify(updated));
    setNewTickerText('');
    triggerSuccess('News announcement added!');
  };

  // Delete Ticker Item
  const deleteTickerItem = (idx) => {
    const updated = tickerNews.filter((_, i) => i !== idx);
    setTickerNews(updated);
    localStorage.setItem('apec_ticker_news', JSON.stringify(updated));
    triggerSuccess('News announcement deleted!');
  };

  // Select Faculty for editing
  const selectFacultyForEdit = (facultyIdx) => {
    setSelectedFacultyIdx(facultyIdx);
    const faculty = depts[selectedDeptIdx].faculty[facultyIdx];
    setEditFaculty({
      name: faculty.name || '',
      qualification: faculty.qualification || '',
      designation: faculty.designation || '',
      department: faculty.department || '',
      email: faculty.email || '',
      experience: faculty.experience || '',
      joiningDate: faculty.joiningDate || '',
      image: faculty.image || ''
    });
  };

  // Save Faculty Member
  const saveFacultyMember = () => {
    if (selectedFacultyIdx === null) return;
    const updatedDepts = [...depts];
    updatedDepts[selectedDeptIdx].faculty[selectedFacultyIdx] = { ...editFaculty };
    saveDepts(updatedDepts);
    setSelectedFacultyIdx(null);
    triggerSuccess('Faculty details updated successfully!');
  };

  // Add Faculty Member
  const addFacultyMember = () => {
    const newFaculty = {
      name: 'New Faculty Member',
      qualification: 'B.E., M.E.',
      designation: 'Assistant Professor',
      department: depts[selectedDeptIdx].name,
      email: 'newfaculty@apec.edu.in',
      experience: '1 Year',
      joiningDate: 'June 1, 2026',
      image: ''
    };
    const updatedDepts = [...depts];
    if (!updatedDepts[selectedDeptIdx].faculty) {
      updatedDepts[selectedDeptIdx].faculty = [];
    }
    updatedDepts[selectedDeptIdx].faculty.unshift(newFaculty);
    saveDepts(updatedDepts);
    selectFacultyForEdit(0);
    triggerSuccess('New faculty slot created! Edit details on the right.');
  };

  // Delete Faculty Member
  const deleteFacultyMember = (facultyIdx) => {
    if (window.confirm('Are you sure you want to remove this faculty member from the directory?')) {
      const updatedDepts = [...depts];
      updatedDepts[selectedDeptIdx].faculty = updatedDepts[selectedDeptIdx].faculty.filter((_, i) => i !== facultyIdx);
      saveDepts(updatedDepts);
      setSelectedFacultyIdx(null);
      triggerSuccess('Faculty member removed from directory.');
    }
  };

  // Reset CMS Data to Default
  const resetToFactoryDefault = () => {
    if (window.confirm('⚠️ WARNING: This will discard ALL customized edits and revert the portal back to factory JSON files. Continue?')) {
      localStorage.removeItem('apec_branding');
      localStorage.removeItem('apec_ticker_news');
      localStorage.removeItem('apec_departments_data');
      window.location.reload();
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 pb-20 px-4 md:px-8 select-none text-left">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Banner / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-title text-3xl font-black text-slate-900 leading-tight">
              APEC Web Portal Content Console
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Authorized admin editing environment. Preview and publish details dynamically across all pages.
            </p>
          </div>
          <button 
            onClick={resetToFactoryDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Revert All Defaults
          </button>
        </div>

        {/* Global Success Notification banner */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm rounded-2xl flex items-center gap-3 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left panel tabs */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('branding'); setSelectedFacultyIdx(null); }}
              className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'branding' 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" /> Branding & Contact
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => { setActiveTab('ticker'); setSelectedFacultyIdx(null); }}
              className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'ticker' 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" /> News Ticker
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => { setActiveTab('departments'); setSelectedFacultyIdx(null); }}
              className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'departments' 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" /> Faculty Directories
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Panel Main Workspace */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* BRANDING EDITOR */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-title text-xl font-black text-slate-900">Branding & Contact Info Settings</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Edit main title blocks and contact hotlines.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">College Name</label>
                    <input 
                      type="text"
                      value={branding.collegeName}
                      onChange={(e) => setBranding({...branding, collegeName: e.target.value})}
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Tagline/Status</label>
                    <input 
                      type="text"
                      value={branding.tagline}
                      onChange={(e) => setBranding({...branding, tagline: e.target.value})}
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Admissions Helpline 1</label>
                    <input 
                      type="text"
                      value={branding.helpline1}
                      onChange={(e) => setBranding({...branding, helpline1: e.target.value})}
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Admissions Helpline 2</label>
                    <input 
                      type="text"
                      value={branding.helpline2}
                      onChange={(e) => setBranding({...branding, helpline2: e.target.value})}
                      className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={saveBranding}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow cursor-pointer transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" /> Save Branding Changes
                  </button>
                </div>
              </div>
            )}

            {/* TICKER EDITOR */}
            {activeTab === 'ticker' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-title text-xl font-black text-slate-900">News Ticker Announcements</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Control the scroll marquee news slides.</p>
                </div>

                {/* Add new slide */}
                <div className="flex gap-3">
                  <input 
                    type="text"
                    placeholder="Enter new announcement text..."
                    value={newTickerText}
                    onChange={(e) => setNewTickerText(e.target.value)}
                    className="flex-1 text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                  />
                  <button
                    onClick={addTickerItem}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                {/* List of items */}
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150 overflow-hidden bg-slate-50">
                  {tickerNews.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4 p-4 hover:bg-slate-100/30 transition-colors">
                      <span className="text-sm font-semibold text-slate-700 leading-normal">{item}</span>
                      <button
                        onClick={() => deleteTickerItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FACULTY DIRECTORY EDITOR */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-title text-xl font-black text-slate-900">Faculty Directories</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage details of department personnel.</p>
                  </div>
                  {/* Select Department dropdown */}
                  <div className="relative w-full sm:max-w-xs">
                    <select
                      value={selectedDeptIdx}
                      onChange={(e) => {
                        setSelectedDeptIdx(Number(e.target.value));
                        setSelectedFacultyIdx(null);
                      }}
                      className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none focus:border-indigo-600 transition-all appearance-none"
                    >
                      {depts.map((d, i) => (
                        <option key={i} value={i}>{d.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column: Faculty List */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                        Directory ({depts[selectedDeptIdx]?.faculty?.length || 0})
                      </h4>
                      <button
                        onClick={addFacultyMember}
                        className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Faculty Member
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150 overflow-y-auto max-h-[450px] bg-slate-50 shadow-inner">
                      {(depts[selectedDeptIdx]?.faculty || []).map((f, i) => (
                        <div 
                          key={i} 
                          className={`p-3.5 flex justify-between items-center gap-3 cursor-pointer transition-colors ${
                            selectedFacultyIdx === i ? 'bg-indigo-50/80 hover:bg-indigo-100/50' : 'hover:bg-slate-100/50'
                          }`}
                          onClick={() => selectFacultyForEdit(i)}
                        >
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-slate-800 block truncate">{f.name}</span>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mt-0.5 truncate">{f.designation}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => selectFacultyForEdit(i)}
                              className="p-1.5 hover:bg-indigo-100 text-indigo-650 rounded-lg transition-colors cursor-pointer"
                              title="Edit faculty member"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteFacultyMember(i); }}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                              title="Remove faculty member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Edit Workspace Card */}
                  <div>
                    {selectedFacultyIdx === null ? (
                      <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-xs font-bold leading-normal">
                          Select a faculty member from the directory list on the left to edit details.
                        </span>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider border-b border-slate-100 pb-2">
                          Edit Faculty Member Details
                        </h4>

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                            <input 
                              type="text"
                              value={editFaculty.name}
                              onChange={(e) => setEditFaculty({...editFaculty, name: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Qualification</label>
                            <input 
                              type="text"
                              value={editFaculty.qualification}
                              onChange={(e) => setEditFaculty({...editFaculty, qualification: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Designation</label>
                            <input 
                              type="text"
                              value={editFaculty.designation}
                              onChange={(e) => setEditFaculty({...editFaculty, designation: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">College Role/Dept</label>
                            <input 
                              type="text"
                              value={editFaculty.department}
                              onChange={(e) => setEditFaculty({...editFaculty, department: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contact Email</label>
                            <input 
                              type="text"
                              value={editFaculty.email}
                              onChange={(e) => setEditFaculty({...editFaculty, email: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Experience</label>
                            <input 
                              type="text"
                              value={editFaculty.experience}
                              onChange={(e) => setEditFaculty({...editFaculty, experience: e.target.value})}
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Image Asset URL/Path</label>
                            <input 
                              type="text"
                              value={editFaculty.image}
                              onChange={(e) => setEditFaculty({...editFaculty, image: e.target.value})}
                              placeholder="/Faculty Image/aiml/elamathi.jpg"
                              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-mono text-slate-850"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedFacultyIdx(null)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-95"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveFacultyMember}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Save Member
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
