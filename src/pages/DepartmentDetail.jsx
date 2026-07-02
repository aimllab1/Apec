import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, Users, Award, Briefcase, 
  Search, Mail, GraduationCap, Trophy, 
  BookOpenCheck, UserCheck, Milestone, Library, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';

export default function DepartmentDetail() {
  const { id } = useParams();
  const dept = departmentsData[id] || departmentsData.cse;

  // Local state for tabs
  const [activeSubTab, setActiveSubTab] = useState('overview');
  // Local state for faculty search
  const [facultySearch, setFacultySearch] = useState('');
  // Local state for publication search
  const [pubSearch, setPubSearch] = useState('');

  // Local state for sub-publication tabs (journals, books, conferences)
  const [activePubType, setActivePubType] = useState('journals');

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

  // Filtered Faculty
  const filteredFaculty = (dept.faculty || []).filter(f => 
    f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
    (f.qualification || '').toLowerCase().includes(facultySearch.toLowerCase()) ||
    (f.designation || '').toLowerCase().includes(facultySearch.toLowerCase())
  );

  // Filtered Journals
  const filteredJournals = (dept.publications?.journals || []).filter(j => 
    j.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.author.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.journal.toLowerCase().includes(pubSearch.toLowerCase())
  );

  // Tabs structure
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'labs', label: 'Laboratories', icon: Library },
    { id: 'curriculum', label: 'PEOs & Outcomes', icon: Milestone },
    { id: 'publications', label: 'Research & Books', icon: BookOpenCheck },
    { id: 'achievements', label: 'Placements & Ranks', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-24 px-4 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/departments" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-650 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 shadow-sm p-8 md:p-12 rounded-3xl mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8"
        >
          <div className="max-w-3xl text-left">
            <span className="text-xs font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full inline-block mb-4 uppercase">
              Department Portal
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              {dept.name}
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold leading-relaxed">
              Adhiparasakthi Engineering College • Melmaruvathur
            </p>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full xl:w-auto shrink-0">
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center min-w-[110px]">
              <span className="block text-2xl font-black text-indigo-650">{(dept.faculty || []).length}</span>
              <span className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider">Faculty</span>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-650">{(dept.labs || []).length}</span>
              <span className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider">Laboratories</span>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center min-w-[110px]">
              <span className="block text-2xl font-black text-amber-600">{(dept.placements || []).length}</span>
              <span className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider">Placements</span>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-center min-w-[110px]">
              <span className="block text-2xl font-black text-purple-600">{(dept.publications?.journals || []).length}</span>
              <span className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider">Publications</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Selection */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 mb-12 overflow-x-auto w-full shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setFacultySearch('');
                  setPubSearch('');
                }}
                className={`flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab.id 
                    ? 'bg-indigo-650 text-white shadow-md' 
                    : 'text-gray-500 hover:text-indigo-650 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-10 min-h-[400px]">
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
                <div className="space-y-8">
                  {/* About Block */}
                  <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl text-left">
                    <h2 className="text-2xl md:text-3xl font-black mb-4 font-title text-indigo-650 flex items-center gap-2">
                      <BookOpen className="w-5.5 h-5.5" /> About the Department
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                      {dept.about}
                    </p>
                  </div>

                  {/* Vision & Mission Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {/* Vision Card */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-indigo-650 mb-4 flex items-center gap-2 font-title">
                          <Milestone className="w-5.5 h-5.5 text-indigo-650" /> Vision
                        </h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold italic">
                          "{dept.vision}"
                        </p>
                      </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                      <h3 className="text-xl md:text-2xl font-black text-indigo-650 mb-4 flex items-center gap-2 font-title">
                        <UserCheck className="w-5.5 h-5.5 text-indigo-650" /> Mission
                      </h3>
                      <ul className="space-y-4">
                        {dept.mission.map((item, idx) => (
                          <li key={idx} className="text-sm md:text-base text-gray-700 leading-relaxed flex items-start gap-2.5 font-semibold">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 shrink-0" />
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <h2 className="text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 text-left self-start sm:self-auto">
                      <Users className="w-5.5 h-5.5" /> Faculty Directory
                    </h2>
                    
                    {/* Faculty search */}
                    <div className="relative w-full sm:max-w-xs">
                      <input 
                        type="text"
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        placeholder="Search faculty..."
                        className="w-full text-sm px-4 py-3 pl-9 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-medium text-gray-800"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {filteredFaculty.length === 0 ? (
                    <div className="p-16 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-sm font-semibold">
                      No faculty members found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                      {filteredFaculty.map((f, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                        >
                          <div>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div>
                                <h4 className="text-base md:text-lg font-black text-gray-900">{f.name}</h4>
                                <span className="text-xs text-indigo-650 font-extrabold uppercase tracking-wider block mt-1">{f.designation}</span>
                              </div>
                              <span className="text-[10px] font-bold bg-gray-100 px-2.5 py-1 rounded text-gray-600 uppercase font-mono">{f.qualification}</span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mt-4 pt-4 border-t border-gray-150">
                              {f.experience && (
                                <div className="text-xs text-gray-600 flex items-center gap-1.5 font-semibold">
                                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span>Experience: <strong className="text-gray-800">{f.experience}</strong></span>
                                </div>
                              )}
                              {f.joiningDate && (
                                <div className="text-xs text-gray-600 flex items-center gap-1.5 font-semibold">
                                  <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span>Joined APEC: <strong className="text-gray-800">{f.joiningDate}</strong></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {f.email && (
                            <a 
                              href={`mailto:${f.email}`}
                              className="mt-6 w-full flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
                            >
                              <Mail className="w-3.5 h-3.5" /> Contact Email
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LABORATORIES */}
              {activeSubTab === 'labs' && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-8 text-left">
                    <Library className="w-5.5 h-5.5" /> Infrastructure & Laboratories
                  </h2>

                  {(dept.labs || []).length === 0 ? (
                    <div className="p-16 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-sm font-semibold">
                      No laboratories information currently available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                      {dept.labs.map((lab, idx) => (
                        <div 
                          key={idx}
                          className="p-6 bg-gray-50 border border-gray-150 rounded-2xl flex items-start gap-4 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all duration-300"
                        >
                          <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2.5 rounded-xl shrink-0">
                            <Library className="w-5.5 h-5.5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">Laboratory {String(idx + 1).padStart(2, '0')}</span>
                            <h4 className="text-sm md:text-base font-black text-gray-800 leading-relaxed">{lab}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CURRICULUM OBJECTIVES */}
              {activeSubTab === 'curriculum' && (
                <div className="space-y-10 text-left">
                  
                  {/* PEOs & PSOs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* PEOs */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                      <h3 className="text-xl md:text-2xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-5.5 h-5.5 text-indigo-650" /> Program Educational Objectives (PEOs)
                      </h3>
                      {(!dept.peos || dept.peos.length === 0) ? (
                        <p className="text-sm text-gray-500 font-semibold">PEOs are in alignment with university structures.</p>
                      ) : (
                        <ul className="space-y-4">
                          {dept.peos.map((peo, idx) => (
                            <li key={idx} className="text-sm md:text-base text-gray-700 leading-relaxed flex gap-3 font-semibold items-start">
                              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{peo}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* PSOs */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                      <h3 className="text-xl md:text-2xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-5.5 h-5.5 text-indigo-650" /> Program Specific Outcomes (PSOs)
                      </h3>
                      {(!dept.psos || dept.psos.length === 0) ? (
                        <p className="text-sm text-gray-500 font-semibold">PSOs are configured as per program focus.</p>
                      ) : (
                        <ul className="space-y-4">
                          {dept.psos.map((pso, idx) => (
                            <li key={idx} className="text-sm md:text-base text-gray-700 leading-relaxed flex gap-3 font-semibold items-start">
                              <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{pso}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* POs */}
                  <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                    <h3 className="text-xl md:text-2xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                      <GraduationCap className="w-5.5 h-5.5 text-indigo-650" /> Program Outcomes (POs)
                    </h3>
                    {(!dept.pos || dept.pos.length === 0) ? (
                      <p className="text-sm text-gray-500 font-semibold">Standard engineering program outcomes apply.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dept.pos.map((po, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-gray-200 p-4 rounded-2xl hover:border-indigo-300 transition-all shadow-sm"
                          >
                            <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">
                              PO {idx + 1} {po.title ? `• ${po.title}` : ''}
                            </span>
                            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                              {po.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: PUBLICATIONS */}
              {activeSubTab === 'publications' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 text-left">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2">
                        <BookOpenCheck className="w-5.5 h-5.5" /> Research Publications
                      </h2>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-wider">Journals, books, and conference proceedings</p>
                    </div>

                    {/* Sub-tabs for publication types */}
                    <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
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
                          className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap ${
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
                  <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 text-left">
                    {activePubType === 'journals' && (
                      <div className="overflow-x-auto">
                        {(!dept.publications?.journals || dept.publications.journals.length === 0) ? (
                          <div className="py-12 text-center text-gray-500 text-sm font-semibold">No journal articles listed.</div>
                        ) : (
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
                                  <td className="py-4 px-4 text-gray-600 leading-normal max-w-[120px]">{j.author}</td>
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
                        )}
                      </div>
                    )}

                    {activePubType === 'books' && (
                      <div className="overflow-x-auto">
                        {(!dept.publications?.books || dept.publications.books.length === 0) ? (
                          <div className="py-12 text-center text-gray-500 text-sm font-semibold">No books published.</div>
                        ) : (
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
                        )}
                      </div>
                    )}

                    {activePubType === 'conferences' && (
                      <div className="overflow-x-auto">
                        {(!dept.publications?.conferences || dept.publications.conferences.length === 0) ? (
                          <div className="py-12 text-center text-gray-500 text-sm font-semibold">No conference proceedings listed.</div>
                        ) : (
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
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PLACEMENTS & ACHIEVEMENTS */}
              {activeSubTab === 'achievements' && (
                <div className="space-y-10 text-left">
                  
                  {/* placements block */}
                  <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                    <h3 className="text-xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                      <Briefcase className="w-5.5 h-5.5 text-indigo-650" /> Student Placement Records
                    </h3>
                    
                    {(!dept.placements || dept.placements.length === 0) ? (
                      <p className="text-sm text-gray-550 font-semibold text-center py-8">First-batch students currently building projects; placements commencing soon.</p>
                    ) : (
                      <div className="overflow-x-auto">
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
                                <td className="py-3 px-4 text-indigo-600">{p.companyName}</td>
                                <td className="py-3 pl-4 text-right text-emerald-650 font-bold">{p.salaryPackage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* toppers & university ranks grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* University Rank Holders */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                      <h3 className="text-xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                        <Trophy className="w-5.5 h-5.5 text-indigo-650" /> University Rank Holders
                      </h3>
                      {(!dept.rankHolders || dept.rankHolders.length === 0) ? (
                        <p className="text-sm text-gray-500 font-semibold text-center py-6">Ranks are aggregated annually by affiliated university.</p>
                      ) : (
                        <div className="overflow-x-auto">
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
                                  <td className="py-2.5 pl-4 text-right text-amber-600 font-black">Rank {r.rank}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Semester Toppers */}
                    <div className="bg-gray-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                      <h3 className="text-xl font-black text-indigo-650 mb-6 font-title flex items-center gap-2">
                        <Award className="w-5.5 h-5.5 text-indigo-650" /> Department Toppers
                      </h3>
                      {(!dept.toppers || dept.toppers.length === 0) ? (
                        <p className="text-sm text-gray-500 font-semibold text-center py-6">Toppers data are updated following end-semester examinations.</p>
                      ) : (
                        <div className="overflow-x-auto">
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
                      )}
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
