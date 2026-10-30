import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Shield, FileText, CheckCircle2, Mail, Building, 
  Users, ChevronRight, Search, Laptop, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Leadership Data
const leadership = [
  {
    role: "Controller of Examinations",
    badge: "COE",
    name: "Dr. V. Vijayasundaram",
    qualification: "M.Sc., M.Phil., Ph.D.",
    department: "Science & Humanities (Mathematics)",
    designation: "Professor & Controller of Examinations",
    email: "vijayasundaram@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793354946/apec/Faculty/1793354942812_sh_vijay_sundram_new.jpg"
  },
  {
    role: "Deputy Controller of Examinations",
    badge: "Deputy COE",
    name: "Mr. J. Senthil Kumar",
    qualification: "M.Tech.",
    department: "Artificial Intelligence and Machine Learning",
    designation: "Assistant Professor & Deputy COE",
    email: "omsakthisenthil@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/c_fill,g_north/v1793338297/apec/Faculty/1793338296069_aiml_senthil_kumar_jpg.jpg"
  }
];

// Department Incharges / Teaching Staff
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
    dept: "Electrical and Electronics Engineering",
    deptKey: "eee",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "sakthivelb@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338368/apec/Faculty/1793338367551_eee_sakthivel_jpg.jpg"
  },
  {
    id: 4,
    name: "Mrs. J. Suganya",
    dept: "Electronics & Communication Engineering",
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
    deptKey: "chemical",
    designation: "Assistant Professor",
    qualification: "M.Tech.",
    email: "swethats@apec.edu.in",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338304/apec/Faculty/1793338302821_chemical_t_s_swetha_jpg.jpg"
  },
  {
    id: 8,
    name: "Ms. R. Menaga",
    dept: "Artificial Intelligence and Machine Learning",
    deptKey: "aiml",
    designation: "Assistant Professor",
    qualification: "M.E.",
    email: "menagashanthi1121@gmail.com",
    image: "https://res.cloudinary.com/o1hw2rfp/image/upload/v1793338298/apec/Faculty/1793338297109_aiml_Ms__R__Menaga_b64.jpg"
  },
  {
    id: 9,
    name: "Mr. G. Sekar",
    dept: "Computer Science & Design (CSD)",
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
    qualification: "B.Com., MBA",
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

// Initials Avatar Component for members without image
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
    <div className="w-full h-full bg-gradient-to-br from-[#07113A] to-[#1E2E67] flex items-center justify-center text-white font-bold text-2xl select-none">
      {initials || 'AP'}
    </div>
  );
}

export default function Coe() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = coeTeachingStaff.filter(staff => {
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (staff.designation && staff.designation.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#C5A059]/20 selection:text-[#07113A]">
      {/* 1. Header / Hero Section - Tight Spacing */}
      <section className="relative overflow-hidden bg-[#07113A] text-white pt-8 pb-14 border-b border-[#C5A059]/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold tracking-wider uppercase mb-2">
            <Shield className="w-3.5 h-3.5" />
            Autonomous Examination Cell
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Office of the Controller of Examinations
          </h1>

          <div className="mt-4 flex flex-wrap gap-2.5 text-xs text-slate-300 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Autonomous Regulations</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Confidential Valuation</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Anna University Autonomous</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Executive Leadership Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadership.map((leader, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-200/80 hover:border-[#C5A059]/50 transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start"
            >
              <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-[#C5A059]/30 bg-slate-100 flex items-start justify-center">
                <StaffAvatar name={leader.name} image={leader.image} className="w-full h-full object-cover object-[center_0%]" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#07113A]/5 text-[#07113A] border border-[#07113A]/10 text-xs font-bold uppercase tracking-wide mb-1.5">
                  {leader.badge}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#07113A]">
                  {leader.name}
                </h3>
                <p className="text-xs text-[#C5A059] font-semibold mt-0.5 mb-1.5">
                  {leader.qualification}
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {leader.designation}
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  {leader.department}
                </p>

                {leader.email && (
                  <a 
                    href={`mailto:${leader.email}`} 
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#07113A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{leader.email}</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Department Faculty In-Charges (COE Cell Members) - All In One Frame with Large Images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#C5A059] uppercase mb-1">
              <Users className="w-4 h-4" />
              Department Representatives
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07113A]">
              Faculty Incharges of COE
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Designated faculty coordinators across all departments in a single directory frame.
            </p>
          </div>

          {/* Search Control */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search faculty or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07113A]/20 focus:border-[#07113A] w-full sm:w-72"
            />
          </div>
        </div>

        {/* Faculty Grid - Large Portrait Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((staff, idx) => (
            <motion.div 
              key={staff.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Large Portrait Image */}
                <div className="w-full h-64 overflow-hidden bg-slate-100 relative">
                  <StaffAvatar 
                    name={staff.name} 
                    image={staff.image} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#07113A]/85 text-white backdrop-blur-sm shadow-sm">
                      {staff.deptKey.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5">
                  <h4 className="text-base font-bold text-[#07113A] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {staff.name}
                  </h4>
                  <p className="text-xs text-[#C5A059] font-semibold mt-0.5">
                    {staff.qualification}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {staff.designation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span className="truncate">{staff.dept}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Footer */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                {staff.email ? (
                  <a 
                    href={`mailto:${staff.email}`}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#07113A] hover:underline bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg w-full transition-colors truncate"
                    title={staff.email}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Department Contact via Office</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-semibold">No faculty match your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-[#07113A] font-bold underline"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* 4. Technical Staff Section */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#C5A059] uppercase mb-1">
              <Laptop className="w-4 h-4" />
              Technical Administration
            </div>
            <h2 className="text-2xl font-extrabold text-[#07113A]">
              Technical & Support Staff
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dedicated technical professionals managing confidential examination records and infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coeTechnicalStaff.map((tech) => (
              <div 
                key={tech.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#07113A]/5 border border-[#07113A]/10 flex items-center justify-center text-[#07113A] font-extrabold text-sm">
                      {tech.name.split(' ').pop()?.[0] || 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#07113A]">{tech.name}</h4>
                      <p className="text-xs text-[#C5A059] font-semibold">{tech.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tech.office}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Autonomous Framework & Upcoming Examination Portal Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-[#07113A] to-[#12245C] text-white p-7 sm:p-9 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2.5">
                <Clock className="w-3.5 h-3.5" />
                Upcoming Student Services
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                Digital Examination Portal & Result Verification
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                The integrated online student services for downloading Examination Hall Tickets, Semester Timetables, 
                Revaluation Applications, and End-Semester Mark Statements will be activated here in alignment with the 
                autonomous examination schedule.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs shrink-0 w-full md:w-auto">
              <p className="font-bold text-[#C5A059] mb-1">Office of the COE Helpdesk</p>
              <p className="text-slate-200">Email: coe@apec.edu.in</p>
              <p className="text-slate-300 text-[11px] mt-1">Intercom: Ext. 204 / 205</p>
              <p className="text-slate-300 text-[11px]">Ground Floor, Admin Block</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
