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

// ID Badge style styling helper
const getBadgeTheme = (role) => {
  if (role === 'PRINCIPAL') {
    return {
      barBg: 'bg-gradient-to-r from-[#FF8A00] via-orange-500 to-amber-500',
      borderColor: 'border-amber-400/80',
      avatarBorder: 'border-amber-450 ring-4 ring-amber-400/20',
      roleText: 'text-amber-700 bg-amber-50',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      glow: 'shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:border-[#FF8A00] scale-102',
      textAccent: 'text-[#FF8A00]'
    };
  }
  if (role === 'HOD') {
    return {
      barBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      borderColor: 'border-amber-300/80',
      avatarBorder: 'border-amber-300 ring-4 ring-amber-300/20',
      roleText: 'text-amber-700 bg-amber-50',
      badgeBg: 'bg-amber-100 text-amber-955 border-amber-200',
      glow: 'shadow-md shadow-amber-500/5 hover:shadow-amber-500/15 hover:border-amber-500 scale-102',
      textAccent: 'text-amber-600'
    };
  }
  if (role === 'DEAN') {
    return {
      barBg: 'bg-gradient-to-r from-indigo-600 to-blue-500',
      borderColor: 'border-indigo-200/80',
      avatarBorder: 'border-indigo-300 ring-4 ring-indigo-300/20',
      roleText: 'text-indigo-700 bg-indigo-50',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      glow: 'shadow-md shadow-indigo-500/5 hover:shadow-indigo-500/15 hover:border-indigo-500 scale-102',
      textAccent: 'text-indigo-600'
    };
  }
  return {
    barBg: 'bg-gradient-to-r from-slate-700 via-slate-700 to-slate-800',
    borderColor: 'border-slate-200',
    avatarBorder: 'border-slate-200 ring-4 ring-slate-200/10',
    roleText: 'text-slate-700 bg-slate-50',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
    glow: 'shadow-xs hover:shadow-md hover:border-indigo-500 scale-102',
    textAccent: 'text-indigo-600'
  };
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

  // Build Faculty Image Lookup Map from departmentsData
  const facultyImageMap = useMemo(() => {
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
  const facultyOrcidMap = useMemo(() => {
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

  // Strict & Pure Faculty Filtering & Hierarchy Sorting per Department
  const departmentFacultyMembers = useMemo(() => {
    if (!selectedDept) return [];
    
    const targetDeptLower = selectedDept.toLowerCase().trim();

    const filtered = facultyData.filter(member => {
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
    }).filter(member => {
      const nameMatch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      let roleMatch = true;
      if (roleFilter !== 'All') {
        if (roleFilter === 'Head of Department') {
          roleMatch = member.isHod || (member.designation && member.designation.toLowerCase().includes('head'));
        } else {
          roleMatch = member.designation?.toLowerCase().includes(roleFilter.toLowerCase());
        }
      }
      return nameMatch && roleMatch;
    });

    // Sort by Academic Hierarchy
    filtered.sort((a, b) => getRankWeight(a) - getRankWeight(b));

    return filtered;
  }, [selectedDept, searchQuery, roleFilter]);

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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {matchedDepts.map((deptName, idx) => {
                      const imgPath = deptImageMap[deptName] || '/Images/Dept/cse dept.png';
                      return (
                        <motion.div
                          key={idx}
                          variants={fadeInUp}
                          onClick={() => { setSelectedDept(deptName); setSearchQuery(''); }}
                          className="bg-white border border-gray-200 hover:border-[#FF8A00] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            {/* Department Cover Image Banner */}
                            <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
                              <img 
                                src={imgPath} 
                                alt={deptName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.src = '/Images/Dept/cse dept.png';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                              
                              <div className="absolute top-3 right-3">
                                <span className="text-[10px] font-black bg-black/60 text-amber-300 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30 font-mono">
                                  {group.badge}
                                </span>
                              </div>

                              <div className="absolute bottom-3 left-4 right-4 text-white">
                                <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors leading-snug font-title">
                                  {deptName}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 flex items-center justify-between text-xs font-extrabold text-gray-600 group-hover:text-[#FF8A00] transition-colors">
                            <span>View Faculty Details</span>
                            <ChevronRight className="w-4 h-4 text-[#FF8A00]" />
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
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {departmentFacultyMembers.map((member, idx) => {
                const photoSrc = member.image || facultyImageMap[member.name?.toLowerCase().trim()] || null;
                const topRightBadge = getTopRightBadge(member, selectedDept);
                const theme = getBadgeTheme(topRightBadge);

                return (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    onClick={() => setSelectedFacultyMember(member)}
                    className={`bg-white border rounded-3xl overflow-hidden flex flex-col justify-between group relative transition-all duration-300 cursor-pointer ${theme.borderColor} ${theme.glow}`}
                  >
                    {/* Top Accent Header Bar */}
                    <div className={`h-12 w-full ${theme.barBg} px-4 py-2 flex items-center justify-between relative select-none`}>
                      <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">APEC Faculty</span>
                      {topRightBadge && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs border ${
                          topRightBadge === 'PRINCIPAL'
                            ? 'bg-white text-orange-600 border-orange-200'
                            : topRightBadge === 'HOD' 
                            ? 'bg-white text-amber-700 border-amber-200' 
                            : 'bg-white text-indigo-600 border-indigo-200'
                        }`}>
                          {topRightBadge}
                        </span>
                      )}
                      {/* Badge slot/clip punch hole ornament */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/25 rounded-full" />
                    </div>

                    <div className="p-5 flex-1 flex flex-col items-center text-center">
                      {/* Centered Portrait Avatar with Thick Accent Border (Negative top margin to overlap header strip) */}
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-full overflow-hidden bg-slate-100 border-4 -mt-14 shadow-md shrink-0 relative group-hover:scale-105 transition-transform duration-300 ${theme.avatarBorder}`}>
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          <User className="w-10 h-10 text-slate-400" />
                        </div>
                        {photoSrc && (
                          <img 
                            src={photoSrc} 
                            alt={member.name}
                            className="absolute inset-0 w-full h-full object-cover object-top z-10"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      {/* Name & Designation */}
                      <h3 className="font-extrabold text-base text-gray-900 leading-snug group-hover:text-[#FF8A00] transition-colors mt-3">
                        {member.name}
                      </h3>
                      
                      <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mt-1.5">
                        {formatDesignation(member.designation, member.name)}
                      </span>

                      {/* Line divider */}
                      <div className="w-12 h-0.5 bg-slate-100 my-3" />

                      {/* Key details table / tags */}
                      <div className="space-y-2 w-full text-xs text-gray-600">
                        {member.qualification && (
                          <div className="flex items-center justify-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-semibold">{member.qualification}</span>
                          </div>
                        )}
                        {member.experience && member.experience !== 'N/A' && (
                          <div className="flex items-center justify-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-semibold">Exp: {member.experience.split(',')[0]}</span>
                          </div>
                        )}
                        {member.email && member.email !== 'N/A' && (
                          <div className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-mono text-[10px] select-all truncate max-w-[200px]">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer with Barcode Ornament */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* Real-looking barcode decoration */}
                      <div className="flex flex-col items-start gap-0.5 select-none">
                        <div className="flex items-center gap-[1px] opacity-40 group-hover:opacity-70 transition-opacity">
                          <div className="w-[2px] h-3 bg-slate-800" />
                          <div className="w-[1px] h-3 bg-slate-800" />
                          <div className="w-[4px] h-3 bg-slate-800" />
                          <div className="w-[1px] h-3 bg-slate-800" />
                          <div className="w-[2px] h-3 bg-slate-800" />
                          <div className="w-[1px] h-3 bg-slate-800" />
                          <div className="w-[3px] h-3 bg-slate-800" />
                          <div className="w-[1px] h-3 bg-slate-800" />
                        </div>
                        <span className="text-[7px] font-mono text-slate-400 tracking-tight leading-none">
                          APEC-FAC-{idx + 100}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-black text-[#FF8A00] group-hover:translate-x-0.5 transition-transform">
                        <span>VIEW PROFILE</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {departmentFacultyMembers.length === 0 && (
              <div className="bg-[#FF8A00]/5 border border-[#FF8A00]/20 rounded-3xl p-12 text-center my-10">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-black text-gray-700 mb-1">No faculty members found in this category</h3>
                <p className="text-xs text-gray-500 font-semibold">Try clearing the role filter or search query.</p>
              </div>
            )}

          </div>
        )}

        {/* FACULTY DETAIL OVERLAY MODAL (Landscape for Desktop, Stacked for Mobile) */}
        <AnimatePresence>
          {selectedFacultyMember && createPortal(
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 md:p-10 max-w-lg md:max-w-4xl lg:max-w-5xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto text-left"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedFacultyMember(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer z-20 shadow-sm"
                  title="Close Profile"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Main Landscape Content Container */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
                  
                  {/* LEFT COLUMN: Photo, Name, Badge, ORCID (Desktop sidebar style) */}
                  <div className="w-full md:w-80 md:shrink-0 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-gray-150 pb-6 md:pb-0 md:pr-8">
                    
                    {/* Faculty Photo */}
                    <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-md relative mb-4">
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

                    {/* Faculty Name & Role Badge */}
                    <div className="w-full flex flex-col items-center md:items-start">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title">{selectedFacultyMember.name}</h2>
                        {getTopRightBadge(selectedFacultyMember, selectedDept) && (
                          <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase ${
                            getTopRightBadge(selectedFacultyMember, selectedDept) === 'PRINCIPAL'
                              ? 'bg-[#FF8A00] text-white border-amber-600'
                              : getTopRightBadge(selectedFacultyMember, selectedDept) === 'HOD' 
                              ? 'text-amber-900 bg-amber-100 border-amber-300' 
                              : 'text-indigo-900 bg-indigo-100 border-indigo-300'
                          }`}>
                            {getTopRightBadge(selectedFacultyMember, selectedDept)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-extrabold text-[#FF8A00] mb-2">
                        {formatDesignation(selectedFacultyMember.designation, selectedFacultyMember.name)}
                      </p>
                      <span className="inline-block text-[11px] font-bold text-gray-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mb-4">
                        {selectedFacultyMember.department}
                      </span>
                    </div>

                    {/* ORCID iD Badge */}
                    {(selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]) && (
                      <div className="w-full mt-auto p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center font-mono">iD</span>
                          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">ORCID Identifier</span>
                        </div>
                        <a
                          href={`https://orcid.org/${selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline font-mono truncate block flex items-center gap-1"
                        >
                          https://orcid.org/{selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]}
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Desktop Landscape Info Grid */}
                  <div className="flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Academic & Professional Overview</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Qualification */}
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Qualification</span>
                            <span className="text-xs sm:text-sm font-extrabold text-gray-800">
                              {selectedFacultyMember.qualification || 'Master of Engineering'}
                            </span>
                          </div>
                        </div>

                        {/* Department */}
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
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
                          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Experience</span>
                              <span className="text-xs sm:text-sm font-extrabold text-gray-800">
                                {selectedFacultyMember.experience}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Email Address */}
                        {selectedFacultyMember.email && selectedFacultyMember.email !== 'N/A' && (
                          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                              <Mail className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Official Email</span>
                              <a href={`mailto:${selectedFacultyMember.email}`} className="text-xs sm:text-sm font-extrabold text-indigo-650 hover:underline truncate block">
                                {selectedFacultyMember.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="pt-4 border-t border-gray-150 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified APEC Faculty</span>
                      </div>
                      <button 
                        onClick={() => setSelectedFacultyMember(null)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
                      >
                        Close Profile
                      </button>
                    </div>
                  </div>

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
