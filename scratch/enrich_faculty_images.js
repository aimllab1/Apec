import fs from 'fs';
import path from 'path';

const departmentsDataPath = path.resolve('src/data/departmentsData.json');
const departments = JSON.parse(fs.readFileSync(departmentsDataPath, 'utf8'));

// Faculty Image folder mapping
const deptMapping = {
  'aiml': { file: 'data/Artificial Intelligence and Machine.txt', folder: 'aiml' },
  'cse': { file: 'data/CSE.txt', folder: 'cse' },
  'chemical': { file: 'data/Chemical Engineering.txt', folder: 'chemical' },
  'mca': { file: 'data/Computer Applications.txt', folder: 'MCA' },
  'mech': { file: 'data/Department of Mechanical Engineerin.txt', folder: 'mech' },
  'it': { file: 'data/Information Technology.txt', folder: 'it' },
  'civil': { file: 'data/civil.txt', folder: 'Civil' },
  'eee': { file: 'data/Department of Electrical and Electr.txt', folder: 'eee' },
  'ece': { file: 'data/Department of Electronics and Commu.txt', folder: 'ece' },
  'mba': { file: 'data/Deptartment/Management Studies.txt', folder: 'MBA' },
  'sh': { file: 'data/Deptartment/S&H.txt', folder: 's & h' },
};

const sectionHeaders = [
  'ABOUT THE DEPARTMENT',
  'VISION OF THE DEPARTMENT',
  'MISSION OF THE DEPARTMENT',
  'PROGRAMME EDUCATIONAL OBJECTIVES',
  'PROGRAM SPECIFIC OUTCOMES',
  'PROGRAM OUTCOMES',
  'PROGRAM  OUTCOMES',
  'PUBLICATIONS',
  'PUBLICATION',
  'LABORATORIES',
  'FACILITIES',
  'COMPUTING FACILITIES',
  'LIST OF STUDENTS PLACED',
  'PLACEMENT',
  'ACHIEVEMENTS',
  'INDUSTRIAL VISIT',
  'TRAINING PROGRAM',
  'UNIVERSITY RANK HOLDERS'
];

function isSectionHeader(line) {
  const upper = line.trim().toUpperCase();
  return sectionHeaders.some(header => upper.startsWith(header) || upper.includes(header));
}

// 1. First, parse faculty for ECE, MBA, S&H
const missingDepts = ['ece', 'mba', 'sh'];
for (const key of missingDepts) {
  const config = deptMapping[key];
  const filePath = path.resolve(config.file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n');

  let facultyStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toUpperCase();
    if (line === 'FACULTY' || line === 'FACULTY:' || line === 'FACULTY;' || line === 'LIST OF FACULTY') {
      facultyStartIndex = i;
      break;
    }
  }

  if (facultyStartIndex === -1) {
    console.error(`Could not find faculty section in ${config.file}`);
    continue;
  }

  const facultyLines = [];
  for (let i = facultyStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isSectionHeader(line)) {
      break;
    }
    facultyLines.push(line);
  }

  const facultyList = [];
  let currentFaculty = null;
  let currentKey = null;

  for (let i = 0; i < facultyLines.length; i++) {
    const line = facultyLines[i].trim();
    if (!line) continue;

    const isNamePrefix = line.match(/^(Dr\.|Mr\.|Ms\.|Mrs\.)/i);
    const isUpperName = line.toUpperCase() === line && 
                        line.length > 5 && 
                        !line.includes('QUALIFICATION') && 
                        !line.includes('DESIGNATION') && 
                        !line.includes('DEPARTMENT') && 
                        !line.includes('EMAIL') && 
                        !line.includes('E-MAIL') && 
                        !line.includes('EXPERIENCE') && 
                        !line.includes('JOINING') && 
                        !line.includes('TEACHING') && 
                        !line.includes('FACULTY ID') &&
                        !line.includes('@') &&
                        !line.match(/\d/) &&
                        !line.includes('LIST OF FACULTY') &&
                        !line.includes('STAFF');

    const isNewFaculty = isNamePrefix || isUpperName;
      
    if (isNewFaculty) {
      if (currentFaculty && currentFaculty.name && currentFaculty.name.length > 3) {
        currentFaculty.name = currentFaculty.name.trim();
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
        currentKey = null;
      }
    }
  }
  if (currentFaculty && currentFaculty.name && currentFaculty.name.length > 3) {
    currentFaculty.name = currentFaculty.name.trim();
    facultyList.push(currentFaculty);
  }

  if (departments[key]) {
    departments[key].faculty = facultyList;
    console.log(`Updated faculty list for ${key} with ${facultyList.length} members.`);
  } else {
    console.error(`Department key ${key} not found in departmentsData.json`);
  }
}

