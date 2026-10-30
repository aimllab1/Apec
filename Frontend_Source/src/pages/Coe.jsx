import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Shield, FileText, Mail, Building, 
  Users, ChevronRight, Search, Laptop, Clock, ArrowLeft,
  GraduationCap, MapPin, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

// COE & Deputy COE Leadership Profiles
const coeLeadership = {
  coe: {
    role: "Controller of Examinations",
    badge: "COE",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    name: "Dr. V. Vijayasundaram",
    qualification: "M.Sc., M.Phil., Ph.D.",
    designation: "Professor & Controller of Examinations",
    department: "Science & Humanities (Physics)",
    email: "vijayasundaram@apec.edu.in",
    office: "Office of the COE, Ground Floor, Main Block",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg",
    },
  deputyCoe: {
    role: "Deputy Controller of Examinations",
    badge: "Deputy COE",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    name: "Mr. J. Senthil Kumar",
    qualification: "M.Tech.",
    designation: "Assistant Professor & Deputy COE",
    department: "Artificial Intelligence and Machine Learning",
    email: "omsakthisenthil@gmail.com",
    office: "Office of the COE, Ground Floor, Main Block",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/c_fill,g_north/v1793338297/apec/Faculty/1793338296069_aiml_senthil_kumar_jpg.jpg",
    }
};

// Department Representatives / Faculty Incharges of COE Cell
const coeTeachingStaff = [
  {
    id: 1,
    name: "Mr. S. Selvakumar",
    dept: "Civil Engineering",
    deptKey: "civil",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "selvaashika3@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338310/apec/Faculty/1793338309179_civil_selvakumar_jpg.jpg"
  },
  {
    id: 2,
    name: "Dr. K. Gajalakshmi",
    dept: "Mechanical Engineering",
    deptKey: "mech",
    designation: "Associate Professor",
    qualification: "M.E., Ph.D.",
    email: "kg@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338343/apec/Faculty/1793338342192_mech_gajalakshmi_jpg.jpg"
  },
  {
    id: 3,
    name: "Mr. B. Sakthivel",
    dept: "Electrical & Electronics Engineering",
    deptKey: "eee",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "sakthivelb@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338368/apec/Faculty/1793338367551_eee_sakthivel_jpg.jpg"
  },
  {
    id: 4,
    name: "Mrs. J. Suganya",
    dept: "Electronics & Communication Engg",
    deptKey: "ece",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "suganya.yamni@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338379/apec/Faculty/1793338378160_ece_suganya_jpg.jpg"
  },
  {
    id: 5,
    name: "Ms. A. Jayanthi",
    dept: "Computer Science & Engineering",
    deptKey: "cse",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "jayanthiarumugam90@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338332/apec/Faculty/1793338330932_cse_jayanthi_jpg.jpg"
  },
  {
    id: 6,
    name: "Mrs. M. Seetha",
    dept: "Information Technology",
    deptKey: "it",
    designation: "Assistant Professor",
    qualification: "MCA",
    email: "sita110594@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338325/apec/Faculty/1793338323865_mca_seetha_jpg.jpg"
  },
  {
    id: 7,
    name: "Ms. T. S. Swetha",
    dept: "Chemical Engineering",
    deptKey: "chem",
    designation: "Assistant Professor",
    qualification: "M.Tech.",
    email: "swethats@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338304/apec/Faculty/1793338302821_chemical_t_s_swetha_jpg.jpg"
  },
  {
    id: 8,
    name: "Ms. R. Menaga",
    dept: "AI & Machine Learning",
    deptKey: "aiml",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "menagashanthi1121@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338298/apec/Faculty/1793338297109_aiml_Ms__R__Menaga_b64.jpg"
  },
  {
    id: 9,
    name: "Mr. G. Sekar",
    dept: "Computer Science & Design",
    deptKey: "csd",
    designation: "Assistant Professor",
    qualification: "M.E., (Ph.D.)",
    email: "sekar@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338328/apec/Faculty/1793338327122_cse_sekar_jpg.jpg"
  },
  {
    id: 10,
    name: "Mr. S. Mano",
    dept: "Agricultural Engineering",
    deptKey: "agri",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "agri@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338351/apec/Faculty/1793338350272_mech_mohan_jpg.jpg"
  },
  {
    id: 11,
    name: "Mrs. P. Kavitha",
    dept: "Management Studies (MBA)",
    deptKey: "mba",
    designation: "Assistant Professor",
    qualification: "MBA",
    email: "kavithakamal673@gamil.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338389/apec/Faculty/1793338387967_mba_kavitha_jpg.jpg"
  },
  {
    id: 12,
    name: "Ms. A. Yamuna",
    dept: "Computer Applications (MCA)",
    deptKey: "mca",
    designation: "Assistant Professor",
    qualification: "MCA",
    email: "yamuanan97@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338322/apec/Faculty/1793338319253_mca_yamuna_jpg.jpg"
  }
];

