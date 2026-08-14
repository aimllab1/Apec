import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, Users, Award, Briefcase, 
  Search, Mail, GraduationCap, Trophy, 
  BookOpenCheck, UserCheck, Milestone, Library, FileText,
  // New icons for department hero & KPIs
  Cpu, Laptop, BrainCircuit, Zap, Settings, Hammer, FlaskConical, Sprout, Building, ExternalLink, MoreVertical, ChevronDown,
  User, X, CheckCircle2, Calendar, Coins, PartyPopper, MessageCircle, Send, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';
import facultyData from '../ai/knowledge/faculty.json';
import { submitDepartmentFeedback } from '../utils/inquiryService';

// Helper to determine top-right badge (HOD, PRINCIPAL, DEAN)
const getTopRightBadge = (member, currentDept) => {
  const deptStr = ((currentDept || '') + ' ' + (member?.department || '') + ' ' + (member?.department_key || '')).toLowerCase();
  if (deptStr.includes('science') && deptStr.includes('humanities')) {
    return null; // Explicitly remove HOD tag for Science & Humanities department
  }
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 'PRINCIPAL';
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 'HOD';
  if (name.includes('ramasamy')) return 'DEAN';
  return null;
};

// Rank weighting for sorting faculty
const getRankWeight = (member) => {
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 1;
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 2;
  if (name.includes('ramasamy')) return 3;
  const d = (member.designation || '').toLowerCase();
  if (d.includes('professor') && !d.includes('assistant') && !d.includes('associate')) return 4;
  if (d.includes('associate professor')) return 5;
  if (d.includes('assistant professor')) return 6;
  return 7;
};

// Clean academic designation helper (Designation below name)
const formatDesignation = (designation, name) => {
  if (!designation) return 'Professor';
  let d = designation.trim();
  if (/head\s+of\s+(the\s+)?department/gi.test(d) || d.toLowerCase() === 'hod' || d.toLowerCase() === 'professor & head') {
    return 'Professor';
  }
  d = d.replace(/Principal,?\s*/gi, '').replace(/Dean,?\s*/gi, '').replace(/HOD,?\s*/gi, '').replace(/Coordinator,?\s*/gi, '').trim();
  if (!d) return 'Professor';
  return d;
};

const departmentImages = {
  aiml: '/Images/Dept/aiml dept.jpg',
  cse: '/Images/Dept/cse dept.png',
  it: '/Images/Dept/it dept.jpg',
  ece: '/Images/Dept/ece dept.jpg',
  eee: '/Images/Dept/eee dept.jpg',
  mech: '/Images/Dept/mech dept.jpg',
  civil: '/Images/Dept/civil dept.jpg',
  chemical: '/Images/Dept/chem dept.jpg',
  agri: '/Images/Dept/agri dept.jpg',
  aids: '/Images/Dept/ai ds dept.jpg',
  csd: '/Images/Dept/csd  dept.jpg',
  mca: '/Images/Dept/MCA.jpg',
  mba: '/Images/Dept/MBA.jpg',
  'me-cse': '/Images/Dept/me.cse.jpg',
  'me-thermal': '/Images/Dept/me.thermak.jpg',
  'me-vlsi': '/Images/Dept/m.e.vlsi.jpg',
  'me-ped': '/Images/Dept/power-electronics-electrical-drives.jpg',
  'me-cem': '/Images/Dept/m.e.construction engg and mangement.jpg',
  sh: '/Images/Dept/S&H dept.jpg',
  'phd-civil': '/Images/Dept/phd.civil.jpg',
  'phd-mech': '/Images/Dept/phd.mech.jpg',
  'phd-eee': '/Images/Dept/phd.eee.jpg',
  'phd-ece': '/Images/Dept/phd.ece.jpg',
  default: '/Images/Dept/cse dept.png'
};

const normalizeLabs = (department) => {
  if (!department) return department;
  const d = { ...department };
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
};

