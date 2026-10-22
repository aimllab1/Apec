import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SearchEngine } from './searchEngine.js';
import { generateResponse } from './responseGenerator.js';
import { tokenize } from './tokenizer.js';
import { detectIntent, expandWithSynonyms } from './synonyms.js';
import { addTurn, buildContextHint, isFollowUp } from './chatMemory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load knowledge base files from knowledge directory
function loadKnowledgeBase() {
  const dir = path.resolve(__dirname, '../knowledge');
  return {
    college:     JSON.parse(fs.readFileSync(path.join(dir, 'college.json'), 'utf8')),
    admissions:  JSON.parse(fs.readFileSync(path.join(dir, 'admissions.json'), 'utf8')),
    placements:  JSON.parse(fs.readFileSync(path.join(dir, 'placements.json'), 'utf8')),
    departments: JSON.parse(fs.readFileSync(path.join(dir, 'departments.json'), 'utf8')),
    faculty:     JSON.parse(fs.readFileSync(path.join(dir, 'faculty.json'), 'utf8'))
  };
}

// === SINGLETON SEARCH ENGINE (built once, reused across all requests) ===
const kb = loadKnowledgeBase();
const engine = new SearchEngine();
engine.initialize(kb);
console.log('[LocalAI] Search engine initialized and ready.');

// === CONVERSATIONAL INTENTS (handled locally without search) ===
const GREET_WORDS = new Set(['hi', 'hello', 'hey', 'greetings', 'hola', 'yo', 'sup', 'howdy']);
const THANKS_WORDS = new Set(['thanks', 'thankyou', 'thank', 'appreciate', 'helpful', 'noted', 'ok', 'okay', 'understood', 'got', 'clear', 'cool', 'great', 'nice', 'perfect', 'awesome']);
const FAREWELL_WORDS = new Set(['bye', 'goodbye', 'exit', 'seeyou', 'cya', 'later', 'done']);

function checkConversational(clean) {
  const words = clean.split(/\s+/);
  if (words.every(w => GREET_WORDS.has(w)) || GREET_WORDS.has(words[0])) {
    return "Hello! I'm the APEC AI Assistant. Ask me anything about admissions, departments, placements, fee payments, bus routes, hostels, or scholarships!";
  }
  if (words.some(w => THANKS_WORDS.has(w))) {
    return "You're welcome! Feel free to ask more questions. I'm here to help with any APEC college queries.";
  }
  if (words.some(w => FAREWELL_WORDS.has(w))) {
    return "Goodbye! Have a great day. Come back anytime you need help with APEC information.";
  }
  if (clean === 'help' || clean === 'menu' || clean === 'options' || clean.includes('what can you') || clean.includes('what do you') || clean.includes('what can i ask') || clean === 'what topics') {
    return "I can help you with:\n\n• Admissions & Eligibility (TNEA Code: 1401)\n• All Departments & Courses (CSE, ECE, MECH, CIVIL, CHEM, IT, AIML, AIDS...)\n• Faculty & HOD profiles\n• Placements & Company List (TCS, Wipro, HCL, Infosys...)\n• Fees & Online Payment (Bank IFSC: CBIN0283083)\n• TNEA Cutoff Calculator Formula\n• Scholarships (Sakthi Peedam, Senthilkumar Fund)\n• Hostels, Library, Labs & Campus Life\n• Bus Routes & Timings (8 routes available)\n• Principal, Vice-Principal & Administration contacts\n\nJust type your question!";
  }
  if (clean.includes('how are you') || clean.includes('how r you')) {
    return "I'm running perfectly! Ready to answer your questions about Adhiparasakthi Engineering College (APEC). What would you like to know?";
  }
  return null;
}

// === DEPARTMENT KEY DETECTION ===
const DEPT_KEYS = ['cse', 'ece', 'eee', 'mech', 'civil', 'it', 'chemical', 'aiml', 'aids', 'agri', 'mca', 'mba', 'sh', 'csd'];
const DEPT_NAME_MAP = {
  'computer science': 'cse', 'cs': 'cse', 'software': 'cse',
  'electronics': 'ece', 'communication': 'ece',
  'electrical': 'eee', 'power': 'eee',
  'mechanical': 'mech', 'machinetools': 'mech',
  'civil': 'civil', 'construction': 'civil',
  'information technology': 'it', 'information': 'it',
  'chemistry': 'chemical', 'chemical engineering': 'chemical',
  'artificial intelligence machine learning': 'aiml', 'ai ml': 'aiml', 'ai and ml': 'aiml',
  'data science': 'aids', 'ai ds': 'aids',
  'agriculture': 'agri', 'agricultural': 'agri',
  'mca': 'mca', 'master computer': 'mca',
  'mba': 'mba', 'management': 'mba', 'business': 'mba',
  'science humanities': 'sh',
  'design': 'csd', 'computer science design': 'csd'
};

function detectDepartment(text) {
  const lower = text.toLowerCase();
  for (const key of DEPT_KEYS) {
    if (new RegExp(`\\b${key}\\b`).test(lower)) return key;
  }
  for (const [phrase, key] of Object.entries(DEPT_NAME_MAP)) {
    if (lower.includes(phrase)) return key;
  }
  return null;
}

