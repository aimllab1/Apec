import fs from 'fs';

const dataPath = 'Z:/src/data/departmentsData.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const meCourses = {
  "me-cse": {
    "key": "me-cse",
    "name": "M.E. Computer Science and Engineering",
    "about": "The M.E. program in Computer Science and Engineering offers advanced coursework and research opportunities in algorithms, computer networks, data science, software engineering, and artificial intelligence.",
    "vision": "To be a center of excellence in advanced computer science education and research, producing professionals who lead innovative solutions.",
    "mission": [
      "To impart advanced technical knowledge and research skills in computer science.",
      "To foster innovation, collaboration, and ethical engineering practices."
    ],
    "peos": [
      "Apply advanced concepts in computing to design and develop complex software systems.",
      "Engage in research and lifelong learning to solve real-world problems."
    ],
    "psos": [
      "Design and analyze complex algorithms and systems software.",
      "Integrate intelligent tools and technologies in research and practice."
    ],
    "pos": [
      "Ability to apply advanced mathematical and computer science concepts.",
      "Design and conduct experiments, as well as analyze and interpret data.",
      "Communicate research results effectively."
    ],
    "faculty": [],
    "labs": [],
    "placements": [],
    "rankHolders": [],
    "toppers": []
  },
  "me-vlsi": {
    "key": "me-vlsi",
    "name": "M.E. VLSI Design",
    "about": "The M.E. program in VLSI Design focuses on advanced microelectronics, analog and digital IC design, testing and verification, embedded systems, and computer-aided design (CAD) of VLSI systems.",
    "vision": "To produce industry-ready VLSI professionals and researchers capable of leading innovations in semiconductor and microelectronic systems.",
    "mission": [
      "To offer high-quality research-oriented education in semiconductor technology.",
      "To collaborate with industry partners to solve microelectronics challenges."
    ],
    "peos": [
      "Analyze and design state-of-the-art analog and digital integrated circuits.",
      "Pursue careers in leading semiconductor companies or research organizations."
    ],
    "psos": [
      "Implement electronic design automation (EDA) tools for VLSI design flow.",
      "Design low-power, high-performance microelectronic systems."
    ],
    "pos": [
      "Ability to analyze VLSI circuit design challenges.",
      "Design system-on-chip architectures using modern EDA tools.",
      "Develop innovative chip solutions."
    ],
    "faculty": [],
    "labs": [],
    "placements": [],
    "rankHolders": [],
    "toppers": []
  },
  "me-ped": {
    "key": "me-ped",
    "name": "M.E. Power Electronics & Drives",
    "about": "The M.E. program in Power Electronics & Drives prepares engineering students for advanced study and careers in electric drives, smart grids, renewable energy systems, and power converter technologies.",
    "vision": "To advance knowledge and innovation in power electronic systems and green energy technologies.",
    "mission": [
      "To provide comprehensive education in advanced power devices and control technologies.",
      "To drive sustainable energy research through academic and industrial partnerships."
    ],
    "peos": [
      "Design, analyze, and implement advanced power conversion topologies.",
      "Contribute to clean energy initiatives and electric vehicle technologies."
    ],
    "psos": [
      "Model, simulate, and design motor drives and power systems.",
      "Apply digital controllers in power electronic applications."
    ],
    "pos": [
      "Solve advanced power engineering challenges.",
      "Integrate renewable energy sources into local grids.",
      "Communicate research and engineering outcomes clearly."
    ],
    "faculty": [],
    "labs": [],
    "placements": [],
    "rankHolders": [],
    "toppers": []
  },
  "me-thermal": {
    "key": "me-thermal",
    "name": "M.E. Thermal Engineering",
    "about": "The M.E. program in Thermal Engineering provides in-depth study of heat transfer, fluid dynamics, thermodynamics, combustion, and renewable energy technologies.",
    "vision": "To be a leader in thermal science education and research, addressing energy efficiency and sustainable development challenges.",
    "mission": [
      "To cultivate advanced analytical and research capabilities in thermal sciences.",
      "To develop energy-efficient technologies and sustainable thermal designs."
    ],
    "peos": [
      "Design and optimize thermal-fluid systems and energy conversion plants.",
      "Address environmental concerns in engineering designs and operations."
    ],
    "psos": [
      "Perform computational fluid dynamics (CFD) and thermal analysis.",
      "Implement advanced energy conservation technologies."
    ],
    "pos": [
      "Apply thermofluid principles to practical plant engineering.",
      "Utilize advanced simulation and analysis tools.",
      "Publish scientific reports and research outcomes."
    ],
    "faculty": [],
    "labs": [],
    "placements": [],
    "rankHolders": [],
    "toppers": []
  },
  "me-cem": {
    "key": "me-cem",
    "name": "M.E. Construction Engineering and Management",
    "about": "The M.E. program in Construction Engineering and Management integrates engineering principles with business management to oversee complex infrastructure, construction contracts, scheduling, and project execution.",
    "vision": "To develop global leaders in construction engineering who manage projects efficiently, sustainably, and ethically.",
    "mission": [
      "To deliver advanced education in project management, materials, and contracts.",
      "To foster research in sustainable materials and construction technologies."
    ],
    "peos": [
      "Manage large-scale construction projects within time, budget, and quality parameters.",
      "Apply modern project management tools and sustainable construction practices."
    ],
    "psos": [
      "Formulate construction schedules, cost estimates, and risk management plans.",
      "Address legal, safety, and environmental regulations in construction."
    ],
    "pos": [
      "Manage structural and infrastructural development workflows.",
      "Apply modern scheduling algorithms and management tools.",
      "Prepare complex cost estimates and feasibility studies."
    ],
    "faculty": [],
    "labs": [],
    "placements": [],
    "rankHolders": [],
    "toppers": []
  }
};

Object.assign(data, meCourses);

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully added M.E. courses to departmentsData.json!');
