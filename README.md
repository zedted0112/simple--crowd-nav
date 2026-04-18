# Smart Venue Assistant 🚀

A high-performance, AI-driven web application designed to help users find the best facility (washrooms, food stalls, medical aid) within a venue by optimizing for both **distance** and **wait time**.

## 🎯 Problem Statement
Managing crowd flow in large venues is challenging. Users often walk to the nearest facility only to find a long queue, while a slightly further one might be empty. This app solves that by using a weighted decision engine.

## 🧠 AI Usage
We use **Google Gemini 1.5 Flash** for **Intent Extraction**. 
- **Input**: "I'm starving!"
- **AI Logic**: Interprets the natural language and maps it to a structured intent like `food`.
- **Structured Output**: Uses Gemini's `responseMimeType: "application/json"` to ensure reliable parsing directly into the logic engine.

## ⚙️ Decision Logic
The core engine (`facilityEngine.js`) uses a multi-factor scoring system:
1. **Distance**: Calculated via Euclidean formula.
2. **Estimated Wait Time (EWT)**: `(Queue Length / Capacity) * Service Time`.
3. **Scoring**: $Score = (Distance \times 0.4) + (WaitTime \times 0.6)$.
   - Lower scores are preferred.
   - The engine returns the best match with an explainable "Reasoning" string.

## 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **AI**: @google/generative-ai (Gemini API)
- **Logic**: Pure Functional JS
- **Testing**: Vitest
- **Styling**: Premium Vanilla CSS (Glassmorphism)

## 🚀 How to Run

1. **Clone & Setup**:
   ```bash
   cd simple-venue-assistant
   npm install
   ```

2. **Configure API Key**:
   Create a `.env` file in the root:
   ```bash
   VITE_GEMINI_API_KEY=your_google_ai_key
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Run Tests**:
   ```bash
   npm run test
   ```

## 🧪 Testing
The logic engine is fully tested with Vitest, covering:
- Distance accuracy
- EWT calculations
- Weighted scoring scenarios
- Fallback/Error handling

## 🔐 Assumptions
- User coordinates are simulated as `(50, 10)`.
- Facilities are provided as a static JSON for the hackathon version.
- Service times are representative of average facility throughput.