// === MAIN AI RESPONSE FUNCTION ===
// session is passed by REFERENCE — mutations persist in the Vite middleware session store
export function getLocalResponse(queryText, session = null) {
  if (!queryText || !queryText.trim()) {
    return { response: "Please type a question.", updatedSession: session };
  }

  const clean = queryText.toLowerCase().trim().replace(/[?!.,]/g, '');

  // --- STEP 1: Handle pure conversational intents ---
  const conversationalReply = checkConversational(clean);
  if (conversationalReply) {
    if (session) addTurn(session, queryText, conversationalReply, null, null, 'greeting');
    return { response: conversationalReply };
  }

  // --- STEP 2: Detect department context from query ---
  const mentionedDept = detectDepartment(clean);
  const tokens = tokenize(clean);
  const intent = detectIntent(tokens);

  // --- STEP 3: Build context hint from session memory ---
  const contextHint = session ? buildContextHint(session) : '';

  // Follow-up detection: if query is short and references context topic, inject session context
  const isFollowUpQuery = session && isFollowUp(tokens) && (session.lastDepartment || session.lastTopic);
  const enrichedContext = isFollowUpQuery
    ? `${contextHint} ${clean}`.trim()
    : (mentionedDept ? `${mentionedDept} ${clean}` : clean);

  console.log(`[LocalAI] Query: "${queryText}" | Dept: ${mentionedDept || session?.lastDepartment || 'none'} | Intent: ${intent} | FollowUp: ${isFollowUpQuery}`);

  // --- STEP 4: Multi-pass search strategy ---

  // PASS 1: Direct search with full context
  let results = engine.search(clean, enrichedContext);
  let best = results[0];

  // PASS 2: If low confidence and we have dept context, try dept-scoped search
  if (best.score < 0.25 && (mentionedDept || session?.lastDepartment)) {
    const deptKey = mentionedDept || session.lastDepartment;
    const deptResults = engine.search(`${deptKey} ${clean}`, deptKey);
    if (deptResults[0].score > best.score) {
      results = deptResults;
      best = results[0];
    }
  }

  // PASS 3: Synonym-expanded search
  if (best.score < 0.20) {
    const expanded = expandWithSynonyms(tokens).join(' ');
    const expandedResults = engine.search(expanded, contextHint);
    if (expandedResults[0].score > best.score) {
      results = expandedResults;
      best = results[0];
    }
  }

  // PASS 4: Intent-based direct lookup (if intent detected but TF-IDF still low)
  if (best.score < 0.15 && intent) {
    const intentResults = engine.search(intent, intent);
    if (intentResults[0].score > best.score) {
      results = intentResults;
      best = results[0];
    }
  }

  console.log(`[LocalAI] Best: "${best.id}" score=${best.score.toFixed(4)}`);

  // --- STEP 5: Confidence-based response ---
  const HIGH = 0.18; // High confidence → direct answer
  const MEDIUM = 0.07; // Medium → still answer but note suggestion

  if (best.score >= HIGH) {
    // Detect department & topic for session memory
    const dept = mentionedDept || (best.id.startsWith('dept_') ? best.id.replace('dept_', '') : (session?.lastDepartment || null));
    const topic = intent || best.id.split('_')[0];
    const response = generateResponse(best.id, best.rawData, session || {});
    if (session) addTurn(session, queryText, response, best.id, dept, topic);
    return { response };
  }

  if (best.score >= MEDIUM) {
    // Answer with the best match + suggest related
    const response = generateResponse(best.id, best.rawData, session || {});
    const top2 = results.slice(1, 3).filter(r => r.score > 0.04);
    let relatedNote = '';
    if (top2.length > 0) {
      const suggestions = top2.map(r => {
        if (r.id.startsWith('dept_')) return `${r.rawData.name} Department`;
        if (r.id === 'placements_info') return 'Placement Records';
        if (r.id === 'fee_payment') return 'Fee Payment';
        if (r.id === 'admissions_info') return 'Admission Process';
        if (r.id === 'library') return 'Library Facilities';
        if (r.id === 'hostels') return 'Hostel Details';
        if (r.id.startsWith('admin_')) return r.rawData.role;
        return null;
      }).filter(Boolean);
      if (suggestions.length > 0) relatedNote = `\n\nRelated topics: ${suggestions.join(', ')}`;
    }
    const fullResponse = response + relatedNote;
    if (session) addTurn(session, queryText, fullResponse, best.id, mentionedDept, intent);
    return { response: fullResponse };
  }

  // --- STEP 6: Smart fallback (never raw "not found") ---
  // Try to provide general guidance based on detected intent
  if (intent) {
    const intentMap = {
      placement: 'placements_info',
      admission: 'admissions_info',
      fees: 'fee_payment',
      cutoff: 'cutoff_calculator',
      hostel: 'hostels',
      library: 'library',
      transport: engine.documents.find(d => d.id.startsWith('route_'))?.id || 'college_info',
      scholarship: 'scholarship_0',
      principal: 'admin_0',
      laboratory: 'laboratories',
      accreditation: 'college_info',
      course: 'admissions_info',
    };
    const fallbackId = intentMap[intent];
    if (fallbackId) {
      const fallbackDoc = engine.documents.find(d => d.id === fallbackId);
      if (fallbackDoc) {
        const response = generateResponse(fallbackDoc.id, fallbackDoc.rawData, session || {});
        if (session) addTurn(session, queryText, response, fallbackDoc.id, mentionedDept, intent);
        return { response };
      }
    }
  }

  // Final fallback — helpful, not dismissive
  const fallbackResponse = `I couldn't find specific details for "${queryText}". Try asking about:\n\n• Admissions & TNEA Counseling (Code: 1401)\n• Departments: CSE, ECE, MECH, CIVIL, IT, AIML, AIDS\n• Placements, Fee Payment, or Bus Routes\n• Principal, Library, or Hostels\n\nOr call us: +91 7418064336`;
  if (session) addTurn(session, queryText, fallbackResponse, null, mentionedDept, intent);
  return { response: fallbackResponse };
}
