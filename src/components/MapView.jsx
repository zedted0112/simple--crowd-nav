import React from 'react';

/**
 * MapView Component (UI Only / Optional)
 * Visualizes the location of the selected facility.
 */
const MapView = ({ x, y, name }) => {
  // Check if Google Maps API is globally available
  const isGoogleMapsAvailable = window.google && window.google.maps;

  return (
    <div className="map-wrapper" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#888' }}>Location Preview</h3>
      
      {isGoogleMapsAvailable ? (
        <div id="google-map" style={{ height: '150px', background: '#222', borderRadius: '12px' }}>
          {/* Real Google Map would be initialized here */}
        </div>
      ) : (
        <div className="map-placeholder">
          <div className="grid-background"></div>
          <div className="user-dot" title="You are here"></div>
          <div 
            className="facility-marker" 
            style={{ left: `${x}%`, top: `${y}%` }}
            title={name}
          >
            📍
          </div>
          <p className="placeholder-text">
            Venue Grid View (Simulated)
          </p>
        </div>
      )}
      
      <p style={{ fontSize: '0.7rem', color: '#666', textAlign: 'center', marginTop: '0.5rem' }}>
        Coords: {x}, {y} | {isGoogleMapsAvailable ? 'Live Map Enabled' : 'Grid Fallback Active'}
      </p>
    </div>
  );
};

export default MapView;
