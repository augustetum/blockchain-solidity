import { useState } from 'react';
import '../styles/LandingPage.css';
import WalletConnect from '../components/WalletConnect';

export default function LandingPage({ navigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('concerts');
    }
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
                onChange={(e) => setSearchQuery(e.target.value)}
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