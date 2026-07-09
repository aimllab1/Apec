import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileText, ShieldCheck, ChevronDown, ChevronRight,
  Search, Calendar, BookOpen, Award, Building2, Scale, ListFilter, Target
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export default function Disclosures() {
  const [activeTab, setActiveTab] = useState('nirf'); // nirf, aicte, ugc-audits, rules
  const [searchTerm, setSearchTerm] = useState('');
  
  // Collapsible accordion states for AICTE BE, MBA, MCA lists
  const [expandedSection, setExpandedSection] = useState(null); // null, 'be', 'mba', 'mca', 'nba'

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const auditingReports = [
    { title: "Auditing Report 2014 - 2015", filename: "2014-2015.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2013 - 2014", filename: "2013-14.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2012 - 2013", filename: "2012-13.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2011 - 2012", filename: "2011-12.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2010 - 2011", filename: "2010-11.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2009 - 2010", filename: "2009-10.pdf", folder: "Auditing Report" },
    { title: "Auditing Report 2008 - 2009", filename: "2008-09.pdf", folder: "Auditing Report" }
  ];

  const nirfFiles = [
    { title: "NIRF Engineering 2025", filename: "NIRF_ENGINEERING_2025_JAN.pdf", folder: "NIRF - Engineering", category: "Engineering" },
    { title: "NIRF Engineering 2024", filename: "APEC___NIRF_Engineering_2024_(IR-E-C-16487).pdf", folder: "NIRF - Engineering", category: "Engineering" },
    { title: "NIRF Engineering Archive", filename: "19b8c368-a590-4d21-846e-1e75080771b6.pdf", folder: "NIRF - Engineering", category: "Engineering" },
    
    { title: "NIRF Management 2025", filename: "NIRF_MANAGEMENT_2025_JAN.pdf", folder: "NIRF - Management", category: "Management" },
    
    { title: "NIRF Overall 2025", filename: "NIFR_-_OVERALL_2025_JAN.pdf", folder: "NIRF - Overall", category: "Overall" },
    { title: "NIRF Overall 2024", filename: "APEC___NIRF_Overall_2024_(IR-O-C-16487).pdf", folder: "NIRF - Overall", category: "Overall" },
    { title: "NIRF Overall Archive", filename: "2da95f6d-becf-4fab-81c9-1bbb3fc1d752.pdf", folder: "NIRF - Overall", category: "Overall" },
    
    { title: "NIRF SDG Report 2025", filename: "NIRF_SDG_2025_JAN.pdf", folder: "NIRF - SDG", category: "SDG" }
  ];

  const serviceRules = [
    { title: "Service Rules for Teaching Staff", filename: "teaching.pdf", folder: "Service Rules" },
    { title: "Service Rules for Non-Teaching Staff", filename: "non-teaching_compressed.pdf", folder: "Service Rules" }
  ];

  const aicteGeneral = [
    { title: "AICTE Approval Process Handbook (2024 - 2027)", filename: "aicte approval process handbook 2024-27.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters" },
    { title: "State Government Approval Letter", filename: "STATE GOVERNMENT APPROVAL.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters" }
  ];

  const naacAccreditation = [
    { title: "NAAC Accreditation Certificate", filename: "NAAC ACCREDIATION.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/NAAC Accreditation" }
  ];

  const nbaAccreditation = [
    { title: "NBA Accreditation (2013 - 2015)", filename: "2013-2015.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/NBA Accreditation" },
    { title: "NBA Accreditation (2009 - 2011)", filename: "2009-2011.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/NBA Accreditation" },
    { title: "NBA Accreditation (2004 - 2007)", filename: "2004-2007.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/NBA Accreditation" }
  ];

  const ugcApprovals = [
    { title: "UGC Autonomous Approval Letter", filename: "ugc-approval-letter.pdf", folder: "Statutory Body Approvals/UGC Approval Letters" }
  ];

  const mandatoryDisclosure = [
    { title: "Mandatory Disclosure Report", filename: "Mandatory_Disclosure.pdf", folder: "Mandatory Disclosure" }
  ];

  const securityAudit = [
    { title: "Campus Security Audit Report", filename: "security_audit_report.pdf", folder: "Campus Security Audit" }
  ];

  // Large AICTE Course Approval Lists (B.E., M.B.A., M.C.A.)
  const beApprovals = [
    { title: "AICTE Approval 2025 - 2026 (B.E.)", filename: "2025-2026-ENGG.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2024 - 2025 (B.E.)", filename: "2024-2025-BE.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2023 - 2024 (B.E.)", filename: "2023-2024-BE.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2022 - 2023 (B.E.)", filename: "2022-2023.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2020 - 2021 (B.E.)", filename: "2020-2021.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2019 - 2020 (B.E.)", filename: "2019-2020.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2018 - 2019 (B.E.)", filename: "2018-2019.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2017 - 2018 (B.E.)", filename: "2017-2018.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2016 - 2017 (B.E.)", filename: "2016-2017.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2015 - 2016 (B.E.)", filename: "2015-2016.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2014 - 2015 (B.E.)", filename: "2014-2015.PDF", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2013 - 2014 (B.E.)", filename: "2013-2014.PDF", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2012 - 2013 (B.E.)", filename: "2012-2013.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2011 - 2012 (B.E.)", filename: "2011-2012.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2010 - 2011 (B.E.)", filename: "2010-2011.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2009 - 2010 (B.E.)", filename: "2009-2010.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2008 - 2009 (B.E.)", filename: "2008-2009.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2007 - 2008 (B.E.)", filename: "2007-2008.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2006 - 2007 (B.E.)", filename: "2006-2007.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2005 - 2006 (B.E.)", filename: "2005-2006.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 2002 - 2005 (B.E.)", filename: "2002-2005.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 1997 - 2002 (B.E.)", filename: "1997-2002.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 1994 - 1997 (B.E.)", filename: "1994-1997.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 1993 - 1994 (B.E.)", filename: "1993-1994.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" },
    { title: "AICTE Approval 1991 - 1993 (B.E.)", filename: "1991-1993.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/B.E" }
  ];

  const mbaApprovals = [
    { title: "AICTE Approval 2025 - 2026 (M.B.A.)", filename: "2025-26-MBA.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2024 - 2025 (M.B.A.)", filename: "2024-25-MBA.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2023 - 2024 (M.B.A.)", filename: "2023-2024.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2022 - 2023 (M.B.A.)", filename: "2022-2023.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2021 - 2022 (M.B.A.)", filename: "2021-2022.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2020 - 2021 (M.B.A.)", filename: "2020-2021.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2019 - 2020 (M.B.A.)", filename: "2019-2020.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2018 - 2019 (M.B.A.)", filename: "2018-2019.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2016 - 2017 (M.B.A.)", filename: "2016-2017.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2015 - 2016 (M.B.A.)", filename: "2015-2016.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2014 - 2015 (M.B.A.)", filename: "2014-2015.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2009 - 2012 (M.B.A.)", filename: "2009-2012.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2008 - 2009 (M.B.A.)", filename: "2008-2009.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2007 - 2008 (M.B.A.)", filename: "2007-2008.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2006 - 2007 (M.B.A.)", filename: "2006-2007.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 2003 - 2006 (M.B.A.)", filename: "2003-2006.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 1999 - 2003 (M.B.A.)", filename: "1999-2003.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 1998 - 1999 (M.B.A.)", filename: "1998-1999.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 1996 - 1998 (M.B.A.)", filename: "1996-1998.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" },
    { title: "AICTE Approval 1995 - 1996 (M.B.A.)", filename: "1995-1996.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.B.A" }
  ];

  const mcaApprovals = [
    { title: "AICTE Approval 2025 - 2026 (M.C.A.)", filename: "2025-26 MCA.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2024 - 2025 (M.C.A.)", filename: "2024-25 MCA.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2023 - 2024 (M.C.A.)", filename: "2023-2024 MCA.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2022 - 2023 (M.C.A.)", filename: "2022-2023.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2021 - 2022 (M.C.A.)", filename: "2021-2022.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2020 - 2021 (M.C.A.)", filename: "2020-2021.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2019 - 2020 (M.C.A.)", filename: "2019-2020.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2018 - 2019 (M.C.A.)", filename: "2018-2019.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2017 - 2018 (M.C.A.)", filename: "2017-2018.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2016 - 2017 (M.C.A.)", filename: "2016-2017.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2015 - 2016 (M.C.A.)", filename: "2015-2016.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2014 - 2015 (M.C.A.)", filename: "2014-2015.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2013 - 2014 (M.C.A.)", filename: "2013-2014.PDF", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2012 - 2013 (M.C.A.)", filename: "2012-2013.PDF", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2011 - 2012 (M.C.A.)", filename: "2011-2012.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2010 - 2011 (M.C.A.)", filename: "2010-2011.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2009 - 2010 (M.C.A.)", filename: "2009-2010.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2008 - 2009 (M.C.A.)", filename: "2008-2009.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2007 - 2008 (M.C.A.)", filename: "2007-2008.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2006 - 2007 (M.C.A.)", filename: "2006-2007.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2003 - 2006 (M.C.A.)", filename: "2003-2006.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2001 - 2003 (M.C.A.)", filename: "2001-2003.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 2000 - 2001 (M.C.A.)", filename: "2000-2001.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 1999 - 2000 (M.C.A.)", filename: "1999-2000.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" },
    { title: "AICTE Approval 1998 - 1999 (M.C.A.)", filename: "1998-1999.pdf", folder: "Statutory Body Approvals/AICTE Approval Letters/M.C.A" }
  ];

  // Helper to filter documents based on active tab and search query
  const getFilteredDocs = () => {
    let list = [];
    if (activeTab === 'nirf') {
      list = []; // Handled separately in custom markup
    } else if (activeTab === 'ugc-audits') {
      list = [...ugcApprovals, ...auditingReports, ...securityAudit, ...mandatoryDisclosure];
    } else if (activeTab === 'rules') {
      list = serviceRules;
    } else if (activeTab === 'aicte') {
      list = [...aicteGeneral, ...naacAccreditation, ...nbaAccreditation];
    }

    if (!searchTerm.trim()) return list;
    return list.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const getFilteredBE = useMemo(() => {
    if (!searchTerm.trim()) return beApprovals;
    return beApprovals.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const getFilteredMBA = useMemo(() => {
    if (!searchTerm.trim()) return mbaApprovals;
    return mbaApprovals.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const getFilteredMCA = useMemo(() => {
    if (!searchTerm.trim()) return mcaApprovals;
    return mcaApprovals.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const filteredGeneralList = getFilteredDocs();

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FFE7CC]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              Statutory Disclosures & Ratings
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              Statutory Disclosures (NIRF, AICTE & MD)
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              Access the official institutional reports, mandatory disclosures, national rankings (NIRF), AICTE approval processes, NAAC & NBA accreditations, audited statements, and service rules.
            </p>
          </div>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-none w-full md:w-auto">
            <button 
              onClick={() => { setActiveTab('nirf'); setSearchTerm(''); }}
              className={`py-4 px-5 font-title text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'nirf' 
                  ? 'border-[#FF8A00] text-[#FF8A00]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4" /> NIRF Rankings
            </button>
            <button 
              onClick={() => { setActiveTab('aicte'); setSearchTerm(''); }}
              className={`py-4 px-5 font-title text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'aicte' 
                  ? 'border-[#FF8A00] text-[#FF8A00]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4" /> AICTE & Accreditations
            </button>
            <button 
              onClick={() => { setActiveTab('ugc-audits'); setSearchTerm(''); }}
              className={`py-4 px-5 font-title text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ugc-audits' 
                  ? 'border-[#FF8A00] text-[#FF8A00]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> UGC, Audits & MD
            </button>
            <button 
              onClick={() => { setActiveTab('rules'); setSearchTerm(''); }}
              className={`py-4 px-5 font-title text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'rules' 
                  ? 'border-[#FF8A00] text-[#FF8A00]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Scale className="w-4 h-4" /> Service Rules
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search reports/documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#FF8A00] rounded-xl text-xs font-semibold focus:outline-none focus:ring-0 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Tab Contents Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              {/* Category-specific descriptions */}
              {activeTab === 'nirf' && (
                <div className="space-y-10">
                  <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-base font-black text-gray-900 flex items-center gap-2.5 mb-2">
                      National Institutional Ranking Framework (NIRF)
                    </h3>
                    <p className="text-xs font-semibold text-gray-550 leading-relaxed">
                      NIRF rankings evaluate Adhiparasakthi Engineering College (APEC) across core parameters: Teaching, Learning & Resources (TLR), Research and Professional Practice (RP), Graduation Outcomes (GO), Outreach and Inclusivity (OI), and Perception. Below are the official NIRF report submissions separated by discipline.
                    </p>
                  </motion.div>

                  {[
                    { name: "NIRF Overall Rankings", icon: Award, color: "text-[#FF8A00] bg-[#FFE7CC]/50 border-[#FFE7CC]", files: nirfFiles.filter(f => f.category === "Overall") },
                    { name: "NIRF Engineering Rankings", icon: Building2, color: "text-indigo-650 bg-indigo-50 border-indigo-100", files: nirfFiles.filter(f => f.category === "Engineering") },
                    { name: "NIRF Management Rankings", icon: Target, color: "text-emerald-650 bg-emerald-50 border-emerald-100", files: nirfFiles.filter(f => f.category === "Management") },
                    { name: "NIRF Sustainable Development Goals (SDG)", icon: ShieldCheck, color: "text-violet-650 bg-violet-50 border-violet-100", files: nirfFiles.filter(f => f.category === "SDG") }
                  ].map((cat, catIdx) => (
                    <motion.div key={catIdx} variants={fadeInUp} className="space-y-4">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                        <cat.icon className="w-4 h-4 text-gray-500" /> {cat.name}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cat.files
                          .filter(file => !searchTerm || file.title.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((file, fileIdx) => (
                            <div 
                              key={fileIdx}
                              className="bg-white border border-gray-200 hover:border-[#FFE7CC] p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                            >
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <span className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-150 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-[#FF8A00] group-hover:bg-[#FFE7CC]/30 transition-colors">
                                  <FileText className="w-5 h-5" />
                                </span>
                                <span className="text-xs font-black text-gray-500 uppercase tracking-wider bg-slate-50 border border-gray-100 px-2 py-0.5 rounded-md">Official PDF</span>
                              </div>
                              
                              <div className="text-left mb-6">
                                <h5 className="text-sm font-black text-gray-955 group-hover:text-[#FF8A00] transition-colors leading-snug">{file.title}</h5>
                              </div>

                              <a 
                                href={`/disclosures/${encodeURIComponent(file.folder)}/${encodeURIComponent(file.filename)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-center py-3 rounded-xl border border-gray-200 group-hover:border-[#FF8A00] text-sm font-black uppercase tracking-wider text-gray-700 group-hover:text-[#FF8A00] group-hover:bg-[#FFE7CC]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> View / Download PDF
                              </a>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'aicte' && (
                <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2.5 mb-2">
                    AICTE Approval & National Accreditations
                  </h3>
                  <p className="text-xs font-semibold text-gray-550 leading-relaxed">
                    AICTE letters approve course capacity expansions, autonomy directives, and institution validation. NBA accreditation certificates approve departmental standards. Access the current approval guidelines and comprehensive program histories below.
                  </p>
                </motion.div>
              )}

              {activeTab === 'ugc-audits' && (
                <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2.5 mb-2">
                    UGC Approval, Statutory Audited Statements & Mandatory Disclosures
                  </h3>
                  <p className="text-xs font-semibold text-gray-550 leading-relaxed">
                    Official UGC autonomous validation reports, Mandatory Disclosure forms under AICTE rules, statutory annual auditing reports, and campus security audit evaluations.
                  </p>
                </motion.div>
              )}

              {activeTab === 'rules' && (
                <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2.5 mb-2">
                    Institutional Code of Conduct & Service Rules
                  </h3>
                  <p className="text-xs font-semibold text-gray-550 leading-relaxed">
                    Governing directives, service rules, code of ethics, duties, and institutional policies outlining professional conduct for both teaching faculty and non-teaching administration.
                  </p>
                </motion.div>
              )}

              {/* Main List Grid */}
              {activeTab !== 'nirf' && (
                <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGeneralList.map((doc, idx) => (
                    <motion.div 
                      key={idx}
                      variants={fadeInUp}
                      className="bg-white border border-gray-200 hover:border-[#FFE7CC] p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-150 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-[#FF8A00] group-hover:bg-[#FFE7CC]/30 transition-colors">
                          <FileText className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider bg-slate-50 border border-gray-100 px-2 py-0.5 rounded-md">
                          {doc.category || "Official PDF"}
                        </span>
                      </div>
                      
                      <div className="text-left mb-6">
                        <h5 className="text-sm font-black text-gray-955 group-hover:text-[#FF8A00] transition-colors leading-snug">{doc.title}</h5>
                      </div>

                      <a 
                        href={`/disclosures/${encodeURIComponent(doc.folder)}/${encodeURIComponent(doc.filename)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 rounded-xl border border-gray-200 group-hover:border-[#FF8A00] text-sm font-black uppercase tracking-wider text-gray-700 group-hover:text-[#FF8A00] group-hover:bg-[#FFE7CC]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> View / Download PDF
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Special collapsible sections for B.E., MBA, and MCA AICTE lists (Only rendered in AICTE tab) */}
              {activeTab === 'aicte' && (
                <motion.div variants={fadeInUp} className="space-y-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-black font-title text-gray-900 uppercase tracking-wider mb-4">
                    Course Approval Letter Repositories
                  </h4>
                  
                  {/* BE Section */}
                  <div className="border border-gray-200 rounded-3xl bg-white overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleSection('be')}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF8A00]" /> Under Graduate (B.E.) AICTE Approval Letters (1991 - 2026)
                        <span className="text-[10px] bg-[#FFE7CC]/80 border border-[#FFE7CC] text-[#FF8A00] px-2.5 py-0.5 rounded-full font-black ml-2">
                          {getFilteredBE.length} Files
                        </span>
                      </span>
                      {expandedSection === 'be' ? <ChevronDown className="w-4 h-4 text-gray-500 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSection === 'be' && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-gray-150"
                        >
                          <div className="p-6 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto scrollbar-thin">
                            {getFilteredBE.map((doc, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-[#FFE7CC] transition-colors">
                                <div className="text-left">
                                  <span className="text-xs font-black text-gray-955 block">{doc.title}</span>
                                  <span className="text-[10px] font-bold text-gray-500 block mt-0.5">{doc.filename}</span>
                                </div>
                                <a 
                                  href={`/disclosures/${encodeURIComponent(doc.folder)}/${encodeURIComponent(doc.filename)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#FF8A00] hover:border-[#FFE7CC] hover:bg-[#FFE7CC]/20 transition-all shrink-0 cursor-pointer"
                                  title="Download"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* MBA Section */}
                  <div className="border border-gray-200 rounded-3xl bg-white overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleSection('mba')}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-650" /> Post Graduate (M.B.A.) AICTE Approval Letters (1995 - 2026)
                        <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-650 px-2.5 py-0.5 rounded-full font-black ml-2">
                          {getFilteredMBA.length} Files
                        </span>
                      </span>
                      {expandedSection === 'mba' ? <ChevronDown className="w-4 h-4 text-gray-500 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSection === 'mba' && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-gray-150"
                        >
                          <div className="p-6 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto scrollbar-thin">
                            {getFilteredMBA.map((doc, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-indigo-200 transition-colors">
                                <div className="text-left">
                                  <span className="text-xs font-black text-gray-955 block">{doc.title}</span>
                                  <span className="text-[10px] font-bold text-gray-500 block mt-0.5">{doc.filename}</span>
                                </div>
                                <a 
                                  href={`/disclosures/${encodeURIComponent(doc.folder)}/${encodeURIComponent(doc.filename)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all shrink-0 cursor-pointer"
                                  title="Download"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* MCA Section */}
                  <div className="border border-gray-200 rounded-3xl bg-white overflow-hidden shadow-sm">
                    <button 
                      onClick={() => toggleSection('mca')}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-650" /> Post Graduate (M.C.A.) AICTE Approval Letters (1998 - 2026)
                        <span className="text-[10px] bg-violet-50 border border-violet-100 text-violet-650 px-2.5 py-0.5 rounded-full font-black ml-2">
                          {getFilteredMCA.length} Files
                        </span>
                      </span>
                      {expandedSection === 'mca' ? <ChevronDown className="w-4 h-4 text-gray-500 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSection === 'mca' && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-gray-150"
                        >
                          <div className="p-6 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto scrollbar-thin">
                            {getFilteredMCA.map((doc, idx) => (
                              <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-violet-200 transition-colors">
                                <div className="text-left">
                                  <span className="text-xs font-black text-gray-955 block">{doc.title}</span>
                                  <span className="text-[10px] font-bold text-gray-500 block mt-0.5">{doc.filename}</span>
                                </div>
                                <a 
                                  href={`/disclosures/${encodeURIComponent(doc.folder)}/${encodeURIComponent(doc.filename)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-violet-650 hover:border-violet-100 hover:bg-violet-50/50 transition-all shrink-0 cursor-pointer"
                                  title="Download"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-255 p-6 rounded-2xl text-center">
          <p className="text-sm md:text-base font-extrabold text-gray-600 leading-relaxed">
            Adhiparasakthi Engineering College • Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
