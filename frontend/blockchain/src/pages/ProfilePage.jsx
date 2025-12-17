import { useState, useEffect } from 'react';
import '../styles/ProfilePage.css';
import { useWeb3 } from '../context/Web3Context';
import { getAllOwnedTickets, getSellerListings, formatAddress, cancelListing, parseError } from '../utils/contractHelpers';
import WalletConnect from '../components/WalletConnect';

export default function ProfilePage({ navigate }) {
  const { contracts, account, isConnected } = useWeb3();
  const [ownedTickets, setOwnedTickets] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [totalListingsCreated, setTotalListingsCreated] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contracts.marketplace && contracts.eventTickets && contracts.eventTickets.length > 0 && account) {
      loadUserData();
    }
  }, [contracts, account]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Get owned tickets (purchased)
      const tickets = await getAllOwnedTickets(contracts.eventTickets, account);

      // Get all seller listings (both active and inactive)
      const allListings = await getSellerListings(contracts.marketplace, account);

      // Filter active listings
      const active = allListings.filter(listing => listing.active);
      setActiveListings(active);

      // Create a Set of actively listed ticket keys
      const listedKeys = new Set(
        active.map(listing => `${listing.ticketContract.toLowerCase()}-${listing.tokenId}`)
      );

      // Filter out tickets that are currently listed for sale
      const ownedNotListed = tickets.filter(ticket => {
        const ticketKey = `${ticket.contractAddress.toLowerCase()}-${ticket.tokenId}`;
        return !listedKeys.has(ticketKey);
      });

      setOwnedTickets(ownedNotListed);

      // Total count includes both active and sold/cancelled
      setTotalListingsCreated(allListings.length);

    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to cancel this listing?')) {
      return;
    }

    try {
      setLoading(true);
      await cancelListing(contracts.marketplace, listingId);
      alert('✅ Listing cancelled successfully!');

      // Reload data
      await loadUserData();
    } catch (err) {
      console.error('Error cancelling listing:', err);
      alert('Error: ' + parseError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="profile-page">
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
            <WalletConnect />
          </div>
        </nav>

        <div className="profile-container">
          <div className="connect-prompt" style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#f5f5f5',
            borderRadius: '12px',
            margin: '40px auto',
            maxWidth: '500px'
          }}>
            <h2>Connect Your Wallet</h2>
            <p style={{ marginBottom: '20px' }}>Please connect your wallet to view your profile</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
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
          <WalletConnect />
          <button className="btn-primary" onClick={() => navigate('sell')}>
            Sell Tickets
          </button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{account ? account[2].toUpperCase() : 'U'}</span>
          </div>
          <div className="profile-info">
            <h1>Your Profile</h1>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#666' }}>
              {formatAddress(account)}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{ownedTickets.length}</h3>
            <p>Tickets Owned</p>
          </div>
          <div className="stat-card">
            <h3>{activeListings.length}</h3>
            <p>Active Listings</p>
          </div>
          <div className="stat-card">
            <h3>{totalListingsCreated}</h3>
            <p>Total Listed</p>
          </div>
        </div>

        <div className="tickets-sections">
          <div className="tickets-section">
            <h2>My Owned Tickets</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading your tickets...
              </div>
            ) : ownedTickets.length === 0 ? (
              <div className="empty-state">
                <p>You don't own any tickets yet</p>
                <button className="btn-browse" onClick={() => navigate('concerts')}>
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {ownedTickets.map((ticket) => (
                  <div key={`${ticket.contractAddress}-${ticket.tokenId}`} className="ticket-card">
                    <div className="ticket-card-info">
                      <h3>{ticket.eventName}</h3>
                      <p className="ticket-date">
                        📅 {new Date(ticket.eventDate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="ticket-details">
                        <span>🎫 {ticket.seatNumber}</span>
                        <span className="ticket-id">Token #{ticket.tokenId}</span>
                      </div>
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>
                        From: {ticket.eventContractName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tickets-section">
            <h2>Currently Listed for Sale</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading your listings...
              </div>
            ) : activeListings.length === 0 ? (
              <div className="empty-state">
                <p>You haven't listed any tickets for sale</p>
                <button className="btn-browse" onClick={() => navigate('sell')}>
                  Sell Tickets
                </button>
              </div>
            ) : (
              <div className="tickets-grid">
                {activeListings.map((listing) => (
                  <div key={listing.listingId} className="ticket-card">
                    <div className="ticket-card-info">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Listing #{listing.listingId}</h3>
                        <span className="status-badge" style={{
                          background: '#4CAF50',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          Active
                        </span>
                      </div>
                      <div className="ticket-details" style={{ marginTop: '12px' }}>
                        <span>🎫 Token #{listing.tokenId}</span>
                      </div>
                      <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '6px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '14px' }}>Price:</span>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#22d3ee' }}>
                            {listing.price} ETH
                          </span>
                        </div>
                      </div>
                      <p style={{
                        fontSize: '11px',
                        marginTop: '8px',
                        fontFamily: 'monospace'
                      }}>
                        Contract: {formatAddress(listing.ticketContract)}
                      </p>
                      <button
                        onClick={() => handleCancelListing(listing.listingId)}
                        disabled={loading}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '10px',
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          opacity: loading ? 0.6 : 1,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.background = '#cc0000')}
                        onMouseLeave={(e) => !loading && (e.target.style.background = '#ff4444')}
                      >
                        {loading ? 'Processing...' : 'Cancel Listing'}
                      </button>
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