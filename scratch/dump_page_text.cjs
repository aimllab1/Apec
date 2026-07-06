const fs = require('fs');
const path = require('path');

const pagesDir = 'Z:\\src\\pages';
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n=================== ${file} ===================`);
    
    // Find all JSX text content (like text in h1, h2, h3, p, span, li)
    // We can do a simple regex or check lines that have visible text
    const lines = content.split('\n');
    let textLines = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      // Look for lines containing text (not import, not HTML tags only, not code structure)
      if (trimmed.length > 0 && 
          !trimmed.startsWith('import') && 
          !trimmed.startsWith('const') && 
          !trimmed.startsWith('let') && 
          !trimmed.startsWith('function') && 
          !trimmed.startsWith('return') && 
          !trimmed.startsWith('export') && 
          !trimmed.startsWith('//') && 
          !trimmed.startsWith('className') && 
          !trimmed.startsWith('style') && 
          !trimmed.startsWith('</') && 
          !trimmed.startsWith('{') && 
          !trimmed.startsWith('}') && 
          !trimmed.startsWith('(') && 
          !trimmed.startsWith(')') && 
          !trimmed.startsWith('onClick') &&
          !trimmed.startsWith('onChange') &&
          !trimmed.startsWith('<div') &&
          !trimmed.startsWith('<span') &&
          !trimmed.startsWith('<button') &&
          !trimmed.startsWith('<Link') &&
          !trimmed.startsWith('<motion')
      ) {
        // Strip simple html/jsx tags from the start/end
        const cleanLine = trimmed.replace(/<[^>]+>/g, '').replace(/\{\/\*.*?\*\/\}/g, '').trim();
        if (cleanLine.length > 5 && !cleanLine.startsWith('class') && !cleanLine.includes('=>')) {
          textLines.push(cleanLine);
        }
      }
    });
    
    // Output first 40 text lines to see what information is there
    console.log(textLines.slice(0, 40).join('\n'));
    if (textLines.length > 40) {
      console.log(`... and ${textLines.length - 40} more text lines`);
    }
  }
});
