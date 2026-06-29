import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, ShieldAlert, Bus, Phone, Mail, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

const facilityData = {
  library: {
    name: "Resourceful Central Library",
    intro: "The Central Library at Adhiparasakthi Engineering College is a state-of-the-art information repository housed in a spacious two-storied block of 4,000 sq.m. It serves as the intellectual hub for academic reference, computer research, and digital database inquiries.",
    stats: [
      { label: "Volumes", value: "56,615+" },
      { label: "Titles", value: "22,613+" },
      { label: "Floor Area", value: "4,000 m²" },
      { label: "Capacity", value: "250 Seats" }
    ],
    sections: [
      {
        title: "Ground Floor Layout",
        desc: "Designed for high-traffic access, housing stack areas, book loan counters, and administrative desks.",
        items: [
          "Stack Section: Core textbook volumes systematically arranged by engineering disciplines.",
          "Circulation Desk: Computerized barcode scanners for charging and discharging books.",
          "Book Bank: Dedicated collection containing 3,700+ textbooks supporting SC/ST student needs.",
          "Binding & Conservation: In-house document preservation and journal binding sector.",
          "Informal Reading Hall: Spacious area for quick references between lecture periods."
        ]
      },
      {
        title: "First Floor Layout",
        desc: "Focused on silent reference, digital research, and collaborative study resources.",
        items: [
          "Reference Section: Highly-specialized engineering handbooks, index catalogs, and encyclopedias.",
          "Digital Library: 30+ multimedia workstations with high-speed internet for accessing digital resources.",
          "Language Laboratory: Interactive computer terminals equipped with professional ELT training software.",
          "Audio-Visual Section: Curated collection of DVD tutorials, NPTEL video lessons, and online lectures.",
          "Conference Hall: Air-conditioned space for academic seminars and research board gatherings."
        ]
      }
    ],
    eResources: [
      "ScienceDirect (Elsevier) & SpringerLink",
      "IEEE ASPP Online & McGraw-Hill Access",
      "ASCE & ASME Digital Collections",
      "EBSCO, J-Gate (JET & JSMS)",
      "NPTEL Web and Video Courseware",
      "NDLI (National Digital Library of India)"
    ],
    memberships: [
      "DELNET (Developing Library Network), Delhi",
      "British Council Library (BCL), Chennai",
      "The Institution of Engineers (IEI), Kolkata",
      "IEEE (Institution of Electrical and Electronics Engineers), USA",
      "INDEST-AICTE Consortium"
    ],
    automation: {
      software: "AUTO LIB Integrated Library Management System",
      catalog: "Online Public Access Catalog (OPAC) network terminals",
      system: "Fully bar-coded documents and member ID cards with laser scanners"
    }
  },
  labs: {
    name: "Research & Department Labs",
    intro: "APEC features fully-equipped, modern departmental laboratories that facilitate hands-on experimentation, CAD design simulations, and student research projects.",
    stats: [
      { label: "Total Labs", value: "40+" },
      { label: "Computing Servers", value: "5+ Nodes" },
      { label: "Simulators", value: "Licensed" },
      { label: "Lab Space", value: "Air-Conditioned" }
    ],
    sections: [
      {
        title: "Civil & Mechanical Structures",
        desc: "Heavy-machinery laboratories for testing, manufacturing, and structural analysis.",
        items: [
          "Strength of Materials Lab: Universal Testing Machines (UTM), torsion testers, and hardness rigs.",
          "Fluid Mechanics & Hydraulics: Turbine flow modules, venturimeters, and pump testers.",
          "Civil Soil Mechanics & Survey: Theodolites, total stations, and core cutters.",
          "Mechanical CNC & CAD/CAM: CNC Lathe & Milling cells, CAD modeling workstations with SolidWorks."
        ]
      },
      {
        title: "Electrical, Electronics & Computing",
        desc: "Advanced electronic systems, microprocessor engineering, and digital networks.",
        items: [
          "Power Systems Simulation Lab: ETAP and MATLAB tools for analyzing electrical grids and motor designs.",
          "VLSI & Embedded Systems: Xilinx FPGA kits, microprocessor microcontrollers, and logic analyzers.",
          "Robotics & Electronics: PLC trainer boards, digital signal processors, and high-frequency oscilloscopes.",
          "Central Computing Center: Housed in an air-conditioned hall with high-speed network nodes and central storage servers."
        ]
      }
    ],
    eResources: [
      "AutoCAD & SolidWorks Educational Licenses",
      "MATLAB & ETAP Academic Simulators",
      "Xilinx ISE & Vivado Embedded Design Suite",
      "LabVIEW Instrumentation Control Software",
      "Oracle DB & Java Developer Environments"
    ],
    memberships: [
      "Computer Society of India (CSI)",
      "Institution of Electronics and Telecommunication Engineers (IETE)",
      "Indian Society for Technical Education (ISTE)",
      "IEEE Student Branch"
    ],
    automation: {
      software: "Licensed software deployment control keys",
      catalog: "24/7 server infrastructure for computer center log-ins",
      system: "Optical network connections across department terminals"
    }
  },
  hostels: {
    name: "Hostel Accommodations",
    intro: "Separate, secure, and clean in-campus residential complexes are provided for male and female students. Designed as a 'home away from home' to encourage focus and personal growth.",
    stats: [
      { label: "Student Capacity", value: "800+ Beds" },
      { label: "Hostel Blocks", value: "Separate M/F" },
      { label: "Floors per Block", value: "3 Stories" },
      { label: "Security Guard Rota", value: "24/7 Patrols" }
    ],
    sections: [
      {
        title: "Living Amenities",
        desc: "Comfortable rooms and facilities ensuring clean living conditions for academic focus.",
        items: [
          "Well-ventilated Rooms: Furnished with individual cots, study desks, closets, and study lamps.",
          "Purified Water: In-house RO filtration plant distributing safe drinking water to all blocks.",
          "Power Backup: Heavy-duty diesel generators providing uninterrupted electricity 24/7.",
          "Laundry & Sanitation: Hygiene-focused bathroom systems and laundry wash facilities."
        ]
      },
      {
        title: "Recreation & Dining",
        desc: "Health, nutrition, and personal wellness programs inside the hostel boundaries.",
        items: [
          "Dining Halls: Modern kitchen setup serving nutritious, balanced, vegetarian meals.",
          "Physical Gym: Hydraulic strength training equipment managed by residential instructors.",
          "TV & Multimedia Rooms: Common lounge areas with television networks, projectors, and seating.",
          "Indoor Sports: Table tennis, carrom boards, and chess modules inside reading rooms."
        ]
      }
    ],
    eResources: [
      "High-speed WiFi network inside study blocks",
      "Common room computers for academic inquiries",
      "Digital reference desks linked to APEC central servers"
    ],
    memberships: [
      "Hostel Advisory Committee (HAC)",
      "Anti-Ragging Squad Campus Patrol",
      "Student Mess Audit Council"
    ],
    automation: {
      software: "Biometric attendance scanning systems",
      catalog: "Online hostel portal for room allocations and guest logs",
      system: "CCTV camera networks monitoring corridors and entrances"
    }
  },
  transport: {
    name: "Transport & Bus Routes",
    intro: "APEC operates a dedicated fleet of buses connecting the Melmaruvathur campus to major boarding sectors. This facility ensures safe and punctual travel for both students and faculty members.",
    stats: [
      { label: "Active Routes", value: "8 Routes" },
      { label: "Certified Fleet", value: "100% Fitness Checked" },
      { label: "Punctuality", value: "99% On-time Arrival" },
      { label: "Tracking", value: "GPS Configured" }
    ],
    details: [
      "Full Fleet Safety: Regular fitness certifications for all institutional buses.",
      "Experienced Drivers: Qualified operators with clean driving histories and safety records.",
      "Real-time Tracking: Emergency communication channels and GPS monitors set up on all routes.",
      "Faculty Supervised: Academic mentors accompany students on long-distance routes."
    ]
  }
};

