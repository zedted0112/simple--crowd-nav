# Smart Venue Assistant 🚀

A high-performance, AI-driven web application designed to optimize venue navigation by dynamically matching user intent with the best available facilities.

---

## 🎯 Problem Statement
Managing crowd distribution in large venues is inefficient when users rely on static signs. Traditional navigation often leads users to the **closest** facility, unknowingly ignoring **available** facilities with zero wait time. This results in bottlenecked queues and poor user experience.

## 💡 The Approach
Our approach combines **Natural Language Understanding (NLU)** with a **Deterministic Decision Engine**.
1. **Understand**: Use Large Language Models (LLM) to extract structured intent from unstructured user speech/text.
2. **Optimize**: Run a weighted scoring algorithm (O(n)) that evaluates distance vs. real-time queue metrics.
3. **Reason**: Provide the user with a human-readable explanation of *why* a specific facility was chosen.

## 🧠 AI Usage (Google Gemini)
The app integrates **Google Gemini 1.5 Flash** as a primary NLU service.
- **Role**: Intent Detection.
- **Workflow**: User input is sent to Gemini with a system prompt defining known intents (`washroom`, `food`, `medical`).
- **Structure**: We utilize Gemini's `application/json` response mode to ensure the output is machine-readable and requires zero post-processing.
- **Robustness**: A local keyword-based fallback system ensures the app remains functional even in low-connectivity or high-latency scenarios.

## ⚙️ Decision Logic Explanation
The core engine (`/src/core/facilityEngine.js`) implements a dual-metric heuristic:
- **Euclidean Distance**: $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
- **Estimated Wait Time (EWT)**: $(Queue / Capacity) \times ServiceTime$
- **Scoring Function**: $Score = (NormalizedDistance \times 0.4) + (NormalizedWaitTime \times 0.6)$
  - 40% priority given to physical distance.
  - 60% priority given to waiting time optimization.

## 🔐 Security Measures
- **Environment Isolation**: API keys are isolated in `.env` and never committed to source control.
- **Strict Validation**: The AI service validates the presence of the `VITE_GEMINI_API_KEY` before attempting requests, throwing clear security errors if compromised.
- **Sanitized Output**: AI responses are parsed safely within a try-catch block to prevent injection or malformed data issues.

## 🧪 Testing Strategy
We employ a two-tier testing strategy for maximum reliability:
1. **Tier 1 (Unit Testing)**: Vitest used for regression testing.
2. **Tier 2 (Explicit Verification)**: A specialized script at `test/facilityEngine.test.js` using `console.assert` for high-visibility scoring during evaluation.

## 🛠️ Assumptions
- The user's location is simulated at a fixed coordinate $(50, 10)$ for demo purposes.
- Facility data represents a snapshot of live IoT sensor data.
- Average service time is constant per facility type.

---

## ⚡ How to Run
1. `npm install`
2. Add `VITE_GEMINI_API_KEY` to `.env`
3. `npm run dev` (Frontend)
4. `npm run test:explicit` (Logic verification)
