# Web3 Integration Complete! 🎉

Your frontend is now ready to connect with your smart contracts. Here's what has been set up:

## What's Been Added

### 1. Web3 Dependencies
- ✅ `ethers.js` installed in frontend
- ✅ Contract ABIs copied to `frontend/blockchain/src/contracts/`

### 2. Web3 Context & Provider
- ✅ `src/context/Web3Context.jsx` - Manages wallet connection and contract instances
- Supports both Ganache (local) and Sepolia (testnet)
- Handles MetaMask connection
- Provides contract instances to all components

### 3. Contract Helper Functions
- ✅ `src/utils/contractHelpers.js` - Ready-to-use functions for:
  - Minting tickets
  - Listing tickets for sale
  - Buying tickets from marketplace
  - Getting ticket info
  - Getting owned tickets
  - And more...

### 4. Wallet Connect Component
- ✅ `src/components/WalletConnect.jsx` - UI component for connecting/disconnecting wallet
- Shows account address
- Shows network name
- Error handling

### 5. App Integration
- ✅ `src/main.jsx` updated with Web3Provider wrapper

## How to Use in Your Components

### Example: Add Wallet Connection to Navigation

```jsx
import WalletConnect from '../components/WalletConnect';

// In your navbar:
<nav className="navbar">
  {/* ... your existing nav items ... */}
  <WalletConnect />
</nav>
```

### Example: Buy Ticket from Event

```jsx
import { useWeb3 } from '../context/Web3Context';
import { mintTicket } from '../utils/contractHelpers';

function BuyTicketButton() {
  const { contracts, account } = useWeb3();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      await mintTicket(
        contracts.eventTicket,
        account,
        "A-101",  // seat number
        "0.1"     // price in ETH
      );
      alert('Ticket purchased!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleBuy} disabled={loading}>
      {loading ? 'Buying...' : 'Buy Ticket'}
    </button>
  );
}
```

### Example: List Ticket for Resale

```jsx
import { useWeb3 } from '../context/Web3Context';
import { approveTicketTransfer, listTicket } from '../utils/contractHelpers';

function SellTicketButton({ tokenId }) {
  const { contracts } = useWeb3();
  const [step, setStep] = useState(1);

  const handleApprove = async () => {
    await approveTicketTransfer(
      contracts.eventTicket,
      contracts.marketplace.target,
      tokenId
    );
    setStep(2);
  };

  const handleList = async (price) => {
    await listTicket(
      contracts.marketplace,
      contracts.eventTicket.target,
      tokenId,
      price
    );
    alert('Listed!');
  };

  return (
    <div>
      {step === 1 && <button onClick={handleApprove}>Approve</button>}
      {step === 2 && <button onClick={() => handleList("0.15")}>List for 0.15 ETH</button>}
    </div>
  );
}
```

### Example: View Your Tickets

```jsx
import { useWeb3 } from '../context/Web3Context';
import { getOwnedTickets } from '../utils/contractHelpers';
import { useEffect, useState } from 'react';

function MyTickets() {
  const { contracts, account } = useWeb3();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (contracts.eventTicket && account) {
      loadTickets();
    }
  }, [contracts, account]);

  const loadTickets = async () => {
    const owned = await getOwnedTickets(contracts.eventTicket, account);
    setTickets(owned);
  };

  return (
    <div>
      {tickets.map(ticket => (
        <div key={ticket.tokenId}>
          <p>Seat: {ticket.seatNumber}</p>
          <p>Event: {ticket.eventName}</p>
        </div>
      ))}
    </div>
  );
}
```

## Quick Testing Setup

### 1. Deploy Contracts
```bash
# Terminal 1 - Start Ganache
npm run ganache

# Terminal 2 - Deploy
truffle migrate --reset
```

### 2. Update Contract Addresses
Edit `frontend/blockchain/src/context/Web3Context.jsx`:
```javascript
const CONTRACTS = {
  ganache: {
    eventTicket: '0xYOUR_ADDRESS_HERE',
    marketplace: '0xYOUR_ADDRESS_HERE',
  },
```

### 3. Setup MetaMask
- Import Ganache account (use private key from Ganache output)
- Add Ganache network:
  - RPC: `http://127.0.0.1:8545`
  - Chain ID: `1337`

### 4. Run Frontend
```bash
cd frontend/blockchain
npm run dev
```

## Available Functions

All functions are in `src/utils/contractHelpers.js`:

### EventTicket Contract
- `mintTicket(contract, toAddress, seatNumber, ticketPrice)` - Buy ticket
- `getTicketInfo(contract, tokenId)` - Get ticket details
- `getEventDetails(contract)` - Get event info (name, date, price, etc.)
- `getOwnedTickets(contract, ownerAddress)` - Get all tickets for an address
- `approveTicketTransfer(contract, marketplaceAddress, tokenId)` - Approve transfer

### TicketMarketplace Contract
- `listTicket(contract, ticketContractAddress, tokenId, priceInEth)` - List for sale
- `buyTicket(contract, listingId)` - Buy from marketplace
- `cancelListing(contract, listingId)` - Cancel your listing
- `getListingDetails(contract, listingId)` - Get listing info
- `getActiveListings(contract)` - Get all active listings
- `getSellerListings(contract, sellerAddress)` - Get listings by seller

### Utility Functions
- `formatAddress(address)` - Format address for display (0x1234...5678)
- `formatPrice(priceInEth)` - Format price nicely
- `parseError(error)` - Get user-friendly error messages

## Next Steps

1. **Add WalletConnect component** to your navigation bars
2. **Integrate contract functions** into your existing buy/sell flows
3. **Replace mock data** with real blockchain data
4. **Test the complete flow**:
   - Connect wallet
   - Buy ticket (mint)
   - View your tickets
   - List ticket for sale (approve + list)
   - Buy from marketplace with different account

## Documentation

- 📖 [FRONTEND_TESTING_GUIDE.md](./FRONTEND_TESTING_GUIDE.md) - Complete manual testing workflow
- 📖 [QUICKSTART.md](./frontend/blockchain/QUICKSTART.md) - Quick setup guide
- 📖 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Original backend testing guide

## Support

Your smart contracts are ready and the frontend infrastructure is in place. Now you just need to:

1. Connect the UI to the blockchain functions
2. Replace the mock data with real blockchain queries
3. Test everything end-to-end!

All the hard work is done - the contracts work, the Web3 setup is complete, and you have helper functions for everything. Just plug them into your UI! 🚀
