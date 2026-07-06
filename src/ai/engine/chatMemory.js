// Session-level conversation memory for APEC AI chatbot
// Stored by reference in the Vite middleware sessionStore Map

export function createSession() {
  return {
    turns: [],          // Array of { user, ai } message pairs
    lastDepartment: null, // e.g. 'cse', 'ece', 'mech'
    lastTopic: null,    // e.g. 'placement', 'fees', 'hostel'
    lastDocId: null,    // Last matched document ID
    turnCount: 0,
    createdAt: Date.now(),
    lastActivity: Date.now()
  };
}

// Add a turn to session memory
export function addTurn(session, userText, aiResponse, docId = null, department = null, topic = null) {
  session.turns.push({ user: userText, ai: aiResponse, timestamp: Date.now() });
  if (department) session.lastDepartment = department;
  if (topic) session.lastTopic = topic;
  if (docId) session.lastDocId = docId;
  session.turnCount++;
  session.lastActivity = Date.now();
  // Keep last 20 turns maximum
  if (session.turns.length > 20) session.turns = session.turns.slice(-20);
}

// Get a context injection string from session for use in queries
export function buildContextHint(session) {
  const parts = [];
  if (session.lastDepartment) parts.push(session.lastDepartment);
  if (session.lastTopic && session.lastTopic !== session.lastDepartment) parts.push(session.lastTopic);
  return parts.join(' ');
}

// Detect if the current query is a follow-up (short question referencing previous context)
export function isFollowUp(tokens) {
  const FOLLOW_UP_WORDS = new Set([
    'what', 'how', 'tell', 'more', 'about', 'detail', 'details', 'explain',
    'give', 'show', 'list', 'also', 'and', 'its', 'their', 'those', 'this', 'that'
  ]);
  const CONTEXT_WORDS = new Set([
    'placement', 'placements', 'faculty', 'teachers', 'hod', 'cutoff',
    'fees', 'fee', 'intake', 'seats', 'labs', 'lab', 'about', 'vision',
    'mission', 'syllabus', 'courses', 'contact', 'email', 'phone'
  ]);
  // A follow-up is likely if the query is short AND contains context-seeking words
  return tokens.length <= 4 && tokens.some(t => FOLLOW_UP_WORDS.has(t) || CONTEXT_WORDS.has(t));
}
