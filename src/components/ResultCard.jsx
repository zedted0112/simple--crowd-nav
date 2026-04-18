import React from 'react';

const ResultCard = ({ result, error }) => {
  if (error) {
    return (
      <div className="glass-panel result-card" style={{ borderColor: 'rgba(255, 100, 100, 0.3)' }}>
        <h3 style={{ color: '#ff6464' }}>Notice</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="glass-panel result-card">
      <div className="result-header">
        <h2 style={{ margin: 0 }}>{result.name}</h2>
        <span className="badge">{result.type}</span>
      </div>
      
      <div className="metric-grid">
        <div className="metric-item">
          <div className="metric-label">Estimated Wait</div>
          <div className="metric-value">{Math.round(result.ewt / 60)} mins</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">Distance</div>
          <div className="metric-value">{Math.round(result.distance)}m</div>
        </div>
      </div>

      <div className="reasoning">
        <p>{result.reasoning}</p>
      </div>
      
      <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
        Current Queue: {result.queue} people | Capacity: {result.capacity}
      </div>
    </div>
  );
};

export default ResultCard;
