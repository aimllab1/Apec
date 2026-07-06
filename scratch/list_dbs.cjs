const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations';
fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  const fileDetails = files.map(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      mtime: stats.mtime,
      size: stats.size
    };
  });
  // sort by mtime descending
  fileDetails.sort((a, b) => b.mtime - a.mtime);
  console.log(JSON.stringify(fileDetails, null, 2));
});
