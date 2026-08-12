import React from 'react';
import { Download, FileText, Landmark, ExternalLink } from 'lucide-react';

export default function UgcApprovalLetter() {
  const pdfUrl = "/Documents/PDFs/UGC/8. ugc-approval-letter.pdf";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-6 md:pt-10 pb-16 md:pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="mb-6 border-b border-gray-200 pb-6 w-full text-left">
          <div className="flex items-center justify-between gap-3 mb-4 w-full">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full inline-block uppercase">
              UGC Autonomous Sanction
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight text-gray-900 leading-tight">
            UGC Autonomous Approval Letter
          </h1>
        </div>

        {/* Conferment Status Card */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-3xl mb-8 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-8 h-8 text-indigo-650" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full text-left">
            <div className="bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 sm:border-none flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Letter Ref No.</span>
              <span className="text-xs sm:text-sm font-black text-gray-950 block">No.F. 2-10/2023 <span className="text-gray-500 font-bold text-[9px] sm:text-xs block xs:inline">(AC-Policy)</span></span>
            </div>
            <div className="bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 sm:border-none flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Issue Date</span>
              <span className="text-xs sm:text-sm font-black text-gray-950 block">8th July 2025</span>
            </div>
            <div className="bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 sm:border-none flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Tenure Period</span>
              <span className="text-xs sm:text-sm font-black text-gray-950 block">2025–26 to 2034–35</span>
            </div>
            <div className="bg-slate-50/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border border-slate-100 sm:border-none flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Status Granted</span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5 shadow-2xs w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active (10 Yrs)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Embedded PDF Document Viewer */}
        <div className="bg-white border border-gray-200 p-3.5 sm:p-6 rounded-3xl mb-8 shadow-sm">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 mb-4 pb-3 border-b border-gray-150 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-650" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-base font-black text-gray-900 font-title leading-tight truncate sm:whitespace-normal">
                  Official UGC Autonomous Approval Order Document
                </h3>
              </div>
            </div>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              title="Open / Download Approval Letter PDF"
              className="text-[11px] sm:text-xs font-bold text-indigo-650 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ml-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open / Download PDF</span>
              <span className="sm:hidden text-[10px] font-extrabold uppercase">PDF</span>
            </a>
          </div>

          {/* PDF Viewer Frame */}
          <div className="w-full h-[500px] xs:h-[580px] sm:h-[720px] rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner">
            <iframe 
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`} 
              className="w-full h-full border-none"
              title="Official UGC Autonomous Approval Letter PDF"
            />
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • ISO 9001:2015 Certified
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