// 2. Helper function to normalize name for image matching
function normalizeName(name) {
  let n = name.toLowerCase();
  // Remove prefixes (with or without spaces)
  n = n.replace(/^(dr\.|mr\.|mrs\.|ms\.|prof\.|dr|mr|mrs|ms|prof)\s*/g, '');
  // Remove dots and commas
  n = n.replace(/[\.,]/g, ' ');
  // Remove single letters (initials) at the start, middle, or end
  n = n.replace(/\b[a-z]\b/g, '');
  // Clean up whitespace
  n = n.trim().replace(/\s+/g, ' ');
  return n;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}

// 3. Match images for all 11 departments
const facultyImageDir = path.resolve('public/Faculty Image');

for (const [key, config] of Object.entries(deptMapping)) {
  const folderPath = path.join(facultyImageDir, config.folder);
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    continue;
  }

  const files = fs.readdirSync(folderPath).filter(f => f !== 'Thumbs.db');
  let faculty = departments[key]?.faculty || [];

  // CLEANUP FACULTY LIST: remove invalid/noisy entries
  faculty = faculty.filter(f => {
    const name = f.name.trim();
    if (!name) return false;
    if (name.includes('@')) return false;
    if (name.toLowerCase() === 'faculty members directory') return false;
    if (name.match(/\d/)) return false;
    if (name.length < 3) return false;
    return true;
  });

  // Re-assign clean list
  departments[key].faculty = faculty;

  console.log(`\nMatching images for department: ${key}`);
  let matchCount = 0;

  for (const f of faculty) {
    // Custom overrides
    if (key === 'ece' && f.name.includes('Suresh Babu')) {
      f.image = `/Faculty Image/ece/w=1920,quality=90,fit=scale-down (2).jpg`;
      matchCount++;
      continue;
    }

    const normName = normalizeName(f.name);
    let matchedFile = null;

    // First attempt: Exact match or name contains/is contained in filename
    for (const file of files) {
      const fileBase = path.parse(file).name.toLowerCase().trim();
      const normFileBase = fileBase.replace(/[\.,]/g, ' ').replace(/\b[a-z]\b/g, '').trim().replace(/\s+/g, ' ');

      if (normName === normFileBase || normName.replace(/\s+/g, '') === normFileBase.replace(/\s+/g, '')) {
        matchedFile = file;
        break;
      }
    }

    // Second attempt: Substring or containment match
    if (!matchedFile) {
      for (const file of files) {
        const fileBase = path.parse(file).name.toLowerCase().trim();
        const normFileBase = fileBase.replace(/[\.,]/g, ' ').replace(/\b[a-z]\b/g, '').trim().replace(/\s+/g, ' ');

        if (normName.includes(normFileBase) || normFileBase.includes(normName)) {
          matchedFile = file;
          break;
        }
      }
    }

    // Third attempt: Levenshtein distance <= 2
    if (!matchedFile) {
      for (const file of files) {
        const fileBase = path.parse(file).name.toLowerCase().trim();
        const normFileBase = fileBase.replace(/[\.,]/g, ' ').replace(/\b[a-z]\b/g, '').trim().replace(/\s+/g, ' ');

        if (levenshteinDistance(normName, normFileBase) <= 2) {
          matchedFile = file;
          break;
        }
      }
    }

    if (matchedFile) {
      f.image = `/Faculty Image/${config.folder}/${matchedFile}`;
      matchCount++;
    } else {
      f.image = "";
      console.log(`  MISSING IMAGE: "${f.name}" (normalized: "${normName}")`);
    }
  }

  console.log(`Department ${key}: Matched ${matchCount}/${faculty.length} images.`);
}

// 4. Save departmentsData.json
fs.writeFileSync(departmentsDataPath, JSON.stringify(departments, null, 2), 'utf8');
console.log(`\nSuccessfully saved updated departmentsData.json!`);
