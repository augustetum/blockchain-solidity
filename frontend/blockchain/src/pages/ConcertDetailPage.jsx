import { useState } from 'react';
import '../styles/ConcertDetailPage.css';

export default function ConcertDetailPage({ concert, navigate, buyTicket }) {
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock available tickets
  const availableTickets = [
    { id: 1, section: 'VIP', row: '15', seat: '12', price: 250, seller: 'Gustė Mikalauskaitė' },
    { id: 2, section: 'Fanų zona. Stovima', row: '57', seat: '34', price: 150, seller: 'Auksė Matelė' },
    { id: 3, section: 'Fanų zona. Stovima', row: '65', seat: '28', price: 145, seller: 'Lina Rimvydienė' },
    { id: 4, section: '111 Ramirent Premium klubas', row: '7', seat: '56', price: 85, seller: 'Ema Senkauskaitė' },
    { id: 5, section: 'VIP', row: '85', seat: '8', price: 240, seller: 'Lukas Krasauskas' },
    { id: 6, section: '121 Audi klubas', row: '88', seat: '42', price: 120, seller: 'Linas Žemaitis' },
  ];

  const handleBuyTicket = (ticket) => {
    const ticketData = {
      ...ticket,
      concertName: concert.name,
      concertDate: concert.date,
      concertVenue: concert.venue,
      concertCity: concert.city,
      concertImage: concert.image
    };
    buyTicket(ticketData);
  };

  return (
    <div className="concert-detail-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswell</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('concerts'); }}>Back to Events</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Profile</a>
        </div>
      </nav>

      <div className="concert-detail-container">
        <button className="btn-back" onClick={() => navigate('concerts')}>
          ← Back to all events
        </button>

        <div className="concert-header">
          <div className="concert-header-image">
            <img src={concert.image} alt={concert.name} />
          </div>
          <div className="concert-header-info">
            <h1>{concert.name}</h1>
            <h2>{concert.artist}</h2>
            <div className="concert-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>{new Date(concert.date).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🕐</span>
                <span>{concert.time}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{concert.venue}, {concert.city}</span>
              </div>
            </div>
            <div className="price-info">
              <span className="price-range">Price Range: {concert.priceRange}</span>
              <span className="available-count">{concert.availableTickets} tickets available</span>
            </div>
          </div>
        </div>

        <div className="tickets-section">
          <h2>Available Tickets</h2>
          <div className="tickets-list">
            {availableTickets.map(ticket => (
              <div 
                key={ticket.id} 
                className={`ticket-item ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-info">
                  <div className="ticket-section">
                    <strong>{ticket.section}</strong>
                    <span className="ticket-location">Row {ticket.row}, Seat {ticket.seat}</span>
                  </div>
                  <div className="ticket-seller">
                    Seller: {ticket.seller}
                  </div>
                </div>
                <div className="ticket-price-action">
                  <div className="ticket-price">
                    ${ticket.price}
                  </div>
                  <button 
                    className="btn-buy"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyTicket(ticket);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}