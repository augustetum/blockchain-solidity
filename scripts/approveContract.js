// Script to approve an EventTicket contract on the TicketMarketplace
const { ethers } = require('ethers');
require('dotenv').config();

// Contract addresses
const MARKETPLACE_ADDRESS = '0x2aFD75454DBcA7CEbf8a2Cc63D124e3C02167870';
const EVENT_TICKET_ADDRESS = '0xe5f8062b11bba89ec6b35e958ef669686269cd3c';

// ABI for the marketplace contract (only need the approveContract function)
const MARKETPLACE_ABI = [
  "function approveContract(address _ticketContract) external"
];

async function main() {
  // Connect to the network
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC, provider);

  console.log('Using account:', wallet.address);
  console.log('Network:', (await provider.getNetwork()).name);

  // Connect to the marketplace contract
  const marketplace = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MARKETPLACE_ABI,
    wallet
  );

  console.log('Approving EventTicket contract on marketplace...');
  
  try {
    const tx = await marketplace.approveContract(EVENT_TICKET_ADDRESS);
    console.log('Transaction sent, waiting for confirmation...');
    const receipt = await tx.wait();
    
    console.log('✅ Success! Transaction hash:', receipt.hash);
    console.log('EventTicket contract has been approved on the marketplace');
  } catch (error) {
    console.error('❌ Error:', error.reason || error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });