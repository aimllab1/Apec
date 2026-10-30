// Centralized data store for Institutional Administration profiles.
// To add a new member, simply add a new entry to this array.

import principalImg from '../principal.webp';
import vpImg from '../Vice principal.jpg';
import deanImg from '../Dean.webp';
import aoImg from '../administrative officer.jpg';
import malathiImg from '../malathi.jpg';

const administrationData = [
  {
    id: 'principal',
    route: '/administration/principal',
    name: 'Dr. J. Raja, Ph.D.',
    role: 'Principal',
    qualifications: 'Ph.D. (Engineering)',
    department: 'Office of the Principal',
    img: principalImg,
    bio: 'Dr. J. Raja is a distinguished academic leader and the Principal of Adhiparasakthi Engineering College, Melmaruvathur. With decades of experience in engineering education and research, he has guided the institution toward achieving autonomous status and strengthening its academic reputation across Anna University affiliations.',
    responsibilities: [
      'Overall academic and administrative leadership of the institution',
      'Overseeing accreditation processes and regulatory compliance',
      'Fostering research culture and faculty development initiatives',
      'Managing curriculum development and academic quality assurance',
      'Building industry-academic partnerships and MoUs',
    ],
    researchInterests: [
      'Structural Engineering',
      'Sustainable Infrastructure',
      'Engineering Education Policy',
    ],
    achievements: [
      'Led NAAC accreditation process for the institution',
      'Established multiple industry collaboration MoUs',
      'Promoted interdisciplinary research programs',
      'Recognized for exemplary academic leadership',
    ],
    contact: 'principal@apec.edu.in',
    office: 'Principal\'s Office, Main Block, APEC Campus',
    cvUrl: 'https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/1900c68d-255a-455f-a68d-4b7e199bbf4e/Profile_(2).pdf',
  },
  {
    id: 'vice-principal',
    route: '/administration/vice-principal',
    name: 'Dr. A. Bhuvaneshwari, M.E., Ph.D.',
    role: 'Vice Principal',
    qualifications: 'M.E., Ph.D.',
    department: 'Office of the Vice Principal',
    img: vpImg,
    bio: 'Dr. A. Bhuvaneshwari serves as the Vice Principal of Adhiparasakthi Engineering College, bringing extensive expertise in engineering academics and institutional governance. She actively supports student welfare initiatives, academic policy implementation, and quality enhancement programs across all departments.',
    responsibilities: [
      'Assisting the Principal in institutional governance and administration',
      'Coordinating student development and welfare programs',
      'Supporting departmental academic planning and execution',
      'Overseeing internal quality enhancement strategies',
      'Facilitating faculty development and training programs',
    ],
    researchInterests: [
      'Computer Science & Engineering',
      'Artificial Intelligence',
      'Women in STEM',
    ],
    achievements: [
      'Championed multiple student welfare and mentorship programs',
      'Contributed to institutional quality improvement frameworks',
      'Active in IEEE and professional engineering bodies',
    ],
    contact: 'viceprincipal@apec.ac.in',
    office: 'Vice Principal\'s Office, Main Block, APEC Campus',
  },
  {
    id: 'vice-principal-malathi',
    route: '/administration/vice-principal-malathi',
    name: 'Dr. M. Malathi, M.E., Ph.D.',
    role: 'Vice Principal',
    qualifications: 'M.E., Ph.D.',
    department: 'Office of the Vice Principal & Dept of ECE',
    img: malathiImg,
    bio: 'Dr. M. Malathi serves as the Vice Principal and Professor & Head of Electronics & Communication Engineering at Adhiparasakthi Engineering College. With over 31 years of distinguished academic and administrative experience, she plays a vital role in institutional governance, academic accreditation, research advancement, and student mentoring.',
    responsibilities: [
      'Assisting the Principal in institutional administration and strategic planning',
      'Overseeing academic quality standards, accreditation, and OBE compliance',
      'Leading Department of Electronics and Communication Engineering initiatives',
      'Promoting research activities, publications, and funded projects',
      'Facilitating faculty mentorship and student career development',
    ],
    researchInterests: [
      'Wireless Communication & Networks',
      'VLSI Design & Embedded Systems',
      'Signal & Image Processing',
      'IoT & Sensor Applications',
    ],
    achievements: [
      'Over 31 years of dedicated pedagogical leadership and research guidance',
      'Published research papers in peer-reviewed international journals and conferences',
      'Steered NBA and NAAC accreditation documentation and compliance frameworks',
      'Guided numerous undergraduate and postgraduate technical projects',
    ],
    contact: 'ecemalathi@gmail.com',
    office: 'Vice Principal\'s Office / ECE Department, APEC Campus',
  },
  {
    id: 'dean',
    route: '/administration/dean',
    name: 'Dr. V. Ramasamy, Ph.D.',
    role: 'Dean',
    qualifications: 'Ph.D.',
    department: 'Dean\'s Office — Academic Affairs',
    img: deanImg,
    bio: 'Dr. V. Ramasamy is the Dean of Adhiparasakthi Engineering College, responsible for overseeing academic affairs and ensuring compliance with Anna University curriculum standards. Under his leadership, the institution has expanded its digital infrastructure and championed student-centric department innovations.',
    responsibilities: [
      'Overseeing Anna University curriculum compliance across all departments',
      'Coordinating academic calendar, examinations, and results',
      'Managing departmental infrastructure expansions',
      'Driving smart campus digital transformation initiatives',
      'Facilitating inter-departmental academic coordination',
    ],
    researchInterests: [
      'Electrical Engineering',
      'Power Systems',
      'Renewable Energy Technologies',
    ],
    achievements: [
      'Spearheaded digital smart lab infrastructure development',
      'Improved semester examination clearance rates significantly',
      'Strengthened inter-departmental academic coordination',
    ],
    contact: 'dean@apec.ac.in',
    office: 'Dean\'s Office, Administrative Block, APEC Campus',
    cvUrl: 'https://assets.super.so/47fa140c-5512-4ac6-a02b-6305f7e083a9/files/4c98a694-544d-4c49-bde8-cbb8333b9049/Profile.pdf',
  },
  {
    id: 'administrative-officer',
    route: '/administration/administrative-officer',
    name: 'Mr. M. Sadanandan, MBA',
    role: 'Administrative Officer',
    qualifications: 'MBA',
    department: 'General Administration',
    img: aoImg,
    bio: 'Mr. M. Sadanandan serves as the Administrative Officer of Adhiparasakthi Engineering College, managing the institution\'s administrative frameworks, campus logistics, resource allocation, and general corporate relations. He ensures seamless operational efficiency across the campus.',
    responsibilities: [
      'Managing campus-wide administrative operations and logistics',
      'Overseeing resource allocation and facilities management',
      'Coordinating corporate relations and vendor management',
      'Maintaining official records, documentation, and compliance',
      'Supporting HR functions and staff administration',
    ],
    researchInterests: [],
    achievements: [
      'Streamlined campus administrative processes for efficiency',
      'Established robust procurement and vendor management systems',
      'Supported institutional accreditation documentation efforts',
    ],
    contact: 'admin@apec.ac.in',
    office: 'Administrative Officer\'s Office, Admin Block, APEC Campus',
  },
];

export default administrationData;
