const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('Z:\\src\\App.jsx');
const rl = readline.createInterface({
  input: fileStream,
  output: process.stdout,
  terminal: false
});

let lineNumber = 0;
rl.on('line', (line) => {
  lineNumber++;
  if (line.toLowerCase().includes('chat') || line.toLowerCase().includes('scroll') || line.toLowerCase().includes('overflow') || line.toLowerCase().includes('wheel') || line.toLowerCase().includes('mouse')) {
    console.log(`${lineNumber}: ${line.trim()}`);
  }
});
