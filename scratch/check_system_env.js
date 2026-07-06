import { execSync } from 'child_process';

try {
  const userKey = execSync(`powershell -Command "[System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')"`).toString().trim();
  console.log("User GEMINI_API_KEY:", userKey ? `Found (length: ${userKey.length})` : "Not Found");
  if (userKey) console.log("User Key Value:", userKey);
} catch (e) {
  console.error("Error reading User env:", e.message);
}

try {
  const machineKey = execSync(`powershell -Command "[System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Machine')"`).toString().trim();
  console.log("Machine GEMINI_API_KEY:", machineKey ? `Found (length: ${machineKey.length})` : "Not Found");
  if (machineKey) console.log("Machine Key Value:", machineKey);
} catch (e) {
  console.error("Error reading Machine env:", e.message);
}

try {
  const processKey = execSync(`powershell -Command "[System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'Process')"`).toString().trim();
  console.log("Process GEMINI_API_KEY:", processKey ? `Found (length: ${processKey.length})` : "Not Found");
  if (processKey) console.log("Process Key Value:", processKey);
} catch (e) {
  console.error("Error reading Process env:", e.message);
}
