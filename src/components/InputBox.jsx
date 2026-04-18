import React, { useState } from 'react';

const InputBox = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <form className="input-container" onSubmit={handleSubmit}>
      <label htmlFor="venue-query" className="sr-only">What are you looking for?</label>
      <input
        id="venue-query"
        type="text"
        placeholder="e.g., 'Find nearest washroom' or 'I am hungry'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        autoFocus
        autoComplete="off"
      />
      <button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? <span className="loading-spinner"></span> : 'Find Best Option'}
      </button>
    </form>
  );
};

export default InputBox;
