import React, { useEffect, useRef, useState } from 'react';
import { X, Compass, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sceneTitles = {
  mainGate: 'Adhiparasakthi Engineering College Entrance Gate 360° Virtual Tour',
  junctionOne: 'Adhiparasakthi Engineering College Junction 1 360° Virtual Tour',
  junctionTwo: 'Adhiparasakthi Engineering College Junction 2 360° Virtual Tour',
  junctionThree: 'Adhiparasakthi Engineering College Junction 3 360° Virtual Tour',
  library: 'Central Library 360° Virtual Tour',
  pgBlock: 'PG Block 360° Virtual Tour',
  amma: 'Amma Statue 360° Virtual Tour',
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Keep a mutable ref of the playing state to avoid stale closure in Pannellum load callbacks
  const isPlayingRef = useRef(true);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Preload all panorama images on mount/open to ensure instant transitions
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoad(true); // Reset initial load overlay on open
      const panoramaImages = [
        "/Main_Gate.jpg",
        "/Junction 1.jpeg",
        "/junction 2.jpeg",
        "/Junctiion 3 .jpg.jpeg",
        "/amma_.jpg.jpeg",
        "/main block Reception_.jpg.jpeg",
        "/Aiml_Lab_1.jpg",
        "/Library__2.jpg.jpeg",
        "/P_G_Block__1.jpg.jpeg"
      ];
      
      panoramaImages.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [isOpen]);

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
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="pano-arrow-svg">
            <path class="arrow-part part-3" d="M12,2 L4,10 L20,10 Z"></path>
            <path class="arrow-part part-2" d="M12,8 L4,16 L20,16 Z"></path>
            <path class="arrow-part part-1" d="M12,14 L4,22 L20,22 Z"></path>
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
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30, // Placed in the middle-bottom
                    yaw: -90, // Placed on the West side of the Entrance Gate panorama
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
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
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 90, // Placed on the East side (Back to Gate)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Entrance Gate", sceneId: "mainGate" }
                  },
                  {
                    pitch: -30,
                    yaw: -80, // Moved slightly more towards west (-80)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Reception", sceneId: "reception" }
                  },
                  {
                    pitch: -30,
                    yaw: 180, // South side of Junction 1 leads to Junction 2
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 2", sceneId: "junctionTwo" }
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
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 80, // Return path to Junction 1
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
                  },
                  {
                    pitch: -30,
                    yaw: -90, // West side of Reception leads to Amma Statue
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Amma Statue", sceneId: "amma" }
                  }
                ]
              },
              amma: {
                title: "Amma Statue",
                type: "equirectangular",
                panorama: "/amma_.jpg.jpeg",
                yaw: -45,
                pitch: 0,
                hfov: 110,
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 90, // East side of Amma Statue goes back to Reception
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Reception", sceneId: "reception" }
                  },
                  {
                    pitch: -5, // EXPLICITLY KEPT AT -5 (do not change arrow from Amma to AIML Lab)
                    yaw: -45, // North-West side leads to AIML Lab
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "AIML Lab", sceneId: "aimlLab" }
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
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 220, // Adjusted to 220 as requested
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Amma Statue", sceneId: "amma" }
                  }
                ]
              },
              junctionTwo: {
                title: "Junction 2",
                type: "equirectangular",
                panorama: "/junction 2.jpeg",
                yaw: -45,
                pitch: 0,
                hfov: 110,
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 0, // North side of Junction 2 goes back to Junction 1
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
                  },
                  {
                    pitch: -30,
                    yaw: 180, // South side of Junction 2 leads directly to PG Block
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "PG Block", sceneId: "pgBlock" }
                  }
                ]
              },
              pgBlock: {
                title: "PG Block",
                type: "equirectangular",
                panorama: "/P_G_Block__1.jpg.jpeg",
                yaw: -45,
                pitch: 0,
                hfov: 110,
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: -10, // Adjusted -10 from current position (0)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 2", sceneId: "junctionTwo" }
                  },
                  {
                    pitch: -30,
                    yaw: 170, // Adjusted -10 from current position (180)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 3", sceneId: "junctionThree" }
                  }
                ]
              },
              junctionThree: {
                title: "Junction 3",
                type: "equirectangular",
                panorama: "/Junctiion 3 .jpg.jpeg",
                yaw: -45,
                pitch: 0,
                hfov: 110,
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 30, // Adjusted +30 from current position (0)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "PG Block", sceneId: "pgBlock" }
                  },
                  {
                    pitch: -30,
                    yaw: 220, // Adjusted +60 from current position (160)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Library", sceneId: "library" }
                  }
                ]
              },
              library: {
                title: "Central Library",
                type: "equirectangular",
                panorama: "/Library__2.jpg.jpeg",
                yaw: -45,
                pitch: 0,
                hfov: 110,
                autoRotate: 4.0, // Moving rightwards (clockwise) at a faster speed
                hotSpots: [
                  {
                    pitch: -30,
                    yaw: 30, // Adjusted from Library to Junction 3 to be yaw: 30
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 3", sceneId: "junctionThree" }
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
            setIsInitialLoad(false); // First scene loaded, hide solid loader screen
            // Apply current play state to new scene
            if (!isPlayingRef.current) {
              viewer.stopAutoRotate();
            } else {
              viewer.startAutoRotate(4.0);
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
        viewerInstanceRef.current.startAutoRotate(4.0);
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
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #ffffff !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7)) !important;
          }
          
          .pano-arrow-svg {
            color: #ffffff !important;
            transition: transform 0.25s ease !important;
          }
          
          .arrow-part {
            transition: opacity 0.25s ease, transform 0.25s ease, fill 0.25s ease !important;
            opacity: 0.35;
            fill: #ffffff !important;
          }
          
          .arrow-part.part-1 {
            opacity: 1; /* Only show bottom triangle in normal state */
          }
          
          /* Hover state animations: sequential fade and shift up (double/triple arrow animation) */
          .custom-pano-hotspot:hover .pano-arrow-svg {
            transform: translateY(-4px) !important;
          }
          
          .custom-pano-hotspot:hover .part-1 {
            animation: arrow-wave-seq 0.9s infinite 0s;
          }
          
          .custom-pano-hotspot:hover .part-2 {
            animation: arrow-wave-seq 0.9s infinite 0.15s;
          }
          
          .custom-pano-hotspot:hover .part-3 {
            animation: arrow-wave-seq 0.9s infinite 0.3s;
          }
          
          @keyframes arrow-wave-seq {
            0% {
              opacity: 0.3;
              fill: #ffffff !important;
            }
            50% {
              opacity: 1;
              fill: #6366f1 !important; /* Glow indigo in the middle of the wave */
            }
            100% {
              opacity: 0.3;
              fill: #ffffff !important;
            }
          }
          
          /* Custom tooltip styling (Permanently visible transparent text labels with strong shadows) */
          .pano-tooltip-text {
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translateX(-50%) !important;
            background: transparent !important;
            border: none !important;
            color: #ffffff !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.08em !important;
            font-size: 28px !important; /* Big and bold font size */
            padding: 4px 8px !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            white-space: nowrap !important;
            opacity: 1 !important; /* Always visible without hover */
            pointer-events: none;
            text-shadow: 0 0 10px rgba(0, 0, 0, 1), 0 0 5px rgba(0, 0, 0, 1), 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
            transition: transform 0.2s ease, color 0.2s ease !important;
          }
          
          .custom-pano-hotspot:hover .pano-tooltip-text {
            transform: translateX(-50%) scale(1.05) !important;
            color: #6366f1 !important;
            text-shadow: 0 0 12px rgba(99, 102, 241, 0.8), 0 0 6px rgba(0, 0, 0, 1) !important;
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
              <option value="junctionTwo">Junction 2</option>
              <option value="pgBlock">PG Block</option>
              <option value="junctionThree">Junction 3</option>
              <option value="library">Central Library</option>
              <option value="reception">Reception</option>
              <option value="amma">Amma Statue</option>
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
          {isInitialLoad && (
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
                  {activeScene === 'junctionTwo' && 'Walking to Junction 2...'}
                  {activeScene === 'pgBlock' && 'Walking to PG Block...'}
                  {activeScene === 'junctionThree' && 'Walking to Junction 3...'}
                  {activeScene === 'library' && 'Entering Central Library...'}
                  {activeScene === 'amma' && 'Walking to Amma Statue...'}
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
              scale: (loading || isTransitioning) ? 1.35 : 1,
              filter: (loading || isTransitioning) ? 'blur(30px) brightness(0.55)' : 'blur(0px) brightness(1)',
            }}
            transition={{
              duration: 0.85,
              ease: [0.19, 1, 0.22, 1] // Snappy cinematic zoom and snap ease-out
            }}
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
