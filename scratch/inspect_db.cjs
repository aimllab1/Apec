const { DatabaseSync } = require('node:sqlite');
const path = require('path');

try {
  const dbPath = 'C:\\Users\\Admin\\.gemini\\antigravity-cli\\conversations\\b2bfc70b-a610-4ca8-b9d9-d7d7951dc69d.db';
  const db = new DatabaseSync(dbPath);

  // List all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);

  for (const table of tables) {
    const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.log(`Table ${table.name} columns:`, columns.map(c => `${c.name} (${c.type})`));
  }
} catch (e) {
  console.error(e);
}
