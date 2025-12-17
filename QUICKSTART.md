# Quick Start Guide - Multi-Event Ticket Marketplace

## What This Does

Sets up a ticket resale marketplace with 6 different events, each with pre-minted sample tickets ready to list and sell.

## Prerequisites

- ✅ Ganache running on `http://127.0.0.1:7545`
- ✅ MetaMask installed and configured with Ganache network
- ✅ At least 2 Ganache accounts imported to MetaMask

## 3-Step Setup

### Step 1: Deploy Contracts (2 commands)

```bash
# Deploy marketplace
truffle migrate --reset

# Deploy 6 events + mint 26 sample tickets
truffle exec scripts/deployEventsAndMintTickets.js
```

**Expected output:**
```
✓ Contract deployed at: 0x...
✓ Approved on marketplace
✓ Minted X tickets

========== Copy This to Web3Context.jsx ==========
const CONTRACTS = {
  ganache: {
    marketplace: '0x...',
    eventTickets: [
      { name: "Jessica Shy | Vingio Parkas", address: "0x..." },
      ...
    ]
  }
}
```

### Step 2: Update Frontend

1. Open `frontend/blockchain/src/context/Web3Context.jsx`
2. Find the `CONTRACTS` constant (around line 10)
3. **Replace it entirely** with the code block from Step 1's output
4. Save the file

### Step 3: Start Frontend

```bash
cd frontend/blockchain
npm run dev
```

## You're Done! 🎉

Now you can:

1. **Connect MetaMask** - Click "Connect Wallet" button
2. **View Your Tickets** - Go to "Sell Tickets" to see your 21 tickets
3. **List a Ticket**:
   - Select a ticket
   - Click "Approve Transfer"
   - Set a price (e.g., 0.15)
   - Click "List for Sale"
4. **Browse Events** - Go to "Browse Events"
5. **View Listings** - Click on the event where you listed a ticket
6. **Buy a Ticket** - Switch MetaMask accounts and purchase

## What Gets Deployed

| Event | Tickets Minted | Seat Examples |
|-------|----------------|---------------|
| Jessica Shy | 5 | VIP-A-1, VIP-A-2, Section-C-23 |
| Vaidas Baumila | 4 | Floor-A-12, Balcony-B-8 |
| JUODAS VILNIUS | 6 | GA-001, VIP-1, VIP-2 |
| Kings of Leon | 4 | Pit-A-5, Section-101-12 |
| Andrius Mamontovas | 4 | Row-A-10, Row-B-15 |
| punktò | 3 | Standing-001, Standing-002 |

**Total: 26 tickets** (21 to Account[0], 5 to Account[1])

## Troubleshooting

### "Could not decode result data"
→ You forgot Step 2. Update Web3Context.jsx with the new addresses.

### "No tickets found"
→ Make sure you're connected to Ganache account[0] which has the tickets.

### "No tickets listed" on event page
→ List some tickets first from the "Sell Tickets" page.

### Script fails
→ Make sure Ganache is running and `truffle migrate --reset` completed successfully.

## Reset Everything

If something goes wrong:

```bash
# In Ganache: Restart workspace (or restart Ganache CLI)

# Then re-run:
truffle migrate --reset
truffle exec scripts/deployEventsAndMintTickets.js

# Update Web3Context.jsx with new addresses
# Restart frontend
```

## Full Documentation

- [MULTI_EVENT_SETUP.md](./MULTI_EVENT_SETUP.md) - Detailed explanation of changes
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide

---

**Need help?** Check the console logs - they'll tell you exactly what went wrong.