// Complete stops coordinates database (sorted ascending by Route ID)
const busRoutesData = [
  {
    id: "02",
    name: "Esur (Route 02)",
    busNo: "TN19 K9234",
    driver: "Pannerselvam C",
    phone: "9894745125",
    stops: [
      { name: "Esur (ஈசூர்)", time: "07:25 AM", threeMonth: "3750", sixMonth: "7500", coords: [12.4286, 79.7012] },
      { name: "Arasur (அரசூர்)", time: "07:30 AM", threeMonth: "3600", sixMonth: "7200", coords: [12.4312, 79.7412] },
      { name: "Polambakkam (தபாலம்பா ் ம்)", time: "08:25 AM", threeMonth: "2100", sixMonth: "4200", coords: [12.4295, 79.7821] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:30 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "03",
    name: "Chengalpattu (Route 03)",
    busNo: "TN19 K9333",
    driver: "Guru A",
    phone: "7092053189",
    stops: [
      { name: "Chengalpattu (தசங் ல்பட்டு)", time: "07:40 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.6841, 79.9836] },
      { name: "Mamandur (மாமை் டூர்)", time: "07:50 AM", threeMonth: "4250", sixMonth: "8500", coords: [12.6412, 79.9412] },
      { name: "Padalam (படாளம்)", time: "07:55 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.5842, 79.9112] },
      { name: "Melavalam Pettai (வமலேளம் வபட்ணட)", time: "08:00 AM", threeMonth: "3200", sixMonth: "6400", coords: [12.5412, 79.9052] },
      { name: "Karunguzhi (ருங்குழி)", time: "08:05 AM", threeMonth: "3000", sixMonth: "6000", coords: [12.5218, 79.9012] },
      { name: "Madhuranthagam (மதுராந்ெ ம்)", time: "08:10 AM", threeMonth: "2550", sixMonth: "5100", coords: [12.5085, 79.8836] },
      { name: "Pakkam (பா ் ம்)", time: "08:15 AM", threeMonth: "2000", sixMonth: "4000", coords: [12.4682, 79.8512] },
      { name: "Sirunavalur (சிறுநாேலூர்)", time: "08:20 AM", threeMonth: "1800", sixMonth: "3600", coords: [12.4582, 79.8395] },
      { name: "Oonamalai (ஊனமணல)", time: "08:25 AM", threeMonth: "1500", sixMonth: "3000", coords: [12.4495, 79.8312] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:30 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "04",
    name: "Thellar (Route 04)",
    busNo: "TN19 E3690",
    driver: "Ramesh K",
    phone: "9442492892",
    stops: [
      { name: "Thellar (தெள்ளார்)", time: "07:10 AM", threeMonth: "5500", sixMonth: "11000", coords: [12.4014, 79.5519] },
      { name: "Kodityalam (கோடியாலம்)", time: "07:15 AM", threeMonth: "5500", sixMonth: "11000", coords: [12.3940, 79.5700] },
      { name: "Theyyar (தெய்யார்)", time: "07:20 AM", threeMonth: "5500", sixMonth: "11000", coords: [12.3944, 79.5929] },
      { name: "Nallur (நல்லூர்)", time: "07:30 AM", threeMonth: "5000", sixMonth: "10000", coords: [12.4103, 79.6165] },
      { name: "Eramalur (ஏமலூர்)", time: "07:35 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.4130, 79.6380] },
      { name: "Padur (பாதூர்)", time: "07:40 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.4150, 79.6580] },
      { name: "Veppankarunai (வேப்பங்குருணை)", time: "07:50 AM", threeMonth: "4250", sixMonth: "8500", coords: [12.4050, 79.6750] },
      { name: "Ettipattu (எட்டிப்பட்டு)", time: "07:55 AM", threeMonth: "4250", sixMonth: "8500", coords: [12.3950, 79.6850] },
      { name: "Orathi (ஒரெ்தி)", time: "08:00 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.3806, 79.6950] },
      { name: "Porankal (தபாறங் கல்)", time: "08:05 AM", threeMonth: "3750", sixMonth: "7500", coords: [12.3780, 79.7220] },
      { name: "Attivakkam (அெ்திோ ் ம்)", time: "08:10 AM", threeMonth: "3750", sixMonth: "7500", coords: [12.3720, 79.7480] },
      { name: "Minnalchitthamur (மின்னல்சிெ்ெமூர்)", time: "08:15 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.3670, 79.7710] },
      { name: "Thozhpedu (தொழுவபடு)", time: "08:20 AM", threeMonth: "2550", sixMonth: "5100", coords: [12.3614, 79.7909] },
      { name: "Arapedu (அறவபடு)", time: "08:25 AM", threeMonth: "2550", sixMonth: "5100", coords: [12.3820, 79.8050] },
      { name: "Acharappakkam (அச்சரப்பா ் ம்)", time: "08:30 AM", threeMonth: "1800", sixMonth: "3600", coords: [12.4077, 79.8172] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:35 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "05",
    name: "Tindivanam (Route 05)",
    busNo: "TN19 Z 3609",
    driver: "Lakshmanan C",
    phone: "9626460927",
    stops: [
      { name: "Tindivanam Mailam Road (மர ் ாைம் சாணல)", time: "07:15 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2262, 79.6515] },
      { name: "Jayapuram (தஜயபுரம்)", time: "07:20 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2382, 79.6592] },
      { name: "Women’s Police Station (ம ளிர் காவல்)", time: "07:30 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2452, 79.6632] },
      { name: "Taluk Office (ொலுக்கா)", time: "07:35 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2512, 79.6692] },
      { name: "Gingee Bus Stop (தசஞ்சி)", time: "07:30 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2582, 79.6721] },
      { name: "Santhaimedu (சந்ணெவமடு)", time: "07:35 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2812, 79.6912] },
      { name: "Pattanam (பட்டைம்)", time: "07:40 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.2982, 79.7112] },
      { name: "College Road (ல்லூரி சாணல)", time: "07:50 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.3082, 79.7192] },
      { name: "Saram (சாரம்)", time: "08:00 AM", threeMonth: "4200", sixMonth: "8400", coords: [12.3112, 79.7212] },
      { name: "Olakkur (ஒல ்கூர்)", time: "08:05 AM", threeMonth: "4200", sixMonth: "8400", coords: [12.3612, 79.7612] },
      { name: "Padhiri (பாதிரி)", time: "08:10 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.3782, 79.7892] },
      { name: "Ongur (ஓங்கூர்)", time: "08:12 AM", threeMonth: "3750", sixMonth: "7500", coords: [12.3912, 79.8012] },
      { name: "Toll Gate (வடால் வ ட்டு)", time: "08:15 AM", threeMonth: "3300", sixMonth: "6600", coords: [12.4082, 79.8092] },
      { name: "Thozhpeadu (தொழுவபடு)", time: "08:20 AM", threeMonth: "2550", sixMonth: "5100", coords: [12.4212, 79.8132] },
      { name: "Arappeadu (அரப்வபடு)", time: "08:25 AM", threeMonth: "2550", sixMonth: "5100", coords: [12.4282, 79.8182] },
      { name: "Acharapakkam (அச்சரப்பா ் ம்)", time: "08:30 AM", threeMonth: "1800", sixMonth: "3600", coords: [12.4312, 79.8195] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:35 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "06",
    name: "Uthiramerur (Route 06)",
    busNo: "TN19 T7722 SML",
    driver: "Kumar V",
    phone: "9790034195",
    stops: [
      { name: "Uthramerrur (உெ்திரவமரூர்)", time: "07:40 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.6146, 79.7042] },
      { name: "Kavanoor (ாேனூர்)", time: "07:45 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5712, 79.7212] },
      { name: "Kammalampoondi (ம்மாளம்பூை் டி)", time: "07:50 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5582, 79.7312] },
      { name: "Pazhathottam (பழெ்வொட்டம்)", time: "07:50 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5112, 79.7512] },
      { name: "Theettalam kootroad (தீட்டாளம் கூட்வராடு)", time: "07:55 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.5012, 79.7612] },
      { name: "Elendathur (எலந்ெெ்தூர்)", time: "08:00 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.4912, 79.7682] },
      { name: "Kiliyanoor (கிளியனூர்)", time: "08:05 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.4852, 79.7732] },
      { name: "Pasunkarunai (பசுங் ருணை)", time: "08:10 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.4812, 79.7782] },
      { name: "Madhur (மாதுர்)", time: "08:15 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.4782, 79.7821] },
      { name: "Kizhammur (கிழாமூர்)", time: "08:20 AM", threeMonth: "3000", sixMonth: "6000", coords: [12.4612, 79.7992] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:30 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "09",
    name: "Vandavasi (Route 09)",
    busNo: "TN19 Z9459",
    driver: "Mujip Basha A",
    phone: "8489797864",
    stops: [
      { name: "Vandavasi old Bus stand (வந்ைவோசி)", time: "07:50 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5029, 79.6025] },
      { name: "Vandavasi gov Hospital", time: "07:55 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5012, 79.6102] },
      { name: "Birthur (பிர்தூர்)", time: "08:00 AM", threeMonth: "4350", sixMonth: "8700", coords: [12.4912, 79.6812] },
      { name: "Kadaisikulam (ேரடசிகυளம்)", time: "08:05 AM", threeMonth: "4250", sixMonth: "8500", coords: [12.4952, 79.7012] },
      { name: "Maruthadu (மருைோடு)", time: "08:10 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.5012, 79.7212] },
      { name: "Kilkodungalore (கீழ்கேோடுங்ேோலூர்)", time: "08:15 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.5082, 79.7412] },
      { name: "Salavedu (சோலரவடு)", time: "08:20 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.5112, 79.7612] },
      { name: "Keezhseesamangalam (கீழ்சீசமங்ேலம்)", time: "08:25 AM", threeMonth: "3250", sixMonth: "6500", coords: [12.4912, 79.7812] },
      { name: "Ramapuram (ரோமோபுரம்)", time: "08:30 AM", threeMonth: "2250", sixMonth: "4500", coords: [12.4612, 79.8012] },
      { name: "Melmaruvathur (ரமல்மருவை்தூர்)", time: "08:35 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "10",
    name: "Cheyyar (Route 10)", // Corrected spelling
    busNo: "TN19 BS 0405",
    driver: "Ramesh M",
    phone: "63741785797",
    stops: [
      { name: "Arni Koot Road (ஆரணி கூட்டு ரரோடு)", time: "07:15 AM", threeMonth: "6500", sixMonth: "13000", coords: [12.6592, 79.5422] },
      { name: "Toll Gate (ரடோல் ரேட்)", time: "07:18 AM", threeMonth: "6500", sixMonth: "13000", coords: [12.6482, 79.5492] },
      { name: "Anakkavur (அனே்ேோவூர்)", time: "07:20 AM", threeMonth: "6250", sixMonth: "12500", coords: [12.6074, 79.5996] },
      { name: "Sugar Mill (சர்ே்ேரர ஆரல)", time: "07:25 AM", threeMonth: "6250", sixMonth: "12500", coords: [12.5842, 79.5852] },
      { name: "Vinayagapuram (விநோயேபுரம்)", time: "07:25 AM", threeMonth: "6250", sixMonth: "12500", coords: [12.5582, 79.5992] },
      { name: "Kolamandhai (கேோளமந்ரை)", time: "07:30 AM", threeMonth: "6200", sixMonth: "12400", coords: [12.5312, 79.6012] },
      { name: "Purisai (புரிரச)", time: "07:35 AM", threeMonth: "6100", sixMonth: "12200", coords: [12.5212, 79.6032] },
      { name: "Echur (எச்சூர்)", time: "07:40 AM", threeMonth: "6000", sixMonth: "12000", coords: [12.5122, 79.6042] },
      { name: "Ammayapattu (அம்ரமயப்பட்டு)", time: "07:45 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5062, 79.6032] },
      { name: "Vandavasi (வந்ைவோசி)", time: "07:50 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.5029, 79.6025] },
      { name: "Kadaisikulam (ேரடசிகுளம்)", time: "07:55 AM", threeMonth: "4250", sixMonth: "8500", coords: [12.4952, 79.7012] },
      { name: "Maruthadu (மருைோடு)", time: "08:00 AM", threeMonth: "4000", sixMonth: "8000", coords: [12.5012, 79.7212] },
      { name: "Kilkodungalore (கீழ்கேோடுங்ேோலூர்)", time: "08:05 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.5082, 79.7412] },
      { name: "Salavedu (சோலரவடு)", time: "08:10 AM", threeMonth: "3500", sixMonth: "7000", coords: [12.5112, 79.7612] },
      { name: "Keezhseesamangalam (கீழ்சீசமங்ேலம்)", time: "08:15 AM", threeMonth: "3250", sixMonth: "6500", coords: [12.4912, 79.7812] },
      { name: "Ramapuram (ரோமோபுரம்)", time: "08:20 AM", threeMonth: "2250", sixMonth: "4500", coords: [12.4612, 79.8012] },
      { name: "Melmaruvathur (ரமல்மருவை்தூர்)", time: "08:30 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  },
  {
    id: "11",
    name: "Marakkanam (Route 11)",
    busNo: "TN19 BS 0909",
    driver: "Kanniyappan E",
    phone: "9894868521",
    stops: [
      { name: "Murukkeri (முரு ்வ ரி)", time: "07:00 AM", threeMonth: "9000", sixMonth: "18000", coords: [12.1812, 79.8112] },
      { name: "Kanthadu (ந்ொடு)", time: "07:10 AM", threeMonth: "8750", sixMonth: "17500", coords: [12.1882, 79.8812] },
      { name: "Marakkanam (மர ் ாைம்)", time: "07:15 AM", threeMonth: "8500", sixMonth: "17000", coords: [12.1921, 79.9419] },
      { name: "Vennangupattu (தேை் ைங்குபட்டு)", time: "07:30 AM", threeMonth: "4800", sixMonth: "9600", coords: [12.2812, 79.9612] },
      { name: "Kadapakkam (டப்பா ் ம்)", time: "07:40 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.3312, 79.9212] },
      { name: "Panaiyur (பணனயூர்)", time: "07:45 AM", threeMonth: "4500", sixMonth: "9000", coords: [12.3512, 79.9112] },
      { name: "Ellaiyaamman Kovil (எல்ணலயம்மன்)", time: "07:50 AM", threeMonth: "4330", sixMonth: "8660", coords: [12.3812, 79.8992] },
      { name: "Cheyyur (தசய்யூர்)", time: "08:00 AM", threeMonth: "4050", sixMonth: "8100", coords: [12.4112, 79.8912] },
      { name: "Oonambakkam (ஊனம்பா ் ம்)", time: "08:10 AM", threeMonth: "3300", sixMonth: "6600", coords: [12.4212, 79.8821] },
      { name: "Kattudevathur (ாட்டுவெேெ்தூர்)", time: "08:15 AM", threeMonth: "3000", sixMonth: "6000", coords: [12.4312, 79.8612] },
      { name: "Chithamur (சிெ்ெaமூர்)", time: "08:20 AM", threeMonth: "2100", sixMonth: "4200", coords: [12.4382, 79.8492] },
      { name: "Polambakkam (தபாலம்பா ் ம்)", time: "08:25 AM", threeMonth: "2100", sixMonth: "4200", coords: [12.4485, 79.8821] },
      { name: "Melmaruvathur (வமல்மருேெ்தூர்)", time: "08:30 AM", threeMonth: "-", sixMonth: "-", coords: [12.4418, 79.8242] }
    ]
  }
];

export default function FacilityDetail() {
  const { id } = useParams();
  const facility = facilityData[id] || facilityData.library;
  const isTransport = id === 'transport';

  // Selected Route index: null shows ALL routes on the map
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(null);
  const [hoveredStopCoords, setHoveredStopCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const leafletMapInstanceRef = useRef(null);
  const hoverMarkerRef = useRef(null);
  const [osrmPaths, setOsrmPaths] = useState({});

  useEffect(() => {
    if (!isTransport) return;

    const container = document.getElementById('leaflet-transport-map');
    if (!container) return;

    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.remove();
      leafletMapInstanceRef.current = null;
    }

    const map = L.map('leaflet-transport-map').setView([12.4418, 79.8242], 10);
    leafletMapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Setup college campus marker icon using college logo PNG
    const collegeIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center cursor-pointer animate-[pulse_2.5s_infinite]">
          <div class="w-10 h-10 rounded-full bg-white border-2 border-gray-950 shadow-2xl flex items-center justify-center p-1 hover:scale-110 transition-transform">
            <img src="/apec-logo.png" alt="APEC Logo" class="w-full h-full object-contain mix-blend-multiply" />
          </div>
        </div>
      `,
      className: 'college-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    L.marker([12.4418, 79.8242], { icon: collegeIcon }).addTo(map).bindPopup("<b>APEC Campus</b><br>Melmaruvathur");

    const allLatLngs = [];

    // Helper to fetch and draw OSRM routing dynamically with exact intermediate stops
    const drawRoute = async (route, idx) => {
      const isRouteActive = selectedRouteIdx === null || selectedRouteIdx === idx;
      const isRouteHighlighted = selectedRouteIdx === idx;

      if (!isRouteActive) return;

      let roadCoords = osrmPaths[route.id];

      // Fetch from OSRM using all intermediate stop coordinates in order
      if (!roadCoords) {
        const stopCoords = route.stops.map(s => s.coords);
        const coordString = stopCoords.map(c => `${c[1]},${c[0]}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const roadCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            const snappedCoords = data.waypoints.map(w => [w.location[1], w.location[0]]);
            setOsrmPaths(prev => ({ 
              ...prev, 
              [route.id]: {
                geometry: roadCoords,
                snapped: snappedCoords
              }
            }));
          }
        } catch (e) {
          console.error("OSRM Route Fetch Error:", e);
        }
      }

      const routePathData = osrmPaths[route.id];
      let finalCoords, snappedStops;

      if (routePathData) {
        if (routePathData.geometry) {
          finalCoords = routePathData.geometry;
          snappedStops = routePathData.snapped;
        } else {
          finalCoords = routePathData;
          snappedStops = null;
        }
      } else {
        finalCoords = route.stops.map(s => s.coords);
        snappedStops = null;
      }

      // Render all route lines as blue. Use a bold, thick, dark blue line when highlighted.
      const polyline = L.polyline(finalCoords, {
        color: isRouteHighlighted 
          ? '#1d4ed8' 
          : (selectedRouteIdx === null ? '#2563eb' : '#9ca3af'),
        weight: isRouteHighlighted ? 6 : (selectedRouteIdx === null ? 3.5 : 1.5),
        opacity: isRouteActive ? (isRouteHighlighted ? 1.0 : 0.6) : 0.1,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polyline.on('click', () => {
        setSelectedRouteIdx(idx);
      });

      // Render a custom premium bus icon showing Route ID badge and PNG bus image with shadow & bounce animation
      const busIcon = L.divIcon({
        html: `
          <div class="flex flex-col items-center select-none cursor-pointer group">
            <div class="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-white shadow-md leading-none mb-1 group-hover:scale-105 transition-transform">
              ${route.id}
            </div>
            <div class="w-9 h-9 rounded-full bg-white border-2 border-blue-600 shadow-xl flex items-center justify-center p-1.5 hover:scale-110 transition-transform animate-[bounce_2s_infinite]">
              <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" alt="Bus PNG" class="w-full h-full object-contain" />
            </div>
          </div>
        `,
        className: 'custom-bus-marker-icon',
        iconSize: [40, 52],
        iconAnchor: [20, 52]
      });

      // Use snapped start point if available to align with routing path
      const startCoords = (snappedStops && snappedStops[0]) ? snappedStops[0] : route.stops[0].coords;
      const busMarker = L.marker(startCoords, { icon: busIcon }).addTo(map);
      busMarker.bindPopup(`<b>${route.name}</b><br>Active trajectory to APEC`);
      busMarker.on('click', () => {
        setSelectedRouteIdx(idx);
      });

      // Draw custom circle markers for ALL stops of the highlighted route snapped EXACTLY to OSRM road geometry
      if (isRouteHighlighted) {
        route.stops.forEach((stop, sIdx) => {
          const isStart = sIdx === 0;
          const isEnd = sIdx === route.stops.length - 1;
          const nextStop = route.stops[sIdx + 1];
          const nextStopText = nextStop ? `${nextStop.name} (${nextStop.time})` : "Melmaruvathur (APEC)";

          // Use snapped coordinates from OSRM to ensure stop point is exactly on the polyline path
          const stopCoords = (snappedStops && snappedStops[sIdx]) ? snappedStops[sIdx] : stop.coords;

          const stopMarker = L.circleMarker(stopCoords, {
            radius: isStart || isEnd ? 6.5 : 4.5,
            fillColor: isStart ? '#10b981' : (isEnd ? '#ef4444' : '#2563eb'),
            color: '#ffffff',
            weight: 2,
            fillOpacity: 1.0
          }).addTo(map);

          // Interactive tooltips on hover for fast scanning
          stopMarker.bindTooltip(`<div class="font-bold text-[11px] text-gray-800 leading-tight">${stop.name}</div><div class="text-[9px] text-gray-400 font-extrabold mt-0.5">${stop.time}</div>`, {
            permanent: false,
            direction: 'top',
            offset: [0, -5],
            className: 'custom-stop-tooltip font-sans border-0 shadow-lg px-2.5 py-1.5 rounded-lg bg-white/95 text-gray-800'
          });

          stopMarker.bindPopup(`
            <div class="p-2 text-xs font-semibold text-gray-800 space-y-1.5 min-w-[165px]">
              <div class="text-[10px] uppercase font-bold ${isStart ? 'text-green-600' : (isEnd ? 'text-red-600' : 'text-blue-600')} tracking-wider">
                ${isStart ? "Starting Point" : (isEnd ? "Destination" : `Stop ${sIdx}`)}
              </div>
              <div class="text-gray-900 font-bold text-[13px] leading-tight">${stop.name}</div>
              <div class="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded w-max">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline-block align-middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="align-middle">${stop.time}</span>
              </div>
              ${!isEnd ? `
                <div class="text-[10px] text-gray-400 font-medium">
                  Next Stop: <span class="text-gray-700 font-bold">${nextStopText}</span>
                </div>
              ` : ''}
              <div class="text-[9px] text-gray-400 border-t border-gray-100 pt-1 mt-1 font-medium">
                Way to APEC Campus (Route ${route.id})
              </div>
            </div>
          `);
        });
      }

      // Collect active coordinates to adjust bounds
      finalCoords.forEach(coord => allLatLngs.push(coord));

      // Fit zoom bounds dynamically
      if (selectedRouteIdx !== null && isRouteHighlighted) {
        map.fitBounds(polyline.getBounds(), { padding: [55, 55] });
      } else if (selectedRouteIdx === null && idx === busRoutesData.length - 1 && allLatLngs.length > 0) {
        map.fitBounds(L.polyline(allLatLngs).getBounds(), { padding: [40, 40] });
      }
    };

    busRoutesData.forEach((route, idx) => {
      drawRoute(route, idx);
    });

    return () => {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, [selectedRouteIdx, isTransport, osrmPaths]);

  // Effect to display pulsing ring and pan map to stop when hovered in panel
  useEffect(() => {
    if (!isTransport || !leafletMapInstanceRef.current) return;
    const map = leafletMapInstanceRef.current;

    if (hoverMarkerRef.current) {
      hoverMarkerRef.current.remove();
      hoverMarkerRef.current = null;
    }

    if (hoveredStopCoords) {
      const pulseIcon = L.divIcon({
        html: `
          <div class="relative w-8 h-8 flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 border border-blue-500 animate-ping"></div>
            <div class="absolute w-3 h-3 rounded-full bg-blue-600 border border-white shadow-md"></div>
          </div>
        `,
        className: 'hover-pulse-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      hoverMarkerRef.current = L.marker(hoveredStopCoords, { icon: pulseIcon }).addTo(map);
      map.panTo(hoveredStopCoords, { animate: true, duration: 0.5 });
    }
  }, [hoveredStopCoords, isTransport]);

  // Search results calculation
  const searchResults = searchQuery.trim() === '' ? [] : busRoutesData.flatMap((route, rIdx) => 
    route.stops.map((stop, sIdx) => ({
      ...stop,
      routeId: route.id,
      routeName: route.name,
      routeIdx: rIdx,
      stopIdx: sIdx
    })).filter(stop => 
      stop.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-left">
        
        {/* Back Link */}
        <Link to="/facilities" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Facilities
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400 mb-2 block">Campus Infrastructure</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">{facility.name}</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{facility.intro}</p>
        </div>

        {/* Dynamic Transport Routing & Timings Grid */}
        {isTransport ? (
          <div className="space-y-16 animate-[fadeIn_0.3s_ease-out]">
            
            {/* Bus Route Console Section (Top of Page) */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bus className="w-5 h-5 text-gray-900" />
                APEC Interactive Transit Console
              </h3>

              {/* Search Bar for Boarding Stops */}
              <div className="relative mb-6 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search for your boarding point (e.g. Theyyar, Orathi, Mamandur)..."
                  className="w-full text-xs px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:shadow-md transition-all font-semibold"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-150 shadow-xl rounded-xl mt-2 z-50 max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedRouteIdx(result.routeIdx);
                          setHoveredStopCoords(result.coords);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <div>
                          <span className="font-bold text-gray-800">{result.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Route {result.routeId} • {result.time}</span>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">View Route</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selector Bar */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setSelectedRouteIdx(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedRouteIdx === null 
                      ? 'bg-gray-950 border-gray-950 text-white shadow-md' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  Show All Routes
                </button>
                {busRoutesData.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRouteIdx === idx 
                        ? 'bg-gray-950 border-gray-950 text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                  >
                    Route {route.id} ({route.name.split(' ')[0]})
                  </button>
                ))}
              </div>

              {/* Console Body: OpenStreetMap Canvas & Timelines */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
                
                {/* Real OpenStreetMap Container (Left) */}
                <div className="lg:col-span-6 border border-gray-200 rounded-3xl overflow-hidden min-h-[400px] relative">
                  <div id="leaflet-transport-map" className="w-full h-full min-h-[400px] z-10" />
                  
                  <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-200 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-800 shadow-sm z-20 pointer-events-none flex items-center gap-1.5">
                    <MapIcon className="w-3.5 h-3.5 text-gray-900" /> OpenStreetMap Interactive API
                  </div>
                </div>

                {/* Selected Route Info Panels (Right) */}
                <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                  <AnimatePresence mode="wait">
                    {selectedRouteIdx !== null ? (
                      <motion.div 
                        key={selectedRouteIdx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="space-y-6 text-left grow flex flex-col justify-between animate-[fadeIn_0.2s_ease-out]"
                      >
                        <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Bus Identifier</span>
                            <h4 className="text-base font-black text-gray-900 mt-0.5">{busRoutesData[selectedRouteIdx].name}</h4>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Bus Reg. No</span>
                            <span className="block text-xs font-bold text-gray-800 font-mono mt-0.5">{busRoutesData[selectedRouteIdx].busNo}</span>
                          </div>
                        </div>

                      {/* Boarding stops list */}
                      <div className="p-6 border border-gray-150 rounded-2xl grow overflow-y-auto max-h-[300px] bg-white">
                        <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest block mb-4">Interactive Stop Schedule</span>
                        <div className="relative border-l border-gray-100 pl-4 space-y-2">
                          {busRoutesData[selectedRouteIdx].stops.map((stop, sIdx) => {
                            const isStart = sIdx === 0;
                            const isEnd = sIdx === busRoutesData[selectedRouteIdx].stops.length - 1;
                            return (
                              <div 
                                key={sIdx} 
                                onMouseEnter={() => setHoveredStopCoords(stop.coords)}
                                onMouseLeave={() => setHoveredStopCoords(null)}
                                className="group relative pl-2 py-2 rounded-xl hover:bg-gray-50/70 transition-all cursor-pointer flex justify-between items-center gap-4"
                              >
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white transition-all group-hover:scale-125 ${
                                  isStart 
                                    ? 'bg-green-500 group-hover:bg-green-600' 
                                    : (isEnd ? 'bg-red-500 group-hover:bg-red-600' : 'bg-gray-300 group-hover:bg-blue-600')
                                }`} />
                                
                                <div className="text-left">
                                  <h5 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                                    {stop.name}
                                  </h5>
                                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mt-0.5">
                                    {isStart ? "Start Point" : (isEnd ? "Destination" : `Stop ${sIdx}`)} • {stop.time}
                                  </span>
                                </div>

                                {stop.threeMonth !== '-' ? (
                                  <div className="text-right shrink-0">
                                    <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Fees (3M/6M)</span>
                                    <span className="text-[10px] font-black text-gray-700 font-mono">₹{stop.threeMonth} / ₹{stop.sixMonth}</span>
                                  </div>
                                ) : (
                                  <span className="text-[8px] text-gray-400 font-extrabold uppercase bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-full">College</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                        {/* Driver Contact */}
                        <div className="p-6 bg-gray-50 border border-gray-150 rounded-2xl text-left">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Driver Contact Desk</span>
                          <h4 className="text-base font-bold text-gray-900 mt-1">{busRoutesData[selectedRouteIdx].driver}</h4>
                          <div className="flex gap-4 text-xs font-bold text-gray-700 mt-4">
                            <a href={`tel:${busRoutesData[selectedRouteIdx].phone}`} className="inline-flex items-center gap-1.5 hover:text-gray-900">
                              <Phone className="w-4 h-4 text-gray-500" /> {busRoutesData[selectedRouteIdx].phone}
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center grow"
                      >
                        <Bus className="w-12 h-12 text-gray-300 mb-4 animate-bounce" />
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Interactive Boarding Console</h4>
                        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                          Click on any route tab above, select an active polyline path, or click a custom bus marker directly on the OpenStreetMap to view specific stops, driver details, and fee structures.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

            {/* General Infrastructure & Safety Information at the BOTTOM of page */}
            <div className="border-t border-gray-100 pt-16">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-gray-900" />
                APEC Logistics & Safety Policies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facility.details.map((detail, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 border border-gray-150 rounded-xl flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 shrink-0" />
                    <span className="text-xs font-semibold text-gray-700 leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* High-Fidelity Custom Facility Dashboard for Library, Labs, and Hostels */
          <div className="space-y-12 animate-[fadeIn_0.3s_ease-out] text-left">
            
            {/* Stats Dashboard Grid */}
            {facility.stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {facility.stats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="p-6 bg-gray-50/50 border border-gray-200 rounded-2xl hover:border-indigo-500 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <span className="block text-[10px] font-black uppercase text-gray-450 tracking-wider mb-1 leading-none">{stat.label}</span>
                    <span className="text-xl md:text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Split Grid Layout: Left (Main Content/Sections), Right (Sidebar/Resources) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Content Area (Left 8 Columns) */}
              <div className="lg:col-span-8 space-y-8">
                {facility.sections && facility.sections.map((sec, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="p-6 md:p-8 bg-gray-50/40 border border-gray-150 rounded-3xl text-left hover:border-indigo-500/20 hover:bg-white transition-all duration-300 shadow-sm"
                  >
                    <div className="mb-6">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-2">
                        Section 0{idx + 1}
                      </span>
                      <h3 className="text-lg font-black text-gray-900">{sec.title}</h3>
                      <p className="text-xs text-gray-400 font-semibold mt-1">{sec.desc}</p>
                    </div>

                    <div className="space-y-3.5">
                      {sec.items.map((item, iIdx) => {
                        const [title, desc] = item.split(': ');
                        return (
                          <div key={iIdx} className="flex items-start gap-3.5 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-indigo-500/20 transition-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-gray-800 leading-snug">{title}</span>
                              {desc && <span className="block text-[11px] text-gray-500 mt-0.5 leading-relaxed font-semibold">{desc}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {/* Automation & Software Systems Block */}
                {facility.automation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-6 md:p-8 bg-slate-950 text-white rounded-3xl text-left relative overflow-hidden shadow-xl"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="mb-6 relative z-10">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-pink-400 block mb-1">Infrastructure Control</span>
                      <h4 className="text-base font-black">Digital Systems & Automation</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Management Software</span>
                        <span className="text-[11px] font-bold text-white leading-tight block">{facility.automation.software}</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Search Catalog</span>
                        <span className="text-[11px] font-bold text-white leading-tight block">{facility.automation.catalog}</span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Access Mechanism</span>
                        <span className="text-[11px] font-bold text-white leading-tight block">{facility.automation.system}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar Resources (Right 4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* E-Resources Card */}
                {facility.eResources && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="p-6 bg-gray-50 border border-gray-150 rounded-2xl text-left"
                  >
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 block mb-4 border-b border-gray-200/60 pb-2">
                      Online E-Resources
                    </span>
                    <div className="space-y-2">
                      {facility.eResources.map((res, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2.5 p-2 bg-white border border-gray-100 rounded-xl hover:border-indigo-500/20 transition-all">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className="text-xs font-bold text-gray-700 truncate">{res}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Institutional Memberships Card */}
                {facility.memberships && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="p-6 bg-gray-50 border border-gray-150 rounded-2xl text-left"
                  >
                    <span className="text-[10px] uppercase font-black tracking-widest text-pink-500 block mb-4 border-b border-gray-200/60 pb-2">
                      Institutional Memberships
                    </span>
                    <div className="space-y-2">
                      {facility.memberships.map((mem, mIdx) => (
                        <div key={mIdx} className="flex items-start gap-2.5 p-2.5 bg-white border border-gray-100 rounded-xl hover:border-pink-500/20 transition-all">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5 animate-pulse" />
                          <span className="text-xs font-semibold text-gray-600 leading-snug">{mem}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