// Technical & Support Staff
const coeTechnicalStaff = [
  {
    id: 1,
    name: "Ms. G. Preethi",
    role: "Technical Assistant",
    office: "COE Data & Records Section",
    desc: "Examination record management, student marks data entry, and portal technical administration."
  },
  {
    id: 2,
    name: "Mr. M. Vetrivendhan",
    role: "Technical Assistant / Systems Admin",
    office: "COE Systems & Network",
    desc: "Confidential network security, central valuation server management, and hardware infrastructure."
  },
  {
    id: 3,
    name: "Mrs. B. Lakshmi Priya",
    role: "Office Assistant",
    office: "COE Confidential Section",
    desc: "Examination documentation, candidate hall allocation records, and confidential certificate handling."
  }
];

// Reusable Staff Avatar with Error Handling & Fallback
function StaffAvatar({ name, image, className = "w-full h-full object-cover" }) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <img 
        src={image} 
        alt={name} 
        className={className}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = name
    .replace(/(Dr\.|Mr\.|Mrs\.|Ms\.)/gi, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join('');

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#07113A] to-[#1E2E67] flex items-center justify-center text-white font-bold select-none">
      <span className="text-sm sm:text-base font-title">{initials || 'AP'}</span>
    </div>
  );
}

export default function Coe() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = coeTeachingStaff.filter(staff => {
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.deptKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (staff.designation && staff.designation.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const { coe, deputyCoe } = coeLeadership;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans selection:bg-amber-100 selection:text-[#07113A]">
      
      {/* Breadcrumb Navigation - Matching Department Pages */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold flex-wrap">
            <Link to="/" className="hover:text-indigo-650 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/departments" className="hover:text-indigo-650 transition-colors">Academics</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#07113A] font-bold">Office of Controller of Examinations</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section - Consistent with Department Detail Header */}
      <section className="bg-white border-b border-gray-200/80 py-4 sm:py-5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              Autonomous Examination Cell
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase">
              Anna University Affiliated
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
              UGC Autonomous Status
            </span>
          </div>

          {/* Department Main Title in font-title font */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-title tracking-tight text-[#07113A] leading-tight">
            Office of Controller of Examinations
          </h1>

          </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">

        {/* 1. CONTROLLER OF EXAMINATIONS (COE) PROFILE CARD */}
        <section className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white border-2 border-amber-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 relative z-10">
              
              {/* COE Portrait Image */}
              <div className="relative shrink-0">
                <div className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-md bg-slate-100 flex items-center justify-center">
                  <StaffAvatar 
                    name={coe.name} 
                    image={coe.image} 
                    className="w-full h-full object-cover object-top" 
                  />
                </div>
                {/* Official Role Ribbon */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-max">
                  <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1 rounded-full bg-[#07113A] text-amber-400 border border-amber-400/50 shadow-sm">
                    {coe.badge}
                  </span>
                </div>
              </div>

              {/* COE Detailed Information */}
              <div className="flex-1 text-center md:text-left">
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 mb-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-title text-[#07113A] tracking-tight">
                    {coe.name}
                  </h3>
                  {coe.qualification && (
                    <span className="text-xs sm:text-sm font-black bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg text-amber-800 uppercase font-mono tracking-wider shadow-2xs">
                      {coe.qualification}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-indigo-650 uppercase tracking-wider mb-1.5">
                  {coe.designation}
                </p>

                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold mb-5">
                  {coe.department}
                </p>

                {/* Office & Contact Directory Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
                  <a 
                    href={`mailto:${coe.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold hover:bg-indigo-100 transition-colors shadow-2xs"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>{coe.email}</span>
                  </a>

                  <span className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{coe.office}</span>
                  </span>
                </div>

              </div>

            </div>
          </motion.div>
        </section>

        {/* 2. DEPUTY CONTROLLER OF EXAMINATIONS (DEPUTY COE) PROFILE CARD - (Directly Below COE) */}
        <section className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white border-2 border-indigo-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 relative z-10">
              
              {/* Deputy COE Portrait Image */}
              <div className="relative shrink-0">
                <div className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden border-2 border-indigo-300/80 shadow-md bg-slate-100 flex items-center justify-center">
                  <StaffAvatar 
                    name={deputyCoe.name} 
                    image={deputyCoe.image} 
                    className="w-full h-full object-cover object-top" 
                  />
                </div>
                {/* Official Role Ribbon */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-max">
                  <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1 rounded-full bg-[#07113A] text-indigo-300 border border-indigo-300/50 shadow-sm">
                    {deputyCoe.badge}
                  </span>
                </div>
              </div>

              {/* Deputy COE Detailed Information */}
              <div className="flex-1 text-center md:text-left">
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 mb-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-title text-[#07113A]">
                    {deputyCoe.name}
                  </h3>
                  {deputyCoe.qualification && (
                    <span className="text-xs sm:text-sm font-black bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg text-indigo-800 uppercase font-mono tracking-wider shadow-2xs">
                      {deputyCoe.qualification}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-indigo-650 uppercase tracking-wider mb-1.5">
                  {deputyCoe.designation}
                </p>

                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold mb-5">
                  {deputyCoe.department}
                </p>

                {/* Office & Contact Directory Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
                  <a 
                    href={`mailto:${deputyCoe.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold hover:bg-indigo-100 transition-colors shadow-2xs"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>{deputyCoe.email}</span>
                  </a>

                  <span className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{deputyCoe.office}</span>
                  </span>
                </div>

              </div>

            </div>
          </motion.div>
        </section>

        {/* 3. COE CELL MEMBERS (DEPARTMENT IN-CHARGES) - 5 IN A ROW (DESKTOP) & COMPACT AVATAR */}
        <section className="text-left pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-6 bg-[#07113A] rounded-full" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-[#07113A] tracking-tight">
                  COE Cell Members
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Designated faculty coordinators across all autonomous departments representing the Office of COE.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search member or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-650/20 focus:border-indigo-650 w-full sm:w-64"
              />
            </div>
          </div>

          {/* 5-in-a-row responsive grid on desktop (2 on mobile, 3 on sm, 4 on md, 5 on lg) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5">
            {filteredFaculty.map((staff, idx) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300 group text-center relative"
              >
                <div>
                  {/* Department Key Badge */}
                  <div className="flex justify-center mb-2.5">
                    <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-150 text-indigo-700 uppercase font-mono tracking-wider">
                      {staff.deptKey.toUpperCase()}
                    </span>
                  </div>

                  {/* Compact, Uniform Avatar (Reduced from previous huge 256px card image) */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-slate-100 group-hover:border-indigo-300 shadow-xs group-hover:scale-105 transition-all duration-300 bg-slate-50 flex items-center justify-center shrink-0">
                    <StaffAvatar 
                      name={staff.name} 
                      image={staff.image} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Faculty Member Name */}
                  <h4 
                    className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-indigo-650 transition-colors line-clamp-1 leading-snug"
                    title={staff.name}
                  >
                    {staff.name}
                  </h4>

                  {/* Qualification Badge */}
                  <div className="mt-0.5">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase font-mono">
                      {staff.qualification}
                    </span>
                  </div>

                  {/* Academic Designation */}
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                    {staff.designation}
                  </p>

                  {/* Department Name */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p 
                      className="text-[10px] sm:text-[11px] font-bold text-slate-700 line-clamp-1 flex items-center justify-center gap-1"
                      title={staff.dept}
                    >
                      <Building className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{staff.dept}</span>
                    </p>
                  </div>
                </div>

                {/* Email Footer Link */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-center">
                  {staff.email ? (
                    <a 
                      href={`mailto:${staff.email}`}
                      className="text-[10px] sm:text-[11px] text-slate-500 hover:text-indigo-650 font-medium flex items-center gap-1.5 truncate max-w-full transition-colors"
                      title={staff.email}
                    >
                      <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{staff.email}</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">COE Cell Member</span>
                  )}
                </div>

              </motion.div>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-semibold text-xs sm:text-sm">No members match your search criteria.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-indigo-650 font-bold underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </section>

        {/* 4. TECHNICAL & SUPPORT STAFF DIRECTORY */}
        <section className="text-left pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-6 bg-slate-700 rounded-full" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-title text-[#07113A] tracking-tight">
              Technical & Support Staff
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {coeTechnicalStaff.map((tech) => (
              <div 
                key={tech.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-650 font-black text-sm shrink-0">
                      {tech.name.split(' ').pop()?.[0] || 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#07113A]">{tech.name}</h4>
                      <p className="text-[11px] sm:text-xs text-amber-700 font-bold uppercase tracking-wide">{tech.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tech.office}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {tech.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. EXAMINATION SERVICES & HELPDESK BANNER */}
        <section className="rounded-3xl bg-gradient-to-br from-[#07113A] via-[#0E1E54] to-[#07113A] text-white p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden text-left">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" />
                Examination Student Services
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-title text-white mb-2 leading-tight">
                Autonomous Semester Examination Services
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Semester Exam Timetables, Hall Tickets, Revaluation & Review Applications, and Grade Cards are released by the Office of the Controller of Examinations according to the Academic Calendar. Students and faculty can connect directly via the central office.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-xs shrink-0 w-full md:w-auto">
              <p className="font-bold text-amber-300 text-sm mb-1 font-title">Office of the COE Helpdesk</p>
              <p className="text-slate-100 font-semibold flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> coe@apec.edu.in
              </p>
              <p className="text-slate-300 text-xs mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Ground Floor, Main Block, APEC
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
