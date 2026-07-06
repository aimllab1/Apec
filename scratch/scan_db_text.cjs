const { DatabaseSync } = require('node:sqlite');

try {
  const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d.db';
  const db = new DatabaseSync(dbPath);

  // Let's query all steps
  const rows = db.prepare("SELECT idx, step_type, status, metadata, step_payload FROM steps ORDER BY idx").all();
  
  console.log(`Scanning ${rows.length} steps for text strings...`);
  
  rows.forEach(row => {
    console.log(`\n=================== STEP ${row.idx} (type: ${row.step_type}) ===================`);
    
    // Function to extract printable ASCII sequences from a Buffer/Uint8Array
    function extractStrings(buffer) {
      if (!buffer) return [];
      const strs = [];
      let currentStr = '';
      for (let i = 0; i < buffer.length; i++) {
        const charCode = buffer[i];
        // printable ASCII characters or tab/newline
        if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
          currentStr += String.fromCharCode(charCode);
        } else {
          if (currentStr.trim().length >= 8) {
            strs.push(currentStr.trim());
          }
          currentStr = '';
        }
      }
      if (currentStr.trim().length >= 8) {
        strs.push(currentStr.trim());
      }
      return strs;
    }
    
    const metaStrings = extractStrings(row.metadata);
    const payloadStrings = extractStrings(row.step_payload);
    
    // Filter/clean strings to look for user queries and model outputs
    console.log("Metadata strings:");
    metaStrings.forEach(s => {
      // ignore strings that are just paths/ids if they don't look like actual conversation
      if (s.length > 15) {
        console.log(`  - ${s.substring(0, 150)}`);
      }
    });
    
    console.log("Payload strings:");
    payloadStrings.forEach(s => {
      if (s.length > 20) {
        console.log(`  - ${s.substring(0, 150)}`);
      }
    });
  });

} catch (e) {
  console.error(e);
}
