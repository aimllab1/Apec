import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, FileText, Calendar, Bell, Mail, Phone, MapPin, 
  Download, ExternalLink, ArrowRight, ShieldCheck, Info, User, 
  Lock, ArrowLeft, Printer, CheckCircle2, AlertTriangle, RefreshCw, Clipboard
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function Coe() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing', 'search', 'result'
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedSemester, setSelectedSemester] = useState('Semester V');
  const [studentActiveTab, setStudentActiveTab] = useState('results'); // 'results', 'timetable', 'hallticket', 'revaluation', 'correction'

  // Load COE Results Database from LocalStorage to dynamically connect with COE Admin
  const [dbResults, setDbResults] = useState(() => {
    const saved = localStorage.getItem('apec_coe_results_database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    
    // Initial Seed Database:
    // Semester VI is "HOD Approved" (needs COE publish).
    // Semesters V and IV are "Published" and visible.
    const initialDb = [
      { 
        id: 1, 
        exam: "End Semester Examinations April/May 2026", 
        dept: "B.E. Computer Science and Engineering", 
        sem: "Semester VI", 
        uploadDate: "10-08-2026", 
        count: 68, 
        validationStatus: "Passed (100% Validated)",
        status: "HOD Approved", 
        sgpa: "8.45",
        cgpa: "8.12",
        subjects: [
          { code: "CS8601", name: "Mobile Computing", marks: 88, grade: "A+", gradePoint: 9, credits: 3, status: "PASS" },
          { code: "CS8602", name: "Compiler Design", marks: 76, grade: "A", gradePoint: 8, credits: 4, status: "PASS" },
          { code: "CS8603", name: "Artificial Intelligence", marks: 91, grade: "O", gradePoint: 10, credits: 3, status: "PASS" },
          { code: "CS8651", name: "Internet Programming", marks: 82, grade: "A+", gradePoint: 9, credits: 3, status: "PASS" },
          { code: "CS8611", name: "Mini Project", marks: 95, grade: "O", gradePoint: 10, credits: 2, status: "PASS" },
          { code: "HS8561", name: "Professional Communication", marks: 89, grade: "A+", gradePoint: 9, credits: 2, status: "PASS" }
        ]
      },
      { 
        id: 2, 
        exam: "End Semester Examinations April/May 2026", 
        dept: "B.E. Computer Science and Engineering", 
        sem: "Semester V", 
        uploadDate: "09-08-2026", 
        count: 42, 
        validationStatus: "Passed (100% Validated)",
        status: "Published", 
        sgpa: "8.30",
        cgpa: "8.09",
        subjects: [
          { code: "CS8501", name: "Theory of Computation", marks: 85, grade: "A+", gradePoint: 9, credits: 4, status: "PASS" },
          { code: "CS8591", name: "Computer Networks", marks: 78, grade: "A", gradePoint: 8, credits: 3, status: "PASS" },
          { code: "CS8592", name: "Object Oriented Analysis & Design", marks: 80, grade: "A", gradePoint: 8, credits: 3, status: "PASS" },
          { code: "EC8551", name: "Microprocessors & Microcontrollers", marks: 74, grade: "B+", gradePoint: 7, credits: 3, status: "PASS" },
          { code: "CS8511", name: "Networks Laboratory", marks: 90, grade: "O", gradePoint: 10, credits: 2, status: "PASS" }
        ]
      },
      { 
        id: 3, 
        exam: "End Semester Examinations April/May 2026", 
        dept: "B.E. Computer Science and Engineering", 
        sem: "Semester IV", 
        uploadDate: "08-08-2026", 
        count: 35, 
        validationStatus: "Passed (100% Validated)",
        status: "Published", 
        sgpa: "7.95",
        cgpa: "7.98",
        subjects: [
          { code: "CS8401", name: "Database Management Systems", marks: 82, grade: "A+", gradePoint: 9, credits: 3, status: "PASS" },
          { code: "CS8402", name: "Operating Systems", marks: 75, grade: "A", gradePoint: 8, credits: 3, status: "PASS" },
          { code: "CS8451", name: "Design & Analysis of Algorithms", marks: 70, grade: "B+", gradePoint: 7, credits: 4, status: "PASS" },
          { code: "MA8391", name: "Probability & Queueing Theory", marks: 80, grade: "A", gradePoint: 8, credits: 4, status: "PASS" }
        ]
      }
    ];
    localStorage.setItem('apec_coe_results_database', JSON.stringify(initialDb));
    return initialDb;
  });

  // Load Timetable from LocalStorage
  const [timetableDb, setTimetableDb] = useState(() => {
    const saved = localStorage.getItem('apec_coe_timetable');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initialTimetable = [
      { id: 1, exam: "End Semester Examinations April/May 2026", dept: "B.E. Computer Science and Engineering", sem: "Semester VI", code: "CS8601", name: "Mobile Computing", date: "2026-06-22", time: "10:00 AM - 01:00 PM", hall: "LH-201" },
      { id: 2, exam: "End Semester Examinations April/May 2026", dept: "B.E. Computer Science and Engineering", sem: "Semester VI", code: "CS8602", name: "Compiler Design", date: "2026-06-24", time: "10:00 AM - 01:00 PM", hall: "LH-201" },
      { id: 3, exam: "End Semester Examinations April/May 2026", dept: "B.E. Computer Science and Engineering", sem: "Semester VI", code: "CS8603", name: "Artificial Intelligence", date: "2026-06-26", time: "10:00 AM - 01:00 PM", hall: "LH-202" },
      { id: 4, exam: "End Semester Examinations April/May 2026", dept: "B.E. Computer Science and Engineering", sem: "Semester VI", code: "CS8651", name: "Internet Programming", date: "2026-06-29", time: "10:00 AM - 01:00 PM", hall: "LH-203" }
    ];
    localStorage.setItem('apec_coe_timetable', JSON.stringify(initialTimetable));
    return initialTimetable;
  });

  // Revaluation Student state
  const [revalList, setRevalList] = useState(() => {
    const saved = localStorage.getItem('apec_revaluation_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 101, regNo: "4204", studentName: "Arjun Kumar S", sem: "Semester V", code: "CS8501", name: "Theory of Computation", currentMarks: 85, currentGrade: "A+", status: "Under Review", date: "11-08-2026", remarks: "Paper sent to external valuation board." }
    ];
  });

  // Correction Student state
  const [correctList, setCorrectList] = useState(() => {
    const saved = localStorage.getItem('apec_correction_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 201, regNo: "4204", studentName: "Arjun Kumar S", sem: "Semester V", code: "CS8591", name: "Computer Networks", type: "Marks Discrepancy", desc: "Internal marks of 20 out of 20 were not added correctly to final grades.", file: "IA_CSE_SemV.pdf", status: "Pending", date: "11-08-2026", remarks: "" }
    ];
  });

  // Form states for submitting requests
  const [revalSemInput, setRevalSemInput] = useState('Semester V');
  const [revalSubjectInput, setRevalSubjectInput] = useState('');
  const [correctSemInput, setCorrectSemInput] = useState('Semester V');
  const [correctSubjectInput, setCorrectSubjectInput] = useState('');
  const [correctTypeInput, setCorrectTypeInput] = useState('Marks Discrepancy');
  const [correctDescInput, setCorrectDescInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // Filter ONLY published semesters for student portal display
  const publishedSemesters = dbResults.filter(item => item.status === 'Published');

  // Build student grade profile dynamically
  const studentResultProfile = {
    name: "Arjun Kumar S",
    regNo: "4204",
    dept: "B.E. Computer Science and Engineering",
    semesters: {},
    history: [
      { semester: "Semester I", sgpa: "7.85", cgpa: "7.85", status: "PASS" },
      { semester: "Semester II", sgpa: "8.10", cgpa: "7.98", status: "PASS" },
      { semester: "Semester III", sgpa: "7.95", cgpa: "7.97", status: "PASS" }
    ]
  };

  publishedSemesters.forEach(item => {
    studentResultProfile.semesters[item.sem] = {
      sgpa: item.sgpa,
      cgpa: item.cgpa,
      status: "PASS",
      subjects: item.subjects
    };
    
    // Check if the history list already includes this semester to avoid duplicates
    if (!studentResultProfile.history.some(h => h.semester === item.sem)) {
      studentResultProfile.history.push({
        semester: item.sem,
        sgpa: item.sgpa,
        cgpa: item.cgpa,
        status: "PASS"
      });
    }
  });

  // Active subjects in selected semester for revaluation dropdowns
  const currentSemesterSubjects = studentResultProfile.semesters[revalSemInput] 
    ? studentResultProfile.semesters[revalSemInput].subjects 
    : [];

  const handleRevalSubmit = (e) => {
    e.preventDefault();
    if (!revalSubjectInput) {
      alert("Please select a subject.");
      return;
    }
    const targetSubObj = currentSemesterSubjects.find(s => s.code === revalSubjectInput);
    if (!targetSubObj) return;

    const request = {
      id: Date.now(),
      regNo: "4204",
      studentName: "Arjun Kumar S",
      sem: revalSemInput,
      code: targetSubObj.code,
      name: targetSubObj.name,
      currentMarks: targetSubObj.marks,
      currentGrade: targetSubObj.grade,
      status: "Submitted",
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      remarks: ""
    };

    const updated = [request, ...revalList];
    setRevalList(updated);
    localStorage.setItem('apec_revaluation_requests', JSON.stringify(updated));
    alert("Revaluation application successfully submitted!");
  };

  const handleCorrectSubmit = (e) => {
    e.preventDefault();
    if (!correctSubjectInput || !correctDescInput.trim()) {
      alert("Please select a subject and write a description.");
      return;
    }
    const currentCorrectSemSubjects = studentResultProfile.semesters[correctSemInput] 
      ? studentResultProfile.semesters[correctSemInput].subjects 
      : [];
    const targetSubObj = currentCorrectSemSubjects.find(s => s.code === correctSubjectInput);
    if (!targetSubObj) return;

    const request = {
      id: Date.now(),
      regNo: "4204",
      studentName: "Arjun Kumar S",
      sem: correctSemInput,
      code: targetSubObj.code,
      name: targetSubObj.name,
      type: correctTypeInput,
      desc: correctDescInput.trim(),
      file: attachedFileName || "None",
      status: "Pending",
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      remarks: ""
    };

    const updated = [request, ...correctList];
    setCorrectList(updated);
    localStorage.setItem('apec_correction_requests', JSON.stringify(updated));
    setCorrectDescInput('');
    setAttachedFileName('');
    alert("Correction request successfully submitted!");
  };

  // Filter Timetable entries matching student parameters: CSE department & selected semester
  const filteredTimetable = timetableDb.filter(
    item => item.dept === studentResultProfile.dept && item.sem === selectedSemester
  );

  const handleSearchClick = () => {
    setViewMode('search');
    setRegNo('');
    setPassword('');
    setFormErrors({});
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!regNo.trim()) {
      errors.regNo = "Register Number is required.";
    } else if (regNo.trim() !== "4204") {
      errors.regNo = "Invalid Register Number. Enter demo Reg No: 4204.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    } else if (password.trim() !== "1234") {
      errors.password = "Invalid Password. Enter demo Password: 1234.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        // Fetch fresh state from localStorage in case COE published results during session
        const saved = localStorage.getItem('apec_coe_results_database');
        let currentDb = dbResults;
        if (saved) {
          try {
            currentDb = JSON.parse(saved);
            setDbResults(currentDb);
          } catch (err) {}
        }
        
        const freshPublished = currentDb.filter(item => item.status === 'Published');
        
        // Fetch timetable entries
        const savedTimetable = localStorage.getItem('apec_coe_timetable');
        if (savedTimetable) {
          try {
            setTimetableDb(JSON.parse(savedTimetable));
          } catch (err) {}
        }

        // Fetch revaluation and correction requests
        const savedReval = localStorage.getItem('apec_revaluation_requests');
        if (savedReval) {
          try { setRevalList(JSON.parse(savedReval)); } catch (err) {}
        }
        const savedCorrect = localStorage.getItem('apec_correction_requests');
        if (savedCorrect) {
          try { setCorrectList(JSON.parse(savedCorrect)); } catch (err) {}
        }

        setLoading(false);
        setViewMode('result');
        setStudentActiveTab('results');
        
        // Auto-select the highest published semester
        if (freshPublished.length > 0) {
          setSelectedSemester(freshPublished[0].sem);
          setRevalSemInput(freshPublished[0].sem);
          setCorrectSemInput(freshPublished[0].sem);
          if (freshPublished[0].subjects && freshPublished[0].subjects.length > 0) {
            setRevalSubjectInput(freshPublished[0].subjects[0].code);
            setCorrectSubjectInput(freshPublished[0].subjects[0].code);
          }
        } else {
          setSelectedSemester('Semester V');
          setRevalSemInput('Semester V');
          setCorrectSemInput('Semester V');
        }
      }, 1000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-12 md:py-20 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      
      {/* Dynamic style block specifically for print formatting */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-sheet, #printable-sheet * {
            visibility: visible;
          }
          #printable-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}} />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none print-hide" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none print-hide" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none print-hide" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* ── LANDING VIEW ── */}
        {viewMode === 'landing' && (
          <div>
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-250 pb-12">
              <div className="max-w-3xl">
                <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-5 uppercase">
                  Office of the COE
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
                  Controller of Examinations
                </h1>
                <p className="text-sm md:text-base text-gray-500 font-bold max-w-2xl leading-relaxed">
                  Managing end-to-end examination processes, evaluation systems, and academic result publication to ensure academic integrity.
                </p>
                
                {/* Hero Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <button 
                    onClick={handleSearchClick}
                    type="button" 
                    className="flex items-center gap-2 bg-indigo-655 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all border border-indigo-750 cursor-pointer"
                  >
                    View Results <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSearchClick}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-gray-700 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-gray-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    Exam Schedule <Calendar className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {[
                { title: "Student Results", desc: "Access individual student marks, grades, and CGPA calculations online.", icon: FileText, click: handleSearchClick },
                { title: "Exam Schedule", desc: "Download final semester timetable and assessment routines.", icon: Calendar, click: handleSearchClick },
                { title: "Latest Announcements", desc: "Important notices, circulars, and evaluation updates.", icon: Bell },
                { title: "Student Downloads", desc: "Access revaluation slips, transcripts, and application forms.", icon: Download }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    onClick={card.click ? card.click : undefined}
                    className={`bg-white border border-gray-255 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between text-left ${card.click ? 'cursor-pointer border-indigo-200' : ''}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-655 mb-5 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">{card.title}</h3>
                      <p className="text-xs text-gray-400 font-semibold leading-relaxed">{card.desc}</p>
                    </div>
                    {card.click && (
                      <span className="text-[10px] font-black uppercase text-indigo-655 mt-5 flex items-center gap-1">
                        Access Portal →
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Main Content Info Block Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 pt-8 border-t border-gray-200">
              {/* Left 2 Columns: Announcements & Details */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-black text-gray-900 font-title mb-2 uppercase tracking-wide">Important Examinations Updates</h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">Official assessment circulars, feedback guidelines, and schedule notifications.</p>
                </div>
                <div className="bg-white border border-gray-250 p-6 rounded-3xl text-center py-12 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-gray-255 flex items-center justify-center text-gray-400 mb-4">
                    <Info className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-1">No Active Notifications</h4>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs">All grading structures and revaluation schedules are running on schedule. Check back for updates.</p>
                </div>
              </div>

              {/* Right Column: Key Regulations and Guidelines */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 font-title mb-2 uppercase tracking-wide">Quick Regulations</h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed font-sans">Mandatory guidelines and academic structures.</p>
                </div>
                <div className="bg-white border border-gray-205 rounded-3xl p-6 shadow-sm space-y-4">
                  {[
                    { title: "Academic Calendar 2026", path: "#" },
                    { title: "Evaluation Credit Systems", path: "#" },
                    { title: "Code of Conduct & Malpractices", path: "#" },
                    { title: "Transcript Application Guidelines", path: "#" }
                  ].map((link, idx) => (
                    <a key={idx} href={link.path} className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/60 rounded-2xl text-xs font-bold text-slate-800 transition-colors">
                      <span>{link.title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* About COE */}
            <div className="bg-white border border-gray-202 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-655">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 font-title">Academic Governance</h3>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-4xl">
                  The Controller of Examinations manages evaluations, autonomous regulation templates, exam logistics, schedule integrity, and direct publication of grade statements to students. We maintain confidentiality, security, and strict timelines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH VIEW ── */}
        {viewMode === 'search' && (
          <div className="max-w-md mx-auto">
            <button 
              onClick={() => setViewMode('landing')}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-655 transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to COE Landing
            </button>

            {/* Login card */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-indigo-655" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title">Student Console</h2>
                <p className="text-xs text-gray-400 font-bold block mt-1 uppercase tracking-wider">Access Results & Timetables</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                {/* Reg No input */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-455 tracking-wider mb-1.5 font-sans">Register Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="Enter Register Number (e.g., 4204)"
                      className={`w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                        formErrors.regNo ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {formErrors.regNo && <p className="text-[10px] font-bold text-rose-500 mt-1">{formErrors.regNo}</p>}
                </div>

                {/* Password / DOB input */}
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-455 tracking-wider mb-1.5 font-sans">Date of Birth / Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password (e.g., 1234)"
                      className={`w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold ${
                        formErrors.password ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {formErrors.password && <p className="text-[10px] font-bold text-rose-505 mt-1">{formErrors.password}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform active:scale-99 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Student Profile...
                    </>
                  ) : (
                    <>
                      Enter Console <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Hint Helper */}
              <div className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold text-slate-500 text-left">
                <span className="text-[10px] font-black uppercase text-indigo-655 block mb-1">Demo Credentials</span>
                <p className="leading-relaxed">
                  Enter Reg No: <span className="font-mono font-bold text-slate-855 bg-white border px-1.5 py-0.5 rounded">4204</span> and Password: <span className="font-mono font-bold text-slate-855 bg-white border px-1.5 py-0.5 rounded">1234</span> to log in.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT VIEW (STUDENT CONSOLE) ── */}
        {viewMode === 'result' && (
          <div>
            {/* Student console navigation bar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-gray-200 pb-4 print-hide select-none">
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setViewMode('search')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-650 transition-colors cursor-pointer mr-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Log out
                </button>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'results', label: 'Grade Slip' },
                    { id: 'timetable', label: 'Timetable' },
                    { id: 'hallticket', label: 'Hall Ticket' },
                    { id: 'revaluation', label: 'Revaluation' },
                    { id: 'correction', label: 'Result Correction' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setStudentActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                        studentActiveTab === tab.id ? 'bg-indigo-655 text-white shadow-sm' : 'bg-white hover:bg-slate-100 border border-gray-250 text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {['results', 'timetable', 'hallticket'].includes(studentActiveTab) && (
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Download / Print
                </button>
              )}
            </div>

            {/* ── TABS RENDERING ── */}
            
            {/* Tab 1: Grade Sheet */}
            {studentActiveTab === 'results' && (
              <div 
                id="printable-sheet"
                className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden"
              >
                {/* College Heading Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-8 gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/Images/Logos/apec-logo.png" 
                      alt="APEC Logo" 
                      className="w-14 h-14 object-contain mix-blend-multiply"
                    />
                    <div className="text-left">
                      <h2 className="font-title text-base sm:text-lg font-black text-gray-955 block leading-tight drop-shadow-sm uppercase">
                        Adhiparasakthi Engineering College
                      </h2>
                      <span className="font-mono text-[9px] uppercase font-black text-indigo-655 tracking-wider block mt-0.5">
                        An Autonomous Institution affiliated to Anna University
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase">
                        Office of the Controller of Examinations
                      </span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-block">
                      Official Grade Slip
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase font-mono">Date: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Student Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Student Name</span>
                    <p className="text-sm font-black text-slate-800 leading-snug">{studentResultProfile.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Register Number</span>
                    <p className="text-sm font-bold text-slate-800 leading-snug font-mono">{studentResultProfile.regNo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Department</span>
                    <p className="text-sm font-black text-slate-800 leading-snug">{studentResultProfile.dept}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Current Semester</span>
                    <p className="text-sm font-black text-indigo-650 leading-snug">
                      {studentResultProfile.semesters[selectedSemester] ? selectedSemester : studentResultProfile.currentSemester}
                    </p>
                  </div>
                </div>

                {/* Semester Tabs - (Hidden during print) */}
                <div className="border-b border-gray-150 mb-6 flex flex-wrap gap-2 print-hide">
                  {Object.keys(studentResultProfile.semesters).map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer ${
                        selectedSemester === sem
                          ? 'bg-indigo-655 text-white border-b-2 border-indigo-750'
                          : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-gray-700'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>

                {/* Detailed mark list table */}
                {studentResultProfile.semesters[selectedSemester] ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl mb-8">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                          <th className="px-5 py-4">Subject Code</th>
                          <th className="px-5 py-4">Subject Name</th>
                          <th className="px-5 py-4 text-center">Credits</th>
                          <th className="px-5 py-4 text-center">Marks</th>
                          <th className="px-5 py-4 text-center">Grade</th>
                          <th className="px-5 py-4 text-center">Grade Point</th>
                          <th className="px-5 py-4 text-center">Result Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-750">
                        {studentResultProfile.semesters[selectedSemester].subjects.map((sub, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-bold font-mono text-gray-900">{sub.code}</td>
                            <td className="px-5 py-4 text-gray-800 font-bold">{sub.name}</td>
                            <td className="px-5 py-4 text-center font-bold">{sub.credits}</td>
                            <td className="px-5 py-4 text-center font-mono font-bold">{sub.marks !== null ? sub.marks : '--'}</td>
                            <td className="px-5 py-4 text-center font-black text-indigo-650">{sub.grade}</td>
                            <td className="px-5 py-4 text-center font-bold">{sub.gradePoint !== undefined ? sub.gradePoint : '--'}</td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                sub.status === 'PASS' 
                                  ? 'bg-green-50 text-green-600 border border-green-100' 
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-gray-205 rounded-3xl text-center text-gray-400 font-semibold">
                    No published subjects available for {selectedSemester}.
                  </div>
                )}

                {/* Semester Summaries */}
                {studentResultProfile.semesters[selectedSemester] && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8">
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Semester GPA (SGPA)</span>
                      <p className="text-2xl font-black text-slate-800 font-mono">
                        {studentResultProfile.semesters[selectedSemester].sgpa}
                      </p>
                    </div>
                    <div className="text-center sm:text-left border-y sm:border-y-0 sm:border-x border-slate-200 py-4 sm:py-0 sm:px-6">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Cumulative GPA (CGPA)</span>
                      <p className="text-2xl font-black text-slate-800 font-mono">
                        {studentResultProfile.semesters[selectedSemester].cgpa}
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-0.5">Overall Result Status</span>
                      <span className="inline-block mt-1.5 px-4 py-1 rounded-full text-xs font-black uppercase bg-green-50 text-green-600 border border-green-150">
                        {studentResultProfile.semesters[selectedSemester].status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Semester-wise result history timeline */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 font-title mb-4 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" /> Complete Semester Performance History
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {studentResultProfile.history.map((hist, idx) => (
                      <div 
                        key={idx}
                        className="bg-white border border-gray-250 p-4 rounded-xl text-center shadow-sm relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFE7CC]" />
                        <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">{hist.semester}</span>
                        <span className="text-sm font-black text-slate-800 block font-mono">SGPA: {hist.sgpa}</span>
                        <span className="text-[9px] font-black uppercase text-emerald-600 block mt-1">{hist.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official stamp placeholder */}
                <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-150 text-xs text-gray-405 font-semibold">
                  <div className="max-w-[200px] text-left">
                    <p className="italic">Verify online via QR security system in future deployments.</p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-10 border-b border-dashed border-gray-300 mb-2 mx-auto sm:ml-auto" />
                    <p className="font-bold text-gray-800">Controller of Examinations</p>
                    <p className="text-[10px] uppercase font-black text-gray-400 mt-0.5">APEC (Autonomous)</p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Exam Timetable */}
            {studentActiveTab === 'timetable' && (
              <div 
                id="printable-sheet"
                className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden"
              >
                {/* College Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-8 gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/Images/Logos/apec-logo.png" 
                      alt="APEC Logo" 
                      className="w-14 h-14 object-contain mix-blend-multiply"
                    />
                    <div className="text-left">
                      <h2 className="font-title text-base sm:text-lg font-black text-gray-955 block leading-tight drop-shadow-sm uppercase">
                        Adhiparasakthi Engineering College
                      </h2>
                      <span className="font-mono text-[9px] uppercase font-black text-indigo-655 tracking-wider block mt-0.5">
                        An Autonomous Institution affiliated to Anna University
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase">
                        Office of the Controller of Examinations
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-block">
                      Semester Timetable
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase font-mono">Published: 2026</span>
                  </div>
                </div>

                {/* Candidate details panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8 text-left text-xs font-semibold text-gray-600">
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Department</span>
                    <span className="text-slate-800 font-bold block">{studentResultProfile.dept}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Semester</span>
                    <span className="text-slate-800 font-bold block">{selectedSemester}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Scheduled examinations</span>
                    <span className="text-indigo-655 font-black block">{filteredTimetable.length} Slots</span>
                  </div>
                </div>

                {/* Semester selection dropdown (screen only) */}
                <div className="mb-6 flex items-center gap-2 print-hide text-xs font-bold text-gray-600">
                  <span>Select Semester to view timetable:</span>
                  <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-gray-300 rounded-xl outline-none text-slate-800 font-semibold"
                  >
                    <option>Semester I</option>
                    <option>Semester II</option>
                    <option>Semester III</option>
                    <option>Semester IV</option>
                    <option>Semester V</option>
                    <option>Semester VI</option>
                  </select>
                </div>

                {/* Timetable schedule grid */}
                {filteredTimetable.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl mb-8">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                          <th className="px-5 py-4">Subject Code</th>
                          <th className="px-5 py-4">Subject Name</th>
                          <th className="px-5 py-4 text-center">Exam Date</th>
                          <th className="px-5 py-4 text-center">Time Slot</th>
                          <th className="px-5 py-4 text-center">Exam Hall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-750">
                        {filteredTimetable.map((slot) => (
                          <tr key={slot.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-mono font-bold text-gray-900">{slot.code}</td>
                            <td className="px-5 py-4 text-gray-805 font-bold">{slot.name}</td>
                            <td className="px-5 py-4 text-center font-mono font-bold text-indigo-650">{slot.date}</td>
                            <td className="px-5 py-4 text-center font-mono text-gray-500">{slot.time}</td>
                            <td className="px-5 py-4 text-center font-bold">{slot.hall}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-gray-250 rounded-3xl text-center text-gray-400 font-semibold mb-8">
                    No active examinations scheduled for {selectedSemester} under {studentResultProfile.dept}.
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-gray-150 text-xs text-gray-400 font-semibold">
                  <div className="text-left">
                    <p className="italic">Verify timetable listings regularly for any special session amendments.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">Controller of Examinations</p>
                    <p className="text-[10px] uppercase font-black text-gray-400 mt-0.5">APEC (Autonomous)</p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 3: Hall Ticket */}
            {studentActiveTab === 'hallticket' && (
              <div 
                id="printable-sheet"
                className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden"
              >
                {/* College Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-8 gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/Images/Logos/apec-logo.png" 
                      alt="APEC Logo" 
                      className="w-14 h-14 object-contain mix-blend-multiply"
                    />
                    <div className="text-left">
                      <h2 className="font-title text-base sm:text-lg font-black text-gray-955 block leading-tight drop-shadow-sm uppercase">
                        Adhiparasakthi Engineering College
                      </h2>
                      <span className="font-mono text-[9px] uppercase font-black text-indigo-655 tracking-wider block mt-0.5">
                        An Autonomous Institution affiliated to Anna University
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase">
                        Office of the Controller of Examinations
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full inline-block">
                      Official Hall Ticket
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1.5 uppercase font-mono">ID: {studentResultProfile.regNo}-HT</span>
                  </div>
                </div>

                {/* Candidate Metadata and Portrait Card Grid */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
                  {/* Photo frame */}
                  <div className="w-full md:w-32 bg-slate-50 border border-gray-250 rounded-2xl p-4 flex flex-col items-center justify-center text-center shrink-0">
                    <div className="w-20 h-20 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-655 mb-2">
                      <User className="w-8 h-8" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">Arjun Kumar S</span>
                  </div>

                  {/* Metadata fields */}
                  <div className="grow grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left text-xs font-semibold text-gray-600">
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Student Name</span>
                      <span className="text-slate-900 font-bold block">{studentResultProfile.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Register Number</span>
                      <span className="text-slate-900 font-bold font-mono block">{studentResultProfile.regNo}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Department</span>
                      <span className="text-slate-900 font-bold block">{studentResultProfile.dept}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-400 block mb-0.5">Semester & Exam</span>
                      <span className="text-slate-900 font-bold block">{selectedSemester} | April/May 2026</span>
                    </div>
                  </div>
                </div>

                {/* Timetable schedule grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider text-left">Candidate Exam Schedule</h4>
                  {filteredTimetable.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                            <th className="px-5 py-4">Subject Code</th>
                            <th className="px-5 py-4">Subject Name</th>
                            <th className="px-5 py-4 text-center">Exam Date</th>
                            <th className="px-5 py-4 text-center">Time Slot</th>
                            <th className="px-5 py-4 text-center">Exam Hall</th>
                            <th className="px-5 py-4 text-center">Candidate Sign</th>
                            <th className="px-5 py-4 text-center">Invigilator Sign</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-semibold text-gray-750">
                          {filteredTimetable.map((slot) => (
                            <tr key={slot.id} className="hover:bg-slate-50/50">
                              <td className="px-5 py-4 font-mono font-bold text-gray-900">{slot.code}</td>
                              <td className="px-5 py-4 text-gray-808 font-bold">{slot.name}</td>
                              <td className="px-5 py-4 text-center font-mono font-bold text-indigo-650">{slot.date}</td>
                              <td className="px-5 py-4 text-center font-mono text-gray-500">{slot.time}</td>
                              <td className="px-5 py-4 text-center font-bold">{slot.hall}</td>
                              <td className="px-5 py-4 text-center border-l border-gray-100">
                                <div className="h-6 w-16 border-b border-dashed border-gray-250 mx-auto" />
                              </td>
                              <td className="px-5 py-4 text-center border-l border-gray-100">
                                <div className="h-6 w-16 border-b border-dashed border-gray-250 mx-auto" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 border border-dashed border-gray-250 rounded-3xl text-center text-gray-400 font-semibold">
                      No scheduled slots found for {selectedSemester}. Enter COE Admin page to schedule exam timetable.
                    </div>
                  )}
                </div>

                {/* Candidate Instructions list */}
                <div className="mt-8 bg-slate-50 border border-gray-205 rounded-2xl p-5 text-xs text-gray-500 font-semibold leading-relaxed space-y-2 text-left">
                  <h5 className="font-black text-slate-805 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-indigo-655" /> Instructions to the Candidate:
                  </h5>
                  <p>1. Candidates must bring their Hall Ticket and valid College ID card to the exam hall.</p>
                  <p>2. Candidates are expected to be in the exam hall at least 15 minutes before the commencement of the exam.</p>
                  <p>3. No electronic gadgets, smart watches, mobile phones, or programmable calculators are permitted.</p>
                  <p>4. Write the Register Number correctly on the answer script cover sheet.</p>
                </div>

                {/* Signatures block */}
                <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-150 text-xs text-gray-400 font-semibold">
                  <div className="text-left">
                    <div className="w-32 h-10 border-b border-dashed border-gray-300 mb-2" />
                    <p className="font-bold text-gray-800">Candidate Signature</p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-10 border-b border-dashed border-gray-300 mb-2 mx-auto sm:ml-auto" />
                    <p className="font-bold text-gray-800">Controller of Examinations</p>
                    <p className="text-[10px] uppercase font-black text-gray-400 mt-0.5">APEC (Autonomous)</p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Revaluation Requests Panel */}
            {studentActiveTab === 'revaluation' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-left">
                {/* Left side: Submit Form */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-title mb-1">Apply for Revaluation</h3>
                    <p className="text-xs text-gray-400 font-semibold">Submit scripts for double evaluation check.</p>
                  </div>

                  <form onSubmit={handleRevalSubmit} className="space-y-4">
                    {/* Select Semester */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">Semester</label>
                      <select 
                        value={revalSemInput}
                        onChange={(e) => {
                          setRevalSemInput(e.target.value);
                          // Auto select first subject of new sem
                          const subjects = studentResultProfile.semesters[e.target.value]?.subjects || [];
                          if (subjects.length > 0) setRevalSubjectInput(subjects[0].code);
                        }}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none font-semibold text-slate-800"
                      >
                        {Object.keys(studentResultProfile.semesters).map(sem => (
                          <option key={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select Subject */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">Subject</label>
                      <select 
                        value={revalSubjectInput}
                        onChange={(e) => setRevalSubjectInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none font-semibold text-slate-800"
                      >
                        {currentSemesterSubjects.length > 0 ? (
                          currentSemesterSubjects.map(sub => (
                            <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                          ))
                        ) : (
                          <option value="">No subjects found</option>
                        )}
                      </select>
                    </div>

                    {/* Current Score Display */}
                    {revalSubjectInput && currentSemesterSubjects.find(s => s.code === revalSubjectInput) && (
                      <div className="bg-slate-50 border border-gray-150 p-4 rounded-xl text-xs font-semibold text-gray-600 space-y-1">
                        <div>
                          <span className="text-[9px] font-black uppercase text-gray-400">Current Grade:</span>
                          <span className="text-indigo-655 font-black block text-sm">
                            {currentSemesterSubjects.find(s => s.code === revalSubjectInput).grade} ({currentSemesterSubjects.find(s => s.code === revalSubjectInput).marks} Marks)
                          </span>
                        </div>
                      </div>
                    )}

                    <button 
                      type="submit"
                      className="w-full bg-indigo-655 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Submit Revaluation Request
                    </button>
                  </form>
                </div>

                {/* Right side: Request List */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-title mb-1">My Revaluation Applications</h3>
                    <p className="text-xs text-gray-400 font-semibold">Track submission statuses and evaluator remarks.</p>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                          <th className="px-4 py-3">Submission Date</th>
                          <th className="px-4 py-3">Subject</th>
                          <th className="px-4 py-3 text-center">Score</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">COE Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                        {revalList.filter(r => r.regNo === "4204").map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-mono">{req.date}</td>
                            <td className="px-4 py-3">
                              <span className="font-mono block">{req.code}</span>
                              <span className="text-[10px] text-gray-400 block">{req.name} | {req.sem}</span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-indigo-650">{req.currentGrade} ({req.currentMarks})</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                req.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : req.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                                  : req.status === 'Under Review'
                                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                                  : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 italic text-gray-400 text-left">{req.remarks || 'Under evaluation process'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Result Correction Panel */}
            {studentActiveTab === 'correction' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-left">
                {/* Left side: Submit Form */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-title mb-1">File Grade Discrepancy</h3>
                    <p className="text-xs text-gray-400 font-semibold">Submit reports for grade slip discrepancies.</p>
                  </div>

                  <form onSubmit={handleCorrectSubmit} className="space-y-4">
                    {/* Select Semester */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">Semester</label>
                      <select 
                        value={correctSemInput}
                        onChange={(e) => {
                          setCorrectSemInput(e.target.value);
                          // Auto select first subject
                          const subjects = studentResultProfile.semesters[e.target.value]?.subjects || [];
                          if (subjects.length > 0) setCorrectSubjectInput(subjects[0].code);
                        }}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none font-semibold text-slate-800"
                      >
                        {Object.keys(studentResultProfile.semesters).map(sem => (
                          <option key={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select Subject */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">Subject</label>
                      <select 
                        value={correctSubjectInput}
                        onChange={(e) => setCorrectSubjectInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none font-semibold text-slate-800"
                      >
                        {studentResultProfile.semesters[correctSemInput]?.subjects.map(sub => (
                          <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                        )) || <option value="">No subjects found</option>}
                      </select>
                    </div>

                    {/* Correction Type */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">Correction Type</label>
                      <select 
                        value={correctTypeInput}
                        onChange={(e) => setCorrectTypeInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl outline-none font-semibold text-slate-850"
                      >
                        <option>Marks Discrepancy</option>
                        <option>Grade Mismatch</option>
                        <option>Missing Credits</option>
                        <option>Spelling / Profile Error</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1 font-sans">Issue Description</label>
                      <textarea 
                        value={correctDescInput}
                        onChange={(e) => setCorrectDescInput(e.target.value)}
                        rows="3"
                        placeholder="Detail the marks query..."
                        className="w-full text-xs p-3 bg-slate-50 border border-gray-250 rounded-xl outline-none focus:bg-white font-semibold text-slate-850"
                      />
                    </div>

                    {/* Upload button simulation */}
                    <div>
                      <label className="block text-[9px] uppercase font-black text-gray-405 tracking-wider mb-1.5 font-sans">Supporting Document</label>
                      <div 
                        onClick={() => setAttachedFileName("GradeSlip_Discrepancy_Proof.pdf")}
                        className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer font-bold text-xs text-gray-500"
                      >
                        {attachedFileName ? attachedFileName : "Simulate Proof Upload (e.g. proof.pdf)"}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-indigo-655 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Submit Correction Request
                    </button>
                  </form>
                </div>

                {/* Right side: Request List */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-title mb-1">My Correction Queries</h3>
                    <p className="text-xs text-gray-400 font-semibold">Track validation status and examiner replies.</p>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-gray-450 uppercase text-[9px] font-black tracking-wider">
                          <th className="px-4 py-3">Date Filed</th>
                          <th className="px-4 py-3">Subject & Type</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Attachment</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">COE Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                        {correctList.filter(r => r.regNo === "4204").map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-mono">{req.date}</td>
                            <td className="px-4 py-3">
                              <span className="font-mono block">{req.code}</span>
                              <span className="text-[10px] text-gray-400 block">{req.type} | {req.sem}</span>
                            </td>
                            <td className="px-4 py-3 max-w-[150px] truncate text-left">{req.desc}</td>
                            <td className="px-4 py-3 font-mono text-gray-500">{req.file}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                req.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : req.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                                  : req.status === 'Under Review'
                                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                                  : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 italic text-gray-400 text-left">{req.remarks || 'Awaiting validation checks'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer info note */}
        {viewMode !== 'result' && (
          <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center print-hide flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • ISO 9001:2015 Certified
              <br />
              Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
            </p>
            <Link 
              to="/coe-admin" 
              className="text-[10px] font-black uppercase tracking-wider text-indigo-655 hover:text-indigo-800 hover:underline animate-pulse"
            >
              COE Admin Access
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
