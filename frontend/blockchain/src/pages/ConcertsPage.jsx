import { useState } from 'react';
import '../styles/ConcertsPage.css';

const MOCK_CONCERTS = [
  {
    id: 1,
    name: 'Jessica Shy | Vingio Parkas',
    artist: 'Jessica Shy',
    date: '2025-08-29',
    time: '19:00',
    venue: 'Vingio Parkas',
    city: 'Vilnius',
    image: 'https://www.lrt.lt/img/2025/10/06/2204045-160221-1287x836.jpg',
    availableTickets: 45,
    priceRange: '85€ - 250€'
  },
  {
    id: 2,
    name: 'Vaidas Baumila | Žalgirio arena',
    artist: 'Vaidas Baumila',
    date: '2025-12-28',
    time: '20:00',
    venue: 'Žalgirio Arena',
    city: 'Kaunas',
    image: 'https://store.bilietai.lt/public/image/type/concertsListItem/id/480639/filename/1763373571_baumilakza2025.jpg',
    availableTickets: 128,
    priceRange: '39€-66.89€'
  },
  {
    id: 3,
    name: 'JUODAS VILNIUS 2026',
    artist: 'Solo Ansamblis, BA.',
    date: '2026-06-13',
    time: '17:30',
    venue: 'Kalnų parkas',
    city: 'Vilnius',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/3fb01c21e8984af24585a92a8df6a2f2.webp',
    availableTickets: 245,
    priceRange: '50€'
  },
  {
    id: 4,
    name: 'Kings of Leon | The only show in the region',
    artist: 'Kings of Leon',
    date: '2026-06-14',
    time: '21:00',
    venue: 'Unibet Arena Kvartal',
    city: 'Tallinn',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/3e98816a651b563bfe992ae4e174aa17.webp',
    availableTickets: 112,
    priceRange: '87.10€'
  },
  {
    id: 5,
    name: 'Andrius Mamontovas: TIK HITAI',
    artist: 'Andrius Mamontovas',
    date: '2026-03-20',
    time: '20:00',
    venue: 'Kalnapilio Arena',
    city: 'Panevėžys',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/b77de0ca6bea71344abc3b53d1a635e8.webp',
    availableTickets: 112,
    priceRange: '29€'
  },
  {
    id: 6,
    name: 'punktò ~ KAUNAS',
    artist: 'punktò',
    date: '2025-12-12',
    time: '19:00',
    venue: 'Erdvė',
    city: 'Kaunas',
    image: 'https://www.bilietai.lt/imageGenerator/eventDetails/5c32df58e78d20fd893ac5562df3dab1.webp',
    availableTickets: 94,
    priceRange: '20€'
  }
];

export default function ConcertsPage({ navigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = ['all', ...new Set(MOCK_CONCERTS.map(c => c.city))];

  const filteredConcerts = MOCK_CONCERTS.filter(concert => {
    const matchesSearch = concert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concert.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || concert.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="concerts-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswap</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Profile</a>
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
                <div className="concert-price">
                  <span className="price-label">From</span>
                  <span className="price-value">{concert.priceRange.split(' - ')[0]}</span>
                </div>
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

        {filteredConcerts.length === 0 && (
          <div className="no-results">
            <p>No concerts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}