export default function DepartmentDetail() {
  const { id } = useParams();
  
  // Dynamically load from localStorage config & subscribe to CMS live updates
  const [deptData, setDeptData] = useState(() => {
    const saved = localStorage.getItem('apec_departments_data');
    const data = saved ? JSON.parse(saved) : departmentsData;
    const target = data[id] || data.cse;
    return normalizeLabs(target);
  });

  useEffect(() => {
    const loadDept = () => {
      const saved = localStorage.getItem('apec_departments_data');
      const data = saved ? JSON.parse(saved) : departmentsData;
      if (data[id]) {
        setDeptData(normalizeLabs(data[id]));
      }
    };
    loadDept();
    window.addEventListener('apec_storage_update', loadDept);
    return () => window.removeEventListener('apec_storage_update', loadDept);
  }, [id]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedFacultyMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedFacultyMember]);

  const dept = deptData;
  const deptImage = departmentImages[id] || departmentImages[dept.key] || departmentImages.default;

  // Department icon mapping
  const departmentIcons = {
    aiml: BrainCircuit,
    aids: BrainCircuit,
    cse: Cpu,
    csd: Cpu,
    it: Laptop,
    ece: Zap,
    eee: Zap,
    mech: Settings,
    civil: Hammer,
    chemical: FlaskConical,
    agri: Sprout,
    mca: GraduationCap,
    mba: Briefcase,
    sh: BookOpen,
    'me-cse': Cpu,
    'me-vlsi': Zap,
    'me-ped': Zap,
    'me-thermal': Settings,
    'me-cem': Hammer,
    default: Building
  };

  const DeptIcon = departmentIcons[dept.key] || departmentIcons.default;

  // Department establishment years
  const deptEstYears = {
    civil: "1984",
    mech: "1984",
    eee: "1993",
    ece: "1984",
    cse: "1993",
    it: "2001",
    chemical: "1997",
    aiml: "2023",
    csd: "2021",
    agri: "2021",
    aids: "2022",
    mca: "1998",
    mba: "1995",
    'me-cse': "2009",
    'me-vlsi': "2009",
    'me-ped': "2009",
    'me-thermal': "2009",
    'me-cem': "2006"
  };

  // Attempt to parse establishment year dynamically or use fallback
  const estYearMatch = dept.about ? dept.about.match(/(?:established|started|started in|inception in|year of|est\.)\s+(?:the\s+year\s+(?:of\s+)?)?(\d{4})/i) : null;
  const estYear = deptEstYears[dept.key] || (estYearMatch ? estYearMatch[1] : null);

  // NBA accreditation indicator
  const isNBA = dept.about && (dept.about.includes('NBA') || dept.about.toLowerCase().includes('nba accredited'));

  // Get intake capacities dynamically based on current department
  const deptIntakeCourses = (() => {
    const mapping = {
      civil: [{ name: "B.E. Civil Engineering", duration: "4 Years", seats: 60 }],
      mech: [{ name: "B.E. Mechanical Engineering", duration: "4 Years", seats: 60 }],
      eee: [{ name: "B.E. Electrical and Electronics Engineering", duration: "4 Years", seats: 60 }],
      ece: [{ name: "B.E. Electronics and Communication Engineering", duration: "4 Years", seats: 90 }],
      cse: [{ name: "B.E. Computer Science and Engineering", duration: "4 Years", seats: 90 }],
      it: [{ name: "B.Tech. Information Technology", duration: "4 Years", seats: 60 }],
      chemical: [{ name: "B.Tech. Chemical Engineering", duration: "4 Years", seats: 40 }],
      aiml: [{ name: "B.E. Computer Science & Engineering (Artificial Intelligence and Machine Learning)", duration: "4 Years", seats: 30 }],
      csd: [{ name: "B.E. Computer Science & Engineering (Computer System Design)", duration: "4 Years", seats: 30 }],
      agri: [{ name: "B.Tech. Agricultural Engineering", duration: "4 Years", seats: 40 }],
      aids: [{ name: "B.Tech. Artificial Intelligence and Data Science", duration: "4 Years", seats: 60 }],
      mca: [{ name: "Master of Computer Applications (MCA)", duration: "2 Years", seats: 60 }],
      mba: [{ name: "Master of Business Administration (MBA)", duration: "2 Years", seats: 60 }],
      'me-cse': [{ name: "M.E. Computer Science and Engineering", duration: "2 Years", seats: 9 }],
      'me-vlsi': [{ name: "M.E. VLSI Design", duration: "2 Years", seats: 9 }],
      'me-ped': [{ name: "M.E. Power Electronics & Drives Engineering", duration: "2 Years", seats: 9 }],
      'me-thermal': [{ name: "M.E. Thermal Engineering", duration: "2 Years", seats: 18 }],
      'me-cem': [{ name: "M.E. Construction Engineering and Management", duration: "2 Years", seats: 18 }],
      sh: [{ name: "Science & Humanities", duration: "1 Year", seats: 0, label: "N/A" }],
      'phd-civil': [{ name: "Ph.D. Civil Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-mech': [{ name: "Ph.D. Mechanical Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-ece': [{ name: "Ph.D. Electronics and Communication Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-eee': [{ name: "Ph.D. Electrical and Electronics Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
    };
    return mapping[dept.key] || [{ name: dept.name, duration: "4 Years", seats: 60 }];
  })();

  // Calculate total intake seats dynamically from the courses array
  const totalSeats = deptIntakeCourses.reduce((sum, course) => sum + course.seats, 0);
  const displayIntakeValue = totalSeats > 0 ? totalSeats : (deptIntakeCourses[0]?.seats === 0 && dept.key.startsWith('phd-') ? "Vacancy" : "N/A");
  const displayIntakeLabel = totalSeats > 0 ? "Intake Capacity" : (dept.key.startsWith('phd-') ? "Based on Vacancy" : "Intake Capacity");

  // Local state for tabs
  const [activeSubTab, setActiveSubTab] = useState('overview');
  // Local state for more dropdown
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  // Local state for faculty search
  const [facultySearch, setFacultySearch] = useState('');
  // Local state for publication search
  const [pubSearch, setPubSearch] = useState('');
  // Local state for selected faculty member details modal
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null);

  // Local state for sub-publication tabs (journals, books, conferences)
  const [activePubType, setActivePubType] = useState('journals');

  // Local state for event tabs & feedback form
  const [activeEventSubTab, setActiveEventSubTab] = useState('hosted');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', section: 'General Feedback', email: '', phone: '', message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Build Faculty Image Lookup Map from departmentsData
  const facultyImageMap = React.useMemo(() => {
    const map = {
      'dr. m. vivekanandhan': '/Images/Faculty/vivekandhan.jpg',
      'dr. vivekanandhan m': '/Images/Faculty/vivekandhan.jpg'
    };
    if (departmentsData) {
      Object.values(departmentsData).forEach(deptObj => {
        if (deptObj && Array.isArray(deptObj.faculty)) {
          deptObj.faculty.forEach(f => {
            if (f.name && f.image) {
              map[f.name.toLowerCase().trim()] = f.image;
            }
          });
        }
      });
    }
    return map;
  }, []);

  // Build Faculty ORCID Lookup Map from departmentsData
  const facultyOrcidMap = React.useMemo(() => {
    const map = {};
    const savedCMS = localStorage.getItem('apec_departments_data');
    let depts = departmentsData;
    if (savedCMS) {
      try { depts = JSON.parse(savedCMS); } catch (e) {}
    }
    if (depts) {
      Object.values(depts).forEach(deptObj => {
        if (deptObj && Array.isArray(deptObj.faculty)) {
          deptObj.faculty.forEach(f => {
            if (f.name && f.orcid) {
              map[f.name.toLowerCase().trim()] = f.orcid;
            }
          });
        }
      });
    }
    return map;
  }, []);

  // Filtered and Sorted Faculty using the central facultyData
  const filteredFaculty = React.useMemo(() => {
    if (!dept || !dept.name) return [];
    const targetDeptLower = dept.name.toLowerCase().trim();

    // First filter by current department
    let list = facultyData.filter(member => {
      const memberDept = (member.department || '').trim().toLowerCase();
      const memberKey = (member.department_key || '').trim().toLowerCase();

      // Check MCA matching
      if (targetDeptLower.includes('mca') || targetDeptLower.includes('computer applications')) {
        return memberDept.includes('mca') || memberDept.includes('computer applications') || memberKey === 'mca';
      }

      // Check S&H matching
      if (targetDeptLower.includes('science') && targetDeptLower.includes('humanities')) {
        return memberDept === 'science & humanities' || memberKey === 'sh';
      }

      // Standard matching logic
      const isMatch = memberDept === targetDeptLower || 
                      targetDeptLower.includes(memberDept) || 
                      memberDept.includes(targetDeptLower) ||
                      (memberKey && targetDeptLower.includes(memberKey)) ||
                      (dept.key && memberKey === dept.key.toLowerCase());

      return isMatch;
    });

    // Then filter by search input
    if (facultySearch.trim()) {
      const query = facultySearch.toLowerCase().trim();
      list = list.filter(f => 
        f.name.toLowerCase().includes(query) ||
        (f.qualification || '').toLowerCase().includes(query) ||
        (f.designation || '').toLowerCase().includes(query)
      );
    }

    // Sort by Academic Hierarchy
    list.sort((a, b) => getRankWeight(a) - getRankWeight(b));

    return list;
  }, [dept, facultySearch]);

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Department Not Found</h2>
          <Link to="/departments" className="text-indigo-600 hover:underline text-sm font-bold">Back to Departments</Link>
        </div>
      </div>
    );
  }

  // Filtered Journals
  const filteredJournals = (dept.publications?.journals || []).filter(j => 
    j.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.author.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.journal.toLowerCase().includes(pubSearch.toLowerCase())
  );

  // More options structure
  const moreOptions = [
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'curriculum', label: 'PEOs / PSOs / POs', icon: Milestone },
    { id: 'syllabus', label: 'Curriculum & Syllabus', icon: BookOpenCheck },
    { id: 'labs', label: 'Facilities', icon: Library },
    { id: 'calendar', label: 'Academic Calendar', icon: Clock },
    { id: 'achievements', label: 'Placement Details', icon: Briefcase },
    { id: 'funds', label: 'Funds Received', icon: Award },
    { id: 'events', label: 'Events', icon: Trophy },
    { id: 'newsletter', label: 'Newsletter', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link & Title */}
        <div className="mb-8 flex flex-col items-start gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link 
              to="/departments" 
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-550 hover:text-indigo-650 transition-colors bg-white hover:bg-gray-50 border border-gray-200/80 px-4 py-2 rounded-full shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tight mt-2"
            style={{ fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            {dept.name.replace(/^Department of\s+/i, '')}
          </motion.h1>

          {/* Mobile Mini-Navbar (Enlarged & Centered) */}
          <div className="relative mt-3 w-full flex items-center justify-center gap-3 md:hidden max-w-sm sm:max-w-md mx-auto">
            {/* Overview Button */}
            <button
              onClick={() => {
                setActiveSubTab('overview');
                setFacultySearch('');
                setPubSearch('');
                setIsMoreOpen(false);
              }}
              className={`flex-1 shrink-0 flex flex-row items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm border ${
                activeSubTab === 'overview' 
                  ? 'bg-indigo-650 text-white border-indigo-650' 
                  : 'bg-white text-gray-600 border-gray-200 hover:text-indigo-650 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            {/* More Dropdown */}
            <div className="relative flex-1 shrink-0">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`w-full flex flex-row items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm border ${
                  (activeSubTab !== 'overview' || isMoreOpen)
                    ? 'bg-white text-indigo-650 border-indigo-200' 
                    : 'bg-white text-gray-600 border-gray-200 hover:text-indigo-650 hover:bg-gray-50'
                }`}
              >
                <MoreVertical className="w-4 h-4 shrink-0" />
                <span className="truncate">{activeSubTab !== 'overview' ? moreOptions.find(o => o.id === activeSubTab)?.label || 'More' : 'More'}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Overlay to close dropdown */}
              {isMoreOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMoreOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                  >
                    {moreOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveSubTab(opt.id);
                            setFacultySearch('');
                            setPubSearch('');
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors ${
                            activeSubTab === opt.id 
                              ? 'text-indigo-650 bg-indigo-50/50' 
                              : 'text-gray-600 hover:text-indigo-650 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Light-Theme Mini-Navbar */}
          <div className="hidden md:flex items-center gap-2 bg-white text-slate-800 p-2 rounded-2xl shadow-md border border-slate-200/90 w-full mt-3">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'faculty', label: 'Faculty Directory', icon: Users },
              { id: 'curriculum', label: 'PEOs / PSOs / POs', icon: Milestone },
              { id: 'syllabus', label: 'Syllabus', icon: BookOpenCheck },
              { id: 'labs', label: 'Facilities', icon: Library },
              { id: 'achievements', label: 'Placements', icon: Briefcase }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setFacultySearch('');
                    setPubSearch('');
                    setIsMoreOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap grow justify-center ${
                    isActive 
                      ? 'bg-indigo-650 text-white shadow-md font-black' 
                      : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Desktop More Options Dropdown (Light Theme) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  ['calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(activeSubTab) || isMoreOpen
                    ? 'bg-indigo-650 text-white shadow-md'
                    : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
                <span>{['calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(activeSubTab) ? moreOptions.find(o => o.id === activeSubTab)?.label : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMoreOpen(false)}
                />
              )}

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                  >
                    {moreOptions.filter(o => ['calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(o.id)).map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveSubTab(opt.id);
                            setFacultySearch('');
                            setPubSearch('');
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-extrabold transition-colors ${
                            activeSubTab === opt.id 
                              ? 'text-indigo-650 bg-indigo-50/70' 
                              : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-indigo-650" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <AnimatePresence>
          {activeSubTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 rounded-3xl mb-12 flex flex-col gap-8 hover:shadow-md transition-shadow duration-300 animate-fadeIn"
            >
          {/* Top Row: Image & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Department Image */}
            <div className="w-full h-64 sm:h-72 md:h-auto min-h-[320px] md:col-span-5 rounded-2xl overflow-hidden shadow-sm relative group">
              <img 
                src={deptImage} 
                alt={`${dept.name} Department`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right Column: Title, Details, and KPIs */}
            <div className="flex flex-col justify-between items-start text-left md:col-span-7 space-y-8 w-full h-full py-2">
              <div className="space-y-5 w-full">
                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase">
                    Department Portal
                  </span>
                  {estYear && (
                    <span className="text-[10px] font-extrabold tracking-widest text-gray-650 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full uppercase">
                      Est. {estYear}
                    </span>
                  )}
                  {isNBA ? (
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase animate-pulse">
                      NBA Accredited
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-full uppercase">
                      AICTE Approved
                    </span>
                  )}
                </div>
                
                {/* Department Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-title tracking-tight text-gray-900 leading-tight">
                  {dept.name.replace(/^Department of\s+/i, '')}
                </h1>
                
                {/* College & Location */}
                <p className="text-xs sm:text-sm md:text-base text-gray-550 font-bold leading-relaxed flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                    Adhiparasakthi Engineering College
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                    Melmaruvathur
                  </span>
                </p>
              </div>

              {/* KPI Cards (Laboratories and Intake Capacity) */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-auto"
              >
                {/* KPI 1: Laboratories */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="group bg-gradient-to-br from-blue-50/60 to-indigo-50/20 backdrop-blur-md border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
                >
                  <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                    <FlaskConical className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">{(dept.labs || []).length}</span>
                    <span className="text-[10px] font-black uppercase text-blue-750 tracking-wider">Laboratories</span>
                  </div>
                </motion.div>

                {/* KPI 2: Intake Capacity */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="group bg-gradient-to-br from-amber-50/60 to-orange-50/20 backdrop-blur-md border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
                >
                  <div className="bg-amber-600 text-white p-3.5 rounded-xl shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform duration-300">
                    <GraduationCap className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent tracking-tight">
                      {displayIntakeValue}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-750 tracking-wider">
                      {displayIntakeLabel}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* TAB 1: OVERVIEW */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* About Block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 font-title text-indigo-650 flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> About the Department
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                      {dept.about}
                    </p>
                  </div>

                  {/* Vision & Mission Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                    {/* Vision Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                          <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Vision
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-semibold italic">
                          "{dept.vision}"
                        </p>
                      </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                        <UserCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Mission
                      </h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {dept.mission.map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex items-start gap-2 sm:gap-2.5 font-semibold">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>


                </div>
              )}

              {/* TAB 2: FACULTY DIRECTORY */}
              {activeSubTab === 'faculty' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 text-left self-start sm:self-auto">
                      <Users className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Faculty Directory
                    </h2>
                    
                    {/* Faculty search */}
                    <div className="relative w-full sm:max-w-xs">
                      <input 
                        type="text"
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        placeholder="Search faculty..."
                        className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 pl-9 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-medium text-gray-800"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {filteredFaculty.length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No faculty members found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left">
                      {filteredFaculty.map((f, idx) => {
                        const photoSrc = f.image || facultyImageMap[f.name?.toLowerCase().trim()] || null;
                        const topRightBadge = getTopRightBadge(f, dept.name);

                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedFacultyMember(f)}
                            className={`bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                              topRightBadge === 'PRINCIPAL'
                                ? 'border-[#FF8A00] ring-1 ring-amber-400/60'
                                : topRightBadge === 'HOD'
                                ? 'border-amber-300 ring-1 ring-amber-200/60'
                                : topRightBadge === 'DEAN'
                                ? 'border-indigo-300 ring-1 ring-indigo-200/60'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            {/* Background soft blurs for premium aesthetic */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100/50 transition-colors" />

                            {/* Left side: Image / Fallback Avatar */}
                            <div className="relative shrink-0 w-20 h-20 sm:w-32 sm:h-32 rounded-full sm:rounded-2xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex items-center justify-center">
                              <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-650 font-bold">
                                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-650" />
                              </div>
                              {photoSrc && (
                                <img 
                                  src={photoSrc} 
                                  alt={f.name} 
                                  className="absolute inset-0 w-full h-full object-cover object-top z-10 group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>

                            {/* Right side: Information */}
                            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start justify-between py-0.5 self-stretch text-center sm:text-left">
                              <div className="w-full flex flex-col items-center sm:items-start">
                                <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 mb-1 w-full flex-wrap">
                                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <h4 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 leading-snug group-hover:text-indigo-650 transition-colors">{f.name}</h4>
                                    {f.qualification && (
                                      <span className="text-[9px] font-black bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-650 uppercase font-mono tracking-wider shrink-0 mt-0.5 sm:mt-0">
                                        {f.qualification}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {topRightBadge && (
                                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs border ${
                                      topRightBadge === 'PRINCIPAL'
                                        ? 'bg-[#FF8A00] text-white border-amber-600 font-black'
                                        : topRightBadge === 'HOD' 
                                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                        : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                    }`}>
                                      {topRightBadge}
                                    </span>
                                  )}
                                </div>
                                
                                <span className="text-[11px] sm:text-xs md:text-sm text-indigo-650 font-extrabold uppercase tracking-wider block mb-1">
                                  {formatDesignation(f.designation, f.name)}
                                </span>
                                
                                {f.department && (
                                  <span className="text-xs sm:text-sm text-gray-550 font-bold block mb-3 leading-relaxed">
                                    {f.department}
                                  </span>
                                )}
                              </div>

                              {/* Contact/Options & Additional Metadata */}
                              <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-gray-100 w-full">
                                <div className="flex items-center gap-4">
                                  {f.experience && f.experience !== 'N/A' && (
                                    <div className="text-[10px] sm:text-xs text-gray-550 font-extrabold flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      <span>Exp: {f.experience.split(',')[0]}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-extrabold text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity">View Profile &rarr;</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LABORATORIES */}
              {activeSubTab === 'labs' && (
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-6 sm:mb-8 text-left">
                    <Library className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Infrastructure & Laboratories
                  </h2>

                  {(dept.labs || []).length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No laboratories information currently available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
                      {dept.labs.map((lab, idx) => {
                        const isObj = typeof lab === 'object' && lab !== null;
                        if (!isObj) {
                          return (
                            <div 
                              key={idx}
                              className="p-4 sm:p-6 bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all duration-300 text-left"
                            >
                              <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                                <Library className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
                              </div>
                              <div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">Laboratory {String(idx + 1).padStart(2, '0')}</span>
                                <h4 className="text-xs sm:text-sm md:text-base font-black text-gray-800 leading-relaxed">{lab}</h4>
                              </div>
                            </div>
                          );
                        }

                        const name = lab.name || 'Unnamed Facility';
                        const type = lab.type || 'laboratory';
                        const incharge = lab.incharge || '';
                        const desc = lab.description || '';
                        
                        let images = [];
                        if (Array.isArray(lab.images)) {
                          images = lab.images.filter(img => typeof img === 'string' && img.trim() !== '');
                        } else if (typeof lab.image === 'string' && lab.image.trim() !== '') {
                          images = [lab.image];
                        }

                        let FacilityIcon = Library;
                        if (type === 'classroom') FacilityIcon = Laptop;
                        else if (type === 'laboratory') FacilityIcon = FlaskConical;
                        else if (type === 'library') FacilityIcon = BookOpen;

                        return (
                          <div 
                            key={idx}
                            className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between hover:border-indigo-300 hover:shadow-md hover:bg-white transition-all duration-300 space-y-4 text-left"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2 rounded-xl shrink-0">
                                  <FacilityIcon className="w-5 h-5 text-indigo-650" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-indigo-50 text-indigo-650 border border-indigo-100/50 px-2 py-0.5 rounded-full tracking-wider">
                                  {type}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm md:text-base font-black text-gray-850 leading-snug">{name}</h4>
                                {incharge && (
                                  <p className="text-[10px] text-indigo-650 font-bold mt-1">
                                    In-Charge: <span className="text-gray-600 font-semibold">{incharge}</span>
                                  </p>
                                )}
                                {desc && (
                                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1.5 leading-relaxed">{desc}</p>
                                )}
                              </div>
                            </div>

                            {images.length > 0 && (
                              <div className="pt-2 shrink-0">
                                {images.length === 1 ? (
                                  <img 
                                    src={images[0]} 
                                    alt={name} 
                                    className="w-full h-32 sm:h-36 object-cover rounded-xl border border-gray-150" 
                                  />
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    {images.slice(0, 4).map((img, imgIdx) => (
                                      <div key={imgIdx} className="relative h-16 sm:h-20 rounded-xl overflow-hidden border border-gray-150">
                                        <img 
                                          src={img} 
                                          alt={`${name} ${imgIdx + 1}`} 
                                          className="w-full h-full object-cover" 
                                        />
                                        {imgIdx === 3 && images.length > 4 && (
                                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                                            +{images.length - 4} More
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CURRICULUM OBJECTIVES */}
              {activeSubTab === 'curriculum' && (
                <div className="space-y-6 sm:space-y-10 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <Milestone className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-650" /> PEOs / PSOs / POs
                  </h2>
                  
                  {/* PEOs & PSOs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* PEOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Educational Objectives (PEOs)
                      </h3>
                      {(!dept.peos || dept.peos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold">PEOs are in alignment with university structures.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.peos.map((peo, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>
                                {typeof peo === 'object' && peo !== null ? (
                                  <div>
                                    <span className="font-extrabold text-gray-900 block">
                                      {peo.code || `PEO${idx + 1}`}: {peo.title}
                                    </span>
                                    {peo.description && (
                                      <span className="text-xs text-gray-600 font-normal block mt-1 leading-relaxed">
                                        {peo.description}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span>{typeof peo === 'string' ? peo : (peo.title || peo.description || JSON.stringify(peo))}</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* PSOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Specific Outcomes (PSOs)
                      </h3>
                      {(!dept.psos || dept.psos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-550 font-semibold">PSOs are configured as per program focus.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.psos.map((pso, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>
                                {typeof pso === 'object' && pso !== null ? (
                                  <div>
                                    <span className="font-extrabold text-gray-900 block">
                                      {pso.code || `PSO${idx + 1}`}: {pso.title}
                                    </span>
                                    {pso.description && (
                                      <span className="text-xs text-gray-600 font-normal block mt-1 leading-relaxed">
                                        {pso.description}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span>{typeof pso === 'string' ? pso : (pso.title || pso.description || JSON.stringify(pso))}</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* POs */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Outcomes (POs)
                    </h3>
                    {(!dept.pos || dept.pos.length === 0) ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold">Standard engineering program outcomes apply.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {dept.pos.map((po, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:border-indigo-300 transition-all shadow-sm"
                          >
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">
                              PO {idx + 1} {po.title ? `• ${po.title}` : ''}
                            </span>
                            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-semibold">
                              {po.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4.5: SYLLABUS & CURRICULUM */}
              {activeSubTab === 'syllabus' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-3">
                          Academic Curriculum & Regulations
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black font-title text-white">
                          {dept.syllabus?.title || `${dept.name} Curriculum & Syllabus`}
                        </h2>
                        <p className="text-xs sm:text-sm text-indigo-200/80 mt-2 max-w-2xl font-medium leading-relaxed">
                          {dept.syllabus?.description || 'Explore the comprehensive semester-wise course scheme, regulation guidelines, and core subject credit distribution.'}
                        </p>
                      </div>
                      {dept.syllabus?.link && (
                        <a
                          href={dept.syllabus.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Download className="w-4 h-4" /> Download Syllabus PDF
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Semester Scheme Overview */}
                  <div className="bg-gray-50 border border-gray-150 p-6 sm:p-8 rounded-3xl space-y-4">
                    <h3 className="text-lg font-black text-indigo-950 font-title flex items-center gap-2">
                      <BookOpenCheck className="w-5 h-5 text-indigo-650" /> Semester Scheme & Subject Structure
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                      The program follows AICTE & Anna University model curriculum covering Professional Core, Professional Electives, Open Electives, and Employability Enhancement Courses.
                    </p>
                    {dept.syllabus?.link ? (
                      <div className="pt-2">
                        <a 
                          href={dept.syllabus.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-650 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> View Full Regulation PDF Document
                        </a>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold">
                        The updated syllabus document for this department can be downloaded from the HOD desk or central college portal.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: PUBLICATIONS */}
              {activeSubTab === 'publications' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 sm:mb-8 text-left">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2">
                        <BookOpenCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Research Publications
                      </h2>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 uppercase font-black tracking-wider">Journals, books, and conference proceedings</p>
                    </div>

                    {/* Sub-tabs for publication types */}
                    <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-xl sm:rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
                      {[
                        { id: 'journals', label: `Journals (${(dept.publications?.journals || []).length})` },
                        { id: 'books', label: `Books (${(dept.publications?.books || []).length})` },
                        { id: 'conferences', label: `Conferences (${(dept.publications?.conferences || []).length})` }
                      ].map(pType => (
                        <button
                          key={pType.id}
                          onClick={() => {
                            setActivePubType(pType.id);
                            setPubSearch('');
                          }}
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap ${
                            activePubType === pType.id 
                              ? 'bg-indigo-650 text-white shadow-md' 
                              : 'text-gray-650 hover:text-indigo-650 hover:bg-gray-150'
                          }`}
                        >
                          {pType.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Publications lists */}
                  <div className="bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
                    {activePubType === 'journals' && (
                      <div>
                        {(!dept.publications?.journals || dept.publications.journals.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No journal articles listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Title of Paper</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 px-4">Journal</th>
                                    <th className="pb-3.5 px-4 text-center">Year</th>
                                    <th className="pb-3.5 pl-4 text-right">Link</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.journals.map((j, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{j.title}</td>
                                      <td className="py-4 px-4 text-gray-650 leading-normal max-w-[120px]">{j.author}</td>
                                      <td className="py-4 px-4 text-indigo-650 max-w-[150px] leading-normal italic">{j.journal}</td>
                                      <td className="py-4 px-4 text-center text-gray-500 font-mono">{j.year}</td>
                                      <td className="py-4 pl-4 text-right">
                                        {j.link && j.link.startsWith('http') ? (
                                          <a 
                                            href={j.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-750 font-bold hover:underline inline-flex items-center gap-1"
                                          >
                                            View <FileText className="w-3.5 h-3.5" />
                                          </a>
                                        ) : (
                                          <span className="text-gray-400 font-bold">—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.journals.map((j, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Journal Paper
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{j.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {j.author}</p>
                                    <p><span className="font-bold text-gray-400">Journal:</span> <span className="italic text-indigo-650">{j.journal}</span></p>
                                    <p><span className="font-bold text-gray-400">Year:</span> <span className="font-mono">{j.year}</span></p>
                                  </div>

                                  {j.link && j.link.startsWith('http') && (
                                    <div className="pt-2 border-t border-gray-100">
                                      <a 
                                        href={j.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-bold text-xs py-2 rounded-lg transition-colors"
                                      >
                                        View Document <FileText className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'books' && (
                      <div>
                        {(!dept.publications?.books || dept.publications.books.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No books published.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Book Title</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 pl-4 text-right">Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.books.map((b, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold max-w-xs">{b.title}</td>
                                      <td className="py-4 px-4 text-gray-600">{b.author}</td>
                                      <td className="py-4 pl-4 text-right text-indigo-650 italic max-w-xs">{b.publisher}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.books.map((b, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-2">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Book Title
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{b.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-655 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {b.author}</p>
                                    <p><span className="font-bold text-gray-400">Publisher:</span> <span className="italic text-indigo-650">{b.publisher}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'conferences' && (
                      <div>
                        {(!dept.publications?.conferences || dept.publications.conferences.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No conference proceedings listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Paper Title</th>
                                    <th className="pb-3.5 px-4">Faculty Member</th>
                                    <th className="pb-3.5 px-4">Conference Proceeding</th>
                                    <th className="pb-3.5 pl-4 text-right">ISBN / Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.conferences.map((c, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{c.paperTitle || '—'}</td>
                                      <td className="py-4 px-4 text-gray-600">{c.faculty}</td>
                                      <td className="py-4 px-4 text-indigo-650 italic max-w-xs">{c.proceeding}</td>
                                      <td className="py-4 pl-4 text-right text-gray-550 font-mono max-w-[150px]">
                                        {c.isbn ? `ISBN: ${c.isbn}` : ''} {c.publisher ? ` [${c.publisher}]` : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.conferences.map((c, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Conference
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{c.paperTitle || '—'}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Faculty:</span> {c.faculty}</p>
                                    <p><span className="font-bold text-gray-400">Proceeding:</span> <span className="italic text-indigo-650">{c.proceeding}</span></p>
                                    {c.isbn && <p><span className="font-bold text-gray-400">ISBN:</span> <span className="font-mono text-xs">{c.isbn}</span></p>}
                                    {c.publisher && <p><span className="font-bold text-gray-400">Publisher:</span> {c.publisher}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PLACEMENTS & ACHIEVEMENTS */}
              {activeSubTab === 'achievements' && (
                <div className="space-y-8 sm:space-y-10 text-left">
                  
                  {/* placements block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl space-y-6">
                    <h3 className="text-lg sm:text-xl font-black text-indigo-650 font-title flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Student Placement Records & Highlights
                    </h3>

                    {/* Placement Banner Image */}
                    {typeof dept.placements === 'object' && !Array.isArray(dept.placements) && dept.placements?.image && (
                      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md max-h-80 w-full bg-slate-900">
                        <img 
                          src={dept.placements.image} 
                          alt="Placement Highlights" 
                          className="w-full h-full object-cover max-h-80"
                        />
                      </div>
                    )}

                    {/* Placement Description & Key Metrics */}
                    {typeof dept.placements === 'object' && !Array.isArray(dept.placements) && (
                      <div className="space-y-4">
                        {dept.placements.description && (
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold bg-white p-4 rounded-2xl border border-gray-200">
                            {dept.placements.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Placement Rate</span>
                            <span className="text-2xl font-black text-emerald-650 block mt-1">{dept.placements.rate || '94%'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Highest Package</span>
                            <span className="text-2xl font-black text-indigo-650 block mt-1">{dept.placements.highestPackage || '12 LPA'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Average Package</span>
                            <span className="text-2xl font-black text-blue-650 block mt-1">{dept.placements.averagePackage || '4.5 LPA'}</span>
                          </div>
                        </div>

                        {dept.placements.topRecruiters && (
                          <div className="p-4 bg-white rounded-2xl border border-gray-200">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Key Recruiting Partners</span>
                            <div className="flex flex-wrap gap-2">
                              {dept.placements.topRecruiters.split(',').map((rec, rIdx) => (
                                <span key={rIdx} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-900 font-extrabold text-xs rounded-full">
                                  {rec.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {Array.isArray(dept.placements) && (dept.placements.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold text-center py-6 sm:py-8">First-batch students currently building projects; placements commencing soon.</p>
                    ) : (
                      <div>
                        {/* Desktop Table view */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-xs md:text-sm text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                <th className="pb-3.5 pr-4">Register Number</th>
                                <th className="pb-3.5 px-4">Student Name</th>
                                <th className="pb-3.5 px-4">Recruiter / Employer</th>
                                <th className="pb-3.5 pl-4 text-right">Compensation Package</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                              {dept.placements.map((p, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                  <td className="py-3 pr-4 text-gray-500 font-mono">{p.registerNumber}</td>
                                  <td className="py-3 px-4 text-gray-900 font-bold">{p.studentName}</td>
                                  <td className="py-3 px-4 text-indigo-650">{p.companyName}</td>
                                  <td className="py-3 pl-4 text-right text-emerald-650 font-bold">{p.salaryPackage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile responsive view */}
                        <div className="block sm:hidden space-y-4">
                          {dept.placements.map((p, idx) => (
                            <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{p.studentName}</h4>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{p.registerNumber}</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                                  {p.salaryPackage}
                                </span>
                              </div>
                              
                              <div className="text-xs pt-2 border-t border-gray-100 flex items-center justify-between text-gray-655">
                                <span>Employer / Recruiter</span>
                                <span className="font-bold text-indigo-650">{p.companyName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* toppers & university ranks grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* University Rank Holders */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Trophy className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> University Rank Holders
                      </h3>
                      {(!dept.rankHolders || dept.rankHolders.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-555 font-semibold text-center py-4 sm:py-6">Ranks are aggregated annually by affiliated university.</p>
                      ) : (
                        <div>
                          {/* Desktop Table view */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-xs md:text-sm text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                  <th className="pb-3 pr-4 text-center">Year</th>
                                  <th className="pb-3 px-4">Student Name</th>
                                  <th className="pb-3 pl-4 text-right">University Rank</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                {dept.rankHolders.map((r, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-2.5 pr-4 text-center text-gray-500 font-mono">{r.academicYear}</td>
                                    <td className="py-2.5 px-4 text-gray-900 font-bold">{r.studentName}</td>
                                    <td className="py-2.5 pl-4 text-right text-amber-650 font-black">Rank {r.rank}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile responsive view */}
                          <div className="block sm:hidden space-y-3">
                            {dept.rankHolders.map((r, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{r.studentName}</h4>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">Academic Year: {r.academicYear}</p>
                                </div>
                                <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                                  Rank {r.rank}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Semester Toppers */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Department Toppers
                      </h3>
                      {(!dept.toppers || dept.toppers.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-550 font-semibold text-center py-4 sm:py-6">Toppers data are updated following end-semester examinations.</p>
                      ) : (
                        <div>
                          {/* Desktop Table view */}
                          <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-xs md:text-sm text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                  <th className="pb-3 pr-4">Student Name</th>
                                  <th className="pb-3 px-4">Year/Sem</th>
                                  <th className="pb-3 px-4 text-center">GPA</th>
                                  <th className="pb-3 pl-4 text-right">Topper Position</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                {dept.toppers.map((t, idx) => (
                                  <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-2.5 pr-4 text-gray-900 font-bold">{t.studentName}</td>
                                    <td className="py-2.5 px-4 text-gray-550">{t.yearSem}</td>
                                    <td className="py-2.5 px-4 text-center text-indigo-650 font-bold">{t.gpa}</td>
                                    <td className="py-2.5 pl-4 text-right text-amber-600 font-bold">Topper {t.rank}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile responsive view */}
                          <div className="block sm:hidden space-y-4">
                            {dept.toppers.map((t, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">{t.studentName}</h4>
                                    <p className="text-[10px] text-gray-550 mt-0.5">{t.yearSem}</p>
                                  </div>
                                  <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                                    Topper {t.rank}
                                  </span>
                                </div>
                                
                                <div className="text-xs pt-2 border-t border-gray-100 flex items-center justify-between text-gray-650">
                                  <span>GPA Score</span>
                                  <span className="font-bold text-indigo-650 text-sm">{t.gpa}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 7: FUNDS RECEIVED & RESEARCH GRANTS */}
              {activeSubTab === 'funds' && (
                <div className="space-y-6 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /> Funds Received & Research Grants
                  </h2>
                  {(!dept.grants || dept.grants.length === 0) ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No external funding records logged for this department yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {dept.grants.map((g, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 hover:border-indigo-300 transition-all shadow-xs">
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-800 text-[10px] font-black uppercase rounded-full">
                              {g.agency || 'Funding Agency'}
                            </span>
                            <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              {g.amount || '—'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug">{g.title}</h4>
                          <div className="text-xs text-gray-600 space-y-1 font-medium pt-2 border-t border-gray-200">
                            <p><span className="font-bold text-gray-500">Principal Investigator:</span> {g.pi}</p>
                            <p><span className="font-bold text-gray-500">Sanction Period:</span> {g.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: HOSTED & ATTENDED EVENTS */}
              {activeSubTab === 'events' && (
                <div className="space-y-6 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2">
                      <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" /> Department Events & Activities
                    </h2>
                    
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                      <button
                        onClick={() => setActiveEventSubTab('hosted')}
                        className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                          activeEventSubTab === 'hosted' ? 'bg-indigo-650 text-white shadow-xs' : 'text-gray-600 hover:text-indigo-650'
                        }`}
                      >
                        🎪 Hosted Events ({(dept.hostedEvents || []).length})
                      </button>
                      <button
                        onClick={() => setActiveEventSubTab('attended')}
                        className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                          activeEventSubTab === 'attended' ? 'bg-indigo-650 text-white shadow-xs' : 'text-gray-600 hover:text-indigo-650'
                        }`}
                      >
                        🎓 Attended Events ({(dept.attendedEvents || []).length})
                      </button>
                    </div>
                  </div>

                  {activeEventSubTab === 'hosted' && (
                    (!dept.hostedEvents || dept.hostedEvents.length === 0) ? (
                      <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                        No department-hosted events published yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dept.hostedEvents.map((ev, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                            {ev.image && (
                              <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                                  {ev.date}
                                </div>
                              </div>
                            )}
                            <div className="p-6 space-y-3">
                              <span className="text-[10px] font-black uppercase text-pink-650 tracking-wider">Hosted Symposium / Workshop</span>
                              <h3 className="text-base font-black text-gray-900 leading-snug">{ev.name}</h3>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed">{ev.description}</p>
                              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 font-medium space-y-1">
                                {ev.venue && <p>📍 <span className="font-bold text-gray-700">Venue:</span> {ev.venue}</p>}
                                {ev.speaker && <p>🎤 <span className="font-bold text-gray-700">Keynote / Resource Person:</span> {ev.speaker}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeEventSubTab === 'attended' && (
                    (!dept.attendedEvents || dept.attendedEvents.length === 0) ? (
                      <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                        No external attended events logged yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dept.attendedEvents.map((ev, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                            {ev.image && (
                              <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                                  {ev.date}
                                </div>
                              </div>
                            )}
                            <div className="p-6 space-y-3">
                              <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider">External FDP / Participation</span>
                              <h3 className="text-base font-black text-gray-900 leading-snug">{ev.name}</h3>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed">{ev.description}</p>
                              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 font-medium space-y-1">
                                {ev.hostOrg && <p>🏛️ <span className="font-bold text-gray-700">Host Organization:</span> {ev.hostOrg}</p>}
                                {ev.participant && <p>👤 <span className="font-bold text-gray-700">Participants:</span> {ev.participant}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* TAB 9: DEPARTMENT NEWSLETTERS (PDF) */}
              {activeSubTab === 'newsletter' && (
                <div className="space-y-6 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /> Department Newsletters & Magazines
                  </h2>
                  {(!dept.newsletters || dept.newsletters.length === 0) ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No newsletter PDF documents published for this department yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dept.newsletters.map((nl, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 p-6 rounded-3xl space-y-4 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black uppercase rounded-full">
                              {nl.date || 'Newsletter Issue'}
                            </span>
                            <h3 className="text-lg font-black text-gray-900 leading-snug">{nl.title}</h3>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{nl.summary || 'Click below to read and download the full department newsletter PDF document.'}</p>
                          </div>
                          {nl.link ? (
                            <a
                              href={nl.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                            >
                              <Download className="w-4 h-4" /> Click to Open Newsletter (PDF)
                            </a>
                          ) : (
                            <div className="p-3 bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl text-center">PDF document coming soon</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: DEPARTMENT FEEDBACK FORM */}
              {activeSubTab === 'feedback' && (
                <div className="space-y-6 text-left max-w-2xl mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> Share Department Feedback
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Your feedback is submitted directly to the {dept.name} Head of Department (HOD) desk.</p>
                  </div>

                  {feedbackSent ? (
                    <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h3 className="text-lg font-black text-emerald-900">Feedback Submitted Successfully!</h3>
                      <p className="text-xs text-emerald-700 font-medium">Thank you for sharing your valuable input. The HOD has received your response.</p>
                      <button
                        onClick={() => {
                          setFeedbackSent(false);
                          setFeedbackForm({ name: '', section: 'General Feedback', email: '', phone: '', message: '' });
                        }}
                        className="px-5 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Submit Another Response
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await submitDepartmentFeedback({
                          ...feedbackForm,
                          dept: dept.name,
                          department: dept.name
                        });
                        setFeedbackSent(true);
                      }}
                      className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Your Full Name</label>
                        <input 
                          type="text"
                          required
                          value={feedbackForm.name}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                          placeholder="Student / Parent / Alumni Name"
                          className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Stakeholder Section</label>
                          <select
                            value={feedbackForm.section}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, section: e.target.value })}
                            className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650 cursor-pointer"
                          >
                            <option value="Student Feedback">Student Feedback</option>
                            <option value="Parent Feedback">Parent Feedback</option>
                            <option value="Alumni Feedback">Alumni Feedback</option>
                            <option value="Academic Curriculum">Academic Curriculum</option>
                            <option value="Infrastructure & Labs">Infrastructure & Labs</option>
                            <option value="General Feedback">General Feedback</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Contact Phone / Email</label>
                          <input 
                            type="text"
                            value={feedbackForm.phone || feedbackForm.email}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value, email: e.target.value })}
                            placeholder="Phone number or Email"
                            className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Feedback & Detailed Suggestions</label>
                        <textarea 
                          rows={4}
                          required
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                          placeholder="Write your feedback message or suggestions here..."
                          className="w-full text-xs font-medium p-4 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <Send className="w-4 h-4" /> Submit Response to Department HOD
                      </button>
                    </form>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* POPUP MODAL FOR FACULTY DETAILS */}
        <AnimatePresence>
          {selectedFacultyMember && createPortal(
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedFacultyMember(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Modal Header: Portrait Photo & Main Name */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-150 pb-6 mb-6 text-center sm:text-left">
                  {/* Perfect Ratio Portrait Modal Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-md relative">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                    {(selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]) && (
                      <img 
                        src={selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]} 
                        alt={selectedFacultyMember.name}
                        className="absolute inset-0 w-full h-full object-cover object-top z-10"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title">{selectedFacultyMember.name}</h2>
                      {getTopRightBadge(selectedFacultyMember, dept.name) && (
                        <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase ${
                          getTopRightBadge(selectedFacultyMember, dept.name) === 'PRINCIPAL'
                            ? 'bg-[#FF8A00] text-white border-amber-600'
                            : getTopRightBadge(selectedFacultyMember, dept.name) === 'HOD' 
                            ? 'text-amber-900 bg-amber-100 border-amber-300' 
                            : 'text-indigo-900 bg-indigo-100 border-indigo-300'
                        }`}>
                          {getTopRightBadge(selectedFacultyMember, dept.name)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-[#FF8A00] mb-2">
                      {formatDesignation(selectedFacultyMember.designation, selectedFacultyMember.name)}
                    </p>
                    <span className="inline-block text-[11px] font-bold text-gray-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {selectedFacultyMember.department}
                    </span>
                  </div>
                </div>

                {/* Modal Details Grid */}
                <div className="space-y-3.5 mb-6 text-left">
                  {/* Qualification */}
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Qualification</span>
                      <span className="text-xs sm:text-sm font-extrabold text-gray-800">
                        {selectedFacultyMember.qualification || 'Master of Engineering'}
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Academic Department</span>
                      <span className="text-xs sm:text-sm font-extrabold text-gray-800">
                        {selectedFacultyMember.department}
                      </span>
                    </div>
                  </div>

                  {/* Experience */}
                  {selectedFacultyMember.experience && selectedFacultyMember.experience !== 'N/A' && (
                    <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Academic Experience</span>
                        <span className="text-xs sm:text-sm font-extrabold text-gray-800">
                          {selectedFacultyMember.experience}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  {selectedFacultyMember.email && selectedFacultyMember.email !== 'N/A' && (
                    <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Official Email Address</span>
                          <a href={`mailto:${selectedFacultyMember.email}`} className="text-xs sm:text-sm font-extrabold text-indigo-650 hover:underline truncate block">
                            {selectedFacultyMember.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORCID iD Identifier */}
                  {(selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]) && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm font-mono">
                          iD
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">ORCID Identifier</span>
                          <a
                            href={`https://orcid.org/${selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm font-extrabold text-emerald-700 hover:text-emerald-900 hover:underline font-mono truncate block flex items-center gap-1"
                          >
                            https://orcid.org/{selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]}
                            <ExternalLink className="w-3.5 h-3.5 inline ml-1 text-emerald-600" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified APEC Faculty</span>
                  </div>
                  <button 
                    onClick={() => setSelectedFacultyMember(null)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>

              </motion.div>
            </div>,
            document.body
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
