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

const mapPoints = [
  { id: 1, name: "Main Gate Entrance", x: 78.0, y: 89.8, sceneId: "mainGate" },
  { id: 2, name: "Junction 1", x: 65.1, y: 51.5, sceneId: "junctionOne" },
  { id: 3, name: "Junction 2", x: 52.3, y: 63.6, sceneId: "junctionTwo" },
  { id: 4, name: "PG Block", x: 34.6, y: 71.3, sceneId: "pgBlock" },
  { id: 5, name: "Junction 3", x: 23.6, y: 72.4, sceneId: "junctionThree" },
  { id: 6, name: "Central Library", x: 12.4, y: 65.6, sceneId: "library" },
  { id: 7, name: "Main Block / Reception", x: 60.2, y: 29.6, sceneId: "reception" }
];

const thumbnailScenes = [
  { id: 'mainGate', label: 'Main Gate', img: '/Main_Gate.jpg' },
  { id: 'junctionOne', label: 'Junction 1', img: '/Junction 1.jpeg' },
  { id: 'junctionTwo', label: 'Junction 2', img: '/junction 2.jpeg' },
  { id: 'reception', label: 'Reception', img: '/main block Reception_.jpg.jpeg' },
  { id: 'amma', label: 'Amma Statue', img: '/amma_.jpg.jpeg' },
  { id: 'aimlLab', label: 'AIML Lab', img: '/Aiml_Lab_1.jpg' },
  { id: 'pgBlock', label: 'PG Block', img: '/P_G_Block__1.jpg.jpeg' },
  { id: 'junctionThree', label: 'Junction 3', img: '/Junctiion 3 .jpg.jpeg' },
  { id: 'library', label: 'Library', img: '/Library__2.jpg.jpeg' }
];

