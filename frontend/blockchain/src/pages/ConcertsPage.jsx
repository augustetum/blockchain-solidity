import { useState, useEffect } from 'react';
import '../styles/ConcertsPage.css';
import WalletConnect from '../components/WalletConnect';
import { useWeb3 } from '../context/Web3Context';
import { getEventListings } from '../utils/contractHelpers';
import { CONCERTS_DATA, searchConcerts, filterByCity, getUniqueCities } from '../data/concertsData';

export default function ConcertsPage({ navigate }) {
  const { contracts } = useWeb3();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [concertsData, setConcertsData] = useState(CONCERTS_DATA);
  const [loading, setLoading] = useState(false);

  const cities = getUniqueCities(CONCERTS_DATA);

  // Load real ticket data from blockchain
  useEffect(() => {
    if (contracts.marketplace && contracts.eventTickets && contracts.eventTickets.length > 0) {
      loadConcertData();
    }
  }, [contracts]);

  const loadConcertData = async () => {
    setLoading(true);
    try {
      const updatedConcerts = await Promise.all(
        CONCERTS_DATA.map(async (concert) => {
          // Find matching event ticket contract
          const eventTicket = contracts.eventTickets.find(
            et => et.name === concert.name
          );

          if (!eventTicket) {
            return concert; // Return original if no contract found
          }

          try {
            // Get marketplace listings for this event
            const listings = await getEventListings(
              contracts.marketplace,
              eventTicket.contract,
              eventTicket.address
            );

            // Calculate price range from listings
            let priceRange = concert.priceRange;
            if (listings.length > 0) {
              const prices = listings.map(l => parseFloat(l.price));
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);

              if (minPrice === maxPrice) {
                priceRange = `${minPrice.toFixed(3)} ETH`;
              } else {
                priceRange = `${minPrice.toFixed(3)} - ${maxPrice.toFixed(3)} ETH`;
              }
            }

            return {
              ...concert,
              availableTickets: listings.length,
              priceRange: priceRange
            };
          } catch (err) {
            console.error(`Error loading data for ${concert.name}:`, err);
            return concert;
          }
        })
      );

      setConcertsData(updatedConcerts);
    } catch (err) {
      console.error('Error loading concert data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply search and filters
  const searchResults = searchConcerts(searchTerm, concertsData);
  const filteredConcerts = filterByCity(searchResults, selectedCity);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
  };

  return (
    <div className="concerts-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswell</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Profile</a>
          <WalletConnect />
          <button className="btn-primary" onClick={() => navigate('sell')}>
            Sell Tickets
          </button>
        </div>
      </nav>

      <div className="concerts-container">
        <h1 className="page-title">Discover Events</h1>
        
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-concerts"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="filter-group">
            <label>City:</label>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-select"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredConcerts.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon"></div>
            <h2>No events found</h2>
            {searchTerm || selectedCity !== 'all' ? (
              <>
                <p>We couldn't find any events matching your search criteria</p>
                <p>Please try again with different search terms or filters.</p>
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </>
            ) : (
              <p>No concerts available at the moment. Please check back later.</p>
            )}
          </div>
        ) : (
          <>
            {(searchTerm || selectedCity !== 'all') && (
              <div className="results-info">
                <p>Showing {filteredConcerts.length} event{filteredConcerts.length !== 1 ? 's' : ''}</p>
                {(searchTerm || selectedCity !== 'all') && (
                  <button className="btn-clear-filters-small" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            
            <div className="concerts-grid">
              {filteredConcerts.map(concert => (
                <div key={concert.id} className="concert-card">
                  <div className="concert-image">
                    <img src={concert.image} alt={concert.name} />
                    <div className="tickets-badge">
                      {concert.availableTickets} tickets available
                    </div>
                  </div>
                  <div className="concert-info">
                    <h3>{concert.name}</h3>
                    <p className="concert-artist">{concert.artist}</p>
                    <div className="concert-details">
                      <p>📅 {new Date(concert.date).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                      <p>🕐 {concert.time}</p>
                      <p>📍 {concert.venue}, {concert.city}</p>
                    </div>
                    {concert.availableTickets > 0 && (
                      <div className="concert-price">
                        <span className="price-label">From</span>
                        <span className="price-value">{concert.priceRange.split(' - ')[0]}</span>
                      </div>
                    )}
                    <button
                      className="btn-view-tickets"
                      onClick={() => navigate('concert-detail', concert)}
                    >
                      View Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}