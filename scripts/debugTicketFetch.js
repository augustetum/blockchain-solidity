const Web3 = require('web3');
const EventTicketABI = require('../build/contracts/EventTicket.json').abi;

async function debugTicketFetch() {
  const web3 = new Web3('https://rpc.sepolia.org');
  const contractAddress = '0xe5F8062b11BBa89eC6b35e958EF669686269cD3c';
  const ownerAddress = '0xaC7c5509121196A5B06dAD9543cAAa20C68FA3f3';
  const contract = new web3.eth.Contract(EventTicketABI, contractAddress);

  try {
    console.log('=== Debug: Fetching Tickets ===');
    console.log('Contract:', contractAddress);
    console.log('Owner:', ownerAddress);
    console.log('');

    // Step 1: Get total supply
    const totalSupply = await contract.methods.totalSupply().call();
    console.log('Total Supply:', totalSupply.toString());
    console.log('');

    // Step 2: Check each token
    const tickets = [];
    for (let i = 0; i < totalSupply; i++) {
      try {
        const owner = await contract.methods.ownerOf(i).call();
        console.log(`Token ${i}:`);
        console.log(`  Owner: ${owner}`);
        console.log(`  Match: ${owner.toLowerCase() === ownerAddress.toLowerCase()}`);
        
        if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
          const info = await contract.methods.getTicketInfo(i).call();
          console.log(`  Event: ${info[0]}`);
          console.log(`  Date: ${info[1]}`);
          console.log(`  Seat: ${info[2]}`);
          
          tickets.push({
            tokenId: i,
            eventName: info[0],
            eventDate: info[1],
            seatNumber: info[2],
            owner: info[3]
          });
        }
        console.log('');
      } catch (error) {
        console.log(`Token ${i}: Error - ${error.message}`);
        console.log('');
      }
    }

    console.log('=== Results ===');
    console.log(`Found ${tickets.length} ticket(s) owned by ${ownerAddress}`);
    console.log('');
    tickets.forEach((ticket, index) => {
      console.log(`Ticket ${index + 1}:`);
      console.log(JSON.stringify(ticket, null, 2));
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugTicketFetch();
