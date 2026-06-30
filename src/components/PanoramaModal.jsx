import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCw, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PanoramaModal({ isOpen, onClose, imageUrl }) {
  const containerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    // Function to initialize Pannellum
    const initPannellum = () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error destroying previous viewer:", e);
        }
        viewerInstanceRef.current = null;
      }

      if (window.pannellum) {
        try {
          viewerInstanceRef.current = window.pannellum.viewer(containerRef.current, {
            type: 'equirectangular',
            panorama: imageUrl,
            autoLoad: true,
            compass: true,
            yaw: 0,
            pitch: 0,
            hfov: 110,
            mouseZoom: true,
            doubleClickZoom: true,
            showZoomCtrl: true,
            showFullscreenCtrl: false,
            autoRotate: -2,
          });
          setLoading(false);
        } catch (err) {
          console.error("Pannellum initialization error:", err);
          setError("Failed to initialize 360° viewer. Please try again.");
          setLoading(false);
        }
      } else {
        setError("Pannellum object not found in window.");
        setLoading(false);
      }
    };

    // Load Pannellum CSS if not present
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum/build/pannellum.css';
      document.head.appendChild(link);
    }

    // Load Pannellum JS if not present
    if (window.pannellum) {
      initPannellum();
    } else {
      let script = document.getElementById('pannellum-js');
      if (!script) {
        script = document.createElement('script');
        script.id = 'pannellum-js';
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum/build/pannellum.js';
        script.async = true;
        document.body.appendChild(script);
      }
      
      const handleLoad = () => {
        initPannellum();
      };
      
      const handleError = () => {
        setError("Failed to load 360° viewer scripts.");
        setLoading(false);
      };

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);

      return () => {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      };
    }

    return () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (e) {
          console.error("Error destroying viewer on unmount:", e);
        }
        viewerInstanceRef.current = null;
      }
    };
  }, [isOpen, imageUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-[28px] shadow-2xl z-10 mx-auto h-[75vh] md:h-[650px] flex flex-col overflow-hidden text-white"
      >
        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-[120] flex items-center justify-between p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
          <div>
            <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AIML Lab 1 Interactive 360° Tour
            </h2>
            <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
              Drag to Look Around • Scroll to Zoom
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer shadow hover:scale-105"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-[110]">
            <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading virtual environment...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-[110] text-rose-500 p-6 text-center">
            <span className="text-sm font-black mb-4">{error}</span>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Panorama Canvas Container */}
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ background: '#0a0a0a' }}
        />
      </motion.div>
    </div>
  );
}
