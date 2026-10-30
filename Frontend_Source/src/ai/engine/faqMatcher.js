// Fast FAQ Matching Engine
// Provides sub-millisecond instant lookup for frequently asked questions (FAQs)
// Supports exact match, normalized conversational variations, and topic-weighted token similarity

const STOP_WORDS = new Set([
  'what', 'is', 'the', 'for', 'tell', 'me', 'about', 'are', 'available', 'at',
  'in', 'of', 'and', 'to', 'a', 'an', 'how', 'can', 'i', 'who', 'does', 'do',
  'any', 'there', 'please', 'give', 'details', 'info', 'information', 'with',
  'by', 'from', 'on', 'as', 'it'
]);

// Domain words that appear broadly across almost all entries in the college database
const DOMAIN_WORDS = new Set(['apec', 'college', 'adhiparasakthi', 'engineering', 'institution']);

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTokens(str, removeStopWords = true) {
  const norm = normalize(str);
  if (!norm) return [];
  const words = norm.split(' ').filter(w => w.length > 1);
  return removeStopWords ? words.filter(w => !STOP_WORDS.has(w)) : words;
}

export class FastFAQMatcher {
  constructor(faqList = []) {
    this.faqs = faqList || [];
    this.exactMap = new Map();
    this.entries = [];

    this._buildIndex();
  }

  _buildIndex() {
    for (const faq of this.faqs) {
      const allPhrases = [faq.question, ...(faq.variations || [])];

      for (const phrase of allPhrases) {
        const norm = normalize(phrase);
        if (norm && !this.exactMap.has(norm)) {
          this.exactMap.set(norm, faq);
        }
      }

      const kwList = (faq.keywords || []).map(k => normalize(k));

      const phrasesToScore = [
        { text: faq.question, isPrimary: true, tokens: new Set(getTokens(faq.question, true)) },
        ...(faq.variations || []).map(v => ({
          text: v,
          isPrimary: false,
          tokens: new Set(getTokens(v, true))
        }))
      ];

      this.entries.push({
        faq,
        keywords: kwList,
        phrases: phrasesToScore
      });
    }
  }

  findMatch(query) {
    if (!query) return null;
    const norm = normalize(query);
    if (!norm) return null;

    // 1. Direct exact match
    if (this.exactMap.has(norm)) {
      return { faq: this.exactMap.get(norm), score: 1.0, matchType: 'exact' };
    }

    // 2. Direct exact match after stripping conversational leading or trailing filler
    const stripped = norm
      .replace(/^(what is|who is|tell me about|how to|where is|can you tell me|details of|give me|explain)\s+/, '')
      .replace(/\s+(pathi sollunga|sollunga|yaaru|enna|eppadi|engae|irukku|panradhu)$/, '')
      .trim();

    if (stripped && this.exactMap.has(stripped)) {
      return { faq: this.exactMap.get(stripped), score: 0.95, matchType: 'stripped_exact' };
    }

    // 3. Meaningful token matching
    const qTokens = getTokens(norm, true);
    if (qTokens.length === 0) return null;
    const qSet = new Set(qTokens);

    let bestFaq = null;
    let highestScore = 0;
    let bestReason = '';

    for (const entry of this.entries) {
      // Calculate keyword bonus
      let kwBonus = 0;
      for (const kw of entry.keywords) {
        const kwWords = kw.split(' ').filter(w => w.length > 1 && !DOMAIN_WORDS.has(w));
        if (kwWords.length > 0 && kwWords.every(w => qSet.has(w))) {
          kwBonus += 0.2;
        } else if (norm.includes(kw) && !DOMAIN_WORDS.has(kw)) {
          kwBonus += 0.15;
        }
      }

      for (const pObj of entry.phrases) {
        const pSet = pObj.tokens;
        if (pSet.size === 0) continue;

        const intersection = [];
        for (const t of qSet) {
          if (pSet.has(t)) intersection.push(t);
        }

        if (intersection.length === 0) continue;

        // Skip if intersection only contains generic domain words
        const hasTopicWord = intersection.some(w => !DOMAIN_WORDS.has(w));
        if (!hasTopicWord) continue;

        const unionSize = new Set([...qSet, ...pSet]).size;
        const jaccard = intersection.length / unionSize;
        const queryCoverage = intersection.length / qSet.size;
        const phraseCoverage = intersection.length / pSet.size;

        const primaryBonus = pObj.isPrimary ? 0.08 : 0;

        // High overlap requirement
        if (queryCoverage >= 0.5) {
          const score = (queryCoverage * 0.50) + (phraseCoverage * 0.25) + (jaccard * 0.20) + Math.min(kwBonus, 0.35) + primaryBonus;
          if (score > highestScore) {
            highestScore = score;
            bestFaq = entry.faq;
            bestReason = `phrase: "${pObj.text}" score: ${score.toFixed(3)}`;
          }
        }
      }
    }

    // High confidence threshold for instant direct FAQ reply
    if (highestScore >= 0.60 && bestFaq) {
      return { faq: bestFaq, score: highestScore, matchType: 'similarity', reason: bestReason };
    }

    return null;
  }
}
