const { execSync } = require('child_process');

try {
  console.log("=== Listing all node processes ===");
  const wmic = execSync('wmic process where "name=\'node.exe\'" get ProcessID, CommandLine').toString();
  console.log(wmic);
} catch (e) {
  console.log("Failed to list node processes:", e.message);
}
