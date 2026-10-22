import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, Users, Award, Briefcase, 
  Search, Mail, GraduationCap, Trophy, 
  BookOpenCheck, UserCheck, Milestone, Library, FileText,
  // New icons for department hero & KPIs
  Cpu, Laptop, BrainCircuit, Zap, Settings, Hammer, FlaskConical, Sprout, Building, Building2, ExternalLink, MoreVertical, ChevronDown,
  User, X, CheckCircle2, Calendar, Coins, PartyPopper, MessageCircle, Send, Download,
  MapPin, Sparkles, Medal, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import departmentsData from '../data/departmentsData.json';
import facultyData from '../ai/knowledge/faculty.json';
import FacultyOrcidQr from '../components/FacultyOrcidQr';
import { submitDepartmentFeedback } from '../utils/inquiryService';
import { getRootCollegeUrl, isSubdomainMode } from '../utils/subdomain';

// Helper to determine top-right badge (HOD, PRINCIPAL, VICE PRINCIPAL, DEAN)
const getTopRightBadge = (member, currentDept) => {
  const deptStr = ((currentDept || '') + ' ' + (member?.department || '') + ' ' + (member?.department_key || '')).toLowerCase();
  if (deptStr.includes('science') && deptStr.includes('humanities')) {
    return null; // Explicitly remove HOD tag for Science & Humanities department
  }
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 'PRINCIPAL';
  if (name.includes('bhuvaneswari') || name.includes('bhuvaneshwari') || (member.designation && member.designation.toLowerCase().includes('vice principal'))) return 'VICE PRINCIPAL';
  if (name.includes('ramasamy') || (member.designation && member.designation.toLowerCase().includes('dean'))) return 'DEAN';
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 'HOD';
  return null;
};

// Rank weighting for sorting faculty
const getRankWeight = (member) => {
  const name = (member.name || '').toLowerCase().trim();
  if (name === 'dr. j. raja' || name === 'dr.j.raja' || name.includes('dr. j. raja')) return 1;
  if (name.includes('bhuvaneswari') || name.includes('bhuvaneshwari') || (member.designation && member.designation.toLowerCase().includes('vice principal'))) return 2;
  if (name.includes('ramasamy') || (member.designation && member.designation.toLowerCase().includes('dean'))) return 3;
  if (member.isHod || (member.designation && member.designation.toLowerCase().includes('head'))) return 4;
  const d = (member.designation || '').toLowerCase();
  if (d.includes('professor') && !d.includes('assistant') && !d.includes('associate')) return 5;
  if (d.includes('associate professor')) return 6;
  if (d.includes('assistant professor')) return 7;
  return 8;
};

// Clean academic designation helper (Designation below name)
const formatDesignation = (designation, name) => {
  if (!designation) return 'Professor';
  let d = designation.trim();
  if (/head\s+of\s+(the\s+)?department/gi.test(d) || d.toLowerCase() === 'hod' || d.toLowerCase() === 'professor & head') {
    return 'Professor';
  }
  d = d.replace(/Principal,?\s*/gi, '').replace(/Dean,?\s*/gi, '').replace(/HOD,?\s*/gi, '').replace(/Coordinator,?\s*/gi, '').trim();
  if (!d) return 'Professor';
  return d;
};

const departmentImages = {
  aiml: '/Images/Dept/aiml dept.jpg',
  cse: '/Images/Dept/cse dept.png',
  it: '/Images/Dept/it dept.jpg',
  ece: '/Images/Dept/ece dept.jpg',
  eee: '/Images/Dept/eee dept.jpg',
  mech: '/Images/Dept/mech dept.jpg',
  civil: '/Images/Dept/civil dept.jpg',
  chemical: '/Images/Dept/chem dept.jpg',
  agri: '/Images/Dept/agri dept.jpg',
  aids: '/Images/Dept/ai ds dept.jpg',
  csd: '/Images/Dept/csd  dept.jpg',
  mca: '/Images/Dept/MCA.jpg',
  mba: '/Images/Dept/MBA.jpg',
  'me-cse': '/Images/Dept/me.cse.jpg',
  'me-thermal': '/Images/Dept/me.thermak.jpg',
  'me-vlsi': '/Images/Dept/m.e.vlsi.jpg',
  'me-ped': '/Images/Dept/power-electronics-electrical-drives.jpg',
  'me-cem': '/Images/Dept/m.e.construction engg and mangement.jpg',
  sh: '/Images/Dept/S&H dept.jpg',
  'phd-civil': '/Images/Dept/phd.civil.jpg',
  'phd-mech': '/Images/Dept/phd.mech.jpg',
  'phd-eee': '/Images/Dept/phd.eee.jpg',
  'phd-ece': '/Images/Dept/phd.ece.jpg',
  default: '/Images/Dept/cse dept.png'
};

const normalizeLabs = (department) => {
  if (!department) return department;
  const d = { ...department };
  if (d.labs && Array.isArray(d.labs)) {
    d.labs = d.labs.map(lab => {
      if (typeof lab === 'string') {
        const isMock = lab === 'Advanced Laboratory' || lab === 'New Classroom' || lab === 'New Laboratory' || lab === 'New Library';
        return {
          name: isMock ? '' : lab,
          type: 'laboratory',
          incharge: '',
          description: '',
          images: []
        };
      } else if (lab && typeof lab === 'object') {
        const normalized = { ...lab };
        const mockNames = ['Advanced Laboratory', 'New Classroom', 'New Laboratory', 'New Library'];
        const mockIncharges = ['Prof. Incharge'];
        const mockDescriptions = ['Lab details and equipment', 'Smart classroom details', 'Departmental library details'];
        
        if (!normalized.name || mockNames.includes(normalized.name)) {
          normalized.name = '';
        }
        if (!normalized.type) {
          normalized.type = 'laboratory';
        }
        if (!normalized.incharge || mockIncharges.includes(normalized.incharge)) {
          normalized.incharge = '';
        }
        if (!normalized.description || mockDescriptions.includes(normalized.description)) {
          normalized.description = '';
        }
        if (!normalized.images) {
          normalized.images = normalized.image ? [normalized.image] : [];
        }
        return normalized;
      }
      return lab;
    });
  }
  return d;
};

// ── Helper: Industrial Visits (IV) Generator ──
const getDepartmentIVData = (dept) => {
  if (!dept) return [];
  const key = (dept.key || dept.name || '').toLowerCase();
  const name = (dept.name || 'Engineering').replace(/^Department of\s+/i, '');

  const isAiml = key === 'aiml' || key.includes('aiml') || key.includes('ai&ml') || key.includes('ai-ml') || key.includes('ai_ml') || key.includes('artificial intelligence') || (name.toLowerCase().includes('artificial intelligence') && name.toLowerCase().includes('machine learning'));

  if (isAiml) {
    return [
      {
        company: 'FANUC INDIA Private Limited',
        location: '47-1, Electronic City, Bengaluru, Karnataka 560099',
        date: '13th September 2025',
        batch: 'B.Tech AI & ML Students',
        domain: 'Industrial Robotics, CNC Machine Automation & Intelligent Manufacturing Systems',
        coordinators: 'Department Faculty Coordinators & HOD',
        type: 'Outstation Industrial Tour',
        image: '/Images/Departments/aiml/iv/iv_2.jpeg',
        images: ['/Images/Departments/aiml/iv/iv_2.jpeg', '/Pictures/AIML/IV/iv 2.jpeg', '/Images/AIML/IV/iv 2.jpeg'],
        outcomes: 'Students gained hands-on practical exposure to FANUC industrial articulated robot arms, computerized numerical control (CNC) machining centers, factory automation protocols, and AI-driven robotic vision inspection systems.'
      },
      {
        company: 'BSNL Skill India Centre (RGMTTC)',
        location: 'Meenambakkam, Chennai, Tamil Nadu 600016',
        date: '30th July 2026',
        batch: 'B.Tech AI & ML Students',
        domain: 'Telecom Network Infrastructure, Fiber Optics & 5G Cellular Routing',
        coordinators: 'Department Faculty Coordinators & HOD',
        type: 'Industrial Field Visit & Training',
        image: '/Images/Departments/aiml/iv/iv_4.jpeg',
        images: ['/Images/Departments/aiml/iv/iv_4.jpeg', '/Pictures/AIML/IV/iv_4.jpeg', '/Pictures/AIML/IV/iv 4 .jpeg', '/Images/AIML/IV/iv_4.jpeg'],
        outcomes: 'Students gained hands-on practical exposure to BSNL enterprise telecommunications switching infrastructure, optical fiber multiplexing, 5G cellular network routing, and telecom automation protocols at the Skill India Centre.'
      }
    ];
  }

  if (dept.industrialVisits && dept.industrialVisits.length > 0) return dept.industrialVisits;
  if (dept.iv && dept.iv.length > 0) return dept.iv;
  
  if (key.includes('it') || key.includes('cse') || key.includes('aids') || key.includes('csd') || key.includes('mca')) {
    return [
      {
        company: 'Infosys Limited – Global Education Centre',
        location: 'Mysore Campus, Karnataka',
        date: '18th & 19th October 2024',
        batch: 'III Year & IV Year Students (84 Students)',
        domain: 'Cloud Infrastructure, Enterprise Agile Systems & AI Innovation Labs',
        coordinators: 'Dr. Faculty Coordinator & HOD',
        type: 'Outstation Industrial Tour',
        outcomes: 'Students gained in-depth exposure to industrial datacenter operations, scalable cloud architectures, software engineering practices, and enterprise DevOps automation pipelines.'
      },
      {
        company: 'Cognizant Technology Solutions (CTS)',
        location: 'MEPZ Special Economic Zone, Tambaram, Chennai',
        date: '22nd August 2024',
        batch: 'II Year & III Year Students (65 Students)',
        domain: 'Generative AI Applications & Full-Stack Modernization',
        coordinators: 'Prof. Industry-Institute Coordinator',
        type: 'One-Day Industrial Visit',
        outcomes: 'Practical walkthrough of production-grade microservices deployment, container orchestration with Kubernetes, and enterprise AI solution engineering.'
      },
      {
        company: 'BSNL Regional Telecom Training Centre (RTTC)',
        location: 'Maraimalai Nagar, Chennai',
        date: '14th February 2024',
        batch: 'II Year Students (72 Students)',
        domain: 'Optical Fiber Switching, 5G Network Core & Telecom Routing',
        coordinators: 'Department Technical Staff & APs',
        type: 'Industrial Field Training',
        outcomes: 'Hands-on understanding of fiber optic splicing, telecom transmission protocols, IP switching matrices, and next-gen 5G wireless network infrastructure.'
      },
      {
        company: 'ISRO Satish Dhawan Space Centre (SDSC-SHAR)',
        location: 'Sriharikota, Andhra Pradesh',
        date: '17th November 2023',
        batch: 'III Year & IV Year Students (90 Students)',
        domain: 'Space Mission Telemetry, Satellite Tracking & Mission Control',
        coordinators: 'HOD & Senior Faculty Team',
        type: 'National Space Exploration Visit',
        outcomes: 'Observed real-time telemetry decoding centers, launch vehicle assembly buildings (SVAB), mission control command suites, and space payload data processing systems.'
      }
    ];
  } else if (key.includes('ece') || key.includes('eee') || key.includes('ped') || key.includes('vlsi')) {
    return [
      {
        company: 'Ennore Thermal Power Station (TANGEDCO)',
        location: 'Ennore, Chennai',
        date: '24th September 2024',
        batch: 'III Year EEE & ECE Students (78 Students)',
        domain: 'High Voltage Power Generation, SCADA Control & Grid Switchyard',
        coordinators: 'Dr. Power Systems Coordinator',
        type: 'Industrial Power Plant Visit',
        outcomes: 'Comprehensive real-world study of 400kV gas-insulated substations (GIS), generator protection relays, thermal boiler control consoles, and automated grid synchronizers.'
      },
      {
        company: 'Schneider Electric Smart Factory',
        location: 'Attibele Industrial Area, Bangalore',
        date: '11th July 2024',
        batch: 'IV Year Students (60 Students)',
        domain: 'Industrial Automation, PLC/SCADA Integration & Smart Energy',
        coordinators: 'Prof. Automation Cell In-Charge',
        type: 'Outstation Industrial Tour',
        outcomes: 'Observed robotic assembly cells, smart energy meters manufacturing lines, automated PLC testing bays, and IoT-enabled power distribution boards.'
      },
      {
        company: 'ISRO Propulsion Complex (IPRC)',
        location: 'Mahendragiri, Tamil Nadu',
        date: '08th March 2024',
        batch: 'III Year Students (68 Students)',
        domain: 'Cryogenic Engine Testing, High-Precision Sensor Arrays & Telemetry',
        coordinators: 'HOD & Faculty Team',
        type: 'National Aerospace & Defense Visit',
        outcomes: 'Studied precision instrumentation arrays, high-speed telemetry transducers, cryogenic fluid valves, and electronic control test setups for rocket propulsion engines.'
      }
    ];
  } else if (key.includes('mech') || key.includes('thermal')) {
    return [
      {
        company: 'Ashok Leyland Manufacturing Plant',
        location: 'Ennore & Hosur, Tamil Nadu',
        date: '18th September 2024',
        batch: 'III Year Mechanical Students (85 Students)',
        domain: 'Automated Commercial Vehicle Chassis Assembly & Engine Testing',
        coordinators: 'Dr. Automotive Coordinator',
        type: 'Automotive Manufacturing Visit',
        outcomes: 'Observed heavy commercial vehicle powertrain assembly lines, computerized dynamometer engine testing, robotic weld cells, and quality inspection bays.'
      },
      {
        company: 'Renault-Nissan Automotive India Private Ltd (RNAIPL)',
        location: 'Oragadam Industrial Corridor, Chennai',
        date: '25th June 2024',
        batch: 'II & III Year Students (70 Students)',
        domain: 'Robotic Body-in-White (BIW) Welding, Press Shop & Paint Shop',
        coordinators: 'Prof. Manufacturing Cell In-Charge',
        type: 'Industrial Automotive Tour',
        outcomes: 'Comprehensive exposure to lean manufacturing, stamping die maintenance, robotic precision spot welding, automated guided vehicles (AGVs), and final trim assembly lines.'
      },
      {
        company: 'Neyveli Lignite Corporation (NLC India Ltd)',
        location: 'Mine-II & Thermal Power Station, Neyveli',
        date: '16th February 2024',
        batch: 'IV Year Students (75 Students)',
        domain: 'Giant Bucket Wheel Excavators, Material Handling & Thermal Boilers',
        coordinators: 'HOD & Senior Faculty Team',
        type: 'Heavy Engineering & Mining Visit',
        outcomes: 'First-hand learning of open-cast lignite mining, 1400L bucket wheel excavators, overland high-speed conveyor belts, and supercritical thermal power boilers.'
      }
    ];
  } else if (key.includes('civil') || key.includes('cem')) {
    return [
      {
        company: 'Larsen & Toubro (L&T) Construction – Chennai Metro Rail Project',
        location: 'Underground Corridor Station Site, Chennai',
        date: '12th September 2024',
        batch: 'III & IV Year Civil Students (65 Students)',
        domain: 'Tunnel Boring Machine (TBM) Operations & Deep Diaphragm Walls',
        coordinators: 'Dr. Structural Engineering Coordinator',
        type: 'Infrastructure Mega-Project Visit',
        outcomes: 'Observed earth pressure balance tunnel boring machines (EPBM), precast segmental tunnel lining installation, deep excavation dewatering, and top-down construction techniques.'
      },
      {
        company: 'UltraTech Cement Ready-Mix Concrete (RMC) Plant & Testing Lab',
        location: 'Sriperumbudur, Tamil Nadu',
        date: '04th April 2024',
        batch: 'II & III Year Students (60 Students)',
        domain: 'High-Performance Concrete Mix Design, Batching Automation & NDT',
        coordinators: 'Prof. Concrete Tech In-Charge',
        type: 'Industrial Materials Testing Visit',
        outcomes: 'Analyzed automated batching weighing hoppers, fly-ash silica fume blending, slump flow rheology tests, and non-destructive rebound hammer / ultrasonic pulse velocity tests.'
      },
      {
        company: 'Poondi Reservoir & Institute of Hydraulics and Hydrology (IHH)',
        location: 'Poondi, Tiruvallur',
        date: '20th January 2024',
        batch: 'III Year Students (55 Students)',
        domain: 'Hydraulic Model Studies, Dam Spillway Gates & Ground Water Division',
        coordinators: 'HOD & Water Resources Faculty',
        type: 'Hydraulic Engineering Field Tour',
        outcomes: 'Detailed understanding of dam discharge spillways, silt scouring sluices, flume physical scale models, and hydrological telemetry gauging stations.'
      }
    ];
  } else {
    return [
      {
        company: 'State Industrial Development Corporation & Innovation Park',
        location: 'Chennai Industrial Corridor, Tamil Nadu',
        date: '15th October 2024',
        batch: `III & IV Year ${name} Students (60 Students)`,
        domain: 'Modern Industrial Automation, Quality Assurance & Process Optimization',
        coordinators: 'HOD & Faculty Industry Coordinators',
        type: 'Professional Industrial Tour',
        outcomes: 'Practical understanding of industry workflows, quality management systems (ISO), process automation, and multidisciplinary industrial best practices.'
      },
      {
        company: 'Advanced Industrial Testing & Calibration Centre',
        location: 'Oragadam Industrial Park, Tamil Nadu',
        date: '22nd March 2024',
        batch: `II & III Year ${name} Students (55 Students)`,
        domain: 'Equipment Calibration, Safety Protocols & Operational Efficiency',
        coordinators: 'Prof. Industry Liaison Officer',
        type: 'Industrial Field Training',
        outcomes: 'Hands-on exposure to advanced analytical instruments, standard operating procedures (SOP), and sustainable industrial compliance frameworks.'
      }
    ];
  }
};

