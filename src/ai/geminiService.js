import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Service to interact with Google Gemini AI for Intent Detection
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// The system instruction to guide the model
const SYSTEM_PROMPT = `
You are an intent detection assistant for a Smart Venue.
Your goal is to extract the user's "intent" from their natural language input.

Recognized intents: 
- "washroom": User needs a toilet, rest room, or bathroom.
- "food": User is hungry, needs a snack, drink, or place to eat.
- "medical": User is injured, feeling unwell, or needs a doctor/first aid.

Rules:
1. Always return valid JSON.
2. If the intent is unclear, return {"intent": "unknown"}.
3. Do not provide any conversational text, only the JSON.

Examples:
Input: "I need to find a toilet"
Output: {"intent": "washroom"}

Input: "I'm starving"
Output: {"intent": "food"}

Input: "Where is the nearest cafe?"
Output: {"intent": "food"}

Input: "I hurt my leg"
Output: {"intent": "medical"}
`;

export const detectIntent = async (userInput) => {
  if (!genAI) {
    console.warn("Gemini API Key missing. Falling back to simple keyword matching.");
    return fallbackIntentDetector(userInput);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nInput: "${userInput}"\nOutput:`);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return fallbackIntentDetector(userInput);
  }
};

/**
 * Simple keyword-based fallback if AI is unavailable
 */
const fallbackIntentDetector = (input) => {
  const text = input.toLowerCase();
  if (text.includes("washroom") || text.includes("toilet") || text.includes("restroom") || text.includes("pee")) {
    return { intent: "washroom" };
  }
  if (text.includes("food") || text.includes("hungry") || text.includes("eat") || text.includes("snack") || text.includes("cafe")) {
    return { intent: "food" };
  }
  if (text.includes("medical") || text.includes("doctor") || text.includes("hurt") || text.includes("injury")) {
    return { intent: "medical" };
  }
  return { intent: "unknown" };
};
