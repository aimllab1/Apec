const { execSync } = require('child_process');

try {
  console.log("=== Checking listening ports (Windows netstat) ===");
  const netstat = execSync('netstat -ano | findstr :5173').toString();
  console.log(netstat);
} catch (e) {
  console.log("Port 5173 not found or netstat failed:", e.message);
}

try {
  console.log("=== Checking all listening node/python ports ===");
  const netstat2 = execSync('netstat -ano | findstr LISTENING').toString();
  console.log(netstat2.split('\n').filter(line => line.includes('5173') || line.includes('5001') || line.includes('3000') || line.includes('8080')).join('\n'));
} catch (e) {
  console.log("Netstat LISTENING check failed:", e.message);
}
