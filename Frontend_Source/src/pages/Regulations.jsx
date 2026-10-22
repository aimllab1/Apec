import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, FileText, Award, Download, CheckCircle2, 
  ExternalLink, GraduationCap, ShieldCheck, Sparkles, 
  Layers, Clock, ArrowRight, Search, ChevronRight, Landmark
} from 'lucide-react';

export default function Regulations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const param = searchParams.get('reg');
    if (param === '26' || param === 'reg26' || param === 'r2026') return 'reg26';
    if (param === '25' || param === 'reg25' || param === 'r2025') return 'reg25';
    if (param === '21' || param === 'reg21' || param === 'r2021') return 'reg21';
    return 'reg26';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const param = searchParams.get('reg');
    if (param === '26' || param === 'reg26' || param === 'r2026') setActiveTab('reg26');
    else if (param === '25' || param === 'reg25' || param === 'r2025') setActiveTab('reg25');
    else if (param === '21' || param === 'reg21' || param === 'r2021') setActiveTab('reg21');
  }, [searchParams]);

  const regulationsList = [
    {
      id: 'reg26',
      badge: 'Reg 26',
      year: '2026',
      title: 'Autonomous Regulation 2026 (Reg 26 / R-2026)',
      subtitle: 'Next-Gen Outcome Based Education (OBE), AI-Integrated CBCS & Industry 4.0 Curriculum',
      status: 'Latest Active Autonomous Regulation',
      effectiveFrom: '2026–2027 Academic Batch Onwards',
      applicableFor: 'B.E., B.Tech, M.E., MBA & MCA Degrees',
      overview: 'APEC Autonomous Regulation 2026 (Reg 26) embodies next-generation pedagogical standards, National Education Policy (NEP 2020) guidelines, AICTE Model Curriculum 2026, interdisciplinary AI/GenAI integrations, global industry internships, and multi-disciplinary dual-degree tracks.',
      features: [
        'Advanced Choice Based Credit System (CBCS) with cutting-edge industry specializations',
        'Honors Degree & Interdisciplinary Minor Degrees with 18 specialized credits',
        'Mandatory Full-Semester Global Industry Internship & Incubator Venture Projects',
        'Balanced Evaluation: Continuous Assessment (CIA: 40%) + End Semester Exam (ESE: 60%)',
        'Fast-track final semester for industry-placed students with full-time corporate internships',
        'Credit transfer up to 12 credits for NPTEL, SWAYAM, Coursera & IIT Madras certifications'
      ],
      documents: [
        { name: 'APEC Autonomous Reg 26 UG Academic Regulations (B.E. / B.Tech)', size: '2.8 MB', type: 'PDF' },
        { name: 'APEC Autonomous Reg 26 PG Academic Regulations (M.E. / MBA / MCA)', size: '2.1 MB', type: 'PDF' },
        { name: 'Reg 26 CBCS Curriculum Framework & Credit Distribution Matrix', size: '1.5 MB', type: 'PDF' },
        { name: 'Reg 26 Honors & Minor Specialization Guidelines Handbook', size: '1.1 MB', type: 'PDF' }
      ]
    },
    {
      id: 'reg25',
      badge: 'Reg 25',
      year: '2025',
      title: 'Autonomous Regulation 2025 (Reg 25 / R-2025)',
      subtitle: 'Outcome Based Education (OBE) & Flexible Choice Based Credit System (CBCS)',
      status: 'Active Autonomous Regulation',
      effectiveFrom: '2025–2026 Academic Batches',
      applicableFor: 'B.E., B.Tech, M.E., MBA & MCA Degrees',
      overview: 'APEC Autonomous Regulation 2025 (Reg 25) focuses on flexible academic progression, project-based experiential learning, blended digital courseware, and comprehensive industry-aligned elective tracks.',
      features: [
        'Choice Based Credit System (CBCS) with wide open elective options across all departments',
        'Mandatory 6-week Industry Internship / Hands-on Lab Training Certification',
        'Continuous Internal Assessment (CIA) through 3 structured periodic assessments',
        'Honors with Specialization and Minor Degree pathways for meritorious students',
        'Direct NPTEL / MOOC online course credit integration up to 6 credits'
      ],
      documents: [
        { name: 'APEC Autonomous Reg 25 UG Regulations Handbook (B.E. / B.Tech)', size: '2.5 MB', type: 'PDF' },
        { name: 'APEC Autonomous Reg 25 PG Academic Regulations (M.E. / MBA / MCA)', size: '1.9 MB', type: 'PDF' },
        { name: 'Reg 25 CBCS Curriculum & Assessment Norms', size: '1.3 MB', type: 'PDF' }
      ]
    },
    {
      id: 'reg21',
      badge: 'Reg 21',
      year: '2021',
      title: 'Anna University & Autonomous Regulation 2021 (Reg 21 / R-2021)',
      subtitle: 'University Affiliated CBCS Curriculum & Evaluation Framework',
      status: 'Active for Enrolled Senior Batches',
      effectiveFrom: '2021–2022 Batches Onwards',
      applicableFor: 'B.E., B.Tech, M.E., MBA & MCA Degrees',
      overview: 'Structured in accordance with Anna University Chennai and Autonomous guidelines, emphasizing fundamental core engineering competencies, laboratory proficiency, and rigorous technical capstone projects.',
      features: [
        '160–165 Total Credits requirement for 4-year B.E. / B.Tech graduation',
        'Professional Electives and Open Electives across participating engineering branches',
        'Letter Grade Classifications: O (Outstanding), A+, A, B+, B, C, RA (Reappear)',
        'Mandatory Audit Courses in Environmental Science, Constitution of India & Professional Ethics',
        'Continuous Internal Assessments computed from 3 periodic reviews'
      ],
      documents: [
        { name: 'Anna University Reg 21 UG Academic Regulations & Evaluation Norms', size: '3.1 MB', type: 'PDF' },
        { name: 'Anna University Reg 21 PG Academic Regulations', size: '2.2 MB', type: 'PDF' },
        { name: 'Reg 21 Letter Grading Scale & CGPA Computation Norms', size: '840 KB', type: 'PDF' }
      ]
    }
  ];

  const currentReg = regulationsList.find(r => r.id === activeTab) || regulationsList[0];

  const filteredDocs = currentReg.documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-4 sm:pt-6 md:pt-8 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Breadcrumb & Titles */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-3">
            <Link to="/" className="hover:text-indigo-650">Home</Link>
            <span>/</span>
            <span className="text-indigo-650">Academics</span>
            <span>/</span>
            <span className="text-gray-800">Regulations</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Autonomous Academic Governance
              </span>
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
                style={{ fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif" }}
              >
                Academic Regulations & Curriculum
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-2xl mt-2 leading-relaxed">
                Official rules, Choice Based Credit System (CBCS) framework, examination guidelines, evaluation metrics, and curriculum handbooks governing undergraduate and postgraduate studies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                to="/departments" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-700 hover:text-indigo-650 hover:border-indigo-300 shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                View Departments
              </Link>
              <Link 
                to="/coe" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-650 text-white text-xs font-black hover:bg-indigo-700 shadow-sm transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                CoE Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Regulation Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {regulationsList.map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                setActiveTab(reg.id);
                setSearchParams({ reg: reg.badge.toLowerCase().replace(/\s+/g, '') });
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 shadow-xs ${
                activeTab === reg.id
                  ? 'bg-[#041744] text-[#E5B54F] border border-[#D4A347]/50 shadow-md ring-2 ring-amber-100'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === reg.id ? 'text-[#E5B54F]' : 'text-gray-400'}`} />
              <span className="font-extrabold">{reg.badge}</span>
              <span className="text-xs opacity-80">({reg.year})</span>
              {reg.id === 'reg26' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                  Latest
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Regulation Content Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-left">
          
          {/* Top Title & Metadata */}
          <div className="space-y-3 border-b border-gray-150 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase rounded-full">
                ⭐ {currentReg.status}
              </span>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span>🗓️ <strong className="text-gray-700">Effective:</strong> {currentReg.effectiveFrom}</span>
                <span>•</span>
                <span>🎓 <strong className="text-gray-700">Programmes:</strong> {currentReg.applicableFor}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-title">
              {currentReg.title}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-indigo-650">
              {currentReg.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed pt-1">
              {currentReg.overview}
            </p>
          </div>

          {/* Key Salient Features Grid */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Salient Highlights & Academic Framework
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentReg.features.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-150 flex items-start gap-3 text-xs sm:text-sm font-medium text-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Downloadable Documents & Handbooks */}
          <div className="space-y-4 pt-4 border-t border-gray-150">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Regulations Handbooks & Document Downloads
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search regulation handbook..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {doc.type}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-indigo-650 transition-colors truncate">
                        {doc.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-gray-400">
                        Official Gazette PDF • {doc.size}
                      </span>
                    </div>
                  </div>

                  <a 
                    href="#download" 
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading: ${doc.name}`);
                    }}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 group-hover:bg-indigo-650 group-hover:text-white text-gray-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                    title="Download Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Callout Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-[#041744] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-black text-[#E5B54F]">
                Looking for specific Department Curriculum & Syllabi?
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                Access semester-wise theory, practical laboratories, and elective curriculum schemes for all 14 engineering and PG branches.
              </p>
            </div>
            <Link 
              to="/departments" 
              className="px-5 py-2.5 rounded-xl bg-[#D4A347] text-[#041744] font-black text-xs uppercase tracking-wider hover:bg-[#E5B54F] transition-all shadow-md shrink-0 whitespace-nowrap"
            >
              Explore Departments &rarr;
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
