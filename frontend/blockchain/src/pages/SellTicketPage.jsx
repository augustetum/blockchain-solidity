import { useState } from 'react';
import '../styles/SellTicketPage.css';

export default function SellTicketPage({ navigate, sellTicket }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    city: '',
    section: '',
    row: '',
    seat: '',
    price: '',
    quantity: '1'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (Object.values(formData).some(value => value === '')) {
      alert('Please fill in all fields');
      return;
    }

    sellTicket(formData);
  };

  return (
    <div className="sell-ticket-page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>T</span>
          </div>
          <span className="logo-text">ticketswell</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('concerts'); }}>Browse Events</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Profile</a>
        </div>
      </nav>

      <div className="sell-container">
        <div className="sell-header">
          <h1>Sell Your Tickets</h1>
          <p>List your tickets safely and reach millions of buyers</p>
        </div>

        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Event Details</h2>
            
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g., Free Finga | Žalgirio Arena"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Venue *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Kalnų parkas"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Kaunas"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Ticket Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Section *</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., VIP zona"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Row *</label>
                <input
                  type="text"
                  name="row"
                  value={formData.row}
                  onChange={handleChange}
                  placeholder="e.g., M"
                  required
                />
              </div>

              <div className="form-group">
                <label>Seat *</label>
                <input
                  type="text"
                  name="seat"
                  value={formData.seat}
                  onChange={handleChange}
                  placeholder="e.g., 34"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="150"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('profile')}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              List Ticket for Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}