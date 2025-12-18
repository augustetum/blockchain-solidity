const Web3 = require('web3');
const EventTicketABI = require('../build/contracts/EventTicket.json').abi;

async function checkTicket() {
  const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
  const contractAddress = '0xe5F8062b11BBa89eC6b35e958EF669686269cD3c';
  const ownerAddress = '0xaC7c5509121196A5B06dAD9543cAAa20C68FA3f3';
  const contract = new web3.eth.Contract(EventTicketABI, contractAddress);

  try {
    // Check owner of token ID 0
    const owner = await contract.methods.ownerOf(0).call();
    console.log('Owner of token 0:', owner);

    // Get ticket info
    const [eventName, date, seat] = await contract.methods.getTicketInfo(0).call();
    console.log('Ticket Info:');
    console.log('- Event:', eventName);
    console.log('- Date:', date);
    console.log('- Seat:', seat);
    console.log('- Owner:', owner);
  } catch (error) {
    console.error('Error checking ticket:', error.message);
  }
}

checkTicket();