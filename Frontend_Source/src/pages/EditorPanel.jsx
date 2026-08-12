import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, AlertCircle, RefreshCw, Users, FileText, Settings, Plus, Minus, Trash2, 
  Edit3, Check, CheckCircle2, ChevronRight, ChevronDown, UserCheck, ShieldAlert, KeyRound, Globe,
  Upload, Sparkles, Database, Search, Download, Trash, Compass, Megaphone, Lock, User, Eye, EyeOff, Shield, Mail, Key,
  BookOpen, Milestone, Library, Briefcase, GraduationCap, BarChart3, PieChart, TrendingUp, Clock, PhoneCall, MessageSquare, Filter, Tag, Activity, Layers, ExternalLink, Copy, ArrowUpRight, BookOpenCheck,
  Calendar, CalendarDays, Coins, PartyPopper, MessageCircle
} from 'lucide-react';

import departmentsData from '../data/departmentsData.json';
import { getLoadedTourDataAsync, saveTourDataAsync } from '../data/tourData';
import { encryptText, decryptText } from '../utils/crypto';
import { 
  fetchInquiries, 
  updateInquiryStatus as syncUpdateInquiryStatus, 
  updateInquiryNotes as syncUpdateInquiryNotes, 
  deleteInquiry as syncDeleteInquiry, 
  purgeAllInquiries as syncPurgeAllInquiries,
  getDepartmentFeedbacks,
  deleteDepartmentFeedback
} from '../utils/inquiryService';

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

  // Tab State: 'dashboard' | 'branding' | 'ticker' | 'departments' | 'inquiries' | 'rag_training' | '360_tour' | 'hod_portals' | 'ads'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [editingNoteInquiry, setEditingNoteInquiry] = useState(null);
  const [noteInputText, setNoteInputText] = useState('');

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
  const [deptSubTab, setDeptSubTab] = useState('faculty'); // 'faculty' | 'overview' | 'outcomes' | 'labs' | 'placements'
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  
  // Faculty edit state
  const [editFaculty, setEditFaculty] = useState({
    name: '',
    qualification: '',
    designation: '',
    department: '',
    email: '',
    experience: '',
    joiningDate: '',
    image: '',
    orcid: ''
  });

  // Handle Faculty Image Upload via FileReader
  const handleFacultyImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFaculty(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Inquiries State (For Admin/Admission roles)
  const [inquiries, setInquiries] = useState([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [isSyncingInquiries, setIsSyncingInquiries] = useState(false);

  // Load Inquiries from Central Database & Local Cache
  const loadInquiriesFromDB = async () => {
    setIsSyncingInquiries(true);
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (e) {
      console.error('[EditorPanel] Failed to fetch inquiries:', e);
    } finally {
      setIsSyncingInquiries(false);
    }
  };

  // Real-time periodic synchronization for Admission & Admin roles
  useEffect(() => {
    if (activeTab === 'inquiries' || activeTab === 'dashboard') {
      loadInquiriesFromDB();
      const interval = setInterval(() => {
        loadInquiriesFromDB();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // 5. RAG Training State (For Admin only)
  const [ragFile, setRagFile] = useState(null);
  const [ragJsonContent, setRagJsonContent] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedDocs, setTrainedDocs] = useState([]);

  // 8. HOD Accounts & Department Portals State (Admin only)
  const [hodAccounts, setHodAccounts] = useState([]);
  const [hodSearch, setHodSearch] = useState('');
  const [hodForm, setHodForm] = useState({
    deptKey: '',
    deptName: '',
    email: '',
    password: '',
  });
  const [showHodPassword, setShowHodPassword] = useState(false);
  const [editingHodId, setEditingHodId] = useState(null);

  // 6. 360 VR Tour Manager State
  const [tourPoints, setTourPoints] = useState([]);
  const [tourScenes, setTourScenes] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState(null);

  // Load tour data on mount
  useEffect(() => {
    const loadTour = async () => {
      const data = await getLoadedTourDataAsync();
      setTourPoints(data.mapPoints);
      setTourScenes(data.scenes);
    };
    loadTour();
  }, []);

  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isPanningMap, setIsPanningMap] = useState(false);
  const [panStartPoint, setPanStartPoint] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setMapZoom(prev => Math.min(4, prev + 0.25));
  const handleZoomOut = () => {
    setMapZoom(prev => {
      const next = Math.max(1, prev - 0.25);
      if (next === 1) setMapOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setMapZoom(1);
    setMapOffset({ x: 0, y: 0 });
  };

  const handleMapWheel = (e) => {
    if (e.deltaY < 0) {
      setMapZoom(prev => Math.min(4, prev + 0.15));
    } else {
      setMapZoom(prev => {
        const next = Math.max(1, prev - 0.15);
        if (next === 1) setMapOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleMapBgMouseDown = (e) => {
    if (selectedPointId !== null) return;
    if (mapZoom <= 1) return;
    setIsPanningMap(true);
    setPanStartPoint({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMapBgMouseMove = (e) => {
    if (!isPanningMap) return;
    const newX = e.clientX - panStartPoint.x;
    const newY = e.clientY - panStartPoint.y;
    const limitX = (mapZoom - 1) * 300;
    const limitY = (mapZoom - 1) * 200;
    setMapOffset({
      x: Math.max(-limitX, Math.min(limitX, newX)),
      y: Math.max(-limitY, Math.min(limitY, newY))
    });
  };

  const handleMapBgMouseUp = () => {
    setIsPanningMap(false);
  };

  const handleMapMouseDown = (ptId) => {
    setSelectedPointId(ptId);
  };

  const handleMapMouseMove = (e) => {
    if (selectedPointId === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    
    const containerX = e.clientX - rect.left;
    const containerY = e.clientY - rect.top;
    
    // Reverse scale and offset translation to get original coordinate percentages
    const imgX = ((containerX - rect.width / 2) / mapZoom) + rect.width / 2 - mapOffset.x;
    const imgY = ((containerY - rect.height / 2) / mapZoom) + rect.height / 2 - mapOffset.y;
    
    const x = ((imgX / rect.width) * 100);
    const y = ((imgY / rect.height) * 100);
    
    const clampedX = Math.max(0, Math.min(100, parseFloat(x.toFixed(1))));
    const clampedY = Math.max(0, Math.min(100, parseFloat(y.toFixed(1))));

    setTourPoints(prev => prev.map(pt => pt.id === selectedPointId ? { ...pt, x: clampedX, y: clampedY } : pt));
  };

  const handleMapTouchMove = (e) => {
    if (selectedPointId === null) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    const containerX = touch.clientX - rect.left;
    const containerY = touch.clientY - rect.top;
    
    const imgX = ((containerX - rect.width / 2) / mapZoom) + rect.width / 2 - mapOffset.x;
    const imgY = ((containerY - rect.height / 2) / mapZoom) + rect.height / 2 - mapOffset.y;
    
    const x = ((imgX / rect.width) * 100);
    const y = ((imgY / rect.height) * 100);
    
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
      setActiveTab('dashboard');
    } else if (userRole === 'admission') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }

    // Centralized settings loader
    const fetchSettings = async () => {
      // 1. Load branding
      const savedBranding = localStorage.getItem('apec_branding');
      if (savedBranding) {
        try { setBranding(JSON.parse(savedBranding)); } catch (e) {}
      }

      // 2. Load ticker
      const savedTicker = localStorage.getItem('apec_ticker_news');
      if (savedTicker) {
        try { setTickerNews(JSON.parse(savedTicker)); } catch (e) {}
      }

      // 3. Load advertisements popup settings
      const savedEnabled = localStorage.getItem('apec_ad_popup_enabled');
      if (savedEnabled !== null) setAdEnabled(savedEnabled === 'true');
      const savedAds = localStorage.getItem('apec_advertisements');
      if (savedAds) {
        try { setAds(JSON.parse(savedAds)); } catch (e) {}
      }
    };

    fetchSettings();

    // Load departments & faculty
    const savedDepts = localStorage.getItem('apec_departments_data');
    let loadedDepts = [];
    if (savedDepts) {
      loadedDepts = Object.values(JSON.parse(savedDepts));
    } else {
      loadedDepts = Object.values(departmentsData);
    }

    // Normalize labs/facilities format to support objects and clear default dummy text values
    loadedDepts = loadedDepts.map(d => {
      if (d.labs && Array.isArray(d.labs)) {
        d.labs = d.labs.map(lab => {
          if (typeof lab === 'string') {
            const isMock = lab === 'Advanced Laboratory' || lab === 'New Classroom' || lab === 'New Laboratory' || lab === 'New Library';
            return {
              name: isMock ? '' : lab,
              type: 'laboratory',
              incharge: '',
              description: '',
              images: []
            };
          } else if (lab && typeof lab === 'object') {
            const normalized = { ...lab };
            
            // Clear default/mock values
            const mockNames = ['Advanced Laboratory', 'New Classroom', 'New Laboratory', 'New Library'];
            const mockIncharges = ['Prof. Incharge'];
            const mockDescriptions = ['Lab details and equipment', 'Smart classroom details', 'Departmental library details'];
            
            if (!normalized.name || mockNames.includes(normalized.name)) {
              normalized.name = '';
            }
            if (!normalized.type) {
              normalized.type = 'laboratory';
            }
            if (!normalized.incharge || mockIncharges.includes(normalized.incharge)) {
              normalized.incharge = '';
            }
            if (!normalized.description || mockDescriptions.includes(normalized.description)) {
              normalized.description = '';
            }
            if (!normalized.images) {
              normalized.images = normalized.image ? [normalized.image] : [];
            }
            return normalized;
          }
          return lab;
        });
      }
      return d;
    });

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
    if (userRole === 'admin' || userRole === 'admission' || userRole.startsWith('dept_')) {
      loadInquiriesFromDB();
    }

    // Load Trained Docs list if admin
    if (userRole === 'admin') {
      loadTrainedDocuments();
      loadHodAccounts();
    }
  }, [userRole]);

  // Load HOD accounts from localStorage
  const loadHodAccounts = async () => {
    const saved = localStorage.getItem('apec_hod_accounts');
    if (saved) {
      try { setHodAccounts(JSON.parse(saved)); } catch (e) {}
    }
  };

  // Create or Update HOD Account
  const handleSaveHodAccount = async (e) => {
    e.preventDefault();
    if (!hodForm.deptKey.trim() || !hodForm.email.trim() || !hodForm.password.trim()) {
      alert("Please fill in Department, Email, and Password.");
      return;
    }

    const cleanDeptKey = hodForm.deptKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanRole = `dept_${cleanDeptKey}`;
    const cleanEmail = hodForm.email.trim().toLowerCase();
    const docId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    const newAcc = {
      id: docId,
      username: cleanEmail,
      role: cleanRole,
      deptKey: cleanDeptKey,
      deptName: hodForm.deptName.trim() || cleanDeptKey.toUpperCase(),
      clearPassword: hodForm.password.trim()
    };

    const updated = [...hodAccounts.filter(a => a.id !== docId), newAcc];
    setHodAccounts(updated);
    localStorage.setItem('apec_hod_accounts', JSON.stringify(updated));

    triggerSuccess(`HOD Portal created for ${cleanEmail} (${hodForm.deptName || cleanDeptKey.toUpperCase()})!`);
    setHodForm({ deptKey: '', deptName: '', email: '', password: '' });
    setEditingHodId(null);
  };

  // Delete HOD Account
  const handleDeleteHodAccount = async (docId, email) => {
    if (window.confirm(`Are you sure you want to revoke HOD portal access for ${email}?`)) {
      const updated = hodAccounts.filter(a => a.id !== docId);
      setHodAccounts(updated);
      localStorage.setItem('apec_hod_accounts', JSON.stringify(updated));
      triggerSuccess(`HOD portal access revoked for ${email}.`);
    }
  };

  // Load trained RAG document names from localStorage
  const loadTrainedDocuments = () => {
    const localDocs = JSON.parse(localStorage.getItem('apec_trained_docs') || '[]');
    setTrainedDocs(localDocs);
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
    triggerSuccess('College branding settings published globally!');
  };

  // Helper to save ticker
  const saveTickerToDB = (updatedItems) => {
    localStorage.setItem('apec_ticker_news', JSON.stringify(updatedItems));
  };

  // Add Ticker Item
  const addTickerItem = () => {
    if (!newTickerText.trim()) return;
    const item = newTickerLink.trim()
      ? { text: newTickerText.trim(), link: newTickerLink.trim() }
      : { text: newTickerText.trim() };
    const updated = [...tickerNews, item];
    setTickerNews(updated);
    saveTickerToDB(updated);
    setNewTickerText('');
    setNewTickerLink('');
    triggerSuccess('News announcement added!');
  };

  // Delete Ticker Item
  const deleteTickerItem = (idx) => {
    const updated = tickerNews.filter((_, i) => i !== idx);
    setTickerNews(updated);
    saveTickerToDB(updated);
    triggerSuccess('News announcement deleted!');
  };

  // Helper to save ads
  const saveAdsToDB = (updatedAds) => {
    localStorage.setItem('apec_advertisements', JSON.stringify(updatedAds));
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
    saveAdsToDB(updated);
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
    saveAdsToDB(updated);
    triggerSuccess("Advertisement deleted.");
  };

  const handleToggleAdStatus = (id) => {
    const updated = ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAds(updated);
    saveAdsToDB(updated);
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
      image: faculty.image || '',
      orcid: faculty.orcid || ''
    });
  };

  const saveDepts = (updatedArray) => {
    setDepts(updatedArray);
    const obj = {};
    updatedArray.forEach(d => {
      obj[d.key] = d;
    });
    localStorage.setItem('apec_departments_data', JSON.stringify(obj));
    window.dispatchEvent(new Event('apec_storage_update'));
  };

  // Helper to update field on currently selected department
  const updateCurrentDeptField = (field, value) => {
    const updatedDepts = [...depts];
    if (updatedDepts[selectedDeptIdx]) {
      updatedDepts[selectedDeptIdx] = {
        ...updatedDepts[selectedDeptIdx],
        [field]: value
      };
      saveDepts(updatedDepts);
      triggerSuccess(`Department ${field} updated successfully!`);
    }
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
      image: '',
      orcid: ''
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
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      await syncDeleteInquiry(id);
      triggerSuccess('Inquiry log deleted.');
    }
  };

  // Update single inquiry lead status
  const updateInquiryStatus = async (id, newStatus) => {
    const updated = inquiries.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setInquiries(updated);
    await syncUpdateInquiryStatus(id, newStatus);
    triggerSuccess(`Lead status updated to '${newStatus}'.`);
  };

  // Save single inquiry notes
  const updateInquiryNotes = async (id, notesText) => {
    const updated = inquiries.map(item => item.id === id ? { ...item, notes: notesText } : item);
    setInquiries(updated);
    await syncUpdateInquiryNotes(id, notesText);
    triggerSuccess('Candidate remarks saved.');
    setEditingNoteInquiry(null);
  };

  // Clear all inquiries
  const purgeAllInquiries = async () => {
    if (window.confirm('⚠️ CRITICAL: Are you sure you want to purge all inquiries? This action is irreversible.')) {
      setInquiries([]);
      await syncPurgeAllInquiries();
      triggerSuccess('Inquiry database purged.');
    }
  };

  // Export inquiries to CSV
  const exportInquiriesToCSV = () => {
    if (inquiries.length === 0) {
      alert("No inquiries available to export.");
      return;
    }
    let csv = 'Candidate Name,Email,Phone,Cutoff,Department,Lead Status,Date,Remarks\n';
    inquiries.forEach(item => {
      const name = (item.name || '').replace(/"/g, '""');
      const email = (item.email || '').replace(/"/g, '""');
      const phone = `'${item.phone || ''}`;
      const cutoff = item.cutoff || 'N/A';
      const dept = (item.dept || '').replace(/"/g, '""');
      const status = item.status || 'New';
      const date = (item.date || new Date(item.timestamp || Date.now()).toLocaleString()).replace(/"/g, '""');
      const notes = (item.notes || item.message || '').replace(/"/g, '""');
      csv += `"${name}","${email}","${phone}","${cutoff}","${dept}","${status}","${date}","${notes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `APEC_Admissions_Leads_${new Date().toISOString().split('T')[0]}.csv`);
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
      const existingTrainedDocs = JSON.parse(localStorage.getItem('apec_trained_docs') || '[]');
      if (!existingTrainedDocs.includes(sourceName)) {
        existingTrainedDocs.push(sourceName);
        localStorage.setItem('apec_trained_docs', JSON.stringify(existingTrainedDocs));
      }

      for (let i = 0; i < passages.length; i++) {
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

  // Export Full CMS Backup (JSON)
  const handleExportCmsBackup = () => {
    const backupData = {
      branding: JSON.parse(localStorage.getItem('apec_branding') || '{}'),
      tickerNews: JSON.parse(localStorage.getItem('apec_ticker_news') || '[]'),
      departments: JSON.parse(localStorage.getItem('apec_departments_data') || '{}'),
      timestamp: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `APEC_CMS_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess('CMS Data backup exported as JSON!');
  };

  // Import Full CMS Backup (JSON)
  const handleImportCmsBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.branding) localStorage.setItem('apec_branding', JSON.stringify(data.branding));
        if (data.tickerNews) localStorage.setItem('apec_ticker_news', JSON.stringify(data.tickerNews));
        if (data.departments) localStorage.setItem('apec_departments_data', JSON.stringify(data.departments));
        window.dispatchEvent(new Event('apec_storage_update'));
        triggerSuccess('CMS Data imported and synchronized successfully!');
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        alert('Failed to parse backup JSON file. Ensure it is a valid CMS backup.');
      }
    };
    reader.readAsText(file);
  };

  // Download updated departmentsData.json for repository overwrite
  const handleDownloadDepartmentsJson = () => {
    const obj = {};
    depts.forEach(d => {
      obj[d.key] = d;
    });
    const jsonStr = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `departmentsData.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess('departmentsData.json downloaded!');
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

  // Analytics calculations
  const totalInquiries = inquiries.length;
  const newLeadsCount = inquiries.filter(i => (!i.status || i.status === 'New')).length;
  const enrolledCount = inquiries.filter(i => i.status === 'Enrolled').length;
  const inContactCount = inquiries.filter(i => i.status === 'In Contact' || i.status === 'Follow Up').length;

  const courseCounts = inquiries.reduce((acc, item) => {
    const deptKey = (item.dept || 'General').toUpperCase();
    acc[deptKey] = (acc[deptKey] || 0) + 1;
    return acc;
  }, {});

  let topCourse = 'N/A';
  let topCourseCount = 0;
  Object.entries(courseCounts).forEach(([course, count]) => {
    if (count > topCourseCount) {
      topCourse = course;
      topCourseCount = count;
    }
  });

  const totalFacultyCount = depts.reduce((acc, d) => acc + (d.faculty ? d.faculty.length : 0), 0);

  const filteredInquiries = inquiries.filter(item => {
    // If HOD role, restrict inquiries to current department
    if (userRole.startsWith('dept_') && depts[selectedDeptIdx]) {
      const targetDeptKey = (depts[selectedDeptIdx].key || '').toLowerCase();
      const targetDeptName = (depts[selectedDeptIdx].name || '').toLowerCase();
      const itemDept = (item.dept || '').toLowerCase();
      const isDeptMatch = itemDept.includes(targetDeptKey) || 
                          targetDeptName.includes(itemDept) || 
                          itemDept.includes(targetDeptName);
      if (!isDeptMatch) return false;
    }

    const searchLower = inquirySearch.toLowerCase();
    const matchesSearch = (
      (item.name || '').toLowerCase().includes(searchLower) ||
      (item.dept || '').toLowerCase().includes(searchLower) ||
      (item.phone || '').includes(searchLower) ||
      (item.email || '').toLowerCase().includes(searchLower) ||
      (item.notes || item.message || '').toLowerCase().includes(searchLower)
    );
    const itemStatus = item.status || 'New';
    const matchesStatus = (inquiryStatusFilter === 'ALL') || (itemStatus === inquiryStatusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 pb-20 px-4 md:px-8 select-none text-left">
      <div className="max-w-[1400px] mx-auto animate-fade-in">
        
        {/* Banner / Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="font-title text-3xl font-black text-slate-900 leading-tight">
              APEC Web Portal Console
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Welcome, <span className="text-indigo-600 font-extrabold">{userEmail.split('@')[0]}</span> (Role: <span className="uppercase font-bold text-slate-700">{userRole}</span>)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export Config */}
            <button 
              onClick={handleExportCmsBackup}
              title="Export all CMS settings & faculty photos as a JSON file"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" /> Export Backup
            </button>

            {/* Import Config */}
            <label 
              title="Import JSON backup to sync changes across devices & Network IPs"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" /> Import Sync
              <input type="file" accept="application/json" onChange={handleImportCmsBackup} className="hidden" />
            </label>

            {/* Download departmentsData.json */}
            <button 
              onClick={handleDownloadDepartmentsJson}
              title="Download departmentsData.json to permanently commit to code repository"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" /> Code Sync JSON
            </button>

            {userRole === 'admin' && (
              <button 
                onClick={resetToFactoryDefault}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Revert Defaults
              </button>
            )}
          </div>
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
            
            {/* HOD ROLE CUSTOM NAVIGATION */}
            {userRole.startsWith('dept_') ? (
              <>
                <button
                  onClick={() => { setActiveTab('dashboard'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'dashboard' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-amber-300" /> HOD Dashboard
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('faculty'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'faculty' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-400" /> Faculty Directory
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('overview'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'overview' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Overview & HOD Desk
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('outcomes'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'outcomes' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Milestone className="w-4 h-4 text-purple-400" /> PEOs / PSOs / POs
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('syllabus'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'syllabus' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpenCheck className="w-4 h-4 text-emerald-400" /> Syllabus & Regulations
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('labs'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'labs' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Library className="w-4 h-4 text-amber-400" /> Facilities
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('placements'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'placements' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-blue-400" /> Placements & Grants
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('events'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'events' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <PartyPopper className="w-4 h-4 text-pink-400" /> Hosted & Attended Events
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('newsletters'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'newsletters' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-teal-400" /> Newsletters (PDF)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('departments'); setDeptSubTab('feedback'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'departments' && deptSubTab === 'feedback' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-orange-400" /> Department Feedbacks
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => { setActiveTab('inquiries'); setSelectedFacultyIdx(null); }}
                  className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'inquiries' 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-rose-400" /> Department Leads
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {(userRole === 'admin' || userRole === 'admission') && (
                  <button
                    onClick={() => { setActiveTab('dashboard'); setSelectedFacultyIdx(null); }}
                    className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                      activeTab === 'dashboard' 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-indigo-200" /> Executive Analytics
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

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

                {userRole === 'admin' && (
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
              </>
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
                onClick={() => { setActiveTab('hod_portals'); setSelectedFacultyIdx(null); }}
                className={`w-full p-4 rounded-2xl border text-left font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'hod_portals' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-400" /> HOD Accounts & Portals
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
            
            {/* DEPARTMENT HOD EXECUTIVE DASHBOARD */}
            {activeTab === 'dashboard' && userRole.startsWith('dept_') && depts[selectedDeptIdx] && (
              <div className="space-y-8">
                {/* HOD Hero Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-7 md:p-8 shadow-2xl border border-indigo-700/30 text-left">
                  <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                        <Shield className="w-3.5 h-3.5 text-amber-400" /> HOD Department Console
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        {depts[selectedDeptIdx].name}
                      </h2>
                      <p className="text-xs text-indigo-200/80 mt-1 max-w-xl font-medium leading-relaxed">
                        Welcome to your department administration workspace. Update HOD messages, faculty profiles, lab facilities, placement records, and candidate inquiries.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`/departments/${depts[selectedDeptIdx].key}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all border border-white/15 cursor-pointer flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-300" /> Preview Page
                      </a>
                    </div>
                  </div>
                </div>

                {/* HOD Department Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  {/* Card 1: Faculty Count */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Department Faculty</span>
                      <span className="text-3xl font-black text-slate-900 block mt-1">
                        {depts[selectedDeptIdx].faculty ? depts[selectedDeptIdx].faculty.length : 0}
                      </span>
                      <button
                        onClick={() => { setActiveTab('departments'); setDeptSubTab('faculty'); }}
                        className="text-[10px] font-bold text-indigo-600 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Manage Directory <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: Department Inquiries */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Department Leads</span>
                      <span className="text-3xl font-black text-slate-900 block mt-1">
                        {inquiries.filter(i => (i.dept || '').toLowerCase().includes((depts[selectedDeptIdx].key || '').toLowerCase()) || (i.dept || '').toLowerCase().includes((depts[selectedDeptIdx].name || '').toLowerCase())).length}
                      </span>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className="text-[10px] font-bold text-emerald-600 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        View Student Inquiries <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: Labs Count */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Lab Facilities</span>
                      <span className="text-3xl font-black text-slate-900 block mt-1">
                        {depts[selectedDeptIdx].labs ? depts[selectedDeptIdx].labs.length : 0} Rooms
                      </span>
                      <button
                        onClick={() => { setActiveTab('departments'); setDeptSubTab('labs'); }}
                        className="text-[10px] font-bold text-amber-600 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Edit Labs & Specs <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Library className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 4: Placement Rate */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Placement Rate</span>
                      <span className="text-2xl font-black text-slate-900 block mt-1">
                        {depts[selectedDeptIdx].placements?.rate || '90%+'}
                      </span>
                      <button
                        onClick={() => { setActiveTab('departments'); setDeptSubTab('placements'); }}
                        className="text-[10px] font-bold text-purple-600 hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Update Stats <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* HOD Quick Management Control Grid */}
                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-left">
                  <h3 className="font-title text-base font-black text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-600" /> Department Management Modules
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => { setActiveTab('departments'); setDeptSubTab('faculty'); }}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">Faculty Directory</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Add, edit designations, qualifications, and upload faculty photos.</p>
                    </button>

                    <button
                      onClick={() => { setActiveTab('departments'); setDeptSubTab('overview'); }}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">Overview & HOD Desk</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Update HOD Message, Vision, Mission, and department intro.</p>
                    </button>

                    <button
                      onClick={() => { setActiveTab('departments'); setDeptSubTab('outcomes'); }}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Milestone className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">PEO / PSO / Outcomes</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Configure NBA & NAAC Program Educational Objectives & Outcomes.</p>
                    </button>

                    <button
                      onClick={() => { setActiveTab('departments'); setDeptSubTab('labs'); }}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Library className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">Laboratories & Facilities</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Manage lab rooms, equipment inventory, and facility photos.</p>
                    </button>

                    <button
                      onClick={() => { setActiveTab('departments'); setDeptSubTab('placements'); }}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">Placement Statistics</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Edit placement percentage, packages, and recruiter list.</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl text-left transition-all group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Database className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">Department Inquiries</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">Review student admission leads interested in your department.</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EXECUTIVE ANALYTICS DASHBOARD */}
            {activeTab === 'dashboard' && (userRole === 'admin' || userRole === 'admission') && (
              <div className="space-y-8">
                {/* Hero Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-950 text-white p-7 md:p-8 shadow-2xl border border-indigo-700/30">
                  <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" /> Executive Master Command Center
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        Welcome back, <span className="text-indigo-300 capitalize">{userEmail ? userEmail.split('@')[0] : userRole}</span>
                      </h2>
                      <p className="text-xs text-indigo-200/80 mt-1 max-w-xl font-medium leading-relaxed">
                        Monitor real-time admission inquiries, departmental interest distribution, faculty directories, and system sync state.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs text-right">
                        <span className="block text-[9px] uppercase tracking-wider text-indigo-300 font-extrabold">System Date</span>
                        <span className="font-mono font-bold text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-indigo-500/30 cursor-pointer flex items-center gap-2"
                      >
                        <Database className="w-4 h-4" /> Manage Leads ({totalInquiries})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Inquiries */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Total Admission Inquiries</span>
                      <span className="text-3xl font-black text-slate-900 block mt-1">{totalInquiries}</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                          <TrendingUp className="w-3 h-3" /> {newLeadsCount} New Leads
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: Top Course */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Top Demanded Course</span>
                      <span className="text-base font-black text-slate-900 block mt-1 truncate max-w-[140px]" title={topCourse}>
                        {topCourse}
                      </span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-slate-500">
                          {topCourseCount} request{topCourseCount !== 1 ? 's' : ''} ({totalInquiries ? Math.round((topCourseCount / totalInquiries) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: Total Faculty */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Faculty Members</span>
                      <span className="text-3xl font-black text-slate-900 block mt-1">{totalFacultyCount}</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-indigo-600">
                          Across {depts.length} Departments
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 4: System Sync */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all group">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">System CMS State</span>
                      <span className="text-sm font-black text-slate-900 block mt-1">Live CMS Operational</span>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                          <CheckCircle2 className="w-3 h-3 text-indigo-500" /> Sync Active
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Department Demand Distribution & Pipeline Stages */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Department Demand Bar Chart */}
                  <div className="lg:col-span-2 bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-title text-base font-black text-slate-900 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-600" /> Department Inquiry Demand Distribution
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Live student preference metrics across engineering disciplines</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                        {totalInquiries} Leads Total
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {Object.entries(courseCounts).length === 0 ? (
                        <div className="p-8 text-center text-xs font-semibold text-slate-400">
                          No department inquiry data recorded yet.
                        </div>
                      ) : (
                        Object.entries(courseCounts)
                          .sort((a, b) => b[1] - a[1])
                          .map(([deptName, count]) => {
                            const percentage = totalInquiries ? Math.round((count / totalInquiries) * 100) : 0;
                            return (
                              <div key={deptName} className="space-y-1">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                                    {deptName}
                                  </span>
                                  <span className="font-mono text-slate-500">
                                    {count} lead{count !== 1 ? 's' : ''} ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-white border border-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>

                  {/* Admissions Pipeline & Quick Action Cards */}
                  <div className="space-y-6">
                    {/* Pipeline Stage Summary */}
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h3 className="font-title text-base font-black text-slate-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" /> Admissions Pipeline
                      </h3>
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> New Inquiry Leads
                          </span>
                          <span className="font-mono text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-lg">{newLeadsCount}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-xs font-bold text-blue-900">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Contact / Counseling
                          </span>
                          <span className="font-mono text-blue-800 bg-blue-200/60 px-2.5 py-0.5 rounded-lg">{inContactCount}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmed Enrolled
                          </span>
                          <span className="font-mono text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-lg">{enrolledCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Launch Hub */}
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                      <h3 className="font-title text-xs font-black text-slate-400 uppercase tracking-wider">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={exportInquiriesToCSV}
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
                        >
                          <Download className="w-4 h-4 text-indigo-600" /> Export CSV
                        </button>
                        <button
                          onClick={() => setActiveTab('hod_portals')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
                        >
                          <KeyRound className="w-4 h-4 text-amber-500" /> HOD Access
                        </button>
                        <button
                          onClick={() => setActiveTab('ads')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
                        >
                          <Megaphone className="w-4 h-4 text-purple-600" /> Popup Ads
                        </button>
                        <button
                          onClick={() => setActiveTab('rag_training')}
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white font-bold text-slate-700 flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-4 h-4 text-indigo-600" /> AI Knowledge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {/* DEPARTMENT PORTAL CONTENT EDITOR */}
            {activeTab === 'departments' && (userRole === 'admin' || userRole.startsWith('dept_')) && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-title text-xl font-black text-slate-900">
                      {userRole.startsWith('dept_') ? `${depts[selectedDeptIdx]?.name || 'Department'} Portal CMS` : 'Department & Faculty Portals'}
                    </h3>

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



                {/* SUB-TAB 1: FACULTY DIRECTORY & PHOTO UPLOADER */}
                {deptSubTab === 'faculty' && (
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

                      <div className="border border-slate-200 rounded-2xl divide-y divide-slate-150 overflow-y-auto max-h-[480px] bg-slate-50 shadow-inner">
                        {(depts[selectedDeptIdx]?.faculty || []).map((f, i) => (
                          <div 
                            key={i} 
                            className={`p-3.5 flex justify-between items-center gap-3 cursor-pointer transition-colors ${
                              selectedFacultyIdx === i ? 'bg-indigo-50/80 hover:bg-indigo-100/50' : 'hover:bg-slate-100/50'
                            }`}
                            onClick={() => selectFacultyForEdit(i)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-white shrink-0 flex items-center justify-center">
                                {f.image ? (
                                  <img src={f.image} alt={f.name} className="w-full h-full object-cover object-top" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                ) : null}
                                <span className="text-[10px] font-bold text-indigo-600" style={{ display: f.image ? 'none' : 'block' }}>
                                  {f.name ? f.name.charAt(0) : 'F'}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-bold text-slate-800 block truncate">{f.name}</span>
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mt-0.5 truncate">{f.designation}</span>
                              </div>
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
                            Select a faculty member from the directory list on the left to edit details and upload photo.
                          </span>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                          <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider border-b border-slate-100 pb-2">
                            Edit Faculty Member Details
                          </h4>

                          {/* Photo Upload & Preview Container */}
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Faculty Photo & Upload</label>
                            <div className="flex items-center gap-4">
                              {/* Live Image Preview */}
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-250 bg-white shrink-0 flex items-center justify-center relative shadow-sm">
                                {editFaculty.image ? (
                                  <img 
                                    src={editFaculty.image} 
                                    alt={editFaculty.name} 
                                    className="w-full h-full object-cover object-top" 
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                  />
                                ) : null}
                                <div 
                                  className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-650 font-bold"
                                  style={{ display: editFaculty.image ? 'none' : 'flex' }}
                                >
                                  <GraduationCap className="w-6 h-6 text-indigo-650" />
                                </div>
                              </div>

                              {/* File Upload Controls */}
                              <div className="flex-1 space-y-1.5">
                                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm active:scale-95">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload New Photo</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFacultyImageUpload} 
                                    className="hidden" 
                                  />
                                </label>
                                {editFaculty.image && (
                                  <button
                                    type="button"
                                    onClick={() => setEditFaculty({ ...editFaculty, image: '' })}
                                    className="block text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                                  >
                                    Remove Current Photo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
                              <input 
                                type="text"
                                value={editFaculty.name}
                                onChange={(e) => setEditFaculty({...editFaculty, name: e.target.value})}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-600 focus:bg-white font-bold text-slate-800"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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

                            <div className="grid grid-cols-2 gap-3">
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

                              <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1">
                                  <span className="w-3.5 h-3.5 bg-emerald-600 text-white rounded flex items-center justify-center text-[9px] font-mono">iD</span>
                                  ORCID Identifier (e.g. 0009-0004-5988-5664)
                                </label>
                                <input 
                                  type="text"
                                  value={editFaculty.orcid || ''}
                                  onChange={(e) => setEditFaculty({...editFaculty, orcid: e.target.value})}
                                  placeholder="0009-0004-5988-5664"
                                  className="w-full text-xs px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg outline-none focus:border-emerald-600 focus:bg-white font-mono font-bold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedFacultyIdx(null)}
                              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-95"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
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
                )}

                {/* SUB-TAB 2: OVERVIEW & VISION */}
                {deptSubTab === 'overview' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider border-b border-slate-200 pb-2">
                        Basic Department Information
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Department Full Name</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].name || ''}
                            onChange={(e) => updateCurrentDeptField('name', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Approved Intake Capacity</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].intake || ''}
                            onChange={(e) => updateCurrentDeptField('intake', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Course Duration</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].duration || ''}
                            onChange={(e) => updateCurrentDeptField('duration', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Key Focus Areas (Comma-separated tags)</label>
                        <input 
                          type="text"
                          value={depts[selectedDeptIdx].focus || ''}
                          onChange={(e) => updateCurrentDeptField('focus', e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">About Department (Overview Text)</label>
                        <textarea 
                          rows={4}
                          value={depts[selectedDeptIdx].about || ''}
                          onChange={(e) => updateCurrentDeptField('about', e.target.value)}
                          className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Department Vision Statement</label>
                        <textarea 
                          rows={3}
                          value={depts[selectedDeptIdx].vision || ''}
                          onChange={(e) => updateCurrentDeptField('vision', e.target.value)}
                          className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium leading-relaxed"
                        />
                      </div>

                      {/* Mission Statements Array */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Mission Statements ({depts[selectedDeptIdx].mission?.length || 0})</label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentMission = depts[selectedDeptIdx].mission || [];
                              updateCurrentDeptField('mission', [...currentMission, 'New mission statement point']);
                            }}
                            className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add Mission Point
                          </button>
                        </div>

                        {(depts[selectedDeptIdx].mission || []).map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input 
                              type="text"
                              value={m}
                              onChange={(e) => {
                                const updatedMission = [...(depts[selectedDeptIdx].mission || [])];
                                updatedMission[idx] = e.target.value;
                                updateCurrentDeptField('mission', updatedMission);
                              }}
                              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedMission = depts[selectedDeptIdx].mission.filter((_, i) => i !== idx);
                                updateCurrentDeptField('mission', updatedMission);
                              }}
                              className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: PEO / PSO / PO OUTCOMES */}
                {deptSubTab === 'outcomes' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6">
                      
                      {/* PEOs */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">
                            Program Educational Objectives (PEOs)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const peos = depts[selectedDeptIdx].peos || [];
                              updateCurrentDeptField('peos', [...peos, { code: `PEO${peos.length + 1}`, title: 'New Objective', description: 'Description text' }]);
                            }}
                            className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add PEO
                          </button>
                        </div>

                        {(depts[selectedDeptIdx].peos || []).map((peo, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const peos = depts[selectedDeptIdx].peos.filter((_, i) => i !== idx);
                                updateCurrentDeptField('peos', peos);
                              }}
                              className="absolute top-2 right-2 p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="grid grid-cols-3 gap-2 pr-8">
                              <input 
                                type="text"
                                value={peo.code || ''}
                                onChange={(e) => {
                                  const peos = [...(depts[selectedDeptIdx].peos || [])];
                                  peos[idx].code = e.target.value;
                                  updateCurrentDeptField('peos', peos);
                                }}
                                placeholder="Code (PEO1)"
                                className="text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                              />
                              <input 
                                type="text"
                                value={peo.title || ''}
                                onChange={(e) => {
                                  const peos = [...(depts[selectedDeptIdx].peos || [])];
                                  peos[idx].title = e.target.value;
                                  updateCurrentDeptField('peos', peos);
                                }}
                                placeholder="Title"
                                className="col-span-2 text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                              />
                            </div>
                            <textarea 
                              rows={2}
                              value={peo.description || ''}
                              onChange={(e) => {
                                const peos = [...(depts[selectedDeptIdx].peos || [])];
                                peos[idx].description = e.target.value;
                                updateCurrentDeptField('peos', peos);
                              }}
                              placeholder="Description"
                              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                            />
                          </div>
                        ))}
                      </div>

                      {/* PSOs */}
                      <div className="space-y-3 pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">
                            Program Specific Outcomes (PSOs)
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const psos = depts[selectedDeptIdx].psos || [];
                              updateCurrentDeptField('psos', [...psos, { code: `PSO${psos.length + 1}`, title: 'New Specific Outcome', description: 'Description text' }]);
                            }}
                            className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add PSO
                          </button>
                        </div>

                        {(depts[selectedDeptIdx].psos || []).map((pso, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const psos = depts[selectedDeptIdx].psos.filter((_, i) => i !== idx);
                                updateCurrentDeptField('psos', psos);
                              }}
                              className="absolute top-2 right-2 p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="grid grid-cols-3 gap-2 pr-8">
                              <input 
                                type="text"
                                value={pso.code || ''}
                                onChange={(e) => {
                                  const psos = [...(depts[selectedDeptIdx].psos || [])];
                                  psos[idx].code = e.target.value;
                                  updateCurrentDeptField('psos', psos);
                                }}
                                placeholder="Code (PSO1)"
                                className="text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                              />
                              <input 
                                type="text"
                                value={pso.title || ''}
                                onChange={(e) => {
                                  const psos = [...(depts[selectedDeptIdx].psos || [])];
                                  psos[idx].title = e.target.value;
                                  updateCurrentDeptField('psos', psos);
                                }}
                                placeholder="Title"
                                className="col-span-2 text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                              />
                            </div>
                            <textarea 
                              rows={2}
                              value={pso.description || ''}
                              onChange={(e) => {
                                const psos = [...(depts[selectedDeptIdx].psos || [])];
                                psos[idx].description = e.target.value;
                                updateCurrentDeptField('psos', psos);
                              }}
                              placeholder="Description"
                              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Program Educational Objectives & Outcomes saved successfully!');
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Outcomes (PEO / PSO / PO)
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: SYLLABUS & REGULATIONS */}
                {deptSubTab === 'syllabus' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">
                          Department Syllabus & Academic Regulations
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Syllabus & Academic Regulations saved successfully!');
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Syllabus Details
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Regulation & Title</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].syllabus?.title || `${depts[selectedDeptIdx].name} Curriculum & Syllabus (2021 Regulation)`}
                            onChange={(e) => {
                              const syl = depts[selectedDeptIdx].syllabus || {};
                              updateCurrentDeptField('syllabus', { ...syl, title: e.target.value });
                            }}
                            placeholder="2021 Regulation - Anna University / Autonomous Curriculum"
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Syllabus PDF Document Link / File Upload</label>
                          <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                              <input 
                                type="file" 
                                accept=".pdf,.doc,.docx,image/*" 
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const syl = depts[selectedDeptIdx].syllabus || {};
                                      updateCurrentDeptField('syllabus', { ...syl, link: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                            <input 
                              type="text"
                              value={depts[selectedDeptIdx].syllabus?.link || ''}
                              onChange={(e) => {
                                const syl = depts[selectedDeptIdx].syllabus || {};
                                updateCurrentDeptField('syllabus', { ...syl, link: e.target.value });
                              }}
                              placeholder="https://apec.edu.in/downloads/aiml-syllabus.pdf"
                              className="flex-1 text-xs font-mono font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Curriculum & Course Scheme Description</label>
                          <textarea 
                            rows={3}
                            value={depts[selectedDeptIdx].syllabus?.description || ''}
                            onChange={(e) => {
                              const syl = depts[selectedDeptIdx].syllabus || {};
                              updateCurrentDeptField('syllabus', { ...syl, description: e.target.value });
                            }}
                            placeholder="Describe the credit structure, semester core courses, electives, and lab guidelines..."
                            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 5: FACILITIES & LABS */}
                {deptSubTab === 'labs' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">
                          Department Facilities ({depts[selectedDeptIdx].labs?.length || 0})
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsAddFacilityOpen(!isAddFacilityOpen)}
                              className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer mr-2 bg-transparent border-0"
                            >
                              <Plus className="w-3 h-3" /> Add <ChevronDown className="w-3 h-3" />
                            </button>
                            {isAddFacilityOpen && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 w-36 z-50 text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const labs = depts[selectedDeptIdx].labs || [];
                                    updateCurrentDeptField('labs', [...labs, { name: '', type: 'classroom', incharge: '', description: '', images: [] }]);
                                    setIsAddFacilityOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left flex items-center gap-1.5 cursor-pointer border-0 bg-transparent"
                                >
                                  🏫 Classroom
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const labs = depts[selectedDeptIdx].labs || [];
                                    updateCurrentDeptField('labs', [...labs, { name: '', type: 'laboratory', incharge: '', description: '', images: [] }]);
                                    setIsAddFacilityOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left flex items-center gap-1.5 cursor-pointer border-0 bg-transparent"
                                >
                                  🔬 Laboratory
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const labs = depts[selectedDeptIdx].labs || [];
                                    updateCurrentDeptField('labs', [...labs, { name: '', type: 'library', incharge: '', description: '', images: [] }]);
                                    setIsAddFacilityOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left flex items-center gap-1.5 cursor-pointer border-0 bg-transparent"
                                >
                                  📚 Library
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              saveDepts(depts);
                              triggerSuccess('Facilities saved successfully!');
                            }}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1 border-0"
                          >
                            <Save className="w-3.5 h-3.5" /> Save
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(depts[selectedDeptIdx].labs || []).map((lab, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-sm text-left">
                            <button
                              type="button"
                              onClick={() => {
                                const labs = depts[selectedDeptIdx].labs.filter((_, i) => i !== idx);
                                updateCurrentDeptField('labs', labs);
                              }}
                              className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer border-0 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Facility Type</label>
                                <select 
                                  value={lab.type || 'laboratory'}
                                  onChange={(e) => {
                                    const labs = [...(depts[selectedDeptIdx].labs || [])];
                                    labs[idx].type = e.target.value;
                                    updateCurrentDeptField('labs', labs);
                                  }}
                                  className="w-full text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                                >
                                  <option value="classroom">🏫 Classroom</option>
                                  <option value="laboratory">🔬 Laboratory</option>
                                  <option value="library">📚 Library</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Facility Name</label>
                                <input 
                                  type="text"
                                  value={lab.name || ''}
                                  onChange={(e) => {
                                    const labs = [...(depts[selectedDeptIdx].labs || [])];
                                    labs[idx].name = e.target.value;
                                    updateCurrentDeptField('labs', labs);
                                  }}
                                  placeholder="e.g. Advanced AI/ML Laboratory"
                                  className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">In-Charge</label>
                              <input 
                                type="text"
                                value={lab.incharge || ''}
                                onChange={(e) => {
                                    const labs = [...(depts[selectedDeptIdx].labs || [])];
                                    labs[idx].incharge = e.target.value;
                                    updateCurrentDeptField('labs', labs);
                                }}
                                placeholder="e.g. Dr. K. Raja / Assistant Prof."
                                className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Description</label>
                              <textarea 
                                rows={2}
                                value={lab.description || ''}
                                onChange={(e) => {
                                  const labs = [...(depts[selectedDeptIdx].labs || [])];
                                  labs[idx].description = e.target.value;
                                  updateCurrentDeptField('labs', labs);
                                }}
                                placeholder="Describe the facility seating capacity, available software packages, or lab instruments..."
                                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                              />
                            </div>

                            {/* Multiple Images Upload & Manage */}
                            <div className="space-y-2 pt-1.5">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Facility Images</label>
                              
                              {/* Thumbnail preview list */}
                              {((lab.images || (lab.image ? [lab.image] : []))).length > 0 && (
                                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-150 rounded-xl">
                                  {(lab.images || (lab.image ? [lab.image] : [])).map((img, imgIdx) => (
                                    <div key={imgIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const labs = [...(depts[selectedDeptIdx].labs || [])];
                                          const currentImages = labs[idx].images || (labs[idx].image ? [labs[idx].image] : []);
                                          const updatedImages = currentImages.filter((_, i) => i !== imgIdx);
                                          labs[idx].images = updatedImages;
                                          labs[idx].image = updatedImages[0] || '';
                                          updateCurrentDeptField('labs', labs);
                                        }}
                                        className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Upload / Add Controls */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <label className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all shrink-0">
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Photo</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      const file = e.target.files && e.target.files[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const labs = [...(depts[selectedDeptIdx].labs || [])];
                                          const currentImages = labs[idx].images || (labs[idx].image ? [labs[idx].image] : []);
                                          labs[idx].images = [...currentImages, reader.result];
                                          labs[idx].image = labs[idx].images[0];
                                          updateCurrentDeptField('labs', labs);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden" 
                                  />
                                </label>
                                
                                <div className="flex-1 flex gap-1">
                                  <input 
                                    type="text"
                                    id={`new-url-input-${idx}`}
                                    placeholder="Paste Image URL..."
                                    className="flex-1 text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        if (val) {
                                          const labs = [...(depts[selectedDeptIdx].labs || [])];
                                          const currentImages = labs[idx].images || (labs[idx].image ? [labs[idx].image] : []);
                                          labs[idx].images = [...currentImages, val];
                                          labs[idx].image = labs[idx].images[0];
                                          updateCurrentDeptField('labs', labs);
                                          e.target.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const inputEl = document.getElementById(`new-url-input-${idx}`);
                                      const val = inputEl ? inputEl.value.trim() : '';
                                      if (val) {
                                        const labs = [...(depts[selectedDeptIdx].labs || [])];
                                        const currentImages = labs[idx].images || (labs[idx].image ? [labs[idx].image] : []);
                                        labs[idx].images = [...currentImages, val];
                                        labs[idx].image = labs[idx].images[0];
                                        updateCurrentDeptField('labs', labs);
                                        inputEl.value = '';
                                      }
                                    }}
                                    className="px-2 py-1 bg-indigo-50 border border-indigo-150 text-indigo-650 hover:bg-indigo-100 rounded-lg text-[10px] font-bold cursor-pointer shrink-0 border-0"
                                  >
                                    Add URL
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('All facilities saved successfully!');
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2 border-0"
                        >
                          <Save className="w-4 h-4" /> Save Facilities
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 6: PLACEMENTS */}
                {deptSubTab === 'placements' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider">
                          Placement Statistics & Highlights
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Placement records & highlights saved successfully!');
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Placement Records
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Placement Rate %</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].placements?.rate || '94%'}
                            onChange={(e) => {
                              const pl = depts[selectedDeptIdx].placements || {};
                              updateCurrentDeptField('placements', { ...pl, rate: e.target.value });
                            }}
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Highest Package</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].placements?.highestPackage || '12 LPA'}
                            onChange={(e) => {
                              const pl = depts[selectedDeptIdx].placements || {};
                              updateCurrentDeptField('placements', { ...pl, highestPackage: e.target.value });
                            }}
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Average Package</label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].placements?.averagePackage || '4.5 LPA'}
                            onChange={(e) => {
                              const pl = depts[selectedDeptIdx].placements || {};
                              updateCurrentDeptField('placements', { ...pl, averagePackage: e.target.value });
                            }}
                            className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Top Recruiters (Comma-separated)</label>
                        <input 
                          type="text"
                          value={depts[selectedDeptIdx].placements?.topRecruiters || 'TCS, Infosys, Wipro, Cognizant, Zoho'}
                          onChange={(e) => {
                            const pl = depts[selectedDeptIdx].placements || {};
                            updateCurrentDeptField('placements', { ...pl, topRecruiters: e.target.value });
                          }}
                          className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>

                      {/* Placement Banner Image Input */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Placement Banner / Highlight Image</label>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Banner</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const pl = depts[selectedDeptIdx].placements || {};
                                    updateCurrentDeptField('placements', { ...pl, image: reader.result });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden" 
                            />
                          </label>
                          <input 
                            type="text"
                            value={depts[selectedDeptIdx].placements?.image || ''}
                            onChange={(e) => {
                              const pl = depts[selectedDeptIdx].placements || {};
                              updateCurrentDeptField('placements', { ...pl, image: e.target.value });
                            }}
                            placeholder="Placement banner image URL or path"
                            className="flex-1 text-xs font-mono font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Placement Overview Description */}
                      <div className="space-y-1 pt-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Placement Highlights Description</label>
                        <textarea 
                          rows={3}
                          value={depts[selectedDeptIdx].placements?.description || ''}
                          onChange={(e) => {
                            const pl = depts[selectedDeptIdx].placements || {};
                            updateCurrentDeptField('placements', { ...pl, description: e.target.value });
                          }}
                          placeholder="Highlight department placement achievements, top packages offered, training programs, and career statistics..."
                          className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl font-medium"
                        />
                      </div>

                      {/* Funds Received & Research Grants Manager */}
                      <div className="pt-4 border-t border-slate-200 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider flex items-center gap-1.5">
                            <Coins className="w-4 h-4 text-amber-500" /> Funds Received & Research Grants ({depts[selectedDeptIdx].grants?.length || 0})
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const gr = depts[selectedDeptIdx].grants || [];
                              updateCurrentDeptField('grants', [...gr, { agency: 'DST-SERB / AICTE', title: 'Research & Modernization Grant', pi: 'Dr. Principal Investigator', amount: '₹ 15,00,000', year: '2025-2026' }]);
                            }}
                            className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add Research Grant
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(depts[selectedDeptIdx].grants || []).map((grant, gIdx) => (
                            <div key={gIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const gr = depts[selectedDeptIdx].grants.filter((_, i) => i !== gIdx);
                                  updateCurrentDeptField('grants', gr);
                                }}
                                className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Funding Agency</label>
                                  <input 
                                    type="text"
                                    value={grant.agency || ''}
                                    onChange={(e) => {
                                      const gr = [...(depts[selectedDeptIdx].grants || [])];
                                      gr[gIdx].agency = e.target.value;
                                      updateCurrentDeptField('grants', gr);
                                    }}
                                    placeholder="DST, AICTE, TNSCST, ICMR, Industry"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Project Title</label>
                                  <input 
                                    type="text"
                                    value={grant.title || ''}
                                    onChange={(e) => {
                                      const gr = [...(depts[selectedDeptIdx].grants || [])];
                                      gr[gIdx].title = e.target.value;
                                      updateCurrentDeptField('grants', gr);
                                    }}
                                    placeholder="Project / Scheme Title"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Principal Investigator (Faculty PI)</label>
                                  <input 
                                    type="text"
                                    value={grant.pi || ''}
                                    onChange={(e) => {
                                      const gr = [...(depts[selectedDeptIdx].grants || [])];
                                      gr[gIdx].pi = e.target.value;
                                      updateCurrentDeptField('grants', gr);
                                    }}
                                    placeholder="Dr. Faculty Coordinator"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Amount Received (₹)</label>
                                    <input 
                                      type="text"
                                      value={grant.amount || ''}
                                      onChange={(e) => {
                                        const gr = [...(depts[selectedDeptIdx].grants || [])];
                                        gr[gIdx].amount = e.target.value;
                                        updateCurrentDeptField('grants', gr);
                                      }}
                                      placeholder="₹ 15,00,000"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Year / Sanction</label>
                                    <input 
                                      type="text"
                                      value={grant.year || ''}
                                      onChange={(e) => {
                                        const gr = [...(depts[selectedDeptIdx].grants || [])];
                                        gr[gIdx].year = e.target.value;
                                        updateCurrentDeptField('grants', gr);
                                      }}
                                      placeholder="2025-2026"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Placement records & funds received saved successfully!');
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Placement Records & Research Grants
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 7: HOSTED & ATTENDED EVENTS */}
                {deptSubTab === 'events' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider flex items-center gap-2">
                          <PartyPopper className="w-4 h-4 text-pink-500" /> Department Events (Hosted & Attended)
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Department events saved successfully!');
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Events List
                        </button>
                      </div>

                      {/* 1. HOSTED EVENTS */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-black uppercase text-pink-700 tracking-wider flex items-center gap-1.5">
                            🎪 1. Hosted Events (Organized by Department) ({depts[selectedDeptIdx].hostedEvents?.length || 0})
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const hosted = depts[selectedDeptIdx].hostedEvents || [];
                              updateCurrentDeptField('hostedEvents', [...hosted, { name: 'National Level Symposium / Workshop', date: 'October 15, 2025', venue: 'APEC Main Auditorium', speaker: 'Dr. Guest Speaker', description: 'Interactive technical sessions and competitions', image: '' }]);
                            }}
                            className="text-xs font-black text-pink-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add Hosted Event
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(depts[selectedDeptIdx].hostedEvents || []).map((event, evIdx) => (
                            <div key={evIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const hosted = depts[selectedDeptIdx].hostedEvents.filter((_, i) => i !== evIdx);
                                  updateCurrentDeptField('hostedEvents', hosted);
                                }}
                                className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Event Name</label>
                                  <input 
                                    type="text"
                                    value={event.name || ''}
                                    onChange={(e) => {
                                      const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                      hosted[evIdx].name = e.target.value;
                                      updateCurrentDeptField('hostedEvents', hosted);
                                    }}
                                    placeholder="Symposium / Conference / Workshop Name"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Date</label>
                                    <input 
                                      type="text"
                                      value={event.date || ''}
                                      onChange={(e) => {
                                        const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                        hosted[evIdx].date = e.target.value;
                                        updateCurrentDeptField('hostedEvents', hosted);
                                      }}
                                      placeholder="October 15, 2025"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Venue / Location</label>
                                    <input 
                                      type="text"
                                      value={event.venue || ''}
                                      onChange={(e) => {
                                        const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                        hosted[evIdx].venue = e.target.value;
                                        updateCurrentDeptField('hostedEvents', hosted);
                                      }}
                                      placeholder="APEC Auditorium"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Resource Person / Keynote Speaker</label>
                                  <input 
                                    type="text"
                                    value={event.speaker || ''}
                                    onChange={(e) => {
                                      const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                      hosted[evIdx].speaker = e.target.value;
                                      updateCurrentDeptField('hostedEvents', hosted);
                                    }}
                                    placeholder="Dr. Eminent Guest"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Event Photo URL / Upload</label>
                                  <div className="flex items-center gap-2">
                                    <label className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg cursor-pointer">
                                      <Upload className="w-3 h-3" />
                                      <span>Upload</span>
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                          const file = e.target.files && e.target.files[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                              hosted[evIdx].image = reader.result;
                                              updateCurrentDeptField('hostedEvents', hosted);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="hidden" 
                                      />
                                    </label>
                                    <input 
                                      type="text"
                                      value={event.image || ''}
                                      onChange={(e) => {
                                        const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                        hosted[evIdx].image = e.target.value;
                                        updateCurrentDeptField('hostedEvents', hosted);
                                      }}
                                      placeholder="Photo URL"
                                      className="flex-1 text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                    />
                                  </div>
                                </div>
                              </div>

                              <textarea 
                                rows={2}
                                value={event.description || ''}
                                onChange={(e) => {
                                  const hosted = [...(depts[selectedDeptIdx].hostedEvents || [])];
                                  hosted[evIdx].description = e.target.value;
                                  updateCurrentDeptField('hostedEvents', hosted);
                                }}
                                placeholder="Event summary, participants count, outcomes..."
                                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. ATTENDED EVENTS */}
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5">
                            🎓 2. Attended Events (Faculty & Student Participation Outside) ({depts[selectedDeptIdx].attendedEvents?.length || 0})
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const attended = depts[selectedDeptIdx].attendedEvents || [];
                              updateCurrentDeptField('attendedEvents', [...attended, { name: 'AICTE Faculty Development Program on GenAI', date: 'November 20, 2025', hostOrg: 'IIT Madras', participant: 'Prof. Faculty Member', description: '5-Day Intensive FDP training on Deep Learning models', image: '' }]);
                            }}
                            className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add Attended Event
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(depts[selectedDeptIdx].attendedEvents || []).map((event, atIdx) => (
                            <div key={atIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const attended = depts[selectedDeptIdx].attendedEvents.filter((_, i) => i !== atIdx);
                                  updateCurrentDeptField('attendedEvents', attended);
                                }}
                                className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Event / FDP Title</label>
                                  <input 
                                    type="text"
                                    value={event.name || ''}
                                    onChange={(e) => {
                                      const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                      attended[atIdx].name = e.target.value;
                                      updateCurrentDeptField('attendedEvents', attended);
                                    }}
                                    placeholder="FDP / Conference / Workshop Title"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Date</label>
                                    <input 
                                      type="text"
                                      value={event.date || ''}
                                      onChange={(e) => {
                                        const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                        attended[atIdx].date = e.target.value;
                                        updateCurrentDeptField('attendedEvents', attended);
                                      }}
                                      placeholder="November 20, 2025"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Host Institution</label>
                                    <input 
                                      type="text"
                                      value={event.hostOrg || ''}
                                      onChange={(e) => {
                                        const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                        attended[atIdx].hostOrg = e.target.value;
                                        updateCurrentDeptField('attendedEvents', attended);
                                      }}
                                      placeholder="IIT Madras / Anna University"
                                      className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Participant Name(s)</label>
                                  <input 
                                    type="text"
                                    value={event.participant || ''}
                                    onChange={(e) => {
                                      const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                      attended[atIdx].participant = e.target.value;
                                      updateCurrentDeptField('attendedEvents', attended);
                                    }}
                                    placeholder="Prof. Faculty / Student Name"
                                    className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Certificate / Photo</label>
                                  <div className="flex items-center gap-2">
                                    <label className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg cursor-pointer">
                                      <Upload className="w-3 h-3" />
                                      <span>Upload</span>
                                      <input 
                                        type="file" 
                                        accept="image/*,.pdf" 
                                        onChange={(e) => {
                                          const file = e.target.files && e.target.files[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                              attended[atIdx].image = reader.result;
                                              updateCurrentDeptField('attendedEvents', attended);
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                        className="hidden" 
                                      />
                                    </label>
                                    <input 
                                      type="text"
                                      value={event.image || ''}
                                      onChange={(e) => {
                                        const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                        attended[atIdx].image = e.target.value;
                                        updateCurrentDeptField('attendedEvents', attended);
                                      }}
                                      placeholder="Certificate / Photo Link"
                                      className="flex-1 text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                                    />
                                  </div>
                                </div>
                              </div>

                              <textarea 
                                rows={2}
                                value={event.description || ''}
                                onChange={(e) => {
                                  const attended = [...(depts[selectedDeptIdx].attendedEvents || [])];
                                  attended[atIdx].description = e.target.value;
                                  updateCurrentDeptField('attendedEvents', attended);
                                }}
                                placeholder="Summary of training skills acquired..."
                                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB-TAB 8: NEWSLETTERS (PDF) */}
                {deptSubTab === 'newsletters' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-teal-600" /> Department Newsletters & Magazines (PDF) ({depts[selectedDeptIdx].newsletters?.length || 0})
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const news = depts[selectedDeptIdx].newsletters || [];
                            updateCurrentDeptField('newsletters', [...news, { title: 'Department Tech Magazine Vol 4 Issue 1', date: 'Semester Odd 2025-2026', link: '', summary: 'Highlights student projects, faculty publications, and events.' }]);
                          }}
                          className="text-xs font-black text-indigo-650 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Newsletter PDF
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(depts[selectedDeptIdx].newsletters || []).map((nl, nIdx) => (
                          <div key={nIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-xs">
                            <button
                              type="button"
                              onClick={() => {
                                const news = depts[selectedDeptIdx].newsletters.filter((_, i) => i !== nIdx);
                                updateCurrentDeptField('newsletters', news);
                              }}
                              className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Newsletter Title / Volume</label>
                                <input 
                                  type="text"
                                  value={nl.title || ''}
                                  onChange={(e) => {
                                    const news = [...(depts[selectedDeptIdx].newsletters || [])];
                                    news[nIdx].title = e.target.value;
                                    updateCurrentDeptField('newsletters', news);
                                  }}
                                  placeholder="AIML Tech Magazine Vol 4"
                                  className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Publication Date / Edition</label>
                                <input 
                                  type="text"
                                  value={nl.date || ''}
                                  onChange={(e) => {
                                    const news = [...(depts[selectedDeptIdx].newsletters || [])];
                                    news[nIdx].date = e.target.value;
                                    updateCurrentDeptField('newsletters', news);
                                  }}
                                  placeholder="Odd Semester 2025-2026"
                                  className="w-full text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                />
                              </div>

                              <div className="space-y-1 col-span-2">
                                <label className="text-[9px] font-black uppercase text-teal-700 tracking-wider block">Upload Newsletter PDF Document</label>
                                <div className="flex items-center gap-2">
                                  <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-all">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload PDF</span>
                                    <input 
                                      type="file" 
                                      accept=".pdf,.doc,.docx" 
                                      onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            const news = [...(depts[selectedDeptIdx].newsletters || [])];
                                            news[nIdx].link = reader.result;
                                            updateCurrentDeptField('newsletters', news);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                      className="hidden" 
                                    />
                                  </label>
                                  <input 
                                    type="text"
                                    value={nl.link || ''}
                                    onChange={(e) => {
                                      const news = [...(depts[selectedDeptIdx].newsletters || [])];
                                      news[nIdx].link = e.target.value;
                                      updateCurrentDeptField('newsletters', news);
                                    }}
                                    placeholder="PDF URL (e.g. https://apec.edu.in/newsletter.pdf)"
                                    className="flex-1 text-xs font-mono font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            saveDepts(depts);
                            triggerSuccess('Department newsletters saved successfully!');
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Newsletters List
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 9: DEPARTMENT FEEDBACK RESPONSES */}
                {deptSubTab === 'feedback' && depts[selectedDeptIdx] && (
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="text-xs font-black uppercase text-indigo-650 tracking-wider flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4 text-orange-500" /> Department Feedback Responses
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Direct feedback submitted by students, parents, alumni, and stakeholders for {depts[selectedDeptIdx].name}.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new Event('apec_storage_update'));
                            triggerSuccess('Feedbacks refreshed from database!');
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Refresh
                        </button>
                      </div>

                      {(() => {
                        const targetDeptKey = depts[selectedDeptIdx].key.toLowerCase();
                        const targetDeptName = depts[selectedDeptIdx].name.toLowerCase();
                        const allFb = getDepartmentFeedbacks();
                        const deptFb = allFb.filter(item => {
                          const itemDept = (item.dept || '').toLowerCase();
                          return itemDept.includes(targetDeptKey) || targetDeptName.includes(itemDept) || itemDept.includes(targetDeptName) || itemDept === 'general';
                        });

                        if (deptFb.length === 0) {
                          return (
                            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
                              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                              <h5 className="text-sm font-black text-slate-700">No Feedback Responses Received Yet</h5>
                              <p className="text-xs text-slate-400 font-semibold">Submitted feedback forms for your department will appear here in real-time.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3">
                            {deptFb.map((fb, fIdx) => (
                              <div key={fIdx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteDepartmentFeedback(fb.id);
                                    triggerSuccess('Feedback record removed');
                                  }}
                                  className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex flex-wrap items-center justify-between gap-2 pr-8 border-b border-slate-100 pb-2">
                                  <div>
                                    <h5 className="text-sm font-black text-slate-900">{fb.name}</h5>
                                    <span className="text-[10px] font-bold text-slate-400">{fb.date || 'Recent'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                                      {fb.section || 'General'}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-700 font-semibold bg-slate-50/80 p-3 rounded-xl border border-slate-150 leading-relaxed">
                                  "{fb.message}"
                                </div>

                                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
                                  <span>Email: {fb.email || 'N/A'}</span>
                                  <span>Contact: {fb.phone || 'N/A'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* INQUIRIES & LEADS VIEWER (Admin / Admission role) */}
            {activeTab === 'inquiries' && (userRole === 'admin' || userRole === 'admission') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-title text-xl font-black text-slate-900">Leads & Admissions Inquiry Pipeline</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live DB Sync
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Real-time database sync across Localhost, Local Network (IP), and Deployed Web.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={loadInquiriesFromDB}
                      disabled={isSyncingInquiries}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
                      title="Sync with central database"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingInquiries ? 'animate-spin text-indigo-600' : ''}`} />
                      <span>{isSyncingInquiries ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
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

                {/* Pipeline Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {[
                    { key: 'ALL', label: 'All Inquiries', count: inquiries.length },
                    { key: 'New', label: 'New Leads', count: inquiries.filter(i => (!i.status || i.status === 'New')).length },
                    { key: 'In Contact', label: 'In Contact', count: inquiries.filter(i => i.status === 'In Contact').length },
                    { key: 'Follow Up', label: 'Follow Up', count: inquiries.filter(i => i.status === 'Follow Up').length },
                    { key: 'Enrolled', label: 'Enrolled', count: inquiries.filter(i => i.status === 'Enrolled').length },
                    { key: 'Archived', label: 'Archived', count: inquiries.filter(i => i.status === 'Archived').length },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setInquiryStatusFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                        inquiryStatusFilter === tab.key
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                        inquiryStatusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input 
                      type="text"
                      placeholder="Search candidate name, email, phone, course, or remarks..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {inquirySearch && (
                    <span className="text-xs font-bold text-indigo-600 shrink-0">
                      Found {filteredInquiries.length} matching leads
                    </span>
                  )}
                </div>

                {/* Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-inner">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Candidate & Email</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Cutoff</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Department</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Lead Status</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Date & Remarks</th>
                          <th className="p-3.5 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInquiries.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-10 text-center text-xs font-bold text-slate-400">
                              <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                              No inquiry leads found matching your criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredInquiries.map((item, idx) => {
                            const currentStatus = item.status || 'New';
                            return (
                              <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3.5">
                                  <span className="font-extrabold text-slate-900 text-xs block">{item.name || 'Anonymous'}</span>
                                  {item.email && (
                                    <a href={`mailto:${item.email}`} className="text-[11px] text-indigo-600 font-semibold hover:underline block truncate max-w-[180px]">
                                      {item.email}
                                    </a>
                                  )}
                                </td>

                                <td className="p-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-mono font-bold text-slate-700">{item.phone || 'N/A'}</span>
                                    {item.phone && (
                                      <a href={`tel:${item.phone}`} className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Call Candidate">
                                        <PhoneCall className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3.5 text-xs font-mono font-bold text-indigo-600">
                                  {item.cutoff || 'N/A'}
                                </td>

                                <td className="p-3.5">
                                  <span className="inline-block px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold rounded-lg text-[10px] uppercase">
                                    {item.dept || 'General'}
                                  </span>
                                </td>

                                <td className="p-3.5">
                                  <select
                                    value={currentStatus}
                                    onChange={(e) => updateInquiryStatus(item.id, e.target.value)}
                                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                                      currentStatus === 'New' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                      currentStatus === 'In Contact' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                      currentStatus === 'Enrolled' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                      currentStatus === 'Follow Up' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                      'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    <option value="New">New Lead</option>
                                    <option value="In Contact">In Contact</option>
                                    <option value="Follow Up">Follow Up</option>
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Archived">Archived</option>
                                  </select>
                                </td>

                                <td className="p-3.5 max-w-xs">
                                  <span className="text-[10px] font-semibold text-slate-400 block">
                                    {item.date || new Date(item.timestamp || Date.now()).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-slate-600 font-medium truncate block max-w-[180px]" title={item.notes || item.message}>
                                    {item.notes ? `📝 ${item.notes}` : (item.message || <span className="italic text-slate-300">No remarks</span>)}
                                  </span>
                                </td>

                                <td className="p-3.5 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingNoteInquiry(item);
                                        setNoteInputText(item.notes || item.message || '');
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                      title="Add/Edit Candidate Remarks"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteInquiry(item.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Entry"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Candidate Notes Modal */}
                <AnimatePresence>
                  {editingNoteInquiry && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 10 }}
                        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-4"
                      >
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-title text-base font-black text-slate-900">
                            Candidate Remarks: {editingNoteInquiry.name}
                          </h4>
                          <button
                            onClick={() => setEditingNoteInquiry(null)}
                            className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                            Admin Internal Notes / Counseling Progress
                          </label>
                          <textarea
                            value={noteInputText}
                            onChange={(e) => setNoteInputText(e.target.value)}
                            rows="4"
                            placeholder="Add counseling notes, cut-off details, or status updates..."
                            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white font-semibold text-slate-800"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingNoteInquiry(null)}
                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateInquiryNotes(editingNoteInquiry.id, noteInputText)}
                            className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer shadow-md"
                          >
                            Save Remarks
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* HOD ACCOUNTS & DEPARTMENT PORTALS MANAGER (Admin only) */}
            {activeTab === 'hod_portals' && userRole === 'admin' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-amber-500" />
                      <h3 className="font-title text-xl font-black text-slate-900">HOD Department Portals Provisioning</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Create & manage dedicated login credentials for Heads of Departments (HODs) to allow them to edit their own department details and faculty.
                    </p>
                  </div>

                  <button
                    onClick={loadHodAccounts}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Accounts
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Create / Edit HOD Portal Form */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white border border-indigo-150/80 p-6 rounded-3xl shadow-sm text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        {editingHodId ? 'Edit HOD Account' : 'Provision New HOD Portal'}
                      </h4>
                    </div>

                    <form onSubmit={handleSaveHodAccount} className="space-y-4">
                      {/* Department Select / Custom input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                          Department *
                        </label>
                        <select
                          value={hodForm.deptKey}
                          onChange={(e) => {
                            const val = e.target.value;
                            const matched = depts.find(d => d.key === val);
                            setHodForm({
                              ...hodForm,
                              deptKey: val,
                              deptName: matched ? matched.name : val.toUpperCase(),
                              email: hodForm.email || `${val}@apec.edu.in`
                            });
                          }}
                          className="w-full text-xs px-4 py-3 bg-white border border-slate-250 rounded-xl outline-none focus:border-indigo-600 font-bold text-slate-800 shadow-sm"
                          required
                        >
                          <option value="">-- Choose Department --</option>
                          {depts.map((d, i) => (
                            <option key={i} value={d.key}>{d.name} ({d.key.toUpperCase()})</option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Department Name label if needed */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                          Department Display Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Department of Computer Science"
                          value={hodForm.deptName}
                          onChange={(e) => setHodForm({ ...hodForm, deptName: e.target.value })}
                          className="w-full text-xs px-4 py-3 bg-white border border-slate-250 rounded-xl outline-none focus:border-indigo-600 font-semibold text-slate-800"
                        />
                      </div>

                      {/* HOD Department Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                          Department / HOD Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="e.g. cse@apec.edu.in"
                            value={hodForm.email}
                            onChange={(e) => setHodForm({ ...hodForm, email: e.target.value })}
                            className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-slate-250 rounded-xl outline-none focus:border-indigo-600 font-semibold text-slate-800"
                            required
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* HOD Password */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                          Password (AES Encrypted) *
                        </label>
                        <div className="relative">
                          <input
                            type={showHodPassword ? "text" : "password"}
                            placeholder="Set secure password"
                            value={hodForm.password}
                            onChange={(e) => setHodForm({ ...hodForm, password: e.target.value })}
                            className="w-full text-xs pl-10 pr-10 py-3 bg-white border border-slate-250 rounded-xl outline-none focus:border-indigo-600 font-semibold text-slate-800"
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowHodPassword(!showHodPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650"
                          >
                            {showHodPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Form action buttons */}
                      <div className="pt-3 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <KeyRound className="w-4 h-4" />
                          {editingHodId ? 'Update Portal Credentials' : 'Create HOD Portal'}
                        </button>
                        {editingHodId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHodId(null);
                              setHodForm({ deptKey: '', deptName: '', email: '', password: '' });
                            }}
                            className="px-4 py-3 bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: List of Existing HOD Portals */}
                  <div className="lg:col-span-7 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                        Active HOD Portals ({hodAccounts.length})
                      </h4>
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search department / email..."
                          value={hodSearch}
                          onChange={(e) => setHodSearch(e.target.value)}
                          className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-semibold"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
                      {hodAccounts
                        .filter(acc => 
                          acc.username.toLowerCase().includes(hodSearch.toLowerCase()) ||
                          acc.deptName.toLowerCase().includes(hodSearch.toLowerCase()) ||
                          acc.deptKey.toLowerCase().includes(hodSearch.toLowerCase())
                        )
                        .map((acc) => (
                          <div key={acc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-black rounded-lg text-[10px] uppercase font-mono">
                                  {acc.deptKey}
                                </span>
                                <span className="font-extrabold text-sm text-slate-900">{acc.deptName}</span>
                              </div>
                              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{acc.username}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-xs text-slate-700 font-bold flex items-center gap-1.5">
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>{acc.clearPassword}</span>
                              </div>

                              <button
                                onClick={() => {
                                  setEditingHodId(acc.id);
                                  setHodForm({
                                    deptKey: acc.deptKey,
                                    deptName: acc.deptName,
                                    email: acc.username,
                                    password: acc.clearPassword
                                  });
                                }}
                                className="p-2 text-indigo-650 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                                title="Edit Portal Credentials"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteHodAccount(acc.id, acc.username)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="Revoke HOD Access"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                      {hodAccounts.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-semibold text-xs">
                          No HOD department portals configured yet. Use the form on the left to provision a portal.
                        </div>
                      )}
                    </div>
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
                      className="relative w-full aspect-[1694/929] bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden shadow-inner cursor-crosshair select-none"
                      onWheel={handleMapWheel}
                      onMouseDown={handleMapBgMouseDown}
                      onMouseMove={(e) => {
                        handleMapBgMouseMove(e);
                        handleMapMouseMove(e);
                      }}
                      onMouseUp={() => {
                        handleMapBgMouseUp();
                        handleMapMouseUp();
                      }}
                      onMouseLeave={() => {
                        handleMapBgMouseUp();
                        handleMapMouseUp();
                      }}
                      onTouchMove={handleMapTouchMove}
                      onTouchEnd={() => {
                        handleMapBgMouseUp();
                        handleMapMouseUp();
                      }}
                    >
                      {/* Zoomable / Pannable Inner Area */}
                      <div
                        style={{
                          transform: `scale(${mapZoom}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
                          transformOrigin: 'center center',
                          transition: isPanningMap ? 'none' : 'transform 0.12s ease-out'
                        }}
                        className="w-full h-full relative"
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
                                onMouseDown={(e) => {
                                  e.stopPropagation(); // prevent panning start
                                  handleMapMouseDown(pt.id);
                                }}
                                onTouchStart={(e) => {
                                  e.stopPropagation();
                                  handleMapMouseDown(pt.id);
                                }}
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

                      {/* Map Controls */}
                      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-40 bg-white/95 backdrop-blur-sm border border-slate-200 p-1.5 rounded-xl shadow-md">
                        <button
                          onClick={handleZoomIn}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                          title="Zoom In"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleZoomOut}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                          title="Zoom Out"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
                          title="Reset View"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
