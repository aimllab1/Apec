try {
  console.log("Testing import of Z:\\api\\chat.js...");
  const chatHandler = require('Z:\\api\\chat.js');
  console.log("Success! imported handler:", typeof chatHandler);
} catch (e) {
  console.error("Import failed:", e);
}
