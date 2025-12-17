# Multi-Event Ticket Marketplace Deployment Guide

This guide will help you deploy multiple EventTicket contracts (one per event) and set up the frontend to work with them.

## Overview

The system now supports multiple events, each with its own EventTicket contract:
- Jessica Shy | Vingio Parkas
- Vaidas Baumila | Žalgirio arena
- JUODAS VILNIUS 2026
- Kings of Leon | The only show in the region
- Andrius Mamontovas: TIK HITAI
- punktò ~ KAUNAS

## Step 1: Ensure Ganache is Running

Make sure your Ganache blockchain is running on `http://127.0.0.1:7545` (or your configured port).

```bash
# If using Ganache CLI
ganache-cli -p 7545
```

## Step 2: Deploy Marketplace

First, deploy just the TicketMarketplace contract:

```bash
truffle migrate --reset
```

This will deploy the marketplace contract. Note the deployed address.

## Step 3: Deploy Events and Mint Sample Tickets

Run the comprehensive deployment script that will:
1. Deploy 6 EventTicket contracts (one per event)
2. Approve each contract on the marketplace
3. Mint sample tickets for each event

```bash
truffle exec scripts/deployEventsAndMintTickets.js
```

**IMPORTANT**: Save the output! You'll see something like:

```
========== Deployment Summary ==========
Total Events: 6
Marketplace: 0xf7256948f5Ed218CBE156c0E02B26d588fa34695

Event Contracts:

1. Jessica Shy | Vingio Parkas
   Address: 0x1234...
   Tickets Minted: 5

2. Vaidas Baumila | Žalgirio arena
   Address: 0x5678...
   Tickets Minted: 4

... etc
```

## Step 4: Update Frontend Configuration

Open `frontend/blockchain/src/context/Web3Context.jsx` and update the `CONTRACTS` object:

```javascript
const CONTRACTS = {
  ganache: {
    marketplace: '0xf7256948f5Ed218CBE156c0E02B26d588fa34695', // From deployment
    eventTickets: [
      { name: "Jessica Shy | Vingio Parkas", address: "0x..." },
      { name: "Vaidas Baumila | Žalgirio arena", address: "0x..." },
      { name: "JUODAS VILNIUS 2026", address: "0x..." },
      { name: "Kings of Leon | The only show in the region", address: "0x..." },
      { name: "Andrius Mamontovas: TIK HITAI", address: "0x..." },
      { name: "punktò ~ KAUNAS", address: "0x..." }
    ]
  },
  sepolia: {
    marketplace: null,
    eventTickets: []
  }
};
```

**CRITICAL**: The `name` field MUST match exactly with the event names in `ConcertsPage.jsx` for the filtering to work correctly.

## Step 5: Start the Frontend

```bash
cd frontend/blockchain
npm run dev
```

## How It Works

### Architecture

1. **Multiple Event Contracts**: Each event has its own ERC721 contract
2. **Single Marketplace**: All events share the same marketplace contract
3. **Event Matching**: Listings are filtered by comparing ticket contract addresses

### User Flow

1. **Connect Wallet**: Users connect MetaMask to see their tickets
2. **View Events**: Browse events in the "Browse Events" page
3. **View Listings**: Click on an event to see tickets listed for that specific event
4. **Sell Tickets**:
   - Go to "Sell Tickets" page
   - See all owned tickets across all events
   - Tickets show which event they belong to
   - Select a ticket, approve it, set price, and list
5. **Buy Tickets**:
   - Go to event detail page
   - See only tickets for that specific event
   - Purchase available tickets

### Key Features

- Tickets are grouped by their parent event
- Each event shows only its own marketplace listings
- Users can own tickets from multiple events
- All tickets can be managed from a single "Sell Tickets" page

## Testing

### Test the Full Flow

1. Connect wallet with the first Ganache account (has most tickets)
2. Go to "Sell Tickets" - you should see tickets from multiple events
3. List a few tickets for sale
4. Switch to second Ganache account in MetaMask
5. Go to "Browse Events"
6. Click on an event where you listed tickets
7. You should see your listings
8. Purchase a ticket

## Troubleshooting

### "No tickets listed" on event page
- Verify the event name in Web3Context.jsx exactly matches the name in ConcertsPage.jsx
- Check that tickets have been minted for that event
- Ensure tickets are actually listed on the marketplace

### "Could not decode result data"
- Contract addresses are wrong or outdated
- Re-run deployment and update Web3Context.jsx

### Tickets don't appear in "Sell Tickets"
- Make sure `eventTickets` array in Web3Context.jsx is populated
- Verify contracts are approved on marketplace
- Check that wallet actually owns tickets

### MetaMask shows wrong network
- Ensure you're connected to Ganache (localhost:7545)
- Chain ID should be 1337 or 5777

## Advanced: Adding More Events

To add more events:

1. Add event details to the `events` array in `scripts/deployEventsAndMintTickets.js`
2. Add matching event data to `MOCK_CONCERTS` in `frontend/blockchain/src/pages/ConcertsPage.jsx`
3. Re-run deployment script
4. Update `Web3Context.jsx` with new contract addresses

## Smart Contract Details

### EventTicket.sol
- ERC721 NFT representing event tickets
- Each contract represents one specific event
- Stores: event name, date, seat numbers
- Owner can mint tickets

### TicketMarketplace.sol
- Manages resale of tickets from any approved EventTicket contract
- Supports listing, buying, and cancelling
- Takes 2.5% platform fee
- Only approved contracts can be listed

## Files Modified

- `migrations/1_deploy_contracts.js` - Simplified to deploy only marketplace
- `scripts/deployEventsAndMintTickets.js` - NEW: Deploys all events and mints tickets
- `frontend/blockchain/src/context/Web3Context.jsx` - Updated to support multiple contracts
- `frontend/blockchain/src/utils/contractHelpers.js` - Added multi-contract helpers
- `frontend/blockchain/src/pages/SellTicketPage.jsx` - Updated to show tickets from all events
- `frontend/blockchain/src/pages/ConcertDetailPage.jsx` - Updated to filter by event

## Next Steps

After successful deployment:
1. Test buying and selling tickets
2. Verify events show correct listings
3. Test with multiple MetaMask accounts
4. Consider deploying to testnet (Sepolia)
