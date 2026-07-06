import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { pathToFileURL } from 'url';

// Helper to make sure directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function build() {
  console.log("=== SCANNING WEBSITE & COMPILING LOCAL KNOWLEDGE BASE ===");

  const aiKnowledgeDir = 'Z:/src/ai/knowledge';
  ensureDirExists(aiKnowledgeDir);

  // 1. Extract Bus Routes programmatically from FacilityDetail.jsx
  let busRoutes = [];
  try {
    const facilityDetailContent = fs.readFileSync('Z:/src/pages/FacilityDetail.jsx', 'utf8');
    const startIdx = facilityDetailContent.indexOf('const busRoutesData = [');
    if (startIdx !== -1) {
      const endMarker = "export default function FacilityDetail()";
      const endIdx = facilityDetailContent.indexOf(endMarker, startIdx);
      if (endIdx !== -1) {
        let arrayCode = facilityDetailContent.substring(startIdx, endIdx).trim();
        arrayCode += "\nthis.busRoutesData = busRoutesData;";
        
        const sandbox = {};
        vm.createContext(sandbox);
        vm.runInContext(arrayCode, sandbox);
        
        if (sandbox.busRoutesData) {
          busRoutes = sandbox.busRoutesData.map(route => ({
            id: route.id,
            name: route.name,
            busNo: route.busNo,
            driver: route.driver,
            phone: route.phone,
            stops: route.stops.map(stop => ({
              name: stop.name,
              time: stop.time,
              threeMonth: stop.threeMonth,
              sixMonth: stop.sixMonth
            }))
          }));
          console.log(`✔ Extracted ${busRoutes.length} active bus routes from FacilityDetail.jsx`);
        }
      }
    }
  } catch (err) {
    console.error("Could not extract bus routes from FacilityDetail.jsx:", err.message);
  }

  // 2. College Info & Finance (from About.jsx, FeePayment.jsx, CutoffCalculator.jsx, etc.)
  const collegeInfo = {
    name: "Adhiparasakthi Engineering College",
    short_name: "APEC",
    established: "1984",
    founder: "His Holiness Arulthiru Bangaru Adigalar",
    location: "Melmaruvathur, Kanchipuram District, Tamil Nadu - 603319, India",
    accreditation: "NAAC Accredited with 'A' Grade, UGC Autonomous Institution, Affiliated to Anna University",
    tnea_counseling_code: "1401",
    helplines: ["+91 7418064336", "+91 7418065336"],
    emails: {
      principal: "principal@apec.edu.in",
      general: "info@apec.edu.in",
      admin: "admin@apec.ac.in"
    },
    cutoff_calculator: {
      total_score: 200,
      formula: "Mathematics (out of 100) + Physics / 2 (out of 50) + Chemistry / 2 (out of 50)",
      rule: "Math marks are taken fully, while Physics and Chemistry marks are halved, then all three are added together to get your engineering cutoff score out of 200."
    },
    fee_payment: {
      bank_name: "Central Bank of India",
      branch: "Melmaruvathur",
      ifsc_code: "CBIN0283083",
      account_name: "Adhiparasakthi Engineering College",
      modes: ["Net Banking", "UPI QR Code Scanning (GPay, PhonePe, Paytm, etc.)", "Direct Cash/Challan Deposit"],
      instructions: "To pay fees online, enter your Student Name, Department, and Fee Amount. The portal generates a dynamic UPI QR Code. Ensure you include your Register Number or Admission Number in the remarks for transaction confirmation."
    },
    facilities: {
      library: {
        name: "APEC Central Library",
        area: "4,000 sq.m. across 2 stories",
        volumes: "Over 56,000 engineering and technical volumes",
        book_bank: "Dedicated collection of 3,700+ textbooks for SC/ST students",
        digital_library: "30+ computer terminals with access to IEEE, ScienceDirect, and Springer",
        memberships: ["CSI", "IETE", "ISTE", "IEEE Student Branch"]
      },
      hostels: {
        name: "APEC Residential Hostels",
        capacity: "800+ beds in separate blocks for boys and girls",
        amenities: ["RO water plant", "24/7 diesel generator backup", "Air-conditioned dining halls", "Multi-gym", "Common TV lounges", "Indoor reading rooms", "Biometric attendance scanning"],
        mess: "Nutritious and hygiene-certified vegetarian mess serving balanced meals"
      },
      laboratories: {
        name: "Engineering Laboratories",
        features: ["Fully equipped computer science labs with high-speed internet", "Advanced AI/ML server centers", "Mechanical engineering CNC machinery workshops", "Chemical process engineering process control labs", "Electrical machines & power systems panels"]
      },
      bus_routes: busRoutes
    }
  };

  fs.writeFileSync(path.join(aiKnowledgeDir, 'college.json'), JSON.stringify(collegeInfo, null, 2), 'utf8');
  console.log("✔ Compiled college.json (College credentials, cutoff calculator, fees, library, hostels, lab structures, bus routes)");

  // 3. Admissions and Scholarships (from Admission.jsx)
  const admissionsInfo = {
    counseling_code: "1401",
    eligibility: {
      hsc_requirements: "Candidates must have passed Higher Secondary Examinations (+2) with Mathematics, Physics, and Chemistry (PCM) as core subjects.",
      min_average_marks: {
        OC: "45% average in PCM",
        BC_BCM: "40% average in PCM",
        MBC_DNC: "40% average in PCM",
        SC_SCA_ST: "40% average in PCM"
      }
    },
    scholarships: [
      {
        title: "Lead to Serve... Wings to Your Dreams...",
        provider: "Sakthi Peedam and Spiritual Center of North America, USA",
        amount: "Rs. 25,000 annually",
        eligibility: "Awarded to economically disadvantaged students with strong academic scores and leadership traits."
      },
      {
        title: "Dr. G. B. Senthilkumar Scholarship",
        provider: "APEC College Management",
        amount: "Variable fee concessions",
        eligibility: "Merit-cum-means scholarship provided to students exhibiting high academic rank needing financial aid."
      }
    ],
    documents_required: [
      "TNEA Counseling Allotment Order",
      "10th Standard Mark Sheet",
      "12th Standard (+2) Mark Sheet",
      "Transfer Certificate (TC)",
      "Community Certificate (if applicable)",
      "First Graduate Certificate & Joint Declaration (if applicable)",
      "Nativity Certificate (if applicable)",
      "Income Certificate (for tuition fee concession)",
      "Recent passport-sized photographs"
    ]
  };

  fs.writeFileSync(path.join(aiKnowledgeDir, 'admissions.json'), JSON.stringify(admissionsInfo, null, 2), 'utf8');
  console.log("✔ Compiled admissions.json (Intake guidelines, eligibility, scholarships, counseling code)");

  // 4. Placements & Recruiting (from Placements.jsx)
  const placementsInfo = {
    statistics: {
      placement_percentage: "92%",
      offers_generated_annually: "350+",
      recruiting_partners: "50+ companies",
      highest_ctc: "12 LPA",
      average_ctc: "4.5 LPA"
    },
    recruiters: [
      { name: "Tata Consultancy Services (TCS)", type: "MOU Partner & Recruiter" },
      { name: "Wipro Technologies", type: "MOU Partner & Recruiter" },
      { name: "Cognizant Technology Solutions (CTS)", type: "Recruiter" },
      { name: "Infosys", type: "Recruiter" },
      { name: "HCL Technologies", type: "MOU Partner" },
      { name: "Accenture", type: "Recruiter" },
      { name: "TVS Motors", type: "Industrial MOU" },
      { name: "FANUC India", type: "Automation Lab Partner" }
    ],
    training_programs: [
      {
        name: "Campus Recruitment Training (CRT)",
        target: "Third-year and Final-year students",
        details: "Quantitative aptitude classes, logical reasoning drills, and mock programming assessments."
      },
      {
        name: "Mock Interview Drills",
        target: "Final-year candidates",
        details: "Conducted by alumni panels and industry experts working in leading MNCs to refine communication and technical interviews."
      },
      {
        name: "MOU Tie-ups & Internships",
        target: "All engineering branches",
        details: "Provides 3-6 months direct industrial project experience at core chemical, electronics, and software development cells."
      }
    ]
  };

  fs.writeFileSync(path.join(aiKnowledgeDir, 'placements.json'), JSON.stringify(placementsInfo, null, 2), 'utf8');
  console.log("✔ Compiled placements.json (Placement statistics, key recruiters, CRT training details)");

  // 5. Administration & Leadership
  let adminList = [];
  try {
    const adminDataFilePath = pathToFileURL(path.resolve('Z:/src/data/administrationData.js')).href;
    const adminModule = await import(adminDataFilePath);
    adminList = adminModule.administrationData || adminModule.default || [];
  } catch (err) {
    console.error("Could not load administrationData, using default admin list:", err.message);
    adminList = [
      {
        name: "Dr. J. Raja, Ph.D.",
        role: "Principal",
        qualifications: "Ph.D. (Engineering)",
        department: "Office of the Principal",
        bio: "Dr. J. Raja is a distinguished academic leader and the Principal of Adhiparasakthi Engineering College, Melmaruvathur.",
        contact: "principal@apec.ac.in",
        office: "Principal's Office, Main Block"
      },
      {
        name: "Dr. A. Bhuvaneshwari, M.E., Ph.D.",
        role: "Vice Principal",
        qualifications: "M.E., Ph.D.",
        department: "Office of the Vice Principal",
        bio: "Dr. A. Bhuvaneshwari serves as the Vice Principal of Adhiparasakthi Engineering College.",
        contact: "viceprincipal@apec.ac.in",
        office: "Vice Principal's Office, Main Block"
      }
    ];
  }

  collegeInfo.administration = adminList;
  fs.writeFileSync(path.join(aiKnowledgeDir, 'college.json'), JSON.stringify(collegeInfo, null, 2), 'utf8');
  console.log("✔ Merged administration directory into college.json");

  // 6. Departments (from src/data/departmentsData.json)
  let departmentsMap = {};
  try {
    const deptRaw = fs.readFileSync('Z:/src/data/departmentsData.json', 'utf8');
    departmentsMap = JSON.parse(deptRaw);
  } catch (err) {
    console.error("Could not load departmentsData.json:", err.message);
  }

  const departmentsList = Object.keys(departmentsMap).map(key => {
    const d = departmentsMap[key];
    return {
      key: d.key,
      name: d.name,
      about: d.about,
      vision: d.vision,
      mission: d.mission || [],
      labs: d.labs || [],
      courses_offered: d.courses || [],
      seat_intake: d.intake || "N/A"
    };
  });

  fs.writeFileSync(path.join(aiKnowledgeDir, 'departments.json'), JSON.stringify(departmentsList, null, 2), 'utf8');
  console.log("✔ Compiled departments.json (Core engineering descriptions, lab focus, intake seats)");

  // 7. Faculty
  const facultyList = [];
  Object.keys(departmentsMap).forEach(key => {
    const d = departmentsMap[key];
    const deptName = d.name;
    const deptKey = d.key;
    if (d.faculty && Array.isArray(d.faculty)) {
      d.faculty.forEach(f => {
        facultyList.push({
          name: f.name,
          designation: f.designation,
          qualification: f.qualification || "N/A",
          email: f.email || "N/A",
          experience: f.experience || "N/A",
          department: deptName,
          department_key: deptKey
        });
      });
    }
  });

  fs.writeFileSync(path.join(aiKnowledgeDir, 'faculty.json'), JSON.stringify(facultyList, null, 2), 'utf8');
  console.log(`✔ Compiled faculty.json (Loaded ${facultyList.length} faculty profiles with contact details)`);

  console.log("=== COMPILATION COMPLETE! ALL KNOWLEDGE DATA FILES SAVED ===");
}

build();
