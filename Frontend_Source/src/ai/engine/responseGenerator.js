// Natural, human-friendly response generator
// Converts raw JSON database records into conversational prose

export function generateResponse(docId, rawData, sessionContext = {}) {
  if (!rawData) return "I'm sorry, I couldn't retrieve that information right now. Please contact the APEC helpline at +91 7418064336.";

  // --- COLLEGE GENERAL INFO ---
  if (docId === 'college_info') {
    return `Adhiparasakthi Engineering College (APEC) was established in ${rawData.established} by ${rawData.founder}. It is a NAAC Accredited, UGC Autonomous institution affiliated to Anna University, located at Melmaruvathur, Tamil Nadu.\n\nTNEA Counseling Code: ${rawData.tnea_counseling_code}\nHelplines: ${rawData.helplines.join(', ')}\nEmail: ${rawData.emails.general}`;
  }

  // --- CUTOFF CALCULATOR ---
  if (docId === 'cutoff_calculator') {
    return `TNEA Cutoff Calculator (out of 200 marks):\n\nFormula: ${rawData.formula}\n\nHow it works: ${rawData.rule}\n\nSimply enter your +2 marks in Mathematics, Physics, and Chemistry. Your full Mathematics score is counted, while Physics and Chemistry are halved and added together.`;
  }

  // --- FEE PAYMENT ---
  if (docId === 'fee_payment') {
    return `APEC Smart Fee Payment Details:\n\nBank: ${rawData.bank_name}\nBranch: ${rawData.branch}\nAccount Name: ${rawData.account_name}\nIFSC Code: ${rawData.ifsc_code}\n\nPayment Modes: ${rawData.modes.join(', ')}.\n\n${rawData.instructions}`;
  }

  // --- LIBRARY ---
  if (docId === 'library') {
    return `APEC Central Library is spread over ${rawData.area} and houses ${rawData.volumes}.\n\nThe Book Bank has ${rawData.book_bank}.\n\nDigital access: ${rawData.digital_library}.\n\nProfessional Memberships: ${rawData.memberships.join(', ')}.`;
  }

  // --- HOSTELS ---
  if (docId === 'hostels') {
    return `APEC Hostels provide ${rawData.capacity} in separate Boys and Girls blocks.\n\nMess: ${rawData.mess}\n\nKey Amenities: ${rawData.amenities.join(', ')}.`;
  }

  // --- LABORATORIES ---
  if (docId === 'laboratories') {
    return `APEC Engineering Laboratories:\n\n${rawData.features.map(f => `• ${f}`).join('\n')}`;
  }

  // --- BUS ROUTES ---
  if (docId.startsWith('route_')) {
    const stopsStr = rawData.stops.map(s => `${s.name} (${s.time})`).join(' → ');
    return `Bus Route ${rawData.id} — ${rawData.name}\n\nBus No: ${rawData.busNo}\nDriver: ${rawData.driver} (Call: ${rawData.phone})\n\nRoute Timings:\n${stopsStr}`;
  }

  // --- ADMISSIONS ---
  if (docId === 'admissions_info') {
    const marks = rawData.eligibility.min_average_marks;
    return `APEC Admissions (TNEA Code: ${rawData.counseling_code}):\n\n${rawData.eligibility.hsc_requirements}\n\nMinimum Average PCM Marks:\n• Open Category (OC): ${marks.OC}\n• BC / BCM: ${marks.BC_BCM}\n• MBC / DNC: ${marks.MBC_DNC}\n• SC / SCA / ST: ${marks.SC_SCA_ST}\n\nDocuments Required:\n${rawData.documents_required.map(d => `• ${d}`).join('\n')}`;
  }

  // --- SCHOLARSHIPS ---
  if (docId.startsWith('scholarship_')) {
    return `Scholarship: "${rawData.title}"\n\nProvider: ${rawData.provider}\nAmount: ${rawData.amount}\nEligibility: ${rawData.eligibility}`;
  }

  // --- PLACEMENTS ---
  if (docId === 'placements_info') {
    const s = rawData.statistics;
    const recruiterList = rawData.recruiters.slice(0, 6).map(r => r.name).join(', ');
    const trainingStr = rawData.training_programs.map(p => `• ${p.name} (${p.target}): ${p.details}`).join('\n');
    return `APEC Placement Records:\n\nPlacement Rate: ${s.placement_percentage}\nAnnual Offers: ${s.offers_generated_annually}\nHighest Package: ${s.highest_ctc} | Average: ${s.average_ctc}\n\nKey Recruiters: ${recruiterList}, and more.\n\nTraining Programs:\n${trainingStr}`;
  }

  // --- ADMINISTRATION / OFFICERS ---
  if (docId.startsWith('admin_')) {
    return `${rawData.role}: ${rawData.name}\n\nQualifications: ${rawData.qualifications}\nOffice: ${rawData.office}\nContact: ${rawData.contact}\n\nAbout: ${rawData.bio}`;
  }

  // --- DEPARTMENTS ---
  if (docId.startsWith('dept_')) {
    const courseList = rawData.courses_offered && rawData.courses_offered.length > 0 ? rawData.courses_offered.join(', ') : 'B.E. / B.Tech.';
    const labList = rawData.labs && rawData.labs.length > 0 ? rawData.labs.join(', ') : 'Specialized labs';
    return `Department of ${rawData.name} (${rawData.key.toUpperCase()}):\n\nSeat Intake: ${rawData.seat_intake} seats\nCourses Offered: ${courseList}\n\nAbout: ${rawData.about}\n\nLaboratories: ${labList}\n\nVision: ${rawData.vision}`;
  }

  // --- FACULTY ---
  if (docId.startsWith('faculty_')) {
    return `Faculty Profile:\n\nName: ${rawData.name}\nDesignation: ${rawData.designation}\nDepartment: ${rawData.department}\nQualification: ${rawData.qualification}\nExperience: ${rawData.experience}\nEmail: ${rawData.email}`;
  }

  return "I don't have detailed information on that yet. Please call the APEC helpline at +91 7418064336 or email info@apec.edu.in for assistance.";
}
