import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function list() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key of length:", apiKey ? apiKey.length : 0);
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We can list models using listModels()
    // Wait, is listModels a method in GoogleGenerativeAI?
    // Let's check or search the web or try it.
    // In @google/generative-ai, listModels might not be exposed on GoogleGenerativeAI direct class in some versions,
    // but let's check if it exists or search.
    // Actually, let's try a few standard model names: "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-pro".
    // Wait! Let's write a script to test generateContent with different model names!
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash-exp", "gemini-1.5-pro"];
    
    for (const modelName of models) {
      try {
        console.log(`Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent("Say 'hello' in one word.");
        console.log(`Success with ${modelName}:`, response.response.text().trim());
        break; // Stop at first successful model!
      } catch (err) {
        console.log(`Failed with ${modelName}:`, err.message);
      }
    }
  } catch (err) {
    console.error("List failed:", err);
  }
}
list();
