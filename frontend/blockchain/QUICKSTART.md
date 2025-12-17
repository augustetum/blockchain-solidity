# Quick Start - Testing Your Ticket Marketplace

## Step 1: Deploy Contracts to Ganache

1. Start Ganache:
```bash
npm run ganache
```

2. In another terminal, deploy contracts:
```bash
truffle migrate --reset
```

3. Copy the deployed contract addresses from the output

## Step 2: Update Contract Addresses

Edit `frontend/blockchain/src/context/Web3Context.jsx`:

Find this section:
```javascript
const CONTRACTS = {
  ganache: {
    eventTicket: null,  // <-- Paste your EventTicket address here
    marketplace: null,   // <-- Paste your TicketMarketplace address here
  },
```

Replace with your addresses:
```javascript
const CONTRACTS = {
  ganache: {
    eventTicket: '0xYOUR_EVENT_TICKET_ADDRESS',
    marketplace: '0xYOUR_MARKETPLACE_ADDRESS',
  },
```

## Step 3: Import Ganache Account to MetaMask

1. Copy a private key from Ganache terminal output
2. MetaMask → Account Icon → Import Account
3. Paste the private key
4. Name it "Ganache Test"

## Step 4: Add Ganache Network to MetaMask

1. MetaMask → Networks → Add Network
2. Fill in:
   - Network Name: `Ganache Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
3. Save and switch to this network

## Step 5: Start Frontend

```bash
cd frontend/blockchain
npm run dev
```

## Step 6: Test!

1. Open http://localhost:5173
2. Click "Connect Wallet" in the nav bar
3. Start testing!

See [FRONTEND_TESTING_GUIDE.md](../../FRONTEND_TESTING_GUIDE.md) for detailed testing workflows.
