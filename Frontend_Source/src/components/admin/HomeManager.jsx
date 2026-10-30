import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Globe, Phone, Layout, Save, RotateCcw, Plus, Trash2, 
  ArrowUp, ArrowDown, ArrowLeft, Upload, Image, ExternalLink, Eye, 
  EyeOff, Check, AlertCircle, Sparkles, Award, Calendar, Layers, 
  TrendingUp, BookOpen, Users, ShieldCheck, Briefcase, Cpu, 
  GraduationCap, X, CheckCircle2, ChevronRight, Sliders, RefreshCw, 
  Edit3, Link2, Copy, CheckCheck
} from 'lucide-react';
import defaultHomeData from '../../data/homeData.json';
import { uploadFile } from '../../utils/storage';

const AVAILABLE_ICONS = [
  'Award', 'TrendingUp', 'BookOpen', 'Users', 'ShieldCheck', 
  'Briefcase', 'Cpu', 'GraduationCap', 'Sparkles', 'Calendar'
];

const QUICK_LINKS = [
  { label: 'Placements', url: '/placements' },
  { label: 'Admissions', url: '/admission' },
  { label: 'About College', url: '/about' },
  { label: 'Campus Events', url: '/events' },
  { label: 'Facilities', url: '/facilities' },
  { label: 'Research & Labs', url: '/r-d-cell' }
];

const ACHIEVEMENT_TAGS = ['ACHIEVEMENT', 'PLACEMENTS', 'GOLD MEDAL', 'TOP RANK', 'RESEARCH', 'SPORTS', 'HONORS'];
const UPCOMING_TAGS = ['EVENT', 'CONFERENCE', 'SYMPOSIUM', 'WORKSHOP', 'CULTURAL', 'CIRCULAR', 'ADMISSION'];

/**
 * Optimizes an uploaded image on the client side using an offscreen canvas.
 * Prevents localStorage QuotaExceededError while ensuring crisp 16:9 previews.
 */
function processImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPEG, PNG, WebP).'));
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxW = 1600;
        const maxH = 1000;
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(reader.result);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function HomeManager() {
  const [data, setData] = useState(defaultHomeData);
  const [branding, setBranding] = useState({
    collegeName: 'Adhiparasakthi Engineering College',
    tagline: 'An Autonomous Institution',
    helpline1: '7418064336',
    helpline2: '7418065336',
  });

  // Level 1 vs Level 2 navigation:
  // null = Level 1 Box View / Section Selector
  // 'branding' | 'achievements' | 'upcoming' | 'features' | 'stats' | 'banner' = Level 2 Section Editor
  const [activeSection, setActiveSection] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Add / Edit Slide Modal State (for Achievements & Upcoming)
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideModalSection, setSlideModalSection] = useState('achievements'); // 'achievements' | 'upcoming'
  const [slideEditingIdx, setSlideEditingIdx] = useState(null);
  const [slideModalForm, setSlideModalForm] = useState({
    tag: '',
    title: '',
    link: '',
    imageUrl: '',
    alt: ''
  });
  const [slideUploadLoading, setSlideUploadLoading] = useState(false);
  const modalFileInputRef = useRef(null);

  // Add / Edit Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureEditingIdx, setFeatureEditingIdx] = useState(null);
  const [featureModalForm, setFeatureModalForm] = useState({
    title: '',
    description: '',
    icon: 'Sparkles',
    link: '',
    badge: ''
  });

  // Add Stat Modal State
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [statModalForm, setStatModalForm] = useState({
    value: '',
    label: '',
    icon: 'Award'
  });

  // Load existing home data & branding on mount
  useEffect(() => {
    const fetchLatest = async () => {
      // 1. Check local storage
      const savedBranding = localStorage.getItem('apec_branding');
      if (savedBranding) {
        try { setBranding(JSON.parse(savedBranding)); } catch (e) {}
      }
      const cached = localStorage.getItem('apec_homepage_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.achievementsSection) {
            setData(parsed);
          }
        } catch (e) {}
      }

      // 2. Fetch from server API
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
      localStorage.setItem('apec_branding', JSON.stringify(branding));
      localStorage.setItem('apec_homepage_data', JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('apec_storage_update'));

      const res = await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showNotification("HomePage changes saved and published successfully!");
      } else {
        showNotification("Saved locally! Server sync had a minor network issue.", "warning");
      }
    } catch (err) {
      showNotification("Saved to browser cache and live preview.", "success");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBranding = () => {
    localStorage.setItem('apec_branding', JSON.stringify(branding));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('apec_storage_update'));
    showNotification('Branding & contact information saved!');
  };

  const handleSaveBanner = () => {
    localStorage.setItem('apec_homepage_data', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('apec_storage_update'));
    fetch('/api/homepage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
    showNotification(data.welcomeBanner?.enabled ? 'Admissions CTA Banner turned ON and published!' : 'Admissions CTA Banner turned OFF.');
  };

  // Reset to default factory settings
  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore the HomePage to original default settings?")) {
      setData(JSON.parse(JSON.stringify(defaultHomeData)));
      showNotification("Reset to defaults. Click 'Save & Publish' to persist.");
    }
  };

  // --- Slide Quick Image Replacement (Direct Device Upload from Slide Card) ---
  const handleCardQuickImageUpload = async (section, index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      setData(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const list = section === 'achievements' 
          ? copy.achievementsSection.slides 
          : copy.upcomingSection.slides;
        if (list[index]) {
          list[index].imageUrl = dataUrl;
        }
        return copy;
      });
      showNotification("Slide image replaced! Click 'Save & Publish' to apply.");

      // Background persistent upload attempt
      uploadFile(file, 'Hero').then(res => {
        if (res?.downloadURL || res?.url) {
          setData(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            const list = section === 'achievements' 
              ? copy.achievementsSection.slides 
              : copy.upcomingSection.slides;
            if (list[index]) {
              list[index].imageUrl = res.downloadURL || res.url;
            }
            return copy;
          });
        }
      }).catch(() => {});
    } catch (err) {
      alert(err.message || 'Error processing image.');
    } finally {
      e.target.value = '';
    }
  };

  // --- Slide Modal Handlers ---
  const openAddSlideModal = (section) => {
    setSlideModalSection(section);
    setSlideEditingIdx(null);
    setSlideModalForm({
      tag: section === 'achievements' ? 'ACHIEVEMENT' : 'EVENT',
      title: '',
      link: section === 'achievements' ? '/placements' : '/events',
      imageUrl: '',
      alt: ''
    });
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (section, idx) => {
    const list = section === 'achievements' 
      ? data.achievementsSection?.slides 
      : data.upcomingSection?.slides;
    const target = list?.[idx];
    if (!target) return;
    setSlideModalSection(section);
    setSlideEditingIdx(idx);
    setSlideModalForm({
      tag: target.tag || '',
      title: target.title || '',
      link: target.link || '',
      imageUrl: target.imageUrl || '',
      alt: target.alt || ''
    });
    setIsSlideModalOpen(true);
  };

  const handleModalSlideFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlideUploadLoading(true);

    try {
      // 1. Process client-side immediately for zero lag & preview
      const dataUrl = await processImageFile(file);
      setSlideModalForm(prev => ({ ...prev, imageUrl: dataUrl }));

      // 2. Background upload for persistent URL
      uploadFile(file, 'Hero').then(res => {
        if (res?.downloadURL || res?.url) {
          setSlideModalForm(prev => ({ ...prev, imageUrl: res.downloadURL || res.url }));
        }
      }).catch(() => {});
      showNotification("Poster image loaded ready!");
    } catch (err) {
      alert(err.message || "Failed to process image.");
    } finally {
      setSlideUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleSaveSlideModal = () => {
    if (!slideModalForm.title.trim()) {
      alert("Slide headline / caption is required.");
      return;
    }
    const isEdit = slideEditingIdx !== null;
    const currentList = slideModalSection === 'achievements' 
      ? data.achievementsSection.slides 
      : data.upcomingSection.slides;
    const existingId = isEdit && currentList[slideEditingIdx] ? currentList[slideEditingIdx].id : null;

    const newSlide = {
      id: existingId || `${slideModalSection === 'achievements' ? 'ach' : 'up'}-${Date.now()}`,
      tag: slideModalForm.tag.trim() || (slideModalSection === 'achievements' ? 'ACHIEVEMENT' : 'EVENT'),
      title: slideModalForm.title.trim(),
      alt: slideModalForm.alt.trim() || slideModalForm.title.trim(),
      imageUrl: slideModalForm.imageUrl.trim() || (slideModalSection === 'achievements' 
        ? 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793340136/apec/Hero/achivement_1.jpg' 
        : 'https://res.cloudinary.com/o1hw2rfp/image/upload/v1793340144/apec/Hero/fresher_day.jpg'),
      link: slideModalForm.link.trim() || (slideModalSection === 'achievements' ? '/placements' : '/events')
    };

    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const list = slideModalSection === 'achievements' 
        ? copy.achievementsSection.slides 
        : copy.upcomingSection.slides;
      if (isEdit) {
        list[slideEditingIdx] = newSlide;
      } else {
        list.push(newSlide);
      }
      return copy;
    });

    setIsSlideModalOpen(false);
    showNotification(isEdit ? "Slide updated!" : "New slide added!");
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
  const openAddFeatureModal = () => {
    setFeatureEditingIdx(null);
    setFeatureModalForm({
      title: '',
      description: '',
      icon: 'Sparkles',
      link: '/about',
      badge: ''
    });
    setIsFeatureModalOpen(true);
  };

  const openEditFeatureModal = (idx) => {
    const target = data.featuresSection?.items?.[idx];
    if (!target) return;
    setFeatureEditingIdx(idx);
    setFeatureModalForm({
      title: target.title || '',
      description: target.description || '',
      icon: target.icon || 'Sparkles',
      link: target.link || '',
      badge: target.badge || ''
    });
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeatureModal = () => {
    if (!featureModalForm.title.trim() || !featureModalForm.description.trim()) {
      alert("Highlight Card Title and Description are required.");
      return;
    }
    const isEdit = featureEditingIdx !== null;
    const existingId = isEdit && data.featuresSection?.items?.[featureEditingIdx]
      ? data.featuresSection.items[featureEditingIdx].id
      : `feat-${Date.now()}`;

    const newFeature = {
      id: existingId,
      title: featureModalForm.title.trim(),
      description: featureModalForm.description.trim(),
      icon: featureModalForm.icon || 'Sparkles',
      link: featureModalForm.link.trim() || '/about',
      badge: featureModalForm.badge.trim()
    };

    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy.featuresSection.items) copy.featuresSection.items = [];
      if (isEdit) {
        copy.featuresSection.items[featureEditingIdx] = newFeature;
      } else {
        copy.featuresSection.items.push(newFeature);
      }
      return copy;
    });

    setIsFeatureModalOpen(false);
    showNotification(isEdit ? "Highlight card updated!" : "New highlight card added!");
  };

  const deleteFeature = (index) => {
    if (window.confirm("Remove this highlight card?")) {
      setData(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.featuresSection.items.splice(index, 1);
        return copy;
      });
      showNotification("Highlight card removed.");
    }
  };

  // --- Quick Stats Helpers ---
  const openAddStatModal = () => {
    setStatModalForm({
      value: '',
      label: '',
      icon: 'Award'
    });
    setIsStatModalOpen(true);
  };

  const handleSaveStatModal = () => {
    if (!statModalForm.value.trim() || !statModalForm.label.trim()) {
      alert("Metric Value and Label are required.");
      return;
    }
    const newStat = {
      id: `stat-${Date.now()}`,
      value: statModalForm.value.trim(),
      label: statModalForm.label.trim(),
      icon: statModalForm.icon || 'Award'
    };
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy.quickStats.items) copy.quickStats.items = [];
      copy.quickStats.items.push(newStat);
      return copy;
    });
    setIsStatModalOpen(false);
    showNotification("New key statistic added!");
  };

  const deleteStat = (idx) => {
    if (window.confirm("Remove this key statistic counter?")) {
      setData(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy.quickStats.items.splice(idx, 1);
        return copy;
      });
      showNotification("Statistic counter removed.");
    }
  };

  // Section definitions for Level 1 Buttons
  const SECTIONS = [
    {
      id: 'branding',
      title: 'Branding & Contact Info',
      icon: Building2,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Portal Contacts',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'achievements',
      title: 'Achievements Showcase',
      icon: Award,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: `${data.achievementsSection?.slides?.length || 0} Slides`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'upcoming',
      title: 'Upcoming Events & Circulars',
      icon: Calendar,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: `${data.upcomingSection?.slides?.length || 0} Events`,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'features',
      title: 'Campus Highlights',
      icon: Sparkles,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: `${data.featuresSection?.items?.length || 0} Cards`,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      id: 'stats',
      title: 'Key Statistics Bar',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: `${data.quickStats?.items?.length || 0} Metrics`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'banner',
      title: 'Admissions CTA Banner',
      icon: Layers,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: data.welcomeBanner?.enabled ? 'Active' : 'Disabled',
      badgeColor: data.welcomeBanner?.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
    }
  ];

  return (
    <div className="space-y-6">

      {/* ─────────────────────────────────────────────────────────────
          UNIFIED LIGHT-THEMED HEADER (Matching Console Theme)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            <h3 className="font-title text-xl font-black text-slate-900">HomePage</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold uppercase">
              Live Portal Editor
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Configure website hero showcases, achievements, upcoming events, campus highlights, and institutional branding.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset to default template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
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

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-md ${
              toastType === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : toastType === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          LEVEL 1: CLEAN ALIGNED BUTTONS (Just Icon & Button, No 2-Line Definition)
          ───────────────────────────────────────────────────────────── */}
      {activeSection === null ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Select Homepage Section:
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              6 Sections Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SECTIONS.map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className="bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-md rounded-2xl p-4 transition-all duration-150 text-left cursor-pointer group flex items-center justify-between gap-3 shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${sec.iconBg} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-title text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {sec.title}
                      </h4>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${sec.badgeColor}`}>
                        {sec.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            LEVEL 2: FOCUSED SECTION EDITOR
            ───────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          
          {/* Section Breadcrumb & Back Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Sections</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div>
                <h4 className="font-title text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>HomePage</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-indigo-600">
                    {SECTIONS.find(s => s.id === activeSection)?.title}
                  </span>
                </h4>
              </div>
            </div>

            {/* Quick Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    activeSection === s.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: BRANDING & CONTACT INFO
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'branding' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-150 pb-4">
                <h3 className="font-title text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" /> Institution Branding & Admissions Hotlines
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Configure primary college title, statutory tagline, and admissions contact numbers displayed across the website header and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    College Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={branding.collegeName}
                      onChange={(e) => setBranding({ ...branding, collegeName: e.target.value })}
                      className="w-full text-xs font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white text-slate-800"
                      placeholder="Adhiparasakthi Engineering College"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Tagline / Statutory Status *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={branding.tagline}
                      onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                      className="w-full text-xs font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white text-slate-800"
                      placeholder="An Autonomous Institution"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Admissions Helpline 1 *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={branding.helpline1}
                      onChange={(e) => setBranding({ ...branding, helpline1: e.target.value })}
                      className="w-full text-xs font-mono font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white text-slate-800"
                      placeholder="7418064336"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Admissions Helpline 2
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={branding.helpline2}
                      onChange={(e) => setBranding({ ...branding, helpline2: e.target.value })}
                      className="w-full text-xs font-mono font-bold pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white text-slate-800"
                      placeholder="7418065336"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  These settings update college header banners, student helplines, and footer details globally.
                </span>
                <button
                  type="button"
                  onClick={handleSaveBranding}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" /> Save Branding Settings
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: ACHIEVEMENTS SHOWCASE SLIDES
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'achievements' && (
            <div className="space-y-6">
              
              {/* Section Header Controls */}
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
                    Enable Achievements Carousel on HomePage
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Title:</span>
                    <input
                      type="text"
                      value={data.achievementsSection.title}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        achievementsSection: { ...prev.achievementsSection, title: e.target.value }
                      }))}
                      placeholder="e.g. APEC Achievements"
                      className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Speed:</span>
                    <select
                      value={data.achievementsSection.interval || 6000}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        achievementsSection: { ...prev.achievementsSection, interval: Number(e.target.value) }
                      }))}
                      className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                    >
                      <option value={4000}>4 Seconds</option>
                      <option value={6000}>6 Seconds (Recommended)</option>
                      <option value={8000}>8 Seconds</option>
                      <option value={10000}>10 Seconds</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAddSlideModal('achievements')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement Slide</span>
                  </button>
                </div>
              </div>

              {/* Slide List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Active Slides ({data.achievementsSection.slides?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-400">Click photo to quickly upload & replace from device</span>
                </div>

                {(!data.achievementsSection.slides || data.achievementsSection.slides.length === 0) ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">No achievement slides yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Upload a photo from your device to showcase student accolades.</p>
                    <button
                      type="button"
                      onClick={() => openAddSlideModal('achievements')}
                      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + Add First Slide
                    </button>
                  </div>
                ) : (
                  data.achievementsSection.slides.map((slide, idx) => (
                    <div
                      key={slide.id || idx}
                      className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Thumbnail with Instant Device Upload */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                          <img
                            src={slide.imageUrl}
                            alt={slide.alt || slide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793340151/apec/Hero/placements.jpg";
                            }}
                          />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-center p-1">
                            <Upload className="w-4 h-4 mb-1" />
                            <span className="text-[9px] font-black uppercase">Replace Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCardQuickImageUpload('achievements', idx, e)}
                            />
                          </label>
                        </div>

                        {/* Slide Details */}
                        <div className="space-y-1.5 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold uppercase">
                              {slide.tag || 'ACHIEVEMENT'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Slide #{idx + 1}
                            </span>
                          </div>

                          <h5 className="font-title text-sm font-black text-slate-900 leading-snug">
                            {slide.title}
                          </h5>

                          {slide.link && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                              <Link2 className="w-3 h-3" />
                              <span className="truncate max-w-xs">{slide.link}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => moveSlide('achievements', idx, -1)}
                          disabled={idx === 0}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide('achievements', idx, 1)}
                          disabled={idx === data.achievementsSection.slides.length - 1}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditSlideModal('achievements', idx)}
                          className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          title="Edit Slide Content"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSlide('achievements', idx)}
                          className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: UPCOMING EVENTS & CIRCULARS
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'upcoming' && (
            <div className="space-y-6">
              
              {/* Section Header Controls */}
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
                    Enable Upcoming Events Carousel on HomePage
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Title:</span>
                    <input
                      type="text"
                      value={data.upcomingSection.title}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        upcomingSection: { ...prev.upcomingSection, title: e.target.value }
                      }))}
                      placeholder="e.g. Upcoming Events"
                      className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Speed:</span>
                    <select
                      value={data.upcomingSection.interval || 7000}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        upcomingSection: { ...prev.upcomingSection, interval: Number(e.target.value) }
                      }))}
                      className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                    >
                      <option value={5000}>5 Seconds</option>
                      <option value={7000}>7 Seconds (Recommended)</option>
                      <option value={9000}>9 Seconds</option>
                      <option value={12000}>12 Seconds</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAddSlideModal('upcoming')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event Slide</span>
                  </button>
                </div>
              </div>

              {/* Event Slides List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Active Event Slides ({data.upcomingSection.slides?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-400">Click photo to quickly upload & replace from device</span>
                </div>

                {(!data.upcomingSection.slides || data.upcomingSection.slides.length === 0) ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">No upcoming event slides yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Upload event posters to notify students & visitors.</p>
                    <button
                      type="button"
                      onClick={() => openAddSlideModal('upcoming')}
                      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + Add First Event
                    </button>
                  </div>
                ) : (
                  data.upcomingSection.slides.map((slide, idx) => (
                    <div
                      key={slide.id || idx}
                      className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Thumbnail with Instant Device Upload */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                          <img
                            src={slide.imageUrl}
                            alt={slide.alt || slide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793340144/apec/Hero/fresher_day.jpg";
                            }}
                          />
                          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-center p-1">
                            <Upload className="w-4 h-4 mb-1" />
                            <span className="text-[9px] font-black uppercase">Replace Poster</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCardQuickImageUpload('upcoming', idx, e)}
                            />
                          </label>
                        </div>

                        {/* Slide Details */}
                        <div className="space-y-1.5 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold uppercase">
                              {slide.tag || 'EVENT'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Event #{idx + 1}
                            </span>
                          </div>

                          <h5 className="font-title text-sm font-black text-slate-900 leading-snug">
                            {slide.title}
                          </h5>

                          {slide.link && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                              <Link2 className="w-3 h-3" />
                              <span className="truncate max-w-xs">{slide.link}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => moveSlide('upcoming', idx, -1)}
                          disabled={idx === 0}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide('upcoming', idx, 1)}
                          disabled={idx === data.upcomingSection.slides.length - 1}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditSlideModal('upcoming', idx)}
                          className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          title="Edit Slide Content"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSlide('upcoming', idx)}
                          className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 4: CAMPUS HIGHLIGHTS & FEATURE CARDS
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'features' && (
            <div className="space-y-6">
              
              {/* Header Controls */}
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
                    Enable Campus Highlights Section on HomePage
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
                    className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={openAddFeatureModal}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Highlight Card</span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.featuresSection?.items?.map((feat, idx) => (
                  <div
                    key={feat.id || idx}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative flex flex-col justify-between"
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
                          className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"
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

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditFeatureModal(idx)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          title="Edit Card"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFeature(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Remove Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Title</label>
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
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Description</label>
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
                        className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Target Link</label>
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
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 5: KEY STATISTICS BAR
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'stats' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    Enable Key Statistics Counter Bar on HomePage
                  </label>
                </div>

                <button
                  type="button"
                  onClick={openAddStatModal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Statistic</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.quickStats?.items?.map((st, idx) => (
                  <div 
                    key={st.id || idx}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Metric #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
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
                        <button
                          type="button"
                          onClick={() => deleteStat(idx)}
                          className="p-1 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Number / Value
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
                        placeholder="e.g. 95%+"
                        className="w-full text-base font-black px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 text-indigo-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                        Metric Label
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
                        placeholder="e.g. Placement Track Record"
                        className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SECTION 6: ADMISSIONS CTA BANNER
              ══════════════════════════════════════════════════════════════ */}
          {activeSection === 'banner' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 max-w-3xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="toggle-banner"
                    checked={data.welcomeBanner?.enabled || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setData(prev => {
                        const copy = JSON.parse(JSON.stringify(prev));
                        if (!copy.welcomeBanner) copy.welcomeBanner = {};
                        copy.welcomeBanner.enabled = checked;
                        return copy;
                      });
                    }}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="toggle-banner" className="text-sm font-bold text-slate-800 cursor-pointer">
                    Display Admissions CTA Banner on HomePage
                  </label>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  data.welcomeBanner?.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {data.welcomeBanner?.enabled ? 'Active on Home' : 'Turned Off'}
                </span>
              </div>

              {/* Live Banner Preview Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  Real-Time Banner Preview:
                </span>
                <div className={`p-4 rounded-2xl transition-all ${
                  data.welcomeBanner?.enabled 
                    ? 'bg-gradient-to-r from-[#031130] via-[#08205F] to-[#031130] border border-[#D4A347]/40 text-white shadow-md' 
                    : 'bg-slate-100 border border-dashed border-slate-300 text-slate-400'
                }`}>
                  {data.welcomeBanner?.enabled ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {data.welcomeBanner?.badge && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4A347]/20 border border-[#D4A347]/50 text-[#D4A347] text-[10px] font-black uppercase tracking-wider mb-1">
                            {data.welcomeBanner.badge}
                          </span>
                        )}
                        <h4 className="font-serif text-sm sm:text-base font-bold text-white">
                          {data.welcomeBanner?.title || 'Banner Headline'}
                        </h4>
                        <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                          {data.welcomeBanner?.description || 'Sub-description text'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {data.welcomeBanner?.primaryBtnText && (
                          <span className="px-3 py-1.5 rounded-lg bg-[#D4A347] text-[#041744] font-black text-[11px] uppercase tracking-wider">
                            {data.welcomeBanner.primaryBtnText}
                          </span>
                        )}
                        {data.welcomeBanner?.secondaryBtnText && (
                          <span className="px-3 py-1.5 rounded-lg border border-white/20 text-white font-bold text-[11px] uppercase tracking-wider">
                            {data.welcomeBanner.secondaryBtnText}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs font-bold text-slate-500">
                      Banner is currently disabled. Check the box above and click "Save Banner Settings" to display it on the homepage.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                    Announcement Badge / Tag
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
                    Banner Headline *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
                      placeholder="/admission"
                      className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Secondary Button Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.welcomeBanner?.secondaryBtnText || ''}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        welcomeBanner: { ...prev.welcomeBanner, secondaryBtnText: e.target.value }
                      }))}
                      placeholder="e.g. Campus VR Tour or Contact Office"
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      value={data.welcomeBanner?.secondaryBtnLink || ''}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        welcomeBanner: { ...prev.welcomeBanner, secondaryBtnLink: e.target.value }
                      }))}
                      placeholder="/contact"
                      className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  Activates or hides the top banner displayed across the homepage header.
                </span>
                <button
                  type="button"
                  onClick={handleSaveBanner}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" /> Save Banner Settings
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STREAMLINED SLIDE ADD/EDIT MODAL
          (Clean file upload, instant preview, category tags, link chips)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSlideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {slideEditingIdx !== null ? 'Edit Slide Details' : `Add ${slideModalSection === 'achievements' ? 'Achievement' : 'Upcoming Event'} Slide`}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Upload poster photo directly from device, assign badge, headline, and link.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 grow">
                
                {/* 1. Direct Image Upload & Instant 16:9 Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Slide Poster Photo *
                    </label>
                    <span className="text-[10px] text-slate-400">16:9 Widescreen Recommended</span>
                  </div>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-300 hover:border-indigo-500 transition-colors flex items-center justify-center group">
                    {slideModalForm.imageUrl ? (
                      <>
                        <img
                          src={slideModalForm.imageUrl}
                          alt="Poster Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
                          <button
                            type="button"
                            onClick={() => modalFileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:bg-slate-100"
                          >
                            <Upload className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Replace Photo from Device</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSlideModalForm(prev => ({ ...prev, imageUrl: '' }))}
                            className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-[10px] uppercase cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">
                            {slideUploadLoading ? "Processing Image..." : "Click or tap to choose photo from PC / Mobile"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Supports JPG, PNG, WebP (automatically optimized)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          disabled={slideUploadLoading}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                          Choose Photo File
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      ref={modalFileInputRef}
                      className="hidden"
                      onChange={handleModalSlideFileUpload}
                    />
                  </div>

                  {/* Optional Image URL Input */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={slideModalForm.imageUrl}
                      onChange={(e) => setSlideModalForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Or paste an image web link (https://...)"
                      className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>
                </div>

                {/* 2. Badge / Category Tag Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Category Tag / Badge
                    </label>
                    <span className="text-[10px] text-slate-400">Click a chip or type custom</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(slideModalSection === 'achievements' ? ACHIEVEMENT_TAGS : UPCOMING_TAGS).map(tg => (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => setSlideModalForm(prev => ({ ...prev, tag: tg }))}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-black tracking-wider uppercase transition-colors cursor-pointer ${
                          slideModalForm.tag === tg
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600'
                        }`}
                      >
                        {tg}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={slideModalForm.tag}
                    onChange={(e) => setSlideModalForm(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="e.g. PLACEMENTS, GOLD MEDAL, CONVOCATION"
                    className="w-full text-xs font-bold px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                {/* 3. Headline / Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Slide Headline / Caption *
                  </label>
                  <input
                    type="text"
                    value={slideModalForm.title}
                    onChange={(e) => setSlideModalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. 100% Placement Honors with Tier-1 Recruiters"
                    className="w-full text-xs font-bold px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                {/* 4. Target Link with Quick Suggestions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Destination Link
                    </label>
                    <span className="text-[10px] text-slate-400">Internal route or external link</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_LINKS.map(ql => (
                      <button
                        key={ql.url}
                        type="button"
                        onClick={() => setSlideModalForm(prev => ({ ...prev, link: ql.url }))}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                          slideModalForm.link === ql.url
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {ql.label} ({ql.url})
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={slideModalForm.link}
                    onChange={(e) => setSlideModalForm(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="e.g. /placements, /admission, or https://..."
                    className="w-full text-xs font-mono font-medium px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveSlideModal}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  {slideEditingIdx !== null ? 'Save Changes' : 'Add Slide'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          FEATURE MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFeatureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-left space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <h3 className="text-sm font-black text-slate-900">
                  {featureEditingIdx !== null ? 'Edit Highlight Card' : 'Add Highlight Card'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Title *</label>
                  <input
                    type="text"
                    value={featureModalForm.title}
                    onChange={(e) => setFeatureModalForm({ ...featureModalForm, title: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    value={featureModalForm.description}
                    onChange={(e) => setFeatureModalForm({ ...featureModalForm, description: e.target.value })}
                    className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Badge</label>
                    <input
                      type="text"
                      value={featureModalForm.badge}
                      onChange={(e) => setFeatureModalForm({ ...featureModalForm, badge: e.target.value })}
                      placeholder="e.g. Accredited"
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Icon</label>
                    <select
                      value={featureModalForm.icon}
                      onChange={(e) => setFeatureModalForm({ ...featureModalForm, icon: e.target.value })}
                      className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                    >
                      {AVAILABLE_ICONS.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Target Link</label>
                  <input
                    type="text"
                    value={featureModalForm.link}
                    onChange={(e) => setFeatureModalForm({ ...featureModalForm, link: e.target.value })}
                    placeholder="/about"
                    className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeatureModal}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Save Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          STAT MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isStatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-left space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                <h3 className="text-sm font-black text-slate-900">Add Key Statistic</h3>
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Metric Number / Value *</label>
                  <input
                    type="text"
                    value={statModalForm.value}
                    onChange={(e) => setStatModalForm({ ...statModalForm, value: e.target.value })}
                    placeholder="e.g. 95%+, 150+, 40+"
                    className="w-full text-sm font-black px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 text-indigo-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Metric Label *</label>
                  <input
                    type="text"
                    value={statModalForm.label}
                    onChange={(e) => setStatModalForm({ ...statModalForm, label: e.target.value })}
                    placeholder="e.g. Placement Track Record"
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Icon</label>
                  <select
                    value={statModalForm.icon}
                    onChange={(e) => setStatModalForm({ ...statModalForm, icon: e.target.value })}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatModal}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Add Stat
                </button>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Live Portal Preview
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Preview of current unsaved & saved carousel slides as rendered on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Achievements Carousel Preview */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Achievements Showcase Preview
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.achievementsSection.slides?.slice(0, 3).map((sl, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-900 shadow-2xs">
                      <img src={sl.imageUrl} alt={sl.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                        <span className="text-[8px] font-black text-amber-300 uppercase tracking-wider">{sl.tag}</span>
                        <span className="text-[11px] font-black text-white line-clamp-1">{sl.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Bar Preview */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Quick Statistics Bar Preview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {data.quickStats?.items?.map((st, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xl font-black text-indigo-700 block">{st.value}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
