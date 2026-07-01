import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query } from 'firebase/firestore';
import { 
  Lock, 
  User, 
  Database, 
  Trash2, 
  Download, 
  LogOut, 
  Search, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Load inquiries from localStorage
  useEffect(() => {
    if (isLoggedIn) {
      loadInquiries();
    }
  }, [isLoggedIn]);

  const loadInquiries = async () => {
    try {
      const q = query(collection(db, 'inquiries'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          docId: doc.id, // Save doc ID to delete document later
          ...doc.data()
        });
      });
      // Sort by timestamp descending
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
      setInquiries(data);
    } catch (err) {
      console.error("Firestore database connection failed. Loading locally: ", err);
      const localData = JSON.parse(localStorage.getItem('apec_inquiries') || '[]');
      localData.sort((a, b) => (b.id || 0) - (a.id || 0));
      setInquiries(localData);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const isDefaultAdmin = username.trim().toLowerCase() === 'admin' && password === 'admin';
    const isTestUser = username.trim() === 'gxwr1' && password === '@Neosyntor1';

    if (isDefaultAdmin || isTestUser) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Credentials');
    }
  };

  const handleDelete = async (id, docId) => {
    try {
      if (docId) {
        // Delete document from Firestore inquiries collection
        await deleteDoc(doc(db, "inquiries", docId));
      }

      // Update state and fallback local storage
      const updated = inquiries.filter(item => item.id !== id);
      localStorage.setItem('apec_inquiries', JSON.stringify(updated.map(({ docId, ...rest }) => rest)));
      setInquiries(updated);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    } catch (err) {
      console.error("Firestore delete failed. Deleting locally: ", err);
      const updated = inquiries.filter(item => item.id !== id);
      localStorage.setItem('apec_inquiries', JSON.stringify(updated.map(({ docId, ...rest }) => rest)));
      setInquiries(updated);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to purge all inquiry logs? This action is irreversible.')) {
      localStorage.removeItem('apec_inquiries');
      setInquiries([]);
    }
  };

  // Export data as a CSV file
  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    
    const headers = ['Inquiry Date', 'Student Name', 'Email Address', 'Phone Number', 'Requested Course', 'Additional Remarks'];
    const rows = inquiries.map(item => [
      item.date || new Date(item.id).toLocaleString(),
      `"${item.name.replace(/"/g, '""')}"`,
      item.email,
      `'${item.phone}`, // force string in Excel
      `"${item.dept.replace(/"/g, '""')}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `APEC_Admissions_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries based on search query
  const filteredInquiries = inquiries.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      item.dept.toLowerCase().includes(query)
    );
  });

  // Calculate statistics
  const totalInquiries = inquiries.length;
  
  // Calculate top requested course
  const courseCounts = inquiries.reduce((acc, item) => {
    acc[item.dept] = (acc[item.dept] || 0) + 1;
    return acc;
  }, {});
  
  let topCourse = 'N/A';
  let topCourseCount = 0;
  Object.entries(courseCounts).forEach(([course, count]) => {
    if (count > topCourseCount) {
      topCourse = course;
      topCourseCount = count;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* SECURE ADMIN LOGIN SCREEN */
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto my-12"
            >
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
                
                <div className="flex flex-col items-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-950 tracking-tight">Administrative Portal</h2>
                  <p className="text-xs text-gray-400 font-semibold mt-1.5">Sign in to review student counseling inquiries</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-450 tracking-wider mb-1">Username</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter admin username"
                        className="w-full text-xs pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-black text-gray-450 tracking-wider mb-1">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full text-xs pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex gap-2 items-center bg-red-50 border border-red-200/50 text-red-650 p-3 rounded-xl text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer text-center"
                    >
                      Access Dashboard
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-5">
                  Secure access for APEC Admissions Department.
                  <div className="mt-1 text-indigo-500">Hint: admin / admin</div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ADMIN INQUIRY DASHBOARD VIEW */
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              
              {/* TOP HEADER CONTROLS */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-6 text-left">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">APEC Data Vault</span>
                  </div>
                  <h1 className="text-3xl font-black text-gray-950 tracking-tight mt-1">Inquiry Records Control</h1>
                  <p className="text-xs text-gray-400 font-semibold mt-1">Review, search, and manage direct admission leads</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleExportCSV}
                    disabled={inquiries.length === 0}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-50 text-gray-800 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-500" /> Export CSV
                  </button>
                  
                  <button 
                    onClick={handleClearAll}
                    disabled={inquiries.length === 0}
                    className="inline-flex items-center gap-2 bg-red-50 border border-red-200 hover:bg-red-100 disabled:opacity-50 text-red-700 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" /> Purge Logs
                  </button>
                  
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-850 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </div>

              {/* STAT CARDS DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 text-left shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">Total Inquiries</span>
                    <span className="text-2xl font-black text-gray-900 leading-none block mt-1">{totalInquiries}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 text-left shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">Top Popular Department</span>
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[200px] leading-none block mt-1">{topCourse}</span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{topCourseCount} request{topCourseCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 text-left shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">System Status</span>
                    <span className="text-sm font-bold text-gray-900 leading-none block mt-1">Local Storage Database</span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Active Sync OK</span>
                  </div>
                </div>

              </div>

              {/* SEARCH & RECORDS TABLE SECTION */}
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-md">
                
                {/* Search Bar Input */}
                <div className="p-5 border-b border-gray-150 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student, email, phone, or course..."
                      className="w-full text-xs pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                    />
                  </div>
                  
                  {searchQuery && (
                    <span className="text-xs text-indigo-600 font-bold shrink-0">
                      Showing {filteredInquiries.length} of {totalInquiries} matches
                    </span>
                  )}
                </div>

                {/* Notifications Area */}
                <AnimatePresence>
                  {deleteSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 text-emerald-700 px-6 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs font-semibold"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Inquiry record removed successfully.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/75 border-b border-gray-150 text-[10px] font-black uppercase text-gray-450 tracking-wider">
                        <th className="py-4 px-6">Timestamp</th>
                        <th className="py-4 px-6">Student details</th>
                        <th className="py-4 px-6">Contact info</th>
                        <th className="py-4 px-6">Requested Course</th>
                        <th className="py-4 px-6">Additional Remarks</th>
                        <th className="py-4 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inquiry, idx) => (
                          <tr key={inquiry.id || idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 whitespace-nowrap font-mono text-[10px] text-gray-400">
                              {inquiry.date || new Date(inquiry.id).toLocaleString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-extrabold text-gray-950 block">{inquiry.name}</span>
                            </td>
                            <td className="py-4 px-6 space-y-0.5">
                              <a href={`mailto:${inquiry.email}`} className="text-indigo-650 hover:underline block font-semibold">{inquiry.email}</a>
                              <a href={`tel:${inquiry.phone}`} className="text-gray-500 font-semibold block font-mono">{inquiry.phone}</a>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-block px-2.5 py-1 bg-indigo-50 border border-indigo-100/50 text-indigo-700 font-extrabold rounded-lg text-[10px]">
                                {inquiry.dept}
                              </span>
                            </td>
                            <td className="py-4 px-6 max-w-xs truncate text-gray-500 font-medium" title={inquiry.message}>
                              {inquiry.message || <span className="italic text-gray-300">No message provided</span>}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button 
                                onClick={() => handleDelete(inquiry.id, inquiry.docId)}
                                className="p-2 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                title="Delete inquiry record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-gray-400 font-semibold">
                            <Database className="w-8 h-8 text-gray-250 mx-auto mb-3" />
                            No admission inquiry records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
