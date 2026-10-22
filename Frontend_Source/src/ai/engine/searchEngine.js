import { tokenize, stemWord } from './tokenizer.js';
import { expandWithSynonyms } from './synonyms.js';

// Levenshtein distance for fuzzy matching
export function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Core word list for fuzzy spelling correction
const CORE_VOCAB = [
  'principal', 'vice', 'admission', 'placement', 'department', 'departments',
  'hostel', 'fees', 'payment', 'bank', 'library', 'facility', 'facilities',
  'cutoff', 'calculator', 'formula', 'scholarship', 'courses', 'faculty',
  'contact', 'accreditation', 'naac', 'ugc', 'autonomous', 'transport',
  'bus', 'route', 'laboratory', 'computer', 'mechanical', 'electrical',
  'electronics', 'civil', 'chemical', 'information', 'technology', 'mba',
  'mca', 'artificial', 'intelligence', 'machine', 'learning', 'management'
];

export function fuzzyCorrect(token) {
  if (token.length <= 3) return token;
  let best = token, minDist = 3;
  for (const vocab of CORE_VOCAB) {
    const d = levenshtein(token, vocab);
    if (d < minDist) { minDist = d; best = vocab; }
  }
  return best;
}

// TF-IDF Search Engine
export class SearchEngine {
  constructor() {
    this.documents = [];
    this.vocab = new Set();
    this.idf = {};
  }

  initialize(knowledgeBase) {
    this.documents = [];
    this.vocab.clear();
    this.idf = {};
    const { college, admissions, placements, departments, faculty } = knowledgeBase;

    // --- INDEX ALL DOCUMENTS ---

    this.addDoc('college_info',
      `${college.name} ${college.short_name} established ${college.established} founder ${college.founder} location ${college.location} accreditation ${college.accreditation} counseling code ${college.tnea_counseling_code} helpline ${college.helplines.join(' ')}`,
      'apec college naac ugc autonomous anna university affiliated established founded location address melmaruvathur helpline phone counseling code 1401 accreditation recognition approved',
      college
    );

    this.addDoc('cutoff_calculator',
      `cutoff calculator tnea formula mathematics physics chemistry score marks eligibility code ${college.tnea_counseling_code} ${college.cutoff_calculator.formula} ${college.cutoff_calculator.rule}`,
      'cutoff calculator formula marks calculate score out of 200 mathematics physics chemistry pcm merit percentage rank tnea admission score',
      college.cutoff_calculator
    );

    this.addDoc('fee_payment',
      `fee payment bank central bank india branch ${college.fee_payment.branch} ifsc ${college.fee_payment.ifsc_code} account ${college.fee_payment.account_name} ${college.fee_payment.modes.join(' ')} ${college.fee_payment.instructions}`,
      'fees fee payment bank account ifsc code cbin upi qr gpay phonepe paytm challan deposit transfer central bank india melmaruvathur net banking pay tuition how pay',
      college.fee_payment
    );

    this.addDoc('library',
      `library central ${college.facilities.library.area} volumes ${college.facilities.library.volumes} book bank ${college.facilities.library.book_bank} digital ${college.facilities.library.digital_library} memberships ${college.facilities.library.memberships.join(' ')}`,
      'library central books reading study collection stacks ieee springer digital computer journals reference book bank sc st volumes 56000',
      college.facilities.library
    );

    this.addDoc('hostels',
      `hostel blocks boys girls capacity ${college.facilities.hostels.capacity} ${college.facilities.hostels.amenities.join(' ')} mess dining ${college.facilities.hostels.mess}`,
      'hostel hostels accommodation boys girls rooms blocks boarding residence mess canteen food gym wifi water biometric generator stay dining',
      college.facilities.hostels
    );

    this.addDoc('laboratories',
      `laboratories labs ${college.facilities.laboratories.features.join(' ')}`,
      'lab labs laboratory workshop practical equipment cnc computer server ai ml chemical electrical electronics mechanical civil infrastructure',
      college.facilities.laboratories
    );

    if (college.facilities.bus_routes) {
      college.facilities.bus_routes.forEach(route => {
        const stopsStr = route.stops.map(s => `${s.name} ${s.time}`).join(' ');
        this.addDoc(`route_${route.id}`,
          `bus route ${route.id} ${route.name} driver ${route.driver} phone ${route.phone} bus number ${route.busNo} stops timings ${stopsStr}`,
          `bus route transport timing stops driver phone contact available route${route.id} ${route.name} ${route.driver} ${route.stops.map(s => s.name).join(' ')}`,
          route
        );
      });
    }

    this.addDoc('admissions_info',
      `admissions counseling code ${admissions.counseling_code} eligibility ${admissions.eligibility.hsc_requirements} minimum marks OC ${admissions.eligibility.min_average_marks.OC} BC ${admissions.eligibility.min_average_marks.BC_BCM} MBC ${admissions.eligibility.min_average_marks.MBC_DNC} SC ST ${admissions.eligibility.min_average_marks.SC_SCA_ST} documents ${admissions.documents_required.join(' ')}`,
      'admission admissions process eligibility criteria counseling seats certificate requirements document verification apply joining intake procedure tnea 1401 how join qualifications',
      admissions
    );

    admissions.scholarships.forEach((s, idx) => {
      this.addDoc(`scholarship_${idx}`,
        `scholarship ${s.title} provider ${s.provider} amount ${s.amount} eligibility ${s.eligibility}`,
        'scholarship financial aid grant concession help merit income disadvantaged rs 25000 sakthi senthilkumar',
        s
      );
    });

    this.addDoc('placements_info',
      `placements ${placements.statistics.placement_percentage} offers ${placements.statistics.offers_generated_annually} highest ${placements.statistics.highest_ctc} average ${placements.statistics.average_ctc} companies ${placements.recruiters.map(r => r.name).join(' ')} training ${placements.training_programs.map(p => p.name + ' ' + p.details).join(' ')}`,
      'placement placements job jobs company companies hiring career ctc lpa salary package tcs wipro cognizant infosys hcl accenture tvs fanuc mou training crt mock interview campus recruitment offer',
      placements
    );

    college.administration.forEach((a, idx) => {
      this.addDoc(`admin_${idx}`,
        `${a.role} ${a.name} ${a.qualifications} ${a.bio} email ${a.contact} office ${a.office} administration`,
        `administration officer role ${a.role.toLowerCase()} principal vice dean admin head contact email office ${a.name.toLowerCase()} qualifications bio profile`,
        a
      );
    });

    departments.forEach(d => {
      const deptFaculty = faculty.filter(f => f.department_key === d.key);
      const hodEntry = deptFaculty.find(f => f.designation && (f.designation.toLowerCase().includes('head') || f.designation.toLowerCase().includes('hod')));
      const hodStr = hodEntry ? `hod ${hodEntry.name}` : '';
      this.addDoc(`dept_${d.key}`,
        `department ${d.name} ${d.key} about ${d.about} vision ${d.vision} mission ${d.mission.join(' ')} labs ${d.labs.join(' ')} intake seats ${d.seat_intake} courses ${d.courses_offered.join(' ')} ${hodStr}`,
        `department course branch degree program ${d.key} ${d.name.toLowerCase()} intake seats labs vision mission about study syllabus hod faculty count`,
        d
      );
    });

    faculty.forEach((f, idx) => {
      this.addDoc(`faculty_${idx}`,
        `faculty teacher professor ${f.name} designation ${f.designation} qualification ${f.qualification} email ${f.email} experience ${f.experience} department ${f.department} ${f.department_key}`,
        `faculty teacher professor staff profile ${f.name.toLowerCase()} ${f.department.toLowerCase()} ${f.department_key} qualification experience email contact designation`,
        f
      );
    });

    this._buildIdf();
    this._buildVectors();
    console.log(`[SearchEngine] Indexed ${this.documents.length} documents.`);
  }

