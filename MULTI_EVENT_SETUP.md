# Multi-Event Ticket System - Setup Complete

## What Changed

Your ticket marketplace now supports **multiple events**, each with its own dedicated smart contract. This allows tickets to be properly associated with their parent events.

### Before
- Single EventTicket contract for all tickets
- No way to identify which event a ticket belongs to
- All listings showed on every event page

### After
- **6 EventTicket contracts** - one for each mock event:
  1. Jessica Shy | Vingio Parkas
  2. Vaidas Baumila | Žalgirio arena
  3. JUODAS VILNIUS 2026
  4. Kings of Leon | The only show in the region
  5. Andrius Mamontovas: TIK HITAI
  6. punktò ~ KAUNAS
- Tickets are linked to specific events
- Event detail pages show only tickets for that event
- Sell page shows all your tickets with event names

## Quick Start

### 1. Deploy Everything

```bash
# Deploy marketplace
truffle migrate --reset

# Deploy all 6 event contracts and mint sample tickets
truffle exec scripts/deployEventsAndMintTickets.js
```

### 2. Copy Contract Addresses

The script will output addresses like this:

```
========== Deployment Summary ==========
Marketplace: 0xf7256948f5Ed218CBE156c0E02B26d588fa34695

Event Contracts:
1. Jessica Shy | Vingio Parkas
   Address: 0x1234567890abcdef...
```

### 3. Update Frontend

Edit `frontend/blockchain/src/context/Web3Context.jsx`:

```javascript
const CONTRACTS = {
  ganache: {
    marketplace: '0xYOUR_MARKETPLACE_ADDRESS',
    eventTickets: [
      { name: "Jessica Shy | Vingio Parkas", address: "0xADDRESS_1" },
      { name: "Vaidas Baumila | Žalgirio arena", address: "0xADDRESS_2" },
      { name: "JUODAS VILNIUS 2026", address: "0xADDRESS_3" },
      { name: "Kings of Leon | The only show in the region", address: "0xADDRESS_4" },
      { name: "Andrius Mamontovas: TIK HITAI", address: "0xADDRESS_5" },
      { name: "punktò ~ KAUNAS", address: "0xADDRESS_6" }
    ]
  }
};
```

**IMPORTANT**: Event names must match exactly with `ConcertsPage.jsx`!

### 4. Start Frontend

```bash
cd frontend/blockchain
npm run dev
```

## How It Works Now

### Smart Contracts

```
TicketMarketplace (1 instance)
├── Approved: EventTicket[Jessica Shy]
├── Approved: EventTicket[Vaidas Baumila]
├── Approved: EventTicket[JUODAS VILNIUS]
├── Approved: EventTicket[Kings of Leon]
├── Approved: EventTicket[Andrius Mamontovas]
└── Approved: EventTicket[punktò]
```

### Sample Tickets Minted

The deployment script mints sample tickets for each event:
- **Jessica Shy**: 5 tickets (VIP-A-1, VIP-A-2, VIP-B-15, Section-C-23, Section-D-45)
- **Vaidas Baumila**: 4 tickets (Floor-A-12, Floor-A-13, Balcony-B-8, Balcony-C-21)
- **JUODAS VILNIUS**: 6 tickets (GA-001, GA-002, GA-003, VIP-1, VIP-2, VIP-3)
- **Kings of Leon**: 4 tickets (Pit-A-5, Pit-A-6, Section-101-12, Section-102-8)
- **Andrius Mamontovas**: 4 tickets (Row-A-10, Row-A-11, Row-B-15, Row-C-20)
- **punktò**: 3 tickets (Standing-001, Standing-002, Standing-003)

80% go to Account[0], 20% go to Account[1] for testing.

### User Experience

1. **Browse Events** → See all 6 events
2. **Click Event** → See only tickets listed for THAT specific event
3. **Sell Tickets** → See ALL your tickets from ALL events
4. **List Ticket** → Approve → Set Price → List
5. **Buy Ticket** → Purchase appears under the correct event

