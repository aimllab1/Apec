import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, Building2, HeartHandshake, GraduationCap, 
  Users, Vote, Compass, Lightbulb, Download, ExternalLink, 
  FileText, CheckCircle2, ChevronRight, ArrowLeft
} from 'lucide-react';

const committeesList = [
  {
    id: "anti-ragging",
    title: "Anti-Ragging Committee",
    category: "student-cells",
    categoryLabel: "Student Cells & Associations",
    icon: ShieldAlert,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 border-rose-100 text-rose-700",
    pdf: "/Documents/PDFs/Committees/1. Anti-Ragging.pdf",
    coordinator: "Dr. K. P. Sathish Kumar (Nodal Officer)",
    contact: "+91 94434 26233",
    description: "Committed to maintaining a ragging-free campus and ensuring a safe, supportive, and welcoming environment for all students, especially newcomers. The committee strictly enforces the UGC regulations on curbing the menace of ragging in higher educational institutions.",
    objectives: [
      "To prevent and eradicate any physical or mental harassment of freshers.",
      "To create awareness about the legal and institutional consequences of ragging.",
      "To monitor campus activities through regular squads and patrols in hostel/canteen areas.",
      "To provide immediate grievance redressal and counseling support for victims.",
      "To conduct sensitization seminars and workshops for senior students."
    ],
    keyFunctions: [
      { title: "24/7 Helpline Support", desc: "Immediate assistance for students facing any peer distress." },
      { title: "Anti-Ragging Squads", desc: "Frequent unannounced inspections around vulnerable campus spots." },
      { title: "Student Counseling", desc: "Mentorship and psychological support to ensure a smooth transition." },
      { title: "Legal Awareness Talks", desc: "Expert talks on the legal repercussions and penal codes of ragging." }
    ]
  },
  {
    id: "iiic",
    title: "Industry-Institute Interaction Cell (IIIC)",
    category: "student-cells",
    categoryLabel: "Student Cells & Associations",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 border-blue-100 text-blue-700",
    pdf: "/Documents/PDFs/Committees/2. Industry Instituion interaction Cell.pdf",
    coordinator: "Prof. S. R. Ravindran (Cell Coordinator)",
    contact: "+91 98402 12345",
    description: "Fostering collaboration between academia and industries to align engineering education with industrial requirements, promoting research, consultancy, and training programs that prepare students for real-world challenges.",
    objectives: [
      "To bridge the gap between academic curricula and industrial needs.",
      "To facilitate student internships, in-plant training, and industrial visits.",
      "To organize expert guest lectures, seminars, and technical workshops by industrial stalwarts.",
      "To secure collaborative research projects and consulting opportunities.",
      "To establish Memorandums of Understanding (MoUs) with leading national and international firms."
    ],
    keyFunctions: [
      { title: "MoU Partnerships", desc: "Strategic alliances with top organizations to facilitate joint ventures." },
      { title: "Internship Programs", desc: "Industrial placement opportunities during semester breaks." },
      { title: "Consultancy Services", desc: "Solving industrial problems utilizing college lab infrastructure." },
      { title: "Industrial Visits", desc: "Field trips exposing students to modern assembly lines and practices." }
    ]
  },
  {
    id: "women-empowerment",
    title: "Women Empowerment Cell",
    category: "student-cells",
    categoryLabel: "Student Cells & Associations",
    icon: HeartHandshake,
    color: "from-pink-500 to-purple-600",
    bgColor: "bg-pink-50 border-pink-100 text-pink-700",
    pdf: "/Documents/PDFs/Committees/3. Women Empowerment Cell.pdf",
    coordinator: "Dr. M. Shanmugapriya (WEC Chairperson)",
    contact: "+91 97911 23456",
    description: "Dedicated to the academic, psychological, and social advancement of female students and staff members. The cell works to prevent gender-based discrimination, build self-confidence, and foster a safe and respectful campus community.",
    objectives: [
      "To promote a culture of respect, equality, and safety for women on campus.",
      "To organize self-defense programs, health checkups, and wellness workshops.",
      "To sensitize the student community regarding women's legal rights and safety regulations.",
      "To encourage leadership and entrepreneurial capabilities among female students.",
      "To provide a confidential platform for discussing and resolving personal or academic issues."
    ],
    keyFunctions: [
      { title: "Self-Defense Training", desc: "Practical workshops for physical safety and mental confidence." },
      { title: "Leadership Seminars", desc: "Interactions with female achievers from corporate, research, and social domains." },
      { title: "Health & Hygiene Camps", desc: "Medical counseling, nutrition workshops, and screening programs." },
      { title: "Awareness Campaigns", desc: "Forums addressing gender sensitization, safety, and modern social issues." }
    ]
  },
  {
    id: "alumni-cell",
    title: "Alumni Cell",
    category: "student-cells",
    categoryLabel: "Student Cells & Associations",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-100 text-amber-700",
    pdf: "/Documents/PDFs/Committees/4. Alumni Cell.pdf",
    coordinator: "Mr. R. Vignesh (Alumni Officer)",
    contact: "+91 90807 65432",
    description: "Nurturing an active and mutually beneficial network connecting past graduates with current students and faculty, leveraging alumni achievements to support placements, mentoring, and academic advancements.",
    objectives: [
      "To maintain a comprehensive and up-to-date directory of our global alumni community.",
      "To organize reunions, local chapter meets, and annual alumni gatherings.",
      "To engage alumni in mentoring current students for career planning, higher education, and placements.",
      "To facilitate alumni contributions toward college development, labs, and research initiatives.",
      "To honor and celebrate the outstanding achievements of our alumni in diverse fields."
    ],
    keyFunctions: [
      { title: "Alumni Mentorship", desc: "Mock interviews, resume evaluations, and career guidance sessions." },
      { title: "Annual Alumni Meets", desc: "Networking events allowing graduates to reconnect and share experiences." },
      { title: "Alumni Guest Lectures", desc: "Technical lectures focused on emerging industrial and market trends." },
      { title: "Global Chapter Networks", desc: "Local networks in cities and overseas to support relocation and career starts." }
    ]
  },
  {
    id: "sc-st-committee",
    title: "SC/ST Committee",
    category: "welfare-clubs",
    categoryLabel: "Welfare & Career Clubs",
    icon: Users,
    color: "from-teal-500 to-emerald-600",
    bgColor: "bg-teal-50 border-teal-100 text-teal-700",
    pdf: "/Documents/PDFs/Committees/5. SC-ST Commitee.pdf",
    coordinator: "Dr. P. Senthil Kumar (Committee Coordinator)",
    contact: "+91 94888 12345",
    description: "Focusing on the welfare, equity, and educational advancement of students belonging to Scheduled Castes and Scheduled Tribes. The committee coordinates scholarships, remedial measures, and ensures a welcoming, discrimination-free environment.",
    objectives: [
      "To ensure equal opportunity and academic success for SC/ST students.",
      "To prevent discrimination, bias, or harassment against SC/ST community members.",
      "To guide and assist students in applying for central and state government scholarships.",
      "To organize remedial classes, skill enhancement courses, and specialized career coaching.",
      "To address any complaints and grievances submitted by SC/ST students and staff."
    ],
    keyFunctions: [
      { title: "Scholarship Assistance", desc: "Assisting candidates with documentation and application tracking." },
      { title: "Remedial Coaching", desc: "Special academic classes in tough subjects to boost graduation rates." },
      { title: "Career Mentorship", desc: "Orientations on public sector jobs, reservation benefits, and fellowships." },
      { title: "Grievance Redressal", desc: "A safe cell investigating complaints and offering rapid resolutions." }
    ]
  },
  {
    id: "electoral-literacy",
    title: "Electoral Literacy Club",
    category: "welfare-clubs",
    categoryLabel: "Welfare & Career Clubs",
    icon: Vote,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 border-cyan-100 text-cyan-700",
    pdf: "/Documents/PDFs/Committees/6. Electoral Literacy Club.pdf",
    coordinator: "Prof. G. Baskaran (Club Advisor)",
    contact: "+91 99944 87654",
    description: "Promoting democratic literacy and creating civic awareness among students. The club conducts voter registration drives and educational campaigns to nurture responsible, informed, and active citizens.",
    objectives: [
      "To educate students about democratic rights, the electoral process, and the value of voting.",
      "To facilitate voter registration and documentation for students turning 18.",
      "To organize awareness programs, quizzes, essay contests, and street plays on electoral themes.",
      "To counter voter apathy and encourage clean, ethical, and informed voting.",
      "To train student volunteers in civic education and community outreach."
    ],
    keyFunctions: [
      { title: "Voter Registration Camps", desc: "On-campus enrollment and assistance with obtaining voter ID cards." },
      { title: "Mock Elections", desc: "Simulated voting procedures to familiarize students with EVMs and VVPATs." },
      { title: "National Voters' Day", desc: "Annual celebrations featuring debates, pledge-taking, and poster design." },
      { title: "Civic Outreach", desc: "Local campaigns educating community members on franchise rights." }
    ]
  },
  {
    id: "career-guidance",
    title: "Career Guidance Cell",
    category: "welfare-clubs",
    categoryLabel: "Welfare & Career Clubs",
    icon: Compass,
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 border-indigo-100 text-indigo-750",
    pdf: "/Documents/PDFs/Committees/7.Career Guidance Cell.pdf",
    coordinator: "Dr. S. Karthikeyan (CGC Director)",
    contact: "+91 94441 54321",
    description: "Equipping students with necessary resources, counselling, and specialized training to explore diverse professional options, prepare for prestigious national/international examinations, and succeed in higher education.",
    objectives: [
      "To offer counseling and psychometric profiling to help students discover career interests.",
      "To arrange training programs for exams like GATE, GRE, GMAT, TOEFL, CAT, and Civil Services.",
      "To conduct resume building, group discussions, and aptitude test preparation modules.",
      "To disseminate notifications regarding higher education, research programs, and public sector jobs.",
      "To invite professionals and counselors for career path discussions."
    ],
    keyFunctions: [
      { title: "Competitive Exam Prep", desc: "Coaching classes and materials for GATE, UPSC, and banking sectors." },
      { title: "Aptitude & Soft Skills", desc: "Weekly practice tests, quant prep, and communication workshops." },
      { title: "Higher Education Guidance", desc: "Counseling sessions for students aiming for MS, PhD, or MBA programs." },
      { title: "One-on-One Counseling", desc: "Personalized mentorship sessions to map out customized career goals." }
    ]
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship Cell",
    category: "welfare-clubs",
    categoryLabel: "Welfare & Career Clubs",
    icon: Lightbulb,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 border-orange-100 text-orange-700",
    pdf: "/Documents/PDFs/Committees/8. Entrepreneurship Development Cell.pdf",
    coordinator: "Dr. R. Rajesh (EDC Coordinator)",
    contact: "+91 98944 11223",
    description: "Developing a culture of innovation and startup creation among student minds. The cell acts as a launchpad, offering incubation services, industry mentorship, patent filing workshops, and seed funding support.",
    objectives: [
      "To foster an entrepreneurial spirit and mindset within the student community.",
      "To organize business plan competitions, bootcamps, and innovation challenges.",
      "To conduct workshops on Intellectual Property Rights (IPR) and patent filing processes.",
      "To link student innovators with external mentors, incubators, and venture capitalists.",
      "To provide physical facilities and resources for prototyping and business modeling."
    ],
    keyFunctions: [
      { title: "Incubation & Workspace", desc: "Dedicated workspace for team building, discussions, and server access." },
      { title: "IPR & Patent Support", desc: "Counseling on patents, copy-righting codes, and registration services." },
      { title: "Startup Bootcamps", desc: "Intensive training on market research, financial planning, and pitches." },
      { title: "Seed Funding Connects", desc: "Linking teams with angel investors and government innovation grants." }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

export default function Committees() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' or 'document'

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set selected tab based on URL param
  const activeTabId = id || 'anti-ragging';
  const activeCommittee = committeesList.find(c => c.id === activeTabId) || committeesList[0];

  // Group lists
  const studentCells = committeesList.filter(c => c.category === 'student-cells');
  const welfareClubs = committeesList.filter(c => c.category === 'welfare-clubs');

  const handleTabChange = (itemId) => {
    navigate(`/committees/${itemId}`);
    setActiveSection('overview');
  };

  const IconComponent = activeCommittee.icon;

  // RENDER 1: Mobile Directory Hub (when path is `/committees` on mobile)
  if (isMobile && !id) {
    return (
      <div className="min-h-screen bg-slate-50 text-gray-900 py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto relative z-10 text-left">
          {/* Header */}
          <div className="mb-10 text-center">
            <span className="text-[10px] font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-3 uppercase">
              APEC Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-gray-900 leading-tight">
              Committees & Clubs
            </h1>
            <p className="text-xs text-gray-500 font-bold mt-2">
              Select a subdivision to view mandates, key functions, and download official PDF documents.
            </p>
          </div>

          {/* Student Cells section */}
          <div className="mb-8">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4 pl-1">
              Student Cells & Associations
            </h3>
            <div className="space-y-3">
              {studentCells.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={`/committees/${item.id}`}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-[#FF8A00]/40 transition-all active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm shrink-0`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-800 leading-snug group-hover:text-[#FF8A00] transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-bold">
                          Official PDF Included
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF8A00] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Welfare & Clubs section */}
          <div>
            <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4 pl-1">
              Welfare & Career Clubs
            </h3>
            <div className="space-y-3">
              {welfareClubs.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={`/committees/${item.id}`}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-[#FF8A00]/40 transition-all active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm shrink-0`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-800 leading-snug group-hover:text-[#FF8A00] transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-bold">
                          Official PDF Included
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF8A00] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // RENDER 2: Mobile Dedicated Subpage (when path has `/committees/:id` on mobile)
  if (isMobile && id) {
    return (
      <div className="min-h-screen bg-slate-50 text-gray-900 py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-md mx-auto relative z-10 text-left">
          
          {/* Back Button */}
          <Link 
            to="/committees"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm mb-6 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Committees
          </Link>

          {/* Committee Details */}
          <div className="space-y-6">
            
            {/* Header Block */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
              <div className="flex gap-4 items-center mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeCommittee.color} text-white flex items-center justify-center shadow`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-[#FF8A00] bg-[#FFE7CC]/50 border border-[#FFE7CC] px-2.5 py-0.5 rounded-full inline-block">
                    {activeCommittee.categoryLabel}
                  </span>
                  <h2 className="text-lg font-black font-title tracking-tight text-gray-900">
                    {activeCommittee.title}
                  </h2>
                </div>
              </div>

              {/* Coordinator */}
              <div className="text-[10px] font-bold text-gray-500 space-y-1 bg-slate-50 border border-gray-150 p-3 rounded-xl">
                {activeCommittee.coordinator && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 uppercase text-[8px] font-black tracking-wider">Coordinator:</span>
                    <span className="text-gray-800">{activeCommittee.coordinator}</span>
                  </div>
                )}
                {activeCommittee.contact && (
                  <div className="flex justify-between pt-1 border-t border-gray-200/60">
                    <span className="text-gray-400 uppercase text-[8px] font-black tracking-wider">Contact:</span>
                    <span className="text-gray-800">{activeCommittee.contact}</span>
                  </div>
                )}
              </div>

              {activeCommittee.id === 'alumni-cell' && (
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScuCBIQz3SmLkFMxjlUCrl6htHqgRKW8394xCINYJ8cq4Domw/viewform?pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E07B00] text-white font-black text-xs uppercase tracking-wider py-3 rounded-2xl mt-3 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Alumni Registration
                </a>
              )}

              {/* Mobile Quick Action Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mt-4">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeSection === 'overview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection('document')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeSection === 'document'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500'
                  }`}
                >
                  Official PDF
                </button>
              </div>

              {/* Mobile Downloads Block */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a
                  href={activeCommittee.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-gray-700 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Fullscreen
                </a>
                <a
                  href={activeCommittee.pdf}
                  download
                  className="flex items-center justify-center gap-1.5 bg-[#FF8A00] hover:bg-[#E07B00] text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
              </div>
            </div>

            {/* Active Content rendering */}
            <AnimatePresence mode="wait">
              {activeSection === 'overview' ? (
                <motion.div
                  key="mobile-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
                      Introduction & Mandate
                    </h3>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed text-justify">
                      {activeCommittee.description}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
                      Key Objectives
                    </h3>
                    <ul className="space-y-3">
                      {activeCommittee.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-gray-700 font-extrabold text-left leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#FF8A00] shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activeCommittee.keyFunctions && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wide pl-1">
                        Key Functions & Action Areas
                      </h3>
                      <div className="space-y-3">
                        {activeCommittee.keyFunctions.map((func, i) => (
                          <div key={i} className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm text-left">
                            <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded inline-block mb-1.5">
                              Phase 0{i + 1}
                            </span>
                            <h4 className="text-xs font-black text-gray-900 mb-0.5">
                              {func.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                              {func.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-document"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm space-y-3 flex flex-col">
                    <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#FF8A00]" />
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                          Document Reader
                        </span>
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 bg-slate-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
                        PDF FILE
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-gray-250 relative min-h-[420px] flex items-center justify-center">
                      <iframe 
                        src={`${activeCommittee.pdf}#toolbar=0&view=FitH`} 
                        className="absolute inset-0 w-full h-full border-none" 
                        title={`${activeCommittee.title} Document`}
                      />
                    </div>
                    
                    <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg text-center">
                      <p className="text-[10px] text-gray-500 font-bold">
                        Having issues scrolling the preview? Click below to{' '}
                        <a href={activeCommittee.pdf} download className="text-[#FF8A00] font-black underline">
                          download PDF directly
                        </a>.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    );
  }

  // RENDER 3: Desktop View (Standard responsive sidebar tabbed panel)
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC]/80 px-4 py-2 rounded-full inline-block mb-3 uppercase">
              Committees, Cells & Clubs
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-3 text-gray-900 leading-tight">
              Student Committees & Welfare Cells
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl">
              Dedicated organizational bodies at Adhiparasakthi Engineering College committed to facilitating campus welfare, gender equity, student representation, career guidance, and robust industrial training.
            </p>
          </div>
        </div>

        {/* Outer Grid Container for Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Navigation Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
            
            {/* Student Cells section */}
            <div className="mb-6">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 pl-2">
                Student Cells & Associations
              </h3>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1.5"
              >
                {studentCells.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = item.id === activeCommittee.id;
                  return (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-extrabold text-left transition-all ${
                        isActive 
                          ? 'bg-[#FFE7CC] border-[#FF8A00]/40 text-[#FF8A00] shadow-sm' 
                          : 'bg-white hover:bg-slate-50 border-gray-150 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-white border-[#FF8A00]/20 text-[#FF8A00]' : 'bg-slate-100 border-gray-200 text-gray-500'}`}>
                          <ItemIcon className="w-4 h-4 shrink-0" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-55 transition-transform ${isActive ? 'translate-x-1 text-[#FF8A00]' : 'text-gray-400'}`} />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Welfare & Clubs section */}
            <div>
              <h3 className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 pl-2">
                Welfare & Career Clubs
              </h3>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1.5"
              >
                {welfareClubs.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = item.id === activeCommittee.id;
                  return (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-extrabold text-left transition-all ${
                        isActive 
                          ? 'bg-[#FFE7CC] border-[#FF8A00]/40 text-[#FF8A00] shadow-sm' 
                          : 'bg-white hover:bg-slate-50 border-gray-150 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-white border-[#FF8A00]/20 text-[#FF8A00]' : 'bg-slate-100 border-gray-200 text-gray-500'}`}>
                          <ItemIcon className="w-4 h-4 shrink-0" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-55 transition-transform ${isActive ? 'translate-x-1 text-[#FF8A00]' : 'text-gray-400'}`} />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
            
          </aside>

          {/* RIGHT COLUMN: Active Committee Content Display */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCommittee.id}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                
                {/* Active Committee Header Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5 relative z-10 w-full">
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeCommittee.color} text-white flex items-center justify-center shadow-lg shrink-0 mt-1`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#FF8A00] bg-[#FFE7CC]/50 border border-[#FFE7CC] px-3 py-1 rounded-full inline-block">
                          {activeCommittee.categoryLabel}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black font-title tracking-tight text-gray-900">
                          {activeCommittee.title}
                        </h2>
                        
                        {/* Coordinator & Contact */}
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-xs font-bold text-gray-500">
                          {activeCommittee.coordinator && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400 uppercase text-[9px] font-black tracking-wider">Coordinator:</span>
                              <span className="text-gray-800">{activeCommittee.coordinator}</span>
                            </div>
                          )}
                          {activeCommittee.contact && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400 uppercase text-[9px] font-black tracking-wider">Contact:</span>
                              <span className="text-gray-800">{activeCommittee.contact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {activeCommittee.id === 'alumni-cell' && (
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScuCBIQz3SmLkFMxjlUCrl6htHqgRKW8394xCINYJ8cq4Domw/viewform?pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#FF8A00] hover:bg-[#E07B00] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] self-start md:self-center mt-2 md:mt-0"
                      >
                        <ExternalLink className="w-4 h-4" /> Alumni Registration
                      </a>
                    )}
                  </div>

                  {/* Divider */}
                  <hr className="my-6 border-gray-150" />

                  {/* Quick Action Navigation (Overview vs Official PDF Document) */}
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                      <button
                        onClick={() => setActiveSection('overview')}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                          activeSection === 'overview'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Overview & Activities
                      </button>
                      <button
                        onClick={() => setActiveSection('document')}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                          activeSection === 'document'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        Official PDF
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {/* View Fullscreen PDF in New Tab */}
                      <a
                        href={activeCommittee.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-gray-700 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Fullscreen View
                      </a>
                      
                      {/* Download PDF Button */}
                      <a
                        href={activeCommittee.pdf}
                        download
                        className="flex items-center gap-2 bg-[#FF8A00] hover:bg-[#E07B00] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </a>
                    </div>
                  </div>

                </div>

                {/* Tab Content Panels */}
                <AnimatePresence mode="wait">
                  {activeSection === 'overview' ? (
                    <motion.div
                      key="overview-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {/* About / Description card */}
                      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                        <h3 className="text-base font-black text-gray-900 font-title uppercase tracking-wide border-b border-gray-100 pb-3">
                          Introduction & Mandate
                        </h3>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed text-justify">
                          {activeCommittee.description}
                        </p>
                      </div>

                      {/* Objectives and Goals */}
                      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                        <h3 className="text-base font-black text-gray-900 font-title uppercase tracking-wide border-b border-gray-100 pb-3">
                          Key Objectives
                        </h3>
                        <ul className="space-y-3.5">
                          {activeCommittee.objectives.map((obj, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm text-gray-700 font-extrabold text-left leading-relaxed">
                              <CheckCircle2 className="w-5 h-5 text-[#FF8A00] shrink-0 mt-0.5" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Functions / Activities Grid */}
                      {activeCommittee.keyFunctions && (
                        <div className="space-y-4">
                          <h3 className="text-base font-black text-gray-900 font-title uppercase tracking-wide pl-2">
                            Key Functions & Action Areas
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeCommittee.keyFunctions.map((func, i) => (
                              <div key={i} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
                                <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-md inline-block mb-2">
                                  Phase 0{i + 1}
                                </span>
                                <h4 className="text-sm font-black text-gray-900 mb-1">
                                  {func.title}
                                </h4>
                                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                  {func.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  ) : (
                    <motion.div
                      key="document-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {/* PDF Viewer Card */}
                      <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-150 pb-4 px-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#FF8A00]" />
                            <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                              Official Document Preview
                            </span>
                          </div>
                          
                          <div className="text-[10px] font-bold text-gray-400 bg-slate-100 border border-gray-200 px-3 py-1 rounded-full uppercase">
                            Source: /Documents/PDFs/Committees/
                          </div>
                        </div>

                        {/* Interactive Iframe Viewer */}
                        <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-gray-250 relative min-h-[600px] flex items-center justify-center">
                          <iframe 
                            src={`${activeCommittee.pdf}#toolbar=0`} 
                            className="absolute inset-0 w-full h-full border-none shadow-inner" 
                            title={`${activeCommittee.title} Document`}
                          />

                        </div>
                        
                        {/* Action Note */}
                        <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl text-center">
                          <p className="text-xs text-gray-500 font-bold">
                            Cannot view PDF in your browser? Click here to{' '}
                            <a href={activeCommittee.pdf} download className="text-[#FF8A00] font-black underline hover:text-[#E07B00]">
                              Download the PDF directly
                            </a>.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </AnimatePresence>
          </main>

        </div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
          <p className="text-xs font-bold text-gray-500 leading-relaxed">
            Adhiparasakthi Engineering College • Approved by AICTE, New Delhi • Affiliated to Anna University, Chennai • Accredited by NAAC with A Grade
            <br />
            Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}

