import React, { useState, useMemo } from 'react';
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
  'Electrical and Electronics Engineering': '/Images/Dept/eee dept.jpg',
  'Electronics and Communication Engineering': '/Images/Dept/ece dept.jpg',
  'Computer Science and Engineering': '/Images/Dept/cse dept.png',
  'Artificial Intelligence and Machine Learning': '/Images/Dept/aiml dept.jpg',
  'Information Technology': '/Images/Dept/it dept.jpg',
  'Chemical Engineering': '/Images/Dept/chem dept.jpg',
  'Agricultural Engineering': '/Images/Dept/agri dept.jpg',
  'Master of Computer Applications (MCA)': '/Images/Dept/MCA.jpg',
  'Management Studies (MBA)': '/Images/Dept/MBA.jpg',
  'Science & Humanities': '/Images/Dept/cse dept.png'
};

// Program Categorization (B.E., B.Tech., PG, Science & Humanities)
const categoryGroups = [
  {
    title: "Undergraduate (B.E. Programmes)",
    depts: [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical and Electronics Engineering",
      "Electronics and Communication Engineering",
      "Computer Science and Engineering",
      "Artificial Intelligence and Machine Learning"
    ]
  },
  {
    title: "Undergraduate (B.Tech. Programmes)",
    depts: [
      "Information Technology",
      "Chemical Engineering",
      "Agricultural Engineering"
    ]
  },
  {
    title: "Postgraduate Programmes (M.E. / MCA / MBA)",
    depts: [
      "Master of Computer Applications (MCA)",
      "Management Studies (MBA)"
    ]
  },
  {
    title: "Science & Humanities",
    depts: [
      "Science & Humanities"
    ]
  }
];

// Helper to determine top-right badge (HOD, PRINCIPAL, DEAN)
const getTopRightBadge = (member) => {
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 'PRINCIPAL';
  if (member.isHod) return 'HOD';
  if (name.includes('ramasamy')) return 'DEAN';
  return null;
};

