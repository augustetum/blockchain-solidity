import { useState } from 'react';
import '../styles/LandingPage.css';
import WalletConnect from '../components/WalletConnect';
import SearchResults from '../components/SearchResults';
import { CONCERTS_DATA, searchConcerts } from '../data/concertsData';

export default function LandingPage({ navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchConcerts(query, CONCERTS_DATA);
      console.log('Search query:', query);
      console.log('Search results:', results);
      setSearchResults(results);
      setShowNoResults(results.length === 0);
      setShowResults(true);
    } else {
      setShowResults(false);
      setShowNoResults(false);
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchConcerts(searchQuery, CONCERTS_DATA);
      console.log('Form submit - results:', results);
      if (results.length > 0) {
        navigate('concerts');
      } else {
        setShowNoResults(true);
        setShowResults(true);
      }
    }
  };

  const handleConcertClick = (concert) => {
    setShowResults(false);
    setSearchQuery('');
    navigate('concert-detail', concert);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setShowNoResults(false);
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswell</span>
        </div>

        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); }}>How it works</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('concerts'); }}>Browse Events</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Profile</a>
          <WalletConnect />
          <button className="btn-primary" onClick={() => navigate('sell')}>
            Sell your tickets
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-background"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            The safest way to buy and sell tickets
          </h1>

          <form onSubmit={handleSearch} className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search for an event, artist, venue or city..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          <button 
            className="btn-browse"
            onClick={() => navigate('concerts')}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#22d3ee',
              color: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Browse All Events
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="features-grid">
            <div className="features-list">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}