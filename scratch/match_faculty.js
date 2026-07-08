import fs from 'fs';
import path from 'path';

// Let's load the departmentsData
const deptsDataPath = path.resolve('src/data/departmentsData.json');
const depts = JSON.parse(fs.readFileSync(deptsDataPath, 'utf8'));

// Faculty Image directory
const facultyImageDir = path.resolve('data/Faculty Image');

// Normalize name helper
function normalizeName(name) {
  let n = name.toLowerCase();
  // Remove prefixes
  n = n.replace(/^(dr\.|mr\.|mrs\.|ms\.|prof\.|dr|mr|mrs|ms|prof)\s+/g, '');
  // Remove dots and commas
  n = n.replace(/[\.,]/g, ' ');
  // Remove single letters (initials) at the start or end
  n = n.replace(/\b[a-z]\b/g, '');
  // Clean up whitespace
  n = n.trim().replace(/\s+/g, ' ');
  return n;
}

// Departement key mapping to Faculty Image folder name
const deptFolderMap = {
  'aiml': 'aiml',
  'cse': 'cse',
  'it': 'it',
  'ece': 'ece',
  'eee': 'eee',
  'mech': 'mech',
  'civil': 'Civil',
  'chemical': 'chemical',
  'mca': 'MCA',
  'mba': 'MBA',
  'sh': 's & h',
};

// Scan departments and check files
const allDeptKeys = Object.keys(depts);

for (const key of allDeptKeys) {
  const folderName = deptFolderMap[key];
  if (!folderName) {
    console.log(`No folder mapping for department: ${key}`);
    continue;
  }
  const folderPath = path.join(facultyImageDir, folderName);
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    continue;
  }
  
  const files = fs.readdirSync(folderPath).filter(f => f !== 'Thumbs.db');
  console.log(`\n--- Department: ${key} (${folderName}) ---`);
  console.log(`Files in folder:`, files);
  
  const faculty = depts[key].faculty || [];
  for (const f of faculty) {
    const normName = normalizeName(f.name);
    // Find best match in files
    let match = null;
    let minDistance = 999;
    
    for (const file of files) {
      const fileBase = path.parse(file).name.toLowerCase();
      // Exact match after normalization
      if (fileBase === normName || fileBase.replace(/\s+/g, '') === normName.replace(/\s+/g, '')) {
        match = file;
        break;
      }
      
      // Let's check if the fileBase is contained in normName or vice versa
      if (normName.includes(fileBase) || fileBase.includes(normName)) {
        match = file;
        break;
      }
    }
    
    if (match) {
      console.log(`  MATCH: "${f.name}" -> "${match}"`);
    } else {
      console.log(`  MISSING: "${f.name}" (normalized: "${normName}")`);
    }
  }
}
