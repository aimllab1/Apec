import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const defaultMapPoints = [
  { id: 1, name: "Main Gate Entrance", x: 78.0, y: 89.8, sceneId: "mainGate" },
  { id: 2, name: "Junction 1", x: 65.1, y: 51.5, sceneId: "junctionOne" },
  { id: 3, name: "Junction 2", x: 52.3, y: 63.6, sceneId: "junctionTwo" },
  { id: 4, name: "PG Block", x: 34.6, y: 71.3, sceneId: "pgBlock" },
  { id: 5, name: "Junction 3", x: 23.6, y: 72.4, sceneId: "junctionThree" },
  { id: 6, name: "Central Library", x: 12.4, y: 65.6, sceneId: "library" },
  { id: 7, name: "Main Block / Reception", x: 60.2, y: 29.6, sceneId: "reception" }
];

export const defaultScenes = {
  mainGate: {
    title: "Entrance Gate",
    type: "equirectangular",
    panorama: "/Images/Panorama/Main_Gate.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: -90,
        createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
      }
    ]
  },
  junctionOne: {
    title: "Junction 1",
    type: "equirectangular",
    panorama: "/Images/Panorama/Junction_1.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 95,
        createTooltipArgs: { text: "Entrance Gate", sceneId: "mainGate" }
      },
      {
        pitch: -18,
        yaw: -75,
        createTooltipArgs: { text: "Reception", sceneId: "reception" }
      },
      {
        pitch: -18,
        yaw: 180,
        createTooltipArgs: { text: "Junction 2", sceneId: "junctionTwo" }
      }
    ]
  },
  reception: {
    title: "Main Block Reception",
    type: "equirectangular",
    panorama: "/Images/Panorama/reception.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 100,
        createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
      },
      {
        pitch: -18,
        yaw: -90,
        createTooltipArgs: { text: "Amma Statue", sceneId: "amma" }
      }
    ]
  },
  amma: {
    title: "Amma Statue",
    type: "equirectangular",
    panorama: "/Images/Panorama/amma.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 95,
        createTooltipArgs: { text: "Reception", sceneId: "reception" }
      },
      {
        pitch: -12,
        yaw: -40,
        createTooltipArgs: { text: "AIML Lab", sceneId: "aimlLab" }
      }
    ]
  },
  aimlLab: {
    title: "AIML Research Lab",
    type: "equirectangular",
    panorama: "/Images/Panorama/aiml_lab.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 0,
        createTooltipArgs: { text: "Amma Statue", sceneId: "amma" }
      }
    ]
  },
  junctionTwo: {
    title: "Junction 2",
    type: "equirectangular",
    panorama: "/Images/Panorama/junction_2.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 0,
        createTooltipArgs: { text: "Junction 1", sceneId: "junctionOne" }
      },
      {
        pitch: -18,
        yaw: 175,
        createTooltipArgs: { text: "PG Block", sceneId: "pgBlock" }
      }
    ]
  },
  pgBlock: {
    title: "PG Block",
    type: "equirectangular",
    panorama: "/Images/Panorama/pg_block.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: -10,
        createTooltipArgs: { text: "Junction 2", sceneId: "junctionTwo" }
      },
      {
        pitch: -18,
        yaw: 165,
        createTooltipArgs: { text: "Junction 3", sceneId: "junctionThree" }
      }
    ]
  },
  junctionThree: {
    title: "Junction 3",
    type: "equirectangular",
    panorama: "/Images/Panorama/junction_3.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 25,
        createTooltipArgs: { text: "PG Block", sceneId: "pgBlock" }
      },
      {
        pitch: -18,
        yaw: 210,
        createTooltipArgs: { text: "Library", sceneId: "library" }
      }
    ]
  },
  library: {
    title: "Central Library",
    type: "equirectangular",
    panorama: "/Images/Panorama/library_2.webp",
    yaw: -45,
    pitch: 0,
    hfov: 110,
    autoRotate: 4.0,
    hotSpots: [
      {
        pitch: -18,
        yaw: 70,
        createTooltipArgs: { text: "Junction 3", sceneId: "junctionThree" }
      }
    ]
  }
};

// Fetch tour configuration from Firestore (falls back to localStorage, then default configurations)
export const getLoadedTourDataAsync = async () => {
  try {
    const docRef = doc(db, 'tour_config', 'active');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Cache locally
      if (data.mapPoints) localStorage.setItem('apec_360_points', JSON.stringify(data.mapPoints));
      if (data.scenes) localStorage.setItem('apec_360_scenes', JSON.stringify(data.scenes));
      return {
        mapPoints: data.mapPoints || defaultMapPoints,
        scenes: data.scenes || defaultScenes
      };
    }
  } catch (e) {
    console.error("Firestore getLoadedTourDataAsync failed, falling back to local storage:", e);
  }

  // Fallback to localStorage
  const points = localStorage.getItem('apec_360_points');
  const scenes = localStorage.getItem('apec_360_scenes');
  
  return {
    mapPoints: points ? JSON.parse(points) : defaultMapPoints,
    scenes: scenes ? JSON.parse(scenes) : defaultScenes
  };
};

// Save tour configuration to Firestore and localStorage
export const saveTourDataAsync = async (mapPoints, scenes) => {
  // Update local storage
  localStorage.setItem('apec_360_points', JSON.stringify(mapPoints));
  localStorage.setItem('apec_360_scenes', JSON.stringify(scenes));

  // Update Firestore
  try {
    const docRef = doc(db, 'tour_config', 'active');
    await setDoc(docRef, {
      mapPoints,
      scenes,
      updatedAt: Date.now()
    });
    console.log("Tour configuration successfully saved to Firestore!");
    return true;
  } catch (e) {
    console.error("Firestore saveTourDataAsync failed:", e);
    throw e;
  }
};

// Synchronous getter with automatic background Firestore cache warming
export const getLoadedTourData = () => {
  getLoadedTourDataAsync().catch(err => console.log("Background tour sync skipped:", err));
  
  const points = localStorage.getItem('apec_360_points');
  const scenes = localStorage.getItem('apec_360_scenes');
  
  return {
    mapPoints: points ? JSON.parse(points) : defaultMapPoints,
    scenes: scenes ? JSON.parse(scenes) : defaultScenes
  };
};