export default function PanoramaModal({ isOpen, onClose, initialScene = 'mainGate' }) {
  const containerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState(null);
  const [activeScene, setActiveScene] = useState(initialScene);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mobileSelectorOpen, setMobileSelectorOpen] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(window.innerWidth >= 1024);
  const [isGyroActive, setIsGyroActive] = useState(false);

  const toggleGyroscope = () => {
    if (!viewerInstanceRef.current) return;
    try {
      if (isGyroActive) {
        viewerInstanceRef.current.stopDeviceOrientation();
        setIsGyroActive(false);
      } else {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                viewerInstanceRef.current.startDeviceOrientation();
                setIsGyroActive(true);
              } else {
                alert("Permission to access gyroscope was denied.");
              }
            })
            .catch(err => {
              console.error("Device orientation permission error:", err);
              viewerInstanceRef.current.startDeviceOrientation();
              setIsGyroActive(true);
            });
        } else {
          viewerInstanceRef.current.startDeviceOrientation();
          setIsGyroActive(true);
        }
      }
    } catch (e) {
      console.error("Gyroscope orientation error:", e);
    }
  };

  // Keep a mutable ref of the playing state to avoid stale closure in Pannellum load callbacks
  const isPlayingRef = useRef(true);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isWindowPortrait = window.innerHeight > window.innerWidth;
      const isMobileDevice = window.innerWidth < 1024 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
      setIsPortrait(isWindowPortrait && isMobileDevice);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

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

    // Function to create custom hotspots (Google Maps style pentagon pointing forward)
    const createCustomHotspot = (hotSpotDiv, args) => {
      // Remove default Pannellum sprite/control classes to prevent default icons from rendering
      hotSpotDiv.classList.remove('pnlm-sprite', 'pnlm-info', 'pnlm-scene');
      
      hotSpotDiv.innerHTML = '';
      hotSpotDiv.classList.add('custom-pano-hotspot');
      
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      
      wrapper.innerHTML = `
        <div class="pano-arrow-wrapper">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="currentColor" class="pano-arrow-svg">
            <polyline points="8,26 16,19 24,26" fill="none" stroke="#FF4D4D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-hex-inner part-1" />
            <polyline points="8,17 16,10 24,17" fill="none" stroke="#FF4D4D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-hex-inner part-2" />
            <polyline points="8,8 16,1 24,8" fill="none" stroke="#FF4D4D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-hex-inner part-3" />
          </svg>
        </div>
        <span class="pano-tooltip-text">${args.text}</span>
      `;
      
      hotSpotDiv.appendChild(wrapper);
      
      // Intercept and stop default click/zoom events from Pannellum using capture phase
      const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (viewerInstanceRef.current) {
          viewerInstanceRef.current.loadScene(args.sceneId);
        }
      };
      
      // Add listener to the capture phase to run before Pannellum's internal handler
      hotSpotDiv.addEventListener('click', clickHandler, true);
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
              compass: false,
              mouseZoom: true,
              doubleClickZoom: true,
              showZoomCtrl: false,
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
                    pitch: -18, // Placed in the middle-bottom (adjusted from -30)
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
                    pitch: -18,
                    yaw: 95, // Placed on the East side (Back to Gate) - Math: 90 + 5 = 95
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Entrance Gate", sceneId: "mainGate" }
                  },
                  {
                    pitch: -18,
                    yaw: -75, // Moved slightly more towards west (-80 + 5 = -75)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Reception", sceneId: "reception" }
                  },
                  {
                    pitch: -18,
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
                    pitch: -18,
                    yaw: 100, // Return path to Junction 1 (80 + 20 = 100)
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
                  },
                  {
                    pitch: -18,
                    yaw: -90, // West side of Reception leads to Amma Statue - Math: -85 - 5 = -90
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
                    pitch: -18,
                    yaw: 95, // East side goes back to Reception - Math: 100 - 5 = 95
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Reception", sceneId: "reception" }
                  },
                  {
                    pitch: -12, // Moved slightly down from -5 as requested
                    yaw: -40, // North-West side leads to AIML Lab
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
                    pitch: -18,
                    yaw: 0, // Relocated to the North of the image as requested
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
                    pitch: -18,
                    yaw: 0, // North side goes back to Junction 1 - Math: 10 - 10 = 0
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
                  },
                  {
                    pitch: -18,
                    yaw: 175, // South side leads to PG Block - Math: 185 - 10 = 175
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
                    pitch: -18,
                    yaw: -10, // Leads back to Junction 2 - Math: 0 - 10 = -10
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "Junction 2", sceneId: "junctionTwo" }
                  },
                  {
                    pitch: -18,
                    yaw: 165, // Leads to Junction 3 - Math: 175 - 10 = 165
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
                    pitch: -18,
                    yaw: 25, // Leads back to PG Block - Math: 35 - 10 = 25
                    createTooltipFunc: createCustomHotspot,
                    createTooltipArgs: { text: "PG Block", sceneId: "pgBlock" }
                  },
                  {
                    pitch: -18,
                    yaw: 210, // Adjusted from current position (220 - 10 = 210)
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
                    pitch: -18,
                    yaw: 70, // Adjusted from Library to Junction 3 to be yaw: 70 (60 + 10 = 70)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-black">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-full bg-zinc-950 flex flex-col overflow-hidden text-white"
      >
        {/* Inject CSS styles directly into component */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide default Pannellum loading elements and default controls completely */
          .pnlm-load-box,
          .pnlm-zoom-controls,
          .pnlm-compass,
          .pnlm-fullscreen-toggle-button,
          .pnlm-about-msg,
          .pnlm-control-bar {
            display: none !important;
          }
          
          /* Custom Hotspot Styling (Google Maps Arrow style) - default styles removed and size adjusted */
          .custom-pano-hotspot {
            background-image: none !important;
            background: none !important;
            width: 80px !important;
            height: 80px !important;
            margin-left: -40px !important;
            margin-top: -40px !important;
            cursor: pointer !important;
            z-index: 10 !important;
            overflow: visible !important; /* Prevent clipping */
          }

          .custom-pano-hotspot::before,
          .custom-pano-hotspot::after {
            display: none !important;
            content: none !important;
          }
          
          .pano-arrow-wrapper {
            width: 80px;
            height: 80px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #ffffff !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) !important;
            transform: perspective(200px) rotateX(60deg); /* Lies flat on the road plane */
            transform-style: preserve-3d;
            overflow: visible !important; /* Prevent clipping */
          }
          
          .pano-arrow-svg {
            transition: transform 0.25s ease !important;
            overflow: visible !important; /* Prevent clipping */
          }
          
          .arrow-hexagon-base {
            transition: all 0.3s ease !important;
          }
          
          .arrow-hex-inner {
            transition: all 0.3s ease, opacity 0.3s ease, transform 0.3s ease !important;
            opacity: 0;
            transform-origin: center;
          }
          
          /* Normal state: double arrow */
          .arrow-hex-inner.part-1 {
            opacity: 0.9;
          }
          
          .arrow-hex-inner.part-2 {
            opacity: 0.9;
          }
          
          .arrow-hex-inner.part-3 {
            opacity: 0; /* Hidden in double arrow normal state */
          }
          
          /* Hover state animations */
          .custom-pano-hotspot:hover .pano-arrow-wrapper {
            transform: perspective(200px) rotateX(55deg) translateY(-10px) scale(1.1) !important;
            filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.95)) !important;
          }
          
          .custom-pano-hotspot:hover .arrow-hex-inner {
            stroke: #ffffff !important; /* Transition arrows to glowing white on hover */
          }
          
          .custom-pano-hotspot:hover .part-1 {
            animation: chevronWave1 1.8s infinite ease-in-out;
          }
          
          .custom-pano-hotspot:hover .part-2 {
            animation: chevronWave2 1.8s infinite ease-in-out;
          }
          
          .custom-pano-hotspot:hover .part-3 {
            animation: chevronWave3 1.8s infinite ease-in-out;
          }
          
          @keyframes chevronWave1 {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            20% { opacity: 1; transform: translateY(-2px); }
            40%, 80% { opacity: 0.3; transform: translateY(0); }
          }
          
          @keyframes chevronWave2 {
            0%, 20%, 100% { opacity: 0.3; transform: translateY(0); }
            40% { opacity: 1; transform: translateY(-2px); }
            60%, 80% { opacity: 0.3; transform: translateY(0); }
          }
          
          @keyframes chevronWave3 {
            0%, 40%, 100% { opacity: 0.3; transform: translateY(0); }
            60% { opacity: 1; transform: translateY(-2px); }
            80% { opacity: 0.3; transform: translateY(0); }
          }
          
          /* Custom tooltip styling (Permanently visible transparent text labels with strong shadows) */
          .pano-tooltip-text {
            position: absolute;
            top: 90px; /* Positioned below the 80px arrow wrapper */
            left: 50%;
            transform: translateX(-50%) !important;
            background: transparent !important;
            border: none !important;
            color: #ffffff !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.08em !important;
            font-size: 20px !important;
            padding: 2px 4px !important;
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
            color: #FF4D4D !important; /* Changed hover color to light red */
            text-shadow: 0 0 12px rgba(239, 68, 68, 0.8), 0 0 6px rgba(0, 0, 0, 1) !important;
          }
        ` }} />

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-[120] hidden lg:flex items-center justify-between p-3.5 sm:p-5 bg-white/95 border border-zinc-200 shadow-xl rounded-[24px] transition-all">
          <div className="flex items-center gap-4">
            {/* Pulsing compass logo and title info */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <Compass className="w-5 h-5 text-cyan-600 animate-[spin_8s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-cyan-600 uppercase">360° Virtual Experience</span>
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-800">
                  <span className="hidden sm:inline">Adhiparasakthi Engineering College</span>
                  <span className="inline sm:hidden">APEC 360° Tour</span>
                </h2>
              </div>
            </div>

            {/* Play/Pause Autoplay button */}
            <button 
              onClick={toggleAutoplay}
              className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer border active:scale-95 shadow-sm ${
                isPlaying 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              }`}
              title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" fill="currentColor" />
              ) : (
                <Play className="w-4 h-4" fill="currentColor" />
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick jump dropdown list of all scenes */}
            <div className="relative">
              <select
                value={activeScene}
                onChange={(e) => {
                  const newScene = e.target.value;
                  if (viewerInstanceRef.current && newScene !== activeScene) {
                    viewerInstanceRef.current.loadScene(newScene);
                  }
                }}
                className="bg-white text-zinc-800 border border-zinc-300 hover:border-cyan-500 rounded-xl pl-3.5 pr-8 py-2 font-bold text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all hover:bg-zinc-50 max-w-[110px] sm:max-w-none appearance-none shadow-sm"
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
              {/* Custom selector indicator arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>

            {/* Glowing Close Button */}
            <button 
              onClick={onClose}
              className="p-2.5 bg-zinc-50 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 rounded-xl border border-zinc-200 hover:border-rose-350 transition-all cursor-pointer shadow-sm active:scale-95 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Floating Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[120] flex lg:hidden items-center justify-between pointer-events-none">
          {/* Hamburger Menu Button (3 spans transitioning to X) */}
          <button 
            onClick={() => setMobileSelectorOpen(!mobileSelectorOpen)}
            className="w-10 h-10 rounded-full bg-black/90 backdrop-blur-md border border-white/10 text-white flex flex-col items-center justify-center gap-1.5 cursor-pointer pointer-events-auto shadow-lg active:scale-95 z-[130]"
            title="Choose Location"
          >
            <span className={`w-4.5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileSelectorOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`w-4.5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileSelectorOpen ? 'opacity-0' : ''}`} />
            <span className={`w-4.5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileSelectorOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Gyroscope Toggle Button */}
            <button 
              onClick={toggleGyroscope}
              className={`w-10 h-10 rounded-full bg-black/90 backdrop-blur-md border flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-all ${
                isGyroActive 
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/50' 
                  : 'border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle Gyroscope"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`w-4.5 h-4.5 ${isGyroActive ? 'animate-pulse' : ''}`}>
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <path d="M12 18h.01" />
                {isGyroActive && <path d="M17 12a5 5 0 0 0-10 0" />}
              </svg>
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/90 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
              title="Exit Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Scene Selector Dropdown Drawer */}
        <AnimatePresence>
          {mobileSelectorOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-4 right-4 z-[130] bg-white/98 border border-zinc-200 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-left lg:hidden max-h-[70vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="text-[10px] font-black tracking-widest text-cyan-600 uppercase">Select Location</span>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">360° virtual tour</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {thumbnailScenes.map((item) => {
                  const isActive = activeScene === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (viewerInstanceRef.current && item.id !== activeScene) {
                          viewerInstanceRef.current.loadScene(item.id);
                        }
                        setMobileSelectorOpen(false);
                      }}
                      className={`relative h-[65px] rounded-xl overflow-hidden border transition-all cursor-pointer text-left group ${
                        isActive 
                          ? 'border-cyan-500 ring-2 ring-cyan-500/30 scale-[1.02]' 
                          : 'border-zinc-200/80 hover:border-zinc-300'
                      }`}
                    >
                      <img 
                        src={item.img} 
                        alt={item.label} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '25% center' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5" />
                      <span className="absolute bottom-2 left-2.5 right-2.5 text-[9px] font-black uppercase tracking-wider text-white truncate text-center">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* APEC Desktop Left Sidebar Panel (Map on top, vertical scenes list below) */}
        <div className="absolute left-6 top-24 bottom-6 w-[290px] z-[120] hidden lg:flex flex-col gap-4 pointer-events-none select-none">
          <AnimatePresence>
            {showMiniMap ? (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4 h-full pointer-events-auto"
              >
                {/* 1. Map Card (Top) */}
                <div className="bg-white/95 border border-zinc-200 rounded-2xl p-3 shadow-xl flex flex-col gap-2 shrink-0">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                      <span className="text-[10px] font-black tracking-widest text-cyan-600 uppercase font-title">APEC Campus Map</span>
                    </div>
                    <button 
                      onClick={() => setShowMiniMap(false)}
                      className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                      title="Collapse Sidebar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Interactive Map Display */}
                  <div className="relative w-full h-[185px] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                    <img 
                      src="/data/pano/map.png" 
                      alt="Campus Navigation Map" 
                      className="w-full h-full object-cover pointer-events-none select-none opacity-85" 
                    />

                    {/* Coordinate pins */}
                    {mapPoints.map((pt) => {
                      const isActive = activeScene === pt.sceneId;
                      return (
                        <div
                          key={pt.id}
                          style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group z-[126]"
                        >
                          <button
                            onClick={() => {
                              if (viewerInstanceRef.current && pt.sceneId !== activeScene) {
                                viewerInstanceRef.current.loadScene(pt.sceneId);
                              }
                            }}
                            className={`relative w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] scale-110' 
                                : 'bg-cyan-500/80 hover:bg-cyan-400 hover:scale-110'
                            }`}
                          >
                            <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-white/70'}`} />
                            {isActive && (
                              <>
                                <span className="absolute inset-0 rounded-full border border-red-500 animate-[ping_1.6s_infinite] opacity-75" />
                                <span className="absolute -inset-1 rounded-full border border-red-500/50 animate-[ping_2s_infinite] opacity-40" />
                              </>
                            )}
                          </button>

                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/95 border border-zinc-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-zinc-800 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-md z-[127]">
                            {pt.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Vertical Explore Scenes List (Fills remaining height) */}
                <div className="flex-1 bg-white/95 border border-zinc-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 min-h-0">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-black tracking-widest text-cyan-600 uppercase font-title font-bold">Explore Campus</span>
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">{thumbnailScenes.length} Scenes</span>
                  </div>

                  <div 
                    className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1"
                    style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
                  >
                    {thumbnailScenes.map((item) => {
                      const isActive = activeScene === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (viewerInstanceRef.current && item.id !== activeScene) {
                              viewerInstanceRef.current.loadScene(item.id);
                            }
                          }}
                          className={`relative h-[80px] rounded-xl overflow-hidden border transition-all cursor-pointer text-left w-full group shrink-0 ${
                            isActive 
                              ? 'border-cyan-500 ring-2 ring-cyan-500/25 scale-[1.02] shadow-sm shadow-cyan-500/10' 
                              : 'border-zinc-200/85 hover:border-zinc-350 hover:scale-[1.01]'
                          }`}
                        >
                          <img 
                            src={item.img} 
                            alt={item.label} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ objectPosition: '25% center' }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
                          <div className="absolute bottom-2.5 left-3.5 right-3.5 flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white truncate">
                              {item.label}
                            </span>
                            <span className="text-[8px] font-extrabold text-zinc-300 uppercase tracking-widest mt-0.5">
                              360° Panorama View
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Minimized Floating button in bottom-left for desktop */
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setShowMiniMap(true)}
                className="w-10 h-10 rounded-full bg-white/95 border border-zinc-200 text-zinc-500 flex items-center justify-center cursor-pointer pointer-events-auto shadow-md active:scale-95 hover:bg-zinc-50 absolute bottom-0 left-0"
                title="Expand Navigation Sidebar"
              >
                <Compass className="w-5 h-5 text-cyan-600" />
              </motion.button>
            )}
          </AnimatePresence>
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

        {/* Landscape Orientation Warning Overlay */}
        <AnimatePresence>
          {isPortrait && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/95 z-[200] flex flex-col items-center justify-center p-6 text-center text-white"
            >
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-20 h-20 border-2 border-indigo-400 rounded-2xl flex items-center justify-center mb-6"
              >
                <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white mb-2">
                Rotate Your Device
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 font-bold max-w-xs mx-auto leading-relaxed mb-6">
                Please rotate your screen to landscape mode for the best 360° virtual campus tour.
              </p>
              <button 
                onClick={() => setIsPortrait(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
              >
                Continue Anyway
              </button>
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