## Files Modified

### Smart Contracts
- ❌ `contracts/EventTicket.sol` - NO CHANGES (same contract, just multiple deployments)
- ❌ `contracts/TicketMarketplace.sol` - NO CHANGES

### Deployment
- ✅ `migrations/1_deploy_contracts.js` - Simplified to deploy only marketplace
- ✅ `scripts/deployEventsAndMintTickets.js` - **NEW**: Deploys all 6 events + mints tickets
- ✅ `scripts/getDeployedAddresses.js` - **NEW**: Helper to check addresses

### Frontend
- ✅ `src/context/Web3Context.jsx` - Supports array of event contracts
- ✅ `src/utils/contractHelpers.js` - Added `getAllOwnedTickets()`, `getEventListings()`
- ✅ `src/pages/SellTicketPage.jsx` - Shows tickets from all events
- ✅ `src/pages/ConcertDetailPage.jsx` - Filters listings by event

## What You Get

### Before Deployment
```
Account[0]: 0 tickets
Account[1]: 0 tickets
Marketplace: Empty
```

### After Deployment
```
Account[0]: ~21 tickets across 6 events
Account[1]: ~5 tickets across 6 events
Marketplace: Ready to accept listings
All contracts: Approved and ready
```

## Testing Checklist

After deployment:

- [ ] Connect MetaMask to Account[0]
- [ ] Go to "Sell Tickets" - see tickets from multiple events
- [ ] List a ticket from "Jessica Shy" event
- [ ] Go to "Browse Events" → Click "Jessica Shy"
- [ ] See your listing appear
- [ ] Switch to Account[1] in MetaMask
- [ ] Buy the ticket
- [ ] Verify ticket transferred
- [ ] Repeat for other events

## Troubleshooting

### "No tickets found"
- Check Web3Context.jsx has correct addresses
- Verify contracts deployed successfully
- Make sure you're connected to Ganache

### "No tickets listed" on event page
- Verify event names match exactly (including | and special characters)
- Check that tickets are actually listed on marketplace
- Console should show: "Found EventTicket contract for: [event name]"

### "Missing revert data"
- Contracts not approved on marketplace
- Re-run deployEventsAndMintTickets.js (it auto-approves)

## Development Tips

### View Contract State
```bash
truffle console
```

```javascript
const marketplace = await TicketMarketplace.deployed()
const counter = await marketplace.listingCounter()
console.log("Total listings:", counter.toString())
```

### Mint More Tickets
You can run the mint script multiple times or modify it to add more seats.

### Add New Events
1. Add to `deployEventsAndMintTickets.js` events array
2. Add to `ConcertsPage.jsx` MOCK_CONCERTS
3. Re-run deployment
4. Update Web3Context.jsx

## Architecture Diagram

```
Frontend
  ├── ConcertsPage (shows all 6 events)
  ├── ConcertDetailPage (filters listings by event contract)
  └── SellTicketPage (shows tickets from all contracts)
       │
       ▼
  Web3Context (manages all 6 event contracts + marketplace)
       │
       ▼
  Contract Helpers (getAllOwnedTickets, getEventListings, etc.)
       │
       ▼
Blockchain
  ├── TicketMarketplace
  ├── EventTicket[Jessica Shy]
  ├── EventTicket[Vaidas Baumila]
  ├── EventTicket[JUODAS VILNIUS]
  ├── EventTicket[Kings of Leon]
  ├── EventTicket[Andrius Mamontovas]
  └── EventTicket[punktò]
```

## Summary

You now have a fully functional multi-event ticket marketplace where:
- Each event has its own smart contract
- Tickets are properly linked to events
- Users can buy/sell tickets for specific events
- The marketplace handles all events seamlessly

Just run the deployment script, update the addresses, and you're ready to go! 🎉
