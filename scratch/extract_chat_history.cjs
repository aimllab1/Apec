const { DatabaseSync } = require('node:sqlite');

try {
  const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d.db';
  const db = new DatabaseSync(dbPath);

  const rows = db.prepare("SELECT idx, step_type, status, metadata, step_payload FROM steps ORDER BY idx").all();
  
  console.log("=== CHRONOLOGICAL CHAT HISTORY ===");

  function cleanString(str) {
    // Remove non-printable characters
    return str.replace(/[^\x20-\x7E\n\r\t]/g, '');
  }

  function getReadableStrings(buffer) {
    if (!buffer) return [];
    const strings = [];
    let current = '';
    for (let i = 0; i < buffer.length; i++) {
      const code = buffer[i];
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
        current += String.fromCharCode(code);
      } else {
        if (current.trim().length >= 10) {
          strings.push(current.trim());
        }
        current = '';
      }
    }
    if (current.trim().length >= 10) {
      strings.push(current.trim());
    }
    return strings;
  }

  rows.forEach(row => {
    const rawStrs = getReadableStrings(row.step_payload);
    
    // We want to find user input steps and assistant response steps
    // Usually, step_type 1 represents user input or similar.
    // Let's analyze if there's any user input string.
    // User inputs typically contain prompts like "need this enhancement", "Fix the AI chatbot", etc.
    const userPrompts = rawStrs.filter(s => 
      s.includes("need this enhancement") || 
      s.includes("undo previous") || 
      s.includes("Upgrade the existing") || 
      s.includes("Fix the AI") || 
      s.includes("Debug and fix") || 
      s.includes("what i have to do") || 
      s.includes("even though added my api") || 
      s.includes("use the existing data to create")
    );

    if (userPrompts.length > 0) {
      console.log(`\n[Step ${row.idx}] USER REQUEST:`);
      userPrompts.forEach(p => console.log(`> ${p}`));
    }

    // Let's see if we can find assistant responses.
    // Assistant responses are usually longer markdown or descriptions.
    // We can look for strings containing markdown headers, bullet points, or paragraphs explaining the code.
    const assistantTexts = rawStrs.filter(s => 
      s.includes("I have") || 
      s.includes("We can") || 
      s.includes("Here is") || 
      s.includes("###") || 
      s.includes("successfully") || 
      s.includes("APEC")
    ).filter(s => !s.includes("file://") && s.length > 50 && !rawStrs.some(up => up.includes(s)));

    // Let's filter out standard system messages or file paths
    const filteredAssistantTexts = assistantTexts.filter(s => {
      // exclude files content
      if (s.includes("import ") || s.includes("const ") || s.includes("function ") || s.includes("package.json")) {
        return false;
      }
      return true;
    });

    if (filteredAssistantTexts.length > 0 && userPrompts.length === 0) {
      // Only print if there are actual words and it's not a repeat of the user prompt
      console.log(`\n[Step ${row.idx}] ASSISTANT TEXT (POTENTIAL RESPONSE):`);
      // print first 2 unique ones
      const uniques = [...new Set(filteredAssistantTexts)];
      uniques.slice(0, 2).forEach(t => console.log(t.substring(0, 300) + (t.length > 300 ? "..." : "")));
    }
  });

} catch (e) {
  console.error(e);
}