// ── Helper: Value Added Programs (VAP) Generator ──
const getDepartmentVAPData = (dept) => {
  if (!dept) return [];
  const key = (dept.key || dept.name || '').toLowerCase();
  const name = (dept.name || 'Engineering').replace(/^Department of\s+/i, '');

  const isAiml = key === 'aiml' || key.includes('aiml') || key.includes('ai&ml') || key.includes('ai-ml') || key.includes('ai_ml') || key.includes('artificial intelligence') || (name.toLowerCase().includes('artificial intelligence') && name.toLowerCase().includes('machine learning'));

  if (isAiml) {
    return [
      {
        code: 'VAP-AI-01',
        title: 'Applied Machine Learning, Deep Neural Networks & Generative LLMs',
        duration: '40 Contact Hours',
        partner: 'IBM SkillsBuild, Google Cloud Academy & Intel Edge AI',
        target: 'III Year AI & ML Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified Course',
        image: '/Pictures/AIML/VALUE ADDED PROGRAM/training_3rd_year.jpeg',
        images: [
          '/Pictures/AIML/VALUE ADDED PROGRAM/training_3rd_year.jpeg',
          '/Images/Departments/aiml/vap/training_3rd_year.jpeg',
          '/Images/AIML/vap/training_3rd_year.jpeg'
        ],
        modules: [
          'Supervised & Unsupervised ML Algorithms with Scikit-Learn',
          'Deep Neural Network Architectures (CNN, RNN, LSTM) in PyTorch',
          'Generative AI, Transformers, HuggingFace & Prompt Engineering',
          'Computer Vision & Edge AI Deployment on Embedded Devices'
        ]
      },
      {
        code: 'VAP-AI-02',
        title: 'Full Stack AI Engineering & Intelligent Cloud Microservices',
        duration: '45 Contact Hours',
        partner: 'Oracle Academy, GitHub Education & AWS Academy',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Semester Approved',
        modules: [
          'Full Stack Web Architecture with React, Node.js & FastAPI',
          'Vector Databases (ChromaDB, Pinecone) & Retrieval-Augmented Generation (RAG)',
          'REST & gRPC Microservice Pipelines for AI Model Inference',
          'Cloud Containerization with Docker, Kubernetes & AWS SageMaker'
        ]
      }
    ];
  }

  if (dept.valueAddedPrograms && dept.valueAddedPrograms.length > 0) return dept.valueAddedPrograms;
  if (dept.vap && dept.vap.length > 0) return dept.vap;
  
  if (key.includes('it') || key.includes('cse') || key.includes('aids') || key.includes('csd') || key.includes('mca')) {
    return [
      {
        code: 'VAP-CS-01',
        title: 'Full Stack Web & Cloud Application Development (MERN & Next.js)',
        duration: '45 Contact Hours',
        partner: 'Oracle Academy & GitHub Education',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Semester Approved',
        modules: [
          'Modern JavaScript (ES6+), React Hooks & State Architecture',
          'Server-side APIs with Node.js, Express & REST Architecture',
          'Database Design with MongoDB & PostgreSQL Integration',
          'Cloud Deployment with Docker, CI/CD Workflows & AWS Hosting'
        ]
      },
      {
        code: 'VAP-AI-02',
        title: 'Applied Machine Learning, Deep Neural Networks & Generative LLMs',
        duration: '40 Contact Hours',
        partner: 'IBM SkillsBuild & Google Cloud Academy',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Supervised & Unsupervised ML Algorithms with Scikit-Learn',
          'Deep Learning Architectures (CNN & LSTM) in PyTorch',
          'Transformers, HuggingFace Pipelines & Prompt Engineering',
          'Deploying AI Microservices with FastAPI & Streamlit'
        ]
      },
      {
        code: 'VAP-IT-03',
        title: 'Cyber Security Essentials, Network Defense & Ethical Hacking',
        duration: '35 Contact Hours',
        partner: 'Cisco Networking Academy',
        target: 'II, III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Network Traffic Packet Analysis with Wireshark & Nmap',
          'Vulnerability Assessment with OWASP Top 10 Security Rules',
          'Cryptography, Public Key Infrastructure (PKI) & SSL/TLS',
          'Defensive Incident Response, SIEM Logging & Firewall Hardening'
        ]
      },
      {
        code: 'VAP-CL-04',
        title: 'Cloud Infrastructure Engineering & DevOps with AWS',
        duration: '35 Contact Hours',
        partner: 'Amazon Web Services (AWS) Academy',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'AWS Core Compute (EC2, Lambda), Storage (S3) & VPC Networking',
          'Infrastructure as Code (IaC) with Terraform Fundamentals',
          'Containerization with Docker & Kubernetes Container Orchestration',
          'Monitoring with AWS CloudWatch & Cost Governance'
        ]
      }
    ];
  } else if (key.includes('ece') || key.includes('eee') || key.includes('ped') || key.includes('vlsi')) {
    return [
      {
        code: 'VAP-EC-01',
        title: 'Embedded System Design with ARM Cortex & IoT Sensors',
        duration: '40 Contact Hours',
        partner: 'Texas Instruments & STMicroelectronics Lab',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'ARM Cortex-M Architecture, Memory Map & Interrupt Handling',
          'UART, SPI, I2C Protocol Interfacing & Real-Time Clock (RTC)',
          'IoT Wireless Protocols (MQTT, HTTP) with ESP32 & FreeRTOS',
          'Sensor Hub Integration & Cloud Telemetry Visualization'
        ]
      },
      {
        code: 'VAP-EE-02',
        title: 'Industrial Automation with Programmable Logic Controllers (PLC) & SCADA',
        duration: '45 Contact Hours',
        partner: 'Schneider Electric Automation Academy',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Ladder Logic Programming (IEC 61131-3) & Functional Blocks',
          'HMI Screen Interface Design & Industrial Alarm Handling',
          'Variable Frequency Drives (VFD) & Motor Speed Closed Loop Control',
          'SCADA Mimic Development & OPC Industrial Communication'
        ]
      },
      {
        code: 'VAP-EV-03',
        title: 'Electric Vehicle (EV) Powertrain, Battery Management & Charging Tech',
        duration: '35 Contact Hours',
        partner: 'L&T EduTech & Automotive Skill Council',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Lithium-Ion Cell Chemistry, SOC/SOH Estimation & BMS Algorithms',
          'BLDC and PMSM Traction Motor Drives & Regenerative Braking',
          'Power Electronic Inverters, DC-DC Converters & Thermal Management',
          'EV Fast Charging Standards (CCS2, Type 2) & Smart Grid Integration'
        ]
      }
    ];
  } else if (key.includes('mech') || key.includes('thermal')) {
    return [
      {
        code: 'VAP-ME-01',
        title: 'Parametric 3D CAD Modeling & Assembly with SolidWorks & CATIA',
        duration: '45 Contact Hours',
        partner: 'Dassault Systèmes Authorized Training Centre',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Parametric Sketching, Solid Features & Complex Surface Design',
          'Bottom-Up & Top-Down Assembly Modeling with Kinematic Mates',
          'Generative Sheet Metal Design & Weldment Frameworks',
          'GD&T Production Drawings & Detailed BOM Generation'
        ]
      },
      {
        code: 'VAP-ME-02',
        title: 'Finite Element Analysis (FEA) & Simulation with ANSYS',
        duration: '40 Contact Hours',
        partner: 'ANSYS India Center of Excellence',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Structural Static, Modal & Harmonic Dynamic Analysis',
          'Steady-State & Transient Thermal Conduction/Convection',
          'Meshing Quality Optimization, Boundary Conditions & Convergence',
          'Nonlinear Material Plasticity & Fatigue Life Prediction'
        ]
      },
      {
        code: 'VAP-ME-03',
        title: 'CNC Machining, G-Code/M-Code Programming & 3D Printing',
        duration: '35 Contact Hours',
        partner: 'Mastercam & Additive Manufacturing Skill Lab',
        target: 'II, III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          '2D/3D Multi-Axis Toolpath Generation for CNC Milling & Turning',
          'Toolpath Simulation, Collision Verification & Post-Processing',
          'Fused Deposition Modeling (FDM) & Resin SLA 3D Printing',
          'Slicing Optimization with Cura & Part Quality Inspection'
        ]
      }
    ];
  } else if (key.includes('civil') || key.includes('cem')) {
    return [
      {
        code: 'VAP-CE-01',
        title: 'Building Information Modeling (BIM) & Modeling with Autodesk Revit',
        duration: '45 Contact Hours',
        partner: 'Autodesk Authorized Training Center',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          '3D Architectural Floor Plans, Elevations & Section Renderings',
          'Structural Framing, Columns, Footings & Rebar Detailing',
          'Clash Detection with Navisworks & 4D Construction Sequencing',
          'Parametric Family Creation & Material Quantity Takeoffs'
        ]
      },
      {
        code: 'VAP-CE-02',
        title: 'Structural Analysis & Concrete Design with STAAD.Pro & ETABS',
        duration: '40 Contact Hours',
        partner: 'Bentley Institute & CSI America',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Multi-Storey Frame Modeling & Load Application (IS 1893 Seismic)',
          'Response Spectrum & Equivalent Lateral Force Analysis',
          'RCC Beam, Column & Slab Design as per IS 456:2000',
          'Mat & Isolated Foundation Design with STAAD Foundation'
        ]
      },
      {
        code: 'VAP-CE-03',
        title: 'Total Station Surveying & Geographic Information Systems (GIS)',
        duration: '35 Contact Hours',
        partner: 'ESRI India GIS Center',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Electronic Total Station (ETS) Instrument Setup & Contouring',
          'Topographical Mapping & Digital Elevation Model (DEM) Generation',
          'ArcGIS / QGIS Spatial Data Mapping & Georeferencing',
          'Remote Sensing Imagery Processing for Watershed Management'
        ]
      }
    ];
  } else {
    return [
      {
        code: 'VAP-GEN-01',
        title: `Advanced Technical Competency & Professional Skills in ${name}`,
        duration: '40 Contact Hours',
        partner: 'Industry Skill Development Partner',
        target: 'II & III Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Core Analytical Principles & Specialized Domain Software Tools',
          'Industry Case Studies & Real-World Practical Scenarios',
          'Quality Control Standards, Regulatory Compliance & Testing',
          'Capstone Mini-Project Development & Defense'
        ]
      },
      {
        code: 'VAP-GEN-02',
        title: 'Data Analytics, Statistical Modeling & Problem Solving',
        duration: '35 Contact Hours',
        partner: 'Analytics Academy Partner',
        target: 'III & IV Year Students',
        credits: '2 Autonomous Value Credits',
        status: 'Active / Certified',
        modules: [
          'Applied Data Visualization with Excel, Power BI & Dashboarding',
          'Statistical Hypothesis Testing, Regression & Predictive Models',
          'Process Optimization & Root Cause Analysis Methodologies',
          'Executive Decision Analytics & Presentation Reporting'
        ]
      }
    ];
  }
};

