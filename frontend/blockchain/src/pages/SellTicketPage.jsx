import { useState, useEffect } from 'react';
import '../styles/SellTicketPage.css';
import { useWeb3 } from '../context/Web3Context';
import { getAllOwnedTickets, approveTicketTransfer, listTicket, parseError, getSellerListings } from '../utils/contractHelpers';
import WalletConnect from '../components/WalletConnect';

export default function SellTicketPage({ navigate }) {
  const { contracts, account, isConnected } = useWeb3();
  const [ownedTickets, setOwnedTickets] = useState([]);
  const [listedTokenIds, setListedTokenIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [listingPrice, setListingPrice] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contracts.eventTickets && contracts.eventTickets.length > 0 && contracts.marketplace && account) {
      loadOwnedTickets();
      loadListedTickets();
    }
  }, [contracts, account]);

  const loadOwnedTickets = async () => {
    setLoading(true);
    try {
      const tickets = await getAllOwnedTickets(contracts.eventTickets, account);
      setOwnedTickets(tickets);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadListedTickets = async () => {
    try {
      const listings = await getSellerListings(contracts.marketplace, account);
      // Create a Set of "contractAddress-tokenId" strings for active listings
      const listedIds = new Set(
        listings
          .filter(listing => listing.active)
          .map(listing => `${listing.ticketContract.toLowerCase()}-${listing.tokenId}`)
      );
      setListedTokenIds(listedIds);
    } catch (err) {
      console.error('Error loading listings:', err);
    }
  };

  const handleApprove = async () => {
    if (!selectedTicket) return;

    setIsApproving(true);
    setError(null);

    try {
      // Find the contract for this ticket
      const eventTicket = contracts.eventTickets.find(
        et => et.address.toLowerCase() === selectedTicket.contractAddress.toLowerCase()
      );

      if (!eventTicket) {
        throw new Error('Event ticket contract not found');
      }

      await approveTicketTransfer(
        eventTicket.contract,
        contracts.marketplace.target || contracts.marketplace.address,
        selectedTicket.tokenId
      );
      alert('✅ Ticket approved! Now set your price and list it.');
    } catch (err) {
      console.error('Error approving:', err);
      setError(parseError(err));
      alert('Error: ' + parseError(err));
    } finally {
      setIsApproving(false);
    }
  };

  const handleList = async () => {
    if (!selectedTicket || !listingPrice) {
      alert('Please enter a price');
      return;
    }

    setIsListing(true);
    setError(null);

    try {
      const result = await listTicket(
        contracts.marketplace,
        selectedTicket.contractAddress,
        selectedTicket.tokenId,
        listingPrice
      );

      alert(`🎉 Ticket listed successfully! Listing ID: ${result.listingId}`);

      // Reset and reload
      setSelectedTicket(null);
      setListingPrice('');
      await loadOwnedTickets();
      await loadListedTickets();

    } catch (err) {
      console.error('Error listing:', err);
      setError(parseError(err));
      alert('Error: ' + parseError(err));
    } finally {
      setIsListing(false);
    }
  };

  if (!isConnected) {
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
            <WalletConnect />
          </div>
        </nav>

        <div className="sell-container">
          <div className="connect-prompt">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to see your tickets</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

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
          <WalletConnect />
        </div>
      </nav>

      <div className="sell-container">
        <div className="sell-header">
          <h1>Sell Your Tickets</h1>
          <p>List your tickets for resale on the marketplace</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading your tickets...</div>
        ) : ownedTickets.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No Tickets Found</h3>
            <p>You don't own any tickets yet. Buy some tickets first!</p>
            <button className="btn-primary" onClick={() => navigate('concerts')}>
              Browse Events
            </button>
          </div>
        ) : !selectedTicket ? (
          <div>
            <h2>Select a Ticket to Sell</h2>
            <div className="tickets-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {ownedTickets.map((ticket) => {
                const listingKey = `${ticket.contractAddress.toLowerCase()}-${ticket.tokenId}`;
                const isListed = listedTokenIds.has(listingKey);
                return (
                  <div
                    key={`${ticket.contractAddress}-${ticket.tokenId}`}
                    className="ticket-card"
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      cursor: isListed ? 'default' : 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      opacity: isListed ? 0.7 : 1,
                      position: 'relative'
                    }}
                    onClick={() => !isListed && setSelectedTicket(ticket)}
                    onMouseEnter={(e) => {
                      if (!isListed) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isListed && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#4CAF50',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Listed
                      </div>
                    )}
                    <h3>{ticket.eventName}</h3>
                    <p><strong>Date:</strong> {ticket.eventDate}</p>
                    <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                    <p><strong>Token ID:</strong> #{ticket.tokenId}</p>
                    <button
                      className="btn-primary"
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        opacity: isListed ? 0.5 : 1,
                        cursor: isListed ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isListed}
                    >
                      {isListed ? 'Already Listed' : 'Select to Sell'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="listing-form">
            <button
              onClick={() => setSelectedTicket(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              ← Back to tickets
            </button>

            <div className="selected-ticket-info" style={{
              background: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#333', marginTop: 0 }}>Selected Ticket</h3>
              <p style={{ color: '#333' }}><strong>Event:</strong> {selectedTicket.eventName}</p>
              <p style={{ color: '#333' }}><strong>Date:</strong> {selectedTicket.eventDate}</p>
              <p style={{ color: '#333' }}><strong>Seat:</strong> {selectedTicket.seatNumber}</p>
              <p style={{ color: '#333' }}><strong>Token ID:</strong> #{selectedTicket.tokenId}</p>
            </div>

            <div className="form-section">
              <h2>Step 1: Approve Marketplace</h2>
              <p>Allow the marketplace to transfer your ticket when it's sold</p>
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="btn-primary"
                style={{ marginTop: '10px' }}
              >
                {isApproving ? 'Approving...' : 'Approve Transfer'}
              </button>
            </div>

            <div className="form-section" style={{ marginTop: '30px' }}>
              <h2>Step 2: Set Price & List</h2>
              <div className="form-group">
                <label>Price (ETH) *</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.15"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  disabled={isListing}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    marginTop: '8px'
                  }}
                />
              </div>
              <button
                onClick={handleList}
                disabled={isListing || !listingPrice}
                className="btn-submit"
                style={{ marginTop: '15px' }}
              >
                {isListing ? 'Listing...' : 'List for Sale'}
              </button>
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
        )}
      </div>
    </div>
  );
}
