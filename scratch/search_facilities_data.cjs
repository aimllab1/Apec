const fs = require('fs');
const path = require('path');

const files = [
  'Z:\\src\\pages\\Facilities.jsx',
  'Z:\\src\\pages\\FacilityDetail.jsx',
  'Z:\\data\\college_knowledge.json'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`\n=================== SEARCHING IN ${filePath} ===================`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes('bus') || line.toLowerCase().includes('transport') || line.toLowerCase().includes('rout') || line.toLowerCase().includes('time') || line.toLowerCase().includes('avail')) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
