import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, MapPin, BookOpen, Award, Briefcase, User, CheckCircle2, FileText,
} from 'lucide-react';
import administrationData from '../data/administrationData';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function AdminProfile() {
  const { id } = useParams();
  const person = administrationData.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="font-title text-2xl font-bold text-gray-900 mb-3">Profile Not Found</h1>
        <p className="text-sm text-gray-500 font-semibold mb-8">
          The administration profile you are looking for does not exist.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-5 py-2.5 rounded-full hover:bg-indigo-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to About
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-20 px-6 overflow-hidden min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mb-10"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Administration
          </Link>
        </motion.div>

        {/* Hero: Photo + Identity */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row items-start gap-12 mb-16 border-b border-gray-100 pb-16"
        >
          {/* Portrait */}
          <div className="w-full lg:w-5/12 shrink-0">
            <div className="relative group max-w-sm w-full p-2 bg-gray-50 border border-gray-200/80 rounded-[32px] shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.01] hover:border-indigo-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="overflow-hidden rounded-[24px]">
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-full h-[380px] object-cover object-[center_12%] rounded-[24px] grayscale-[10%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                <span className="font-display text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-0.5">
                  {person.department}
                </span>
                <h4 className="font-serif text-sm font-bold text-white leading-tight">{person.name}</h4>
                <span className="font-display text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">
                  {person.role}
                </span>
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <span className="font-display text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block mb-3.5 self-start">
              Administration Profile
            </span>
            <h1 className="font-title text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-1">
              {person.name}
            </h1>
            <p className="font-display text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
              {person.role}
            </p>
            <p className="font-mono text-xs text-gray-400 font-semibold mb-6">
              {person.qualifications} &mdash; {person.department}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-semibold mb-8">
              {person.bio}
            </p>
            <div className="flex flex-wrap gap-3">
              {person.contact && (
                <a
                  href={`mailto:${person.contact}`}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  {person.contact}
                </a>
              )}
              {person.office && (
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {person.office}
                </span>
              )}
              {person.cvUrl && (
                <a
                  href={person.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Curriculum Vitae"
                  aria-label="Open Curriculum Vitae PDF"
                  className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-full shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                >
                  <FileText className="w-3 h-3" />
                  Curriculum Vitae
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Responsibilities */}
          <motion.div
            variants={fadeInUp}
            className="p-7 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-5 shadow-md">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-gray-900 mb-4">Roles &amp; Responsibilities</h2>
            <ul className="space-y-2.5">
              {person.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500 font-semibold leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Achievements */}
          <motion.div
            variants={fadeInUp}
            className="p-7 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-pink-500 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white mb-5 shadow-md">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-gray-900 mb-4">Achievements &amp; Awards</h2>
            <ul className="space-y-2.5">
              {person.achievements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500 font-semibold leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Research Interests — spans full width when present */}
          {person.researchInterests && person.researchInterests.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="p-7 bg-gray-50/50 border border-gray-200 rounded-3xl hover:border-emerald-500 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:col-span-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-5 shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold text-gray-900 mb-4">Research Interests</h2>
              <div className="flex flex-wrap gap-3">
                {person.researchInterests.map((item, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-10 border-t border-gray-100"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-gray-950 hover:bg-gray-800 px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Administration
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
