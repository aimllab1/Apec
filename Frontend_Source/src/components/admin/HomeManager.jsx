import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, Upload, Image, 
  ExternalLink, Eye, EyeOff, Check, AlertCircle, Sparkles, Award, 
  Calendar, Layers, TrendingUp, BookOpen, Users, ShieldCheck, Briefcase, 
  Cpu, GraduationCap, X, CheckCircle2, ChevronRight, Sliders, RefreshCw
} from 'lucide-react';
import defaultHomeData from '../../data/homeData.json';

// Curated college preset images available out-of-the-box
const PRESET_COLLEGE_IMAGES = [
  { label: 'Campus Placements', url: '/Images/Hero/placements.jpeg', tag: 'PLACEMENTS' },
  { label: 'Academic Achievement', url: '/Images/Hero/achivement_1.jpeg', tag: 'ACHIEVEMENT' },
  { label: 'Gold Medalists', url: '/Images/Hero/gold_medal.jpeg', tag: 'GOLD MEDAL' },
  { label: 'Freshers Day Celebrations', url: '/Images/Hero/fresher_day.jpeg', tag: 'EVENT' },
  { label: 'Annual Convocation', url: '/Images/Hero/hero_convocation.jpg', tag: 'CONVOCATION' },
  { label: 'Main Campus Gate', url: '/Images/Panorama/Main_Gate.webp', tag: 'CAMPUS' },
  { label: 'Central Library', url: '/Images/Panorama/library_2.webp', tag: 'LIBRARY' },
  { label: 'Advanced AI & ML Lab', url: '/Images/Panorama/aiml_lab.webp', tag: 'LABS' },
  { label: 'PG & Research Block', url: '/Images/Panorama/pg_block.webp', tag: 'INFRASTRUCTURE' },
  { label: 'Campus Junction Greenery', url: '/Images/Panorama/Junction_1.webp', tag: 'CAMPUS' }
];

const AVAILABLE_ICONS = [
  'Award', 'TrendingUp', 'BookOpen', 'Users', 'ShieldCheck', 
  'Briefcase', 'Cpu', 'GraduationCap', 'Sparkles', 'Calendar'
];

