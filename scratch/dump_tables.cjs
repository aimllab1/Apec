const { DatabaseSync } = require('node:sqlite');

try {
  const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d.db';
  const db = new DatabaseSync(dbPath);

  console.log('--- trajectory_meta ---');
  const trajectory_meta = db.prepare("SELECT * FROM trajectory_meta").all();
  console.log(trajectory_meta);

  console.log('--- trajectory_metadata_blob ---');
  const trajectory_metadata_blob = db.prepare("SELECT * FROM trajectory_metadata_blob").all();
  for (const row of trajectory_metadata_blob) {
    console.log('id:', row.id);
    if (row.data) {
      console.log('data as string:', row.data.toString('utf8').substring(0, 300));
    }
  }

  console.log('--- executor_metadata ---');
  const executor_metadata = db.prepare("SELECT * FROM executor_metadata").all();
  console.log(executor_metadata);

} catch (e) {
  console.error(e);
}
