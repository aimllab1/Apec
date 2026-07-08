import fs from 'fs';
import path from 'path';

const missingDepts = {
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

for (const [key, config] of Object.entries(missingDepts)) {
  const filePath = path.resolve(config.file);
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
    console.log(`Could not find faculty section in ${config.file}`);
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

    // A line is a new faculty if:
    // 1. It starts with Dr., Mr., Ms., Mrs.
    // 2. Or it is all uppercase, length > 5, and doesn't contain noise words (email, qualification, etc.)
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
        // Clean name
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

  console.log(`\n--- ${key.toUpperCase()} ---`);
  facultyList.forEach((f, idx) => {
    console.log(`${idx + 1}. ${f.name} (${f.designation || 'no designation'}, ${f.qualification || 'no qual'})`);
  });
}
