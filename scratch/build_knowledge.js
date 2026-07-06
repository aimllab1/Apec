import fs from 'fs';
import path from 'path';

// Read existing datasets
const departmentsDataPath = 'Z:/src/data/departmentsData.json';
const adminDataPath = 'Z:/src/data/administrationData.js';

let departments = {};
try {
  const deptRaw = fs.readFileSync(departmentsDataPath, 'utf8');
  departments = JSON.parse(deptRaw);
} catch (err) {
  console.error("Error reading departmentsData.json:", err);
}

// Prepare knowledge base structure
const knowledgeBase = {
  college_info: {
    name: "Adhiparasakthi Engineering College",
    short_name: "APEC",
    established: "1984",
    location: "Melmaruvathur, Tamil Nadu - 603319, India",
    accreditation: "NAAC Accredited Institution, UGC Autonomous College, Affiliated to Anna University",
    tnea_counseling_code: "1401",
    helpline: "+91 7418064336 / 7418065336",
    email: "principal@apec.edu.in",
    website: "https://apec.edu.in",
    description: "Adhiparasakthi Engineering College (APEC) was established in 1984 with the blessings of Arulthiru Bangaru Adigalar. It is an autonomous institution affiliated to Anna University, offering undergraduate (B.E. and B.Tech.), postgraduate (M.E., MBA, MCA), and Ph.D. programs."
  },
  administration: [
    {
      name: "Dr. J. Raja, Ph.D.",
      role: "Principal",
      qualifications: "Ph.D. (Engineering)",
      department: "Office of the Principal",
      bio: "Dr. J. Raja is a distinguished academic leader and the Principal of Adhiparasakthi Engineering College, Melmaruvathur. With decades of experience in engineering education and research, he has guided the institution toward achieving autonomous status and strengthening its academic reputation.",
      contact: "principal@apec.ac.in",
      office: "Principal's Office, Main Block, APEC Campus"
    },
    {
      name: "Dr. A. Bhuvaneshwari, M.E., Ph.D.",
      role: "Vice Principal",
      qualifications: "M.E., Ph.D.",
      department: "Office of the Vice Principal",
      bio: "Dr. A. Bhuvaneshwari serves as the Vice Principal of Adhiparasakthi Engineering College, bringing extensive expertise in engineering academics and institutional governance. She actively supports student welfare initiatives and academic policy implementation.",
      contact: "viceprincipal@apec.ac.in",
      office: "Vice Principal's Office, Main Block, APEC Campus"
    },
    {
      name: "Dr. V. Ramasamy, Ph.D.",
      role: "Dean",
      qualifications: "Ph.D.",
      department: "Dean's Office — Academic Affairs",
      bio: "Dr. V. Ramasamy is the Dean of Adhiparasakthi Engineering College, responsible for overseeing academic affairs and ensuring compliance with Anna University curriculum standards. Under his leadership, the institution has expanded its digital infrastructure.",
      contact: "dean@apec.ac.in",
      office: "Dean's Office, Administrative Block, APEC Campus"
    },
    {
      name: "Mr. M. Sadanandan, MBA",
      role: "Administrative Officer",
      qualifications: "MBA",
      department: "General Administration",
      bio: "Mr. M. Sadanandan serves as the Administrative Officer of Adhiparasakthi Engineering College, managing the institution's administrative frameworks, campus logistics, resource allocation, and general corporate relations.",
      contact: "admin@apec.ac.in",
      office: "Administrative Officer's Office, Admin Block, APEC Campus"
    }
  ],
  placements: {
    placement_percentage: "92%",
    offers_generated_yearly: "350+",
    recruiting_partners: "50+",
    highest_ctc: "12 LPA",
    partners: [
      { name: "Tata Consultancy Services (TCS)", type: "MOU Partner" },
      { name: "Wipro Technologies", type: "MOU Partner" },
      { name: "Cognizant Technology Solutions (CTS)", type: "Recruiter" },
      { name: "Infosys", type: "Recruiter" },
      { name: "HCL Technologies", type: "MOU Partner" },
      { name: "Accenture", type: "Recruiter" },
      { name: "TVS Motors", type: "Industrial MOU" },
      { name: "FANUC India", type: "Industrial Partner" }
    ],
    training_activities: [
      { title: "Campus Recruitment Training (CRT)", desc: "Aptitude, logical reasoning, and programming drills starting from the third year." },
      { title: "MOU Tie-ups & Internships", desc: "Active collaborations with core automation, chemical, and software development cells." },
      { title: "Mock Interview Drills", desc: "Conducted by alumni working in tech cells to refine students' communications and soft skills." }
    ]
  },
  admissions: {
    apply_url: "/contact",
    ug_programs: [
      { name: "B.E. - Civil Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60 },
      { name: "B.E. - Mechanical Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60 },
      { name: "B.E. - Electronics and Communication Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 90 },
      { name: "B.E. - Electrical and Electronics Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 60 },
      { name: "B.E. - Computer Science and Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 90 },
      { name: "B.Tech. - Information Technology", duration: "4 Years", type: "Under Graduate Programme", intake: 60 },
      { name: "B.Tech. - Chemical Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 40 },
      { name: "B.Tech. - Agricultural Engineering", duration: "4 Years", type: "Under Graduate Programme", intake: 40 },
      { name: "B.E. - Computer Science & Engineering (Artificial Intelligence and Machine Learning)", duration: "4 Years", type: "Under Graduate Programme", intake: 30 },
      { name: "B.E. - Computer Science & Engineering (Computer System Design)", duration: "4 Years", type: "Under Graduate Programme", intake: 30 }
    ],
    pg_programs: [
      { name: "M.E. - Computer Science and Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 9 },
      { name: "M.E. - Thermal Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 18 },
      { name: "M.E. - VLSI Design", duration: "2 Years", type: "Post Graduate Programme", intake: 9 },
      { name: "M.E. - Power Electronics & Drives Engineering", duration: "2 Years", type: "Post Graduate Programme", intake: 9 },
      { name: "M.E. - Construction Engineering and Management", duration: "2 Years", type: "Post Graduate Programme", intake: 18 },
      { name: "M.B.A. (Master of Business Administration)", duration: "2 Years", type: "Post Graduate Programme", intake: 60 },
      { name: "M.C.A. (Master of Computer Applications)", duration: "2 Years", type: "Post Graduate Programme", intake: 60 }
    ],
    phd_programs: [
      { name: "PhD - Civil Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)" },
      { name: "PhD - Mechanical Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)" },
      { name: "PhD - Electrical and Electronics Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)" },
      { name: "PhD - Electronics and Communication Engineering", duration: "Minimum 2 Years (Full Time)", type: "Doctoral Programmes (PhD)" }
    ],
    scholarships: [
      {
        title: "Lead to Serve... Wings to Your Dreams...",
        amount: "Rs. 25,000",
        provider: "Sakthi Peedam and Spiritual Center of North America, USA",
        category: "Need-based",
        description: "Awarded every year to economically poor students with good academic performance and leadership qualities."
      },
      {
        title: "Dr. G. B. Senthilkumar Scholarship",
        amount: "Variable",
        provider: "APEC Management",
        category: "Merit-cum-Means",
        description: "Provided to students who demonstrate excellence in academic scores and are in need of financial assistance."
      }
    ]
  },
  facilities: [
    {
      name: "Central Library",
      description: "APEC Central Library houses over 50,000 books, subscriptions to leading international and national journals, digital library access with IEEE, Springer, and ScienceDirect, separate reading halls, and automated book issue system."
    },
    {
      name: "Laboratory Infrastructures",
      description: "Fully equipped labs for all engineering departments: computer engineering labs with high-speed internet, AI/ML laboratories, mechanical engineering workshop machinery, chemical engineering process labs, electronics and communication circuit labs, and electrical machines lab."
    },
    {
      name: "Hostel Blocks",
      description: "Separate, secure hostel facilities for boys and girls inside the campus. Features include study halls, recreation rooms, multi-gym, Wi-Fi connectivity, medical care unit, and hygiene-certified mess offering nutritious meals."
    },
    {
      name: "Transport & Bus Routes",
      description: "APEC operates a fleet of transport buses connecting the campus with major towns and suburbs across Kanchipuram, Chengalpattu, Villupuram, and Chennai districts, ensuring safe and timely travel for day scholars."
    }
  ],
  departments: Object.keys(departments).map(key => {
    const d = departments[key];
    return {
      key: d.key,
      name: d.name,
      about: d.about,
      vision: d.vision,
      mission: d.mission,
      faculty: (d.faculty || []).map(f => ({
        name: f.name,
        designation: f.designation,
        qualification: f.qualification,
        email: f.email,
        experience: f.experience
      }))
    };
  })
};

fs.writeFileSync('Z:/data/college_knowledge.json', JSON.stringify(knowledgeBase, null, 2), 'utf8');
console.log("Compiled college_knowledge.json successfully!");