  addDoc(id, text, keywords, rawData) {
    const tokens = tokenize(text + ' ' + keywords);
    tokens.forEach(t => this.vocab.add(t));
    this.documents.push({ id, text, keywords, tokens, rawData, vector: null });
  }

  _buildIdf() {
    const N = this.documents.length;
    const df = {};
    this.documents.forEach(doc => {
      new Set(doc.tokens).forEach(t => { df[t] = (df[t] || 0) + 1; });
    });
    for (const t of this.vocab) {
      this.idf[t] = Math.log(1 + N / (df[t] || 1));
    }
  }

  _buildVectors() {
    this.documents.forEach(doc => {
      const tf = {};
      doc.tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
      const vec = {};
      for (const t of this.vocab) {
        vec[t] = (tf[t] || 0) * (this.idf[t] || 0);
      }
      doc.vector = vec;
    });
  }

  _makeQueryVector(tokens) {
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    const vec = {};
    for (const t of this.vocab) {
      vec[t] = (tf[t] || 0) * (this.idf[t] || 0);
    }
    return vec;
  }

  _cosine(v1, v2) {
    let dot = 0, n1 = 0, n2 = 0;
    for (const k in v1) {
      dot += (v1[k] || 0) * (v2[k] || 0);
      n1 += v1[k] * v1[k];
    }
    for (const k in v2) n2 += v2[k] * v2[k];
    return n1 === 0 || n2 === 0 ? 0 : dot / (Math.sqrt(n1) * Math.sqrt(n2));
  }

  // Main search: returns ALL documents scored and sorted
  search(queryText, contextHint = '') {
    // 1. Tokenize + fuzzy correct
    const rawTokens = tokenize(queryText);
    const correctedTokens = rawTokens.map(t => fuzzyCorrect(t));

    // 2. Synonym expansion
    const expandedTokens = expandWithSynonyms(correctedTokens);

    // 3. Inject context hint tokens
    const contextTokens = contextHint ? tokenize(contextHint) : [];
    const allTokens = [...new Set([...expandedTokens, ...contextTokens])];

    // 4. Build query vector
    const qVec = this._makeQueryVector(allTokens);

    // 5. Score every document
    return this.documents.map(doc => {
      const tfidfScore = this._cosine(qVec, doc.vector);

      // Bonus: keyword overlap (direct match in doc.keywords string)
      let keywordBonus = 0;
      for (const token of expandedTokens) {
        if (doc.keywords.toLowerCase().includes(token)) keywordBonus += 0.15;
        if (doc.text.toLowerCase().includes(token)) keywordBonus += 0.05;
      }

      // Fuzzy token overlap with document tokens
      let fuzzyBonus = 0;
      for (const token of correctedTokens) {
        if (token.length > 3 && doc.tokens.some(dt => levenshtein(token, dt) <= 1)) {
          fuzzyBonus += 0.08;
        }
      }

      const finalScore = Math.min(tfidfScore * 0.6 + Math.min(keywordBonus, 0.35) + Math.min(fuzzyBonus, 0.15), 1);

      return { id: doc.id, score: finalScore, rawData: doc.rawData };
    }).sort((a, b) => b.score - a.score);
  }
}
