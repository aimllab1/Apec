const fs = require('fs');
const path = require('path');

const dir = 'Z:\\';
fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach(file => {
    const filePath = path.join(dir, file);
    try {
      const lstats = fs.lstatSync(filePath);
      const stats = fs.statSync(filePath);
      console.log(`${file}: isSymlink=${lstats.isSymbolicLink()} | isDir=${lstats.isDirectory()}`);
      if (lstats.isSymbolicLink()) {
        console.log(`  -> target: ${fs.readlinkSync(filePath)}`);
      }
    } catch (e) {
      console.log(`${file}: error statting: ${e.message}`);
    }
  });
});
