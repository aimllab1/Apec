import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Landmark, Check, QrCode, PhoneCall, Copy, ArrowRight, MessageSquare, Compass } from 'lucide-react';

const bankDetails = {
  name: "Central Bank of India",
  branch: "Melmaruvathur",
  ifsc: "CBIN0283083"
};

const feeAccounts = [
  { id: 1, type: "Tuition Fee", accountNumber: "1396202317" },
  { id: 2, type: "Anna University Registration Fee", accountNumber: "1396204325" },
  { id: 3, type: "Association Fee", accountNumber: "3687860350" },
  { id: 4, type: "Books and Stationeries Fee", accountNumber: "1396204234" },
  { id: 5, type: "Training and Placement Fee", accountNumber: "1396215338" },
  { id: 6, type: "Bus Fee", accountNumber: "1396227456" },
  { id: 7, type: "Gents Hostel Fee", accountNumber: "1396204143" },
  { id: 8, type: "Ladies Hostel Fee", accountNumber: "1396202260" },
  { id: 9, type: "Application Fee", accountNumber: "1396202317" }
];

export default function FeePayment() {
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedFee, setSelectedFee] = useState(feeAccounts[0].type);
  const [amount, setAmount] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [upiLink, setUpiLink] = useState('');
  const [showUpiResult, setShowUpiResult] = useState(false);

  const getAccountForType = (type) => {
    return feeAccounts.find(acc => acc.type === type)?.accountNumber || '';
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateUpiQr = (e) => {
    e.preventDefault();
    if (!studentName || !department || !amount) {
      alert("Please fill in Student Name, Department, and Amount.");
      return;
    }

    const accountNumber = getAccountForType(selectedFee);
    // Standard NPCI format to route UPI payment to account number & IFSC
    const upiId = `${accountNumber}@${bankDetails.ifsc}.ifsc.npci`;
    const note = `${studentName.trim().slice(0, 10)} ${department.trim().slice(0, 10)} ${selectedFee.slice(0, 15)}`;
    
    // Construct UPI URI
    const upiUrl = `upi://pay?pa=${upiId}&pn=Adhiparasakthi%20Engineering%20College&tn=${encodeURIComponent(note)}&am=${amount}&cu=INR`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
    
    setUpiLink(upiUrl);
    setQrCodeUrl(qrApiUrl);
    setShowUpiResult(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-black tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full uppercase">
            Om Sakthi
          </span>
          <h1 className="font-title text-3xl md:text-4xl font-bold text-slate-900 uppercase mt-4 tracking-tight">
            Adhiparasakthi Engineering College
          </h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            <span>Melmaruvathur</span>
            <span className="hidden sm:inline">•</span>
            <span>Admission Cell</span>
            <span className="hidden sm:inline">•</span>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0px 0px 0px rgba(99, 102, 241, 0)",
                  "0px 0px 10px rgba(99, 102, 241, 0.3)",
                  "0px 0px 0px rgba(99, 102, 241, 0)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm font-sans"
            >
              <span>Counselling Code:</span>
              <span className="font-mono text-xs font-black tracking-wider text-indigo-900">1401</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive payment form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span>Smart Fee Portal</span>
            </h2>

            <form onSubmit={generateUpiQr} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Student Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Student Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-extrabold text-slate-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Department / Branch *</label>
                  <input 
                    type="text" 
                    required 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE, IT, MECH"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-extrabold text-slate-700 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Roll Number / Reg No. (Optional)</label>
                  <input 
                    type="text" 
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 510822104001"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-extrabold text-slate-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Fee Type *</label>
                  <select 
                    value={selectedFee}
                    onChange={(e) => {
                      setSelectedFee(e.target.value);
                      setShowUpiResult(false);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-extrabold text-slate-700 transition-colors cursor-pointer"
                  >
                    {feeAccounts.map((acc) => (
                      <option key={acc.id} value={acc.type}>{acc.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Amount (INR) *</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Fee Amount"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-extrabold text-slate-700 transition-colors"
                />
              </div>

              <div className="bg-indigo-50/50 border border-indigo-150 rounded-2xl p-4 text-left">
                <span className="text-[9px] uppercase font-black text-indigo-550 tracking-widest block mb-1">Target Account Number</span>
                <span className="text-sm font-black text-slate-800 font-mono">
                  {getAccountForType(selectedFee)}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">IFSC Code: {bankDetails.ifsc} • Central Bank of India</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Generate UPI QR Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Dynamic UPI Result Container */}
            <AnimatePresence>
              {showUpiResult && qrCodeUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="mt-8 pt-8 border-t border-slate-200 flex flex-col items-center text-center"
                >
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
                    <QrCode className="w-4 h-4 text-indigo-550" />
                    <span>Scan to Pay Instantly</span>
                  </h3>
                  
                  <div className="bg-white p-3 border border-slate-200 rounded-2xl shadow-md mb-4">
                    <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-44 h-44 object-contain" />
                  </div>

                  <p className="text-[10px] text-slate-400 font-extrabold uppercase max-w-md mb-4 px-4 leading-relaxed">
                    Open GPay, PhonePe, Paytm, or any BHIM UPI app to scan and pay <span className="text-indigo-600">₹{amount}</span> for {selectedFee}.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <a 
                      href={upiLink}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                      <span>Pay via UPI App</span>
                    </a>
                    <button
                      onClick={() => handleCopy(`${getAccountForType(selectedFee)}@${bankDetails.ifsc}.ifsc.npci`, 'upiId')}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'upiId' ? 'Copied!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Direct Bank Details & Verification */}
          <div className="lg:col-span-5 space-y-6">
            {/* Bank details card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg text-left">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Landmark className="w-4.5 h-4.5 text-indigo-600" />
                <span>Bank Details</span>
              </h2>

              <div className="divide-y divide-slate-100 font-extrabold text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider">Bank</span>
                  <span className="text-slate-700">{bankDetails.name}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider">Branch</span>
                  <span className="text-slate-700">{bankDetails.branch}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider">IFSC Code</span>
                  <button 
                    onClick={() => handleCopy(bankDetails.ifsc, 'ifsc')}
                    className="text-indigo-650 hover:text-indigo-850 flex items-center gap-1 cursor-pointer font-mono font-black"
                  >
                    <span>{bankDetails.ifsc}</span>
                    {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* List of accounts */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg text-left">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest block mb-4">Fee Accounts Listing</h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {feeAccounts.map((acc, index) => (
                  <div key={acc.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[8px] text-slate-400 font-black tracking-widest uppercase block">Account #{index + 1}</span>
                      <span className="text-xs font-bold text-slate-700">{acc.type}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(acc.accountNumber, `acc-${acc.id}`)}
                      className="text-slate-800 hover:text-indigo-650 font-mono font-black text-xs flex items-center gap-1.5 bg-white border border-slate-200/60 shadow-sm px-2.5 py-1 rounded-lg"
                    >
                      <span>{acc.accountNumber}</span>
                      {copiedField === `acc-${acc.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 text-white rounded-3xl p-6 shadow-xl text-left border border-white/5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                <Compass className="w-40 h-40" />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-3 block">Important Instructions</h3>
              <ul className="text-[11px] leading-relaxed font-extrabold text-indigo-100 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>Kindly mention the <strong className="text-white">STUDENT NAME</strong> and <strong className="text-white">DEPARTMENT</strong> before processing the online payment.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span>Please WhatsApp the detailed screenshot of successful transaction for verification.</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
                <a 
                  href="https://wa.me/919994901931?text=Hi,%20I%20have%20completed%20the%20fee%20payment%20for%20Adhiparasakthi%20Engineering%20College." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Screenshot (9994901931)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
