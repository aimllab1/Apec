import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCw, RefreshCw, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PanoramaModal({ isOpen, onClose, initialScene = 'mainGate' }) {
  const containerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeScene, setActiveScene] = useState(initialScene);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);
    setActiveScene(initialScene);

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
          const viewer = window.pannellum.viewer(containerRef.current, {
            default: {
              firstScene: initialScene,
              sceneFadeDuration: 1000,
              autoLoad: true,
              compass: true,
              mouseZoom: true,
              doubleClickZoom: true,
              showZoomCtrl: true,
              showFullscreenCtrl: false,
            },
            scenes: {
              mainGate: {
                title: "APEC Entrance Gate",
                type: "equirectangular",
                panorama: "/Main_Gate.jpg",
                yaw: 0,
                pitch: 0,
                hfov: 110,
                autoRotate: -2,
                hotSpots: [
                  {
                    pitch: -3,
                    yaw: 15,
                    type: "scene",
                    text: "Walk to AIML Lab",
                    sceneId: "aimlLab",
                    targetYaw: 0,
                    targetPitch: 0
                  }
                ]
              },
              aimlLab: {
                title: "AIML Research Lab",
                type: "equirectangular",
                panorama: "/Aiml_Lab_1.jpg",
                yaw: 0,
                pitch: 0,
                hfov: 110,
                autoRotate: -2,
                hotSpots: [
                  {
                    pitch: -15,
                    yaw: 165,
                    type: "scene",
                    text: "Return to Entrance Gate",
                    sceneId: "mainGate",
                    targetYaw: 0,
                    targetPitch: 0
                  }
                ]
              }
            }
          });

          viewerInstanceRef.current = viewer;

          // Track scene changes to update header title dynamically
          viewer.on('scenechange', (sceneId) => {
            setActiveScene(sceneId);
          });

          setLoading(false);
        } catch (err) {
          console.error("Pannellum initialization error:", err);
          setError("Failed to initialize 360° Tour. Please try again.");
          setLoading(false);
        }
      } else {
        setError("Pannellum script was not loaded properly.");
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
  }, [isOpen, initialScene]);

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
              <Compass className="w-4 h-4 text-indigo-450 animate-pulse" />
              <span>
                {activeScene === 'mainGate' 
                  ? 'APEC Entrance Gate 360° Virtual Tour' 
                  : 'AIML Lab 1 Interactive 360° Virtual Tour'}
              </span>
            </h2>
            <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-1 pl-6">
              Click arrows to walk • Drag to Look • Scroll to Zoom
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
