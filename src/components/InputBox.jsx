import React, { useState } from 'react';

/**
 * Accessible Input Component for the Search Interface
 */
const InputBox = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <section className="input-section" aria-labelledby="input-heading">
      <h2 id="input-heading" className="sr-only">Query Input</h2>
      <form className="input-container" onSubmit={handleSubmit}>
        <label htmlFor="venue-assistant-query" className="input-label">
          What are you looking for?
        </label>
        <input
          id="venue-assistant-query"
          className="assistant-input"
          type="text"
          placeholder="e.g., 'Find nearest washroom' or 'I am hungry'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          aria-required="true"
          autoFocus
          autoComplete="off"
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !query.trim()}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner" aria-hidden="true"></span>
          ) : 'Find Best Option'}
        </button>
      </form>
    </section>
  );
};

export default InputBox;
