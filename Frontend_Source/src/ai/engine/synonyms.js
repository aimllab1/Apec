// Comprehensive synonym dictionary for APEC College chatbot
// Used to expand user queries so different phrasings match the same topic

export const SYNONYMS = {
  placement:    ['job', 'jobs', 'company', 'companies', 'package', 'salary', 'salaries', 'recruiter', 'recruiters', 'offer', 'offers', 'hire', 'hiring', 'campus', 'career', 'careers', 'employment', 'employed', 'lpa', 'ctc', 'mou', 'mous', 'partner', 'partners', 'recruit', 'placed', 'drive', 'drives', 'opportunity', 'opportunities'],
  admission:    ['apply', 'applying', 'application', 'join', 'joining', 'eligibility', 'eligible', 'intake', 'seat', 'seats', 'enroll', 'enrollment', 'counseling', 'tnea', 'register', 'registration', 'qualify', 'qualifying'],
  course:       ['branch', 'branches', 'degree', 'degrees', 'department', 'departments', 'program', 'programs', 'programme', 'programmes', 'study', 'studies', 'stream', 'streams', 'subject', 'subjects', 'discipline', 'disciplines', 'offered', 'available'],
  fees:         ['fee', 'tuition', 'payment', 'pay', 'cost', 'charge', 'charges', 'bank', 'amount', 'price', 'money', 'rupee', 'rupees', 'ifsc', 'upi', 'qr', 'challan', 'deposit', 'transfer'],
  faculty:      ['teacher', 'teachers', 'professor', 'professors', 'prof', 'staff', 'hod', 'lecturer', 'lecturers', 'instructor', 'instructors', 'educator', 'educators', 'academic'],
  hostel:       ['accommodation', 'dorm', 'dormitory', 'stay', 'room', 'rooms', 'boarding', 'residence', 'lodge', 'lodging', 'mess', 'canteen', 'food', 'dining'],
  library:      ['book', 'books', 'reading', 'journal', 'journals', 'study', 'reference', 'digital', 'volume', 'volumes', 'text', 'collection', 'stacks'],
  transport:    ['bus', 'buses', 'route', 'routes', 'vehicle', 'vehicles', 'travel', 'commute', 'shuttle', 'timing', 'timings', 'stop', 'stops', 'driver', 'drivers'],
  scholarship:  ['financial', 'aid', 'grant', 'waiver', 'concession', 'free', 'fund', 'funding', 'bursary', 'fellowship'],
  principal:    ['head', 'director', 'chief', 'leader', 'raja', 'dr raja', 'bhuvaneshwari', 'vice principal', 'admin'],
  cutoff:       ['mark', 'marks', 'score', 'scores', 'calculator', 'formula', 'calculate', 'merit', 'percentage', 'rank', 'out of 200', 'pcm'],
  laboratory:   ['lab', 'labs', 'workshop', 'workshops', 'practical', 'experiment', 'equipment', 'infrastructure'],
  contact:      ['phone', 'number', 'email', 'address', 'helpline', 'reach', 'call', 'touch', 'location', 'where', 'map'],
  accreditation:['naac', 'ugc', 'autonomous', 'anna university', 'affiliated', 'recognition', 'approved', 'approval', 'aicte', 'approved'],
  cse:          ['computer science', 'cs', 'computing', 'software', 'coding', 'programming'],
  ece:          ['electronics', 'communication', 'ec', 'signal'],
  eee:          ['electrical', 'power', 'ee'],
  mech:         ['mechanical', 'me', 'thermal', 'manufacturing'],
  civil:        ['construction', 'structure', 'infrastructure'],
  it:           ['information technology', 'information', 'tech'],
  chemical:     ['chemistry', 'process', 'petro'],
  aiml:         ['artificial intelligence', 'machine learning', 'ai', 'ml', 'ai ml', 'ai and ml'],
  aids:         ['artificial intelligence data science', 'data science', 'ai ds', 'data'],
  mca:          ['master computer applications', 'masters', 'pg computer', 'mca'],
  mba:          ['management', 'business', 'administration', 'management studies'],
};

// Build flat reverse lookup: term -> canonical key
const reverseLookup = new Map();
for (const [key, synonymList] of Object.entries(SYNONYMS)) {
  reverseLookup.set(key, key);
  for (const syn of synonymList) {
    if (!reverseLookup.has(syn)) reverseLookup.set(syn, key);
  }
}

// Expand a list of tokens with their canonical keys and synonyms
export function expandWithSynonyms(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const canonical = reverseLookup.get(token);
    if (canonical) {
      expanded.add(canonical);
      if (SYNONYMS[canonical]) {
        SYNONYMS[canonical].forEach(s => expanded.add(s));
      }
    }
  }
  return [...expanded];
}

// Detect the primary topic/intent of a message
export function detectIntent(tokens) {
  const intentScores = {};
  for (const token of tokens) {
    const canonical = reverseLookup.get(token);
    if (canonical) {
      intentScores[canonical] = (intentScores[canonical] || 0) + 1;
    }
  }
  const sorted = Object.entries(intentScores).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}
