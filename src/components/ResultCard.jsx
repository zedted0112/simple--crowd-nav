import React from 'react';

/**
 * Semantic and Explainable Result Component
 * Displays the best facility recommendation clearly.
 */
const ResultCard = ({ result, error }) => {
  if (error) {
    return (
      <article className="glass-panel result-card error-case" role="alert">
        <h3 style={{ color: '#ff6464' }}>Notice</h3>
        <p>{error}</p>
      </article>
    );
  }

  if (!result) return null;

  return (
    <article className="glass-panel result-card" aria-labelledby="result-title">
      <header className="result-header">
        <h2 id="result-title" className="facility-name">{result.name}</h2>
        <span className="badge" aria-label={`Facility type ${result.type}`}>{result.type}</span>
      </header>
      
      <div className="metric-grid">
        <section className="metric-item">
          <h3 className="metric-label">Estimated Wait</h3>
          <p className="metric-value">{result.waitTime}</p> section
        </section>
        <section className="metric-item">
          <h3 className="metric-label">Distance</h3>
          <p className="metric-value">{result.distance}</p>
        </section>
      </div>

      <blockquote className="reasoning">
        <p><strong>Selection Logic:</strong> {result.reasoning}</p>
      </blockquote>
      
      <footer className="footer-details">
        <p>
          Live Status: {result.queue} waiting | Capacity: {result.capacity} service points
        </p>
      </footer>
    </article>
  );
};

export default ResultCard;
