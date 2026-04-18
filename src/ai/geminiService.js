import { GoogleGenerativeAI } from "@google/generative-ai";
import xss from "xss";

/**
 * Gemini AI Service
 * This service handles natural language intent detection.
 * It maps user inputs like "I'm hungry" to structured types like "food".
 */

// API Key Validation: Ensure the key is available in the environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY && import.meta.env.MODE === 'production') {
  throw new Error("Security Violation: Missing VITE_GEMINI_API_KEY environment variable.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Intent mapping rules used by the AI
 */
const SYSTEM_PROMPT = `
  You are an intent detection assistant for a Smart Venue navigation app.
  Extract the MUST LIKELY intent from the user's input.
  
  Possible Intents:
  - "washroom": toilets, bathrooms, restrooms.
  - "food": hunger, snacks, drinks, cafes, stalls.
  - "medical": pain, injury, feeling unwell, clinic.
  
  Return ONLY a JSON object: {"intent": "type"}.
  Example: "Where can I eat?" -> {"intent": "food"}
`;

/**
 * Detect user intent using Google Gemini AI or a local fallback.
 * @param {string} userInput 
 * @returns {Promise<Object>} Object containing the detected intent
 */
export const detectUserIntent = async (userInput) => {
  // Sanitize input to prevent XSS/injection attacks
  const sanitizedInput = xss(userInput.trim());

  // Security check before processing
  if (!API_KEY) {
    console.warn("Security Warning: Gemini API Key missing. Using local fallback.");
    return detectIntentFallback(sanitizedInput);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `${SYSTEM_PROMPT}\n\nUser Input: "${sanitizedInput}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clear logging for explainability
    const data = JSON.parse(response.text());
    console.log(`[Gemini AI] Detected Intent: ${data.intent}`);
    
    return data;
  } catch (error) {
    console.error("Gemini AI Processing Error:", error);
    return detectIntentFallback(userInput);
  }
};

/**
 * Local intent detection fallback for robustness.
 * @param {string} input 
 */
function detectIntentFallback(input) {
  const query = input.toLowerCase();
  if (query.match(/toilet|washroom|restroom|pee|bathroom/)) return { intent: "washroom" };
  if (query.match(/food|hungry|eat|cafe|snack|drink/)) return { intent: "food" };
  if (query.match(/medical|hurt|doctor|injury|help/)) return { intent: "medical" };
  return { intent: "unknown" };
}