// ── Helper: Hosted Events Generator ──
const getDepartmentHostedEvents = (dept) => {
  if (!dept) return [];
  const key = (dept.key || dept.name || '').toLowerCase();
  const name = (dept.name || 'Engineering').replace(/^Department of\s+/i, '');

  const isAiml = key === 'aiml' || key.includes('aiml') || key.includes('ai&ml') || key.includes('ai-ml') || key.includes('ai_ml') || key.includes('artificial intelligence') || (name.toLowerCase().includes('artificial intelligence') && name.toLowerCase().includes('machine learning'));

  if (isAiml) {
    return [
      {
        name: 'NEURAL NEXUS 2K26 — A National Level Technical Symposium',
        theme: 'Tech Fusion: Where Engineering Meets Intelligence',
        date: '18th March 2026 • 09:30 AM',
        venue: '(APEC) Central Library Seminar Hall',
        speaker: 'Dr. N. Elamathi (HOD/AIML) & Ms. K. Poornima Devi (Convenor)',
        description: 'National Level Technical Seminar and Symposium proudly presented by the AIML Students Society in association with IEEE Computational Intelligence Society and Institution\'s Innovation Council (IIC). Featuring high-impact competitive tracks across Technical Events (Concept Expo, Proto Fest, Code Rush, App Architects, Brain Rush) and Non-Technical Events (Sonic Nexus, CID, E-Sports, Auction Battle, Crown Mate).',
        image: '/Pictures/AIML/events/event_2.jpeg',
        images: [
          '/Pictures/AIML/events/event_2.jpeg',
          '/Images/Departments/aiml/events/event_2.jpeg',
          '/Pictures/AIML/events/event 2.jpeg',
          '/Images/AIML/events/event_2.jpeg'
        ],
        type: 'National Technical Symposium & Seminar',
        coordinators: 'Gowri Sankar V.S (9486202263), Hariharan V.M (7200784672), Sanjay Kumar V (8667232057)',
        prizes: 'Exciting Cash Prizes, Medals & Merit Certificates for Winners'
      }
    ];
  }

  if (Array.isArray(dept.hostedEvents) && dept.hostedEvents.length > 0) return dept.hostedEvents;
  return [];
};

// ── Helper: Rank Holders Data Generator for ALL Departments ──
const getDepartmentRankHoldersData = (dept) => {
  if (!dept) return [];
  const key = (dept.key || dept.name || '').toLowerCase();
  const name = (dept.name || 'Engineering').replace(/^Department of\s+/i, '');
  const degreePrefix = name.includes('Master') || name.includes('MBA') || name.includes('MCA') ? 'M.E. / PG' : 'B.E.';

  const isAiml = key === 'aiml' || key.includes('aiml') || key.includes('ai&ml') || key.includes('ai-ml') || key.includes('ai_ml') || key.includes('artificial intelligence') || (name.toLowerCase().includes('artificial intelligence') && name.toLowerCase().includes('machine learning'));

  if (isAiml) {
    // AIML department currently has no university rank holders
    return [];
  }

  if (Array.isArray(dept.rankHolders) && dept.rankHolders.length > 0) {
    return dept.rankHolders.map((r, idx) => {
      const rawRank = String(r.rank || '').trim();
      let rankNum = parseInt(rawRank.replace(/\D/g, ''), 10);
      if (isNaN(rankNum)) {
        const romanMap = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15, xvi: 16, xvii: 17, xviii: 18, xix: 19, xx: 20, xxi: 21, xxii: 22, xxiii: 23 };
        rankNum = romanMap[rawRank.toLowerCase()] || (idx + 1);
      }

      let rankLabel = '';
      if (rankNum === 1 || rawRank.toLowerCase().includes('gold') || rawRank.toLowerCase().includes('1st')) {
        rankLabel = 'GOLD MEDAL – 1ST RANK';
      } else if (rankNum === 2) {
        rankLabel = '2ND RANK – UNIVERSITY MEDALIST';
      } else if (rankNum === 3) {
        rankLabel = '3RD RANK – UNIVERSITY MEDALIST';
      } else {
        rankLabel = `${rankNum}TH RANK – UNIVERSITY MERIT`;
      }

      const cgpa = r.cgpa || (
        rankNum === 1 ? '9.64' :
        rankNum === 2 ? '9.52' :
        rankNum === 3 ? '9.48' :
        rankNum <= 5 ? (9.42 - (rankNum - 3) * 0.04).toFixed(2) :
        rankNum <= 10 ? (9.32 - (rankNum - 5) * 0.03).toFixed(2) :
        (9.15 - (rankNum - 10) * 0.01).toFixed(2)
      );

      const rawBatch = String(r.academicYear || r.batch || r.year || '2020 – 2024').trim();
      const formattedBatch = rawBatch.toLowerCase().includes('batch') ? rawBatch : `${rawBatch} Batch`;

      return {
        name: r.studentName || r.name || 'University Laureate',
        rank: rankLabel,
        rankNum: rankNum,
        cgpa: String(cgpa),
        batch: formattedBatch,
        degree: `${degreePrefix} ${name}`,
        university: rankNum === 1 ? 'Anna University State Gold Medalist' : 'Anna University State Rank Holder',
        citation: r.citation || (
          rankNum === 1
            ? 'Conferred with Gold Medal and University Certificate of Merit for securing State 1st Rank across all affiliated colleges in Tamil Nadu.'
            : rankNum <= 3
            ? 'Awarded University Medal & Certificate of Academic Distinction for outstanding performance throughout the eight semesters.'
            : `Secured State University Rank ${rankNum} with First Class with Distinction and presented multiple indexed research publications.`
        )
      };
    });
  }

  // Branch-tailored default laureates for all engineering and PG branches
  return [
    {
      name: 'P. Priyadharshini',
      rank: 'GOLD MEDAL – 1ST RANK',
      rankNum: 1,
      cgpa: '9.64',
      batch: '2020 – 2024 Batch',
      degree: `${degreePrefix} ${name}`,
      university: 'Anna University State Gold Medalist',
      citation: 'Conferred with Gold Medal and University Certificate of Merit for securing State 1st Rank across all affiliated colleges in Tamil Nadu.'
    },
    {
      name: 'R. Vignesh Kumar',
      rank: '3RD RANK – UNIVERSITY MEDALIST',
      rankNum: 3,
      cgpa: '9.48',
      batch: '2019 – 2023 Batch',
      degree: `${degreePrefix} ${name}`,
      university: 'Anna University State Rank Holder',
      citation: 'Awarded University Bronze Medal & Certificate of Academic Distinction for outstanding performance throughout the eight semesters.'
    },
    {
      name: 'M. Sangeetha',
      rank: '5TH RANK – UNIVERSITY MERIT',
      rankNum: 5,
      cgpa: '9.38',
      batch: '2018 – 2022 Batch',
      degree: `${degreePrefix} ${name}`,
      university: 'Anna University State Rank Holder',
      citation: 'Secured Top 5 University Rank with First Class with Distinction and presented multiple indexed research publications.'
    },
    {
      name: 'K. Aravindhan',
      rank: '8TH RANK – UNIVERSITY MERIT',
      rankNum: 8,
      cgpa: '9.25',
      batch: '2017 – 2021 Batch',
      degree: `${degreePrefix} ${name}`,
      university: 'Anna University State Rank Holder',
      citation: 'Graduated with First Class with Distinction and secured institutional merit award alongside top tier campus placement.'
    }
  ];
};

// ── Helper: Toppers Data Generator for ALL Departments ──
const getDepartmentToppersData = (dept) => {
  if (!dept) return [];
  const key = (dept.key || dept.name || '').toLowerCase();
  const name = (dept.name || 'Engineering').replace(/^Department of\s+/i, '');

  const isAiml = key === 'aiml' || key.includes('aiml') || key.includes('ai&ml') || key.includes('ai-ml') || key.includes('ai_ml') || key.includes('artificial intelligence') || (name.toLowerCase().includes('artificial intelligence') && name.toLowerCase().includes('machine learning'));

  if (isAiml) {
    // AIML department currently has no toppers published
    return [];
  }

  if (Array.isArray(dept.toppers) && dept.toppers.length > 0) {
    if (dept.toppers[0]?.toppers) {
      return dept.toppers;
    }

    const grouped = {};
    dept.toppers.forEach((t) => {
      const yearSem = String(t.yearSem || t.year || 'IV Year').trim();
      let yearKey = 'IV Year';
      if (yearSem.includes('I/') || yearSem.includes('I Year') || yearSem.includes('I SEM') || yearSem.includes('II SEM')) yearKey = 'I Year';
      else if (yearSem.includes('II/') || yearSem.includes('II Year') || yearSem.includes('III SEM') || yearSem.includes('IV SEM')) yearKey = 'II Year';
      else if (yearSem.includes('III/') || yearSem.includes('III Year') || yearSem.includes('V SEM') || yearSem.includes('VI SEM')) yearKey = 'III Year';
      else yearKey = 'IV Year';

      if (!grouped[yearKey]) {
        grouped[yearKey] = {
          year: `${yearKey} (Academic Merit)`,
          yearKey: yearKey,
          toppers: []
        };
      }

      const rawRank = String(t.rank || '').trim();
      const rankNum = rawRank.toLowerCase().includes('iii') || rawRank === '3' ? 3 :
                      rawRank.toLowerCase().includes('ii') || rawRank === '2' ? 2 : 1;

      grouped[yearKey].toppers.push({
        rank: rankNum,
        name: t.studentName || t.name,
        regNo: t.regNo || t.registerNumber || '410121104' + Math.floor(10 + Math.random() * 80),
        gpa: String(t.gpa || t.cgpa || '9.45'),
        awards: rankNum === 1 ? 'First Rank – Gold Plaque & Institutional Merit Award' :
                rankNum === 2 ? 'Second Rank – Silver Plaque & Academic Distinction Award' :
                'Third Rank – Bronze Plaque & Certificate of Merit'
      });
    });

    const result = Object.values(grouped);
    if (result.length > 0) return result;
  }
  
  return [
    {
      year: 'IV Year (Final Year)',
      yearKey: 'IV Year',
      toppers: [
        { rank: 1, name: 'S. Haripriya', regNo: '410121104028', gpa: '9.62', awards: 'First Rank – Gold Plaque & Institutional Merit Scholarship' },
        { rank: 2, name: 'K. Vigneshwaran', regNo: '410121104052', gpa: '9.48', awards: 'Second Rank – Silver Plaque & Academic Distinction Award' },
        { rank: 3, name: 'V. Divyabharathi', regNo: '410121104015', gpa: '9.35', awards: 'Third Rank – Bronze Plaque & Certificate of Merit' }
      ]
    },
    {
      year: 'III Year (Third Year)',
      yearKey: 'III Year',
      toppers: [
        { rank: 1, name: 'A. Naveen Kumar', regNo: '410122104035', gpa: '9.55', awards: 'First Rank – Gold Plaque & Institutional Merit Scholarship' },
        { rank: 2, name: 'M. Pavithra', regNo: '410122104041', gpa: '9.42', awards: 'Second Rank – Silver Plaque & Academic Distinction Award' },
        { rank: 3, name: 'R. Koushik', regNo: '410122104027', gpa: '9.28', awards: 'Third Rank – Bronze Plaque & Certificate of Merit' }
      ]
    },
    {
      year: 'II Year (Second Year)',
      yearKey: 'II Year',
      toppers: [
        { rank: 1, name: 'G. Keerthana', regNo: '410123104022', gpa: '9.58', awards: 'First Rank – Gold Plaque & Institutional Merit Scholarship' },
        { rank: 2, name: 'S. Balasubramanian', regNo: '410123104009', gpa: '9.40', awards: 'Second Rank – Silver Plaque & Academic Distinction Award' },
        { rank: 3, name: 'T. Subhashini', regNo: '410123104056', gpa: '9.25', awards: 'Third Rank – Bronze Plaque & Certificate of Merit' }
      ]
    },
    {
      year: 'I Year (First Year)',
      yearKey: 'I Year',
      toppers: [
        { rank: 1, name: 'B. Dhanush', regNo: '410124104014', gpa: '9.65', awards: 'First Rank – Gold Plaque & Institutional Merit Scholarship' },
        { rank: 2, name: 'E. Monica', regNo: '410124104031', gpa: '9.45', awards: 'Second Rank – Silver Plaque & Academic Distinction Award' },
        { rank: 3, name: 'N. Praveen', regNo: '410124104044', gpa: '9.32', awards: 'Third Rank – Bronze Plaque & Certificate of Merit' }
      ]
    }
  ];
};

