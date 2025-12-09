import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import ConcertsPage from './pages/ConcertsPage.jsx';
import ConcertDetailPage from './pages/ConcertDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SellTicketPage from './pages/SellTicketPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [userTickets, setUserTickets] = useState({
    bought: [],
    sold: []
  });

  const navigate = (page, concert = null) => {
    setCurrentPage(page);
    if (concert) setSelectedConcert(concert);
  };

  const buyTicket = (ticket) => {
    setUserTickets(prev => ({
      ...prev,
      bought: [...prev.bought, { ...ticket, purchaseDate: new Date().toISOString() }]
    }));
    alert('Ticket purchased successfully!');
  };

  const sellTicket = (ticket) => {
    setUserTickets(prev => ({
      ...prev,
      sold: [...prev.sold, { ...ticket, listingDate: new Date().toISOString() }]
    }));
    alert('Ticket listed for sale successfully!');
    navigate('profile');
  };

  return (
    <div className="app">
      {currentPage === 'home' && <LandingPage navigate={navigate} />}
      {currentPage === 'concerts' && <ConcertsPage navigate={navigate} />}
      {currentPage === 'concert-detail' && (
        <ConcertDetailPage 
          concert={selectedConcert} 
          navigate={navigate}
          buyTicket={buyTicket}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage 
          navigate={navigate}
          userTickets={userTickets}
        />
      )}
      {currentPage === 'sell' && (
        <SellTicketPage 
          navigate={navigate}
          sellTicket={sellTicket}
        />
      )}
    </div>
  );
}

export default App;