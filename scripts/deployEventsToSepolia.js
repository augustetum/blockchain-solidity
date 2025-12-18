const EventTicket = artifacts.require("EventTicket");
const TicketMarketplace = artifacts.require("TicketMarketplace");

module.exports = async function(callback) {
  try {
    const network = await web3.eth.net.getNetworkType();
    const isLocal = network === 'development' || network === 'ganache';
    
    console.log(`🚀 Starting deployment to ${isLocal ? 'Ganache (local)' : 'Sepolia'}...`);
    
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    console.log("Using account:", owner);

    // Deploy or use existing marketplace
    let marketplace;
    const existingMarketplace = isLocal ? null : process.env.SEPOLIA_MARKETPLACE;
    
    if (existingMarketplace) {
      console.log("Using existing marketplace at:", existingMarketplace);
      marketplace = await TicketMarketplace.at(existingMarketplace);
    } else {
      console.log("Deploying new marketplace...");
      marketplace = await TicketMarketplace.new();
      console.log("✅ Marketplace deployed at:", marketplace.address);
    }

    // Event configurations
    const events = [
      { 
        name: "Jessica Shy | Vingio Parkas", 
        date: "2024-06-15",
        symbol: "JSVP", 
        maxSupply: 1000,
        ticketPrice: isLocal ? '0' : web3.utils.toWei("0.1", "ether"),
        tickets: [
          { seat: "VIP-A-15" },
          { seat: "VIP-A-16" },
          { seat: "Section-B-23" }
        ]
      },
      {
        name: "Vaidas Baumila | Žalgirio arena",
        date: "2024-07-20",
        symbol: "VBZA",
        maxSupply: 5000,
        ticketPrice: isLocal ? '0' : web3.utils.toWei("0.08", "ether"),
        tickets: [
          { seat: "Floor-A-12" },
          { seat: "Balcony-B-8" }
        ]
      }
    ];

    const deployedEvents = [];

    for (const event of events) {
      console.log(`\n🎫 Deploying: ${event.name}...`);
      
      const eventContract = await EventTicket.new(
        event.name,
        event.date,
        event.ticketPrice,
        event.maxSupply
      );
      console.log(`✅ Event deployed at: ${eventContract.address}`);
      
      await eventContract.setApprovalForAll(marketplace.address, true, { from: owner });
      console.log("✅ Approved marketplace to manage tickets");

      console.log(`Minting ${event.tickets.length} tickets...`);
      for (const ticket of event.tickets) {
        const tx = await eventContract.mintTicket(
          owner,
          ticket.seat,
          { 
            from: owner,
            value: event.ticketPrice
          }
        );
        console.log(`✓ Minted ${ticket.seat} (tx: ${tx.tx})`);
      }

      deployedEvents.push({
        name: event.name,
        address: eventContract.address,
        symbol: event.symbol
      });
    }

    console.log("\n===================");
    console.log("🏁 Deployment Complete!");
    console.log("Network:", isLocal ? 'Ganache (local)' : 'Sepolia');
    console.log("Marketplace:", marketplace.address);
    console.log("\nDeployed Events:");
    deployedEvents.forEach((event, i) => {
      console.log(`\n${i + 1}. ${event.name}`);
      console.log(`   Address: ${event.address}`);
      console.log(`   Symbol: ${event.symbol}`);
    });

    console.log("\nDone! Add these to your frontend config.");
    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};