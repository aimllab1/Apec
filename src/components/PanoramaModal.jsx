import React, { useEffect, useRef, useState } from 'react';
import { X, Compass, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sceneTitles = {
  mainGate: 'Adhiparasakthi Engineering College Entrance Gate 360° Virtual Tour',
  junctionOne: 'Adhiparasakthi Engineering College Junction 1 360° Virtual Tour',
  reception: 'Main Block Reception 360° Virtual Tour',
  aimlLab: 'AIML Research Lab 360° Virtual Tour'
};

export default function PanoramaModal({ isOpen, onClose, initialScene = 'mainGate' }) {
  const containerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState(null);
  const [activeScene, setActiveScene] = useState(initialScene);
  const [isPlaying, setIsPlaying] = useState(true);

  // Keep a mutable ref of the playing state to avoid stale closure in Pannellum load callbacks
  const isPlayingRef = useRef(true);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setIsTransitioning(false);
    setError(null);
    setActiveScene(initialScene);

    // Function to create custom hotspots (Google Maps style pointing straight forward/up)
    const createCustomHotspot = (hotSpotDiv, args) => {
      hotSpotDiv.innerHTML = '';
      hotSpotDiv.classList.add('custom-pano-hotspot');
      
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      
      wrapper.innerHTML = `
        <div class="pano-arrow-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="pano-arrow-svg">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </div>
        <span class="pano-tooltip-text">${args.text}</span>
      `;
      
      hotSpotDiv.appendChild(wrapper);
      
      // Add custom click handler for navigation
      hotSpotDiv.addEventListener('click', (e) => {
        e.preventDefault();
        if (viewerInstanceRef.current) {
          viewerInstanceRef.current.loadScene(args.sceneId);
        }
      });
    };

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
              sceneFadeDuration: 800,
              autoLoad: true,
              compass: true,
              mouseZoom: true,
              doubleClickZoom: true,
              showZoomCtrl: true,
              showFullscreenCtrl: false,
            },
            scenes: {
              mainGate: {
                title: "Entrance Gate",
                type: "equirectangular",
                panorama: "/Main_Gate.jpg",
                yaw: -45, // Start from North-West direction
                pitch: 0,
                hfov: 110,
                autoRotate: -4.0, // Moving leftwards (counter-clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -5,
                    yaw: -90, // Placed on the West side of the Entrance Gate panorama
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Walk to Junction 1", sceneId: "junctionOne" }
                  }
                ]
              },
              junctionOne: {
                title: "Junction 1",
                type: "equirectangular",
                panorama: "/Junction 1.jpeg",
                yaw: -45, // Start from North-West direction
                pitch: 0,
                hfov: 110,
                autoRotate: -4.0, // Moving leftwards (counter-clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -5,
                    yaw: -90, // Placed on the West side of Junction 1 panorama
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Walk to Main Block Reception", sceneId: "reception" }
                  },
                  {
                    pitch: -5,
                    yaw: 90, // Placed on the East side (Back to Gate)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Return to Entrance Gate", sceneId: "mainGate" }
                  }
                ]
              },
              reception: {
                title: "Main Block Reception",
                type: "equirectangular",
                panorama: "/main block Reception_.jpg.jpeg",
                yaw: -45, // Start from North-West direction
                pitch: 0,
                hfov: 110,
                autoRotate: -4.0, // Moving leftwards (counter-clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -5,
                    yaw: -90, // Placed on the West side of Reception (Walk to AIML Lab)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Walk to AIML Research Lab", sceneId: "aimlLab" }
                  },
                  {
                    pitch: -5,
                    yaw: 90, // Placed on the East side (Back to Junction 1)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Return to Junction 1", sceneId: "junctionOne" }
                  }
                ]
              },
              aimlLab: {
                title: "AIML Research Lab",
                type: "equirectangular",
                panorama: "/Aiml_Lab_1.jpg",
                yaw: -45, // Start from North-West direction
                pitch: 0,
                hfov: 110,
                autoRotate: -4.0, // Moving leftwards (counter-clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -5,
                    yaw: 90, // Placed on the East side (Back to Reception)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Return to Reception", sceneId: "reception" }
                  }
                ]
              }
            }
          });

          viewerInstanceRef.current = viewer;

          // Track scene changes to update header title dynamically
          viewer.on('scenechange', (sceneId) => {
            setActiveScene(sceneId);
            setIsTransitioning(true);
            setLoading(true);
          });

          viewer.on('load', () => {
            setLoading(false);
            setIsTransitioning(false);
            // Apply current play state to new scene
            if (!isPlayingRef.current) {
              viewer.stopAutoRotate();
            } else {
              viewer.startAutoRotate(-4.0);
            }
          });

          viewer.on('error', (err) => {
            console.error("Pannellum runtime error:", err);
            setError(err.message || "Failed to load panorama image.");
            setLoading(false);
            setIsTransitioning(false);
          });

        } catch (err) {
          console.error("Pannellum initialization error:", err);
          setError("Failed to initialize 360° Tour. Please try again.");
          setLoading(false);
          setIsTransitioning(false);
        }
      } else {
        setError("Pannellum script was not loaded properly.");
        setLoading(false);
        setIsTransitioning(false);
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

  const toggleAutoplay = () => {
    if (viewerInstanceRef.current) {
      if (isPlaying) {
        viewerInstanceRef.current.stopAutoRotate();
        setIsPlaying(false);
      } else {
        viewerInstanceRef.current.startAutoRotate(-4.0);
        setIsPlaying(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-full sm:h-[75vh] md:h-[650px] sm:max-w-5xl bg-zinc-950 border-0 sm:border border-zinc-800 rounded-none sm:rounded-[28px] shadow-2xl z-10 mx-auto flex flex-col overflow-hidden text-white"
      >
        {/* Inject CSS styles directly into component */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide default Pannellum loading elements completely */
          .pnlm-load-box {
            display: none !important;
          }
          
          /* Custom Hotspot Styling (Google Maps Arrow style) */
          .custom-pano-hotspot {
            width: 44px !important;
            height: 44px !important;
            margin-left: -22px !important;
            margin-top: -22px !important;
            cursor: pointer !important;
            z-index: 10 !important;
          }
          
          .pano-arrow-wrapper {
            width: 44px;
            height: 44px;
            background: rgba(9, 9, 11, 0.8) !important;
            border: 3px solid #6366f1 !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #ffffff !important;
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.7) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
          }
          
          .pano-arrow-wrapper::before {
            content: '' !important;
            position: absolute !important;
            inset: -6px !important;
            border: 2px solid rgba(99, 102, 241, 0.4) !important;
            border-radius: 50% !important;
            animation: pano-pulse 2s infinite !important;
            opacity: 1 !important;
            pointer-events: none;
          }
          
          @keyframes pano-pulse {
            0% {
              transform: scale(0.95);
              opacity: 1;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          
          .pano-arrow-svg {
            stroke: #ffffff !important;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) !important;
            transition: transform 0.25s ease !important;
          }
          
          /* Hover state animations: Nudge straight up */
          .custom-pano-hotspot:hover .pano-arrow-wrapper {
            background: #6366f1 !important;
            border-color: #ffffff !important;
            transform: scale(1.15) !important;
            box-shadow: 0 0 25px rgba(99, 102, 241, 1) !important;
          }
          
          .custom-pano-hotspot:hover .pano-arrow-svg {
            transform: translateY(-3px) !important;
          }
          
          /* Custom tooltip styling */
          .pano-tooltip-text {
            position: absolute;
            bottom: 54px;
            left: 50%;
            transform: translateX(-50%) scale(0.9);
            background: rgba(9, 9, 11, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            color: #ffffff !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.06em !important;
            font-size: 10px !important;
            padding: 6px 12px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
            backdrop-filter: blur(8px) !important;
            white-space: nowrap !important;
            opacity: 0;
            pointer-events: none;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .custom-pano-hotspot:hover .pano-tooltip-text {
            opacity: 1 !important;
            transform: translateX(-50%) scale(1) !important;
            bottom: 58px;
          }
        ` }} />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-[120] flex items-center justify-between p-3 sm:p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 uppercase tracking-wider text-indigo-400">
              <Compass className="w-4 h-4 text-indigo-400 animate-pulse" />
              
              {/* Play/Pause Autoplay button right next to the compass */}
              <button 
                onClick={toggleAutoplay}
                className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 hover:text-white rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-inner border border-indigo-500/30 active:scale-95"
                title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" fill="currentColor" />
                ) : (
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                )}
              </button>
              
              <span className="hidden sm:inline">Adhiparasakthi Engineering College 360° Virtual Tour</span>
              <span className="inline sm:hidden">APEC 360° Tour</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick jump dropdown list of all scenes */}
            <select
              value={activeScene}
              onChange={(e) => {
                const newScene = e.target.value;
                if (viewerInstanceRef.current && newScene !== activeScene) {
                  viewerInstanceRef.current.loadScene(newScene);
                }
              }}
              className="bg-zinc-900/90 text-zinc-200 border border-zinc-700 rounded-xl px-2.5 py-1.5 font-bold text-[9px] sm:text-xs uppercase tracking-wider cursor-pointer focus:outline-none focus:border-indigo-500 transition-all hover:bg-zinc-800 max-w-[110px] sm:max-w-none"
            >
              <option value="mainGate">Entrance Gate</option>
              <option value="junctionOne">Junction 1</option>
              <option value="reception">Reception</option>
              <option value="aimlLab">AIML Lab</option>
            </select>

            <button 
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer shadow hover:scale-105"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Premium Blur and Motion Transition Overlay */}
        <AnimatePresence>
          {(loading || isTransitioning) && (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-xl z-[110]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="flex flex-col items-center p-8 bg-zinc-950/90 border border-zinc-800 rounded-3xl shadow-2xl max-w-sm text-center"
              >
                <div className="relative mb-6">
                  {/* Orbiting ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center"
                  >
                    <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </motion.div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>

                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  {activeScene === 'mainGate' && 'Loading Entrance Gate...'}
                  {activeScene === 'junctionOne' && 'Walking to Junction 1...'}
                  {activeScene === 'reception' && 'Entering Main Block Reception...'}
                  {activeScene === 'aimlLab' && 'Entering AIML Research Lab...'}
                </h3>
                <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-widest mt-2">
                  Rendering 360° Environment
                </p>

                {/* Simulated/Pulsing Progress bar */}
                <div className="w-36 h-1 bg-zinc-800 rounded-full mt-5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-[115] text-rose-500 p-6 text-center">
            <span className="text-sm font-black mb-4">{error}</span>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Panorama Canvas Container Wrapper to enable Motion Blur Transitions */}
        <div className="w-full h-full overflow-hidden relative" style={{ background: '#0a0a0a' }}>
          <motion.div 
            ref={containerRef} 
            animate={{
              scale: (loading || isTransitioning) ? 1.18 : 1,
              filter: (loading || isTransitioning) ? 'blur(16px) brightness(0.6)' : 'blur(0px) brightness(1)',
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 1, 0.5, 1] // Elegant camera zoom ease
            }}
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
