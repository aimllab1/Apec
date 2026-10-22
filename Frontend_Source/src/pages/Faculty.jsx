import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, GraduationCap, Mail, Briefcase, 
  Award, Building2, Filter, Clock, ArrowLeft, ChevronRight,
  BookOpen, Sparkles, User, X, CheckCircle2, ExternalLink
} from 'lucide-react';
import facultyData from '../ai/knowledge/faculty.json';
import departmentsData from '../data/departmentsData.json';
import FacultyOrcidQr from '../components/FacultyOrcidQr';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

// Department Banner Images Mapping
const deptImageMap = {
  'Civil Engineering': '/Images/Dept/civil dept.jpg',
  'Mechanical Engineering': '/Images/Dept/mech dept.jpg',
  'Department of Mechanical Engineering': '/Images/Dept/mech dept.jpg',
  'Electrical and Electronics Engineering': '/Images/Dept/eee dept.jpg',
  'Electronics and Communication Engineering': '/Images/Dept/ece dept.jpg',
  'Computer Science and Engineering': '/Images/Dept/cse dept.png',
  'Computer Science Engineering': '/Images/Dept/cse dept.png',
  'Artificial Intelligence and Machine Learning': '/Images/Dept/aiml dept.jpg',
  'Computer Science & Design (CSD)': '/Images/Dept/csd  dept.jpg',
  'Information Technology': '/Images/Dept/it dept.jpg',
  'Chemical Engineering': '/Images/Dept/chem dept.jpg',
  'Agricultural Engineering': '/Images/Dept/agri dept.jpg',
  'Artificial Intelligence and Data Science': '/Images/Dept/ai ds dept.jpg',
  'Computer Applications': '/Images/Dept/MCA.jpg',
  'Master of Computer Applications (MCA)': '/Images/Dept/MCA.jpg',
  'Management Studies (MBA)': '/Images/Dept/MBA.jpg',
  'Science & Humanities': '/Images/Dept/S&H dept.jpg',
  'PhD - Civil Engg.': '/Images/Dept/phd.civil.jpg',
  'PhD - Mechanical Engg.': '/Images/Dept/phd.mech.jpg',
  'PhD - Electronics and Communication Engg.': '/Images/Dept/phd.ece.jpg',
  'PhD - Electrical and Electronics Engg.': '/Images/Dept/phd.eee.jpg'
};

// Program Categorization (B.E., B.Tech., PG, Ph.D.)
const categoryGroups = [
  {
    title: "Undergraduate (B.E. Programmes)",
    badge: "B.E.",
    depts: [
      "Civil Engineering",
      "Department of Mechanical Engineering",
      "Electrical and Electronics Engineering",
      "Electronics and Communication Engineering",
      "Computer Science Engineering",
      "Artificial Intelligence and Machine Learning",
      "Computer Science & Design (CSD)"
    ]
  },
  {
    title: "Undergraduate (B.Tech. Programmes)",
    badge: "B.Tech",
    depts: [
      "Information Technology",
      "Chemical Engineering",
      "Agricultural Engineering",
      "Artificial Intelligence and Data Science"
    ]
  },
  {
    title: "Postgraduate & Basic Sciences",
    badge: "PG & Sciences",
    depts: [
      "Master of Computer Applications (MCA)",
      "Management Studies (MBA)",
      "Science & Humanities"
    ]
  },
  {
    title: "Doctor of Philosophy (Ph.D. Research)",
    badge: "Ph.D.",
    depts: [
      "PhD - Civil Engg.",
      "PhD - Mechanical Engg.",
      "PhD - Electronics and Communication Engg.",
      "PhD - Electrical and Electronics Engg."
    ]
  }
];

// Helper to determine top-right badge (HOD, PRINCIPAL, DEAN)
const getTopRightBadge = (member, currentDept) => {
  const deptStr = ((currentDept || '') + ' ' + (member?.department || '') + ' ' + (member?.department_key || '')).toLowerCase();
  if (deptStr.includes('science') && deptStr.includes('humanities')) {
    return null; // Explicitly remove HOD tag for Science & Humanities department
  }
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 'PRINCIPAL';
  if (name.includes('bhuvaneswari') || name.includes('bhuvaneshwari') || (member.designation && member.designation.toLowerCase().includes('vice principal'))) return 'VICE PRINCIPAL';
  if (name.includes('ramasamy') || (member.designation && member.designation.toLowerCase().includes('dean'))) return 'DEAN';
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 'HOD';
  return null;
};

