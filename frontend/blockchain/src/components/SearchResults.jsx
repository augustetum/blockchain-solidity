import '../styles/SearchResults.css';

export default function SearchResults({ results, onConcertClick, onClose }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results-overlay">
      <div className="search-results-container">
        <div className="search-results-header">
          <h3>{results.length} result{results.length !== 1 ? 's' : ''} found</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="search-results-list">
          {results.map((concert) => (
            <div 
              key={concert.id} 
              className="search-result-item"
              onClick={() => onConcertClick(concert)}
            >
              <div className="result-image">
                <img src={concert.image} alt={concert.name} />
              </div>
              <div className="result-info">
                <h4>{concert.name}</h4>
                <p className="result-artist">{concert.artist}</p>
                <div className="result-details">
                  <span>📅 {new Date(concert.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                  <span>📍 {concert.venue}, {concert.city}</span>
                </div>
                <div className="result-price">
                  {concert.priceRange}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}