import React, { useState } from 'react';
import './LandingPage.css';


export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswap</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" className="nav-link">How it works</a>
          <a href="#" className="nav-link">How to sell</a>
          <a href="#" className="nav-link">Become a partner</a>
          <a href="#" className="nav-link">Log in</a>
          <button className="btn-primary">Sell your tickets</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            The safest way to buy and sell tickets
          </h1>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search for an event, artist, venue or city"
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
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-grid">
            {/* Left Column - Features */}
            <div className="features-list">
              <div className="feature-item">
                <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>The safest way to buy and sell tickets with over 17.6 million fans</p>
              </div>
              
              <div className="feature-item">
                <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>Prices are capped at 20% above face value</p>
              </div>
              
              <div className="feature-item">
                <svg className="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>Primary tickets from over 6000 partnered events</p>
              </div>
            </div>

            {/* Right Column - Trustpilot */}
            <div className="trustpilot-container">
              <div className="trustpilot-content">
                <div className="trustpilot-header">
                  <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="trustpilot-text">Trustpilot</span>
                </div>
                <div className="stars-container">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="star" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="reviews-count">26756 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-section">
        <div className="tabs-container">
          <button className="tab active">Discover</button>
          <button className="tab">For you</button>
          <button className="tab">Following</button>
        </div>
      </div>
    </div>
  );
}