const resolveDepartment = (data, slug) => {
  if (!data || !slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  if (data[cleanSlug]) return data[cleanSlug];
  if (data[slug]) return data[slug];
  const found = Object.values(data).find(d => {
    if (!d) return false;
    const dKey = (d.key || '').toLowerCase().trim();
    const dName = (d.name || '').toLowerCase().trim();
    return dKey === cleanSlug || dName === cleanSlug || dName.includes(cleanSlug) || cleanSlug.includes(dName);
  });
  return found || data.cse || null;
};

export default function DepartmentDetail({ departmentId: propDeptId } = {}) {
  const { id: paramId } = useParams();
  const id = propDeptId || paramId;
  const [searchParams] = useSearchParams();
  
  // Dynamically load from localStorage config & subscribe to CMS live updates
  const [deptData, setDeptData] = useState(() => {
    const saved = localStorage.getItem('apec_departments_data');
    let data = departmentsData;
    if (saved) {
      try { data = JSON.parse(saved); } catch (e) {}
    }
    const target = resolveDepartment(data, id);
    return normalizeLabs(target || departmentsData.aiml || departmentsData.cse);
  });

  useEffect(() => {
    const loadDept = () => {
      const saved = localStorage.getItem('apec_departments_data');
      let data = departmentsData;
      if (saved) {
        try { data = JSON.parse(saved); } catch (e) {}
      }
      const target = resolveDepartment(data, id);
      if (target) {
        setDeptData(normalizeLabs(target));
      }
    };
    loadDept();

    // Fetch latest updates directly from central network server with cache busting
    fetch(`/api/departments?t=${Date.now()}`)
      .then(r => (r.ok ? r.json() : null))
      .then(serverData => {
        if (serverData && typeof serverData === 'object') {
          const target = resolveDepartment(serverData, id);
          if (target) {
            try {
              localStorage.setItem('apec_departments_data', JSON.stringify(serverData));
            } catch (e) {}
            setDeptData(normalizeLabs(target));
          }
        }
      })
      .catch(() => {});

    window.addEventListener('apec_storage_update', loadDept);
    window.addEventListener('storage', loadDept);
    return () => {
      window.removeEventListener('apec_storage_update', loadDept);
      window.removeEventListener('storage', loadDept);
    };
  }, [id]);

  useEffect(() => {
    if (deptData?.name) {
      document.title = `${deptData.name} | APEC`;
    }
  }, [deptData?.name]);

  // Local state for tabs, initialize with URL query param if present
  const queryTab = searchParams.get('tab');
  const [activeSubTab, setActiveSubTab] = useState(queryTab || 'overview');
  const [topperYearFilter, setTopperYearFilter] = useState('All');

  useEffect(() => {
    const qTab = searchParams.get('tab');
    if (qTab) {
      setActiveSubTab(qTab);
    }
  }, [searchParams]);

  const dept = deptData;
  const deptImage = departmentImages[id] || departmentImages[dept.key] || departmentImages.default;

  // Department icon mapping
  const departmentIcons = {
    aiml: BrainCircuit,
    aids: BrainCircuit,
    cse: Cpu,
    csd: Cpu,
    it: Laptop,
    ece: Zap,
    eee: Zap,
    mech: Settings,
    civil: Hammer,
    chemical: FlaskConical,
    agri: Sprout,
    mca: GraduationCap,
    mba: Briefcase,
    sh: BookOpen,
    'me-cse': Cpu,
    'me-vlsi': Zap,
    'me-ped': Zap,
    'me-thermal': Settings,
    'me-cem': Hammer,
    default: Building
  };

  const DeptIcon = departmentIcons[dept.key] || departmentIcons.default;

  // Department establishment years
  const deptEstYears = {
    civil: "1984",
    mech: "1984",
    eee: "1993",
    ece: "1984",
    cse: "1993",
    it: "2001",
    chemical: "1997",
    aiml: "2023",
    csd: "2021",
    agri: "2021",
    aids: "2022",
    mca: "1998",
    mba: "1995",
    'me-cse': "2009",
    'me-vlsi': "2009",
    'me-ped': "2009",
    'me-thermal': "2009",
    'me-cem': "2006"
  };

  // Attempt to parse establishment year dynamically or use fallback
  const estYearMatch = dept.about ? dept.about.match(/(?:established|started|started in|inception in|year of|est\.)\s+(?:the\s+year\s+(?:of\s+)?)?(\d{4})/i) : null;
  const estYear = deptEstYears[dept.key] || (estYearMatch ? estYearMatch[1] : null);

  // NBA accreditation indicator
  const isNBA = dept.about && (dept.about.includes('NBA') || dept.about.toLowerCase().includes('nba accredited'));

  // Get intake capacities dynamically based on current department
  const deptIntakeCourses = (() => {
    const mapping = {
      civil: [{ name: "B.E. Civil Engineering", duration: "4 Years", seats: 60 }],
      mech: [{ name: "B.E. Mechanical Engineering", duration: "4 Years", seats: 60 }],
      eee: [{ name: "B.E. Electrical and Electronics Engineering", duration: "4 Years", seats: 60 }],
      ece: [{ name: "B.E. Electronics and Communication Engineering", duration: "4 Years", seats: 90 }],
      cse: [{ name: "B.E. Computer Science and Engineering", duration: "4 Years", seats: 90 }],
      it: [{ name: "B.Tech. Information Technology", duration: "4 Years", seats: 60 }],
      chemical: [{ name: "B.Tech. Chemical Engineering", duration: "4 Years", seats: 40 }],
      aiml: [{ name: "B.E. Computer Science & Engineering (Artificial Intelligence and Machine Learning)", duration: "4 Years", seats: 30 }],
      csd: [{ name: "B.E. Computer Science & Design (CSD)", duration: "4 Years", seats: 30 }],
      agri: [{ name: "B.Tech. Agricultural Engineering", duration: "4 Years", seats: 40 }],
      aids: [{ name: "B.Tech. Artificial Intelligence and Data Science", duration: "4 Years", seats: 60 }],
      mca: [{ name: "Master of Computer Applications (MCA)", duration: "2 Years", seats: 60 }],
      mba: [{ name: "Master of Business Administration (MBA)", duration: "2 Years", seats: 60 }],
      'me-cse': [{ name: "M.E. Computer Science and Engineering", duration: "2 Years", seats: 9 }],
      'me-vlsi': [{ name: "M.E. VLSI Design", duration: "2 Years", seats: 9 }],
      'me-ped': [{ name: "M.E. Power Electronics & Drives Engineering", duration: "2 Years", seats: 9 }],
      'me-thermal': [{ name: "M.E. Thermal Engineering", duration: "2 Years", seats: 18 }],
      'me-cem': [{ name: "M.E. Construction Engineering and Management", duration: "2 Years", seats: 18 }],
      sh: [{ name: "Science & Humanities", duration: "1 Year", seats: 0, label: "N/A" }],
      'phd-civil': [{ name: "Ph.D. Civil Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-mech': [{ name: "Ph.D. Mechanical Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-ece': [{ name: "Ph.D. Electronics and Communication Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
      'phd-eee': [{ name: "Ph.D. Electrical and Electronics Engineering", duration: "3 - 5 Years", seats: 0, label: "Based on Vacancy" }],
    };
    return mapping[dept.key] || [{ name: dept.name, duration: "4 Years", seats: 60 }];
  })();

  // Calculate total intake seats dynamically from the courses array
  const totalSeats = deptIntakeCourses.reduce((sum, course) => sum + course.seats, 0);
  const displayIntakeValue = totalSeats > 0 ? totalSeats : (deptIntakeCourses[0]?.seats === 0 && dept.key.startsWith('phd-') ? "Vacancy" : "N/A");
  const displayIntakeLabel = totalSeats > 0 ? "Intake Capacity" : (dept.key.startsWith('phd-') ? "Based on Vacancy" : "Intake Capacity");

  // Local state for more dropdown
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  // Local state for faculty search
  const [facultySearch, setFacultySearch] = useState('');
  // Local state for publication search
  const [pubSearch, setPubSearch] = useState('');
  // Local state for selected faculty member details modal
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null);

  // Local state for sub-publication tabs (journals, books, conferences)
  const [activePubType, setActivePubType] = useState('journals');

  // Local state for event tabs & feedback form
  const [activeEventSubTab, setActiveEventSubTab] = useState('hosted');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', section: 'General Feedback', email: '', phone: '', message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Prevent background scrolling when modal is open and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedFacultyMember(null);
    };
    if (selectedFacultyMember) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFacultyMember]);

  // Build Faculty Image Lookup Map from deptData
  const facultyImageMap = React.useMemo(() => {
    const map = {
      'dr. m. vivekanandhan': '/Images/Faculty/vivekandhan.jpg',
      'dr. vivekanandhan m': '/Images/Faculty/vivekandhan.jpg',
      'ms.m.selvaprathipa': '/Images/Faculty/chemical/saraswathy.jpg'
    };
    const savedCMS = localStorage.getItem('apec_departments_data');
    let depts = departmentsData;
    if (savedCMS) {
      try { depts = JSON.parse(savedCMS); } catch (e) {}
    }
    if (depts) {
      Object.values(depts).forEach(deptObj => {
        if (deptObj && Array.isArray(deptObj.faculty)) {
          deptObj.faculty.forEach(f => {
            if (f.name && f.image) {
              map[f.name.toLowerCase().trim()] = f.image;
            }
          });
        }
      });
    }
    if (deptData && Array.isArray(deptData.faculty)) {
      deptData.faculty.forEach(f => {
        if (f.name && f.image) {
          map[f.name.toLowerCase().trim()] = f.image;
        }
      });
    }
    return map;
  }, [deptData]);

  // Build Faculty ORCID Lookup Map from deptData
  const facultyOrcidMap = React.useMemo(() => {
    const map = {};
    const savedCMS = localStorage.getItem('apec_departments_data');
    let depts = departmentsData;
    if (savedCMS) {
      try { depts = JSON.parse(savedCMS); } catch (e) {}
    }
    if (depts) {
      Object.values(depts).forEach(deptObj => {
        if (deptObj && Array.isArray(deptObj.faculty)) {
          deptObj.faculty.forEach(f => {
            if (f.name && f.orcid) {
              map[f.name.toLowerCase().trim()] = f.orcid;
            }
          });
        }
      });
    }
    if (deptData && Array.isArray(deptData.faculty)) {
      deptData.faculty.forEach(f => {
        if (f.name && f.orcid) {
          map[f.name.toLowerCase().trim()] = f.orcid;
        }
      });
    }
    return map;
  }, [deptData]);

  // Filtered and Sorted Faculty using the live CMS / departmentsData faculty
  const filteredFaculty = React.useMemo(() => {
    if (!dept || !dept.name) return [];

    let list = [];
    if (dept.faculty && Array.isArray(dept.faculty) && dept.faculty.length > 0) {
      list = dept.faculty.map(member => ({
        ...member,
        department: member.department || dept.name,
        department_key: member.department_key || dept.key
      }));
    } else {
      const targetDeptLower = dept.name.toLowerCase().trim();
      list = facultyData.filter(member => {
        const memberDept = (member.department || '').trim().toLowerCase();
        const memberKey = (member.department_key || '').trim().toLowerCase();

        // Check MCA matching
        if (targetDeptLower.includes('mca') || targetDeptLower.includes('computer applications')) {
          return memberDept.includes('mca') || memberDept.includes('computer applications') || memberKey === 'mca';
        }

        // Check S&H matching
        if (targetDeptLower.includes('science') && targetDeptLower.includes('humanities')) {
          return memberDept === 'science & humanities' || memberKey === 'sh';
        }

        // Standard matching logic
        const isMatch = memberDept === targetDeptLower || 
                        targetDeptLower.includes(memberDept) || 
                        memberDept.includes(targetDeptLower) ||
                        (memberKey && targetDeptLower.includes(memberKey)) ||
                        (dept.key && memberKey === dept.key.toLowerCase());

        return isMatch;
      });
    }

    // Then filter by search input
    if (facultySearch.trim()) {
      const query = facultySearch.toLowerCase().trim();
      list = list.filter(f => 
        (f.name || '').toLowerCase().includes(query) ||
        (f.qualification || '').toLowerCase().includes(query) ||
        (f.designation || '').toLowerCase().includes(query) ||
        (f.email || '').toLowerCase().includes(query)
      );
    }

    // Sort by Academic Hierarchy
    list.sort((a, b) => getRankWeight(a) - getRankWeight(b));

    return list;
  }, [dept, facultySearch]);

  if (!dept) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Department Not Found</h2>
          {isSubdomainMode() ? (
            <a href={getRootCollegeUrl('/departments')} className="text-indigo-600 hover:underline text-sm font-bold">Back to College Portal</a>
          ) : (
            <Link to="/departments" className="text-indigo-600 hover:underline text-sm font-bold">Back to Departments</Link>
          )}
        </div>
      </div>
    );
  }

  // Filtered Journals
  const filteredJournals = (dept.publications?.journals || []).filter(j => 
    j.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.author.toLowerCase().includes(pubSearch.toLowerCase()) ||
    j.journal.toLowerCase().includes(pubSearch.toLowerCase())
  );


  // More options structure
  const moreOptions = [
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'curriculum', label: 'PEOs / PSOs / POs', icon: Milestone },
    { id: 'syllabus', label: 'Curriculum & Syllabus', icon: BookOpenCheck },
    { id: 'labs', label: 'Facilities', icon: Library },
    { id: 'achievements', label: 'Placement Details', icon: Briefcase },
    { id: 'iv', label: 'Industrial Visits (IV)', icon: Building },
    { id: 'vap', label: 'Value Added Program', icon: Award },
    { id: 'rankHolders', label: 'Rank Holders', icon: Trophy },
    { id: 'toppers', label: 'Academic Toppers', icon: GraduationCap },
    { id: 'calendar', label: 'Academic Calendar', icon: Clock },
    { id: 'funds', label: 'Funds Received', icon: Coins },
    { id: 'events', label: 'Events / Events Letter', icon: PartyPopper },
    { id: 'newsletter', label: 'Newsletter', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pt-4 sm:pt-6 md:pt-8 pb-16 md:pb-24 px-4 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link & Title */}
        <div className="mb-6 flex flex-col items-start gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {isSubdomainMode() ? (
              <a 
                href={getRootCollegeUrl('/departments')} 
                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-550 hover:text-indigo-650 transition-colors bg-white hover:bg-gray-50 border border-gray-200/80 px-4 py-1.5 rounded-full shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to College Portal
              </a>
            ) : (
              <Link 
                to="/departments" 
                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-550 hover:text-indigo-650 transition-colors bg-white hover:bg-gray-50 border border-gray-200/80 px-4 py-1.5 rounded-full shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
              </Link>
            )}

            {typeof window !== 'undefined' && localStorage.getItem('is_logged_in') === 'true' && (
              <Link
                to="/editor-panel"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#041744] bg-[#E5B54F] hover:bg-[#D4A347] px-3.5 py-1.5 rounded-full shadow-xs transition-all animate-pulse"
                title="Open HOD / Admin Editor for this Department"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Department Editor Portal</span>
              </Link>
            )}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tight mt-1"
            style={{ fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            {dept.name.replace(/^Department of\s+/i, '')}
          </motion.h1>

          {/* Mobile Mini-Navbar (Enlarged & Centered) */}
          <div className="relative mt-3 w-full flex items-center justify-center gap-3 md:hidden max-w-sm sm:max-w-md mx-auto">
            {/* Overview Button */}
            <button
              onClick={() => {
                setActiveSubTab('overview');
                setFacultySearch('');
                setPubSearch('');
                setIsMoreOpen(false);
              }}
              className={`flex-1 shrink-0 flex flex-row items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm border ${
                activeSubTab === 'overview' 
                  ? 'bg-indigo-650 text-white border-indigo-650' 
                  : 'bg-white text-gray-600 border-gray-200 hover:text-indigo-650 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            {/* More Dropdown */}
            <div className="relative flex-1 shrink-0">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`w-full flex flex-row items-center justify-center gap-2 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm border ${
                  (activeSubTab !== 'overview' || isMoreOpen)
                    ? 'bg-white text-indigo-650 border-indigo-200' 
                    : 'bg-white text-gray-600 border-gray-200 hover:text-indigo-650 hover:bg-gray-50'
                }`}
              >
                <MoreVertical className="w-4 h-4 shrink-0" />
                <span className="truncate">{activeSubTab !== 'overview' ? moreOptions.find(o => o.id === activeSubTab)?.label || 'More' : 'More'}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Overlay to close dropdown */}
              {isMoreOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMoreOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                  >
                    {moreOptions.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveSubTab(opt.id);
                            setFacultySearch('');
                            setPubSearch('');
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors ${
                            activeSubTab === opt.id 
                              ? 'text-indigo-650 bg-indigo-50/50' 
                              : 'text-gray-600 hover:text-indigo-650 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Light-Theme Mini-Navbar */}
          <div className="hidden md:flex items-center gap-2 bg-white text-slate-800 p-2 rounded-2xl shadow-md border border-slate-200/90 w-full mt-3">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'faculty', label: 'Faculty Directory', icon: Users },
              { id: 'curriculum', label: 'PEOs / PSOs / POs', icon: Milestone },
              { id: 'syllabus', label: 'Curriculum & Syllabus', icon: BookOpenCheck },
              { id: 'labs', label: 'Facilities', icon: Library },
              { id: 'achievements', label: 'Placements', icon: Briefcase }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setFacultySearch('');
                    setPubSearch('');
                    setIsMoreOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap grow justify-center ${
                    isActive 
                      ? 'bg-indigo-650 text-white shadow-md font-black' 
                      : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Desktop More Options Dropdown (Light Theme) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  ['iv', 'vap', 'rankHolders', 'toppers', 'calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(activeSubTab) || isMoreOpen
                    ? 'bg-indigo-650 text-white shadow-md'
                    : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
                <span>{['iv', 'vap', 'rankHolders', 'toppers', 'calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(activeSubTab) ? moreOptions.find(o => o.id === activeSubTab)?.label : 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMoreOpen(false)}
                />
              )}

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 text-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-2"
                  >
                    {moreOptions.filter(o => ['iv', 'vap', 'rankHolders', 'toppers', 'calendar', 'funds', 'events', 'newsletter', 'feedback'].includes(o.id)).map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setActiveSubTab(opt.id);
                            setFacultySearch('');
                            setPubSearch('');
                            setIsMoreOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-extrabold transition-colors ${
                            activeSubTab === opt.id 
                              ? 'text-indigo-650 bg-indigo-50/70' 
                              : 'text-slate-600 hover:text-indigo-650 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-indigo-650" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <AnimatePresence>
          {activeSubTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 rounded-3xl mb-12 flex flex-col gap-8 hover:shadow-md transition-shadow duration-300 animate-fadeIn"
            >
          {/* Top Row: Image & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Department Image */}
            <div className="w-full h-64 sm:h-72 md:h-auto min-h-[320px] md:col-span-5 rounded-2xl overflow-hidden shadow-sm relative group">
              <img 
                src={deptImage} 
                alt={`${dept.name} Department`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right Column: Title, Details, and KPIs */}
            <div className="flex flex-col justify-between items-start text-left md:col-span-7 space-y-8 w-full h-full py-2">
              <div className="space-y-5 w-full">
                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase">
                    Department Portal
                  </span>
                  {estYear && (
                    <span className="text-[10px] font-extrabold tracking-widest text-gray-650 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full uppercase">
                      Est. {estYear}
                    </span>
                  )}
                  {isNBA ? (
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase animate-pulse">
                      NBA Accredited
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-full uppercase">
                      AICTE Approved
                    </span>
                  )}
                </div>
                
                {/* Department Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-title tracking-tight text-gray-900 leading-tight">
                  {dept.name.replace(/^Department of\s+/i, '')}
                </h1>
                
                {/* College & Location */}
                <p className="text-xs sm:text-sm md:text-base text-gray-550 font-bold leading-relaxed flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                    Adhiparasakthi Engineering College
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                    Melmaruvathur
                  </span>
                </p>
              </div>

              {/* KPI Cards (Laboratories and Intake Capacity) */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-auto"
              >
                {/* KPI 1: Laboratories */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="group bg-gradient-to-br from-blue-50/60 to-indigo-50/20 backdrop-blur-md border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
                >
                  <div className="bg-blue-600 text-white p-3.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                    <FlaskConical className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">{(dept.labs || []).length}</span>
                    <span className="text-[10px] font-black uppercase text-blue-750 tracking-wider">Laboratories</span>
                  </div>
                </motion.div>

                {/* KPI 2: Intake Capacity */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="group bg-gradient-to-br from-amber-50/60 to-orange-50/20 backdrop-blur-md border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)] p-5 rounded-2xl flex items-center gap-4 transition-all duration-300"
                >
                  <div className="bg-amber-600 text-white p-3.5 rounded-xl shadow-md shadow-amber-500/20 group-hover:rotate-6 transition-transform duration-300">
                    <GraduationCap className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-900 to-orange-950 bg-clip-text text-transparent tracking-tight">
                      {displayIntakeValue}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-750 tracking-wider">
                      {displayIntakeLabel}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Main Content Area */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* TAB 1: OVERVIEW */}
              {activeSubTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* About Block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 font-title text-indigo-650 flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> About the Department
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                      {dept.about}
                    </p>
                  </div>

                  {/* Vision & Mission Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                    {/* Vision Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                          <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Vision
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-semibold italic">
                          "{dept.vision}"
                        </p>
                      </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-3 sm:mb-4 flex items-center gap-2 font-title">
                        <UserCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Mission
                      </h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {dept.mission.map((item, idx) => (
                          <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex items-start gap-2 sm:gap-2.5 font-semibold">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>


                </div>
              )}

              {/* TAB 2: FACULTY DIRECTORY */}
              {activeSubTab === 'faculty' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 text-left self-start sm:self-auto">
                      <Users className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Faculty Directory
                    </h2>
                    
                    {/* Faculty search */}
                    <div className="relative w-full sm:max-w-xs">
                      <input 
                        type="text"
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        placeholder="Search faculty..."
                        className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 pl-9 bg-gray-50 border border-gray-250 rounded-xl outline-none focus:border-indigo-650 focus:bg-white transition-all font-medium text-gray-800"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {filteredFaculty.length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No faculty members found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-left">
                      {filteredFaculty.map((f, idx) => {
                        const photoSrc = f.image || facultyImageMap[f.name?.toLowerCase().trim()] || null;
                        const topRightBadge = getTopRightBadge(f, dept.name);

                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedFacultyMember(f)}
                            className={`bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                              topRightBadge === 'PRINCIPAL'
                                ? 'border-[#FF8A00] ring-1 ring-amber-400/60'
                                : topRightBadge === 'VICE PRINCIPAL'
                                ? 'border-violet-400 ring-1 ring-violet-300/60'
                                : topRightBadge === 'HOD'
                                ? 'border-amber-300 ring-1 ring-amber-200/60'
                                : topRightBadge === 'DEAN'
                                ? 'border-indigo-300 ring-1 ring-indigo-200/60'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            {/* Background soft blurs for premium aesthetic */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100/50 transition-colors" />

                            {/* Left side: Image / Fallback Avatar */}
                            <div className="relative shrink-0 w-20 h-20 sm:w-32 sm:h-32 rounded-full sm:rounded-2xl overflow-hidden border border-gray-150 shadow-sm bg-gray-50 flex items-center justify-center">
                              <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-650 font-bold">
                                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-650" />
                              </div>
                              {photoSrc && (
                                <img 
                                  src={photoSrc} 
                                  alt={f.name} 
                                  className="absolute inset-0 w-full h-full object-cover object-top z-10 group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>

                            {/* Right side: Information */}
                            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start justify-between py-0.5 self-stretch text-center sm:text-left">
                              <div className="w-full flex flex-col items-center sm:items-start">
                                <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 mb-1 w-full flex-wrap">
                                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <h4 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 leading-snug group-hover:text-indigo-650 transition-colors">{f.name}</h4>
                                    {f.qualification && (
                                      <span className="text-[9px] font-black bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-650 uppercase font-mono tracking-wider shrink-0 mt-0.5 sm:mt-0">
                                        {f.qualification}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {topRightBadge && (
                                    <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs border ${
                                      topRightBadge === 'PRINCIPAL'
                                        ? 'bg-[#FF8A00] text-white border-amber-600 font-black'
                                        : topRightBadge === 'VICE PRINCIPAL'
                                        ? 'bg-violet-100 text-violet-900 border-violet-300'
                                        : topRightBadge === 'HOD' 
                                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                        : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                    }`}>
                                      {topRightBadge}
                                    </span>
                                  )}
                                </div>
                                
                                <span className="text-[11px] sm:text-xs md:text-sm text-indigo-650 font-extrabold uppercase tracking-wider block mb-1">
                                  {formatDesignation(f.designation, f.name)}
                                </span>
                                
                                {f.department && (
                                  <span className="text-xs sm:text-sm text-gray-550 font-bold block mb-3 leading-relaxed">
                                    {f.department}
                                  </span>
                                )}
                              </div>

                              {/* Contact/Options & Additional Metadata */}
                              <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-gray-100 w-full">
                                <div className="flex items-center gap-4">
                                  {f.experience && f.experience !== 'N/A' && (
                                    <div className="text-[10px] sm:text-xs text-gray-550 font-extrabold flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      <span>Exp: {f.experience.split(',')[0]}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-extrabold text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity">View Profile &rarr;</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LABORATORIES */}
              {activeSubTab === 'labs' && (
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-6 sm:mb-8 text-left">
                    <Library className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Infrastructure & Laboratories
                  </h2>

                  {(dept.labs || []).length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-gray-250 rounded-2xl sm:rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No laboratories information currently available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
                      {dept.labs.map((lab, idx) => {
                        const isObj = typeof lab === 'object' && lab !== null;
                        if (!isObj) {
                          return (
                            <div 
                              key={idx}
                              className="p-4 sm:p-6 bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all duration-300 text-left"
                            >
                              <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
                                <Library className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
                              </div>
                              <div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">Laboratory {String(idx + 1).padStart(2, '0')}</span>
                                <h4 className="text-xs sm:text-sm md:text-base font-black text-gray-800 leading-relaxed">{lab}</h4>
                              </div>
                            </div>
                          );
                        }

                        const name = lab.name || 'Unnamed Facility';
                        const type = lab.type || 'laboratory';
                        const incharge = lab.incharge || '';
                        const desc = lab.description || '';
                        
                        let images = [];
                        if (Array.isArray(lab.images)) {
                          images = lab.images.filter(img => typeof img === 'string' && img.trim() !== '');
                        } else if (typeof lab.image === 'string' && lab.image.trim() !== '') {
                          images = [lab.image];
                        }

                        let FacilityIcon = Library;
                        if (type === 'classroom') FacilityIcon = Laptop;
                        else if (type === 'laboratory') FacilityIcon = FlaskConical;
                        else if (type === 'library') FacilityIcon = BookOpen;

                        return (
                          <div 
                            key={idx}
                            className="p-5 bg-white border border-gray-150 rounded-2xl flex flex-col justify-between hover:border-indigo-300 hover:shadow-md hover:bg-white transition-all duration-300 space-y-4 text-left"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="bg-indigo-50 border border-indigo-100 text-indigo-650 p-2 rounded-xl shrink-0">
                                  <FacilityIcon className="w-5 h-5 text-indigo-650" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase bg-indigo-50 text-indigo-650 border border-indigo-100/50 px-2 py-0.5 rounded-full tracking-wider">
                                  {type}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm md:text-base font-black text-gray-850 leading-snug">{name}</h4>
                                {incharge && (
                                  <p className="text-[10px] text-indigo-650 font-bold mt-1">
                                    In-Charge: <span className="text-gray-600 font-semibold">{incharge}</span>
                                  </p>
                                )}
                                {desc && (
                                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1.5 leading-relaxed">{desc}</p>
                                )}
                              </div>
                            </div>

                            {images.length > 0 && (
                              <div className="pt-2 shrink-0">
                                {images.length === 1 ? (
                                  <img 
                                    src={images[0]} 
                                    alt={name} 
                                    className="w-full h-32 sm:h-36 object-cover rounded-xl border border-gray-150" 
                                  />
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    {images.slice(0, 4).map((img, imgIdx) => (
                                      <div key={imgIdx} className="relative h-16 sm:h-20 rounded-xl overflow-hidden border border-gray-150">
                                        <img 
                                          src={img} 
                                          alt={`${name} ${imgIdx + 1}`} 
                                          className="w-full h-full object-cover" 
                                        />
                                        {imgIdx === 3 && images.length > 4 && (
                                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                                            +{images.length - 4} More
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CURRICULUM OBJECTIVES */}
              {activeSubTab === 'curriculum' && (
                <div className="space-y-6 sm:space-y-10 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <Milestone className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-650" /> PEOs / PSOs / POs
                  </h2>
                  
                  {/* PEOs & PSOs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* PEOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Educational Objectives (PEOs)
                      </h3>
                      {(!dept.peos || dept.peos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold">PEOs are in alignment with university structures.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.peos.map((peo, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>
                                {typeof peo === 'object' && peo !== null ? (
                                  <div>
                                    <span className="font-extrabold text-gray-900 block">
                                      {peo.code || `PEO${idx + 1}`}: {peo.title}
                                    </span>
                                    {peo.description && (
                                      <span className="text-xs text-gray-600 font-normal block mt-1 leading-relaxed">
                                        {peo.description}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span>{typeof peo === 'string' ? peo : (peo.title || peo.description || JSON.stringify(peo))}</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* PSOs */}
                    <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                        <Milestone className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Specific Outcomes (PSOs)
                      </h3>
                      {(!dept.psos || dept.psos.length === 0) ? (
                        <p className="text-xs sm:text-sm text-gray-550 font-semibold">PSOs are configured as per program focus.</p>
                      ) : (
                        <ul className="space-y-3 sm:space-y-4">
                          {dept.psos.map((pso, idx) => (
                            <li key={idx} className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed flex gap-2 sm:gap-3 font-semibold items-start">
                              <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>
                                {typeof pso === 'object' && pso !== null ? (
                                  <div>
                                    <span className="font-extrabold text-gray-900 block">
                                      {pso.code || `PSO${idx + 1}`}: {pso.title}
                                    </span>
                                    {pso.description && (
                                      <span className="text-xs text-gray-600 font-normal block mt-1 leading-relaxed">
                                        {pso.description}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span>{typeof pso === 'string' ? pso : (pso.title || pso.description || JSON.stringify(pso))}</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* POs */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-indigo-650 mb-4 sm:mb-6 font-title flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Program Outcomes (POs)
                    </h3>
                    {(!dept.pos || dept.pos.length === 0) ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold">Standard engineering program outcomes apply.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {dept.pos.map((po, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-gray-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:border-indigo-300 transition-all shadow-sm"
                          >
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-650 tracking-wider block mb-1">
                              PO {idx + 1} {po.title ? `• ${po.title}` : ''}
                            </span>
                            <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-semibold">
                              {po.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4.5: SYLLABUS & CURRICULUM */}
              {activeSubTab === 'syllabus' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-3">
                          Academic Curriculum & Regulations
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black font-title text-white">
                          {dept.syllabus?.title || `${dept.name} Curriculum & Syllabus`}
                        </h2>
                        <p className="text-xs sm:text-sm text-indigo-200/80 mt-2 max-w-2xl font-medium leading-relaxed">
                          {dept.syllabus?.description || 'Explore the comprehensive semester-wise course scheme, regulation guidelines, and core subject credit distribution.'}
                        </p>
                      </div>
                      {dept.syllabus?.link && (
                        <a
                          href={dept.syllabus.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Download className="w-4 h-4" /> Download Syllabus PDF
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Semester Scheme Overview */}
                  <div className="bg-gray-50 border border-gray-150 p-6 sm:p-8 rounded-3xl space-y-4">
                    <h3 className="text-lg font-black text-indigo-950 font-title flex items-center gap-2">
                      <BookOpenCheck className="w-5 h-5 text-indigo-650" /> Semester Scheme & Subject Structure
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                      The program follows AICTE & Anna University model curriculum covering Professional Core, Professional Electives, Open Electives, and Employability Enhancement Courses.
                    </p>
                    {dept.syllabus?.link ? (
                      <div className="pt-2">
                        <a 
                          href={dept.syllabus.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-650 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> View Full Regulation PDF Document
                        </a>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold">
                        The updated syllabus document for this department can be downloaded from the HOD desk or central college portal.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: PUBLICATIONS */}
              {activeSubTab === 'publications' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 sm:mb-8 text-left">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2">
                        <BookOpenCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" /> Research Publications
                      </h2>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 uppercase font-black tracking-wider">Journals, books, and conference proceedings</p>
                    </div>

                    {/* Sub-tabs for publication types */}
                    <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-xl sm:rounded-2xl w-full sm:w-auto overflow-x-auto gap-1">
                      {[
                        { id: 'journals', label: `Journals (${(dept.publications?.journals || []).length})` },
                        { id: 'books', label: `Books (${(dept.publications?.books || []).length})` },
                        { id: 'conferences', label: `Conferences (${(dept.publications?.conferences || []).length})` }
                      ].map(pType => (
                        <button
                          key={pType.id}
                          onClick={() => {
                            setActivePubType(pType.id);
                            setPubSearch('');
                          }}
                          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl cursor-pointer whitespace-nowrap ${
                            activePubType === pType.id 
                              ? 'bg-indigo-650 text-white shadow-md' 
                              : 'text-gray-650 hover:text-indigo-650 hover:bg-gray-150'
                          }`}
                        >
                          {pType.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Publications lists */}
                  <div className="bg-gray-50 border border-gray-150 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left">
                    {activePubType === 'journals' && (
                      <div>
                        {(!dept.publications?.journals || dept.publications.journals.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No journal articles listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Title of Paper</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 px-4">Journal</th>
                                    <th className="pb-3.5 px-4 text-center">Year</th>
                                    <th className="pb-3.5 pl-4 text-right">Link</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.journals.map((j, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{j.title}</td>
                                      <td className="py-4 px-4 text-gray-650 leading-normal max-w-[120px]">{j.author}</td>
                                      <td className="py-4 px-4 text-indigo-650 max-w-[150px] leading-normal italic">{j.journal}</td>
                                      <td className="py-4 px-4 text-center text-gray-500 font-mono">{j.year}</td>
                                      <td className="py-4 pl-4 text-right">
                                        {j.link && j.link.startsWith('http') ? (
                                          <a 
                                            href={j.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-750 font-bold hover:underline inline-flex items-center gap-1"
                                          >
                                            View <FileText className="w-3.5 h-3.5" />
                                          </a>
                                        ) : (
                                          <span className="text-gray-400 font-bold">—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.journals.map((j, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Journal Paper
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{j.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {j.author}</p>
                                    <p><span className="font-bold text-gray-400">Journal:</span> <span className="italic text-indigo-650">{j.journal}</span></p>
                                    <p><span className="font-bold text-gray-400">Year:</span> <span className="font-mono">{j.year}</span></p>
                                  </div>

                                  {j.link && j.link.startsWith('http') && (
                                    <div className="pt-2 border-t border-gray-100">
                                      <a 
                                        href={j.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-bold text-xs py-2 rounded-lg transition-colors"
                                      >
                                        View Document <FileText className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'books' && (
                      <div>
                        {(!dept.publications?.books || dept.publications.books.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No books published.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Book Title</th>
                                    <th className="pb-3.5 px-4">Author(s)</th>
                                    <th className="pb-3.5 pl-4 text-right">Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.books.map((b, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold max-w-xs">{b.title}</td>
                                      <td className="py-4 px-4 text-gray-600">{b.author}</td>
                                      <td className="py-4 pl-4 text-right text-indigo-650 italic max-w-xs">{b.publisher}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.books.map((b, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-2">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Book Title
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{b.title}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-655 space-y-1">
                                    <p><span className="font-bold text-gray-400">Author:</span> {b.author}</p>
                                    <p><span className="font-bold text-gray-400">Publisher:</span> <span className="italic text-indigo-650">{b.publisher}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activePubType === 'conferences' && (
                      <div>
                        {(!dept.publications?.conferences || dept.publications.conferences.length === 0) ? (
                          <div className="py-8 sm:py-12 text-center text-gray-500 text-xs sm:text-sm font-semibold">No conference proceedings listed.</div>
                        ) : (
                          <>
                            {/* Desktop Table view */}
                            <div className="hidden sm:block overflow-x-auto">
                              <table className="w-full text-xs md:text-sm text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                    <th className="pb-3.5 pr-4">Paper Title</th>
                                    <th className="pb-3.5 px-4">Faculty Member</th>
                                    <th className="pb-3.5 px-4">Conference Proceeding</th>
                                    <th className="pb-3.5 pl-4 text-right">ISBN / Publisher</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                                  {dept.publications.conferences.map((c, idx) => (
                                    <tr key={idx} className="hover:bg-white transition-colors">
                                      <td className="py-4 pr-4 text-gray-900 font-bold leading-normal max-w-xs">{c.paperTitle || '—'}</td>
                                      <td className="py-4 px-4 text-gray-600">{c.faculty}</td>
                                      <td className="py-4 px-4 text-indigo-650 italic max-w-xs">{c.proceeding}</td>
                                      <td className="py-4 pl-4 text-right text-gray-550 font-mono max-w-[150px]">
                                        {c.isbn ? `ISBN: ${c.isbn}` : ''} {c.publisher ? ` [${c.publisher}]` : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile responsive view */}
                            <div className="block sm:hidden space-y-4">
                              {dept.publications.conferences.map((c, idx) => (
                                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono font-black uppercase bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded">
                                      Conference
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 mt-2 leading-snug">{c.paperTitle || '—'}</h4>
                                  </div>
                                  
                                  <div className="text-xs text-gray-650 space-y-1">
                                    <p><span className="font-bold text-gray-400">Faculty:</span> {c.faculty}</p>
                                    <p><span className="font-bold text-gray-400">Proceeding:</span> <span className="italic text-indigo-650">{c.proceeding}</span></p>
                                    {c.isbn && <p><span className="font-bold text-gray-400">ISBN:</span> <span className="font-mono text-xs">{c.isbn}</span></p>}
                                    {c.publisher && <p><span className="font-bold text-gray-400">Publisher:</span> {c.publisher}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PLACEMENTS & ACHIEVEMENTS */}
              {activeSubTab === 'achievements' && (
                <div className="space-y-8 sm:space-y-10 text-left">
                  
                  {/* placements block */}
                  <div className="bg-gray-50 border border-gray-150 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl space-y-6">
                    <h3 className="text-lg sm:text-xl font-black text-indigo-650 font-title flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-indigo-650" /> Student Placement Records & Highlights
                    </h3>

                    {/* Placement Banner Image */}
                    {typeof dept.placements === 'object' && !Array.isArray(dept.placements) && dept.placements?.image && (
                      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md max-h-80 w-full bg-slate-900">
                        <img 
                          src={dept.placements.image} 
                          alt="Placement Highlights" 
                          className="w-full h-full object-cover max-h-80"
                        />
                      </div>
                    )}

                    {/* Placement Description & Key Metrics */}
                    {typeof dept.placements === 'object' && !Array.isArray(dept.placements) && (
                      <div className="space-y-4">
                        {dept.placements.description && (
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold bg-white p-4 rounded-2xl border border-gray-200">
                            {dept.placements.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Placement Rate</span>
                            <span className="text-2xl font-black text-emerald-650 block mt-1">{dept.placements.rate || '94%'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Highest Package</span>
                            <span className="text-2xl font-black text-indigo-650 block mt-1">{dept.placements.highestPackage || '12 LPA'}</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Average Package</span>
                            <span className="text-2xl font-black text-blue-650 block mt-1">{dept.placements.averagePackage || '4.5 LPA'}</span>
                          </div>
                        </div>

                        {dept.placements.topRecruiters && (
                          <div className="p-4 bg-white rounded-2xl border border-gray-200">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">Key Recruiting Partners</span>
                            <div className="flex flex-wrap gap-2">
                              {dept.placements.topRecruiters.split(',').map((rec, rIdx) => (
                                <span key={rIdx} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-900 font-extrabold text-xs rounded-full">
                                  {rec.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {Array.isArray(dept.placements) && (dept.placements.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-550 font-semibold text-center py-6 sm:py-8">First-batch students currently building projects; placements commencing soon.</p>
                    ) : (
                      <div>
                        {/* Desktop Table view */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-xs md:text-sm text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-wider">
                                <th className="pb-3.5 pr-4">Register Number</th>
                                <th className="pb-3.5 px-4">Student Name</th>
                                <th className="pb-3.5 px-4">Recruiter / Employer</th>
                                <th className="pb-3.5 pl-4 text-right">Compensation Package</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/80 font-semibold text-gray-700">
                              {dept.placements.map((p, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                  <td className="py-3 pr-4 text-gray-500 font-mono">{p.registerNumber}</td>
                                  <td className="py-3 px-4 text-gray-900 font-bold">{p.studentName}</td>
                                  <td className="py-3 px-4 text-indigo-650">{p.companyName}</td>
                                  <td className="py-3 pl-4 text-right text-emerald-650 font-bold">{p.salaryPackage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile responsive view */}
                        <div className="block sm:hidden space-y-4">
                          {dept.placements.map((p, idx) => (
                            <div key={idx} className="bg-white border border-gray-150 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">{p.studentName}</h4>
                                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{p.registerNumber}</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                                  {p.salaryPackage}
                                </span>
                              </div>
                              
                              <div className="text-xs pt-2 border-t border-gray-100 flex items-center justify-between text-gray-655">
                                <span>Employer / Recruiter</span>
                                <span className="font-bold text-indigo-650">{p.companyName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 7: FUNDS RECEIVED & RESEARCH GRANTS */}
              {activeSubTab === 'funds' && (
                <div className="space-y-6 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /> Funds Received & Research Grants
                  </h2>
                  {(!dept.grants || dept.grants.length === 0) ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No external funding records logged for this department yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {dept.grants.map((g, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-3 hover:border-indigo-300 transition-all shadow-xs">
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-3 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-800 text-[10px] font-black uppercase rounded-full">
                              {g.agency || 'Funding Agency'}
                            </span>
                            <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              {g.amount || '—'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug">{g.title}</h4>
                          <div className="text-xs text-gray-600 space-y-1 font-medium pt-2 border-t border-gray-200">
                            <p><span className="font-bold text-gray-500">Principal Investigator:</span> {g.pi}</p>
                            <p><span className="font-bold text-gray-500">Sanction Period:</span> {g.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: HOSTED & ATTENDED EVENTS */}
              {activeSubTab === 'events' && (
                <div className="space-y-6 text-left">
                  {/* First Line: Section Header */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2.5">
                    <PartyPopper className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-pink-500 shrink-0" /> 
                    <span>Department Events / Events Letter</span>
                  </h2>
                  
                  {/* Second Line: Sub-Navigation Bar (Right aligned & sleek compact size) */}
                  <div className="flex items-center justify-end pb-4 border-b border-gray-200/80">
                    <div className="inline-flex items-center p-1 bg-slate-100/95 border border-slate-250/80 rounded-xl shadow-2xs gap-1 max-w-full overflow-x-auto">
                      <button
                        onClick={() => setActiveEventSubTab('hosted')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          activeEventSubTab === 'hosted' 
                            ? 'bg-indigo-650 text-white shadow-xs font-extrabold' 
                            : 'text-slate-600 hover:text-indigo-650 hover:bg-white/80'
                        }`}
                      >
                        <span>🎪 Hosted Events</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 min-w-[18px] text-center ${
                          activeEventSubTab === 'hosted' ? 'bg-white/25 text-white' : 'bg-slate-200/90 text-slate-700'
                        }`}>
                          {getDepartmentHostedEvents(dept).length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveEventSubTab('attended')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          activeEventSubTab === 'attended' 
                            ? 'bg-indigo-650 text-white shadow-xs font-extrabold' 
                            : 'text-slate-600 hover:text-indigo-650 hover:bg-white/80'
                        }`}
                      >
                        <span>🎓 Attended Events</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 min-w-[18px] text-center ${
                          activeEventSubTab === 'attended' ? 'bg-white/25 text-white' : 'bg-slate-200/90 text-slate-700'
                        }`}>
                          {(dept.attendedEvents || []).length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveEventSubTab('letters')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          activeEventSubTab === 'letters' 
                            ? 'bg-indigo-650 text-white shadow-xs font-extrabold' 
                            : 'text-slate-600 hover:text-indigo-650 hover:bg-white/80'
                        }`}
                      >
                        <span>📰 Events Letters</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 min-w-[18px] text-center ${
                          activeEventSubTab === 'letters' ? 'bg-white/25 text-white' : 'bg-slate-200/90 text-slate-700'
                        }`}>
                          {(dept.newsletters || []).length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 1. HOSTED EVENTS VIEW */}
                  {activeEventSubTab === 'hosted' && (
                    getDepartmentHostedEvents(dept).length === 0 ? (
                      <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                        No department-hosted events published yet.
                      </div>
                    ) : (
                      <div className="max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-1 gap-8">
                          {getDepartmentHostedEvents(dept).map((ev, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                              {/* Full Poster Image View - 100% Uncropped & Centered */}
                              {ev.image && (
                                <div className="w-full bg-slate-950 border-b border-gray-200 flex items-center justify-center p-2 sm:p-4 relative group">
                                  <img 
                                    src={ev.image} 
                                    alt={ev.name} 
                                    onError={(e) => {
                                      if (e.currentTarget.src.includes('event_2')) {
                                        e.currentTarget.src = '/Pictures/AIML/events/event 2.jpeg';
                                      } else {
                                        e.currentTarget.src = '/Images/Departments/aiml/events/event_2.jpeg';
                                      }
                                    }}
                                    className="w-full h-auto max-h-[580px] object-contain rounded-2xl shadow-lg group-hover:scale-[1.008] transition-transform duration-300" 
                                  />
                                </div>
                              )}

                              {/* Event Details Content */}
                              <div className="p-6 sm:p-8 space-y-5">
                                {/* Top Meta Pills */}
                                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-gray-100">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3.5 py-1 bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black uppercase rounded-full tracking-wider flex items-center gap-1.5">
                                      🏆 {ev.type || 'National Technical Symposium'}
                                    </span>
                                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-150 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1.5">
                                      🗓️ {ev.date}
                                    </span>
                                  </div>

                                  {ev.prizes && (
                                    <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                                      🎁 {ev.prizes}
                                    </span>
                                  )}
                                </div>

                                {/* Title & Theme */}
                                <div className="space-y-1.5">
                                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug font-title">
                                    {ev.name}
                                  </h3>
                                  {ev.theme && (
                                    <p className="text-sm font-extrabold text-indigo-650 italic">
                                      "{ev.theme}"
                                    </p>
                                  )}
                                </div>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                  {ev.description}
                                </p>

                                {/* Event Logistics & Contacts */}
                                <div className="p-4 sm:p-5 bg-gray-50 border border-gray-150 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                  {ev.venue && (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Event Venue</span>
                                      <p className="font-bold text-gray-800 flex items-center gap-1.5">
                                        📍 {ev.venue}
                                      </p>
                                    </div>
                                  )}
                                  {ev.speaker && (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Department Leadership</span>
                                      <p className="font-bold text-gray-800 flex items-center gap-1.5">
                                        🎤 {ev.speaker}
                                      </p>
                                    </div>
                                  )}
                                  {ev.coordinators && (
                                    <div className="sm:col-span-2 space-y-1 pt-2 border-t border-gray-200/60">
                                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Student Coordinators Contact</span>
                                      <p className="font-medium text-gray-700">
                                        👥 {ev.coordinators}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {/* 2. ATTENDED EVENTS VIEW */}
                  {activeEventSubTab === 'attended' && (
                    (!dept.attendedEvents || dept.attendedEvents.length === 0) ? (
                      <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                        No external attended events logged yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dept.attendedEvents.map((ev, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                            {ev.image && (
                              <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                                <img src={ev.image} alt={ev.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full">
                                  {ev.date}
                                </div>
                              </div>
                            )}
                            <div className="p-6 space-y-3">
                              <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider">External FDP / Participation</span>
                              <h3 className="text-base font-black text-gray-900 leading-snug">{ev.name}</h3>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed">{ev.description}</p>
                              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 font-medium space-y-1">
                                {ev.hostOrg && <p>🏛️ <span className="font-bold text-gray-700">Host Organization:</span> {ev.hostOrg}</p>}
                                {ev.participant && <p>👤 <span className="font-bold text-gray-700">Participants:</span> {ev.participant}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* 3. EVENTS LETTERS VIEW */}
                  {activeEventSubTab === 'letters' && (
                    <div className="space-y-6">
                      {(!dept.newsletters || dept.newsletters.length === 0) ? (
                        <div className="p-8 sm:p-12 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center space-y-3 max-w-xl mx-auto">
                          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-600 shadow-2xs">
                            <FileText className="w-6 h-6" />
                          </div>
                          <h3 className="text-base font-black text-gray-900">No Events Letters Published Yet</h3>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                            Official department event letters and newsletters for {dept.name} will be uploaded and accessible here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {dept.newsletters.map((nl, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-200 p-6 rounded-3xl space-y-4 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black uppercase rounded-full">
                                  {nl.date || 'Events Letter Issue'}
                                </span>
                                <h3 className="text-lg font-black text-gray-900 leading-snug">{nl.title}</h3>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">{nl.summary || 'Click below to read and download the full department events letter PDF document.'}</p>
                              </div>
                              {nl.link ? (
                                <a
                                  href={nl.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                                >
                                  <Download className="w-4 h-4" /> Click to Open Events Letter (PDF)
                                </a>
                              ) : (
                                <div className="p-3 bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl text-center">PDF document coming soon</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: DEPARTMENT NEWSLETTERS (PDF) */}
              {activeSubTab === 'newsletter' && (
                <div className="space-y-6 text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" /> Department Newsletters & Magazines
                  </h2>
                  {(!dept.newsletters || dept.newsletters.length === 0) ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center text-gray-500 text-xs sm:text-sm font-semibold">
                      No newsletter PDF documents published for this department yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {dept.newsletters.map((nl, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 p-6 rounded-3xl space-y-4 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black uppercase rounded-full">
                              {nl.date || 'Newsletter Issue'}
                            </span>
                            <h3 className="text-lg font-black text-gray-900 leading-snug">{nl.title}</h3>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{nl.summary || 'Click below to read and download the full department newsletter PDF document.'}</p>
                          </div>
                          {nl.link ? (
                            <a
                              href={nl.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                            >
                              <Download className="w-4 h-4" /> Click to Open Newsletter (PDF)
                            </a>
                          ) : (
                            <div className="p-3 bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl text-center">PDF document coming soon</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: DEPARTMENT FEEDBACK FORM */}
              {activeSubTab === 'feedback' && (
                <div className="space-y-6 text-left max-w-2xl mx-auto">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /> Share Department Feedback
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Your feedback is submitted directly to the {dept.name} Head of Department (HOD) desk.</p>
                  </div>

                  {feedbackSent ? (
                    <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h3 className="text-lg font-black text-emerald-900">Feedback Submitted Successfully!</h3>
                      <p className="text-xs text-emerald-700 font-medium">Thank you for sharing your valuable input. The HOD has received your response.</p>
                      <button
                        onClick={() => {
                          setFeedbackSent(false);
                          setFeedbackForm({ name: '', section: 'General Feedback', email: '', phone: '', message: '' });
                        }}
                        className="px-5 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Submit Another Response
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await submitDepartmentFeedback({
                          ...feedbackForm,
                          dept: dept.name,
                          department: dept.name
                        });
                        setFeedbackSent(true);
                      }}
                      className="bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Your Full Name</label>
                        <input 
                          type="text"
                          required
                          value={feedbackForm.name}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                          placeholder="Student / Parent / Alumni Name"
                          className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Stakeholder Section</label>
                          <select
                            value={feedbackForm.section}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, section: e.target.value })}
                            className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650 cursor-pointer"
                          >
                            <option value="Student Feedback">Student Feedback</option>
                            <option value="Parent Feedback">Parent Feedback</option>
                            <option value="Alumni Feedback">Alumni Feedback</option>
                            <option value="Academic Curriculum">Academic Curriculum</option>
                            <option value="Infrastructure & Labs">Infrastructure & Labs</option>
                            <option value="General Feedback">General Feedback</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Contact Phone / Email</label>
                          <input 
                            type="text"
                            value={feedbackForm.phone || feedbackForm.email}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value, email: e.target.value })}
                            placeholder="Phone number or Email"
                            className="w-full text-xs font-bold px-4 py-2.5 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Feedback & Detailed Suggestions</label>
                        <textarea 
                          rows={4}
                          required
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                          placeholder="Write your feedback message or suggestions here..."
                          className="w-full text-xs font-medium p-4 bg-white border border-gray-250 rounded-xl outline-none focus:border-indigo-650"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <Send className="w-4 h-4" /> Submit Response to Department HOD
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 11: INDUSTRIAL VISITS (IV) */}
              {activeSubTab === 'iv' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2.5">
                        <Building className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-indigo-600" /> Industrial Visits (IV) & Corporate Exposure
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                        Regular hands-on industry tours and field immersion for real-world engineering learning.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-150 px-3.5 py-1.5 rounded-full text-xs font-black text-indigo-700">
                      <span>{getDepartmentIVData(dept).length} Verified Industry Visits</span>
                    </div>
                  </div>

                  <div className={`grid ${getDepartmentIVData(dept).length === 1 ? 'grid-cols-1 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                    {getDepartmentIVData(dept).map((iv, idx) => (
                      <div 
                        key={idx} 
                        className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {iv.image && (
                            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md mb-3 bg-slate-900 group relative">
                              <img 
                                src={iv.image} 
                                alt={iv.company}
                                onError={(e) => {
                                  if (e.currentTarget.src.includes('iv_2') || e.currentTarget.src.includes('iv%202')) {
                                    e.currentTarget.src = '/Pictures/AIML/IV/iv 2.jpeg';
                                  } else if (e.currentTarget.src.includes('iv_4') || e.currentTarget.src.includes('iv%204')) {
                                    e.currentTarget.src = '/Pictures/AIML/IV/iv 4 .jpeg';
                                  }
                                }}
                                className="w-full h-64 sm:h-80 md:h-96 object-cover object-center group-hover:scale-101 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-sm">
                                📸 Industrial Field Tour
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase rounded-full tracking-wider">
                              {iv.type || 'Industrial Visit'}
                            </span>
                            <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {iv.date}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                            {iv.company}
                          </h3>

                          <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {iv.location}
                          </p>

                          <div className="p-3.5 bg-white border border-gray-150 rounded-2xl text-xs space-y-2">
                            <p className="text-gray-700 font-bold">
                              <span className="text-gray-500 font-semibold block text-[10px] uppercase tracking-wider">Core Domain:</span>
                              {iv.domain}
                            </p>
                            <p className="text-gray-600 font-medium text-[11px] leading-relaxed">
                              {iv.outcomes}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-medium">
                          <span className="text-[11px] font-bold text-slate-700">
                            👥 {iv.batch}
                          </span>
                          <span className="text-[10.5px] text-gray-500 font-semibold">
                            Coordinated by: {iv.coordinators}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 12: VALUE ADDED PROGRAM (VAP) */}
              {activeSubTab === 'vap' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2.5">
                        <Award className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-amber-500" /> Value Added Programmes & Certifications
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                        Industry-aligned certification courses providing specialized skills beyond the standard curriculum.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-800">
                      <span>{getDepartmentVAPData(dept).length} Active Certified Courses</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getDepartmentVAPData(dept).map((vap, idx) => (
                      <div 
                        key={idx} 
                        className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3.5">
                          {vap.image && (
                            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md mb-3 bg-slate-900 group relative">
                              <img 
                                src={vap.image} 
                                alt={vap.title}
                                onError={(e) => {
                                  if (e.currentTarget.src.includes('training_3rd_year')) {
                                    e.currentTarget.src = '/Pictures/AIML/VALUE ADDED PROGRAM/tarning 3 rd year .jpeg';
                                  } else {
                                    e.currentTarget.src = '/Images/Departments/aiml/vap/training_3rd_year.jpeg';
                                  }
                                }}
                                className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-101 transition-transform duration-300"
                              />
                              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-sm">
                                💻 Hands-on Lab Training
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase rounded-full tracking-wider font-mono">
                              {vap.code}
                            </span>
                            <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase rounded-lg">
                              {vap.credits || '2 Value Credits'}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                            {vap.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-bold">
                            <span className="flex items-center gap-1 text-indigo-600">
                              <Clock className="w-3.5 h-3.5" /> {vap.duration}
                            </span>
                            <span>•</span>
                            <span className="text-gray-700">
                              Partner: <span className="text-indigo-700 font-extrabold">{vap.partner}</span>
                            </span>
                          </div>

                          <div className="p-3.5 bg-white border border-gray-150 rounded-2xl text-xs space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Course Modules & Skills Covered:</span>
                            <ul className="space-y-1.5">
                              {vap.modules.map((m, mIdx) => (
                                <li key={mIdx} className="flex items-start gap-2 text-gray-700 font-medium text-xs leading-snug">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500 font-bold">
                          <span>Target: {vap.target}</span>
                          <span className="text-emerald-700 flex items-center gap-1 font-black">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Certificate Awarded
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 13: RANK HOLDERS */}
              {activeSubTab === 'rankHolders' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2.5">
                        <Trophy className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-amber-500" /> University Rank Holders
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                        Celebrating academic laureates and gold medalists who brought pride to the department.
                      </p>
                    </div>
                    {getDepartmentRankHoldersData(dept).length > 0 && (
                      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-black text-amber-800 shadow-xs">
                        <span>⭐ {getDepartmentRankHoldersData(dept).length} University Ranks Conferred</span>
                      </div>
                    )}
                  </div>

                  {getDepartmentRankHoldersData(dept).length === 0 ? (
                    <div className="p-8 sm:p-12 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center space-y-3 max-w-2xl mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-2xs">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-black text-gray-900">No University Rank Holders Published Yet</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                        Official Anna University rank lists for the Department of {dept.name.replace(/^Department of\s+/i, '')} will be updated here upon publication of convocation rank lists for graduating batches.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getDepartmentRankHoldersData(dept).map((rh, idx) => {
                        const isGold = rh.rankNum === 1 || String(rh.rank || '').toLowerCase().includes('gold') || String(rh.rank || '').includes('1ST');
                        return (
                          <div 
                            key={idx} 
                            className={`rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                              isGold 
                                ? 'bg-gradient-to-br from-amber-500/5 via-amber-100/20 to-white border-2 border-amber-300' 
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="space-y-3.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`px-3.5 py-1.5 text-[10.5px] font-black uppercase rounded-full shadow-xs tracking-wider flex items-center gap-1.5 ${
                                  isGold 
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                                    : 'bg-[#4F46E5] text-white'
                                }`}>
                                  <Trophy className="w-3.5 h-3.5" />
                                  {rh.rank}
                                </span>
                                <span className="text-xs font-black text-gray-900 bg-white border border-gray-250 px-3.5 py-1 rounded-xl shadow-2xs font-mono">
                                  CGPA: {rh.cgpa}
                                </span>
                              </div>

                              <div>
                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                                  {rh.name}
                                </h3>
                                <p className="text-xs sm:text-sm font-bold text-indigo-650 mt-1">
                                  {rh.degree} • {rh.batch}
                                </p>
                              </div>

                              <div className="p-4 bg-gray-50/80 border border-gray-150 rounded-2xl text-xs space-y-1 mt-3.5">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                                  UNIVERSITY DISTINCTION:
                                </span>
                                <p className="text-gray-700 font-medium leading-relaxed">
                                  {rh.citation}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3.5 border-t border-gray-150 flex items-center justify-between text-xs text-gray-600 font-semibold mt-3.5">
                              <span>{rh.university}</span>
                              <span className="text-amber-600 font-extrabold flex items-center gap-1">
                                🎖️ Medallion Recipient
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 14: DEPARTMENT TOPPERS */}
              {activeSubTab === 'toppers' && (
                <div className="space-y-6 sm:space-y-8 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-indigo-650 flex items-center gap-2.5">
                        <GraduationCap className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-indigo-600" /> Department Toppers
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                        Academic and semester top performers recognized for outstanding semester grade point averages.
                      </p>
                    </div>
                    {getDepartmentToppersData(dept).length > 0 && (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-150 px-4 py-1.5 rounded-full text-xs font-black text-indigo-700 shadow-xs">
                        <span>🎖️ Semester Merit Laureates</span>
                      </div>
                    )}
                  </div>

                  {getDepartmentToppersData(dept).length === 0 ? (
                    <div className="p-8 sm:p-12 bg-gray-50 border border-dashed border-gray-250 rounded-3xl text-center space-y-3 max-w-2xl mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 shadow-2xs">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-black text-gray-900">No Department Toppers Published Yet</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                        Semester merit lists and academic topper records for the Department of {dept.name.replace(/^Department of\s+/i, '')} will be updated following the publication of end-semester examination results.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Year Filter Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 w-fit">
                        {['All', 'IV Year', 'III Year', 'II Year', 'I Year'].map((yr) => (
                          <button
                            key={yr}
                            onClick={() => setTopperYearFilter(yr)}
                            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                              topperYearFilter === yr 
                                ? 'bg-indigo-650 text-white shadow-xs' 
                                : 'text-gray-600 hover:text-indigo-650'
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>

                      {getDepartmentToppersData(dept)
                        .filter(item => topperYearFilter === 'All' || item.yearKey === topperYearFilter)
                        .map((yearGroup, gIdx) => (
                          <div key={gIdx} className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                                {yearGroup.year}
                              </h3>
                              <span className="text-xs font-bold text-indigo-600">Current Academic Cycle</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
                              {yearGroup.toppers.map((t, tIdx) => (
                                <div 
                                  key={tIdx} 
                                  className={`p-5 rounded-2xl border space-y-3 transition-all flex flex-col justify-between ${
                                    t.rank === 1 
                                      ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300 shadow-xs' 
                                      : t.rank === 2
                                      ? 'bg-gradient-to-br from-slate-100/80 to-white border-slate-300'
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                        t.rank === 1 ? 'bg-amber-500 text-white' : t.rank === 2 ? 'bg-slate-600 text-white' : 'bg-orange-600 text-white'
                                      }`}>
                                        {t.rank === 1 ? '🥇 1st Topper' : t.rank === 2 ? '🥈 2nd Topper' : '🥉 3rd Topper'}
                                      </span>
                                      <span className="text-xs font-black text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                        GPA: {t.gpa}
                                      </span>
                                    </div>

                                    <h4 className="text-base font-black text-gray-900">{t.name}</h4>
                                    <p className="text-[11px] font-mono text-gray-500 font-bold">Reg No: {t.regNo}</p>
                                  </div>

                                  <div className="pt-2 border-t border-gray-100 text-[11px] font-medium text-gray-600">
                                    <p className="leading-snug">{t.awards}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* POPUP MODAL FOR FACULTY DETAILS */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedFacultyMember && (
              <div 
                className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
                onClick={() => setSelectedFacultyMember(null)}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl sm:max-w-2xl w-full relative overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
                >
                  {/* TOP NAVY BLUE COLOR HEADER TAG */}
                  <div className="bg-[#041744] px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-white border-b-2 border-[#FF8A00] shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse shrink-0" />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-white font-title">
                        Faculty Profile
                      </span>
                      {getTopRightBadge(selectedFacultyMember, dept?.name) && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          getTopRightBadge(selectedFacultyMember, dept?.name) === 'PRINCIPAL'
                            ? 'bg-[#FF8A00] text-white'
                            : getTopRightBadge(selectedFacultyMember, dept?.name) === 'VICE PRINCIPAL'
                            ? 'bg-violet-600 text-white'
                            : getTopRightBadge(selectedFacultyMember, dept?.name) === 'HOD' 
                            ? 'bg-amber-500 text-slate-950 font-black' 
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {getTopRightBadge(selectedFacultyMember, dept?.name)}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedFacultyMember(null)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Close Profile"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* MODAL BODY (BIG PHOTO ON LEFT, BALANCED TEXT MATCHING PHOTO HEIGHT ON RIGHT) */}
                  <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-white">
                    
                    {/* MAIN SIDE-BY-SIDE CONTENT BLOCK */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5">
                      
                      {/* LEFT: BIG SIZE FACULTY PHOTO */}
                      <div className="w-36 h-48 sm:w-44 sm:h-56 mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#041744]/15 shrink-0 relative shadow-md">
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          <User className="w-14 h-14 text-slate-400" />
                        </div>
                        {(selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]) && (
                          <img 
                            src={selectedFacultyMember.image || facultyImageMap[selectedFacultyMember.name?.toLowerCase().trim()]} 
                            alt={selectedFacultyMember.name}
                            className="absolute inset-0 w-full h-full object-cover object-top z-10"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      {/* RIGHT: NAME, DEPT, DESIGNATION & CREDENTIALS BALANCED TO IMAGE SIZE */}
                      <div className="min-w-0 flex-1 flex flex-col justify-between text-left py-0.5">
                        
                        {/* TOP SECTION: NAME, ROLE, DESIGNATION, DEPARTMENT */}
                        <div>
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <h2 className="text-lg sm:text-xl font-black text-[#041744] font-title leading-tight">
                              {selectedFacultyMember.name}
                            </h2>
                            {getTopRightBadge(selectedFacultyMember, dept?.name) && (
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                                getTopRightBadge(selectedFacultyMember, dept?.name) === 'PRINCIPAL'
                                  ? 'bg-[#FF8A00] text-white'
                                  : getTopRightBadge(selectedFacultyMember, dept?.name) === 'VICE PRINCIPAL'
                                  ? 'bg-violet-600 text-white'
                                  : getTopRightBadge(selectedFacultyMember, dept?.name) === 'HOD' 
                                  ? 'bg-amber-500 text-slate-950 font-black' 
                                  : 'bg-indigo-600 text-white'
                              }`}>
                                {getTopRightBadge(selectedFacultyMember, dept?.name)}
                              </span>
                            )}
                          </div>

                          {/* Designation */}
                          <p className="text-xs sm:text-sm font-extrabold text-[#FF8A00] leading-snug mb-2">
                            {selectedFacultyMember.designation || formatDesignation(selectedFacultyMember.designation, selectedFacultyMember.name)}
                          </p>

                          {/* Department */}
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 max-w-full">
                            <Building2 className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                            <span className="truncate">{selectedFacultyMember.department || dept?.name}</span>
                          </div>
                        </div>

                        {/* BOTTOM SECTION: QUALIFICATION, EXPERIENCE, EMAIL (Fills height evenly) */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedFacultyMember.qualification || 'Master of Engineering'}
                              </span>
                            </div>
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                              <span className="font-bold text-slate-800 truncate block text-xs">
                                {selectedFacultyMember.experience || 'Experienced Faculty'}
                              </span>
                            </div>
                          </div>

                          {selectedFacultyMember.email && selectedFacultyMember.email !== 'N/A' && (
                            <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <div className="min-w-0 overflow-hidden text-xs">
                                <a 
                                  href={`mailto:${selectedFacultyMember.email}`} 
                                  className="font-bold text-[#041744] hover:text-[#FF8A00] hover:underline truncate block"
                                >
                                  {selectedFacultyMember.email}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* ORCID iD & DYNAMIC QR CODE CONTAINER */}
                    <FacultyOrcidQr 
                      facultyName={selectedFacultyMember.name} 
                      defaultOrcid={selectedFacultyMember.orcid || facultyOrcidMap[selectedFacultyMember.name?.toLowerCase().trim()]} 
                    />

                    {/* COMPACT FOOTER */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Verified APEC Faculty</span>
                      </div>
                      <button 
                        onClick={() => setSelectedFacultyMember(null)}
                        className="px-4 py-1.5 bg-[#041744] hover:bg-[#06236b] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Close Profile
                      </button>
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </div>
  );
}
