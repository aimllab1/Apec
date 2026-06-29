import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, BookOpen, Clock, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const deptData = {
  cse: {
    name: "B.E. Computer Science & Engineering",
    duration: "4 Years",
    intake: "120 Seats",
    labs: [
      "Software Development Lab (Python, Java, C++)",
      "Database Systems Lab (MySQL, Oracle)",
      "Operating Systems & Linux Lab",
      "AI & Machine Learning Research Hub"
    ],
    info: "The Computer Science and Engineering department focuses on empowering students with algorithms, computer organization, software architectures, artificial intelligence, and scalable cloud designs."
  },
  aiml: {
    name: "B.E. Computer Science & Eng. (AI & ML)",
    duration: "4 Years",
    intake: "60 Seats",
    labs: [
      "Data Analytics & Python Lab",
      "Deep Learning Research Hub (TensorFlow, PyTorch)",
      "Neural Networks Simulation Laboratory"
    ],
    info: "This specialized CSE branch focuses on advanced predictive analytics, neural networks, machine learning models, natural language processing, and robotics applications."
  },
  it: {
    name: "B.Tech. Information Technology",
    duration: "4 Years",
    intake: "60 Seats",
    labs: [
      "Web Technologies & Scripting Lab",
      "Computer Networks & Cisco Packet Tracer Lab",
      "Mobile App Development Lab (Android, Flutter)",
      "Cloud Virtualization Hub"
    ],
    info: "The Information Technology department prepares students for computer networking, cloud deployment, web services development, and security operations."
  },
  ece: {
    name: "B.E. Electronics & Communication Engineering",
    duration: "4 Years",
    intake: "90 Seats",
    labs: [
      "VLSI Design & Cadence Tool Lab",
      "Digital Signal Processing Lab",
      "Embedded Systems & Microcontroller Lab",
      "Microwave & Smart Antenna Lab"
    ],
    info: "Focuses on semiconductor design, telecommunication engineering, VLSI system layouts, embedded systems, and wireless satellite communications."
  },
  eee: {
    name: "B.E. Electrical & Electronics Engineering",
    duration: "4 Years",
    intake: "60 Seats",
    labs: [
      "Electrical Machines Lab (AC/DC Motors)",
      "Power Electronics & Conversions Lab",
      "Control Systems Laboratory",
      "Electric Vehicle (EV) Testing Cell"
    ],
    info: "Trains students in electric motor drives, high-voltage grids, smart grid management systems, and battery designs for electric vehicles."
  },
  chemical: {
    name: "B.Tech. Chemical Engineering",
    duration: "4 Years",
    intake: "30 Seats",
    labs: [
      "Fluid Mechanics Laboratory",
      "Mass Transfer & Distillation Unit",
      "Chemical Reaction Engineering Lab",
      "Organic Chemical Processing Lab"
    ],
    info: "Prepares engineers for chemical process management, refinery simulations, material science development, and fluid dynamic control."
  },
  agriculture: {
    name: "B.Tech. Agricultural Engineering",
    duration: "4 Years",
    intake: "30 Seats",
    labs: [
      "Irrigation & Water Resource Lab",
      "Soil Science & Drainage Testing Cell",
      "Farm Tractors & Power Machinery Lab",
      "Post-Harvest Processing Lab"
    ],
    info: "Focuses on food process engineering, farm equipment operations, sustainable irrigation design, and hydrology surveys."
  },
  mech: {
    name: "B.E. Mechanical Engineering",
    duration: "4 Years",
    intake: "30 Seats",
    labs: [
      "CAD/CAM Modelling Center (SolidWorks, AutoCAD)",
      "Thermal Engineering & Heat Engines Lab",
      "Fluid Machinery & Hydraulic Systems Lab",
      "Manufacturing & Machine Shop"
    ],
    info: "Covers material testing, thermodynamics, CAD drawing systems, product manufacturing, and automated robotics assemblies."
  },
  civil: {
    name: "B.E. Civil Engineering",
    duration: "4 Years",
    intake: "30 Seats",
    labs: [
      "Strength of Materials Lab",
      "Concrete Technology & Cement Testing Lab",
      "Soil Mechanics & Geo-Tech Lab",
      "Surveying & GPS Mapping Laboratory"
    ],
    info: "Focuses on construction surveying, concrete structures, environmental fluid setups, and infrastructure management."
  },
  mca: {
    name: "Master of Computer Applications (MCA)",
    duration: "2 Years",
    intake: "60 Seats",
    labs: [
      "Advanced Java & Dot Net Lab",
      "Cloud Architectures & AWS Labs",
      "Software Testing & Project Management Cell"
    ],
    info: "A postgraduate program focused on advanced software project cycles, cloud databases, full-stack web architectures, and client-side systems."
  },
  mba: {
    name: "Master of Business Administration (MBA)",
    duration: "2 Years",
    intake: "60 Seats",
    labs: [
      "Business Analytics & Excel Lab",
      "Corporate Communication Center"
    ],
    info: "Provides executive training in investment banking, marketing analytics, business logistics, and corporate administration strategies."
  }
};

export default function DepartmentDetail() {
  const { id } = useParams();
  const dept = deptData[id] || deptData.cse;

  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-left">
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/departments" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
            Department Profile
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">{dept.name}</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-3xl font-semibold">{dept.info}</p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-6 mb-12 max-w-md"
        >
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-3xl">
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Duration
            </span>
            <span className="block text-base font-black text-gray-800 mt-2">{dept.duration}</span>
          </div>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-3xl">
            <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Annual Intake
            </span>
            <span className="block text-base font-black text-gray-800 mt-2">{dept.intake}</span>
          </div>
        </motion.div>

        {/* Labs List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-gray-150 pt-10"
        >
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Infrastructure & Core Laboratories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dept.labs.map((lab, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                className="p-5 bg-gray-50/50 border border-gray-200 rounded-2xl flex items-start gap-3 hover:border-indigo-500 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span className="text-xs font-semibold text-gray-700 leading-relaxed">{lab}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
