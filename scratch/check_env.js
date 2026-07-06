import fs from 'fs';
const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes('api') || k.toLowerCase().includes('gemini') || k.toLowerCase().includes('key'));
console.log("Filtered Env Keys:", keys);
console.log("All Env Keys count:", Object.keys(process.env).length);
if (process.env.GEMINI_API_KEY) {
  console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY.length);
} else {
  console.log("GEMINI_API_KEY is not defined in process.env");
}
