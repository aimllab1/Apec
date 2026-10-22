import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Layout, Shield } from 'lucide-react';
import HomeManager from '../components/admin/HomeManager';

export default function HomeEditor() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
  const userRole = localStorage.getItem('user_role') || 'guest';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/editor"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Master Console</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Layout className="w-4 h-4 text-indigo-600" />
              <span>Home Page Customizer</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              View Live Website &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Home Manager Customizer */}
      <HomeManager />
    </div>
  );
}