// Rank weighting for sorting faculty
const getRankWeight = (member) => {
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 1;
  if (member.isHod) return 2;
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
  d = d.replace(/Principal,?\s*/gi, '').replace(/Dean,?\s*/gi, '').replace(/HOD,?\s*/gi, '').replace(/Coordinator,?\s*/gi, '').trim();
  if (!d) return 'Professor';
  return d;
};

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState(null); // null = Department list view
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null); // Faculty detail modal state

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

  // Strict & Pure Faculty Filtering & Hierarchy Sorting per Department
  const departmentFacultyMembers = useMemo(() => {
    if (!selectedDept) return [];
    
    const filtered = facultyData.filter(member => {
      const memberDept = (member.department || '').trim();
      const memberKey = (member.department_key || '').trim().toLowerCase();

      // Strict Department Partitioning
      if (selectedDept === 'Computer Science and Engineering') {
        return memberDept === 'Computer Science and Engineering' || memberKey === 'cse';
      }
      if (selectedDept === 'Science & Humanities') {
        return memberDept === 'Science & Humanities' || memberKey === 'sh';
      }
      if (selectedDept === 'Mechanical Engineering') {
        return memberDept === 'Mechanical Engineering' || memberKey === 'mech';
      }
      if (selectedDept === 'Civil Engineering') {
        return memberDept === 'Civil Engineering' || memberKey === 'civil';
      }
      if (selectedDept === 'Electrical and Electronics Engineering') {
        return memberDept === 'Electrical and Electronics Engineering' || memberKey === 'eee';
      }
      if (selectedDept === 'Electronics and Communication Engineering') {
        return memberDept === 'Electronics and Communication Engineering' || memberKey === 'ece';
      }
      if (selectedDept === 'Artificial Intelligence and Machine Learning') {
        return memberDept === 'Artificial Intelligence and Machine Learning' || memberKey === 'aiml';
      }
      if (selectedDept === 'Information Technology') {
        return memberDept === 'Information Technology' || memberKey === 'it';
      }
      if (selectedDept === 'Chemical Engineering') {
        return memberDept === 'Chemical Engineering' || memberKey === 'chemical';
      }
      if (selectedDept === 'Agricultural Engineering') {
        return memberDept === 'Agricultural Engineering' || memberKey === 'agri';
      }
      if (selectedDept === 'Master of Computer Applications (MCA)') {
        return memberDept === 'Master of Computer Applications (MCA)' || memberKey === 'mca';
      }
      if (selectedDept === 'Management Studies (MBA)') {
        return memberDept === 'Management Studies (MBA)' || memberKey === 'mba';
      }

      return memberDept.toLowerCase() === selectedDept.toLowerCase();
    }).filter(member => {
      const nameMatch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      let roleMatch = true;
      if (roleFilter !== 'All') {
        if (roleFilter === 'Head of Department') {
          roleMatch = member.isHod;
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
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF8A00]" />
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title tracking-tight">
                      {group.title}
                    </h2>
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
                const topRightBadge = getTopRightBadge(member);

                return (
                  <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    onClick={() => setSelectedFacultyMember(member)}
                    className={`bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#FF8A00] transition-all cursor-pointer flex flex-col justify-between group relative ${
                      topRightBadge === 'PRINCIPAL'
                        ? 'border-[#FF8A00] ring-1 ring-amber-400/60'
                        : topRightBadge === 'HOD'
                        ? 'border-amber-300 ring-1 ring-amber-200/60'
                        : topRightBadge === 'DEAN'
                        ? 'border-indigo-300 ring-1 ring-indigo-200/60'
                        : 'border-gray-200'
                    }`}
                  >
                    <div>
                      {/* Top Header Row: Photo Avatar + Name + Designation + Top-Right Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Perfect Ratio Portrait Avatar */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs relative group-hover:scale-105 transition-transform duration-300">
                            {photoSrc ? (
                              <img 
                                src={photoSrc} 
                                alt={member.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold"
                              style={{ display: photoSrc ? 'none' : 'flex' }}
                            >
                              <User className="w-8 h-8 text-slate-400" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-extrabold text-base text-gray-900 leading-snug group-hover:text-[#FF8A00] transition-colors truncate">
                              {member.name}
                            </h3>
                            <span className="text-xs font-extrabold text-indigo-600 block mt-0.5 truncate">
                              {formatDesignation(member.designation, member.name)}
                            </span>
                          </div>
                        </div>

                        {/* Top-Right Badge Box */}
                        {topRightBadge && (
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs border ${
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
                    </div>

                    {/* Bottom Action Link */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-[#FF8A00] group-hover:translate-x-0.5 transition-transform">
                      <span>View Profile Details</span>
                      <ChevronRight className="w-4 h-4 text-[#FF8A00]" />
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

        {/* POPUP MODAL FOR FACULTY DETAILS */}
        <AnimatePresence>
          {selectedFacultyMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md">
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
                    {selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()] ? (
                      <img 
                        src={selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]} 
                        alt={selectedFacultyMember.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold"
                      style={{ display: (selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]) ? 'none' : 'flex' }}
                    >
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-title">{selectedFacultyMember.name}</h2>
                      {getTopRightBadge(selectedFacultyMember) && (
                        <span className={`text-[10px] font-black border px-2.5 py-0.5 rounded-full uppercase ${
                          getTopRightBadge(selectedFacultyMember) === 'PRINCIPAL'
                            ? 'bg-[#FF8A00] text-white border-amber-600'
                            : getTopRightBadge(selectedFacultyMember) === 'HOD' 
                            ? 'text-amber-900 bg-amber-100 border-amber-300' 
                            : 'text-indigo-900 bg-indigo-100 border-indigo-300'
                        }`}>
                          {getTopRightBadge(selectedFacultyMember)}
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
                      <Building2 className="w-4 h-4" />
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
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
