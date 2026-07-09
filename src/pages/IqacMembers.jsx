import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function IqacMembers() {
  const members = [
    { sno: 1, name: "Prof. Dr. J. Raja", designation: "Principal", role: "Chairperson" },
    { sno: 2, name: "Prof. Dr. V. Ramasamy", designation: "Dean", role: "Teacher Representative" },
    { sno: 3, name: "Dr. C. K. Dhinakar Raj", designation: "HOD / Mechanical", role: "Teacher Representative" },
    { sno: 4, name: "Dr. S. A. Elankurisil", designation: "Professor / EEE", role: "Teacher Representative" },
    { sno: 5, name: "Dr. M. Malathi", designation: "HOD / ECE", role: "Teacher Representative" },
    { sno: 6, name: "Dr. C. Dhaya", designation: "HOD / CSE", role: "Teacher Representative" },
    { sno: 7, name: "Dr. A. Bhuvaneswari", designation: "HOD / IT", role: "Teacher Representative" },
    { sno: 8, name: "Mr. B. Ganesh", designation: "HOD / Chemical", role: "Teacher Representative" },
    { sno: 9, name: "Dr. S. Sakthi Raadha", designation: "HOD / S&H", role: "Teacher Representative" },
    { sno: 10, name: "Dr. S. Arun Kumar", designation: "HOD / MCA", role: "Teacher Representative" },
    { sno: 11, name: "Dr. M. Saviour", designation: "HOD / MBA", role: "Teacher Representative" },
    { sno: 12, name: "Mr. M. Sadanandan", designation: "Administrative Officer", role: "Management Representative" },
    { sno: 13, name: "Mr. S. Sathiyamoorthy", designation: "Senior Accountant", role: "Nominee from office" },
    { sno: 14, name: "Mr. R. Karunanidhi", designation: "Secretary, Adhiparasakthi Educational Institutions, Kalavai", role: "Nominee from Trust" },
    { sno: 15, name: "Ms. N. C. Sri Vaibava Lakshmi", designation: "IV year B.E., ECE", role: "Nominee from Student" },
    { sno: 16, name: "Ms. Sandhiya", designation: "IV year B.Tech., IT", role: "Nominee from Student" },
    { sno: 17, name: "Dr. N. Elamathi", designation: "HOD / AIML", role: "Nominee from Alumni" },
    { sno: 18, name: "Mr. J. Parthiban", designation: "Assistant Professor / Civil", role: "Nominee from Alumni" },
    { sno: 19, name: "Mr. E. Karunanidhi", designation: "Jasmin Infotech Pvt. Ltd., Plot 119, VelacherryTambaram Road, Pallikaranai, Chennai – 600 100.", role: "Nominee from Employer" },
    { sno: 20, name: "Mr. V. Balamurugan", designation: "Proprietor, Bala Construction, 10 - Chozhan Street, Ramakrishna Raj Nagar, Madipakkam, Chennai – 600 091.", role: "Nominee from Industrialist" },
    { sno: 21, name: "Mr. A. Sundar", designation: "F/o. Mr. S. Naveen, (II – B.E., EEE) No.: 21, Adigalar Street, Melmaruvathur – 603 319", role: "Nominee from Stakeholders (Parent)" },
    { sno: 22, name: "Dr. T. N. Sureshbabu", designation: "Professor / ECE", role: "Coordinator, IQAC" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 py-16 md:py-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-10">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#FF8A00] bg-[#FFE7CC]/60 border border-[#FFE7CC] px-4 py-2 rounded-full inline-block mb-4 uppercase">
              NAAC Committee
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-title tracking-tight mb-4 text-gray-900 leading-tight">
              IQAC Members
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-bold max-w-3xl leading-relaxed">
              Official constitution list of the Internal Quality Assurance Cell (IQAC) members at Adhiparasakthi Engineering College coordinating institutional quality development.
            </p>
          </div>
        </div>

        {/* Composition and Tenure Info */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-black font-title text-gray-900 mb-4 flex items-center gap-2.5">
              <Users className="w-5 h-5 text-indigo-650" /> Committee Constitution (2022 - 2024)
            </h3>
            <p className="text-xs md:text-sm font-semibold text-gray-655 leading-relaxed mb-6">
              The Internal Quality Assurance Cell (IQAC) has been constituted under the chairmanship of the Principal, Prof. Dr. J. Raja, with the following members as per NAAC guidelines for the period of two years (2022 – 2024). The committee represents teachers at all levels, trust management, senior administration, local society, alumni, students, and industrial stakeholders.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Chairperson</span>
                <span className="text-xs md:text-sm font-extrabold text-gray-900">Prof. Dr. J. Raja</span>
              </div>
              <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">IQAC Coordinator</span>
                <span className="text-xs md:text-sm font-extrabold text-gray-900">Dr. T. N. Sureshbabu</span>
              </div>
              <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Total Members</span>
                <span className="text-xs md:text-sm font-extrabold text-gray-900">22 Members</span>
              </div>
              <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Active Tenure</span>
                <span className="text-xs md:text-sm font-extrabold text-gray-900">2022 - 2024</span>
              </div>
            </div>
          </motion.div>

          {/* Responsive table */}
          <motion.div variants={fadeInUp} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-xs font-black uppercase text-gray-400 w-16">S.No.</th>
                    <th className="py-4 px-6 text-xs font-black uppercase text-gray-400">Name of Member</th>
                    <th className="py-4 px-6 text-xs font-black uppercase text-gray-400">Designation</th>
                    <th className="py-4 px-6 text-xs font-black uppercase text-gray-400">Role in IQAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((member) => (
                    <tr key={member.sno} className="hover:bg-indigo-50/15 transition-colors">
                      <td className="py-4 px-6 text-xs font-bold text-gray-500">{member.sno}</td>
                      <td className="py-4 px-6 text-xs font-extrabold text-gray-900">{member.name}</td>
                      <td className="py-4 px-6 text-xs font-semibold text-gray-655 leading-relaxed">{member.designation}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          member.role === 'Chairperson' 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : member.role === 'Coordinator, IQAC'
                            ? 'bg-indigo-50 text-indigo-650 border border-indigo-100'
                            : member.role === 'Teacher Representative'
                            ? 'bg-emerald-50 text-emerald-650 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info note */}
        <div className="mt-16 bg-gray-50 border border-gray-250 p-6 rounded-2xl text-center">
          <p className="text-sm md:text-base font-extrabold text-gray-600 leading-relaxed">
            Adhiparasakthi Engineering College • Melmaruvathur - 603 319, Chengalpattu District, Tamil Nadu, India.
          </p>
        </div>

      </div>
    </div>
  );
}
