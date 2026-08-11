import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, FileText, Calendar, Bell, Info, User, 
  CheckCircle2, AlertTriangle, RefreshCw, BarChart2, BookOpen, 
  Settings, UploadCloud, Users, Layers, ShieldAlert, Award, 
  FileSpreadsheet, PlusCircle, Power, Menu, X, ArrowUpRight, Search, Eye, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoeAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'departments', 'students', 'examinations', 'results-upload', 'results-pending', 'results-published', 'notifications', 'reports', 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resultsMenuOpen, setResultsMenuOpen] = useState(true);

  // Result Ingestion State
  const [selectedExam, setSelectedExam] = useState('End Semester Examinations April/May 2026');
  const [selectedDept, setSelectedDept] = useState('B.E. Computer Science and Engineering');
  const [selectedProg, setSelectedProg] = useState('Undergraduate (UG)');
  const [selectedSem, setSelectedSem] = useState('Semester VI');
  const [selectedReg, setSelectedReg] = useState('Regulation 2021');
  const [fileAttached, setFileAttached] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [validationRun, setValidationRun] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  const mockPreviewResults = [
    { regNo: "4204", name: "Arjun Kumar S", subjectCode: "CS8601", subjectName: "Mobile Computing", marks: 88, grade: "A+", credits: 3, status: "PASS" },
    { regNo: "4205", name: "Bhavana M", subjectCode: "CS8601", subjectName: "Mobile Computing", marks: 92, grade: "O", credits: 3, status: "PASS" },
    { regNo: "4206", name: "Chandran R", subjectCode: "CS8601", subjectName: "Mobile Computing", marks: 45, grade: "RA", credits: 3, status: "FAIL" },
    { regNo: "4207", name: "Deepika K", subjectCode: "CS8601", subjectName: "Mobile Computing", marks: 74, grade: "B+", credits: 3, status: "PASS" },
    { regNo: "4208", name: "Elango V", subjectCode: "CS8601", subjectName: "Mobile Computing", marks: null, grade: "WH", credits: 3, status: "WITHHELD" }
  ];

  // Pending Results Workflow List State
  const [pendingList, setPendingList] = useState([
    { 
      id: 1, 
      exam: "End Semester Examinations April/May 2026", 
      dept: "B.E. Computer Science and Engineering", 
      sem: "Semester VI", 
      uploadDate: "10-08-2026", 
      count: 68, 
      validationStatus: "Passed (100% Validated)",
      status: "HOD Approved", // Pending, HOD Approved, COE Approved, Rejected, Published
      subjects: [
        { code: "CS8601", name: "Mobile Computing", marks: 88, grade: "A+", credits: 3, status: "PASS" },
        { code: "CS8602", name: "Compiler Design", marks: 76, grade: "A", credits: 4, status: "PASS" },
        { code: "CS8603", name: "Artificial Intelligence", marks: 91, grade: "O", credits: 3, status: "PASS" },
        { code: "CS8651", name: "Internet Programming", marks: 82, grade: "A+", credits: 3, status: "PASS" },
        { code: "CS8611", name: "Mini Project", marks: 95, grade: "O", credits: 2, status: "PASS" }
      ]
    },
    { 
      id: 2, 
      exam: "End Semester Examinations April/May 2026", 
      dept: "B.E. Electrical & Electronics Engg.", 
      sem: "Semester V", 
      uploadDate: "09-08-2026", 
      count: 42, 
      validationStatus: "Passed (100% Validated)",
      status: "Pending",
      subjects: [
        { code: "EE8501", name: "Power System Analysis", marks: 82, grade: "A+", credits: 3, status: "PASS" },
        { code: "EE8502", name: "Power Electronics", marks: 68, grade: "B", credits: 3, status: "PASS" },
        { code: "EE8503", name: "Transmission & Distribution", marks: 74, grade: "B+", credits: 3, status: "PASS" }
      ]
    },
    { 
      id: 3, 
      exam: "End Semester Examinations April/May 2026", 
      dept: "B.Tech Chemical Engineering", 
      sem: "Semester III", 
      uploadDate: "08-08-2026", 
      count: 35, 
      validationStatus: "Warnings Detected (1 Fail)",
      status: "Rejected",
      subjects: [
        { code: "CH8301", name: "Organic Chemistry", marks: 38, grade: "RA", credits: 4, status: "FAIL" },
        { code: "CH8302", name: "Chemical Process Calculations", marks: 75, grade: "A", credits: 4, status: "PASS" }
      ]
    }
  ]);

  const [selectedPendingItem, setSelectedPendingItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState(''); // 'approve', 'reject', 'publish', 'request-correction'
  const [targetItem, setTargetItem] = useState(null);

  const handleActionClick = (item, actionType) => {
    setTargetItem(item);
    setConfirmActionType(actionType);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    setPendingList(prev => prev.map(item => {
      if (item.id === targetItem.id) {
        let newStatus = item.status;
        if (confirmActionType === 'approve') {
          newStatus = item.status === 'Pending' ? 'HOD Approved' : 'COE Approved';
        } else if (confirmActionType === 'reject') {
          newStatus = 'Rejected';
        } else if (confirmActionType === 'request-correction') {
          newStatus = 'Pending';
        } else if (confirmActionType === 'publish') {
          newStatus = 'Published';
        }
        return { ...item, status: newStatus };
      }
      return item;
    }));
    setShowConfirmModal(false);
    setTargetItem(null);
  };

  // Mock statistics for the overview tab
  const stats = [
    { title: "Total Students", value: "3,420", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { title: "Total Departments", value: "12", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { title: "Active Examinations", value: "8", icon: Calendar, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { title: "Published Results", value: "42 Semesters", icon: CheckCircle2, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { title: "Pending Results", value: "3 Semesters", icon: ShieldAlert, color: "text-violet-600 bg-violet-50 border-violet-100" }
  ];

  // Mock list of recent activities
  const recentActivities = [
    { text: "B.E. CSE Semester VI Practical Marks verified by Internal Examiner", time: "10 mins ago", type: "info" },
    { text: "Simulated Excel results template downloaded for B.Tech IT Sem IV", time: "1 hour ago", type: "download" },
    { text: "Grade sheets generated for B.E. EEE Semester VIII", time: "3 hours ago", type: "success" },
    { text: "Review request submitted for ME CSE Compiler Design script evaluations", time: "Yesterday", type: "warning" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex relative">
      
      {/* ── MOBILE MENU TRIGGER ── */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-[100] lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl shadow-md text-slate-800 cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── SIDEBAR CONTAINER ── */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-850 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0'}
        ${sidebarOpen ? 'block' : 'hidden lg:flex'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
            <img src="/Images/Logos/apec-logo.png" alt="APEC Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-left leading-tight">
            <span className="font-title text-xs font-black text-white uppercase block tracking-wider">COE Portal</span>
            <span className="text-[9px] uppercase font-black tracking-widest text-[#FF8A00] block mt-0.5">Admin Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation Options */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 select-none text-left">
          
          {/* Dashboard Item */}
          <button 
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Departments Item */}
          <button 
            onClick={() => { setActiveTab('departments'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'departments' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Departments</span>
          </button>

          {/* Students Item */}
          <button 
            onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'students' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students</span>
          </button>

          {/* Examinations Item */}
          <button 
            onClick={() => { setActiveTab('examinations'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'examinations' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Examinations</span>
          </button>

          {/* Collapsible Results Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => setResultsMenuOpen(!resultsMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Results</span>
              </div>
              <span className={`text-[10px] transition-transform ${resultsMenuOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {resultsMenuOpen && (
              <div className="pl-6 space-y-1 border-l border-slate-850 ml-6 mt-1 flex flex-col">
                <button 
                  onClick={() => { setActiveTab('results-upload'); setSidebarOpen(false); }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'results-upload' ? 'text-[#FF8A00]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload Result
                </button>
                <button 
                  onClick={() => { setActiveTab('results-pending'); setSidebarOpen(false); }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'results-pending' ? 'text-[#FF8A00]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending Results
                </button>
                <button 
                  onClick={() => { setActiveTab('results-published'); setSidebarOpen(false); }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === 'results-published' ? 'text-[#FF8A00]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Published Results
                </button>
              </div>
            )}
          </div>

          {/* Notifications Item */}
          <button 
            onClick={() => { setActiveTab('notifications'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'notifications' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          {/* Reports Item */}
          <button 
            onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Reports</span>
          </button>

          {/* Settings Item */}
          <button 
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-650 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

        </div>

        {/* Sidebar Footer Logout/Exit */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            to="/coe"
            className="w-full flex items-center justify-center gap-2 py-3 border border-slate-750 hover:bg-slate-800 text-slate-400 hover:text-white transition-all rounded-xl text-xs font-black uppercase tracking-wider"
          >
            <Power className="w-4 h-4" />
            <span>Back to COE Public</span>
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto p-6 lg:p-8">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC]/50 px-3 py-1 rounded-full inline-block mb-2">
              Autonomous Assessment Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-gray-900 leading-tight">
              {activeTab === 'dashboard' && "COE Control Board"}
              {activeTab === 'departments' && "Academic Departments"}
              {activeTab === 'students' && "Student Registration"}
              {activeTab === 'examinations' && "Examination Controller"}
              {activeTab === 'results-upload' && "Simulate Result Ingestion"}
              {activeTab === 'results-pending' && "Awaiting Examination Approvals"}
              {activeTab === 'results-published' && "Published Examination Registers"}
              {activeTab === 'notifications' && "Broadcast Announcements"}
              {activeTab === 'reports' && "Academic Performance Reporting"}
              {activeTab === 'settings' && "System Parameters"}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-indigo-650" />
            </div>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-slate-800 block">COE Director</span>
              <span className="text-[9px] text-gray-400 font-bold block mt-0.5 font-mono">ID: 1401-COE</span>
            </div>
          </div>
        </div>

        {/* ── TAB DETAILS RENDER ── */}
        
        {/* Tab 1: Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${s.color}`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">{s.title}</span>
                      <p className="text-lg font-black text-slate-800 leading-none">{s.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Dashboard Panel layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Activities */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-base font-black text-slate-900 font-title mb-5">Recent Examination System Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.map((act, idx) => (
                      <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF8A00] mt-1.5 shrink-0" />
                        <div className="grow">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">{act.text}</p>
                          <span className="text-[9px] font-bold text-gray-400 font-mono block mt-1">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Key Shortcuts */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                  <div>
                    <h3 className="text-base font-black font-title mb-2 text-white">Need to Ingest Results?</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Upload grading slips using the standardized Excel templates. Verify academic performance parameters prior to official publication.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('results-upload')}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 bg-[#FF8A00] hover:bg-[#e07b00] text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Import Excel Results</span> <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Results Ingestion Workspace */}
        {activeTab === 'results-upload' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-left">
            {/* Main Upload Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 font-title mb-1">Department-wise Result Ingestion</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Select academic filters, upload the grade sheet spreadsheet, validate records, and preview data.
                </p>
              </div>

              {/* Form Selectors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Examination */}
                <div>
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1.5">Select Examination</label>
                  <select 
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-800"
                  >
                    <option>End Semester Examinations April/May 2026</option>
                    <option>End Semester Examinations Nov/Dec 2025</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1.5">Select Department</label>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-800"
                  >
                    <option>B.E. Computer Science and Engineering</option>
                    <option>B.E. Electronics & Communication Engg.</option>
                    <option>B.E. Electrical & Electronics Engg.</option>
                    <option>B.E. Mechanical Engineering</option>
                    <option>B.Tech Information Technology</option>
                  </select>
                </div>

                {/* Program */}
                <div>
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1.5">Select Program</label>
                  <select 
                    value={selectedProg}
                    onChange={(e) => setSelectedProg(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-800"
                  >
                    <option>Undergraduate (UG)</option>
                    <option>Postgraduate (PG)</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1.5">Select Semester</label>
                  <select 
                    value={selectedSem}
                    onChange={(e) => setSelectedSem(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-800"
                  >
                    <option>Semester I</option>
                    <option>Semester II</option>
                    <option>Semester III</option>
                    <option>Semester IV</option>
                    <option>Semester V</option>
                    <option>Semester VI</option>
                  </select>
                </div>

                {/* Regulation */}
                <div>
                  <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1.5">Select Regulation</label>
                  <select 
                    value={selectedReg}
                    onChange={(e) => setSelectedReg(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-800"
                  >
                    <option>Regulation 2021</option>
                    <option>Regulation 2023</option>
                    <option>Regulation 2019</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div 
                onClick={() => {
                  setFileName("APEC_CSE_SEM_VI_CS8601.xlsx");
                  setFileAttached(true);
                  setValidationRun(false);
                  setShowPreview(false);
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                  fileAttached 
                    ? 'border-indigo-500 bg-indigo-50/20' 
                    : 'border-gray-250 bg-slate-50 hover:bg-slate-100/50 hover:border-indigo-400'
                }`}
              >
                {fileAttached ? (
                  <>
                    <FileSpreadsheet className="w-12 h-12 text-indigo-650 mb-4 animate-bounce" />
                    <h4 className="text-xs font-black text-indigo-950 mb-1">{fileName} Attached</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Spreadsheet loaded. Proceed to Validate or Preview.</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                    <h4 className="text-xs font-black text-slate-800 mb-1">Click to simulate attaching grading file</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">Loads mock template grading records (APEC_CSE_SEM_VI_CS8601.xlsx)</p>
                  </>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-150">
                <button 
                  onClick={() => alert("Downloading spreadsheet layout template (APEC_Result_Upload_Template.xlsx)")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-indigo-650 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Download Template</span>
                </button>

                <div className="flex flex-wrap gap-3">
                  <button 
                    disabled={!fileAttached}
                    onClick={() => {
                      setIsUploading(true);
                      setTimeout(() => {
                        setIsUploading(false);
                        setValidationRun(true);
                      }, 800);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    <span>Validate File</span>
                  </button>

                  <button 
                    disabled={!fileAttached}
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-gray-355 disabled:opacity-50 text-gray-700 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Preview Results</span>
                  </button>

                  <button 
                    disabled={!fileAttached || !validationRun}
                    onClick={() => {
                      setUploadSuccessAlert(true);
                      setTimeout(() => {
                        setUploadSuccessAlert(false);
                        setFileAttached(false);
                        setFileName('');
                        setValidationRun(false);
                        setShowPreview(false);
                      }, 3000);
                    }}
                    className="flex items-center gap-1.5 bg-[#FF8A00] hover:bg-[#e07b00] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Upload Result</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Ingestion Alerts */}
            <AnimatePresence>
              {uploadSuccessAlert && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-650 shrink-0" />
                  <span>Success: Grades uploaded and recorded to pending buffer queue. Student portals will be notified upon admin publish verification.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Validation logs section */}
            {validationRun && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Grade Sheet Validation Logs
                </h4>
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-emerald-400">[VALIDATION SUCCESS] 5 out of 5 student rows parsed. Struct matches Regulation 2021 scheme.</p>
                  <p className="text-amber-300">[WARNING] Row 3: Student 'Chandran R' (Reg No: 4206) marked as FAIL (Marks: 45, Grade: RA).</p>
                  <p className="text-rose-400">[ERROR-CORRECTED] Row 5: Student 'Elango V' (Reg No: 4208) marks field empty. Standardized to 'Withheld' (Grade: WH).</p>
                </div>
              </div>
            )}

            {/* Result Preview spreadsheet */}
            {showPreview && (
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-650" /> Grade Sheet Data Preview
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                        <th className="px-5 py-4">Register Number</th>
                        <th className="px-5 py-4">Student Name</th>
                        <th className="px-5 py-4">Subject Code</th>
                        <th className="px-5 py-4">Subject Name</th>
                        <th className="px-5 py-4 text-center">Marks</th>
                        <th className="px-5 py-4 text-center">Grade</th>
                        <th className="px-5 py-4 text-center">Credits</th>
                        <th className="px-5 py-4 text-center">Result Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                      {mockPreviewResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 font-mono font-bold text-gray-900">{row.regNo}</td>
                          <td className="px-5 py-4 text-gray-800 font-bold">{row.name}</td>
                          <td className="px-5 py-4 font-mono font-bold">{row.subjectCode}</td>
                          <td className="px-5 py-4">{row.subjectName}</td>
                          <td className="px-5 py-4 text-center font-mono">{row.marks !== null ? row.marks : '--'}</td>
                          <td className="px-5 py-4 text-center font-black text-indigo-650">{row.grade}</td>
                          <td className="px-5 py-4 text-center">{row.credits}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              row.status === 'PASS' 
                                ? 'bg-green-50 text-green-600 border border-green-100' 
                                : row.status === 'FAIL'
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Pending Results Section */}
        {activeTab === 'results-pending' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left animate-fade-in space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 font-title mb-1">Awaiting Academic Approval</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Track grade sheets as they progress through the workflow: **Department Upload → HOD Review → COE Approval → Publish**.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                    <th className="px-5 py-4">Upload Details</th>
                    <th className="px-5 py-4">Department & Exam</th>
                    <th className="px-5 py-4 text-center">Semester</th>
                    <th className="px-5 py-4 text-center">Students</th>
                    <th className="px-5 py-4 text-center">Validation</th>
                    <th className="px-5 py-4 text-center">Current Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {pendingList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      {/* Upload details */}
                      <td className="px-5 py-4">
                        <span className="text-[10px] text-gray-400 font-mono block">Date: {item.uploadDate}</span>
                        <span className="text-[10px] text-gray-400 font-mono block">ID: APEC-R-{item.id}</span>
                      </td>
                      {/* Dept & Exam */}
                      <td className="px-5 py-4">
                        <span className="text-slate-955 font-bold block">{item.dept}</span>
                        <span className="text-[10px] text-indigo-650 block mt-0.5">{item.exam}</span>
                      </td>
                      {/* Semester */}
                      <td className="px-5 py-4 text-center font-mono font-bold">{item.sem}</td>
                      {/* Students count */}
                      <td className="px-5 py-4 text-center">{item.count}</td>
                      {/* Validation Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          item.validationStatus.includes('Passed')
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-[#FFE7CC]'
                        }`}>
                          {item.validationStatus}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          item.status === 'Pending' 
                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200' 
                            : item.status === 'HOD Approved'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : item.status === 'COE Approved'
                            ? 'bg-indigo-50 text-indigo-650 border-indigo-200'
                            : item.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-green-50 text-green-600 border-green-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {/* View Results Button */}
                          <button 
                            onClick={() => {
                              setSelectedPendingItem(item);
                              setShowReviewModal(true);
                            }}
                            className="text-[9px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            View
                          </button>

                          {/* Approve (HOD/COE) */}
                          {item.status !== 'COE Approved' && item.status !== 'Published' && item.status !== 'Rejected' && (
                            <button 
                              onClick={() => handleActionClick(item, 'approve')}
                              className="text-[9px] font-black uppercase tracking-wider text-white bg-indigo-650 hover:bg-indigo-600 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {/* Publish */}
                          {item.status === 'COE Approved' && (
                            <button 
                              onClick={() => handleActionClick(item, 'publish')}
                              className="text-[9px] font-black uppercase tracking-wider text-white bg-emerald-650 hover:bg-emerald-600 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                              Publish
                            </button>
                          )}

                          {/* Request Correction */}
                          {item.status !== 'Published' && item.status !== 'Rejected' && (
                            <button 
                              onClick={() => handleActionClick(item, 'request-correction')}
                              className="text-[9px] font-black uppercase tracking-wider text-gray-700 bg-white hover:bg-slate-50 border border-gray-300 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Correction
                            </button>
                          )}

                          {/* Reject */}
                          {item.status !== 'Published' && item.status !== 'Rejected' && (
                            <button 
                              onClick={() => handleActionClick(item, 'reject')}
                              className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Published Results Section */}
        {activeTab === 'results-published' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-left animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-title mb-1">Published Examinations</h3>
                <p className="text-xs text-gray-400 font-semibold">Active grade sheets accessible to students on the public site.</p>
              </div>

              {/* Search bar mock */}
              <div className="relative shrink-0 w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-450 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search semesters..."
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Semester</th>
                    <th className="px-5 py-4 text-center">Published Date</th>
                    <th className="px-5 py-4 text-center">Pass %</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {[
                    { dept: "B.E. Computer Science and Engineering", sem: "Semester V", date: "02-07-2026", pass: "94.2%" },
                    { dept: "B.E. Electronics & Communication Engg.", sem: "Semester IV", date: "28-06-2026", pass: "91.8%" },
                    { dept: "B.E. Civil Engineering", sem: "Semester II", date: "15-06-2026", pass: "88.5%" }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-slate-900 font-bold">{item.dept}</td>
                      <td className="px-5 py-4 font-mono font-bold">{item.sem}</td>
                      <td className="px-5 py-4 text-center font-mono">{item.date}</td>
                      <td className="px-5 py-4 text-center text-emerald-600 font-bold">{item.pass}</td>
                      <td className="px-5 py-4 text-center flex items-center justify-center gap-2">
                        <button className="text-[9px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer">
                          View Analysis
                        </button>
                        <button className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-150 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer">
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Placeholders for remaining sidebar items */}
        {['departments', 'students', 'examinations', 'notifications', 'reports', 'settings'].includes(activeTab) && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[350px] animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 mb-5">
              <Info className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900 font-title mb-1.5 uppercase">
              {activeTab} Management Module
            </h3>
            <p className="text-xs text-gray-400 font-semibold max-w-sm leading-relaxed mb-6">
              Additional database structures and administrator actions will be available in subsequent deployment versions.
            </p>
            <div className="inline-block text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full">
              Status: Placeholder Module
            </div>
          </div>
        )}

      </div>

      {/* ── MODALS & DIALOGS OVERLAYS ── */}
      
      {/* 1. Grade Sheets Detailed Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedPendingItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-955/75 backdrop-blur-sm select-none text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-slate-50">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-0.5">Review Grade Sheet records</span>
                  <h3 className="text-base font-black font-title text-slate-900 leading-tight">
                    {selectedPendingItem.dept} — {selectedPendingItem.sem}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-gray-505 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content - Scrollable Subjects Table */}
              <div className="p-6 overflow-y-auto space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-gray-150 p-4 rounded-xl text-xs font-semibold text-gray-600">
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Validation</span>
                    <span className="text-slate-800 font-bold block">{selectedPendingItem.validationStatus}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Semester</span>
                    <span className="text-slate-800 font-bold block">{selectedPendingItem.sem}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Students count</span>
                    <span className="text-slate-800 font-bold block">{selectedPendingItem.count} Students</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Current Status</span>
                    <span className="text-indigo-655 font-bold block uppercase">{selectedPendingItem.status}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                        <th className="px-4 py-3">Subject Code</th>
                        <th className="px-4 py-3">Subject Name</th>
                        <th className="px-4 py-3 text-center">Marks</th>
                        <th className="px-4 py-3 text-center">Grade</th>
                        <th className="px-4 py-3 text-center">Credits</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-750">
                      {selectedPendingItem.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono font-bold text-gray-900">{sub.code}</td>
                          <td className="px-4 py-3 text-gray-850 font-bold">{sub.name}</td>
                          <td className="px-4 py-3 text-center font-mono">{sub.marks !== null ? sub.marks : '--'}</td>
                          <td className="px-4 py-3 text-center font-black text-indigo-650">{sub.grade}</td>
                          <td className="px-4 py-3 text-center">{sub.credits}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              sub.status === 'PASS' 
                                ? 'bg-green-50 text-green-600' 
                                : 'bg-rose-50 text-rose-600'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Action Confirmation Modal Popup */}
      <AnimatePresence>
        {showConfirmModal && targetItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-955/75 backdrop-blur-sm select-none text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden space-y-6"
            >
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black font-title text-slate-955 leading-tight capitalize">
                    Confirm {confirmActionType} action
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-2">
                    Are you sure you want to {confirmActionType} the examination results for:
                    <br />
                    <span className="font-bold text-slate-800">{targetItem.dept} ({targetItem.sem})</span>?
                    This action will update the internal workflow state.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => { setShowConfirmModal(false); setTargetItem(null); }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-gray-300 text-gray-705 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAction}
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md hover:shadow-indigo-500/10"
                >
                  Confirm Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
