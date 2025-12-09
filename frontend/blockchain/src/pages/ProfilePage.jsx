import '../styles/ProfilePage.css';

export default function ProfilePage({ navigate, userTickets }) {
  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswap</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('concerts'); }}>Browse Events</a>
          <button className="btn-primary" onClick={() => navigate('sell')}>
            Sell Tickets
          </button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>U</span>
          </div>
          <div className="profile-info">
            <h1>User Profile</h1>
            <p>Member since December 2025</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{userTickets.bought.length}</h3>
            <p>Tickets Purchased</p>
          </div>
          <div className="stat-card">
            <h3>{userTickets.sold.length}</h3>
            <p>Tickets Listed</p>
          </div>
        </div>

        <div className="tickets-sections">
          <div className="tickets-section">
            <h2>My Purchased Tickets</h2>
            {userTickets.bought.length === 0 ? (
              <div className="empty-state">
                <p>You haven't purchased any tickets yet</p>
                <button className="btn-browse" onClick={() => navigate('concerts')}>
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {userTickets.bought.map((ticket, index) => (
                  <div key={index} className="ticket-card">
                    <div className="ticket-card-image">
                      <img src={ticket.concertImage} alt={ticket.concertName} />
                    </div>
                    <div className="ticket-card-info">
                      <h3>{ticket.concertName}</h3>
                      <p className="ticket-venue">{ticket.concertVenue}, {ticket.concertCity}</p>
                      <p className="ticket-date">{new Date(ticket.concertDate).toLocaleDateString('en-GB')}</p>
                      <div className="ticket-details">
                        <span>{ticket.section} - Row {ticket.row}, Seat {ticket.seat}</span>
                        <span className="ticket-price">${ticket.price}</span>
                      </div>
                      <p className="purchase-date">
                        Purchased: {new Date(ticket.purchaseDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tickets-section">
            <h2>My Listed Tickets</h2>
            {userTickets.sold.length === 0 ? (
              <div className="empty-state">
                <p>You haven't listed any tickets for sale</p>
                <button className="btn-browse" onClick={() => navigate('sell')}>
                  Sell Tickets
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {userTickets.sold.map((ticket, index) => (
                  <div key={index} className="ticket-card">
                    <div className="ticket-card-info">
                      <h3>{ticket.eventName}</h3>
                      <p className="ticket-venue">{ticket.venue}, {ticket.city}</p>
                      <p className="ticket-date">{new Date(ticket.eventDate).toLocaleDateString('en-GB')}</p>
                      <div className="ticket-details">
                        <span>{ticket.section} - Row {ticket.row}, Seat {ticket.seat}</span>
                        <span className="ticket-price">${ticket.price}</span>
                      </div>
                      <p className="listing-date">
                        Listed: {new Date(ticket.listingDate).toLocaleDateString('en-GB')}
                      </p>
                      <span className="status-badge">Listed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}