import dotenv from 'dotenv';
dotenv.config();

const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes('api') || k.toLowerCase().includes('gemini') || k.toLowerCase().includes('key'));
console.log("Filtered Env Keys with Dotenv:", keys);
if (process.env.GEMINI_API_KEY) {
  console.log("GEMINI_API_KEY loaded successfully. Length:", process.env.GEMINI_API_KEY.length);
} else {
  console.log("GEMINI_API_KEY is not defined even after loading .env");
}
