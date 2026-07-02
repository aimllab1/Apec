import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));

const deptMapping = {
  'Artificial Intelligence and Machine.txt': 'aiml',
  'CSE.txt': 'cse',
  'Chemical Engineering.txt': 'chemical',
  'Computer Applications.txt': 'mca',
  'Department of Mechanical Engineerin.txt': 'mech',
  'Information Technology.txt': 'it',
  'civil.txt': 'civil'
};

const outputData = {};

files.forEach(file => {
  const deptKey = deptMapping[file];
  if (!deptKey) return;

  const filePath = path.join(dataDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  
  // Normalizing line endings and split by lines
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n');

  // Let's identify the department name from the first line or file name
  let name = lines[0].trim();
  if (name.endsWith(':')) name = name.slice(0, -1).trim();
  
  // Let's divide the text into sections
  const sections = {};
  let currentSection = 'header';
  sections[currentSection] = [];

  const sectionHeaders = [
    { key: 'about', keywords: ['ABOUT THE DEPARTMENT'] },
    { key: 'vision', keywords: ['VISION OF THE DEPARTMENT'] },
    { key: 'mission', keywords: ['MISSION OF THE DEPARTMENT'] },
    { key: 'peos', keywords: ['PROGRAMME EDUCATIONAL OBJECTIVES'] },
    { key: 'psos', keywords: ['PROGRAM SPECIFIC OUTCOMES'] },
    { key: 'pos', keywords: ['PROGRAM  OUTCOMES', 'PROGRAM OUTCOMES'] },
    { key: 'faculty', keywords: ['LIST OF FACULTY', 'FACULTY;'] },
    { key: 'publications', keywords: ['PUBLICATIONS  - JOURNALS', 'PUBLICATIONS - JOURNALS', 'PUBLICATION:', 'PUBLICATION'] },
    { key: 'publications_books', keywords: ['PUBLICATIONS – BOOKS', 'PUBLICATIONS - BOOKS'] },
    { key: 'publications_conferences', keywords: ['PUBLICATIONS – CONFERENCES', 'PUBLICATIONS - CONFERENCES', 'PUBLICATIONS  - CONFERENCES'] },
    { key: 'facilities', keywords: ['LABORATORIES', 'FACILITIES:', 'FACILITIES', 'COMPUTING FACILITIES'] },
    { key: 'placements', keywords: ['LIST OF STUDENTS PLACED', 'PLACEMENT:'] },
    { key: 'achievements', keywords: ['ACHIEVEMENTS:', 'ACHIEVEMENTS'] },
    { key: 'industrial_visits', keywords: ['INDUSTRIAL VISIT'] },
    { key: 'training', keywords: ['TRAINING PROGRAM'] },
    { key: 'rank_holders', keywords: ['UNIVERSITY RANK HOLDERS'] }
  ];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if this line is a section header
    const upperLine = trimmed.toUpperCase();
    const foundHeader = sectionHeaders.find(h => 
      h.keywords.some(k => upperLine.startsWith(k) || upperLine.includes(k))
    );

    if (foundHeader) {
      currentSection = foundHeader.key;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      sections[currentSection].push(line);
    }
  });

  // Now, let's process each section to get clean data

  // About Section
  const aboutText = (sections['about'] || []).map(l => l.trim()).filter(Boolean).join(' ');

  // Vision
  const visionText = (sections['vision'] || []).map(l => l.trim()).filter(Boolean).join(' ');

  // Mission
  let missionList = [];
  const rawMission = (sections['mission'] || []);
  rawMission.forEach(l => {
    const t = l.trim();
    if (t) {
      // Remove leading bullet characters
      const cleaned = t.replace(/^[Ø\-\*•\d\.\)]\s*/, '');
      if (cleaned) missionList.push(cleaned);
    }
  });

  // PEOs
  let peosList = [];
  (sections['peos'] || []).forEach(l => {
    const t = l.trim();
    if (t && !t.toLowerCase().startsWith('graduates')) {
      const cleaned = t.replace(/^[I|V|X\d\.\-\*•]+\s*/i, '');
      if (cleaned) peosList.push(cleaned);
    }
  });

  // PSOs
  let psosList = [];
  (sections['psos'] || []).forEach(l => {
    const t = l.trim();
    if (t && !t.toLowerCase().startsWith('the students') && !t.toLowerCase().startsWith('on successful') && !t.toLowerCase().startsWith('by the completion')) {
      const cleaned = t.replace(/^(PSO\d|PSO\s*\d|[\d\.\-\*•]+)\s*:\s*/i, '').replace(/^[I|V|X\d\.\-\*•]+\s*/i, '');
      if (cleaned) psosList.push(cleaned);
    }
  });

  // POs
  let posList = [];
  (sections['pos'] || []).forEach(l => {
    const t = l.trim();
    if (t) {
      // Find matches like "I. Engineering knowledge: ... " or "1. Engineering knowledge: ..."
      const match = t.match(/^(?:[I|V|X\d]+|[0-9]+)\.?\s*([^:]+)\s*:\s*(.+)$/i);
      if (match) {
        posList.push({ title: match[1].trim(), description: match[2].trim() });
      } else {
        // Fallback for simple lines
        const cleaned = t.replace(/^[I|V|X\d\.\-\*•]+\s*/i, '');
        if (cleaned) posList.push({ title: '', description: cleaned });
      }
    }
  });

  // Faculty Section
  const facultyList = [];
  const rawFacultyLines = sections['faculty'] || [];
  let currentFaculty = null;
  let currentKey = null;

  for (let i = 0; i < rawFacultyLines.length; i++) {
    const line = rawFacultyLines[i].trim();
    if (!line) continue;

    // Detect if this starts a new faculty member (e.g. starts with Dr., Mr., Ms., Mrs.)
    const isNewFaculty = line.match(/^(Dr\.|Mr\.|Ms\.|Mrs\.)/i) || 
                         (line.toUpperCase() === line && line.length > 5 && !line.includes('QUALIFICATION') && !line.includes('DESIGNATION') && !line.includes('DEPARTMENT') && !line.includes('EMAIL') && !line.includes('E-MAIL') && !line.includes('EXPERIENCE') && !line.includes('JOINING') && !line.includes('TEACHING'));
    
    if (isNewFaculty) {
      if (currentFaculty && currentFaculty.name) {
        facultyList.push(currentFaculty);
      }
      currentFaculty = {
        name: line,
        qualification: '',
        designation: '',
        department: '',
        email: '',
        facultyId: '',
        experience: '',
        joiningDate: '',
        teachingSince: ''
      };
      currentKey = null;
    } else if (currentFaculty) {
      const upperLine = line.toUpperCase();
      if (upperLine.startsWith('QUALIFICATION')) {
        currentKey = 'qualification';
      } else if (upperLine.startsWith('DESIGNATION')) {
        currentKey = 'designation';
      } else if (upperLine.startsWith('DEPARTMENT')) {
        currentKey = 'department';
      } else if (upperLine.startsWith('E-MAIL') || upperLine.startsWith('EMAIL')) {
        currentKey = 'email';
      } else if (upperLine.startsWith('FACULTY ID')) {
        currentKey = 'facultyId';
      } else if (upperLine.startsWith('EXPERIENCE')) {
        currentKey = 'experience';
      } else if (upperLine.startsWith('DT. OF JOINING') || upperLine.startsWith('DATE OF JOINING')) {
        currentKey = 'joiningDate';
      } else if (upperLine.startsWith('TEACHING SINCE')) {
        currentKey = 'teachingSince';
      } else if (currentKey) {
        currentFaculty[currentKey] = line;
        currentKey = null; // Reset after setting value
      }
    }
  }
  if (currentFaculty && currentFaculty.name) {
    facultyList.push(currentFaculty);
  }

  // Laboratories / Facilities
  let labsList = [];
  const rawLabs = sections['facilities'] || [];
  rawLabs.forEach(l => {
    const t = l.trim();
    if (t && !t.toLowerCase().includes('the following laboratories') && !t.toLowerCase().includes('laboratories available')) {
      const cleaned = t.replace(/^[\-\*•\d\.]\s*/, '');
      if (cleaned) labsList.push(cleaned);
    }
  });

  // Placements Section
  const placementsList = [];
  const rawPlacementLines = sections['placements'] || [];
  // Typically: Register Number, Name of the Student, Name of the Company, Salary
  // Let's look for groups of 4 lines if it matches a table, or lines that have Register Number (starts with 4204...)
  let i = 0;
  while (i < rawPlacementLines.length) {
    const line = rawPlacementLines[i].trim();
    if (line.match(/^4204\d+$/)) {
      // Found a register number! Let's get the next 3 lines if available
      const reg = line;
      const student = rawPlacementLines[i + 1] ? rawPlacementLines[i + 1].trim() : '';
      const company = rawPlacementLines[i + 2] ? rawPlacementLines[i + 2].trim() : '';
      const salary = rawPlacementLines[i + 3] ? rawPlacementLines[i + 3].trim() : '';
      placementsList.push({ registerNumber: reg, studentName: student, companyName: company, salaryPackage: salary });
      i += 4;
    } else {
      i++;
    }
  }

  // University Rank Holders
  const rankHolders = [];
  const rawRankLines = sections['rank_holders'] || [];
  // Structure usually:
  // Academic Year / S.NO
  // Name
  // Rank
  // e.g.
  // 2003
  // MS.R.SHANMUG VADIUV
  // 5
  // Let's parse them in chunks of 3 lines if they look like Year (4 digits), Name, Rank
  let k = 0;
  while (k < rawRankLines.length) {
    const line = rawRankLines[k].trim();
    if (line.match(/^(19|20)\d{2}$/)) {
      // Looks like a year! Let's check name and rank
      const year = line;
      const name = rawRankLines[k + 1] ? rawRankLines[k + 1].trim() : '';
      const rank = rawRankLines[k + 2] ? rawRankLines[k + 2].trim() : '';
      rankHolders.push({ academicYear: year, studentName: name, rank: rank });
      k += 3;
    } else if (line.match(/^\d+\.$/)) {
      // MCA has S.NO, Year, Name, Rank
      const year = rawRankLines[k + 1] ? rawRankLines[k + 1].trim() : '';
      const name = rawRankLines[k + 2] ? rawRankLines[k + 2].trim() : '';
      const rank = rawRankLines[k + 3] ? rawRankLines[k + 3].trim() : '';
      if (year.match(/^(19|20)\d{2}$/)) {
        rankHolders.push({ academicYear: year, studentName: name, rank: rank });
        k += 4;
      } else {
        k++;
      }
    } else {
      k++;
    }
  }

  // Journals Section (Publications)
  // Let's parse journal entries in groups of 6 lines
  const journalsList = [];
  const rawJournalLines = sections['publications'] || [];
  let j = 0;
  // Skip headers: we check if line starts with Title of the paper, Name of the author, etc.
  while (j < rawJournalLines.length) {
    const line = rawJournalLines[j].trim();
    if (line.toLowerCase().includes('title of the') || line.toLowerCase().includes('name of') || line.toLowerCase().includes('calender year') || line.toLowerCase().includes('calendar year')) {
      j++;
    } else if (line && !line.includes('http') && line.length > 15) {
      // This might be a paper title!
      const title = line;
      const author = rawJournalLines[j + 1] ? rawJournalLines[j + 1].trim() : '';
      const dept = rawJournalLines[j + 2] ? rawJournalLines[j + 2].trim() : '';
      const journalName = rawJournalLines[j + 3] ? rawJournalLines[j + 3].trim() : '';
      const year = rawJournalLines[j + 4] ? rawJournalLines[j + 4].trim() : '';
      const link = rawJournalLines[j + 5] ? rawJournalLines[j + 5].trim() : '';
      
      journalsList.push({
        title,
        author,
        department: dept,
        journal: journalName,
        year,
        link
      });
      j += 6;
    } else {
      j++;
    }
  }

  // Books Section (Publications)
  const booksList = [];
  const rawBookLines = sections['publications_books'] || [];
  let b = 0;
  while (b < rawBookLines.length) {
    const line = rawBookLines[b].trim();
    if (line.toLowerCase().includes('title of the book') || line.toLowerCase().includes('authors') || line.toLowerCase().includes('publisher')) {
      b++;
    } else if (line && line.length > 5) {
      const title = line;
      const author = rawBookLines[b + 1] ? rawBookLines[b + 1].trim() : '';
      const publisher = rawBookLines[b + 2] ? rawBookLines[b + 2].trim() : '';
      booksList.push({ title, author, publisher });
      b += 3;
    } else {
      b++;
    }
  }

  // Conferences Section (Publications)
  const conferencesList = [];
  const rawConfLines = sections['publications_conferences'] || [];
  let c = 0;
  while (c < rawConfLines.length) {
    const line = rawConfLines[c].trim();
    if (line.toLowerCase().includes('proceeding') || line.toLowerCase().includes('title of the') || line.toLowerCase().includes('isbn')) {
      c++;
    } else if (line && line.length > 5) {
      const faculty = line;
      const proceeding = rawConfLines[c + 1] ? rawConfLines[c + 1].trim() : '';
      const paperTitle = rawConfLines[c + 2] ? rawConfLines[c + 2].trim() : '';
      const isbn = rawConfLines[c + 3] ? rawConfLines[c + 3].trim() : '';
      const publisher = rawConfLines[c + 4] ? rawConfLines[c + 4].trim() : '';
      conferencesList.push({ faculty, proceeding, paperTitle, isbn, publisher });
      c += 5;
    } else {
      c++;
    }
  }

  // Toppers
  const toppersList = [];
  const rawTopperLines = sections['achievements'] || [];
  let tIdx = 0;
  while (tIdx < rawTopperLines.length) {
    const line = rawTopperLines[tIdx].trim();
    if (line.toUpperCase().startsWith('NAME')) {
      // Find name, year, gpa, topper rank
      const name = line.split(':')[1]?.trim() || rawTopperLines[tIdx + 1]?.trim() || '';
      let year = '';
      let gpa = '';
      let rank = '';
      
      // Look ahead a few lines
      for (let offset = 1; offset < 10; offset++) {
        if (!rawTopperLines[tIdx + offset]) break;
        const subLine = rawTopperLines[tIdx + offset].trim();
        if (subLine.toUpperCase().startsWith('YEAR')) {
          year = subLine.split(':')[1]?.trim() || rawTopperLines[tIdx + offset + 1]?.trim() || '';
        } else if (subLine.toUpperCase().startsWith('GPA')) {
          gpa = subLine.split(':')[1]?.trim() || rawTopperLines[tIdx + offset + 1]?.trim() || '';
        } else if (subLine.toUpperCase().startsWith('TOPPER')) {
          rank = subLine.split(':')[1]?.trim() || rawTopperLines[tIdx + offset + 1]?.trim() || '';
        } else if (subLine.toUpperCase().startsWith('NAME')) {
          // Next topper started
          break;
        }
      }
      toppersList.push({ studentName: name, yearSem: year, gpa, rank });
      tIdx += 2;
    } else {
      tIdx++;
    }
  }

  outputData[deptKey] = {
    key: deptKey,
    name,
    about: aboutText,
    vision: visionText,
    mission: missionList,
    peos: peosList,
    psos: psosList,
    pos: posList,
    faculty: facultyList,
    labs: labsList,
    placements: placementsList,
    rankHolders,
    publications: {
      journals: journalsList,
      books: booksList,
      conferences: conferencesList
    },
    toppers: toppersList
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'departmentsData.json'), JSON.stringify(outputData, null, 2), 'utf8');
console.log("Departments parsed and saved successfully to src/data/departmentsData.json!");
