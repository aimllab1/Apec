import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, AlertCircle, RefreshCw, Users, FileText, Settings, Plus, Trash2, 
  Edit3, Check, CheckCircle2, ChevronRight, UserCheck, ShieldAlert, KeyRound, Globe,
  Upload, Sparkles, Database, Search, Download, Trash, Compass, Megaphone
} from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import departmentsData from '../data/departmentsData.json';
import { getLoadedTourDataAsync, saveTourDataAsync } from '../data/tourData';

// Google API Key from global memory rule
const GEMINI_API_KEY = "AIzaSyDIEi9pe5s5Nkgnc6wc_Xn7apkevjwnMLg";

export default function EditorPanel() {
  const navigate = useNavigate();
  
  // Auth Check
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
  const userRole = localStorage.getItem('user_role') || 'guest';
  const userEmail = localStorage.getItem('apec_user') || '';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Tab State: 'branding' | 'ticker' | 'departments' | 'inquiries' | 'rag_training'
  const [activeTab, setActiveTab] = useState('departments');

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
  const [newTickerLink, setNewTickerLink] = useState('');

  // 7. Advertisement manager states
  const [adEnabled, setAdEnabled] = useState(true);
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    title: '',
    details: '',
    imgUrl: '',
    link: '',
    startDate: '',
    endDate: '',
    functionDate: '',
    isActive: true
  });

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

  // 4. Inquiries State (For Admin/Admission roles)
  const [inquiries, setInquiries] = useState([]);
  const [inquirySearch, setInquirySearch] = useState('');

  // 5. RAG Training State (For Admin only)
  const [ragFile, setRagFile] = useState(null);
  const [ragJsonContent, setRagJsonContent] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedDocs, setTrainedDocs] = useState([]);

  // 6. 360 Tour State (For Admin only)
  const [tourPoints, setTourPoints] = useState([]);
  const [tourScenes, setTourScenes] = useState({});
  const [selectedPointId, setSelectedPointId] = useState(null);
  
  // New Scene form state
  const [newSceneKey, setNewSceneKey] = useState('');
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [newScenePanorama, setNewScenePanorama] = useState('');
  
  // New Hotspot form state
  const [targetSceneId, setTargetSceneId] = useState('');
  const [newHotspotYaw, setNewHotspotYaw] = useState(0);
  const [newHotspotPitch, setNewHotspotPitch] = useState(-18);
  const [newHotspotText, setNewHotspotText] = useState('');

  // Load tour data on mount
  useEffect(() => {
    const loadTour = async () => {
      const data = await getLoadedTourDataAsync();
      setTourPoints(data.mapPoints);
      setTourScenes(data.scenes);
    };
    loadTour();
  }, []);

  const handleMapMouseDown = (ptId) => {
    setSelectedPointId(ptId);
  };

  const handleMapMouseMove = (e) => {
    if (selectedPointId === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, parseFloat(x.toFixed(1))));
    const clampedY = Math.max(0, Math.min(100, parseFloat(y.toFixed(1))));

    setTourPoints(prev => prev.map(pt => pt.id === selectedPointId ? { ...pt, x: clampedX, y: clampedY } : pt));
  };

  const handleMapTouchMove = (e) => {
    if (selectedPointId === null) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, parseFloat(x.toFixed(1))));
    const clampedY = Math.max(0, Math.min(100, parseFloat(y.toFixed(1))));

    setTourPoints(prev => prev.map(pt => pt.id === selectedPointId ? { ...pt, x: clampedX, y: clampedY } : pt));
  };

  const handleMapMouseUp = () => {
    setSelectedPointId(null);
  };

  // Load Initial Configuration Data
  useEffect(() => {
    // Determine default tab based on role
    if (userRole.startsWith('dept_')) {
      setActiveTab('departments');
    } else if (userRole === 'admission') {
      setActiveTab('inquiries');
    } else {
      setActiveTab('branding');
    }

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

    // Load advertisements popup settings
    const savedAdEnabled = localStorage.getItem('apec_ad_popup_enabled');
    if (savedAdEnabled !== null) {
      setAdEnabled(savedAdEnabled === 'true');
    }
    const savedAds = localStorage.getItem('apec_advertisements');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    } else {
      const defaultAds = [
        {
          id: 'ad-default-1',
          title: 'APEC 2026 Admissions Open',
          details: 'Register now to secure your seat. Click below to inquire.',
          imgUrl: '/Images/College/library.webp',
          link: '/admission',
          startDate: '',
          endDate: '',
          functionDate: '',
          isActive: true
        }
      ];
      setAds(defaultAds);
      localStorage.setItem('apec_advertisements', JSON.stringify(defaultAds));
    }

    // Load departments & faculty
    const savedDepts = localStorage.getItem('apec_departments_data');
    let loadedDepts = [];
    if (savedDepts) {
      loadedDepts = Object.values(JSON.parse(savedDepts));
    } else {
      loadedDepts = Object.values(departmentsData);
    }
    setDepts(loadedDepts);

    // Apply department role lock
    if (userRole.startsWith('dept_')) {
      const targetDeptKey = userRole.split('dept_')[1]; // e.g. 'cse', 'aiml'
      const matchedIdx = loadedDepts.findIndex(d => d.key === targetDeptKey);
      if (matchedIdx !== -1) {
        setSelectedDeptIdx(matchedIdx);
      }
    }

    // Load Inquiries if authorized
    if (userRole === 'admin' || userRole === 'admission') {
      loadInquiriesFromDB();
    }

    // Load Trained Docs list if admin
    if (userRole === 'admin') {
      loadTrainedDocuments();
    }
  }, [userRole]);

  // Load Inquiries from Firestore
  const loadInquiriesFromDB = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'inquiries'));
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setInquiries(data);
    } catch (e) {
      console.warn("Firestore inquiry fetch failed, reading fallback inquiries:", e);
      const local = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
      setInquiries(local);
    }
  };

  // Load trained RAG document names from Firestore
  const loadTrainedDocuments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'knowledge_base'));
      const docNames = new Set();
      snapshot.forEach(d => {
        const item = d.data();
        if (item.source) docNames.add(item.source);
      });
      setTrainedDocs(Array.from(docNames));
    } catch (e) {
      console.error("Failed to load trained documents:", e);
    }
  };

  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    window.dispatchEvent(new Event('apec_storage_update'));
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
    const item = newTickerLink.trim()
      ? { text: newTickerText.trim(), link: newTickerLink.trim() }
      : { text: newTickerText.trim() };
    const updated = [...tickerNews, item];
    setTickerNews(updated);
    localStorage.setItem('apec_ticker_news', JSON.stringify(updated));
    setNewTickerText('');
    setNewTickerLink('');
    triggerSuccess('News announcement added!');
  };

  // Delete Ticker Item
  const deleteTickerItem = (idx) => {
    const updated = tickerNews.filter((_, i) => i !== idx);
    setTickerNews(updated);
    localStorage.setItem('apec_ticker_news', JSON.stringify(updated));
    triggerSuccess('News announcement deleted!');
  };

  // Advertisement manager actions
  const handleToggleAdEnabled = (val) => {
    setAdEnabled(val);
    localStorage.setItem('apec_ad_popup_enabled', String(val));
    triggerSuccess(`Advertisement popup globally turned ${val ? 'ON' : 'OFF'}`);
  };

  const handleAddAd = () => {
    if (!newAd.title.trim()) {
      alert("Advertisement Title is required.");
      return;
    }
    const createdAd = {
      ...newAd,
      id: `ad-${Date.now()}`,
      isActive: true
    };
    const updated = [...ads, createdAd];
    setAds(updated);
    localStorage.setItem('apec_advertisements', JSON.stringify(updated));
    setNewAd({
      title: '',
      details: '',
      imgUrl: '',
      link: '',
      startDate: '',
      endDate: '',
      functionDate: '',
      isActive: true
    });
    triggerSuccess("New advertisement published successfully!");
  };

  const handleDeleteAd = (id) => {
    const updated = ads.filter(a => a.id !== id);
    setAds(updated);
    localStorage.setItem('apec_advertisements', JSON.stringify(updated));
    triggerSuccess("Advertisement deleted.");
  };

  const handleToggleAdStatus = (id) => {
    const updated = ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAds(updated);
    localStorage.setItem('apec_advertisements', JSON.stringify(updated));
    triggerSuccess("Advertisement status toggled!");
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

  const saveDepts = (updatedArray) => {
    setDepts(updatedArray);
    const obj = {};
    updatedArray.forEach(d => {
      obj[d.key] = d;
    });
    localStorage.setItem('apec_departments_data', JSON.stringify(obj));
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

  // Delete single inquiry
  const deleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry entry?')) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (e) {
        console.warn("Could not delete from Firestore. Deleting locally.");
      }
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      localStorage.setItem('apec_inquiries', JSON.stringify(updated));
      triggerSuccess('Inquiry log deleted.');
    }
  };

  // Clear all inquiries
  const purgeAllInquiries = async () => {
    if (window.confirm('⚠️ CRITICAL: Are you sure you want to purge all inquiries? This action is irreversible.')) {
      for (const item of inquiries) {
        if (item.id) {
          try {
            await deleteDoc(doc(db, 'inquiries', item.id));
          } catch (e) {}
        }
      }
      setInquiries([]);
      localStorage.removeItem('apec_inquiries');
      triggerSuccess('Inquiry database purged.');
    }
  };

  // Export inquiries to CSV
  const exportInquiriesToCSV = () => {
    let csv = 'Name,Cutoff,Phone,Department,Date\n';
    inquiries.forEach(item => {
      csv += `"${item.name || ''}","${item.cutoff || ''}","${item.phone || ''}","${item.dept || ''}","${item.date || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `APEC_Inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle RAG JSON upload
  const handleRagFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRagFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setRagJsonContent(json);
        triggerSuccess(`JSON file loaded! Found ${Array.isArray(json) ? json.length : Object.keys(json).length} elements.`);
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid JSON.');
        setRagFile(null);
        setRagJsonContent(null);
      }
    };
    reader.readAsText(file);
  };

  // AI Training using Gemini Embeddings
  const trainRAGModel = async () => {
    if (!ragJsonContent) return;
    setIsTraining(true);
    setTrainingProgress(0);

    // Normalize JSON content to flat text passages
    const passages = [];
    if (Array.isArray(ragJsonContent)) {
      ragJsonContent.forEach(item => {
        if (typeof item === 'string') passages.push(item);
        else if (item.text) passages.push(item.text);
        else passages.push(JSON.stringify(item));
      });
    } else {
      Object.entries(ragJsonContent).forEach(([key, val]) => {
        passages.push(`${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`);
      });
    }

    setTotalChunks(passages.length);
    const sourceName = ragFile.name;

    try {
      for (let i = 0; i < passages.length; i++) {
        const text = passages[i];
        
        // Call Gemini text-embedding-004 model API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text: text }] }
          })
        });

        const resData = await response.json();
        if (!response.ok || !resData.embedding?.values) {
          throw new Error(resData.error?.message || "Failed to retrieve vector values from Gemini Embedding API.");
        }

        const embeddingValues = resData.embedding.values; // Array of 768 float values
        
        // Write the embedding values and raw text to Firestore collection knowledge_base
        const docId = `${sourceName.replace(/[^a-zA-Z0-9]/g, '_')}_chunk_${i}`;
        await setDoc(doc(db, 'knowledge_base', docId), {
          text: text,
          embedding: embeddingValues,
          source: sourceName,
          timestamp: Date.now()
        });

        setTrainingProgress(i + 1);
      }

      triggerSuccess('AI Agent trained successfully with new structured embeddings!');
      setRagFile(null);
      setRagJsonContent(null);
      loadTrainedDocuments();
    } catch (err) {
      console.error("Embedding API training error:", err);
      alert(`AI Embedding Training Failed: ${err.message}`);
    } finally {
      setIsTraining(false);
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

  const filteredInquiries = inquiries.filter(item => {
    const searchLower = inquirySearch.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(searchLower) ||
      (item.dept || '').toLowerCase().includes(searchLower) ||
      (item.phone || '').includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 pb-20 px-4 md:px-8 select-none text-left">
      <div className="max-w-[1400px] mx-auto animate-fade-in">
        
        {/* Banner / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-title text-3xl font-black text-slate-900 leading-tight">
              APEC Web Portal Console
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Welcome, <span className="text-indigo-600 font-extrabold">{userEmail.split('@')[0]}</span> (Role: <span className="uppercase font-bold text-slate-700">{userRole}</span>)
            </p>
          </div>
          {userRole === 'admin' && (
            <button 
              onClick={resetToFactoryDefault}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Revert All Defaults
            </button>
          )}
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
          
          {/* Left panel tabs (Restricted based on roles) */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            
            {userRole === 'admin' && (
              <>
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
              </>
            )}

            {(userRole === 'admin' || userRole.startsWith('dept_')) && (
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
            )}

            {(userRole === 'admin' || userRole === 'admission') && (
              <button
                onClick={() => { setActiveTab('inquiries'); setSelectedFacultyIdx(null); }}
                className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'inquiries' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Database className="w-4 h-4" /> Inquiries & leads
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab('rag_training'); setSelectedFacultyIdx(null); }}
                className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'rag_training' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 animate-pulse" /> AI Agent Training
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab('360_tour'); setSelectedFacultyIdx(null); }}
                className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === '360_tour' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" /> 360 VR Manager
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab('ads'); setSelectedFacultyIdx(null); }}
                className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'ads' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4" /> Ads Overlay Manager
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Panel Main Workspace */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* BRANDING EDITOR */}
            {activeTab === 'branding' && userRole === 'admin' && (
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
            {activeTab === 'ticker' && userRole === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-title text-xl font-black text-slate-900">News Ticker Announcements</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Control the scroll marquee news slides with optional hyperlinks.</p>
                </div>

                {/* Add new slide */}
                <div className="flex flex-col gap-3 bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Announcement Text *</label>
                    <input 
                      type="text"
                      placeholder="Enter new announcement text..."
                      value={newTickerText}
                      onChange={(e) => setNewTickerText(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-650 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Optional Hyperlink Link</label>
                    <input 
                      type="text"
                      placeholder="e.g. /cutoff-calculator or external URL"
                      value={newTickerLink}
                      onChange={(e) => setNewTickerLink(e.target.value)}
                      className="w-full text-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-650 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={addTickerItem}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>
                </div>

                {/* List of items */}
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150 overflow-hidden bg-slate-50">
                  {tickerNews.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-4 p-4 hover:bg-slate-100/30 transition-colors">
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-slate-700 leading-normal">
                          {typeof item === 'object' ? item.text : item}
                        </span>
                        {typeof item === 'object' && item.link && (
                          <span className="text-[10px] text-indigo-500 font-bold font-mono mt-0.5">
                            Link: {item.link}
                          </span>
                        )}
                      </div>
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

            {/* ADVERTISEMENT OVERLAY MANAGER */}
            {activeTab === 'ads' && userRole === 'admin' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-title text-xl font-black text-slate-900">Advertisement Overlay Manager</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Control the global admissions overlay, schedule functional timers, and host multiple advertisements.</p>
                </div>

                {/* Global Status Switch */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Global Advertisement Popup</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">When disabled, no advertisement overlay will display on the home landing page.</p>
                  </div>
                  <button
                    onClick={() => handleToggleAdEnabled(!adEnabled)}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
                      adEnabled 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-slate-200 text-slate-650 hover:bg-slate-300'
                    }`}
                  >
                    {adEnabled ? 'Status: Active (ON)' : 'Status: Disabled (OFF)'}
                  </button>
                </div>

                {/* Add New Ad Form */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="w-4 h-4 text-indigo-650" /> Add New Advertisement
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Ad Title *</label>
                      <input 
                        type="text"
                        placeholder="e.g. APEC Admissions Open"
                        value={newAd.title}
                        onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Details / Description</label>
                      <input 
                        type="text"
                        placeholder="e.g. Register now for the counseling 2026 intake..."
                        value={newAd.details}
                        onChange={(e) => setNewAd({...newAd, details: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Image Path / URL</label>
                      <input 
                        type="text"
                        placeholder="e.g. /Images/College/library.webp"
                        value={newAd.imgUrl}
                        onChange={(e) => setNewAd({...newAd, imgUrl: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Hyperlink Action (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g. /admission or registration link"
                        value={newAd.link}
                        onChange={(e) => setNewAd({...newAd, link: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Show Start Date (Optional)</label>
                      <input 
                        type="date"
                        value={newAd.startDate}
                        onChange={(e) => setNewAd({...newAd, startDate: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Show End Date (Optional)</label>
                      <input 
                        type="date"
                        value={newAd.endDate}
                        onChange={(e) => setNewAd({...newAd, endDate: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Function Start Date (For Countdown Timer)</label>
                      <input 
                        type="date"
                        value={newAd.functionDate}
                        onChange={(e) => setNewAd({...newAd, functionDate: e.target.value})}
                        className="w-full text-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                      />
                      <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Specify the start date of the function/event to show a remaining days countdown.</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleAddAd}
                      className="bg-indigo-650 hover:bg-indigo-755 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Publish Advertisement
                    </button>
                  </div>
                </div>

                {/* List of Ads */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest text-left">Current Active Ads ({ads.length})</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ads.map((a) => (
                      <div key={a.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
                        
                        {/* Status tag */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl border border-slate-200 z-10">
                          <span className={`w-2 h-2 rounded-full ${a.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                          <button
                            onClick={() => handleToggleAdStatus(a.id)}
                            className="text-[9px] uppercase font-black tracking-wider text-slate-600 hover:text-indigo-650 transition-colors"
                          >
                            {a.isActive ? 'Active' : 'Paused'}
                          </button>
                        </div>

                        <div>
                          {a.imgUrl && (
                            <div className="w-full h-28 bg-slate-100 rounded-2xl overflow-hidden mb-4 border border-slate-150">
                              <img src={a.imgUrl} alt={a.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h5 className="text-sm font-extrabold text-slate-900 leading-tight pr-16">{a.title}</h5>
                          <p className="text-xs text-slate-500 font-semibold mt-1">{a.details || <span className="italic text-slate-350">No details</span>}</p>

                          {/* Scheduling tags */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[10px] font-semibold text-slate-450 text-left">
                            {a.startDate && (
                              <div>Visible from: <span className="font-mono text-slate-750 font-bold">{a.startDate}</span></div>
                            )}
                            {a.endDate && (
                              <div>Visible till: <span className="font-mono text-slate-750 font-bold">{a.endDate}</span></div>
                            )}
                            {a.functionDate && (
                              <div className="text-indigo-600 font-extrabold flex items-center gap-1">
                                📅 Function Date: <span className="font-mono">{a.functionDate}</span>
                              </div>
                            )}
                            {a.link && (
                              <div className="text-slate-650 font-bold truncate">Hyperlink: <span className="font-mono text-indigo-500">{a.link}</span></div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleDeleteAd(a.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Ad
                          </button>
                        </div>

                      </div>
                    ))}

                    {ads.length === 0 && (
                      <div className="col-span-2 py-10 bg-slate-50 border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-semibold">
                        No advertisements defined yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FACULTY DIRECTORY EDITOR */}
            {activeTab === 'departments' && (userRole === 'admin' || userRole.startsWith('dept_')) && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-title text-xl font-black text-slate-900">Faculty Directories</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage details of department personnel.</p>
                  </div>
                  
                  {/* Select Department dropdown (Locked for department roles) */}
                  <div className="relative w-full sm:max-w-xs">
                    <select
                      value={selectedDeptIdx}
                      disabled={userRole.startsWith('dept_')}
                      onChange={(e) => {
                        setSelectedDeptIdx(Number(e.target.value));
                        setSelectedFacultyIdx(null);
                      }}
                      className="w-full bg-slate-50 disabled:bg-slate-100/80 disabled:cursor-not-allowed text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-xs uppercase tracking-wider cursor-pointer focus:outline-none focus:border-indigo-600 transition-all appearance-none"
                    >
                      {depts.map((d, i) => (
                        <option key={i} value={i}>{d.name}</option>
                      ))}
                    </select>
                    {!userRole.startsWith('dept_') && (
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                        </svg>
                      </div>
                    )}
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
                              placeholder="/Images/Faculty/aiml/elamathi.jpg"
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

            {/* INQUIRIES & LEADS VIEWER (Admin / Admission role) */}
            {activeTab === 'inquiries' && (userRole === 'admin' || userRole === 'admission') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-title text-xl font-black text-slate-900">Leads & Admissions Inquiries</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">View and manage contact submission inquiries gathered across the portal.</p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={exportInquiriesToCSV}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                    {userRole === 'admin' && (
                      <button
                        onClick={purgeAllInquiries}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm"
                      >
                        <Trash className="w-3.5 h-3.5" /> Purge Logs
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search inquiries by name, phone or preferred department..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Candidate</th>
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Contact No</th>
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Cutoff (TNEA)</th>
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Department</th>
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="p-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInquiries.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-xs font-bold text-slate-400">
                              No inquiries found matching your filters.
                            </td>
                          </tr>
                        ) : (
                          filteredInquiries.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3 text-xs font-bold text-slate-800">{item.name}</td>
                              <td className="p-3 text-xs font-semibold text-slate-600">{item.phone}</td>
                              <td className="p-3 text-xs font-mono font-bold text-indigo-600">{item.cutoff || 'N/A'}</td>
                              <td className="p-3 text-xs font-bold text-slate-700 uppercase">{item.dept}</td>
                              <td className="p-3 text-[11px] font-semibold text-slate-400">{item.date || new Date(item.timestamp).toLocaleString()}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => deleteInquiry(item.id)}
                                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* AI MODEL RAG EMBEDDINGS TRAINING CONSOLE (Admin only) */}
            {activeTab === 'rag_training' && userRole === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-title text-xl font-black text-slate-900">RAG AI Embeddings Trainer</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Upload structured JSON documents, convert them into vector embeddings via Gemini, and load them into Firestore to train the AI Chat Assistant.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Upload and process */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Upload JSON File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                      <input 
                        type="file"
                        accept=".json"
                        onChange={handleRagFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isTraining}
                      />
                      <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                      <span className="text-xs font-bold text-slate-700">
                        {ragFile ? ragFile.name : "Click to select a structured JSON document"}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">Accepts array of passages or key-value entries</span>
                    </div>

                    {ragJsonContent && (
                      <div className="space-y-3">
                        <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-2xl flex flex-col gap-1">
                          <span className="text-xs font-extrabold text-indigo-850">Ready to Train</span>
                          <span className="text-[10px] text-indigo-500 font-semibold">Loaded file has been validated for vector parsing.</span>
                        </div>

                        <button
                          onClick={trainRAGModel}
                          disabled={isTraining}
                          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-4.5 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95"
                        >
                          {isTraining ? (
                            <span>Training Progress: {trainingProgress} / {totalChunks} chunks</span>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> Train Chatbot via Gemini Embeddings
                            </>
                          )}
                        </button>

                        {isTraining && (
                          <div className="space-y-1">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${(trainingProgress / totalChunks) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 block text-right">
                              {Math.round((trainingProgress / totalChunks) * 100)}% Complete
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Trained files list */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Active Trained Knowledge Documents</h4>
                    <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150 overflow-hidden bg-slate-50 shadow-inner">
                      {trainedDocs.length === 0 ? (
                        <div className="p-8 text-center text-xs font-bold text-slate-400">
                          No custom knowledge base documents trained yet. The AI is running on default configuration.
                        </div>
                      ) : (
                        trainedDocs.map((docName, idx) => (
                          <div key={idx} className="p-3.5 flex justify-between items-center bg-white">
                            <span className="text-xs font-bold text-slate-700 block truncate">{docName}</span>
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wide">
                              Active RAG
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 360 TOUR MANAGER */}
            {activeTab === '360_tour' && userRole === 'admin' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-indigo-600" /> 360 VR Manager & Map Coordinator
                    </h3>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">
                      Drag pins on the map to adjust coordinates, manage scenes, and create links.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await saveTourDataAsync(tourPoints, tourScenes);
                        setSuccessMessage('360 Tour configuration saved successfully to Firestore!');
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                      } catch (e) {
                        alert("Failed to save configuration to database: " + e.message);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Left Column: Interactive Map Coordination */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Drag Coordinates Map
                    </h4>
                    
                    <div 
                      className="relative w-full aspect-[16/10] bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-inner cursor-crosshair select-none"
                      onMouseMove={handleMapMouseMove}
                      onMouseUp={handleMapMouseUp}
                      onMouseLeave={handleMapMouseUp}
                      onTouchMove={handleMapTouchMove}
                      onTouchEnd={handleMapMouseUp}
                    >
                      <img 
                        src="/Images/Panorama/map.png" 
                        alt="Campus Map Editor" 
                        className="w-full h-full object-cover pointer-events-none"
                      />

                      {/* Map Coordinate Pins */}
                      {tourPoints.map((pt) => {
                        const isDragging = selectedPointId === pt.id;
                        return (
                          <div
                            key={pt.id}
                            style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group z-30"
                          >
                            <button
                              onMouseDown={() => handleMapMouseDown(pt.id)}
                              onTouchStart={() => handleMapMouseDown(pt.id)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center cursor-move shadow-md transition-transform ${
                                isDragging 
                                  ? 'bg-red-650 scale-125 ring-4 ring-red-300' 
                                  : 'bg-indigo-650 hover:bg-indigo-700 hover:scale-110'
                              }`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-black uppercase tracking-wider text-white whitespace-nowrap shadow-md pointer-events-none group-hover:opacity-100 transition-opacity">
                              {pt.name} ({pt.x}%, {pt.y}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Coordinates Table */}
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1.5 mb-1.5">Active Map Coordinates</span>
                      {tourPoints.map(pt => (
                        <div key={pt.id} className="flex justify-between items-center text-[10px] font-bold text-slate-600 bg-white border border-slate-100 p-2.5 rounded-xl">
                          <span className="font-extrabold uppercase tracking-wide text-slate-800">{pt.name}</span>
                          <div className="flex gap-4">
                            <span>X: <strong className="text-indigo-600 font-extrabold">{pt.x}%</strong></span>
                            <span>Y: <strong className="text-indigo-600 font-extrabold">{pt.y}%</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Scene Manager & Link Creator */}
                  <div className="flex flex-col gap-6">
                    {/* Add New Scene Form */}
                    <div className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Add New Panorama Scene</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Scene ID (camelCase)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. canteen"
                            value={newSceneKey}
                            onChange={(e) => setNewSceneKey(e.target.value.replace(/\s+/g, ''))}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Scene Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Campus Canteen"
                            value={newSceneTitle}
                            onChange={(e) => setNewSceneTitle(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Panorama Image URL / Path</label>
                        <input 
                          type="text" 
                          placeholder="e.g. /Images/Panorama/canteen.webp"
                          value={newScenePanorama}
                          onChange={(e) => setNewScenePanorama(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => {
                            if (!newSceneKey || !newSceneTitle || !newScenePanorama) {
                              alert("Please fill all scene details.");
                              return;
                            }
                            if (tourScenes[newSceneKey]) {
                              alert("Scene ID already exists.");
                              return;
                            }
                            
                            // Add to scenes
                            const updatedScenes = {
                              ...tourScenes,
                              [newSceneKey]: {
                                title: newSceneTitle,
                                type: "equirectangular",
                                panorama: newScenePanorama,
                                yaw: -45,
                                pitch: 0,
                                hfov: 110,
                                autoRotate: 4.0,
                                hotSpots: []
                              }
                            };
                            setTourScenes(updatedScenes);

                            // Also create a map point at center
                            const newPointId = tourPoints.length > 0 ? Math.max(...tourPoints.map(p => p.id)) + 1 : 1;
                            const updatedPoints = [
                              ...tourPoints,
                              { id: newPointId, name: newSceneTitle, x: 50.0, y: 50.0, sceneId: newSceneKey }
                            ];
                            setTourPoints(updatedPoints);

                            // Reset form
                            setNewSceneKey('');
                            setNewSceneTitle('');
                            setNewScenePanorama('');
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                        >
                          Add Scene
                        </button>
                      </div>
                    </div>

                    {/* Manage Scene Links / Hotspots */}
                    <div className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Connect Scene Hotspots</span>
                      
                      <div className="flex flex-col gap-4">
                        {/* Select Current Scene */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Select Source Scene</label>
                          <select
                            value={targetSceneId}
                            onChange={(e) => setTargetSceneId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            <option value="">-- Choose Scene --</option>
                            {Object.entries(tourScenes).map(([key, sc]) => (
                              <option key={key} value={key}>{sc.title} ({key})</option>
                            ))}
                          </select>
                        </div>

                        {targetSceneId && (
                          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
                            {/* Hotspots List */}
                            <div className="flex flex-col gap-2">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Hotspots</span>
                              {(tourScenes[targetSceneId]?.hotSpots || []).length === 0 ? (
                                <span className="text-[10px] font-bold text-slate-400">No hotspots configured for this scene.</span>
                              ) : (
                                (tourScenes[targetSceneId]?.hotSpots || []).map((hs, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px] font-bold text-slate-600">
                                    <div className="flex flex-col text-left">
                                      <span className="font-extrabold uppercase tracking-wide text-slate-800">{hs.createTooltipArgs?.text}</span>
                                      <span className="text-[8px] font-extrabold text-slate-400 mt-0.5">TARGET: {hs.createTooltipArgs?.sceneId} (YAW: {hs.yaw}°, PITCH: {hs.pitch}°)</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const updatedHotspots = (tourScenes[targetSceneId].hotSpots || []).filter((_, i) => i !== idx);
                                        setTourScenes({
                                          ...tourScenes,
                                          [targetSceneId]: {
                                            ...tourScenes[targetSceneId],
                                            hotSpots: updatedHotspots
                                          }
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-705 p-1 cursor-pointer transition-colors"
                                      title="Remove Hotspot"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Add New Hotspot */}
                            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                              <span className="text-[8px] font-black text-indigo-650 uppercase tracking-widest">Create New Hotspot</span>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Destination Scene</label>
                                  <select
                                    value={newHotspotText}
                                    onChange={(e) => {
                                      const scId = e.target.value;
                                      setNewHotspotText(scId);
                                    }}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                                  >
                                    <option value="">-- Select Target --</option>
                                    {Object.entries(tourScenes).filter(([key]) => key !== targetSceneId).map(([key, sc]) => (
                                      <option key={key} value={key}>{sc.title}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Hotspot Text Label</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Enter Library"
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                                    id="hs_label_input"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Yaw Angle (-180 to 180)</label>
                                  <input 
                                    type="number"
                                    value={newHotspotYaw}
                                    onChange={(e) => setNewHotspotYaw(parseInt(e.target.value) || 0)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Pitch Angle (-90 to 90)</label>
                                  <input 
                                    type="number"
                                    value={newHotspotPitch}
                                    onChange={(e) => setNewHotspotPitch(parseInt(e.target.value) || 0)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const targetInput = document.getElementById('hs_label_input');
                                  const labelText = targetInput?.value || '';
                                  if (!newHotspotText || !labelText) {
                                    alert("Please select destination and input a label.");
                                    return;
                                  }
                                  
                                  const newHs = {
                                    pitch: newHotspotPitch,
                                    yaw: newHotspotYaw,
                                    createTooltipArgs: { text: labelText, sceneId: newHotspotText }
                                  };

                                  const updatedHotspots = [...(tourScenes[targetSceneId].hotSpots || []), newHs];
                                  setTourScenes({
                                    ...tourScenes,
                                    [targetSceneId]: {
                                      ...tourScenes[targetSceneId],
                                      hotSpots: updatedHotspots
                                    }
                                  });

                                  // Reset fields
                                  setNewHotspotText('');
                                  if (targetInput) targetInput.value = '';
                                  setNewHotspotYaw(0);
                                  setNewHotspotPitch(-18);
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                              >
                                Link Hotspot
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Scene Section */}
                    {targetSceneId && (
                      <div className="border border-red-200 bg-red-50/20 rounded-2xl p-5 flex justify-between items-center">
                        <div className="text-left">
                          <span className="text-xs font-black uppercase tracking-wider text-red-650 block">Remove Scene</span>
                          <span className="text-[9px] font-bold text-slate-400 block mt-0.5">Delete this scene completely from the virtual tour configuration.</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete scene "${tourScenes[targetSceneId].title}"? This will also remove its map coordinate pin.`)) {
                              // Delete scene
                              const updatedScenes = { ...tourScenes };
                              delete updatedScenes[targetSceneId];
                              setTourScenes(updatedScenes);

                              // Delete map point
                              const updatedPoints = tourPoints.filter(p => p.sceneId !== targetSceneId);
                              setTourPoints(updatedPoints);

                              setTargetSceneId('');
                            }
                          }}
                          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all"
                        >
                          Delete Scene
                        </button>
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
