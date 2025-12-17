import { useState, useEffect } from 'react';
import '../styles/ConcertDetailPage.css';
import { useWeb3 } from '../context/Web3Context';
import { parseError, getEventListings, buyTicket as buyFromMarketplace, formatAddress } from '../utils/contractHelpers';
import WalletConnect from '../components/WalletConnect';

export default function ConcertDetailPage({ concert, navigate, buyTicket }) {
  const { contracts, account, isConnected } = useWeb3();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [buyingListingId, setBuyingListingId] = useState(null);
  const [error, setError] = useState(null);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contracts.marketplace && contracts.eventTickets && contracts.eventTickets.length > 0 && concert) {
      loadMarketplaceListings();
    }
  }, [contracts, concert]);

  const loadMarketplaceListings = async () => {
    setLoading(true);
    try {
      // Find the event ticket contract that matches this concert
      const eventTicket = contracts.eventTickets.find(
        et => et.name === concert.name
      );

      if (!eventTicket) {
        console.log('No event ticket contract found for:', concert.name);
        setMarketplaceListings([]);
        setLoading(false);
        return;
      }

      // Get listings for this specific event
      const listings = await getEventListings(
        contracts.marketplace,
        eventTicket.contract,
        eventTicket.address
      );

      setMarketplaceListings(listings);
    } catch (err) {
      console.error('Error loading marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyFromMarketplace = async (listing) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (listing.seller.toLowerCase() === account?.toLowerCase()) {
      alert('You cannot buy your own listing!');
      return;
    }

    setBuyingListingId(listing.listingId);
    setError(null);

    try {
      console.log('Buying from marketplace:', listing);

      const receipt = await buyFromMarketplace(contracts.marketplace, listing.listingId);

      console.log('Ticket purchased successfully!', receipt);

      alert('🎉 Ticket purchased successfully! The ticket is now yours.');

      // Reload listings
      await loadMarketplaceListings();

    } catch (err) {
      console.error('Error buying ticket:', err);
      const errorMsg = parseError(err);
      setError(errorMsg);
      alert('Error purchasing ticket: ' + errorMsg);
    } finally {
      setBuyingListingId(null);
    }
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
          <WalletConnect />
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
          </div>
        </div>

        <div className="tickets-section">
          <h2>Available Tickets on Marketplace</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              Loading marketplace tickets...
            </div>
          ) : marketplaceListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '8px' }}>
              <h3 style={{ color: '#333' }}>No Tickets Listed</h3>
              <p style={{ color: '#666' }}>There are currently no tickets available for resale on the marketplace.</p>
              <p style={{ color: '#666' }}>Check back later or list your own tickets!</p>
            </div>
          ) : (
            <div className="tickets-list">
              {marketplaceListings.map(listing => (
                <div
                  key={listing.listingId}
                  className={`ticket-item ${selectedTicket?.listingId === listing.listingId ? 'selected' : ''}`}
                  onClick={() => setSelectedTicket(listing)}
                >
                  <div className="ticket-info">
                    <div className="ticket-section">
                      <strong>{listing.seatNumber || `Token #${listing.tokenId}`}</strong>
                      <span className="ticket-location">Listing ID: {listing.listingId}</span>
                    </div>
                    <div className="ticket-seller">
                      Seller: {formatAddress(listing.seller)}
                      {listing.seller.toLowerCase() === account?.toLowerCase() && (
                        <span style={{
                          marginLeft: '8px',
                          color: '#4CAF50',
                          fontWeight: 'bold'
                        }}>
                          (You)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ticket-price-action">
                    <div className="ticket-price">
                      {listing.price} ETH
                    </div>
                    <button
                      className="btn-buy"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyFromMarketplace(listing);
                      }}
                      disabled={
                        buyingListingId === listing.listingId ||
                        !isConnected ||
                        listing.seller.toLowerCase() === account?.toLowerCase()
                      }
                    >
                      {buyingListingId === listing.listingId
                        ? 'Processing...'
                        : !isConnected
                        ? 'Connect Wallet'
                        : listing.seller.toLowerCase() === account?.toLowerCase()
                        ? 'Your Listing'
                        : 'Buy Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c33'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
