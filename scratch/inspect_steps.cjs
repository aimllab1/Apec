const { DatabaseSync } = require('node:sqlite');
const path = require('path');

try {
  const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d.db';
  const db = new DatabaseSync(dbPath);

  const steps = db.prepare("SELECT idx, step_type, status, metadata, step_payload FROM steps LIMIT 5").all();
  for (const step of steps) {
    console.log(`--- Step ${step.idx} ---`);
    console.log(`step_type: ${step.step_type}, status: ${step.status}`);
    
    if (step.metadata) {
      console.log('metadata length:', step.metadata.length);
      try {
        console.log('metadata as string:', step.metadata.toString('utf8').substring(0, 200));
      } catch (e) {
        console.log('metadata cannot convert to string');
      }
    }
    
    if (step.step_payload) {
      console.log('step_payload length:', step.step_payload.length);
      try {
        console.log('step_payload as string:', step.step_payload.toString('utf8').substring(0, 200));
      } catch (e) {
        console.log('step_payload cannot convert to string');
      }
    }
  }
} catch (e) {
  console.error(e);
}