// Rank weighting for sorting faculty
const getRankWeight = (member) => {
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 1;
  if (name.includes('bhuvaneswari') || name.includes('bhuvaneshwari') || (member.designation && member.designation.toLowerCase().includes('vice principal'))) return 2;
  if (name.includes('ramasamy') || (member.designation && member.designation.toLowerCase().includes('dean'))) return 3;
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 4;
  const d = (member.designation || '').toLowerCase();
  if (d.includes('professor') && !d.includes('assistant') && !d.includes('associate')) return 5;
  if (d.includes('associate professor')) return 6;
  if (d.includes('assistant professor')) return 7;
  return 8;
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

export default function Faculty() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDept, setSelectedDept] = useState(null); // null = Department list view
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null); // Faculty detail modal state

  // Handle URL query parameter `dept` or `key`
  useEffect(() => {
    const deptQuery = searchParams.get('dept') || searchParams.get('key');
    if (deptQuery) {
      // Find matching department name
      const allDepts = categoryGroups.flatMap(g => g.depts);
      const match = allDepts.find(d => 
        d.toLowerCase().includes(deptQuery.toLowerCase()) || 
        deptQuery.toLowerCase().includes(d.toLowerCase())
      );
      if (match) {
        setSelectedDept(match);
      } else {
        // Check departmentsData keys
        const deptObj = departmentsData[deptQuery.toLowerCase()];
        if (deptObj && deptObj.name) {
          setSelectedDept(deptObj.name);
        }
      }
    }
  }, [searchParams]);

  // Prevent background scrolling when modal is open and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedFacultyMember(null);
    };
    if (selectedFacultyMember) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFacultyMember]);

  const [liveDeptsData, setLiveDeptsData] = useState(() => {
    const saved = localStorage.getItem('apec_departments_data');
    return saved ? JSON.parse(saved) : departmentsData;
  });

  useEffect(() => {
    const syncDepts = () => {
      const saved = localStorage.getItem('apec_departments_data');
      if (saved) {
        try { setLiveDeptsData(JSON.parse(saved)); } catch (e) {}
      }
    };

    // Fetch latest updates directly from central network server with cache busting
    fetch(`/api/departments?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : null))
      .then(serverData => {
        if (serverData && typeof serverData === 'object') {
          try {
            localStorage.setItem('apec_departments_data', JSON.stringify(serverData));
          } catch (e) {}
          setLiveDeptsData(serverData);
        }
      })
      .catch(() => {});

    window.addEventListener('apec_storage_update', syncDepts);
    window.addEventListener('storage', syncDepts);
    return () => {
      window.removeEventListener('apec_storage_update', syncDepts);
      window.removeEventListener('storage', syncDepts);
    };
  }, []);

  // Build Faculty Image Lookup Map from liveDeptsData
  const facultyImageMap = useMemo(() => {
    const map = {
      'dr. m. vivekanandhan': '/Images/Faculty/vivekandhan.jpg',
      'dr. vivekanandhan m': '/Images/Faculty/vivekandhan.jpg',
      'ms.m.selvaprathipa': '/Images/Faculty/chemical/saraswathy.jpg'
    };
    const depts = liveDeptsData || departmentsData;
    if (depts) {
      Object.values(depts).forEach(deptObj => {
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
  }, [liveDeptsData]);

  // Build Faculty ORCID Lookup Map from liveDeptsData
  const facultyOrcidMap = useMemo(() => {
    const map = {};
    const depts = liveDeptsData || departmentsData;
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
  }, [liveDeptsData]);

  // Strict & Pure Faculty Filtering & Hierarchy Sorting per Department (Using live CMS data)
  const departmentFacultyMembers = useMemo(() => {
    if (!selectedDept) return [];
    
    const targetDeptLower = selectedDept.toLowerCase().trim();

    // Check if matching department exists in live CMS departmentsData
    const matchedDeptObj = Object.values(liveDeptsData || {}).find(d => {
      if (!d) return false;
      const dName = (d.name || '').toLowerCase().trim();
      const dKey = (d.key || '').toLowerCase().trim();
      return dName === targetDeptLower || 
             targetDeptLower.includes(dName) || 
             dName.includes(targetDeptLower) ||
             (dKey && targetDeptLower.includes(dKey));
    });

    let list = [];
    if (matchedDeptObj && Array.isArray(matchedDeptObj.faculty) && matchedDeptObj.faculty.length > 0) {
      list = matchedDeptObj.faculty.map(member => ({
        ...member,
        department: member.department || matchedDeptObj.name,
        department_key: member.department_key || matchedDeptObj.key
      }));
    } else {
      list = facultyData.filter(member => {
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
                        (memberKey && targetDeptLower.includes(memberKey));

        return isMatch;
      });
    }

    const filtered = list.filter(member => {
      const nameMatch = (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.qualification || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      let roleMatch = true;
      if (roleFilter !== 'All') {
        if (roleFilter === 'Head of Department') {
          roleMatch = member.isHod || (member.designation && member.designation.toLowerCase().includes('head'));
        } else {
          roleMatch = (member.designation || '').toLowerCase().includes(roleFilter.toLowerCase());
        }
      }
      return nameMatch && roleMatch;
    });

    // Sort by Academic Hierarchy
    filtered.sort((a, b) => getRankWeight(a) - getRankWeight(b));

    return filtered;
  }, [selectedDept, searchQuery, roleFilter, liveDeptsData]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-[10px] pb-12 md:pb-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-left">
        
        {/* BACK BUTTON (Displayed when inside a department) */}
        {selectedDept && (
          <div className="mb-4">
            <button
              onClick={() => { setSelectedDept(null); setSearchQuery(''); setRoleFilter('All'); }}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-[#FF8A00] bg-white border border-gray-200 hover:border-[#FF8A00] px-4 py-2 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF8A00]" />
              <span>Back to All Departments</span>
            </button>
          </div>
        )}

        {/* PAGE TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-title tracking-tight leading-tight text-gray-900">
            {selectedDept ? (
              <>
                <span className="text-[#FF8A00]">{selectedDept}</span> Faculty
              </>
            ) : (
              <>
                APEC Department <span className="text-[#FF8A00]">Faculty Directory</span>
              </>
            )}
          </h1>
        </div>

        {/* VIEW 1: CATEGORIZED DEPARTMENT LIST (Shown when selectedDept === null) */}
        {!selectedDept && (
          <div className="space-y-12">

            {/* Categorized Department Sections */}
            {categoryGroups.map((group, groupIdx) => {
              const matchedDepts = group.depts.filter(deptName => {
                if (!searchQuery.trim()) return true;
                return deptName.toLowerCase().includes(searchQuery.toLowerCase());
              });

              if (matchedDepts.length === 0) return null;

              return (
                <div key={groupIdx} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#FF8A00]" />
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title tracking-tight">
                        {group.title}
                      </h2>
                    </div>
                    <span className="text-xs font-black bg-[#FFE7CC] text-[#FF8A00] px-3 py-1 rounded-full uppercase tracking-wider">
                      {group.badge}
                    </span>
                  </div>

                  {/* Grid of Department Cards */}
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                  >
                    {matchedDepts.map((deptName, idx) => {
                      const imgPath = deptImageMap[deptName] || '/Images/Dept/cse dept.png';
                      return (
                        <motion.div
                          key={idx}
                          variants={fadeInUp}
                          onClick={() => { setSelectedDept(deptName); setSearchQuery(''); }}
                          className="bg-white border border-gray-200/90 hover:border-[#FF8A00] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            {/* Department Cover Image Banner */}
                            <div className="w-full h-36 sm:h-40 bg-slate-100 overflow-hidden relative">
                              <img 
                                src={imgPath} 
                                alt={deptName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.src = '/Images/Dept/cse dept.png';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                              
                              <div className="absolute top-2.5 right-2.5">
                                <span className="text-[9.5px] font-black bg-black/60 text-amber-300 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/30 font-mono">
                                  {group.badge}
                                </span>
                              </div>

                              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                                <h3 className="font-extrabold text-xs sm:text-[13.5px] text-white group-hover:text-amber-300 transition-colors leading-snug font-title line-clamp-2">
                                  {deptName}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="px-3.5 py-2.5 sm:py-3 flex items-center justify-between text-xs font-bold text-gray-600 group-hover:text-[#FF8A00] transition-colors">
                            <span>View Faculty Details</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#FF8A00] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}

          </div>
        )}

        {/* VIEW 2: FACULTY DETAILS FOR SELECTED DEPARTMENT (Shown when selectedDept !== null) */}
        {selectedDept && (
          <div className="space-y-8">
            
            {/* Filter & Department Quick Switcher Bar */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Faculty inside Department */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder={`Search in ${selectedDept}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              {/* Department Dropdown Switcher */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Switch Dept:</span>
                  <select 
                    value={selectedDept}
                    onChange={(e) => { setSelectedDept(e.target.value); setSearchQuery(''); }}
                    className="w-full sm:w-auto bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none focus:border-[#FF8A00]"
                  >
                    {categoryGroups.flatMap(g => g.depts).map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-500 shrink-0">Role:</span>
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full sm:w-auto bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none focus:border-[#FF8A00]"
                  >
                    <option value="All">All Roles</option>
                    <option value="Head of Department">Head of Department</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Back Action Header */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                {selectedDept} ({departmentFacultyMembers.length} Faculty Members)
              </span>
              <button 
                onClick={() => { setSelectedDept(null); setSearchQuery(''); }}
                className="text-xs font-bold text-[#FF8A00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View All Departments</span>
              </button>
            </div>

            {/* Faculty Cards Grid */}
            {departmentFacultyMembers.length === 0 ? (
              <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold my-6">
                No faculty members found matching your search.
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left"
              >
                {departmentFacultyMembers.map((member, idx) => {
                  const photoSrc = member.image || facultyImageMap[member.name?.toLowerCase().trim()] || null;
                  const topRightBadge = getTopRightBadge(member, selectedDept);

                  return (
                    <motion.div 
                      key={idx}
                      variants={fadeInUp}
                      onClick={() => setSelectedFacultyMember(member)}
                      className={`bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                        topRightBadge === 'PRINCIPAL'
                          ? 'border-[#FF8A00] ring-1 ring-amber-400/60'
                          : topRightBadge === 'VICE PRINCIPAL'
                          ? 'border-violet-400 ring-1 ring-violet-300/60'
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
                            alt={member.name} 
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
                              <h4 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 leading-snug group-hover:text-indigo-650 transition-colors">{member.name}</h4>
                              {member.qualification && (
                                <span className="text-[9px] font-black bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-650 uppercase font-mono tracking-wider shrink-0 mt-0.5 sm:mt-0">
                                  {member.qualification}
                                </span>
                              )}
                            </div>
                            
                            {topRightBadge && (
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs border ${
                                topRightBadge === 'PRINCIPAL'
                                  ? 'bg-[#FF8A00] text-white border-amber-600 font-black'
                                  : topRightBadge === 'VICE PRINCIPAL'
                                  ? 'bg-violet-100 text-violet-900 border-violet-300'
                                  : topRightBadge === 'HOD' 
                                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                  : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              }`}>
                                {topRightBadge}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-[11px] sm:text-xs md:text-sm text-indigo-650 font-extrabold uppercase tracking-wider block mb-1">
                            {formatDesignation(member.designation, member.name)}
                          </span>
                          
                          {(member.department || selectedDept) && (
                            <span className="text-xs sm:text-sm text-gray-550 font-bold block mb-3 leading-relaxed">
                              {member.department || selectedDept}
                            </span>
                          )}
                        </div>

                        {/* Contact/Options & Additional Metadata */}
                        <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-gray-100 w-full">
                          <div className="flex items-center gap-4">
                            {member.experience && member.experience !== 'N/A' && (
                              <div className="text-[10px] sm:text-xs text-gray-550 font-extrabold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>Exp: {member.experience.split(',')[0]}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity">View Profile &rarr;</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

          </div>
        )}

        {/* FACULTY DETAIL OVERLAY MODAL */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedFacultyMember && (
              <div 
                className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
                onClick={() => setSelectedFacultyMember(null)}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl sm:max-w-2xl w-full relative overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
                >
                  {/* TOP NAVY BLUE COLOR HEADER TAG */}
                  <div className="bg-[#041744] px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-white border-b-2 border-[#FF8A00] shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse shrink-0" />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-white font-title">
                        Faculty Profile
                      </span>
                      {getTopRightBadge(selectedFacultyMember, selectedDept) && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          getTopRightBadge(selectedFacultyMember, selectedDept) === 'PRINCIPAL'
                            ? 'bg-[#FF8A00] text-white'
                            : getTopRightBadge(selectedFacultyMember, selectedDept) === 'VICE PRINCIPAL'
                            ? 'bg-violet-600 text-white'
                            : getTopRightBadge(selectedFacultyMember, selectedDept) === 'HOD' 
                            ? 'bg-amber-500 text-slate-950 font-black' 
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {getTopRightBadge(selectedFacultyMember, selectedDept)}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedFacultyMember(null)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Close Profile"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* MODAL BODY (BIG PHOTO ON LEFT, BALANCED TEXT MATCHING PHOTO HEIGHT ON RIGHT) */}
                  <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-white">
                    
                    {/* MAIN SIDE-BY-SIDE CONTENT BLOCK */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5">
                      
                      {/* LEFT: BIG SIZE FACULTY PHOTO */}
                      <div className="w-36 h-48 sm:w-44 sm:h-56 mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#041744]/15 shrink-0 relative shadow-md">
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          <User className="w-14 h-14 text-slate-400" />
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

                      {/* RIGHT: NAME, DEPT, DESIGNATION & CREDENTIALS BALANCED TO IMAGE SIZE */}
                      <div className="min-w-0 flex-1 flex flex-col justify-between text-left py-0.5">
                        
                        {/* TOP SECTION: NAME, ROLE, DESIGNATION, DEPARTMENT */}
                        <div>
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <h2 className="text-lg sm:text-xl font-black text-[#041744] font-title leading-tight">
                              {selectedFacultyMember.name}
                            </h2>
                            {getTopRightBadge(selectedFacultyMember, selectedDept) && (
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                                getTopRightBadge(selectedFacultyMember, selectedDept) === 'PRINCIPAL'
                                  ? 'bg-[#FF8A00] text-white'
                                  : getTopRightBadge(selectedFacultyMember, selectedDept) === 'VICE PRINCIPAL'
                                  ? 'bg-violet-600 text-white'
                                  : getTopRightBadge(selectedFacultyMember, selectedDept) === 'HOD' 
                                  ? 'bg-amber-500 text-slate-950 font-black' 
                                  : 'bg-indigo-600 text-white'
                              }`}>
                                {getTopRightBadge(selectedFacultyMember, selectedDept)}
                              </span>
                            )}
                          </div>

                          {/* Designation */}
                          <p className="text-xs sm:text-sm font-extrabold text-[#FF8A00] leading-snug mb-2">
                            {selectedFacultyMember.designation || formatDesignation(selectedFacultyMember.designation, selectedFacultyMember.name)}
                          </p>

                          {/* Department */}
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 max-w-full">
                            <Building2 className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                            <span className="truncate">{selectedFacultyMember.department || selectedDept}</span>
                          </div>
                        </div>

                        {/* BOTTOM SECTION: QUALIFICATION, EXPERIENCE, EMAIL (Fills height evenly) */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedFacultyMember.qualification || 'Master of Engineering'}
                              </span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedFacultyMember.experience || 'Experienced Faculty'}
                              </span>
                            </div>
                          </div>

                          {selectedFacultyMember.email && selectedFacultyMember.email !== 'N/A' && (
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <div className="min-w-0 overflow-hidden text-xs">
                                <a 
                                  href={`mailto:${selectedFacultyMember.email}`} 
                                  className="font-bold text-[#041744] hover:text-[#FF8A00] hover:underline truncate block"
                                >
                                  {selectedFacultyMember.email}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* ORCID iD & DYNAMIC QR CODE CONTAINER */}
                    <FacultyOrcidQr 
                      facultyName={selectedFacultyMember.name} 
                      defaultOrcid={selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]} 
                    />

                    {/* COMPACT FOOTER */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Verified APEC Faculty</span>
                      </div>
                      <button 
                        onClick={() => setSelectedFacultyMember(null)}
                        className="px-4 py-1.5 bg-[#041744] hover:bg-[#06236b] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Close Profile
                      </button>
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </div>
  );
}
