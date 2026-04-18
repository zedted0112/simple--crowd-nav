import React, { useState } from 'react';
import InputBox from './components/InputBox';
import ResultCard from './components/ResultCard';
import { detectIntent } from './ai/geminiService';
import { findBestFacility } from './core/facilityEngine';
import facilities from './data/facilities.json';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [intentLabel, setIntentLabel] = useState("");

  // Mock user position (can be randomized or fixed for demo)
  const userPosition = { x: 50, y: 10 };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setIntentLabel("");

    try {
      // 1. AI Intent Detection
      const { intent } = await detectIntent(query);
      
      if (intent === "unknown") {
        setError("I'm sorry, I couldn't understand what you're looking for. Try asking for a washroom, food, or medical assistance.");
        setLoading(false);
        return;
      }

      setIntentLabel(intent);

      // 2. Decision Engine
      const bestMatch = findBestFacility(userPosition, facilities, intent);

      if (!bestMatch) {
        setError(`No ${intent} facilities are currently available in this venue.`);
      } else {
        setResult(bestMatch);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Smart Venue Assistant</h1>
        <p className="subtitle">AI-powered navigation and wait-time optimization</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <InputBox onSearch={handleSearch} isLoading={loading} />
        
        {intentLabel && !error && !loading && (
          <div style={{ marginBottom: '1rem', color: '#646cff', fontWeight: 'bold' }}>
            Detected Intent: {intentLabel.toUpperCase()}
          </div>
        )}

        <ResultCard result={result} error={error} />
      </main>

      <footer style={{ marginTop: '4rem', color: '#444', fontSize: '0.8rem' }}>
        <p>&copy; 2026 Smart Venue Assistant | Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
