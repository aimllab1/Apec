import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Landmark, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function UgcApprovalLetter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const docParam = searchParams.get('doc');
  
  // Default to '2f-12b'
  const [activeTab, setActiveTab] = useState(docParam === 'autonomous' ? 'autonomous' : '2f-12b');
  
  // Page selection in document viewer: 'all' | '1' | '2' | ...
  const [selectedPage, setSelectedPage] = useState('all');
  
  // Zoom level (percentage: 80% to 140%)
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Full height natural scrolling mode (no nested inner scroll trap)
  const [isFullHeight, setIsFullHeight] = useState(true);

  // References for smooth scrolling
  const pageRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (docParam === 'autonomous') {
      setActiveTab('autonomous');
    } else if (docParam === '2f-12b' || docParam === '2f') {
      setActiveTab('2f-12b');
    }
  }, [docParam]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ doc: tabKey });
    setSelectedPage('all');
    setZoomLevel(100);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 80));
  const handleZoomReset = () => setZoomLevel(100);

  const scrollToPage = (pageNum) => {
    setSelectedPage(String(pageNum));
    const ref = pageRefs.current[pageNum];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShowAll = () => {
    setSelectedPage('all');
    const ref = pageRefs.current[1];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const documents = {
    '2f-12b': {
      title: "UGC 2(f) & 12(B) Approval Letter",
      badge: "UGC Statutory Recognition • Section 2(f) & 12(B)",
      pdfUrl: "/Documents/PDFs/UGC/2f-and-12b.pdf",
      docTitle: "Official UGC 2(f) & 12(B) Recognition Document",
      pages: [
        {
          num: 1,
          src: "/Documents/PDFs/UGC/2f-and-12b-page-1.jpg",
          title: "Page 1 — UGC Statutory Recognition Order & Inclusion Notification"
        },
        {
          num: 2,
          src: "/Documents/PDFs/UGC/2f-and-12b-page-2.jpg",
          title: "Page 2 — University Grants Commission Endorsement & Schedule Terms"
        }
      ],
      stats: [
        { label: "UGC Act Section", value: "Section 2(f) & 12(B)", sub: "UGC Act, 1956" },
        { label: "Statutory Authority", value: "UGC New Delhi", sub: "Govt. of India" },
        { label: "Central Grants", value: "Eligible for Grants", sub: "Central Assistance" },
        { label: "Status Recognition", value: "Permanent (Active)", isBadge: true }
      ]
    },
    'autonomous': {
      title: "UGC Autonomous Approval Letter",
      badge: "UGC Autonomous Sanction (10 Years)",
      pdfUrl: "/Documents/PDFs/UGC/8. ugc-approval-letter.pdf",
      docTitle: "Official UGC Autonomous Status Conferment Order",
      pages: [
        {
          num: 1,
          src: "/Documents/PDFs/UGC/ugc-autonomous-page-1.jpg",
          title: "Page 1 — UGC Autonomous Conferment Order (No.F. 2-10/2023 AC-Policy)"
        },
        {
          num: 2,
          src: "/Documents/PDFs/UGC/ugc-autonomous-page-2.jpg",
          title: "Page 2 — UGC Autonomous Ten-Year Sanction Endorsement & Guidelines"
        }
      ],
      stats: [
        { label: "Letter Ref No.", value: "No.F. 2-10/2023", sub: "(AC-Policy)" },
        { label: "Issue Date", value: "8th July 2025", sub: "UGC Sanction" },
        { label: "Tenure Period", value: "2025–26 to 2034–35", sub: "10 Academic Years" },
        { label: "Status Granted", value: "Active (10 Yrs)", isBadge: true }
      ]
    }
  };

  const currentDoc = documents[activeTab] || documents['2f-12b'];
  const hasPages = currentDoc.pages && currentDoc.pages.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 md:pt-10 pb-16 md:pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="mb-6 border-b border-gray-200 pb-6 w-full text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 w-full">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-[#B38734] bg-[#FAF6EC] border border-[#E6D4B2] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full inline-flex items-center gap-1.5 uppercase shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B38734]" />
              <span>{currentDoc.badge}</span>
            </span>

            {/* Document Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl border border-slate-300/80 shadow-xs">
              <button
                type="button"
                onClick={() => handleTabChange('2f-12b')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === '2f-12b'
                    ? 'bg-[#041744] text-[#E5B54F] shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                📜 UGC 2(f) & 12(B) Letter
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('autonomous')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'autonomous'
                    ? 'bg-[#041744] text-[#E5B54F] shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                🏛️ Autonomous Status (10 Yrs)
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight text-gray-900 leading-tight">
            {currentDoc.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold mt-2">
            {activeTab === '2f-12b'
              ? "Official Statutory Recognition & Inclusion of Adhiparasakthi Engineering College under Section 2(f) and 12(B) of the UGC Act, 1956."
              : "Official 10-Year Autonomous Status Conferment Order issued by the University Grants Commission, New Delhi."}
          </p>
        </div>

        {/* Conferment Status Summary Cards */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-3xl mb-8 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-8 h-8 text-indigo-650" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full text-left">
            {currentDoc.stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 sm:border-none flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                  {stat.label}
                </span>
                {stat.isBadge ? (
                  <span className="text-[11px] sm:text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5 shadow-2xs w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {stat.value}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-black text-gray-950 block">
                    {stat.value} {stat.sub && <span className="text-gray-500 font-bold text-[9px] sm:text-xs block xs:inline">{stat.sub}</span>}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Official Document Showcase Viewer Container (Exact matching container design) */}
        <div className="bg-white border border-gray-200 p-3.5 sm:p-6 rounded-3xl mb-8 shadow-sm">
          
          {/* Document Header & Navigation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-150 w-full">
            
            {/* Title & Page Selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-indigo-650" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-black text-gray-900 font-title leading-tight">
                  {currentDoc.docTitle}
                </h3>
              </div>

              {/* Clean Page Navigation */}
              {hasPages && (
                <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold gap-1 ml-2">
                  <button
                    type="button"
                    onClick={handleShowAll}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedPage === 'all'
                        ? 'bg-[#041744] text-[#E5B54F] shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    All Pages ({currentDoc.pages.length})
                  </button>
                  {currentDoc.pages.map((p) => (
                    <button
                      key={p.num}
                      type="button"
                      onClick={() => scrollToPage(p.num)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedPage === String(p.num)
                          ? 'bg-[#041744] text-[#E5B54F] shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      Page {p.num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Document Actions: Zoom Controls & Download Buttons */}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {/* Zoom Controls */}
              {hasPages && (
                <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-white rounded-lg transition cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    title="Reset Zoom to 100%"
                    className="px-2 py-0.5 text-[11px] font-black text-slate-700 hover:bg-white rounded-md transition cursor-pointer"
                  >
                    {zoomLevel}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-white rounded-lg transition cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* View Height Toggle */}
              {hasPages && (
                <button
                  type="button"
                  onClick={() => setIsFullHeight(!isFullHeight)}
                  title={isFullHeight ? "Switch to Scroll Box" : "Switch to Full Page View"}
                  className="hidden md:flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                >
                  {isFullHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullHeight ? "Compact View" : "Full View"}</span>
                </button>
              )}

              {/* Download Original PDF Button */}
              <a 
                href={currentDoc.pdfUrl} 
                download
                title="Download Official UGC Letter PDF"
                className="text-[11px] sm:text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-700 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>

              {/* Open in New Tab Button */}
              <a 
                href={currentDoc.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Open PDF in new browser tab"
                className="text-[11px] sm:text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Tab</span>
              </a>
            </div>
          </div>

          {/* MAIN PROPER DOCUMENT VIEW WITH SMOOTH SCROLLING */}
          {hasPages && (
            <div 
              ref={containerRef}
              className={`w-full bg-slate-100/90 rounded-2xl p-3 sm:p-6 md:p-8 border border-slate-200 shadow-inner transition-all duration-300 scroll-smooth ${
                isFullHeight 
                  ? 'overflow-visible' 
                  : 'overflow-y-auto max-h-[800px] overscroll-contain [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]'
              }`}
            >
              <div 
                className="flex flex-col items-center gap-8 mx-auto transition-all duration-300"
                style={{ width: `${zoomLevel}%`, maxWidth: '100%' }}
              >
                {currentDoc.pages
                  .filter((p) => selectedPage === 'all' || selectedPage === String(p.num))
                  .map((p) => (
                    <div 
                      key={p.num}
                      ref={(el) => { pageRefs.current[p.num] = el; }} 
                      className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden relative transition-all duration-200 scroll-mt-6"
                    >
                      {/* Document Page Header Bar */}
                      <div className="bg-[#041744] text-slate-100 px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{p.title}</span>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-[#E5B54F] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider ml-2 shrink-0 border border-slate-700">
                          Page {p.num} of {currentDoc.pages.length}
                        </span>
                      </div>

                      {/* Official Document Page Content */}
                      <div className="p-2 sm:p-4 bg-white flex justify-center">
                        <img 
                          src={p.src} 
                          alt={p.title}
                          className="w-full h-auto object-contain block bg-white select-none rounded-lg"
                          loading="eager"
                        />
                      </div>
                    </div>
                  ))}
              </div>

              {/* Smooth Quick-Navigation Footer Strip (When viewing all pages) */}
              {selectedPage === 'all' && currentDoc.pages.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-200 flex-wrap">
                  {currentDoc.pages.map((p) => (
                    <button
                      key={p.num}
                      type="button"
                      onClick={() => scrollToPage(p.num)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      {p.num === 1 ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />}
                      <span>Scroll to Page {p.num}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Status Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-150 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official University Grants Commission Gazette Order • Permanent Statutory Record</span>
            </span>
            <a 
              href={currentDoc.pdfUrl} 
              download 
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 ml-auto"
            >
              <Download className="w-3 h-3" />
              <span>Download PDF File ({currentDoc.pdfUrl.split('/').pop()})</span>
            </a>
          </div>

        </div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • Recognized under UGC 2(f) & 12(B) • ISO 9001:2015 Certified
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}




