# Frontend Manual Testing Guide

This guide will help you connect your React frontend to your smart contracts and test the ticket marketplace functionality manually.

## Prerequisites

- MetaMask browser extension installed
- Node.js and npm installed
- Contracts compiled

## Setup Steps

### 1. Start Ganache (Local Blockchain)

In a terminal, start Ganache:

```bash
npm run ganache
```

**Keep this running!** You'll see 10 test accounts with their addresses and private keys.

Example output:
```
Available Accounts
==================
(0) 0x1234...5678 (100 ETH)
(1) 0xabcd...efgh (100 ETH)
...

Private Keys
==================
(0) 0xabc123...
(1) 0xdef456...
```

### 2. Deploy Contracts to Ganache

In a new terminal:

```bash
truffle migrate --reset
```

**IMPORTANT**: Copy the deployed contract addresses from the output:

```
2_deploy_contracts.js
=====================
   Deploying 'EventTicket'
   ------------------------
   > contract address:    0x1234567890abcdef...  <-- COPY THIS

   Deploying 'TicketMarketplace'
   -----------------------------
   > contract address:    0xfedcba0987654321...  <-- COPY THIS
```

### 3. Update Contract Addresses in Frontend

Open `frontend/blockchain/src/context/Web3Context.jsx` and update the Ganache contract addresses:

```javascript
const CONTRACTS = {
  ganache: {
    eventTicket: '0xYOUR_EVENT_TICKET_ADDRESS',  // <-- Paste here
    marketplace: '0xYOUR_MARKETPLACE_ADDRESS',   // <-- Paste here
  },
  sepolia: {
    eventTicket: null,
    marketplace: null,
  }
};
```

### 4. Import Ganache Account to MetaMask

1. Open MetaMask
2. Click the account icon → "Import Account"
3. Paste a private key from Ganache (from step 1)
4. Name it "Ganache Test 1"
5. Repeat for 2-3 more accounts for testing

### 5. Add Ganache Network to MetaMask

1. Open MetaMask → Networks → "Add Network"
2. Add network manually:
   - **Network Name**: Ganache Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Save and switch to this network

### 6. Start Frontend

```bash
cd frontend/blockchain
npm install  # if not done already
npm run dev
```

Open http://localhost:5173 (or the URL shown in terminal)

## Manual Testing Workflow

### Phase 1: Connect Wallet

1. **Open the frontend** in your browser
2. **Click "Connect Wallet"** button
3. **MetaMask popup** should appear
4. **Select the Ganache account** you imported
5. **Click "Connect"**
6. **Verify**: Your address should appear (e.g., "0x1234...5678")

**Expected Result**: ✅ Wallet connected, address displayed

---

### Phase 2: View Event Details

Open browser console (F12) and run:

```javascript
// This should show event information
console.log('Testing event details...');
```

In your app, you should see:
- Event name: "Rock Concert 2025"
- Event date: "2025-06-15"
- Ticket price: 0.1 ETH
- Available tickets: 100

**Expected Result**: ✅ Event details displayed correctly

---

### Phase 3: Buy a Ticket (Primary Sale)

1. **Find "Buy Ticket" button** in the concerts page
2. **Enter seat number**: "A-101"
3. **Click "Buy Ticket"**
4. **MetaMask popup**: Review transaction
   - Should show 0.1 ETH payment
   - Gas fees shown
5. **Click "Confirm"**
6. **Wait for confirmation** (few seconds on Ganache)

**Expected Result**:
✅ Transaction confirmed
✅ You own ticket #0 with seat A-101
✅ Your ETH balance decreased by ~0.1 ETH + gas

**Check in Console**:
```javascript
// Get your tickets
await window.ethereum.request({ method: 'eth_accounts' })
// Should show your address owns token 0
```

---

### Phase 4: List Ticket for Resale

1. **Go to Profile Page** or "My Tickets"
2. **Find your ticket** (A-101)
3. **Click "Sell Ticket"**
4. **Enter listing price**: "0.15" (ETH)
5. **Step 1 - Approve**: Click "Approve Transfer"
   - MetaMask popup appears
   - This allows marketplace to transfer your ticket
   - Click "Confirm"
6. **Wait for approval confirmation**
7. **Step 2 - List**: Click "List for Sale"
   - MetaMask popup appears
   - No ETH payment, just gas
   - Click "Confirm"
8. **Wait for listing confirmation**

**Expected Result**:
✅ Ticket approved for transfer
✅ Ticket listed on marketplace
✅ Listing appears with price 0.15 ETH

**Console Check**:
```javascript
// Check listing
// Should show listingId: 0, price: 0.15 ETH, active: true
```

---

### Phase 5: Buy from Marketplace (Resale)

1. **Switch to a different MetaMask account**
   - Click MetaMask icon
   - Select another imported Ganache account
2. **Refresh the page** (to reconnect with new account)
3. **Go to Marketplace** or "Browse Listings"
4. **Find the listing** (Seat A-101, 0.15 ETH)
5. **Click "Buy"**
6. **MetaMask popup**: Review transaction
   - Should show 0.15 ETH payment
   - Gas fees shown
7. **Click "Confirm"**
8. **Wait for confirmation**

**Expected Result**:
✅ Transaction confirmed
✅ New account owns the ticket
✅ Original seller received 0.15 ETH
✅ Listing is now inactive

