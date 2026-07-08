import fs from 'fs';
import path from 'path';

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

for (const [key, config] of Object.entries(deptMapping)) {
  const filePath = path.resolve(config.file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }

  const rawContent = fs.readFileSync(filePath, 'utf8');
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n');

  // Find faculty section
  let facultyStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toUpperCase();
    if (line === 'FACULTY' || line === 'FACULTY:' || line === 'FACULTY;' || line === 'LIST OF FACULTY') {
      facultyStartIndex = i;
      break;
    }
  }

  if (facultyStartIndex === -1) {
    console.log(`Could not find faculty section in ${config.file}`);
    continue;
  }

  // Get lines up to next section header
  const facultyLines = [];
  for (let i = facultyStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isSectionHeader(line)) {
      break;
    }
    facultyLines.push(line);
  }

  // Parse faculty members
  const facultyList = [];
  let currentFaculty = null;
  let currentKey = null;

  for (let i = 0; i < facultyLines.length; i++) {
    const line = facultyLines[i].trim();
    if (!line) continue;

    const isNewFaculty = line.match(/^(Dr\.|Mr\.|Ms\.|Mrs\.)/i) || 
                         (line.toUpperCase() === line && line.length > 5 && !line.includes('QUALIFICATION') && !line.includes('DESIGNATION') && !line.includes('DEPARTMENT') && !line.includes('EMAIL') && !line.includes('E-MAIL') && !line.includes('EXPERIENCE') && !line.includes('JOINING') && !line.includes('TEACHING') && !line.includes('FACULTY ID'));
      
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
        currentKey = null;
      }
    }
  }
  if (currentFaculty && currentFaculty.name) {
    facultyList.push(currentFaculty);
  }

  console.log(`Department ${key} parsed ${facultyList.length} faculty members.`);
  if (facultyList.length > 0) {
    console.log(`  First:`, facultyList[0].name);
    console.log(`  Last:`, facultyList[facultyList.length - 1].name);
  }
}