export default function HomeManager() {
  const [data, setData] = useState(defaultHomeData);
  const [subTab, setSubTab] = useState('achievements'); // 'achievements' | 'upcoming' | 'features' | 'stats' | 'banner'
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Image Replacer Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [targetSlide, setTargetSlide] = useState(null); // { section: 'achievements' | 'upcoming', index: number }
  const [uploadLoading, setUploadLoading] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Load existing home data on mount
  useEffect(() => {
    const fetchLatest = async () => {
      // Check local storage first
      const cached = localStorage.getItem('apec_homepage_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.achievementsSection) {
            setData(parsed);
          }
        } catch (e) {}
      }

      // Fetch from API
      try {
        const res = await fetch('/api/homepage');
        if (res.ok) {
          const fetched = await res.json();
          if (fetched && fetched.achievementsSection) {
            setData(fetched);
            localStorage.setItem('apec_homepage_data', JSON.stringify(fetched));
          }
        }
      } catch (err) {
        console.log("Using cached or default home configuration");
      }
    };

    fetchLatest();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Save changes to API & LocalStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Save to localStorage immediately
      localStorage.setItem('apec_homepage_data', JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('apec_storage_update'));

      // 2. Persist to server via /api/homepage
      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showNotification("Home page customized and published successfully!");
      } else {
        showNotification("Saved locally! Server sync encountered an issue.", "warning");
      }
    } catch (err) {
      showNotification("Saved to browser cache. Ready for live preview.", "success");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default factory settings
  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the Home page to original factory default settings?")) {
      setData(JSON.parse(JSON.stringify(defaultHomeData)));
      showNotification("Reset to factory defaults. Click 'Save & Publish' to apply.");
    }
  };

  // --- Image Replacement Helpers ---
  const openImagePicker = (section, index) => {
    setTargetSlide({ section, index });
    const currentSlide = section === 'achievements' 
      ? data.achievementsSection.slides[index] 
      : data.upcomingSection.slides[index];
    setCustomUrlInput(currentSlide?.imageUrl || '');
    setImageModalOpen(true);
  };

  const applySelectedImage = (url) => {
    if (!targetSlide) return;
    const { section, index } = targetSlide;
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (section === 'achievements') {
        if (copy.achievementsSection.slides[index]) {
          copy.achievementsSection.slides[index].imageUrl = url;
        }
      } else if (section === 'upcoming') {
        if (copy.upcomingSection.slides[index]) {
          copy.upcomingSection.slides[index].imageUrl = url;
        }
      }
      return copy;
    });
    setImageModalOpen(false);
    showNotification("Image replaced! Remember to click 'Save & Publish'.");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        // Try uploading to server via /api/upload-image
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, dataUrl })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            applySelectedImage(json.url);
            setUploadLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Server upload fallback to direct data URL:", err);
      }

      // Fallback: use dataUrl directly
      applySelectedImage(dataUrl);
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // --- Slide Manipulations ---
  const addSlide = (section) => {
    const newId = `${section === 'achievements' ? 'ach' : 'up'}-${Date.now()}`;
    const newSlide = {
      id: newId,
      tag: section === 'achievements' ? 'ACHIEVEMENT' : 'EVENT',
      title: 'New Headline or Recognition',
      alt: 'APEC Milestone',
      imageUrl: section === 'achievements' ? '/Images/Hero/achivement_1.jpeg' : '/Images/Hero/fresher_day.jpeg',
      link: section === 'achievements' ? '/about' : '/facilities'
    };

    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (section === 'achievements') {
        copy.achievementsSection.slides.push(newSlide);
      } else {
        copy.upcomingSection.slides.push(newSlide);
      }
      return copy;
    });
    showNotification("New slide added. You can now replace its image and details.");
  };

  const deleteSlide = (section, index) => {
    if (window.confirm("Are you sure you want to remove this slide?")) {
      setData(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        if (section === 'achievements') {
          copy.achievementsSection.slides.splice(index, 1);
        } else {
          copy.upcomingSection.slides.splice(index, 1);
        }
        return copy;
      });
      showNotification("Slide removed.");
    }
  };

  const moveSlide = (section, index, direction) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const list = section === 'achievements' 
        ? copy.achievementsSection.slides 
        : copy.upcomingSection.slides;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return copy;
    });
  };

  // --- Features Section Helpers ---
  const addFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      title: 'New College Highlight',
      description: 'Highlight exceptional academic or campus infrastructure here.',
      icon: 'Sparkles',
      link: '/about',
      badge: 'New'
    };
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.featuresSection.items.push(newFeature);
      return copy;
    });
  };

  const deleteFeature = (index) => {
    if (window.confirm("Remove this feature highlight card?")) {
      setData(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.featuresSection.items.splice(index, 1);
        return copy;
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 pb-16 font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          ADMIN HEADER / TOP CONTROLS BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Home Page Customizer
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold uppercase">
                  CMS v2.0
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Easily replace images, manage slide showcases, feature blocks, and quick stats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to original default template"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Publish</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CUSTOMIZER WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200 select-none">
          <button
            type="button"
            onClick={() => setSubTab('achievements')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'achievements'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Achievements Slides ({data.achievementsSection.slides?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('upcoming')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Slides ({data.upcomingSection.slides?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('features')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'features'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Campus Highlights ({data.featuresSection?.items?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('stats')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Quick Stats Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('banner')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'banner'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Welcome / CTA Banner</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: ACHIEVEMENTS SHOWCASE SLIDES
            ══════════════════════════════════════════════════════════════ */}
        {subTab === 'achievements' && (
          <div className="space-y-6">
            
            {/* Container Global Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-achievements"
                  checked={data.achievementsSection.enabled}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    achievementsSection: { ...prev.achievementsSection, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="toggle-achievements" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Enable Achievements Container on Home Page
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Container Title:</span>
                  <input
                    type="text"
                    value={data.achievementsSection.title || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      achievementsSection: { ...prev.achievementsSection, title: e.target.value }
                    }))}
                    placeholder="Achievements"
                    className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Autoplay Speed:</span>
                  <select
                    value={data.achievementsSection.interval || 6000}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      achievementsSection: { ...prev.achievementsSection, interval: Number(e.target.value) }
                    }))}
                    className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 cursor-pointer"
                  >
                    <option value={4000}>Fast (4s)</option>
                    <option value={6000}>Default (6s)</option>
                    <option value={8000}>Relaxed (8s)</option>
                    <option value={10000}>Slow (10s)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Configured Slides ({data.achievementsSection.slides?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() => addSlide('achievements')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>

              {data.achievementsSection.slides.map((slide, idx) => (
                <div 
                  key={slide.id || idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center"
                >
                  {/* Slide Preview & Image Replacement Button */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                      <img 
                        src={slide.imageUrl} 
                        alt={slide.alt || "Preview"}
                        onError={(e) => { e.target.src = "/Images/Hero/placements.jpeg"; }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => openImagePicker('achievements', idx)}
                          className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg cursor-pointer"
                        >
                          <Image className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openImagePicker('achievements', idx)}
                      className="w-full py-1.5 px-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Change / Replace Image</span>
                    </button>
                  </div>

                  {/* Slide Metadata Inputs */}
                  <div className="grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Badge / Tag (Top Left)
                      </label>
                      <input
                        type="text"
                        value={slide.tag || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.achievementsSection.slides[idx].tag = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. PLACEMENTS, GOLD MEDAL"
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Optional Target Link
                      </label>
                      <input
                        type="text"
                        value={slide.link || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.achievementsSection.slides[idx].link = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. /placements or /about"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Slide Headline / Description
                      </label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.achievementsSection.slides[idx].title = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. Premier Campus Placement & Career Milestones"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => moveSlide('achievements', idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide('achievements', idx, 1)}
                      disabled={idx === data.achievementsSection.slides.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSlide('achievements', idx)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer ml-2 md:ml-0 md:mt-2"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: UPCOMING EVENTS SHOWCASE SLIDES
            ══════════════════════════════════════════════════════════════ */}
        {subTab === 'upcoming' && (
          <div className="space-y-6">
            
            {/* Container Global Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-upcoming"
                  checked={data.upcomingSection.enabled}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    upcomingSection: { ...prev.upcomingSection, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="toggle-upcoming" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Enable Upcoming Events Container on Home Page
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Container Title:</span>
                  <input
                    type="text"
                    value={data.upcomingSection.title || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      upcomingSection: { ...prev.upcomingSection, title: e.target.value }
                    }))}
                    placeholder="Upcoming"
                    className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Autoplay Speed:</span>
                  <select
                    value={data.upcomingSection.interval || 7000}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      upcomingSection: { ...prev.upcomingSection, interval: Number(e.target.value) }
                    }))}
                    className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 cursor-pointer"
                  >
                    <option value={4000}>Fast (4s)</option>
                    <option value={7000}>Default (7s)</option>
                    <option value={9000}>Relaxed (9s)</option>
                    <option value={12000}>Slow (12s)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Configured Slides ({data.upcomingSection.slides?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() => addSlide('upcoming')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>

              {data.upcomingSection.slides.map((slide, idx) => (
                <div 
                  key={slide.id || idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center"
                >
                  {/* Slide Preview & Image Replacement Button */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                      <img 
                        src={slide.imageUrl} 
                        alt={slide.alt || "Preview"}
                        onError={(e) => { e.target.src = "/Images/Hero/fresher_day.jpeg"; }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => openImagePicker('upcoming', idx)}
                          className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg cursor-pointer"
                        >
                          <Image className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openImagePicker('upcoming', idx)}
                      className="w-full py-1.5 px-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Change / Replace Image</span>
                    </button>
                  </div>

                  {/* Slide Metadata Inputs */}
                  <div className="grow grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Badge / Tag (Top Left)
                      </label>
                      <input
                        type="text"
                        value={slide.tag || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.upcomingSection.slides[idx].tag = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. EVENT, SYMPOSIUM, WORKSHOP"
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Optional Target Link
                      </label>
                      <input
                        type="text"
                        value={slide.link || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.upcomingSection.slides[idx].link = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. /facilities or /contact"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Slide Headline / Description
                      </label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.upcomingSection.slides[idx].title = val;
                            return copy;
                          });
                        }}
                        placeholder="e.g. APEC Freshers Day & Welcome Celebrations"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => moveSlide('upcoming', idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide('upcoming', idx, 1)}
                      disabled={idx === data.upcomingSection.slides.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSlide('upcoming', idx)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer ml-2 md:ml-0 md:mt-2"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: CAMPUS HIGHLIGHTS & DISTINCTIVE FEATURES
            ══════════════════════════════════════════════════════════════ */}
        {subTab === 'features' && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-features"
                  checked={data.featuresSection?.enabled}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    featuresSection: { ...prev.featuresSection, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="toggle-features" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Enable Campus Highlights Section on Home Page
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={data.featuresSection?.title || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    featuresSection: { ...prev.featuresSection, title: e.target.value }
                  }))}
                  placeholder="Section Title"
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50"
                />
                <input
                  type="text"
                  value={data.featuresSection?.subtitle || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    featuresSection: { ...prev.featuresSection, subtitle: e.target.value }
                  }))}
                  placeholder="Section Subtitle"
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 min-w-[240px]"
                />
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Highlight Cards ({data.featuresSection?.items?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.featuresSection?.items?.map((feat, idx) => (
                  <div
                    key={feat.id || idx}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={feat.icon || 'Sparkles'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData(prev => {
                              const copy = JSON.parse(JSON.stringify(prev));
                              copy.featuresSection.items[idx].icon = val;
                              return copy;
                            });
                          }}
                          className="px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"
                        >
                          {AVAILABLE_ICONS.map(ic => (
                            <option key={ic} value={ic}>{ic}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={feat.badge || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData(prev => {
                              const copy = JSON.parse(JSON.stringify(prev));
                              copy.featuresSection.items[idx].badge = val;
                              return copy;
                            });
                          }}
                          placeholder="Badge (e.g. Accredited)"
                          className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteFeature(idx)}
                        className="p-1 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={feat.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.featuresSection.items[idx].title = val;
                            return copy;
                          });
                        }}
                        placeholder="Feature Title"
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={feat.description || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.featuresSection.items[idx].description = val;
                            return copy;
                          });
                        }}
                        placeholder="Brief description of this excellence factor"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Target Link (e.g. /about, /placements, /r-d-cell)
                      </label>
                      <input
                        type="text"
                        value={feat.link || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setData(prev => {
                            const copy = JSON.parse(JSON.stringify(prev));
                            copy.featuresSection.items[idx].link = val;
                            return copy;
                          });
                        }}
                        placeholder="/about"
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: QUICK STATS COUNTER BAR
            ══════════════════════════════════════════════════════════════ */}
        {subTab === 'stats' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="toggle-stats"
                  checked={data.quickStats?.enabled}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    quickStats: { ...prev.quickStats, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="toggle-stats" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Enable Quick Key Statistics Bar
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.quickStats?.items?.map((st, idx) => (
                <div 
                  key={st.id || idx}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Statistic #{idx + 1}
                    </span>
                    <select
                      value={st.icon || 'Award'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData(prev => {
                          const copy = JSON.parse(JSON.stringify(prev));
                          copy.quickStats.items[idx].icon = val;
                          return copy;
                        });
                      }}
                      className="px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Counter Value (e.g. 40+, 95%+)
                    </label>
                    <input
                      type="text"
                      value={st.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData(prev => {
                          const copy = JSON.parse(JSON.stringify(prev));
                          copy.quickStats.items[idx].value = val;
                          return copy;
                        });
                      }}
                      placeholder="40+"
                      className="w-full text-base font-black px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 text-indigo-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Statistic Label
                    </label>
                    <input
                      type="text"
                      value={st.label || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData(prev => {
                          const copy = JSON.parse(JSON.stringify(prev));
                          copy.quickStats.items[idx].label = val;
                          return copy;
                        });
                      }}
                      placeholder="Years of Excellence"
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: WELCOME / ADMISSIONS CALL-TO-ACTION BANNER
            ══════════════════════════════════════════════════════════════ */}
        {subTab === 'banner' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 max-w-3xl">
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <input
                type="checkbox"
                id="toggle-banner"
                checked={data.welcomeBanner?.enabled}
                onChange={(e) => setData(prev => ({
                  ...prev,
                  welcomeBanner: { ...prev.welcomeBanner, enabled: e.target.checked }
                }))}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="toggle-banner" className="text-sm font-bold text-slate-800 cursor-pointer">
                Display Top Welcome / Admissions Banner
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Announcement Tag / Badge
                </label>
                <input
                  type="text"
                  value={data.welcomeBanner?.badge || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    welcomeBanner: { ...prev.welcomeBanner, badge: e.target.value }
                  }))}
                  placeholder="e.g. Admissions 2026–2027 Open"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Banner Headline
                </label>
                <input
                  type="text"
                  value={data.welcomeBanner?.title || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    welcomeBanner: { ...prev.welcomeBanner, title: e.target.value }
                  }))}
                  placeholder="Shaping Future Innovators & Leaders"
                  className="w-full text-sm font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                  Sub-description
                </label>
                <textarea
                  rows={2}
                  value={data.welcomeBanner?.description || ''}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    welcomeBanner: { ...prev.welcomeBanner, description: e.target.value }
                  }))}
                  placeholder="Brief introductory message..."
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={data.welcomeBanner?.primaryBtnText || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      welcomeBanner: { ...prev.welcomeBanner, primaryBtnText: e.target.value }
                    }))}
                    placeholder="Explore Programs"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={data.welcomeBanner?.primaryBtnLink || ''}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      welcomeBanner: { ...prev.welcomeBanner, primaryBtnLink: e.target.value }
                    }))}
                    placeholder="/departments"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          IMAGE REPLACEMENT MODAL (Upload / Preset / URL)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {imageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-600" />
                    Replace Slide Image
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Upload a new photo from your computer, choose from college presets, or paste a URL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Method 1: Upload from device */}
              <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-2">
                  Option 1: Upload File from Device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="w-full py-3 border-2 border-dashed border-indigo-300 hover:border-indigo-600 rounded-xl bg-white text-indigo-700 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>{uploadLoading ? "Processing Image..." : "Choose Image File from PC / Mobile"}</span>
                </button>
              </div>

              {/* Method 2: College Preset Library */}
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2.5">
                  Option 2: Select from Campus Preset Library
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
                  {PRESET_COLLEGE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applySelectedImage(preset.url)}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-600 transition-all text-left cursor-pointer shadow-2xs hover:shadow-md"
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.label} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                          {preset.label}
                        </span>
                        <span className="text-[8px] font-black text-amber-300 uppercase">
                          {preset.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Method 3: Custom URL */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  Option 3: Custom Web or Static URL
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://... or /Images/Hero/..."
                    className="grow text-xs font-medium px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => applySelectedImage(customUrlInput)}
                    disabled={!customUrlInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          LIVE PREVIEW MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#041744] border border-[#D4A347]/40 rounded-3xl w-full max-w-6xl h-[85vh] shadow-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Preview Header */}
              <div className="bg-[#020B1F] border-b border-white/10 px-5 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Interactive Home Page Preview
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewModalOpen(false);
                      handleSave();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Preview Content Frame */}
              <div className="grow overflow-y-auto">
                {/* 1. Welcome Banner Preview */}
                {data.welcomeBanner?.enabled && (
                  <div className="bg-gradient-to-r from-indigo-950 via-[#071746] to-slate-950 border-b border-amber-500/20 py-3 px-5 flex items-center justify-between">
                    <div>
                      {data.welcomeBanner.badge && (
                        <span className="text-[10px] font-black uppercase text-[#D4A347] block">
                          {data.welcomeBanner.badge}
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-white">{data.welcomeBanner.title}</h4>
                    </div>
                  </div>
                )}

                {/* 2. Dual Showcase Preview */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {/* Achievements Preview */}
                  {data.achievementsSection?.enabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white font-bold text-xs uppercase">
                        <span>{data.achievementsSection.title || "Achievements"}</span>
                        <span className="text-[#D4A347]">1 / {data.achievementsSection.slides?.length || 1}</span>
                      </div>
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black/60 border border-[#D4A347]/40 relative">
                        {data.achievementsSection.slides?.[0] && (
                          <img 
                            src={data.achievementsSection.slides[0].imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[#D4A347] text-[9px] font-black uppercase">
                          {data.achievementsSection.slides?.[0]?.tag || 'PLACEMENTS'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Upcoming Preview */}
                  {data.upcomingSection?.enabled && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white font-bold text-xs uppercase">
                        <span>{data.upcomingSection.title || "Upcoming"}</span>
                        <span className="text-[#D4A347]">1 / {data.upcomingSection.slides?.length || 1}</span>
                      </div>
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black/60 border border-[#D4A347]/40 relative">
                        {data.upcomingSection.slides?.[0] && (
                          <img 
                            src={data.upcomingSection.slides[0].imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[#D4A347] text-[9px] font-black uppercase">
                          {data.upcomingSection.slides?.[0]?.tag || 'EVENT'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Quick Stats Preview */}
                {data.quickStats?.enabled && (
                  <div className="bg-[#020B1F] py-4 px-6 border-y border-white/10 my-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                      {data.quickStats.items?.map((st, i) => (
                        <div key={i} className="text-center p-2 rounded-xl bg-white/5">
                          <div className="text-lg font-black text-white font-serif">{st.value}</div>
                          <div className="text-[10px] text-slate-300 font-semibold">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING TOAST NOTIFICATION
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold text-white ${
              toastType === 'success' 
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-600/30' 
                : 'bg-amber-600 border-amber-500 shadow-amber-600/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