**Verify Ownership Transfer**:
- New account: Should see ticket in "My Tickets"
- Original account: Ticket should be gone, ETH balance increased

---

### Phase 6: Cancel a Listing

1. **With the seller account**, create another listing
2. **Go to your listings**
3. **Click "Cancel Listing"**
4. **Confirm in MetaMask**

**Expected Result**:
✅ Listing cancelled
✅ Ticket still in your wallet
✅ Listing marked as inactive

---

## Testing Checklist

Use this checklist to verify all functionality:

### Wallet Connection
- [ ] MetaMask connects successfully
- [ ] Account address displays
- [ ] Network name shows (Ganache Local)
- [ ] Switch accounts works
- [ ] Disconnect works

### View Events
- [ ] Event name displays
- [ ] Event date displays
- [ ] Ticket price shows correctly
- [ ] Available tickets count accurate

### Buy Tickets (Primary)
- [ ] Can enter seat number
- [ ] Price displayed correctly (0.1 ETH)
- [ ] MetaMask popup appears
- [ ] Transaction completes
- [ ] Ticket appears in "My Tickets"
- [ ] Balance decreases correctly

### List for Resale
- [ ] Owned tickets display
- [ ] Can enter listing price
- [ ] Approve transaction works
- [ ] Approve confirmation shows
- [ ] List transaction works
- [ ] Listing appears in marketplace

### Buy from Marketplace
- [ ] Active listings display
- [ ] Listing details correct (price, seat)
- [ ] Can buy with different account
- [ ] Payment amount correct
- [ ] Ownership transfers
- [ ] Seller receives payment
- [ ] Listing becomes inactive

### Cancel Listing
- [ ] Can cancel own listing
- [ ] Cannot cancel others' listings
- [ ] Ticket stays in wallet
- [ ] Listing marked inactive

### Error Handling
- [ ] Insufficient funds error shows
- [ ] User rejection handled gracefully
- [ ] Wrong network warning appears
- [ ] Contract not deployed message (if applicable)

---

## Common Issues & Solutions

### "Contract not deployed" or addresses null
**Solution**: Make sure you updated the contract addresses in `Web3Context.jsx` after deploying

### MetaMask not connecting
**Solution**:
- Check you're on Ganache Local network in MetaMask
- Make sure Ganache is running
- Try refreshing the page

### "Insufficient funds" error
**Solution**:
- Check account has enough ETH (should have ~100 ETH in Ganache)
- If running low, restart Ganache and reimport accounts

### Transaction fails silently
**Solution**:
- Open browser console (F12) to see errors
- Check Ganache terminal for revert reasons
- Verify contract is approved before listing

### Tickets not showing after purchase
**Solution**:
- Wallet for transaction confirmation
- Check correct account is selected in MetaMask
- Refresh the page

---

## Testing for Sepolia (Testnet)

When ready to test on Sepolia:

### 1. Deploy to Sepolia

Update your `.env` file (create if doesn't exist):
```
MNEMONIC="your twelve word mnemonic here"
INFURA_KEY="your infura project id"
```

Deploy:
```bash
truffle migrate --network sepolia
```

### 2. Update Contract Addresses

Update `Web3Context.jsx` with Sepolia addresses:
```javascript
sepolia: {
  eventTicket: '0xYOUR_SEPOLIA_EVENT_TICKET',
  marketplace: '0xYOUR_SEPOLIA_MARKETPLACE',
}
```

### 3. Get Sepolia ETH

Get free testnet ETH from:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia

### 4. Switch Network in MetaMask

1. MetaMask → Networks → "Sepolia test network"
2. Refresh your frontend
3. Follow same testing steps as Ganache

---

## Debugging Tips

### View Contract State
Open browser console:

```javascript
// Get Web3 context (if you expose it)
const { contracts, account } = useWeb3();

// Check event details
await contracts.eventTicket.eventName();
await contracts.eventTicket.ticketPrice();

// Check your balance
await contracts.provider.getBalance(account);

// Check ticket owner
await contracts.eventTicket.ownerOf(0);

// Check listing
await contracts.marketplace.listings(0);
```

### Check MetaMask Activity
1. Open MetaMask
2. Click "Activity" tab
3. View transaction history and status

### Monitor Ganache
Watch the Ganache terminal for:
- Transaction receipts
- Gas used
- Block numbers
- Any revert reasons

---

## Next Steps After Testing

Once manual testing is complete:

1. ✅ **Frontend Integration**: Connect all UI components to contract functions
2. ✅ **Error Handling**: Add user-friendly error messages
3. ✅ **Loading States**: Show spinners during transactions
4. ✅ **Event Listeners**: Listen for contract events to update UI
5. ✅ **Deploy to Sepolia**: Test on real testnet
6. ✅ **Mainnet**: Only after extensive testing!

---

## Quick Reference

### Contract Functions Used in Frontend

**EventTicket**:
- `mintTicket(to, seat)` - Buy ticket
- `getTicketInfo(tokenId)` - Get ticket details
- `approve(marketplace, tokenId)` - Approve transfer
- `ownerOf(tokenId)` - Check ownership

**TicketMarketplace**:
- `listTicket(ticketContract, tokenId, price)` - List for sale
- `buyTicket(listingId)` - Buy from marketplace
- `cancelListing(listingId)` - Cancel listing
- `listings(listingId)` - Get listing details

---

Happy Testing! 🎫
