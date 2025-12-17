const EventTicket = artifacts.require("EventTicket");
const TicketMarketplace = artifacts.require("TicketMarketplace");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const eventTicket = await EventTicket.deployed();
    const marketplace = await TicketMarketplace.deployed();

    console.log("Setting up marketplace...");
    console.log("EventTicket:", eventTicket.address);
    console.log("Marketplace:", marketplace.address);
    console.log("Owner:", accounts[0]);

    // Approve the EventTicket contract on the marketplace
    console.log("\nApproving EventTicket contract on marketplace...");
    const tx = await marketplace.approveContract(eventTicket.address, { from: accounts[0] });
    console.log("✓ Approved! Transaction:", tx.tx);

    // Verify
    const isApproved = await marketplace.approvedContracts(eventTicket.address);
    console.log("\nVerification:");
    console.log("Is EventTicket approved?", isApproved);

    console.log("\n✅ Marketplace setup complete!");

    callback();
  } catch (error) {
    console.error("Error setting up marketplace:", error);
    callback(error);
  }
};
