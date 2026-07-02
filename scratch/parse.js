import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));

console.log("Found files:", files);

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\nFile: ${file} (${content.length} chars)`);
  
  // Split into lines
  const lines = content.split('\n').map(l => l.trim());
  
  // Detect headings
  const headings = [];
  lines.forEach((line, idx) => {
    if (line.match(/^[A-Z0-9\s,&()-]{4,60}(:|;|--)?$/) && line.length > 5 && !line.includes('http') && !line.includes('@')) {
      // Check if it looks like a heading
      const upper = line.toUpperCase();
      if (upper.includes('ABOUT') || upper.includes('VISION') || upper.includes('MISSION') || 
          upper.includes('PEO') || upper.includes('PSO') || upper.includes('PO') || 
          upper.includes('FACULTY') || upper.includes('PUBLICATION') || upper.includes('LAB') || 
          upper.includes('FACILIT') || upper.includes('STUDENT') || upper.includes('PLACEMENT') ||
          upper.includes('ACHIEVEMENT') || upper.includes('TOPPER')) {
        headings.push({ line, index: idx });
      }
    }
  });
  
  console.log("Headings detected:");
  headings.forEach(h => console.log(`  - Line ${h.index}: "${h.line}"`));
});
