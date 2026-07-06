const fs = require('fs');
const path = require('path');

const pagesDir = 'Z:\\src\\pages';
const files = fs.readdirSync(pagesDir);

const topics = {};

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const pageName = file.replace('.jsx', '');
    
    topics[pageName] = {
      headings: [],
      paragraphs: [],
      lists: []
    };
    
    // Simple regex to find text inside common elements
    // Headings
    const headingMatches = content.match(/<(h[1-4]|span|div)[^>]*className=["'][^"']*(text-[a-z0-9]+|font-[a-z0-9]+)[^"']*["'][^>]*>([\s\S]*?)<\/\1>/gi) || [];
    headingMatches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').replace(/\{\/\*.*?\*\/\}/g, '').trim();
      if (text.length > 3 && text.length < 100 && !text.includes('{') && !text.includes('}')) {
        topics[pageName].headings.push(text);
      }
    });

    // Paragraphs / visible text
    const textLines = content.split('\n')
      .map(line => line.trim())
      .filter(line => {
        return line.length > 10 &&
          !line.startsWith('import') &&
          !line.startsWith('const') &&
          !line.startsWith('let') &&
          !line.startsWith('function') &&
          !line.startsWith('return') &&
          !line.startsWith('export') &&
          !line.startsWith('//') &&
          !line.includes('className=') &&
          !line.includes('onClick=') &&
          !line.includes('onChange=') &&
          !line.includes('=>') &&
          !line.includes('{') &&
          !line.includes('}') &&
          !line.includes('<div') &&
          !line.includes('<span');
      })
      .map(line => line.replace(/<[^>]+>/g, '').trim())
      .filter(line => line.length > 10);
      
    topics[pageName].paragraphs = [...new Set(textLines)];
  }
});

// Output the extracted information for each page to see what's there
Object.keys(topics).forEach(page => {
  console.log(`\n=================== PAGE: ${page} ===================`);
  console.log(`Headings found:`, [...new Set(topics[page].headings)].slice(0, 10));
  console.log(`Sample Text lines:`, topics[page].paragraphs.slice(0, 15));
});
