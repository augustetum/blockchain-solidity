const EventTicket = artifacts.require("EventTicket");
const TicketMarketplace = artifacts.require("TicketMarketplace");

module.exports = async function(callback) {
  try {
    console.log("\n========== Checking Deployed Contracts ==========\n");

    // Get marketplace
    const marketplace = await TicketMarketplace.deployed();
    console.log("Marketplace Address:", marketplace.address);

    // Try to find all EventTicket contracts
    // Note: Since we deploy multiple instances, we need to check the deployment artifacts
    const fs = require('fs');
    const path = require('path');

    const buildDir = path.join(__dirname, '..', 'build', 'contracts');
    const eventTicketArtifact = path.join(buildDir, 'EventTicket.json');

    if (fs.existsSync(eventTicketArtifact)) {
      const artifact = JSON.parse(fs.readFileSync(eventTicketArtifact, 'utf8'));
      const networkId = await web3.eth.net.getId();
      const networks = artifact.networks;

      if (networks && networks[networkId]) {
        console.log("\nFound EventTicket deployment at:", networks[networkId].address);
        console.log("Note: This shows only the last deployed instance.");
        console.log("Run 'truffle exec scripts/deployEventsAndMintTickets.js' to see all deployed contracts.");
      }
    }

    console.log("\n========== Quick Copy Format ==========\n");
    console.log("marketplace: '" + marketplace.address + "',");
    console.log("eventTickets: [");
    console.log("  // Paste addresses from deployEventsAndMintTickets.js output here");
    console.log("  // { name: 'Jessica Shy | Vingio Parkas', address: '0x...' },");
    console.log("  // { name: 'Vaidas Baumila | Žalgirio arena', address: '0x...' },");
    console.log("  // etc.");
    console.log("]");

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
